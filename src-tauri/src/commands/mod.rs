pub mod capture;
pub mod input;
pub mod hotkeys;
pub mod export;
pub mod native_recorder;
pub mod caret;
pub mod display;
pub mod cursor_shape;
pub mod scroll_detect;
pub mod area;
#[allow(dead_code)] // used outside Windows; compiled everywhere so it stays checked
pub mod ffmpeg_capture;
