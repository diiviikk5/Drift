import test from 'node:test';
import assert from 'node:assert/strict';
import { ScreenAnalyzer, detectShift } from '../src/lib/vision/ScreenAnalyzer.js';
import { InteractionAnalyzer } from '../src/lib/zoom/InteractionAnalyzer.js';
import { makeDesktop, pathAt, renderFrame, fillRect, textBlock, rng } from './helpers/scene.mjs';

const W = 1280, H = 720;
const FPS = 30;

/** Run a scenario: scene(t) returns { desktop, cursor }. */
function analyze(scene, dur) {
    const a = new ScreenAnalyzer({ width: W, height: H });
    for (let t = 0; t <= dur; t += 1000 / FPS) {
        const { desktop, cursor } = scene(t);
        a.push(renderFrame(desktop, W, H, cursor), t);
    }
    return a.finish();
}

const base = makeDesktop(W, H);

test('row-profile scroll detection finds the offset', () => {
    const page = (off) => Float32Array.from({ length: 300 }, (_, i) => Math.round(Math.sin((i + off) * 0.37) * 60 + Math.cos((i + off) * 0.051) * 40 + 128));
    assert.equal(detectShift(page(0), page(20)), 40);
    assert.equal(detectShift(page(0), page(0)), null);
});

test('pointer moves become normalized move samples', () => {
    const path = [[0, 300, 300], [300, 300, 300], [1000, 640, 360], [1500, 640, 360]];
    const out = analyze((t) => {
        const [x, y] = pathAt(path, t);
        return { desktop: base, cursor: { x, y } };
    }, 1500);
    const last = out.moves.filter(m => !m.click && !m.scroll).pop();
    assert.ok(Math.abs(last.x - 0.5) < 0.003 && Math.abs(last.y - 0.5) < 0.003, JSON.stringify(last));
    assert.ok(out.moves.length > 15);
    assert.equal(out.clicks.length, 0, 'moving around is not clicking');
});

test('a button that reacts after the pointer settles on it is a click', () => {
    const pressed = new Uint8ClampedArray(base);
    fillRect(pressed, W, H, 80, 470, 120, 34, [12, 80, 190]);
    textBlock(pressed, W, H, 300, 520, 300, 1, rng(3), [20, 20, 20]); // a status line appears
    const path = [[0, 600, 200], [300, 600, 200], [900, 140, 487], [2500, 140, 487]];
    const out = analyze((t) => {
        const [x, y] = pathAt(path, t);
        return { desktop: t >= 1350 ? pressed : base, cursor: { x, y } };
    }, 2500);
    assert.equal(out.clicks.length, 1, JSON.stringify(out.clicks));
    const c = out.clicks[0];
    assert.ok(c.time > 900 && c.time <= 1350, `time ${c.time}`);
    assert.ok(Math.abs(c.x * W - 140) < 3 && Math.abs(c.y * H - 487) < 3);
    assert.ok(out.moves.some(m => m.click), 'click joins the move track like native telemetry');
});

test('a hover effect that starts on arrival is not a click', () => {
    const hover = new Uint8ClampedArray(base);
    fillRect(hover, W, H, 80, 470, 120, 34, [60, 140, 250]);
    const path = [[0, 600, 200], [300, 600, 200], [900, 140, 487], [2500, 140, 487]];
    const out = analyze((t) => {
        const [x, y] = pathAt(path, t);
        // Lights up as soon as the pointer is over the button (while still arriving).
        const over = x >= 80 && x <= 200 && y >= 470 && y <= 504;
        return { desktop: over ? hover : base, cursor: { x, y } };
    }, 2500);
    assert.equal(out.clicks.length, 0, JSON.stringify(out.clicks));
});

test('glyphs appearing along a line are typing, with the caret after them', () => {
    const frames = [];
    let cur = new Uint8ClampedArray(base);
    frames.push(cur);
    // Type 14 characters into the browser window's text, one every 160 ms.
    for (let i = 0; i < 14; i++) {
        cur = new Uint8ClampedArray(cur);
        fillRect(cur, W, H, 300 + i * 8, 432, 6, 10, [20, 20, 30]);
        frames.push(cur);
    }
    const out = analyze((t) => {
        const k = Math.max(0, Math.min(frames.length - 1, Math.floor((t - 500) / 160) + 1));
        return { desktop: t < 500 ? frames[0] : frames[k], cursor: { x: 900, y: 600 } };
    }, 3200);
    assert.ok(out.keystrokes.length >= 10, `keys ${out.keystrokes.length}`);
    assert.ok(out.keystrokes.every(k => k.typed && k.text === '' && k.time < 10), 'anonymous typing in seconds');
    const last = out.caret[out.caret.length - 1];
    assert.ok(Math.abs(last.x * W - (300 + 13 * 8 + 7)) <= 3, `caret x ${last.x * W}`);
    assert.ok(Math.abs(last.y * H - 432) <= 2, `caret y ${last.y * H}`);
    assert.equal(out.clicks.length, 0, 'typing is not clicking');
});

test('a scrolling page is scroll telemetry, not clicks', () => {
    const page = new Uint8ClampedArray(W * 2000 * 4);
    fillRect(page, W, 2000, 0, 0, W, 2000, [255, 255, 255]);
    textBlock(page, W, 2000, 70, 0, 620, 95, rng(11), [30, 30, 40], 21);
    const frameAt = (off) => {
        const d = new Uint8ClampedArray(base);
        for (let y = 70; y < 545; y++) {
            const src = ((y - 70 + off) * W + 40) * 4;
            d.set(page.subarray(src, src + 700 * 4), (y * W + 40) * 4);
        }
        return d;
    };
    const out = analyze((t) => {
        const off = t < 600 ? 0 : Math.min(400, Math.round((t - 600) * 0.5));
        return { desktop: frameAt(off), cursor: { x: 400, y: 300 } };
    }, 2400);
    assert.ok(out.scrolls.length >= 5, `scrolls ${out.scrolls.length}`);
    assert.ok(out.scrolls.every(s => s.shift > 0), 'scrolled down');
    assert.ok(out.moves.some(m => m.scroll));
    assert.equal(out.clicks.length, 0, JSON.stringify(out.clicks));
});

test('recovered telemetry drives the auto-zoom planner', () => {
    // Click a field, then type in it.
    const frames = [base];
    let cur = new Uint8ClampedArray(base);
    fillRect(cur, W, H, 80, 470, 120, 34, [12, 80, 190]);
    frames.push(cur);
    for (let i = 0; i < 20; i++) {
        cur = new Uint8ClampedArray(cur);
        fillRect(cur, W, H, 220 + i * 8, 482, 6, 10, [20, 20, 30]);
        frames.push(cur);
    }
    const path = [[0, 900, 150], [500, 900, 150], [1300, 140, 487], [6000, 140, 487]];
    const out = analyze((t) => {
        const [x, y] = pathAt(path, t);
        const k = t < 1800 ? 0 : t < 2400 ? 1 : Math.min(frames.length - 1, 2 + Math.floor((t - 2400) / 150));
        return { desktop: frames[k], cursor: { x, y } };
    }, 6000);
    assert.ok(out.clicks.length >= 1);
    const segs = new InteractionAnalyzer({ sourceWidth: W, sourceHeight: H }).analyze(out.clicks, out.moves, 6, out.keystrokes);
    assert.ok(segs.length >= 1, 'zooms in on the work');
    const s = segs[0];
    assert.ok(Math.abs(s.targetX - 0.2) < 0.15 && Math.abs(s.targetY - 0.67) < 0.15, JSON.stringify(s));
});
