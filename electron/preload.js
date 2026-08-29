const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // High-Density Telemetry & Clicks
    onGlobalClick: (callback) => {
        const listener = (event, data) => callback(data);
        ipcRenderer.on('GLOBAL_CLICK', listener);
        return () => ipcRenderer.removeListener('GLOBAL_CLICK', listener);
    },

    onGlobalMouseMove: (callback) => {
        const listener = (event, data) => callback(data);
        ipcRenderer.on('GLOBAL_MOVE', listener);
        return () => ipcRenderer.removeListener('GLOBAL_MOVE', listener);
    },

    // Global Hotkeys
    onGlobalHotkey: (callback) => {
        const listener = (event, action) => callback(action);
        ipcRenderer.on('GLOBAL_HOTKEY', listener);
        return () => ipcRenderer.removeListener('GLOBAL_HOTKEY', listener);
    },

    // Screen Sources
    getSources: () => ipcRenderer.invoke('GET_SOURCES'),

    // Floating Controller Pill
    showControllerPill: () => ipcRenderer.invoke('SHOW_CONTROLLER_PILL'),
    hideControllerPill: () => ipcRenderer.invoke('HIDE_CONTROLLER_PILL'),
    sendToMain: (channel, data) => ipcRenderer.send(channel, data),

    // Save & Disk Operations
    showSaveDialog: (options) => ipcRenderer.invoke('SHOW_SAVE_DIALOG', options),
    saveFile: (filePath, buffer) => ipcRenderer.invoke('SAVE_FILE', filePath, buffer),

    // Hotkey Management
    getHotkeys: () => ipcRenderer.invoke('GET_HOTKEYS'),
    setHotkeys: (hotkeys) => ipcRenderer.invoke('SET_HOTKEYS', hotkeys),

    removeListener: (channel) => ipcRenderer.removeAllListeners(channel)
});
