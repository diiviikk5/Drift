import test from 'node:test';
import assert from 'node:assert/strict';
import { renderFrame } from '../src/lib/rendering/renderFrame.js';

function createMockContext() {
    const operations = [];
    const target = {
        operations,
        canvas: { width: 1920, height: 1080 },
        set fillStyle(val) { operations.push({ op: 'set_fillStyle', val }); },
        get fillStyle() { return '#000'; },
        set strokeStyle(val) { operations.push({ op: 'set_strokeStyle', val }); },
        get strokeStyle() { return '#000'; },
        set lineWidth(val) { operations.push({ op: 'set_lineWidth', val }); },
        get lineWidth() { return 1; },
        set globalAlpha(val) { operations.push({ op: 'set_globalAlpha', val }); },
        get globalAlpha() { return 1.0; },
    };
    return new Proxy(target, {
        get(t, key) {
            if (key in t) return t[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') {
                return () => ({ addColorStop: () => {} });
            }
            return (...args) => {
                operations.push({ op: key, args });
            };
        }
    });
}

test('renderFrame completes smoothly with null videoSource without throwing', () => {
    const ctx = createMockContext();
    assert.doesNotThrow(() => {
        renderFrame(ctx, 0.0, null, {
            focusSegments: [],
            mouseSamples: [],
            clicks: [],
        }, {
            background: 'midnight',
            windowChrome: true,
            showCursor: false,
        });
    });

    const rectOps = ctx.operations.filter(op => op.op === 'rect');
    assert.ok(rectOps.length > 0, 'Clipping rectangle should be defined');
    const fillRectOps = ctx.operations.filter(op => op.op === 'fillRect');
    assert.ok(fillRectOps.length > 0, 'Viewport fallback background should be painted');
});

test('renderFrame paints videoSource via drawImage inside camera transform', () => {
    const ctx = createMockContext();
    const mockVideo = {
        videoWidth: 1920,
        videoHeight: 1080,
        readyState: 4,
        currentTime: 1.5,
    };

    assert.doesNotThrow(() => {
        renderFrame(ctx, 1.5, mockVideo, {
            focusSegments: [],
            mouseSamples: [],
            clicks: [],
        }, {
            background: 'bigSur',
            windowChrome: true,
            showCursor: false,
        });
    });

    const drawOps = ctx.operations.filter(op => op.op === 'drawImage');
    assert.equal(drawOps.length, 1, 'Exactly one video frame should be drawn');
});
