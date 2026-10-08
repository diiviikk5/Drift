import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENARIOS } from '../tools/camera-scenarios.mjs';
import { measure } from '../tools/camera-metrics.mjs';

// The camera's motion budget: what "calm and silky" means in numbers.
// Motion is perceived speed in viewport widths per second (pan) combined with
// log-zoom rate; acceleration is its change per second.
const BUDGET = {
    peakMotion: 1.0,
    peakAccel: 4.0,
    cursorOffPct: 2.0,
};

for (const [name, make] of Object.entries(SCENARIOS)) {
    test(`camera feel: ${name}`, () => {
        const m = measure(make());
        assert.ok(m.peakMotion <= BUDGET.peakMotion, `peak motion ${m.peakMotion.toFixed(2)} > ${BUDGET.peakMotion}`);
        assert.ok(m.peakAccel <= BUDGET.peakAccel, `peak acceleration ${m.peakAccel.toFixed(2)} > ${BUDGET.peakAccel}`);
        assert.ok(m.cursorOffPct <= BUDGET.cursorOffPct, `cursor off screen ${m.cursorOffPct.toFixed(1)}% while zoomed`);
        // One rhythm: every move uses one of the three tempos (in, out, swoop).
        for (const d of m.moveDurations) {
            assert.ok([1.35, 1.512, 2.2].some(t => Math.abs(d - t) < 0.01), `move of ${d.toFixed(2)} s breaks the tempo`);
        }
        const [seen, total] = m.clicksFramed.split('/').map(Number);
        assert.ok(seen >= total - Math.floor(total * 0.05), `only ${m.clicksFramed} clicks in frame`);
    });
}

test('camera feel: frantic hopping stays on the full frame', () => {
    assert.equal(measure(SCENARIOS['fast clicks across the whole screen']()).zoomedPct, 0);
    assert.equal(measure(SCENARIOS['ping-pong between two panels']()).zoomedPct, 0);
});

test('camera feel: a chained form fill is one calm shot', () => {
    const m = measure(SCENARIOS['chained form fill (6 fields, quick)']());
    assert.equal(m.segments, 1);
    assert.ok(m.reversals <= 1);
});

test('camera feel: the rhythm is the same in the output at any playback speed', async () => {
    const { getCameraTrack } = await import('../src/lib/zoom/cameraTrack.js');
    const { InteractionAnalyzer } = await import('../src/lib/zoom/InteractionAnalyzer.js');
    const s = SCENARIOS['deliberate tour of four areas']();
    const segs = new InteractionAnalyzer().analyze(s.clicks, s.moves, s.duration, s.keys);
    const outputDurations = (speed) => getCameraTrack(segs, s.moves, { duration: s.duration, playbackSpeed: speed })
        .moves.map(m => m.d / speed);
    const base = outputDurations(1);
    assert.ok(base.length > 0);
    for (const speed of [0.75, 1.5]) {
        for (const d of outputDurations(speed)) {
            assert.ok(base.some(b => Math.abs(b - d) < 0.01), `a ${d.toFixed(2)} s move at ${speed}x breaks the output tempo`);
        }
    }
});
