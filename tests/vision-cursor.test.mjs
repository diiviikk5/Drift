import test from 'node:test';
import assert from 'node:assert/strict';
import { CursorTracker } from '../src/lib/vision/CursorTracker.js';
import { buildTemplate } from '../src/lib/vision/cursorTemplates.js';
import { makeDesktop, luma, pathAt, renderFrame } from './helpers/scene.mjs';

const W = 1280, H = 720;
const desktop = makeDesktop(W, H);

const PATH = [
    [0, 300, 300], [500, 300, 300], [1300, 600, 200], [1700, 600, 200],
    [2300, 120, 480], [2800, 130, 485], [3400, 900, 150], [3800, 905, 152],
    [4400, 1000, 600], [5000, 400, 650], [5600, 1262, 700], [6000, 1262, 700],
];

function run(cursorOpts = {}, path = PATH, fps = 30, dur = 6000) {
    const tracker = new CursorTracker({ width: W, height: H });
    let prev = null;
    const errs = [];
    let found = 0, total = 0;
    for (let t = 0; t <= dur; t += 1000 / fps) {
        const [x, y] = pathAt(path, t);
        const rgba = renderFrame(desktop, W, H, { x, y, ...cursorOpts });
        const L = luma(rgba, W, H);
        // Changed rects: the union box of old and new pointer area (what a change map would give).
        const r = tracker.update(L, prev, t, changedRects(prev, L));
        prev = L;
        total++;
        if (t < 400) continue; // bootstrap sweep time
        if (r.found) {
            found++;
            errs.push(Math.hypot(r.x - Math.round(x), r.y - Math.round(y)));
        }
    }
    errs.sort((a, b) => a - b);
    return { tracker, foundRate: found / (total - Math.ceil(400 / (1000 / fps))), p95: errs[Math.floor(errs.length * 0.95)] ?? Infinity, max: errs[errs.length - 1] };
}

// Simple 16px tile change map, like the analyzer's.
function changedRects(prev, L) {
    if (!prev) return [];
    const T = 16;
    const rects = [];
    for (let ty = 0; ty < H; ty += T) {
        for (let tx = 0; tx < W; tx += T) {
            let ch = false;
            for (let y = ty; y < Math.min(H, ty + T) && !ch; y += 2) {
                for (let x = tx; x < Math.min(W, tx + T); x += 2) {
                    if (Math.abs(L[y * W + x] - prev[y * W + x]) > 8) { ch = true; break; }
                }
            }
            if (ch) rects.push({ x0: tx - T, y0: ty - T, x1: tx + 2 * T, y1: ty + 2 * T });
        }
    }
    return rects;
}

test('templates have interior and rim pixels at every scale', () => {
    for (const s of [1, 1.25, 1.5, 2, 3]) {
        const t = buildTemplate('arrow-win', s);
        assert.ok(t.innerX.length > 20 * s, `inner ${s}`);
        assert.ok(t.rimX.length > 15 * s, `rim ${s}`);
    }
});

test('tracks the Windows arrow at 100% exactly', () => {
    const r = run();
    assert.ok(r.foundRate > 0.97, `found ${r.foundRate}`);
    assert.ok(r.p95 <= 1, `p95 ${r.p95}`);
    assert.equal(r.tracker.locked.scale, 1);
});

test('tracks a 150% Windows arrow', () => {
    const r = run({ scale: 1.5 });
    assert.ok(r.foundRate > 0.95, `found ${r.foundRate}`);
    assert.ok(r.p95 <= 2, `p95 ${r.p95}`);
    assert.equal(r.tracker.locked.scale, 1.5);
});

test('tracks an inverted (macOS-style) arrow at 2x', () => {
    const r = run({ id: 'arrow-mac', scale: 2, inner: [0, 0, 0], rim: [255, 255, 255] });
    assert.ok(r.foundRate > 0.95, `found ${r.foundRate}`);
    assert.ok(r.p95 <= 2, `p95 ${r.p95}`);
});

test('learns the exact pointer sprite after seeing it over varied backgrounds', () => {
    const r = run();
    const sprites = r.tracker.sprites();
    const learned = Object.values(sprites).find(s => s.learned && s.shape === 'arrow');
    assert.ok(learned, 'arrow learned');
    assert.ok(learned.points.length >= 100 && learned.points.length < 200, `points ${learned.points.length}`);
});

test('no false detections on a desktop without a pointer', () => {
    const tracker = new CursorTracker({ width: W, height: H });
    const L = luma(desktop, W, H);
    let hits = 0;
    for (let i = 0; i < 10; i++) {
        if (tracker.update(L, i ? L : null, i * 33, []).found) hits++;
    }
    assert.equal(hits, 0);
});

test('follows shape changes: arrow, link hand, text I-beam', () => {
    const tracker = new CursorTracker({ width: W, height: H });
    let prev = null;
    const seen = { arrow: 0, hand: 0, text: 0 };
    let wrong = 0;
    for (let t = 0; t <= 3000; t += 33) {
        const [x, y] = pathAt([[0, 200, 200], [400, 200, 200], [1000, 500, 400], [3000, 520, 420]], t);
        const id = t < 1100 ? 'arrow-win' : t < 2000 ? 'hand-win' : 'ibeam';
        const opts = id === 'ibeam' ? { id, inner: [0, 0, 0], rim: [255, 255, 255] } : { id };
        const L = luma(renderFrame(desktop, W, H, { x, y, ...opts }), W, H);
        const r = tracker.update(L, prev, t, changedRects(prev, L));
        prev = L;
        if (t < 300 || !r.found) continue;
        const want = id === 'arrow-win' ? 'arrow' : id === 'hand-win' ? 'hand' : 'text';
        if (r.shape === want && Math.hypot(r.x - Math.round(x), r.y - Math.round(y)) <= 1.5) seen[want]++;
        else wrong++;
    }
    assert.ok(seen.arrow > 15 && seen.hand > 20 && seen.text > 20, JSON.stringify(seen));
    assert.ok(wrong <= 3, `wrong ${wrong}`);
});
