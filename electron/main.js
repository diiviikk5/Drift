const { app, BrowserWindow, ipcMain, screen, desktopCapturer, dialog, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { startNextServer, stopNextServer } = require('./server');

// Global Input Hook for unthrottled 120Hz/240Hz telemetry & clicks
let uIOhook, UiohookKey;
try {
    const hook = require('uiohook-napi');
    uIOhook = hook.uIOhook;
    UiohookKey = hook.UiohookKey;
} catch (e) {
    console.warn("[Drift Main] Global Input Hook (uiohook-napi) failed to load:", e);
}

let mainWindow = null;
let controllerWindow = null;
let tray = null;

// Hotkey configuration
let hotkeyConfig = {
    toggle_recording: 'CommandOrControl+Shift+R',
    stop_recording: 'CommandOrControl+Shift+S',
    toggle_pause: 'CommandOrControl+Shift+P',
    toggle_zoom: 'CommandOrControl+Shift+Z',
};

const configPath = path.join(app.getPath('userData'), 'hotkeys.json');

function loadHotkeys() {
    try {
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, 'utf8');
            hotkeyConfig = { ...hotkeyConfig, ...JSON.parse(data) };
            console.log('[Drift Main] Loaded hotkeys:', hotkeyConfig);
        }
    } catch (e) {
        console.error('[Drift Main] Error loading hotkeys:', e);
    }
}

function saveHotkeys() {
    try {
        fs.writeFileSync(configPath, JSON.stringify(hotkeyConfig, null, 2));
    } catch (e) {
        console.error('[Drift Main] Error saving hotkeys:', e);
    }
}

function createMainWindow(productionUrl) {
    let dims = { width: 1400, height: 880 };
    try {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        dims = {
            width: Math.min(1520, Math.floor(width * 0.92)),
            height: Math.min(960, Math.floor(height * 0.92))
        };
    } catch (e) { }

    mainWindow = new BrowserWindow({
        width: dims.width,
        height: dims.height,
        minWidth: 920,
        minHeight: 660,
        backgroundColor: '#07070a',
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            backgroundThrottling: false,
            webSecurity: true,
        }
    });

    const startUrl = process.env.ELECTRON_START_URL || productionUrl || 'http://localhost:3000/recorder';
    console.log('[Drift Main] Loading URL:', startUrl);
    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (controllerWindow) controllerWindow.close();
    });

    setupGlobalShortcuts();
    setupInputHooks();
    setupTray();
}

// ── Floating Controller Pill Window (While Recording) ──
function createControllerWindow() {
    if (controllerWindow) {
        controllerWindow.show();
        return;
    }

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    controllerWindow = new BrowserWindow({
        width: 320,
        height: 64,
        x: Math.floor((width - 320) / 2),
        y: height - 100,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    const pillHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body { background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; -webkit-app-region: drag; }
            .pill {
                display: flex; align-items: center; gap: 10px;
                background: rgba(15, 15, 20, 0.85); backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 40px; padding: 8px 16px;
                box-shadow: 0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
                color: #fff; font-size: 12px; font-weight: 600;
            }
            .rec-dot { width: 10px; height: 10px; background: #ef4444; border-radius: 50%; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 6px #ef4444); } 100% { transform: scale(0.9); opacity: 0.8; } }
            .timer { font-variant-numeric: tabular-nums; letter-spacing: 0.5px; color: #f3f4f6; }
            .btn { -webkit-app-region: no-drag; cursor: pointer; border: none; border-radius: 20px; padding: 5px 10px; font-size: 11px; font-weight: 700; transition: all 0.15s; }
            .btn-stop { background: #ef4444; color: #fff; }
            .btn-stop:hover { background: #dc2626; transform: scale(1.04); }
            .btn-zoom { background: rgba(220, 254, 80, 0.2); color: #DCFE50; border: 1px solid rgba(220, 254, 80, 0.4); }
            .btn-zoom:hover { background: rgba(220, 254, 80, 0.35); }
        </style>
    </head>
    <body>
        <div class="pill">
            <div class="rec-dot"></div>
            <span class="timer" id="timer">00:00</span>
            <button class="btn btn-zoom" id="btn-zoom">+ Zoom</button>
            <button class="btn btn-stop" id="btn-stop">■ Stop</button>
        </div>
        <script>
            let startTime = Date.now();
            setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
                const s = String(elapsed % 60).padStart(2, '0');
                document.getElementById('timer').innerText = m + ':' + s;
            }, 1000);
            document.getElementById('btn-stop').onclick = () => window.electron?.sendToMain('PILL_STOP');
            document.getElementById('btn-zoom').onclick = () => window.electron?.sendToMain('PILL_ADD_ZOOM');
        </script>
    </body>
    </html>
    `;

    controllerWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(pillHtml)}`);
    controllerWindow.on('closed', () => (controllerWindow = null));
}

function hideControllerWindow() {
    if (controllerWindow) {
        controllerWindow.hide();
    }
}

// ── System Tray ──
function setupTray() {
    if (tray) return;
    try {
        const iconPath = path.join(__dirname, '../public/icon.ico');
        const icon = nativeImage.createFromPath(iconPath);
        tray = new Tray(icon);
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Open Drift Studio', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
            { type: 'separator' },
            { label: 'Start Recording (Ctrl+Shift+R)', click: () => { if (mainWindow) mainWindow.webContents.send('GLOBAL_HOTKEY', 'TOGGLE_RECORDING'); } },
            { label: 'Stop Recording (Ctrl+Shift+S)', click: () => { if (mainWindow) mainWindow.webContents.send('GLOBAL_HOTKEY', 'STOP'); } },
            { type: 'separator' },
            { label: 'Quit Drift', click: () => app.quit() }
        ]);
        tray.setToolTip('Drift - Screen Studio');
        tray.setContextMenu(contextMenu);
        tray.on('click', () => {
            if (mainWindow) {
                if (mainWindow.isVisible()) mainWindow.focus();
                else mainWindow.show();
            }
        });
    } catch (e) {
        console.warn('[Drift Main] Tray setup failed:', e);
    }
}

function setupGlobalShortcuts() {
    globalShortcut.unregisterAll();

    try {
        if (hotkeyConfig.toggle_recording) {
            globalShortcut.register(hotkeyConfig.toggle_recording, () => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('GLOBAL_HOTKEY', 'TOGGLE_RECORDING');
                }
            });
        }
        if (hotkeyConfig.stop_recording) {
            globalShortcut.register(hotkeyConfig.stop_recording, () => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('GLOBAL_HOTKEY', 'STOP');
                }
            });
        }
        if (hotkeyConfig.toggle_zoom) {
            globalShortcut.register(hotkeyConfig.toggle_zoom, () => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('GLOBAL_HOTKEY', 'ADD_ZOOM');
                }
            });
        }
    } catch (err) {
        console.warn('[Drift Main] Failed to register global shortcuts:', err);
    }
}

function setupInputHooks() {
    if (!uIOhook) {
        console.warn('[Drift Main] uIOhook not available');
        return;
    }

    console.log('[Drift Main] Starting unthrottled mouse & click telemetry...');

    // Global Click Listener
    uIOhook.on('mousedown', (e) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            try {
                const { width, height } = screen.getPrimaryDisplay().bounds;
                const data = {
                    x: e.x / width,
                    y: e.y / height,
                    rawX: e.x,
                    rawY: e.y,
                    button: e.button === 1 ? 'left' : e.button === 2 ? 'right' : 'middle',
                    timestamp: Date.now()
                };
                mainWindow.webContents.send('GLOBAL_CLICK', data);
            } catch (err) { }
        }
    });

    // Global Mouse Move Listener (120Hz/240Hz smooth tracking)
    uIOhook.on('mousemove', (e) => {
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
                mainWindow.webContents.send('GLOBAL_MOVE', data);
            } catch (err) { }
        }
    });

    try {
        uIOhook.start();
        console.log('[Drift Main] uIOhook telemetry active');
    } catch (e) {
        console.error('[Drift Main] Failed to start input hook:', e);
    }
}

// ── IPC Handlers ──

// Source enumeration
ipcMain.handle('GET_SOURCES', async () => {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen', 'window'],
            thumbnailSize: { width: 320, height: 180 },
            fetchWindowIcons: true,
        });
        return sources.map(s => ({
            id: s.id,
            name: s.name,
            thumbnailDataUrl: s.thumbnail.toDataURL(),
            display_type: s.id.startsWith('screen') ? 'Screen' : 'Window',
        }));
    } catch (e) {
        console.error('[Drift Main] GET_SOURCES error:', e);
        return [];
    }
});

// Floating controller pill triggers
ipcMain.handle('SHOW_CONTROLLER_PILL', () => {
    createControllerWindow();
    return true;
});

ipcMain.handle('HIDE_CONTROLLER_PILL', () => {
    hideControllerWindow();
    return true;
});

ipcMain.on('PILL_STOP', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('GLOBAL_HOTKEY', 'STOP');
    }
    hideControllerWindow();
});

ipcMain.on('PILL_ADD_ZOOM', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('GLOBAL_HOTKEY', 'ADD_ZOOM');
    }
});

// Save Dialog
ipcMain.handle('SHOW_SAVE_DIALOG', async (event, options) => {
    try {
        const result = await dialog.showSaveDialog(mainWindow, options || {
            defaultPath: `drift-recording-${Date.now()}.mp4`,
            filters: [{ name: 'MP4 Video', extensions: ['mp4'] }, { name: 'WebM Video', extensions: ['webm'] }]
        });
        return result.canceled ? null : result.filePath;
    } catch (e) {
        console.error('[Drift Main] Save dialog error:', e);
        return null;
    }
});

// Native Direct Disk Write
ipcMain.handle('SAVE_FILE', async (event, filePath, buffer) => {
    try {
        await fs.promises.writeFile(filePath, Buffer.from(buffer));
        console.log('[Drift Main] Successfully wrote file to:', filePath);
        return true;
    } catch (e) {
        console.error('[Drift Main] Failed to write file:', e);
        throw e;
    }
});

ipcMain.handle('GET_HOTKEYS', () => hotkeyConfig);

ipcMain.handle('SET_HOTKEYS', (event, hotkeys) => {
    hotkeyConfig = { ...hotkeyConfig, ...hotkeys };
    saveHotkeys();
    setupGlobalShortcuts();
    return hotkeyConfig;
});

// App Lifecycle
app.on('ready', async () => {
    loadHotkeys();
    let prodUrl = null;
    if (app.isPackaged) {
        const serverBase = await startNextServer();
        prodUrl = `${serverBase}/recorder`;
    }
    createMainWindow(prodUrl);
});

app.on('window-all-closed', () => {
    if (uIOhook) {
        try { uIOhook.stop(); } catch (e) { }
    }
    globalShortcut.unregisterAll();
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createMainWindow();
});

app.on('before-quit', () => {
    stopNextServer();
});
