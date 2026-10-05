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
    tempo: 1.35,            // every camera move takes this long: one consistent rhythm
    maxMove: 2.6,           // upper bound used when sizing candidate searches
    zoomOutFactor: 1.12,    // returning to the full frame is a touch slower (~1.5 s)
    revealTempo: 2.2,       // a region change: one swoop out towards the full frame and in
    swoopPeak: 0.8,         // ...pulling back to this much of the full frame
    breatheAfter: 14,       // after this long zoomed in, pull back at the next chance
    minOverviewRest: 0.9,   // only zoom out if we can rest at overview this long
    minHold: 0.8,           // a reframe holds at least this long before the next
    safeZone: 0.68,         // fraction of the half-window the cursor may roam freely
    anticipate: 0.35,       // look this far ahead when deciding to reframe
    urgentAnticipate: 0.9,  // ...and this far for "about to leave the frame"
    lookahead: 1.6,         // reframes frame the cursor's next N seconds of work
    minReframeShift: 0.04,  // ignore reframes smaller than this (normalized)
    minWidenScale: 1.18,    // a reframe may widen the shot down to this zoom
    smoothTau: 0.06,        // final rounding of joins (seconds)
    establishing: 0.5,      // show the full frame at least this long before the first zoom
    endOnOverview: 0.25,    // finish the final zoom-out this long before the video ends
    calmSpeed: 0.9,         // perceived speed (widths/s) above which moves are penalized
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
        sig += `${s.startTime},${s.endTime},${s.actionTime ?? ''},${s.lastActionTime ?? ''},${s.targetX},${s.targetY},${s.zoomScale},${s.sceneMode || ''},${s.followCursor === false ? 0 : 1};`;
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
            return { x: sampleX(cursor[i]), y: sampleY(cursor[i]), hidden: Boolean(cursor[i].hidden) };
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
    let end = Math.max(options.duration ?? 0, lastSegEnd + 3, lastSample + 0.5, 1);

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

    // Perceived size of a move -> duration (measured at the base rho, so a
    // move that pulls back further is not also made slower).
    const pathFor = (a, b, rho = M.rho) => smoothZoomPath(
        { x: a.x, y: a.y, w: 1 / a.s },
        { x: b.x, y: b.y, w: 1 / b.s },
        rho,
    );

    // The rho at which the smooth path between a and b pulls back to about
    // `peakW` of the full frame: a swoop that is smooth by construction.
    const swoopRho = (a, b, peakW = M.swoopPeak) => {
        const widest = (rho) => {
            const p = pathFor(a, b, rho);
            let w = 0;
            for (let k = 0; k <= 32; k++) w = Math.max(w, p.at((p.length * k) / 32).w);
            return w;
        };
        let lo = M.rho;
        let hi = 12;
        if (widest(hi) < peakW) return hi;
        for (let i = 0; i < 24; i++) {
            const mid = (lo + hi) / 2;
            if (widest(mid) < peakW) lo = mid; else hi = mid;
        }
        return lo;
    };
    // One tempo for every move, whatever its size or how rushed the clicks
    // were: a consistent rhythm reads as calm and intentional. Big moves are
    // handled by routing (pulling back through the full frame), not by speed.
    const moveDuration = (a, b, slower = 1) => M.tempo * slower * pace;

    // --- plan ------------------------------------------------------------
    const moves = [];  // { t0, d, from, to }
    let state = cropped ? overview(look.at(0)) : overview();
    const initial = state;
    let free = 0;      // time the camera is free to start its next move

    // Evaluate a candidate move: fraction of time the cursor is off screen,
    // and peak perceived speed (viewport widths/s of pan + log-zoom rate).
    const evaluate = (from, to, start, d, rho) => {
        const p = pathFor(from, to, rho);
        const n = 24;
        let off = 0;
        let peak = 0;
        let widest = 0;
        let prev = null;
        for (let k = 0; k <= n; k++) {
            const f = p.at(minimumJerk(k / n) * p.length);
            if (f.w > widest) widest = f.w;
            const sc = Math.max(1, 1 / f.w);
            if (prev) {
                const dt = d / n;
                const w = (prev.w + f.w) / 2;
                const speed = Math.hypot(Math.hypot(f.x - prev.x, f.y - prev.y) / w, Math.log(prev.w / f.w)) / dt;
                if (speed > peak) peak = speed;
            }
            prev = f;
            if (trackCursor && cursor.length) {
                const c = look.at(start + (d * k) / n);
                if (!c.hidden && (Math.abs(c.x - f.x) > halfX(sc) * 0.97 || Math.abs(c.y - f.y) > halfY(sc) * 0.97)) off++;
            }
        }
        return { off: off / (n + 1), peak, widest };
    };

    // Emit a move. Being offline, try a few variants (start a little earlier,
    // pull back further mid-move, take a little longer) and keep the one that
    // best keeps the cursor in view without moving faster than feels calm.
    const emit = (t0, to, slower = 1, { flexible = true, swoop = false, duration = null } = {}) => {
        const from = state;
        const dest = fit(to);
        if (swoop) {
            const start = Math.max(t0, free);
            const d = duration ?? moveDuration(from, dest, slower);
            moves.push({ t0: start, d, from, to: dest, rho: swoopRho(from, dest) });
            state = dest;
            free = start + d;
            return free;
        }
        if (Math.abs(dest.x - from.x) < 1e-4 && Math.abs(dest.y - from.y) < 1e-4 && Math.abs(dest.s - from.s) < 1e-4) {
            return t0;
        }
        const base = Math.max(t0, free);
        const d0 = moveDuration(from, dest, slower);
        const leads = flexible ? [0, 0.2, 0.4] : [0];
        const rhos = flexible && zoomed(from) && zoomed(dest) ? [M.rho, 1.8, 2.6] : [M.rho];
        const stretches = [1];
        let best = null;
        for (const lead of leads) {
            const start = Math.max(free, base - lead);
            for (const rho of rhos) {
                for (const k of stretches) {
                    const d = Math.min(M.maxMove * 1.25, d0 * k);
                    const { off, peak, widest } = evaluate(from, dest, start, d, rho);
                    // A pull-back past the full frame would be clipped (a kink).
                    if (rho !== M.rho && widest > 0.96) continue;
                    const score = off * 10
                        + Math.max(0, peak - M.calmSpeed) * 6
                        + (base - start) * 0.4
                        + (rho - M.rho) * 0.15
                        + (k - 1) * 0.6;
                    if (!best || score < best.score - 1e-9) best = { start, rho, d, score };
                }
            }
        }
        moves.push({ t0: best.start, d: best.d, from, to: dest, rho: best.rho });
        state = dest;
        free = best.start + best.d;
        return free;
    };

    // Start a move into a shot so it is ~90% there at the shot's first
    // action (manual segments without one simply start at startTime).
    // The cursor usually reaches its target a moment before the click: land
    // when it settles inside the shot's safe area (up to 1.5 s early).
    const settleTime = (seg, target) => {
        const t1 = seg.actionTime;
        if (!cursor.length) return t1;
        const hx = halfX(target.s) * M.safeZone;
        const hy = halfY(target.s) * M.safeZone;
        let t = t1;
        for (let u = t1; u >= t1 - 1.5; u -= 0.05) {
            const p = look.at(u);
            if (Math.abs(p.x - target.x) > hx || Math.abs(p.y - target.y) > hy) break;
            t = u;
        }
        return t;
    };
    const arrivalStart = (seg, target) => {
        if (!Number.isFinite(seg.actionTime)) return seg.startTime;
        const d = moveDuration(state, fit(target));
        return Math.max(0, Math.min(seg.startTime, settleTime(seg, fit(target)) - d * 0.8));
    };

    // Cursor positions on a fixed time grid (the recorder writes nothing
    // while the mouse rests, so raw sample counts say little about time).
    // Positions while the cursor is off the recorded screen are left out.
    const positions = (t0, t1, step = 0.05) => {
        const out = [];
        for (let t = t0; t <= t1 + 1e-9; t += step) {
            const p = look.at(t);
            if (p && !p.hidden) out.push(p);
        }
        return out;
    };
    const awayFor = (t0, t1) => {
        let n = 0;
        let k = 0;
        for (let t = t0; t <= t1 + 1e-9; t += 0.05, n++) if (look.at(t)?.hidden) k++;
        return n ? k / n : 0;
    };

    // Adjust a framing so the cursor's work in [t0, t1] sits inside its safe
    // area: shift just enough (leaning a little towards the work), and widen
    // down to minWidenScale if it doesn't fit.
    const frameWork = (base, t0, t1, widen = true) => {
        const pts = t1 > t0 ? positions(t0, t1) : [];
        if (!pts.length) return base;
        const clicks = look.range(t0, t1).filter(c => c.click && !c.hidden).map(c => ({ x: sampleX(c), y: sampleY(c) }));
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
        // When the work can't fit even after widening, keep the framing on
        // the clicks (the point of the shot) rather than splitting the difference.
        const cx = clicks.length ? clicks.reduce((a, c) => a + c.x, 0) / clicks.length : null;
        const cy = clicks.length ? clicks.reduce((a, c) => a + c.y, 0) / clicks.length : null;
        const shift = (c, lo, hi, h, anchor) => {
            let n = c;
            if (hi - lo > 2 * h) return anchor ?? (widen ? (lo + hi) / 2 : c);
            else if (lo < c - h) n = lo + h;
            else if (hi > c + h) n = hi - h;
            return n === c ? c : n + ((lo + hi) / 2 - n) * 0.3;
        };
        const nx = kx * ns > 1.001 ? shift(base.x, minX, maxX, halfX(ns) * M.safeZone, cx) : base.x;
        const ny = ky * ns > 1.001 ? shift(base.y, minY, maxY, halfY(ns) * M.safeZone, cy) : base.y;
        return fit(framing(nx, ny, ns));
    };

    // While a framing is held, glide only when the cursor is about to leave
    // the comfortable middle of the frame. Returns the time the shot should
    // be left early (the cursor left and there is no time to reframe), or null.
    const holdAndReframe = (from, until, follows) => {
        if (!follows || !trackCursor || !cursor.length) return null;
        const step = 1 / 30;
        let t = Math.max(from, free);
        let calmUntil = t; // after a reframe, hold unless the cursor is leaving the frame
        while (t < until) {
            const s = state.s;
            const hx = halfX(s) * M.safeZone;
            const hy = halfY(s) * M.safeZone;
            // The cursor working on another screen: ease out rather than chase.
            if (awayFor(t, t + 0.8) > 0.9) return t;
            const outside = (p) => !p.hidden && ((kx * s > 1.001 && Math.abs(p.x - state.x) > hx) || (ky * s > 1.001 && Math.abs(p.y - state.y) > hy));
            const leaving = (p) => !p.hidden && ((kx * s > 1.001 && Math.abs(p.x - state.x) > halfX(s) * 0.92) || (ky * s > 1.001 && Math.abs(p.y - state.y) > halfY(s) * 0.92));
            // Heading out of the frame: act now, a move needs time to get going.
            const later = positions(t + M.urgentAnticipate - 0.4, t + M.urgentAnticipate);
            const urgent = later.length > 0 && later.filter(leaving).length >= later.length * 0.6;
            if (!urgent) {
                // Drifting out of the comfortable middle: wait for the calm
                // hold, and make sure it is a real excursion, not a flick.
                if (t < calmUntil || !outside(look.at(t + M.anticipate))) { t += step; continue; }
                const soon = positions(t, t + 0.5);
                const clickAway = look.range(t, t + 0.5).some(c => c.click && !c.hidden && outside({ x: sampleX(c), y: sampleY(c) }));
                if (!clickAway && (!soon.length || soon.filter(outside).length < soon.length * 0.4)) { t += step; continue; }
            }

            const target = frameWork(state, t, t + M.lookahead);
            const moved = Math.hypot(target.x - state.x, target.y - state.y) * Math.max(s, 1);
            if (moved < M.minReframeShift && Math.abs(target.s - s) < 0.02) { t += step; continue; }

            const d = moveDuration(state, target);
            if (t + d > until - 0.2) return urgent ? t : null; // no time: leave the shot instead
            emit(t, target);
            t = free;
            calmUntil = free + M.minHold;
        }
        return null;
    };

    let departEarly = null;
    let holdFloor = 0;
    let swoopTo = null;
    let zoomedSince = 0; // when the current continuous zoom-in began
    for (let i = 0; i < sorted.length; i++) {
        const seg = sorted[i];
        const next = sorted[i + 1];
        let target = segFraming(seg);
        const follows = seg.followCursor !== false && zoomed(target);

        // Arrive at this shot just as its first action happens, framed on
        // where the cursor will be by then (not where it was).
        // Auto zooms open on the full frame for a moment (an establishing shot);
        // a zoom placed by hand at the start is honoured.
        const establishing = i === 0 && seg.auto && !cropped ? M.establishing : 0;
        const planned = Math.max(arrivalStart(seg, target), holdFloor, establishing);
        const start = Math.max(departEarly != null ? Math.min(planned, departEarly) : planned, free);
        departEarly = null;
        holdFloor = 0;
        if (follows && trackCursor && cursor.length) {
            // Only this shot's own work, never the next shot's.
            const d = moveDuration(state, target);
            const limit = Math.min(seg.endTime, next && Number.isFinite(next.actionTime) ? next.actionTime - 0.6 : Infinity);
            target = frameWork(target, start + d * 0.6, Math.min(start + d + 0.6, limit), false);
        }
        if (!zoomed(state)) zoomedSince = start;
        const alreadyThere = zoomed(state) && Math.abs(state.x - target.x) < 0.02 && Math.abs(state.y - target.y) < 0.02 && Math.abs(state.s - target.s) < 0.02;
        if (!alreadyThere) emit(start, target);
        const arrived = free;

        // Leave: straight to the next shot when it is close, else back out.
        const toNext = next && connected && zoomed(target) && zoomed(segFraming(next));
        const outDur = moveDuration(state, overview(), M.zoomOutFactor);
        const leave = Math.max(seg.endTime, arrived);
        const nextStart = next ? Math.min(next.startTime, Number.isFinite(next.actionTime) ? next.actionTime - 1.2 : Infinity) : Infinity;
        let canRest = !next || nextStart >= leave + outDur + M.minOverviewRest;

        // Never leave before the shot's last action has been seen.
        const minLeave = Number.isFinite(seg.lastActionTime) ? seg.lastActionTime + 0.5 : arrived;

        // Director: pull back to the full frame between shots when the next one
        // is in a different region (the viewer sees where we're going), or
        // when we've been zoomed in for a long stretch (a breather), provided
        // there is time to do it at the normal tempo.
        if (toNext && !canRest) {
            const nextTarget = segFraming(next);
            const overlap = (() => {
                const w = (f) => [f.x - halfX(f.s), f.x + halfX(f.s), f.y - halfY(f.s), f.y + halfY(f.s)];
                const [a0, a1, a2, a3] = w(state);
                const [b0, b1, b2, b3] = w(nextTarget);
                const ix = Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
                const iy = Math.max(0, Math.min(a3, b3) - Math.max(a2, b2));
                return (ix * iy) / Math.min((a1 - a0) * (a3 - a2), (b1 - b0) * (b3 - b2));
            })();
            // A new region: the point of interest moves more than 60% of the frame.
            const dxFrac = Math.abs((next.targetX ?? 0.5) - (seg.targetX ?? 0.5)) / (2 * halfX(state.s));
            const dyFrac = Math.abs((next.targetY ?? 0.5) - (seg.targetY ?? 0.5)) / (2 * halfY(state.s));
            const far = overlap < 0.25 || Math.max(dxFrac, dyFrac) > 0.6;
            const longZoom = arrived - zoomedSince > M.breatheAfter;
            const swoop = M.revealTempo * pace;
            // Feasible if it can land by the action; aim to land when the
            // cursor settles at the destination.
            const action = Number.isFinite(next.actionTime) ? next.actionTime : next.startTime + swoop;
            const land = Number.isFinite(next.actionTime) ? settleTime(next, nextTarget) : action;
            const out0 = Math.max(arrived, minLeave);
            if ((far || longZoom) && action - out0 >= swoop * 0.95) {
                let target = nextTarget;
                if (next.followCursor !== false && trackCursor && cursor.length) {
                    // Only where the cursor settles, not its trip over there.
                    target = frameWork(nextTarget, land, Math.min(Math.max(land, action) + 0.8, next.endTime), false);
                }
                swoopTo = { at: Math.max(out0, land - swoop * 0.95), target };
            }
        }
        const bridge = toNext && !canRest;
        if (bridge && swoopTo) {
            // Hold, then swoop out through the full frame into the next shot.
            // ...or as soon as the cursor heads off for it.
            const early = holdAndReframe(arrived, swoopTo.at, follows);
            const at = early != null ? Math.max(early, minLeave) : swoopTo.at;
            emit(at, swoopTo.target, 1, { swoop: true, duration: M.revealTempo * pace });
            zoomedSince = free;
            swoopTo = null;
            continue;
        }
        swoopTo = null;
        const holdUntil = bridge ? Math.max(arrived, nextStart, minLeave) : leave;
        const early = holdAndReframe(arrived, holdUntil, follows);

        if (bridge) {
            // The next shot's move may start as soon as the cursor heads off.
            departEarly = early != null ? Math.max(early, minLeave) : null;
            holdFloor = minLeave;
            continue;
        }
        if (zoomed(state) || cropped) {
            let at = early != null ? Math.max(free, minLeave, Math.min(leave, early)) : leave;
            // The last shot: end the video on the full frame when there is time.
            const videoEnd = options.duration;
            if (!next && Number.isFinite(videoEnd)) {
                const finish = videoEnd - M.endOnOverview - moveDuration(state, overview(), M.zoomOutFactor);
                if (finish < at && finish >= Math.max(free, minLeave)) at = finish;
            }
            const near = cropped ? look.at(at) : null;
            emit(at, overview(near), M.zoomOutFactor);
        }
        if (cropped) holdAndReframe(free, next ? next.startTime : end, true);
    }
    if (!sorted.length && cropped) holdAndReframe(0, end, true);

    // --- render the plan into a 120 Hz track -------------------------------
    // Cover every planned move, plus time for the smoothing tail to settle.
    for (const m of moves) end = Math.max(end, m.t0 + m.d + 0.5);
    const hz = TRACK_HZ;
    const frames = Math.ceil(end * hz) + 2;
    const fx = new Float32Array(frames);
    const fy = new Float32Array(frames);
    const sc = new Float32Array(frames);
    const segIdx = new Int32Array(frames);

    let mi = 0;
    let cur = initial;
    const paths = moves.map(m => pathFor(m.from, m.to, m.rho));
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
        // Keep the window inside the recording before smoothing, so the
        // smoothing pass rounds off any kink the constraint introduces.
        f = fit(f);
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
