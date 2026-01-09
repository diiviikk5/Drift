// Drift - Cinema-Grade Auto-Zoom with Ultra-Smooth Transitions

// Silky smooth easing functions
const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

const SPEED_PRESETS = {
    // Slower, more cinematic "swoosh"
    slow: { zoomIn: 1000, hold: 1200, zoomOut: 1000, smoothing: 0.05 }, // Was 700/0.07
    normal: { zoomIn: 750, hold: 1000, zoomOut: 750, smoothing: 0.07 },
    fast: { zoomIn: 400, hold: 600, zoomOut: 500, smoothing: 0.12 }
};

class Drift {
    constructor() {
        this.screenStream = null;
        this.micStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.clicks = [];
        this.mouseMoves = [];
        this.startTime = null;
        this.timerInterval = null;
        this.recordingDuration = 0;
        this.recordingDuration = 0;
        this.trimEndMs = 0; // Trim this many ms from end
        this.audioClicks = []; // User added sound effects

        this.videoBlob = null;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.videoDuration = 10;

        this.camera = { x: 0.5, y: 0.5, scale: 1 };
        this.target = { x: 0.5, y: 0.5, scale: 1 };
        this.activeZoom = null;
        this.lastClickIdx = -1;

        // Settings - slow & elegant by default
        this.zoomLevel = 1.25;
        this.speedPreset = 'slow';
        this.lookAheadMs = 400; // More anticipation for slow mode

        this.screenW = screen.width;
        this.screenH = screen.height;

        this.init();
    }

    get speed() { return SPEED_PRESETS[this.speedPreset]; }

    init() {
        document.getElementById('selectScreenBtn').onclick = () => this.selectScreen();
        document.getElementById('micBtn').onclick = () => this.toggleMic();
        document.getElementById('startBtn').onclick = () => this.startRecording();
        document.getElementById('stopBtn').onclick = () => this.stopRecording();

        chrome.runtime.onMessage.addListener((msg) => {
            if (this.mediaRecorder?.state === 'recording') {
                const t = Date.now() - this.startTime;
                if (msg.type === 'CLICK_EVENT') {
                    this.clicks.push({ time: t, x: msg.screenX / this.screenW, y: msg.screenY / this.screenH });
                    document.getElementById('clickCount').textContent = this.clicks.length;
                } else if (msg.type === 'MOUSE_MOVE') {
                    this.mouseMoves.push({ time: t, x: msg.screenX / this.screenW, y: msg.screenY / this.screenH });
                } else if (msg.type === 'STOP_FROM_HOTKEY') {
                    // Trim last 2.0s (ensure no hotkey UI / notification remains)
                    this.trimEndMs = 2000;
                    this.stopRecording();
                }
            }
        });
    }

    async selectScreen() {
        const btn = document.getElementById('selectScreenBtn');
        try {
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' },
                audio: true
            });
            btn.textContent = '✅ Screen selected';
            btn.classList.add('selected');
            document.getElementById('startBtn').disabled = false;

            this.screenStream.getVideoTracks()[0].onended = () => {
                btn.textContent = '🖥️ Select screen';
                btn.classList.remove('selected');
                document.getElementById('startBtn').disabled = true;
                this.screenStream = null;
            };
        } catch (e) { }
    }

    async toggleMic() {
        const btn = document.getElementById('micBtn');
        if (this.micStream) {
            this.micStream.getTracks().forEach(t => t.stop());
            this.micStream = null;
            btn.innerHTML = '<span class="indicator"></span> 🎤 Microphone';
        } else {
            try {
                this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                btn.innerHTML = '<span class="indicator active"></span> 🎤 Mic ON';
            } catch (e) { }
        }
    }

    startRecording() {
        if (!this.screenStream) return;

        // internal state
        this.startPos = document.getElementById('startPosSelect').value;
        this.clicks = [];
        this.mouseMoves = [];
        this.startTime = Date.now();

        chrome.runtime.sendMessage({ type: 'START_RECORDING' });

        // --- AUDIO MIXING MAGIC ---
        // We must mix System Audio + Mic into a SINGLE track, otherwise MediaRecorder ignores one.
        const ctx = new AudioContext();
        const dest = ctx.createMediaStreamDestination();
        const sources = [];

        // 1. System Audio
        if (this.screenStream.getAudioTracks().length > 0) {
            const src = ctx.createMediaStreamSource(this.screenStream);
            const gain = ctx.createGain();
            gain.gain.value = 0.8; // Reduce system volume slightly to let voice cut through
            src.connect(gain).connect(dest);
            sources.push(src); // Keep ref to prevent GC
        }

        // 2. Mic Audio
        if (this.micStream && this.micStream.getAudioTracks().length > 0) {
            const src = ctx.createMediaStreamSource(this.micStream);
            const gain = ctx.createGain();
            gain.gain.value = 1.0; // Boost mic?
            src.connect(gain).connect(dest);
            sources.push(src);
        }

        // Combine Video + Mixed Audio
        const mixedAudioTracks = dest.stream.getAudioTracks();
        const videoTracks = this.screenStream.getVideoTracks();

        // Final Stream
        const combinedStream = new MediaStream([
            ...videoTracks,
            ...(mixedAudioTracks.length > 0 ? mixedAudioTracks : [])
        ]);

        this.audioContext = ctx; // Store to close later if needed

        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';

        this.mediaRecorder = new MediaRecorder(combinedStream, { mimeType: mime, videoBitsPerSecond: 8000000 });
        this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) this.recordedChunks.push(e.data); };
        this.mediaRecorder.onstop = () => {
            // Cleanup Audio Context
            if (this.audioContext) this.audioContext.close();
            this.onStop();
        };
        this.mediaRecorder.start(100);

        document.getElementById('statusBar').classList.add('visible');
        document.getElementById('recordActions').classList.add('hidden');
        document.getElementById('stopActions').classList.remove('hidden');

        this.timerInterval = setInterval(() => {
            const s = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('timer').textContent =
                `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopRecording() {
        this.recordingDuration = (Date.now() - this.startTime) / 1000;
        if (this.mediaRecorder?.state !== 'inactive') this.mediaRecorder.stop();
        clearInterval(this.timerInterval);
        chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });
        document.getElementById('statusBar').classList.remove('visible');
    }

    onStop() {
        this.videoBlob = new Blob(this.recordedChunks, { type: this.mediaRecorder.mimeType });
        this.showStudio();
    }

    showStudio() {
        document.getElementById('recorderMode').classList.add('hidden');
        document.getElementById('studioMode').classList.remove('hidden');

        this.video = document.getElementById('sourceVideo');
        this.canvas = document.getElementById('outputCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.video.src = URL.createObjectURL(this.videoBlob);

        this.video.onloadedmetadata = () => {
            this.videoDuration = isFinite(this.video.duration) ? this.video.duration : this.recordingDuration;

            // Init trim (respect hotkey trim if present)
            this.trimStart = 0;
            this.trimEnd = this.videoDuration - (this.trimEndMs || 0) / 1000;
            this.updateTimelineUI();

            this.canvas.width = this.video.videoWidth || 1920;
            this.canvas.height = this.video.videoHeight || 1080;

            if (this.clicks.length === 0) {
                const dur = this.videoDuration * 1000;
                this.clicks = [
                    { time: dur * 0.15, x: 0.3, y: 0.35 },
                    { time: dur * 0.35, x: 0.7, y: 0.4 },
                    { time: dur * 0.55, x: 0.5, y: 0.65 },
                    { time: dur * 0.75, x: 0.25, y: 0.5 }
                ];
            }

            document.getElementById('statDuration').textContent = this.fmt(this.videoDuration);
            document.getElementById('statClicks').textContent = this.clicks.length;
            document.getElementById('statSize').textContent = (this.videoBlob.size / 1024 / 1024).toFixed(1) + ' MB';

            this.updateTimelineUI();

            this.resetCamera();

            // CINEMATIC INTRO: Based on user preference
            this.camera = { x: 0.5, y: 0.5, scale: 1 }; // Default neutral

            if (this.startPos !== 'none') {
                let introX = 0.5, introY = 0.5;

                if (this.startPos === 'top-left') { introX = 0.25; introY = 0.25; }
                else if (this.startPos === 'top-right') { introX = 0.75; introY = 0.25; }

                this.camera = {
                    x: introX,
                    y: introY,
                    scale: 1.35
                };
            }

            // Immediately drift to wide view (The "Zoom Out" effect)
            this.target = { x: 0.5, y: 0.5, scale: 1 };


            this.renderLoop();
            this.video.play().then(() => document.getElementById('playBtn').textContent = '⏸️');
        };

        this.video.ontimeupdate = () => {
            const pct = (this.video.currentTime / this.videoDuration) * 100;
            document.getElementById('timelineProgress').style.width = `${Math.min(pct, 100)}%`;
            document.getElementById('timeDisplay').textContent =
                `${this.fmt(this.video.currentTime)} / ${this.fmt(this.videoDuration)}`;

            // Enforce Trim Loop
            if (this.trimEnd > 0) {
                if (this.video.currentTime > this.trimEnd) {
                    this.video.currentTime = this.trimStart;
                }
                // If scrubbed before start (allow manual seeking, but maybe warn?)
            }
        };

        this.video.onended = () => document.getElementById('playBtn').textContent = '▶️';

        // Controls
        document.getElementById('playBtn').onclick = () => this.togglePlay();
        document.getElementById('downloadBtn').onclick = () => this.downloadRaw();
        document.getElementById('exportBtn').onclick = () => this.exportZoomed();
        document.getElementById('newRecordingBtn').onclick = () => location.reload();
        document.getElementById('timeline').onclick = e => {
            const r = e.currentTarget.getBoundingClientRect();
            this.video.currentTime = ((e.clientX - r.left) / r.width) * this.videoDuration;
            this.resetCamera();
            this.lastClickIdx = -1;
        };

        document.getElementById('addClickBtn').onclick = () => {
            const t = this.video.currentTime;
            this.audioClicks.push(t); // Add time in seconds (video.currentTime format)
            this.audioClicks.sort((a, b) => a - b);
            this.updateTimelineUI();
            this.playClickSound(); // Preview
        };
        document.getElementById('clearClicksBtn').onclick = () => {
            this.audioClicks = [];
            this.updateTimelineUI();
        };

        // Backgrounds
        document.querySelectorAll('.bg-option').forEach(o => {
            o.onclick = () => {
                document.querySelectorAll('.bg-option').forEach(x => x.classList.remove('active'));
                o.classList.add('active');
                // Don't change the whole page background, just the video canvas (handled in drawFrame)
                if (this.video.paused) this.drawFrame();
            };
        });

        // Trim Controls
        document.getElementById('setStartBtn').onclick = () => {
            this.trimStart = this.video.currentTime;
            if (this.trimStart > this.trimEnd) this.trimEnd = this.videoDuration;
            this.updateTimelineUI();
        };
        document.getElementById('setEndBtn').onclick = () => {
            this.trimEnd = this.video.currentTime;
            if (this.trimEnd < this.trimStart) this.trimStart = 0;
            this.updateTimelineUI();
        };
        document.getElementById('resetTrimBtn').onclick = () => {
            this.trimStart = 0;
            this.trimEnd = this.videoDuration;
            this.updateTimelineUI();
        };
    }

    updateTimelineUI() {
        if (!this.videoDuration) return;
        const tl = document.getElementById('timelineRange');
        const startPct = (this.trimStart / this.videoDuration) * 100;
        const durPct = ((this.trimEnd - this.trimStart) / this.videoDuration) * 100;

        tl.style.left = `${startPct}%`;
        tl.style.width = `${Math.max(0, durPct)}%`;
        // Highlights the active area, outside is dimmed
        tl.style.background = 'rgba(220, 254, 80, 0.2)';
        tl.style.borderLeft = '2px solid #DCFE50';
        tl.style.borderRight = '2px solid #DCFE50';
        console.log(`[Drift] Trim: ${this.trimStart.toFixed(2)} - ${this.trimEnd.toFixed(2)}`);
    }

    resetCamera() {
        this.camera = { x: 0.5, y: 0.5, scale: 1 };
        this.target = { x: 0.5, y: 0.5, scale: 1 };
        this.activeZoom = null;
        this.lastRenderTime = 0; // For audio tracking
    }

    renderLoop() {
        const loop = () => {
            this.updateCamera();
            this.checkAudioClicks();
            this.drawFrame();
            requestAnimationFrame(loop);
        };
        loop();
    }

    checkAudioClicks() {
        if (this.video.paused) return;
        const now = this.video.currentTime;
        const last = this.lastRenderTime || now;

        // Find clicks between last frame and now
        // Handle looping? If now < last, we looped.
        if (now < last) { /* looped, ignore for simplicity or check 0..now */ }
        else {
            this.audioClicks.forEach(t => {
                if (t > last && t <= now) this.playClickSound();
            });
        }
        this.lastRenderTime = now;
    }

    updateCamera() {
        const currentMs = this.video.currentTime * 1000;
        const sp = this.speed;

        // Only check for new zoom triggers if NO zoom is active
        // This ensures each zoom fully completes before starting a new one
        if (!this.activeZoom) {
            // Priority 1: Check for clicks to trigger zoom
            for (let i = 0; i < this.clicks.length; i++) {
                const click = this.clicks[i];
                const diff = currentMs - click.time;

                // Look-ahead anticipation (subtle drift before click)
                if (diff > -this.lookAheadMs && diff < 0 && i > this.lastClickIdx) {
                    const anticipation = 1 - Math.abs(diff) / this.lookAheadMs;
                    this.target.x = 0.5 + (click.x - 0.5) * anticipation * 0.1;
                    this.target.y = 0.5 + (click.y - 0.5) * anticipation * 0.1;
                }

                // Trigger zoom only when time is reached and no zoom active
                if (diff >= 0 && diff < 200 && i > this.lastClickIdx) {
                    this.triggerZoom(click.x, click.y);
                    this.lastClickIdx = i;
                    break;
                }
            }

            // Priority 2: If no click is imminent/active, FOLLOW THE MOUSE (General Flow)
            // find the last mouse move before current time
            // Simple binary search or just iterate (moves are sorted)
            // Optimization: start from recent index
            let bestMove = null;
            for (let i = this.mouseMoves.length - 1; i >= 0; i--) {
                if (this.mouseMoves[i].time <= currentMs) {
                    bestMove = this.mouseMoves[i];
                    break;
                }
            }

            if (bestMove) {
                // Gently drift camera towards mouse position, but keep scale at 1.0 (Full View)
                // We map mouse (0-1) to target x/y. 
                // We use a "soft follow" - don't center hard, just bias towards it.
                this.target.x = bestMove.x;
                this.target.y = bestMove.y;
                this.target.scale = 1.0;
            }
        }

        if (this.activeZoom) {
            const elapsed = performance.now() - this.activeZoom.startTime;
            const { zoomIn, hold, zoomOut } = sp;

            if (elapsed < zoomIn) {
                // Zoom IN - easeOutQuint for silky smooth start
                const t = elapsed / zoomIn;
                const e = easeOutQuint(t);
                this.target.scale = 1 + (this.zoomLevel - 1) * e;
                this.target.x = 0.5 + (this.activeZoom.x - 0.5) * e;
                this.target.y = 0.5 + (this.activeZoom.y - 0.5) * e;
            } else if (elapsed < zoomIn + hold) {
                // HOLD
                this.target.scale = this.zoomLevel;
                this.target.x = this.activeZoom.x;
                this.target.y = this.activeZoom.y;
            } else if (elapsed < zoomIn + hold + zoomOut) {
                // Zoom OUT - ultra smooth easeInOutQuart
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

        // Smooth interpolation
        this.camera.x += (this.target.x - this.camera.x) * sp.smoothing;
        this.camera.y += (this.target.y - this.camera.y) * sp.smoothing;
        this.camera.scale += (this.target.scale - this.camera.scale) * sp.smoothing;
    }

    triggerZoom(x, y) {
        this.activeZoom = {
            x: Math.max(0.15, Math.min(0.85, x)),
            y: Math.max(0.15, Math.min(0.85, y)),
            startTime: performance.now()
        };
    }

    drawFrame() {
        const c = this.canvas;
        const ctx = this.ctx;
        const v = this.video;
        const cam = this.camera;

        // 1. Draw Background (Gradient) based on active selection
        const activeBg = document.querySelector('.bg-option.active');
        const bgName = activeBg ? activeBg.dataset.bg : 'aurora';
        const bgs = {
            aurora: ['#1a1a2e', '#2d1b4e', '#1e3a5f'],
            sunset: ['#ff6b6b', '#feca57', '#ff9ff3'],
            ocean: ['#0093E9', '#80D0C7'],
            forest: ['#134E5E', '#71B280'],
            nightsky: ['#0f0c29', '#302b63', '#24243e'],
            candy: ['#a855f7', '#ec4899', '#f43f5e']
        };

        const g = ctx.createLinearGradient(0, 0, c.width, c.height);
        const colors = bgs[bgName] || bgs.aurora;
        colors.forEach((col, i) => g.addColorStop(i / (colors.length - 1), col));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);

        if (v.readyState >= 2) {
            ctx.save();

            // VIDEO DIMENSIONS (Scaled down slightly to show background frame)
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
            // Scaling pan relative to video size so it tracks correctly
            const panX = (cam.x - 0.5) * vw;
            const panY = (cam.y - 0.5) * vh;
            ctx.translate(-panX, -panY);

            // Draw Container (Mac Window Style)
            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 50;
            ctx.shadowOffsetY = 30;

            const r = 16; // Corner radius
            const x = -vw / 2; // Centered relative to current transform
            const y = -vh / 2;
            const w = vw;
            const h = vh;

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

            // Red
            ctx.fillStyle = '#FF5F56';
            ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
            // Yellow
            ctx.fillStyle = '#FFBD2E';
            ctx.beginPath(); ctx.arc(bx + gap, by, 6, 0, Math.PI * 2); ctx.fill();
            // Green
            ctx.fillStyle = '#27C93F';
            ctx.beginPath(); ctx.arc(bx + gap * 2, by, 6, 0, Math.PI * 2); ctx.fill();

            ctx.restore();
        }
    }

    togglePlay() {
        if (this.video.paused) {
            this.video.play();
            document.getElementById('playBtn').textContent = '⏸️';
        } else {
            this.video.pause();
            document.getElementById('playBtn').textContent = '▶️';
        }
    }

    downloadRaw() {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(this.videoBlob);
        a.download = `drift-${Date.now()}.webm`;
        a.click();
    }

    playClickSound(ctx = null, when = 0, dest = null) {
        // Synthesize a nice "pop" sound
        const audioCtx = ctx || new AudioContext();
        const t = when || audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);

        gain.gain.setValueAtTime(0.3, t); // Not too loud
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(dest || audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
    }

    updateTimelineUI() {
        const tl = document.getElementById('timeline');
        // Clear old markers (keep range & progress)
        tl.querySelectorAll('.timeline-marker, .click-marker').forEach(e => e.remove());

        // Zoom Markers (Available Clicks) - Red
        this.clicks.forEach(c => {
            const m = document.createElement('div');
            m.className = 'timeline-marker';
            m.style.left = `${(c.time / 1000 / this.videoDuration) * 100}%`;
            tl.appendChild(m);
        });

        // Audio Click Markers - Blue
        this.audioClicks.forEach(time => {
            const m = document.createElement('div');
            m.className = 'click-marker';
            m.style.left = `${(time / this.videoDuration) * 100}%`;
            tl.appendChild(m);
        });
    }

    async exportZoomed() {
        document.getElementById('processingOverlay').classList.remove('hidden');

        this.video.pause();
        this.video.currentTime = this.trimStart || 0;
        this.resetCamera();
        this.lastClickIdx = -1;

        // Unmute for capture
        const originalMuted = this.video.muted;
        this.video.muted = false;
        this.video.volume = 1.0;

        await new Promise(r => setTimeout(r, 500));

        const stream = this.canvas.captureStream(60);

        // --- AUDIO MIXING FOR EXPORT ---
        const exCtx = new AudioContext();
        const exDest = exCtx.createMediaStreamDestination();

        // 1. Source Video Audio
        if (this.video.captureStream) {
            try {
                const vidStream = this.video.captureStream();
                if (vidStream.getAudioTracks().length > 0) {
                    const sourceNode = exCtx.createMediaStreamSource(vidStream);
                    sourceNode.connect(exDest);
                }
            } catch (e) { }
        }

        // Add mixed audio track
        if (exDest.stream.getAudioTracks().length > 0) {
            stream.addTrack(exDest.stream.getAudioTracks()[0]);
        }

        // 2. EXPORT FORMAT
        const types = [
            { mime: 'video/mp4; codecs="avc1.4d002a, mp4a.40.2"', ext: 'mp4' },
            { mime: 'video/mp4; codecs=avc1.4d002a', ext: 'mp4' },
            { mime: 'video/mp4', ext: 'mp4' },
            { mime: 'video/webm; codecs=h264', ext: 'mp4' },
            { mime: 'video/webm; codecs=vp9', ext: 'webm' }
        ];

        let mime = 'video/webm';
        let ext = 'webm';

        for (const t of types) {
            if (MediaRecorder.isTypeSupported(t.mime)) {
                mime = t.mime;
                ext = t.ext;
                console.log(`[Drift] Using compatible format: ${mime}`);
                break;
            }
        }

        const rec = new MediaRecorder(stream, {
            mimeType: mime,
            videoBitsPerSecond: 15000000,
            audioBitsPerSecond: 128000
        });

        const chunks = [];
        rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
        rec.onstop = () => {
            exCtx.close();
            this.video.muted = originalMuted;
            const blob = new Blob(chunks, { type: mime });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `drift-edited-${Date.now()}.${ext}`;
            a.click();
            document.getElementById('processingOverlay').classList.add('hidden');
        };

        rec.start(100);
        this.video.play();

        let lastExTime = this.video.currentTime;

        const checkEnd = () => {
            const now = this.video.currentTime;

            // Audio Clicks Check
            this.audioClicks.forEach(t => {
                if (t > lastExTime && t <= now) {
                    this.playClickSound(exCtx, exCtx.currentTime, exDest);
                }
            });
            lastExTime = now;

            const trimSeconds = (this.trimEndMs || 0) / 1000;
            const endPoint = this.videoDuration - trimSeconds - 0.1;

            const pct = ((now - this.trimStart) / (this.trimEnd - this.trimStart)) * 100;
            const bar = document.getElementById('progressFill');
            if (bar) bar.style.width = `${Math.min(pct, 100)}%`;

            if (now >= endPoint || this.video.ended) {
                setTimeout(() => rec.stop(), 500);
                this.video.pause();
                this.video.onended = null;
            } else {
                requestAnimationFrame(checkEnd);
            }
        };
        checkEnd();

        this.video.onended = () => { if (rec.state === 'recording') rec.stop(); };
    }

    fmt(s) {
        return `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}

document.addEventListener('DOMContentLoaded', () => new Drift());
