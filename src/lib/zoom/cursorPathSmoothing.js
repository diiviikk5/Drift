/**
 * cursorPathSmoothing — lag-free offline smoothing of recorded cursor paths.
 *
 * The whole recording is known up front, so the path is smoothed in both
 * directions in time (zero-phase). Hand tremor and pixel stair-steps disappear
 * while the drawn pointer stays exactly on schedule with the real one: no
 * trailing on fast moves and no overshoot when the mouse stops. Clicks are
 * pinned to their exact recorded position.
 *
 * Pipeline: resample to a 240 Hz grid (holding still through gaps where the
 * mouse did not move) -> forward + backward one-pole low-pass, applied twice
 * (a near-Gaussian kernel) -> pin clicks -> linear lookup.
 */

const HZ = 240;
const STEP_MS = 1000 / HZ;
const MIN_HOLD_GAP_MS = 60;
const MOVE_IN_MS = 16;
const CLICK_PIN_MS = 90;
const BASE_TAU_MS = 9; // strength 1 -> effective sigma ~18 ms

function sampleTime(s) {
    return s.timeMs ?? s.time ?? s.t ?? 0;
}

// Samples are normally normalized (0..1, a hair past the edge is possible);
// only clearly pixel-valued data is divided by the source size.
function normX(s, srcW) {
    if (s.cx != null) return s.cx;
    const x = s.x ?? 0.5;
    return x > 2 ? x / srcW : x;
}

function normY(s, srcH) {
    if (s.cy != null) return s.cy;
    const y = s.y ?? 0.5;
    return y > 2 ? y / srcH : y;
}

/**
 * Gap above which consecutive samples mean "the cursor sat still" (the
 * recorder only samples while the mouse moves). Adapts to the sample rate so
 * sparse imported data still interpolates normally.
 */
export function getHoldGapMs(samples) {
    const n = samples.length;
    if (n < 3) return Infinity;
    const gaps = [];
    const stride = Math.max(1, Math.floor(n / 512));
    for (let i = stride; i < n; i += stride) {
        const g = sampleTime(samples[i]) - sampleTime(samples[i - stride]);
        if (g > 0) gaps.push(g / stride);
    }
    if (!gaps.length) return Infinity;
    gaps.sort((a, b) => a - b);
    return Math.max(MIN_HOLD_GAP_MS, gaps[gaps.length >> 1] * 8);
}

/** Zero-phase low-pass: forward then backward one-pole filter, `passes` times. */
export function zeroPhaseSmooth(values, tauMs, passes = 2) {
    const out = Float32Array.from(values);
    const n = out.length;
    if (n < 3 || !(tauMs > 0)) return out;
    const a = 1 - Math.exp(-STEP_MS / tauMs);
    for (let p = 0; p < passes; p++) {
        for (let i = 1; i < n; i++) out[i] += (out[i - 1] - out[i]) * (1 - a);
        for (let i = n - 2; i >= 0; i--) out[i] += (out[i + 1] - out[i]) * (1 - a);
    }
    return out;
}

function buildPath(samples, strength, srcW, srcH) {
    const sorted = samples
        .filter(s => Number.isFinite(sampleTime(s)))
        .slice()
        .sort((a, b) => sampleTime(a) - sampleTime(b));
    const m = sorted.length;
    if (m === 0) return { sampleAt: () => null };

    const start = sampleTime(sorted[0]);
    const end = sampleTime(sorted[m - 1]);
    const n = Math.max(1, Math.round((end - start) / STEP_MS)) + 1;
    const times = new Float64Array(n);
    const rawX = new Float32Array(n);
    const rawY = new Float32Array(n);
    const holdGap = getHoldGapMs(sorted);

    let j = 0;
    for (let i = 0; i < n; i++) {
        const t = i === n - 1 ? end : start + i * STEP_MS;
        times[i] = t;
        while (j < m - 1 && sampleTime(sorted[j + 1]) <= t) j++;
        const a = sorted[j];
        const b = sorted[Math.min(m - 1, j + 1)];
        const tA = sampleTime(a);
        const tB = sampleTime(b);
        let k = tB > tA ? Math.min(1, Math.max(0, (t - tA) / (tB - tA))) : 0;
        // Long gap: the mouse rested at A, then moved to B right at the end.
        if (tB - tA > holdGap) k = Math.min(1, Math.max(0, (t - (tB - MOVE_IN_MS)) / MOVE_IN_MS));
        const ax = normX(a, srcW);
        const ay = normY(a, srcH);
        rawX[i] = ax + (normX(b, srcW) - ax) * k;
        rawY[i] = ay + (normY(b, srcH) - ay) * k;
    }

    const tau = BASE_TAU_MS * strength;
    const xs = zeroPhaseSmooth(rawX, tau);
    const ys = zeroPhaseSmooth(rawY, tau);

    // Clicks land exactly where they happened.
    for (const s of sorted) {
        if (!s.click) continue;
        const tc = sampleTime(s);
        const lo = Math.max(0, Math.floor((tc - start - CLICK_PIN_MS) / STEP_MS));
        const hi = Math.min(n - 1, Math.ceil((tc - start + CLICK_PIN_MS) / STEP_MS));
        const cx = normX(s, srcW);
        const cy = normY(s, srcH);
        for (let i = lo; i <= hi; i++) {
            const u = 1 - Math.abs(times[i] - tc) / CLICK_PIN_MS;
            if (u <= 0) continue;
            const w = u * u * (3 - 2 * u);
            xs[i] += (cx - xs[i]) * w;
            ys[i] += (cy - ys[i]) * w;
        }
    }

    return {
        sampleAt(timeMs) {
            if (!(timeMs > times[0])) return { cx: xs[0], cy: ys[0] };
            if (timeMs >= times[n - 1]) return { cx: xs[n - 1], cy: ys[n - 1] };
            const f = (timeMs - start) / STEP_MS;
            const i = Math.min(n - 2, Math.floor(f));
            const u = Math.min(1, Math.max(0, (timeMs - times[i]) / (times[i + 1] - times[i] || 1)));
            return { cx: xs[i] + (xs[i + 1] - xs[i]) * u, cy: ys[i] + (ys[i + 1] - ys[i]) * u };
        },
    };
}

function buildRawPath(samples, srcW, srcH) {
    const sorted = samples.slice().sort((a, b) => sampleTime(a) - sampleTime(b));
    return {
        sampleAt(timeMs) {
            let lo = 0;
            let hi = sorted.length - 1;
            let i = -1;
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (sampleTime(sorted[mid]) <= timeMs) { i = mid; lo = mid + 1; } else { hi = mid - 1; }
            }
            if (i < 0) i = 0;
            const a = sorted[i];
            const b = sorted[Math.min(sorted.length - 1, i + 1)];
            const span = sampleTime(b) - sampleTime(a);
            const k = span > 0 ? Math.min(1, Math.max(0, (timeMs - sampleTime(a)) / span)) : 0;
            return {
                cx: normX(a, srcW) + (normX(b, srcW) - normX(a, srcW)) * k,
                cy: normY(a, srcH) + (normY(b, srcH) - normY(a, srcH)) * k,
            };
        },
    };
}

const pathCache = new WeakMap();

/**
 * Smoothed cursor path for a sample set (memoized per array and strength).
 * @param {Array<Object>} samples  {time(ms), x, y, click?}
 * @param {number} strength 0 = raw, 1 = default, 2 = extra smooth
 * @returns {{ sampleAt: (timeMs: number) => { cx: number, cy: number } | null } | null}
 */
export function getSmoothedCursorPath(samples, strength = 1.0, options = {}) {
    if (!samples || samples.length === 0) return null;
    const s = Number.isFinite(strength) ? Math.max(0, Math.min(2, strength)) : 1;
    const key = s.toFixed(2);
    let byStrength = pathCache.get(samples);
    if (!byStrength) {
        byStrength = new Map();
        pathCache.set(samples, byStrength);
    }
    let path = byStrength.get(key);
    if (!path) {
        const srcW = options.sourceWidth || 1920;
        const srcH = options.sourceHeight || 1080;
        path = s <= 0 ? buildRawPath(samples, srcW, srcH) : buildPath(samples, s, srcW, srcH);
        byStrength.set(key, path);
    }
    return path;
}
