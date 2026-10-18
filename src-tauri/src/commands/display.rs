//! Displays and display thumbnails.
//!
//! Windows: monitors are listed with EnumDisplayMonitors, the same order the
//! capture backend (Windows Graphics Capture) uses, so an index means the same
//! screen everywhere. Thumbnails are scaled down by GDI while copying, so a
//! preview never reads a full-resolution frame.
//!
//! macOS / Linux: monitors come from the windowing layer (same order as
//! AVFoundation's screens on macOS) and thumbnails are grabbed with ffmpeg.

/// The app, for listing monitors outside Windows (set during setup).
#[allow(dead_code)]
pub static APP: std::sync::OnceLock<tauri::AppHandle> = std::sync::OnceLock::new();

#[derive(Debug, Clone)]
pub struct DisplayInfo {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
    pub primary: bool,
    /// Physical pixels per logical point (macOS Retina: 2.0; elsewhere 1.0).
    #[allow(dead_code)]
    pub scale: f64,
}

#[cfg(windows)]
pub fn displays() -> Vec<DisplayInfo> {
    use windows::core::BOOL;
    use windows::Win32::Foundation::{LPARAM, RECT};
    use windows::Win32::Graphics::Gdi::{EnumDisplayMonitors, GetMonitorInfoW, HDC, HMONITOR, MONITORINFO};

    unsafe extern "system" fn collect(monitor: HMONITOR, _: HDC, _: *mut RECT, data: LPARAM) -> BOOL {
        let list = unsafe { &mut *(data.0 as *mut Vec<DisplayInfo>) };
        let mut info = MONITORINFO { cbSize: std::mem::size_of::<MONITORINFO>() as u32, ..Default::default() };
        if unsafe { GetMonitorInfoW(monitor, &mut info) }.as_bool() {
            let r = info.rcMonitor;
            list.push(DisplayInfo {
                x: r.left,
                y: r.top,
                width: (r.right - r.left).max(0) as u32,
                height: (r.bottom - r.top).max(0) as u32,
                primary: (info.dwFlags & 1) != 0, // MONITORINFOF_PRIMARY
                scale: 1.0,
            });
        }
        BOOL(1)
    }

    let mut list: Vec<DisplayInfo> = Vec::new();
    unsafe {
        let _ = EnumDisplayMonitors(None, None, Some(collect), LPARAM(&mut list as *mut _ as isize));
    }
    list
}

#[cfg(not(windows))]
pub fn displays() -> Vec<DisplayInfo> {
    let Some(app) = APP.get() else { return Vec::new() };
    let primary = app.primary_monitor().ok().flatten().map(|m| (m.position().x, m.position().y));
    app.available_monitors()
        .unwrap_or_default()
        .into_iter()
        .map(|m| {
            let (p, s) = (m.position(), m.size());
            DisplayInfo {
                x: p.x,
                y: p.y,
                width: s.width,
                height: s.height,
                primary: primary == Some((p.x, p.y)),
                scale: m.scale_factor(),
            }
        })
        .collect()
}

/// RGBA pixels of a display, scaled to fit within `max_width` (keeps aspect).
#[cfg(windows)]
pub fn thumbnail(display: &DisplayInfo, max_width: u32) -> Result<(u32, u32, Vec<u8>), String> {
    use windows::Win32::Graphics::Gdi::{
        CreateCompatibleBitmap, CreateCompatibleDC, DeleteDC, DeleteObject, GetDC, GetDIBits, ReleaseDC, SelectObject,
        SetStretchBltMode, StretchBlt, BITMAPINFO, BITMAPINFOHEADER, BI_RGB, DIB_RGB_COLORS, HALFTONE, SRCCOPY,
    };

    let scale = (max_width as f64 / display.width.max(1) as f64).min(1.0);
    let w = ((display.width as f64 * scale).round() as i32).max(1);
    let h = ((display.height as f64 * scale).round() as i32).max(1);

    unsafe {
        let screen = GetDC(None);
        if screen.is_invalid() {
            return Err("Could not access the screen".into());
        }
        let mem = CreateCompatibleDC(Some(screen));
        let bitmap = CreateCompatibleBitmap(screen, w, h);
        let previous = SelectObject(mem, bitmap.into());
        SetStretchBltMode(mem, HALFTONE);
        let copied = StretchBlt(
            mem, 0, 0, w, h,
            Some(screen), display.x, display.y, display.width as i32, display.height as i32,
            SRCCOPY,
        )
        .as_bool();

        let mut info = BITMAPINFO {
            bmiHeader: BITMAPINFOHEADER {
                biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                biWidth: w,
                biHeight: -h, // top-down rows
                biPlanes: 1,
                biBitCount: 32,
                biCompression: BI_RGB.0,
                ..Default::default()
            },
            ..Default::default()
        };
        let mut pixels = vec![0u8; (w * h * 4) as usize];
        let rows = GetDIBits(mem, bitmap, 0, h as u32, Some(pixels.as_mut_ptr() as *mut _), &mut info, DIB_RGB_COLORS);

        SelectObject(mem, previous);
        let _ = DeleteObject(bitmap.into());
        let _ = DeleteDC(mem);
        ReleaseDC(None, screen);

        if !copied || rows == 0 {
            return Err("Could not capture the screen".into());
        }
        // BGRA -> RGBA, opaque.
        for px in pixels.chunks_exact_mut(4) {
            px.swap(0, 2);
            px[3] = 255;
        }
        Ok((w as u32, h as u32, pixels))
    }
}

#[cfg(not(windows))]
pub fn thumbnail(display: &DisplayInfo, max_width: u32) -> Result<(u32, u32, Vec<u8>), String> {
    let index = displays()
        .iter()
        .position(|d| d.x == display.x && d.y == display.y)
        .unwrap_or(0);
    crate::commands::ffmpeg_capture::screenshot(display, index, max_width)
}
