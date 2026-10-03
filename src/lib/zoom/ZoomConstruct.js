/**
 * ZoomConstruct — Studio Cinema Zoom Architecture & Global Standard
 * 
 * Provides the authoritative, centralized single source of truth for:
 * 1. Semantic Zoom Presets (Subtle, Cinema, Focus)
 * 2. Easing Dynamics (Anticipation ramp-in, zero-velocity overview landing, continuous pan)
 * 3. Temporal & Spatial Thresholds for Multi-Click Chaining
 */

export const ZOOM_PRESETS = Object.freeze({
    subtle: {
        id: 'subtle',
        scale: 1.35,
        label: 'Subtle',
        description: 'Tasteful lil zoom on clicks. Preserves broad UI context while gently highlighting target.',
    },
    cinema: {
        id: 'cinema',
        scale: 1.55,
        label: 'Cinema',
        description: 'Standard balanced studio framing. The gold-standard depth for screen recordings.',
    },
    focus: {
        id: 'focus',
        scale: 1.85,
        label: 'Focus',
        description: 'High-density focus for code, terminal commands, or fine detail.',
    },
});

export const DEFAULT_ZOOM_SCALE = ZOOM_PRESETS.cinema.scale; // 1.55

export const ZOOM_DYNAMICS = Object.freeze({
    // Standard ramp durations in seconds (luxurious, calm transitions)
    rampInDuration: 0.80,       // seconds to smoothly ease into zoom (calm anticipation)
    rampOutDuration: 1.05,      // seconds to silky decelerate back to overview (zero exit velocity)
    
    // Multi-click chaining thresholds (S-tier sustained scenes, no rapid yo-yo zooming)
    chainedPanGapSec: 6.5,      // Gap threshold to chain consecutive interactions without zooming out
    clusterTimeGap: 4.5,        // Group clicks occurring within 4.5s
    clusterDistance: 0.45,      // Normalized screen distance for interaction clustering
    mergeGapThreshold: 5.0,     // Merge proximity threshold in seconds
    
    // Anticipation & Hold (giving viewers comfortable time to read without rushing to unzoom)
    clickPaddingPre: 0.40,      // Anticipation pre-padding (begins zooming gently before click lands)
    clickPaddingPost: 2.2,      // Sustained hold view after click to allow reading results calmly
    minSegmentDuration: 2.0,    // Minimum hold duration to prevent frantic yo-yo zooming
    deadzoneRadius: 0.18,       // Generous calm center: mouse moves freely without sloppy camera wobble
    trackDamping: 0.35,         // Heavy studio damping when cursor approaches screen edges (no shaky-cam)
    
    // Motion profiles
    profiles: {
        cinematic: { rampIn: 0.80, rampOut: 1.05, panEase: 'cinema' },
        natural: { rampIn: 0.65, rampOut: 0.85, panEase: 'natural' },
        snappy: { rampIn: 0.42, rampOut: 0.55, panEase: 'snappy' },
    }
});

/**
 * Resolve zoom scale to closest known preset
 * @param {string|number} value
 * @returns {{ id: string, scale: number, label: string, description: string }}
 */
export function resolveZoomPreset(value) {
    if (typeof value === 'string') {
        const key = value.toLowerCase().trim();
        if (ZOOM_PRESETS[key]) return ZOOM_PRESETS[key];
    }
    const num = Number(value);
    if (!Number.isFinite(num)) return ZOOM_PRESETS.cinema;
    if (num <= 1.45) return ZOOM_PRESETS.subtle;
    if (num <= 1.70) return ZOOM_PRESETS.cinema;
    return ZOOM_PRESETS.focus;
}

/**
 * Luxury cubic-bezier easing with gentle acceleration
 * @param {number} t Progress [0, 1]
 * @returns {number}
 */
export function easeCinemaRampIn(t) {
    const clamped = Math.max(0, Math.min(1, t));
    // High-order smoothstep landing: 3t^2 - 2t^3 with gentle start
    return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Silky overview landing curve with zero exit velocity
 * Settles imperceptibly to 1.0x without abrupt drop
 * @param {number} t Progress [0, 1]
 * @returns {number}
 */
export function easeCinemaRampOut(t) {
    const clamped = Math.max(0, Math.min(1, t));
    const inv = 1 - clamped;
    return 1 - (inv * inv * (3 - 2 * inv));
}

/**
 * Inter-target camera pan curve for chained zooms
 * Fluid dolly glide between target A and target B
 * @param {number} t Progress [0, 1]
 * @returns {number}
 */
export function easeChainedPan(t) {
    const clamped = Math.max(0, Math.min(1, t));
    // Quintic polynomial (smoothstep of order 2) for zero velocity & acceleration at endpoints
    return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}
