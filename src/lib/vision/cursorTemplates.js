/**
 * cursorTemplates — what the system pointer looks like, as matchable templates.
 *
 * The browser can't tell a web page where the mouse is outside its own tab,
 * but screen and window captures carry the pointer in their pixels. To find
 * it, each common pointer is described as a small class map:
 *
 *   'in'  interior fill   (white on Windows, black on macOS / most Linux themes)
 *   'rim' outline         (the opposite colour)
 *
 * A candidate position matches when the interior pixels agree with each other,
 * the rim pixels agree with each other, and the two contrast strongly. That
 * test is colour-agnostic (it fits inverted and custom-coloured themes) and
 * tolerant of the exact artwork, which differs per OS version and DPI scale.
 * Once the real pointer has been seen a few times its exact pixels are learned
 * (see CursorTracker) and used instead.
 *
 * Bitmaps are written as rows: 'B' rim, 'W' interior, anything else outside.
 */

// The classic Windows arrow at 100% (12 x 20), hotspot at the tip.
const WINDOWS_ARROW = [
    'B',
    'BB',
    'BWB',
    'BWWB',
    'BWWWB',
    'BWWWWB',
    'BWWWWWB',
    'BWWWWWWB',
    'BWWWWWWWB',
    'BWWWWWWWWB',
    'BWWWWWWWWWB',
    'BWWWWWWWWWWB',
    'BWWWWWWBBBBBB',
    'BWWWBWWB',
    'BWWBBWWB',
    'BWB  BWWB',
    'BB   BWWB',
    'B     BWWB',
    '      BWWB',
    '       BB',
];

// macOS / Adwaita-style arrow: slimmer, the tail leaves at a steeper angle,
// with the outline included. Hotspot at the tip.
const MAC_ARROW = [
    'B',
    'BB',
    'BWB',
    'BWWB',
    'BWWWB',
    'BWWWWB',
    'BWWWWWB',
    'BWWWWWWB',
    'BWWWWWWWB',
    'BWWWWWWWWB',
    'BWWWWWWWWWB',
    'BWWWWWWBBBBB',
    'BWWWBWWB',
    'BWWB BWWB',
    'BWB  BWWB',
    'BB    BWWB',
    'B     BWWB',
    '       BWB',
    '       BB',
];

// Windows link-select hand at 100%, hotspot at the index fingertip.
const WINDOWS_HAND = [
    '     BB',
    '    BWWB',
    '    BWWB',
    '    BWWB',
    '    BWWB',
    '    BWWBBB',
    '    BWWBWWBBB',
    '    BWWBWWBWWBB',
    ' BB BWWBWWBWWBWB',
    'BWWBBWWWWWWWWWWB',
    'BWWWBWWWWWWWWWWB',
    ' BWWBWWWWWWWWWWB',
    '  BWWWWWWWWWWWWB',
    '  BWWWWWWWWWWWB',
    '   BWWWWWWWWWWB',
    '   BWWWWWWWWWB',
    '    BWWWWWWWWB',
    '    BWWWWWWWWB',
    '    BBBBBBBBBB',
];

// Text I-beam (outlined variant, as on macOS / many Linux themes), hotspot
// at the middle of the bar.
const IBEAM = [
    'BBB BBB',
    'BWWBWWB',
    'BBBWBBB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    '  BWB',
    'BBBWBBB',
    'BWWBWWB',
    'BBB BBB',
];

/** Raw bitmaps (tests and tools paint with them). */
export const BITMAPS = Object.freeze({ WINDOWS_ARROW, MAC_ARROW, WINDOWS_HAND, IBEAM });

export const BASE_SHAPES = Object.freeze({
    'arrow-win': { rows: WINDOWS_ARROW, hot: [0, 0], shape: 'arrow' },
    'arrow-mac': { rows: MAC_ARROW, hot: [0, 0], shape: 'arrow' },
    'hand-win': { rows: WINDOWS_HAND, hot: [5.5, 0], shape: 'hand' },
    'ibeam': { rows: IBEAM, hot: [3.5, 8.5], shape: 'text' },
});

// Display scales the pointer is searched at (Windows 100..250%, Retina 2x).
export const SEARCH_SCALES = Object.freeze([1, 1.25, 1.5, 1.75, 2, 2.5, 3]);

/** Class grid (0 outside, 1 interior, 2 rim) of a base bitmap. */
function baseGrid(rows) {
    const h = rows.length;
    const w = Math.max(...rows.map(r => r.length));
    const g = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
        const r = rows[y];
        for (let x = 0; x < r.length; x++) {
            g[y * w + x] = r[x] === 'W' ? 1 : r[x] === 'B' ? 2 : 0;
        }
    }
    return { g, w, h };
}

/**
 * Template at a display scale: the base bitmap scaled with area sampling.
 * Only pixels that are clearly one class at that scale are kept (blended edge
 * pixels differ between OS renderers), so the template stays honest.
 *
 * @returns {{id, shape, scale, w, h, hotX, hotY, innerX: Int16Array, innerY: Int16Array, rimX: Int16Array, rimY: Int16Array}}
 *   pixel offsets relative to the hotspot
 */
export function buildTemplate(id, scale = 1, phaseX = 0, phaseY = 0) {
    const base = BASE_SHAPES[id];
    if (!base) throw new Error(`unknown cursor template ${id}`);
    const { g, w, h } = baseGrid(base.rows);
    const W = Math.ceil(w * scale);
    const H = Math.ceil(h * scale);
    const hotX = Math.round(base.hot[0] * scale);
    const hotY = Math.round(base.hot[1] * scale);
    const SS = 4; // supersamples per axis
    const ix = [], iy = [], rx = [], ry = [];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            let cIn = 0, cRim = 0;
            for (let sy = 0; sy < SS; sy++) {
                const by = Math.floor((y + (sy + 0.5) / SS - phaseY) / scale);
                if (by < 0 || by >= h) continue;
                for (let sx = 0; sx < SS; sx++) {
                    const bx = Math.floor((x + (sx + 0.5) / SS - phaseX) / scale);
                    if (bx < 0 || bx >= w) continue;
                    const c = g[by * w + bx];
                    if (c === 1) cIn++;
                    else if (c === 2) cRim++;
                }
            }
            const n = SS * SS;
            if (cIn >= n * 0.95) { ix.push(x - hotX); iy.push(y - hotY); }
            else if (cRim >= n * 0.95) { rx.push(x - hotX); ry.push(y - hotY); }
        }
    }
    return {
        id,
        shape: base.shape,
        scale,
        phase: [phaseX, phaseY],
        w: W,
        h: H,
        hotX,
        hotY,
        innerX: Int16Array.from(ix),
        innerY: Int16Array.from(iy),
        rimX: Int16Array.from(rx),
        rimY: Int16Array.from(ry),
    };
}

const cache = new Map();
/** All templates for the given ids and scales (memoized). */
export function templateSet(ids = Object.keys(BASE_SHAPES), scales = SEARCH_SCALES, phases = [[0, 0]]) {
    const out = [];
    for (const id of ids) {
        for (const s of scales) {
            for (const [px, py] of phases) {
                const key = `${id}@${s}~${px},${py}`;
                if (!cache.has(key)) cache.set(key, buildTemplate(id, s, px, py));
                out.push(cache.get(key));
            }
        }
    }
    return out;
}

/** Half-pixel offsets: a resampled capture can put the pointer between pixels. */
export const HALF_PHASES = Object.freeze([[0.5, 0], [0, 0.5], [0.5, 0.5]]);

/**
 * Paint a template's base bitmap into an RGBA buffer (used by tests and the
 * synthetic scenario generator). Interior/rim colours default to Windows'.
 */
export function paintCursor(rgba, width, height, id, x, y, {
    scale = 1, inner = [255, 255, 255], rim = [0, 0, 0],
} = {}) {
    const base = BASE_SHAPES[id];
    const { g, w, h } = baseGrid(base.rows);
    const hotX = Math.round(base.hot[0] * scale);
    const hotY = Math.round(base.hot[1] * scale);
    const W = Math.ceil(w * scale);
    const H = Math.ceil(h * scale);
    const ox = Math.round(x) - hotX;
    const oy = Math.round(y) - hotY;
    for (let ty = 0; ty < H; ty++) {
        const py = oy + ty;
        if (py < 0 || py >= height) continue;
        const by = Math.floor((ty + 0.5) / scale);
        if (by >= h) continue;
        for (let tx = 0; tx < W; tx++) {
            const px = ox + tx;
            if (px < 0 || px >= width) continue;
            const bx = Math.floor((tx + 0.5) / scale);
            if (bx >= w) continue;
            const c = g[by * w + bx];
            if (!c) continue;
            const col = c === 1 ? inner : rim;
            const i = (py * width + px) * 4;
            rgba[i] = col[0]; rgba[i + 1] = col[1]; rgba[i + 2] = col[2]; rgba[i + 3] = 255;
        }
    }
}
