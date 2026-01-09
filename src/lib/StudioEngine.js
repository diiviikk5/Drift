// Studio Engine - Handles Post-Production (Zooming, Clicks, Export)

const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

const SPEED_PRESETS = {
    slow: { zoomIn: 1000, hold: 1200, zoomOut: 1000, smoothing: 0.05 },
    normal: { zoomIn: 750, hold: 1000, zoomOut: 750, smoothing: 0.07 },
    fast: { zoomIn: 400, hold: 600, zoomOut: 500, smoothing: 0.12 }
};

export class StudioEngine {
    constructor(canvas, videoElement, blob, clicks = []) {
        console.log('[Studio] Initializing with', clicks.length, 'clicks');

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.video = videoElement;

        this.blob = blob;
        this.clicks = clicks;

        this.camera = { x: 0.5, y: 0.5, scale: 1 };
        this.target = { x: 0.5, y: 0.5, scale: 1 };
        this.activeZoom = null;
        this.lastClickIdx = -1;

        this.zoomLevel = 1.5;
        this.speedPreset = 'slow';
        this.lookAheadMs = 400;

        // Customizable settings
        this.background = 'aurora';
        this.startPosition = 'center';
        this.trimStart = 0;
        this.trimEnd = 0;

        this.isPlaying = false;
        this.animationFrame = null;

        this.init();
    }

    get speed() { return SPEED_PRESETS[this.speedPreset]; }

    init() {
        console.log('[Studio] init() called');
        this.video.src = URL.createObjectURL(this.blob);
        this.video.muted = false; // Allow audio

        this.video.onloadedmetadata = () => {
            console.log('[Studio] Video metadata loaded, duration:', this.video.duration);
            this.canvas.width = this.video.videoWidth || 1920;
            this.canvas.height = this.video.videoHeight || 1080;

            // Handle Infinity duration (common with MediaRecorder blobs)
            if (!isFinite(this.video.duration)) {
                console.log('[Studio] Duration is Infinity, estimating from last click');
                // Estimate from recording - use last click time + 2 seconds
                const lastClick = this.clicks[this.clicks.length - 1];
                this.videoDuration = lastClick ? (lastClick.time / 1000 + 2) : 10;
            } else {
                this.videoDuration = this.video.duration;
            }
            console.log('[Studio] Using duration:', this.videoDuration);

            // Draw initial frame
            this.drawFrame();
        };

        this.video.onplay = () => {
            console.log('[Studio] Video playing, starting render loop');
            this.isPlaying = true;
            this.renderLoop();
        };
        this.video.onpause = () => {
            console.log('[Studio] Video paused');
            this.isPlaying = false;
            cancelAnimationFrame(this.animationFrame);
        };
        this.video.onended = () => {
            console.log('[Studio] Video ended');
            this.isPlaying = false;
        };
    }

    play() {
        console.log('[Studio] play() called');
        this.video.play().catch(e => console.error('[Studio] Play failed:', e));
    }

    pause() {
        this.video.pause();
    }

    resetCamera() {
        this.camera = { x: 0.5, y: 0.5, scale: 1 };
        this.target = { x: 0.5, y: 0.5, scale: 1 };
        this.activeZoom = null;
        this.lastClickIdx = -1;
    }

    renderLoop() {
        console.log('[Studio] renderLoop started');
        let frameCount = 0;
        const loop = () => {
            frameCount++;
            if (frameCount % 60 === 0) {
                console.log('[Studio] Frame:', frameCount, 'Playing:', this.isPlaying, 'Scale:', this.camera.scale.toFixed(2));
            }
            this.updateCamera();
            this.drawFrame();
            if (this.isPlaying) this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    updateCamera() {
        const currentMs = this.video.currentTime * 1000;
        const sp = this.speed;

        // Reset if scrubbed backwards (compare VIDEO times, not wall-clock)
        if (this.activeZoom && this.activeZoom.videoTimeTriggered && currentMs < this.activeZoom.videoTimeTriggered - 500) {
            console.log('[Studio] Scrubbed backwards, resetting zoom');
            this.activeZoom = null;
            this.lastClickIdx = -1;
            this.camera = { x: 0.5, y: 0.5, scale: 1 };
        }

        if (!this.activeZoom) {
            // Check for zooms
            for (let i = 0; i < this.clicks.length; i++) {
                const click = this.clicks[i];
                const diff = currentMs - click.time;

                // Anticipation
                if (diff > -this.lookAheadMs && diff < 0 && i > this.lastClickIdx) {
                    const anticipation = 1 - Math.abs(diff) / this.lookAheadMs;
                    this.target.x = 0.5 + (click.x - 0.5) * anticipation * 0.1;
                    this.target.y = 0.5 + (click.y - 0.5) * anticipation * 0.1;
                }

                if (diff >= 0 && diff < 200 && i > this.lastClickIdx) {
                    console.log('[Studio] TRIGGERING ZOOM on click', i, 'at', click.x, click.y, 'diff:', diff);
                    this.triggerZoom(click.x, click.y);
                    this.lastClickIdx = i;
                    break;
                }
            }

            // Default: Centered
            if (!this.activeZoom) {
                this.target = { x: 0.5, y: 0.5, scale: 1 };
            }
        }

        if (this.activeZoom) {
            const elapsed = performance.now() - this.activeZoom.startTime;
            // NOTE: In Desktop, using performance.now() is smooth but desyncs if video lags? 
            // Better to track video time? 
            // For now sticking to original logic logic.

            const { zoomIn, hold, zoomOut } = sp;

            if (elapsed < zoomIn) {
                const t = elapsed / zoomIn;
                const e = easeOutQuint(t);
                this.target.scale = 1 + (this.zoomLevel - 1) * e;
                this.target.x = 0.5 + (this.activeZoom.x - 0.5) * e;
                this.target.y = 0.5 + (this.activeZoom.y - 0.5) * e;
            } else if (elapsed < zoomIn + hold) {
                this.target.scale = this.zoomLevel;
                this.target.x = this.activeZoom.x;
                this.target.y = this.activeZoom.y;
            } else if (elapsed < zoomIn + hold + zoomOut) {
                const t = (elapsed - zoomIn - hold) / zoomOut;
                const e = easeInOutQuart(t);
                this.target.scale = this.zoomLevel - (this.zoomLevel - 1) * e;
                this.target.x = this.activeZoom.x + (0.5 - this.activeZoom.x) * e;
                this.target.y = this.activeZoom.y + (0.5 - this.activeZoom.y) * e;
            } else {
                this.target = { x: 0.5, y: 0.5, scale: 1 };
                this.activeZoom = null;
            }
        }

        // Apply smoothing
        this.camera.x += (this.target.x - this.camera.x) * sp.smoothing;
        this.camera.y += (this.target.y - this.camera.y) * sp.smoothing;
        this.camera.scale += (this.target.scale - this.camera.scale) * sp.smoothing;

        // Debug: Log camera when zooming
        if (this.activeZoom || this.camera.scale > 1.01) {
            console.log('[Studio] Camera:', this.camera.scale.toFixed(3), 'x:', this.camera.x.toFixed(3), 'y:', this.camera.y.toFixed(3));
        }
    }

    triggerZoom(x, y) {
        this.activeZoom = {
            x: Math.max(0.15, Math.min(0.85, x)),
            y: Math.max(0.15, Math.min(0.85, y)),
            startTime: performance.now(),
            videoTimeTriggered: this.video.currentTime * 1000
        };
        console.log('[Studio] Zoom started at video time:', this.activeZoom.videoTimeTriggered);
    }

    drawFrame() {
        const c = this.canvas;
        const ctx = this.ctx;
        const v = this.video;
        const cam = this.camera;

        // Background gradients
        const BACKGROUNDS = {
            aurora: ['#1a1a2e', '#2d1b4e', '#1e3a5f'],
            sunset: ['#ff6b6b', '#feca57', '#ff9ff3'],
            ocean: ['#0093E9', '#80D0C7'],
            forest: ['#134E5E', '#71B280'],
            nightsky: ['#0f0c29', '#302b63', '#24243e'],
            candy: ['#a855f7', '#ec4899', '#f43f5e']
        };

        // 1. Draw Background (Gradient)
        const colors = BACKGROUNDS[this.background] || BACKGROUNDS.aurora;
        const g = ctx.createLinearGradient(0, 0, c.width, c.height);
        colors.forEach((col, i) => g.addColorStop(i / (colors.length - 1 || 1), col));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);

        if (v.readyState >= 2) {
            ctx.save();

            // VIDEO DIMENSIONS (Scaled down to show background frame)
            const frameScale = 0.85;
            const vw = c.width * frameScale;
            // Maintain aspect ratio
            const vh = (v.videoHeight / v.videoWidth) * vw;

            // Center position
            const cx = c.width / 2;
            const cy = c.height / 2;

            // Apply Camera Transform (Zooming relative to center)
            ctx.translate(cx, cy);
            ctx.scale(cam.scale, cam.scale);

            // Pan camera (move content opposite to target)
            const panX = (cam.x - 0.5) * vw;
            const panY = (cam.y - 0.5) * vh;
            ctx.translate(-panX, -panY);

            // Draw Container (Mac Window Style)
            const r = 16;
            const x = -vw / 2;
            const y = -vh / 2;
            const w = vw;
            const h = vh;

            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 50;
            ctx.shadowOffsetY = 30;

            // Window Background (black backing)
            ctx.fillStyle = '#000';
            this.roundRect(ctx, x, y, w, h, r);
            ctx.fill();

            // Reset shadow for content
            ctx.shadowColor = 'transparent';

            // Clip for video
            ctx.save();
            this.roundRect(ctx, x, y, w, h, r);
            ctx.clip();

            // Draw Video
            ctx.drawImage(v, x, y, w, h);
            ctx.restore();

            // Draw Border / Highlights (Glass effect)
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            this.roundRect(ctx, x, y, w, h, r);
            ctx.stroke();

            // Draw Traffic Lights (Mac Buttons)
            const bx = x + 20;
            const by = y + 20;
            const gap = 24;

            ctx.fillStyle = '#FF5F56';
            ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFBD2E';
            ctx.beginPath(); ctx.arc(bx + gap, by, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#27C93F';
            ctx.beginPath(); ctx.arc(bx + gap * 2, by, 6, 0, Math.PI * 2); ctx.fill();

            ctx.restore();
        }
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.closePath();
    }

    // --- EXPORT FUNCTION ---
    async exportVideo(onProgress) {
        this.video.pause();
        this.video.currentTime = 0;

        // Reset ALL zoom state for fresh export
        this.activeZoom = null;
        this.lastClickIdx = -1; // Critical: Reset to allow all clicks to trigger
        this.camera = { x: 0.5, y: 0.5, scale: 1 };
        this.target = { x: 0.5, y: 0.5, scale: 1 };

        await new Promise(r => setTimeout(r, 500)); // buffer

        const stream = this.canvas.captureStream(60);

        // Add Audio (Video Audio)
        // Note: Logic simplified for now, assuming video has audio
        // Ideally we also mix the 'Click Sounds' here if added

        const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 15000000 });
        const chunks = [];

        rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

        return new Promise((resolve) => {
            rec.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };

            rec.start(100);
            this.video.play();

            const checkEnd = () => {
                if (this.video.ended) {
                    rec.stop();
                } else {
                    if (onProgress) onProgress(this.video.currentTime / this.videoDuration);
                    requestAnimationFrame(checkEnd);
                }
            };
            checkEnd();
        });
    }
}
