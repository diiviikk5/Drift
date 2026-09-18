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

test('sub-pixel cursor interpolation handles high-frequency telemetry starting at 0ms', () => {
    const highFreqSamples = [
        { time: 0, x: 0.1, y: 0.1 },
        { time: 4, x: 0.12, y: 0.12 },
        { time: 8, x: 0.14, y: 0.14 },
        { time: 100, x: 0.5, y: 0.5 },
    ];
    const cur = getInterpolatedCursor(0.004, highFreqSamples);
    assert.ok(cur !== null);
    assert.ok(Math.abs(cur.x - 0.12) < 0.01);
    assert.ok(Math.abs(cur.y - 0.12) < 0.01);
});

test('interaction analyzer converts synchronized session clicks to zoom targets', () => {
    const analyzer = new InteractionAnalyzer();
    const clicks = [
        { time: 1200, x: 0.35, y: 0.42 },
        { time: 4500, x: 0.75, y: 0.82 },
    ];
    const segments = analyzer.analyze(clicks, [], 8);
    assert.ok(segments.length >= 2);
    assert.ok(Math.abs(segments[0].targetX - 0.35) < 0.05);
    assert.ok(Math.abs(segments[0].targetY - 0.42) < 0.05);
});

test('Catmull-Rom spline curves smoothly through multi-point trajectories without corner cuts', () => {
    const trajectory = [
        { time: 0, x: 0.1, y: 0.1 },
        { time: 100, x: 0.2, y: 0.4 },
        { time: 200, x: 0.6, y: 0.8 },
        { time: 300, x: 0.9, y: 0.9 },
    ];
    // Evaluate between p1 and p2 at t = 150ms
    const pt = getInterpolatedCursor(0.15, trajectory);
    assert.ok(pt !== null);
    assert.ok(pt.x > 0.2 && pt.x < 0.6);
    assert.ok(pt.y > 0.4 && pt.y < 0.8);
    // Linear midpoint would be (0.4, 0.6). Spline curve produces non-linear smooth curve
    assert.ok(Math.abs(pt.x - 0.375) < 0.05);
});

test('compositor renders all vector cursor themes without throwing', () => {
    const noop = () => {};
    const context = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            return noop;
        },
    });

    const themes = ['macos', 'windows', 'cyber', 'neon', 'dot', 'ring'];
    for (const theme of themes) {
        assert.doesNotThrow(() => {
            renderFrame(context, 1.0, null, {
                mouseMoves: [{ time: 0, x: 0.5, y: 0.5 }, { time: 2000, x: 0.6, y: 0.6 }],
            }, {
                showCursor: true,
                cursorTheme: theme,
                cursorScale: 1.5,
            });
        }, `Failed rendering cursor theme: ${theme}`);
    }
});
