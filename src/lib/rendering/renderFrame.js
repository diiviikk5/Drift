/**
 * renderFrame — Deterministic Unified Screen Studio Compositor Pipeline
 * 
 * Shared 1:1 between interactive Studio Preview and offline WebCodecs / MP4 export.
 * Pure stateless rendering of background, framing, camera spring transforms,
 * click ripple waves, and synthetic sub-pixel cursor.
 */

// Gradient wallpaper palettes
export const WALLPAPERS = {
    midnight: ['#090d16', '#111827', '#1f2937', '#0f172a'],
    driftLime: ['#061a0d', '#0d3319', '#14532d', '#DCFE50'],
    neonDrift: ['#061a0d', '#0d3319', '#14532d', '#DCFE50'],
    cosmicMesh: ['#4A00E0', '#8E2DE2', '#F000FF'],
    sunsetPrism: ['#FF512F', '#DD2476', '#FF9966'],
    auroraFlow: ['#2E0854', '#8A2BE2', '#00FFFF'],
    oceanBreeze: ['#00c6ff', '#0072ff', '#1D2671'],
    deepSpace: ['#000000', '#130CB7', '#52E5E7'],
    hyperGlow: ['#FF0844', '#FFB199', '#7F00FF'],
    pastelDream: ['#FFAFBD', '#C9FFBF', '#FFC3A0'],
    velvetHaze: ['#200122', '#6f0000', '#3f0c35'],
    neonDusk: ['#f12711', '#f5af19', '#8e0e00'],
    abstractFluid: ['#654ea3', '#eaafc8', '#5b247a'],
    bigSur: ['#d14545', '#e27b38', '#ebae42', '#2d60b3'],
    monterey: ['#591e77', '#93226a', '#c73a4c', '#181f62'],
    ventura: ['#e55d28', '#f19e38', '#e2385c', '#3b1c6e'],
    bloom: ['#6930c3', '#5390d9', '#4ea8de', '#48bfe3'],
    sonoma: ['#1d3557', '#457b9d', '#a8dadc', '#1d3557'],
    emerald: ['#059669', '#10b981', '#064e3b', '#022c22'],
    obsidian: ['#050505', '#121214', '#18181b', '#0a0a0c'],
    cyberpunk: ['#0f051d', '#3b0764', '#701a75', '#0284c7'],
};

/**
 * Cap physical spring-mass-damper easing (k=200, d=40, m=2.25)
 */
export function capSpringEase(t, stiffness = 200, damping = 40, mass = 2.25) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const omega0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    if (zeta < 1) {
        const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
        const decay = Math.exp(-zeta * omega0 * t);
        return 1 - decay * (Math.cos(omegaD * t) + (zeta * omega0 / omegaD) * Math.sin(omegaD * t));
    } else {
        const decay = Math.exp(-omega0 * t);
        return 1 - decay * (1 + omega0 * t);
    }
}

/**
 * OpenScreen / Screen Studio Cubic Bezier easing (0.1, 0.0, 0.2, 1.0)
 */
export function cubicBezier(p1x, p1y, p2x, p2y, t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const ax = 1 - 3 * p2x + 3 * p1x;
    const bx = 3 * p2x - 6 * p1x;
    const cx = 3 * p1x;
    const sampleCurveX = (u) => ((ax * u + bx) * u + cx) * u;
    const sampleCurveY = (u) => (((1 - 3 * p2y + 3 * p1y) * u + (3 * p2y - 6 * p1y)) * u + 3 * p1y) * u;

    let u = t;
    for (let i = 0; i < 6; i++) {
        const x = sampleCurveX(u) - t;
        if (Math.abs(x) < 1e-4) break;
        const d = (3 * ax * u + 2 * bx) * u + cx;
        if (Math.abs(d) < 1e-5) break;
        u -= x / d;
    }
    return Math.max(0, Math.min(1, sampleCurveY(u)));
}

export function easeOutScreenStudio(t) {
    return cubicBezier(0.1, 0.0, 0.2, 1.0, t);
}

export function easeConnectedPan(t) {
    return cubicBezier(0.1, 0.0, 0.2, 1.0, t);
}

/**
 * Reactive Webcam Scaling (from OpenScreen / Recordly)
 * Inversely scales the webcam PiP so deep zoom keeps the camera out of the way.
 */
export function reactiveWebcamScale(zoomScale) {
    const safe = Number.isFinite(zoomScale) && zoomScale > 0 ? zoomScale : 1;
    return Math.max(0.35, Math.min(1.0, 1.0 / safe));
}

/**
 * 3D Isometric Perspective Tilt
 * Tilts canvas during pans toward screen corners for commercial demo finish
 */
export function calculate3DTilt(cameraX, cameraY, scale, maxTiltDeg = 3.5) {
    if (!scale || scale <= 1.05) return { rotateX: 0, rotateY: 0 };
    const offsetX = (cameraX ?? 0.5) - 0.5;
    const offsetY = (cameraY ?? 0.5) - 0.5;
    const zoomStrength = Math.min(1.0, (scale - 1.0) / 1.2);
    return {
        rotateX: -offsetY * maxTiltDeg * zoomStrength,
        rotateY: offsetX * maxTiltDeg * zoomStrength,
    };
}

/**
 * Smooth Hermite / Quintic interpolation fallback
 */
function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Evaluate camera target and zoom at precise timestamp
 * Implements OpenScreen's connected zoom pans, Cap's spring solver, & safe viewport lock
 */
export function evaluateCameraAtTime(timeSec, focusSegments = [], mouseSamples = [], options = {}) {
    const zoomMultiplier = options.zoomMultiplier ?? 1.0;
    let transitionDuration = options.transitionDuration ?? 0.7; // seconds for smooth zoom ramp
    if (options.springProfile === 'snappy') transitionDuration = 0.42;
    else if (options.springProfile === 'cinematic') transitionDuration = 0.85;
    else if (options.springProfile === 'natural') transitionDuration = 0.65;
    const CHAINED_PAN_GAP_SEC = 1.5; // OpenScreen chained pan threshold

    if (!focusSegments || focusSegments.length === 0) {
        return { x: 0.5, y: 0.5, scale: 1.0, rotateX: 0, rotateY: 0 };
    }

    // Sort segments chronologically
    const sorted = [...focusSegments].sort((a, b) => a.startTime - b.startTime);

    // 1. Check if we are inside a connected gap between two consecutive zoom regions
    for (let i = 0; i < sorted.length - 1; i++) {
        const segA = sorted[i];
        const segB = sorted[i + 1];
        const gap = segB.startTime - segA.endTime;

        if (options.connectedZooms !== false && gap >= 0 && gap <= CHAINED_PAN_GAP_SEC &&
            !['overview', 'spotlight', 'full-camera'].includes(segA.sceneMode) &&
            !['overview', 'spotlight', 'full-camera'].includes(segB.sceneMode)) {
            if (timeSec >= segA.endTime && timeSec <= segB.startTime) {
                // Inside connected pan gap! Stay zoomed in and glide between targets
                const panProgress = gap <= 0.001 ? 1 : Math.max(0, Math.min(1, (timeSec - segA.endTime) / gap));
                const easedPan = easeConnectedPan(panProgress);

                const scaleA = (segA.zoomScale ?? 1.8) * zoomMultiplier;
                const scaleB = (segB.zoomScale ?? 1.8) * zoomMultiplier;
                const connectedScale = scaleA + (scaleB - scaleA) * easedPan;

                const startX = segA.targetX ?? 0.5;
                const endX = segB.targetX ?? 0.5;
                const startY = segA.targetY ?? 0.5;
                const endY = segB.targetY ?? 0.5;

                const panX = startX + (endX - startX) * easedPan;
                const panY = startY + (endY - startY) * easedPan;

                const halfW = 0.5 / connectedScale;
                const halfH = 0.5 / connectedScale;
                const clampedX = Math.max(halfW, Math.min(1.0 - halfW, panX));
                const clampedY = Math.max(halfH, Math.min(1.0 - halfH, panY));

                const tilt = calculate3DTilt(clampedX, clampedY, connectedScale, options.tiltAngle ?? 3.5);

                return {
                    x: clampedX,
                    y: clampedY,
                    scale: connectedScale,
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                    activeSeg: segA,
                    isConnectedPan: true,
                };
            }
        }
    }

    // 2. Find active focus segment
    let activeSeg = null;
    let blendWeight = 0;

    for (let i = 0; i < sorted.length; i++) {
        const seg = sorted[i];
        const nextSeg = sorted[i + 1];
        const canConnect = (a, b) => options.connectedZooms !== false && a && b &&
            b.startTime >= a.endTime && b.startTime - a.endTime <= CHAINED_PAN_GAP_SEC &&
            !['overview', 'spotlight', 'full-camera'].includes(a.sceneMode) &&
            !['overview', 'spotlight', 'full-camera'].includes(b.sceneMode);
        const hasConnectedNext = canConnect(seg, nextSeg);
        const hasConnectedPrevious = canConnect(sorted[i - 1], seg);
        const rampDuration = Math.min(transitionDuration, (seg.endTime - seg.startTime) / 2);

        const leadIn = seg.startTime;
        const rampUpEnd = seg.startTime + rampDuration;
        const rampDownStart = seg.endTime - rampDuration;
        const leadOut = seg.endTime;

        if (timeSec >= leadIn && timeSec <= leadOut) {
            activeSeg = seg;
            if (timeSec < rampUpEnd && !hasConnectedPrevious) {
                // Zooming in with Screen Studio cubic bezier easing
                const progress = Math.max(0, Math.min(1, (timeSec - leadIn) / rampDuration));
                blendWeight = easeOutScreenStudio(progress);
            } else if (timeSec > rampDownStart && !hasConnectedNext) {
                // Zooming out (only if not chained into next segment)
                const progress = Math.max(0, Math.min(1, (leadOut - timeSec) / rampDuration));
                blendWeight = easeOutScreenStudio(progress);
            } else {
                // Fully zoomed in or chained
                blendWeight = 1.0;
            }
            break;
        }
    }

    if (!activeSeg || blendWeight <= 0.001) {
        return { x: 0.5, y: 0.5, scale: 1.0, rotateX: 0, rotateY: 0, activeSeg: null };
    }

    // Scene Mode: Spotlight and Overview keep screen framing unzoomed
    if (activeSeg.sceneMode === 'spotlight' || activeSeg.sceneMode === 'overview' || activeSeg.sceneMode === 'full-camera') {
        return {
            x: 0.5,
            y: 0.5,
            scale: 1.0,
            rotateX: 0,
            rotateY: 0,
            activeSeg,
        };
    }

    // Target zoom scale
    const targetScale = 1.0 + (Math.max(1, (activeSeg.zoomScale ?? 1.8) * zoomMultiplier) - 1.0) * blendWeight;
    const halfW = 0.5 / targetScale;
    const halfH = 0.5 / targetScale;

    let targetX = activeSeg.targetX ?? 0.5;
    let targetY = activeSeg.targetY ?? 0.5;

    // Cap Safe Viewport Lock:
    // When zoomed in, if cursor is anywhere inside the visible screen viewport,
    // the camera STAYS ROCK SOLID FROZEN so the audience never feels seasick.
    if (mouseSamples && mouseSamples.length > 0 && blendWeight > 0.25) {
        const cursor = getInterpolatedCursor(timeSec, mouseSamples);
        if (cursor) {
            const marginW = halfW * 0.75;
            const marginH = halfH * 0.75;
            const isInsideSafe = 
                cursor.x >= (targetX - marginW) &&
                cursor.x <= (targetX + marginW) &&
                cursor.y >= (targetY - marginH) &&
                cursor.y <= (targetY + marginH);

            if (!isInsideSafe) {
                // Cursor moved beyond safe window: gently nudge viewport
                if (cursor.x < targetX - marginW) {
                    targetX = cursor.x + marginW;
                } else if (cursor.x > targetX + marginW) {
                    targetX = cursor.x - marginW;
                }

                if (cursor.y < targetY - marginH) {
                    targetY = cursor.y + marginH;
                } else if (cursor.y > targetY + marginH) {
                    targetY = cursor.y - marginH;
                }
            }
        }
    }

    // Blend camera position from neutral (0.5, 0.5) to target (targetX, targetY)
    const curX = 0.5 + (targetX - 0.5) * blendWeight;
    const curY = 0.5 + (targetY - 0.5) * blendWeight;

    // Strict boundary clamping so screen background is never exposed
    const clampedX = Math.max(halfW, Math.min(1.0 - halfW, curX));
    const clampedY = Math.max(halfH, Math.min(1.0 - halfH, curY));

    const tilt = calculate3DTilt(clampedX, clampedY, targetScale, options.tiltAngle ?? 3.5);

    return {
        x: clampedX,
        y: clampedY,
        scale: targetScale,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        activeSeg,
    };
}

/**
 * Binary search cursor sample interpolation for sub-pixel smooth pointer path
 */
export function getInterpolatedCursor(timeSec, mouseSamples = [], options = {}) {
    if (!mouseSamples || mouseSamples.length === 0) return null;

    const timeMs = timeSec * 1000;

    let low = 0;
    let high = mouseSamples.length - 1;

    const normX = (s) => (s.x > 1 ? s.x / 1920 : s.x);
    const normY = (s) => (s.y > 1 ? s.y / 1080 : s.y);

    if (timeMs <= (mouseSamples[0].time ?? mouseSamples[0].t ?? 0)) {
        const s = mouseSamples[0];
        return { x: normX(s), y: normY(s) };
    }
    if (timeMs >= (mouseSamples[high].time ?? mouseSamples[high].t ?? 0)) {
        const s = mouseSamples[high];
        return { x: normX(s), y: normY(s) };
    }

    while (low <= high) {
        const mid = (low + high) >> 1;
        const tMid = mouseSamples[mid].time ?? mouseSamples[mid].t ?? 0;

        if (tMid < timeMs) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const i1 = Math.max(0, low - 1);
    const i2 = Math.min(mouseSamples.length - 1, low);

    const prev = mouseSamples[i1];
    const next = mouseSamples[i2];

    const tPrev = prev.time ?? prev.t ?? 0;
    const tNext = next.time ?? next.t ?? 0;
    const alpha = tNext === tPrev ? 0 : Math.max(0, Math.min(1, (timeMs - tPrev) / (tNext - tPrev)));

    const p1x = normX(prev);
    const p1y = normY(prev);
    const p2x = normX(next);
    const p2y = normY(next);

    // If only 2 samples, or long pause (>350ms), or spline explicitly disabled, use linear
    if (mouseSamples.length < 3 || (tNext - tPrev) > 350 || options.spline === false) {
        return {
            x: p1x + (p2x - p1x) * alpha,
            y: p1y + (p2y - p1y) * alpha,
        };
    }

    // 4-point Catmull-Rom Spline for silky smooth organic mouse trajectories
    const i0 = Math.max(0, i1 - 1);
    const i3 = Math.min(mouseSamples.length - 1, i2 + 1);

    const p0 = mouseSamples[i0];
    const p3 = mouseSamples[i3];

    const p0x = normX(p0), p0y = normY(p0);
    const p3x = normX(p3), p3y = normY(p3);

    const u = alpha;
    const u2 = u * u;
    const u3 = u2 * u;

    const catmull = (v0, v1, v2, v3) => 0.5 * (
        (2 * v1) +
        (-v0 + v2) * u +
        (2 * v0 - 5 * v1 + 4 * v2 - v3) * u2 +
        (-v0 + 3 * v1 - 3 * v2 + v3) * u3
    );

    return {
        x: Math.max(0, Math.min(1, catmull(p0x, p1x, p2x, p3x))),
        y: Math.max(0, Math.min(1, catmull(p0y, p1y, p2y, p3y))),
    };
}

/**
 * Computes window frame dimensions and offsets preserving video aspect ratio inside canvas
 */
export function getFrameMetrics(width, height, videoSource, renderSettings = {}) {
    const {
        insetPadding = 0.08,
        windowChrome = true,
        titleBarHeight = 34,
    } = renderSettings;

    const maxW = width * (1 - insetPadding * 2);
    const maxH = height * (1 - insetPadding * 2);
    const headerH = windowChrome ? titleBarHeight : 0;

    const srcAspect = (videoSource && videoSource.videoWidth && videoSource.videoHeight)
        ? (videoSource.videoWidth / videoSource.videoHeight)
        : (16 / 9);

    let frameW = maxW;
    let videoH = frameW / srcAspect;
    let frameH = videoH + headerH;
    if (frameH > maxH) {
        frameH = maxH;
        videoH = Math.max(1, frameH - headerH);
        frameW = videoH * srcAspect;
    }

    const padX = (width - frameW) / 2;
    const padY = (height - frameH) / 2;

    return {
        padX,
        padY,
        frameW,
        frameH,
        headerH,
        videoH,
    };
}

let _cachedBackdropCanvas = null;
let _cachedBackdropKey = '';

/**
 * Pure Deterministic Frame Render
 */
export function renderFrame(ctx, timeSec, videoSource, sessionData = {}, renderSettings = {}) {
    const { width, height } = ctx.canvas;
    const {
        background = 'bigSur',
        customBackgroundImage = null,
        insetPadding = 0.08,      // 8% inset
        borderRadius = 18,        // corner radius in canvas px
        windowChrome = true,
        titleBarHeight = 34,
        shadowBlur = 45,
        shadowOffsetY = 24,
        shadowOpacity = 0.42,
        showCursor = false,
        cursorScale = 1.0,
        cursorTheme = 'macos',    // 'macos' | 'dot' | 'neon'
        clickRipples = true,
        zoomMagnification = 1.0,
        // Webcam PiP Settings
        webcamSource = null,
        webcamSettings = {
            enabled: false,
            shape: 'circle',       // 'circle' | 'squircle' | 'rounded' | 'square'
            position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
            size: 0.22,           // 22% of screen frame width
            mirrored: false,
        },
        // Captions Subtitles
        captions = [],
        captionsEnabled = true,
        // Annotations
        annotations = [],
        showKeystrokes = true,
    } = renderSettings;

    const {
        focusSegments = [],
        mouseSamples = [],
        clicks = [],
        keystrokes = [],
    } = sessionData;

    // 2. Compute Inset Screen Frame with aspect ratio preservation
    const { padX, padY, frameW, frameH, headerH, videoH } = getFrameMetrics(width, height, videoSource, {
        insetPadding,
        windowChrome,
        titleBarHeight,
    });

    // 1 & 3. Draw Cached Backdrop (Wallpaper + Film Grain + Ambient Drop Shadow)
    // Pre-rendering to an offscreen canvas avoids calculating expensive Gaussian shadowBlur (45px) and gradients on every frame.
    const customImgKey = customBackgroundImage?.src || customBackgroundImage?.currentSrc || (customBackgroundImage ? 'custom' : 'none');
    const backdropKey = `${width}x${height}_${background}_${customImgKey}_${Math.round(padX)}_${Math.round(padY)}_${Math.round(frameW)}_${Math.round(frameH)}_${borderRadius}_${shadowBlur}_${shadowOffsetY}_${shadowOpacity}`;

    let drewFromCache = false;
    try {
        if (typeof OffscreenCanvas !== 'undefined' || (typeof document !== 'undefined' && document.createElement)) {
            if (!_cachedBackdropCanvas || _cachedBackdropCanvas.width !== width || _cachedBackdropCanvas.height !== height) {
                if (typeof OffscreenCanvas !== 'undefined') {
                    _cachedBackdropCanvas = new OffscreenCanvas(width, height);
                } else if (typeof document !== 'undefined' && document.createElement) {
                    _cachedBackdropCanvas = document.createElement('canvas');
                    _cachedBackdropCanvas.width = width;
                    _cachedBackdropCanvas.height = height;
                }
                _cachedBackdropKey = '';
            }

            if (_cachedBackdropCanvas && _cachedBackdropKey !== backdropKey) {
                const bCtx = _cachedBackdropCanvas.getContext('2d');
                if (bCtx) {
                    if (customBackgroundImage && (customBackgroundImage.complete !== false)) {
                        _drawCoverImage(bCtx, customBackgroundImage, 0, 0, width, height);
                    } else {
                        const colors = WALLPAPERS[background] || WALLPAPERS.bigSur;
                        const grad = bCtx.createLinearGradient(0, 0, width, height);
                        const step = 1 / (colors.length - 1);
                        colors.forEach((c, i) => grad.addColorStop(i * step, c));
                        bCtx.fillStyle = grad;
                        bCtx.fillRect(0, 0, width, height);
                    }

                    const grain = _getNoisePattern(bCtx);
                    if (grain) {
                        bCtx.save();
                        bCtx.fillStyle = grain;
                        bCtx.fillRect(0, 0, width, height);
                        bCtx.restore();
                    }

                    bCtx.save();
                    bCtx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
                    bCtx.shadowBlur = shadowBlur;
                    bCtx.shadowOffsetY = shadowOffsetY;
                    bCtx.fillStyle = '#000000';
                    _drawRoundedRectPath(bCtx, padX, padY, frameW, frameH, borderRadius);
                    bCtx.fill();
                    bCtx.restore();

                    _cachedBackdropKey = backdropKey;
                }
            }

            if (_cachedBackdropCanvas && _cachedBackdropKey === backdropKey && ctx.drawImage) {
                ctx.drawImage(_cachedBackdropCanvas, 0, 0);
                drewFromCache = true;
            }
        }
    } catch {
        drewFromCache = false;
    }

    if (!drewFromCache) {
        // Fallback for headless environments or mock contexts without offscreen canvas
        if (customBackgroundImage && (customBackgroundImage.complete !== false)) {
            _drawCoverImage(ctx, customBackgroundImage, 0, 0, width, height);
        } else {
            const colors = WALLPAPERS[background] || WALLPAPERS.bigSur;
            const grad = ctx.createLinearGradient(0, 0, width, height);
            const step = 1 / (colors.length - 1);
            colors.forEach((c, i) => grad.addColorStop(i * step, c));
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }

        const grain = _getNoisePattern(ctx);
        if (grain) {
            ctx.save();
            ctx.fillStyle = grain;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        ctx.save();
        ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetY = shadowOffsetY;
        ctx.fillStyle = '#000000';
        _drawRoundedRectPath(ctx, padX, padY, frameW, frameH, borderRadius);
        ctx.fill();
        ctx.restore();
    }

    // 4. Clip to Rounded Rect Screen Frame
    ctx.save();
    _drawRoundedRectPath(ctx, padX, padY, frameW, frameH, borderRadius);
    ctx.clip();

    // Window Header / Title Bar
    if (windowChrome) {
        ctx.fillStyle = '#1e1e24';
        ctx.fillRect(padX, padY, frameW, headerH);

        // macOS Traffic light dots
        const dotY = padY + headerH / 2;
        const dotR = 5.5;
        const startDotX = padX + 18;
        const dotSpacing = 18;

        ctx.fillStyle = '#FF5F57'; // Red
        ctx.beginPath(); ctx.arc(startDotX, dotY, dotR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FEBC2E'; // Yellow
        ctx.beginPath(); ctx.arc(startDotX + dotSpacing, dotY, dotR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#28C840'; // Green
        ctx.beginPath(); ctx.arc(startDotX + dotSpacing * 2, dotY, dotR, 0, Math.PI * 2); ctx.fill();
    }

    // 5. Calculate Camera Zoom & Position
    const cameraOptions = {
        zoomMultiplier: zoomMagnification,
        connectedZooms: renderSettings.connectedZooms,
        tiltAngle: renderSettings.tiltAngle,
        springProfile: renderSettings.springProfile,
    };
    const camera = evaluateCameraAtTime(timeSec, focusSegments, mouseSamples, cameraOptions);

    // Optional Cinema Motion Blur (180-degree shutter interval)
    let blurPrevCam = null;
    let motionVelocity = 0;
    if (renderSettings.motionBlur !== false && timeSec > 0.016) {
        blurPrevCam = evaluateCameraAtTime(timeSec - 0.016, focusSegments, mouseSamples, cameraOptions);
        const moveDist = Math.hypot(camera.x - blurPrevCam.x, camera.y - blurPrevCam.y);
        const scaleDist = Math.abs(camera.scale - blurPrevCam.scale);
        motionVelocity = moveDist * 12 + scaleDist * 2.5;
    }

    // 6. Draw Video Frame with Camera Transformation inside video area
    ctx.save();
    // Clip specifically to content area below header
    ctx.beginPath();
    ctx.rect(padX, padY + headerH, frameW, videoH);
    ctx.clip();

    // Dark solid backdrop inside window frame so stage is never transparent
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(padX, padY + headerH, frameW, videoH);

    // Cinematic shutter motion blur blend
    if (videoSource && motionVelocity > 0.04 && blurPrevCam) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.28, motionVelocity * 0.35);
        ctx.translate(padX + frameW * 0.5, padY + headerH + videoH * 0.5);
        const midScale = (camera.scale + blurPrevCam.scale) * 0.5;
        const midX = (camera.x + blurPrevCam.x) * 0.5;
        const midY = (camera.y + blurPrevCam.y) * 0.5;
        ctx.scale(midScale, midScale);
        ctx.translate(-midX * frameW, -midY * videoH);
        try {
            ctx.drawImage(videoSource, 0, 0, frameW, videoH);
        } catch (e) {}
        ctx.restore();
    }

    ctx.save();
    // Translate origin to center of video area
    ctx.translate(padX + frameW * 0.5, padY + headerH + videoH * 0.5);

    // OpenScreen 3D Perspective Tilt (Subtle skew/scale along camera movement)
    if (camera.rotateX || camera.rotateY) {
        const radX = (camera.rotateX * Math.PI) / 180;
        const radY = (camera.rotateY * Math.PI) / 180;
        ctx.transform(Math.cos(radY), Math.sin(radX) * 0.28, Math.sin(radY) * 0.28, Math.cos(radX), 0, 0);
    }

    // Scale by camera zoom
    ctx.scale(camera.scale, camera.scale);
    // Translate by negative camera position relative to center
    ctx.translate(-camera.x * frameW, -camera.y * videoH);

    // Draw source video filling video area
    if (videoSource) {
        try {
            ctx.drawImage(videoSource, 0, 0, frameW, videoH);
        } catch (e) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, frameW, videoH);
        }
    }

    // 7. Draw Click Ripple Waves in Screen Space
    if (clickRipples && clicks && clicks.length > 0) {
        const curMs = timeSec * 1000;
        for (const click of clicks) {
            const cTimeMs = click.time;
            const dt = curMs - cTimeMs;
            if (dt >= 0 && dt <= 450) {
                const progress = dt / 450;
                const ringRadius = progress * 40 * (frameW / 1920);
                const ringAlpha = (1 - progress) * 0.75;
                const cx = (click.x > 1 ? click.x / 1920 : click.x) * frameW;
                const cy = (click.y > 1 ? click.y / 1080 : click.y) * videoH;

                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(220, 254, 80, ${ringAlpha})`;
                ctx.lineWidth = 3 * (1 - progress);
                ctx.stroke();

                // Inner ping
                ctx.beginPath();
                ctx.arc(cx, cy, ringRadius * 0.45, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 254, 80, ${ringAlpha * 0.4})`;
                ctx.fill();
                ctx.restore();
            }
        }
    }

    // 8. Draw Synthetic Pointer with Cap Click-Shrink & Idle-Fade Dynamics
    if (showCursor && mouseSamples && mouseSamples.length > 0) {
        const cursor = getInterpolatedCursor(timeSec, mouseSamples);
        if (cursor) {
            const curScreenX = cursor.x * frameW;
            const curScreenY = cursor.y * videoH;

            // Cap Click Shrink: 0.72x on click and bounce back within 220ms
            let clickFactor = 1.0;
            if (clicks && clicks.length > 0) {
                const curMs = timeSec * 1000;
                for (const c of clicks) {
                    const dt = curMs - (c.time > 1000 ? c.time : c.time * 1000);
                    if (dt >= 0 && dt <= 220) {
                        clickFactor = 0.72 + 0.28 * (dt / 220);
                        break;
                    }
                }
            }

            // Cap Idle Auto-Fade: stationary mouse fades to 25% opacity so product UI is never obscured
            let idleOpacity = 1.0;
            if (mouseSamples.length > 5 && timeSec > 0.8) {
                const prevCursor = getInterpolatedCursor(timeSec - 0.7, mouseSamples);
                if (prevCursor) {
                    const moveDist = Math.hypot(cursor.x - prevCursor.x, cursor.y - prevCursor.y);
                    if (moveDist < 0.005) {
                        idleOpacity = 0.25;
                    }
                }
            }

            ctx.save();
            ctx.globalAlpha = idleOpacity;
            _drawThemedCursor(ctx, curScreenX, curScreenY, cursorScale * clickFactor * (frameW / 1920), cursorTheme);
            ctx.restore();
        }
    }

    ctx.restore(); // restore video camera transform
 
    // 8.5 Cinema Screen Spotlight (Dims background, illuminates focal target)
    if (camera.activeSeg?.sceneMode === 'spotlight' && (!webcamSettings?.enabled || !webcamSource || webcamSettings?.position !== 'center')) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(padX, padY + headerH, frameW, videoH);
        ctx.clip();

        let spotX = padX + (camera.activeSeg.targetX ?? 0.5) * frameW;
        let spotY = padY + headerH + (camera.activeSeg.targetY ?? 0.5) * videoH;
        if (mouseSamples && mouseSamples.length > 0) {
            const cursor = getInterpolatedCursor(timeSec, mouseSamples);
            if (cursor) {
                spotX = padX + cursor.x * frameW;
                spotY = padY + headerH + cursor.y * videoH;
            }
        }

        const spotRadius = Math.min(frameW, videoH) * 0.22;
        const grad = ctx.createRadialGradient(spotX, spotY, spotRadius * 0.35, spotX, spotY, spotRadius * 1.35);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.42)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.72)');

        ctx.fillStyle = grad;
        ctx.fillRect(padX, padY + headerH, frameW, videoH);

        // Crisp glowing neon border around spotlight
        ctx.beginPath();
        ctx.arc(spotX, spotY, spotRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(220, 254, 80, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
    }

    // 9. Draw Annotations Layer (Pinned to Frame Space)
    if (annotations && annotations.length > 0) {
        _drawAnnotations(ctx, annotations, timeSec, { padX, padY: padY + headerH, frameW, videoH });
    }

    // 10. Draw Captions Subtitle Overlay (Pinned to Bottom of Frame)
    if (captionsEnabled && captions && captions.length > 0) {
        const timeMs = timeSec * 1000;
        const currentCaption = captions.find(c => timeMs >= c.start && timeMs <= c.end);
        if (currentCaption && currentCaption.text) {
            _drawCaptionPill(ctx, currentCaption.text, { padX, padY: padY + headerH, frameW, videoH });
        }
    }

    // 10.5 Draw Keystroke Badge Overlay (Screen Studio / Cap style KeyCast)
    if (showKeystrokes !== false && keystrokes && keystrokes.length > 0) {
        _drawKeystrokeOverlay(ctx, keystrokes, timeSec, { padX, padY: padY + headerH, frameW, videoH });
    }

    // 11. Draw Webcam Picture-in-Picture (Pinned to User Corner, with Reactive Scale & Full Camera mode)
    if (webcamSettings?.enabled && webcamSource) {
        const isFullCamera = camera.activeSeg?.sceneMode === 'full-camera' || webcamSettings.fullCamera;
        const isSpotlight = camera.activeSeg?.sceneMode === 'spotlight' || webcamSettings.position === 'center' || webcamSettings.spotlight;
        const effectiveWebcamSettings = {
            ...webcamSettings,
            spotlight: isSpotlight,
            fullCamera: isFullCamera,
        };
        _drawWebcamPiP(ctx, webcamSource, effectiveWebcamSettings, { 
            padX, 
            padY: padY + headerH, 
            frameW, 
            videoH,
            cameraScale: camera.scale,
            borderRadius
        });
    }

    // 12. Speed Ramp Cinema Indicator (if active segment is in speed mode)
    if (camera.activeSeg?.sceneMode === 'speed') {
        const speedMultiplier = camera.activeSeg.speed || 2.0;
        _drawSpeedRampBadge(ctx, speedMultiplier, { padX, padY: padY + headerH, frameW, videoH });
    }

    ctx.restore(); // restore clipping rect
}

/**
 * Aspect-fill helper for background images
 */
function _drawCoverImage(ctx, img, x, y, w, h) {
    const imgW = img.naturalWidth || img.width || w;
    const imgH = img.naturalHeight || img.height || h;
    const scale = Math.max(w / imgW, h / imgH);
    const renderW = imgW * scale;
    const renderH = imgH * scale;
    const offsetX = x + (w - renderW) / 2;
    const offsetY = y + (h - renderH) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    ctx.restore();
}

/**
 * Path helper for rounded rectangle
 */
function _drawRoundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

/**
 * Path helper for Squircle (Lamé curve of degree 4)
 */
function _drawSquirclePath(ctx, x, y, size) {
    const r = size / 2;
    const cx = x + r;
    const cy = y + r;
    const n = 4;
    const steps = 48;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * 2 * Math.PI;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const px = cx + Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n) * r;
        const py = cy + Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

/**
 * Draw Webcam Picture-in-Picture with sleek styling & clipping
 */
function _drawWebcamPiP(ctx, webcamSource, settings, bounds) {
    const {
        shape = 'circle',
        position = 'bottom-right',
        size: sizeRatio = 0.22,
        mirrored = false,
        borderWidth: defaultBorderWidth = 3,
        borderColor: defaultBorderColor = 'rgba(255, 255, 255, 0.25)',
    } = settings || {};

    let borderWidth = defaultBorderWidth;
    let borderColor = defaultBorderColor;

    // OpenScreen Reactive Webcam Scaling
    const reactiveFactor = settings?.reactiveScale !== false && bounds.cameraScale ? reactiveWebcamScale(bounds.cameraScale) : 1.0;
    let size = Math.round(bounds.frameW * sizeRatio * reactiveFactor);
    const margin = Math.round(bounds.frameW * 0.025);

    const isFullCamera = settings?.fullCamera;
    const isSpotlight = position === 'center' || settings?.spotlight;
    let x = bounds.padX + bounds.frameW - size - margin;
    let y = bounds.padY + bounds.videoH - size - margin;
    let renderW = size;
    let renderH = size;

    if (isFullCamera) {
        // OpenScreen Full Camera Mode: presenter takes entire screen for intro/outro
        x = bounds.padX;
        y = bounds.padY;
        renderW = bounds.frameW;
        renderH = bounds.videoH;
        borderWidth = 0;
    } else if (isSpotlight) {
        // Dim the background screen demo so presenter takes center stage
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
        ctx.fillRect(bounds.padX, bounds.padY, bounds.frameW, bounds.videoH);
        ctx.restore();

        // Cinema Spotlight scale
        size = Math.min(bounds.frameW * 0.44, bounds.videoH * 0.74);
        renderW = size;
        renderH = size;
        x = bounds.padX + (bounds.frameW - size) / 2;
        y = bounds.padY + (bounds.videoH - size) / 2;
        borderWidth = 3.5;
        borderColor = '#DCFE50';
    } else if (position === 'top-left') {
        x = bounds.padX + margin;
        y = bounds.padY + margin;
    } else if (position === 'top-right') {
        x = bounds.padX + bounds.frameW - size - margin;
        y = bounds.padY + margin;
    } else if (position === 'bottom-left') {
        x = bounds.padX + margin;
        y = bounds.padY + bounds.videoH - size - margin;
    } else if (typeof position === 'object' && position.x != null) {
        x = bounds.padX + position.x * (bounds.frameW - size);
        y = bounds.padY + position.y * (bounds.videoH - size);
    }

    const drawShape = () => {
        if (isFullCamera) {
            _drawRoundedRectPath(ctx, x, y, renderW, renderH, bounds.borderRadius || 18);
        } else if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
        } else if (shape === 'squircle') {
            _drawSquirclePath(ctx, x, y, size);
        } else if (shape === 'square') {
            ctx.beginPath();
            ctx.rect(x, y, size, size);
            ctx.closePath();
        } else {
            // rounded
            _drawRoundedRectPath(ctx, x, y, size, size, size * 0.22);
        }
    };

    // Ambient drop shadow behind webcam
    ctx.save();
    ctx.shadowColor = isSpotlight ? 'rgba(220, 254, 80, 0.45)' : 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = isSpotlight ? 38 : 24;
    ctx.shadowOffsetY = isSpotlight ? 4 : 10;
    ctx.fillStyle = '#000000';
    drawShape();
    ctx.fill();
    ctx.restore();

    // Clip & Draw Webcam Video with Aspect-Fill (Cover)
    ctx.save();
    drawShape();
    ctx.clip();

    if (mirrored) {
        ctx.translate(x + renderW, y);
        ctx.scale(-1, 1);
        ctx.translate(-x, -y);
    }

    const vw = webcamSource.videoWidth || webcamSource.naturalWidth || webcamSource.width || renderW;
    const vh = webcamSource.videoHeight || webcamSource.naturalHeight || webcamSource.height || renderH;
    const scale = Math.max(renderW / vw, renderH / vh);
    const sw = renderW / scale;
    const sh = renderH / scale;
    const sx = (vw - sw) / 2;
    const sy = (vh - sh) / 2;

    try {
        ctx.drawImage(webcamSource, sx, sy, sw, sh, x, y, renderW, renderH);
    } catch (e) {
        // Fallback placeholder if webcam not yet providing frames
        ctx.fillStyle = '#1e1e24';
        ctx.fillRect(x, y, renderW, renderH);
    }
    ctx.restore();

    // Outline border
    if (borderWidth > 0) {
        ctx.save();
        drawShape();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Draw Sleek Cinema Caption Pill
 */
function _drawCaptionPill(ctx, text, bounds) {
    ctx.save();
    const fontSize = Math.max(14, Math.round(bounds.frameW * 0.019));
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(text).width;
    const paddingX = fontSize * 1.4;
    const paddingY = fontSize * 0.8;
    const pillW = textWidth + paddingX * 2;
    const pillH = fontSize + paddingY * 2;
    const pillX = bounds.padX + (bounds.frameW - pillW) / 2;
    const pillY = bounds.padY + bounds.videoH - pillH - Math.round(bounds.frameW * 0.035);

    // Pill background
    ctx.fillStyle = 'rgba(8, 9, 14, 0.82)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    _drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text with soft glow
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, pillX + pillW / 2, pillY + pillH / 2);
    ctx.restore();
}

/**
 * Draw Cinema Speed Ramp Indicator Pill
 */
function _drawSpeedRampBadge(ctx, speed, bounds) {
    const badgeW = 150;
    const badgeH = 34;
    const x = bounds.padX + bounds.frameW - badgeW - 16;
    const y = bounds.padY + 16;

    ctx.save();
    // Glassmorphic backdrop
    ctx.fillStyle = 'rgba(10, 15, 29, 0.88)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    _drawRoundedRectPath(ctx, x, y, badgeW, badgeH, 17);
    ctx.fill();

    // Luminous neon accent border
    ctx.strokeStyle = 'rgba(220, 254, 80, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Speed typography
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#DCFE50';
    ctx.font = 'bold 12px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`⏩ ${(speed || 2.0).toFixed(1)}x SPEED`, x + badgeW / 2, y + badgeH / 2);
    ctx.restore();
}

/**
 * Draw On-Screen Annotations (Arrow, Rect, Text badge)
 */
function _drawAnnotations(ctx, annotations, timeSec, bounds) {
    const curTimeMs = timeSec * 1000;
    const active = annotations.filter(a => curTimeMs >= (a.startTime || 0) && curTimeMs <= (a.endTime || 999999));

    for (const ann of active) {
        ctx.save();
        const color = ann.color || '#DCFE50';

        if (ann.type === 'rect') {
            const rx = bounds.padX + ann.x * bounds.frameW;
            const ry = bounds.padY + ann.y * bounds.videoH;
            const rw = (ann.w || 0.2) * bounds.frameW;
            const rh = (ann.h || 0.15) * bounds.videoH;

            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = `${color}22`; // 13% opacity fill
            _drawRoundedRectPath(ctx, rx, ry, rw, rh, 10);
            ctx.fill();

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = color;
            ctx.stroke();
        } else if (ann.type === 'arrow') {
            const x1 = bounds.padX + ann.startX * bounds.frameW;
            const y1 = bounds.padY + ann.startY * bounds.videoH;
            const x2 = bounds.padX + ann.endX * bounds.frameW;
            const y2 = bounds.padY + ann.endY * bounds.videoH;

            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 8;
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';

            // Shaft
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLen = 18;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        } else if (ann.type === 'text') {
            const tx = bounds.padX + ann.x * bounds.frameW;
            const ty = bounds.padY + ann.y * bounds.videoH;

            ctx.font = 'bold 15px system-ui';
            const tw = ctx.measureText(ann.text).width;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            _drawRoundedRectPath(ctx, tx - 12, ty - 22, tw + 24, 32, 8);
            ctx.fill();

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(ann.text, tx, ty);
        }
        ctx.restore();
    }
}

/**
 * Draw Cursor according to theme
 */
function _drawThemedCursor(ctx, x, y, scale = 1.0, theme = 'macos') {
    if (theme === 'dot') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 7 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#DCFE50';
        ctx.shadowColor = 'rgba(220, 254, 80, 0.6)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.restore();
        return;
    }

    if (theme === 'ring') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 9 * scale, 0, Math.PI * 2);
        ctx.lineWidth = 2.5 * scale;
        ctx.strokeStyle = '#DCFE50';
        ctx.shadowColor = 'rgba(220, 254, 80, 0.7)';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'transparent';
        ctx.fill();
        ctx.restore();
        return;
    }

    if (theme === 'cyber') {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale * 1.3, scale * 1.3);
        ctx.shadowColor = '#DCFE50';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 20);
        ctx.lineTo(5.5, 15);
        ctx.lineTo(10, 22.5);
        ctx.lineTo(13, 21);
        ctx.lineTo(8.5, 14);
        ctx.lineTo(14.5, 14);
        ctx.closePath();
        ctx.fillStyle = '#DCFE50';
        ctx.fill();
        ctx.strokeStyle = '#050801';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();
        return;
    }

    if (theme === 'windows') {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale * 1.25, scale * 1.25);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(4.5, 14);
        ctx.lineTo(8.5, 21.5);
        ctx.lineTo(11.5, 20);
        ctx.lineTo(7.5, 12.8);
        ctx.lineTo(13, 12.8);
        ctx.closePath();
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();
        return;
    }

    if (theme === 'neon') {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale * 1.2, scale * 1.2);
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(5, 14);
        ctx.lineTo(9, 21);
        ctx.lineTo(12, 19.5);
        ctx.lineTo(8, 13);
        ctx.lineTo(13.5, 13);
        ctx.closePath();

        ctx.fillStyle = '#00f0ff';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
        return;
    }

    // Default: macOS style
    _drawSyntheticCursor(ctx, x, y, scale);
}

/**
 * Draw crisp modern macOS-style synthetic pointer
 */
function _drawSyntheticCursor(ctx, x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * 1.3, scale * 1.3);

    // Subtle pointer shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Pointer body path
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 19);
    ctx.lineTo(4.8, 14.8);
    ctx.lineTo(8.5, 22.5);
    ctx.lineTo(12, 21);
    ctx.lineTo(8.3, 13.5);
    ctx.lineTo(14, 13.5);
    ctx.closePath();

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Sharp dark outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.4;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.restore();
}

/**
 * Procedural Film Grain Noise Pattern (Cap-inspired)
 * Prevents 8-bit digital color banding on gradient backgrounds
 */
let _cachedNoisePattern = null;
function _getNoisePattern(ctx) {
    if (_cachedNoisePattern) return _cachedNoisePattern;
    if (typeof document === 'undefined') return null;
    try {
        const nCanvas = document.createElement('canvas');
        nCanvas.width = 128;
        nCanvas.height = 128;
        const nCtx = nCanvas.getContext('2d');
        const imgData = nCtx.createImageData(128, 128);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const val = Math.floor(Math.random() * 255);
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
            data[i + 3] = 16; // subtle 6% grain opacity
        }
        nCtx.putImageData(imgData, 0, 0);
        _cachedNoisePattern = ctx.createPattern(nCanvas, 'repeat');
        return _cachedNoisePattern;
    } catch (e) {
        return null;
    }
}

/**
 * Draw Screen Studio / Cap style animated floating Keystroke Overlay
 */
function _drawKeystrokeOverlay(ctx, keystrokes, timeSec, bounds) {
    if (!keystrokes || keystrokes.length === 0) return;
    const curSec = timeSec;

    // Find the most recent active keystroke within 1.6s
    let active = null;
    for (let i = keystrokes.length - 1; i >= 0; i--) {
        const k = keystrokes[i];
        const t = (k.time > 1000 || k.t > 1000) ? (k.time || k.t) / 1000 : (k.time || k.t || 0);
        const dt = curSec - t;
        if (dt >= 0 && dt <= 1.6) {
            active = k;
            break;
        }
    }

    if (!active) return;

    const t = (active.time > 1000 || active.t > 1000) ? (active.time || active.t) / 1000 : (active.time || active.t || 0);
    const dt = curSec - t;

    // Opacity and entrance animation
    let alpha = 1.0;
    let slideY = 0;
    if (dt < 0.15) {
        const p = dt / 0.15;
        alpha = p;
        slideY = (1 - p) * 12;
    } else if (dt > 1.25) {
        const p = (dt - 1.25) / 0.35;
        alpha = Math.max(0, 1 - p);
        slideY = -p * 6;
    }

    if (alpha <= 0.01) return;

    // Extract keys list
    let keys = [];
    if (Array.isArray(active.keys)) {
        keys = active.keys;
    } else if (typeof active.text === 'string') {
        keys = active.text.split('+').map(s => s.trim());
    } else if (typeof active.key === 'string') {
        keys = [active.key];
    }
    if (keys.length === 0) return;

    // Normalize key glyphs
    const formatKey = (k) => {
        const lower = k.toLowerCase();
        if (lower === 'ctrl' || lower === 'control') return 'Ctrl';
        if (lower === 'meta' || lower === 'cmd' || lower === 'command') return '⌘';
        if (lower === 'alt' || lower === 'option') return '⌥';
        if (lower === 'shift') return '⇧';
        if (lower === 'enter' || lower === 'return') return '↵ Enter';
        if (lower === 'backspace') return '⌫';
        if (lower === 'tab') return '⇥';
        if (lower === 'escape' || lower === 'esc') return 'Esc';
        if (lower === 'arrowup' || lower === 'up') return '↑';
        if (lower === 'arrowdown' || lower === 'down') return '↓';
        if (lower === 'arrowleft' || lower === 'left') return '←';
        if (lower === 'arrowright' || lower === 'right') return '→';
        if (lower === 'space' || lower === ' ') return 'Space';
        return k.length === 1 ? k.toUpperCase() : k;
    };

    const formatted = keys.map(formatKey);

    ctx.save();
    ctx.globalAlpha = alpha;

    const fontKey = 'bold 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    ctx.font = fontKey;

    const keycapPaddingX = 9;
    const keycapHeight = 28;
    const keycapGap = 6;
    const pillPaddingX = 12;
    const pillPaddingY = 8;

    // Measure keycaps
    const keyWidths = formatted.map(k => Math.max(26, (ctx.measureText ? ctx.measureText(k).width : 20) + keycapPaddingX * 2));
    const totalKeysWidth = keyWidths.reduce((sum, w) => sum + w, 0) + (keyWidths.length - 1) * keycapGap;
    const pillW = totalKeysWidth + pillPaddingX * 2;
    const pillH = keycapHeight + pillPaddingY * 2;

    const pillX = bounds.padX + (bounds.frameW - pillW) / 2;
    const pillY = bounds.padY + bounds.videoH - pillH - 24 + slideY;

    // Draw container shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;

    // Frosted Pill Container
    _drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, 12);
    ctx.fillStyle = 'rgba(10, 14, 22, 0.88)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(220, 254, 80, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = 'transparent';

    // Draw individual keycaps
    let curKeyX = pillX + pillPaddingX;
    const curKeyY = pillY + pillPaddingY;

    formatted.forEach((keyText, i) => {
        const kw = keyWidths[i];

        // Keycap background
        _drawRoundedRectPath(ctx, curKeyX, curKeyY, kw, keycapHeight, 6);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Keycap text
        ctx.fillStyle = (keyText === '⌘' || keyText === 'Ctrl' || keyText === '⌥' || keyText === '⇧') ? '#DCFE50' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (ctx.fillText) {
            ctx.fillText(keyText, curKeyX + kw / 2, curKeyY + keycapHeight / 2);
        }

        curKeyX += kw + keycapGap;
    });

    ctx.restore();
}

