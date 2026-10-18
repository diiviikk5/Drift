import test from 'node:test';
import assert from 'node:assert/strict';
import { CursorTracker } from '../src/lib/vision/CursorTracker.js';
import { BITMAPS } from '../src/lib/vision/cursorTemplates.js';
import { makeDesktop, luma, pathAt, paintCursorAA, rng } from './helpers/scene.mjs';

const W = 1280, H = 720;
const desktop = makeDesktop(W, H, 21);

function changed(prev, L) {
    if (!prev) return [];
    const T = 16, out = [];
    for (let ty = 0; ty < H; ty += T) for (let tx = 0; tx < W; tx += T) {
        let ch = false;
        for (let y = ty; y < Math.min(H, ty + T) && !ch; y += 2) for (let x = tx; x < Math.min(W, tx + T); x += 2) {
            if (Math.abs(L[y * W + x] - prev[y * W + x]) > 8) { ch = true; break; }
        }
        if (ch) out.push({ x0: tx - T, y0: ty - T, x1: tx + 2 * T, y1: ty + 2 * T });
    }
    return out;
}

function run({ scale, mac = false, video = false, hideFrom = null, hideTo = null, path, subpixel = false }) {
    const tracker = new CursorTracker({ width: W, height: H });
    const rand = rng(3);
    let prev = null, found = 0, total = 0, wrong = 0, reacquiredAt = null;
    for (let t = 0; t <= path[path.length - 1][0]; t += 33) {
        const frame = new Uint8ClampedArray(desktop);
        if (video) {
            // A playing video: the photo area changes every frame.
            for (let y = 500; y < 690; y += 2) for (let x = 760; x < 1240; x += 2) {
                const i = (y * W + x) * 4, n = rand() * 120;
                frame[i] = 90 + n; frame[i + 1] = 60 + n; frame[i + 2] = 40 + n * 0.5;
            }
        }
        // Pointers sit on whole pixels (the OS draws them at the hotspot's pixel).
        // (Sub-pixel: a resampled capture, e.g. a scaled-down 4K screen.)
        const [x, y] = subpixel ? pathAt(path, t) : pathAt(path, t).map(Math.round);
        const hidden = hideFrom != null && t >= hideFrom && t < hideTo;
        if (!hidden) {
            if (mac) paintCursorAA(frame, W, H, BITMAPS.MAC_ARROW, [0, 0], x, y, scale, [0, 0, 0], [255, 255, 255]);
            else paintCursorAA(frame, W, H, BITMAPS.WINDOWS_ARROW, [0, 0], x, y, scale);
        }
        const L = luma(frame, W, H);
        const r = tracker.update(L, prev, t, changed(prev, L));
        prev = L;
        if (t < 500 || hidden) continue;
        total++;
        if (r.found) {
            const e = Math.hypot(r.x - x, r.y - y);
            if (e <= 2.5) found++; else wrong++;
            if (hideTo != null && t >= hideTo && reacquiredAt == null && e <= 2.5) reacquiredAt = t - hideTo;
        }
    }
    return { rate: found / total, wrong, reacquiredAt };
}

const ROAM = [[0, 300, 300], [500, 300, 300], [1500, 1000, 600], [1900, 1000, 600], [2900, 820, 560], [3400, 1100, 520], [4400, 150, 200], [5000, 160, 205]];

for (const subpixel of [false, true]) {
    const tag = subpixel ? ' (between pixels)' : '';
    for (const scale of [1.25, 1.5, 1.75]) {
        test(`anti-aliased Windows arrow at ${scale * 100}%${tag}`, () => {
            const r = run({ scale, path: ROAM, subpixel });
            assert.ok(r.rate > 0.9 && r.wrong <= 2, JSON.stringify(r));
        });
    }

    test(`anti-aliased macOS arrow at 2x${tag}`, () => {
        const r = run({ scale: 2, mac: true, path: ROAM, subpixel });
        assert.ok(r.rate > 0.9 && r.wrong <= 2, JSON.stringify(r));
    });

    test(`pointer over a playing video${tag}`, () => {
        const r = run({ scale: 1, video: true, path: [[0, 300, 300], [500, 300, 300], [1500, 900, 600], [3000, 1100, 560], [3600, 820, 520]], subpixel });
        assert.ok(r.rate > 0.85 && r.wrong <= 3, JSON.stringify(r));
    });
}

test('pointer hidden while typing comes back somewhere else', () => {
    const r = run({ scale: 1, hideFrom: 1600, hideTo: 3200, path: [[0, 300, 300], [500, 300, 300], [1500, 600, 400], [3200, 600, 400], [3300, 900, 450], [4200, 1000, 300]] });
    assert.ok(r.reacquiredAt != null && r.reacquiredAt <= 200, JSON.stringify(r));
    assert.ok(r.wrong <= 2, JSON.stringify(r));
});
