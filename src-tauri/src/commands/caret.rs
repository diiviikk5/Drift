//! Text caret position, sampled during recordings so auto-zoom can frame what
//! you type (the mouse is often parked somewhere else while typing).
//!
//! Two sources, the same ones screen magnifiers use:
//! 1. the Win32 system caret of the focused thread (classic apps, Office, Notepad)
//! 2. the accessibility caret object (Chromium, Edge, Electron apps, VS Code)

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct CaretSample {
    /// ms on the video timeline (0 = first frame)
    pub t: f64,
    /// caret position in recorded-target pixels (top of the caret)
    pub x: f64,
    pub y: f64,
    /// caret height in pixels (line height)
    pub h: f64,
}

/// Desktop-space caret rectangle (x, y, height) of the foreground window, if any.
#[cfg(windows)]
pub fn caret_screen_rect() -> Option<(i32, i32, i32)> {
    use windows::core::Interface;
    use windows::Win32::Foundation::{HWND, POINT};
    use windows::Win32::Graphics::Gdi::ClientToScreen;
    use windows::Win32::System::Variant::VARIANT;
    use windows::Win32::UI::Accessibility::{AccessibleObjectFromWindow, IAccessible};
    use windows::Win32::UI::WindowsAndMessaging::{GetGUIThreadInfo, GUITHREADINFO, OBJID_CARET};

    unsafe {
        let mut gui = GUITHREADINFO { cbSize: std::mem::size_of::<GUITHREADINFO>() as u32, ..Default::default() };
        if GetGUIThreadInfo(0, &mut gui).is_err() {
            return None;
        }

        // 1. System caret
        let rc = gui.rcCaret;
        if !gui.hwndCaret.is_invalid() && rc.bottom > rc.top {
            let mut p = POINT { x: rc.left, y: rc.top };
            if ClientToScreen(gui.hwndCaret, &mut p).as_bool() {
                return Some((p.x, p.y, rc.bottom - rc.top));
            }
        }

        // 2. Accessibility caret
        let target: HWND = if !gui.hwndFocus.is_invalid() { gui.hwndFocus } else { gui.hwndActive };
        if target.is_invalid() {
            return None;
        }
        let mut raw: *mut std::ffi::c_void = std::ptr::null_mut();
        if AccessibleObjectFromWindow(target, OBJID_CARET.0 as u32, &IAccessible::IID, &mut raw).is_err() || raw.is_null() {
            return None;
        }
        let acc = IAccessible::from_raw(raw);
        let (mut x, mut y, mut w, mut h) = (0i32, 0i32, 0i32, 0i32);
        let child = VARIANT::from(0i32); // CHILDID_SELF
        if acc.accLocation(&mut x, &mut y, &mut w, &mut h, &child).is_ok() && h > 0 && (x != 0 || y != 0) {
            return Some((x, y, h));
        }
        None
    }
}

#[cfg(not(windows))]
pub fn caret_screen_rect() -> Option<(i32, i32, i32)> {
    None
}

/// Poll the caret while `recording` is set; records (instant, x, y, h) on change.
pub fn spawn_caret_sampler(
    recording: std::sync::Arc<std::sync::atomic::AtomicBool>,
    track: std::sync::Arc<parking_lot::Mutex<Vec<(std::time::Instant, i32, i32, i32)>>>,
) {
    std::thread::spawn(move || {
        #[cfg(windows)]
        unsafe {
            let _ = windows::Win32::System::Com::CoInitializeEx(None, windows::Win32::System::Com::COINIT_MULTITHREADED);
        }
        let mut last: Option<(i32, i32, i32)> = None;
        while recording.load(std::sync::atomic::Ordering::Relaxed) {
            let now = caret_screen_rect();
            if now.is_some() && now != last {
                let (x, y, h) = now.unwrap();
                track.lock().push((std::time::Instant::now(), x, y, h));
            }
            last = now;
            std::thread::sleep(std::time::Duration::from_millis(40));
        }
    });
}

#[cfg(test)]
mod tests {
    #[test]
    #[ignore]
    fn print_current_caret() {
        #[cfg(windows)]
        unsafe {
            let _ = windows::Win32::System::Com::CoInitializeEx(None, windows::Win32::System::Com::COINIT_MULTITHREADED);
        }
        println!("CARET: {:?}", super::caret_screen_rect());
    }
}
