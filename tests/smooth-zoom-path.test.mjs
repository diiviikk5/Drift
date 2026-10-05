import test from 'node:test';
import assert from 'node:assert/strict';
import { smoothZoomPath, minimumJerk } from '../src/lib/zoom/smoothZoomPath.js';

test('path starts and ends at the given framings', () => {
    const a = { x: 0.3, y: 0.4, w: 0.6 };
    const b = { x: 0.7, y: 0.6, w: 0.5 };
    const p = smoothZoomPath(a, b);
    const s = p.at(0);
    const e = p.at(p.length);
    for (const k of ['x', 'y', 'w']) {
        assert.ok(Math.abs(s[k] - a[k]) < 1e-9, `start ${k}`);
        assert.ok(Math.abs(e[k] - b[k]) < 1e-9, `end ${k}`);
    }
});

test('a long pan while zoomed in eases out mid-way', () => {
    const p = smoothZoomPath({ x: 0.2, y: 0.5, w: 0.6 }, { x: 0.8, y: 0.5, w: 0.6 });
    assert.ok(p.at(p.length / 2).w > 0.6);
});

test('pure zoom is exponential in width and has a sensible length', () => {
    const p = smoothZoomPath({ x: 0.5, y: 0.5, w: 1 }, { x: 0.5, y: 0.5, w: 1 / 1.6 });
    const mid = p.at(p.length / 2).w;
    assert.ok(Math.abs(mid - Math.sqrt(1 / 1.6)) < 1e-9);
    assert.ok(Math.abs(p.length - Math.log(1.6) / 1.2) < 1e-9);
});

test('farther moves are longer', () => {
    const near = smoothZoomPath({ x: 0.4, y: 0.5, w: 0.6 }, { x: 0.5, y: 0.5, w: 0.6 }).length;
    const far = smoothZoomPath({ x: 0.2, y: 0.5, w: 0.6 }, { x: 0.8, y: 0.5, w: 0.6 }).length;
    assert.ok(far > near * 2);
});

test('minimum-jerk easing is smooth and bounded', () => {
    assert.equal(minimumJerk(0), 0);
    assert.equal(minimumJerk(1), 1);
    assert.equal(minimumJerk(0.5), 0.5);
    assert.equal(minimumJerk(-1), 0);
    assert.equal(minimumJerk(2), 1);
});
