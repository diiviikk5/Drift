use parking_lot::Mutex;
use rdev::{listen, Event, EventType};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::thread;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GlobalClickEvent {
    pub x: f64,
    pub y: f64,
    pub time: f64,
    pub button: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GlobalMoveEvent {
    pub x: f64,
    pub y: f64,
    pub time: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorSample {
    pub t: f64,
    pub x: f64,
    pub y: f64,
    pub click: Option<String>,
}

/// State to control the global input listener and buffer session telemetry
pub struct InputListenerState {
    pub is_listening: Arc<Mutex<bool>>,
    pub is_recording: Arc<Mutex<bool>>,
    pub recording_start: Arc<Mutex<Option<std::time::Instant>>>,
    pub session_samples: Arc<Mutex<Vec<CursorSample>>>,
}

impl Default for InputListenerState {
    fn default() -> Self {
        Self {
            is_listening: Arc::new(Mutex::new(false)),
            is_recording: Arc::new(Mutex::new(false)),
            recording_start: Arc::new(Mutex::new(None)),
            session_samples: Arc::new(Mutex::new(Vec::with_capacity(16384))),
        }
    }
}

/// Start listening for global mouse events (clicks + movement)
#[tauri::command]
pub fn start_global_listener(app: AppHandle) {
    let state = app.state::<InputListenerState>();
    let mut listening = state.is_listening.lock();

    if *listening {
        return; // Already listening
    }
    *listening = true;
    state.session_samples.lock().clear();
    drop(listening);

    let is_listening = state.is_listening.clone();
    let is_recording = state.is_recording.clone();
    let recording_start = state.recording_start.clone();
    let session_samples = state.session_samples.clone();
    let app_handle = app.clone();

    thread::spawn(move || {
        let listener_start = std::time::Instant::now();
        let mut last_move_time: f64 = 0.0;
        let mut last_sample_time: f64 = 0.0;

        listen(move |event: Event| {
            if !*is_listening.lock() {
                return;
            }

            let rec_start = *recording_start.lock();
            let recording = *is_recording.lock();

            // When actively recording, elapsed is relative to recording start (starts at 0.0 ms)
            // When idle, elapsed is relative to listener start for live indicator events
            let (elapsed, is_rec) = match (recording, rec_start) {
                (true, Some(start_inst)) => (start_inst.elapsed().as_secs_f64() * 1000.0, true),
                _ => (listener_start.elapsed().as_secs_f64() * 1000.0, false),
            };

            match event.event_type {
                EventType::ButtonPress(button) => {
                    let btn_name = match button {
                        rdev::Button::Left => "left",
                        rdev::Button::Right => "right",
                        rdev::Button::Middle => "middle",
                        _ => "unknown",
                    };

                    if let Some(pos) = get_mouse_position(&event) {
                        let click = GlobalClickEvent {
                            x: pos.0,
                            y: pos.1,
                            time: elapsed,
                            button: btn_name.to_string(),
                        };

                        if is_rec {
                            session_samples.lock().push(CursorSample {
                                t: elapsed,
                                x: pos.0,
                                y: pos.1,
                                click: Some(btn_name.to_string()),
                            });
                        }

                        let _ = app_handle.emit("global-click", &click);
                    }
                }
                EventType::MouseMove { x, y } => {
                    if is_rec {
                        // Buffer high-frequency telemetry at up to 240Hz (>= 4ms between samples)
                        if elapsed - last_sample_time >= 4.0 {
                            last_sample_time = elapsed;
                            session_samples.lock().push(CursorSample {
                                t: elapsed,
                                x,
                                y,
                                click: None,
                            });
                        }
                    }

                    // Throttle webview IPC event to ~60fps (16ms) to keep UI thread responsive
                    if elapsed - last_move_time > 16.0 {
                        last_move_time = elapsed;
                        let move_evt = GlobalMoveEvent {
                            x,
                            y,
                            time: elapsed,
                        };
                        let _ = app_handle.emit("global-mouse-move", &move_evt);
                    }
                }
                _ => {}
            }
        })
        .unwrap_or_else(|e| {
            log::error!("Global input listener error: {:?}", e);
        });
    });
}

/// Stop listening for global events
#[tauri::command]
pub fn stop_global_listener(state: tauri::State<'_, InputListenerState>) {
    let mut listening = state.is_listening.lock();
    *listening = false;
}

/// Start buffering high-frequency synchronized telemetry for the active recording session
#[tauri::command]
pub fn start_session_telemetry(app: AppHandle) {
    start_global_listener(app.clone());
    let state = app.state::<InputListenerState>();
    *state.is_recording.lock() = true;
    *state.recording_start.lock() = Some(std::time::Instant::now());
    state.session_samples.lock().clear();
}

/// Stop session telemetry buffering and retrieve recorded samples
#[tauri::command]
pub fn stop_session_telemetry(state: tauri::State<'_, InputListenerState>) -> Vec<CursorSample> {
    *state.is_recording.lock() = false;
    *state.recording_start.lock() = None;
    state.session_samples.lock().clone()
}

/// Retrieve the high-frequency telemetry buffer recorded during the session
#[tauri::command]
pub fn get_session_telemetry(state: tauri::State<'_, InputListenerState>) -> Vec<CursorSample> {
    state.session_samples.lock().clone()
}

/// Minimize the main application window during active desktop recording
#[tauri::command]
pub fn minimize_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.minimize();
    }
}

/// Restore and focus the main application window when recording concludes
#[tauri::command]
pub fn restore_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn get_mouse_position(event: &Event) -> Option<(f64, f64)> {
    match event.event_type {
        EventType::ButtonPress(_) | EventType::ButtonRelease(_) => {
            #[cfg(target_os = "windows")]
            {
                use std::mem::MaybeUninit;
                unsafe {
                    let mut point = MaybeUninit::<windows_sys::Win32::Foundation::POINT>::uninit();
                    if windows_sys::Win32::UI::WindowsAndMessaging::GetCursorPos(point.as_mut_ptr())
                        != 0
                    {
                        let point = point.assume_init();
                        return Some((point.x as f64, point.y as f64));
                    }
                }
                None
            }
            #[cfg(not(target_os = "windows"))]
            {
                None
            }
        }
        EventType::MouseMove { x, y } => Some((x, y)),
        _ => None,
    }
}
