/**
 * Zoom Engine for Drift Effect
 * Handles cinematic auto-zoom with smooth easing
 * Zero server costs - all client-side
 */

// Easing functions for smooth animations
export const EASING_FUNCTIONS = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    // Screen Studio-style smooth
    driftSmooth: t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
};

export class ZoomEngine {
    constructor(options = {}) {
        // Canvas dimensions (for bounds)
        this.canvasWidth = options.width || 1920;
        this.canvasHeight = options.height || 1080;

        // Current state
        this.currentZoom = 1;
        this.currentCenterX = this.canvasWidth / 2;
        this.currentCenterY = this.canvasHeight / 2;

        // Animation state
        this.isAnimating = false;
        this.animationId = null;
        this.animations = []; // Queue of animations

        // Settings
        this.settings = {
            defaultZoomLevel: options.zoomLevel || 2.0,
            defaultDuration: options.duration || 500,
            defaultEasing: options.easing || "driftSmooth",
            resetDelay: options.resetDelay || 1500, // ms before auto-reset
            minZoom: options.minZoom || 1,
            maxZoom: options.maxZoom || 4,
            autoReset: options.autoReset ?? true,
            motionBlur: options.motionBlur ?? false,
        };

        // Keyframes for timeline editing
        this.keyframes = [];

        // Callbacks
        this.onZoomChange = options.onZoomChange || null;
        this.onKeyframeAdded = options.onKeyframeAdded || null;

        // Auto-reset timer
        this.resetTimer = null;
    }

    /**
     * Get current zoom state
     */
    getState() {
        return {
            zoom: this.currentZoom,
            centerX: this.currentCenterX,
            centerY: this.currentCenterY,
            isAnimating: this.isAnimating,
        };
    }

    /**
     * Zoom to a specific point
     */
    zoomTo(x, y, options = {}) {
        const {
            zoom = this.settings.defaultZoomLevel,
            duration = this.settings.defaultDuration,
            easing = this.settings.defaultEasing,
            addKeyframe = true,
            record = true,
        } = options;

        // Clamp zoom
        const clampedZoom = Math.max(this.settings.minZoom, Math.min(this.settings.maxZoom, zoom));

        // Clamp position to keep content in view
        const halfWidth = this.canvasWidth / (2 * clampedZoom);
        const halfHeight = this.canvasHeight / (2 * clampedZoom);

        const clampedX = Math.max(halfWidth, Math.min(this.canvasWidth - halfWidth, x));
        const clampedY = Math.max(halfHeight, Math.min(this.canvasHeight - halfHeight, y));

        // Create animation
        const animation = {
            startZoom: this.currentZoom,
            targetZoom: clampedZoom,
            startX: this.currentCenterX,
            targetX: clampedX,
            startY: this.currentCenterY,
            targetY: clampedY,
            duration,
            easing: EASING_FUNCTIONS[easing] || EASING_FUNCTIONS.driftSmooth,
            startTime: performance.now(),
        };

        // Cancel existing animation
        this._cancelAnimation();

        // Start new animation
        this.isAnimating = true;
        this._animate(animation);

        // Add keyframe for timeline
        if (addKeyframe && record) {
            const keyframe = {
                time: Date.now(),
                x: clampedX,
                y: clampedY,
                zoom: clampedZoom,
                duration,
                easing,
                type: "zoomIn",
            };
            this.keyframes.push(keyframe);

            if (this.onKeyframeAdded) {
                this.onKeyframeAdded(keyframe);
            }
        }

        // Schedule auto-reset
        if (this.settings.autoReset && clampedZoom > 1) {
            this._scheduleReset();
        }
    }

    /**
     * Reset zoom to default (1x, centered)
     */
    resetZoom(options = {}) {
        const {
            duration = this.settings.defaultDuration * 0.8,
            easing = "easeOutCubic",
            addKeyframe = true,
        } = options;

        this._clearResetTimer();

        const animation = {
            startZoom: this.currentZoom,
            targetZoom: 1,
            startX: this.currentCenterX,
            targetX: this.canvasWidth / 2,
            startY: this.currentCenterY,
            targetY: this.canvasHeight / 2,
            duration,
            easing: EASING_FUNCTIONS[easing] || EASING_FUNCTIONS.easeOutCubic,
            startTime: performance.now(),
        };

        this._cancelAnimation();
        this.isAnimating = true;
        this._animate(animation);

        if (addKeyframe) {
            const keyframe = {
                time: Date.now(),
                x: this.canvasWidth / 2,
                y: this.canvasHeight / 2,
                zoom: 1,
                duration,
                easing,
                type: "zoomOut",
            };
            this.keyframes.push(keyframe);

            if (this.onKeyframeAdded) {
                this.onKeyframeAdded(keyframe);
            }
        }
    }

    /**
     * Internal: Animate zoom
     */
    _animate(animation) {
        const { startZoom, targetZoom, startX, targetX, startY, targetY, duration, easing, startTime } = animation;

        const tick = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);

            // Interpolate values
            this.currentZoom = startZoom + (targetZoom - startZoom) * easedProgress;
            this.currentCenterX = startX + (targetX - startX) * easedProgress;
            this.currentCenterY = startY + (targetY - startY) * easedProgress;

            // Callback
            if (this.onZoomChange) {
                this.onZoomChange({
                    zoom: this.currentZoom,
                    centerX: this.currentCenterX,
                    centerY: this.currentCenterY,
                    progress,
                });
            }

            if (progress < 1) {
                this.animationId = requestAnimationFrame(tick);
            } else {
                this.isAnimating = false;
            }
        };

        this.animationId = requestAnimationFrame(tick);
    }

    /**
     * Cancel current animation
     */
    _cancelAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    }

    /**
     * Schedule auto-reset
     */
    _scheduleReset() {
        this._clearResetTimer();
        this.resetTimer = setTimeout(() => {
            this.resetZoom();
        }, this.settings.resetDelay);
    }

    /**
     * Clear reset timer
     */
    _clearResetTimer() {
        if (this.resetTimer) {
            clearTimeout(this.resetTimer);
            this.resetTimer = null;
        }
    }

    /**
     * Handle click event (auto-zoom)
     */
    handleClick(x, y, options = {}) {
        // If already zoomed, reset first then zoom to new location
        if (this.currentZoom > 1.5) {
            this.resetZoom({ duration: 200, addKeyframe: false });
            setTimeout(() => {
                this.zoomTo(x, y, options);
            }, 250);
        } else {
            this.zoomTo(x, y, options);
        }
    }

    /**
     * Get all keyframes
     */
    getKeyframes() {
        return [...this.keyframes];
    }

    /**
     * Clear keyframes
     */
    clearKeyframes() {
        this.keyframes = [];
    }

    /**
     * Add manual keyframe
     */
    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        this.keyframes.sort((a, b) => a.time - b.time);
        return this.keyframes;
    }

    /**
     * Remove keyframe by index
     */
    removeKeyframe(index) {
        this.keyframes.splice(index, 1);
        return this.keyframes;
    }

    /**
     * Update keyframe
     */
    updateKeyframe(index, updates) {
        if (this.keyframes[index]) {
            this.keyframes[index] = { ...this.keyframes[index], ...updates };
        }
        return this.keyframes;
    }

    /**
     * Update settings
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
    }

    /**
     * Destroy engine
     */
    destroy() {
        this._cancelAnimation();
        this._clearResetTimer();
        this.keyframes = [];
        this.onZoomChange = null;
        this.onKeyframeAdded = null;
    }
}
