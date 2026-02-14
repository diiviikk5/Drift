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

/// State to control the global input listener
pub struct InputListenerState {
    pub is_listening: Arc<Mutex<bool>>,
}

impl Default for InputListenerState {
    fn default() -> Self {
        Self {
            is_listening: Arc::new(Mutex::new(false)),
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
    drop(listening);

    let is_listening = state.is_listening.clone();
    let app_handle = app.clone();

    thread::spawn(move || {
        let start_time = std::time::Instant::now();
        let mut last_move_time: f64 = 0.0;

        listen(move |event: Event| {
            if !*is_listening.lock() {
                return;
            }

            let elapsed = start_time.elapsed().as_secs_f64() * 1000.0;

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
                        let _ = app_handle.emit("global-click", &click);
                    }
                }
                EventType::MouseMove { x, y } => {
                    // Throttle mouse move events to ~30fps
                    if elapsed - last_move_time > 33.0 {
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
pub fn stop_global_listener(app: AppHandle) {
    let state = app.state::<InputListenerState>();
    let mut listening = state.is_listening.lock();
    *listening = false;
}

fn get_mouse_position(event: &Event) -> Option<(f64, f64)> {
    match event.event_type {
        EventType::ButtonPress(_) | EventType::ButtonRelease(_) => {
            // rdev doesn't include position in button events on all platforms
            // Use a fallback — on Windows we can get cursor pos
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
