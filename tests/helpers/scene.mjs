/**
 * Synthetic desktop frames for the vision tests: windows with text-like
 * glyph rows, a dark editor, a photo-like noisy area, and a system pointer
 * painted on top. Deterministic (seeded).
 */
import { paintCursor } from '../../src/lib/vision/cursorTemplates.js';

export function rng(seed = 1) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

export function fillRect(rgba, W, H, x, y, w, h, c) {
    const x0 = Math.max(0, Math.floor(x)), y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(W, Math.floor(x + w)), y1 = Math.min(H, Math.floor(y + h));
    for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
            const i = (yy * W + xx) * 4;
            rgba[i] = c[0]; rgba[i + 1] = c[1]; rgba[i + 2] = c[2]; rgba[i + 3] = 255;
        }
    }
}

/** Glyph-like text: short dark bars of x-height with gaps, on rows. */
export function textBlock(rgba, W, H, x, y, w, rows, rand, color = [40, 40, 48], lineH = 20) {
    for (let r = 0; r < rows; r++) {
        let cx = x;
        const end = x + w * (0.55 + rand() * 0.45);
        while (cx < end) {
            const word = 2 + Math.floor(rand() * 7);
            for (let k = 0; k < word && cx < end; k++) {
                const gw = 5 + Math.floor(rand() * 3);
                const tall = rand() < 0.25;
                fillRect(rgba, W, H, cx, y + r * lineH + (tall ? 2 : 6), gw - 1, tall ? 12 : 8, color);
                cx += gw + 1;
            }
            cx += 6;
        }
    }
}

export function makeDesktop(W = 1280, H = 720, seed = 7) {
    const rand = rng(seed);
    const rgba = new Uint8ClampedArray(W * H * 4);
    // Wallpaper gradient
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            rgba[i] = 30 + (x / W) * 60; rgba[i + 1] = 60 + (y / H) * 50; rgba[i + 2] = 110; rgba[i + 3] = 255;
        }
    }
    // Browser-like window
    fillRect(rgba, W, H, 40, 30, 700, 520, [255, 255, 255]);
    fillRect(rgba, W, H, 40, 30, 700, 36, [222, 225, 230]);
    textBlock(rgba, W, H, 70, 90, 620, 18, rand);
    fillRect(rgba, W, H, 80, 470, 120, 34, [26, 115, 232]); // button
    // Dark editor
    fillRect(rgba, W, H, 760, 60, 480, 420, [30, 30, 36]);
    textBlock(rgba, W, H, 780, 80, 420, 18, rand, [200, 200, 140]);
    // Photo-like noise
    for (let y = 500; y < 690; y++) {
        for (let x = 760; x < 1240; x++) {
            const i = (y * W + x) * 4;
            const n = rand() * 80;
            rgba[i] = 120 + n; rgba[i + 1] = 90 + n * 0.6; rgba[i + 2] = 60 + n * 0.3; rgba[i + 3] = 255;
        }
    }
    // Taskbar
    fillRect(rgba, W, H, 0, H - 30, W, 30, [20, 22, 28]);
    return rgba;
}

export function luma(rgba, W, H, out = new Uint8Array(W * H)) {
    for (let i = 0, j = 0; j < W * H; i += 4, j++) out[j] = (rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29) >> 8;
    return out;
}

/** Pointer path: list of [tMs, x, y] keyframes, linear between them. */
export function pathAt(keys, t) {
    if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
    for (let i = 1; i < keys.length; i++) {
        if (t <= keys[i][0]) {
            const [ta, xa, ya] = keys[i - 1];
            const [tb, xb, yb] = keys[i];
            const k = (t - ta) / (tb - ta);
            // ease in-out like a real hand
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            return [xa + (xb - xa) * e, ya + (yb - ya) * e];
        }
    }
    const l = keys[keys.length - 1];
    return [l[1], l[2]];
}

export function renderFrame(desktop, W, H, cursor) {
    const rgba = new Uint8ClampedArray(desktop);
    if (cursor) paintCursor(rgba, W, H, cursor.id || 'arrow-win', cursor.x, cursor.y, cursor);
    return rgba;
}
