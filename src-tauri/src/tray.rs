//! System tray: start/stop recording from the tray, keep Drift running in the
//! background when its window is closed, and show a red dot while recording.

use std::sync::atomic::{AtomicBool, Ordering};

use parking_lot::Mutex;
use tauri::image::Image;
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent};
use tauri::{App, AppHandle, Emitter, Manager, Runtime, WindowEvent};
use tauri_plugin_store::StoreExt;

const STORE_FILE: &str = "drift-settings.json";
const CLOSE_TO_TRAY_KEY: &str = "close_to_tray";

pub struct TrayState<R: Runtime> {
    toggle: MenuItem<R>,
    tray: TrayIcon<R>,
    idle_icon: Image<'static>,
    recording_icon: Image<'static>,
    pub close_to_tray: AtomicBool,
    pub quitting: AtomicBool,
    shortcut: Mutex<String>,
}

fn show_main<R: Runtime>(app: &AppHandle<R>) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.unminimize();
        let _ = w.show();
        let _ = w.set_focus();
    }
}

/// Default icon with a red recording dot in the bottom-right corner.
fn with_record_dot(icon: &Image<'_>) -> Image<'static> {
    let (w, h) = (icon.width(), icon.height());
    let mut rgba = icon.rgba().to_vec();
    let r = (w.min(h) as f32) * 0.24;
    let (cx, cy) = (w as f32 - r - 1.0, h as f32 - r - 1.0);
    for y in 0..h {
        for x in 0..w {
            let d = ((x as f32 + 0.5 - cx).powi(2) + (y as f32 + 0.5 - cy).powi(2)).sqrt();
            let i = ((y * w + x) * 4) as usize;
            if d <= r + 1.2 && d > r {
                // white ring so the dot reads on any taskbar colour
                rgba[i..i + 4].copy_from_slice(&[255, 255, 255, 255]);
            } else if d <= r {
                rgba[i..i + 4].copy_from_slice(&[239, 68, 68, 255]);
            }
        }
    }
    Image::new_owned(rgba, w, h)
}

fn tooltip(recording: bool, shortcut: &str) -> String {
    let key = if shortcut.is_empty() { String::new() } else { format!(" ({})", shortcut) };
    if recording {
        format!("Drift - recording. Stop{}", key)
    } else {
        format!("Drift - start recording{}", key)
    }
}

pub fn setup(app: &App) -> tauri::Result<()> {
    let handle = app.handle();
    let toggle = MenuItem::with_id(handle, "toggle_recording", "Start recording", true, None::<&str>)?;
    let open = MenuItem::with_id(handle, "open", "Open Drift", true, None::<&str>)?;
    let sep = PredefinedMenuItem::separator(handle)?;
    let quit = MenuItem::with_id(handle, "quit", "Quit Drift", true, None::<&str>)?;
    let menu = Menu::with_items(handle, &[&toggle, &open, &sep, &quit])?;

    let idle_icon = app
        .default_window_icon()
        .cloned()
        .map(|i| Image::new_owned(i.rgba().to_vec(), i.width(), i.height()))
        .ok_or_else(|| tauri::Error::AssetNotFound("default window icon".into()))?;
    let recording_icon = with_record_dot(&idle_icon);

    let tray = TrayIconBuilder::with_id("drift")
        .icon(idle_icon.clone())
        .tooltip(tooltip(false, ""))
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "toggle_recording" => {
                let _ = app.emit_to("main", "drift-hotkey", serde_json::json!({ "action": "toggle_recording", "source": "tray" }));
            }
            "open" => show_main(app),
            "quit" => {
                if let Some(state) = app.try_state::<TrayState<tauri::Wry>>() {
                    state.quitting.store(true, Ordering::Relaxed);
                }
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                show_main(tray.app_handle());
            }
        })
        .build(handle)?;

    let close_to_tray = handle
        .store(STORE_FILE)
        .ok()
        .and_then(|s| s.get(CLOSE_TO_TRAY_KEY))
        .and_then(|v| v.as_bool())
        .unwrap_or(true);

    app.manage(TrayState {
        toggle,
        tray,
        idle_icon,
        recording_icon,
        close_to_tray: AtomicBool::new(close_to_tray),
        quitting: AtomicBool::new(false),
        shortcut: Mutex::new(String::new()),
    });

    // Closing the window keeps Drift alive in the tray (so global hotkeys keep working).
    if let Some(window) = app.get_webview_window("main") {
        let app_handle = handle.clone();
        let win = window.clone();
        window.on_window_event(move |event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                if let Some(state) = app_handle.try_state::<TrayState<tauri::Wry>>() {
                    if state.close_to_tray.load(Ordering::Relaxed) && !state.quitting.load(Ordering::Relaxed) {
                        api.prevent_close();
                        let _ = win.hide();
                        log::info!("[Tray] Window hidden to tray");
                    }
                }
            }
        });
    }
    Ok(())
}

/// Reflect recording state in the tray (menu label, tooltip, red dot).
#[tauri::command]
pub fn set_tray_state(app: AppHandle, recording: bool, shortcut: Option<String>) -> Result<(), String> {
    let state = app.try_state::<TrayState<tauri::Wry>>().ok_or("tray not ready")?;
    if let Some(s) = shortcut {
        *state.shortcut.lock() = s;
    }
    let key = state.shortcut.lock().clone();
    state
        .toggle
        .set_text(if recording { "Stop recording" } else { "Start recording" })
        .map_err(|e| e.to_string())?;
    state.tray.set_tooltip(Some(tooltip(recording, &key))).map_err(|e| e.to_string())?;
    let icon = if recording { state.recording_icon.clone() } else { state.idle_icon.clone() };
    state.tray.set_icon(Some(icon)).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_close_to_tray(app: AppHandle) -> bool {
    app.try_state::<TrayState<tauri::Wry>>()
        .map(|s| s.close_to_tray.load(Ordering::Relaxed))
        .unwrap_or(true)
}

#[tauri::command]
pub fn set_close_to_tray(app: AppHandle, enabled: bool) -> Result<(), String> {
    if let Some(state) = app.try_state::<TrayState<tauri::Wry>>() {
        state.close_to_tray.store(enabled, Ordering::Relaxed);
    }
    let store = app.store(STORE_FILE).map_err(|e| e.to_string())?;
    store.set(CLOSE_TO_TRAY_KEY, serde_json::Value::Bool(enabled));
    store.save().map_err(|e| e.to_string())
}

/// Whether the main window is currently on screen (not hidden to tray / minimized).
#[tauri::command]
pub fn is_window_visible(app: AppHandle) -> bool {
    app.get_webview_window("main")
        .map(|w| w.is_visible().unwrap_or(false) && !w.is_minimized().unwrap_or(false))
        .unwrap_or(false)
}
