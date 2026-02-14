use serde::{Deserialize, Serialize};
use tauri::command;
use xcap::Monitor;

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
    let monitors = Monitor::all().map_err(|e| format!("Failed to enumerate monitors: {}", e))?;

    let sources: Vec<ScreenSource> = monitors
        .into_iter()
        .enumerate()
        .map(|(i, monitor)| ScreenSource {
            id: format!("screen:{}", i),
            name: monitor.name().to_string(),
            width: monitor.width(),
            height: monitor.height(),
            is_primary: monitor.is_primary(),
        })
        .collect();

    Ok(sources)
}

/// Capture a screenshot of a specific monitor (for thumbnails)
#[command]
pub async fn capture_screenshot(monitor_id: usize) -> Result<Vec<u8>, String> {
    let monitors = Monitor::all().map_err(|e| format!("Failed to get monitors: {}", e))?;

    let monitor = monitors
        .get(monitor_id)
        .ok_or_else(|| "Monitor not found".to_string())?;

    let image = monitor
        .capture_image()
        .map_err(|e| format!("Failed to capture: {}", e))?;

    // Encode as PNG bytes
    let mut buf = Vec::new();
    let encoder = image::codecs::png::PngEncoder::new(&mut buf);
    image::ImageEncoder::write_image(
        encoder,
        image.as_raw(),
        image.width(),
        image.height(),
        image::ExtendedColorType::Rgba8,
    )
    .map_err(|e| format!("Failed to encode: {}", e))?;

    Ok(buf)
}
