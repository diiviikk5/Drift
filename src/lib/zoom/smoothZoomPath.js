/**
 * smoothZoomPath — optimal combined zoom-and-pan between two framings.
 *
 * Implements "Smooth and efficient zooming and panning" (J. J. van Wijk and
 * W. A. A. Nuij, IEEE InfoVis 2003). Moving the camera along this path keeps
 * the *perceived* speed constant: a far pan eases out a little, travels, and
 * settles back in, instead of whipping the content across a zoomed frame.
 *
 * Framings are (center, width) where width = 1 / scale (fraction of the
 * source visible). Path length S is in perceptual units, so it doubles as
 * the "how big does this move feel" measure used to time camera moves.
 */

const EPS = 1e-6;

/**
 * @param {{x:number,y:number,w:number}} a start framing
 * @param {{x:number,y:number,w:number}} b end framing
 * @param {number} rho zoom/pan trade-off (higher = more willing to zoom out while panning)
 * @returns {{length:number, at:(s:number)=>{x:number,y:number,w:number}}}
 */
export function smoothZoomPath(a, b, rho = 1.2) {
    const w0 = Math.max(EPS, a.w);
    const w1 = Math.max(EPS, b.w);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const u1 = Math.hypot(dx, dy);
    const r2 = rho * rho;

    if (u1 < 1e-5) {
        // Pure zoom: exponential in width so the zoom rate feels even.
        const k = Math.log(w1 / w0);
        const length = Math.abs(k) / rho;
        return {
            length,
            at(s) {
                const f = length > EPS ? Math.min(1, Math.max(0, s / length)) : 1;
                return { x: a.x + dx * f, y: a.y + dy * f, w: w0 * Math.exp(k * f) };
            },
        };
    }

    const b0 = (w1 * w1 - w0 * w0 + r2 * r2 * u1 * u1) / (2 * w0 * r2 * u1);
    const b1 = (w1 * w1 - w0 * w0 - r2 * r2 * u1 * u1) / (2 * w1 * r2 * u1);
    const r0 = Math.log(-b0 + Math.sqrt(b0 * b0 + 1));
    const r1 = Math.log(-b1 + Math.sqrt(b1 * b1 + 1));
    const length = (r1 - r0) / rho;
    const coshR0 = Math.cosh(r0);
    const sinhR0 = Math.sinh(r0);

    return {
        length,
        at(s) {
            const t = Math.min(length, Math.max(0, s));
            const u = (w0 / r2) * (coshR0 * Math.tanh(rho * t + r0) - sinhR0);
            const f = Math.min(1, Math.max(0, u / u1));
            return { x: a.x + dx * f, y: a.y + dy * f, w: (w0 * coshR0) / Math.cosh(rho * t + r0) };
        },
    };
}

/** Minimum-jerk easing (zero velocity and acceleration at both ends). */
export function minimumJerk(u) {
    const t = u <= 0 ? 0 : u >= 1 ? 1 : u;
    return t * t * t * (10 + t * (-15 + 6 * t));
}

/**
 * Join paths end to end into one path parameterized by total length, so a
 * single easing runs across all of them (e.g. out to the full frame and back
 * in, without stopping at the top).
 */
export function chainPaths(...paths) {
    const lengths = paths.map(p => p.length);
    const length = lengths.reduce((a, b) => a + b, 0);
    return {
        length,
        at(s) {
            let rest = Math.min(length, Math.max(0, s));
            for (let i = 0; i < paths.length; i++) {
                if (rest <= lengths[i] || i === paths.length - 1) return paths[i].at(Math.min(rest, lengths[i]));
                rest -= lengths[i];
            }
            return paths[paths.length - 1].at(lengths[lengths.length - 1]);
        },
    };
}
