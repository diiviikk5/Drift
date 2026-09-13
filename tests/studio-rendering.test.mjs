import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCameraAtTime, getInterpolatedCursor, renderFrame } from '../src/lib/rendering/renderFrame.js';
import { InteractionAnalyzer } from '../src/lib/zoom/InteractionAnalyzer.js';

const segments = [
    { startTime: 0, endTime: 2, zoomScale: 2, targetX: 0.4, targetY: 0.5 },
    { startTime: 3, endTime: 5, zoomScale: 2, targetX: 0.6, targetY: 0.5 },
];

test('connected zoom stays continuous when entering the next segment', () => {
    const before = evaluateCameraAtTime(2.99999, segments);
    const after = evaluateCameraAtTime(3.00001, segments);
    assert.ok(Math.abs(before.scale - after.scale) < 0.001);
    assert.ok(Math.abs(before.x - after.x) < 0.001);
});

test('disabling connected zoom returns to overview in the gap', () => {
    assert.equal(evaluateCameraAtTime(2.5, segments, [], { connectedZooms: false }).scale, 1);
});

test('overview scenes do not join zoom chains', () => {
    const scenes = [segments[0], { ...segments[1], sceneMode: 'overview' }];
    assert.equal(evaluateCameraAtTime(2.5, scenes).scale, 1);
    assert.equal(evaluateCameraAtTime(3.5, scenes).scale, 1);
});

test('short zooms return smoothly to overview', () => {
    const short = [{ ...segments[0], endTime: 0.4 }];
    assert.ok(evaluateCameraAtTime(0.39999, short).scale < 1.001);
});

test('cursor interpolation accepts recorder timestamps, including zero', () => {
    assert.deepEqual(getInterpolatedCursor(0.5, [
        { time: 0, x: 0.2, y: 0.3 }, { time: 1000, x: 0.8, y: 0.7 },
    ]), { x: 0.5, y: 0.5 });
});

test('clicks in the first second use milliseconds', () => {
    const track = new InteractionAnalyzer().analyze([{ time: 500, x: 0.5, y: 0.5 }], [], 10);
    assert.equal(track.length, 1);
    assert.ok(track[0].startTime < 0.5);
    assert.ok(track[0].endTime < 3);
});

test('compositor can render beyond the first frame without undefined settings', () => {
    const noop = () => {};
    const context = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            return noop;
        },
    });
    assert.doesNotThrow(() => renderFrame(context, 1, null));
});
