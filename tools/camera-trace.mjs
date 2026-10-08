/**
 * Trace the auto-zoom camera on one recorder session: the planned shots, the
 * camera moves, and every stretch where the cursor is outside a zoomed view.
 *
 *   node tools/camera-trace.mjs <session dir>
 */
import fs from 'fs';
import path from 'path';
import { InteractionAnalyzer } from '../src/lib/zoom/InteractionAnalyzer.js';
import { getCameraTrack, sampleCameraTrack } from '../src/lib/zoom/cameraTrack.js';

const dir = process.argv[2];
const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
const meta = read('session.json') || {};
const w = meta.width || 1920;
const h = meta.height || 1080;
const moves = (read('telemetry.json') || []).map(s => {
    const u = s.x / w;
    const v = s.y / h;
    const hidden = u < -0.005 || u > 1.005 || v < -0.005 || v > 1.005;
    return { time: s.t, x: Math.max(0, Math.min(1, u)), y: Math.max(0, Math.min(1, v)), click: s.click || undefined, ...(hidden ? { hidden } : {}) };
});
const clicks = moves.filter(m => m.click);
const keys = read('keystrokes.json') || [];
const duration = (meta.duration_ms || 10000) / 1000;

const segs = new InteractionAnalyzer().analyze(clicks, moves, duration, keys);
const track = getCameraTrack(segs, moves, { duration });
const f2 = (v) => v.toFixed(2);

console.log(`duration ${f2(duration)}s · ${moves.length} samples · ${clicks.length} clicks · ${keys.length} keys`);
console.log('clicks:', clicks.map(c => `${f2(c.time / 1000)}@(${f2(c.x)},${f2(c.y)})${c.hidden ? 'H' : ''}`).join('  '));
for (const s of segs) console.log(`shot ${f2(s.startTime)}-${f2(s.endTime)} action ${s.actionTime}-${s.lastActionTime} target (${f2(s.targetX)},${f2(s.targetY)}) x${s.zoomScale} ${s.reason}`);
for (const m of track.moves) console.log(`move ${f2(m.t0)}+${f2(m.d)} (${f2(m.from.x)},${f2(m.from.y)},x${f2(m.from.s)}) -> (${f2(m.to.x)},${f2(m.to.y)},x${f2(m.to.s)})`);

let mi = 0;
let run = null;
for (let t = 0; t <= duration; t += 1 / 30) {
    while (mi < moves.length - 1 && moves[mi + 1].time <= t * 1000) mi++;
    const c = moves[mi];
    const cam = sampleCameraTrack(track, t);
    const half = 0.5 / cam.scale;
    const out = cam.scale > 1.05 && c && !c.hidden && (Math.abs(c.x - cam.x) > half || Math.abs(c.y - cam.y) > half);
    if (out && !run) run = { t0: t, c, cam };
    if (!out && run) {
        console.log(`OFF ${f2(run.t0)}-${f2(t)} cursor (${f2(run.c.x)},${f2(run.c.y)}) view (${f2(run.cam.x)},${f2(run.cam.y)}) x${f2(run.cam.scale)}`);
        run = null;
    }
}
