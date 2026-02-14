/// Native screen capture using Windows Graphics Capture API
/// This provides frame-perfect capture like Cap does (Direct3D based)
/// Falls back to xcap for screenshot mode

use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;
use parking_lot::Mutex;
use tauri::{command, AppHandle, Emitter, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureConfig {
    pub monitor_index: usize,
    pub fps: u32,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureFrame {
    pub width: u32,
    pub height: u32,
    pub timestamp_ms: f64,
    pub frame_number: u64,
    /// Base64-encoded RGBA pixel data
    pub data_b64: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct RecordingStats {
    pub frames_captured: u64,
    pub frames_dropped: u64,
    pub avg_fps: f64,
    pub duration_ms: f64,
}

/// Shared state for the native recording pipeline
pub struct NativeRecorderState {
    pub is_recording: Arc<AtomicBool>,
    pub frame_count: Arc<AtomicU64>,
    pub frames_dropped: Arc<AtomicU64>,
    pub start_time: Arc<Mutex<Option<std::time::Instant>>>,
    /// Encoded frames (PNG bytes) stored for export
    pub frame_buffer: Arc<Mutex<Vec<EncodedFrame>>>,
}

#[derive(Clone)]
pub struct EncodedFrame {
    pub rgba_data: Vec<u8>,
    pub width: u32,
    pub height: u32,
    pub timestamp_ms: f64,
}

impl Default for NativeRecorderState {
    fn default() -> Self {
        Self {
            is_recording: Arc::new(AtomicBool::new(false)),
            frame_count: Arc::new(AtomicU64::new(0)),
            frames_dropped: Arc::new(AtomicU64::new(0)),
            start_time: Arc::new(Mutex::new(None)),
            frame_buffer: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

/// Start native screen capture using xcap (cross-platform)  
/// Captures frames in a background thread and streams them to the frontend
#[command]
pub async fn start_native_capture(
    app: AppHandle,
    config: CaptureConfig,
) -> Result<(), String> {
    let state = app.state::<NativeRecorderState>();

    if state.is_recording.load(Ordering::Relaxed) {
        return Err("Already recording".to_string());
    }

    // Validate monitor index exists before spawning thread
    let monitors = xcap::Monitor::all()
        .map_err(|e| format!("Failed to enumerate monitors: {}", e))?;
    if config.monitor_index >= monitors.len() {
        return Err("Monitor not found".to_string());
    }
    let monitor_index = config.monitor_index;

    // Reset state
    state.is_recording.store(true, Ordering::Relaxed);
    state.frame_count.store(0, Ordering::Relaxed);
    state.frames_dropped.store(0, Ordering::Relaxed);
    {
        let mut start = state.start_time.lock();
        *start = Some(std::time::Instant::now());
    }
    {
        let mut buffer = state.frame_buffer.lock();
        buffer.clear();
    }

    let is_recording = state.is_recording.clone();
    let frame_count = state.frame_count.clone();
    let frames_dropped = state.frames_dropped.clone();
    let start_time = state.start_time.clone();
    let frame_buffer = state.frame_buffer.clone();
    let target_fps = config.fps.max(1).min(60);
    let frame_interval = std::time::Duration::from_micros(1_000_000 / target_fps as u64);

    // Spawn capture thread
    // Re-enumerate monitors inside the thread because xcap::Monitor is !Send (contains HMONITOR raw pointer)
    std::thread::spawn(move || {
        let monitor = match xcap::Monitor::all() {
            Ok(m) => match m.into_iter().nth(monitor_index) {
                Some(mon) => mon,
                None => {
                    log::error!("Monitor {} not found in capture thread", monitor_index);
                    return;
                }
            },
            Err(e) => {
                log::error!("Failed to enumerate monitors in capture thread: {}", e);
                return;
            }
        };

        let _last_frame_time = std::time::Instant::now();

        while is_recording.load(Ordering::Relaxed) {
            let capture_start = std::time::Instant::now();

            // Capture frame using xcap
            match monitor.capture_image() {
                Ok(img) => {
                    let elapsed_ms = {
                        let st = start_time.lock();
                        st.as_ref().map(|s: &std::time::Instant| s.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0)
                    };

                    let frame_num = frame_count.fetch_add(1, Ordering::Relaxed);

                    // Store raw RGBA frame for export pipeline
                    let encoded_frame = EncodedFrame {
                        rgba_data: img.as_raw().to_vec(),
                        width: img.width(),
                        height: img.height(),
                        timestamp_ms: elapsed_ms,
                    };

                    {
                        let mut buffer = frame_buffer.lock();
                        buffer.push(encoded_frame);
                    }

                    // Emit frame notification to frontend (lightweight, no pixel data)
                    let _ = app.emit("native-frame", serde_json::json!({
                        "frame_number": frame_num,
                        "timestamp_ms": elapsed_ms,
                        "width": img.width(),
                        "height": img.height(),
                    }));
                }
                Err(e) => {
                    frames_dropped.fetch_add(1, Ordering::Relaxed);
                    log::warn!("Frame capture failed: {}", e);
                }
            }

            // Sleep to maintain target FPS
            let capture_duration = capture_start.elapsed();
            if capture_duration < frame_interval {
                std::thread::sleep(frame_interval - capture_duration);
            }
        }

        log::info!("Native capture thread exiting");
    });

    Ok(())
}

/// Stop native capture
#[command]
pub async fn stop_native_capture(app: AppHandle) -> Result<RecordingStats, String> {
    let state = app.state::<NativeRecorderState>();
    state.is_recording.store(false, Ordering::Relaxed);

    // Wait a moment for the capture thread to stop
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;

    let frames = state.frame_count.load(Ordering::Relaxed);
    let dropped = state.frames_dropped.load(Ordering::Relaxed);
    let duration_ms = {
        let st = state.start_time.lock();
        st.as_ref().map(|s: &std::time::Instant| s.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0)
    };

    let avg_fps = if duration_ms > 0.0 {
        frames as f64 / (duration_ms / 1000.0)
    } else {
        0.0
    };

    Ok(RecordingStats {
        frames_captured: frames,
        frames_dropped: dropped,
        avg_fps,
        duration_ms,
    })
}

/// Get recording stats while recording
#[command]
pub async fn get_recording_stats(app: AppHandle) -> Result<RecordingStats, String> {
    let state = app.state::<NativeRecorderState>();

    let frames = state.frame_count.load(Ordering::Relaxed);
    let dropped = state.frames_dropped.load(Ordering::Relaxed);
    let duration_ms = {
        let st = state.start_time.lock();
        st.as_ref().map(|s: &std::time::Instant| s.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0)
    };

    let avg_fps = if duration_ms > 0.0 {
        frames as f64 / (duration_ms / 1000.0)
    } else {
        0.0
    };

    Ok(RecordingStats {
        frames_captured: frames,
        frames_dropped: dropped,
        avg_fps,
        duration_ms,
    })
}

/// Get the number of captured frames in buffer
#[command]
pub async fn get_frame_count(app: AppHandle) -> Result<u64, String> {
    let state = app.state::<NativeRecorderState>();
    Ok(state.frame_count.load(Ordering::Relaxed))
}
