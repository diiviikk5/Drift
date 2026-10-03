/**
 * cameraTrack — precomputed, physically smoothed camera path.
 *
 * Instead of evaluating the camera statelessly every frame (which forces hard
 * snaps whenever the cursor crosses a deadzone edge), the whole recording is
 * simulated once at a fixed rate with critically damped springs, the same way
 * Cap's zoom focus interpolator and Screen Studio's camera work. Preview and
 * export sample the same track, so they are frame-identical, and seeking is a
 * constant-time lookup.
 *
 * Camera model
 *   focus (fx, fy) — the point of interest, in normalized source coordinates.
 *   scale s        — zoom factor (1 = full frame).
 *   The visible viewport centre is c = f - (f - 0.5) / s, i.e. "zoom into f":
 *   the focus point stays at its natural screen position while the frame grows
 *   around it. For any f in [0, 1] and s >= 1 the viewport never leaves the
 *   source frame, so no clamping (and no clamp-induced kinks) is needed.
 */

import { DEFAULT_ZOOM_SCALE } from './ZoomConstruct.js';
import { getHoldGapMs } from './cursorPathSmoothing.js';

export const TRACK_HZ = 120;
const FOLLOW_LOOKAHEAD = 0.3; // seconds

const NON_ZOOM_SCENES = new Set(['overview', 'spotlight', 'full-camera']);

/**
 * Angular frequencies (rad/s) for critically damped springs. A critically
 * damped spring reaches ~95% of a step in 4.74 / omega seconds.
 */
export const CAMERA_PROFILES = Object.freeze({
    cinematic: { zoomIn: 5.2, zoomOut: 3.9, pan: 3.6, follow: 3.0 },
    natural: { zoomIn: 6.6, zoomOut: 5.0, pan: 4.6, follow: 3.8 },
    gentle: { zoomIn: 6.6, zoomOut: 5.0, pan: 4.6, follow: 3.8 },
    snappy: { zoomIn: 11.0, zoomOut: 8.5, pan: 8.0, follow: 6.0 },
    punchy: { zoomIn: 11.0, zoomOut: 8.5, pan: 8.0, follow: 6.0 },
});

export function resolveCameraProfile(name) {
    return CAMERA_PROFILES[name] || CAMERA_PROFILES.cinematic;
}

/** Viewport centre for a focus point at a given scale (see header). */
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
 * Advance a critically damped spring by dt (closed form, unconditionally stable).
 * Returns [position, velocity].
 */
function springStep(x, v, target, omega, dt) {
    const d = x - target;
    const e = Math.exp(-omega * dt);
    const c = v + omega * d;
    const nx = target + (d + c * dt) * e;
    const nv = (v - omega * c * dt) * e;
    return [nx, nv];
}

/**
 * Cheap signature so the cached track is rebuilt whenever anything that
 * affects it changes (segments are edited in place by the studio UI).
 */
export function cameraTrackSignature(segments, samples, options = {}) {
    let sig = `${options.springProfile || 'cinematic'}|${options.zoomMultiplier ?? 1}|${options.connectedZooms !== false}|${options.trackCursor !== false}|${options.duration ?? ''}|`;
    for (const s of segments || []) {
        sig += `${s.startTime},${s.endTime},${s.targetX},${s.targetY},${s.zoomScale},${s.sceneMode || ''},${s.followCursor === false ? 0 : 1};`;
    }
    const n = samples ? samples.length : 0;
    if (n > 0) {
        sig += `|${n},${sampleTimeMs(samples[0])},${sampleTimeMs(samples[n - 1])},${sampleX(samples[n >> 1])}`;
    }
    return sig;
}

/**
 * Build the camera track.
 *
 * @param {Array} segments focus segments ({startTime, endTime, targetX, targetY, zoomScale, sceneMode, followCursor})
 * @param {Array} samples cursor samples ({time(ms), x, y} normalized)
 * @param {Object} options
 * @returns {{hz:number, start:number, frames:number, fx:Float32Array, fy:Float32Array, s:Float32Array, seg:Int32Array, segments:Array}}
 */
export function buildCameraTrack(segments = [], samples = [], options = {}) {
    const profile = resolveCameraProfile(options.springProfile);
    const zoomMultiplier = options.zoomMultiplier ?? 1;
    const connected = options.connectedZooms !== false;
    const trackCursor = options.trackCursor !== false;
    const chainGap = options.chainGapSec ?? 1.6;

    const sorted = (segments || [])
        .filter(s => Number.isFinite(s.startTime) && Number.isFinite(s.endTime) && s.endTime > s.startTime)
        .slice()
        .sort((a, b) => a.startTime - b.startTime);

    const cursor = (samples || []).filter(s => Number.isFinite(sampleTimeMs(s)));
    cursor.sort((a, b) => sampleTimeMs(a) - sampleTimeMs(b));

    const lastSegEnd = sorted.length ? sorted[sorted.length - 1].endTime : 0;
    const lastSample = cursor.length ? sampleTimeMs(cursor[cursor.length - 1]) / 1000 : 0;
    const end = Math.max(options.duration ?? 0, lastSegEnd + 3, lastSample + 0.5, 1);

    const hz = TRACK_HZ;
    const dt = 1 / hz;
    const frames = Math.ceil(end * hz) + 2;
    const fx = new Float32Array(frames);
    const fy = new Float32Array(frames);
    const sc = new Float32Array(frames);
    const segIdx = new Int32Array(frames);

    const holdGap = getHoldGapMs(cursor);
    // Cursor lookup with a monotonic pointer (time only moves forward here).
    let ci = 0;
    const cursorAt = (tSec) => {
        if (!cursor.length) return null;
        const tMs = tSec * 1000;
        while (ci < cursor.length - 1 && sampleTimeMs(cursor[ci + 1]) <= tMs) ci++;
        const a = cursor[ci];
        const ta = sampleTimeMs(a);
        if (tMs <= ta || ci === cursor.length - 1) return { x: sampleX(a), y: sampleY(a) };
        const b = cursor[ci + 1];
        const tb = sampleTimeMs(b);
        // Sparse samples mean the mouse sat still: hold, then move in at the end.
        const k = tb - ta > holdGap ? clamp((tMs - (tb - 16)) / 16, 0, 1) : (tb > ta ? (tMs - ta) / (tb - ta) : 0);
        return { x: sampleX(a) + (sampleX(b) - sampleX(a)) * k, y: sampleY(a) + (sampleY(b) - sampleY(a)) * k };
    };

    let ai = 0;
    const cursorAhead = (tSec) => {
        if (!cursor.length) return null;
        const tMs = tSec * 1000;
        while (ai < cursor.length - 1 && sampleTimeMs(cursor[ai + 1]) <= tMs) ai++;
        const a = cursor[ai];
        const ta = sampleTimeMs(a);
        if (tMs <= ta || ai === cursor.length - 1) return { x: sampleX(a), y: sampleY(a) };
        const b = cursor[ai + 1];
        const tb = sampleTimeMs(b);
        // Sparse samples mean the mouse sat still: hold, then move in at the end.
        const k = tb - ta > holdGap ? clamp((tMs - (tb - 16)) / 16, 0, 1) : (tb > ta ? (tMs - ta) / (tb - ta) : 0);
        return { x: sampleX(a) + (sampleX(b) - sampleX(a)) * k, y: sampleY(a) + (sampleY(b) - sampleY(a)) * k };
    };

    const segScale = (seg) => {
        if (!seg || NON_ZOOM_SCENES.has(seg.sceneMode)) return 1;
        return Math.max(1, (seg.zoomScale ?? DEFAULT_ZOOM_SCALE) * zoomMultiplier);
    };
    const segFollows = (seg) => trackCursor && seg && seg.followCursor !== false && segScale(seg) > 1.001;

    // Initial state: unzoomed, focus parked on the first point of interest so
    // the first zoom is a pure dolly into it.
    const first = sorted.find(s => segScale(s) > 1.001);
    let x = first ? clamp(first.targetX ?? 0.5, 0, 1) : 0.5;
    let y = first ? clamp(first.targetY ?? 0.5, 0, 1) : 0.5;
    let s = 1;
    let vx = 0;
    let vy = 0;
    let vs = 0;

    // Follow target with hysteresis: only moves once the cursor leaves the
    // calm zone around it, so small hand movements never wobble the camera.
    let followX = x;
    let followY = y;
    let activeSegIndex = -1;
    let si = 0;

    for (let i = 0; i < frames; i++) {
        const t = i * dt;

        while (si < sorted.length && sorted[si].endTime <= t) si++;
        let idx = -1;
        if (si < sorted.length && sorted[si].startTime <= t) idx = si;

        let seg = idx >= 0 ? sorted[idx] : null;
        let bridging = false;
        if (!seg && connected) {
            // Short gap between two zooms: stay zoomed and pan instead of yo-yoing.
            const prev = si > 0 ? sorted[si - 1] : null;
            const next = si < sorted.length ? sorted[si] : null;
            if (prev && next && segScale(prev) > 1.001 && segScale(next) > 1.001 && next.startTime - prev.endTime <= chainGap) {
                seg = next;
                idx = si;
                bridging = true;
            }
        }

        let targetScale = segScale(seg);
        let tx;
        let ty;

        if (seg && targetScale > 1.001) {
            if (idx !== activeSegIndex) {
                activeSegIndex = idx;
                followX = clamp(seg.targetX ?? 0.5, 0, 1);
                followY = clamp(seg.targetY ?? 0.5, 0, 1);
            }
            if (segFollows(seg) && !bridging) {
                const c = cursorAt(t);
                if (c) {
                    // Calm zone radius shrinks as zoom deepens (less room on screen).
                    const radius = 0.16 / targetScale;
                    const dx = c.x - followX;
                    const dy = c.y - followY;
                    const dist = Math.hypot(dx, dy);
                    if (dist > radius) {
                        const pull = (dist - radius) / dist;
                        followX += dx * pull;
                        followY += dy * pull;
                    }
                    // Keep the cursor (now and a moment ahead, to cancel spring
                    // lag) inside the visible frame with a safety margin.
                    const margin = 0.1;
                    const lo = (v) => (v * targetScale - (1 - margin)) / (targetScale - 1);
                    const hi = (v) => (v * targetScale - margin) / (targetScale - 1);
                    const ahead = cursorAhead(t + FOLLOW_LOOKAHEAD) || c;
                    let loX = Math.max(lo(c.x), lo(ahead.x));
                    let hiX = Math.min(hi(c.x), hi(ahead.x));
                    let loY = Math.max(lo(c.y), lo(ahead.y));
                    let hiY = Math.min(hi(c.y), hi(ahead.y));
                    if (loX > hiX) { loX = lo(c.x); hiX = hi(c.x); }
                    if (loY > hiY) { loY = lo(c.y); hiY = hi(c.y); }
                    followX = clamp(clamp(followX, loX, hiX), 0, 1);
                    followY = clamp(clamp(followY, loY, hiY), 0, 1);
                }
            }
            tx = followX;
            ty = followY;
        } else {
            // Overview. Keep the focus where it is while zooming out (the
            // viewport mapping recentres it automatically), then park it on the
            // next point of interest once we are fully out.
            activeSegIndex = -1;
            targetScale = 1;
            tx = x;
            ty = y;
            if (s < 1.01) {
                const next = sorted.slice(si).find(n => segScale(n) > 1.001);
                if (next) {
                    tx = clamp(next.targetX ?? 0.5, 0, 1);
                    ty = clamp(next.targetY ?? 0.5, 0, 1);
                }
            }
        }

        // Pull back a little while the camera travels far, then settle back in
        // (a dolly-out during long pans reads much calmer than a whip pan).
        if (targetScale > 1.001 && s > 1.01) {
            const travel = Math.hypot(tx - x, ty - y);
            const pullBack = clamp((travel - 0.05) * 1.1, 0, 0.45);
            targetScale = 1 + (targetScale - 1) * (1 - pullBack);
        }

        const zoomOmega = targetScale >= s ? profile.zoomIn : profile.zoomOut;
        const panOmega = s < 1.01 ? 14 : (segFollows(seg) && !bridging ? profile.follow : profile.pan);

        [s, vs] = springStep(s, vs, targetScale, zoomOmega, dt);
        [x, vx] = springStep(x, vx, tx, panOmega, dt);
        [y, vy] = springStep(y, vy, ty, panOmega, dt);
        if (s < 1) {
            s = 1;
            if (vs < 0) vs = 0;
        }

        // Soft wall: if a very fast flick still outruns the spring, nudge the
        // focus just enough that the cursor stays on screen.
        if (segFollows(seg) && !bridging && s > 1.02) {
            const c = cursorAt(t);
            if (c) {
                const edge = 0.03;
                const loW = (v) => (v * s - (1 - edge)) / (s - 1);
                const hiW = (v) => (v * s - edge) / (s - 1);
                const nx = clamp(x, loW(c.x), hiW(c.x));
                const ny = clamp(y, loW(c.y), hiW(c.y));
                if (nx !== x) { vx += (nx - x) / dt * 0.5; x = nx; }
                if (ny !== y) { vy += (ny - y) / dt * 0.5; y = ny; }
            }
        }

        if (x < 0 || x > 1) { x = clamp(x, 0, 1); vx = 0; }
        if (y < 0 || y > 1) { y = clamp(y, 0, 1); vy = 0; }

        fx[i] = x;
        fy[i] = y;
        sc[i] = s;
        segIdx[i] = idx;
    }

    return { hz, frames, fx, fy, s: sc, seg: segIdx, segments: sorted };
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
    const focusX = track.fx[i] + (track.fx[j] - track.fx[i]) * k;
    const focusY = track.fy[i] + (track.fy[j] - track.fy[i]) * k;
    let scale = track.s[i] + (track.s[j] - track.s[i]) * k;
    if (scale < 1.0005) scale = 1;
    const segI = track.seg[k < 0.5 ? i : j];
    return {
        x: viewportCenter(focusX, scale),
        y: viewportCenter(focusY, scale),
        scale,
        focusX,
        focusY,
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
