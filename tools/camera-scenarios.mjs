/**
 * Synthetic recording scenarios for evaluating the auto-zoom camera.
 *
 * Each scenario is a script of mouse actions; the generator turns it into the
 * same telemetry the recorder produces (cursor samples every ~5 ms while the
 * mouse moves, clicks, typed keys).
 */

const SAMPLE_MS = 5;

/** Human-like mouse move: minimum-jerk profile with a slight arc. */
function moveSamples(from, to, t0, durMs) {
    const out = [];
    const nx = -(to.y - from.y);
    const ny = to.x - from.x;
    const bow = 0.06;
    for (let t = SAMPLE_MS; t <= durMs; t += SAMPLE_MS) {
        const u = t / durMs;
        const e = u * u * u * (10 - 15 * u + 6 * u * u);
        const arc = Math.sin(Math.PI * u) * bow;
        out.push({ time: t0 + t, x: from.x + (to.x - from.x) * e + nx * arc, y: from.y + (to.y - from.y) * e + ny * arc });
    }
    return out;
}

/** Fitts-ish move duration (ms) for a normalized distance. */
function moveDuration(d, speed = 1) {
    return (180 + 520 * Math.sqrt(d)) / speed;
}

/**
 * Build telemetry from steps:
 *   { click: [x, y], at?: sec, speed? }  move there (arriving at `at` if given) and click
 *   { move: [x, y], speed? }             move without clicking
 *   { wait: sec }                        idle
 *   { type: sec, rate? }                 type for `sec` seconds at the current spot
 */
export function buildScenario(steps, { start = [0.5, 0.5], duration } = {}) {
    let t = 300;
    let pos = { x: start[0], y: start[1] };
    const moves = [{ time: 0, x: pos.x, y: pos.y }];
    const clicks = [];
    const keys = [];
    for (const step of steps) {
        if (step.wait) { t += step.wait * 1000; continue; }
        if (step.type) {
            const rate = step.rate || 7; // keys per second
            for (let k = 0; k < step.type * rate; k++) keys.push({ time: Math.round((t + (k * 1000) / rate)) / 1000, text: '', typed: true });
            t += step.type * 1000;
            continue;
        }
        const target = step.click || step.move;
        const to = { x: target[0], y: target[1] };
        const d = Math.hypot(to.x - pos.x, to.y - pos.y);
        let dur = moveDuration(d, step.speed || 1);
        if (step.at != null) {
            const arrive = step.at * 1000;
            if (arrive - dur > t) t = arrive - dur;
            else dur = Math.max(60, arrive - t);
        }
        if (d > 0.001) moves.push(...moveSamples(pos, to, t, dur));
        t += dur;
        pos = to;
        if (step.click) {
            t += 60;
            const c = { time: t, x: pos.x, y: pos.y, click: 'left' };
            moves.push(c);
            clicks.push(c);
            t += 120;
        }
    }
    const end = Math.max(duration ? duration * 1000 : 0, t + 1500);
    return { moves, clicks, keys, duration: end / 1000 };
}

const rnd = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
};

export const SCENARIOS = {
    'single click (short clip)': () => buildScenario([{ wait: 0.8 }, { click: [0.7, 0.35] }], { duration: 4 }),

    'chained form fill (6 fields, quick)': () => buildScenario([
        { wait: 0.6 },
        { click: [0.35, 0.30] }, { type: 0.8 },
        { click: [0.35, 0.38] }, { type: 0.6 },
        { click: [0.35, 0.46] }, { type: 0.7 },
        { click: [0.55, 0.46] },
        { click: [0.35, 0.56] }, { type: 0.5 },
        { click: [0.48, 0.66] },
        { wait: 1.0 },
    ]),

    'rapid chained clicks in a toolbar': () => buildScenario([
        { wait: 0.5 },
        { click: [0.20, 0.08] }, { click: [0.26, 0.08], speed: 1.6 }, { click: [0.33, 0.08], speed: 1.6 },
        { click: [0.40, 0.08], speed: 1.6 }, { click: [0.31, 0.08], speed: 1.6 }, { click: [0.22, 0.08], speed: 1.6 },
        { wait: 1.2 },
    ]),

    'fast clicks across the whole screen': () => {
        const r = rnd(7);
        const steps = [{ wait: 0.5 }];
        for (let i = 0; i < 12; i++) steps.push({ click: [0.08 + r() * 0.84, 0.08 + r() * 0.84], speed: 1.8 });
        steps.push({ wait: 1 });
        return buildScenario(steps);
    },

    'click, read, click elsewhere (deliberate)': () => buildScenario([
        { wait: 1 },
        { click: [0.25, 0.3] }, { wait: 2.5 },
        { click: [0.75, 0.7] }, { wait: 2.5 },
        { click: [0.3, 0.75] }, { wait: 3 },
    ]),

    'ping-pong between two panels': () => {
        const steps = [{ wait: 0.5 }];
        for (let i = 0; i < 8; i++) steps.push({ click: i % 2 ? [0.82, 0.5] : [0.18, 0.5] }, { wait: 0.35 });
        return buildScenario(steps);
    },

    'long tutorial (60 s, mixed)': () => {
        const r = rnd(42);
        const steps = [{ wait: 1 }];
        let cx = 0.3;
        let cy = 0.3;
        while (steps.length < 70) {
            const p = r();
            if (p < 0.12) steps.push({ wait: 1.5 + r() * 3 });
            else if (p < 0.22) steps.push({ type: 1 + r() * 2.5 });
            else if (p < 0.35) { cx = 0.1 + r() * 0.8; cy = 0.1 + r() * 0.8; steps.push({ click: [cx, cy] }); }
            else steps.push({ click: [Math.min(0.95, Math.max(0.05, cx + (r() - 0.5) * 0.2)), Math.min(0.95, Math.max(0.05, cy + (r() - 0.5) * 0.2))], speed: 0.8 + r() });
        }
        return buildScenario(steps, { duration: 60 });
    },

    'one click in a long, quiet video': () => buildScenario([{ wait: 6 }, { click: [0.62, 0.44] }, { wait: 20 }], { duration: 30 }),

    'detail work in a corner for 15 s': () => {
        const r = rnd(11);
        const steps = [{ wait: 1 }];
        for (let i = 0; i < 18; i++) {
            if (i % 4 === 3) steps.push({ type: 1.2 });
            else steps.push({ click: [0.78 + r() * 0.12, 0.8 + r() * 0.1], speed: 0.9 });
            steps.push({ wait: 0.3 + r() * 0.5 });
        }
        return buildScenario(steps);
    },

    'deliberate tour of four areas': () => buildScenario([
        { wait: 1 },
        { click: [0.2, 0.2] }, { wait: 1.6 }, { click: [0.24, 0.26] }, { wait: 2 },
        { click: [0.8, 0.25] }, { wait: 1.5 }, { click: [0.76, 0.3] }, { wait: 2 },
        { click: [0.75, 0.8] }, { wait: 1.8 }, { click: [0.7, 0.78] }, { wait: 2 },
        { click: [0.25, 0.75] }, { wait: 2.5 },
    ]),

    'quick two-step: click, then a far button': () => buildScenario([
        { wait: 1 }, { click: [0.2, 0.3] }, { wait: 0.4 }, { click: [0.85, 0.75] }, { wait: 2.5 },
    ]),

    'cursor wandering, no clicks': () => {
        const r = rnd(3);
        const steps = [];
        for (let i = 0; i < 14; i++) steps.push({ move: [0.1 + r() * 0.8, 0.1 + r() * 0.8], speed: 0.7 }, { wait: 0.4 });
        return buildScenario(steps);
    },
    // --- moving on while zoomed in (the camera must not drag a zoomed view across the screen)
    'work, then rush to a far spot and keep working': () => buildScenario([
        { wait: 1 },
        { click: [0.25, 0.3] }, { type: 1.2 }, { click: [0.3, 0.35] }, { type: 0.8 },
        { click: [0.78, 0.72], speed: 1.5 }, { type: 1.0 }, { click: [0.74, 0.7] }, { type: 0.8 },
        { wait: 2 },
    ]),

    'work, then drift slowly to the next area': () => buildScenario([
        { wait: 1 },
        { click: [0.3, 0.4] }, { type: 1.0 }, { click: [0.32, 0.43] }, { type: 0.6 },
        { move: [0.45, 0.48], speed: 0.35 }, { move: [0.6, 0.55], speed: 0.45 }, { move: [0.68, 0.6], speed: 0.6 },
        { click: [0.7, 0.62] }, { type: 1.2 }, { click: [0.72, 0.6] }, { type: 0.6 },
        { wait: 2 },
    ]),

    'work, quick flick away and back, keep working': () => buildScenario([
        { wait: 1 },
        { click: [0.4, 0.4] }, { type: 1.0 }, { click: [0.42, 0.44] },
        { move: [0.88, 0.15], speed: 2.2 }, { wait: 0.25 }, { move: [0.43, 0.45], speed: 2.2 },
        { click: [0.44, 0.46] }, { type: 1.2 }, { click: [0.41, 0.42] },
        { wait: 2 },
    ]),

    'work, then a far area with no pause at all': () => buildScenario([
        { wait: 1 },
        { click: [0.2, 0.25] }, { type: 1.0 }, { click: [0.23, 0.28] }, { type: 0.5 },
        { click: [0.82, 0.78], speed: 2.0 }, { click: [0.8, 0.74], speed: 1.5 }, { type: 1.2 }, { click: [0.78, 0.76] },
        { wait: 2 },
    ]),

    'two areas back and forth, slow and fast moves': () => buildScenario([
        { wait: 1 },
        { click: [0.25, 0.6] }, { type: 1.0 }, { click: [0.27, 0.63] }, { wait: 0.6 },
        { click: [0.75, 0.3], speed: 0.5 }, { type: 1.0 }, { click: [0.73, 0.32] }, { wait: 0.4 },
        { click: [0.26, 0.62], speed: 1.8 }, { type: 0.9 }, { click: [0.24, 0.6] }, { wait: 0.5 },
        { click: [0.76, 0.28], speed: 1.0 }, { type: 0.8 }, { wait: 2 },
    ]),
};
