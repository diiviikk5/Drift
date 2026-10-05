//! Which system cursor is showing (arrow, text I-beam, link hand, resize...),
//! sampled during recordings so the synthetic pointer can change shape the
//! way the real one did.
//!
//! Browsers, Electron apps and native apps all use the shared system cursors
//! for these, so comparing the current cursor handle against the system ones
//! identifies the shape.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorShapeSample {
    /// ms on the video timeline (0 = first frame)
    pub t: f64,
    pub shape: String,
}

/// Current system cursor shape, or None when hidden / unknown.
#[cfg(windows)]
pub fn current_shape() -> Option<&'static str> {
    use windows::core::PCWSTR;
    use windows::Win32::UI::WindowsAndMessaging::{
        GetCursorInfo, LoadCursorW, CURSORINFO, CURSOR_SHOWING, IDC_APPSTARTING, IDC_ARROW, IDC_CROSS, IDC_HAND,
        IDC_IBEAM, IDC_NO, IDC_SIZEALL, IDC_SIZENESW, IDC_SIZENS, IDC_SIZENWSE, IDC_SIZEWE, IDC_WAIT,
    };
    unsafe {
        let mut info = CURSORINFO { cbSize: std::mem::size_of::<CURSORINFO>() as u32, ..Default::default() };
        if GetCursorInfo(&mut info).is_err() || (info.flags.0 & CURSOR_SHOWING.0) == 0 {
            return None;
        }
        let table: [(PCWSTR, &'static str); 12] = [
            (IDC_ARROW, "arrow"),
            (IDC_IBEAM, "text"),
            (IDC_HAND, "hand"),
            (IDC_SIZEWE, "resize-ew"),
            (IDC_SIZENS, "resize-ns"),
            (IDC_SIZENWSE, "resize-nwse"),
            (IDC_SIZENESW, "resize-nesw"),
            (IDC_SIZEALL, "move"),
            (IDC_WAIT, "wait"),
            (IDC_APPSTARTING, "progress"),
            (IDC_CROSS, "crosshair"),
            (IDC_NO, "not-allowed"),
        ];
        for (id, name) in table {
            if let Ok(h) = LoadCursorW(None, id) {
                if h.0 == info.hCursor.0 {
                    return Some(name);
                }
            }
        }
        Some("arrow")
    }
}

#[cfg(not(windows))]
pub fn current_shape() -> Option<&'static str> {
    None
}

/// Poll the cursor shape while `recording` is set; records changes.
pub fn spawn_shape_sampler(
    recording: std::sync::Arc<std::sync::atomic::AtomicBool>,
    track: std::sync::Arc<parking_lot::Mutex<Vec<(std::time::Instant, &'static str)>>>,
) {
    std::thread::spawn(move || {
        let mut last: Option<&'static str> = None;
        while recording.load(std::sync::atomic::Ordering::Relaxed) {
            let now = current_shape();
            if let Some(shape) = now {
                if Some(shape) != last {
                    track.lock().push((std::time::Instant::now(), shape));
                    last = Some(shape);
                }
            }
            std::thread::sleep(std::time::Duration::from_millis(16));
        }
    });
}

#[cfg(test)]
mod tests {
    #[test]
    #[ignore]
    fn print_current_shape() {
        println!("SHAPE: {:?}", super::current_shape());
    }
}
