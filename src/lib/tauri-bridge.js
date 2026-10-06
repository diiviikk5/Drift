/**
 * Tauri Bridge for Drift
 * Provides the same API as window.electron but using Tauri IPC
 * Falls back gracefully when running in browser/extension
 */

import { DEFAULT_HOTKEYS, GLOBAL_HOTKEY_ACTIONS } from './hotkeys.js';

let tauriApi = null;
let eventApi = null;
let shortcutApi = null;

async function getTauriApi() {
    if (tauriApi) return tauriApi;
    try {
        tauriApi = await import('@tauri-apps/api/core');
        return tauriApi;
    } catch {
        return null;
    }
}

async function getEventApi() {
    if (eventApi) return eventApi;
    try {
        eventApi = await import('@tauri-apps/api/event');
        return eventApi;
    } catch {
        return null;
    }
}

async function getShortcutApi() {
    if (shortcutApi) return shortcutApi;
    try {
        shortcutApi = await import('@tauri-apps/plugin-global-shortcut');
        return shortcutApi;
    } catch {
        return null;
    }
}

/**
 * Check if we're running in Tauri
 */
export function isTauri() {
    return typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
}

/**
 * Check if we're running in Electron
 */
export function isElectron() {
    return typeof window !== 'undefined' && window.electron !== undefined;
}

/**
 * Check if we're running in a desktop environment (Tauri or Electron)
 */
export function isDesktop() {
    return isTauri() || isElectron();
}

/**
 * Get available screen sources for recording
 */
export async function getSources() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('get_sources');
    }
    if (isElectron()) {
        return window.electron.getSources();
    }
    return [];
}

/**
 * Listen for global click events (works outside the app window)
 */
export async function onGlobalClick(callback) {
    if (isTauri()) {
        const events = await getEventApi();
        const api = await getTauriApi();

        // Start the global listener
        await api.invoke('start_global_listener');

        // Listen for click events from Rust
        const unlisten = await events.listen('global-click', (event) => {
            callback(event.payload);
        });

        return unlisten;
    }
    if (isElectron()) {
        window.electron.onGlobalClick(callback);
        return () => window.electron.removeListener('GLOBAL_CLICK');
    }
    return () => {};
}

/**
 * Listen for global mouse movement events
 */
export async function onGlobalMouseMove(callback) {
    if (isTauri()) {
        const events = await getEventApi();
        const unlisten = await events.listen('global-mouse-move', (event) => {
            callback(event.payload);
        });
        return unlisten;
    }
    return () => {};
}

/**
 * Stop global input listener
 */
export async function stopGlobalListener() {
    if (isTauri()) {
        const api = await getTauriApi();
        await api.invoke('stop_global_listener');
    }
}

/**
 * Start high-frequency synchronized session telemetry (stamps t=0.0 at recording start)
 */
export async function startSessionTelemetry() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('start_session_telemetry');
    }
}

/**
 * Stop session telemetry buffering and retrieve recorded samples
 */
export async function stopSessionTelemetry() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('stop_session_telemetry');
    }
    return [];
}

/**
 * Retrieve high-frequency session telemetry (up to 240Hz samples + clicks)
 */
export async function getSessionTelemetry() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('get_session_telemetry');
    }
    return [];
}

/**
 * Retrieve recorded session keystrokes with synchronized timestamps
 */
export async function getSessionKeystrokes() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('get_session_keystrokes');
    }
    return [];
}

/**
 * Listen for live global keystroke events from desktop listener
 */
export async function onGlobalKeystroke(callback) {
    if (isTauri()) {
        const events = await getEventApi();
        return events.listen('global-keystroke', (event) => {
            callback(event.payload);
        });
    }
    return () => {};
}

/**
 * Minimize app window during active recording
 */
export async function minimizeWindow() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('minimize_window');
    }
}

/**
 * Restore and focus app window after recording
 */
export async function restoreWindow() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('restore_window');
    }
}

/**
 * Get hotkey configuration
 */
export async function getHotkeys() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('get_hotkeys');
    }
    if (isElectron()) {
        return window.electron.getHotkeys();
    }
    return { ...DEFAULT_HOTKEYS };
}

/**
 * Set hotkey configuration
 */
export async function setHotkeys(hotkeys) {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('set_hotkeys', { hotkeys });
    }
    if (isElectron()) {
        return window.electron.setHotkeys(hotkeys);
    }
}

/**
 * Capture a screenshot of a monitor (Tauri only)
 */
export async function captureScreenshot(monitorId = 0) {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('capture_screenshot', { monitorId });
    }
    return null;
}

// ============================================================
// NATIVE CAPTURE PIPELINE (Tauri only)
// ============================================================

/**
 * Listen for native frame capture events
 */
export async function onNativeFrame(callback) {
    if (isTauri()) {
        const events = await getEventApi();
        return events.listen('native-frame', (event) => {
            callback(event.payload);
        });
    }
    return () => {};
}

// ============================================================
// MP4 EXPORT (FFmpeg via Rust)
// ============================================================

/**
 * Listen for export progress events
 */
export async function onExportProgress(callback) {
    if (isTauri()) {
        const events = await getEventApi();
        return events.listen('export-progress', (event) => {
            callback(event.payload);
        });
    }
    return () => {};
}

/**
 * Convert WebM data to MP4 using native FFmpeg or GPU hardware encoder
 */
export async function convertWebmToMp4(webmData, config = {}) {
    if (isTauri()) {
        const api = await getTauriApi();
        let bytes;
        if (typeof Blob !== 'undefined' && webmData instanceof Blob) {
            bytes = Array.from(new Uint8Array(await webmData.arrayBuffer()));
        } else if (webmData instanceof Uint8Array) {
            bytes = Array.from(webmData);
        } else if (webmData instanceof ArrayBuffer) {
            bytes = Array.from(new Uint8Array(webmData));
        } else {
            bytes = Array.from(webmData);
        }
        return api.invoke('convert_webm_to_mp4', {
            webmData: bytes,
            config,
        });
    }
    throw new Error('Native convertWebmToMp4 only available in Tauri');
}

/**
 * Hide the Windows hardware cursor during screen recording
 */
export async function hideOsCursor() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('hide_os_cursor');
    }
    return false;
}

/**
 * Restore Windows OS hardware cursor visibility when recording concludes
 */
export async function showOsCursor() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('show_os_cursor');
    }
    return false;
}

// ============================================================
// GPU COMPOSITOR
// ============================================================

// ============================================================
// FILE SYSTEM & DIALOG
// ============================================================

let dialogApi = null;
let fsApi = null;

async function getDialogApi() {
    if (dialogApi) return dialogApi;
    try {
        dialogApi = await import('@tauri-apps/plugin-dialog');
        return dialogApi;
    } catch {
        return null;
    }
}

async function getFsApi() {
    if (fsApi) return fsApi;
    try {
        fsApi = await import('@tauri-apps/plugin-fs');
        return fsApi;
    } catch {
        return null;
    }
}

/**
 * Show a native save dialog
 * @param {Object} options - { defaultPath, filters: [{ name, extensions }] }
 * @returns {Promise<string|null>} chosen path or null if cancelled
 */
export async function showSaveDialog(options = {}) {
    if (!isTauri()) return null;
    const dialog = await getDialogApi();
    if (!dialog) return null;
    return dialog.save(options);
}

/**
 * Write bytes to a file path
 * @param {string} path - absolute file path
 * @param {Uint8Array} data - file contents
 */
export async function saveFile(path, data) {
    if (!isTauri()) throw new Error('saveFile only available in Tauri');
    const fs = await getFsApi();
    if (!fs) throw new Error('fs plugin not available');
    return fs.writeFile(path, data);
}

// ============================================================
// TRAY & WINDOW
// ============================================================

/** Update the tray menu label, tooltip and recording dot. */
export async function setTrayState(recording, shortcut) {
    if (!isTauri()) return;
    try {
        const api = await getTauriApi();
        await api.invoke('set_tray_state', { recording: Boolean(recording), shortcut: shortcut ?? null });
    } catch (e) {
        console.warn('[drift] Tray update failed:', e);
    }
}

export async function getCloseToTray() {
    if (!isTauri()) return false;
    try {
        const api = await getTauriApi();
        return Boolean(await api.invoke('get_close_to_tray'));
    } catch {
        return true;
    }
}

export async function setCloseToTray(enabled) {
    if (!isTauri()) return;
    const api = await getTauriApi();
    await api.invoke('set_close_to_tray', { enabled: Boolean(enabled) });
}

/** True when the main window is on screen (not hidden to the tray or minimized). */
export async function isWindowVisible() {
    if (!isTauri()) return typeof document === 'undefined' || document.visibilityState === 'visible';
    try {
        const api = await getTauriApi();
        return Boolean(await api.invoke('is_window_visible'));
    } catch {
        return true;
    }
}

// ============================================================
// GLOBAL SHORTCUTS
// ============================================================

// Stores current registered shortcuts so we can unregister them
let _registeredShortcuts = [];
let _trayHotkeyUnlisten = null;

function dispatchHotkey(action, source) {
    window.dispatchEvent(new CustomEvent('drift-hotkey', { detail: { action, source } }));
}

// Shortcut changes run one at a time: a page remount can unregister and
// re-register at the same moment, and overlapping calls race each other.
let _shortcutQueue = Promise.resolve();
function queueShortcuts(task) {
    const run = _shortcutQueue.then(task, task);
    _shortcutQueue = run.catch(() => {});
    return run;
}

/**
 * Register the system-wide recording shortcuts (they keep working while Drift
 * is in the background or the tray) and forward tray menu actions.
 * Every action arrives as a 'drift-hotkey' window event.
 *
 * Drift's own earlier registrations are always cleared first (they survive a
 * page reload on the native side), so a failure really means another app
 * owns the key.
 * @param {object} hotkeyConfig - { toggle_recording, stop_recording, ... }
 * @returns {Promise<{registered: string[], failed: {action: string, accelerator: string}[]}>}
 */
export function registerGlobalShortcuts(hotkeyConfig) {
    return queueShortcuts(async () => {
        const result = { registered: [], failed: [] };
        if (!isTauri()) return result;
        const api = await getShortcutApi();
        if (!api) return result;

        try { await api.unregisterAll(); } catch { /* nothing registered */ }
        _registeredShortcuts = [];

        if (!_trayHotkeyUnlisten) {
            const events = await getEventApi();
            _trayHotkeyUnlisten = await events.listen('drift-hotkey', (event) => {
                const { action, source } = event.payload || {};
                if (action) dispatchHotkey(action, source || 'tray');
            });
        }

        // One registration per accelerator; if start/stop share a key, toggle wins.
        const byAccel = new Map();
        for (const action of GLOBAL_HOTKEY_ACTIONS) {
            const accel = String(hotkeyConfig?.[action] || '').trim();
            if (!accel) continue;
            if (!byAccel.has(accel)) byAccel.set(accel, action);
        }

        let last = 0;
        const handler = (action) => (event) => {
            if (event && event.state === 'Released') return;
            const now = Date.now();
            if (now - last < 350) return; // key repeat
            last = now;
            dispatchHotkey(action, 'global');
        };
        for (const [accel, action] of byAccel.entries()) {
            try {
                if (await api.isRegistered(accel)) await api.unregister(accel);
                await api.register(accel, handler(action));
                _registeredShortcuts.push(accel);
                result.registered.push(accel);
            } catch (err) {
                console.warn(`[drift] Could not register ${accel} for ${action}:`, err);
                result.failed.push({ action, accelerator: accel });
            }
        }
        console.log('[drift] Registered global shortcuts:', _registeredShortcuts);
        return result;
    });
}

/**
 * Unregister all of Drift's global shortcuts.
 */
export function unregisterAllShortcuts() {
    return queueShortcuts(async () => {
        if (!isTauri()) return;
        const api = await getShortcutApi();
        if (!api) return;
        try { await api.unregisterAll(); } catch { /* already clear */ }
        _registeredShortcuts = [];
    });
}

/**
 * Check if native screen capture is supported on current OS
 */
export async function isNativeCaptureSupported() {
    if (isTauri()) {
        try {
            const api = await getTauriApi();
            return await api.invoke('is_native_capture_supported');
        } catch {
            return false;
        }
    }
    return false;
}

/**
 * Windows that can be recorded natively: [{ id: 'window:<hwnd>', title, process, width, height }]
 */
export async function listCaptureWindows() {
    if (!isTauri()) return [];
    try {
        const api = await getTauriApi();
        return await api.invoke('list_capture_windows');
    } catch (e) {
        console.warn('[drift] Window list failed:', e);
        return [];
    }
}

/**
 * Start a native screen capture session writing directly to disk.
 * Pass `windowId` ('window:<hwnd>') to record a single window.
 */
export async function startNativeSession(config = {}) {
    if (isTauri()) {
        const api = await getTauriApi();
        return await api.invoke('start_native_session', { config });
    }
    throw new Error('Native recording sessions are only available in the desktop app');
}

/**
 * Stop active native capture session and finalize MP4, WAV, and telemetry
 */
export async function stopNativeSession() {
    if (isTauri()) {
        const api = await getTauriApi();
        return await api.invoke('stop_native_session');
    }
    throw new Error('Native recording sessions are only available in the desktop app');
}

/**
 * Get the live status of the native recording session
 */
export async function getNativeSessionStatus() {
    if (isTauri()) {
        const api = await getTauriApi();
        return await api.invoke('get_native_session_status');
    }
    return { is_recording: false, session_id: null, duration_ms: 0, frames_captured: 0 };
}

/**
 * Resolve local disk file path to Tauri asset:// URL for zero-decode webview playback
 */
export async function resolveAssetUrl(filePath) {
    if (!filePath) return null;
    if (isTauri()) {
        try {
            const api = await getTauriApi();
            if (typeof api.convertFileSrc === 'function') {
                return api.convertFileSrc(filePath);
            }
        } catch (e) {
            console.warn('[drift] resolveAssetUrl fallback:', e);
        }
    }
    return filePath;
}

/**
 * Get the platform bridge — unified API object
 * Use this as a drop-in replacement for window.electron
 */
export const drift = {
    isTauri,
    isElectron,
    isDesktop,
    getSources,
    onGlobalClick,
    onGlobalMouseMove,
    stopGlobalListener,
    startSessionTelemetry,
    stopSessionTelemetry,
    getSessionTelemetry,
    getSessionKeystrokes,
    onGlobalKeystroke,
    minimizeWindow,
    restoreWindow,
    getHotkeys,
    setHotkeys,
    captureScreenshot,
    // Native capture pipeline
    onNativeFrame,
    // MP4 export
    convertWebmToMp4,
    onExportProgress,
    // GPU compositor
    // File system & dialog
    showSaveDialog,
    saveFile,
    // Global shortcuts
    registerGlobalShortcuts,
    unregisterAllShortcuts,
    setTrayState,
    getCloseToTray,
    setCloseToTray,
    isWindowVisible,
    // Native Multi-Track Cinema Session Pipeline
    isNativeCaptureSupported,
    startNativeSession,
    listCaptureWindows,
    stopNativeSession,
    getNativeSessionStatus,
    resolveAssetUrl,
    hideOsCursor,
    showOsCursor,
};

export default drift;
