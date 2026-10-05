/**
 * cameraTrack — the planned camera path for a recording.
 *
 * The whole recording is known up front, so the camera is planned like an
 * edit rather than driven like a chase cam:
 *
 *  1. Shots. Every focus segment is a shot: a framing (centre + zoom) that is
 *     held. Between shots the camera either moves straight to the next one
 *     (short gap) or returns to the full frame (long gap).
 *  2. Moves. Each move follows the smooth zoom-and-pan path (smoothZoomPath)
 *     and its duration grows with how big the move *feels*, so a far move is
 *     slower, never faster. Moves are eased with minimum jerk and never
 *     overlap; a move always starts from rest.
 *  3. Reframes. While a shot is held the camera stays still. Only when the
 *     cursor is about to leave the comfortable middle of the frame does it
 *     glide once to cover where the cursor is heading (we know the future),
 *     widening the shot a little if the work no longer fits. Reframes are
 *     rate limited, so busy clicking never turns into a busy camera.
 *  4. A light zero-phase smoothing pass rounds off the joins between moves.
 *
 * Preview and export sample the same precomputed track (120 Hz), so they are
 * frame-identical and seeking is constant time.
 *
 * Coordinates: normalized source space. Scale s >= 1; the visible window is
 * 1/s wide (per axis also divided by the fill-crop factor k).
 */

import { DEFAULT_ZOOM_SCALE } from './ZoomConstruct.js';
import { smoothZoomPath, minimumJerk } from './smoothZoomPath.js';

export const TRACK_HZ = 120;

const NON_ZOOM_SCENES = new Set(['overview', 'spotlight', 'full-camera']);

/**
 * Motion tuning. Durations are in seconds; `perUnit` converts the perceived
 * size of a move (smooth-path length) into extra time.
 */
export const CAMERA_MOTION = Object.freeze({
    rho: 1.25,              // willingness to pull back while panning
    minMove: 0.95,          // shortest camera move
    maxMove: 2.6,           // longest camera move
    baseMove: 0.75,
    perUnit: 1.15,
    zoomOutFactor: 1.2,     // returning to the full frame is a touch slower
    minOverviewRest: 0.9,   // only zoom out if we can rest at overview this long
    minHold: 0.8,           // a reframe holds at least this long before the next
    safeZone: 0.68,         // fraction of the half-window the cursor may roam freely
    anticipate: 0.35,       // look this far ahead when deciding to reframe
    urgentAnticipate: 0.9,  // ...and this far for "about to leave the frame"
    lookahead: 1.6,         // reframes frame the cursor's next N seconds of work
    minReframeShift: 0.04,  // ignore reframes smaller than this (normalized)
    minWidenScale: 1.18,    // a reframe may widen the shot down to this zoom
    smoothTau: 0.06,        // final rounding of joins (seconds)
});

/** Overall pace of the camera; 1 = default. */
const PACE = Object.freeze({ cinematic: 1, gentle: 1.15, natural: 0.9, snappy: 0.72, punchy: 0.72 });

export function resolveCameraPace(name) {
    return PACE[name] ?? 1;
}

/** Viewport centre for a focus point at a given scale ("zoom into f"). */
export function viewportCenter(focus, scale) {
    const s = scale > 1 ? scale : 1;
    return focus - (focus - 0.5) / s;
}

/** Inverse of viewportCenter: the focus point that yields centre c at scale s. */
export function focusForCenter(center, scale) {
    const s = scale > 1 ? scale : 1;
    if (s <= 1.0001) return 0.5;
    return (center * s - 0.5) / (s - 1);
}

function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
}

function sampleTimeMs(s) {
    return s.timeMs ?? s.time ?? s.t ?? 0;
}

function sampleX(s) {
    const v = s.cx ?? s.x;
    return Number.isFinite(v) ? clamp(v, 0, 1) : 0.5;
}

function sampleY(s) {
    const v = s.cy ?? s.y;
    return Number.isFinite(v) ? clamp(v, 0, 1) : 0.5;
}

/**
 * Cheap signature so the cached track is rebuilt whenever anything that
 * affects it changes (segments are edited in place by the studio UI).
 */
export function cameraTrackSignature(segments, samples, options = {}) {
    let sig = `${options.springProfile || 'cinematic'}|${options.zoomMultiplier ?? 1}|${options.connectedZooms !== false}|${options.trackCursor !== false}|${options.duration ?? ''}|${options.cropKx ?? 1}|${options.cropKy ?? 1}|`;
    for (const s of segments || []) {
        sig += `${s.startTime},${s.endTime},${s.actionTime ?? ''},${s.targetX},${s.targetY},${s.zoomScale},${s.sceneMode || ''},${s.followCursor === false ? 0 : 1};`;
    }
    const n = samples ? samples.length : 0;
    if (n > 0) {
        sig += `|${n},${sampleTimeMs(samples[0])},${sampleTimeMs(samples[n - 1])},${sampleX(samples[n >> 1])}`;
    }
    return sig;
}

/** Cursor lookup over sorted samples (holds still through gaps, like the recorder). */
function makeCursorLookup(cursor) {
    const times = new Float64Array(cursor.length);
    for (let i = 0; i < cursor.length; i++) times[i] = sampleTimeMs(cursor[i]) / 1000;
    const index = (t) => {
        let lo = 0;
        let hi = times.length - 1;
        if (hi < 0 || t < times[0]) return -1;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (times[mid] <= t) lo = mid; else hi = mid - 1;
        }
        return lo;
    };
    return {
        times,
        at(t) {
            if (!cursor.length) return null;
            const i = Math.max(0, index(t));
            return { x: sampleX(cursor[i]), y: sampleY(cursor[i]) };
        },
        /** Samples (and clicks) in [t0, t1]. */
        range(t0, t1) {
            if (!cursor.length) return [];
            const out = [];
            let i = Math.max(0, index(t0));
            for (; i < cursor.length && times[i] <= t1; i++) out.push(cursor[i]);
            return out;
        },
    };
}

/** One framing: centre (x, y) and scale s. */
function framing(x, y, s) {
    return { x, y, s };
}

/**
 * Build the camera track.
 *
 * @param {Array} segments focus segments ({startTime, endTime, targetX, targetY, zoomScale, sceneMode, followCursor})
 * @param {Array} samples cursor samples ({time(ms), x, y} normalized)
 * @param {Object} options
 * @returns {{hz:number, frames:number, fx:Float32Array, fy:Float32Array, s:Float32Array, seg:Int32Array, segments:Array, moves:Array}}
 */
export function buildCameraTrack(segments = [], samples = [], options = {}) {
    const M = CAMERA_MOTION;
    const pace = resolveCameraPace(options.springProfile);
    const zoomMultiplier = options.zoomMultiplier ?? 1;
    const connected = options.connectedZooms !== false;
    const trackCursor = options.trackCursor !== false;
    const kx = Math.max(1, options.cropKx ?? 1);
    const ky = Math.max(1, options.cropKy ?? 1);
    const cropped = kx > 1.001 || ky > 1.001;

    const sorted = (segments || [])
        .filter(s => Number.isFinite(s.startTime) && Number.isFinite(s.endTime) && s.endTime > s.startTime)
        .slice()
        .sort((a, b) => a.startTime - b.startTime);

    const cursor = (samples || []).filter(s => Number.isFinite(sampleTimeMs(s)));
    cursor.sort((a, b) => sampleTimeMs(a) - sampleTimeMs(b));
    const look = makeCursorLookup(cursor);

    const lastSegEnd = sorted.length ? sorted[sorted.length - 1].endTime : 0;
    const lastSample = cursor.length ? sampleTimeMs(cursor[cursor.length - 1]) / 1000 : 0;
    const end = Math.max(options.duration ?? 0, lastSegEnd + 3, lastSample + 0.5, 1);

    // --- framing helpers --------------------------------------------------
    const halfX = (s) => 0.5 / (s * kx);
    const halfY = (s) => 0.5 / (s * ky);
    const fit = (f) => framing(clamp(f.x, halfX(f.s), 1 - halfX(f.s)), clamp(f.y, halfY(f.s), 1 - halfY(f.s)), f.s);

    const segScale = (seg) => {
        if (!seg || NON_ZOOM_SCENES.has(seg.sceneMode)) return 1;
        return Math.max(1, (seg.zoomScale ?? DEFAULT_ZOOM_SCALE) * zoomMultiplier);
    };
    const segFraming = (seg) => {
        const s = segScale(seg);
        const tx = clamp(seg.targetX ?? 0.5, 0, 1);
        const ty = clamp(seg.targetY ?? 0.5, 0, 1);
        if (s <= 1.001) return fit(framing(cropped ? tx : 0.5, cropped ? ty : 0.5, 1));
        return fit(framing(viewportCenter(tx, s * kx), viewportCenter(ty, s * ky), s));
    };
    const overview = (near) => fit(framing(cropped && near ? near.x : 0.5, cropped && near ? near.y : 0.5, 1));
    const zoomed = (f) => f.s > 1.001;

    // Perceived size of a move -> duration.
    const pathFor = (a, b) => smoothZoomPath(
        { x: a.x, y: a.y, w: 1 / a.s },
        { x: b.x, y: b.y, w: 1 / b.s },
        M.rho,
    );
    const moveDuration = (a, b, slower = 1) => {
        const len = pathFor(a, b).length;
        return clamp(M.baseMove + M.perUnit * len, M.minMove, M.maxMove) * slower * pace;
    };

    // --- plan ------------------------------------------------------------
    const moves = [];  // { t0, d, from, to }
    let state = cropped ? overview(look.at(0)) : overview();
    const initial = state;
    let free = 0;      // time the camera is free to start its next move

    const emit = (t0, to, slower = 1) => {
        const from = state;
        const dest = fit(to);
        if (Math.abs(dest.x - from.x) < 1e-4 && Math.abs(dest.y - from.y) < 1e-4 && Math.abs(dest.s - from.s) < 1e-4) {
            return t0;
        }
        const start = Math.max(t0, free);
        const d = moveDuration(from, dest, slower);
        moves.push({ t0: start, d, from, to: dest });
        state = dest;
        free = start + d;
        return free;
    };

    // Start a move into a shot so it is ~90% there at the shot's first
    // action (manual segments without one simply start at startTime).
    const arrivalStart = (seg, target) => {
        if (!Number.isFinite(seg.actionTime)) return seg.startTime;
        const d = moveDuration(state, fit(target));
        return Math.max(0, Math.min(seg.startTime, seg.actionTime - d * 0.72));
    };

    // Cursor positions on a fixed time grid (the recorder writes nothing
    // while the mouse rests, so raw sample counts say little about time).
    const positions = (t0, t1, step = 0.05) => {
        const out = [];
        for (let t = t0; t <= t1 + 1e-9; t += step) out.push(look.at(t));
        return out;
    };

    // Adjust a framing so the cursor's work in [t0, t1] sits inside its safe
    // area: shift just enough (leaning a little towards the work), and widen
    // down to minWidenScale if it doesn't fit.
    const frameWork = (base, t0, t1, widen = true) => {
        const pts = positions(t0, t1);
        if (!pts.length) return base;
        const clicks = look.range(t0, t1).filter(c => c.click).map(c => ({ x: sampleX(c), y: sampleY(c) }));
        const xs = pts.map(p => p.x).sort((p, q) => p - q);
        const ys = pts.map(p => p.y).sort((p, q) => p - q);
        const q = (arr, f) => arr[Math.round((arr.length - 1) * f)];
        const minX = Math.min(q(xs, 0.08), ...clicks.map(c => c.x));
        const maxX = Math.max(q(xs, 0.92), ...clicks.map(c => c.x));
        const minY = Math.min(q(ys, 0.08), ...clicks.map(c => c.y));
        const maxY = Math.max(q(ys, 0.92), ...clicks.map(c => c.y));

        let ns = base.s;
        if (widen) {
            // The safe area spans safeZone / (s * k) of the source per axis.
            const fitScale = M.safeZone / Math.max((maxX - minX) * kx, (maxY - minY) * ky, 1e-6);
            if (fitScale < ns) ns = Math.max(Math.min(base.s, M.minWidenScale), fitScale);
        }
        const shift = (c, lo, hi, h) => {
            let n = c;
            if (hi - lo > 2 * h) n = (lo + hi) / 2;
            else if (lo < c - h) n = lo + h;
            else if (hi > c + h) n = hi - h;
            return n === c ? c : n + ((lo + hi) / 2 - n) * 0.3;
        };
        const nx = kx * ns > 1.001 ? shift(base.x, minX, maxX, halfX(ns) * M.safeZone) : base.x;
        const ny = ky * ns > 1.001 ? shift(base.y, minY, maxY, halfY(ns) * M.safeZone) : base.y;
        return fit(framing(nx, ny, ns));
    };

    // While a framing is held, glide only when the cursor is about to leave
    // the comfortable middle of the frame.
    const holdAndReframe = (from, until, follows) => {
        if (!follows || !trackCursor || !cursor.length) return;
        const step = 1 / 30;
        let t = Math.max(from, free);
        let calmUntil = t; // after a reframe, hold unless the cursor is leaving the frame
        while (t < until) {
            const s = state.s;
            const hx = halfX(s) * M.safeZone;
            const hy = halfY(s) * M.safeZone;
            const outside = (p) => (kx * s > 1.001 && Math.abs(p.x - state.x) > hx) || (ky * s > 1.001 && Math.abs(p.y - state.y) > hy);
            const leaving = (p) => (kx * s > 1.001 && Math.abs(p.x - state.x) > halfX(s) * 0.92) || (ky * s > 1.001 && Math.abs(p.y - state.y) > halfY(s) * 0.92);
            // Heading out of the frame: act now, a move needs time to get going.
            const later = positions(t + M.urgentAnticipate - 0.4, t + M.urgentAnticipate);
            const urgent = later.filter(leaving).length >= later.length * 0.6;
            if (!urgent) {
                // Drifting out of the comfortable middle: wait for the calm
                // hold, and make sure it is a real excursion, not a flick.
                if (t < calmUntil || !outside(look.at(t + M.anticipate))) { t += step; continue; }
                const soon = positions(t, t + 0.5);
                const clickAway = look.range(t, t + 0.5).some(c => c.click && outside({ x: sampleX(c), y: sampleY(c) }));
                if (!clickAway && soon.filter(outside).length < soon.length * 0.4) { t += step; continue; }
            }

            const target = frameWork(state, t, t + M.lookahead);
            const moved = Math.hypot(target.x - state.x, target.y - state.y) * Math.max(s, 1);
            if (moved < M.minReframeShift && Math.abs(target.s - s) < 0.02) { t += step; continue; }

            const d = moveDuration(state, target);
            if (t + d > until - 0.2) break; // leave room for the next shot's move
            emit(t, target);
            t = free;
            calmUntil = free + M.minHold;
        }
    };

    for (let i = 0; i < sorted.length; i++) {
        const seg = sorted[i];
        const next = sorted[i + 1];
        let target = segFraming(seg);
        const follows = seg.followCursor !== false && zoomed(target);

        // Arrive at this shot just as its first action happens, framed on
        // where the cursor will be by then (not where it was).
        const start = Math.max(arrivalStart(seg, target), free);
        if (follows && trackCursor && cursor.length) {
            const d = moveDuration(state, target);
            target = frameWork(target, start + d * 0.6, start + d + 0.6, false);
        }
        emit(start, target);
        const arrived = free;

        // Leave: straight to the next shot when it is close, else back out.
        const toNext = next && connected && zoomed(target) && zoomed(segFraming(next));
        const outDur = moveDuration(state, overview(), M.zoomOutFactor);
        const leave = Math.max(seg.endTime, arrived);
        const nextStart = next ? Math.min(next.startTime, Number.isFinite(next.actionTime) ? next.actionTime - 1.2 : Infinity) : Infinity;
        const canRest = !next || nextStart >= leave + outDur + M.minOverviewRest;
        const bridge = toNext && !canRest;

        const holdUntil = bridge ? Math.max(arrived, nextStart) : leave;
        holdAndReframe(arrived, holdUntil, follows);

        if (bridge) continue;
        if (zoomed(state) || cropped) {
            const near = cropped ? look.at(leave) : null;
            emit(leave, overview(near), M.zoomOutFactor);
        }
        if (cropped) holdAndReframe(free, next ? next.startTime : end, true);
    }
    if (!sorted.length && cropped) holdAndReframe(0, end, true);

    // --- render the plan into a 120 Hz track -------------------------------
    const hz = TRACK_HZ;
    const frames = Math.ceil(end * hz) + 2;
    const fx = new Float32Array(frames);
    const fy = new Float32Array(frames);
    const sc = new Float32Array(frames);
    const segIdx = new Int32Array(frames);

    let mi = 0;
    let cur = initial;
    const paths = moves.map(m => pathFor(m.from, m.to));
    let si = 0;
    for (let i = 0; i < frames; i++) {
        const t = i / hz;
        while (mi < moves.length && moves[mi].t0 + moves[mi].d <= t) {
            cur = moves[mi].to;
            mi++;
        }
        let f = cur;
        if (mi < moves.length && moves[mi].t0 <= t) {
            const m = moves[mi];
            const p = paths[mi];
            const at = p.at(minimumJerk((t - m.t0) / m.d) * p.length);
            f = framing(at.x, at.y, Math.max(1, 1 / at.w));
        }
        fx[i] = f.x;
        fy[i] = f.y;
        sc[i] = Math.log(f.s);

        while (si < sorted.length && sorted[si].endTime <= t) si++;
        segIdx[i] = si < sorted.length && sorted[si].startTime <= t ? si : -1;
    }

    // Round the joins between consecutive moves (forward-backward, so no lag).
    const a = 1 - Math.exp(-1 / (hz * M.smoothTau));
    for (const arr of [fx, fy, sc]) {
        for (let pass = 0; pass < 2; pass++) {
            for (let i = 1; i < frames; i++) arr[i] += (arr[i - 1] - arr[i]) * (1 - a);
            for (let i = frames - 2; i >= 0; i--) arr[i] += (arr[i + 1] - arr[i]) * (1 - a);
        }
    }
    for (let i = 0; i < frames; i++) {
        const s = Math.max(1, Math.exp(sc[i]));
        sc[i] = s < 1.0005 ? 1 : s;
        fx[i] = clamp(fx[i], halfX(sc[i]), 1 - halfX(sc[i]));
        fy[i] = clamp(fy[i], halfY(sc[i]), 1 - halfY(sc[i]));
    }

    return { hz, frames, fx, fy, s: sc, seg: segIdx, segments: sorted, moves };
}

/**
 * Sample the track at time t (seconds). Returns viewport centre + scale.
 */
export function sampleCameraTrack(track, timeSec) {
    if (!track || track.frames === 0) {
        return { x: 0.5, y: 0.5, scale: 1, focusX: 0.5, focusY: 0.5, activeSeg: null };
    }
    const pos = clamp(timeSec, 0, (track.frames - 1) / track.hz) * track.hz;
    const i = Math.min(track.frames - 2, Math.floor(pos));
    const k = Math.max(0, Math.min(1, pos - i));
    const j = i + 1 < track.frames ? i + 1 : i;
    const x = track.fx[i] + (track.fx[j] - track.fx[i]) * k;
    const y = track.fy[i] + (track.fy[j] - track.fy[i]) * k;
    let scale = track.s[i] + (track.s[j] - track.s[i]) * k;
    if (scale < 1.0005) scale = 1;
    const segI = track.seg[k < 0.5 ? i : j];
    return {
        x,
        y,
        scale,
        focusX: scale > 1 ? clamp(focusForCenter(x, scale), 0, 1) : x,
        focusY: scale > 1 ? clamp(focusForCenter(y, scale), 0, 1) : y,
        activeSeg: segI >= 0 ? track.segments[segI] : null,
    };
}

const _cache = new Map();
const CACHE_LIMIT = 4;

/** Memoized build — the studio calls this every frame. */
export function getCameraTrack(segments, samples, options = {}) {
    const sig = cameraTrackSignature(segments, samples, options);
    let track = _cache.get(sig);
    if (!track) {
        track = buildCameraTrack(segments, samples, options);
        if (_cache.size >= CACHE_LIMIT) _cache.delete(_cache.keys().next().value);
    } else {
        _cache.delete(sig);
    }
    _cache.set(sig, track);
    return track;
}
