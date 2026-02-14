mod commands;
mod rendering;

use commands::input::InputListenerState;
use commands::native_capture::NativeRecorderState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .manage(InputListenerState::default())
        .manage(NativeRecorderState::default())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::capture::get_sources,
            commands::capture::capture_screenshot,
            commands::input::start_global_listener,
            commands::input::stop_global_listener,
            commands::hotkeys::get_hotkeys,
            commands::hotkeys::set_hotkeys,
            commands::ai::ai_completion,
            commands::native_capture::start_native_capture,
            commands::native_capture::stop_native_capture,
            commands::native_capture::get_recording_stats,
            commands::native_capture::get_frame_count,
            commands::export::export_mp4,
            commands::export::export_composited_mp4,
            commands::export::check_ffmpeg,
            commands::export::clear_frame_buffer,
            commands::export::convert_webm_to_mp4,
            commands::compositor::init_compositor,
            commands::zoom::generate_zoom_segments,
            commands::zoom::evaluate_zoom_at_time,
            commands::zoom::interpolate_cursor_at_time,
            commands::zoom::evaluate_frame,
            commands::zoom::precompute_frames,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Drift");
}
