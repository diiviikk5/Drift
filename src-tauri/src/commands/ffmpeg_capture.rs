//! Screen capture on macOS and Linux through ffmpeg: AVFoundation on macOS,
//! x11grab on Linux (X11 sessions). The picture goes straight into screen.mp4;
//! cursor, clicks and timing come from Drift's own telemetry, as on Windows.
//!
//! Input timestamps are wall-clock (`-use_wallclock_as_timestamps`), so the
//! "start:" ffmpeg prints for the input is the moment the first frame was read.
//! That instant lines the video up with the telemetry and audio clocks.

use parking_lot::Mutex;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::process::{Child, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use crate::commands::display::DisplayInfo;
use crate::commands::export::{find_ffmpeg, quiet_command};

pub struct FfmpegCapture {
    child: Child,
}

#[cfg(target_os = "macos")]
#[link(name = "CoreGraphics", kind = "framework")]
extern "C" {
    fn CGPreflightScreenCaptureAccess() -> bool;
    fn CGRequestScreenCaptureAccess() -> bool;
}

#[cfg(target_os = "linux")]
fn is_wayland() -> bool {
    std::env::var("XDG_SESSION_TYPE").map(|v| v.eq_ignore_ascii_case("wayland")).unwrap_or(false)
}

/// Check everything capture needs; returns the ffmpeg to run.
pub fn prepare() -> Result<PathBuf, String> {
    #[cfg(target_os = "linux")]
    if is_wayland() {
        return Err("Drift records X11 sessions on Linux for now. Log out, pick the Xorg/X11 session on the login screen (e.g. \"Ubuntu on Xorg\"), then record again.".into());
    }
    #[cfg(target_os = "macos")]
    if !unsafe { CGPreflightScreenCaptureAccess() } {
        // Shows the system prompt the first time; the grant applies after a restart.
        let _ = unsafe { CGRequestScreenCaptureAccess() };
        return Err("Drift needs Screen Recording permission. Turn on Drift Recorder in System Settings > Privacy & Security > Screen & System Audio Recording, then quit and reopen Drift.".into());
    }
    find_ffmpeg()
}

fn s(v: impl ToString) -> String {
    v.to_string()
}

/// ffmpeg input arguments that read display `d` (`index` in `displays()` order).
fn input_args(d: &DisplayInfo, index: usize, fps: u32, cursor: bool) -> Vec<String> {
    #[cfg(target_os = "macos")]
    {
        // AVFoundation lists screens in CGGetActiveDisplayList order, the same
        // order the windowing layer reports monitors in.
        let _ = d;
        vec![
            s("-f"), s("avfoundation"),
            s("-framerate"), s(fps),
            s("-pixel_format"), s("nv12"),
            s("-capture_cursor"), s(if cursor { 1 } else { 0 }),
            s("-capture_mouse_clicks"), s(0),
            s("-i"), format!("Capture screen {}:none", index),
        ]
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = index;
        let display = std::env::var("DISPLAY").unwrap_or_else(|_| ":0".into());
        vec![
            s("-f"), s("x11grab"),
            s("-draw_mouse"), s(if cursor { 1 } else { 0 }),
            s("-framerate"), s(fps),
            s("-video_size"), format!("{}x{}", d.width, d.height),
            s("-i"), format!("{}+{},{}", display, d.x, d.y),
        ]
    }
}

/// RGBA pixels of a display, scaled to fit within `max_width` (keeps aspect).
pub fn screenshot(d: &DisplayInfo, index: usize, max_width: u32) -> Result<(u32, u32, Vec<u8>), String> {
    prepare_screenshot()?;
    let ffmpeg = find_ffmpeg()?;
    let scale = (max_width as f64 / d.width.max(1) as f64).min(1.0);
    let w = ((d.width as f64 * scale).round() as u32).max(2);
    let h = ((d.height as f64 * scale).round() as u32).max(2);
    let mut cmd = quiet_command(&ffmpeg);
    cmd.args(["-hide_banner", "-loglevel", "error", "-nostdin"])
        .args(input_args(d, index, 30, true))
        .args(["-frames:v", "1", "-vf"])
        .arg(format!("scale={}:{}:flags=bicubic", w, h))
        .args(["-pix_fmt", "rgba", "-f", "rawvideo", "pipe:1"])
        .stdin(Stdio::null());
    let out = cmd.output().map_err(|e| format!("Could not run ffmpeg: {}", e))?;
    let need = (w * h * 4) as usize;
    if out.stdout.len() < need {
        let err = String::from_utf8_lossy(&out.stderr);
        return Err(format!("Screenshot failed: {}", err.trim()));
    }
    let mut px = out.stdout;
    px.truncate(need);
    Ok((w, h, px))
}

fn prepare_screenshot() -> Result<(), String> {
    #[cfg(target_os = "linux")]
    if is_wayland() {
        return Err("Screenshots need an X11 session on Linux".into());
    }
    #[cfg(target_os = "macos")]
    if !unsafe { CGPreflightScreenCaptureAccess() } {
        let _ = unsafe { CGRequestScreenCaptureAccess() };
        return Err("Screen Recording permission is needed".into());
    }
    Ok(())
}

fn has_encoder(ffmpeg: &Path, name: &str) -> bool {
    quiet_command(ffmpeg)
        .args(["-hide_banner", "-encoders"])
        .stdin(Stdio::null())
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).contains(name))
        .unwrap_or(false)
}

fn encoder_args(ffmpeg: &Path) -> Vec<String> {
    if cfg!(target_os = "macos") && has_encoder(ffmpeg, "h264_videotoolbox") {
        return vec![s("-c:v"), s("h264_videotoolbox"), s("-b:v"), s("20M"), s("-realtime"), s(1)];
    }
    vec![s("-c:v"), s("libx264"), s("-preset"), s("ultrafast"), s("-tune"), s("zerolatency"), s("-crf"), s(20)]
}

/// The moment ffmpeg's wall-clock `start` (seconds since the Unix epoch) was, as an Instant.
fn instant_from_epoch(secs: f64) -> Option<Instant> {
    let now_i = Instant::now();
    let now_e = SystemTime::now().duration_since(UNIX_EPOCH).ok()?.as_secs_f64();
    let ago = now_e - secs;
    if (0.0..30.0).contains(&ago) {
        now_i.checked_sub(Duration::from_secs_f64(ago))
    } else {
        None
    }
}

/// Start recording display `d` into `out` (H.264 MP4). Returns once the first
/// frame is in, or with ffmpeg's error if it could not start.
#[allow(clippy::too_many_arguments)]
pub fn start(
    ffmpeg: &Path,
    d: &DisplayInfo,
    index: usize,
    fps: u32,
    width: u32,
    height: u32,
    cursor: bool,
    out: &Path,
    frame_counter: Arc<AtomicU64>,
    first_frame_at: Arc<Mutex<Option<Instant>>>,
) -> Result<FfmpegCapture, String> {
    let mut cmd = quiet_command(ffmpeg);
    cmd.args(["-hide_banner", "-loglevel", "info", "-thread_queue_size", "1024", "-use_wallclock_as_timestamps", "1"])
        .args(input_args(d, index, fps, cursor))
        .arg("-vf")
        .arg(format!("scale={}:{}:flags=bicubic", width, height))
        .args(["-r", &fps.to_string(), "-pix_fmt", "yuv420p"])
        .args(encoder_args(ffmpeg))
        .args(["-an", "-y"])
        .arg(out)
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::piped());
    log::info!("[ffmpeg-capture] {:?}", cmd);
    let mut child = cmd.spawn().map_err(|e| format!("Could not start ffmpeg: {}", e))?;

    let tail: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
    if let Some(mut err) = child.stderr.take() {
        let tail = tail.clone();
        let frames = frame_counter.clone();
        let first = first_frame_at.clone();
        std::thread::spawn(move || {
            let mut buf = [0u8; 4096];
            let mut line: Vec<u8> = Vec::new();
            let handle = |line: &[u8]| {
                let text = String::from_utf8_lossy(line).trim().to_string();
                if text.is_empty() {
                    return;
                }
                if let Some(rest) = text.strip_prefix("frame=") {
                    if let Some(n) = rest.split_whitespace().next().and_then(|v| v.parse::<u64>().ok()) {
                        frames.store(n, Ordering::Relaxed);
                    }
                    let mut f = first.lock();
                    if f.is_none() {
                        *f = Some(Instant::now());
                    }
                    return;
                }
                if text.starts_with("Duration:") {
                    if let Some(at) = text
                        .split("start: ")
                        .nth(1)
                        .and_then(|v| v.split(',').next())
                        .and_then(|v| v.trim().parse::<f64>().ok())
                        .and_then(instant_from_epoch)
                    {
                        let mut f = first.lock();
                        if f.is_none() {
                            *f = Some(at);
                        }
                    }
                }
                let mut t = tail.lock();
                t.push(text);
                if t.len() > 40 {
                    t.remove(0);
                }
            };
            loop {
                let n = match err.read(&mut buf) {
                    Ok(0) | Err(_) => break,
                    Ok(n) => n,
                };
                for &b in &buf[..n] {
                    if b == b'\n' || b == b'\r' {
                        handle(&line);
                        line.clear();
                    } else {
                        line.push(b);
                    }
                }
            }
            handle(&line);
        });
    }

    // Wait for the first frame so a failure (permission, bad device) is reported now.
    let deadline = Instant::now() + Duration::from_secs(10);
    loop {
        if first_frame_at.lock().is_some() {
            break;
        }
        match child.try_wait() {
            Ok(Some(status)) => {
                std::thread::sleep(Duration::from_millis(100));
                let t = tail.lock();
                let detail = t.iter().rev().take(4).rev().cloned().collect::<Vec<_>>().join(" | ");
                return Err(format!("Screen capture stopped at start ({}): {}", status, detail));
            }
            Ok(None) => {}
            Err(e) => return Err(format!("Screen capture failed: {}", e)),
        }
        if Instant::now() > deadline {
            log::warn!("[ffmpeg-capture] no frame after 10 s, continuing");
            break;
        }
        std::thread::sleep(Duration::from_millis(20));
    }
    Ok(FfmpegCapture { child })
}

/// Stop recording and wait for ffmpeg to finish writing the file.
pub fn stop(mut cap: FfmpegCapture) {
    if let Some(mut stdin) = cap.child.stdin.take() {
        let _ = stdin.write_all(b"q");
        let _ = stdin.flush();
    }
    let deadline = Instant::now() + Duration::from_secs(20);
    loop {
        match cap.child.try_wait() {
            Ok(Some(_)) => break,
            Ok(None) if Instant::now() < deadline => std::thread::sleep(Duration::from_millis(50)),
            _ => {
                log::warn!("[ffmpeg-capture] ffmpeg did not exit, killing it");
                let _ = cap.child.kill();
                let _ = cap.child.wait();
                break;
            }
        }
    }
}
