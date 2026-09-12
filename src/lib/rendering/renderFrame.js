/**
 * renderFrame — Deterministic Unified Screen Studio Compositor Pipeline
 * 
 * Shared 1:1 between interactive Studio Preview and offline WebCodecs / MP4 export.
 * Pure stateless rendering of background, framing, camera spring transforms,
 * click ripple waves, and synthetic sub-pixel cursor.
 */

// Gradient wallpaper palettes
export const WALLPAPERS = {
    bigSur: ['#d14545', '#e27b38', '#ebae42', '#2d60b3'],
    monterey: ['#591e77', '#93226a', '#c73a4c', '#181f62'],
    ventura: ['#e55d28', '#f19e38', '#e2385c', '#3b1c6e'],
    bloom: ['#6930c3', '#5390d9', '#4ea8de', '#48bfe3'],
    sonoma: ['#1d3557', '#457b9d', '#a8dadc', '#1d3557'],
    midnight: ['#090d16', '#111827', '#1f2937', '#0f172a'],
    obsidian: ['#050505', '#121214', '#18181b', '#0a0a0c'],
    cyberpunk: ['#0f051d', '#3b0764', '#701a75', '#0284c7'],
    driftLime: ['#061a0d', '#0d3319', '#14532d', '#DCFE50'],
};

/**
 * Smooth Hermite / Quintic interpolation
 */
function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Evaluate camera target and zoom at precise timestamp
 */
export function evaluateCameraAtTime(timeSec, focusSegments = [], mouseSamples = [], options = {}) {
    const zoomMultiplier = options.zoomMultiplier ?? 1.0;
    const transitionDuration = options.transitionDuration ?? 0.7; // seconds for smooth zoom ramp

    if (!focusSegments || focusSegments.length === 0) {
        return { x: 0.5, y: 0.5, scale: 1.0 };
    }

    // Find if we are inside or near any focus segment
    let activeSeg = null;
    let blendWeight = 0;

    for (const seg of focusSegments) {
        const leadIn = seg.startTime;
        const rampUpEnd = seg.startTime + transitionDuration;
        const rampDownStart = Math.max(rampUpEnd, seg.endTime - transitionDuration);
        const leadOut = seg.endTime;

        if (timeSec >= leadIn && timeSec <= leadOut) {
            activeSeg = seg;
            if (timeSec < rampUpEnd) {
                // Zooming in
                blendWeight = smoothstep(leadIn, rampUpEnd, timeSec);
            } else if (timeSec > rampDownStart) {
                // Zooming out
                blendWeight = 1 - smoothstep(rampDownStart, leadOut, timeSec);
            } else {
                // Fully zoomed in
                blendWeight = 1.0;
            }
            break;
        }
    }

    if (!activeSeg || blendWeight <= 0.001) {
        return { x: 0.5, y: 0.5, scale: 1.0 };
    }

    // Target zoom scale
    const targetScale = 1.0 + (activeSeg.zoomScale * zoomMultiplier - 1.0) * blendWeight;

    // Deadzone Box logic
    let targetX = activeSeg.targetX;
    let targetY = activeSeg.targetY;

    // If mouse telemetry is present, check against deadzone radius
    if (mouseSamples && mouseSamples.length > 0 && blendWeight > 0.5) {
        const cursor = getInterpolatedCursor(timeSec, mouseSamples);
        if (cursor) {
            const dx = cursor.x - targetX;
            const dy = cursor.y - targetY;
            const dist = Math.hypot(dx, dy);
            const deadzone = activeSeg.deadzoneRadius || 0.22;

            if (dist > deadzone) {
                // Cursor moved beyond deadzone bubble, gently pull camera
                const excess = dist - deadzone;
                const pullFactor = Math.min(0.5, excess / dist);
                targetX += dx * pullFactor;
                targetY += dy * pullFactor;
            }
        }
    }

    // Blend camera position from neutral (0.5, 0.5) to target (targetX, targetY)
    const curX = 0.5 + (targetX - 0.5) * blendWeight;
    const curY = 0.5 + (targetY - 0.5) * blendWeight;

    // Viewport boundary clamping
    const halfW = 0.5 / targetScale;
    const halfH = 0.5 / targetScale;
    const clampedX = Math.max(halfW, Math.min(1.0 - halfW, curX));
    const clampedY = Math.max(halfH, Math.min(1.0 - halfH, curY));

    return {
        x: clampedX,
        y: clampedY,
        scale: targetScale,
    };
}

/**
 * Binary search cursor sample interpolation for sub-pixel smooth pointer path
 */
export function getInterpolatedCursor(timeSec, mouseSamples = []) {
    if (!mouseSamples || mouseSamples.length === 0) return null;

    const timeMs = timeSec * 1000;

    let low = 0;
    let high = mouseSamples.length - 1;

    if (timeMs <= (mouseSamples[0].t || 0)) {
        const s = mouseSamples[0];
        return { x: s.x > 1 ? s.x / 1920 : s.x, y: s.y > 1 ? s.y / 1080 : s.y };
    }
    if (timeMs >= (mouseSamples[high].t || 0)) {
        const s = mouseSamples[high];
        return { x: s.x > 1 ? s.x / 1920 : s.x, y: s.y > 1 ? s.y / 1080 : s.y };
    }

    while (low <= high) {
        const mid = (low + high) >> 1;
        const tMid = mouseSamples[mid].t || 0;

        if (tMid < timeMs) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const prev = mouseSamples[Math.max(0, low - 1)];
    const next = mouseSamples[Math.min(mouseSamples.length - 1, low)];

    const tPrev = prev.t || 0;
    const tNext = next.t || 0;
    const alpha = tNext === tPrev ? 0 : Math.max(0, Math.min(1, (timeMs - tPrev) / (tNext - tPrev)));

    const pX = prev.x > 1 ? prev.x / 1920 : prev.x;
    const pY = prev.y > 1 ? prev.y / 1080 : prev.y;
    const nX = next.x > 1 ? next.x / 1920 : next.x;
    const nY = next.y > 1 ? next.y / 1080 : next.y;

    return {
        x: pX + (nX - pX) * alpha,
        y: pY + (nY - pY) * alpha,
    };
}

/**
 * Pure Deterministic Frame Render
 */
export function renderFrame(ctx, timeSec, videoSource, sessionData = {}, renderSettings = {}) {
    const { width, height } = ctx.canvas;
    const {
        background = 'bigSur',
        insetPadding = 0.08,      // 8% inset
        borderRadius = 18,        // corner radius in canvas px
        windowChrome = true,
        titleBarHeight = 34,
        shadowBlur = 45,
        shadowOffsetY = 24,
        shadowOpacity = 0.42,
        showCursor = false,
        cursorScale = 1.0,
        clickRipples = true,
        zoomMagnification = 1.0,
    } = renderSettings;

    const {
        focusSegments = [],
        mouseSamples = [],
        clicks = [],
    } = sessionData;

    // 1. Draw Background Gradient
    const colors = WALLPAPERS[background] || WALLPAPERS.bigSur;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    const step = 1 / (colors.length - 1);
    colors.forEach((c, i) => grad.addColorStop(i * step, c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Compute Inset Screen Frame
    const padX = width * insetPadding;
    const padY = height * insetPadding;
    const frameW = width - padX * 2;
    const frameH = height - padY * 2;
    const headerH = windowChrome ? titleBarHeight : 0;
    const videoH = frameH - headerH;

    // 3. Draw Ambient Drop Shadow
    ctx.save();
    ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetY = shadowOffsetY;
    ctx.fillStyle = '#000000';
    _drawRoundedRectPath(ctx, padX, padY, frameW, frameH, borderRadius);
    ctx.fill();
    ctx.restore();

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
    const camera = evaluateCameraAtTime(timeSec, focusSegments, mouseSamples, { zoomMultiplier: zoomMagnification });

    // 6. Draw Video Frame with Camera Transformation inside video area
    if (videoSource) {
        ctx.save();
        // Clip specifically to content area below header
        ctx.beginPath();
        ctx.rect(padX, padY + headerH, frameW, videoH);
        ctx.clip();

        // Translate origin to center of video area
        ctx.translate(padX + frameW * 0.5, padY + headerH + videoH * 0.5);
        // Scale by camera zoom
        ctx.scale(camera.scale, camera.scale);
        // Translate by negative camera position relative to center
        ctx.translate(-camera.x * frameW, -camera.y * videoH);

        // Draw source video filling video area
        ctx.drawImage(videoSource, 0, 0, frameW, videoH);

        // 7. Draw Click Ripple Waves in Screen Space
        if (clickRipples && clicks && clicks.length > 0) {
            const curMs = timeSec * 1000;
            for (const click of clicks) {
                const cTimeMs = click.time > 1000 ? click.time : click.time * 1000;
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

        // 8. Draw Synthetic Pointer (if clean capture without baked cursor)
        if (showCursor && mouseSamples && mouseSamples.length > 0) {
            const cursor = getInterpolatedCursor(timeSec, mouseSamples);
            if (cursor) {
                const curScreenX = cursor.x * frameW;
                const curScreenY = cursor.y * videoH;
                _drawSyntheticCursor(ctx, curScreenX, curScreenY, cursorScale * (frameW / 1920));
            }
        }

        ctx.restore();
    }

    ctx.restore(); // restore clipping rect
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
