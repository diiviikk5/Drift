const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Listen for global clicks from main process
    onGlobalClick: (callback) => ipcRenderer.on('GLOBAL_CLICK', (event, data) => callback(data)),

    // Listen for global hotkeys
    onGlobalHotkey: (callback) => ipcRenderer.on('GLOBAL_HOTKEY', (event, action) => callback(action)),

    // Get Screen Sources (Electron specific API)
    getSources: () => ipcRenderer.invoke('GET_SOURCES'),

    // Cleanup listeners
    removeListener: (channel) => ipcRenderer.removeAllListeners(channel)
});
