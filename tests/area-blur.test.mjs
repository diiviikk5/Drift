import test from 'node:test';
import assert from 'node:assert/strict';
import { renderFrame, normalizeSourceArea, blurRegionAlpha } from '../src/lib/rendering/renderFrame.js';

function mockCtx() {
    const ops = [];
    const filters = [];
    const target = {
        ops,
        filters,
        canvas: { width: 1920, height: 1080 },
        set filter(v) { filters.push(v); },
        get filter() { return 'none'; },
        set fillStyle(v) {}, get fillStyle() { return '#000'; },
        set strokeStyle(v) {}, get strokeStyle() { return '#000'; },
        set lineWidth(v) {}, get lineWidth() { return 1; },
        set globalAlpha(v) {}, get globalAlpha() { return 1; },
    };
    return new Proxy(target, {
        get(t, key) {
            if (key in t) return t[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: () => {} });
            return (...args) => { ops.push({ op: key, args }); };
        },
    });
}
const video = { videoWidth: 1920, videoHeight: 1080, readyState: 4 };

test('area recording: only the selected part of the capture is drawn', () => {
    const ctx = mockCtx();
    renderFrame(ctx, 1, video, {}, { background: 'midnight', sourceArea: { x: 0.25, y: 0.5, w: 0.5, h: 0.25 } });
    const draws = ctx.ops.filter(o => o.op === 'drawImage' && o.args[0] === video);
    assert.equal(draws.length, 1);
    const [, sx, sy, sw, sh] = draws[0].args;
    assert.deepEqual([sx, sy, sw, sh], [480, 540, 960, 270]);
});

test('area normalization falls back to the full frame and stays inside it', () => {
    assert.equal(normalizeSourceArea(null).full, true);
    assert.equal(normalizeSourceArea({ x: 0, y: 0, w: 1, h: 1 }).full, true);
    const a = normalizeSourceArea({ x: 0.9, y: 0.9, w: 0.5, h: 0.5 });
    assert.ok(a.x + a.w <= 1 + 1e-9 && a.y + a.h <= 1 + 1e-9);
});

test('blur regions draw a real blur over the content, only while active', () => {
    const regions = [{ id: 'b1', x: 0.1, y: 0.1, w: 0.3, h: 0.1, start: 2, end: 4 }];
    const at = (t) => {
        const ctx = mockCtx();
        renderFrame(ctx, t, video, {}, { background: 'midnight', blurRegions: regions });
        return ctx;
    };
    const on = at(3);
    assert.ok(on.filters.some(f => /blur\(\d/.test(f)), 'a blur filter is applied');
    assert.equal(on.ops.filter(o => o.op === 'drawImage' && o.args[0] === video).length, 2, 'video + blurred patch');
    const off = at(5);
    assert.ok(!off.filters.some(f => /blur\(/.test(f)), 'inactive outside its time range');
});

test('blur regions fade in and out at their time edges', () => {
    const r = { start: 2, end: 4 };
    assert.equal(blurRegionAlpha(r, 1.9), 0);
    assert.ok(blurRegionAlpha(r, 2.1) > 0 && blurRegionAlpha(r, 2.1) < 1);
    assert.equal(blurRegionAlpha(r, 3), 1);
    assert.equal(blurRegionAlpha({}, 100), 1, 'no range = whole video');
});
