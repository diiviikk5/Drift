const { app, BrowserWindow, ipcMain, screen, desktopCapturer } = require('electron');
const path = require('path');

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

function createWindow() {
    // Basic screen selection logic might fail if uiohook crashes early, so we guard it
    let dims = { width: 800, height: 600 };
    try {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        dims = { width, height };
    } catch (e) { }

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        backgroundColor: '#000',
        icon: path.join(__dirname, '..', 'build', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            backgroundThrottling: false
        }
    });

    // In production, load from the packaged static export
    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../.next-electron/recorder.html'));
    } else {
        // In dev mode, use the Next.js dev server
        const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000/recorder';
        mainWindow.loadURL(startUrl);
    }

    // Open DevTools in dev mode (uncomment for debugging)
    // mainWindow.webContents.openDevTools();

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
        // Stop: Ctrl + Shift + X
        if (e.keycode === UiohookKey.X && e.ctrlKey && e.shiftKey) {
            console.log('[Drift Main] Stop hotkey detected');
            if (mainWindow) mainWindow.webContents.send('GLOBAL_HOTKEY', 'STOP');
        }
        // Start: Ctrl + Shift + S
        if (e.keycode === UiohookKey.S && e.ctrlKey && e.shiftKey) {
            console.log('[Drift Main] Start hotkey detected');
            if (mainWindow) mainWindow.webContents.send('GLOBAL_HOTKEY', 'START');
        }
    });

    try {
        uIOhook.start();
        console.log('[Drift Main] uIOhook started successfully');
    } catch (e) { console.error("Failed to start input hook", e); }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (uIOhook) uIOhook.stop();
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

// IPC: Get Screen Sources
ipcMain.handle('GET_SOURCES', async () => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['window', 'screen'],
            thumbnailSize: { width: 150, height: 150 }
        });
        // Serialize NativeImage to DataURL for IPC
        return sources.map(src => ({
            id: src.id,
            name: src.name,
            thumbnailDataUrl: src.thumbnail.toDataURL()
        }));
    } catch (e) {
        console.error("Failed to get sources", e);
        return [];
    }
});
