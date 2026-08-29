use serde::{Deserialize, Serialize};
use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::{command, AppHandle, Emitter, Manager};

use super::native_capture::{DiskFrameReader, NativeRecorderState};
use super::compositor::{
    GpuCompositor, CompositeConfig, BackgroundConfig, ZoomState, CursorState,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportConfig {
    pub output_path: String,
    pub fps: u32,
    pub width: u32,
    pub height: u32,
    pub crf: u32,
    pub preset: String,
    pub use_hw_accel: bool,
}

impl Default for ExportConfig {
    fn default() -> Self {
        Self {
            output_path: String::new(),
            fps: 60,
            width: 1920,
            height: 1080,
            crf: 18,
            preset: "medium".to_string(),
            use_hw_accel: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZoomKeyframe {
    pub time_ms: f64,
    pub x: f32,
    pub y: f32,
    pub scale: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorKeyframe {
    pub time_ms: f64,
    pub x: f32,
    pub y: f32,
    pub click: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct ExportResult {
    pub output_path: String,
    pub file_size_bytes: u64,
    pub duration_ms: f64,
    pub frames_encoded: u64,
    pub encoder_used: String,
}

#[derive(Debug, Clone)]
pub struct EncoderConfig {
    pub codec: String,
    pub extra_args: Vec<String>,
}

pub fn find_ffmpeg() -> Result<PathBuf, String> {
    let mut locations = vec![
        PathBuf::from("ffmpeg"),
        PathBuf::from("ffmpeg.exe"),
        PathBuf::from(r"C:\ffmpeg\bin\ffmpeg.exe"),
        PathBuf::from(r"C:\Program Files\ffmpeg\bin\ffmpeg.exe"),
        PathBuf::from(r"C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe"),
        PathBuf::from(r"C:\ProgramData\chocolatey\bin\ffmpeg.exe"),
    ];

    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
        locations.push(PathBuf::from(&local_app_data).join(r"Microsoft\WinGet\Links\ffmpeg.exe"));
    }

    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    if let Some(parent) = manifest_dir.parent() {
        locations.push(parent.join("node_modules").join("ffmpeg-static").join("ffmpeg.exe"));
        locations.push(parent.join("node_modules").join("ffmpeg-static").join("ffmpeg"));
    }
    locations.push(manifest_dir.join("bin").join("ffmpeg.exe"));

    for loc in &locations {
        if let Ok(output) = Command::new(loc).arg("-version").output() {
            if output.status.success() {
                log::info!("[Drift] Using FFmpeg at: {:?}", loc);
                return Ok(loc.clone());
            }
        }
    }

    Err("FFmpeg executable not found. Please install FFmpeg or add it to PATH.".to_string())
}

pub fn detect_encoder(ffmpeg: &PathBuf, use_hw: bool) -> EncoderConfig {
    if !use_hw {
        return EncoderConfig {
            codec: "libx264".to_string(),
            extra_args: vec!["-preset".into(), "ultrafast".into(), "-tune".into(), "fastdecode".into()],
        };
    }

    let hw_candidates = [
        ("h264_nvenc", vec!["-preset".into(), "p4".into(), "-tune".into(), "hq".into(), "-rc".into(), "vbr".into(), "-cq".into(), "19".into()]),
        ("h264_qsv", vec!["-preset".into(), "veryfast".into(), "-global_quality".into(), "20".into()]),
        ("h264_amf", vec!["-quality".into(), "speed".into(), "-rc".into(), "cbr".into()]),
        ("h264_mf", vec!["-ratecontrol".into(), "cbr".into()]),
    ];

    for (encoder, extra) in &hw_candidates {
        if let Ok(output) = Command::new(ffmpeg)
            .args(["-f", "lavfi", "-i", "color=c=black:s=64x64:d=0.1",
                   "-c:v", encoder, "-f", "null", "-y", "NUL"])
            .output()
        {
            if output.status.success() {
                log::info!("[Drift] Hardware acceleration active: {}", encoder);
                return EncoderConfig {
                    codec: encoder.to_string(),
                    extra_args: extra.clone(),
                };
            }
        }
    }

    log::info!("[Drift] Hardware encoder unavailable, falling back to libx264 ultrafast");
    EncoderConfig {
        codec: "libx264".to_string(),
        extra_args: vec!["-preset".into(), "ultrafast".into(), "-tune".into(), "fastdecode".into()],
    }
}

fn interpolate_zoom_at(keyframes: &[ZoomKeyframe], time_ms: f64) -> ZoomState {
    if keyframes.is_empty() {
        return ZoomState::default();
    }

    let idx = keyframes.partition_point(|k| k.time_ms <= time_ms);

    if idx == 0 {
        let k = &keyframes[0];
        return ZoomState { x: k.x, y: k.y, scale: k.scale };
    }
    if idx >= keyframes.len() {
        let k = keyframes.last().unwrap();
        return ZoomState { x: k.x, y: k.y, scale: k.scale };
    }

    let a = &keyframes[idx - 1];
    let b = &keyframes[idx];
    let t = ((time_ms - a.time_ms) / (b.time_ms - a.time_ms).max(1.0)) as f32;

    let t2 = t * t;
    let t3 = t2 * t;
    let s = 3.0 * t2 - 2.0 * t3;

    ZoomState {
        x: a.x + (b.x - a.x) * s,
        y: a.y + (b.y - a.y) * s,
        scale: a.scale + (b.scale - a.scale) * s,
    }
}

fn interpolate_cursor_at(keyframes: &[CursorKeyframe], time_ms: f64) -> CursorState {
    if keyframes.is_empty() {
        return CursorState::default();
    }

    let idx = keyframes.partition_point(|k| k.time_ms <= time_ms);

    if idx == 0 {
        let k = &keyframes[0];
        return CursorState {
            x: k.x, y: k.y, opacity: 1.0, size: 24.0,
            motion_blur: 0.0, velocity_x: 0.0, velocity_y: 0.0,
            click_progress: if k.click { 1.0 } else { 0.0 },
        };
    }
    if idx >= keyframes.len() {
        let k = keyframes.last().unwrap();
        return CursorState {
            x: k.x, y: k.y, opacity: 1.0, size: 24.0,
            motion_blur: 0.0, velocity_x: 0.0, velocity_y: 0.0,
            click_progress: 0.0,
        };
    }

    let a = &keyframes[idx - 1];
    let b = &keyframes[idx];
    let dt = (b.time_ms - a.time_ms).max(1.0) as f32;
    let t = ((time_ms - a.time_ms) / dt as f64) as f32;

    let vx = (b.x - a.x) / dt * 1000.0;
    let vy = (b.y - a.y) / dt * 1000.0;
    let speed = (vx * vx + vy * vy).sqrt();
    let motion_blur = (speed / 2000.0).min(1.0);

    CursorState {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        opacity: 1.0,
        size: 24.0,
        motion_blur,
        velocity_x: vx,
        velocity_y: vy,
        click_progress: if b.click { (1.0 - t).max(0.0) } else { 0.0 },
    }
}

#[command]
pub async fn export_native_session(
    app: AppHandle,
    config: ExportConfig,
    zoom_keyframes: Vec<ZoomKeyframe>,
    cursor_keyframes: Vec<CursorKeyframe>,
    background: Option<BackgroundConfig>,
    composite: Option<CompositeConfig>,
) -> Result<ExportResult, String> {
    let ffmpeg = find_ffmpeg()?;

    let state = app.state::<NativeRecorderState>();
    let session_info = {
        let active = state.active_session.lock();
        active.clone().ok_or_else(|| "No active recording session found on disk".to_string())?
    };

    let mut reader = DiskFrameReader::open(&session_info)?;
    let total_frames = reader.total_frames() as u64;

    if total_frames == 0 {
        return Err("Recorded session has 0 frames".to_string());
    }

    let composite_cfg = composite.unwrap_or_default();
    let bg_cfg = background.unwrap_or_default();
    let out_w = config.width.max(composite_cfg.output_width);
    let out_h = config.height.max(composite_cfg.output_height);
    let fps = config.fps.max(1);

    let mut compositor = GpuCompositor::new(out_w, out_h)
        .await
        .map_err(|e| format!("Failed to initialize GPU compositor: {}", e))?;

    let encoder = detect_encoder(&ffmpeg, config.use_hw_accel);
    let output_path = resolve_output_path(&config.output_path);

    if let Some(parent) = PathBuf::from(&output_path).parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    let _ = app.emit("export-progress", serde_json::json!({
        "stage": "compositing",
        "progress": 0.0,
        "encoder": &encoder.codec,
        "message": format!("Starting hardware GPU export with {}...", encoder.codec)
    }));

    let mut args = vec![
        "-y".to_string(),
        "-f".to_string(), "rawvideo".to_string(),
        "-pixel_format".to_string(), "rgba".to_string(),
        "-video_size".to_string(), format!("{}x{}", out_w, out_h),
        "-framerate".to_string(), fps.to_string(),
        "-i".to_string(), "pipe:0".to_string(),
        "-c:v".to_string(), encoder.codec.clone(),
        "-pix_fmt".to_string(), "yuv420p".to_string(),
    ];

    if encoder.codec == "libx264" {
        args.extend_from_slice(&[
            "-crf".to_string(), config.crf.min(51).to_string(),
            "-preset".to_string(), config.preset.clone(),
        ]);
    }

    args.extend(encoder.extra_args.iter().cloned());
    args.extend_from_slice(&[
        "-movflags".to_string(), "+faststart".to_string(),
        "-profile:v".to_string(), "high".to_string(),
        "-level".to_string(), "4.2".to_string(),
        output_path.clone(),
    ]);

    let mut child = Command::new(&ffmpeg)
        .args(&args)
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn FFmpeg process: {}", e))?;

    let mut stdin = child.stdin.take()
        .ok_or_else(|| "Failed to acquire FFmpeg stdin".to_string())?;

    let frame_duration_ms = 1000.0 / fps as f64;
    let mut encoded = 0u64;

    for i in 0..total_frames as usize {
        let (raw_rgba, frame_w, frame_h, timestamp_ms) = reader.read_frame(i)
            .map_err(|e| format!("Failed reading frame {} from disk: {}", i, e))?;

        let time_ms = if timestamp_ms > 0.0 { timestamp_ms } else { i as f64 * frame_duration_ms };

        let zoom = interpolate_zoom_at(&zoom_keyframes, time_ms);
        let cursor = interpolate_cursor_at(&cursor_keyframes, time_ms);

        let composited = compositor.composite_frame(
            &raw_rgba,
            frame_w,
            frame_h,
            &composite_cfg,
            &bg_cfg,
            &zoom,
            Some(&cursor),
            None,
            None,
        ).map_err(|e| format!("GPU composition failed at frame {}: {}", i, e))?;

        stdin.write_all(&composited)
            .map_err(|e| format!("Failed writing composited frame {} to FFmpeg: {}", i, e))?;
        encoded += 1;

        if i % 10 == 0 || i == (total_frames as usize - 1) {
            let progress = (i as f64 / total_frames as f64) * 100.0;
            let _ = app.emit("export-progress", serde_json::json!({
                "stage": "compositing",
                "progress": progress,
                "encoder": &encoder.codec,
                "message": format!("Rendered frame {}/{} (GPU Accel)", i + 1, total_frames)
            }));
        }
    }

    drop(stdin);

    let output = child.wait_with_output()
        .map_err(|e| format!("Failed waiting for FFmpeg: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("FFmpeg export encoding failed: {}", stderr));
    }

    let file_size = std::fs::metadata(&output_path).map(|m| m.len()).unwrap_or(0);
    let duration_ms = (total_frames as f64 / fps as f64) * 1000.0;

    let _ = app.emit("export-progress", serde_json::json!({
        "stage": "complete",
        "progress": 100.0,
        "message": "Export complete!",
        "output_path": &output_path,
        "encoder": &encoder.codec,
    }));

    Ok(ExportResult {
        output_path,
        file_size_bytes: file_size,
        duration_ms,
        frames_encoded: encoded,
        encoder_used: encoder.codec,
    })
}

#[command]
pub async fn export_composited_mp4(
    app: AppHandle,
    config: ExportConfig,
    zoom_keyframes: Vec<ZoomKeyframe>,
    cursor_keyframes: Vec<CursorKeyframe>,
    background: Option<BackgroundConfig>,
    composite: Option<CompositeConfig>,
) -> Result<ExportResult, String> {
    export_native_session(app, config, zoom_keyframes, cursor_keyframes, background, composite).await
}

#[command]
pub async fn export_mp4(
    app: AppHandle,
    config: ExportConfig,
) -> Result<ExportResult, String> {
    export_native_session(app, config, vec![], vec![], None, None).await
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConvertConfig {
    #[serde(default = "default_crf")]
    pub crf: u32,
    #[serde(default = "default_preset")]
    pub preset: String,
    #[serde(default = "default_fps")]
    pub fps: u32,
    #[serde(default)]
    pub use_hw_accel: bool,
    #[serde(default)]
    pub output_path: String,
}

fn default_crf() -> u32 { 18 }
fn default_preset() -> String { "ultrafast".to_string() }
fn default_fps() -> u32 { 60 }

impl Default for ConvertConfig {
    fn default() -> Self {
        Self {
            crf: 18,
            preset: "ultrafast".to_string(),
            fps: 60,
            use_hw_accel: true,
            output_path: String::new(),
        }
    }
}

#[command]
pub async fn convert_webm_file_to_mp4(
    app: AppHandle,
    input_file_path: String,
    config: Option<ConvertConfig>,
) -> Result<String, String> {
    let ffmpeg = find_ffmpeg()?;
    let cfg = config.unwrap_or_default();

    let input_path = PathBuf::from(&input_file_path);
    if !input_path.exists() {
        return Err(format!("Input file does not exist: {}", input_file_path));
    }

    let output_path = if cfg.output_path.is_empty() {
        resolve_output_path("")
    } else {
        cfg.output_path.clone()
    };

    if let Some(parent) = std::path::Path::new(&output_path).parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    let encoder = detect_encoder(&ffmpeg, cfg.use_hw_accel);

    let _ = app.emit("export-progress", serde_json::json!({
        "stage": "converting",
        "progress": 10.0,
        "encoder": &encoder.codec,
        "message": format!("Converting with hardware encoder: {}", encoder.codec)
    }));

    let mut args: Vec<String> = vec![
        "-y".into(),
        "-i".into(), input_path.to_string_lossy().to_string(),
        "-c:v".into(), encoder.codec.clone(),
        "-pix_fmt".into(), "yuv420p".into(),
    ];

    if encoder.codec == "libx264" {
        args.extend([
            "-crf".into(), cfg.crf.min(51).to_string(),
            "-preset".into(), cfg.preset.clone(),
        ]);
    }

    args.extend([
        "-c:a".into(), "aac".into(),
        "-b:a".into(), "192k".into(),
    ]);

    args.extend(encoder.extra_args.iter().cloned());
    args.extend([
        "-movflags".into(), "+faststart".into(),
        "-profile:v".into(), "high".into(),
        "-level".into(), "4.2".into(),
        output_path.clone(),
    ]);

    let app_clone = app.clone();
    let output_path_clone = output_path.clone();

    tokio::task::spawn_blocking(move || -> Result<String, String> {
        let output = Command::new(&ffmpeg)
            .args(&args)
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::piped())
            .output()
            .map_err(|e| format!("Failed to execute FFmpeg conversion: {}", e))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(format!("FFmpeg conversion failed: {}", stderr));
        }

        let _ = app_clone.emit("export-progress", serde_json::json!({
            "stage": "complete",
            "progress": 100.0,
            "message": "MP4 conversion complete!",
            "output_path": &output_path_clone,
        }));

        Ok(output_path_clone)
    })
    .await
    .map_err(|e| format!("Convert background task failed: {}", e))?
}

#[command]
pub async fn convert_webm_to_mp4(
    app: AppHandle,
    webm_data: Vec<u8>,
    config: Option<ConvertConfig>,
) -> Result<String, String> {
    if webm_data.is_empty() {
        return Err("No video data provided".to_string());
    }

    let temp_dir = std::env::temp_dir().join("drift_export");
    std::fs::create_dir_all(&temp_dir)
        .map_err(|e| format!("Failed creating temporary export directory: {}", e))?;

    let temp_input = temp_dir.join(format!("input_{}.webm", uuid::Uuid::new_v4().simple()));
    std::fs::write(&temp_input, &webm_data)
        .map_err(|e| format!("Failed writing temporary WebM file: {}", e))?;

    let res = convert_webm_file_to_mp4(app, temp_input.to_string_lossy().to_string(), config).await;
    let _ = std::fs::remove_file(&temp_input);
    res
}

fn resolve_output_path(path: &str) -> String {
    if path.is_empty() {
        let videos_dir = dirs_next::video_dir()
            .unwrap_or_else(|| std::env::temp_dir());
        let filename = format!("drift-recording-{}.mp4", chrono::Local::now().format("%Y%m%d-%H%M%S"));
        videos_dir.join(filename).to_string_lossy().to_string()
    } else {
        path.to_string()
    }
}

#[command]
pub async fn check_ffmpeg() -> Result<serde_json::Value, String> {
    let ffmpeg = find_ffmpeg()?;
    let output = Command::new(&ffmpeg)
        .arg("-version")
        .output()
        .map_err(|e| format!("Failed to run FFmpeg: {}", e))?;

    let version_raw = String::from_utf8_lossy(&output.stdout);
    let first_line = version_raw.lines().next().unwrap_or("unknown").to_string();
    let encoder = detect_encoder(&ffmpeg, true);

    Ok(serde_json::json!({
        "path": ffmpeg.to_string_lossy().to_string(),
        "version": first_line,
        "preferred_encoder": encoder.codec,
        "hardware_accelerated": encoder.codec != "libx264",
    }))
}

#[command]
pub async fn clear_frame_buffer(app: AppHandle) -> Result<(), String> {
    let state = app.state::<NativeRecorderState>();
    let active = state.active_session.lock().clone();
    if let Some(info) = active {
        let dir = PathBuf::from(info.directory);
        if dir.exists() {
            let _ = std::fs::remove_dir_all(dir);
        }
    }
    Ok(())
}

