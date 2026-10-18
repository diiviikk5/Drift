/**
 * ScreenAnalyzer — session telemetry recovered from the captured pixels.
 *
 * The desktop recorder gets the pointer, clicks, keys, caret and scrolling
 * from the OS. A web page only gets the picture, so this reads the same
 * signals back out of it, frame by frame:
 *
 *  - pointer position and shape: CursorTracker
 *  - scrolling: a strip of the frame reduced to one brightness value per row;
 *    a vertical offset that explains the change means the page scrolled
 *    (the same method as the desktop's scroll_detect.rs)
 *  - clicks: the pointer settles, then the UI responds next to it (a button
 *    reacts, a menu opens, the page changes) after a human reaction time and
 *    not as a continuation of the hover effect it got on arrival
 *  - typing and the caret: small glyph-sized changes marching along a line
 *    while you type; a thin bar toggling on its own is the blinking caret
 *
 * Nothing is uploaded and no keys are known: like the desktop recorder,
 * typing is kept as anonymous timing plus where it happened.
 *
 * Output is in Drift's telemetry format (see toTelemetry()).
 */

import { CursorTracker, templateFootprint } from './CursorTracker.js';

const TILE = 16;
const TILE_STEP = 4;           // sampled pixels per tile axis step
const TILE_DIFF = 10;          // luma difference that counts as changed
const ANIMATED_EMA = 0.08;
const ANIMATED_LEVEL = 0.45;   // tiles changing this often are video/animation
const SCROLL_ROW_STEP = 2;
const SCROLL_COL_STEP = 4;
const CLICK_RADIUS = 150;      // px around the pointer where a response counts
const CLICK_MIN_DELAY = 110;   // ms after settling before a response can be a click
const CLICK_QUIET = 60;        // ms without nearby change before the response
const CLICK_GAP = 380;         // ms between inferred clicks
const SETTLE_RADIUS = 4;       // px the pointer may drift and still be settled
const TYPE_GAP = 1500;         // ms between glyphs of one typing stretch
const KEY_THROTTLE = 110;      // ms, like the desktop recorder's typing samples
const REVERT_WINDOW = 700;     // ms after the pointer leaves in which a hover effect undoes itself
const REVERT_MAD = 6;          // mean luma difference that still counts as "back as it was"

export function lumaFromRGBA(rgba, out) {
    const n = out.length;
    for (let i = 0, j = 0; j < n; i += 4, j++) {
        out[j] = (rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29) >> 8;
    }
    return out;
}

function rowProfile(L, W, H, x0, x1, y0, y1) {
    const rows = Math.floor((y1 - y0) / SCROLL_ROW_STEP);
    const out = new Float32Array(rows);
    for (let r = 0; r < rows; r++) {
        const row = (y0 + r * SCROLL_ROW_STEP) * W;
        let s = 0, n = 0;
        for (let x = x0; x < x1; x += SCROLL_COL_STEP) { s += L[row + x]; n++; }
        out[r] = n ? s / n : 0;
    }
    return out;
}

function meanAbsDiff(a, b, shift) {
    const n = a.length;
    const start = shift >= 0 ? 0 : -shift;
    const end = shift >= 0 ? n - shift : n;
    if (end - start < 8) return Infinity;
    let s = 0;
    for (let i = start; i < end; i++) s += Math.abs(a[i + shift] - b[i]);
    return s / (end - start);
}

/**
 * Vertical content shift in pixels between two row profiles (positive: the
 * content moved up, i.e. scrolled down), or null when the change isn't a scroll.
 */
export function detectShift(prev, cur) {
    if (!prev || prev.length !== cur.length || cur.length < 32) return null;
    let mean = 0;
    for (const v of cur) mean += v;
    mean /= cur.length;
    let v2 = 0;
    for (const v of cur) v2 += (v - mean) * (v - mean);
    if (v2 / cur.length < 9) return null; // flat strip can't show a scroll
    const still = meanAbsDiff(prev, cur, 0);
    if (still < 1) return null;
    const maxShift = Math.floor(cur.length / 3);
    let best = 0, bestE = still;
    for (let s = -maxShift; s <= maxShift; s++) {
        if (s === 0) continue;
        const e = meanAbsDiff(prev, cur, s);
        if (e < bestE) { best = s; bestE = e; }
    }
    if (best !== 0 && Math.abs(best) >= 2 && bestE < still * 0.5 && bestE < 8) return best * SCROLL_ROW_STEP;
    return null;
}

export class ScreenAnalyzer {
    /**
     * @param {{width:number, height:number}} opts analysis frame size
     */
    constructor({ width, height } = {}) {
        this.W = width;
        this.H = height;
        this.L = new Uint8Array(width * height);
        this.prevL = new Uint8Array(width * height);
        this.hasPrev = false;
        this.tracker = new CursorTracker({ width, height });
        this.tx = Math.ceil(width / TILE);
        this.ty = Math.ceil(height / TILE);
        this.changed = new Uint8Array(this.tx * this.ty);
        this.activity = new Float32Array(this.tx * this.ty);
        this.frames = 0;

        // Outputs
        this.raw = [];          // [{t, x, y, key}] or {t, hidden:true}
        this.moves = [];
        this.clicks = [];
        this.scrolls = [];      // [{t, shift}]
        this.shapes = [];
        this.keys = [];
        this.caret = [];

        // Pointer state
        this.cur = null;        // {x, y, t, shape, key}
        this.lostSince = null;
        this.settle = null;     // {x, y, t}
        this.lastNearChange = -Infinity;
        this.lastClick = -Infinity;
        this.pendingClicks = [];   // clicks waiting to see if their change was only a hover effect

        // Typing state
        this.typing = null;     // { events: [], confirmed }
        this.lastKeyAt = -Infinity;
        this.lastBlink = null;

        // Scroll strips
        this.strips = [0.3, 0.5, 0.7].map(c => ({
            x0: Math.max(0, Math.round(width * (c - 0.08))),
            x1: Math.min(width, Math.round(width * (c + 0.08))),
            prev: null,
        }));
        this.scrollY0 = Math.round(height * 0.08);
        this.scrollY1 = Math.round(height * 0.92);
        this.lastScrollAt = -Infinity;
    }

    /**
     * Feed one frame.
     * @param {Uint8ClampedArray|Uint8Array} rgba frame pixels (RGBA, analysis size)
     * @param {number} t ms on the recording timeline
     */
    push(rgba, t) {
        const { W, H } = this;
        // Swap buffers
        const tmp = this.prevL; this.prevL = this.L; this.L = tmp;
        lumaFromRGBA(rgba, this.L);
        this.pushLuma(this.L, t, true);
    }

    /** Feed one frame as luma (tests and callers that already have it). */
    pushLuma(L, t, owned = false) {
        if (!owned) {
            const tmp = this.prevL; this.prevL = this.L; this.L = tmp;
            this.L.set(L);
        }
        L = this.L;
        const prev = this.hasPrev ? this.prevL : null;
        this.frames++;

        const comps = prev ? this._changeMap(L, prev) : [];

        // Pointer
        const nearest = this.cur ? this._sortByDistance(comps, this.cur.x, this.cur.y) : comps;
        const r = this.tracker.update(L, prev, t, nearest.map(c => ({
            x0: c.x0 - 24, y0: c.y0 - 24, x1: c.x1 + 24, y1: c.y1 + 24,
        })));
        const before = this.cur;
        this._pointer(r, t);
        if (this.pendingClicks.length) this._verifyClicks(L, t);

        if (prev) {
            // Tiles the pointer itself touched (old and new spot) aren't content
            // changes - but only if it moved: under a resting pointer, whatever
            // changed is the page (a checkbox ticking right under the tip).
            const cur = this.cur;
            const moved = !before !== !cur || (before && cur && (before.x !== cur.x || before.y !== cur.y || before.key !== cur.key));
            const content = moved
                ? comps.filter(c => !this._isPointerChange(c, before) && !this._isPointerChange(c, cur))
                : comps;
            const scrolled = this._scroll(L, t, content.length > 0);
            if (!scrolled) this._content(L, prev, content, t);
        }
        this.hasPrev = true;
    }

    _sortByDistance(comps, x, y) {
        const d = (c) => {
            const cx = Math.max(c.x0, Math.min(x, c.x1));
            const cy = Math.max(c.y0, Math.min(y, c.y1));
            return Math.hypot(cx - x, cy - y);
        };
        return comps.slice().sort((a, b) => d(a) - d(b));
    }

    /** Changed tiles grouped into components with pixel bounding boxes. */
    _changeMap(L, prev) {
        const { W, H, tx, ty, changed, activity } = this;
        changed.fill(0);
        for (let j = 0; j < ty; j++) {
            const y0 = j * TILE, y1 = Math.min(H, y0 + TILE);
            for (let i = 0; i < tx; i++) {
                const x0 = i * TILE, x1 = Math.min(W, x0 + TILE);
                let c = 0;
                for (let y = y0 + 1; y < y1; y += TILE_STEP) {
                    const row = y * W;
                    for (let x = x0 + 1; x < x1; x += TILE_STEP) {
                        const d = L[row + x] - prev[row + x];
                        if (d > TILE_DIFF || d < -TILE_DIFF) c++;
                    }
                }
                // Thin things (a caret, 1px text strokes) can slip between samples:
                // check the tile's middle row and column fully.
                if (!c) {
                    const ym = Math.min(H - 1, y0 + (TILE >> 1)) * W;
                    for (let x = x0; x < x1 && !c; x++) {
                        const d = L[ym + x] - prev[ym + x];
                        if (d > TILE_DIFF || d < -TILE_DIFF) c++;
                    }
                    const xm = Math.min(W - 1, x0 + (TILE >> 1));
                    for (let y = y0; y < y1 && !c; y++) {
                        const d = L[y * W + xm] - prev[y * W + xm];
                        if (d > TILE_DIFF || d < -TILE_DIFF) c++;
                    }
                }
                const k = j * tx + i;
                if (c) changed[k] = 1;
                activity[k] += ((c ? 1 : 0) - activity[k]) * ANIMATED_EMA;
            }
        }
        // Connected components (4-neighbour) of changed tiles.
        const seen = new Uint8Array(tx * ty);
        const comps = [];
        const stack = [];
        for (let k = 0; k < tx * ty; k++) {
            if (!changed[k] || seen[k]) continue;
            let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1, n = 0, animated = 0;
            stack.push(k); seen[k] = 1;
            while (stack.length) {
                const q = stack.pop();
                const i = q % tx, j = (q - i) / tx;
                n++;
                if (activity[q] > ANIMATED_LEVEL) animated++;
                if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j;
                if (i > 0 && changed[q - 1] && !seen[q - 1]) { seen[q - 1] = 1; stack.push(q - 1); }
                if (i < tx - 1 && changed[q + 1] && !seen[q + 1]) { seen[q + 1] = 1; stack.push(q + 1); }
                if (j > 0 && changed[q - tx] && !seen[q - tx]) { seen[q - tx] = 1; stack.push(q - tx); }
                if (j < ty - 1 && changed[q + tx] && !seen[q + tx]) { seen[q + tx] = 1; stack.push(q + tx); }
            }
            comps.push({
                x0: x0 * TILE, y0: y0 * TILE,
                x1: Math.min(W - 1, (x1 + 1) * TILE - 1), y1: Math.min(H - 1, (y1 + 1) * TILE - 1),
                tiles: n,
                animated: animated / n > 0.6,
            });
        }
        return comps;
    }

    _isPointerChange(c, cur) {
        if (!cur) return false;
        // The pointer's footprint (with the tile grid slack) contains this change.
        const pad = TILE;
        const fx0 = cur.x - pad - 4, fy0 = cur.y - pad - 4;
        const fx1 = cur.x + 40 * (cur.scale || 1) + pad, fy1 = cur.y + 40 * (cur.scale || 1) + pad;
        return c.x0 >= fx0 && c.y0 >= fy0 && c.x1 <= fx1 && c.y1 <= fy1;
    }

    _pointer(r, t) {
        const { W, H } = this;
        if (r.found) {
            const scale = Number(String(r.key).split('@')[1]) || 1;
            const moved = !this.cur || Math.hypot(r.x - this.cur.x, r.y - this.cur.y) >= 0.5 || this.lostSince != null;
            if (moved) {
                this.moves.push({ time: Math.round(t), x: r.x / W, y: r.y / H });
                this.raw.push({ t: Math.round(t), x: r.x, y: r.y, key: r.key });
            } else if (this.cur.key !== r.key) {
                this.raw.push({ t: Math.round(t), x: r.x, y: r.y, key: r.key });
            }
            if (!this.cur || this.cur.shape !== r.shape) {
                this.shapes.push({ time: Math.round(t), shape: r.shape });
                // Shape change in place (hand -> arrow when a link opens) is a UI response.
                if (this.cur && this.settle && Math.hypot(r.x - this.settle.x, r.y - this.settle.y) <= SETTLE_RADIUS) {
                    this._maybeClick(t, 'shape');
                }
            }
            // Settling: arrived within a few px of one spot and stayed there.
            if (!this.settle || Math.hypot(r.x - this.settle.x, r.y - this.settle.y) > SETTLE_RADIUS) {
                this.settle = { x: r.x, y: r.y, t, still: false };
            } else if (!this.settle.still && t - this.settle.t >= 50) {
                this.settle.still = true;
            }
            this.cur = { x: r.x, y: r.y, t, shape: r.shape, key: r.key, scale };
            this.lostSince = null;
        } else if (this.cur) {
            if (this.lostSince == null) this.lostSince = t;
            // Gone for a while: hidden (typing hides it on Windows, or it left the capture).
            if (t - this.lostSince > 250 && !this.cur.hiddenMarked) {
                this.moves.push({ time: Math.round(this.lostSince), x: this.cur.x / W, y: this.cur.y / H, hidden: true });
                this.raw.push({ t: Math.round(this.lostSince), hidden: true });
                this.cur.hiddenMarked = true;
                this.settle = null;
            }
        }
    }

    _scroll(L, t, anyChange) {
        // Profiles are kept for every frame so a scroll's first step is caught.
        let shift = null;
        for (const s of this.strips) {
            const p = rowProfile(L, this.W, this.H, s.x0, s.x1, this.scrollY0, this.scrollY1);
            const d = detectShift(s.prev, p);
            s.prev = p;
            if (d != null && (shift == null || Math.abs(d) > Math.abs(shift))) shift = d;
        }
        if (shift == null || !anyChange) return false;
        this.scrolls.push({ t: Math.round(t), shift });
        this.lastScrollAt = t;
        if (this.cur) this.moves.push({ time: Math.round(t), x: this.cur.x / this.W, y: this.cur.y / this.H, scroll: shift });
        return true;
    }

    /** Exact changed-pixel box inside a component (full resolution). */
    _exactBox(L, prev, c) {
        const W = this.W;
        let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
        for (let y = c.y0; y <= c.y1; y++) {
            const row = y * W;
            for (let x = c.x0; x <= c.x1; x++) {
                const d = L[row + x] - prev[row + x];
                if (d > 24 || d < -24) {
                    if (x < x0) x0 = x; if (x > x1) x1 = x;
                    if (y < y0) y0 = y; if (y > y1) y1 = y;
                }
            }
        }
        return x1 < 0 ? null : { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    }

    _content(L, prev, comps, t) {
        const { W, H } = this;
        const live = comps.filter(c => !c.animated);
        if (!live.length) return;
        if (t - this.lastScrollAt < 300) return; // page still settling after a scroll

        let changedTiles = 0;
        for (const c of live) changedTiles += c.tiles;
        const globalShare = changedTiles / (this.tx * this.ty);

        const events = [];
        for (const c of live) {
            if (c.tiles > 8) { events.push({ kind: 'region', c }); continue; }
            const b = this._exactBox(L, prev, c);
            if (!b) continue;
            if (b.w <= 3 && b.h >= 8 && b.h <= 64) events.push({ kind: 'blink', b, c });
            else if (b.w <= 96 && b.h >= 5 && b.h <= 64) events.push({ kind: 'glyph', b, c });
            else events.push({ kind: 'region', c, b });
        }

        // Typing and caret
        for (const e of events) {
            if (e.kind === 'blink') this._blink(e.b, t);
            else if (e.kind === 'glyph') this._glyph(e.b, t);
        }

        // Click: the UI responds next to a settled pointer.
        const cur = this.cur;
        if (!cur || this.lostSince != null) return;
        const near = events.filter(e => {
            const c = e.c;
            const cx = Math.max(c.x0, Math.min(cur.x, c.x1));
            const cy = Math.max(c.y0, Math.min(cur.y, c.y1));
            return Math.hypot(cx - cur.x, cy - cur.y) <= CLICK_RADIUS * Math.max(1, cur.scale || 1);
        });
        const global = globalShare > 0.12;
        if (near.length || global) {
            const quietBefore = t - this.lastNearChange;
            const s = this.settle;
            if (s && s.still && t - s.t >= CLICK_MIN_DELAY && quietBefore >= CLICK_QUIET) {
                const cause = near.filter(e => e.kind === 'glyph').map(e => e.b);
                // A blinking caret appearing under the pointer is a click into a field.
                const kind = global ? 'page' : near.some(e => e.kind === 'region') ? 'ui' : near.some(e => e.kind === 'blink') ? 'focus' : 'small';
                const click = this._maybeClick(t, kind, cause);
                // Tooltips and hover highlights also appear next to a resting pointer;
                // they undo themselves once it leaves. Keep the "before" to check.
                if (click && kind !== 'page') {
                    const box = near.reduce((b, e) => ({
                        x0: Math.min(b.x0, e.c.x0), y0: Math.min(b.y0, e.c.y0), x1: Math.max(b.x1, e.c.x1), y1: Math.max(b.y1, e.c.y1),
                    }), { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
                    if (Number.isFinite(box.x0)) {
                        this.pendingClicks.push({ click, box, before: this._crop(prev, box), at: { x: cur.x, y: cur.y }, leftAt: null, since: t });
                    }
                }
            }
            if (near.length) this.lastNearChange = t;
        }
    }

    /** Downsampled luma of a box (every 2nd pixel), for before/after comparisons. */
    _crop(L, b) {
        const W = this.W;
        const out = [];
        for (let y = b.y0; y <= b.y1; y += 2) {
            for (let x = b.x0; x <= b.x1; x += 2) out.push(L[y * W + x]);
        }
        return Uint8Array.from(out);
    }

    _verifyClicks(L, t) {
        const cur = this.cur;
        this.pendingClicks = this.pendingClicks.filter((p) => {
            if (p.leftAt == null) {
                const away = !cur || this.lostSince != null || Math.hypot(cur.x - p.at.x, cur.y - p.at.y) > SETTLE_RADIUS * 4;
                if (away) {
                    p.leftAt = t;
                    // The "response" came just as the pointer set off: a hover-out
                    // (tooltip closing, highlight fading), not a click.
                    if (t - p.since < 160) {
                        this.clicks = this.clicks.filter(c => c !== p.click);
                        return false;
                    }
                } else return t - p.since < 8000; // still resting there; stop watching eventually
            }
            const now = this._crop(L, p.box);
            let d = 0;
            for (let i = 0; i < now.length; i++) d += Math.abs(now[i] - p.before[i]);
            if (d / Math.max(1, now.length) < REVERT_MAD) {
                // Back to how it was before the "click": it was only hover.
                this.clicks = this.clicks.filter(c => c !== p.click);
                return false;
            }
            return t - p.leftAt < REVERT_WINDOW;
        });
    }

    _maybeClick(t, kind, cause = []) {
        if (t - this.lastClick < CLICK_GAP || !this.cur) return null;
        const s = this.settle;
        // The click came a moment before the response it caused.
        const time = Math.max(s ? s.t + 40 : t - 120, t - 70);
        const confidence = kind === 'page' ? 0.9 : kind === 'ui' ? 0.75 : kind === 'focus' ? 0.8 : kind === 'shape' ? 0.6 : 0.5;
        const click = {
            time: Math.round(time),
            x: this.cur.x / this.W,
            y: this.cur.y / this.H,
            button: 'left',
            inferred: true,
            confidence,
            _cause: cause,
        };
        this.clicks.push(click);
        this.lastClick = t;
        return click;
    }

    _blink(b, t) {
        // Caret: x at the bar, y at its top.
        const sample = { time: Math.round(t), x: (b.x0 + b.w / 2) / this.W, y: b.y0 / this.H, h: b.h / this.H };
        const last = this.caret[this.caret.length - 1];
        if (!last || Math.abs(last.x - sample.x) * this.W > 1 || Math.abs(last.y - sample.y) * this.H > 1) this.caret.push(sample);
        this.lastBlink = { t, b };
    }

    _glyph(b, t) {
        const T = this.typing;
        const lineH = b.h;
        const continues = T && t - T.lastT <= TYPE_GAP && (
            // same line, close to where the last change happened
            (Math.abs(b.y0 - T.lastB.y0) <= Math.max(lineH, T.lastB.h) * 0.6 && b.x0 <= T.lastB.x1 + 140 && b.x1 >= T.lastB.x0 - 140)
            // or the next line, back at the start
            || (b.y0 > T.lastB.y0 && b.y0 - T.lastB.y1 <= Math.max(lineH, T.lastB.h) * 1.6 && Math.abs(b.x0 - T.startX) <= 160)
        );
        if (!continues) {
            this.typing = { events: [{ t, b }], lastT: t, lastB: b, startX: b.x0, confirmed: false };
            return;
        }
        T.events.push({ t, b });
        T.lastT = t;
        T.lastB = b;
        if (!T.confirmed && T.events.length >= 3) {
            T.confirmed = true;
            for (const e of T.events) this._typed(e.t, e.b);
            // Glyphs mistaken for click responses were typing.
            this.clicks = this.clicks.filter(c => !(c._cause || []).some(cb => T.events.some(e => e.b === cb)));
        } else if (T.confirmed) {
            this._typed(t, b);
        }
    }

    _typed(t, b) {
        if (t - this.lastKeyAt >= KEY_THROTTLE) {
            this.keys.push({ time: Math.round(t / 10) / 100, text: '', typed: true });
            this.lastKeyAt = t;
        }
        // The caret sits right after the newest glyph.
        this.caret.push({ time: Math.round(t), x: Math.min(1, (b.x1 + 2) / this.W), y: b.y0 / this.H, h: b.h / this.H });
    }

    /**
     * Telemetry in Drift's format:
     *  moves: [{time ms, x, y, hidden?, scroll?, click?}] normalized
     *  clicks: [{time ms, x, y, button, inferred, confidence}]
     *  keystrokes: [{time s, text:'', typed:true}]
     *  caret: [{time ms, x, y, h}]
     *  cursorShapes: [{time ms, shape}]
     *  pointer: { width, height, raw: [{t, x, y, key} | {t, hidden}], sprites: {key: {points, shape, scale, learned}} }
     */
    finish() {
        // A page change right as a scroll begins is the scroll, not a click.
        const clicks = this.clicks
            .filter(c => !this.scrolls.some(sc => sc.t > c.time - 100 && sc.t < c.time + 400))
            .sort((a, b) => a.time - b.time)
            .map(({ _cause, ...c }) => c);
        const moves = [...this.moves, ...clicks.map(c => ({ time: c.time, x: c.x, y: c.y, click: 'left' }))]
            .sort((a, b) => a.time - b.time);
        const caret = this.caret.sort((a, b) => a.time - b.time);
        const sprites = this.tracker.sprites();
        const keysUsed = new Set(this.raw.filter(r => r.key).map(r => r.key));
        for (const key of keysUsed) {
            if (!sprites[key]) {
                const [id, s] = key.split('@');
                sprites[key] = { shape: id.split('-')[0] === 'ibeam' ? 'text' : id.split('-')[0], scale: Number(s), learned: false, points: templateFootprint(key) };
            }
        }
        return {
            moves,
            clicks,
            keystrokes: this.keys,
            caret,
            cursorShapes: this.shapes,
            scrolls: this.scrolls,
            pointer: { width: this.W, height: this.H, raw: this.raw, sprites },
            stats: { frames: this.frames, found: this.raw.filter(r => !r.hidden).length },
        };
    }
}
