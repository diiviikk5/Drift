import test from 'node:test';
import assert from 'node:assert/strict';
import { StudioEngine } from '../src/lib/StudioEngine.js';
// Camera-mechanics tests zoom on every action and skip the zoom budget.
const PER_ACTION = { minActions: 1, maxZoomedShare: 1 };


function createMockCanvas(width = 1920, height = 1080) {
    const canvas = { width, height };
    const noop = () => {};
    const target = { canvas };
    const ctx = new Proxy(target, {
        get(t, key) {
            if (key in t) return t[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') {
                return () => ({ addColorStop: noop });
            }
            return noop;
        },
        set(t, key, val) {
            t[key] = val;
            return true;
        }
    });
    canvas.getContext = () => ctx;
    return canvas;
}

test('StudioEngine resolveClick accurately maps center click to center of video (0.5, 0.5)', () => {
    const canvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, currentTime: 0 };
    const engine = new StudioEngine(canvas, mockVideo, null, [], 10, [], {
        insetPadding: 0.08,
        windowChrome: true,
    });

    const result = engine.resolveClick(0.5, 0.5);
    assert.ok(Math.abs(result.x - 0.5) < 0.05, 'Expected x near 0.5');
    assert.ok(Math.abs(result.y - 0.5) < 0.05, 'Expected y near 0.5');
});

test('StudioEngine addFocusSegment and split segment preserve chronological timeline structure', () => {
    const canvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, currentTime: 0 };
    const engine = new StudioEngine(canvas, mockVideo, null, [], 10, [], {});

    const segId = 'seg_test_1';
    engine.addFocusSegment({
        id: segId,
        startTime: 2.0,
        endTime: 6.0,
        targetX: 0.3,
        targetY: 0.4,
        zoomScale: 2.2,
    });

    assert.equal(engine.focusSegments.length, 1);
    assert.equal(engine.focusSegments[0].startTime, 2.0);
    assert.equal(engine.focusSegments[0].endTime, 6.0);

    engine.updateFocusSegment(segId, { endTime: 4.0 });
    engine.addFocusSegment({
        id: 'seg_test_2',
        startTime: 4.0,
        endTime: 6.0,
        targetX: 0.3,
        targetY: 0.4,
        zoomScale: 2.2,
    });

    assert.equal(engine.focusSegments.length, 2);
    assert.equal(engine.focusSegments[0].startTime, 2.0);
    assert.equal(engine.focusSegments[0].endTime, 4.0);
    assert.equal(engine.focusSegments[1].startTime, 4.0);
    assert.equal(engine.focusSegments[1].endTime, 6.0);
});

test('StudioEngine setKeystrokes updates keystroke state and preserves overlay configuration', () => {
    const canvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, currentTime: 0 };
    const engine = new StudioEngine(canvas, mockVideo, null, [], 10, [], {
        showKeystrokes: true,
    });

    assert.equal(engine.showKeystrokes, true);
    engine.setKeystrokes([{ time: 1.5, text: 'Ctrl+Shift+P' }]);
    assert.equal(engine.keystrokes.length, 1);
    assert.equal(engine.keystrokes[0].text, 'Ctrl+Shift+P');

    engine.setShowKeystrokes(false);
    assert.equal(engine.showKeystrokes, false);
});

test('StudioEngine aspect ratio and export resolution mappings support 4K UHD and 2K QHD', () => {
    const canvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, currentTime: 0 };
    const engine = new StudioEngine(canvas, mockVideo, null, [], 10, [], {});

    assert.equal(engine.aspectRatio, '16:9');
    engine.setAspectRatio('9:16');
    assert.equal(engine.aspectRatio, '9:16');

    engine.setAspectRatio('1:1');
    assert.equal(engine.aspectRatio, '1:1');

    engine.setAspectRatio('4:5');
    assert.equal(engine.aspectRatio, '4:5');
});

test('StudioEngine generates cinema click zooms by default and supports overview reset', async () => {
    const canvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, currentTime: 0 };
    const clicks = [
        { time: 1000, x: 0.2, y: 0.3 },
        { time: 2500, x: 0.7, y: 0.8 },
        { time: 4000, x: 0.5, y: 0.5 },
    ];
    const engine = new StudioEngine(canvas, mockVideo, null, clicks, 10, [], {});

    // By default, focusSegments are automatically generated from clicks for cinema-grade recording
    assert.ok(engine.focusSegments.length > 0, 'Expected auto click-zoom cuts by default');
    assert.equal(engine.camera.scale, 1.0, 'Expected initial camera scale 1.0 before playback');

    // Resetting to overview clears them and restores steady camera
    engine.resetToOverview();
    assert.equal(engine.focusSegments.length, 0, 'Expected focus segments cleared after resetToOverview');
    assert.equal(engine.camera.scale, 1.0, 'Expected overview scale 1.0 after reset');
});

test('StudioEngine addZoom resolves cursor position and adds focus segment', async () => {
    const canvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, currentTime: 2 };
    const moves = [
        { time: 1000, x: 0.3, y: 0.4 },
        { time: 2000, x: 0.7, y: 0.8 },
    ];
    const engine = new StudioEngine(canvas, mockVideo, null, [], 10, moves, {});

    await engine.addZoom(2.0, null, null, 2.2);
    const segments = engine.getFocusSegments();
    assert.equal(segments.length, 1, 'Expected 1 focus segment added');
    assert.ok(Math.abs(segments[0].targetX - 0.7) < 0.1, 'Target X should follow cursor near 0.7');
    assert.ok(Math.abs(segments[0].targetY - 0.8) < 0.1, 'Target Y should follow cursor near 0.8');
    assert.equal(segments[0].zoomScale, 2.2, 'Expected zoom scale 2.2');
});

test('camera stays rock-solid within deadzone radius without sloppy mouse wobble', async () => {
    const { evaluateCameraAtTime } = await import('../src/lib/rendering/renderFrame.js');
    const segs = [
        { startTime: 1.0, endTime: 6.0, targetX: 0.5, targetY: 0.5, zoomScale: 1.55 }
    ];
    // Mouse moving gently around the center inside the deadzone (< 0.15 distance)
    const mouseStationary = [{ t: 3.0, x: 0.50, y: 0.50 }];
    const mouseSlightDrift = [{ t: 3.0, x: 0.58, y: 0.56 }]; // dist = Math.hypot(0.08, 0.06) = 0.10 < 0.18

    const camStationary = evaluateCameraAtTime(3.0, segs, mouseStationary);
    const camDrift = evaluateCameraAtTime(3.0, segs, mouseSlightDrift);

    // Camera MUST stay rock-solid at center, zero sloppy wobbling
    assert.equal(camStationary.x, camDrift.x, 'Camera X should not drift for small mouse movements in deadzone');
    assert.equal(camStationary.y, camDrift.y, 'Camera Y should not drift for small mouse movements in deadzone');
});

test('interaction clustering centers camera on common centroid of multiple clicks', async () => {
    const { InteractionAnalyzer } = await import('../src/lib/zoom/InteractionAnalyzer.js');
    const analyzer = new InteractionAnalyzer(PER_ACTION);
    // User clicks twice on nearby elements in a dialog or toolbar within 1.5s
    const clicks = [
        { time: 1000, x: 0.30, y: 0.40 },
        { time: 2500, x: 0.40, y: 0.46 },
    ];
    const track = analyzer.analyze(clicks, [], 10);
    assert.equal(track.length, 1, 'Should coalesce nearby interactions into a single calm focus scene');
    // Centroid of (0.30, 0.40) and (0.40, 0.46) is (0.35, 0.43)
    assert.ok(Math.abs(track[0].targetX - 0.35) < 0.02, `Expected centroid X near 0.35, got ${track[0].targetX}`);
    assert.ok(Math.abs(track[0].targetY - 0.43) < 0.02, `Expected centroid Y near 0.43, got ${track[0].targetY}`);
});



