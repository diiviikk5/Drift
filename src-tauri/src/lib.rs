mod commands;
mod tray;

use commands::input::InputListenerState;
use commands::native_recorder::NativeSessionManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
                ])
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .manage(InputListenerState::default())
        .manage(NativeSessionManager::default())
        .setup(|app| {
            use tauri::Manager;
            log::info!("Drift setup starting...");
            #[cfg(target_os = "windows")]
            {
                use windows_sys::Win32::UI::WindowsAndMessaging::ShowCursor;
                unsafe {
                    ShowCursor(1);
                }
            }
            if let Err(e) = tray::setup(app) {
                log::error!("[Tray] setup failed: {}", e);
            }
            if let Some(window) = app.get_webview_window("main") {
                log::info!("Found main window, calling show/unminimize/focus...");
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            } else {
                log::error!("CRITICAL: get_webview_window('main') returned None!");
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
            commands::input::get_session_keystrokes,
            commands::input::minimize_window,
            commands::input::restore_window,
            commands::input::hide_os_cursor,
            commands::input::show_os_cursor,
            commands::hotkeys::get_hotkeys,
            commands::hotkeys::set_hotkeys,
            tray::set_tray_state,
            tray::get_close_to_tray,
            tray::set_close_to_tray,
            tray::is_window_visible,
            commands::ai::ai_completion,
            commands::export::convert_webm_to_mp4,
            commands::native_recorder::start_native_session,
            commands::native_recorder::stop_native_session,
            commands::native_recorder::get_native_session_status,
            commands::native_recorder::is_native_capture_supported,
        ]);

    let app = builder
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, event| {
        match event {
            tauri::RunEvent::ExitRequested { .. } => {
                log::info!("ExitRequested received!");
            }
            tauri::RunEvent::WindowEvent { label, event, .. } => {
                log::debug!("WindowEvent for {}: {:?}", label, event);
                #[cfg(target_os = "windows")]
                if matches!(event, tauri::WindowEvent::Focused(true)) {
                    use windows_sys::Win32::UI::WindowsAndMessaging::ShowCursor;
                    unsafe {
                        ShowCursor(1);
                    }
                }
            }
            _ => {}
        }
    });
}
