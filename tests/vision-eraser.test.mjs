import test from 'node:test';
import assert from 'node:assert/strict';
import { inpaint, stampMask, placementsAt } from '../src/lib/vision/cursorEraser.js';
import { ScreenAnalyzer } from '../src/lib/vision/ScreenAnalyzer.js';
import { makeDesktop, pathAt, renderFrame } from './helpers/scene.mjs';

const W = 1280, H = 720;
const desktop = makeDesktop(W, H);

test('placements cover the frame time and its neighbours', () => {
    const raw = [{ t: 0, x: 1, y: 1, key: 'a' }, { t: 33, x: 5, y: 1, key: 'a' }, { t: 66, x: 9, y: 1, key: 'a' }, { t: 100, hidden: true }];
    assert.deepEqual(placementsAt(raw, 40).map(p => p.x).sort(), [1, 5, 9]);
    assert.deepEqual(placementsAt(raw, 140), []);
});

test('the analyzed footprint erases the baked pointer', () => {
    const a = new ScreenAnalyzer({ width: W, height: H });
    const path = [[0, 300, 300], [300, 300, 300], [1200, 520, 160], [1500, 900, 300], [2400, 200, 400], [3000, 600, 250]];
    for (let t = 0; t <= 3000; t += 33.3) {
        const [x, y] = pathAt(path, t);
        a.push(renderFrame(desktop, W, H, { x, y }), t);
    }
    const { pointer } = a.finish();
    const last = pointer.raw[pointer.raw.length - 1];
    const sprite = pointer.sprites[last.key];
    assert.ok(sprite && sprite.points.length > 50);

    // Erase on the last frame (pointer over the white page with text).
    const frame = renderFrame(desktop, W, H, { x: last.x, y: last.y });
    const ox = last.x - 8, oy = last.y - 8, pw = 40, ph = 44;
    const px = new Uint8ClampedArray(pw * ph * 4);
    for (let y = 0; y < ph; y++) px.set(frame.subarray(((oy + y) * W + ox) * 4, ((oy + y) * W + ox + pw) * 4), y * pw * 4);
    const mask = new Uint8Array(pw * ph);
    stampMask(mask, pw, ph, sprite.points, 1, ox, oy, last.x, last.y, 1.5);
    inpaint(px, pw, ph, mask);

    // Compare with the clean desktop: the pointer's dark outline must be gone.
    let err = 0, n = 0, worst = 0;
    for (let y = 0; y < ph; y++) {
        for (let x = 0; x < pw; x++) {
            if (!mask[y * pw + x]) continue;
            const i = (y * pw + x) * 4, j = ((oy + y) * W + ox + x) * 4;
            const d = Math.abs(px[i] - desktop[j]) + Math.abs(px[i + 1] - desktop[j + 1]) + Math.abs(px[i + 2] - desktop[j + 2]);
            err += d / 3; n++; worst = Math.max(worst, d / 3);
        }
    }
    assert.ok(err / n < 30, `mean error ${err / n}`);
});
