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
