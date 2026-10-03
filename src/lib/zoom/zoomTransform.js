/**
 * Zoom Transform Geometry — Ported from OpenScreen / Recordly
 * Pure deterministic geometry for camera stage scaling and translation
 */

/**
 * Computes camera scale and translation offsets
 * @param {Object} params
 * @param {{ width: number, height: number }} params.stageSize - canvas width & height
 * @param {{ x: number, y: number, width: number, height: number }} params.baseMask - content frame bounds
 * @param {number} params.zoomScale - target zoom magnification (e.g. 1.8)
 * @param {number} [params.zoomProgress=1] - transition strength (0.0 to 1.0)
 * @param {number} params.focusX - normalized focus X (0.0 to 1.0)
 * @param {number} params.focusY - normalized focus Y (0.0 to 1.0)
 * @returns {{ scale: number, x: number, y: number }}
 */
export function computeZoomTransform({
    stageSize,
    baseMask,
    zoomScale,
    zoomProgress = 1,
    focusX,
    focusY,
}) {
    if (
        !stageSize ||
        stageSize.width <= 0 ||
        stageSize.height <= 0 ||
        !baseMask ||
        baseMask.width <= 0 ||
        baseMask.height <= 0
    ) {
        return { scale: 1, x: 0, y: 0 };
    }

    const progress = Math.min(1, Math.max(0, zoomProgress));
    const safeZoomScale = Number.isFinite(zoomScale) && zoomScale > 0 ? zoomScale : 1;

    const focusStagePxX = baseMask.x + focusX * baseMask.width;
    const focusStagePxY = baseMask.y + focusY * baseMask.height;
    const stageCenterX = stageSize.width / 2;
    const stageCenterY = stageSize.height / 2;

    const scale = 1 + (safeZoomScale - 1) * progress;
    const finalX = stageCenterX - focusStagePxX * safeZoomScale;
    const finalY = stageCenterY - focusStagePxY * safeZoomScale;

    return {
        scale,
        x: finalX * progress || 0,
        y: finalY * progress || 0,
    };
}

/**
 * Recovers normalized focus { cx, cy } from an applied transform
 */
export function computeFocusFromTransform({
    stageSize,
    baseMask,
    zoomScale,
    x,
    y,
}) {
    if (
        !stageSize ||
        stageSize.width <= 0 ||
        stageSize.height <= 0 ||
        !baseMask ||
        baseMask.width <= 0 ||
        baseMask.height <= 0 ||
        zoomScale <= 0
    ) {
        return { cx: 0.5, cy: 0.5 };
    }

    const stageCenterX = stageSize.width / 2;
    const stageCenterY = stageSize.height / 2;
    const focusStagePxX = (stageCenterX - x) / zoomScale;
    const focusStagePxY = (stageCenterY - y) / zoomScale;

    return {
        cx: (focusStagePxX - baseMask.x) / baseMask.width,
        cy: (focusStagePxY - baseMask.y) / baseMask.height,
    };
}
