/**
 * ZoomConstruct — Studio Cinema Zoom Architecture & Global Standard
 * 
 * Semantic zoom presets (Subtle, Cinema, Focus). Timing and motion live in
 * InteractionAnalyzer (when/where/how much) and cameraTrack (planned shots and moves).
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

// Subtle by default: context stays readable around the work.
export const DEFAULT_ZOOM_SCALE = ZOOM_PRESETS.subtle?.scale ?? 1.35;

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
