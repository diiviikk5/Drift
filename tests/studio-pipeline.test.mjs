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

test('getSmoothedCursorPath computes 240Hz symplectic Euler physics with natural inertia', async () => {
    const { getSmoothedCursorPath, getCursorSpringConfig, springSmooth } = await import('../src/lib/zoom/cursorPathSmoothing.js');

    // Verify spring configs for different smoothing strengths
    const cfgLow = getCursorSpringConfig(0.2);
    const cfgHigh = getCursorSpringConfig(1.0);
    assert.ok(cfgLow.stiffness > cfgHigh.stiffness); // lower smoothing has stiffer response
    assert.ok(cfgHigh.damping > cfgLow.damping);     // higher smoothing has more damping

    // Test symplectic Euler numerical stability
    const targets = new Float32Array(240).fill(1.0); // 1-second step target
    targets[0] = 0.0;
    const smoothed = springSmooth(targets, cfgHigh.stiffness, cfgHigh.damping, cfgHigh.mass);
    assert.equal(smoothed[0], 0.0);
    assert.ok(smoothed[smoothed.length - 1] > 0.95); // converges to target
    assert.ok(smoothed[20] > 0.0 && smoothed[20] < 1.0); // smooth ramp

    // Test path sampling
    const samples = [
        { time: 0, x: 0.1, y: 0.1 },
        { time: 500, x: 0.5, y: 0.5 },
        { time: 1000, x: 0.9, y: 0.9 },
    ];
    const path = getSmoothedCursorPath(samples, 1.0, { sourceWidth: 1920, sourceHeight: 1080 });
    assert.ok(path !== null);
    const mid = path.sampleAt(500);
    assert.ok(mid !== null);
    assert.ok(mid.cx > 0.3 && mid.cx < 0.7);
    assert.ok(mid.cy > 0.3 && mid.cy < 0.7);
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
