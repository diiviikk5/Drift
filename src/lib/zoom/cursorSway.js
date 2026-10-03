/**
 * Cursor Sway — Ported from OpenScreen / Recordly
 * Implements subtle directional tilt based on mouse velocity and movement vector.
 */

const CURSOR_SWAY_MAX_ROTATION = Math.PI / 18; // ~10 degrees max tilt
const CURSOR_SWAY_SPEED_REFERENCE = 1400;      // reference speed px/sec
const CURSOR_SWAY_VERTICAL_WEIGHT = 0.65;
const CURSOR_SWAY_INTENSITY_SCALE = 3;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function clampDeltaMs(deltaMs, fallbackMs = 1000 / 60) {
    if (!Number.isFinite(deltaMs) || deltaMs <= 0) {
        return fallbackMs;
    }
    return Math.min(80, Math.max(1, deltaMs));
}

/**
 * Computes natural cursor rotation angle in radians based on displacement
 */
export function computeCursorSwayRotation(dx, dy, deltaMs, sway = 1.0) {
    if (sway <= 0) {
        return 0;
    }

    const distance = Math.hypot(dx, dy);
    if (!Number.isFinite(distance) || distance < 0.01) {
        return 0;
    }

    const speedPxPerSecond = distance / (clampDeltaMs(deltaMs) / 1000);
    const speedFactor = clamp(speedPxPerSecond / CURSOR_SWAY_SPEED_REFERENCE, 0, 1);
    if (speedFactor <= 0) {
        return 0;
    }

    const directionalBias = clamp((dx + dy * CURSOR_SWAY_VERTICAL_WEIGHT) / distance, -1, 1);
    return (
        directionalBias * speedFactor * CURSOR_SWAY_MAX_ROTATION * sway * CURSOR_SWAY_INTENSITY_SCALE
    );
}
