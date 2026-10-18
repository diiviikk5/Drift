import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateOffset, syncProbeTimes, shiftTelemetry } from '../src/lib/vision/pointerSync.js';
import { ScreenAnalyzer } from '../src/lib/vision/ScreenAnalyzer.js';
import { makeDesktop, pathAt, renderFrame, luma } from './helpers/scene.mjs';

const W = 1280, H = 720;
const desktop = makeDesktop(W, H);
const PATH = [[0, 300, 300], [400, 300, 300], [1200, 900, 200], [1500, 900, 200], [2300, 200, 500], [2600, 200, 500], [3400, 1000, 600]];

test('finds the offset between the pointer track and the video', () => {
    // Analyzer timestamps run 100 ms behind the video's own clock.
    const LAG = 100;
    const a = new ScreenAnalyzer({ width: W, height: H });
    for (let t = 0; t <= 3400; t += 33.3) {
        const [x, y] = pathAt(PATH, t);
        a.push(renderFrame(desktop, W, H, { x, y }), t - LAG);
    }
    const { pointer } = a.finish();
    const times = syncProbeTimes(pointer.raw);
    assert.ok(times.length >= 6, `probes ${times.length}`);
    const frames = times.map(t => {
        const [x, y] = pathAt(PATH, t);
        return { t, luma: luma(renderFrame(desktop, W, H, { x, y }), W, H) };
    });
    const est = estimateOffset(frames, pointer);
    assert.ok(est && Math.abs(est.offset - LAG) <= 8, JSON.stringify(est));
});

test('shifting telemetry moves every track, keystrokes in seconds', () => {
    const t = shiftTelemetry({
        moves: [{ time: 100, x: 0, y: 0 }], clicks: [{ time: 200 }], caret: [], cursorShapes: [{ time: 0, shape: 'arrow' }],
        keystrokes: [{ time: 1.5, typed: true }], scrolls: [{ t: 50, shift: 4 }], pointer: { raw: [{ t: 10, x: 1, y: 1 }] },
    }, 96);
    assert.equal(t.moves[0].time, 196);
    assert.equal(t.clicks[0].time, 296);
    assert.equal(t.keystrokes[0].time, 1.6);
    assert.equal(t.scrolls[0].t, 146);
    assert.equal(t.pointer.raw[0].t, 106);
});
