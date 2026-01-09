/**
 * Cursor Tracker for Drift Effect
 * Tracks cursor position and detects click events for auto-zoom
 * All client-side, zero cost
 */

export class CursorTracker {
    constructor(options = {}) {
        // Tracking state
        this.isTracking = false;
        this.events = [];
        this.startTime = 0;

        // Position
        this.currentX = 0;
        this.currentY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.lastTime = 0;

        // Settings
        this.sampleRate = options.sampleRate || 60; // samples per second
        this.smoothing = options.smoothing || 0.3; // position smoothing factor
        this.velocityThreshold = options.velocityThreshold || 500; // px/s for "fast" movement
        this.clickZoomEnabled = options.clickZoomEnabled ?? true;
        this.movementZoomEnabled = options.movementZoomEnabled ?? false;

        // Callbacks
        this.onPositionUpdate = options.onPositionUpdate || null;
        this.onClick = options.onClick || null;
        this.onFastMovement = options.onFastMovement || null;

        // Bound handlers
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleMouseDown = this._handleMouseDown.bind(this);
        this._handleMouseUp = this._handleMouseUp.bind(this);

        // Sample interval
        this.sampleInterval = null;
    }

    /**
     * Get relative position within a target element
     */
    getRelativePosition(element) {
        if (!element) return { x: this.currentX, y: this.currentY };

        const rect = element.getBoundingClientRect();
        return {
            x: ((this.currentX - rect.left) / rect.width) * element.width,
            y: ((this.currentY - rect.top) / rect.height) * element.height,
        };
    }

    /**
     * Start tracking cursor
     */
    start(targetElement = document) {
        if (this.isTracking) return;

        this.isTracking = true;
        this.startTime = performance.now();
        this.events = [];

        targetElement.addEventListener("mousemove", this._handleMouseMove);
        targetElement.addEventListener("mousedown", this._handleMouseDown);
        targetElement.addEventListener("mouseup", this._handleMouseUp);

        // Start sampling for velocity calculations
        this.sampleInterval = setInterval(() => {
            this._calculateVelocity();
        }, 1000 / this.sampleRate);
    }

    /**
     * Stop tracking
     */
    stop() {
        if (!this.isTracking) return;

        this.isTracking = false;

        document.removeEventListener("mousemove", this._handleMouseMove);
        document.removeEventListener("mousedown", this._handleMouseDown);
        document.removeEventListener("mouseup", this._handleMouseUp);

        if (this.sampleInterval) {
            clearInterval(this.sampleInterval);
        }
    }

    /**
     * Handle mouse move
     */
    _handleMouseMove(e) {
        // Apply smoothing
        this.currentX = this.lastX + (e.clientX - this.lastX) * this.smoothing;
        this.currentY = this.lastY + (e.clientY - this.lastY) * this.smoothing;

        if (this.onPositionUpdate) {
            this.onPositionUpdate({
                x: this.currentX,
                y: this.currentY,
                rawX: e.clientX,
                rawY: e.clientY,
                time: performance.now() - this.startTime,
            });
        }
    }

    /**
     * Handle mouse down (click start)
     */
    _handleMouseDown(e) {
        const event = {
            type: "mousedown",
            x: e.clientX,
            y: e.clientY,
            button: e.button,
            time: performance.now() - this.startTime,
        };

        this.events.push(event);

        if (this.onClick && this.clickZoomEnabled) {
            this.onClick(event);
        }
    }

    /**
     * Handle mouse up
     */
    _handleMouseUp(e) {
        const event = {
            type: "mouseup",
            x: e.clientX,
            y: e.clientY,
            button: e.button,
            time: performance.now() - this.startTime,
        };

        this.events.push(event);
    }

    /**
     * Calculate cursor velocity
     */
    _calculateVelocity() {
        const now = performance.now();
        const dt = (now - this.lastTime) / 1000; // seconds

        if (dt > 0 && this.lastTime > 0) {
            this.velocityX = (this.currentX - this.lastX) / dt;
            this.velocityY = (this.currentY - this.lastY) / dt;

            const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);

            // Detect fast movement
            if (speed > this.velocityThreshold && this.onFastMovement && this.movementZoomEnabled) {
                this.onFastMovement({
                    x: this.currentX,
                    y: this.currentY,
                    velocityX: this.velocityX,
                    velocityY: this.velocityY,
                    speed,
                    time: now - this.startTime,
                });
            }
        }

        this.lastX = this.currentX;
        this.lastY = this.currentY;
        this.lastTime = now;
    }

    /**
     * Get all recorded events
     */
    getEvents() {
        return [...this.events];
    }

    /**
     * Get click events only
     */
    getClickEvents() {
        return this.events.filter(e => e.type === "mousedown");
    }

    /**
     * Clear recorded events
     */
    clearEvents() {
        this.events = [];
    }

    /**
     * Destroy tracker
     */
    destroy() {
        this.stop();
        this.events = [];
        this.onPositionUpdate = null;
        this.onClick = null;
        this.onFastMovement = null;
    }
}
