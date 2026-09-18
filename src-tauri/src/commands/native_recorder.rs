use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use parking_lot::Mutex;
use tauri::{command, AppHandle, Emitter, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NativeSessionConfig {
    pub monitor_index: usize,
    pub fps: Option<u32>,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub with_system_audio: Option<bool>,
    pub with_mic: Option<bool>,
    pub without_cursor: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NativeSessionResult {
    pub session_id: String,
    pub session_dir: String,
    pub screen_video_path: String,
    pub system_audio_path: Option<String>,
    pub mic_audio_path: Option<String>,
    pub telemetry_path: String,
    pub keystrokes_path: Option<String>,
    pub manifest_path: String,
    pub duration_ms: f64,
    pub width: u32,
    pub height: u32,
    pub fps: u32,
    pub frames_captured: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NativeSessionStatus {
    pub is_recording: bool,
    pub session_id: Option<String>,
    pub duration_ms: f64,
    pub frames_captured: u64,
}

#[cfg(windows)]
use windows_capture::{
    capture::{CaptureControl, Context, GraphicsCaptureApiHandler},
    encoder::{
        AudioSettingsBuilder, ContainerSettingsBuilder, VideoEncoder, VideoSettingsBuilder,
        VideoSettingsSubType,
    },
    frame::Frame,
    graphics_capture_api::{GraphicsCaptureApi, InternalCaptureControl},
    monitor::Monitor,
    settings::{
        ColorFormat, CursorCaptureSettings, DirtyRegionSettings, DrawBorderSettings,
        MinimumUpdateIntervalSettings, SecondaryWindowSettings, Settings,
    },
};

#[cfg(windows)]
pub struct CaptureSessionFlags {
    pub output_path: PathBuf,
    pub fps: u32,
    pub width: u32,
    pub height: u32,
    pub is_recording: Arc<AtomicBool>,
    pub frame_counter: Arc<std::sync::atomic::AtomicU64>,
}

#[cfg(windows)]
pub struct ScreenRecorderHandler {
    encoder: Option<VideoEncoder>,
    is_recording: Arc<AtomicBool>,
    frame_counter: Arc<std::sync::atomic::AtomicU64>,
}

#[cfg(windows)]
impl GraphicsCaptureApiHandler for ScreenRecorderHandler {
    type Flags = CaptureSessionFlags;
    type Error = Box<dyn std::error::Error + Send + Sync>;

    fn new(ctx: Context<Self::Flags>) -> Result<Self, Self::Error> {
        let flags = ctx.flags;
        let encoder = VideoEncoder::new(
            VideoSettingsBuilder::new(flags.width, flags.height)
                .sub_type(VideoSettingsSubType::H264)
                .frame_rate(flags.fps)
                .bitrate(25_000_000),
            AudioSettingsBuilder::new().disabled(true),
            ContainerSettingsBuilder::new(),
            &flags.output_path,
        )?;

        Ok(Self {
            encoder: Some(encoder),
            is_recording: flags.is_recording,
            frame_counter: flags.frame_counter,
        })
    }

    fn on_frame_arrived(
        &mut self,
        frame: &mut Frame,
        capture_control: InternalCaptureControl,
    ) -> Result<(), Self::Error> {
        if !self.is_recording.load(Ordering::Relaxed) {
            capture_control.stop();
            return Ok(());
        }

        if let Some(encoder) = &mut self.encoder {
            encoder.send_frame(frame)?;
            self.frame_counter.fetch_add(1, Ordering::Relaxed);
        }
        Ok(())
    }

    fn on_closed(&mut self) -> Result<(), Self::Error> {
        if let Some(encoder) = self.encoder.take() {
            encoder.finish()?;
        }
        Ok(())
    }
}

pub struct NativeSessionManager {
    pub is_recording: Arc<AtomicBool>,
    pub frame_counter: Arc<std::sync::atomic::AtomicU64>,
    pub start_time: Arc<Mutex<Option<std::time::Instant>>>,
    pub session_id: Arc<Mutex<Option<String>>>,
    pub session_dir: Arc<Mutex<Option<PathBuf>>>,
    pub screen_path: Arc<Mutex<Option<PathBuf>>>,
    pub system_audio_path: Arc<Mutex<Option<PathBuf>>>,
    pub mic_audio_path: Arc<Mutex<Option<PathBuf>>>,
    pub target_geometry: Arc<Mutex<(u32, u32, u32)>>, // width, height, fps
    #[cfg(windows)]
    capture_control: Arc<Mutex<Option<CaptureControl<ScreenRecorderHandler, Box<dyn std::error::Error + Send + Sync>>>>>,
    audio_stop_sender: Arc<Mutex<Option<std::sync::mpsc::Sender<()>>>>,
}

impl Default for NativeSessionManager {
    fn default() -> Self {
        Self {
            is_recording: Arc::new(AtomicBool::new(false)),
            frame_counter: Arc::new(std::sync::atomic::AtomicU64::new(0)),
            start_time: Arc::new(Mutex::new(None)),
            session_id: Arc::new(Mutex::new(None)),
            session_dir: Arc::new(Mutex::new(None)),
            screen_path: Arc::new(Mutex::new(None)),
            system_audio_path: Arc::new(Mutex::new(None)),
            mic_audio_path: Arc::new(Mutex::new(None)),
            target_geometry: Arc::new(Mutex::new((1920, 1080, 60))),
            #[cfg(windows)]
            capture_control: Arc::new(Mutex::new(None)),
            audio_stop_sender: Arc::new(Mutex::new(None)),
        }
    }
}

#[command]
pub fn is_native_capture_supported() -> bool {
    #[cfg(windows)]
    {
        GraphicsCaptureApi::is_supported().unwrap_or(false)
    }
    #[cfg(not(windows))]
    {
        false
    }
}

#[command]
pub async fn start_native_session(
    app: AppHandle,
    config: NativeSessionConfig,
) -> Result<String, String> {
    let state = app.state::<NativeSessionManager>();
    if state.is_recording.load(Ordering::Relaxed) {
        return Err("A native recording session is already active".to_string());
    }

    #[cfg(not(windows))]
    {
        let _ = config;
        return Err("Native screen capture is currently only supported on Windows".to_string());
    }

    #[cfg(windows)]
    {
        if !GraphicsCaptureApi::is_supported().unwrap_or(false) {
            return Err("Windows Graphics Capture is not supported on this Windows version (requires Windows 10 1903+)".to_string());
        }

        // 1. Create a dedicated session directory in local app data
        let session_uuid = uuid::Uuid::new_v4().to_string();
        let session_folder_name = format!("session_{}", session_uuid);
        let base_dir = dirs_next::data_local_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("Drift")
            .join("sessions")
            .join(&session_folder_name);

        std::fs::create_dir_all(&base_dir)
            .map_err(|e| format!("Failed to create session directory: {}", e))?;

        let screen_video_path = base_dir.join("screen.mp4");
        let sys_audio_path = base_dir.join("system_audio.wav");
        let mic_audio_path = base_dir.join("microphone.wav");

        // 2. Resolve target monitor
        let monitors = Monitor::enumerate()
            .map_err(|e| format!("Failed to enumerate monitors: {:?}", e))?;
        if monitors.is_empty() {
            return Err("No display monitors detected for capture".to_string());
        }

        let monitor = if config.monitor_index < monitors.len() {
            monitors[config.monitor_index].clone()
        } else {
            Monitor::primary().map_err(|e| format!("Failed to acquire primary monitor: {:?}", e))?
        };

        let width = config.width.unwrap_or_else(|| monitor.width().unwrap_or(1920));
        let height = config.height.unwrap_or_else(|| monitor.height().unwrap_or(1080));
        let fps = config.fps.unwrap_or(60).clamp(15, 120);
        let without_cursor = config.without_cursor.unwrap_or(true);

        *state.target_geometry.lock() = (width, height, fps);
        *state.session_id.lock() = Some(session_uuid.clone());
        *state.session_dir.lock() = Some(base_dir.clone());
        *state.screen_path.lock() = Some(screen_video_path.clone());
        state.frame_counter.store(0, Ordering::Relaxed);
        state.is_recording.store(true, Ordering::Relaxed);

        // 3. Start audio capture in a background thread to keep cpal::Stream safely inside thread
        let with_system_audio = config.with_system_audio.unwrap_or(true);
        let with_mic = config.with_mic.unwrap_or(false);

        let (audio_stop_tx, audio_stop_rx) = std::sync::mpsc::channel::<()>();
        *state.audio_stop_sender.lock() = Some(audio_stop_tx);

        let sys_path_clone = sys_audio_path.clone();
        let mic_path_clone = mic_audio_path.clone();

        if with_system_audio {
            *state.system_audio_path.lock() = Some(sys_audio_path);
        }
        if with_mic {
            *state.mic_audio_path.lock() = Some(mic_audio_path);
        }

        std::thread::spawn(move || {
            use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
            let host = cpal::default_host();
            let mut streams = Vec::new();
            let mut writers = Vec::new();

            if with_system_audio {
                if let Some(device) = host.default_output_device() {
                    if let Ok(supported_config) = device.default_output_config() {
                        let channels = supported_config.channels();
                        let sample_rate = supported_config.sample_rate().0;
                        let spec = hound::WavSpec {
                            channels,
                            sample_rate,
                            bits_per_sample: 32,
                            sample_format: hound::SampleFormat::Float,
                        };

                        if let Ok(writer) = hound::WavWriter::create(&sys_path_clone, spec) {
                            let writer_arc = Arc::new(Mutex::new(writer));
                            let writer_cb = writer_arc.clone();
                            let stream_res = device.build_input_stream(
                                &supported_config.config(),
                                move |data: &[f32], _| {
                                    let mut w = writer_cb.lock();
                                    for &s in data {
                                        let _ = w.write_sample(s);
                                    }
                                },
                                |err| log::warn!("System audio loopback error: {}", err),
                                None,
                            );

                            if let Ok(stream) = stream_res {
                                if let Ok(_) = stream.play() {
                                    streams.push(stream);
                                    writers.push(writer_arc);
                                }
                            }
                        }
                    }
                }
            }

            if with_mic {
                if let Some(mic_device) = host.default_input_device() {
                    if let Ok(supported_config) = mic_device.default_input_config() {
                        let channels = supported_config.channels();
                        let sample_rate = supported_config.sample_rate().0;
                        let spec = hound::WavSpec {
                            channels,
                            sample_rate,
                            bits_per_sample: 32,
                            sample_format: hound::SampleFormat::Float,
                        };

                        if let Ok(writer) = hound::WavWriter::create(&mic_path_clone, spec) {
                            let writer_arc = Arc::new(Mutex::new(writer));
                            let writer_cb = writer_arc.clone();
                            let stream_res = mic_device.build_input_stream(
                                &supported_config.config(),
                                move |data: &[f32], _| {
                                    let mut w = writer_cb.lock();
                                    for &s in data {
                                        let _ = w.write_sample(s);
                                    }
                                },
                                |err| log::warn!("Microphone capture error: {}", err),
                                None,
                            );

                            if let Ok(stream) = stream_res {
                                if let Ok(_) = stream.play() {
                                    streams.push(stream);
                                    writers.push(writer_arc);
                                }
                            }
                        }
                    }
                }
            }

            // Wait until stop signal is sent
            let _ = audio_stop_rx.recv();

            // Flush all WAV files
            for writer_arc in writers {
                let mut w = writer_arc.lock();
                let _ = w.flush();
            }
            drop(streams);
        });

        // 4. Start session synchronized cursor telemetry
        let _ = app.emit("native-recording-started", serde_json::json!({
            "session_id": session_uuid,
            "width": width,
            "height": height,
            "fps": fps,
        }));
        crate::commands::input::start_session_telemetry(app.clone());

        // 5. Configure and launch windows-capture free-threaded
        let cursor_setting = if without_cursor {
            CursorCaptureSettings::WithoutCursor
        } else {
            CursorCaptureSettings::WithCursor
        };

        let flags = CaptureSessionFlags {
            output_path: screen_video_path,
            fps,
            width,
            height,
            is_recording: state.is_recording.clone(),
            frame_counter: state.frame_counter.clone(),
        };

        let settings = Settings::new(
            monitor,
            cursor_setting,
            DrawBorderSettings::WithoutBorder,
            SecondaryWindowSettings::Default,
            MinimumUpdateIntervalSettings::Default,
            DirtyRegionSettings::Default,
            ColorFormat::Rgba8,
            flags,
        );

        *state.start_time.lock() = Some(std::time::Instant::now());

        let control = ScreenRecorderHandler::start_free_threaded(settings)
            .map_err(|e| format!("Failed to initialize Windows Graphics Capture: {:?}", e))?;

        *state.capture_control.lock() = Some(control);

        Ok(session_uuid)
    }
}

#[command]
pub async fn stop_native_session(app: AppHandle) -> Result<NativeSessionResult, String> {
    let state = app.state::<NativeSessionManager>();
    if !state.is_recording.load(Ordering::Relaxed) {
        return Err("No native recording session is currently active".to_string());
    }

    // 1. Signal recording stop
    state.is_recording.store(false, Ordering::Relaxed);

    #[cfg(windows)]
    {
        // 2. Stop capture control gracefully and join thread
        if let Some(control) = state.capture_control.lock().take() {
            if let Err(e) = control.stop() {
                log::warn!("Notice when stopping windows-capture control: {:?}", e);
            }
        }
    }

    // 3. Stop audio thread by sending signal
    if let Some(stop_tx) = state.audio_stop_sender.lock().take() {
        let _ = stop_tx.send(());
    }

    let duration_ms = {
        let mut st = state.start_time.lock();
        let elapsed = st.as_ref().map(|t: &std::time::Instant| t.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0);
        *st = None;
        elapsed
    };

    let session_id = state.session_id.lock().take().unwrap_or_else(|| "unknown".to_string());
    let session_dir = state.session_dir.lock().take().unwrap_or_else(|| PathBuf::from("."));
    let screen_video_path = state.screen_path.lock().take().unwrap_or_else(|| session_dir.join("screen.mp4"));
    let system_audio_path = state.system_audio_path.lock().take();
    let mic_audio_path = state.mic_audio_path.lock().take();
    let (width, height, fps) = *state.target_geometry.lock();
    let frames_captured = state.frame_counter.load(Ordering::Relaxed);

    // 4. Retrieve synchronized telemetry and write telemetry.json
    let telemetry_samples = crate::commands::input::stop_session_telemetry(app.state::<crate::commands::input::InputListenerState>());
    let telemetry_path = session_dir.join("telemetry.json");
    let telemetry_json = serde_json::to_string_pretty(&telemetry_samples)
        .unwrap_or_else(|_| "[]".to_string());
    let _ = std::fs::write(&telemetry_path, telemetry_json);

    // 4.5 Retrieve synchronized keystrokes and write keystrokes.json
    let keystroke_samples = crate::commands::input::get_session_keystrokes(app.state::<crate::commands::input::InputListenerState>());
    let keystrokes_path = session_dir.join("keystrokes.json");
    let keystrokes_json = serde_json::to_string_pretty(&keystroke_samples)
        .unwrap_or_else(|_| "[]".to_string());
    let _ = std::fs::write(&keystrokes_path, keystrokes_json);

    // 5. Write manifest.json
    let manifest_path = session_dir.join("session.json");
    let manifest_data = serde_json::json!({
        "session_id": session_id,
        "created_at": chrono::Utc::now().to_rfc3339(),
        "duration_ms": duration_ms,
        "width": width,
        "height": height,
        "fps": fps,
        "frames_captured": frames_captured,
        "tracks": {
            "screen": screen_video_path.to_string_lossy(),
            "system_audio": system_audio_path.as_ref().map(|p| p.to_string_lossy()),
            "microphone": mic_audio_path.as_ref().map(|p| p.to_string_lossy()),
            "telemetry": telemetry_path.to_string_lossy(),
            "keystrokes": keystrokes_path.to_string_lossy(),
        }
    });
    let _ = std::fs::write(&manifest_path, serde_json::to_string_pretty(&manifest_data).unwrap_or_default());

    let res = NativeSessionResult {
        session_id,
        session_dir: session_dir.to_string_lossy().to_string(),
        screen_video_path: screen_video_path.to_string_lossy().to_string(),
        system_audio_path: system_audio_path.map(|p| p.to_string_lossy().to_string()),
        mic_audio_path: mic_audio_path.map(|p| p.to_string_lossy().to_string()),
        telemetry_path: telemetry_path.to_string_lossy().to_string(),
        keystrokes_path: Some(keystrokes_path.to_string_lossy().to_string()),
        manifest_path: manifest_path.to_string_lossy().to_string(),
        duration_ms,
        width,
        height,
        fps,
        frames_captured,
    };

    let _ = app.emit("native-recording-stopped", &res);
    Ok(res)
}

#[command]
pub fn get_native_session_status(app: AppHandle) -> NativeSessionStatus {
    let state = app.state::<NativeSessionManager>();
    let is_recording = state.is_recording.load(Ordering::Relaxed);
    let session_id = state.session_id.lock().clone();
    let frames_captured = state.frame_counter.load(Ordering::Relaxed);
    let duration_ms = {
        let st = state.start_time.lock();
        st.as_ref().map(|t: &std::time::Instant| t.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0)
    };

    NativeSessionStatus {
        is_recording,
        session_id,
        duration_ms,
        frames_captured,
    }
}
