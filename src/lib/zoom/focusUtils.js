/**
 * Focus Utilities — Ported from OpenScreen / Recordly
 * Prevents camera viewport from exposing canvas background or letterbox margins
 */

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function getFocusBoundsForScale(zoomScale) {
    const safeScale = Number.isFinite(zoomScale) && zoomScale > 0 ? zoomScale : 1;
    const marginX = 1 / (2 * safeScale);
    const marginY = 1 / (2 * safeScale);

    return {
        minX: marginX,
        maxX: 1 - marginX,
        minY: marginY,
        maxY: 1 - marginY,
    };
}

export function clampFocusToScale(focus, zoomScale) {
    const rawX = focus ? (focus.cx ?? focus.x ?? 0.5) : 0.5;
    const rawY = focus ? (focus.cy ?? focus.y ?? 0.5) : 0.5;

    const baseFocus = {
        cx: clamp(rawX, 0, 1),
        cy: clamp(rawY, 0, 1),
    };

    const safeScale = Number.isFinite(zoomScale) && zoomScale > 1 ? zoomScale : 1;
    if (safeScale <= 1.0001) {
        return { cx: 0.5, cy: 0.5 };
    }

    const bounds = getFocusBoundsForScale(safeScale);

    return {
        cx: clamp(baseFocus.cx, bounds.minX, bounds.maxX),
        cy: clamp(baseFocus.cy, bounds.minY, bounds.maxY),
    };
}
