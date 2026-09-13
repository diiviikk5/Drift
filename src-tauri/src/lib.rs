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
            use tauri::Manager;
            let _ = app.handle().plugin(
                tauri_plugin_log::Builder::default()
                    .level(log::LevelFilter::Info)
                    .build(),
            );
            if let Some(window) = app.get_webview_window("main") {
                #[cfg(debug_assertions)]
                {
                    let _ = window.open_devtools();
                }
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::capture::get_sources,
            commands::capture::capture_screenshot,
            commands::input::start_global_listener,
            commands::input::stop_global_listener,
            commands::input::start_session_telemetry,
            commands::input::stop_session_telemetry,
            commands::input::get_session_telemetry,
            commands::input::minimize_window,
            commands::input::restore_window,
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
