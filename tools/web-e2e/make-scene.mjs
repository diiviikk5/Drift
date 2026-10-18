/**
 * Builds the E2E "screen": real screenshots of target.html in each UI state
 * (idle, button synced, note being typed) with a Windows pointer composited
 * along a known path, encoded as Y4M for Chrome's file-backed capture device.
 * Writes scene.y4m and truth.json (pointer path and click times, in ms).
 *
 *   node tools/web-e2e/make-scene.mjs <outDir>
 */
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { paintCursor } from '../../src/lib/vision/cursorTemplates.js';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

export const W = 1600, H = 900, FPS = 30, DURATION = 16000;
const OUT = path.resolve(process.argv[2] || path.join(here, '../../.e2e-out'));
fs.mkdirSync(OUT, { recursive: true });

const NOTE = 'ship it today';

// 1. Screenshots of each UI state.
const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto('file://' + path.join(here, 'target.html'));
const shots = [];
const shot = async (name) => {
    const file = path.join(OUT, `state-${name}.png`);
    await page.screenshot({ path: file });
    shots.push(file);
    return shots.length - 1;
};
const sIdle = await shot('idle');
const sync = await page.locator('#sync').boundingBox();
const note = await page.locator('#note').boundingBox();
await page.evaluate(() => document.getElementById('sync').click());
const sSynced = await shot('synced');
await page.focus('#note');
const sFocused = await shot('focused');
const typed = [];
for (let i = 1; i <= NOTE.length; i++) {
    await page.fill('#note', NOTE.slice(0, i));
    typed.push(await shot(`typed-${i}`));
}
await browser.close();

// Raw RGBA for each state.
const states = shots.map((file) => {
    const r = spawnSync('ffmpeg', ['-loglevel', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], { maxBuffer: W * H * 4 + 1024 });
    if (r.status !== 0 || r.stdout.length !== W * H * 4) throw new Error(`decode ${file}: ${r.stderr}`);
    return new Uint8ClampedArray(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length);
});

// 2. Pointer path and UI timeline (ms).
const btn = [Math.round(sync.x + sync.width / 2), Math.round(sync.y + sync.height / 2)];
const inp = [Math.round(note.x + 60), Math.round(note.y + note.height / 2)];
const CLICK_SYNC = 5200;
const CLICK_NOTE = 8600;
const TYPE_START = 9800;
const TYPE_STEP = 140;
const keys = [
    [0, 1300, 700], [2500, 1300, 700], [3400, 760, 520], [3900, 760, 520],
    [4700, btn[0], btn[1]], [CLICK_SYNC + 900, btn[0], btn[1]],
    [7600, inp[0], inp[1]], [CLICK_NOTE + 500, inp[0], inp[1]],
    [9500, inp[0] + 260, inp[1] + 140], [12500, inp[0] + 260, inp[1] + 140],
    [13600, 1300, 300], [DURATION, 1300, 300],
];
function pathAt(t) {
    if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
    for (let i = 1; i < keys.length; i++) {
        if (t <= keys[i][0]) {
            const [ta, xa, ya] = keys[i - 1], [tb, xb, yb] = keys[i];
            const k = (t - ta) / (tb - ta);
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            return [xa + (xb - xa) * e, ya + (yb - ya) * e];
        }
    }
    return [keys[keys.length - 1][1], keys[keys.length - 1][2]];
}
function stateAt(t) {
    if (t < CLICK_SYNC + 120) return sIdle;          // the UI reacts ~120 ms after the click
    if (t < CLICK_NOTE + 100) return sSynced;
    if (t < TYPE_START) return sFocused;
    const n = Math.min(typed.length, Math.floor((t - TYPE_START) / TYPE_STEP) + 1);
    return typed[n - 1];
}

// 3. Encode.
const y4m = path.join(OUT, 'scene.y4m');
const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-', '-pix_fmt', 'yuv420p', y4m], { stdio: ['pipe', 'inherit', 'inherit'] });
const frames = Math.round((DURATION / 1000) * FPS);
for (let f = 0; f < frames; f++) {
    const t = (f * 1000) / FPS;
    const buf = new Uint8ClampedArray(states[stateAt(t)]);
    const [x, y] = pathAt(t);
    paintCursor(buf, W, H, 'arrow-win', x, y);
    if (!ff.stdin.write(Buffer.from(buf.buffer))) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));

const truth = {
    width: W, height: H, fps: FPS, duration: DURATION,
    clicks: [{ time: CLICK_SYNC, x: btn[0] / W, y: btn[1] / H }, { time: CLICK_NOTE, x: inp[0] / W, y: inp[1] / H }],
    typing: { start: TYPE_START, end: TYPE_START + NOTE.length * TYPE_STEP, chars: NOTE.length },
    path: keys.map(([t, x, y]) => ({ time: t, x: x / W, y: y / H })),
};
fs.writeFileSync(path.join(OUT, 'truth.json'), JSON.stringify(truth, null, 2));
console.log(JSON.stringify({ y4m, frames, truth: truth.clicks }));
