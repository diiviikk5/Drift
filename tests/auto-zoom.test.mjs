import test from 'node:test';
import assert from 'node:assert/strict';
import { InteractionAnalyzer } from '../src/lib/zoom/InteractionAnalyzer.js';
import { buildCameraTrack, sampleCameraTrack, viewportCenter, focusForCenter } from '../src/lib/zoom/cameraTrack.js';
import { evaluateCameraAtTime } from '../src/lib/rendering/renderFrame.js';

// Cursor path helper: linear moves between waypoints sampled at 120 Hz (ms timestamps).
function path(waypoints) {
    const out = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
        const [t0, x0, y0] = waypoints[i];
        const [t1, x1, y1] = waypoints[i + 1];
        for (let t = t0; t < t1; t += 1000 / 120) {
            const k = (t - t0) / (t1 - t0);
            out.push({ time: t, x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k });
        }
    }
    const [t, x, y] = waypoints[waypoints.length - 1];
    out.push({ time: t, x, y });
    return out;
}

test('viewport mapping keeps the focus point fixed on screen and never leaves the frame', () => {
    for (const f of [0, 0.1, 0.5, 0.9, 1]) {
        for (const s of [1, 1.3, 2, 3]) {
            const c = viewportCenter(f, s);
            assert.ok(c - 0.5 / s >= -1e-9 && c + 0.5 / s <= 1 + 1e-9, `viewport out of frame f=${f} s=${s}`);
            const screen = (f - c) * s + 0.5;
            assert.ok(Math.abs(screen - f) < 1e-9);
            if (s > 1) assert.ok(Math.abs(focusForCenter(c, s) - f) < 1e-9);
        }
    }
});

test('a lone click zooms in, holds while reading, then returns to the full frame', () => {
    const segs = new InteractionAnalyzer().analyze([{ time: 3000, x: 0.3, y: 0.4 }], [], 12);
    assert.equal(segs.length, 1);
    const [seg] = segs;
    assert.ok(seg.startTime < 3 && seg.startTime > 2, 'zoom should anticipate the click');
    assert.ok(seg.endTime > 4 && seg.endTime < 6, 'zoom should hold briefly after the click');
    assert.ok(seg.zoomScale > 1.3);
    assert.ok(evaluateCameraAtTime(3.2, segs).scale > 1.3, 'should be zoomed at the click');
    assert.equal(evaluateCameraAtTime(11, segs).scale, 1, 'should be back at overview when idle');
});

test('rapid nearby clicks form one calm zoom instead of many', () => {
    const clicks = [1000, 1700, 2300, 3100, 3900].map((time, i) => ({ time, x: 0.4 + i * 0.01, y: 0.5 }));
    const segs = new InteractionAnalyzer().analyze(clicks, [], 10);
    assert.equal(segs.length, 1);
    assert.ok(segs[0].endTime - segs[0].startTime > 3);
});

test('zoom depth adapts to how spread out the work is', () => {
    const tight = new InteractionAnalyzer().analyze(
        [{ time: 1000, x: 0.5, y: 0.5 }, { time: 1800, x: 0.52, y: 0.51 }], [], 10);
    const wide = new InteractionAnalyzer().analyze(
        [{ time: 1000, x: 0.3, y: 0.5 }, { time: 1800, x: 0.65, y: 0.6 }], [], 10);
    assert.equal(tight.length, 1);
    assert.equal(wide.length, 1);
    assert.ok(tight[0].zoomScale > wide[0].zoomScale, `${tight[0].zoomScale} should exceed ${wide[0].zoomScale}`);
});

test('a long idle pause zooms out, a short one pans without yo-yo', () => {
    const analyzer = new InteractionAnalyzer();
    const shortGap = analyzer.analyze([{ time: 1000, x: 0.2, y: 0.3 }, { time: 4000, x: 0.8, y: 0.7 }], [], 10);
    for (let t = 1.2; t < 4.2; t += 0.05) {
        assert.ok(evaluateCameraAtTime(t, shortGap).scale > 1.2, `should stay zoomed at t=${t.toFixed(2)}`);
    }
    const longGap = analyzer.analyze([{ time: 1000, x: 0.2, y: 0.3 }, { time: 12000, x: 0.8, y: 0.7 }], [], 16);
    assert.equal(longGap.length, 2);
    assert.ok(evaluateCameraAtTime(7, longGap).scale < 1.02, 'should rest at overview during a long pause');
});

test('cursor dwell alone never triggers a zoom, keyboard shortcuts do', () => {
    const moves = path([[0, 0.1, 0.1], [1500, 0.6, 0.6], [4000, 0.6, 0.6], [4010, 0.61, 0.6], [5000, 0.9, 0.9]]);
    assert.equal(new InteractionAnalyzer().analyze([], moves, 8).length, 0);
    const withShortcut = new InteractionAnalyzer().analyze([], moves, 8, [{ time: 2.0, text: 'Ctrl+S' }]);
    assert.equal(withShortcut.length, 1);
    assert.ok(Math.abs(withShortcut[0].targetX - 0.6) < 0.1);
});

test('camera motion is continuous: no frame-to-frame jumps across a busy session', () => {
    const moves = path([[0, 0.5, 0.5], [1000, 0.2, 0.2], [2500, 0.25, 0.3], [3000, 0.85, 0.8], [4500, 0.8, 0.85], [6000, 0.1, 0.9], [9000, 0.1, 0.9]]);
    const clicks = [{ time: 1100, x: 0.2, y: 0.2 }, { time: 2400, x: 0.25, y: 0.3 }, { time: 3200, x: 0.85, y: 0.8 }, { time: 6100, x: 0.1, y: 0.9 }];
    const segs = new InteractionAnalyzer().analyze(clicks, moves, 10);
    assert.ok(segs.length >= 2);
    let prev = evaluateCameraAtTime(0, segs, moves);
    for (let t = 1 / 60; t < 10; t += 1 / 60) {
        const cam = evaluateCameraAtTime(t, segs, moves);
        assert.ok(Math.abs(cam.x - prev.x) < 0.02, `x jump ${Math.abs(cam.x - prev.x)} at ${t.toFixed(3)}`);
        assert.ok(Math.abs(cam.y - prev.y) < 0.02, `y jump at ${t.toFixed(3)}`);
        assert.ok(Math.abs(cam.scale - prev.scale) < 0.04, `scale jump at ${t.toFixed(3)}`);
        const half = 0.5 / cam.scale;
        assert.ok(cam.x - half >= -1e-6 && cam.x + half <= 1 + 1e-6, 'viewport left the frame');
        prev = cam;
    }
});

test('following keeps the cursor on screen while zoomed', () => {
    const moves = path([[0, 0.5, 0.5], [800, 0.5, 0.5], [3000, 0.95, 0.9], [5000, 0.05, 0.1], [7000, 0.5, 0.5]]);
    const segs = [{ startTime: 0.5, endTime: 7, targetX: 0.5, targetY: 0.5, zoomScale: 2, followCursor: true }];
    const track = buildCameraTrack(segs, moves, {});
    for (let t = 1.5; t < 7; t += 0.05) {
        const cam = sampleCameraTrack(track, t);
        const ms = t * 1000;
        const i = moves.findIndex(m => m.time >= ms);
        const c = moves[Math.max(0, i)];
        const sx = (c.x - cam.x) * cam.scale + 0.5;
        const sy = (c.y - cam.y) * cam.scale + 0.5;
        assert.ok(sx > -0.02 && sx < 1.02 && sy > -0.02 && sy < 1.02, `cursor off screen at t=${t.toFixed(2)} (${sx.toFixed(2)}, ${sy.toFixed(2)})`);
    }
});

test('small hand movements inside the calm zone do not move the camera', () => {
    const moves = [];
    for (let t = 0; t <= 6000; t += 8) {
        moves.push({ time: t, x: 0.5 + Math.sin(t / 90) * 0.02, y: 0.5 + Math.cos(t / 70) * 0.02 });
    }
    const segs = [{ startTime: 0.5, endTime: 6, targetX: 0.5, targetY: 0.5, zoomScale: 1.8, followCursor: true }];
    const a = evaluateCameraAtTime(3, segs, moves);
    const b = evaluateCameraAtTime(5, segs, moves);
    assert.ok(Math.abs(a.x - b.x) < 0.002 && Math.abs(a.y - b.y) < 0.002);
});

test('manual segments with followCursor=false hold their framing', () => {
    const moves = path([[0, 0.1, 0.1], [4000, 0.9, 0.9]]);
    const segs = [{ startTime: 0.5, endTime: 4, targetX: 0.3, targetY: 0.3, zoomScale: 2, followCursor: false }];
    const a = evaluateCameraAtTime(2.5, segs, moves);
    const b = evaluateCameraAtTime(3.8, segs, moves);
    assert.ok(Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001);
});

test('plans hours-long sessions quickly', () => {
    const clicks = [];
    const moves = [];
    for (let t = 0; t < 30 * 60 * 1000; t += 8) {
        moves.push({ time: t, x: 0.5 + 0.3 * Math.sin(t / 7000), y: 0.5 + 0.3 * Math.cos(t / 9000) });
        if (t % 5000 === 0) clicks.push({ time: t, x: moves[moves.length - 1].x, y: moves[moves.length - 1].y });
    }
    const start = Date.now();
    const segs = new InteractionAnalyzer().analyze(clicks, moves, 1800);
    const track = buildCameraTrack(segs, moves, { duration: 1800 });
    const elapsed = Date.now() - start;
    assert.ok(segs.length > 0);
    assert.ok(track.frames >= 1800 * 120);
    assert.ok(elapsed < 4000, `planning a 30 min session took ${elapsed}ms`);
});

test('smoothed cursor path is fast on long recordings and rests between movements', async () => {
    const { getSmoothedCursorPath } = await import('../src/lib/zoom/cursorPathSmoothing.js');
    const samples = [];
    // 20 minutes: bursts of motion separated by 3s rests (no samples while resting)
    for (let burst = 0; burst < 300; burst++) {
        const t0 = burst * 4000;
        for (let t = 0; t < 1000; t += 4) {
            samples.push({ time: t0 + t, x: 0.2 + 0.6 * (t / 1000), y: 0.5 });
        }
    }
    const start = Date.now();
    const p = getSmoothedCursorPath(samples, 1.0);
    const mid = p.sampleAt(2500); // resting after the first burst
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 3000, `smoothing took ${elapsed}ms`);
    assert.ok(mid && Math.abs(mid.cx - 0.8) < 0.02, `cursor should rest at the end of the move, got ${JSON.stringify(mid)}`);
});
