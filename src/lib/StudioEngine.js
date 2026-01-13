// Studio Engine - Handles Post-Production (Zooming, Clicks, Export)

// Smooth easing functions for cinematic transitions
const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

// Refined speed presets for buttery smooth zoom animations
const SPEED_PRESETS = {
    slow: { zoomIn: 1200, hold: 1500, zoomOut: 1200, smoothing: 0.04 },
    normal: { zoomIn: 900, hold: 1200, zoomOut: 900, smoothing: 0.06 },
    fast: { zoomIn: 500, hold: 800, zoomOut: 600, smoothing: 0.10 }
};

const FRAME_SCALE = 0.82;
const TITLE_BAR_HEIGHT = 36;

export class StudioEngine {
    constructor(canvas, videoElement, blob, clicks = [], duration = null) {
        console.log('[Studio] Initializing with', clicks.length, 'clicks, duration:', duration);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.video = videoElement;

        this.blob = blob;
        this.clicks = clicks;
        this.explicitDuration = duration; // Store explicit duration

        this.camera = { x: 0.5, y: 0.5, scale: 1 };
        this.target = { x: 0.5, y: 0.5, scale: 1 };
        this.activeZoom = null;
        this.lastClickIdx = -1;

        this.zoomLevel = 1.5;
        this.speedPreset = 'slow';
        this.lookAheadMs = 400;

        // Customizable settings
        this.background = 'bigSur'; // Default to macOS Big Sur style
        this.startPosition = 'center';
        this.trimStart = 0;
        this.trimEnd = 0;
        this.showCursor = false; // Aesthetic black cursor overlay

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
            if (this.explicitDuration) {
                this.videoDuration = this.explicitDuration;
            } else if (!isFinite(this.video.duration)) {
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

    addZoom(timeSec, x = 0.5, y = 0.5, scale = 1.5, speed = 'normal') {
        console.log('[Studio] Manual Zoom added at:', timeSec, 'Scale:', scale, 'Speed:', speed);
        // Add artificial click
        this.clicks.push({
            time: timeSec * 1000,
            x: x,
            y: y,
            scale: scale,
            speed: speed
        });
        // Sort clicks by time
        this.clicks.sort((a, b) => a.time - b.time);

        // Reset state to force re-evaluation
        this.lastClickIdx = -1;
        this.activeZoom = null;

        // Force immediate update to show preview if paused
        if (!this.isPlaying) {
            this.updateCamera();
            this.drawFrame();
        }
    }

    updateClick(index, updates) {
        if (index < 0 || index >= this.clicks.length) return;

        // Update the stored click data
        Object.assign(this.clicks[index], updates);
        console.log(`[Studio] Updated click ${index}:`, updates);

        // If this is the currently active/latest zoom, update the live state too
        if (this.lastClickIdx === index && this.activeZoom) {
            if (updates.scale !== undefined) {
                this.activeZoom.targetScale = updates.scale;
                this.activeZoom.scale = updates.scale;
                this.target.scale = updates.scale;
                if (!this.isPlaying) this.drawFrame();
            }
            if (updates.speed !== undefined) {
                this.activeZoom.speed = updates.speed;
            }
        }
    }

    resolveClick(normX, normY) {
        // Convert normalized canvas coords to absolute canvas coords
        const Px = normX * this.canvas.width;
        const Py = normY * this.canvas.height;

        // --- 1. Untranslate Center ---
        const P1x = Px - this.canvas.width / 2;
        const P1y = Py - this.canvas.height / 2;

        // --- 2. Unscale (Camera Zoom) ---
        const P2x = P1x / this.camera.scale;
        const P2y = P1y / this.camera.scale;

        // --- Dimensions (Must match drawFrame) ---
        const vw = this.canvas.width * FRAME_SCALE;
        const vRatio = this.video.videoHeight / this.video.videoWidth;
        const vh = vw * vRatio;
        const totalHeight = vh + TITLE_BAR_HEIGHT;

        // --- 3. Un-pan (Add Camera Pan back) ---
        // Pan amount in drawFrame is: (cam.x - 0.5) * vw
        const panX = (this.camera.x - 0.5) * vw;
        const panY = (this.camera.y - 0.5) * totalHeight;

        const P3x = P2x + panX;
        const P3y = P2y + panY;

        // --- 4. Map to Video Rect ---
        // Window drawing starts at x = -vw/2, y = -totalHeight/2
        // Video starts at WindowX, WindowY + TITLE_BAR_HEIGHT
        // We want P3 relative to Video Top-Left

        const winX = -vw / 2;
        const winY = -totalHeight / 2;
        const videoX = winX;
        const videoY = winY + TITLE_BAR_HEIGHT;

        const relX = P3x - videoX;
        const relY = P3y - videoY;

        // --- 5. Normalize to Video ---
        const finalX = relX / vw;
        const finalY = relY / vh;

        // Clamp to ensure valid click
        return {
            x: Math.max(0, Math.min(1, finalX)),
            y: Math.max(0, Math.min(1, finalY))
        };
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
                    const zoomScale = click.scale || this.zoomLevel;
                    const zoomSpeed = click.speed || 'normal';
                    console.log('[Studio] TRIGGERING ZOOM on click', i, 'at', click.x, click.y, 'Scale:', zoomScale, 'Speed:', zoomSpeed);
                    this.triggerZoom(click.x, click.y, zoomScale, zoomSpeed);
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

            // Resolve speed for THIS zoom
            const speedKey = this.activeZoom.speed || 'normal';
            const sp = SPEED_PRESETS[speedKey] || SPEED_PRESETS.normal;

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

    triggerZoom(x, y, scale = 1.5, speed = 'normal') {
        const clampedX = Math.max(0.15, Math.min(0.85, x));
        const clampedY = Math.max(0.15, Math.min(0.85, y));

        this.activeZoom = {
            x: clampedX,
            y: clampedY,
            scale: scale,
            speed: speed,
            startTime: performance.now(),
            videoTimeTriggered: this.video.currentTime * 1000,

            // Starting state for lerp
            startX: this.camera.x,
            startY: this.camera.y,
            startScale: this.camera.scale,
            targetScale: scale
        };

        // Update global target for smooth panning if not locked
        this.target = {
            x: clampedX,
            y: clampedY,
            scale: scale
        };

        console.log('[Studio] Zoom started at video time:', this.activeZoom.videoTimeTriggered);
    }

    drawFrame() {
        const c = this.canvas;
        const ctx = this.ctx;
        const v = this.video;
        const cam = this.camera;

        // Premium macOS-style gradient backgrounds (inspired by Big Sur, Monterey, Ventura, Sonoma)
        const BACKGROUNDS = {
            // macOS Big Sur - Pink/Orange/Purple
            bigSur: {
                type: 'radial',
                colors: [
                    { pos: 0, color: '#ff6b9d' },
                    { pos: 0.3, color: '#c44569' },
                    { pos: 0.5, color: '#6c5ce7' },
                    { pos: 0.8, color: '#0c3483' },
                    { pos: 1, color: '#1a1a2e' }
                ]
            },
            // macOS Monterey - Blue/Teal/Green
            monterey: {
                type: 'radial',
                colors: [
                    { pos: 0, color: '#00b894' },
                    { pos: 0.25, color: '#00cec9' },
                    { pos: 0.5, color: '#0984e3' },
                    { pos: 0.8, color: '#6c5ce7' },
                    { pos: 1, color: '#2d1b4e' }
                ]
            },
            // macOS Ventura - Red/Pink wave
            ventura: {
                type: 'diagonal',
                colors: [
                    { pos: 0, color: '#e17055' },
                    { pos: 0.3, color: '#d63031' },
                    { pos: 0.5, color: '#fd79a8' },
                    { pos: 0.7, color: '#a855f7' },
                    { pos: 1, color: '#1e3a5f' }
                ]
            },
            // Windows 11 Bloom - Blue flower
            bloom: {
                type: 'radial',
                colors: [
                    { pos: 0, color: '#74b9ff' },
                    { pos: 0.3, color: '#0984e3' },
                    { pos: 0.5, color: '#6c5ce7' },
                    { pos: 0.7, color: '#a855f7' },
                    { pos: 1, color: '#1a1a2e' }
                ]
            },
            // macOS Sonoma - Warm abstract
            sonoma: {
                type: 'diagonal',
                colors: [
                    { pos: 0, color: '#fdcb6e' },
                    { pos: 0.25, color: '#f39c12' },
                    { pos: 0.5, color: '#e74c3c' },
                    { pos: 0.75, color: '#9b59b6' },
                    { pos: 1, color: '#2c3e50' }
                ]
            },
            // Deep Night - Dark elegant
            midnight: {
                type: 'radial',
                colors: [
                    { pos: 0, color: '#2c3e50' },
                    { pos: 0.5, color: '#1a1a2e' },
                    { pos: 1, color: '#0a0a0f' }
                ]
            }
        };

        // Get background config
        const bgConfig = BACKGROUNDS[this.background] || BACKGROUNDS.bigSur;

        // Create gradient based on type
        let gradient;
        if (bgConfig.type === 'radial') {
            gradient = ctx.createRadialGradient(
                c.width * 0.3, c.height * 0.3, 0,
                c.width * 0.5, c.height * 0.5, c.width * 0.8
            );
        } else {
            gradient = ctx.createLinearGradient(0, 0, c.width, c.height);
        }

        bgConfig.colors.forEach(({ pos, color }) => gradient.addColorStop(pos, color));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, c.width, c.height);

        if (v.readyState >= 2) {
            ctx.save();

            // VIDEO DIMENSIONS (Scaled down to show background frame)
            const titleBarHeight = TITLE_BAR_HEIGHT;
            const vw = c.width * FRAME_SCALE;
            const vh = (v.videoHeight / v.videoWidth) * vw;
            const totalHeight = vh + titleBarHeight;

            // Center position
            const cx = c.width / 2;
            const cy = c.height / 2;

            // Apply Camera Transform (Zooming relative to center)
            ctx.translate(cx, cy);
            ctx.scale(cam.scale, cam.scale);

            // Pan camera (move content opposite to target)
            const panX = (cam.x - 0.5) * vw;
            const panY = (cam.y - 0.5) * totalHeight;
            ctx.translate(-panX, -panY);

            // Window container dimensions
            const r = 12;
            const x = -vw / 2;
            const y = -totalHeight / 2;
            const w = vw;
            const h = totalHeight;

            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 60;
            ctx.shadowOffsetY = 25;

            // Window Background (black backing)
            ctx.fillStyle = '#1a1a1a';
            this.roundRect(ctx, x, y, w, h, r);
            ctx.fill();

            // Reset shadow
            ctx.shadowColor = 'transparent';

            // --- TITLE BAR (Mac dots area - ABOVE the video) ---
            ctx.save();
            this.roundRect(ctx, x, y, w, titleBarHeight, { tl: r, tr: r, bl: 0, br: 0 });
            ctx.clip();

            // Title bar background (dark gray)
            ctx.fillStyle = '#2d2d2d';
            ctx.fillRect(x, y, w, titleBarHeight);

            // Draw Traffic Lights (Mac Buttons) - in title bar
            const bx = x + 18;
            const by = y + titleBarHeight / 2;
            const gap = 20;
            const dotRadius = 6;

            ctx.fillStyle = '#FF5F57';
            ctx.beginPath(); ctx.arc(bx, by, dotRadius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFBD2E';
            ctx.beginPath(); ctx.arc(bx + gap, by, dotRadius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#28C840';
            ctx.beginPath(); ctx.arc(bx + gap * 2, by, dotRadius, 0, Math.PI * 2); ctx.fill();

            ctx.restore();

            // --- VIDEO AREA (below title bar) ---
            ctx.save();
            // Clip to video area only (below title bar)
            ctx.beginPath();
            ctx.rect(x, y + titleBarHeight, w, vh);
            ctx.clip();

            // Draw Video
            ctx.drawImage(v, x, y + titleBarHeight, w, vh);

            // Optional: Draw cursor overlay
            if (this.showCursor && this.activeZoom) {
                const cursorX = x + this.activeZoom.x * w;
                const cursorY = y + titleBarHeight + this.activeZoom.y * vh;
                this.drawCursor(ctx, cursorX, cursorY);
            }

            ctx.restore();

            // Border / Highlight (Glass effect)
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            this.roundRect(ctx, x, y, w, h, r);
            ctx.stroke();

            ctx.restore();
        }
    }

    // Draw aesthetic black cursor
    drawCursor(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // Cursor shadow
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Black cursor with white outline
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 20);
        ctx.lineTo(5, 15);
        ctx.lineTo(9, 22);
        ctx.lineTo(12, 20);
        ctx.lineTo(8, 13);
        ctx.lineTo(14, 13);
        ctx.closePath();

        // White outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Black fill
        ctx.fillStyle = '#000000';
        ctx.fill();

        ctx.restore();
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

        // Capture at 60 FPS for smooth playback
        const stream = this.canvas.captureStream(60);

        // Add audio from the source video if available
        if (this.video.captureStream) {
            try {
                const videoStream = this.video.captureStream();
                const audioTracks = videoStream.getAudioTracks();
                audioTracks.forEach(track => stream.addTrack(track));
            } catch (e) {
                console.log('[Studio] Could not capture audio:', e);
            }
        }

        // Use VP8 for smoother playback (VP9 can have frame timing issues)
        // VP8 is more widely compatible and has consistent frame timing
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
            ? 'video/webm;codecs=vp8,opus'
            : 'video/webm';

        const rec = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 20000000  // 20 Mbps for high quality
        });
        const chunks = [];

        // Collect data more frequently for smoother playback
        rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

        return new Promise((resolve) => {
            rec.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };

            rec.start(20); // Small timeslice for smooth 60fps capture
            this.video.play();

            const checkEnd = () => {
                if (this.video.ended) {
                    rec.stop();
                } else {
                    // Safely calculate progress with bounds checking
                    const duration = this.videoDuration || this.video.duration || 10;
                    const currentTime = this.video.currentTime || 0;
                    const progress = Math.min(Math.max(currentTime / duration, 0), 1);
                    if (onProgress && isFinite(progress)) {
                        onProgress(progress);
                    }
                    requestAnimationFrame(checkEnd);
                }
            };
            checkEnd();
        });
    }
}
