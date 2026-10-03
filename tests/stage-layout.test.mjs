import test from 'node:test';
import assert from 'node:assert/strict';
import { computeStageLayout, meshCss, WALLPAPERS } from '../src/lib/rendering/stage.js';
import { canvasToSource, evaluateCameraAtTime } from '../src/lib/rendering/renderFrame.js';

test('layout looks identical at any resolution (unit scaling)', () => {
    const a = computeStageLayout(1920, 1080, 1920, 1080, { insetPadding: 0.08, windowChrome: true, borderRadius: 18 });
    const b = computeStageLayout(3840, 2160, 1920, 1080, { insetPadding: 0.08, windowChrome: true, borderRadius: 18 });
    assert.ok(Math.abs(b.unit / a.unit - 2) < 1e-9);
    assert.ok(Math.abs(b.radius / a.radius - 2) < 1e-9);
    assert.ok(Math.abs(b.headerH / a.headerH - 2) < 0.05);
    assert.ok(Math.abs(b.frameW / a.frameW - 2) < 0.01);
});

test('contain keeps the source aspect; padding is never negative in any aspect ratio', () => {
    for (const [w, h] of [[1920, 1080], [1080, 1920], [1080, 1080], [1080, 1350]]) {
        const l = computeStageLayout(w, h, 2560, 1440, { insetPadding: 0.08 });
        assert.ok(Math.abs(l.videoW / l.videoH - 16 / 9) < 1e-6);
        assert.ok(l.padX >= 0 && l.padY >= 0);
        assert.equal(l.cropKx, 1);
        assert.equal(l.cropKy, 1);
    }
});

test('fill covers the frame and reports the crop factor', () => {
    const l = computeStageLayout(1080, 1920, 1920, 1080, { insetPadding: 0.05, frameFit: 'fill' });
    assert.ok(l.cropKx > 2, `expected strong horizontal crop, got ${l.cropKx}`);
    assert.equal(l.cropKy, 1);
    assert.ok(Math.abs(l.contentW / l.contentH - 16 / 9) < 1e-6);
    assert.ok(Math.abs(l.contentH - l.videoH) < 1e-6);
});

test('fill mode reframes on the cursor even without zoom segments', () => {
    const moves = [];
    for (let t = 0; t <= 6000; t += 8) moves.push({ time: t, x: t < 3000 ? 0.15 : 0.85, y: 0.5 });
    const l = computeStageLayout(1080, 1920, 1920, 1080, { insetPadding: 0.05, frameFit: 'fill' });
    const opts = { cropKx: l.cropKx, cropKy: l.cropKy };
    const left = evaluateCameraAtTime(2.8, [], moves, opts);
    const right = evaluateCameraAtTime(5.8, [], moves, opts);
    assert.ok(left.x < 0.4 && right.x > 0.6, `crop should follow the action (${left.x}, ${right.x})`);
    const half = 0.5 / l.cropKx;
    for (const cam of [left, right]) assert.ok(cam.x - half >= -1e-6 && cam.x + half <= 1 + 1e-6);
});

test('canvasToSource inverts the render transform', () => {
    const l = computeStageLayout(1920, 1080, 1920, 1080, { insetPadding: 0.08 });
    const cam = { x: 0.6, y: 0.4, scale: 2 };
    const cx = l.padX + l.videoW / 2;
    const cy = l.padY + l.headerH + l.videoH / 2;
    const p = canvasToSource(cx, cy, l, cam);
    assert.ok(Math.abs(p.x - 0.6) < 1e-9 && Math.abs(p.y - 0.4) < 1e-9);
});

test('UI swatches preview the same palettes the renderer paints', () => {
    const css = meshCss(WALLPAPERS.bigSur);
    assert.ok(css.includes('radial-gradient') && css.includes('linear-gradient'));
});
