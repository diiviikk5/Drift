/**
 * pointerSync — lines the recovered telemetry up with the recorded video.
 *
 * Telemetry is timed from the live frames the analyzer saw; the video's
 * timeline starts at whichever frame the MediaRecorder encoded first. The two
 * differ by a few frames, and by a different amount on every machine, which
 * shows as the baked pointer peeking out ahead of Drift's own while it moves.
 *
 * So after recording, the pointer is found again in a couple of dozen frames
 * of the actual file, at moments of fast motion where timing is unambiguous,
 * and the offset that best explains them is applied to everything.
 */

import { CursorTracker } from './CursorTracker.js';

/** Pointer position from the raw track at time t (ms), or null. */
function rawAt(raw, t) {
    let lo = 0, hi = raw.length - 1, ans = -1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (raw[mid].t <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1;
    }
    const r = ans >= 0 ? raw[ans] : null;
    return r && !r.hidden ? r : null;
}

/**
 * Video times worth checking: right after fast pointer moves.
 * @returns {number[]} ms, ascending
 */
export function syncProbeTimes(raw, count = 24) {
    const fast = [];
    for (let i = 1; i < raw.length; i++) {
        const a = raw[i - 1], b = raw[i];
        if (a.hidden || b.hidden) continue;
        const dt = b.t - a.t;
        if (dt <= 0 || dt > 80) continue;
        const speed = Math.hypot(b.x - a.x, b.y - a.y) / dt; // px per ms
        if (speed > 0.35) fast.push({ t: b.t, speed });
    }
    fast.sort((p, q) => q.speed - p.speed);
    const picked = [];
    for (const f of fast) {
        if (picked.every(t => Math.abs(t - f.t) > 150)) picked.push(f.t);
        if (picked.length >= count) break;
    }
    return picked.sort((a, b) => a - b);
}

/**
 * Estimate the offset (ms) to ADD to telemetry times so they match the video.
 * @param {Array<{t:number, luma:Uint8Array}>} frames decoded video frames (analysis size) at video times t
 * @param {{width, height, raw}} pointer
 * @returns {{offset:number, samples:number}|null}
 */
export function estimateOffset(frames, pointer, { maxShift = 400 } = {}) {
    const { width, height, raw } = pointer;
    if (!frames.length || !raw?.length) return null;
    const tracker = new CursorTracker({ width, height });
    const keys = [...new Set(raw.filter(r => r.key).map(r => r.key))];
    const cands = tracker.all.filter(P => keys.includes(P.key));
    if (!cands.length) return null;
    const votes = [];
    for (const f of frames) {
        // Where could the pointer be in this frame? Anywhere it was within the shift range.
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (let d = -maxShift; d <= maxShift; d += 20) {
            const p = rawAt(raw, f.t + d);
            if (!p) continue;
            x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
        }
        if (!Number.isFinite(x0)) continue;
        const hit = tracker._search(f.luma, cands, Math.round(x0) - 12, Math.round(y0) - 12, Math.round(x1) + 12, Math.round(y1) + 12);
        if (!hit) continue;
        // The telemetry entry that saw the pointer exactly here: each entry is
        // the moment a frame showed that position, so its time pins the shift.
        let best = null;
        for (const p of raw) {
            if (p.hidden || p.t < f.t - maxShift) continue;
            if (p.t > f.t + maxShift) break;
            const e = Math.hypot(p.x - hit.x, p.y - hit.y);
            const d = p.t - f.t;
            if (!best || e < best.e || (e === best.e && Math.abs(d) < Math.abs(best.d))) best = { d, e };
        }
        if (best && best.e <= 2) votes.push(best.d);
    }
    if (votes.length < 3) return null;
    votes.sort((a, b) => a - b);
    // Median, then the mean of the votes near it (the matching window is a range).
    const med = votes[votes.length >> 1];
    const near = votes.filter(v => Math.abs(v - med) <= 24);
    const offset = -Math.round(near.reduce((a, b) => a + b, 0) / near.length);
    return { offset, samples: votes.length };
}

/** Shift every telemetry timestamp by `offset` ms (keystrokes are in seconds). */
export function shiftTelemetry(t, offset) {
    if (!t || !offset) return t;
    const ms = (list) => (list || []).map(p => ({ ...p, time: Math.max(0, Math.round(p.time + offset)) }));
    return {
        ...t,
        moves: ms(t.moves),
        clicks: ms(t.clicks),
        caret: ms(t.caret),
        cursorShapes: ms(t.cursorShapes),
        keystrokes: (t.keystrokes || []).map(k => ({ ...k, time: Math.max(0, Math.round((k.time + offset / 1000) * 100) / 100) })),
        scrolls: (t.scrolls || []).map(s => ({ ...s, t: Math.max(0, Math.round(s.t + offset)) })),
        pointer: t.pointer ? { ...t.pointer, raw: t.pointer.raw.map(r => ({ ...r, t: Math.max(0, Math.round(r.t + offset)) })) } : t.pointer,
        sync: { offset },
    };
}
