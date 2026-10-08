/**
 * Measure how the auto-zoom camera *feels* on the synthetic scenarios.
 *
 *   node tools/camera-metrics.mjs [--json]
 *
 * Motion is measured as the viewer perceives it: pan speed in viewport widths
 * per second (how fast the content slides across the frame) and zoom speed in
 * log-scale per second. Their combination is the "motion" a viewer feels.
 */

import fs from 'fs';
import path from 'path';
import { SCENARIOS } from './camera-scenarios.mjs';
import { InteractionAnalyzer } from '../src/lib/zoom/InteractionAnalyzer.js';
import { evaluateCameraAtTime } from '../src/lib/rendering/renderFrame.js';
import { getCameraTrack } from '../src/lib/zoom/cameraTrack.js';

const FPS = 60;

/** Load a recorder session folder (telemetry.json, keystrokes.json, session.json). */
function loadSession(dir) {
    const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
    const meta = read('session.json') || {};
    const w = meta.width || 1920;
    const h = meta.height || 1080;
    // Same as the app: positions off the recorded screen are flagged hidden.
    const moves = (read('telemetry.json') || []).map(s => {
        const u = s.x / w;
        const v = s.y / h;
        const hidden = u < -0.005 || u > 1.005 || v < -0.005 || v > 1.005;
        return { time: s.t, x: Math.max(0, Math.min(1, u)), y: Math.max(0, Math.min(1, v)), click: s.click || undefined, ...(hidden ? { hidden } : {}) };
    });
    return {
        moves,
        clicks: moves.filter(m => m.click),
        keys: read('keystrokes.json') || [],
        duration: (meta.duration_ms || 10000) / 1000,
    };
}

export function measure(scenario) {
    const { moves, clicks, keys, duration } = scenario;
    const segments = new InteractionAnalyzer().analyze(clicks, moves, duration, keys);
    const frames = [];
    for (let i = 0; i <= duration * FPS; i++) {
        const t = i / FPS;
        const c = evaluateCameraAtTime(t, segments, moves, { duration });
        frames.push({ t, x: c.x, y: c.y, s: c.scale });
    }
    let peak = 0;
    let peakPan = 0;
    let peakZoom = 0;
    let peakAccel = 0;
    let moving = 0;
    let starts = 0;
    let reversals = 0;
    let prevM = 0;
    let wasMoving = false;
    let prevDir = null;
    let cursorOut = 0;
    let cursorSeen = 0;
    const ms = [];
    for (let i = 1; i < frames.length; i++) {
        const a = frames[i - 1];
        const b = frames[i];
        const w = 1 / ((a.s + b.s) / 2);
        const pan = Math.hypot(b.x - a.x, b.y - a.y) / w * FPS;
        const zoom = Math.abs(Math.log(b.s) - Math.log(a.s)) * FPS;
        const m = Math.hypot(pan, zoom);
        ms.push(m);
        peak = Math.max(peak, m);
        peakPan = Math.max(peakPan, pan);
        peakZoom = Math.max(peakZoom, zoom);
        if (i > 1) peakAccel = Math.max(peakAccel, Math.abs(m - prevM) * FPS);
        prevM = m;
        const isMoving = m > 0.05;
        if (isMoving) moving++;
        if (isMoving && !wasMoving) starts++;
        wasMoving = isMoving;
        if (pan > 0.05) {
            const dir = Math.atan2(b.y - a.y, b.x - a.x);
            if (prevDir != null && Math.abs(Math.atan2(Math.sin(dir - prevDir), Math.cos(dir - prevDir))) > 2.4) reversals++;
            prevDir = dir;
        }
    }
    // Zoomed travel: the longest distance (source widths) the view pans in one
    // continuous move while staying zoomed in. Dragging a zoomed view across
    // the screen reads as a chase; long trips should go through a wider shot.
    let zoomedTravel = 0;
    let run = 0;
    for (let i = 1; i < frames.length; i++) {
        const a = frames[i - 1];
        const b = frames[i];
        const step = Math.hypot(b.x - a.x, b.y - a.y);
        const panning = step * FPS > 0.02;
        if (panning && Math.min(a.s, b.s) > 1.15) {
            run += step;
            zoomedTravel = Math.max(zoomedTravel, run);
        } else {
            run = 0;
        }
    }
    // How often the cursor is off-screen while zoomed in (should be ~0).
    let mi = 0;
    for (const f of frames) {
        if (f.s < 1.05) continue;
        while (mi < moves.length - 1 && moves[mi + 1].time <= f.t * 1000) mi++;
        const c = moves[mi];
        if (c.hidden) continue;
        cursorSeen++;
        const half = 0.5 / f.s;
        if (Math.abs(c.x - f.x) > half || Math.abs(c.y - f.y) > half) cursorOut++;
    }
    const zoomed = frames.filter(f => f.s > 1.05).length / frames.length;
    const peakScale = Math.max(...frames.map(f => f.s));
    const visibleClicks = clicks.filter(c => !c.hidden);
    const clickSeen = visibleClicks.filter(c => {
        const f = frames[Math.max(0, Math.min(frames.length - 1, Math.round((c.time / 1000) * FPS)))];
        const half = 0.5 / f.s;
        return Math.abs(c.x - f.x) <= half * 0.92 && Math.abs(c.y - f.y) <= half * 0.92;
    }).length;
    ms.sort((p, q) => p - q);
    const track = getCameraTrack(segments, moves, { duration });
    const durs = track.moves.map(m => m.d);
    const overviewReturns = track.moves.filter(m => m.to.s < 1.01 && m.from.s > 1.01).length;
    return {
        moveDurations: durs,
        moveDurMin: durs.length ? Math.min(...durs) : 0,
        moveDurMax: durs.length ? Math.max(...durs) : 0,
        overviewReturns,
        segments: segments.length,
        peakMotion: peak,
        p95Motion: ms[Math.floor(ms.length * 0.95)] || 0,
        peakPan,
        peakZoom,
        peakAccel,
        movingPct: (moving / ms.length) * 100,
        movesPerMin: starts / (frames.length / FPS / 60),
        reversals,
        zoomedTravel,
        zoomedPct: zoomed * 100,
        peakScale,
        cursorOffPct: cursorSeen ? (cursorOut / cursorSeen) * 100 : 0,
        clicksFramed: `${clickSeen}/${visibleClicks.length}`,
    };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('camera-metrics.mjs')) {
    const sessionDirs = process.argv.slice(2).filter(a => !a.startsWith('--'));
    const sources = sessionDirs.length
        ? sessionDirs.map(dir => [dir.split(/[\/]/).filter(Boolean).pop().slice(0, 40), () => loadSession(dir)])
        : Object.entries(SCENARIOS);
    const rows = sources.map(([name, make]) => ({ name, ...measure(make()) }));
    if (process.argv.includes('--json')) {
        console.log(JSON.stringify(rows, null, 2));
    } else {
        const f = (v, d = 2) => (typeof v === 'number' ? v.toFixed(d) : v);
        console.log('scenario'.padEnd(40), 'segs peak  p95   pan   zoom  accel  move% moves/min rev zoom% maxS  curOff% clicks  dur(min-max) outs');
        for (const r of rows) {
            console.log(r.name.padEnd(40), String(r.segments).padStart(4), f(r.peakMotion).padStart(5), f(r.p95Motion).padStart(5), f(r.peakPan).padStart(5), f(r.peakZoom).padStart(5), f(r.peakAccel, 1).padStart(6), f(r.movingPct, 0).padStart(5), f(r.movesPerMin, 1).padStart(8), String(r.reversals).padStart(4), f(r.zoomedPct, 0).padStart(5), f(r.peakScale).padStart(5), f(r.cursorOffPct, 1).padStart(7), r.clicksFramed.padStart(7), `${f(r.moveDurMin)}-${f(r.moveDurMax)}`.padStart(12), String(r.overviewReturns).padStart(4), f(r.zoomedTravel).padStart(6));
        }
    }
}
