/**
 * Spring-Mass-Damper Physics System — Analytical Solver
 * Ported from Cap's spring_mass_damper.rs
 * 
 * Uses ANALYTICAL solutions (not iterative Euler) for exact spring dynamics.
 * Handles all three damping regimes:
 *   - Underdamped (ζ < 1): oscillatory with exponential decay
 *   - Critically damped (ζ = 1): fastest non-oscillatory settling
 *   - Overdamped (ζ > 1): slow non-oscillatory settling
 * 
 * This matches Cap's solve_spring_1d() exactly for frame-perfect spring motion.
 */

// ============================================================
// ANALYTICAL 1D SPRING SOLVER (from Cap's spring_mass_damper.rs)
// ============================================================

/**
 * Solve a 1D spring analytically.
 * Returns { position, velocity } after time `t` seconds.
 * 
 * @param {number} x0 - initial displacement from target
 * @param {number} v0 - initial velocity
 * @param {number} tension - spring stiffness (k)
 * @param {number} friction - damping coefficient (c)
 * @param {number} mass - mass (m)
 * @param {number} t - time in seconds
 */
function solveSpring1D(x0, v0, tension, friction, mass, t) {
    if (t <= 0) return { position: x0, velocity: v0 };

    const omega0 = Math.sqrt(tension / mass);       // Natural frequency
    const zeta = friction / (2 * Math.sqrt(tension * mass)); // Damping ratio

    const EPS = 1e-6;

    if (zeta < 1.0 - EPS) {
        // --- Underdamped: oscillatory ---
        const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
        const decay = Math.exp(-zeta * omega0 * t);
        const cosW = Math.cos(omegaD * t);
        const sinW = Math.sin(omegaD * t);

        const A = x0;
        const B = (v0 + zeta * omega0 * x0) / omegaD;

        const position = decay * (A * cosW + B * sinW);
        const velocity = decay * (
            (B * omegaD - A * zeta * omega0) * cosW -
            (A * omegaD + B * zeta * omega0) * sinW
        );

        return { position, velocity };

    } else if (zeta > 1.0 + EPS) {
        // --- Overdamped: two real exponential roots ---
        const sqrtTerm = omega0 * Math.sqrt(zeta * zeta - 1);
        const s1 = -zeta * omega0 + sqrtTerm;
        const s2 = -zeta * omega0 - sqrtTerm;

        const denom = s1 - s2;
        if (Math.abs(denom) < 1e-12) {
            // Degenerate case, fall through to critically damped
            const alpha = zeta * omega0;
            const expDecay = Math.exp(-alpha * t);
            const A = x0;
            const B = v0 + alpha * x0;
            const position = (A + B * t) * expDecay;
            const velocity = (B - alpha * (A + B * t)) * expDecay;
            return { position, velocity };
        }

        const c1 = (v0 - s2 * x0) / denom;
        const c2 = (s1 * x0 - v0) / denom;

        const e1 = Math.exp(s1 * t);
        const e2 = Math.exp(s2 * t);

        const position = c1 * e1 + c2 * e2;
        const velocity = c1 * s1 * e1 + c2 * s2 * e2;

        return { position, velocity };

    } else {
        // --- Critically damped (ζ ≈ 1) ---
        const alpha = omega0; // zeta * omega0, but zeta ≈ 1
        const expDecay = Math.exp(-alpha * t);
        const A = x0;
        const B = v0 + alpha * x0;

        const position = (A + B * t) * expDecay;
        const velocity = (B - alpha * (A + B * t)) * expDecay;

        return { position, velocity };
    }
}

// ============================================================
// 2D SPRING SIMULATION
// ============================================================

export class SpringMassDamperSimulation {
    constructor(config = {}) {
        this.tension = config.tension ?? 170;
        this.mass = config.mass ?? 1.0;
        this.friction = config.friction ?? 26;

        // State
        this.position = { x: 0.5, y: 0.5 };
        this.velocity = { x: 0, y: 0 };
        this.targetPosition = { x: 0.5, y: 0.5 };
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    setVelocity(vx, vy) {
        this.velocity.x = vx;
        this.velocity.y = vy;
    }

    setTarget(x, y) {
        this.targetPosition.x = x;
        this.targetPosition.y = y;
    }

    /**
     * Run the spring simulation for a given duration in milliseconds.
     * Uses the ANALYTICAL solver — no iteration, exact solution.
     */
    run(durationMs) {
        if (durationMs <= 0) return;
        const t = durationMs / 1000; // Convert to seconds

        // Solve each axis independently relative to target
        const solX = solveSpring1D(
            this.position.x - this.targetPosition.x,
            this.velocity.x,
            this.tension, this.friction, this.mass, t
        );
        const solY = solveSpring1D(
            this.position.y - this.targetPosition.y,
            this.velocity.y,
            this.tension, this.friction, this.mass, t
        );

        this.position.x = this.targetPosition.x + solX.position;
        this.position.y = this.targetPosition.y + solY.position;
        this.velocity.x = solX.velocity;
        this.velocity.y = solY.velocity;
    }

    /**
     * Check if the spring has settled (velocity and displacement near zero)
     */
    isSettled(threshold = 0.0001) {
        const dx = Math.abs(this.position.x - this.targetPosition.x);
        const dy = Math.abs(this.position.y - this.targetPosition.y);
        const vx = Math.abs(this.velocity.x);
        const vy = Math.abs(this.velocity.y);
        return dx < threshold && dy < threshold && vx < threshold && vy < threshold;
    }

    clone() {
        const sim = new SpringMassDamperSimulation({
            tension: this.tension,
            mass: this.mass,
            friction: this.friction,
        });
        sim.position = { ...this.position };
        sim.velocity = { ...this.velocity };
        sim.targetPosition = { ...this.targetPosition };
        return sim;
    }
}

// ============================================================
// 1D SPRING (for zoom scale, opacity, etc.)
// ============================================================

export class Spring1D {
    constructor(config = {}) {
        this.tension = config.tension ?? 120;
        this.mass = config.mass ?? 1.0;
        this.friction = config.friction ?? 20;

        this.value = config.initial ?? 1.0;
        this.velocity = 0;
        this.target = config.initial ?? 1.0;
    }

    setTarget(target) {
        this.target = target;
    }

    setValue(value) {
        this.value = value;
        this.velocity = 0;
    }

    /**
     * Run analytical spring solver for `durationMs` milliseconds
     */
    run(durationMs) {
        if (durationMs <= 0) return;
        const t = durationMs / 1000;

        const sol = solveSpring1D(
            this.value - this.target,
            this.velocity,
            this.tension, this.friction, this.mass, t
        );

        this.value = this.target + sol.position;
        this.velocity = sol.velocity;
    }

    isSettled(threshold = 0.001) {
        return Math.abs(this.value - this.target) < threshold &&
               Math.abs(this.velocity) < threshold;
    }
}

// ============================================================
// SPRING EASING FUNCTIONS (from Cap's zoom.rs)
// ============================================================

/**
 * Spring-based easing from 0 to 1 over normalized time t ∈ [0, 1].
 * Uses the analytical solver with a spring from 0→1.
 */
export function springEaseIn(t, config = SPRING_PRESETS.zoom) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // Solve spring starting at displacement=-1 (from 0, target=1)
    const sol = solveSpring1D(-1, 0, config.tension, config.friction, config.mass, t);
    return 1 + sol.position; // position is relative to target
}

/**
 * Spring-based easing from 1 to 0 over normalized time t ∈ [0, 1].
 */
export function springEaseOut(t, config = SPRING_PRESETS.zoom) {
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    const sol = solveSpring1D(1, 0, config.tension, config.friction, config.mass, t);
    return sol.position;
}

// ============================================================
// EXPOSE ANALYTICAL SOLVER
// ============================================================

export { solveSpring1D };

// ============================================================
// PRESET SPRING CONFIGS
// ============================================================

export const SPRING_PRESETS = {
    // Default cursor smoothing — smooth and responsive
    cursor: { tension: 170, mass: 1.0, friction: 26 },

    // Snappy — for click reactions (Cap uses 700/1/30)
    snappy: { tension: 700, mass: 1.0, friction: 30 },

    // Drag — for drag operations (slower, heavier)
    drag: { tension: 136, mass: 1.2, friction: 33.8 },

    // Zoom transitions — smooth with slight overshoot for cinematic feel
    zoom: { tension: 120, mass: 1.0, friction: 18 },

    // Zoom (no overshoot) — critically damped
    zoomCritical: { tension: 170, mass: 1.0, friction: 26 },

    // Screen movement — heavier, slower following (Cap: 200/2.25/40)
    screenMovement: { tension: 200, mass: 2.25, friction: 40 },

    // Gentle follow — for cursor following while zoomed
    gentleFollow: { tension: 80, mass: 2.0, friction: 25 },

    // Zoom segment transitions (Cap: SCREEN_SPRING stiffness:200, damping:40, mass:2.25)
    segmentTransition: { tension: 200, mass: 2.25, friction: 40 },
};

export default SpringMassDamperSimulation;
