/**
 * Offline cursor-path smoothing for screen recordings.
 * 
 * Ported from OpenScreen (cursorPathSmoothing.ts & motionSmoothing.ts).
 * 
 * Instead of a jittery causal real-time filter that introduces lag during playback,
 * we precompute once offline: resample telemetry to a fixed 240Hz grid, then drive
 * a symplectic Euler spring-damper over it.
 * 
 * This gives the cursor realistic physical inertia (trailing the real cursor like a physical
 * pointer) while filtering out high-frequency hand tremors. It is completely deterministic,
 * ensuring live Studio playback and WebCodecs export match pixel-for-pixel with zero runtime overhead.
 */

// 240 steps/sec keeps the spring stable and crisp at any playback fps
const STEP_MS = 1000 / 240;
const STEP_S = STEP_MS / 1000;
const HOLD_GAP_MS = 60;
const CLICK_PIN_MS = 220;
const MOVE_IN_MS = 16;

/**
 * Gap above which consecutive samples are treated as "cursor sat still".
 * Adapts to the telemetry rate so sparse synthetic/imported data still
 * interpolates normally.
 */
export function getHoldGapMs(samples) {
    const n = samples.length;
    if (n < 3) return Infinity;
    const gaps = [];
    const stride = Math.max(1, Math.floor(n / 512));
    for (let i = stride; i < n; i += stride) {
        const g = getSampleTime(samples[i]) - getSampleTime(samples[i - stride]);
        if (g > 0) gaps.push(g / stride);
    }
    if (!gaps.length) return Infinity;
    gaps.sort((a, b) => a - b);
    const median = gaps[gaps.length >> 1];
    return Math.max(HOLD_GAP_MS, median * 8);
}

const CURSOR_SMOOTHING_MIN = 0;
const CURSOR_SMOOTHING_MAX = 2;
const CURSOR_SMOOTHING_LEGACY_MAX = 0.5;

/**
 * OpenScreen spring configuration curves
 * Higher factor = softer, floatier cinematic motion
 */
export function getCursorSpringConfig(smoothingFactor = 1.0) {
    const clamped = Math.min(CURSOR_SMOOTHING_MAX, Math.max(CURSOR_SMOOTHING_MIN, smoothingFactor));

    if (clamped <= 0) {
        return {
            stiffness: 1000,
            damping: 100,
            mass: 1,
            restDelta: 0.0001,
            restSpeed: 0.001,
        };
    }

    if (clamped <= CURSOR_SMOOTHING_LEGACY_MAX) {
        const legacyNormalized = Math.min(
            1,
            Math.max(0, (clamped - CURSOR_SMOOTHING_MIN) / (CURSOR_SMOOTHING_LEGACY_MAX - CURSOR_SMOOTHING_MIN))
        );

        return {
            stiffness: 760 - legacyNormalized * 420,
            damping: 34 + legacyNormalized * 24,
            mass: 0.55 + legacyNormalized * 0.45,
            restDelta: 0.0002,
            restSpeed: 0.01,
        };
    }

    const extendedNormalized = Math.min(
        1,
        Math.max(0, (clamped - CURSOR_SMOOTHING_LEGACY_MAX) / (CURSOR_SMOOTHING_MAX - CURSOR_SMOOTHING_LEGACY_MAX))
    );

    return {
        stiffness: 340 - extendedNormalized * 180,
        damping: 58 + extendedNormalized * 22,
        mass: 1 + extendedNormalized * 0.35,
        restDelta: 0.0002,
        restSpeed: 0.01,
    };
}

/**
 * Binary search to find the greatest index where times[index] <= timeMs
 */
function binarySearchAtOrBefore(times, timeMs, hi) {
    let low = 0;
    let high = hi;
    let result = -1;
    while (low <= high) {
        const mid = low + ((high - low) >> 1);
        if (times[mid] <= timeMs) {
            result = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return result;
}

function getSampleTime(s) {
    return s.timeMs ?? s.time ?? s.t ?? 0;
}

function getNormalizedX(s, srcW = 1920) {
    if (s.cx != null) return s.cx;
    return s.x > 1 ? s.x / srcW : (s.x != null ? s.x : 0.5);
}

function getNormalizedY(s, srcH = 1080) {
    if (s.cy != null) return s.cy;
    return s.y > 1 ? s.y / srcH : (s.y != null ? s.y : 0.5);
}

/**
 * Linear interpolation between raw samples
 */
function interpolateRun(samples, timeMs, srcW, srcH) {
    const last = samples.length - 1;
    const firstTime = getSampleTime(samples[0]);
    const lastTime = getSampleTime(samples[last]);

    if (timeMs <= firstTime) return { cx: getNormalizedX(samples[0], srcW), cy: getNormalizedY(samples[0], srcH) };
    if (timeMs >= lastTime) return { cx: getNormalizedX(samples[last], srcW), cy: getNormalizedY(samples[last], srcH) };

    let lo = 0;
    let hi = last;
    let i = -1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (getSampleTime(samples[mid]) <= timeMs) { i = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    if (i < 0) return { cx: getNormalizedX(samples[0], srcW), cy: getNormalizedY(samples[0], srcH) };

    const a = samples[i];
    const b = samples[i + 1] ?? a;
    const tA = getSampleTime(a);
    const tB = getSampleTime(b);
    const span = tB - tA;

    const ax = getNormalizedX(a, srcW);
    const ay = getNormalizedY(a, srcH);
    if (span <= 0) return { cx: ax, cy: ay };

    const t = Math.max(0, Math.min(1, (timeMs - tA) / span));
    const bx = getNormalizedX(b, srcW);
    const by = getNormalizedY(b, srcH);
    return { cx: ax + (bx - ax) * t, cy: ay + (by - ay) * t };
}

/**
 * Drive a semi-implicit (symplectic) Euler spring across targets at 240Hz
 */
export function springSmooth(targets, stiffness, damping, mass) {
    const out = new Float32Array(targets.length);
    if (targets.length === 0) return out;
    let x = targets[0];
    let v = 0;
    out[0] = x;
    for (let i = 1; i < targets.length; i++) {
        const accel = (-stiffness * (x - targets[i]) - damping * v) / mass;
        v += accel * STEP_S;
        x += v * STEP_S;
        out[i] = x;
    }
    return out;
}

/**
 * Split samples across gaps where mouse was inactive or hidden (> 1200ms gap)
 */
function splitVisibleRuns(samples) {
    const runs = [];
    let current = [];
    for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        if (sample.visible === false) {
            if (current.length) runs.push(current);
            current = [];
            continue;
        }
        if (current.length > 0) {
            const prev = current[current.length - 1];
            const dt = getSampleTime(sample) - getSampleTime(prev);
            if (dt > 1200) {
                runs.push(current);
                current = [];
            }
        }
        current.push(sample);
    }
    if (current.length) runs.push(current);
    return runs;
}

function buildSmoothedRun(samples, stiffness, damping, mass, srcW, srcH, settleMs = 0) {
    const start = getSampleTime(samples[0]);
    // Keep simulating past the last sample (holding its position) so the spring
    // settles where the cursor actually stopped instead of freezing mid-lag.
    const end = getSampleTime(samples[samples.length - 1]) + Math.max(0, settleMs);
    const stepCount = Math.max(1, Math.round((end - start) / STEP_MS));
    const n = stepCount + 1;
    const times = new Float32Array(n);
    const rawX = new Float32Array(n);
    const rawY = new Float32Array(n);

    const holdGap = getHoldGapMs(samples);
    // Single forward pass over the samples (the grid is monotonic), O(n + m).
    let j = 0;
    const last = samples.length - 1;
    for (let i = 0; i < n; i++) {
        const t = i === n - 1 ? end : start + i * STEP_MS;
        times[i] = t;
        while (j < last && getSampleTime(samples[j + 1]) <= t) j++;
        const a = samples[j];
        const b = samples[Math.min(last, j + 1)];
        const tA = getSampleTime(a);
        const tB = getSampleTime(b);
        let k = tB > tA ? Math.max(0, Math.min(1, (t - tA) / (tB - tA))) : 0;
        // The recorder only samples while the mouse moves: a long gap means the
        // cursor sat still, so hold it instead of drifting across the gap.
        if (tB - tA > holdGap) k = Math.max(0, Math.min(1, (t - (tB - MOVE_IN_MS)) / MOVE_IN_MS));
        const ax = getNormalizedX(a, srcW);
        const ay = getNormalizedY(a, srcH);
        rawX[i] = ax + (getNormalizedX(b, srcW) - ax) * k;
        rawY[i] = ay + (getNormalizedY(b, srcH) - ay) * k;
    }

    const xs = springSmooth(rawX, stiffness, damping, mass);
    const ys = springSmooth(rawY, stiffness, damping, mass);

    // Pin the smoothed path to the real position around every click, so the
    // pointer lands exactly on what it clicks (and on its click ripple)
    // instead of trailing behind it.
    for (const sample of samples) {
        if (!sample.click) continue;
        const tc = getSampleTime(sample);
        const lo = Math.max(0, Math.floor((tc - start - CLICK_PIN_MS) / STEP_MS));
        const hi = Math.min(n - 1, Math.ceil((tc - start + CLICK_PIN_MS) / STEP_MS));
        for (let i = lo; i <= hi; i++) {
            const u = 1 - Math.abs(times[i] - tc) / CLICK_PIN_MS;
            if (u <= 0) continue;
            const w = u * u * (3 - 2 * u);
            xs[i] += (rawX[i] - xs[i]) * w;
            ys[i] += (rawY[i] - ys[i]) * w;
        }
    }

    return { start, end, times, xs, ys };
}

function sampleRun(run, timeMs) {
    const last = run.times.length - 1;
    if (timeMs <= run.times[0]) return { cx: run.xs[0], cy: run.ys[0] };
    if (timeMs >= run.times[last]) return { cx: run.xs[last], cy: run.ys[last] };

    const i = binarySearchAtOrBefore(run.times, timeMs, last);
    if (i < 0) return { cx: run.xs[0], cy: run.ys[0] };

    const span = run.times[i + 1] - run.times[i];
    if (span <= 0) return { cx: run.xs[i], cy: run.ys[i] };

    const t = Math.max(0, Math.min(1, (timeMs - run.times[i]) / span));
    return {
        cx: run.xs[i] + (run.xs[i + 1] - run.xs[i]) * t,
        cy: run.ys[i] + (run.ys[i + 1] - run.ys[i]) * t,
    };
}

function buildRawPath(runs, srcW, srcH) {
    const starts = runs.map(r => getSampleTime(r[0]));
    return {
        sampleAt(timeMs) {
            const i = binarySearchAtOrBefore(starts, timeMs, starts.length - 1);
            const run = runs[Math.max(0, i)];
            return interpolateRun(run, timeMs, srcW, srcH);
        }
    };
}

function buildSmoothedPath(samples, smoothingStrength, options = {}) {
    const srcW = options.sourceWidth || 1920;
    const srcH = options.sourceHeight || 1080;
    const runs = splitVisibleRuns(samples).filter(r => r.length > 0);

    if (runs.length === 0) {
        return { sampleAt: () => null };
    }

    if (smoothingStrength <= 0) {
        return buildRawPath(runs, srcW, srcH);
    }

    const config = getCursorSpringConfig(smoothingStrength);

    const smoothedRuns = runs.map((run, idx) => {
        if (run.length < 2) {
            const t = getSampleTime(run[0]);
            const x = getNormalizedX(run[0], srcW);
            const y = getNormalizedY(run[0], srcH);
            return {
                start: t,
                end: t,
                times: new Float32Array([t]),
                xs: new Float32Array([x]),
                ys: new Float32Array([y]),
            };
        }
        const next = runs[idx + 1];
        const lastT = getSampleTime(run[run.length - 1]);
        const settle = Math.min(800, next ? getSampleTime(next[0]) - lastT - STEP_MS : 800);
        return buildSmoothedRun(run, config.stiffness, config.damping, config.mass, srcW, srcH, settle);
    });

    const starts = smoothedRuns.map(r => r.start);
    return {
        sampleAt(timeMs) {
            // Latest run starting at or before timeMs; between runs the cursor
            // rests where the previous run ended (the recorder only samples motion).
            const i = binarySearchAtOrBefore(starts, timeMs, starts.length - 1);
            if (i < 0) return sampleRun(smoothedRuns[0], smoothedRuns[0].start);
            const run = smoothedRuns[i];
            return sampleRun(run, Math.min(timeMs, run.end));
        }
    };
}

// Global WeakMap cache to memoize path generation per sample set
const pathCache = new WeakMap();

/**
 * Get or compute the 240Hz smoothed cursor path for a set of telemetry samples
 * @param {Array<Object>} samples
 * @param {number} smoothingStrength - 0 (raw) to 2.0 (maximum cinematic glide)
 * @param {Object} options
 * @returns {{ sampleAt: (timeMs: number) => { cx: number, cy: number } | null }}
 */
export function getSmoothedCursorPath(samples, smoothingStrength = 1.0, options = {}) {
    if (!samples || samples.length === 0) return null;

    const strength = Number.isFinite(smoothingStrength) ? Math.max(0, Math.min(2.0, smoothingStrength)) : 1.0;
    const key = strength.toFixed(2);

    let byStrength = pathCache.get(samples);
    if (!byStrength) {
        byStrength = new Map();
        pathCache.set(samples, byStrength);
    }

    let path = byStrength.get(key);
    if (!path) {
        path = buildSmoothedPath(samples, strength, options);
        byStrength.set(key, path);
    }

    return path;
}
