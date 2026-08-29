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
pub struct RecordedInputSession {
    pub moves: Vec<GlobalMoveEvent>,
    pub clicks: Vec<GlobalClickEvent>,
}

pub struct InputListenerState {
    pub is_listening: Arc<Mutex<bool>>,
    pub recorded_moves: Arc<Mutex<Vec<GlobalMoveEvent>>>,
    pub recorded_clicks: Arc<Mutex<Vec<GlobalClickEvent>>>,
}

impl Default for InputListenerState {
    fn default() -> Self {
        Self {
            is_listening: Arc::new(Mutex::new(false)),
            recorded_moves: Arc::new(Mutex::new(Vec::new())),
            recorded_clicks: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

#[tauri::command]
pub fn start_global_listener(app: AppHandle) {
    let state = app.state::<InputListenerState>();
    let mut listening = state.is_listening.lock();

    if *listening {
        return;
    }
    *listening = true;
    drop(listening);

    let is_listening = state.is_listening.clone();
    let recorded_moves = state.recorded_moves.clone();
    let recorded_clicks = state.recorded_clicks.clone();
    let app_handle = app.clone();

    thread::spawn(move || {
        let start_time = std::time::Instant::now();
        let mut last_ipc_time: f64 = 0.0;

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
                        {
                            let mut clicks = recorded_clicks.lock();
                            clicks.push(click.clone());
                        }
                        let _ = app_handle.emit("global-click", &click);
                    }
                }
                EventType::MouseMove { x, y } => {
                    let move_evt = GlobalMoveEvent {
                        x,
                        y,
                        time: elapsed,
                    };
                    {
                        let mut moves = recorded_moves.lock();
                        moves.push(move_evt.clone());
                    }

                    if elapsed - last_ipc_time >= 8.0 {
                        last_ipc_time = elapsed;
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

#[tauri::command]
pub fn stop_global_listener(app: AppHandle) {
    let state = app.state::<InputListenerState>();
    let mut listening = state.is_listening.lock();
    *listening = false;
}

#[tauri::command]
pub fn get_recorded_input_events(app: AppHandle) -> RecordedInputSession {
    let state = app.state::<InputListenerState>();
    let moves = state.recorded_moves.lock().clone();
    let clicks = state.recorded_clicks.lock().clone();
    RecordedInputSession { moves, clicks }
}

#[tauri::command]
pub fn clear_recorded_input_events(app: AppHandle) {
    let state = app.state::<InputListenerState>();
    state.recorded_moves.lock().clear();
    state.recorded_clicks.lock().clear();
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

