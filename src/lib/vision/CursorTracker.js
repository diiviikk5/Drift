/**
 * CursorTracker — follows the system pointer through captured screen frames.
 *
 * Works on full-resolution luma (Uint8Array, one byte per pixel):
 *
 *  1. Still check: if nothing changed under the pointer since the last frame,
 *     it's where it was (the common case, and nearly free).
 *  2. Track: search a window around where the pointer should be by now
 *     (last position + velocity), with the templates of the scale it was
 *     last seen at.
 *  3. Re-acquire: search the parts of the frame that changed (a pointer that
 *     jumped leaves changes at both ends), then, if still unknown, sweep the
 *     whole frame a band of rows at a time across frames.
 *
 * Matching uses class templates (cursorTemplates.js) until the real pointer
 * has been seen over a few different backgrounds; then its exact pixels are
 * learned (pixels that never change while the backdrop does) and matched by
 * absolute difference, which is far more selective and also yields the exact
 * mask the cursor eraser needs.
 */

import { templateSet, SEARCH_SCALES } from './cursorTemplates.js';

const PROBES = 3;               // probe pixels per class for early rejection
const PROBE_GAP = 40;           // probes must separate interior from rim by this much
const MIN_CONTRAST = 70;        // interior vs rim mean difference
const MAX_CLASS_SCORE = 0.32;   // (sd_in + sd_rim) / contrast
const MAX_SPRITE_MAD = 16;      // learned sprite mean absolute difference
const STILL_DIFF = 4;           // luma change that counts as "something moved"
const LEARN_PATCHES = 10;       // patches over distinct backgrounds before learning
const SWEEP_ROWS = 40;
const SEARCH_BUDGET_MS = 18;    // per frame for re-acquiring a lost pointer
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());          // full-frame bootstrap rows per frame

function sortedProbeIndices(n, k) {
    const out = [];
    for (let i = 0; i < k; i++) out.push(Math.min(n - 1, Math.floor(((i + 0.5) / k) * n)));
    return out;
}

/** Template prepared for one frame width (linear offsets). */
function prepare(tpl, width) {
    const inner = new Int32Array(tpl.innerX.length);
    for (let i = 0; i < inner.length; i++) inner[i] = tpl.innerY[i] * width + tpl.innerX[i];
    const rim = new Int32Array(tpl.rimX.length);
    for (let i = 0; i < rim.length; i++) rim[i] = tpl.rimY[i] * width + tpl.rimX[i];
    // Bounding box relative to the hotspot.
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    for (const [xs, ys] of [[tpl.innerX, tpl.innerY], [tpl.rimX, tpl.rimY]]) {
        for (let i = 0; i < xs.length; i++) {
            if (xs[i] < x0) x0 = xs[i]; if (xs[i] > x1) x1 = xs[i];
            if (ys[i] < y0) y0 = ys[i]; if (ys[i] > y1) y1 = ys[i];
        }
    }
    return {
        tpl,
        key: `${tpl.id}@${tpl.scale}`,
        inner,
        rim,
        pIn: sortedProbeIndices(inner.length, PROBES).map(i => inner[i]),
        pRim: sortedProbeIndices(rim.length, PROBES).map(i => rim[i]),
        box: { x0, y0, x1, y1 },
        sprite: null, // learned { off: Int32Array, val: Uint8Array, dx, dy }
    };
}

/**
 * Class-template score at hotspot (px, py), or Infinity. Lower is better.
 * The template must lie fully inside the frame (callers clip the search).
 */
function classScore(L, W, P, px, py) {
    const base = py * W + px;
    // Cheapest test first: one interior and one rim pixel must differ.
    const q = L[base + P.pIn[1]] - L[base + P.pRim[1]];
    if (q < PROBE_GAP && q > -PROBE_GAP) return Infinity;
    // Probes: every interior probe on one side of every rim probe.
    let inMin = 255, inMax = 0, rimMin = 255, rimMax = 0;
    for (let i = 0; i < P.pIn.length; i++) {
        const v = L[base + P.pIn[i]];
        if (v < inMin) inMin = v; if (v > inMax) inMax = v;
    }
    for (let i = 0; i < P.pRim.length; i++) {
        const v = L[base + P.pRim[i]];
        if (v < rimMin) rimMin = v; if (v > rimMax) rimMax = v;
    }
    if (!(inMin - rimMax >= PROBE_GAP || rimMin - inMax >= PROBE_GAP)) return Infinity;

    let sIn = 0, ssIn = 0;
    const inner = P.inner;
    for (let i = 0; i < inner.length; i++) {
        const v = L[base + inner[i]];
        sIn += v; ssIn += v * v;
    }
    let sRim = 0, ssRim = 0;
    const rim = P.rim;
    for (let i = 0; i < rim.length; i++) {
        const v = L[base + rim[i]];
        sRim += v; ssRim += v * v;
    }
    const nI = inner.length, nR = rim.length;
    const mIn = sIn / nI, mRim = sRim / nR;
    const contrast = Math.abs(mIn - mRim);
    if (contrast < MIN_CONTRAST) return Infinity;
    const sdIn = Math.sqrt(Math.max(0, ssIn / nI - mIn * mIn));
    const sdRim = Math.sqrt(Math.max(0, ssRim / nR - mRim * mRim));
    const score = (sdIn + sdRim) / contrast;
    return score <= MAX_CLASS_SCORE ? score : Infinity;
}

/** Learned-sprite score (normalized like classScore), or Infinity. */
function spriteScore(L, W, S, px, py) {
    const base = py * W + px;
    const off = S.off, val = S.val, n = off.length;
    // Early exit on a handful of strided pixels.
    let quick = 0;
    const step = Math.max(1, Math.floor(n / 6));
    let q = 0;
    for (let i = 0; i < n; i += step) { quick += Math.abs(L[base + off[i]] - val[i]); q++; }
    if (quick / q > MAX_SPRITE_MAD * 2.5) return Infinity;
    let sad = 0;
    const limit = MAX_SPRITE_MAD * n;
    for (let i = 0; i < n; i++) {
        sad += Math.abs(L[base + off[i]] - val[i]);
        if (sad > limit) return Infinity;
    }
    return (sad / n) / 255;
}

/**
 * Scores for a pointer partly outside the frame: only the visible pixels
 * count, and enough of the pointer must be visible to be sure.
 */
function visibleOffsets(W, H, px, py, xs, ys) {
    const out = [];
    for (let i = 0; i < xs.length; i++) {
        const x = px + xs[i], y = py + ys[i];
        if (x >= 0 && y >= 0 && x < W && y < H) out.push(y * W + x);
    }
    return out;
}

function classScoreClipped(L, W, H, P, px, py) {
    const t = P.tpl;
    const inner = visibleOffsets(W, H, px, py, t.innerX, t.innerY);
    const rim = visibleOffsets(W, H, px, py, t.rimX, t.rimY);
    if (inner.length < t.innerX.length * 0.4 || rim.length < t.rimX.length * 0.4 || inner.length < 6 || rim.length < 6) return Infinity;
    let sIn = 0, ssIn = 0, sRim = 0, ssRim = 0;
    for (const o of inner) { const v = L[o]; sIn += v; ssIn += v * v; }
    for (const o of rim) { const v = L[o]; sRim += v; ssRim += v * v; }
    const mIn = sIn / inner.length, mRim = sRim / rim.length;
    const contrast = Math.abs(mIn - mRim);
    if (contrast < MIN_CONTRAST) return Infinity;
    const sdIn = Math.sqrt(Math.max(0, ssIn / inner.length - mIn * mIn));
    const sdRim = Math.sqrt(Math.max(0, ssRim / rim.length - mRim * mRim));
    // Less evidence, stricter bar.
    const score = (sdIn + sdRim) / contrast;
    return score <= MAX_CLASS_SCORE * 0.7 ? score : Infinity;
}

function spriteScoreClipped(L, W, H, S, px, py) {
    let sad = 0, n = 0;
    for (let i = 0; i < S.mask.length; i++) {
        const x = px + S.mask[i][0], y = py + S.mask[i][1];
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        sad += Math.abs(L[y * W + x] - S.val[i]);
        n++;
    }
    if (n < Math.max(8, S.mask.length * 0.35)) return Infinity;
    const mad = sad / n;
    return mad <= MAX_SPRITE_MAD * 0.8 ? mad / 255 : Infinity;
}

export class CursorTracker {
    constructor({ width, height, scales = SEARCH_SCALES } = {}) {
        this.width = width;
        this.height = height;
        this.all = templateSet(undefined, scales).map(t => prepare(t, width));
        this.locked = null;       // { scale, family: 'win' | 'mac' } once identified
        this.last = null;         // { x, y, t, key }
        this.prevLast = null;
        this.lostFrames = 0;
        this.sweepRow = 0;
        this.sweepRows = SWEEP_ROWS;
        this.learners = new Map(); // key -> { patches: [], positions: [] }
    }

    /** Templates to try: the identified scale (all shapes) or everything. */
    _candidates() {
        if (!this.locked) return this.all;
        if (!this._lockedSet || this._lockedSet.scale !== this.locked.scale || this._lockedSet.family !== this.locked.family) {
            const list = this.all.filter(P => P.tpl.scale === this.locked.scale
                && (P.tpl.shape !== 'arrow' || P.tpl.id.endsWith(this.locked.family)));
            // The shape seen last goes first.
            this._lockedSet = { scale: this.locked.scale, family: this.locked.family, list };
        }
        return this._lockedSet.list;
    }

    _score(L, P, x, y) {
        return P.sprite ? spriteScore(L, this.width, P.sprite, x, y) : classScore(L, this.width, P, x, y);
    }

    /**
     * Best match with hotspot inside [x0..x1] x [y0..y1] (clipped so templates fit).
     * @returns {{x, y, score, P}|null}
     */
    _search(L, cands, x0, y0, x1, y1, best = null, deadline = Infinity) {
        const W = this.width, H = this.height;
        // Hotspots stay on the frame; the pointer body may hang off its edges.
        x0 = Math.max(0, x0); y0 = Math.max(0, y0);
        x1 = Math.min(W - 1, x1); y1 = Math.min(H - 1, y1);
        for (const P of cands) {
            const b = P.box;
            // Positions where the whole template fits use the fast path.
            const ax = Math.max(x0, -b.x0), ay = Math.max(y0, -b.y0);
            const bx = Math.min(x1, W - 1 - b.x1), by = Math.min(y1, H - 1 - b.y1);
            for (let y = y0; y <= y1; y++) {
                // Busy frames (everything moving) must not stall the recorder.
                if ((y & 7) === 0 && now() > deadline) { this.overBudget = true; return best; }
                const rowFits = y >= ay && y <= by;
                for (let x = x0; x <= x1; x++) {
                    let s;
                    if (rowFits && x >= ax && x <= bx) s = this._score(L, P, x, y);
                    else s = P.sprite ? spriteScoreClipped(L, W, H, P.sprite, x, y) : classScoreClipped(L, W, H, P, x, y);
                    if (s < Infinity && (!best || s < best.score)) best = { x, y, score: s, P };
                }
            }
        }
        return best;
    }

    /**
     * Arrow-only search for the bootstrap sweep. Every arrow template (any
     * scale from 1x to 3x, Windows or macOS) has rim at (0,3) and (0,8) and
     * interior at (3,9) from the hotspot, so three pixel reads rule out almost
     * every position before any template is scored.
     */
    _sweepSearch(L, cands, y0, y1, deadline) {
        const W = this.width, H = this.height;
        let best = null;
        const yEnd = Math.min(y1, H - 10);
        for (let y = y0; y <= yEnd; y++) {
            if ((y & 3) === 0 && now() > deadline) { this.overBudget = true; return best; }
            const row = y * W;
            for (let x = 0; x < W - 4; x++) {
                const p = row + x;
                const r1 = L[p + 3 * W], r2 = L[p + 8 * W];
                const dr = r1 - r2;
                if (dr > 30 || dr < -30) continue;
                const di = L[p + 9 * W + 3] - ((r1 + r2) >> 1);
                if (di < 60 && di > -60) continue;
                for (const P of cands) {
                    const b = P.box;
                    let sc;
                    if (x + b.x1 < W && y + b.y1 < H && x + b.x0 >= 0 && y + b.y0 >= 0) sc = this._score(L, P, x, y);
                    else sc = P.sprite ? spriteScoreClipped(L, W, H, P.sprite, x, y) : classScoreClipped(L, W, H, P, x, y);
                    if (sc < Infinity && (!best || sc < best.score)) best = { x, y, score: sc, P };
                }
            }
        }
        return best;
    }

    /** Did anything change under the pointer's footprint? */
    _changedAt(L, prevL, x, y, P) {
        if (!prevL) return true;
        const W = this.width, H = this.height;
        const b = P.box;
        const ax = Math.max(0, x + b.x0 - 1), ay = Math.max(0, y + b.y0 - 1);
        const bx = Math.min(W - 1, x + b.x1 + 1), by = Math.min(H - 1, y + b.y1 + 1);
        for (let yy = ay; yy <= by; yy++) {
            const row = yy * W;
            for (let xx = ax; xx <= bx; xx++) {
                const d = L[row + xx] - prevL[row + xx];
                if (d > STILL_DIFF || d < -STILL_DIFF) return true;
            }
        }
        return false;
    }

    _byKey(key) {
        return this.all.find(P => P.key === key) || null;
    }

    /**
     * Process one frame.
     * @param {Uint8Array} L luma of this frame
     * @param {Uint8Array|null} prevL luma of the previous frame
     * @param {number} t time in ms
     * @param {Array<{x0,y0,x1,y1}>} changed changed rectangles (pixels), nearest first
     * @returns {{found:boolean, x?:number, y?:number, shape?:string, key?:string, score?:number, method?:string}}
     */
    update(L, prevL, t, changed = []) {
        const W = this.width, H = this.height;
        const last = this.last;
        let hit = null;
        let method = '';

        if (last) {
            const P = this._byKey(last.key);
            // 1. Still: nothing changed under it.
            if (P && this.lostFrames === 0 && !this._changedAt(L, prevL, last.x, last.y, P)) {
                this._remember(last.x, last.y, t, P, 'still', L);
                return { found: true, x: last.x, y: last.y, shape: P.tpl.shape, key: P.key, score: last.score, method: 'still' };
            }
            // 2. Track around the predicted position.
            let vx = 0, vy = 0;
            const prev = this.prevLast;
            if (prev && last.t > prev.t && last.t - prev.t < 200) {
                vx = (last.x - prev.x) / (last.t - prev.t);
                vy = (last.y - prev.y) / (last.t - prev.t);
            }
            const dt = Math.min(120, Math.max(0, t - last.t));
            const px = Math.round(last.x + vx * dt);
            const py = Math.round(last.y + vy * dt);
            const speed = Math.hypot(vx, vy) * dt;
            const r = Math.round(Math.min(200, 18 + speed * 1.2 + this.lostFrames * 16));
            const cands = this._candidates();
            // Nearby first (cheap); widen only when that fails.
            hit = this._search(L, cands, px - 10, py - 10, px + 10, py + 10);
            // After a few misses the pointer is hidden or off the capture; it can
            // only come back through a change, so stop sweeping the old area.
            if (!hit && this.lostFrames <= 3) hit = this._search(L, cands, Math.min(px, last.x) - r, Math.min(py, last.y) - r, Math.max(px, last.x) + r, Math.max(py, last.y) + r);
            if (hit) method = 'track';
        }

        const deadline = now() + SEARCH_BUDGET_MS;
        this.overBudget = false;
        // 3a. Re-acquire in changed areas.
        if (!hit && changed.length) {
            const cands = this._candidates();
            let budget = this.locked ? 400_000 : 120_000; // hotspot positions
            for (const c of changed) {
                const area = (c.x1 - c.x0 + 1) * (c.y1 - c.y0 + 1);
                if (area > budget) continue;
                budget -= area;
                const m = this._search(L, cands, c.x0, c.y0, c.x1, c.y1, null, deadline);
                if (m && (!hit || m.score < hit.score)) hit = m;
                if ((hit && hit.score < 0.12) || this.overBudget) break;
            }
            if (hit) method = 'acquire';
        }

        // 3b. Bootstrap sweep while the pointer has never been seen.
        if (!hit && !this.last && !this.overBudget) {
            const y0 = this.sweepRow;
            const y1 = Math.min(H - 1, y0 + this.sweepRows - 1);
            // Pointers start out as arrows; other shapes are found once it moves.
            if (!this._sweepSet) this._sweepSet = this.all.filter(P => P.tpl.shape === 'arrow');
            hit = this._sweepSearch(L, this._sweepSet, y0, y1, deadline);
            if (this.overBudget && !hit) {
                // Busy picture: sweep a thinner band next time.
                this.sweepRows = Math.max(4, this.sweepRows >> 1);
            } else {
                this.sweepRow = y1 + 1 >= H ? 0 : y1 + 1;
                this.sweepRows = Math.min(SWEEP_ROWS * 2, Math.ceil(this.sweepRows * 1.25));
            }
            if (hit) method = 'sweep';
        }

        if (!hit) {
            this.lostFrames++;
            if (this.lostFrames > 45) { this.last = null; this.prevLast = null; }
            return { found: false };
        }

        this.lostFrames = 0;
        if (!this.locked) {
            const id = hit.P.tpl.id;
            this.locked = { scale: hit.P.tpl.scale, family: id.endsWith('mac') ? 'mac' : 'win' };
        } else if (hit.P.tpl.shape === 'arrow') {
            this.locked.family = hit.P.tpl.id.endsWith('mac') ? 'mac' : 'win';
        }
        this._remember(hit.x, hit.y, t, hit.P, method, L);
        return { found: true, x: hit.x, y: hit.y, shape: hit.P.tpl.shape, key: hit.P.key, score: hit.score, method };
    }

    _remember(x, y, t, P, method, L) {
        if (method !== 'still') {
            this.prevLast = this.last;
            this.last = { x, y, t, key: P.key, score: this.last?.score };
            if (!P.sprite) this._learn(L, P, x, y);
        } else {
            // Holding still: velocity decays to zero.
            this.prevLast = { ...this.last, t: this.last.t };
            this.last = { ...this.last, t };
        }
    }

    /**
     * Learn the pointer's exact pixels from patches over varied backgrounds:
     * pointer pixels stay constant while the backdrop changes.
     */
    _learn(L, P, x, y) {
        const W = this.width;
        const b = P.box;
        const m = 2;
        const bw = b.x1 - b.x0 + 1 + 2 * m, bh = b.y1 - b.y0 + 1 + 2 * m;
        const ox = x + b.x0 - m, oy = y + b.y0 - m;
        if (ox < 0 || oy < 0 || ox + bw > W || oy + bh > this.height) return;
        let st = this.learners.get(P.key);
        if (!st) { st = { patches: [], pos: [] }; this.learners.set(P.key, st); }
        const lastPos = st.pos[st.pos.length - 1];
        if (lastPos && Math.hypot(lastPos[0] - x, lastPos[1] - y) < 24) return;
        const patch = new Uint8Array(bw * bh);
        for (let yy = 0; yy < bh; yy++) {
            patch.set(L.subarray((oy + yy) * W + ox, (oy + yy) * W + ox + bw), yy * bw);
        }
        st.patches.push(patch);
        st.pos.push([x, y]);
        if (st.patches.length > 24) { st.patches.shift(); st.pos.shift(); }
        if (st.patches.length < LEARN_PATCHES) return;

        const n = st.patches.length;
        const mean = new Float32Array(bw * bh);
        const sd = new Float32Array(bw * bh);
        for (let i = 0; i < bw * bh; i++) {
            let s = 0, ss = 0;
            for (const p of st.patches) { s += p[i]; ss += p[i] * p[i]; }
            const mu = s / n;
            mean[i] = mu;
            sd[i] = Math.sqrt(Math.max(0, ss / n - mu * mu));
        }
        // The backdrop must actually have varied: most pixels outside the
        // template need to change across patches, or constant pixels mean nothing.
        const inShape = new Uint8Array(bw * bh);
        for (const [xs, ys] of [[P.tpl.innerX, P.tpl.innerY], [P.tpl.rimX, P.tpl.rimY]]) {
            for (let i = 0; i < xs.length; i++) inShape[(ys[i] - b.y0 + m) * bw + (xs[i] - b.x0 + m)] = 1;
        }
        let outside = 0, varied = 0;
        for (let yy = 0; yy < bh; yy++) {
            for (let xx = 0; xx < bw; xx++) {
                const i = yy * bw + xx;
                if (inShape[i]) continue;
                // Only the outer ring: definitely not pointer.
                if (xx > 0 && yy > 0 && xx < bw - 1 && yy < bh - 1) continue;
                outside++;
                if (sd[i] > 12) varied++;
            }
        }
        if (outside === 0 || varied / outside < 0.5) return;

        // Pointer pixels: on the template footprint and steady across patches.
        // (Pixels beside it can look steady just because the backdrops were
        // similar there; anti-aliased edges and shadows vary anyway.)
        const near = inShape;
        const off = [], val = [];
        let shapeKept = 0, shapeTotal = 0;
        for (let yy = 0; yy < bh; yy++) {
            for (let xx = 0; xx < bw; xx++) {
                const i = yy * bw + xx;
                if (inShape[i]) shapeTotal++;
                if (!near[i] || sd[i] > 5) continue;
                off.push((yy + oy - y) * W + (xx + ox - x));
                val.push(Math.round(mean[i]));
                if (inShape[i]) shapeKept++;
            }
        }
        // Sanity: the learned sprite should be essentially the template.
        if (shapeTotal === 0 || shapeKept / shapeTotal < 0.85) return;
        P.sprite = {
            off: Int32Array.from(off),
            val: Uint8Array.from(val),
            // offsets relative to the hotspot (also the eraser's mask) in patch coordinates relative to the hotspot, for the eraser
            mask: this._maskFromOffsets(off),

        };
        this.learners.delete(P.key);
    }

    _maskFromOffsets(off) {
        const W = this.width;
        return off.map(o => {
            let dy = Math.round(o / W);
            let dx = o - dy * W;
            if (dx > W / 2) { dx -= W; dy += 1; } else if (dx < -W / 2) { dx += W; dy -= 1; }
            return [dx, dy];
        });
    }

    /** Pointer footprints for the eraser: { key: { shape, scale, points: [[dx,dy]...], learned } }. */
    sprites() {
        const out = {};
        for (const P of this.all) {
            if (P.sprite) {
                out[P.key] = { shape: P.tpl.shape, scale: P.tpl.scale, learned: true, points: P.sprite.mask };
            }
        }
        return out;
    }
}

/** Footprint points of a template (interior + rim), for the eraser when nothing was learned. */
export function templateFootprint(key) {
    const [id, s] = key.split('@');
    const t = templateSet([id], [Number(s)])[0];
    const pts = [];
    for (let i = 0; i < t.innerX.length; i++) pts.push([t.innerX[i], t.innerY[i]]);
    for (let i = 0; i < t.rimX.length; i++) pts.push([t.rimX[i], t.rimY[i]]);
    return pts;
}
