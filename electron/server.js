const { spawn } = require('child_process');
const path = require('path');
const { app } = require('electron');

let nextServer = null;

function startNextServer() {
    return new Promise((resolve, reject) => {
        const nextPath = path.join(__dirname, '../node_modules/.bin/next.cmd');
        const projectPath = path.join(__dirname, '..');
        
        console.log('[Drift Server] Starting Next.js server...');
        
        nextServer = spawn(nextPath, ['start', '-p', '3000'], {
            cwd: projectPath,
            stdio: 'pipe',
            shell: true
        });

        nextServer.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('[Next.js]', output);
            
            // Wait for "Ready" or "started server" message
            if (output.includes('Ready') || output.includes('started server') || output.includes('Local:')) {
                resolve();
            }
        });

        nextServer.stderr.on('data', (data) => {
            console.error('[Next.js Error]', data.toString());
        });

        nextServer.on('error', (error) => {
            console.error('[Drift Server] Failed to start Next.js:', error);
            reject(error);
        });

        // Timeout fallback
        setTimeout(() => resolve(), 5000);
    });
}

function stopNextServer() {
    if (nextServer) {
        console.log('[Drift Server] Stopping Next.js server...');
        nextServer.kill();
        nextServer = null;
    }
}

module.exports = { startNextServer, stopNextServer };
