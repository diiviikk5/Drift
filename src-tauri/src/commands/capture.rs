use serde::{Deserialize, Serialize};
use tauri::command;

use crate::commands::display;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScreenSource {
    pub id: String,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub is_primary: bool,
}

/// Get available screen sources for recording
#[command]
pub async fn get_sources() -> Result<Vec<ScreenSource>, String> {
    let displays = display::displays();
    if displays.is_empty() {
        return Err("No displays found".into());
    }
    Ok(displays
        .into_iter()
        .enumerate()
        .map(|(i, d)| ScreenSource {
            id: format!("screen:{}", i),
            name: if d.primary { "Main display".to_string() } else { format!("Display {}", i + 1) },
            width: d.width,
            height: d.height,
            is_primary: d.primary,
        })
        .collect())
}

/// Thumbnail of a display as PNG bytes (for the source picker preview).
#[command]
pub async fn capture_screenshot(monitor_id: usize) -> Result<Vec<u8>, String> {
    let displays = display::displays();
    let d = displays.get(monitor_id).ok_or_else(|| "Display not found".to_string())?;
    let (w, h, rgba) = display::thumbnail(d, 1280)?;

    let mut buf = Vec::new();
    let encoder = image::codecs::png::PngEncoder::new(&mut buf);
    image::ImageEncoder::write_image(encoder, &rgba, w, h, image::ExtendedColorType::Rgba8)
        .map_err(|e| format!("Failed to encode: {}", e))?;
    Ok(buf)
}
