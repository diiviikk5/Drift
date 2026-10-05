import test from 'node:test';
import assert from 'node:assert/strict';
import { cursorShapeAt, drawCursorShape, themeHasShapes } from '../src/lib/rendering/cursorShapes.js';
import { renderFrame } from '../src/lib/rendering/renderFrame.js';

const shapes = [{ time: 0, shape: 'arrow' }, { time: 1000, shape: 'text' }, { time: 2500, shape: 'hand' }, { time: 4000, shape: 'weird' }];

test('cursor shape follows the recorded changes', () => {
    assert.equal(cursorShapeAt(0.5, shapes), 'arrow');
    assert.equal(cursorShapeAt(1.2, shapes), 'text');
    assert.equal(cursorShapeAt(3, shapes), 'hand');
    assert.equal(cursorShapeAt(5, shapes), 'arrow', 'unknown shapes fall back to the arrow');
    assert.equal(cursorShapeAt(1, []), 'arrow');
});

test('only pointer themes switch shapes; stylized themes keep their look', () => {
    assert.ok(themeHasShapes('windows') && themeHasShapes('macos'));
    assert.ok(!themeHasShapes('dot') && !themeHasShapes('ring'));
});

test('every shape draws without throwing; the arrow is left to the theme', () => {
    const noop = () => {};
    const ctx = new Proxy({}, { get: () => noop, set: () => true });
    assert.equal(drawCursorShape(ctx, 10, 10, 1, 'arrow', 'windows'), false);
    for (const s of ['text', 'hand', 'resize-ew', 'resize-ns', 'resize-nwse', 'resize-nesw', 'move', 'wait', 'crosshair', 'not-allowed']) {
        assert.equal(drawCursorShape(ctx, 10, 10, 1, s, 'windows'), true, s);
    }
    assert.equal(drawCursorShape(ctx, 10, 10, 1, 'progress', 'macos'), false, 'progress keeps the arrow and adds a spinner');
});

test('the renderer draws the I-beam while the real cursor was a text cursor', () => {
    const calls = [];
    const noop = () => {};
    const ctx = new Proxy({ canvas: { width: 1920, height: 1080 } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'quadraticCurveTo') return () => calls.push('curve');
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
            if (key === 'createPattern') return () => null;
            return noop;
        },
        set(target, key, value) { target[key] = value; return true; },
    });
    const moves = [{ time: 0, x: 0.5, y: 0.5 }, { time: 3000, x: 0.5, y: 0.5 }];
    const curves = (t) => {
        calls.length = 0;
        renderFrame(ctx, t, null, { mouseSamples: moves, cursorShapes: shapes }, { showCursor: true, cursorTheme: 'windows' });
        return calls.length;
    };
    // The I-beam's serifs are the only extra curves compared with the arrow.
    assert.ok(curves(1.5) - curves(0.5) >= 4, 'I-beam drawn while the real cursor was a text cursor');
});
