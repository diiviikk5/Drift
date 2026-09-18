/**
 * Tauri Bridge for Drift
 * Provides the same API as window.electron but using Tauri IPC
 * Falls back gracefully when running in browser/extension
 */

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
    return {
        toggle_recording: 'CmdOrCtrl+Shift+R',
        stop_recording: 'CmdOrCtrl+Shift+S',
        toggle_pause: 'CmdOrCtrl+Shift+P',
        toggle_zoom: 'CmdOrCtrl+Shift+Z',
    };
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
 * Call AI completion through Rust backend (avoids CORS in Tauri)
 * Falls back to direct fetch in browser
 */
export async function aiCompletion({ apiKey, model, messages, maxTokens, temperature }) {
    if (isTauri()) {
        const api = await getTauriApi();
        const result = await api.invoke('ai_completion', {
            apiKey,
            model,
            messages,
            maxTokens: maxTokens || null,
            temperature: temperature || null,
        });
        return JSON.parse(result);
    }

    // Browser fallback — direct API call
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://getdrift.app',
            'X-Title': 'Drift Screen Recorder',
        },
        body: JSON.stringify({
            model,
            messages,
            ...(maxTokens && { max_tokens: maxTokens }),
            ...(temperature && { temperature }),
        }),
    });

    if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${await response.text()}`);
    }

    return response.json();
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
 * Start native screen capture (captures frames in Rust via xcap)
 */
export async function startNativeCapture(config) {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('start_native_capture', { config });
    }
    throw new Error('Native capture only available in Tauri');
}

/**
 * Stop native capture and get stats
 */
export async function stopNativeCapture() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('stop_native_capture');
    }
    throw new Error('Native capture only available in Tauri');
}

/**
 * Get recording stats (frames captured, fps, etc.)
 */
export async function getRecordingStats() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('get_recording_stats');
    }
    return null;
}

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
 * Export captured frames to MP4 using FFmpeg
 */
export async function exportMp4(config) {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('export_mp4', { config });
    }
    throw new Error('MP4 export only available in Tauri');
}

/**
 * Export with compositing (zoom, cursor, background applied via GPU)
 */
export async function exportCompositedMp4(config, zoomSegments, cursorData, backgroundColor) {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('export_composited_mp4', {
            config, zoomSegments, cursorData, backgroundColor
        });
    }
    throw new Error('Composited export only available in Tauri');
}

/**
 * Check if FFmpeg is available
 */
export async function checkFfmpeg() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('check_ffmpeg');
    }
    return null;
}

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
 * Clear frame buffer to free memory
 */
export async function clearFrameBuffer() {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('clear_frame_buffer');
    }
}

/**
 * Convert WebM data to MP4 using native FFmpeg or GPU hardware encoder
 */
export async function convertWebmToMp4(webmData, config = {}) {
    if (isTauri()) {
        const api = await getTauriApi();
        const bytes = webmData instanceof Uint8Array ? Array.from(webmData) : (
            webmData instanceof ArrayBuffer ? Array.from(new Uint8Array(webmData)) : Array.from(webmData)
        );
        return api.invoke('convert_webm_to_mp4', {
            webmData: bytes,
            config,
        });
    }
    throw new Error('Native convertWebmToMp4 only available in Tauri');
}

// ============================================================
// GPU COMPOSITOR
// ============================================================

/**
 * Initialize GPU compositor
 */
export async function initCompositor(width = 1920, height = 1080) {
    if (isTauri()) {
        const api = await getTauriApi();
        return api.invoke('init_compositor', { width, height });
    }
    return 'GPU compositor not available (browser mode)';
}

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
// GLOBAL SHORTCUTS
// ============================================================

// Stores current registered shortcuts so we can unregister them
let _registeredShortcuts = [];

/**
 * Register global shortcuts from saved hotkey config.
 * Each shortcut dispatches a custom 'drift-hotkey' event on window.
 * @param {object} hotkeyConfig - { toggle_recording, pause_resume, cancel_recording, ... }
 * @returns {Promise<void>}
 */
export async function registerGlobalShortcuts(hotkeyConfig) {
    if (!isTauri()) return;
    const api = await getShortcutApi();
    if (!api) return;

    // Unregister any existing shortcuts first
    await unregisterAllShortcuts();

    const entries = Object.entries(hotkeyConfig || {});
    for (const [action, accelerator] of entries) {
        if (!accelerator || typeof accelerator !== 'string') continue;
        
        const variants = [
            accelerator,
            accelerator.replace(/^CmdOrCtrl/i, 'CommandOrControl'),
            accelerator.replace(/^CommandOrControl/i, 'Ctrl'),
            accelerator.replace(/^CmdOrCtrl/i, 'Ctrl'),
        ];
        const uniqueVariants = [...new Set(variants)];
        let registered = false;

        for (const candidate of uniqueVariants) {
            try {
                await api.register(candidate, (event) => {
                    // Only fire on key-down (not release)
                    if (event.state === 'Released') return;
                    window.dispatchEvent(new CustomEvent('drift-hotkey', {
                        detail: { action, accelerator: candidate }
                    }));
                });
                _registeredShortcuts.push(candidate);
                registered = true;
                break;
            } catch (err) {
                // Try next variant
            }
        }

        if (!registered) {
            console.warn(`[drift] Failed to register shortcut for ${action}:`, uniqueVariants);
        }
    }
    console.log('[drift] Registered global shortcuts:', _registeredShortcuts);
}

/**
 * Unregister all previously registered global shortcuts.
 */
export async function unregisterAllShortcuts() {
    if (!isTauri()) return;
    const api = await getShortcutApi();
    if (!api) return;

    for (const accel of _registeredShortcuts) {
        try {
            await api.unregister(accel);
        } catch (err) {
            // Ignore — may already be unregistered
        }
    }
    _registeredShortcuts = [];
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
 * Start a native screen capture session writing directly to disk
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
    aiCompletion,
    captureScreenshot,
    // Native capture pipeline
    startNativeCapture,
    stopNativeCapture,
    getRecordingStats,
    onNativeFrame,
    // MP4 export
    exportMp4,
    exportCompositedMp4,
    convertWebmToMp4,
    checkFfmpeg,
    onExportProgress,
    clearFrameBuffer,
    // GPU compositor
    initCompositor,
    // File system & dialog
    showSaveDialog,
    saveFile,
    // Global shortcuts
    registerGlobalShortcuts,
    unregisterAllShortcuts,
    // Native Multi-Track Cinema Session Pipeline
    isNativeCaptureSupported,
    startNativeSession,
    stopNativeSession,
    getNativeSessionStatus,
    resolveAssetUrl,
};

export default drift;
