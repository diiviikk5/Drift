/**
 * Cinema Cursor Engine — Spring-Physics Cursor Smoothing
 * Ported from Cap's cursor_interpolation.rs
 * 
 * Features:
 * - Spring-mass-damper smoothing for buttery cursor movement
 * - Context-aware spring profiles: Default, Snappy (clicks), Drag
 * - Shake filtering (removes jittery micro-movements)
 * - Gap interpolation (fills gaps in cursor data)
 * - Click reaction: briefly snaps to click position with high tension
 * - Motion blur data output (velocity magnitude for GPU blur)
 */

import { SpringMassDamperSimulation, SPRING_PRESETS } from './SpringPhysics.js';

// ============================================================
// CONSTANTS (matching Cap's values)
// ============================================================

const CLICK_REACTION_WINDOW_MS = 160;
const SHAKE_THRESHOLD_UV = 0.015;
const SHAKE_DETECTION_WINDOW_MS = 100;
const CURSOR_IDLE_MIN_DELAY_MS = 500;
const CURSOR_IDLE_FADE_OUT_MS = 400;
const CURSOR_FRAME_DURATION_MS = 1000 / 60;
const GAP_INTERPOLATION_THRESHOLD_MS = CURSOR_FRAME_DURATION_MS * 4;
const MIN_CURSOR_TRAVEL_FOR_INTERPOLATION = 0.02;
const MAX_INTERPOLATED_STEPS = 120;

// ============================================================
// SPRING PROFILES
// ============================================================

const SpringProfile = {
    Default: 'default',
    Snappy: 'snappy',
    Drag: 'drag',
};

function getSpringConfig(profile) {
    switch (profile) {
        case SpringProfile.Snappy:
            return SPRING_PRESETS.snappy;
        case SpringProfile.Drag:
            return SPRING_PRESETS.drag;
        default:
            return SPRING_PRESETS.cursor;
    }
}

// ============================================================
// CINEMA CURSOR ENGINE
// ============================================================

export class CinemaCursorEngine {
    constructor(options = {}) {
        this.smoothingEnabled = options.smoothingEnabled ?? true;

        // Spring simulation
        this._spring = new SpringMassDamperSimulation(
            options.springConfig || SPRING_PRESETS.cursor
        );
        this._spring.setPosition(0.5, 0.5);
        this._spring.setTarget(0.5, 0.5);

        // Raw cursor data
        this._moves = [];    // { time: ms, x: 0-1, y: 0-1 }
        this._clicks = [];   // { time: ms, x, y, button, down: bool }

        // State
        this._lastTime = 0;
        this._currentProfile = SpringProfile.Default;
        this._lastClickTime = -Infinity;
        this._primaryButtonDown = false;
        this._nextClickIndex = 0;

        // Smoothed output
        this.position = { x: 0.5, y: 0.5 };
        this.velocity = { x: 0, y: 0 };
        this.motionMagnitude = 0; // For motion blur

        // Screen dimensions for normalization
        this.screenWidth = options.screenWidth || 1920;
        this.screenHeight = options.screenHeight || 1080;
    }

    // ============================================================
    // DATA INPUT
    // ============================================================

    /**
     * Set all cursor moves (for playback)
     */
    setMoves(moves) {
        this._moves = moves;
        // Pre-process: filter shakes and densify gaps
        if (this.smoothingEnabled) {
            this._moves = this._filterShake(this._moves);
            this._moves = this._densifyGaps(this._moves);
        }
    }

    /**
     * Set click events (for spring profile switching)
     */
    setClicks(clicks) {
        this._clicks = clicks;
        this._nextClickIndex = 0;
    }

    /**
     * Add a live cursor move event
     * @param {number} time - ms since recording start
     * @param {number} x - pixel X position  
     * @param {number} y - pixel Y position
     */
    addMove(time, x, y) {
        // Normalize to 0-1
        const normX = x / this.screenWidth;
        const normY = y / this.screenHeight;
        this._moves.push({ time, x: normX, y: normY });
    }

    /**
     * Add a click event
     */
    addClick(time, x, y, button = 'left', down = true) {
        const normX = x / this.screenWidth;
        const normY = y / this.screenHeight;
        this._clicks.push({ time, x: normX, y: normY, button, down });
    }

    // ============================================================
    // CORE UPDATE
    // ============================================================

    /**
     * Get smoothed cursor position at a given time
     * @param {number} timeMs - playback time in milliseconds
     * @returns {{ x: number, y: number, velocity: { x: number, y: number }, motion: number, opacity: number, clickProgress: number }}
     */
    getPositionAt(timeMs) {
        if (this._moves.length === 0) {
            return { x: 0.5, y: 0.5, velocity: { x: 0, y: 0 }, motion: 0, opacity: 0, clickProgress: 0 };
        }

        // Advance click state
        this._advanceClicks(timeMs);

        // Get the spring profile based on click context
        const profile = this._getProfile(timeMs);
        if (profile !== this._currentProfile) {
            const config = getSpringConfig(profile);
            this._spring.tension = config.tension;
            this._spring.mass = config.mass;
            this._spring.friction = config.friction;
            this._currentProfile = profile;
        }

        // Click animation progress (0 = no click, 1 = just clicked)
        const clickProgress = this._computeClickProgress(timeMs);

        if (!this.smoothingEnabled) {
            // Raw mode: just interpolate between move events
            const raw = this._getRawPosition(timeMs);
            this.position = raw;
            this.velocity = { x: 0, y: 0 };
            this.motionMagnitude = 0;
            return { ...raw, velocity: this.velocity, motion: 0, opacity: 1, clickProgress };
        }

        // Find the two move events surrounding timeMs
        const raw = this._getRawPosition(timeMs);

        // Set spring target to raw position
        this._spring.setTarget(raw.x, raw.y);

        // Run spring simulation
        const dt = timeMs - this._lastTime;
        if (dt > 0 && dt < 1000) {
            this._spring.run(dt);
        }
        this._lastTime = timeMs;

        // Read smoothed output
        this.position = { ...this._spring.position };
        this.velocity = { ...this._spring.velocity };

        // Clamp to screen
        this.position.x = Math.max(0, Math.min(1, this.position.x));
        this.position.y = Math.max(0, Math.min(1, this.position.y));

        // Calculate motion magnitude (for motion blur)
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        this.motionMagnitude = Math.min(speed * 50, 1.0); // Normalized 0-1

        // Calculate opacity (fade when idle)
        const opacity = this._calculateIdleOpacity(timeMs);

        return {
            x: this.position.x,
            y: this.position.y,
            velocity: this.velocity,
            motion: this.motionMagnitude,
            opacity,
            clickProgress,
        };
    }

    /**
     * Reset for seeking
     */
    reset() {
        this._spring.setPosition(0.5, 0.5);
        this._spring.setVelocity(0, 0);
        this._spring.setTarget(0.5, 0.5);
        this._lastTime = 0;
        this._currentProfile = SpringProfile.Default;
        this._nextClickIndex = 0;
        this._lastClickTime = -Infinity;
        this._primaryButtonDown = false;
    }

    // ============================================================
    // INTERNAL: Raw position interpolation
    // ============================================================

    _getRawPosition(timeMs) {
        if (this._moves.length === 0) return { x: 0.5, y: 0.5 };

        // Before first move
        if (timeMs <= this._moves[0].time) {
            return { x: this._moves[0].x, y: this._moves[0].y };
        }

        // After last move
        const last = this._moves[this._moves.length - 1];
        if (timeMs >= last.time) {
            return { x: last.x, y: last.y };
        }

        // Binary search for surrounding events
        let lo = 0, hi = this._moves.length - 1;
        while (lo < hi - 1) {
            const mid = (lo + hi) >> 1;
            if (this._moves[mid].time <= timeMs) lo = mid;
            else hi = mid;
        }

        const a = this._moves[lo];
        const b = this._moves[hi];
        const t = (timeMs - a.time) / (b.time - a.time);

        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
        };
    }

    // ============================================================
    // INTERNAL: Spring profile selection
    // ============================================================

    _advanceClicks(timeMs) {
        while (this._nextClickIndex < this._clicks.length) {
            const click = this._clicks[this._nextClickIndex];
            if (click.time > timeMs) break;

            this._lastClickTime = click.time;
            if (click.button === 'left') {
                this._primaryButtonDown = click.down;
            }
            this._nextClickIndex++;
        }
    }

    _getProfile(timeMs) {
        // Recent click → snappy profile
        if (timeMs - this._lastClickTime < CLICK_REACTION_WINDOW_MS) {
            return SpringProfile.Snappy;
        }
        // Primary button held → drag profile
        if (this._primaryButtonDown) {
            return SpringProfile.Drag;
        }
        // Default
        return SpringProfile.Default;
    }

    // ============================================================
    // INTERNAL: Click animation
    // ============================================================

    _computeClickProgress(timeMs) {
        const CLICK_DURATION_MS = 400; // longer for smoother feel

        // Find the most recent click before current time
        let latestClickTime = -Infinity;
        for (let i = this._clicks.length - 1; i >= 0; i--) {
            if (this._clicks[i].time <= timeMs && this._clicks[i].down) {
                latestClickTime = this._clicks[i].time;
                break;
            }
        }

        if (latestClickTime === -Infinity) return 0;

        const elapsed = timeMs - latestClickTime;
        if (elapsed > CLICK_DURATION_MS) return 0;

        // Smooth spring-like animation:
        // Quick snap in (15%), smooth elastic release (85%)
        const t = elapsed / CLICK_DURATION_MS;
        if (t < 0.15) {
            // Fast attack with smooth ease-out
            const attack = t / 0.15;
            return attack * attack * (3 - 2 * attack); // smoothstep
        } else {
            // Spring-like release: overshoot slightly then settle
            const release = (t - 0.15) / 0.85;
            const decay = Math.exp(-4 * release);
            const overshoot = Math.sin(release * Math.PI * 1.2) * 0.15;
            return (1 + overshoot) * decay;
        }
    }

    // ============================================================
    // INTERNAL: Idle fade
    // ============================================================

    _calculateIdleOpacity(timeMs) {
        if (this._moves.length === 0) return 0;

        // Find the last move before current time
        let lastMoveTime = 0;
        for (let i = this._moves.length - 1; i >= 0; i--) {
            if (this._moves[i].time <= timeMs) {
                lastMoveTime = this._moves[i].time;
                break;
            }
        }

        const idleTime = timeMs - lastMoveTime;
        if (idleTime < CURSOR_IDLE_MIN_DELAY_MS) return 1.0;

        const fadeProgress = (idleTime - CURSOR_IDLE_MIN_DELAY_MS) / CURSOR_IDLE_FADE_OUT_MS;
        return Math.max(0, 1 - fadeProgress);
    }

    // ============================================================
    // INTERNAL: Shake filtering (from Cap)
    // ============================================================

    _filterShake(moves) {
        if (moves.length < 3) return moves;

        const filtered = [moves[0]];
        for (let i = 1; i < moves.length - 1; i++) {
            const prev = filtered[filtered.length - 1];
            const curr = moves[i];
            const next = moves[i + 1];

            const timeDelta = curr.time - prev.time;
            if (timeDelta > SHAKE_DETECTION_WINDOW_MS) {
                filtered.push(curr);
                continue;
            }

            // Check if this is a reversal (shake)
            const dx1 = curr.x - prev.x;
            const dy1 = curr.y - prev.y;
            const dx2 = next.x - curr.x;
            const dy2 = next.y - curr.y;

            const dist = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            const dot = dx1 * dx2 + dy1 * dy2;

            // If distance is small AND direction reverses, it's a shake
            if (dist < SHAKE_THRESHOLD_UV && dot < 0) {
                continue; // Skip this point
            }

            filtered.push(curr);
        }

        // Always include last point
        filtered.push(moves[moves.length - 1]);
        return filtered;
    }

    // ============================================================
    // INTERNAL: Gap interpolation (from Cap)
    // ============================================================

    _densifyGaps(moves) {
        if (moves.length < 2) return moves;

        const result = [moves[0]];

        for (let i = 1; i < moves.length; i++) {
            const prev = moves[i - 1];
            const curr = moves[i];
            const gap = curr.time - prev.time;

            if (gap > GAP_INTERPOLATION_THRESHOLD_MS) {
                // Check if cursor traveled enough to warrant interpolation
                const dist = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
                if (dist > MIN_CURSOR_TRAVEL_FOR_INTERPOLATION) {
                    const steps = Math.min(
                        Math.ceil(gap / CURSOR_FRAME_DURATION_MS),
                        MAX_INTERPOLATED_STEPS
                    );
                    for (let s = 1; s < steps; s++) {
                        const t = s / steps;
                        result.push({
                            time: prev.time + gap * t,
                            x: prev.x + (curr.x - prev.x) * t,
                            y: prev.y + (curr.y - prev.y) * t,
                        });
                    }
                }
            }

            result.push(curr);
        }

        return result;
    }
}

export default CinemaCursorEngine;
