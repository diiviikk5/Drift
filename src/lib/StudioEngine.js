// Studio Engine 2.0 - Production-Grade Post-Production Studio
// Inspired by Screen Studio for Mac & OpenScreen:
// - 60fps/120fps analytical spring physics (CinemaZoomEngine & CinemaCursorEngine)
// - Multi-aspect ratio framing (16:9, 9:16, 1:1, 4:3, 4:5, 21:9)
// - 12+ Luxury background presets + Dynamic Video Blur Backdrop
// - Studio window framing (Squircle radius, 4 shadow presets, macOS/Windows headers)
// - Pro Cursor customization (macOS, Light, Precision Dot, Ambient Glow, Click Ripples)
// - Webcam Bubble Picture-in-Picture (Circle, Squircle, Rounded)
// - 4K/60fps WebCodecs hardware MP4 & Animated GIF export

import { CinemaZoomEngine } from './zoom/CinemaZoomEngine.js';
import { CinemaCursorEngine } from './zoom/CinemaCursorEngine.js';
import { isTauri } from './tauri-bridge';

export class StudioEngine {
    constructor(canvas, videoElement, blob, clicks = [], duration = null, mouseMoves = [], webcamBlob = null) {
        console.log('[Studio] Initializing StudioEngine 2.0 with', clicks.length, 'clicks, duration:', duration, 'moves:', mouseMoves.length);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
        this.video = videoElement;

        // Background cache
        this._cachedBg = null;
        this._cachedBgKey = '';
        this._blurCanvas = null;
        this._blurCtx = null;

        this.blob = blob;
        this.clicks = [...clicks];
        this.explicitDuration = duration;
        this.mouseMoves = [...mouseMoves];
        this.webcamBlob = webcamBlob;

        // ── Canvas & Framing Settings ──
        this.aspectRatio = '16:9';      // '16:9', '9:16', '1:1', '4:3', '4:5', '21:9', 'auto'
        this.padding = 0.14;            // 0.0 to 0.35
        this.borderRadius = 16;         // 0 to 36
        this.shadowPreset = 'deep';     // 'deep', 'soft', 'crisp', 'glow', 'none'
        this.titleBar = 'macos';        // 'macos', 'windows', 'custom', 'none'
        this.windowTitle = 'Drift Studio';

        // ── Background Settings ──
        this.background = 'bigSur';     // preset key or 'solid' | 'blur'
        this.customBgColor = '#12121a';

        // ── Camera & Zoom Settings ──
        this.zoomLevel = 1.8;           // 1.1 to 3.5
        this.startPosition = 'center';
        this.trimStart = 0;
        this.trimEnd = 0;
        this.playbackSpeed = 1.0;

        // ── Cursor & Click Settings ──
        this.cursorMode = 'smooth';     // 'smooth' | 'native' | 'none'
        this.showCursor = true;
        this.clickSoundEnabled = true;  // ASMR tactile click sound
        this.clickSoundStyle = 'pop';   // 'pop' | 'mechanical' | 'none'
        this._lastClickSoundTime = 0;
        this._audioCtx = null;
        this.cursorSize = 1.0;          // 0.5 to 3.0
        this.cursorStyle = 'macos';     // 'macos', 'light', 'dot', 'glow'
        this.clickEffect = 'ripple';    // 'ripple', 'pulse', 'ring', 'none'

        // ── Webcam Bubble Settings ──
        this.webcamEnabled = false;
        this.webcamShape = 'circle';    // 'circle', 'squircle', 'rounded'
        this.webcamPosition = 'bottom-right'; // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        this.webcamSize = 180;          // px
        this.webcamVideo = null;

        // Camera state
        this.camera = { x: 0.5, y: 0.5, scale: 1.0 };
        this.cursorState = { x: 0.5, y: 0.5, opacity: 1.0, click_progress: 0.0, motion: 0.0 };

        // Initialize Zoom & Cursor Engines
        this.cinemaZoom = new CinemaZoomEngine({
            width: canvas.width || 1920,
            height: canvas.height || 1080,
            zoomLevel: this.zoomLevel,
        });

        this.cinemaCursor = new CinemaCursorEngine({
            screenWidth: (typeof window !== 'undefined' && window.screen?.width) || 1920,
            screenHeight: (typeof window !== 'undefined' && window.screen?.height) || 1080,
            smoothingEnabled: true,
        });

        // Feed data to engines
        this.cinemaCursor.setMoves(this.mouseMoves);
        this.cinemaCursor.setClicks(this.clicks);
        this.cinemaZoom.setClicks(this.clicks);
        this.cinemaZoom.setCursorMoves(this.mouseMoves);

        this.zoomSegments = [];
        this.isPlaying = false;
        this.animationFrame = null;

        this.init();
    }

    init() {
        console.log('[Studio] init() called');
        this.video.src = URL.createObjectURL(this.blob);
        this.video.muted = false;

        this.video.onloadedmetadata = () => {
            console.log('[Studio] Video metadata loaded, duration:', this.video.duration);
            this.updateCanvasDimensions();

            if (this.explicitDuration) {
                this.videoDuration = this.explicitDuration;
            } else if (!isFinite(this.video.duration)) {
                const lastClick = this.clicks[this.clicks.length - 1];
                this.videoDuration = lastClick ? (lastClick.time / 1000 + 2) : 10;
            } else {
                this.videoDuration = this.video.duration;
            }

            this.generateAutoZooms();
            this.updateCamera();
            this.drawFrame();
        };

        this.video.onplay = () => {
            this.isPlaying = true;
            this.renderLoop();
        };
        this.video.onpause = () => {
            this.isPlaying = false;
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        };
        this.video.onended = () => {
            this.isPlaying = false;
        };
    }

    updateCanvasDimensions() {
        const baseWidth = this.video.videoWidth || 1920;
        const baseHeight = this.video.videoHeight || 1080;

        let targetWidth = 1920;
        let targetHeight = 1080;

        switch (this.aspectRatio) {
            case '9:16':
                targetWidth = 1080;
                targetHeight = 1920;
                break;
            case '1:1':
                targetWidth = 1080;
                targetHeight = 1080;
                break;
            case '4:3':
                targetWidth = 1440;
                targetHeight = 1080;
                break;
            case '4:5':
                targetWidth = 1080;
                targetHeight = 1350;
                break;
            case '21:9':
                targetWidth = 2560;
                targetHeight = 1080;
                break;
            case 'auto':
                targetWidth = baseWidth;
                targetHeight = baseHeight;
                break;
            case '16:9':
            default:
                targetWidth = 1920;
                targetHeight = 1080;
                break;
        }

        this.canvas.width = targetWidth;
        this.canvas.height = targetHeight;
        this._cachedBg = null;
    }

    setAspectRatio(ratio) {
        this.aspectRatio = ratio;
        this.updateCanvasDimensions();
        this.drawFrame();
    }

    generateAutoZooms() {
        this.zoomSegments = this.cinemaZoom.generateZoomSegments({
            zoomAmount: this.zoomLevel,
        });
        console.log('[Studio] Generated', this.zoomSegments.length, 'auto-zoom segments');
    }

    play() {
        this.video.playbackRate = this.playbackSpeed;
        this.video.play().catch(e => console.error('[Studio] Play failed:', e));
    }

    pause() {
        this.video.pause();
    }


    // ── ASMR Tactile Click Sound Synthesis ──
    playClickSound(style = this.clickSoundStyle) {
        if (!this.clickSoundEnabled || style === 'none') return;
        try {
            if (!this._audioCtx) {
                this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this._audioCtx.state === 'suspended') {
                this._audioCtx.resume();
            }
            const ctx = this._audioCtx;
            const now = ctx.currentTime;

            if (style === 'pop') {
                // Soft organic tactile pop (Screen Studio style)
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.045);
            } else if (style === 'mechanical') {
                // Crisp mechanical switch click
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.035);
            }
        } catch (e) { }
    }

    setSpeed(speed) {
        this.playbackSpeed = speed;
        this.video.playbackRate = speed;
    }

    resetCamera() {
        this.camera = { x: 0.5, y: 0.5, scale: 1.0 };
        this.cinemaCursor.reset();
        this.updateCamera();
        this.drawFrame();
    }

    addZoom(timeSec, x = 0.5, y = 0.5, scale = 1.8) {
        const timeMs = timeSec * 1000;
        this.clicks.push({ time: timeMs, x, y, scale });
        this.clicks.sort((a, b) => a.time - b.time);

        this.cinemaCursor.setClicks(this.clicks);
        this.cinemaZoom.setClicks(this.clicks);
        this.generateAutoZooms();

        this.updateCamera();
        this.drawFrame();
    }

    setZoomLevel(level) {
        this.zoomLevel = level;
        this.cinemaZoom.setZoomLevel(level);
        this.generateAutoZooms();
        this.updateCamera();
        this.drawFrame();
    }

    resolveClick(normX, normY) {
        const Px = normX * this.canvas.width;
        const Py = normY * this.canvas.height;
        const P1x = Px - this.canvas.width / 2;
        const P1y = Py - this.canvas.height / 2;
        const P2x = P1x / this.camera.scale;
        const P2y = P1y / this.camera.scale;

        const frameScale = 1 - this.padding * 2;
        const titleBarHeight = this.titleBar !== 'none' ? 36 : 0;
        const vw = this.canvas.width * frameScale;
        const vRatio = (this.video.videoHeight || 1080) / (this.video.videoWidth || 1920);
        const vh = vw * vRatio;
        const totalHeight = vh + titleBarHeight;

        const panX = (this.camera.x - 0.5) * vw;
        const panY = (this.camera.y - 0.5) * totalHeight;
        const P3x = P2x + panX;
        const P3y = P2y + panY;
        const winX = -vw / 2;
        const winY = -totalHeight / 2;
        const videoX = winX;
        const videoY = winY + titleBarHeight;
        const relX = P3x - videoX;
        const relY = P3y - videoY;
        const finalX = relX / vw;
        const finalY = relY / vh;
        return {
            x: Math.max(0, Math.min(1, finalX)),
            y: Math.max(0, Math.min(1, finalY))
        };
    }

    renderLoop() {
        const loop = () => {
            if (!this.isPlaying) return;
            this.updateCamera();
            this.drawFrame();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    updateCamera(timeMs) {
        const currentMs = timeMs !== undefined ? timeMs : (this.video.currentTime * 1000);

        const zoomState = this.cinemaZoom.evaluateAtTime(currentMs);
        const cursorState = this.cinemaCursor.getPositionAt(currentMs);

        this.camera = {
            x: zoomState.x,
            y: zoomState.y,
            scale: zoomState.scale,
        };

        this.cursorState = {
            x: cursorState.x,
            y: cursorState.y,
            opacity: cursorState.opacity !== undefined ? cursorState.opacity : 1.0,
            click_progress: cursorState.clickProgress || 0.0,
            motion: cursorState.motion || 0.0,
        };
    }

    static BACKGROUNDS = {
        bigSur: {
            type: 'radial',
            name: 'Big Sur',
            colors: [
                { pos: 0, color: '#ff6b9d' },
                { pos: 0.3, color: '#c44569' },
                { pos: 0.5, color: '#6c5ce7' },
                { pos: 0.8, color: '#0c3483' },
                { pos: 1, color: '#1a1a2e' }
            ]
        },
        monterey: {
            type: 'radial',
            name: 'Monterey',
            colors: [
                { pos: 0, color: '#00b894' },
                { pos: 0.25, color: '#00cec9' },
                { pos: 0.5, color: '#0984e3' },
                { pos: 0.8, color: '#6c5ce7' },
                { pos: 1, color: '#2d1b4e' }
            ]
        },
        ventura: {
            type: 'diagonal',
            name: 'Ventura',
            colors: [
                { pos: 0, color: '#e17055' },
                { pos: 0.3, color: '#d63031' },
                { pos: 0.5, color: '#fd79a8' },
                { pos: 0.7, color: '#a855f7' },
                { pos: 1, color: '#1e3a5f' }
            ]
        },
        bloom: {
            type: 'radial',
            name: 'Bloom',
            colors: [
                { pos: 0, color: '#74b9ff' },
                { pos: 0.3, color: '#0984e3' },
                { pos: 0.5, color: '#6c5ce7' },
                { pos: 0.7, color: '#a855f7' },
                { pos: 1, color: '#1a1a2e' }
            ]
        },
        sonoma: {
            type: 'diagonal',
            name: 'Sonoma',
            colors: [
                { pos: 0, color: '#fdcb6e' },
                { pos: 0.25, color: '#f39c12' },
                { pos: 0.5, color: '#e74c3c' },
                { pos: 0.75, color: '#9b59b6' },
                { pos: 1, color: '#2c3e50' }
            ]
        },
        midnight: {
            type: 'radial',
            name: 'Midnight',
            colors: [
                { pos: 0, color: '#2c3e50' },
                { pos: 0.5, color: '#1a1a2e' },
                { pos: 1, color: '#0a0a0f' }
            ]
        },
        cyberpunk: {
            type: 'diagonal',
            name: 'Cyberpunk',
            colors: [
                { pos: 0, color: '#ff007f' },
                { pos: 0.4, color: '#7928ca' },
                { pos: 0.7, color: '#0070f3' },
                { pos: 1, color: '#00dfd8' }
            ]
        },
        sunset: {
            type: 'diagonal',
            name: 'Sunset',
            colors: [
                { pos: 0, color: '#ff7e5f' },
                { pos: 0.5, color: '#feb47b' },
                { pos: 1, color: '#6a11cb' }
            ]
        },
        obsidian: {
            type: 'radial',
            name: 'Obsidian',
            colors: [
                { pos: 0, color: '#1f1f2e' },
                { pos: 0.6, color: '#111116' },
                { pos: 1, color: '#08080a' }
            ]
        },
        nordic: {
            type: 'diagonal',
            name: 'Nordic Aurora',
            colors: [
                { pos: 0, color: '#0575E6' },
                { pos: 0.5, color: '#00F260' },
                { pos: 1, color: '#001f3f' }
            ]
        },
        hyperDark: {
            type: 'radial',
            name: 'Hyper Dark',
            colors: [
                { pos: 0, color: '#18181f' },
                { pos: 0.7, color: '#0d0d12' },
                { pos: 1, color: '#050508' }
            ]
        },
        ocean: {
            type: 'diagonal',
            name: 'Emerald Ocean',
            colors: [
                { pos: 0, color: '#00c6ff' },
                { pos: 0.5, color: '#0072ff' },
                { pos: 1, color: '#081735' }
            ]
        }
    };

    _drawBackground(ctx, c, v) {
        if (this.background === 'solid') {
            ctx.fillStyle = this.customBgColor || '#12121a';
            ctx.fillRect(0, 0, c.width, c.height);
            return;
        }

        // Dynamic Video Blur Backdrop (Iconic Screen Studio aesthetic)
        if (this.background === 'blur' && v.readyState >= 2) {
            ctx.save();
            ctx.filter = 'blur(45px) saturate(1.8) brightness(0.65)';
            ctx.drawImage(v, -50, -50, c.width + 100, c.height + 100);
            ctx.filter = 'none';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.restore();
            return;
        }

        const key = `${this.background}_${c.width}_${c.height}`;
        if (this._cachedBgKey === key && this._cachedBg) {
            ctx.fillStyle = this._cachedBg;
            ctx.fillRect(0, 0, c.width, c.height);
            return;
        }

        const bgConfig = StudioEngine.BACKGROUNDS[this.background] || StudioEngine.BACKGROUNDS.bigSur;
        let gradient;
        if (bgConfig.type === 'radial') {
            gradient = ctx.createRadialGradient(
                c.width * 0.35, c.height * 0.35, 0,
                c.width * 0.5, c.height * 0.5, c.width * 0.85
            );
        } else {
            gradient = ctx.createLinearGradient(0, 0, c.width, c.height);
        }
        bgConfig.colors.forEach(({ pos, color }) => gradient.addColorStop(pos, color));
        this._cachedBg = gradient;
        this._cachedBgKey = key;

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, c.width, c.height);
    }

    drawFrame() {
        const c = this.canvas;
        const ctx = this.ctx;
        const v = this.video;
        const cam = this.camera;

        // Render Background
        this._drawBackground(ctx, c, v);

        if (v.readyState >= 2) {
            ctx.save();

            const titleBarHeight = this.titleBar !== 'none' ? 36 : 0;
            const frameScale = 1 - this.padding * 2;
            const vw = c.width * frameScale;
            const vRatio = ((v.videoHeight || 1080) / (v.videoWidth || 1920));
            const vh = vw * vRatio;
            const totalHeight = vh + titleBarHeight;

            const cx = c.width / 2;
            const cy = c.height / 2;

            // Apply Camera Transform
            ctx.translate(cx, cy);
            ctx.scale(cam.scale, cam.scale);

            const panX = (cam.x - 0.5) * vw;
            const panY = (cam.y - 0.5) * totalHeight;
            ctx.translate(-panX, -panY);

            const r = this.borderRadius;
            const x = -vw / 2;
            const y = -totalHeight / 2;
            const w = vw;
            const h = totalHeight;

            // Drop Shadow based on preset
            if (this.shadowPreset !== 'none') {
                if (this.shadowPreset === 'deep') {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
                    ctx.shadowBlur = 85;
                    ctx.shadowOffsetY = 36;
                } else if (this.shadowPreset === 'soft') {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
                    ctx.shadowBlur = 50;
                    ctx.shadowOffsetY = 18;
                } else if (this.shadowPreset === 'crisp') {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
                    ctx.shadowBlur = 22;
                    ctx.shadowOffsetY = 12;
                } else if (this.shadowPreset === 'glow') {
                    ctx.shadowColor = 'rgba(220, 254, 80, 0.35)';
                    ctx.shadowBlur = 60;
                    ctx.shadowOffsetY = 0;
                }
            }

            ctx.fillStyle = '#16161a';
            this.roundRect(ctx, x, y, w, h, r);
            ctx.fill();

            ctx.shadowColor = 'transparent';

            // Title Bar
            if (this.titleBar !== 'none') {
                ctx.save();
                this.roundRect(ctx, x, y, w, titleBarHeight, { tl: r, tr: r, bl: 0, br: 0 });
                ctx.clip();

                ctx.fillStyle = '#202028';
                ctx.fillRect(x, y, w, titleBarHeight);

                if (this.titleBar === 'macos') {
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
                } else if (this.titleBar === 'windows') {
                    const rx = x + w - 16;
                    const ry = y + titleBarHeight / 2;
                    ctx.strokeStyle = '#888899';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(rx - 8, ry - 4); ctx.lineTo(rx, ry + 4);
                    ctx.moveTo(rx, ry - 4); ctx.lineTo(rx - 8, ry + 4);
                    ctx.stroke();
                } else if (this.titleBar === 'custom') {
                    ctx.fillStyle = '#9999aa';
                    ctx.font = '500 11px system-ui';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.windowTitle || 'Drift Recording', x + w / 2, y + titleBarHeight / 2 + 4);
                }

                ctx.restore();
            }

            // Video Area
            ctx.save();
            ctx.beginPath();
            if (this.titleBar !== 'none') {
                this.roundRect(ctx, x, y + titleBarHeight, w, vh, { tl: 0, tr: 0, bl: r, br: r });
            } else {
                this.roundRect(ctx, x, y, w, vh, r);
            }
            ctx.clip();

            ctx.drawImage(v, x, y + titleBarHeight, w, vh);

            // Draw Cursor & Click FX (Handles Double Cursor prevention)
            if (this.showCursor && this.cursorMode !== 'none' && this.cursorState.opacity > 0.01) {
                const cursorX = x + this.cursorState.x * w;
                const cursorY = y + titleBarHeight + this.cursorState.y * vh;
                ctx.globalAlpha = this.cursorState.opacity;

                // Always draw click ripple if click effect is enabled
                if (this.cursorState.click_progress > 0.01 && this.clickEffect !== 'none') {
                    this.drawClickEffect(ctx, cursorX, cursorY, this.cursorState.click_progress);
                }

                // Only draw overlay cursor arrow if in 'smooth' mode
                if (this.cursorMode === 'smooth') {
                    this.drawCursor(ctx, cursorX, cursorY, this.cursorState.motion, this.cursorState.click_progress);
                }
                ctx.globalAlpha = 1;
            }

            // Draw Webcam Bubble (Picture-in-Picture)
            if (this.webcamEnabled && this.webcamVideo && this.webcamVideo.readyState >= 2) {
                this.drawWebcamBubble(ctx, x, y + titleBarHeight, w, vh);
            }

            ctx.restore();

            // Border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            this.roundRect(ctx, x, y, w, h, r);
            ctx.stroke();

            ctx.restore();
        }
    }

    drawWebcamBubble(ctx, vx, vy, vw, vh) {
        ctx.save();
        const size = this.webcamSize * (vw / 1920);
        const margin = 24 * (vw / 1920);

        let bx = vx + vw - size - margin;
        let by = vy + vh - size - margin;

        if (this.webcamPosition === 'bottom-left') {
            bx = vx + margin;
            by = vy + vh - size - margin;
        } else if (this.webcamPosition === 'top-right') {
            bx = vx + vw - size - margin;
            by = vy + margin;
        } else if (this.webcamPosition === 'top-left') {
            bx = vx + margin;
            by = vy + margin;
        }

        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 8;

        ctx.beginPath();
        if (this.webcamShape === 'circle') {
            ctx.arc(bx + size / 2, by + size / 2, size / 2, 0, Math.PI * 2);
        } else {
            this.roundRect(ctx, bx, by, size, size, 20);
        }
        ctx.fillStyle = '#000';
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.clip();

        ctx.drawImage(this.webcamVideo, bx, by, size, size);

        // Webcam Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    drawClickEffect(ctx, x, y, progress) {
        ctx.save();
        if (this.clickEffect === 'ripple') {
            const radius = (10 + progress * 28) * this.cursorSize;
            const alpha = (1 - progress) * 0.75;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(220, 254, 80, ${alpha})`;
            ctx.lineWidth = 2.5 * (1 - progress * 0.5);
            ctx.stroke();

            // Inner shockwave
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 254, 80, ${alpha * 0.35})`;
            ctx.fill();
        } else if (this.clickEffect === 'pulse') {
            const radius = (8 + progress * 20) * this.cursorSize;
            const alpha = (1 - progress) * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${alpha * 0.45})`;
            ctx.fill();
        } else if (this.clickEffect === 'ring') {
            const radius = (12 + progress * 18) * this.cursorSize;
            const alpha = (1 - progress) * 0.9;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.restore();
    }

    drawCursor(ctx, x, y, motion = 0, clickProgress = 0) {
        ctx.save();
        ctx.translate(x, y);

        const baseScale = this.cursorSize;
        const clickScale = clickProgress > 0 ? 1 - clickProgress * 0.15 : 1;
        const motionScale = 1 + motion * 0.12;

        ctx.scale(baseScale * clickScale, baseScale * clickScale * motionScale);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = 8 + motion * 12;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 3;

        if (this.cursorStyle === 'dot') {
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#DCFE50';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            return;
        }

        if (this.cursorStyle === 'glow') {
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220, 254, 80, 0.35)';
            ctx.fill();
        }

        // Pointer Path
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 20);
        ctx.lineTo(5, 15);
        ctx.lineTo(9, 22);
        ctx.lineTo(12, 20);
        ctx.lineTo(8, 13);
        ctx.lineTo(14, 13);
        ctx.closePath();

        if (this.cursorStyle === 'light') {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        } else {
            // macOS / Dark Default
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#000000';
            ctx.fill();
        }

        ctx.restore();
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.closePath();
    }

    // --- 4K/60FPS HARDWARE EXPORTER (WebCodecs + mp4-muxer) ---
    async exportVideo(options = {}, onProgress) {
        if (typeof VideoEncoder !== 'undefined') {
            try {
                return await this._exportMP4(options, onProgress);
            } catch (e) {
                console.warn('[Studio] WebCodecs MP4 export failed, falling back to WebM:', e);
            }
        }
        return await this._exportWebM(options, onProgress);
    }

    async _exportMP4(options = {}, onProgress) {
        const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');

        this.video.pause();
        this.video.currentTime = this.trimStart || 0;
        this.resetCamera();
        await new Promise(r => setTimeout(r, 200));

        const exportDuration = (this.trimEnd || this.videoDuration) - (this.trimStart || 0);
        const fps = options.fps || 60;
        const totalFrames = Math.ceil(exportDuration * fps);
        const frameDurationUs = 1_000_000 / fps;

        const width = options.width || this.canvas.width || 1920;
        const height = options.height || this.canvas.height || 1080;

        const is4K = width >= 3840 || height >= 2160;
        const isHD = width >= 1920 || height >= 1080;
        const targetBitrate = is4K ? 45_000_000 : isHD ? 25_000_000 : 12_000_000;

        const profiles = ['avc1.640028', 'avc1.4d001f', 'avc1.42001f'];
        let codecConfig = null;
        for (const codec of profiles) {
            try {
                const support = await VideoEncoder.isConfigSupported({
                    codec, width, height,
                    bitrate: targetBitrate,
                    bitrateMode: 'constant',
                    framerate: fps,
                    latencyMode: 'quality',
                    hardwareAcceleration: 'prefer-hardware',
                    avc: { format: 'avc' },
                });
                if (support.supported) {
                    codecConfig = support.config;
                    break;
                }
            } catch { continue; }
        }
        if (!codecConfig) throw new Error('No supported H.264 profile found for WebCodecs');

        console.log(`[Studio] Exporting MP4 via WebCodecs: ${width}x${height} @ ${fps}fps (${(targetBitrate / 1_000_000).toFixed(0)} Mbps)`);

        const target = new ArrayBufferTarget();
        const muxer = new Muxer({
            target,
            video: { codec: 'avc', width, height },
            fastStart: 'in-memory',
        });

        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const encoder = new VideoEncoder({
                output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
                error: (e) => reject(e),
            });
            encoder.configure({
                ...codecConfig,
                hardwareAcceleration: 'prefer-hardware',
                latencyMode: 'quality',
                bitrateMode: 'constant',
                bitrate: targetBitrate,
            });

            let frameIndex = 0;
            this.video.currentTime = this.trimStart || 0;

            const seekAndRender = () => {
                return new Promise(seekResolve => {
                    const targetTime = (this.trimStart || 0) + (frameIndex / fps);
                    if (targetTime >= (this.trimEnd || this.videoDuration) || frameIndex >= totalFrames) {
                        seekResolve(false);
                        return;
                    }

                    this.video.currentTime = targetTime;
                    const onSeeked = () => {
                        this.video.removeEventListener('seeked', onSeeked);

                        // Synchronous camera & cursor update
                        this.updateCamera(targetTime * 1000);
                        this.drawFrame();

                        const timestamp = Math.round(frameIndex * frameDurationUs);
                        const frame = new VideoFrame(this.canvas, {
                            timestamp,
                            duration: Math.round(frameDurationUs),
                        });
                        encoder.encode(frame, { keyFrame: frameIndex % fps === 0 });
                        frame.close();

                        frameIndex++;
                        if (onProgress) {
                            const p = Math.min(frameIndex / totalFrames, 1);
                            const elapsed = (Date.now() - startTime) / 1000;
                            const estimatedTotal = elapsed / Math.max(p, 0.01);
                            const etaSeconds = Math.max(0, Math.round(estimatedTotal - elapsed));
                            if (isFinite(p)) onProgress({ progress: p, frameIndex, totalFrames, etaSeconds });
                        }
                        seekResolve(true);
                    };
                    this.video.addEventListener('seeked', onSeeked);
                });
            };

            const processFrames = async () => {
                try {
                    while (true) {
                        const hasMore = await seekAndRender();
                        if (!hasMore) break;
                    }

                    await encoder.flush();
                    encoder.close();
                    muxer.finalize();

                    const mp4Blob = new Blob([target.buffer], { type: 'video/mp4' });
                    console.log('[Studio] MP4 export complete:', (mp4Blob.size / 1024 / 1024).toFixed(1), 'MB');
                    resolve(mp4Blob);
                } catch (e) {
                    reject(e);
                }
            };

            processFrames();
        });
    }

    // --- WebM fallback ---
    async _exportWebM(options = {}, onProgress) {
        this.video.pause();
        this.video.currentTime = this.trimStart || 0;
        this.resetCamera();
        await new Promise(r => setTimeout(r, 200));

        const exportDuration = (this.trimEnd || this.videoDuration) - (this.trimStart || 0);
        const chunks = [];
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
            ? 'video/webm;codecs=vp9,opus'
            : 'video/webm';

        const stream = this.canvas.captureStream(0);
        if (this.video.captureStream) {
            try {
                const videoStream = this.video.captureStream();
                videoStream.getAudioTracks().forEach(track => stream.addTrack(track));
            } catch (e) {
                console.log('[Studio] Audio capture fallback:', e);
            }
        }

        const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 25_000_000 });
        rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

        return new Promise((resolve) => {
            rec.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };

            rec.start();
            this.video.play();
            this.isPlaying = true;

            const renderExport = () => {
                if (this.video.ended || this.video.currentTime >= (this.trimEnd || this.videoDuration)) {
                    this.isPlaying = false;
                    this.video.pause();
                    rec.stop();
                    return;
                }

                this.updateCamera(this.video.currentTime * 1000);
                this.drawFrame();

                const canvasTrack = stream.getVideoTracks().find(t => t.kind === 'video');
                if (canvasTrack?.requestFrame) canvasTrack.requestFrame();

                const currentTime = this.video.currentTime - (this.trimStart || 0);
                const progress = Math.min(Math.max(currentTime / exportDuration, 0), 1);
                if (onProgress && isFinite(progress)) onProgress({ progress, frameIndex: 0, totalFrames: 100, etaSeconds: 0 });

                requestAnimationFrame(renderExport);
            };

            renderExport();
        });
    }
}
