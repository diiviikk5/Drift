/**
 * Unified Zoom Engine for Drift
 * Consolidates DriftEngine zoom, ZoomEngine, and StudioEngine zoom
 * into one time-based, buttery smooth system
 *
 * Features:
 * - Time-based smoothing (not framerate-dependent)
 * - Keyframe system with per-zoom customization
 * - Look-ahead anticipation
 * - 3-phase animation (zoom-in → hold → zoom-out)
 * - Continuous cursor following mode
 * - AI-generated keyframe support
 */

// ============================================================
// EASING FUNCTIONS
// ============================================================

export const EASING = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutQuint: t => 1 - Math.pow(1 - t, 5),
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    // Screen Studio-style smooth with slight overshoot
    driftSmooth: t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    // Drift signature — very smooth with minimal overshoot
    driftCinematic: t => {
        // Custom bezier approximation: ease-out with gentle deceleration
        const t2 = t * t;
        const t3 = t2 * t;
        return 3 * t2 - 2 * t3 + 0.15 * Math.sin(t * Math.PI) * (1 - t);
    },
};

// ============================================================
// SPEED PRESETS
// ============================================================

export const SPEED_PRESETS = {
    slow: { zoomIn: 1200, hold: 1500, zoomOut: 1200, smoothing: 6, anticipation: 500 },
    normal: { zoomIn: 800, hold: 1000, zoomOut: 800, smoothing: 8, anticipation: 400 },
    fast: { zoomIn: 450, hold: 600, zoomOut: 500, smoothing: 12, anticipation: 300 },
    instant: { zoomIn: 200, hold: 400, zoomOut: 300, smoothing: 20, anticipation: 150 },
};

// ============================================================
// UNIFIED ZOOM ENGINE
// ============================================================

export class UnifiedZoomEngine {
    constructor(options = {}) {
        // Canvas dimensions for bounds clamping
        this.width = options.width || 1920;
        this.height = options.height || 1080;

        // Camera state (normalized 0-1 coordinates)
        this.camera = { x: 0.5, y: 0.5, scale: 1.0 };
        this.target = { x: 0.5, y: 0.5, scale: 1.0 };

        // Settings
        this.zoomLevel = options.zoomLevel || 1.5;
        this.speedPreset = options.speedPreset || 'normal';
        this.minZoom = options.minZoom || 1.0;
        this.maxZoom = options.maxZoom || 4.0;
        this.edgePadding = options.edgePadding || 0.15; // Clamp clicks away from edges

        // Cursor following
        this.cursorFollowEnabled = options.cursorFollow || false;
        this.cursorFollowStrength = options.cursorFollowStrength || 0.03;
        this.cursorPosition = { x: 0.5, y: 0.5 };

        // Keyframes (zoom events)
        this.keyframes = [];
        this.activeKeyframe = null;
        this.lastKeyframeIdx = -1;

        // Time tracking for delta-time smoothing
        this._lastUpdateTime = 0;

        // Callbacks
        this.onZoomChange = options.onZoomChange || null;
        this.onKeyframeTriggered = options.onKeyframeTriggered || null;
    }

    // ============================================================
    // PROPERTIES
    // ============================================================

    get speed() {
        return SPEED_PRESETS[this.speedPreset] || SPEED_PRESETS.normal;
    }

    getState() {
        return {
            x: this.camera.x,
            y: this.camera.y,
            scale: this.camera.scale,
            isZoomed: this.camera.scale > 1.01,
            activeKeyframe: this.activeKeyframe,
        };
    }

    // ============================================================
    // KEYFRAME MANAGEMENT
    // ============================================================

    /**
     * Add a zoom keyframe
     */
    addKeyframe(keyframe) {
        const kf = {
            time: keyframe.time, // ms relative to recording start
            x: Math.max(this.edgePadding, Math.min(1 - this.edgePadding, keyframe.x)),
            y: Math.max(this.edgePadding, Math.min(1 - this.edgePadding, keyframe.y)),
            scale: Math.max(this.minZoom, Math.min(this.maxZoom, keyframe.scale || this.zoomLevel)),
            duration: keyframe.duration || this.speed.zoomIn,
            holdDuration: keyframe.holdDuration || this.speed.hold,
            outDuration: keyframe.outDuration || this.speed.zoomOut,
            easing: keyframe.easing || 'driftSmooth',
            speed: keyframe.speed || this.speedPreset,
            id: keyframe.id || `kf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        };

        this.keyframes.push(kf);
        this.keyframes.sort((a, b) => a.time - b.time);
        return kf;
    }

    /**
     * Bulk add keyframes (e.g., from AI)
     */
    setKeyframes(keyframes) {
        this.keyframes = keyframes.map(kf => this.addKeyframe(kf));
        this.keyframes.sort((a, b) => a.time - b.time);
        this.reset();
        return this.keyframes;
    }

    /**
     * Add keyframes from raw click events
     */
    addClicksAsKeyframes(clicks) {
        clicks.forEach(click => {
            this.addKeyframe({
                time: click.time,
                x: click.x,
                y: click.y,
                scale: click.scale || this.zoomLevel,
                speed: click.speed || this.speedPreset,
            });
        });
        return this.keyframes;
    }

    /**
     * Update an existing keyframe
     */
    updateKeyframe(id, updates) {
        const kf = this.keyframes.find(k => k.id === id);
        if (kf) {
            Object.assign(kf, updates);
            if (updates.x !== undefined) kf.x = Math.max(this.edgePadding, Math.min(1 - this.edgePadding, kf.x));
            if (updates.y !== undefined) kf.y = Math.max(this.edgePadding, Math.min(1 - this.edgePadding, kf.y));
            if (updates.scale !== undefined) kf.scale = Math.max(this.minZoom, Math.min(this.maxZoom, kf.scale));
            this.keyframes.sort((a, b) => a.time - b.time);
        }
        return kf;
    }

    /**
     * Remove a keyframe by id
     */
    removeKeyframe(id) {
        this.keyframes = this.keyframes.filter(k => k.id !== id);
    }

    /**
     * Clear all keyframes
     */
    clearKeyframes() {
        this.keyframes = [];
        this.reset();
    }

    /**
     * Get all keyframes
     */
    getKeyframes() {
        return [...this.keyframes];
    }

    // ============================================================
    // CORE UPDATE LOOP (call every frame)
    // ============================================================

    /**
     * Update camera position for the current time
     * @param {number} currentTimeMs - Current playback time in milliseconds
     * @param {number} [now] - Current wall-clock time (performance.now())
     */
    update(currentTimeMs, now = performance.now()) {
        // Calculate delta time for framerate-independent smoothing
        const deltaTime = this._lastUpdateTime ? (now - this._lastUpdateTime) / 1000 : 1 / 60;
        this._lastUpdateTime = now;

        // Clamp delta to prevent huge jumps
        const dt = Math.min(deltaTime, 0.1);

        // Get the speed preset
        const sp = this.speed;

        // Check for scrub backwards
        if (this.activeKeyframe && currentTimeMs < this.activeKeyframe.time - 500) {
            this.activeKeyframe = null;
            this.lastKeyframeIdx = -1;
            this.camera = { x: 0.5, y: 0.5, scale: 1 };
            this.target = { x: 0.5, y: 0.5, scale: 1 };
        }

        // ---- Find and trigger keyframes ----
        if (!this.activeKeyframe) {
            for (let i = 0; i < this.keyframes.length; i++) {
                const kf = this.keyframes[i];
                const diff = currentTimeMs - kf.time;

                // Look-ahead anticipation: subtly nudge camera toward upcoming click
                const anticipationMs = SPEED_PRESETS[kf.speed || this.speedPreset]?.anticipation || sp.anticipation;
                if (diff > -anticipationMs && diff < 0 && i > this.lastKeyframeIdx) {
                    const anticipation = 1 - Math.abs(diff) / anticipationMs;
                    this.target.x = 0.5 + (kf.x - 0.5) * anticipation * 0.08;
                    this.target.y = 0.5 + (kf.y - 0.5) * anticipation * 0.08;
                }

                // Trigger zoom
                if (diff >= 0 && diff < 200 && i > this.lastKeyframeIdx) {
                    this._triggerKeyframe(kf, currentTimeMs, now);
                    this.lastKeyframeIdx = i;

                    if (this.onKeyframeTriggered) {
                        this.onKeyframeTriggered(kf, i);
                    }
                    break;
                }
            }

            // Default: center
            if (!this.activeKeyframe) {
                this.target.x = 0.5;
                this.target.y = 0.5;
                this.target.scale = 1.0;
            }
        }

        // ---- Animate active keyframe ----
        if (this.activeKeyframe) {
            const elapsed = now - this.activeKeyframe.startWallTime;
            const kf = this.activeKeyframe;
            const kfSpeed = SPEED_PRESETS[kf.speed || this.speedPreset] || sp;

            const zoomInDur = kf.duration || kfSpeed.zoomIn;
            const holdDur = kf.holdDuration || kfSpeed.hold;
            const zoomOutDur = kf.outDuration || kfSpeed.zoomOut;

            const easingFn = EASING[kf.easing] || EASING.driftSmooth;
            const outEasing = EASING.easeInOutQuart;

            if (elapsed < zoomInDur) {
                // Phase 1: Zoom in
                const t = elapsed / zoomInDur;
                const e = easingFn(t);
                this.target.scale = 1 + (kf.scale - 1) * e;
                this.target.x = 0.5 + (kf.x - 0.5) * e;
                this.target.y = 0.5 + (kf.y - 0.5) * e;
            } else if (elapsed < zoomInDur + holdDur) {
                // Phase 2: Hold
                this.target.scale = kf.scale;
                this.target.x = kf.x;
                this.target.y = kf.y;
            } else if (elapsed < zoomInDur + holdDur + zoomOutDur) {
                // Phase 3: Zoom out
                const t = (elapsed - zoomInDur - holdDur) / zoomOutDur;
                const e = outEasing(t);
                this.target.scale = kf.scale - (kf.scale - 1) * e;
                this.target.x = kf.x + (0.5 - kf.x) * e;
                this.target.y = kf.y + (0.5 - kf.y) * e;
            } else {
                // Done
                this.target = { x: 0.5, y: 0.5, scale: 1.0 };
                this.activeKeyframe = null;
            }
        }

        // ---- Cursor following (gentle pan when not zooming) ----
        if (this.cursorFollowEnabled && !this.activeKeyframe && this.camera.scale < 1.05) {
            this.target.x += (this.cursorPosition.x - 0.5) * this.cursorFollowStrength;
            this.target.y += (this.cursorPosition.y - 0.5) * this.cursorFollowStrength;
        }

        // ---- Apply time-based smoothing ----
        // This is the key difference from old code: smoothing is proportional to delta time
        const smoothingFactor = 1 - Math.exp(-sp.smoothing * dt);
        this.camera.x += (this.target.x - this.camera.x) * smoothingFactor;
        this.camera.y += (this.target.y - this.camera.y) * smoothingFactor;
        this.camera.scale += (this.target.scale - this.camera.scale) * smoothingFactor;

        // Notify
        if (this.onZoomChange) {
            this.onZoomChange(this.getState());
        }
    }

    /**
     * Update cursor position (for cursor following mode)
     */
    updateCursorPosition(x, y) {
        this.cursorPosition.x = x;
        this.cursorPosition.y = y;
    }

    // ============================================================
    // MANUAL ZOOM CONTROLS
    // ============================================================

    /**
     * Manually trigger a zoom to a point (for live preview / click-zoom)
     */
    zoomTo(x, y, options = {}) {
        const kf = {
            x: Math.max(this.edgePadding, Math.min(1 - this.edgePadding, x)),
            y: Math.max(this.edgePadding, Math.min(1 - this.edgePadding, y)),
            scale: options.scale || this.zoomLevel,
            duration: options.duration || this.speed.zoomIn,
            holdDuration: options.holdDuration || this.speed.hold,
            outDuration: options.outDuration || this.speed.zoomOut,
            easing: options.easing || 'driftSmooth',
            speed: options.speed || this.speedPreset,
        };

        this._triggerKeyframe(kf, 0, performance.now());
    }

    /**
     * Reset zoom to center
     */
    resetZoom() {
        this.activeKeyframe = null;
        this.target = { x: 0.5, y: 0.5, scale: 1.0 };
    }

    // ============================================================
    // INTERNAL
    // ============================================================

    _triggerKeyframe(kf, currentTimeMs, now) {
        this.activeKeyframe = {
            ...kf,
            startWallTime: now,
            videoTimeTriggered: currentTimeMs,
            startX: this.camera.x,
            startY: this.camera.y,
            startScale: this.camera.scale,
        };

        this.target = { x: kf.x, y: kf.y, scale: kf.scale };
    }

    /**
     * Reset the engine state (for seeking, re-export, etc.)
     */
    reset() {
        this.camera = { x: 0.5, y: 0.5, scale: 1.0 };
        this.target = { x: 0.5, y: 0.5, scale: 1.0 };
        this.activeKeyframe = null;
        this.lastKeyframeIdx = -1;
        this._lastUpdateTime = 0;
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        this.reset();
        this.keyframes = [];
        this.onZoomChange = null;
        this.onKeyframeTriggered = null;
    }
}

export default UnifiedZoomEngine;
