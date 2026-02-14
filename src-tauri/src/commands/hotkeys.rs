use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager};
use tauri_plugin_store::StoreExt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HotkeyConfig {
    pub toggle_recording: String,
    pub stop_recording: String,
    pub toggle_pause: String,
    pub toggle_zoom: String,
}

impl Default for HotkeyConfig {
    fn default() -> Self {
        Self {
            toggle_recording: "CmdOrCtrl+Shift+R".to_string(),
            stop_recording: "CmdOrCtrl+Shift+S".to_string(),
            toggle_pause: "CmdOrCtrl+Shift+P".to_string(),
            toggle_zoom: "CmdOrCtrl+Shift+Z".to_string(),
        }
    }
}

const STORE_FILE: &str = "drift-settings.json";
const HOTKEYS_KEY: &str = "hotkeys";

#[command]
pub fn get_hotkeys(app: AppHandle) -> HotkeyConfig {
    match app.store(STORE_FILE) {
        Ok(store) => {
            match store.get(HOTKEYS_KEY) {
                Some(val) => serde_json::from_value(val.clone()).unwrap_or_default(),
                None => HotkeyConfig::default(),
            }
        }
        Err(_) => HotkeyConfig::default(),
    }
}

#[command]
pub fn set_hotkeys(app: AppHandle, hotkeys: HotkeyConfig) -> Result<(), String> {
    let store = app.store(STORE_FILE).map_err(|e| e.to_string())?;
    let val = serde_json::to_value(&hotkeys).map_err(|e| e.to_string())?;
    store.set(HOTKEYS_KEY, val);
    store.save().map_err(|e| e.to_string())?;
    log::info!("Hotkeys saved: {:?}", hotkeys);
    Ok(())
}
