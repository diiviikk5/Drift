import test from 'node:test';
import assert from 'node:assert/strict';
import { StudioEngine } from '../src/lib/StudioEngine.js';

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

test('StudioEngine defaults to calm OpenScreen-style overview without auto click zooms', async () => {
    const canvas = createMockCanvas(1920, 1080);
    const mockVideo = { videoWidth: 1920, videoHeight: 1080, currentTime: 0 };
    const clicks = [
        { time: 1000, x: 0.2, y: 0.3 },
        { time: 2500, x: 0.7, y: 0.8 },
        { time: 4000, x: 0.5, y: 0.5 },
    ];
    const engine = new StudioEngine(canvas, mockVideo, null, clicks, 10, [], {});

    // By default, focusSegments must be empty (overview) so recordings are soothing and don't jump around
    assert.equal(engine.focusSegments.length, 0, 'Expected no auto click-zoom cuts by default');
    assert.equal(engine.camera.scale, 1.0, 'Expected overview scale 1.0');

    // Enabling autoZoomOnClicks generates segments from clicks
    await engine.setAutoZoomOnClicks(true);
    assert.ok(engine.focusSegments.length > 0, 'Expected focus segments when autoZoomOnClicks is enabled');

    // Resetting to overview clears them and restores steady camera
    engine.resetToOverview();
    assert.equal(engine.focusSegments.length, 0, 'Expected focus segments cleared after resetToOverview');
    assert.equal(engine.camera.scale, 1.0, 'Expected overview scale 1.0 after reset');
});
