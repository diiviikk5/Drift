/**
 * typingFocus — what the camera should look at while you type.
 *
 * While typing, the mouse is usually parked somewhere unrelated, so the focus
 * point for auto-zoom and camera follow becomes the text caret (recorded
 * alongside the cursor). Mouse movement during typing still wins, so selecting
 * text with the mouse behaves normally. The pointer itself fades out while you
 * type and returns as soon as the mouse moves.
 */

const BURST_GAP_SEC = 1.2;   // keys closer than this belong to one typing stretch
const LEAD_SEC = 0.15;       // focus moves to the caret just before the first key
const TAIL_SEC = 0.8;        // ...and stays a moment after the last
const MOUSE_ACTIVE_PX = 0.012; // normalized distance that counts as using the mouse

const keyTimeSec = (k) => {
    const t = k?.time ?? 0;
    return t > 1000 ? t / 1000 : t;
};
const sampleMs = (s) => s.timeMs ?? s.time ?? s.t ?? 0;

/** Typing stretches as [startSec, endSec] intervals (typed keys only). */
export function typingWindows(keystrokes = []) {
    const times = (keystrokes || [])
        .filter(k => k && k.typed)
        .map(keyTimeSec)
        .filter(Number.isFinite)
        .sort((a, b) => a - b);
    const out = [];
    for (const t of times) {
        const last = out[out.length - 1];
        if (last && t - last.lastKey <= BURST_GAP_SEC) {
            last.lastKey = t;
            last.keys++;
        } else {
            out.push({ firstKey: t, lastKey: t, keys: 1 });
        }
    }
    return out
        .filter(w => w.keys >= 2)
        .map(w => [Math.max(0, w.firstKey - LEAD_SEC), w.lastKey + TAIL_SEC]);
}

function mouseMovedDuring(moves, startMs, endMs) {
    let first = null;
    for (const m of moves) {
        const t = sampleMs(m);
        if (t < startMs) continue;
        if (t > endMs) break;
        if (!first) { first = m; continue; }
        if (Math.hypot(m.x - first.x, m.y - first.y) > MOUSE_ACTIVE_PX) return true;
    }
    return false;
}

const cache = new WeakMap();

/**
 * Focus samples for the camera and auto-zoom: mouse samples, with the caret
 * substituted during typing stretches where the mouse stays put.
 * Caret samples are { time(ms), x, y, h } normalized (y = top of the caret).
 */
export function buildFocusSamples(moves = [], caret = [], keystrokes = []) {
    if (!caret || !caret.length || !keystrokes || !keystrokes.length) return moves;
    let byCaret = cache.get(moves);
    const key = `${caret.length}:${keystrokes.length}`;
    const hit = byCaret?.get(caret)?.get(key);
    if (hit) return hit;

    const windows = typingWindows(keystrokes)
        .map(([a, b]) => [a * 1000, b * 1000])
        .filter(([a, b]) => !mouseMovedDuring(moves, a, b));
    let out = moves;
    if (windows.length) {
        const inWindow = (t) => windows.some(([a, b]) => t >= a && t <= b);
        const caretPts = caret
            .filter(c => inWindow(sampleMs(c)) && !c.hidden)
            .map(c => ({ time: sampleMs(c), x: c.x, y: c.y + (c.h || 0) / 2, caret: true }));
        // Begin each window at the caret position current at its start.
        for (const [a] of windows) {
            let before = null;
            for (const c of caret) { if (sampleMs(c) <= a) before = c; else break; }
            if (before && !before.hidden) caretPts.push({ time: a, x: before.x, y: before.y + (before.h || 0) / 2, caret: true });
        }
        if (caretPts.length) {
            out = moves
                .filter(m => !inWindow(sampleMs(m)) || m.click)
                .concat(caretPts)
                .sort((p, q) => sampleMs(p) - sampleMs(q));
        }
    }

    if (!byCaret) { byCaret = new WeakMap(); cache.set(moves, byCaret); }
    let byKey = byCaret.get(caret);
    if (!byKey) { byKey = new Map(); byCaret.set(caret, byKey); }
    byKey.set(key, out);
    return out;
}

/**
 * Pointer opacity while typing: fades out once typing starts with the mouse
 * at rest, and back in as soon as the mouse moves or typing ends.
 */
export function typingPointerOpacity(timeSec, keystrokes = [], moves = []) {
    if (!keystrokes || !keystrokes.length) return 1;
    const win = typingWindows(keystrokes).find(([a, b]) => timeSec >= a && timeSec <= b);
    if (!win) return 1;
    const [a, b] = win;
    // Last mouse movement before now.
    let lastMove = -Infinity;
    for (let i = moves.length - 1; i >= 0; i--) {
        const t = sampleMs(moves[i]) / 1000;
        if (t <= timeSec) {
            if (i > 0 && Math.hypot(moves[i].x - moves[i - 1].x, moves[i].y - moves[i - 1].y) > 0.0005) { lastMove = t; break; }
            if (t < a - 1) break;
        }
    }
    const since = timeSec - Math.max(a + LEAD_SEC, lastMove + 0.4);
    const fadeOut = Math.min(1, Math.max(0, since / 0.18));
    const fadeIn = Math.min(1, Math.max(0, (b - timeSec) / 0.15));
    return 1 - fadeOut * fadeIn;
}
