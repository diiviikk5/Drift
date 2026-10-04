/**
 * stage — canvas layout and backdrop for the studio compositor.
 *
 * Everything is expressed in resolution-independent units (1 unit = 1px on a
 * 1080p canvas, scaled by the canvas' short side), so a 720p preview, a 4K
 * export and a 9:16 short all look like the same design.
 */

/** Wallpaper palettes (first colour is the base/darkest tone). */
export const WALLPAPERS = {
    midnight: ['#090d16', '#111827', '#1f2937', '#334155'],
    driftLime: ['#061a0d', '#0d3319', '#14532d', '#DCFE50'],
    neonDrift: ['#061a0d', '#0d3319', '#14532d', '#DCFE50'],
    cosmicMesh: ['#1a0638', '#4A00E0', '#8E2DE2', '#F000FF'],
    sunsetPrism: ['#3a0d22', '#FF512F', '#DD2476', '#FF9966'],
    auroraFlow: ['#12052a', '#2E0854', '#8A2BE2', '#00FFFF'],
    oceanBreeze: ['#0b1440', '#1D2671', '#0072ff', '#00c6ff'],
    deepSpace: ['#000000', '#130CB7', '#52E5E7', '#0a0a2a'],
    hyperGlow: ['#2a0018', '#FF0844', '#7F00FF', '#FFB199'],
    pastelDream: ['#f6d5e0', '#FFAFBD', '#C9FFBF', '#FFC3A0'],
    velvetHaze: ['#120012', '#200122', '#6f0000', '#3f0c35'],
    neonDusk: ['#2a0700', '#8e0e00', '#f12711', '#f5af19'],
    abstractFluid: ['#2a1a4a', '#654ea3', '#5b247a', '#eaafc8'],
    dawn: ['#1b2a5a', '#2d60b3', '#d14545', '#ebae42', '#e27b38'],
    dusk: ['#140f3a', '#181f62', '#591e77', '#c73a4c', '#93226a'],
    sunset: ['#1d0f3e', '#3b1c6e', '#e2385c', '#f19e38', '#e55d28'],
    bloom: ['#1b1446', '#6930c3', '#5390d9', '#48bfe3', '#4ea8de'],
    harbor: ['#0f1d33', '#1d3557', '#457b9d', '#a8dadc'],
    emerald: ['#011a14', '#022c22', '#064e3b', '#10b981', '#059669'],
    obsidian: ['#050505', '#0a0a0c', '#121214', '#232329'],
    cyberpunk: ['#0f051d', '#3b0764', '#701a75', '#0284c7'],
};

// Pleasing, asymmetric blob anchors (normalized). Work for any aspect ratio
// because radii are based on the canvas' long side.
const BLOB_ANCHORS = [
    [0.12, 0.18, 0.78],
    [0.88, 0.12, 0.72],
    [0.82, 0.88, 0.80],
    [0.18, 0.92, 0.70],
    [0.55, 0.45, 0.55],
];

/** CSS approximation of drawMeshBackground, for swatches in the UI. */
export function meshCss(colors) {
    const palette = colors && colors.length ? colors : WALLPAPERS.dawn;
    const layers = palette.slice(1).map((color, i) => {
        const [ax, ay] = BLOB_ANCHORS[i % BLOB_ANCHORS.length];
        return `radial-gradient(circle at ${Math.round(ax * 100)}% ${Math.round(ay * 100)}%, ${rgba(color, 0.95)} 0%, ${rgba(color, 0)} 70%)`;
    });
    layers.push(`linear-gradient(135deg, ${palette[0]}, ${palette[Math.min(1, palette.length - 1)]})`);
    return layers.join(', ');
}

function hexToRgb(hex) {
    let h = String(hex || '#000').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return Number.isFinite(n) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : [0, 0, 0];
}

function rgba(hex, a) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

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

/**
 * Paint a soft mesh-gradient wallpaper (layered radial light blobs over a
 * tonal base, subtle vignette). Deterministic for a given palette.
 */
export function drawMeshBackground(ctx, width, height, colors) {
    const palette = colors && colors.length ? colors : WALLPAPERS.dawn;
    const long = Math.max(width, height);

    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, palette[0]);
    base.addColorStop(1, palette[Math.min(1, palette.length - 1)]);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    const blobs = palette.slice(1);
    blobs.forEach((color, i) => {
        const [ax, ay, ar] = BLOB_ANCHORS[i % BLOB_ANCHORS.length];
        const x = ax * width;
        const y = ay * height;
        const r = ar * long;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(color, 0.95));
        g.addColorStop(0.45, rgba(color, 0.55));
        g.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
    });

    // Gentle vignette keeps the eye on the recording.
    const v = ctx.createRadialGradient(width / 2, height / 2, long * 0.25, width / 2, height / 2, long * 0.8);
    v.addColorStop(0, 'rgba(0, 0, 0, 0)');
    v.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, width, height);
}

let _grain = null;
/** Seeded film grain tile — breaks up gradient banding in 8-bit exports. */
export function getGrainPattern(ctx) {
    if (_grain) return _grain;
    if (typeof document === 'undefined' && typeof OffscreenCanvas === 'undefined') return null;
    try {
        const size = 192;
        const c = typeof OffscreenCanvas !== 'undefined'
            ? new OffscreenCanvas(size, size)
            : Object.assign(document.createElement('canvas'), { width: size, height: size });
        const g = c.getContext('2d');
        const img = g.createImageData(size, size);
        const rand = mulberry32(1337);
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.floor(rand() * 255);
            img.data[i] = v;
            img.data[i + 1] = v;
            img.data[i + 2] = v;
            img.data[i + 3] = 11;
        }
        g.putImageData(img, 0, 0);
        _grain = ctx.createPattern(c, 'repeat');
        return _grain;
    } catch {
        return null;
    }
}

/**
 * Compute the stage layout.
 *
 * @param {number} width canvas width
 * @param {number} height canvas height
 * @param {number} srcW source video width
 * @param {number} srcH source video height
 * @param {Object} opts
 *   insetPadding  fraction of the canvas short side used as padding (uniform on all sides)
 *   windowChrome  draw a title bar
 *   titleBarHeight in units
 *   borderRadius  in units
 *   frameFit      'contain' (letterbox the whole recording) | 'fill' (frame fills the
 *                 canvas, the recording is cropped and the camera reframes it)
 */
export function computeStageLayout(width, height, srcW, srcH, opts = {}) {
    const unit = Math.max(0.25, Math.min(width, height) / 1080);
    const insetPadding = Math.max(0, opts.insetPadding ?? 0.08);
    const fill = opts.frameFit === 'fill';
    const fullBleed = insetPadding <= 0.001;
    const headerH = opts.windowChrome && !fullBleed ? Math.round((opts.titleBarHeight ?? 34) * unit) : 0;
    const pad = fullBleed ? 0 : insetPadding * Math.min(width, height);
    const srcAspect = srcW > 0 && srcH > 0 ? srcW / srcH : 16 / 9;

    const availW = Math.max(1, width - pad * 2);
    const availH = Math.max(1, height - pad * 2 - headerH);

    let videoW;
    let videoH;
    if (fill) {
        videoW = availW;
        videoH = availH;
    } else if (availW / availH > srcAspect) {
        videoH = availH;
        videoW = videoH * srcAspect;
    } else {
        videoW = availW;
        videoH = videoW / srcAspect;
    }

    const frameW = videoW;
    const frameH = videoH + headerH;
    const padX = (width - frameW) / 2;
    const padY = (height - frameH) / 2;

    // Content (the full source, drawn at its own aspect) covers the video area.
    const areaAspect = videoW / videoH;
    const cropKx = fill && srcAspect > areaAspect ? srcAspect / areaAspect : 1;
    const cropKy = fill && srcAspect < areaAspect ? areaAspect / srcAspect : 1;
    const contentW = videoW * cropKx;
    const contentH = videoH * cropKy;

    const radius = fullBleed ? 0 : Math.min((opts.borderRadius ?? 18) * unit, Math.min(frameW, frameH) / 2);

    return {
        unit,
        padX,
        padY,
        frameW,
        frameH,
        headerH,
        videoW,
        videoH,
        contentW,
        contentH,
        cropKx,
        cropKy,
        radius,
        fullBleed,
    };
}
