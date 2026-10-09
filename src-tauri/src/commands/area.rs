//! Area picker: freeze a monitor like the Snipping Tool so the user can drag
//! out the part of the screen to record.
//!
//! `enter_area_picker` hides Drift, takes a full-resolution screenshot of the
//! monitor, then turns the main window into a fullscreen overlay on that
//! monitor (the frontend draws the screenshot and the selection UI).
//! `exit_area_picker` puts the window back exactly as it was.

use parking_lot::Mutex;
use serde::Serialize;
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, State};

use crate::commands::display;

struct SavedWindow {
    position: PhysicalPosition<i32>,
    size: PhysicalSize<u32>,
    maximized: bool,
}

#[derive(Default)]
pub struct AreaPickerState(Mutex<Option<SavedWindow>>);

#[derive(Debug, Serialize)]
pub struct AreaBackdrop {
    /// PNG of the monitor at native resolution.
    pub image_path: String,
    pub width: u32,
    pub height: u32,
}

#[tauri::command]
pub async fn enter_area_picker(
    app: AppHandle,
    state: State<'_, AreaPickerState>,
    monitor_index: usize,
) -> Result<AreaBackdrop, String> {
    let displays = display::displays();
    let d = displays
        .get(monitor_index)
        .or_else(|| displays.first())
        .cloned()
        .ok_or_else(|| "No display found".to_string())?;
    let window = app.get_webview_window("main").ok_or_else(|| "Main window not found".to_string())?;

    {
        let mut saved = state.0.lock();
        if saved.is_none() {
            *saved = Some(SavedWindow {
                position: window.outer_position().map_err(|e| e.to_string())?,
                size: window.outer_size().map_err(|e| e.to_string())?,
                maximized: window.is_maximized().unwrap_or(false),
            });
        }
    }

    // Get Drift out of the way so the screenshot shows what will be recorded.
    let _ = window.hide();
    tokio::time::sleep(std::time::Duration::from_millis(220)).await;

    let shot = display::thumbnail(&d, d.width);
    let (w, h, rgba) = match shot {
        Ok(v) => v,
        Err(e) => {
            let _ = window.show();
            return Err(e);
        }
    };
    let dir = dirs_next::data_local_dir()
        .unwrap_or_else(|| std::path::PathBuf::from("."))
        .join("Drift");
    let _ = std::fs::create_dir_all(&dir);
    let path = dir.join("area-backdrop.png");
    image::save_buffer(&path, &rgba, w, h, image::ExtendedColorType::Rgba8)
        .map_err(|e| format!("Failed to save the screenshot: {}", e))?;

    // Fullscreen overlay on that monitor.
    if window.is_maximized().unwrap_or(false) {
        let _ = window.unmaximize();
    }
    let _ = window.set_position(PhysicalPosition::new(d.x, d.y));
    let _ = window.set_size(PhysicalSize::new(d.width, d.height));
    let _ = window.set_always_on_top(true);
    let _ = window.set_fullscreen(true);
    let _ = window.show();
    let _ = window.set_focus();

    Ok(AreaBackdrop {
        image_path: path.to_string_lossy().to_string(),
        width: d.width,
        height: d.height,
    })
}

#[tauri::command]
pub fn exit_area_picker(app: AppHandle, state: State<'_, AreaPickerState>) -> Result<(), String> {
    let window = app.get_webview_window("main").ok_or_else(|| "Main window not found".to_string())?;
    let _ = window.set_fullscreen(false);
    let _ = window.set_always_on_top(false);
    if let Some(saved) = state.0.lock().take() {
        let _ = window.set_size(saved.size);
        let _ = window.set_position(saved.position);
        if saved.maximized {
            let _ = window.maximize();
        }
    }
    let _ = window.show();
    let _ = window.set_focus();
    Ok(())
}
