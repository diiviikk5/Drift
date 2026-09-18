use parking_lot::Mutex;
use rdev::{listen, Event, EventType, Key};
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeystrokeSample {
    pub time: f64,
    pub text: String,
}

/// State to control the global input listener and buffer session telemetry
pub struct InputListenerState {
    pub is_listening: Arc<Mutex<bool>>,
    pub is_recording: Arc<Mutex<bool>>,
    pub recording_start: Arc<Mutex<Option<std::time::Instant>>>,
    pub session_samples: Arc<Mutex<Vec<CursorSample>>>,
    pub session_keystrokes: Arc<Mutex<Vec<KeystrokeSample>>>,
    pub active_ctrl: Arc<Mutex<bool>>,
    pub active_shift: Arc<Mutex<bool>>,
    pub active_alt: Arc<Mutex<bool>>,
    pub active_meta: Arc<Mutex<bool>>,
}

impl Default for InputListenerState {
    fn default() -> Self {
        Self {
            is_listening: Arc::new(Mutex::new(false)),
            is_recording: Arc::new(Mutex::new(false)),
            recording_start: Arc::new(Mutex::new(None)),
            session_samples: Arc::new(Mutex::new(Vec::with_capacity(16384))),
            session_keystrokes: Arc::new(Mutex::new(Vec::with_capacity(2048))),
            active_ctrl: Arc::new(Mutex::new(false)),
            active_shift: Arc::new(Mutex::new(false)),
            active_alt: Arc::new(Mutex::new(false)),
            active_meta: Arc::new(Mutex::new(false)),
        }
    }
}

fn format_key_name(key: &Key) -> Option<&'static str> {
    match key {
        Key::KeyA => Some("A"),
        Key::KeyB => Some("B"),
        Key::KeyC => Some("C"),
        Key::KeyD => Some("D"),
        Key::KeyE => Some("E"),
        Key::KeyF => Some("F"),
        Key::KeyG => Some("G"),
        Key::KeyH => Some("H"),
        Key::KeyI => Some("I"),
        Key::KeyJ => Some("J"),
        Key::KeyK => Some("K"),
        Key::KeyL => Some("L"),
        Key::KeyM => Some("M"),
        Key::KeyN => Some("N"),
        Key::KeyO => Some("O"),
        Key::KeyP => Some("P"),
        Key::KeyQ => Some("Q"),
        Key::KeyR => Some("R"),
        Key::KeyS => Some("S"),
        Key::KeyT => Some("T"),
        Key::KeyU => Some("U"),
        Key::KeyV => Some("V"),
        Key::KeyW => Some("W"),
        Key::KeyX => Some("X"),
        Key::KeyY => Some("Y"),
        Key::KeyZ => Some("Z"),
        Key::Num0 => Some("0"),
        Key::Num1 => Some("1"),
        Key::Num2 => Some("2"),
        Key::Num3 => Some("3"),
        Key::Num4 => Some("4"),
        Key::Num5 => Some("5"),
        Key::Num6 => Some("6"),
        Key::Num7 => Some("7"),
        Key::Num8 => Some("8"),
        Key::Num9 => Some("9"),
        Key::Return => Some("Enter"),
        Key::Escape => Some("Esc"),
        Key::Space => Some("Space"),
        Key::Backspace => Some("Backspace"),
        Key::Tab => Some("Tab"),
        Key::Delete => Some("Del"),
        Key::UpArrow => Some("↑"),
        Key::DownArrow => Some("↓"),
        Key::LeftArrow => Some("←"),
        Key::RightArrow => Some("→"),
        Key::Home => Some("Home"),
        Key::End => Some("End"),
        Key::PageUp => Some("PgUp"),
        Key::PageDown => Some("PgDn"),
        Key::F1 => Some("F1"),
        Key::F2 => Some("F2"),
        Key::F3 => Some("F3"),
        Key::F4 => Some("F4"),
        Key::F5 => Some("F5"),
        Key::F6 => Some("F6"),
        Key::F7 => Some("F7"),
        Key::F8 => Some("F8"),
        Key::F9 => Some("F9"),
        Key::F10 => Some("F10"),
        Key::F11 => Some("F11"),
        Key::F12 => Some("F12"),
        Key::Minus => Some("-"),
        Key::Equal => Some("="),
        Key::LeftBracket => Some("["),
        Key::RightBracket => Some("]"),
        Key::BackSlash => Some("\\"),
        Key::SemiColon => Some(";"),
        Key::Quote => Some("'"),
        Key::Comma => Some(","),
        Key::Dot => Some("."),
        Key::Slash => Some("/"),
        Key::BackQuote => Some("`"),
        _ => None,
    }
}

fn is_special_key(key: &Key) -> bool {
    matches!(
        key,
        Key::Return
            | Key::Escape
            | Key::Space
            | Key::Backspace
            | Key::Tab
            | Key::Delete
            | Key::UpArrow
            | Key::DownArrow
            | Key::LeftArrow
            | Key::RightArrow
            | Key::Home
            | Key::End
            | Key::PageUp
            | Key::PageDown
            | Key::F1
            | Key::F2
            | Key::F3
            | Key::F4
            | Key::F5
            | Key::F6
            | Key::F7
            | Key::F8
            | Key::F9
            | Key::F10
            | Key::F11
            | Key::F12
    )
}

/// Start listening for global mouse and keyboard events
#[tauri::command]
pub fn start_global_listener(app: AppHandle) {
    let state = app.state::<InputListenerState>();
    let mut listening = state.is_listening.lock();

    if *listening {
        return; // Already listening
    }
    *listening = true;
    state.session_samples.lock().clear();
    state.session_keystrokes.lock().clear();
    drop(listening);

    let is_listening = state.is_listening.clone();
    let is_recording = state.is_recording.clone();
    let recording_start = state.recording_start.clone();
    let session_samples = state.session_samples.clone();
    let session_keystrokes = state.session_keystrokes.clone();
    let active_ctrl = state.active_ctrl.clone();
    let active_shift = state.active_shift.clone();
    let active_alt = state.active_alt.clone();
    let active_meta = state.active_meta.clone();
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
                EventType::KeyPress(key) => {
                    match key {
                        Key::ControlLeft | Key::ControlRight => *active_ctrl.lock() = true,
                        Key::ShiftLeft | Key::ShiftRight => *active_shift.lock() = true,
                        Key::Alt | Key::AltGr => *active_alt.lock() = true,
                        Key::MetaLeft | Key::MetaRight => *active_meta.lock() = true,
                        _ => {
                            if let Some(key_name) = format_key_name(&key) {
                                let ctrl = *active_ctrl.lock();
                                let alt = *active_alt.lock();
                                let shift = *active_shift.lock();
                                let meta = *active_meta.lock();

                                let has_modifier = ctrl || alt || shift || meta;
                                let special = is_special_key(&key);

                                if has_modifier || special {
                                    let mut parts = Vec::new();
                                    if ctrl {
                                        parts.push("Ctrl");
                                    }
                                    if alt {
                                        parts.push("Alt");
                                    }
                                    if shift {
                                        parts.push("Shift");
                                    }
                                    if meta {
                                        #[cfg(target_os = "macos")]
                                        parts.push("⌘");
                                        #[cfg(not(target_os = "macos"))]
                                        parts.push("Win");
                                    }
                                    parts.push(key_name);
                                    let combo = parts.join("+");

                                    let sample = KeystrokeSample {
                                        time: (elapsed / 1000.0 * 100.0).round() / 100.0,
                                        text: combo,
                                    };

                                    if is_rec {
                                        session_keystrokes.lock().push(sample.clone());
                                    }
                                    let _ = app_handle.emit("global-keystroke", &sample);
                                }
                            }
                        }
                    }
                }
                EventType::KeyRelease(key) => {
                    match key {
                        Key::ControlLeft | Key::ControlRight => *active_ctrl.lock() = false,
                        Key::ShiftLeft | Key::ShiftRight => *active_shift.lock() = false,
                        Key::Alt | Key::AltGr => *active_alt.lock() = false,
                        Key::MetaLeft | Key::MetaRight => *active_meta.lock() = false,
                        _ => {}
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
    state.session_keystrokes.lock().clear();
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

/// Retrieve the session keystroke buffer recorded during the session
#[tauri::command]
pub fn get_session_keystrokes(state: tauri::State<'_, InputListenerState>) -> Vec<KeystrokeSample> {
    state.session_keystrokes.lock().clone()
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
