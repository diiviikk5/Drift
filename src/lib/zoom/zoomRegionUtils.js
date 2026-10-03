/**
 * Zoom Region Utilities — Ported from OpenScreen / Recordly
 * Timeline calculations, transition curves, connected region gliding, and dominant region resolution
 */

import { clampFocusToScale } from './focusUtils.js';

export const TRANSITION_WINDOW_MS = 1015.05;
export const ZOOM_IN_TRANSITION_WINDOW_MS = TRANSITION_WINDOW_MS * 1.5;
export const ZOOM_IN_OVERLAP_MS = 500;
export const CHAINED_ZOOM_PAN_GAP_MS = 1500;
export const CONNECTED_ZOOM_PAN_DURATION_MS = 1000;

function clamp01(value) {
    return Math.max(0, Math.min(1, value));
}

function lerp(start, end, amount) {
    return start + (end - start) * amount;
}

/**
 * Screen Studio cubic bezier curve: (0.16, 1, 0.3, 1)
 */
function sampleCubicBezier(a1, a2, t) {
    const oneMinusT = 1 - t;
    return 3 * a1 * oneMinusT * oneMinusT * t +
        3 * a2 * oneMinusT * t * t +
        t * t * t;
}

function sampleCubicBezierDerivative(a1, a2, t) {
    const oneMinusT = 1 - t;
    return 3 * a1 * oneMinusT * oneMinusT +
        6 * (a2 - a1) * oneMinusT * t +
        3 * (1 - a2) * t * t;
}

export function cubicBezier(x1, y1, x2, y2, t) {
    const targetX = clamp01(t);
    let solvedT = targetX;

    for (let i = 0; i < 8; i += 1) {
        const currentX = sampleCubicBezier(x1, x2, solvedT) - targetX;
        const currentDerivative = sampleCubicBezierDerivative(x1, x2, solvedT);
        if (Math.abs(currentX) < 1e-6 || Math.abs(currentDerivative) < 1e-6) {
            break;
        }
        solvedT -= currentX / currentDerivative;
    }

    let lower = 0;
    let upper = 1;
    solvedT = clamp01(solvedT);

    for (let i = 0; i < 10; i += 1) {
        const currentX = sampleCubicBezier(x1, x2, solvedT);
        if (Math.abs(currentX - targetX) < 1e-6) {
            break;
        }
        if (currentX < targetX) {
            lower = solvedT;
        } else {
            upper = solvedT;
        }
        solvedT = (lower + upper) / 2;
    }

    return sampleCubicBezier(y1, y2, solvedT);
}

export function easeOutScreenStudio(t) {
    return cubicBezier(0.16, 1, 0.3, 1, t);
}

export function easeConnectedPan(value) {
    return cubicBezier(0.1, 0.0, 0.2, 1.0, value);
}

/**
 * Zero-velocity landing cubic ease-out
 */
export function easeOutCubic(t) {
    const x = clamp01(t);
    return 1 - Math.pow(1 - x, 3);
}

/**
 * Normalize input segment to standard millisecond-based zoom region
 */
export function toRegionMs(segment) {
    const startMs = segment.startMs ?? (segment.startTime != null ? segment.startTime * 1000 : 0);
    const endMs = segment.endMs ?? (segment.endTime != null ? segment.endTime * 1000 : startMs + 2000);
    const depth = segment.depth ?? segment.zoomScale ?? 1.8;
    const focus = segment.focus ?? {
        cx: segment.targetX ?? 0.5,
        cy: segment.targetY ?? 0.5,
    };
    return {
        id: segment.id || `zoom-${startMs}`,
        startMs,
        endMs,
        depth,
        zoomScale: depth,
        focus,
        sceneMode: segment.sceneMode,
        rawSegment: segment,
    };
}

/**
 * Computes region strength curve (0.0 to 1.0) at a given millisecond timestamp
 */
export function computeRegionStrength(region, timeMs) {
    const zoomInEnd = region.startMs + ZOOM_IN_OVERLAP_MS;
    const leadInStart = Math.max(0, zoomInEnd - ZOOM_IN_TRANSITION_WINDOW_MS);
    const leadOutEnd = region.endMs + TRANSITION_WINDOW_MS;

    if (timeMs <= leadInStart || timeMs >= leadOutEnd) {
        return 0;
    }

    if (timeMs < zoomInEnd) {
        const span = zoomInEnd - leadInStart;
        const progress = span <= 0 ? 1 : clamp01((timeMs - leadInStart) / span);
        return easeOutScreenStudio(progress);
    }

    if (timeMs <= region.endMs) {
        return 1;
    }

    // Smooth deceleration to 0 with zero-velocity landing
    const progress = clamp01((timeMs - region.endMs) / TRANSITION_WINDOW_MS);
    return 1 - easeOutScreenStudio(progress);
}

function getLinearFocus(start, end, amount) {
    return {
        cx: lerp(start.cx, end.cx, amount),
        cy: lerp(start.cy, end.cy, amount),
    };
}

function getResolvedFocus(region, zoomScale) {
    return clampFocusToScale(region.focus, zoomScale);
}

export function getConnectedRegionPairs(regions) {
    const sortedRegions = [...regions].sort((a, b) => a.startMs - b.startMs);
    const pairs = [];

    for (let index = 0; index < sortedRegions.length - 1; index += 1) {
        const currentRegion = sortedRegions[index];
        const nextRegion = sortedRegions[index + 1];

        // Do not connect special scene modes (overview, spotlight, full-camera)
        if (
            ['overview', 'spotlight', 'full-camera'].includes(currentRegion.sceneMode) ||
            ['overview', 'spotlight', 'full-camera'].includes(nextRegion.sceneMode)
        ) {
            continue;
        }

        const gapMs = nextRegion.startMs - currentRegion.endMs;
        if (gapMs > CHAINED_ZOOM_PAN_GAP_MS) {
            continue;
        }

        pairs.push({
            currentRegion,
            nextRegion,
            transitionStart: currentRegion.endMs,
            transitionEnd: currentRegion.endMs + CONNECTED_ZOOM_PAN_DURATION_MS,
        });
    }

    return pairs;
}

function getConnectedRegionTransition(connectedPairs, timeMs) {
    for (const pair of connectedPairs) {
        const { currentRegion, nextRegion, transitionStart, transitionEnd } = pair;

        if (timeMs < transitionStart || timeMs > transitionEnd) {
            continue;
        }

        const transitionProgress = easeConnectedPan(
            clamp01((timeMs - transitionStart) / Math.max(1, transitionEnd - transitionStart)),
        );
        const currentScale = currentRegion.depth ?? currentRegion.zoomScale ?? 1.8;
        const nextScale = nextRegion.depth ?? nextRegion.zoomScale ?? 1.8;
        const transitionScale = lerp(currentScale, nextScale, transitionProgress);
        const currentFocus = getResolvedFocus(currentRegion, currentScale);
        const nextFocus = getResolvedFocus(nextRegion, nextScale);
        const transitionFocus = getLinearFocus(currentFocus, nextFocus, transitionProgress);

        return {
            region: {
                ...nextRegion,
                focus: transitionFocus,
            },
            strength: 1,
            blendedScale: transitionScale,
            transition: {
                progress: transitionProgress,
                startFocus: currentFocus,
                endFocus: nextFocus,
                startScale: currentScale,
                endScale: nextScale,
            },
        };
    }

    return null;
}

function getConnectedRegionHold(timeMs, connectedPairs) {
    for (const pair of connectedPairs) {
        if (timeMs > pair.transitionEnd && timeMs < pair.nextRegion.startMs) {
            const nextScale = pair.nextRegion.depth ?? pair.nextRegion.zoomScale ?? 1.8;
            return {
                region: {
                    ...pair.nextRegion,
                    focus: getResolvedFocus(pair.nextRegion, nextScale),
                },
                strength: 1,
                blendedScale: null,
            };
        }
    }

    return null;
}

function getActiveRegion(regions, timeMs, connectedPairs) {
    const activeRegions = regions
        .map((region) => {
            const outgoingPair = connectedPairs.find((pair) => pair.currentRegion.id === region.id);
            if (outgoingPair && timeMs > outgoingPair.currentRegion.endMs) {
                return { region, strength: 0 };
            }

            const incomingPair = connectedPairs.find((pair) => pair.nextRegion.id === region.id);
            if (incomingPair && timeMs < incomingPair.transitionEnd) {
                return { region, strength: 0 };
            }

            return { region, strength: computeRegionStrength(region, timeMs) };
        })
        .filter((entry) => entry.strength > 0)
        .sort((left, right) => {
            if (right.strength !== left.strength) {
                return right.strength - left.strength;
            }
            return right.region.startMs - left.region.startMs;
        });

    if (activeRegions.length === 0) {
        return null;
    }

    const activeRegion = activeRegions[0].region;
    const activeScale = activeRegion.depth ?? activeRegion.zoomScale ?? 1.8;

    return {
        region: {
            ...activeRegion,
            focus: getResolvedFocus(activeRegion, activeScale),
        },
        strength: activeRegions[0].strength,
        blendedScale: null,
    };
}

/**
 * Finds the dominant zoom region and active transformation parameters
 * @param {Array<Object>} rawSegments - list of focus segments / zoom regions
 * @param {number} timeMs - current playback time in milliseconds
 * @param {Object} [options={}]
 * @param {boolean} [options.connectZooms=true] - enable smooth panning between nearby zoom regions
 */
export function findDominantRegion(rawSegments = [], timeMs, options = {}) {
    if (!rawSegments || rawSegments.length === 0) {
        return { region: null, strength: 0, blendedScale: null, transition: null };
    }

    const regions = rawSegments.map(toRegionMs);
    const connectZooms = options.connectZooms !== false;
    const connectedPairs = connectZooms ? getConnectedRegionPairs(regions) : [];

    if (connectZooms) {
        const connectedTransition = getConnectedRegionTransition(connectedPairs, timeMs);
        if (connectedTransition) {
            return connectedTransition;
        }

        const connectedHold = getConnectedRegionHold(timeMs, connectedPairs);
        if (connectedHold) {
            return { ...connectedHold, transition: null };
        }
    }

    const active = getActiveRegion(regions, timeMs, connectedPairs);
    return active
        ? { ...active, transition: null }
        : { region: null, strength: 0, blendedScale: null, transition: null };
}
