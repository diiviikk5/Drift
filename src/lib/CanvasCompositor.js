/**
 * Canvas Compositor for Drift
 * Composites screen capture + webcam overlay + zoom effects
 * All processing happens client-side - completely free
 */

// Easing functions for smooth animations
const EASING = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
};

export class CanvasCompositor {
    constructor(options = {}) {
        this.width = options.width || 1920;
        this.height = options.height || 1080;
        this.frameRate = options.frameRate || 60;

        // Create main canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d", {
            alpha: false,
            desynchronized: true, // Better performance
        });

        // Source streams
        this.screenVideo = null;
        this.webcamVideo = null;

        // Animation state
        this.isRunning = false;
        this.animationFrameId = null;

        // Zoom state
        this.currentZoom = 1;
        this.targetZoom = 1;
        this.zoomCenterX = this.width / 2;
        this.zoomCenterY = this.height / 2;
        this.targetCenterX = this.width / 2;
        this.targetCenterY = this.height / 2;
        this.zoomStartTime = 0;
        this.zoomDuration = 500;
        this.zoomEasing = "easeOutCubic";

        // Webcam settings
        this.webcamSettings = {
            enabled: false,
            shape: "circle", // circle, rounded, square
            position: "bottom-right",
            size: 200,
            mirrored: true,
            offsetX: 32,
            offsetY: 32,
            borderWidth: 4,
            borderColor: "#ffffff",
        };

        // Click ripple effects
        this.ripples = [];

        // Focus mode
        this.focusMode = {
            enabled: false,
            opacity: 0.7,
            type: "blur", // blur, gradient, solid
        };

        // Branding/background
        this.branding = {
            enabled: false,
            padding: 32,
            backgroundColor: "#1a1a2e",
            gradient: null,
            borderRadius: 12,
            shadow: true,
        };

        // Cursor tracking
        this.cursorX = this.width / 2;
        this.cursorY = this.height / 2;
        this.showCursor = true;
        this.cursorHighlight = true;

        // Callbacks
        this.onFrame = null;
        this.onCursorEvent = null;
    }

    /**
     * Set the screen source stream
     */
    setScreenSource(stream) {
        if (!stream) {
            this.screenVideo = null;
            return;
        }

        this.screenVideo = document.createElement("video");
        this.screenVideo.srcObject = stream;
        this.screenVideo.muted = true;
        this.screenVideo.playsInline = true;
        this.screenVideo.play();

        // Update dimensions based on video
        const video = this.screenVideo;
        video.onloadedmetadata = () => {
            // Guard against null (can happen if stream is stopped before metadata loads)
            if (!video || !video.videoWidth || !video.videoHeight) return;

            // Keep aspect ratio, scale to fit canvas
            const videoAspect = video.videoWidth / video.videoHeight;
            const canvasAspect = this.width / this.height;

            if (videoAspect > canvasAspect) {
                this.renderWidth = this.width;
                this.renderHeight = this.width / videoAspect;
            } else {
                this.renderHeight = this.height;
                this.renderWidth = this.height * videoAspect;
            }

            this.renderX = (this.width - this.renderWidth) / 2;
            this.renderY = (this.height - this.renderHeight) / 2;
        };
    }

    /**
     * Set the webcam source stream
     */
    setWebcamSource(stream) {
        if (!stream) {
            this.webcamVideo = null;
            return;
        }

        this.webcamVideo = document.createElement("video");
        this.webcamVideo.srcObject = stream;
        this.webcamVideo.muted = true;
        this.webcamVideo.playsInline = true;
        this.webcamVideo.play();
    }

    /**
     * Update webcam settings
     */
    updateWebcamSettings(settings) {
        this.webcamSettings = { ...this.webcamSettings, ...settings };
    }

    /**
     * Trigger zoom to a point
     */
    zoomTo(x, y, zoomLevel = 2, duration = 500, easing = "easeOutCubic") {
        this.targetZoom = zoomLevel;
        this.targetCenterX = x;
        this.targetCenterY = y;
        this.zoomStartTime = performance.now();
        this.zoomDuration = duration;
        this.zoomEasing = easing;
        this.startZoom = this.currentZoom;
        this.startCenterX = this.zoomCenterX;
        this.startCenterY = this.zoomCenterY;
    }

    /**
     * Reset zoom to default
     */
    resetZoom(duration = 400) {
        this.zoomTo(this.width / 2, this.height / 2, 1, duration);
    }

    /**
     * Add click ripple effect
     */
    addRipple(x, y) {
        this.ripples.push({
            x,
            y,
            startTime: performance.now(),
            duration: 600,
            maxRadius: 50,
            color: "rgba(255, 255, 255, 0.6)",
        });
    }

    /**
     * Update cursor position and trigger events
     */
    updateCursor(x, y, isClick = false) {
        this.cursorX = x;
        this.cursorY = y;

        if (isClick) {
            // Trigger click ripple
            this.addRipple(x, y);

            // Callback for recording
            if (this.onCursorEvent) {
                this.onCursorEvent({ type: "click", x, y, time: performance.now() });
            }
        }
    }

    /**
     * Get webcam position based on preset
     */
    getWebcamPosition() {
        const { position, size, offsetX, offsetY } = this.webcamSettings;

        switch (position) {
            case "top-left":
                return { x: offsetX, y: offsetY };
            case "top-right":
                return { x: this.width - size - offsetX, y: offsetY };
            case "bottom-left":
                return { x: offsetX, y: this.height - size - offsetY };
            case "bottom-right":
            default:
                return { x: this.width - size - offsetX, y: this.height - size - offsetY };
        }
    }

    /**
     * Draw webcam overlay with shape masking
     */
    drawWebcam() {
        if (!this.webcamVideo || !this.webcamSettings.enabled) return;

        const { shape, size, mirrored, borderWidth, borderColor } = this.webcamSettings;
        const pos = this.getWebcamPosition();

        this.ctx.save();

        // Create clipping path based on shape
        this.ctx.beginPath();

        if (shape === "circle") {
            const radius = size / 2;
            this.ctx.arc(pos.x + radius, pos.y + radius, radius, 0, Math.PI * 2);
        } else if (shape === "rounded") {
            const radius = size * 0.15;
            this.roundRect(pos.x, pos.y, size, size, radius);
        } else {
            this.ctx.rect(pos.x, pos.y, size, size);
        }

        this.ctx.clip();

        // Draw webcam video (mirror if needed)
        if (mirrored) {
            this.ctx.translate(pos.x + size, pos.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.webcamVideo, 0, 0, size, size);
        } else {
            this.ctx.drawImage(this.webcamVideo, pos.x, pos.y, size, size);
        }

        this.ctx.restore();

        // Draw border
        if (borderWidth > 0) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = borderWidth;
            this.ctx.beginPath();

            if (shape === "circle") {
                const radius = size / 2;
                this.ctx.arc(pos.x + radius, pos.y + radius, radius - borderWidth / 2, 0, Math.PI * 2);
            } else if (shape === "rounded") {
                const radius = size * 0.15;
                this.roundRect(pos.x + borderWidth / 2, pos.y + borderWidth / 2, size - borderWidth, size - borderWidth, radius);
            } else {
                this.ctx.rect(pos.x + borderWidth / 2, pos.y + borderWidth / 2, size - borderWidth, size - borderWidth);
            }

            this.ctx.stroke();
        }
    }

    /**
     * Helper: Draw rounded rectangle
     */
    roundRect(x, y, width, height, radius) {
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    /**
     * Draw click ripple effects
     */
    drawRipples() {
        const now = performance.now();

        this.ripples = this.ripples.filter(ripple => {
            const elapsed = now - ripple.startTime;
            if (elapsed > ripple.duration) return false;

            const progress = elapsed / ripple.duration;
            const radius = ripple.maxRadius * progress;
            const opacity = 1 - progress;

            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = ripple.color.replace("0.6", String(opacity * 0.6));
            this.ctx.lineWidth = 3 * (1 - progress);
            this.ctx.stroke();

            return true;
        });
    }

    /**
     * Draw cursor highlight
     */
    drawCursorHighlight() {
        if (!this.cursorHighlight) return;

        const radius = 20;

        // Glow effect
        const gradient = this.ctx.createRadialGradient(
            this.cursorX, this.cursorY, 0,
            this.cursorX, this.cursorY, radius
        );
        gradient.addColorStop(0, "rgba(255, 220, 0, 0.4)");
        gradient.addColorStop(1, "rgba(255, 220, 0, 0)");

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.cursorX, this.cursorY, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Apply zoom transformation
     */
    applyZoom() {
        const now = performance.now();
        const elapsed = now - this.zoomStartTime;

        if (elapsed < this.zoomDuration) {
            const progress = elapsed / this.zoomDuration;
            const easedProgress = EASING[this.zoomEasing]?.(progress) ?? progress;

            this.currentZoom = this.startZoom + (this.targetZoom - this.startZoom) * easedProgress;
            this.zoomCenterX = this.startCenterX + (this.targetCenterX - this.startCenterX) * easedProgress;
            this.zoomCenterY = this.startCenterY + (this.targetCenterY - this.startCenterY) * easedProgress;
        } else {
            this.currentZoom = this.targetZoom;
            this.zoomCenterX = this.targetCenterX;
            this.zoomCenterY = this.targetCenterY;
        }

        if (this.currentZoom !== 1) {
            this.ctx.translate(this.zoomCenterX, this.zoomCenterY);
            this.ctx.scale(this.currentZoom, this.currentZoom);
            this.ctx.translate(-this.zoomCenterX, -this.zoomCenterY);
        }
    }

    /**
     * Main render loop
     */
    render() {
        if (!this.isRunning) return;

        // Clear canvas
        this.ctx.fillStyle = this.branding.enabled ? this.branding.backgroundColor : "#000000";
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.save();

        // Apply zoom transformation
        this.applyZoom();

        // Draw screen capture
        if (this.screenVideo && this.screenVideo.readyState >= 2) {
            if (this.branding.enabled) {
                // Draw with padding and styling
                const padding = this.branding.padding;
                const innerWidth = this.width - padding * 2;
                const innerHeight = this.height - padding * 2;

                // Shadow
                if (this.branding.shadow) {
                    this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                    this.ctx.shadowBlur = 30;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 10;
                }

                // Rounded rectangle clip
                this.ctx.beginPath();
                this.roundRect(padding, padding, innerWidth, innerHeight, this.branding.borderRadius);
                this.ctx.clip();

                this.ctx.shadowColor = "transparent";
                this.ctx.drawImage(this.screenVideo, padding, padding, innerWidth, innerHeight);
            } else {
                // Full canvas
                this.ctx.drawImage(this.screenVideo, 0, 0, this.width, this.height);
            }
        }

        this.ctx.restore();

        // Draw overlays (not affected by zoom)
        this.drawCursorHighlight();
        this.drawRipples();
        this.drawWebcam();

        // Callback
        if (this.onFrame) {
            this.onFrame(this.canvas);
        }

        this.animationFrameId = requestAnimationFrame(() => this.render());
    }

    /**
     * Start rendering
     */
    start() {
        this.isRunning = true;
        this.render();
    }

    /**
     * Stop rendering
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    /**
     * Get canvas stream for recording
     */
    getStream() {
        return this.canvas.captureStream(this.frameRate);
    }

    /**
     * Get canvas element for preview
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        this.screenVideo = null;
        this.webcamVideo = null;
    }
}
