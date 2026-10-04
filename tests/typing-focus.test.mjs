import test from 'node:test';
import assert from 'node:assert/strict';
import { typingWindows, buildFocusSamples, typingPointerOpacity } from '../src/lib/zoom/typingFocus.js';
import { InteractionAnalyzer } from '../src/lib/zoom/InteractionAnalyzer.js';

// Mouse parked bottom-right; user types into a field at the top-left.
const moves = [];
for (let t = 0; t <= 1000; t += 10) moves.push({ time: t, x: 0.2 + 0.6 * (t / 1000), y: 0.8 });
moves.push({ time: 9000, x: 0.8001, y: 0.8 });
const keys = [];
for (let t = 2.0; t <= 6.0; t += 0.15) keys.push({ time: Math.round(t * 100) / 100, text: '', typed: true });
const caret = [{ time: 1500, x: 0.15, y: 0.2, h: 0.02 }, { time: 4000, x: 0.3, y: 0.24, h: 0.02 }];

test('typing stretches are grouped from key timing', () => {
    const w = typingWindows(keys);
    assert.equal(w.length, 1);
    assert.ok(w[0][0] < 2 && w[0][1] > 6);
    assert.equal(typingWindows([{ time: 3, typed: true }]).length, 0, 'a single stray key is not typing');
});

test('while typing, focus follows the caret instead of the parked mouse', () => {
    const focus = buildFocusSamples(moves, caret, keys);
    const at = (ms) => focus.filter(s => s.time <= ms).pop();
    assert.ok(Math.abs(at(3000).x - 0.15) < 1e-9 && at(3000).caret);
    assert.ok(Math.abs(at(5000).x - 0.3) < 1e-9);
    assert.ok(Math.abs(at(500).x - 0.5) < 0.01, 'outside typing the mouse is the focus');
});

test('auto-zoom aims typing zooms at the caret', () => {
    const focus = buildFocusSamples(moves, caret, keys);
    const segs = new InteractionAnalyzer().analyze([], focus, 10, keys);
    const typingSeg = segs.find(s => s.startTime <= 3 && s.endTime >= 3);
    assert.ok(typingSeg, JSON.stringify(segs));
    assert.ok(typingSeg.targetX < 0.45 && typingSeg.targetY < 0.45, JSON.stringify(typingSeg));
});

test('pointer fades out while typing and is visible otherwise', () => {
    assert.equal(typingPointerOpacity(1.0, keys, moves), 1);
    assert.ok(typingPointerOpacity(3.5, keys, moves) < 0.05);
    assert.equal(typingPointerOpacity(8.0, keys, moves), 1);
});
