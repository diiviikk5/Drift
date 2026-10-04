import test from 'node:test';
import assert from 'node:assert/strict';
import { computeCursorSwayRotation } from '../src/lib/zoom/cursorTilt.js';

test('cursor tilt leans into motion, scales with speed and stays bounded', () => {
    assert.equal(computeCursorSwayRotation(0, 0, 16, 1.0), 0);
    assert.equal(computeCursorSwayRotation(10, 10, 16, 0), 0);
    const slow = computeCursorSwayRotation(2, 0, 16, 1.0);
    const fast = computeCursorSwayRotation(40, 0, 16, 1.0);
    assert.ok(slow > 0 && fast > slow);
    assert.ok(computeCursorSwayRotation(-40, 0, 16, 1.0) < 0);
    assert.ok(Math.abs(computeCursorSwayRotation(5000, 0, 16, 1.0)) <= (12 * Math.PI) / 180 + 1e-9);
});

test('evaluateCameraAtTime supports steady framing when trackCursor is false and dynamic tracking when enabled', async () => {
    const { evaluateCameraAtTime } = await import('../src/lib/rendering/renderFrame.js');
    const segs = [
        { startTime: 1.0, endTime: 5.0, targetX: 0.4, targetY: 0.4, zoomScale: 2.0 }
    ];
    // Mouse moving across the edge during the hold (at 3.0s)
    const mouse1 = [{ t: 3.0, x: 0.1, y: 0.1 }];
    const mouse2 = [{ t: 3.0, x: 0.9, y: 0.9 }];

    // When trackCursor is false, camera stays steady at anchor
    const steady1 = evaluateCameraAtTime(3.0, segs, mouse1, { trackCursor: false });
    const steady2 = evaluateCameraAtTime(3.0, segs, mouse2, { trackCursor: false });
    assert.equal(steady1.x, steady2.x);
    assert.equal(steady1.y, steady2.y);

    // When tracking is active (default), camera follows the cursor
    const tracked1 = evaluateCameraAtTime(3.0, segs, mouse1);
    const tracked2 = evaluateCameraAtTime(3.0, segs, mouse2);
    assert.ok(tracked1.x < tracked2.x, 'Camera should follow cursor towards left/right');
    assert.ok(tracked1.y < tracked2.y, 'Camera should follow cursor towards top/bottom');
});

test('tauri-bridge exports hideOsCursor and showOsCursor helpers', async () => {
    const { hideOsCursor, showOsCursor } = await import('../src/lib/tauri-bridge.js');
    assert.equal(typeof hideOsCursor, 'function');
    assert.equal(typeof showOsCursor, 'function');
    // In node test environment, they resolve gracefully to false
    assert.equal(await hideOsCursor(), false);
    assert.equal(await showOsCursor(), false);
});

function createMockCanvas(width = 1920, height = 1080) {
    const noop = () => {};
    const mockCanvas = { width, height };
    const mockCtx = new Proxy({ canvas: mockCanvas }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            return noop;
        },
    });
    mockCanvas.getContext = () => mockCtx;
    return mockCanvas;
}

test('StudioEngine setFraming and setShowCursor update state and trigger drawFrame', async () => {
    const { StudioEngine } = await import('../src/lib/StudioEngine.js');
    const mockCanvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, readyState: 4, currentTime: 0, duration: 10 };
    const studio = new StudioEngine(mockCanvas, mockVideo, null, [], 10);

    let drawCount = 0;
    studio.drawFrame = () => { drawCount++; };

    studio.setShowCursor(true);
    assert.equal(studio.showCursor, true);
    assert.equal(drawCount, 1);

    studio.setShowCursor(false);
    assert.equal(studio.showCursor, false);
    assert.equal(drawCount, 2);

    studio.setFraming({ insetPadding: 0, borderRadius: 0, windowChrome: false });
    assert.equal(studio.insetPadding, 0);
    assert.equal(studio.borderRadius, 0);
    assert.equal(studio.windowChrome, false);
    assert.equal(drawCount, 3);
});

test('StudioEngine addZoom re-targets active segment in-place', async () => {
    const { StudioEngine } = await import('../src/lib/StudioEngine.js');
    const mockCanvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, readyState: 4, currentTime: 2.0, duration: 10 };
    const studio = new StudioEngine(mockCanvas, mockVideo, null, [], 10);
    studio.focusSegments = [
        { id: 'seg-1', startTime: 1.0, endTime: 4.0, targetX: 0.2, targetY: 0.2, zoomScale: 1.8 }
    ];

    // Clicking at t=2.0 should re-target seg-1 rather than creating a duplicate
    await studio.addZoom(2.0, 0.8, 0.7, 2.2);

    assert.equal(studio.focusSegments.length, 1);
    assert.equal(studio.focusSegments[0].id, 'seg-1');
    assert.equal(studio.focusSegments[0].targetX, 0.8);
    assert.equal(studio.focusSegments[0].targetY, 0.7);
    assert.equal(studio.focusSegments[0].zoomScale, 2.2);
});

test('StudioEngine setAspectRatio supports native video dimensions', async () => {
    const { StudioEngine } = await import('../src/lib/StudioEngine.js');
    const mockCanvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1440, videoHeight: 900, readyState: 4, currentTime: 0, duration: 10 };
    const studio = new StudioEngine(mockCanvas, mockVideo, null, [], 10);
    studio.drawFrame = () => {};

    studio.setAspectRatio('native');
    assert.equal(studio.canvas.width, 1440);
    assert.equal(studio.canvas.height, 900);
});

test('smoothed cursor path is lag-free, removes jitter, pins clicks and handles edge values', async () => {
    const { getSmoothedCursorPath } = await import('../src/lib/zoom/cursorPathSmoothing.js');
    // Fast sweep at 3000 px/s (1080p units) sampled every 5 ms, with 1px jitter.
    const samples = [];
    for (let t = 0; t <= 500; t += 5) {
        const jitter = (t / 5) % 2 ? 1 / 1920 : -1 / 1920;
        samples.push({ time: t, x: 0.1 + (t / 500) * 0.78 + jitter, y: 0.5 });
    }
    for (let t = 505; t <= 900; t += 5) samples.push({ time: t, x: 0.88, y: 0.5 });
    samples.push({ time: 900, x: 0.88, y: 0.5, click: 'left' });
    const path = getSmoothedCursorPath(samples, 1.0);
    // On schedule mid-sweep (a causal spring trailed by >100 px here).
    const mid = path.sampleAt(250);
    assert.ok(Math.abs(mid.cx - 0.49) * 1920 < 3, `lag ${((0.49 - mid.cx) * 1920).toFixed(1)}px`);
    // No overshoot after stopping.
    for (let t = 500; t <= 900; t += 10) assert.ok(path.sampleAt(t).cx <= 0.8801);
    assert.ok(Math.abs(path.sampleAt(900).cx - 0.88) < 1e-6);
    // A position a hair past the edge is not mistaken for pixels.
    const edge = getSmoothedCursorPath([{ time: 0, x: 0.99, y: 0.5 }, { time: 10, x: 1.001, y: 0.5 }], 0);
    assert.ok(edge.sampleAt(10).cx > 0.99);
});

test('InteractionAnalyzer filters startup click at t <= 300ms to preserve unzoomed overview', async () => {
    const { InteractionAnalyzer } = await import('../src/lib/zoom/InteractionAnalyzer.js');
    const analyzer = new InteractionAnalyzer();

    // User clicked "Record" button at t = 100ms
    const startupClick = [{ time: 100, x: 0.1, y: 0.1 }];
    const segs = analyzer.analyze(startupClick, [], 10);
    assert.equal(segs.length, 0); // No accidental zoom on startup!

    // Later intentional click at t = 1500ms
    const intentionalClick = [{ time: 1500, x: 0.4, y: 0.4 }];
    const intentionalSegs = analyzer.analyze(intentionalClick, [], 10);
    assert.equal(intentionalSegs.length, 1);
    assert.ok(intentionalSegs[0].startTime >= 0.5);
});

test('renderFrame maintains perfectly balanced context save and restore calls', async () => {
    const { renderFrame } = await import('../src/lib/rendering/renderFrame.js');
    let saveCount = 0;
    let restoreCount = 0;

    const noop = () => {};
    const mockCanvas = { width: 1920, height: 1080 };
    const mockCtx = new Proxy({ canvas: mockCanvas }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'save') return () => { saveCount++; };
            if (key === 'restore') return () => { restoreCount++; };
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            return noop;
        },
    });

    renderFrame(mockCtx, 1.0, null, {}, { insetPadding: 0.08, windowChrome: true });
    assert.ok(saveCount > 0);
    assert.equal(saveCount, restoreCount); // Zero state leaks!
});

test('evaluateCameraAtTime smoothly glides through contiguous (gap=0) and overlapping segments with zero jump cuts', async () => {
    const { evaluateCameraAtTime } = await import('../src/lib/rendering/renderFrame.js');
    const touchingSegments = [
        { startTime: 1.0, endTime: 3.0, targetX: 0.2, targetY: 0.3, zoomScale: 2.0 },
        { startTime: 3.0, endTime: 5.0, targetX: 0.8, targetY: 0.7, zoomScale: 2.0 },
    ];

    // Right before boundary, at boundary, and right after boundary
    const camBefore = evaluateCameraAtTime(2.95, touchingSegments);
    const camMid = evaluateCameraAtTime(3.00, touchingSegments);
    const camAfter = evaluateCameraAtTime(3.05, touchingSegments);

    // Continuous, smooth transition across the boundary
    assert.ok(camBefore.x < camMid.x, 'Camera X should smoothly move towards second target before junction');
    assert.ok(camMid.x < camAfter.x, 'Camera X should continue moving smoothly past junction');
    assert.ok(Math.abs(camAfter.x - camBefore.x) < 0.25, 'No sudden 60% jump cut across 100ms span');
    assert.ok(camMid.scale >= 1.95, 'Camera stays fully zoomed in without dipping or snapping to overview');
});
