/**
 * renderFrame — Deterministic Unified Screen Studio Compositor Pipeline
 * 
 * Shared 1:1 between interactive Studio Preview and offline WebCodecs / MP4 export.
 * Pure stateless rendering of background, framing, camera spring transforms,
 * click ripple waves, and synthetic sub-pixel cursor.
 */

import { computeCursorSwayRotation } from '../zoom/cursorSway.js';
import { getSmoothedCursorPath } from '../zoom/cursorPathSmoothing.js';
import { getCameraTrack, sampleCameraTrack, viewportCenter } from '../zoom/cameraTrack.js';
import { WALLPAPERS, computeStageLayout, drawMeshBackground, getGrainPattern } from './stage.js';

export { WALLPAPERS };

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
 * Evaluate the camera at a timestamp.
 *
 * Samples the precomputed spring-smoothed camera track (see zoom/cameraTrack.js),
 * so the result is deterministic, continuous across segment boundaries and
 * identical between preview and export.
 *
 * @returns {{x:number, y:number, scale:number, rotateX:number, rotateY:number, activeSeg:Object|null}}
 */
export function evaluateCameraAtTime(timeSec, focusSegments = [], mouseSamples = [], options = {}) {
    const kx = options.cropKx ?? 1;
    const ky = options.cropKy ?? 1;
    if ((!focusSegments || focusSegments.length === 0) && kx <= 1 && ky <= 1) {
        return { x: 0.5, y: 0.5, scale: 1.0, rotateX: 0, rotateY: 0, activeSeg: null };
    }

    const track = getCameraTrack(focusSegments || [], mouseSamples, {
        cropKx: kx,
        cropKy: ky,
        springProfile: options.springProfile,
        zoomMultiplier: options.zoomMultiplier ?? 1.0,
        connectedZooms: options.connectedZooms,
        trackCursor: options.trackCursor,
        duration: options.duration,
    });
    const cam = sampleCameraTrack(track, timeSec);
    const tilt = calculate3DTilt(cam.x, cam.y, cam.scale, options.tiltAngle ?? 0);

    return {
        x: kx > 1 ? viewportCenter(cam.focusX, cam.scale * kx) : cam.x,
        y: ky > 1 ? viewportCenter(cam.focusY, cam.scale * ky) : cam.y,
        scale: cam.scale,
        focusX: cam.focusX,
        focusY: cam.focusY,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        activeSeg: cam.activeSeg,
    };
}

/**
 * OpenScreen-proven piecewise linear binary-search cursor interpolation (zero latency)
 */
export function getInterpolatedCursor(timeSec, mouseSamples = [], options = {}) {
    if (!mouseSamples || mouseSamples.length === 0) return null;

    const timeMs = timeSec * 1000;
    const srcW = options.sourceWidth || options.screenWidth || 1920;
    const srcH = options.sourceHeight || options.screenHeight || 1080;

    // OpenScreen 240Hz offline symplectic Euler cursor smoothing (when requested)
    if (options.springSmooth === true && mouseSamples.length >= 2) {
        const smoothedPath = getSmoothedCursorPath(mouseSamples, options.smoothingStrength ?? 1.0, {
            sourceWidth: srcW,
            sourceHeight: srcH,
        });
        if (smoothedPath) {
            const p = smoothedPath.sampleAt(timeMs);
            if (p) return { x: p.cx, y: p.cy };
        }
    }

    let low = 0;
    let high = mouseSamples.length - 1;

    const getSampleTime = (s) => s.timeMs ?? s.time ?? s.t ?? 0;
    const normX = (s) => {
        if (s.cx != null) return s.cx;
        return s.x > 1 ? s.x / srcW : (s.x != null ? s.x : 0.5);
    };
    const normY = (s) => {
        if (s.cy != null) return s.cy;
        return s.y > 1 ? s.y / srcH : (s.y != null ? s.y : 0.5);
    };

    if (timeMs <= getSampleTime(mouseSamples[0])) {
        const s = mouseSamples[0];
        return { x: normX(s), y: normY(s) };
    }
    if (timeMs >= getSampleTime(mouseSamples[high])) {
        const s = mouseSamples[high];
        return { x: normX(s), y: normY(s) };
    }

    while (low <= high) {
        const mid = (low + high) >> 1;
        const tMid = getSampleTime(mouseSamples[mid]);

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

    const tPrev = getSampleTime(prev);
    const tNext = getSampleTime(next);
    const alpha = tNext === tPrev ? 0 : Math.max(0, Math.min(1, (timeMs - tPrev) / (tNext - tPrev)));

    const p1x = normX(prev);
    const p1y = normY(prev);
    const p2x = normX(next);
    const p2y = normY(next);

    // If only 2 samples, or long pause (>350ms), or spline explicitly disabled, use linear
    if (mouseSamples.length < 3 || (tNext - tPrev) > 350 || options.spline === false || options.splineSmoothing === false) {
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
 * Cursor position for rendering: spring-smoothed path when smoothing is on
 * (memoized per sample set), otherwise the raw interpolated telemetry.
 */
export function sampleCursor(timeSec, mouseSamples, smooth = true) {
    if (smooth && mouseSamples.length >= 2) {
        const path = getSmoothedCursorPath(mouseSamples, 1.0);
        const p = path && path.sampleAt(timeSec * 1000);
        if (p) return { x: p.cx, y: p.cy };
    }
    return getInterpolatedCursor(timeSec, mouseSamples);
}

const CURSOR_BASE_SCALE = 1.45;  // ~32px tall on a 1080p recording at 1x
const CLICK_RIPPLE_MS = 480;
const PRESS_DOWN_MS = 70;
const PRESS_UP_MS = 260;

/**
 * Pointer squash on click: quick press down, springy release with a hint of
 * overshoot (click times are ms).
 */
export function cursorPressScale(timeSec, clicks) {
    if (!clicks || !clicks.length) return 1;
    const curMs = timeSec * 1000;
    for (let i = clicks.length - 1; i >= 0; i--) {
        const dt = curMs - clicks[i].time;
        if (dt < 0) continue;
        if (dt > PRESS_DOWN_MS + PRESS_UP_MS) break;
        if (dt < PRESS_DOWN_MS) {
            const u = dt / PRESS_DOWN_MS;
            return 1 - 0.2 * u * u * (3 - 2 * u);
        }
        const u = (dt - PRESS_DOWN_MS) / PRESS_UP_MS;
        const spring = 1 - Math.exp(-6 * u) * Math.cos(9 * u);
        return 0.8 + 0.2 * spring;
    }
    return 1;
}

const IDLE_FADE_AFTER = 1.6;   // seconds of stillness before fading
const IDLE_FADE_DURATION = 0.5;
const IDLE_WAKE_LEAD = 0.12;   // start fading back in this long before the next move
const IDLE_MIN_OPACITY = 0.3;

function _sampleMs(s) {
    return s.timeMs ?? s.time ?? s.t ?? 0;
}

/**
 * Opacity of a resting cursor. The recorder only emits samples while the
 * mouse moves, so the time since the previous sample is the idle time.
 */
export function cursorIdleOpacity(timeSec, mouseSamples) {
    const n = mouseSamples ? mouseSamples.length : 0;
    if (n < 2) return 1;
    const tMs = timeSec * 1000;
    let lo = 0;
    let hi = n - 1;
    let idx = -1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (_sampleMs(mouseSamples[mid]) <= tMs) { idx = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    if (idx < 0) return 1;
    const idle = (tMs - _sampleMs(mouseSamples[idx])) / 1000;
    const next = idx + 1 < n ? (_sampleMs(mouseSamples[idx + 1]) - tMs) / 1000 : Infinity;
    const ease = (v) => v * v * (3 - 2 * v);
    const fadeOut = ease(Math.max(0, Math.min(1, (idle - IDLE_FADE_AFTER) / IDLE_FADE_DURATION)));
    const wake = next < IDLE_WAKE_LEAD ? ease(1 - next / IDLE_WAKE_LEAD) : 0;
    const dim = fadeOut * (1 - wake);
    return 1 - dim * (1 - IDLE_MIN_OPACITY);
}

/**
 * Computes window frame dimensions and offsets preserving video aspect ratio inside canvas
 */
export function getFrameMetrics(width, height, videoSource, renderSettings = {}) {
    const srcW = renderSettings.sourceWidth || videoSource?.videoWidth || videoSource?.displayWidth || videoSource?.width || 1920;
    const srcH = renderSettings.sourceHeight || videoSource?.videoHeight || videoSource?.displayHeight || videoSource?.height || 1080;
    return computeStageLayout(width, height, srcW, srcH, renderSettings);
}

/**
 * Map a point on the canvas back to normalized source coordinates, given the
 * layout and the camera at that moment (inverse of the render transform).
 */
export function canvasToSource(canvasX, canvasY, layout, camera) {
    const cx = layout.padX + layout.videoW * 0.5;
    const cy = layout.padY + layout.headerH + layout.videoH * 0.5;
    const s = camera?.scale || 1;
    const x = ((canvasX - cx) / s + (camera?.x ?? 0.5) * layout.contentW) / layout.contentW;
    const y = ((canvasY - cy) / s + (camera?.y ?? 0.5) * layout.contentH) / layout.contentH;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}

let _cachedBackdropCanvas = null;
let _cachedBackdropKey = '';

/**
 * Pure Deterministic Frame Render
 */
export function renderFrame(ctx, timeSec, videoSource, sessionData = {}, renderSettings = {}) {
    ctx.save();
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

    // 2. Stage layout (resolution independent: 1 unit = 1px at 1080p)
    const layout = getFrameMetrics(width, height, videoSource, {
        insetPadding,
        windowChrome,
        titleBarHeight,
        borderRadius,
        frameFit: renderSettings.frameFit,
        sourceWidth: renderSettings.sourceWidth,
        sourceHeight: renderSettings.sourceHeight,
    });
    const { padX, padY, frameW, frameH, headerH, videoH, contentW, contentH, unit, radius } = layout;

    const effectiveShadowOpacity = layout.fullBleed ? 0 : shadowOpacity;

    // 1 & 3. Cached backdrop: wallpaper, grain and the frame's drop shadow.
    // Rendered once per layout/background change, then blitted every frame.
    const customImgKey = customBackgroundImage?.src || customBackgroundImage?.currentSrc || (customBackgroundImage ? 'custom' : 'none');
    const backdropKey = `${width}x${height}_${background}_${customImgKey}_${Math.round(padX)}_${Math.round(padY)}_${Math.round(frameW)}_${Math.round(frameH)}_${Math.round(radius)}_${shadowBlur}_${shadowOffsetY}_${effectiveShadowOpacity}`;

    const paintBackdrop = (bCtx) => {
        if (customBackgroundImage && (customBackgroundImage.complete !== false)) {
            _drawCoverImage(bCtx, customBackgroundImage, 0, 0, width, height);
        } else {
            drawMeshBackground(bCtx, width, height, WALLPAPERS[background] || WALLPAPERS.bigSur);
        }

        const grain = getGrainPattern(bCtx);
        if (grain) {
            bCtx.save();
            bCtx.fillStyle = grain;
            bCtx.fillRect(0, 0, width, height);
            bCtx.restore();
        }

        if (effectiveShadowOpacity > 0) {
            // Two-layer shadow: wide ambient falloff plus a tight contact shadow.
            bCtx.save();
            bCtx.fillStyle = '#000000';
            bCtx.shadowColor = `rgba(0, 0, 0, ${effectiveShadowOpacity * 0.85})`;
            bCtx.shadowBlur = shadowBlur * 1.6 * unit;
            bCtx.shadowOffsetY = shadowOffsetY * unit;
            _drawRoundedRectPath(bCtx, padX, padY, frameW, frameH, radius);
            bCtx.fill();
            bCtx.shadowColor = `rgba(0, 0, 0, ${effectiveShadowOpacity * 0.6})`;
            bCtx.shadowBlur = 10 * unit;
            bCtx.shadowOffsetY = 3 * unit;
            _drawRoundedRectPath(bCtx, padX, padY, frameW, frameH, radius);
            bCtx.fill();
            bCtx.restore();
        }
    };

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
                    paintBackdrop(bCtx);
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
        // Headless environments / mock contexts without an offscreen canvas
        paintBackdrop(ctx);
    }

    // 4. Clip to Rounded Rect Screen Frame
    ctx.save();
    _drawRoundedRectPath(ctx, padX, padY, frameW, frameH, radius);
    ctx.clip();

    // Window title bar
    if (headerH > 0) {
        const bar = ctx.createLinearGradient(0, padY, 0, padY + headerH);
        bar.addColorStop(0, '#2b2b31');
        bar.addColorStop(1, '#1f1f24');
        ctx.fillStyle = bar;
        ctx.fillRect(padX, padY, frameW, headerH);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(padX, padY + headerH - Math.max(1, unit), frameW, Math.max(1, unit));

        const dotY = padY + headerH / 2;
        const dotR = 6 * unit;
        const startDotX = padX + 20 * unit;
        const dotSpacing = 20 * unit;
        ['#FF5F57', '#FEBC2E', '#28C840'].forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(startDotX + dotSpacing * i, dotY, dotR, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // 5. Calculate Camera Zoom & Position
    const cameraOptions = {
        zoomMultiplier: zoomMagnification,
        connectedZooms: renderSettings.connectedZooms,
        tiltAngle: renderSettings.tiltAngle,
        springProfile: renderSettings.springProfile,
        cropKx: layout.cropKx,
        cropKy: layout.cropKy,
    };
    const camera = evaluateCameraAtTime(timeSec, focusSegments, mouseSamples, cameraOptions);

    // 6. Draw Video Frame with Camera Transformation inside video area
    ctx.save();
    // Clip specifically to content area below header
    ctx.beginPath();
    ctx.rect(padX, padY + headerH, frameW, videoH);
    ctx.clip();

    // Dark solid backdrop inside window frame so stage is never transparent
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(padX, padY + headerH, frameW, videoH);

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
    ctx.translate(-camera.x * contentW, -camera.y * contentH);

    // Draw source video filling video area
    if (videoSource) {
        try {
            ctx.drawImage(videoSource, 0, 0, contentW, contentH);
        } catch (e) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, contentW, contentH);
        }
    }

    // 7. Click ripples (content space, so they zoom with the camera)
    if (clickRipples && clicks && clicks.length > 0) {
        const curMs = timeSec * 1000;
        for (const click of clicks) {
            const dt = curMs - click.time;
            if (dt < 0 || dt > CLICK_RIPPLE_MS) continue;
            const p = dt / CLICK_RIPPLE_MS;
            const eased = 1 - Math.pow(1 - p, 3);
            const cx = (click.x > 1 ? click.x / 1920 : click.x) * contentW;
            const cy = (click.y > 1 ? click.y / 1080 : click.y) * contentH;
            const r = (6 + eased * 30) * unit;
            const alpha = (1 - p) * (1 - p);

            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.18})`;
            ctx.fill();
            ctx.lineWidth = 2.2 * unit * (1 - p * 0.6);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
            ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.35})`;
            ctx.shadowBlur = 6 * unit;
            ctx.stroke();
            ctx.restore();
        }
    }

    // 8. Synthetic pointer: smoothed path, press squash, motion trail, idle fade
    if (showCursor && mouseSamples && mouseSamples.length > 0) {
        const smooth = renderSettings.splineSmoothing !== false;
        const cursor = sampleCursor(timeSec, mouseSamples, smooth);
        if (cursor) {
            const curScreenX = cursor.x * contentW;
            const curScreenY = cursor.y * contentH;
            const press = cursorPressScale(timeSec, clicks);
            const idleOpacity = cursorIdleOpacity(timeSec, mouseSamples);
            // Cursor size is relative to the recording, like a real pointer.
            const size = cursorScale * press * (contentH / 1080) * CURSOR_BASE_SCALE;

            let swayAngle = 0;
            let trail = null;
            if (mouseSamples.length > 2 && timeSec > 0.03) {
                const prev = sampleCursor(timeSec - 0.02, mouseSamples, smooth);
                if (prev) {
                    const dx = (cursor.x - prev.x) * contentW;
                    const dy = (cursor.y - prev.y) * contentH;
                    swayAngle = computeCursorSwayRotation(dx, dy, 20, renderSettings.sway ?? 1.0);
                    // px per second in 1080p units
                    const speed = Math.hypot(dx, dy) / 0.02 / Math.max(0.25, contentH / 1080);
                    if (renderSettings.cursorMotionBlur !== false && speed > 900) trail = speed;
                }
            }

            ctx.save();
            if (trail) {
                // Short ghost trail along the recent path: reads as motion blur.
                const strength = Math.min(1, (trail - 900) / 2400);
                for (let k = 3; k >= 1; k--) {
                    const g = sampleCursor(timeSec - k * 0.008, mouseSamples, smooth);
                    if (!g) continue;
                    ctx.globalAlpha = idleOpacity * strength * (0.22 - k * 0.05);
                    _drawThemedCursor(ctx, g.x * contentW, g.y * contentH, size, cursorTheme, swayAngle);
                }
            }
            ctx.globalAlpha = idleOpacity;
            _drawThemedCursor(ctx, curScreenX, curScreenY, size, cursorTheme, swayAngle);
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

        let spotU = camera.activeSeg.targetX ?? 0.5;
        let spotV = camera.activeSeg.targetY ?? 0.5;
        if (mouseSamples && mouseSamples.length > 0) {
            const cursor = sampleCursor(timeSec, mouseSamples, renderSettings.splineSmoothing !== false);
            if (cursor) {
                spotU = cursor.x;
                spotV = cursor.y;
            }
        }
        const spotX = padX + frameW * 0.5 + (spotU - camera.x) * contentW * camera.scale;
        const spotY = padY + headerH + videoH * 0.5 + (spotV - camera.y) * contentH * camera.scale;

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

    // Restore video content area clip (line 571) before drawing overlay elements
    ctx.restore();

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
            borderRadius: radius,
            unit,
        });
    }

    // 12. Speed Ramp Cinema Indicator (if active segment is in speed mode)
    if (camera.activeSeg?.sceneMode === 'speed') {
        const speedMultiplier = camera.activeSeg.speed || 2.0;
        _drawSpeedRampBadge(ctx, speedMultiplier, { padX, padY: padY + headerH, frameW, videoH });
    }

    ctx.restore(); // restore rounded rect screen frame

    // Hairline edge: gives the frame a crisp, glassy outline on any wallpaper.
    if (!layout.fullBleed) {
        ctx.save();
        _drawRoundedRectPath(ctx, padX, padY, frameW, frameH, radius);
        ctx.lineWidth = Math.max(1, unit);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
        ctx.stroke();
        ctx.restore();
    }

    ctx.restore(); // restore outer canvas state
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
    if (!r || r <= 0) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        return;
    }
    const maxR = Math.min(w / 2, h / 2);
    const rad = Math.min(r, maxR);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
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
let _webcamHold = null;
let _webcamHoldSource = null;

/**
 * Webcam frame to draw this tick. A <video> that is mid-seek or buffering has
 * no frame to give (readyState < 2), which used to make the PiP blink out in
 * playback and vanish from exports; instead we keep showing the last good frame.
 */
function _stableWebcamFrame(source) {
    const isVideo = typeof source.readyState === 'number';
    const ready = !isVideo || (source.readyState >= 2 && source.videoWidth > 0);
    if (ready) {
        if (isVideo && (typeof OffscreenCanvas !== 'undefined' || typeof document !== 'undefined')) {
            try {
                const vw = source.videoWidth;
                const vh = source.videoHeight;
                const w = Math.min(vw, 720);
                const h = Math.round(vh * (w / vw));
                if (!_webcamHold || _webcamHold.width !== w || _webcamHold.height !== h) {
                    _webcamHold = typeof OffscreenCanvas !== 'undefined'
                        ? new OffscreenCanvas(w, h)
                        : Object.assign(document.createElement('canvas'), { width: w, height: h });
                }
                _webcamHold.getContext('2d').drawImage(source, 0, 0, w, h);
                _webcamHoldSource = source;
            } catch {
                // keep previous hold frame
            }
        }
        return source;
    }
    return _webcamHold && _webcamHoldSource === source ? _webcamHold : null;
}

function _drawWebcamPiP(ctx, webcamSourceIn, settings, bounds) {
    const webcamSource = _stableWebcamFrame(webcamSourceIn);
    if (!webcamSource) return;
    const unit = bounds.unit || 1;
    const {
        shape = 'circle',
        position = 'bottom-right',
        size: sizeRatio = 0.22,
        mirrored = false,
        borderWidth: defaultBorderWidth = 3 * unit,
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
        borderWidth = 3.5 * unit;
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
    ctx.shadowBlur = (isSpotlight ? 38 : 24) * unit;
    ctx.shadowOffsetY = (isSpotlight ? 4 : 10) * unit;
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

    const vw = webcamSource.videoWidth || webcamSource.displayWidth || webcamSource.naturalWidth || webcamSource.width || renderW;
    const vh = webcamSource.videoHeight || webcamSource.displayHeight || webcamSource.naturalHeight || webcamSource.height || renderH;
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
function _drawThemedCursor(ctx, x, y, scale = 1.0, theme = 'macos', swayAngle = 0) {
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
        if (swayAngle) ctx.rotate(swayAngle);
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
        if (swayAngle) ctx.rotate(swayAngle);
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
        if (swayAngle) ctx.rotate(swayAngle);
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
    _drawSyntheticCursor(ctx, x, y, scale, swayAngle);
}

/**
 * Draw crisp modern macOS-style synthetic pointer (OpenScreen / Screen Studio aesthetic)
 */
function _drawSyntheticCursor(ctx, x, y, scale = 1.0, swayAngle = 0) {
    ctx.save();
    ctx.translate(x, y);
    if (swayAngle) ctx.rotate(swayAngle);
    ctx.scale(scale, scale);

    // Proportions follow the classic macOS arrow (tip at the hotspot).
    const arrow = () => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 17.2);
        ctx.lineTo(4.1, 13.4);
        ctx.lineTo(6.9, 19.9);
        ctx.quadraticCurveTo(7.3, 20.8, 8.2, 20.4);
        ctx.lineTo(10.1, 19.6);
        ctx.quadraticCurveTo(11, 19.2, 10.6, 18.3);
        ctx.lineTo(7.9, 12.1);
        ctx.lineTo(13.4, 12.1);
        ctx.closePath();
    };

    // Soft drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 3.5;
    ctx.shadowOffsetY = 1.4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // White rim (drawn as a thick stroke under the body for a clean outline)
    arrow();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Body
    ctx.shadowColor = 'transparent';
    arrow();
    ctx.fillStyle = '#111114';
    ctx.fill();

    ctx.restore();
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
        if (k.typed) continue; // anonymous typing activity, not a shortcut to show
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

