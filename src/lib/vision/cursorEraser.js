/**
 * cursorEraser — removes the system pointer baked into a web recording.
 *
 * Browser screen capture draws the real pointer into the video. Drift draws
 * its own smoothed, scalable pointer, so the baked one has to go or the video
 * shows two. The ScreenAnalyzer recorded where the pointer was in every frame
 * and its exact footprint, so each frame is cleaned before compositing: the
 * footprint (slightly grown) is filled from its surroundings, peeling inwards
 * one pixel ring at a time, then softened. The pointer is ~12 px across, so
 * the fill is short-range and sits under Drift's own pointer anyway.
 */

const sampleTime = (r) => r.t;

/** Index of the last raw entry at or before t (ms), or -1. */
export function rawIndexAt(raw, t) {
    let lo = 0, hi = raw.length - 1, ans = -1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (sampleTime(raw[mid]) <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1;
    }
    return ans;
}

/**
 * Pointer placements to erase at time t: the one showing then, and its
 * neighbours within `slackMs` (frame timing between the analysis and the
 * decoded video can differ by a frame).
 * @returns {Array<{x:number, y:number, key:string}>} analysis pixels
 */
export function placementsAt(raw, t, slackMs = 34) {
    if (!raw || !raw.length) return [];
    const out = [];
    const i = rawIndexAt(raw, t + slackMs);
    for (let k = i; k >= 0; k--) {
        const r = raw[k];
        if (!r.hidden) out.push(r);
        if (r.t <= t - slackMs) break;
    }
    return out;
}

/**
 * Inpaint masked pixels of an RGBA patch from their surroundings.
 * @param {Uint8ClampedArray} px RGBA, w*h*4 (modified in place)
 * @param {Uint8Array} mask 1 = fill
 */
export function inpaint(px, w, h, mask) {
    const m = new Uint8Array(mask); // working copy: 1 = still unknown
    const filled = new Uint8Array(mask);
    let remaining = 0;
    for (let i = 0; i < m.length; i++) remaining += m[i];
    const ring = [];
    let guard = 0;
    while (remaining > 0 && guard++ < 64) {
        ring.length = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = y * w + x;
                if (!m[i]) continue;
                let r = 0, g = 0, b = 0, wsum = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    const yy = y + dy;
                    if (yy < 0 || yy >= h) continue;
                    for (let dx = -1; dx <= 1; dx++) {
                        if (!dx && !dy) continue;
                        const xx = x + dx;
                        if (xx < 0 || xx >= w) continue;
                        const j = yy * w + xx;
                        if (m[j]) continue;
                        const wt = dx && dy ? 0.7 : 1;
                        r += px[j * 4] * wt; g += px[j * 4 + 1] * wt; b += px[j * 4 + 2] * wt;
                        wsum += wt;
                    }
                }
                if (wsum > 0) ring.push(i, r / wsum, g / wsum, b / wsum);
            }
        }
        if (!ring.length) break; // nothing known around (whole patch masked)
        for (let k = 0; k < ring.length; k += 4) {
            const i = ring[k];
            px[i * 4] = ring[k + 1]; px[i * 4 + 1] = ring[k + 2]; px[i * 4 + 2] = ring[k + 3];
            m[i] = 0;
            remaining--;
        }
    }
    // Soften the fill (it streaks along the peel direction).
    const copy = new Uint8ClampedArray(px);
    for (let pass = 0; pass < 2; pass++) {
        const src = pass === 0 ? copy : new Uint8ClampedArray(px);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = y * w + x;
                if (!filled[i]) continue;
                let r = 0, g = 0, b = 0, n = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    const yy = y + dy;
                    if (yy < 0 || yy >= h) continue;
                    for (let dx = -1; dx <= 1; dx++) {
                        const xx = x + dx;
                        if (xx < 0 || xx >= w) continue;
                        const j = (yy * w + xx) * 4;
                        r += src[j]; g += src[j + 1]; b += src[j + 2]; n++;
                    }
                }
                px[i * 4] = r / n; px[i * 4 + 1] = g / n; px[i * 4 + 2] = b / n;
            }
        }
    }
    return px;
}

/**
 * Mask for one placement inside a patch.
 * @param {Array<[number, number]>} points footprint offsets (analysis px, from the hotspot)
 * @param {number} k video px per analysis px
 * @param {number} ox, oy patch origin in video px
 * @param {number} hx, hy hotspot in video px
 */
export function stampMask(mask, w, h, points, k, ox, oy, hx, hy, grow = 2, shadow = 0) {
    const g = Math.max(1, Math.round(grow * Math.max(1, k)));
    const cell = Math.max(1, Math.ceil(k));
    // System pointers often cast a soft shadow down and to the right; it isn't
    // part of the learned sprite (it changes with the backdrop), so cover it too.
    const sh = Math.round(shadow * Math.max(1, k));
    for (const [dx, dy] of points) {
        const bx = Math.floor(hx + dx * k) - ox;
        const by = Math.floor(hy + dy * k) - oy;
        for (let y = by - g; y < by + cell + g + sh; y++) {
            if (y < 0 || y >= h) continue;
            for (let x = bx - g; x < bx + cell + g + sh; x++) {
                if (x < 0 || x >= w) continue;
                mask[y * w + x] = 1;
            }
        }
    }
}

function footprintBox(points) {
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    for (const [x, y] of points) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    return { x0, y0, x1, y1 };
}

/**
 * Canvas-backed eraser for preview and export.
 * @param {{width, height, raw, sprites}} pointer ScreenAnalyzer output
 */
export function createCursorEraser(pointer) {
    if (!pointer || !Array.isArray(pointer.raw) || !pointer.raw.length || !pointer.sprites) return null;
    const raw = pointer.raw.slice().sort((a, b) => a.t - b.t);
    const boxes = {};
    for (const [key, s] of Object.entries(pointer.sprites)) boxes[key] = footprintBox(s.points || []);
    let work = null, wctx = null, patch = null, pctx = null;

    const make = (w, h) => {
        if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        return c;
    };

    return {
        /**
         * The frame with the baked pointer removed (a canvas), or the source
         * itself when there's nothing to remove.
         * @param {CanvasImageSource} src video frame
         * @param {number} tMs time on the recording timeline
         */
        clean(src, tMs) {
            const vw = src.videoWidth || src.displayWidth || src.width;
            const vh = src.videoHeight || src.displayHeight || src.height;
            if (!vw || !vh) return src;
            const places = placementsAt(raw, tMs);
            if (!places.length) return src;
            const k = vw / (pointer.width || vw);
            if (!work || work.width !== vw || work.height !== vh) {
                work = make(vw, vh);
                wctx = work.getContext('2d', { alpha: false });
            }
            wctx.drawImage(src, 0, 0, vw, vh);
            for (const p of places) {
                const sprite = pointer.sprites[p.key];
                if (!sprite) continue;
                const b = boxes[p.key];
                const pad = Math.ceil(6 * Math.max(1, k));
                const hx = p.x * k, hy = p.y * k;
                const ox = Math.max(0, Math.floor(hx + b.x0 * k) - pad);
                const oy = Math.max(0, Math.floor(hy + b.y0 * k) - pad);
                const ex = Math.min(vw, Math.ceil(hx + (b.x1 + 1) * k) + pad);
                const ey = Math.min(vh, Math.ceil(hy + (b.y1 + 1) * k) + pad);
                const pw = ex - ox, ph = ey - oy;
                if (pw <= 0 || ph <= 0) continue;
                if (!patch || patch.width < pw || patch.height < ph) {
                    patch = make(Math.max(pw, 64), Math.max(ph, 96));
                    pctx = patch.getContext('2d', { willReadFrequently: true });
                }
                // Read back through the small canvas: reading the big one makes
                // browsers move it off the GPU.
                pctx.drawImage(work, ox, oy, pw, ph, 0, 0, pw, ph);
                const img = pctx.getImageData(0, 0, pw, ph);
                const mask = new Uint8Array(pw * ph);
                stampMask(mask, pw, ph, sprite.points, k, ox, oy, hx, hy, sprite.learned ? 1.5 : 2.5, 2);
                inpaint(img.data, pw, ph, mask);
                pctx.putImageData(img, 0, 0);
                wctx.drawImage(patch, 0, 0, pw, ph, ox, oy, pw, ph);
            }
            return work;
        },
    };
}
