// Drift Engine - Electron Port
// Handles Recording, Zoom Logic, and Canvas Drawing

const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

const SPEED_PRESETS = {
    slow: { zoomIn: 1000, hold: 1200, zoomOut: 1000, smoothing: 0.05 },
    normal: { zoomIn: 750, hold: 1000, zoomOut: 750, smoothing: 0.07 },
    fast: { zoomIn: 400, hold: 600, zoomOut: 500, smoothing: 0.12 }
};

export class DriftEngine {
    constructor(canvas, videoElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.video = videoElement;

        this.screenStream = null;
        this.micStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.clicks = [];
        this.mouseMoves = [];

        this.startTime = null;
        this.isRecording = false;
        this.isActive = true; // For stopping render loop
        this.timerCallback = null;

        this.camera = { x: 0.5, y: 0.5, scale: 1 };
        this.target = { x: 0.5, y: 0.5, scale: 1 };
        this.activeZoom = null;
        this.lastClickIdx = -1;

        this.zoomLevel = 1.25;
        this.speedPreset = 'slow';
        this.lookAheadMs = 400;

        this.initElectronListeners();
        this.renderLoop();
    }

    get speed() { return SPEED_PRESETS[this.speedPreset]; }

    initElectronListeners() {
        console.log('[Drift] Init Electron Listeners, window.electron:', !!window.electron);
        if (window.electron) {
            window.electron.onGlobalClick((data) => {
                console.log('[Drift] Global Click received:', data, 'isRecording:', this.isRecording);
                if (!this.isRecording) return;

                const t = Date.now() - this.startTime;
                this.clicks.push({ time: t, x: data.x, y: data.y });
                console.log('[Drift] Click saved:', this.clicks.length, 'total');
                if (this.onclickCallback) this.onclickCallback(this.clicks.length);
            });

            window.electron.onGlobalHotkey((action) => {
                console.log('[Drift] Global Hotkey received:', action, 'isRecording:', this.isRecording, 'hasStream:', !!this.screenStream?.active);
                if (action === 'STOP') {
                    if (this.isRecording) {
                        console.log('[Drift] Stopping recording via hotkey');
                        this.stopRecording();
                    }
                } else if (action === 'START') {
                    // Only start if we have a stream and aren't recording
                    if (!this.isRecording && this.screenStream?.active && this.onHotkeyStart) {
                        console.log('[Drift] Starting recording via hotkey');
                        this.onHotkeyStart();
                    } else {
                        console.log('[Drift] Cannot start - no stream or already recording');
                    }
                }
            });
        } else {
            console.warn('[Drift] window.electron not available - running in browser mode?');
        }
    }

    async getSources() {
        if (window.electron) {
            return await window.electron.getSources();
        }
        return [];
    }

    async selectSource(sourceId) {
        try {
            if (this.screenStream) {
                this.screenStream.getTracks().forEach(t => t.stop());
            }
            console.log('[Drift] Attempting to select source:', sourceId);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId // Added ID for audio too
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId
                    }
                }
            });

            this.screenStream = stream;

            // Preview in hidden video element
            if (this.video) {
                this.video.srcObject = stream;
                await this.video.play().catch(e => console.warn("Auto-play preview failed:", e));
            }

            return true;
        } catch (e) {
            console.error("Source select with audio failed, falling back to video only:", e);
            // Fallback for ANY error
            return this.selectSourceVideoOnly(sourceId);
        }
    }

    async selectSourceVideoOnly(sourceId) {
        try {
            if (this.screenStream) {
                this.screenStream.getTracks().forEach(t => t.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId
                    }
                }
            });
            this.screenStream = stream;
            if (this.video) {
                this.video.srcObject = stream;
                await this.video.play().catch(e => console.warn("Auto-play preview failed:", e));
            }
            return true;
        } catch (e) {
            console.error("Video-only select failed:", e);
            return false;
        }
    }

    async selectSourceBrowser() {
        try {
            if (this.screenStream) {
                this.screenStream.getTracks().forEach(t => t.stop());
            }

            // Standard browser API
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                systemAudio: "include"
            });

            this.screenStream = stream;

            // Handle external stop (browser UI stop button)
            stream.getVideoTracks()[0].onended = () => {
                console.log('[Drift] Stream ended by user');
                if (this.isRecording) {
                    this.stopRecording();
                }
            };

            if (this.video) {
                this.video.srcObject = stream;
                await this.video.play().catch(e => console.warn("Auto-play preview failed:", e));
            }
            return true;
        } catch (e) {
            console.error("Browser source select failed:", e);
            return false;
        }
    }

    async enableMic() {
        try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (e) { return false; }
    }

    async startRecording(onTimer) {
        if (!this.screenStream) throw new Error("No screen selected");

        this.timerCallback = onTimer;
        this.clicks = [];
        this.mouseMoves = [];
        this.recordedChunks = [];
        this.startTime = Date.now();
        this.isRecording = true;

        // Ensure Mic is active if enabled
        if (this.micEnabled && !this.micStream) {
            try {
                // Request mic with better constraints for headphone mics
                this.micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        // Don't specify deviceId to use default mic (usually headphone mic)
                    }
                });
                console.log('[Drift] Mic stream acquired:', this.micStream.getAudioTracks()[0]?.label);
            } catch (e) {
                console.error("Failed to get mic stream:", e);
            }
        } else if (!this.micEnabled && this.micStream) {
            // Cleanup if disabled
            this.micStream.getTracks().forEach(t => t.stop());
            this.micStream = null;
        }

        // Audio Mixing (System + Mic)
        const ctx = new AudioContext();
        const dest = ctx.createMediaStreamDestination();

        let hasAudio = false;

        // 1. System Audio
        const sysTracks = this.screenStream.getAudioTracks();
        if (sysTracks.length > 0) {
            const src = ctx.createMediaStreamSource(new MediaStream([sysTracks[0]]));
            // Add slight gain?
            src.connect(dest);
            hasAudio = true;
        }

        // 2. Mic Audio
        if (this.micStream) {
            const micTracks = this.micStream.getAudioTracks();
            if (micTracks.length > 0) {
                const src = ctx.createMediaStreamSource(new MediaStream([micTracks[0]]));
                const gain = ctx.createGain();
                gain.gain.value = 1.0; // Adjustable?
                src.connect(gain);
                gain.connect(dest);
                hasAudio = true;
            }
        }

        const outputTracks = hasAudio ? dest.stream.getAudioTracks() : [];

        const combinedStream = new MediaStream([
            ...this.screenStream.getVideoTracks(),
            ...outputTracks
        ]);

        // Higher quality recording settings for polished output
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
        this.mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: mime,
            videoBitsPerSecond: 15000000 // 15 Mbps for high quality
        });

        this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) this.recordedChunks.push(e.data); };
        this.mediaRecorder.start(50); // Smaller timeslice for smoother capture

        // Timer Loop
        this.timerInt = setInterval(() => {
            const s = (Date.now() - this.startTime) / 1000;
            if (this.timerCallback) this.timerCallback(s);
        }, 1000);
    }

    stopRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;

        this.mediaRecorder.stop();
        this.isRecording = false;
        clearInterval(this.timerInt);

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const duration = (Date.now() - this.startTime) / 1000;
            if (this.onStopCallback) this.onStopCallback(blob, this.clicks, duration);
        };
    }

    // --- RENDER & EXPORT LOGIC (Simplified from original) ---
    renderLoop() {
        const loop = () => {
            const c = this.canvas;
            const ctx = this.ctx;
            const v = this.video;

            // Clear
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, c.width, c.height);

            // Draw Video Preview
            if (v && v.readyState >= 2 && v.videoWidth > 0) {
                // Calculate aspect-fit dimensions
                const scale = 0.85;
                const aspectRatio = v.videoWidth / v.videoHeight;
                let vw = c.width * scale;
                let vh = vw / aspectRatio;

                if (vh > c.height * scale) {
                    vh = c.height * scale;
                    vw = vh * aspectRatio;
                }

                const x = (c.width - vw) / 2;
                const y = (c.height - vh) / 2;
                const r = 12;

                // Drop Shadow
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 20;
                ctx.fillStyle = '#000';
                this.roundRect(ctx, x, y, vw, vh, r);
                ctx.fill();
                ctx.shadowColor = 'transparent';

                // Clip & Draw Video
                ctx.save();
                this.roundRect(ctx, x, y, vw, vh, r);
                ctx.clip();
                ctx.drawImage(v, x, y, vw, vh);
                ctx.restore();

                // Border
                ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                ctx.lineWidth = 1;
                this.roundRect(ctx, x, y, vw, vh, r);
                ctx.stroke();

                // Traffic Lights (Mac style)
                const bx = x + 20;
                const by = y + 18;
                const gap = 22;
                ctx.fillStyle = '#FF5F56'; ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#FFBD2E'; ctx.beginPath(); ctx.arc(bx + gap, by, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#27C93F'; ctx.beginPath(); ctx.arc(bx + gap * 2, by, 6, 0, Math.PI * 2); ctx.fill();
            } else {
                // Placeholder
                ctx.fillStyle = '#333';
                ctx.font = '16px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('Select a source to preview', c.width / 2, c.height / 2);
            }

            if (this.isActive) requestAnimationFrame(loop);
        };
        loop();
    }

    stop() {
        this.isActive = false;
        console.log('[Drift] Engine stopped');
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.closePath();
    }

    // IMPORTANT: The "Studio" logic should be separate or loaded after recording.
    // For now, this engine handles capture.
}
