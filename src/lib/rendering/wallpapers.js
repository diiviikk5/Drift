/**
 * wallpapers — procedural studio backgrounds.
 *
 * Every wallpaper is drawn from a small spec with seeded noise, so it is
 * crisp at any resolution, composes for any aspect ratio (16:9, 9:16, 1:1,
 * 4:5) and needs no image assets. Kinds:
 *   waves     flowing layered bands (macOS-style)
 *   hills     soft rolling hills under a pastel sky
 *   landscape sky, sun/moon, stars, aurora, mountain ridges, forests, water
 *   dunes     sculpted sand dunes
 *   mesh      soft radial light blobs over a tonal base
 *   linear    minimal angled gradient
 */

import { drawMeshBackground, WALLPAPERS } from './stage.js';

// ---------------------------------------------------------------- helpers

function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function makeNoise(seed) {
    const r = mulberry32(seed);
    const p = new Float32Array(512);
    for (let i = 0; i < 512; i++) p[i] = r();
    return (x) => {
        const xi = Math.floor(x);
        const f = x - xi;
        const a = p[((xi % 512) + 512) % 512];
        const b = p[(((xi + 1) % 512) + 512) % 512];
        const t = f * f * (3 - 2 * f);
        return a + (b - a) * t;
    };
}

function fbm(noise, x, octaves = 4, ridged = 0) {
    let sum = 0;
    let amp = 1;
    let norm = 0;
    let freq = 1;
    for (let o = 0; o < octaves; o++) {
        let n = noise(x * freq + o * 31.7);
        if (ridged) n = n * (1 - ridged) + (1 - Math.abs(2 * n - 1)) * ridged;
        sum += n * amp;
        norm += amp;
        amp *= 0.5;
        freq *= 2;
    }
    return sum / norm;
}

function hexToRgb(hex) {
    let h = String(hex || '#000').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return Number.isFinite(n) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : [0, 0, 0];
}

function rgba(hex, a = 1) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function mix(c1, c2, t) {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
    return `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function verticalGradient(ctx, y0, y1, stops) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    stops.forEach(([pos, color]) => g.addColorStop(pos, color));
    return g;
}

function glow(ctx, x, y, r, color, alpha = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(0.35, rgba(color, alpha * 0.45));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// ---------------------------------------------------------------- kinds

function drawLinear(ctx, w, h, spec) {
    const angle = ((spec.angle ?? 135) * Math.PI) / 180;
    const len = Math.abs(w * Math.cos(angle)) + Math.abs(h * Math.sin(angle));
    const cx = w / 2;
    const cy = h / 2;
    const dx = (Math.cos(angle) * len) / 2;
    const dy = (Math.sin(angle) * len) / 2;
    const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    spec.colors.forEach((c, i) => g.addColorStop(i / (spec.colors.length - 1), c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    if (spec.glow) glow(ctx, w * spec.glow[0], h * spec.glow[1], Math.max(w, h) * spec.glow[2], spec.glow[3], spec.glow[4] ?? 0.5);
}

function drawWaves(ctx, w, h, spec) {
    const long = Math.max(w, h);
    ctx.fillStyle = verticalGradient(ctx, 0, h, [[0, spec.bg[0]], [1, spec.bg[1]]]);
    ctx.fillRect(0, 0, w, h);
    if (spec.glow) glow(ctx, w * spec.glow[0], h * spec.glow[1], long * spec.glow[2], spec.glow[3], 0.6);

    const bands = spec.bands;
    bands.forEach((band, i) => {
        const [c1, c2] = band.colors;
        const y0 = band.y * h;
        const amp = (band.amp ?? 0.08) * h;
        const freq = band.freq ?? 1.1;
        const phase = band.phase ?? i * 1.3;
        const tilt = (band.tilt ?? -0.12) * h;
        const steps = 96;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-w * 0.05, h + 10);
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const x = -w * 0.05 + u * w * 1.1;
            const y = y0 + tilt * (u - 0.5)
                + Math.sin(u * Math.PI * 2 * freq + phase) * amp
                + Math.sin(u * Math.PI * 2 * freq * 2.3 + phase * 1.7) * amp * 0.25;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(w * 1.05, h + 10);
        ctx.closePath();

        const g = ctx.createLinearGradient(0, y0 - amp, w, y0 + h * 0.5);
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);
        ctx.fillStyle = g;
        ctx.shadowColor = `rgba(0, 0, 0, ${band.shadow ?? 0.28})`;
        ctx.shadowBlur = long * 0.035;
        ctx.shadowOffsetY = -long * 0.006;
        ctx.fill();
        ctx.restore();

        // Soft sheen along the crest
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = band.sheen ?? 0.18;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = long * 0.0025;
        ctx.filter = 'none';
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const x = -w * 0.05 + u * w * 1.1;
            const y = y0 + tilt * (u - 0.5)
                + Math.sin(u * Math.PI * 2 * freq + phase) * amp
                + Math.sin(u * Math.PI * 2 * freq * 2.3 + phase * 1.7) * amp * 0.25;
            if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    });
}

function drawStars(ctx, w, h, count, seed, maxY = 1, brightness = 1) {
    const r = mulberry32(seed);
    const n = Math.round(count * (w * h) / (1920 * 1080));
    const unit = Math.min(w, h) / 1080;
    ctx.save();
    for (let i = 0; i < n; i++) {
        const x = r() * w;
        const y = Math.pow(r(), 1.4) * h * maxY;
        const big = r() > 0.97;
        const size = (big ? 1.6 : 0.5 + r() * 0.9) * unit;
        ctx.globalAlpha = (0.25 + r() * 0.75) * brightness * (1 - y / (h * maxY) * 0.6);
        ctx.fillStyle = r() > 0.85 ? '#cfe0ff' : '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        if (big) glow(ctx, x, y, size * 6, '#ffffff', 0.25 * brightness);
    }
    ctx.restore();
}

function drawMilkyWay(ctx, w, h, seed) {
    const r = mulberry32(seed + 7);
    const long = Math.max(w, h);
    ctx.save();
    ctx.translate(w * 0.5, h * 0.35);
    ctx.rotate(-0.55);
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 14; i++) {
        const x = (r() - 0.5) * long * 1.2;
        const y = (r() - 0.5) * long * 0.06;
        glow(ctx, x, y, long * (0.08 + r() * 0.1), i % 3 ? '#8fa8ff' : '#f4d9ff', 0.12);
    }
    const n = Math.round(1800 * (w * h) / (1920 * 1080));
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < n; i++) {
        const x = (r() - 0.5) * long * 1.3;
        const y = ((r() + r() + r()) / 3 - 0.5) * long * 0.16;
        ctx.globalAlpha = 0.2 + r() * 0.6;
        ctx.fillRect(x, y, 1.2 * (long / 1920), 1.2 * (long / 1920));
    }
    ctx.restore();
}

function drawAurora(ctx, w, h, colors, seed) {
    const noise = makeNoise(seed);
    const long = Math.max(w, h);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    colors.forEach((color, k) => {
        const baseY = h * (0.18 + k * 0.07);
        const height = h * (0.22 + k * 0.04);
        const strands = 140;
        for (let i = 0; i < strands; i++) {
            const u = i / strands;
            const x = u * w;
            const y = baseY + (fbm(noise, u * 3 + k * 10, 3) - 0.5) * h * 0.25;
            const intensity = Math.pow(fbm(noise, u * 6 + k * 20 + 100, 2), 2.2);
            const g = ctx.createLinearGradient(0, y - height, 0, y);
            g.addColorStop(0, rgba(color, 0));
            g.addColorStop(0.7, rgba(color, 0.35 * intensity));
            g.addColorStop(1, rgba(color, 0.05 * intensity));
            ctx.fillStyle = g;
            ctx.fillRect(x, y - height, w / strands + 1, height);
        }
        glow(ctx, w * (0.3 + k * 0.25), baseY - height * 0.3, long * 0.3, color, 0.12);
    });
    ctx.restore();
}

/** Returns the ridge y(x) samples for a mountain layer. */
function ridgeLine(w, h, layer, seed) {
    const noise = makeNoise(seed);
    const steps = 220;
    const pts = [];
    const freq = layer.freq ?? 2.5;
    const raw = [];
    for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        raw.push(fbm(noise, u * freq + seed * 0.013, layer.octaves ?? 5, layer.ridged ?? 0.6));
    }
    // Stretch to the full range so every layer uses its whole amplitude
    // (averaged octaves otherwise flatten mountains into bands).
    const lo = Math.min(...raw);
    const hi = Math.max(...raw);
    const span = hi - lo || 1;
    raw.forEach((n, s) => {
        const nn = (n - lo) / span;
        pts.push([(s / steps) * w, (layer.y - (nn - 0.35) * (layer.amp ?? 0.25)) * h]);
    });
    return pts;
}

function fillRidge(ctx, w, h, pts, top, bottom) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    pts.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(w, h);
    ctx.closePath();
    const minY = Math.min(...pts.map(p => p[1]));
    ctx.fillStyle = verticalGradient(ctx, minY, h, [[0, top], [1, bottom]]);
    ctx.fill();
}

function drawPines(ctx, w, h, pts, color, density, scale, seed) {
    const r = mulberry32(seed);
    const unit = Math.min(w, h) / 1080;
    ctx.fillStyle = color;
    const count = Math.round(density * w / (unit * 1080) * 60);
    for (let i = 0; i < count; i++) {
        const idx = Math.floor(r() * (pts.length - 1));
        const [x, y] = pts[idx];
        const th = (40 + r() * 70) * scale * unit;
        const tw = th * (0.28 + r() * 0.08);
        const baseY = y + th * 0.25;
        ctx.beginPath();
        // stacked tiers
        const tiers = 4;
        for (let t = 0; t < tiers; t++) {
            const ty = baseY - (th * t) / tiers;
            const tw2 = tw * (1 - t / (tiers + 0.6));
            ctx.moveTo(x - tw2, ty);
            ctx.lineTo(x, ty - th / tiers * 1.8);
            ctx.lineTo(x + tw2, ty);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(x - tw * 0.08, baseY, tw * 0.16, th * 0.2);
    }
}

function drawLandscape(ctx, w, h, spec) {
    const long = Math.max(w, h);
    const seed = spec.seed ?? 7;

    // Sky
    ctx.fillStyle = verticalGradient(ctx, 0, h * (spec.horizon ?? 0.75), spec.sky);
    ctx.fillRect(0, 0, w, h);

    if (spec.stars) drawStars(ctx, w, h, spec.stars, seed, spec.starsMaxY ?? 0.7, spec.starBrightness ?? 1);
    if (spec.milkyWay) drawMilkyWay(ctx, w, h, seed);
    if (spec.aurora) drawAurora(ctx, w, h, spec.aurora, seed + 3);

    if (spec.sun) {
        const [sx, sy, sr, color, glowColor] = spec.sun;
        glow(ctx, sx * w, sy * h, long * sr * 9, glowColor || color, 0.55);
        glow(ctx, sx * w, sy * h, long * sr * 3, glowColor || color, 0.6);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx * w, sy * h, long * sr, 0, Math.PI * 2);
        ctx.fill();
    }

    // Mountain / hill layers, back to front, with atmospheric haze
    const haze = spec.haze || spec.sky[spec.sky.length - 1][1];
    const layers = spec.layers || [];
    let frontPts = null;
    layers.forEach((layer, i) => {
        const pts = ridgeLine(w, h, layer, seed * 13 + i * 101);
        // 0 = nearest layer; the farthest is hazed but never fully dissolved into the sky
        const depth = (layers.length - 1 - i) / Math.max(1, layers.length);
        const top = mix(layer.color, haze, depth * (spec.hazeAmount ?? 0.55));
        const bottom = mix(layer.colorBottom || layer.color, haze, depth * (spec.hazeAmount ?? 0.55) * 0.6);
        fillRidge(ctx, w, h, pts, top, bottom);
        if (layer.snow) {
            // Snow caps only on the high peaks, fading down the slopes
            const ys = pts.map(p => p[1]);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const snowLine = minY + (maxY - minY) * 0.45 + h * layer.snow;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, h);
            pts.forEach(([x, y]) => ctx.lineTo(x, y));
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.clip();
            const snowA = 0.9 * (1 - depth * 0.45);
            ctx.fillStyle = verticalGradient(ctx, minY, snowLine, [[0, rgba(mix('#f8fbff', haze, depth * 0.3), snowA)], [0.7, rgba('#e8f0f8', snowA * 0.5)], [1, rgba('#e8f0f8', 0)]]);
            ctx.fillRect(0, minY, w, snowLine - minY);
            ctx.restore();
        }
        if (layer.pines) {
            // Distant forests are smaller
            const scale = (layer.pinesScale ?? 1) * (0.35 + 0.65 * (1 - depth));
            drawPines(ctx, w, h, pts, layer.pinesColor || mix(top, '#000000', 0.15), layer.pines, scale, seed + i * 7);
        }
        if (layer.mist) {
            const minY = Math.min(...pts.map(p => p[1]));
            const g = verticalGradient(ctx, minY - h * 0.05, minY + h * layer.mist, [
                [0, rgba(haze, 0)], [0.5, rgba(haze, 0.45)], [1, rgba(haze, 0)],
            ]);
            ctx.fillStyle = g;
            ctx.fillRect(0, minY - h * 0.05, w, h * (layer.mist + 0.05));
        }
        frontPts = pts;
    });

    // Water with reflection
    if (spec.water) {
        const wy = spec.water.level * h;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, wy, w, h - wy);
        ctx.clip();
        ctx.translate(0, wy * 2);
        ctx.scale(1, -1);
        ctx.globalAlpha = 0.55;
        // Reflect the sky band near the horizon
        ctx.fillStyle = verticalGradient(ctx, 0, wy, spec.sky);
        ctx.fillRect(0, wy - (h - wy), w, h - wy);
        ctx.restore();

        ctx.fillStyle = verticalGradient(ctx, wy, h, [
            [0, rgba(spec.water.color, 0.45)], [1, rgba(spec.water.deep || spec.water.color, 0.95)],
        ]);
        ctx.fillRect(0, wy, w, h - wy);

        if (spec.sun) {
            const [sx, , sr, color] = spec.sun;
            const r = mulberry32(seed + 99);
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < 70; i++) {
                const t = r();
                const y = wy + Math.pow(t, 1.3) * (h - wy);
                const span = long * sr * (1.2 + t * 4) * (0.4 + r());
                ctx.globalAlpha = (1 - t) * 0.5;
                ctx.fillStyle = color;
                ctx.fillRect(sx * w - span / 2 + (r() - 0.5) * span * 0.4, y, span, Math.max(1, long * 0.0012));
            }
            ctx.restore();
        }
        // Horizon line glow
        ctx.fillStyle = rgba('#ffffff', 0.08);
        ctx.fillRect(0, wy - 1, w, Math.max(1, long * 0.001));
    }

    // Foreground darkening to ground the composition
    const fg = verticalGradient(ctx, h * 0.6, h, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${spec.groundShade ?? 0.25})`]]);
    ctx.fillStyle = fg;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);
    void frontPts;
}

function drawHills(ctx, w, h, spec) {
    ctx.fillStyle = verticalGradient(ctx, 0, h, spec.sky);
    ctx.fillRect(0, 0, w, h);
    if (spec.sun) {
        const [sx, sy, sr, color] = spec.sun;
        glow(ctx, sx * w, sy * h, Math.max(w, h) * sr * 8, color, 0.6);
    }
    const long = Math.max(w, h);
    spec.hills.forEach((hill, i) => {
        const steps = 120;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const y = (hill.y + Math.sin(u * Math.PI * (hill.freq ?? 1.2) + (hill.phase ?? i)) * (hill.amp ?? 0.06)
                + Math.sin(u * Math.PI * 3.1 + i * 2) * 0.012) * h;
            ctx.lineTo(u * w, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, hill.y * h - h * 0.08, w * 0.3, h);
        g.addColorStop(0, hill.colors[0]);
        g.addColorStop(1, hill.colors[1]);
        ctx.fillStyle = g;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
        ctx.shadowBlur = long * 0.03;
        ctx.shadowOffsetY = -long * 0.004;
        ctx.fill();
        ctx.restore();
    });
}

function drawDunes(ctx, w, h, spec) {
    ctx.fillStyle = verticalGradient(ctx, 0, h * 0.7, spec.sky);
    ctx.fillRect(0, 0, w, h);
    if (spec.stars) drawStars(ctx, w, h, spec.stars, spec.seed ?? 3, 0.6, 0.9);
    if (spec.sun) {
        const [sx, sy, sr, color] = spec.sun;
        const long = Math.max(w, h);
        glow(ctx, sx * w, sy * h, long * sr * 8, color, 0.6);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx * w, sy * h, long * sr, 0, Math.PI * 2);
        ctx.fill();
    }
    spec.dunes.forEach((d, i) => {
        const steps = 140;
        const pts = [];
        for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const crest = Math.pow(Math.abs(Math.sin(u * Math.PI * (d.freq ?? 1) + (d.phase ?? i * 1.7))), 0.7);
            pts.push([u * w, (d.y - crest * (d.amp ?? 0.08)) * h]);
        }
        // lit face
        ctx.beginPath();
        ctx.moveTo(0, h);
        pts.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(w, h);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, d.y * h - h * 0.1, w, h);
        g.addColorStop(0, d.light);
        g.addColorStop(1, d.shadow);
        ctx.fillStyle = g;
        ctx.fill();
        // Shade the lower body so each dune reads as a solid form
        ctx.save();
        ctx.clip();
        ctx.fillStyle = verticalGradient(ctx, d.y * h - h * 0.1, h, [[0, 'rgba(0,0,0,0)'], [1, rgba(d.shadow, 0.55)]]);
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    });
}

// ---------------------------------------------------------------- library

const waves = (id, name, bg, bands, extra = {}) => ({ id, name, category: 'macOS', kind: 'waves', bg, bands, ...extra });
const B = (y, colors, amp, freq, phase, tilt) => ({ y, colors, amp, freq, phase, tilt });

const nature = (id, name, spec) => ({ id, name, category: 'Nature', kind: 'landscape', ...spec });
const L = (y, color, amp, extra = {}) => ({ y, color, amp, ...extra });

const mesh = (id, name, colors, category = 'Gradients') => ({ id, name, category, kind: 'mesh', colors });
const linear = (id, name, colors, angle = 135, extra = {}) => ({ id, name, category: 'Minimal', kind: 'linear', colors, angle, ...extra });

export const WALLPAPER_LIBRARY = [
    // ---- macOS-style flowing waves
    waves('bigSur', 'Big Sur', ['#0a1a4a', '#1b3b91'], [
        B(0.38, ['#3b6fe0', '#7a4ce6'], 0.07, 1.1, 0.4, -0.18),
        B(0.52, ['#e0457b', '#ff8a4c'], 0.08, 1.0, 1.9, -0.14),
        B(0.66, ['#ff7a3d', '#ffc15e'], 0.07, 1.2, 3.1, -0.10),
        B(0.80, ['#2a1660', '#120a33'], 0.06, 0.9, 4.4, -0.06),
    ], { glow: [0.75, 0.2, 0.5, '#7aa2ff'] }),
    waves('monterey', 'Monterey', ['#140b33', '#2d1462'], [
        B(0.34, ['#5b3bd6', '#9b5cf0'], 0.08, 1.0, 0.8, -0.2),
        B(0.50, ['#c43b9e', '#f06aa8'], 0.08, 1.1, 2.2, -0.15),
        B(0.64, ['#3c6be8', '#59b8ff'], 0.07, 0.9, 3.6, -0.1),
        B(0.80, ['#1a0e45', '#0c0726'], 0.05, 1.2, 5.0, -0.05),
    ], { glow: [0.2, 0.15, 0.5, '#c084fc'] }),
    waves('ventura', 'Ventura', ['#2a0c2e', '#5a1640'], [
        B(0.36, ['#ff7b2e', '#ffb04a'], 0.09, 0.9, 0.2, -0.16),
        B(0.52, ['#e2385c', '#ff6f61'], 0.08, 1.1, 1.8, -0.12),
        B(0.67, ['#7b2ff7', '#b14aed'], 0.07, 1.0, 3.3, -0.08),
        B(0.82, ['#260b3d', '#14061f'], 0.05, 1.3, 4.7, -0.04),
    ], { glow: [0.8, 0.25, 0.45, '#ffb04a'] }),
    waves('sequoia', 'Sequoia', ['#030b24', '#0a1f52'], [
        B(0.40, ['#1d4ed8', '#3b82f6'], 0.09, 0.8, 1.0, 0.18),
        B(0.55, ['#dc2626', '#f97316'], 0.07, 1.0, 2.6, 0.14),
        B(0.70, ['#7c3aed', '#2563eb'], 0.07, 1.2, 4.0, 0.1),
        B(0.84, ['#0b1030', '#050816'], 0.05, 0.9, 5.4, 0.05),
    ], { glow: [0.3, 0.3, 0.5, '#3b82f6'] }),
    waves('tahoe', 'Tahoe', ['#031a2b', '#06415c'], [
        B(0.38, ['#0ea5e9', '#22d3ee'], 0.08, 1.0, 0.5, -0.15),
        B(0.54, ['#14b8a6', '#2dd4bf'], 0.07, 1.1, 2.0, -0.12),
        B(0.69, ['#2563eb', '#38bdf8'], 0.07, 0.9, 3.5, -0.08),
        B(0.84, ['#04253a', '#02121e'], 0.05, 1.2, 5.1, -0.04),
    ]),
    waves('sonomaWaves', 'Sonoma Flow', ['#0d2a1f', '#1d5a3c'], [
        B(0.38, ['#84cc16', '#d9f99d'], 0.08, 1.0, 0.9, -0.14),
        B(0.54, ['#facc15', '#fde68a'], 0.07, 1.1, 2.4, -0.1),
        B(0.69, ['#10b981', '#34d399'], 0.07, 0.9, 3.8, -0.07),
        B(0.84, ['#0b3324', '#051a12'], 0.05, 1.2, 5.2, -0.04),
    ]),
    waves('peachDawn', 'Peach Dawn', ['#ffd6c2', '#ffb4a2'], [
        B(0.40, ['#ff9a8b', '#ff6a88'], 0.07, 1.0, 0.6, -0.12, ),
        B(0.56, ['#ffc3a0', '#ffafbd'], 0.07, 1.2, 2.2, -0.1),
        B(0.71, ['#c471f5', '#fa71cd'], 0.06, 0.9, 3.7, -0.06),
        B(0.86, ['#6a3093', '#4a1d6b'], 0.05, 1.1, 5.0, -0.03),
    ]),
    waves('midnightFlow', 'Midnight Flow', ['#05060f', '#0d1030'], [
        B(0.42, ['#1e1b4b', '#312e81'], 0.08, 1.0, 0.7, -0.15),
        B(0.58, ['#3730a3', '#4c1d95'], 0.07, 1.1, 2.1, -0.11),
        B(0.73, ['#1e293b', '#0f172a'], 0.06, 0.9, 3.6, -0.07),
    ], { glow: [0.7, 0.2, 0.45, '#6366f1'] }),
    waves('graphite', 'Graphite', ['#0b0b0d', '#1a1a1f'], [
        B(0.42, ['#2a2a31', '#3a3a44'], 0.08, 1.0, 0.9, -0.15),
        B(0.58, ['#1f1f25', '#2b2b33'], 0.07, 1.2, 2.5, -0.1),
        B(0.74, ['#141418', '#0c0c0f'], 0.06, 0.9, 4.0, -0.06),
    ], { glow: [0.25, 0.2, 0.4, '#9ca3af'] }),
    waves('aqua', 'Aqua', ['#0b3a6e', '#1565c0'], [
        B(0.38, ['#4fc3f7', '#81d4fa'], 0.08, 1.0, 0.4, -0.16),
        B(0.54, ['#29b6f6', '#00e5ff'], 0.07, 1.1, 2.0, -0.12),
        B(0.70, ['#1e88e5', '#42a5f5'], 0.07, 0.9, 3.5, -0.08),
        B(0.85, ['#0d47a1', '#082d66'], 0.05, 1.2, 5.0, -0.04),
    ]),
    waves('roseQuartz', 'Rose Quartz', ['#3b1d3a', '#6b2f63'], [
        B(0.38, ['#f9a8d4', '#fbcfe8'], 0.08, 1.0, 0.6, -0.14),
        B(0.54, ['#c4b5fd', '#ddd6fe'], 0.07, 1.1, 2.1, -0.1),
        B(0.70, ['#f472b6', '#e879f9'], 0.07, 0.9, 3.6, -0.07),
        B(0.85, ['#4a1d48', '#2a0f29'], 0.05, 1.2, 5.0, -0.04),
    ]),
    waves('limeDrift', 'Drift Lime', ['#050806', '#0c1a10'], [
        B(0.42, ['#14532d', '#166534'], 0.08, 1.0, 0.8, -0.15),
        B(0.58, ['#65a30d', '#DCFE50'], 0.06, 1.1, 2.3, -0.11, ),
        B(0.73, ['#0f2a18', '#07140b'], 0.06, 0.9, 3.8, -0.07),
    ], { glow: [0.8, 0.25, 0.4, '#DCFE50'] }),

    // ---- macOS-style rolling hills
    { id: 'sonoma', name: 'Sonoma Hills', category: 'macOS', kind: 'hills',
        sky: [[0, '#8ec5fc'], [0.55, '#c9e4ff'], [1, '#fdf6e3']], sun: [0.78, 0.22, 0.06, '#fff4c2'],
        hills: [
            { y: 0.52, colors: ['#a3c47a', '#6b9a4b'], amp: 0.05, freq: 1.1, phase: 0.3 },
            { y: 0.62, colors: ['#e0c36b', '#c19a3a'], amp: 0.06, freq: 1.3, phase: 1.6 },
            { y: 0.73, colors: ['#7fb069', '#4f7f3a'], amp: 0.05, freq: 1.0, phase: 2.8 },
            { y: 0.85, colors: ['#3f6b35', '#2a4a24'], amp: 0.04, freq: 1.4, phase: 4.0 },
        ] },
    { id: 'sonomaDusk', name: 'Sonoma Dusk', category: 'macOS', kind: 'hills',
        sky: [[0, '#2b1b4f'], [0.5, '#8a4f9e'], [1, '#ffb07c']], sun: [0.3, 0.45, 0.07, '#ffcf8a'],
        hills: [
            { y: 0.55, colors: ['#7a4f8c', '#583a6b'], amp: 0.05, freq: 1.2, phase: 0.5 },
            { y: 0.66, colors: ['#c06c84', '#8e4a63'], amp: 0.05, freq: 1.1, phase: 1.9 },
            { y: 0.77, colors: ['#4a2f5e', '#33203f'], amp: 0.05, freq: 1.3, phase: 3.1 },
            { y: 0.88, colors: ['#24162f', '#160d1d'], amp: 0.04, freq: 1.0, phase: 4.4 },
        ] },
    { id: 'springMeadow', name: 'Spring Meadow', category: 'macOS', kind: 'hills',
        sky: [[0, '#a1c4fd'], [1, '#e0f7ea']], sun: [0.2, 0.2, 0.05, '#ffffff'],
        hills: [
            { y: 0.55, colors: ['#b5e48c', '#76c893'], amp: 0.05, freq: 1.0, phase: 0.2 },
            { y: 0.67, colors: ['#99d98c', '#52b69a'], amp: 0.05, freq: 1.3, phase: 1.5 },
            { y: 0.79, colors: ['#52b69a', '#34a0a4'], amp: 0.04, freq: 1.1, phase: 2.9 },
            { y: 0.9, colors: ['#1a759f', '#184e77'], amp: 0.03, freq: 1.4, phase: 4.1 },
        ] },
    { id: 'lavenderHills', name: 'Lavender Hills', category: 'macOS', kind: 'hills',
        sky: [[0, '#fbc2eb'], [1, '#a6c1ee']], sun: [0.72, 0.3, 0.06, '#fff0f6'],
        hills: [
            { y: 0.56, colors: ['#c7a4e8', '#a17fd1'], amp: 0.05, freq: 1.2, phase: 0.4 },
            { y: 0.68, colors: ['#9b72cf', '#7a52b3'], amp: 0.05, freq: 1.0, phase: 1.8 },
            { y: 0.8, colors: ['#6a4c93', '#4e3670'], amp: 0.04, freq: 1.3, phase: 3.2 },
            { y: 0.9, colors: ['#3b2a5a', '#2a1d40'], amp: 0.03, freq: 1.1, phase: 4.5 },
        ] },

    // ---- Nature
    nature('alpineDawn', 'Alpine Dawn', {
        seed: 11, sky: [[0, '#5b7bb4'], [0.55, '#f2a7a0'], [1, '#ffd9b0']], haze: '#f5c4b0',
        sun: [0.7, 0.58, 0.018, '#fff3d6', '#ffb38a'],
        layers: [L(0.5, '#8b8fb8', 0.22), L(0.6, '#6c6f9c', 0.2), L(0.7, '#4b4d78', 0.18, { mist: 0.08 }), L(0.84, '#2a2b4a', 0.12)],
    }),
    nature('sunsetPeaks', 'Sunset Peaks', {
        seed: 23, sky: [[0, '#2d1b69'], [0.45, '#d9467d'], [0.8, '#ff9a5a'], [1, '#ffd29a']], haze: '#ff8c69',
        sun: [0.42, 0.62, 0.03, '#ffe2b0', '#ff7a59'],
        layers: [L(0.55, '#a8487a', 0.24), L(0.65, '#6e2c63', 0.22), L(0.76, '#3e1748', 0.18), L(0.88, '#1c0a24', 0.1)],
    }),
    nature('blueHour', 'Blue Hour', {
        seed: 31, sky: [[0, '#050b24'], [0.6, '#1f3c78'], [1, '#6f8fc9']], haze: '#5a78b5',
        stars: 260, starsMaxY: 0.55, sun: [0.78, 0.2, 0.012, '#f2f5ff', '#9fb6ff'],
        layers: [L(0.58, '#304a82', 0.22), L(0.68, '#1f3361', 0.2), L(0.8, '#111d3d', 0.14), L(0.9, '#070d1f', 0.08)],
    }),
    nature('mistyPines', 'Misty Pines', {
        seed: 41, sky: [[0, '#9aa8a6'], [1, '#d8dfdb']], haze: '#cfd8d4', hazeAmount: 0.7,
        layers: [
            L(0.5, '#7d8f86', 0.18, { pines: 1.2, mist: 0.1 }),
            L(0.62, '#5c7067', 0.16, { pines: 1.4, mist: 0.1 }),
            L(0.75, '#3b4d45', 0.14, { pines: 1.6, pinesScale: 1.3, mist: 0.08 }),
            L(0.88, '#1d2a24', 0.1, { pines: 1.8, pinesScale: 1.7 }),
        ],
    }),
    nature('goldenPines', 'Golden Forest', {
        seed: 43, sky: [[0, '#4f6d9a'], [0.5, '#f6b26b'], [1, '#ffe0a3']], haze: '#f7c27e',
        sun: [0.25, 0.55, 0.025, '#fff1c9', '#ffb35c'],
        layers: [
            L(0.56, '#a0715a', 0.18, { pines: 1, mist: 0.07 }),
            L(0.68, '#6e4a3d', 0.16, { pines: 1.3 }),
            L(0.8, '#3c2a26', 0.12, { pines: 1.6, pinesScale: 1.4 }),
            L(0.9, '#1a1312', 0.08, { pines: 2, pinesScale: 1.8 }),
        ],
    }),
    nature('mirrorLake', 'Mirror Lake', {
        seed: 53, sky: [[0, '#3a6ea5'], [0.6, '#9cc3e6'], [1, '#f3e1c7']], haze: '#c9d8e6',
        sun: [0.6, 0.48, 0.018, '#fff8e6', '#ffd9a0'],
        layers: [L(0.4, '#7e93b0', 0.25, { snow: 0.03 }), L(0.5, '#5b7290', 0.2), L(0.58, '#334a63', 0.12, { pines: 1.4 })],
        water: { level: 0.62, color: '#5f7fa3', deep: '#1c2f45' }, groundShade: 0.15,
    }),
    nature('auroraNight', 'Aurora Night', {
        seed: 61, sky: [[0, '#020812'], [0.6, '#06263a'], [1, '#0b3b45']], haze: '#0a3340',
        stars: 320, starsMaxY: 0.6, aurora: ['#22f5a5', '#3ad1ff', '#a855f7'],
        layers: [L(0.62, '#0b2a33', 0.2, { snow: 0.025 }), L(0.74, '#061a21', 0.16, { pines: 1.4 }), L(0.88, '#020b0e', 0.1, { pines: 1.8, pinesScale: 1.6 })],
    }),
    nature('milkyWay', 'Milky Way', {
        seed: 71, sky: [[0, '#02030a'], [0.7, '#0b1230'], [1, '#232a52']], haze: '#1d2448',
        stars: 700, starsMaxY: 0.85, milkyWay: true,
        layers: [L(0.72, '#0d1128', 0.16), L(0.84, '#05070f', 0.1)],
    }),
    { id: 'desertDunes', name: 'Desert Dunes', category: 'Nature', kind: 'dunes',
        sky: [[0, '#5aa0d8'], [0.6, '#f6c99b'], [1, '#ffe2b8']], sun: [0.75, 0.3, 0.025, '#fff6dc'],
        dunes: [
            { y: 0.62, light: '#e8a96b', shadow: '#b8703d', amp: 0.07, freq: 1.2, phase: 0.4 },
            { y: 0.74, light: '#e09454', shadow: '#a15a2a', amp: 0.08, freq: 0.9, phase: 1.9 },
            { y: 0.87, light: '#cf7d3d', shadow: '#83421c', amp: 0.07, freq: 1.3, phase: 3.0 },
        ] },
    { id: 'moonlitDunes', name: 'Moonlit Dunes', category: 'Nature', kind: 'dunes', seed: 9,
        sky: [[0, '#04081c'], [0.7, '#1b2a5a'], [1, '#3e4f86']], sun: [0.3, 0.25, 0.018, '#eef2ff'], stars: 300,
        dunes: [
            { y: 0.64, light: '#4a5a8c', shadow: '#26305a', amp: 0.07, freq: 1.1, phase: 0.6 },
            { y: 0.76, light: '#38467a', shadow: '#1a2146', amp: 0.08, freq: 0.9, phase: 2.2 },
            { y: 0.88, light: '#262f5c', shadow: '#0f1430', amp: 0.06, freq: 1.3, phase: 3.4 },
        ] },
    nature('oceanSunset', 'Ocean Sunset', {
        seed: 81, sky: [[0, '#1b2a6b'], [0.45, '#c1477d'], [0.75, '#ff8f5e'], [1, '#ffd08a']], haze: '#ff9e6e',
        sun: [0.5, 0.6, 0.035, '#ffe8b8', '#ff8a5c'],
        layers: [], water: { level: 0.63, color: '#c86a6a', deep: '#2a1840' }, groundShade: 0.2,
    }),
    nature('tropicalDusk', 'Tropical Dusk', {
        seed: 83, sky: [[0, '#3a0f5c'], [0.5, '#ff3d7f'], [0.85, '#ffb35c'], [1, '#ffe19a']], haze: '#ff7a7a',
        sun: [0.3, 0.6, 0.03, '#fff0c2', '#ff6b6b'],
        layers: [L(0.6, '#4a1a52', 0.08, { freq: 1.6, ridged: 0.2 })],
        water: { level: 0.64, color: '#d65a7a', deep: '#2b0f3d' }, groundShade: 0.2,
    }),
    nature('glacier', 'Glacier', {
        seed: 91, sky: [[0, '#6aa7d8'], [0.6, '#cfe8f7'], [1, '#f2fbff']], haze: '#e6f4fb', hazeAmount: 0.45,
        layers: [L(0.5, '#a9c8de', 0.26, { snow: 0.04 }), L(0.62, '#7ea6c4', 0.22, { snow: 0.035 }), L(0.75, '#4f7898', 0.16, { snow: 0.02 }), L(0.88, '#264a63', 0.1)],
    }),
    nature('redCanyon', 'Red Canyon', {
        seed: 101, sky: [[0, '#4e7bb5'], [0.6, '#f0b48a'], [1, '#ffd3a8']], haze: '#e9a07a',
        layers: [L(0.52, '#c9744f', 0.14, { ridged: 0.9, octaves: 3, freq: 4 }), L(0.63, '#a8533a', 0.15, { ridged: 0.9, octaves: 3, freq: 3.5 }), L(0.75, '#7c3424', 0.14, { ridged: 0.9, octaves: 3, freq: 3 }), L(0.87, '#4a1c14', 0.1, { ridged: 0.8 })],
    }),
    nature('autumnValley', 'Autumn Valley', {
        seed: 111, sky: [[0, '#587fb0'], [0.6, '#f3c58f'], [1, '#fde7c4']], haze: '#f0c89c',
        sun: [0.82, 0.42, 0.022, '#fff3d4', '#ffbf70'],
        layers: [
            L(0.54, '#c98a5a', 0.16, { pines: 0.8, pinesColor: '#a0603b', mist: 0.06 }),
            L(0.66, '#b5582f', 0.15, { pines: 1.2, pinesColor: '#8a3d1f' }),
            L(0.78, '#7d3a1e', 0.12, { pines: 1.5, pinesColor: '#5c2814', pinesScale: 1.3 }),
            L(0.9, '#3d1c0e', 0.08, { pines: 1.8, pinesColor: '#2a1209', pinesScale: 1.7 }),
        ],
    }),
    nature('volcanicDusk', 'Volcanic Dusk', {
        seed: 121, sky: [[0, '#0d0306'], [0.55, '#5c0f12'], [1, '#e2491f']], haze: '#b8321a',
        sun: [0.55, 0.7, 0.02, '#ffd28a', '#ff5a1f'],
        layers: [L(0.62, '#3d0d10', 0.3, { ridged: 0.9, freq: 1.4 }), L(0.76, '#1f0608', 0.2, { ridged: 0.8 }), L(0.9, '#080203', 0.1)],
    }),
    nature('emeraldFjord', 'Emerald Fjord', {
        seed: 131, sky: [[0, '#4d7f9e'], [0.6, '#a9d1d8'], [1, '#e6f2ee']], haze: '#bcd9d6',
        layers: [L(0.38, '#5f8f7e', 0.3, { ridged: 0.8 }), L(0.48, '#3f7262', 0.26, { ridged: 0.8, pines: 0.8 }), L(0.56, '#1f4d40', 0.14, { pines: 1.4 })],
        water: { level: 0.6, color: '#3f7f78', deep: '#0f2f2e' }, groundShade: 0.15,
    }),
    nature('cherryDawn', 'Cherry Dawn', {
        seed: 141, sky: [[0, '#ffc6d9'], [0.6, '#ffe3ec'], [1, '#fff6e9']], haze: '#ffd9e4', hazeAmount: 0.65,
        sun: [0.7, 0.42, 0.03, '#ffffff', '#ffd1dc'],
        layers: [L(0.55, '#e7a8c3', 0.18), L(0.66, '#c98bb0', 0.16, { mist: 0.08 }), L(0.78, '#9a6a95', 0.12), L(0.9, '#5f4369', 0.08)],
    }),
    nature('arcticLights', 'Arctic Lights', {
        seed: 151, sky: [[0, '#050314'], [0.6, '#1a0f3d'], [1, '#2b1d5c']], haze: '#2d2463',
        stars: 300, starsMaxY: 0.55, aurora: ['#ff5ec4', '#7c5cff', '#38bdf8'],
        layers: [L(0.55, '#21195a', 0.22, { snow: 0.03 })],
        water: { level: 0.66, color: '#2b2370', deep: '#07051a' }, groundShade: 0.2,
    }),
    nature('goldenHour', 'Golden Hour', {
        seed: 161, sky: [[0, '#6d8fc7'], [0.45, '#f7c873'], [1, '#ffe7b0']], haze: '#f9cf86',
        sun: [0.35, 0.56, 0.03, '#fff6dc', '#ffc95c'],
        layers: [L(0.58, '#c9955a', 0.16, { mist: 0.06 }), L(0.69, '#9a6a3d', 0.14), L(0.8, '#634325', 0.11), L(0.91, '#2e1f12', 0.07)],
    }),
    nature('moonlitLake', 'Moonlit Lake', {
        seed: 171, sky: [[0, '#030817'], [0.6, '#12224a'], [1, '#2e4778']], haze: '#26406e',
        stars: 280, starsMaxY: 0.5, sun: [0.65, 0.22, 0.016, '#f4f6ff', '#9fb5ff'],
        layers: [L(0.46, '#1a2c55', 0.24, { snow: 0.02 }), L(0.56, '#0e1a36', 0.14, { pines: 1.3 })],
        water: { level: 0.6, color: '#1c3260', deep: '#040a1a' }, groundShade: 0.2,
    }),
    nature('foggyHighlands', 'Foggy Highlands', {
        seed: 181, sky: [[0, '#b7c2c9'], [1, '#e8ecee']], haze: '#e2e7ea', hazeAmount: 0.8,
        layers: [L(0.48, '#97a6ae', 0.16, { mist: 0.12 }), L(0.58, '#7a8b94', 0.16, { mist: 0.12 }), L(0.69, '#5d6f79', 0.14, { mist: 0.1 }), L(0.8, '#43545e', 0.12, { mist: 0.08 }), L(0.91, '#2a3840', 0.08)],
    }),
    nature('purpleMountains', 'Purple Majesty', {
        seed: 191, sky: [[0, '#1d1145'], [0.5, '#7b3fa0'], [1, '#f08cb6']], haze: '#c770a8',
        sun: [0.6, 0.6, 0.02, '#ffe4f0', '#ff9ccf'],
        layers: [L(0.5, '#8a4fa8', 0.26, { snow: 0.025 }), L(0.62, '#5f2f85', 0.22), L(0.74, '#3a1a5c', 0.16), L(0.87, '#1a0b2e', 0.1)],
    }),
    nature('tealDusk', 'Teal Dusk', {
        seed: 201, sky: [[0, '#0b2233'], [0.55, '#1f6f78'], [1, '#f2b880']], haze: '#6fa89c',
        sun: [0.2, 0.62, 0.022, '#fff0cf', '#ffc27a'],
        layers: [L(0.58, '#2f6f73', 0.2), L(0.69, '#1d4f55', 0.17, { pines: 1 }), L(0.81, '#0f3036', 0.12, { pines: 1.4, pinesScale: 1.3 }), L(0.92, '#05171a', 0.07)],
    }),

    // ---- Gradients (soft mesh)
    mesh('midnight', 'Midnight', WALLPAPERS.midnight),
    mesh('obsidian', 'Obsidian', WALLPAPERS.obsidian),
    mesh('cosmicMeshGlow', 'Cosmic', WALLPAPERS.cosmicMesh),
    mesh('auroraMesh', 'Aurora', WALLPAPERS.auroraFlow),
    mesh('oceanMesh', 'Ocean', WALLPAPERS.oceanBreeze),
    mesh('deepSpaceMesh', 'Deep Space', WALLPAPERS.deepSpace),
    mesh('hyperMesh', 'Hyper Glow', WALLPAPERS.hyperGlow),
    mesh('pastelMesh', 'Pastel', WALLPAPERS.pastelDream),
    mesh('velvetMesh', 'Velvet', WALLPAPERS.velvetHaze),
    mesh('duskMesh', 'Neon Dusk', WALLPAPERS.neonDusk),
    mesh('fluidMesh', 'Fluid', WALLPAPERS.abstractFluid),
    mesh('bloom', 'Bloom', WALLPAPERS.bloom),
    mesh('emerald', 'Emerald', WALLPAPERS.emerald),
    mesh('cyberpunk', 'Cyberpunk', WALLPAPERS.cyberpunk),
    mesh('neonDrift', 'Drift Lime', WALLPAPERS.neonDrift),
    mesh('sunsetMesh', 'Sunset', WALLPAPERS.sunsetPrism),
    mesh('mint', 'Mint', ['#0b3d3a', '#2dd4bf', '#a7f3d0', '#0ea5e9']),
    mesh('candy', 'Candy', ['#3b0a45', '#ff6ec4', '#7873f5', '#ffd86f']),
    mesh('arctic', 'Arctic', ['#0b1d33', '#7dd3fc', '#e0f2fe', '#818cf8']),
    mesh('ember', 'Ember', ['#1a0505', '#dc2626', '#f59e0b', '#7c2d12']),

    // ---- Minimal
    linear('charcoal', 'Charcoal', ['#1c1c21', '#0b0b0e'], 160),
    linear('slate', 'Slate', ['#334155', '#0f172a'], 150),
    linear('deepNavy', 'Deep Navy', ['#0f1d3d', '#050a18'], 145, { glow: [0.8, 0.15, 0.6, '#3b82f6', 0.25] }),
    linear('paper', 'Paper', ['#f5f5f4', '#e7e5e4'], 160),
    linear('warmSand', 'Warm Sand', ['#efe3d0', '#d9c3a3'], 150),
    linear('plum', 'Plum', ['#3b1d4a', '#140a1c'], 150, { glow: [0.2, 0.2, 0.6, '#a855f7', 0.25] }),
];

const LIBRARY_BY_ID = new Map(WALLPAPER_LIBRARY.map(w => [w.id, w]));

export const WALLPAPER_CATEGORIES = ['macOS', 'Nature', 'Gradients', 'Minimal'];

export function getWallpaper(id) {
    return LIBRARY_BY_ID.get(id) || null;
}

/**
 * Paint a wallpaper by id (falls back to a mesh palette from stage.WALLPAPERS).
 * Returns true if something was drawn.
 */
export function drawWallpaper(ctx, width, height, id) {
    const spec = LIBRARY_BY_ID.get(id);
    ctx.save();
    try {
        if (!spec) {
            drawMeshBackground(ctx, width, height, WALLPAPERS[id] || WALLPAPERS.bigSur);
        } else if (spec.kind === 'waves') {
            drawWaves(ctx, width, height, spec);
        } else if (spec.kind === 'hills') {
            drawHills(ctx, width, height, spec);
        } else if (spec.kind === 'landscape') {
            drawLandscape(ctx, width, height, spec);
        } else if (spec.kind === 'dunes') {
            drawDunes(ctx, width, height, spec);
        } else if (spec.kind === 'linear') {
            drawLinear(ctx, width, height, spec);
        } else {
            drawMeshBackground(ctx, width, height, spec.colors);
        }
    } finally {
        ctx.restore();
    }
    return true;
}
