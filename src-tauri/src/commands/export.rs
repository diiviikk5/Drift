//! WebM -> MP4 conversion through the system ffmpeg, used when the in-app
//! WebCodecs export had to fall back to WebM.

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::{command, AppHandle, Emitter};

/// A command that never flashes a console window on Windows.
fn quiet_command(program: impl AsRef<std::ffi::OsStr>) -> Command {
    let mut cmd = Command::new(program);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
    cmd
}

#[derive(Debug, Clone)]
struct EncoderConfig {
    codec: String,
    extra_args: Vec<String>,
}

fn find_ffmpeg() -> Result<PathBuf, String> {
    let mut candidates: Vec<PathBuf> = Vec::new();

    // 1. AppData Local Drift bin
    if let Some(local_dir) = dirs_next::data_local_dir() {
        candidates.push(local_dir.join("Drift").join("bin").join("ffmpeg.exe"));
    }

    // 2. Next to running drift.exe
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(parent) = exe_path.parent() {
            candidates.push(parent.join("ffmpeg.exe"));
            candidates.push(parent.join("bin").join("ffmpeg.exe"));
        }
    }

    // 3. User profile and VS Code extensions
    if let Ok(user_profile) = std::env::var("USERPROFILE") {
        let profile_dir = PathBuf::from(&user_profile);
        candidates.push(profile_dir.join(r".vscode\extensions\kilocode.kilo-code-7.5.15-win32-x64\bin\ffmpeg.exe"));
        candidates.push(profile_dir.join(r"AppData\Local\Drift\bin\ffmpeg.exe"));
        candidates.push(profile_dir.join(r"AppData\Local\Programs\ffmpeg\bin\ffmpeg.exe"));
    }

    // 4. Standard system locations
    candidates.push(PathBuf::from("ffmpeg"));
    candidates.push(PathBuf::from("ffmpeg.exe"));
    candidates.push(PathBuf::from(r"C:\ffmpeg\bin\ffmpeg.exe"));
    candidates.push(PathBuf::from(r"C:\Program Files\ffmpeg\bin\ffmpeg.exe"));

    for loc in &candidates {
        if loc.is_file() {
            return Ok(loc.clone());
        }
        if let Ok(output) = quiet_command(loc).arg("-version").output() {
            if output.status.success() {
                return Ok(loc.clone());
            }
        }
    }

    Err("ffmpeg not found. Please install ffmpeg or place ffmpeg.exe in %LOCALAPPDATA%\\Drift\\bin.".to_string())
}

/// Detect available hardware encoder, fallback to libx264
fn detect_encoder(ffmpeg: &PathBuf, use_hw: bool) -> EncoderConfig {
    if !use_hw {
        return EncoderConfig {
            codec: "libx264".to_string(),
            extra_args: vec![],
        };
    }

    // Try hardware encoders in preference order
    let hw_encoders = [
        ("h264_nvenc", vec!["-rc".to_string(), "vbr".to_string()]),          // NVIDIA
        ("h264_qsv", vec![]),                                                 // Intel QuickSync
        ("h264_amf", vec![]),                                                 // AMD AMF
        ("h264_mf", vec![]),                                                  // Windows Media Foundation
    ];

    for (encoder, extra) in &hw_encoders {
        if let Ok(output) = quiet_command(ffmpeg)
            .args(["-f", "lavfi", "-i", "color=c=black:s=64x64:d=0.1",
                   "-c:v", encoder, "-f", "null", "-"])
            .output()
        {
            if output.status.success() {
                log::info!("Using hardware encoder: {}", encoder);
                return EncoderConfig {
                    codec: encoder.to_string(),
                    extra_args: extra.clone(),
                };
            }
        }
    }

    log::info!("No hardware encoder found, using libx264");
    EncoderConfig {
        codec: "libx264".to_string(),
        extra_args: vec![],
    }
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
    /// If empty, auto-generates path in Videos folder
    #[serde(default)]
    pub output_path: String,
}

fn default_crf() -> u32 { 18 }
fn default_preset() -> String { "medium".to_string() }
fn default_fps() -> u32 { 60 }

impl Default for ConvertConfig {
    fn default() -> Self {
        Self {
            crf: 18,
            preset: "medium".to_string(),
            fps: 60,
            use_hw_accel: true,
            output_path: String::new(),
        }
    }
}

/// Accept raw WebM bytes from JS, write to temp, convert to MP4 via system ffmpeg,
/// return the output file path. This replaces the slow FFmpeg WASM approach.
#[command]
pub async fn convert_webm_to_mp4(
    app: AppHandle,
    webm_data: Vec<u8>,
    config: Option<ConvertConfig>,
) -> Result<String, String> {
    let ffmpeg = find_ffmpeg()?;
    let cfg = config.unwrap_or_default();

    if webm_data.is_empty() {
        return Err("No video data provided".to_string());
    }

    let _ = app.emit("export-progress", serde_json::json!({
        "stage": "converting",
        "progress": 0.0,
        "message": "Starting MP4 conversion..."
    }));

    // Write WebM to temp file
    let temp_dir = std::env::temp_dir().join("drift-export");
    std::fs::create_dir_all(&temp_dir)
        .map_err(|e| format!("Failed to create temp dir: {}", e))?;

    let input_path = temp_dir.join("input.webm");
    std::fs::write(&input_path, &webm_data)
        .map_err(|e| format!("Failed to write temp WebM: {}", e))?;

    // Determine output path
    let output_path = if cfg.output_path.is_empty() {
        resolve_output_path("")
    } else {
        cfg.output_path.clone()
    };

    if let Some(parent) = std::path::Path::new(&output_path).parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create output dir: {}", e))?;
    }

    let encoder = detect_encoder(&ffmpeg, cfg.use_hw_accel);

    let _ = app.emit("export-progress", serde_json::json!({
        "stage": "converting",
        "progress": 10.0,
        "message": format!("Converting with {} encoder...", encoder.codec)
    }));

    // Build ffmpeg command
    let mut args: Vec<String> = vec![
        "-y".into(),
        "-i".into(), input_path.to_string_lossy().to_string(),
        "-c:v".into(), encoder.codec.clone(),
        "-pix_fmt".into(), "yuv420p".into(),
    ];

    // Codec-specific settings
    if encoder.codec == "libx264" {
        args.extend([
            "-crf".into(), cfg.crf.min(51).to_string(),
            "-preset".into(), cfg.preset.clone(),
        ]);
    }

    // Audio: re-encode to AAC for MP4 compat
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

    log::info!("FFmpeg convert args: {:?}", args);

    let app_clone = app.clone();
    let output_path_clone = output_path.clone();
    let input_path_clone = input_path.clone();

    let result = tokio::task::spawn_blocking(move || -> Result<String, String> {
        let output = quiet_command(&ffmpeg)
            .args(&args)
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::piped())
            .output()
            .map_err(|e| format!("Failed to run ffmpeg: {}", e))?;

        // Clean up temp input
        let _ = std::fs::remove_file(&input_path_clone);

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(format!("FFmpeg conversion failed: {}", stderr));
        }

        let _ = app_clone.emit("export-progress", serde_json::json!({
            "stage": "complete",
            "progress": 100.0,
            "message": "Conversion complete!",
            "output_path": &output_path_clone,
        }));

        Ok(output_path_clone)
    })
    .await
    .map_err(|e| format!("Convert task failed: {}", e))?;

    result
}
