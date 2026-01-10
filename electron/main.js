const { app, BrowserWindow, ipcMain, screen, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
const { startNextServer, stopNextServer } = require('./server');

// Safe Import for Global Input Hook
let uIOhook, UiohookKey;
try {
    const hook = require('uiohook-napi');
    uIOhook = hook.uIOhook;
    UiohookKey = hook.UiohookKey;
} catch (e) {
    console.warn("Global Input Hook (uiohook-napi) failed to load. Click tracking will be disabled.", e);
}

let mainWindow;

// Hotkey configuration with defaults
let hotkeyConfig = {
    start: { key: 'S', ctrl: true, shift: true, alt: false },
    stop: { key: 'X', ctrl: true, shift: true, alt: false }
};

// Config file path
const configPath = path.join(app.getPath('userData'), 'hotkeys.json');

// Load saved hotkeys
function loadHotkeys() {
    try {
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, 'utf8');
            hotkeyConfig = JSON.parse(data);
            console.log('[Drift Main] Loaded hotkeys:', hotkeyConfig);
        }
    } catch (e) {
        console.error('[Drift Main] Error loading hotkeys:', e);
    }
}

// Save hotkeys to file
function saveHotkeys() {
    try {
        fs.writeFileSync(configPath, JSON.stringify(hotkeyConfig, null, 2));
        console.log('[Drift Main] Saved hotkeys:', hotkeyConfig);
    } catch (e) {
        console.error('[Drift Main] Error saving hotkeys:', e);
    }
}

// Get keycode from key letter
function getKeycode(key) {
    const keyMap = {
        'A': UiohookKey?.A, 'B': UiohookKey?.B, 'C': UiohookKey?.C, 'D': UiohookKey?.D,
        'E': UiohookKey?.E, 'F': UiohookKey?.F, 'G': UiohookKey?.G, 'H': UiohookKey?.H,
        'I': UiohookKey?.I, 'J': UiohookKey?.J, 'K': UiohookKey?.K, 'L': UiohookKey?.L,
        'M': UiohookKey?.M, 'N': UiohookKey?.N, 'O': UiohookKey?.O, 'P': UiohookKey?.P,
        'Q': UiohookKey?.Q, 'R': UiohookKey?.R, 'S': UiohookKey?.S, 'T': UiohookKey?.T,
        'U': UiohookKey?.U, 'V': UiohookKey?.V, 'W': UiohookKey?.W, 'X': UiohookKey?.X,
        'Y': UiohookKey?.Y, 'Z': UiohookKey?.Z,
        '1': UiohookKey?.Num1, '2': UiohookKey?.Num2, '3': UiohookKey?.Num3,
        '4': UiohookKey?.Num4, '5': UiohookKey?.Num5, '6': UiohookKey?.Num6,
        '7': UiohookKey?.Num7, '8': UiohookKey?.Num8, '9': UiohookKey?.Num9, '0': UiohookKey?.Num0,
        'F1': UiohookKey?.F1, 'F2': UiohookKey?.F2, 'F3': UiohookKey?.F3, 'F4': UiohookKey?.F4,
        'F5': UiohookKey?.F5, 'F6': UiohookKey?.F6, 'F7': UiohookKey?.F7, 'F8': UiohookKey?.F8,
        'F9': UiohookKey?.F9, 'F10': UiohookKey?.F10, 'F11': UiohookKey?.F11, 'F12': UiohookKey?.F12,
    };
    return keyMap[key.toUpperCase()];
}

function createWindow(productionUrl) {
    let dims = { width: 800, height: 600 };
    try {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        dims = { width, height };
    } catch (e) { }

    mainWindow = new BrowserWindow({
        width: Math.min(1400, dims.width),
        height: Math.min(850, dims.height),
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, '../public/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    const startUrl = process.env.ELECTRON_START_URL || productionUrl || 'http://localhost:3000/recorder';
    console.log('[Drift Main] Loading URL:', startUrl);
    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', () => (mainWindow = null));

    setupInputHooks();
}

function setupInputHooks() {
    if (!uIOhook) {
        console.warn('[Drift Main] uIOhook not available - clicks will not be tracked');
        return;
    }

    console.log('[Drift Main] Setting up input hooks...');

    uIOhook.on('mousedown', (e) => {
        console.log('[Drift Main] Mouse click detected:', e.x, e.y);
        if (mainWindow && !mainWindow.isDestroyed()) {
            try {
                const { width, height } = screen.getPrimaryDisplay().bounds;
                const data = {
                    x: e.x / width,
                    y: e.y / height,
                    rawX: e.x,
                    rawY: e.y,
                    timestamp: Date.now()
                };
                console.log('[Drift Main] Sending GLOBAL_CLICK:', data);
                mainWindow.webContents.send('GLOBAL_CLICK', data);
            } catch (err) { console.error("Error processing click", err); }
        }
    });

    uIOhook.on('keydown', (e) => {
        // Check Stop hotkey
        const stopKey = getKeycode(hotkeyConfig.stop.key);
        if (stopKey && e.keycode === stopKey) {
            const modMatch =
                (hotkeyConfig.stop.ctrl ? e.ctrlKey : !e.ctrlKey) &&
                (hotkeyConfig.stop.shift ? e.shiftKey : !e.shiftKey) &&
                (hotkeyConfig.stop.alt ? e.altKey : !e.altKey);

            // Simpler check - just require the modifiers that are set
            const simpleMatch =
                (!hotkeyConfig.stop.ctrl || e.ctrlKey) &&
                (!hotkeyConfig.stop.shift || e.shiftKey) &&
                (!hotkeyConfig.stop.alt || e.altKey);

            if (simpleMatch && (hotkeyConfig.stop.ctrl || hotkeyConfig.stop.shift || hotkeyConfig.stop.alt)) {
                console.log('[Drift Main] Stop hotkey detected');
                if (mainWindow) mainWindow.webContents.send('GLOBAL_HOTKEY', 'STOP');
            }
        }

        // Check Start hotkey
        const startKey = getKeycode(hotkeyConfig.start.key);
        if (startKey && e.keycode === startKey) {
            const simpleMatch =
                (!hotkeyConfig.start.ctrl || e.ctrlKey) &&
                (!hotkeyConfig.start.shift || e.shiftKey) &&
                (!hotkeyConfig.start.alt || e.altKey);

            if (simpleMatch && (hotkeyConfig.start.ctrl || hotkeyConfig.start.shift || hotkeyConfig.start.alt)) {
                console.log('[Drift Main] Start hotkey detected');
                if (mainWindow) mainWindow.webContents.send('GLOBAL_HOTKEY', 'START');
            }
        }
    });

    try {
        uIOhook.start();
        console.log('[Drift Main] uIOhook started successfully');
    } catch (e) { console.error("Failed to start input hook", e); }
}

// IPC Handlers
ipcMain.handle('GET_SOURCES', async () => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['window', 'screen'],
            thumbnailSize: { width: 150, height: 150 }
        });
        return sources.map(s => ({
            id: s.id,
            name: s.name,
            thumbnailDataUrl: s.thumbnail.toDataURL()
        }));
    } catch (e) {
        console.error('[Drift Main] GET_SOURCES error:', e);
        return [];
    }
});

ipcMain.handle('GET_HOTKEYS', () => {
    return hotkeyConfig;
});

ipcMain.handle('SET_HOTKEYS', (event, hotkeys) => {
    hotkeyConfig = hotkeys;
    saveHotkeys();
    return hotkeyConfig;
});

app.on('ready', async () => {
    loadHotkeys();
    let prodUrl = null;
    if (app.isPackaged) {
        const serverBase = await startNextServer();
        prodUrl = `${serverBase}/recorder`;
    }
    createWindow(prodUrl);
});

app.on('window-all-closed', () => {
    if (uIOhook) uIOhook.stop();
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

app.on('before-quit', () => {
    stopNextServer();
});
