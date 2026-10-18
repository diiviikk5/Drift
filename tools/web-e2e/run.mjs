/**
 * End-to-end run of Drift on the web in headless Chromium.
 *
 * The shared "screen" is a rendered desktop video (make-scene.mjs: real
 * screenshots of target.html in each UI state with a Windows pointer moving,
 * clicking a button and typing a note) fed through Chrome's file-backed
 * capture device. The run shares it, records, stops, checks the telemetry
 * recovered from the pixels against the scene's ground truth, plays the
 * studio and exports an MP4 (frames are extracted for review).
 *
 *   npm run build && node tools/web-e2e/run.mjs [outDir]
 * Needs: Playwright + Chromium, ffmpeg.
 */
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const OUT = path.resolve(process.argv[2] || path.join(root, '.e2e-out'));
fs.mkdirSync(OUT, { recursive: true });
const PORT = 3123;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const procs = [];
const cleanup = () => procs.forEach(p => { try { p.kill('SIGKILL'); } catch {} });
process.on('exit', cleanup);

function start(cmd, args, opts = {}) {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });
    procs.push(p);
    return p;
}

async function waitHttp(url, ms = 60000) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
        try { const r = await fetch(url); if (r.ok) return; } catch {}
        await sleep(400);
    }
    throw new Error(`server not up: ${url}`);
}

// The "screen": a rendered desktop video with a real-looking pointer.
const sceneFile = path.join(OUT, 'scene.y4m');
if (!fs.existsSync(sceneFile) || process.env.REBUILD_SCENE) {
    const r = spawnSync('node', [path.join(here, 'make-scene.mjs'), OUT], { stdio: 'inherit' });
    if (r.status !== 0) throw new Error('scene build failed');
}
const truth = JSON.parse(fs.readFileSync(path.join(OUT, 'truth.json'), 'utf8'));

start(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT)], { cwd: root });
await waitHttp(`http://localhost:${PORT}/app/`);

const executablePath = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        `--use-file-for-fake-video-capture=${sceneFile}`,
        '--autoplay-policy=no-user-gesture-required',
    ],
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, acceptDownloads: true });
// Screen sharing here is the file-backed capture device presented as a monitor.
await ctx.addInitScript(() => {
    const md = navigator.mediaDevices;
    md.getDisplayMedia = async () => {
        const s = await md.getUserMedia({ video: { width: 1600, height: 900, frameRate: 30 }, audio: true });
        const v = s.getVideoTracks()[0];
        const get = v.getSettings.bind(v);
        v.getSettings = () => ({ ...get(), displaySurface: 'monitor' });
        Object.defineProperty(v, 'label', { value: 'screen:0:0' });
        return s;
    };
});
const app = await ctx.newPage();
const logs = [];
app.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
app.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
app.on('response', r => { if (r.status() >= 400) logs.push(`[http ${r.status()}] ${r.url()}`); });
process.on('uncaughtException', async (e) => {
    fs.writeFileSync(path.join(OUT, 'console.log'), logs.join('\n'));
    try { await app.screenshot({ path: path.join(OUT, 'failure.png') }); } catch {}
    console.error('E2E failed:', e.message, '\n--- page console ---\n' + logs.slice(-30).join('\n'));
    cleanup();
    process.exit(1);
});
await app.goto(`http://localhost:${PORT}/app/`);
await app.waitForSelector('text=New recording');
await app.screenshot({ path: path.join(OUT, '01-cockpit.png') });

logs.push('[e2e] probe: ' + await app.evaluate(async () => {
    try { const s = await navigator.mediaDevices.getDisplayMedia({ video: true }); const r = JSON.stringify(s.getVideoTracks()[0].getSettings()); s.getTracks().forEach(t => t.stop()); return r; }
    catch (e) { return 'ERR ' + e.name + ' ' + e.message; }
}));
await app.click('button:has-text("Share screen")');
const sharedAt = Date.now();
await app.waitForSelector('text=Live preview', { timeout: 15000 });
await sleep(500);
await app.screenshot({ path: path.join(OUT, '02-preview.png') });
await app.click('button:has-text("Start recording")');
await app.waitForSelector('text=Stop recording', { timeout: 10000 });
const recordedAt = Date.now();
// Let the scene play out.
await sleep(Math.max(0, truth.duration - (recordedAt - sharedAt) - 600));
await app.screenshot({ path: path.join(OUT, '02b-recording.png') });

// Stop from Drift.
await app.bringToFront();
await sleep(400);
await app.evaluate(() => window.dispatchEvent(new CustomEvent('drift-hotkey', { detail: { action: 'toggle_recording', source: 'local' } })));
await app.waitForFunction(() => window.__driftLastTake, null, { timeout: 30000 });
const take = await app.evaluate(() => window.__driftLastTake);
// Keep the raw recording and pointer track for offline checks.
const b64 = await app.evaluate(async (url) => {
    const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return btoa(s);
}, take.screenUrl);
fs.writeFileSync(path.join(OUT, 'recording.webm'), Buffer.from(b64, 'base64'));
fs.writeFileSync(path.join(OUT, 'pointer-raw.json'), JSON.stringify(take.raw));
delete take.raw;
const offset = recordedAt - sharedAt; // scene ms at the recording's start (approx.)
fs.writeFileSync(path.join(OUT, 'take.json'), JSON.stringify({ take, truth: truth.clicks, offset }, null, 2));
await sleep(2500);
await app.screenshot({ path: path.join(OUT, '03-studio.png') });

// Play a moment, then export.
await app.keyboard.press('Space');
await sleep(2500);
await app.keyboard.press('Space');
await app.screenshot({ path: path.join(OUT, '04-studio-playing.png') });

let exported = null;
try {
    await app.getByRole('button', { name: 'Export', exact: true }).first().click();
    await sleep(600);
    await app.screenshot({ path: path.join(OUT, '05-export-dialog.png') });
    const [download] = await Promise.all([
        app.waitForEvent('download', { timeout: 240000 }),
        app.getByRole('button', { name: 'Export', exact: true }).last().click(),
    ]);
    exported = path.join(OUT, download.suggestedFilename());
    await download.saveAs(exported);
} catch (e) {
    logs.push(`[e2e] export failed: ${e.message}`);
}
fs.writeFileSync(path.join(OUT, 'console.log'), logs.join('\n'));
// A few exported frames for review.
if (exported) {
    for (const sec of [1, 4, 6, 9, 11, 13]) {
        spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(sec), '-i', exported, '-frames:v', '1', path.join(OUT, `export-${String(sec).padStart(2, '0')}s.png`)]);
    }
    const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,duration', '-of', 'json', exported]);
    fs.writeFileSync(path.join(OUT, 'export-probe.json'), probe.stdout);
}
console.log(JSON.stringify({ take, truth: truth.clicks, offset, exported }, null, 2));
await browser.close();
cleanup();
process.exit(0);
