const path = require('path');
const { app } = require('electron');

let server = null;
let serverUrl = 'http://localhost:3000';

async function startNextServer() {
    return new Promise(async (resolve, reject) => {
        try {
            // Get the correct path based on whether we're packaged or not
            const isDev = !app.isPackaged;

            if (isDev) {
                // In development, just use the existing dev server
                console.log('[Drift Server] Development mode - using existing dev server');
                resolve(serverUrl);
                return;
            }

            // In production, use Next.js programmatic API
            console.log('[Drift Server] Starting Next.js production server...');

            // Determine correct paths for packaged app
            const resourcesPath = process.resourcesPath;
            const appPath = path.join(resourcesPath, 'app.asar');

            // Set environment for Next.js
            process.env.NODE_ENV = 'production';

            // Dynamically require next
            const next = require('next');
            const http = require('http');

            const nextApp = next({
                dev: false,
                dir: appPath,
                conf: {
                    distDir: '.next'
                }
            });

            const handle = nextApp.getRequestHandler();

            await nextApp.prepare();

            server = http.createServer((req, res) => {
                handle(req, res);
            });

            server.listen(3000, 'localhost', (err) => {
                if (err) {
                    console.error('[Drift Server] Failed to start:', err);
                    reject(err);
                    return;
                }
                console.log('[Drift Server] Next.js server running on http://localhost:3000');
                resolve(serverUrl);
            });

        } catch (error) {
            console.error('[Drift Server] Error starting Next.js:', error);
            // Fallback: try to resolve anyway (app might still work with static files)
            resolve(serverUrl);
        }
    });
}

function stopNextServer() {
    if (server) {
        console.log('[Drift Server] Stopping Next.js server...');
        server.close();
        server = null;
    }
}

module.exports = { startNextServer, stopNextServer };
