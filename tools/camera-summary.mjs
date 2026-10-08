/**
 * One-line camera quality summary over many recorder sessions.
 *
 *   node tools/camera-summary.mjs <sessions dir>
 */
import fs from 'fs';
import path from 'path';
import { measure, loadSession } from './camera-metrics.mjs';
import { InteractionAnalyzer } from '../src/lib/zoom/InteractionAnalyzer.js';
import { evaluateCameraAtTime } from '../src/lib/rendering/renderFrame.js';

const root = process.argv[2];
const dirs = fs.readdirSync(root).map(d => path.join(root, d)).filter(d => fs.existsSync(path.join(d, 'telemetry.json')));
let zClicks = 0, zMissed = 0;
let n = 0, zoomedSessions = 0, offSum = 0, offWorst = 0, offBad = 0, seen = 0, total = 0, travelWorst = 0, zoomPct = 0, peak = 0;
for (const d of dirs) {
    const session = loadSession(d);
    const m = measure(session);
    // Clicks made while zoomed in that the view doesn't show (the real failure).
    const segs = new InteractionAnalyzer().analyze(session.clicks, session.moves, session.duration, session.keys);
    for (const c of session.clicks.filter(c => !c.hidden)) {
        const cam = evaluateCameraAtTime(c.time / 1000, segs, session.moves, { duration: session.duration });
        if (cam.scale < 1.05) continue;
        zClicks++;
        const half = 0.5 / cam.scale;
        if (Math.abs(c.x - cam.x) > half || Math.abs(c.y - cam.y) > half) zMissed++;
    }
    n++;
    if (m.zoomedPct > 0) zoomedSessions++;
    offSum += m.cursorOffPct;
    offWorst = Math.max(offWorst, m.cursorOffPct);
    if (m.cursorOffPct > 1) offBad++;
    const [a, b] = m.clicksFramed.split('/').map(Number);
    seen += a; total += b;
    travelWorst = Math.max(travelWorst, m.zoomedTravel);
    zoomPct += m.zoomedPct;
    peak = Math.max(peak, m.peakMotion);
}
console.log(`${n} sessions | zoomed in ${zoomedSessions} | avg zoomed ${(zoomPct / n).toFixed(0)}% | cursor off while zoomed: avg ${(offSum / n).toFixed(2)}% worst ${offWorst.toFixed(1)}% sessions>1% ${offBad} | clicks framed ${seen}/${total} | zoomed clicks missed ${zMissed}/${zClicks} | worst zoomed travel ${travelWorst.toFixed(2)} | peak motion ${peak.toFixed(2)}`);
