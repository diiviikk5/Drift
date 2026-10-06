/**
 * Replay a recorded session's synthetic pointer frame by frame and report
 * anything a viewer would read as flicker: opacity blinks, shape swaps and
 * jittery motion.
 *
 *   node tools/cursor-audit.mjs [sessionDir...]
 *
 * With no arguments, audits the newest sessions in %LOCALAPPDATA%/Drift/sessions.
 */

import fs from 'fs';
import path from 'path';
import { sampleCursor, cursorAreaOpacity, cursorIdleOpacity } from '../src/lib/rendering/renderFrame.js';
import { typingPointerOpacity } from '../src/lib/zoom/typingFocus.js';
import { cursorShapeState } from '../src/lib/rendering/cursorShapes.js';

const FPS = 60;

function loadSession(dir) {
    const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
    const meta = read('session.json') || {};
    const w = meta.width || 1920;
    const h = meta.height || 1080;
    const moves = (read('telemetry.json') || []).map(s => {
        const u = s.x / w;
        const v = s.y / h;
        const hidden = u < -0.005 || u > 1.005 || v < -0.005 || v > 1.005;
        return { time: s.t, x: Math.max(0, Math.min(1, u)), y: Math.max(0, Math.min(1, v)), click: s.click || undefined, ...(hidden ? { hidden } : {}) };
    });
    const shapes = (read('cursor_shapes.json') || []).map(c => ({ time: c.t, shape: c.shape }));
    return { name: path.basename(dir), moves, keys: read('keystrokes.json') || [], shapes, duration: (meta.duration_ms || 10000) / 1000, w, h };
}

export function audit(session) {
    const { moves, keys, shapes, duration, h } = session;
    const frames = [];
    for (let i = 0; i <= duration * FPS; i++) {
        const t = i / FPS;
        const c = sampleCursor(t, moves, true);
        const opacity = cursorAreaOpacity(t, moves) * typingPointerOpacity(t, keys, moves);
        const st = cursorShapeState(t, shapes);
        frames.push({ t, x: c ? c.x * session.w : 0, y: c ? c.y * h : 0, opacity, shape: st.shape });
    }
    const report = { name: session.name, frames: frames.length, opacityJumps: 0, blinks: [], shapeSwaps: 0, shortShapes: 0, jitterFrames: 0, maxStepPx: 0 };
    let lastShapeAt = 0;
    for (let i = 1; i < frames.length; i++) {
        const a = frames[i - 1];
        const b = frames[i];
        if (Math.abs(b.opacity - a.opacity) > 0.25) report.opacityJumps++;
        if (b.shape !== a.shape) {
            report.shapeSwaps++;
            if (b.t - lastShapeAt < 0.25) report.shortShapes++;
            lastShapeAt = b.t;
        }
        const step = Math.hypot(b.x - a.x, b.y - a.y);
        report.maxStepPx = Math.max(report.maxStepPx, step);
        if (i > 1) {
            // Direction reversal with tiny motion = jitter.
            const p = frames[i - 2];
            const v1 = [a.x - p.x, a.y - p.y];
            const v2 = [b.x - a.x, b.y - a.y];
            const dot = v1[0] * v2[0] + v1[1] * v2[1];
            if (dot < 0 && Math.hypot(...v1) > 0.3 && Math.hypot(...v2) > 0.3 && Math.hypot(...v1) < 6) report.jitterFrames++;
        }
    }
    // Blinks: opacity drops below 0.5 and returns within 0.4 s.
    for (let i = 1; i < frames.length; i++) {
        if (frames[i - 1].opacity >= 0.5 && frames[i].opacity < 0.5) {
            let j = i;
            while (j < frames.length && frames[j].opacity < 0.5) j++;
            if (j < frames.length && frames[j].t - frames[i].t < 0.4) report.blinks.push(+frames[i].t.toFixed(2));
        }
    }
    report.maxStepPx = +report.maxStepPx.toFixed(1);
    return report;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
if (isMain) {
    let dirs = process.argv.slice(2);
    if (!dirs.length) {
        const root = path.join(process.env.LOCALAPPDATA || '', 'Drift', 'sessions');
        dirs = fs.readdirSync(root).map(d => path.join(root, d))
            .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs).slice(0, 8);
    }
    for (const d of dirs) console.log(JSON.stringify(audit(loadSession(d))));
}
