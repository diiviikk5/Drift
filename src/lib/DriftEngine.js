// Drift Engine - Universal Recording Engine
// Supports: Tauri (native desktop), Electron, Browser
// Handles Recording, Zoom Logic, and Canvas Drawing
// NOW with Cinema Zoom + Cursor engines for live preview

import drift from './tauri-bridge';
import { CinemaZoomEngine } from './zoom/CinemaZoomEngine.js';
import { CinemaCursorEngine } from './zoom/CinemaCursorEngine.js';
import { mixAudioTracks } from './audio/audioMix.js';
import { fixWebmDuration } from '@fix-webm-duration/fix';

export class DriftEngine {
    constructor(canvas, videoElement) {
        this.canvas = canvas || null;
        this.ctx = canvas?.getContext ? canvas.getContext('2d') : null;
        this.video = videoElement || null;

        this.screenStream = null;
        this.micStream = null;
        this.webcamStream = null;
        this.webcamVideo = null;
        this.webcamEnabled = false;
        this.webcamChunks = [];
        this.webcamRecorder = null;
        this.webcamSettings = {
            enabled: false,
            shape: 'circle',
            position: 'bottom-right',
            size: 0.22,
            mirrored: false,
        };
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.clicks = [];
        this.mouseMoves = [];
        this.mixingContext = null;
        this.webcamOffsetMs = 0;

        this.startTime = null;
        this.isRecording = false;
        this.isActive = true; // For stopping render loop
        this.timerCallback = null;

        // Cinema Zoom Engine (live preview)
        this.zoomEngine = new CinemaZoomEngine({
            width: canvas?.width || 1920,
            height: canvas?.height || 1080,
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
        this.zoomEnabled = false; // OpenScreen soothing recording: steady camera overview without live click zooms

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
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(t => t.stop());
            this.screenStream = null;
        }

        let stream = null;

        // Tier 1: Full cinema capture with system audio
        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 60 },
                    cursor: 'never',
                },
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
                systemAudio: "include",
                selfBrowserSurface: "exclude",
            });
        } catch (e1) {
            console.warn('[Drift] getDisplayMedia with system audio notice, falling back to standard audio:', e1);
            // Tier 2: Standard audio
            try {
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        frameRate: { ideal: 60 },
                        cursor: 'never',
                    },
                    audio: true,
                });
            } catch (e2) {
                console.warn('[Drift] getDisplayMedia with audio failed, falling back to video only:', e2);
                // Tier 3: Pure video only
                try {
                    stream = await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            width: { ideal: 1920 },
                            height: { ideal: 1080 },
                            frameRate: { ideal: 60 },
                            cursor: 'never',
                        },
                        audio: false,
                    });
                } catch (e3) {
                    console.error('[Drift] All getDisplayMedia attempts failed or user cancelled picker:', e3);
                    return false;
                }
            }
        }

        if (!stream) return false;

        this.screenStream = stream;

        // Handle external stop (browser UI stop button)
        const vTrack = stream.getVideoTracks()[0];
        if (vTrack) {
            vTrack.onended = () => {
                console.log('[Drift] Screen capture stream ended by user');
                if (this.isRecording) {
                    this.stopRecording();
                }
            };

            const settings = vTrack.getSettings?.();
            if (settings?.width && settings?.height) {
                this._sourceWidth = settings.width;
                this._sourceHeight = settings.height;
                console.log('[Drift] Source resolution:', this._sourceWidth, 'x', this._sourceHeight);
            }
        }

        if (this.video) {
            this.video.srcObject = stream;
            this.video.muted = true; // Essential: allows instantaneous unblocked preview decoding
            try {
                await this.video.play();
            } catch (e) {
                console.warn("[Drift] Preview auto-play notice:", e);
            }
        }
        return true;
    }

    async enableMic(deviceId = null) {
        try {
            if (this.micStream) {
                this.micStream.getTracks().forEach(t => t.stop());
            }
            const constraints = {
                audio: deviceId
                    ? {
                        deviceId: { exact: deviceId },
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                    : {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                video: false,
            };
            this.micStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.micEnabled = true;
            return true;
        } catch (e) {
            console.warn('[Drift] Enable mic failed:', e);
            this.micEnabled = false;
            return false;
        }
    }

    disableMic() {
        if (this.micStream) {
            this.micStream.getTracks().forEach(t => t.stop());
            this.micStream = null;
        }
        this.micEnabled = false;
    }

    async enableWebcam(deviceId = null) {
        try {
            if (this.webcamStream) {
                this.webcamStream.getTracks().forEach(t => t.stop());
            }
            const constraints = {
                video: deviceId
                    ? { deviceId: { exact: deviceId } }
                    : { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
                audio: false,
            };
            this.webcamStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (!this.webcamVideo) {
                this.webcamVideo = document.createElement('video');
                this.webcamVideo.muted = true;
                this.webcamVideo.playsInline = true;
            }
            this.webcamVideo.srcObject = this.webcamStream;
            await this.webcamVideo.play().catch(() => {});
            this.webcamEnabled = true;
            this.webcamSettings.enabled = true;
            return true;
        } catch (e) {
            console.error('[Drift] Webcam enable failed:', e);
            this.webcamEnabled = false;
            this.webcamSettings.enabled = false;
            return false;
        }
    }

    disableWebcam() {
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(t => t.stop());
            this.webcamStream = null;
        }
        if (this.webcamVideo) {
            this.webcamVideo.srcObject = null;
        }
        this.webcamEnabled = false;
        this.webcamSettings.enabled = false;
    }

    setWebcamSettings(updates = {}) {
        this.webcamSettings = { ...this.webcamSettings, ...updates };
    }

    async startRecording(onTimer) {
        if (!this.screenStream) throw new Error("No screen selected");

        // Acquire mic before recording start timestamp to eliminate audio-vs-video desync
        if (this.micEnabled && !this.micStream) {
            try {
                await this.enableMic();
            } catch (e) {
                console.warn('[Drift] Mic acquisition before start failed:', e);
            }
        } else if (!this.micEnabled && this.micStream) {
            this.disableMic();
        }

        this.timerCallback = onTimer;
        this.clicks = [];
        this.mouseMoves = [];
        this.recordedChunks = [];
        this.webcamChunks = [];

        // Mix System Audio and Microphone with anti-pop gain ramp & 1.4x voice boost
        const systemAudioTrack = this.screenStream.getAudioTracks()[0] || null;
        const micAudioTrack = (this.micEnabled && this.micStream) ? (this.micStream.getAudioTracks()[0] || null) : null;

        const { context: mixingCtx, track: mixedAudioTrack } = mixAudioTracks({
            systemAudioTrack,
            micAudioTrack,
        });
        this.mixingContext = mixingCtx;

        const combinedTracks = [
            ...this.screenStream.getVideoTracks(),
            ...(mixedAudioTrack ? [mixedAudioTrack] : [])
        ];
        const combinedStream = new MediaStream(combinedTracks);

        // Studio-grade 25 Mbps lossless capture
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
            ? 'video/webm;codecs=vp9,opus'
            : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : 'video/webm';

        this.mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: mime,
            videoBitsPerSecond: 25_000_000,
            ...(mixedAudioTrack ? { audioBitsPerSecond: systemAudioTrack ? 192_000 : 128_000 } : {}),
        });

        this.mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) this.recordedChunks.push(e.data);
        };

        // Parallel webcam recorder for synchronized studio PiP and presenter scenes
        if (this.webcamEnabled && this.webcamStream) {
            try {
                this.webcamRecorder = new MediaRecorder(this.webcamStream, {
                    mimeType: mime,
                    videoBitsPerSecond: 8_000_000,
                });
                this.webcamRecorder.ondataavailable = e => {
                    if (e.data.size > 0) this.webcamChunks.push(e.data);
                };
            } catch (err) {
                console.warn('[Drift] Webcam recorder setup notice:', err);
                this.webcamRecorder = null;
            }
        } else {
            this.webcamRecorder = null;
        }

        this.startTime = Date.now();
        this.webcamOffsetMs = 0;
        this.isRecording = true;

        if (this._isTauri) {
            try {
                await drift.startSessionTelemetry();
            } catch (err) {
                console.warn('[Drift] startSessionTelemetry notice:', err);
            }
        } else {
            // Browser / Electron DOM fallback listener
            this._browserClickHandler = (e) => {
                if (!this.isRecording) return;
                const t = Date.now() - this.startTime;
                const nx = e.clientX / (this._sourceWidth || window.innerWidth || 1920);
                const ny = e.clientY / (this._sourceHeight || window.innerHeight || 1080);
                this.clicks.push({ time: t, x: nx, y: ny, button: 'left' });
                this.cursorEngine.addClick(t, e.clientX, e.clientY);
                if (this.onclickCallback) this.onclickCallback(this.clicks.length);
            };
            this._browserMoveHandler = (e) => {
                if (!this.isRecording) return;
                const t = Date.now() - this.startTime;
                const nx = e.clientX / (this._sourceWidth || window.innerWidth || 1920);
                const ny = e.clientY / (this._sourceHeight || window.innerHeight || 1080);
                this.mouseMoves.push({ time: t, x: nx, y: ny });
                this.cursorEngine.addMove(t, e.clientX, e.clientY);
            };
            window.addEventListener('click', this._browserClickHandler);
            window.addEventListener('mousemove', this._browserMoveHandler);
        }

        this.mediaRecorder.start(1000);
        if (this.webcamRecorder) {
            this.webcamRecorder.start(1000);
        }

        // Timer Loop
        this.timerInt = setInterval(() => {
            const s = (Date.now() - this.startTime) / 1000;
            if (this.timerCallback) this.timerCallback(s);
        }, 1000);
    }

    stopRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;

        if (this._browserClickHandler) {
            window.removeEventListener('click', this._browserClickHandler);
            this._browserClickHandler = null;
        }
        if (this._browserMoveHandler) {
            window.removeEventListener('mousemove', this._browserMoveHandler);
            this._browserMoveHandler = null;
        }

        this.mediaRecorder.stop();
        if (this.webcamRecorder && this.webcamRecorder.state !== 'inactive') {
            try { this.webcamRecorder.stop(); } catch (e) {}
        }
        this.isRecording = false;
        clearInterval(this.timerInt);

        this.mediaRecorder.onstop = async () => {
            if (this.mixingContext) {
                try {
                    this.mixingContext.close();
                } catch (e) {}
                this.mixingContext = null;
            }

            if (this._isTauri) {
                try {
                    const nativeSamples = typeof drift.stopSessionTelemetry === 'function'
                        ? await drift.stopSessionTelemetry()
                        : await drift.getSessionTelemetry();

                    if (nativeSamples && nativeSamples.length > 0) {
                        this.mouseMoves = nativeSamples.map(s => ({
                            time: s.t,
                            x: s.x > 1 ? s.x / this._sourceWidth : s.x,
                            y: s.y > 1 ? s.y / this._sourceHeight : s.y,
                            click: s.click,
                        }));

                        const clickSamples = nativeSamples.filter(s => Boolean(s.click));
                        if (clickSamples.length > 0) {
                            this.clicks = clickSamples.map(s => ({
                                time: s.t,
                                x: s.x > 1 ? s.x / this._sourceWidth : s.x,
                                y: s.y > 1 ? s.y / this._sourceHeight : s.y,
                                button: s.click,
                            }));
                        }
                    }
                } catch (e) {
                    console.warn('[Drift] Native telemetry retrieval failed:', e);
                }
            }

            const durationMs = Math.max(100, Date.now() - this.startTime);
            let blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            try {
                const fixedBlob = await fixWebmDuration(blob, durationMs);
                if (fixedBlob && fixedBlob.size > 0) {
                    blob = fixedBlob;
                }
            } catch (err) {
                console.warn('[Drift] Screen WebM duration patch notice:', err);
            }

            let webcamBlob = null;
            if (this.webcamChunks.length > 0) {
                webcamBlob = new Blob(this.webcamChunks, { type: 'video/webm' });
                try {
                    const fixedWebcamBlob = await fixWebmDuration(webcamBlob, durationMs);
                    if (fixedWebcamBlob && fixedWebcamBlob.size > 0) {
                        webcamBlob = fixedWebcamBlob;
                    }
                } catch (err) {
                    console.warn('[Drift] Webcam WebM duration patch notice:', err);
                }
            }

            const durationSec = durationMs / 1000;
            if (this.onStopCallback) {
                this.onStopCallback(blob, this.clicks, durationSec, {
                    webcamBlob,
                    webcamSettings: { ...this.webcamSettings },
                    webcamOffsetMs: this.webcamOffsetMs || 0,
                });
            }
        };
    }

    setCanvas(canvas) {
        this.canvas = canvas || null;
        this.ctx = canvas?.getContext ? canvas.getContext('2d') : null;
    }

    // --- RENDER LOOP WITH CINEMA ZOOM ---
    renderLoop() {
        const loop = () => {
            const c = this.canvas;
            const ctx = this.ctx;
            const v = this.video;

            if (!c || !ctx) {
                if (this.isActive) requestAnimationFrame(loop);
                return;
            }

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
            if (v && (v.readyState >= 1 || v.videoWidth > 0) && v.videoWidth > 0) {
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

                // Note: Webcam is recorded as an independent parallel video stream (webcamBlob),
                // matching OpenScreen architecture so the screen video remains clean and never has a duplicate camera burned into its pixels.

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
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            try { this.mediaRecorder.stop(); } catch (e) {}
        }
        if (this.webcamRecorder && this.webcamRecorder.state !== 'inactive') {
            try { this.webcamRecorder.stop(); } catch (e) {}
        }
        if (this.mixingContext) {
            try { this.mixingContext.close(); } catch (e) {}
            this.mixingContext = null;
        }
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(t => t.stop());
            this.screenStream = null;
        }
        if (this.micStream) {
            this.micStream.getTracks().forEach(t => t.stop());
            this.micStream = null;
        }
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(t => t.stop());
            this.webcamStream = null;
        }
        if (this.webcamVideo) {
            this.webcamVideo.srcObject = null;
        }
        if (this.video) {
            this.video.srcObject = null;
        }
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
