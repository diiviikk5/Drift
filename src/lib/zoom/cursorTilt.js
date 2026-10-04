/**
 * cursorTilt — the pointer leans into its motion like a light physical object.
 *
 * Horizontal travel tips the arrow toward the direction of movement; vertical
 * travel adds a smaller lean. The response is soft-limited with tanh so slow
 * moves barely tilt, fast flicks lean noticeably, and nothing ever spins.
 */

const MAX_TILT = (12 * Math.PI) / 180; // radians at full speed
const SPEED_FOR_HALF_TILT = 900;       // px/s (1080p units) giving ~46% of max tilt
const VERTICAL_SHARE = 0.4;

/**
 * @param {number} dx horizontal displacement over the window, in px
 * @param {number} dy vertical displacement over the window, in px
 * @param {number} windowMs time window the displacement was measured over
 * @param {number} amount user strength multiplier (0 disables)
 * @returns {number} rotation in radians (positive = clockwise)
 */
export function computeCursorSwayRotation(dx, dy, windowMs, amount = 1) {
    if (!(amount > 0)) return 0;
    const dist = Math.hypot(dx, dy);
    if (!Number.isFinite(dist) || dist < 0.01) return 0;
    const seconds = Math.min(0.08, Math.max(0.001, (windowMs || 16) / 1000));
    const speed = dist / seconds;
    const strength = Math.tanh(speed / (SPEED_FOR_HALF_TILT * 2));
    const lean = (dx + dy * VERTICAL_SHARE) / dist;
    return Math.max(-MAX_TILT, Math.min(MAX_TILT, lean * strength * MAX_TILT * amount));
}
