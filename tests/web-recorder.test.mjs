import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestedTrim, telemetryToArea } from '../src/lib/web/WebRecorder.js';

test('screen takes lose the moments spent on Drift at both ends', () => {
    const presence = [{ t: 0, here: true }, { t: 1800, here: false }, { t: 41000, here: true }];
    const trim = suggestedTrim(presence, 42500, 'monitor');
    assert.deepEqual(trim, { start: 2.05, end: 40.9 });
});

test('no trim for windows and tabs, or when Drift was never in front', () => {
    const presence = [{ t: 0, here: true }, { t: 1800, here: false }, { t: 41000, here: true }];
    assert.equal(suggestedTrim(presence, 42500, 'window'), null);
    assert.equal(suggestedTrim([{ t: 0, here: false }], 42500, 'monitor'), null);
});

test('a late switch away is not trimmed (it was part of the take)', () => {
    const presence = [{ t: 0, here: true }, { t: 15000, here: false }];
    assert.equal(suggestedTrim(presence, 42500, 'monitor'), null);
});

test('telemetry moves into a recorded area, hiding what falls outside', () => {
    const t = telemetryToArea({
        moves: [{ time: 0, x: 0.5, y: 0.5 }, { time: 10, x: 0.05, y: 0.5 }],
        clicks: [{ time: 5, x: 0.4, y: 0.4 }],
        caret: [{ time: 7, x: 0.3, y: 0.3, h: 0.02 }],
    }, { x: 0.25, y: 0.25, w: 0.5, h: 0.5 });
    assert.deepEqual(t.moves[0], { time: 0, x: 0.5, y: 0.5 });
    assert.equal(t.moves[1].hidden, true);
    assert.ok(Math.abs(t.clicks[0].x - 0.3) < 1e-9);
    assert.ok(Math.abs(t.caret[0].h - 0.04) < 1e-9);
});
