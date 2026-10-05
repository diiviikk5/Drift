import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCameraAtTime, getInterpolatedCursor, renderFrame, getFrameMetrics } from '../src/lib/rendering/renderFrame.js';
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

test('disabling connected zoom eases out in the gap instead of holding', () => {
    const held = evaluateCameraAtTime(2.6, segments);
    const released = evaluateCameraAtTime(2.6, segments, [], { connectedZooms: false });
    assert.ok(held.scale > 1.9, `connected zoom should hold, got ${held.scale}`);
    assert.ok(released.scale < held.scale - 0.2, `disconnected zoom should ease out, got ${released.scale}`);
});

test('overview scenes do not join zoom chains', () => {
    const scenes = [segments[0], { ...segments[1], sceneMode: 'overview' }];
    const chained = evaluateCameraAtTime(2.6, segments);
    assert.ok(evaluateCameraAtTime(2.6, scenes).scale < chained.scale - 0.2);
    assert.ok(evaluateCameraAtTime(4.9, scenes).scale < 1.05);
});

test('short zooms return smoothly to overview', () => {
    const short = [{ ...segments[0], endTime: 0.4 }];
    assert.ok(evaluateCameraAtTime(0.4, short).scale < 2);
    assert.equal(evaluateCameraAtTime(4, short).scale, 1);
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

test('smoothed cursor follows a curved path without corner-cutting lag', () => {
    const trajectory = [];
    for (let t = 0; t <= 600; t += 5) {
        const u = t / 600;
        trajectory.push({ time: t, x: 0.1 + 0.8 * u, y: 0.5 + 0.3 * Math.sin(u * Math.PI) });
    }
    const pt = getInterpolatedCursor(0.3, trajectory, { springSmooth: true });
    assert.ok(Math.abs(pt.x - 0.5) < 0.01 && Math.abs(pt.y - 0.8) < 0.01, JSON.stringify(pt));
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

test('camera pace: snappy moves sooner than cinematic, both ease in without a punch', () => {
    const focusSeg = [{ startTime: 1.0, endTime: 5.0, targetX: 0.8, targetY: 0.2, zoomScale: 2.0 }];
    const snappy = evaluateCameraAtTime(1.6, focusSeg, [], { springProfile: 'snappy' });
    const cinema = evaluateCameraAtTime(1.6, focusSeg, [], { springProfile: 'cinematic' });
    assert.ok(snappy.scale > cinema.scale, 'snappy should be further along');
    assert.ok(evaluateCameraAtTime(1.1, focusSeg, [], { springProfile: 'cinematic' }).scale < 1.05, 'no punch-in at the start');
    assert.ok(evaluateCameraAtTime(3.5, focusSeg, [], { springProfile: 'cinematic' }).scale > 1.99, 'arrives and holds');
});

test('renderFrame renders Cinema Spotlight scene mode with radial vignette', () => {
    const noop = () => {};
    let radialGradCreated = false;
    const context = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'createRadialGradient') {
                radialGradCreated = true;
                return () => ({ addColorStop: noop });
            }
            if (key === 'createLinearGradient') return () => ({ addColorStop: noop });
            return noop;
        },
    });

    assert.doesNotThrow(() => {
        renderFrame(context, 2.0, null, {
            focusSegments: [{ id: 'spot_1', startTime: 1.0, endTime: 3.0, targetX: 0.4, targetY: 0.6, sceneMode: 'spotlight' }],
            mouseSamples: [{ time: 2000, x: 0.4, y: 0.6 }],
        }, {
            insetPadding: 0.12,
            borderRadius: 24,
            windowChrome: false,
        });
    });
    assert.ok(radialGradCreated, 'Radial gradient spotlight should have been created');
});

test('getFrameMetrics centers 16:9 content inside 9:16 vertical canvas without distortion', () => {
    const mock16x9Video = { videoWidth: 1920, videoHeight: 1080 };
    // In a 9:16 mobile canvas (1080 x 1920)
    const metrics = getFrameMetrics(1080, 1920, mock16x9Video, { insetPadding: 0.08, windowChrome: false });

    // Video aspect ratio must be strictly preserved
    const computedAspect = metrics.frameW / metrics.videoH;
    assert.ok(Math.abs(computedAspect - (16 / 9)) < 0.01, 'Computed frame aspect ratio must match 16:9');
    // In 9:16 canvas, it must be centered vertically with padY > padX
    assert.ok(metrics.padY > metrics.padX, 'Vertical padding should be larger to center the 16:9 window');
    assert.ok(metrics.padX > 0, 'Horizontal inset padding should be respected');
});

test('renderFrame renders animated keystroke overlay without throwing', () => {
    let textRendered = false;
    const noop = () => {};
    const context = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'fillText') {
                textRendered = true;
                return noop;
            }
            if (key === 'measureText') return () => ({ width: 40 });
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            return noop;
        },
    });

    assert.doesNotThrow(() => {
        renderFrame(context, 1.2, null, {
            keystrokes: [{ time: 1.0, text: 'Cmd + K' }],
        }, {
            showKeystrokes: true,
        });
    });

    assert.ok(textRendered, 'Keystroke text should be rendered');
});

test('evaluateCameraAtTime eases out after the segment with no snap and lands at rest', () => {
    const singleZoom = [
        { startTime: 1.0, endTime: 4.0, zoomScale: 2.0, targetX: 0.3, targetY: 0.4 },
    ];
    const held = evaluateCameraAtTime(3.9, singleZoom);
    assert.ok(held.scale > 1.97, `expected full zoom before exit, got ${held.scale}`);

    let prev = held.scale;
    let maxStep = 0;
    for (let t = 3.9; t <= 6.5; t += 1 / 60) {
        const cam = evaluateCameraAtTime(t, singleZoom);
        assert.ok(cam.scale <= prev + 1e-6, `zoom-out must be monotonic (t=${t.toFixed(3)})`);
        maxStep = Math.max(maxStep, prev - cam.scale);
        prev = cam.scale;
    }
    assert.ok(maxStep < 0.05, `per-frame scale change too large: ${maxStep}`);
    const landed = evaluateCameraAtTime(6.5, singleZoom);
    assert.ok(landed.scale < 1.01);
    assert.ok(Math.abs(landed.x - 0.5) < 0.01 && Math.abs(landed.y - 0.5) < 0.01);
});

test('ZoomConstruct provides global presets and resolves subtle, cinema, and focus levels', async () => {
    const { ZOOM_PRESETS, DEFAULT_ZOOM_SCALE, resolveZoomPreset } = await import('../src/lib/zoom/ZoomConstruct.js');
    assert.equal(DEFAULT_ZOOM_SCALE, 1.55);
    assert.equal(ZOOM_PRESETS.subtle.scale, 1.35);
    assert.equal(ZOOM_PRESETS.cinema.scale, 1.55);
    assert.equal(ZOOM_PRESETS.focus.scale, 1.85);

    assert.equal(resolveZoomPreset(1.3).id, 'subtle');
    assert.equal(resolveZoomPreset('subtle').scale, 1.35);
    assert.equal(resolveZoomPreset(1.55).id, 'cinema');
    assert.equal(resolveZoomPreset(1.9).id, 'focus');
});

test('multi-click conversational interactions stay continuously chained without dropping to overview', () => {
    const analyzer = new InteractionAnalyzer();
    // 3 clicks across different parts of the UI, separated by 2.0s
    const clicks = [
        { time: 1000, x: 0.2, y: 0.3 },
        { time: 3000, x: 0.8, y: 0.4 },
        { time: 5000, x: 0.5, y: 0.8 },
    ];
    const track = analyzer.analyze(clicks, [], 10);
    assert.ok(track.length >= 2, 'Should create focal segments for distinct UI locations');

    // In the gap between click 1 and click 2 (e.g. t = 3.0s), camera remains zoomed in
    const camDuringTransition = evaluateCameraAtTime(3.0, track);
    assert.ok(camDuringTransition.scale >= 1.30, `Expected camera to remain zoomed in during chained clicks, got ${camDuringTransition.scale}`);
    assert.notEqual(camDuringTransition.scale, 1.0, 'Camera must not drop back to 1.0x overview in between chained clicks');
});

test('StudioEngine plays back in real time by default and supports pacing changes', async () => {
    const { StudioEngine } = await import('../src/lib/StudioEngine.js');
    const mockCanvas = { getContext: () => ({ fillRect: () => {}, drawImage: () => {} }), width: 1920, height: 1080 };
    const engine = new StudioEngine(mockCanvas, {});
    assert.equal(engine.playbackSpeed, 1.0);
    engine.setPlaybackSpeed(1.25);
    assert.equal(engine.playbackSpeed, 1.25);
});

test('InteractionAnalyzer: segments never overlap, and corner-hopping stays on the full frame', () => {
    const analyzer = new InteractionAnalyzer();
    const hopping = [
        { time: 1000, x: 0.1, y: 0.1 },
        { time: 1800, x: 0.9, y: 0.9 },
        { time: 2600, x: 0.1, y: 0.9 },
        { time: 3400, x: 0.9, y: 0.1 },
        { time: 7000, x: 0.5, y: 0.5 },
    ];
    const track = analyzer.analyze(hopping, [], 12);
    assert.equal(track.length, 1, 'only the deliberate click at 7s zooms');
    assert.ok(track[0].startTime > 4);

    const spread = [1000, 4500, 8000, 11500, 15000].map((time, i) => ({ time, x: 0.15 + (i % 3) * 0.35, y: 0.2 + (i % 2) * 0.55 }));
    const segs = analyzer.analyze(spread, [], 18);
    assert.ok(segs.length >= 2);
    for (let i = 0; i < segs.length - 1; i++) {
        assert.ok(segs[i].endTime <= segs[i + 1].startTime + 0.001,
            `Segment ${i} end (${segs[i].endTime}) must not exceed segment ${i + 1} start (${segs[i + 1].startTime})`);
    }
});

test('StudioEngine.setZoomPreset updates global construct depth and synchronizes all segments', async () => {
    const { StudioEngine } = await import('../src/lib/StudioEngine.js');
    const noop = () => {};
    const mockCtx = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            return noop;
        },
    });
    const mockVideo = { readyState: 0, currentTime: 0, duration: 10 };
    const mockCanvas = { getContext: () => mockCtx, width: 1920, height: 1080 };
    const engine = new StudioEngine(mockCanvas, mockVideo, null, [], 10, [], {
        zoomLevel: 1.55,
        focusSegments: [
            { id: 'seg1', startTime: 1.0, endTime: 3.0, zoomScale: 1.55, targetX: 0.5, targetY: 0.5 },
            { id: 'seg2', startTime: 4.0, endTime: 6.0, zoomScale: 1.55, targetX: 0.6, targetY: 0.6 },
        ]
    });
    assert.equal(engine.zoomLevel, 1.55);

    // Switch to subtle preset (1.35x)
    engine.setZoomPreset('subtle');
    assert.equal(engine.zoomLevel, 1.35);
    assert.equal(engine.focusSegments[0].zoomScale, 1.35);
    assert.equal(engine.focusSegments[1].zoomScale, 1.35);

    // Switch to focus preset (1.85x)
    engine.setZoomPreset('focus');
    assert.equal(engine.zoomLevel, 1.85);
    assert.equal(engine.focusSegments[0].zoomScale, 1.85);
    assert.equal(engine.focusSegments[1].zoomScale, 1.85);
});




test('pointer hides while outside the recorded area', async () => {
    const { cursorAreaOpacity } = await import('../src/lib/rendering/renderFrame.js');
    const samples = [{ time: 0, x: 0.5, y: 0.5 }, { time: 100, x: 1, y: 0.5, hidden: true }, { time: 300, x: 0.9, y: 0.5 }];
    assert.equal(cursorAreaOpacity(0.05, samples), 1);
    assert.equal(cursorAreaOpacity(0.2, samples), 0);
    assert.equal(cursorAreaOpacity(0.35, samples), 1);
});

test('camera motion blur: several video draws while the camera moves, one when still', () => {
    const draws = { n: 0 };
    const noop = () => {};
    const ctx = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'drawImage') return (img) => { if (img && img.__video) draws.n++; };
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            if (key === 'createPattern') return () => null;
            return noop;
        },
        set(target, key, value) { target[key] = value; return true; },
    });
    const video = { __video: true, width: 1920, height: 1080, videoWidth: 1920, videoHeight: 1080 };
    const segs = [{ startTime: 1, endTime: 6, targetX: 0.3, targetY: 0.3, zoomScale: 1.6 }];
    renderFrame(ctx, 0.2, video, { focusSegments: segs }, { duration: 8 });
    const still = draws.n;
    draws.n = 0;
    renderFrame(ctx, 1.6, video, { focusSegments: segs }, { duration: 8 });
    const moving = draws.n;
    draws.n = 0;
    renderFrame(ctx, 1.6, video, { focusSegments: segs }, { duration: 8, cameraMotionBlur: false });
    assert.equal(still, 1);
    assert.ok(moving > 1, `expected blur draws while moving, got ${moving}`);
    assert.equal(draws.n, 1, 'blur can be turned off');
});

test('changing the zoom preset re-plans auto zooms and keeps their variety', async () => {
    const { StudioEngine } = await import('../src/lib/StudioEngine.js');
    const noop = () => {};
    const ctx = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            return noop;
        },
        set(target, key, value) { target[key] = value; return true; },
    });
    const canvas = { width: 1920, height: 1080, getContext: () => ctx };
    const video = { addEventListener: noop, removeEventListener: noop, pause: noop };
    // Tight detail work early, spread-out work later.
    const clicks = [
        { time: 1000, x: 0.5, y: 0.5 }, { time: 1600, x: 0.51, y: 0.5 }, { time: 2200, x: 0.5, y: 0.51 },
        { time: 9000, x: 0.25, y: 0.5 }, { time: 9900, x: 0.62, y: 0.55 },
    ];
    const engine = new StudioEngine(canvas, video, null, clicks, 14, [], {});
    engine.setZoomLevel(1.35);
    const [tight, spread] = engine.focusSegments;
    assert.ok(tight.zoomScale > 1.35, `detail work should go deeper than the preset, got ${tight.zoomScale}`);
    assert.ok(spread.zoomScale <= 1.35);
});
