// Drift Engine - Universal Recording Engine
// Supports: Tauri (native desktop), Electron, Browser
// Handles Recording, Zoom Logic, and Canvas Drawing
// NOW with Cinema Zoom + Cursor engines for live preview

import drift from './tauri-bridge';
import { CinemaZoomEngine } from './zoom/CinemaZoomEngine.js';
import { CinemaCursorEngine } from './zoom/CinemaCursorEngine.js';

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

        // Cinema Zoom Engine (live preview)
        this.zoomEngine = new CinemaZoomEngine({
            width: canvas.width || 1920,
            height: canvas.height || 1080,
            zoomLevel: 2.0,
        });

        // Cinema Cursor Engine (smoothed cursor overlay)
        this.cursorEngine = new CinemaCursorEngine({
            screenWidth: window.screen.width || 1920,
            screenHeight: window.screen.height || 1080,
        });

        // Camera state (driven by zoom engine)
        this.camera = { x: 0.5, y: 0.5, scale: 1 };

        this.zoomLevel = 2.0;
        this.zoomEnabled = true;

        // Capture source resolution (for normalizing mouse coordinates)
        // Updated when a stream is selected — defaults to screen dimensions
        this._sourceWidth = window.screen.width || 1920;
        this._sourceHeight = window.screen.height || 1080;

        // Track platform
        this._isTauri = drift.isTauri();
        this._isElectron = drift.isElectron();
        this._isDesktop = drift.isDesktop();
        this._globalClickUnlisten = null;
        this._globalMoveUnlisten = null;

        this.initPlatformListeners();
        this.renderLoop();
    }

    /**
     * Initialize global input listeners based on platform
     * Tauri: uses Rust global input via IPC events
     * Electron: uses preload bridge
     * Browser: no global listeners (only click-on-canvas)
     */
    async initPlatformListeners() {
        if (this._isTauri) {
            console.log('[Drift] Init Tauri platform listeners');

            // Global click listener via Rust rdev
            this._globalClickUnlisten = await drift.onGlobalClick((data) => {
                if (!this.isRecording) return;
                const t = Date.now() - this.startTime;
                // Normalize to 0-1 using actual source/screen resolution
                const nx = data.x / this._sourceWidth;
                const ny = data.y / this._sourceHeight;
                this.clicks.push({ time: t, x: nx, y: ny });

                // Feed into Cinema Zoom Engine (live zoom preview)
                if (this.zoomEnabled) {
                    this.zoomEngine.addClick(t, nx, ny);
                }
                // Feed into Cinema Cursor Engine (normalized coords)
                this.cursorEngine.addClick(t, data.x, data.y);

                console.log('[Drift] Tauri global click:', this.clicks.length);
                if (this.onclickCallback) this.onclickCallback(this.clicks.length);
            });

            // Global mouse move listener for cursor tracking
            this._globalMoveUnlisten = await drift.onGlobalMouseMove((data) => {
                if (!this.isRecording) return;
                const t = Date.now() - this.startTime;
                const nx = data.x / this._sourceWidth;
                const ny = data.y / this._sourceHeight;
                this.mouseMoves.push({ time: t, x: nx, y: ny });

                // Feed cursor position into zoom engine (for camera following)
                this.zoomEngine.updateCursor(nx, ny, t);
                // Feed into cursor engine (raw pixels — engine normalizes internally)
                this.cursorEngine.addMove(t, data.x, data.y);
            });

        } else if (this._isElectron) {
            console.log('[Drift] Init Electron listeners');
            if (window.electron) {
                window.electron.onGlobalClick((data) => {
                    if (!this.isRecording) return;
                    const t = Date.now() - this.startTime;
                    const nx = data.x / this._sourceWidth;
                    const ny = data.y / this._sourceHeight;
                    this.clicks.push({ time: t, x: nx, y: ny });

                    if (this.zoomEnabled) {
                        this.zoomEngine.addClick(t, nx, ny);
                    }
                    this.cursorEngine.addClick(t, data.x, data.y);

                    if (this.onclickCallback) this.onclickCallback(this.clicks.length);
                });

                window.electron.onGlobalHotkey((action) => {
                    if (action === 'STOP') {
                        if (this.isRecording) this.stopRecording();
                    } else if (action === 'START') {
                        if (!this.isRecording && this.screenStream?.active && this.onHotkeyStart) {
                            this.onHotkeyStart();
                        }
                    }
                });
            }
        } else {
            console.log('[Drift] Browser mode — no global listeners');
        }
    }

    /**
     * Get available recording sources
     * Tauri: returns monitors from Rust xcap
     * Electron: returns desktopCapturer sources
     * Browser: returns empty (uses getDisplayMedia picker)
     */
    async getSources() {
        if (this._isTauri) {
            return await drift.getSources();
        }
        if (this._isElectron && window.electron) {
            return await window.electron.getSources();
        }
        return [];
    }

    /**
     * Select an Electron source using chromeMediaSource (Electron-only)
     */
    async selectSource(sourceId) {
        if (this._isElectron) {
            return this._selectElectronSource(sourceId);
        }
        // For Tauri and browser, use getDisplayMedia
        return this.selectSourceBrowser();
    }

    async _selectElectronSource(sourceId) {
        try {
            if (this.screenStream) {
                this.screenStream.getTracks().forEach(t => t.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId
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

            // Update source resolution from Electron stream
            const vTrack = stream.getVideoTracks()[0];
            const settings = vTrack?.getSettings?.();
            if (settings?.width && settings?.height) {
                this._sourceWidth = settings.width;
                this._sourceHeight = settings.height;
            }

            if (this.video) {
                this.video.srcObject = stream;
                await this.video.play().catch(e => console.warn("Auto-play preview failed:", e));
            }
            return true;
        } catch (e) {
            console.error("Source select with audio failed, falling back:", e);
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

            // Standard browser/Tauri API - getDisplayMedia works in WebView2
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 60 },
                    cursor: 'never',
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                systemAudio: "include",
                selfBrowserSurface: "exclude",
            });

            this.screenStream = stream;

            // Handle external stop (browser UI stop button)
            stream.getVideoTracks()[0].onended = () => {
                console.log('[Drift] Stream ended by user');
                if (this.isRecording) {
                    this.stopRecording();
                }
            };

            // Update source resolution from actual stream for accurate normalization
            const vTrack = stream.getVideoTracks()[0];
            const settings = vTrack?.getSettings?.();
            if (settings?.width && settings?.height) {
                this._sourceWidth = settings.width;
                this._sourceHeight = settings.height;
                console.log('[Drift] Source resolution:', this._sourceWidth, 'x', this._sourceHeight);
            }

            if (this.video) {
                this.video.srcObject = stream;
                await this.video.play().catch(e => console.warn("Auto-play preview failed:", e));
            }
            return true;
        } catch (e) {
            console.error("[Drift] Source select failed:", e);
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
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
            ? 'video/webm;codecs=vp9,opus'
            : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : 'video/webm';
        this.mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: mime,
            videoBitsPerSecond: 25_000_000, // 25 Mbps — lossless-quality source
        });

        this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) this.recordedChunks.push(e.data); };
        this.mediaRecorder.start(1000); // 1s timeslice — less overhead, still fast stop

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

    // --- RENDER LOOP WITH CINEMA ZOOM ---
    renderLoop() {
        const loop = () => {
            const c = this.canvas;
            const ctx = this.ctx;
            const v = this.video;

            // Update cinema zoom engine every frame while recording
            if (this.isRecording && this.zoomEnabled) {
                const t = Date.now() - this.startTime;
                this.zoomEngine.update(t);
                const state = this.zoomEngine.getState();
                this.camera = { x: state.x, y: state.y, scale: state.scale };
            }

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

                const frameX = (c.width - vw) / 2;
                const frameY = (c.height - vh) / 2;
                const r = 12;

                // Apply camera transform for zoom preview
                ctx.save();
                const cx = c.width / 2;
                const cy = c.height / 2;
                ctx.translate(cx, cy);
                ctx.scale(this.camera.scale, this.camera.scale);
                const panX = (this.camera.x - 0.5) * vw;
                const panY = (this.camera.y - 0.5) * vh;
                ctx.translate(-panX, -panY);
                ctx.translate(-cx, -cy);

                // Drop Shadow
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 20;
                ctx.fillStyle = '#000';
                this.roundRect(ctx, frameX, frameY, vw, vh, r);
                ctx.fill();
                ctx.shadowColor = 'transparent';

                // Clip & Draw Video
                ctx.save();
                this.roundRect(ctx, frameX, frameY, vw, vh, r);
                ctx.clip();
                ctx.drawImage(v, frameX, frameY, vw, vh);
                ctx.restore();

                // Border
                ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                ctx.lineWidth = 1;
                this.roundRect(ctx, frameX, frameY, vw, vh, r);
                ctx.stroke();

                // Traffic Lights (Mac style)
                const bx = frameX + 20;
                const by = frameY + 18;
                const gap = 22;
                ctx.fillStyle = '#FF5F56'; ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#FFBD2E'; ctx.beginPath(); ctx.arc(bx + gap, by, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#27C93F'; ctx.beginPath(); ctx.arc(bx + gap * 2, by, 6, 0, Math.PI * 2); ctx.fill();

                ctx.restore(); // Restore camera transform

                // Draw zoom state indicator
                if (this.isRecording && this.camera.scale > 1.05) {
                    ctx.fillStyle = 'rgba(220, 254, 80, 0.9)';
                    ctx.font = 'bold 11px system-ui';
                    ctx.textAlign = 'left';
                    ctx.fillText(`⊕ ${this.camera.scale.toFixed(1)}x`, 12, c.height - 12);
                }
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
        // Clean up engines
        if (this.zoomEngine) this.zoomEngine.destroy();
        // Clean up Tauri global listeners
        if (this._globalClickUnlisten) {
            this._globalClickUnlisten();
            this._globalClickUnlisten = null;
        }
        if (this._globalMoveUnlisten) {
            this._globalMoveUnlisten();
            this._globalMoveUnlisten = null;
        }
        if (this._isTauri) {
            drift.stopGlobalListener().catch(() => {});
        }
        console.log('[Drift] Engine stopped');
    }

    /**
     * Set zoom level (called from UI)
     */
    setZoomLevel(level) {
        this.zoomLevel = level;
        this.zoomEngine.setZoomLevel(level);
    }

    /**
     * Enable/disable live zoom preview
     */
    setZoomEnabled(enabled) {
        this.zoomEnabled = enabled;
        if (!enabled) {
            this.camera = { x: 0.5, y: 0.5, scale: 1 };
        }
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.closePath();
    }

    // IMPORTANT: The "Studio" logic should be separate or loaded after recording.
    // For now, this engine handles capture.
}
