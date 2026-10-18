/**
 * WebRecorder — Drift's recorder for the browser, no extension or app needed.
 *
 * What the desktop app gets from the OS, the web version gets this way:
 *
 *  - screen / window / tab: getDisplayMedia, with a CaptureController so the
 *    Drift tab keeps focus while you set up
 *  - system / tab audio and the microphone: recorded as separate tracks (like
 *    the desktop's WASAPI + mic files), so the studio mixes them independently
 *  - webcam: its own track, composited in the studio
 *  - pointer, clicks, scrolling, typing, caret: read back from the captured
 *    frames by a worker while recording (vision/ScreenAnalyzer.js)
 *
 * Everything stays in the browser.
 */

import { fixWebmDuration } from '@fix-webm-duration/fix';
import { shiftTelemetry } from '../vision/pointerSync.js';

const VIDEO_MIMES = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
];
const AUDIO_MIMES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];

function pickMime(list) {
    if (typeof MediaRecorder === 'undefined') return '';
    return list.find(m => MediaRecorder.isTypeSupported(m)) || '';
}

/** What this browser can do. */
export function webSupport() {
    const w = typeof window !== 'undefined' ? window : {};
    const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : null;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return {
        displayCapture: Boolean(md && md.getDisplayMedia),
        mediaRecorder: typeof MediaRecorder !== 'undefined',
        trackProcessor: typeof w.MediaStreamTrackProcessor !== 'undefined',
        webCodecs: typeof w.VideoEncoder !== 'undefined' && typeof w.VideoDecoder !== 'undefined',
        offscreen: typeof w.OffscreenCanvas !== 'undefined',
        captureController: typeof w.CaptureController !== 'undefined',
        documentPiP: Boolean(w.documentPictureInPicture),
        mobile: /Android|iPhone|iPad|iPod/i.test(ua),
        chromium: /Chrome\//.test(ua) || /Edg\//.test(ua),
        firefox: /Firefox\//.test(ua),
        safari: /Safari\//.test(ua) && !/Chrome\//.test(ua),
    };
}

class TrackRecorder {
    constructor(stream, mimeType, bitsPerSecond) {
        this.chunks = [];
        this.mime = mimeType;
        const opts = mimeType ? { mimeType } : {};
        if (bitsPerSecond) {
            if (stream.getVideoTracks().length) opts.videoBitsPerSecond = bitsPerSecond;
            else opts.audioBitsPerSecond = bitsPerSecond;
        }
        this.rec = new MediaRecorder(stream, opts);
        this.rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) this.chunks.push(e.data); };
        this.stopped = new Promise((resolve) => { this.rec.onstop = resolve; });
        this.started = new Promise((resolve) => { this.rec.onstart = resolve; });
    }
    start() { this.rec.start(1000); }
    async stop(durationMs) {
        if (this.rec.state !== 'inactive') {
            try { this.rec.requestData(); } catch {}
            this.rec.stop();
        }
        await Promise.race([this.stopped, new Promise(r => setTimeout(r, 4000))]);
        if (!this.chunks.length) return null;
        const type = (this.mime || this.rec.mimeType || 'video/webm').split(';')[0];
        let blob = new Blob(this.chunks, { type });
        // MediaRecorder WebM has no duration or cues; without them seeking is
        // unreliable (the studio's timeline and export depend on it).
        if (type.includes('webm')) {
            try {
                const fixed = await fixWebmDuration(blob, durationMs);
                if (fixed && fixed.size > 0) blob = fixed;
            } catch {}
        }
        return blob;
    }
}

/** Browsers label tracks like 'screen:0:0' or 'web-contents-media-stream://…'. */
function prettyLabel(label, surface) {
    if (!label || /^screen:|^window:|^web-contents|:\/\//.test(label)) {
        return surface === 'monitor' ? 'Entire screen' : surface === 'window' ? 'Window' : surface === 'browser' ? 'Browser tab' : 'Shared screen';
    }
    return label;
}

export class WebRecorder {
    constructor() {
        this.screenStream = null;
        this.micStream = null;
        this.webcamStream = null;
        this.controller = null;
        this.surface = null;     // 'monitor' | 'window' | 'browser'
        this.worker = null;
        this.recorders = {};
        this.startAbs = null;
        this.recording = false;
        this.onEnded = null;     // the user stopped sharing from the browser UI
        this.onWarning = null;
        this._fallbackLoop = null;
    }

    get settings() {
        return this.screenStream?.getVideoTracks()[0]?.getSettings?.() || {};
    }

    /** Ask the browser to share a screen, window or tab. */
    async pickSource({ audio = true, preferSurface = 'monitor' } = {}) {
        this.releaseScreen();
        const controller = typeof CaptureController !== 'undefined' ? new CaptureController() : null;
        const video = {
            frameRate: { ideal: 60, max: 60 },
            width: { max: 3840 },
            height: { max: 2160 },
            // The pointer stays in the picture: it's how Drift knows where it is.
            cursor: 'always',
            displaySurface: preferSurface,
        };
        const base = {
            video,
            ...(controller ? { controller } : {}),
            selfBrowserSurface: 'exclude',
            surfaceSwitching: 'include',
            monitorTypeSurfaces: 'include',
        };
        let stream;
        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                ...base,
                audio: audio ? { echoCancellation: false, noiseSuppression: false, autoGainControl: false, suppressLocalAudioPlayback: false } : false,
                systemAudio: audio ? 'include' : 'exclude',
            });
        } catch (e) {
            if (e?.name === 'NotAllowedError' || e?.name === 'AbortError') throw e;
            // Older browsers reject the newer options; ask plainly.
            stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio });
        }
        // Keep Drift in front while setting up (must happen right away).
        try { controller?.setFocusBehavior?.('no-focus-change'); } catch {}
        this.controller = controller;
        this.screenStream = stream;
        const track = stream.getVideoTracks()[0];
        this.surface = track?.getSettings?.().displaySurface || null;
        track.addEventListener('ended', () => {
            if (this.onEnded) this.onEnded();
        });
        return this.describe();
    }

    describe() {
        const s = this.settings;
        const track = this.screenStream?.getVideoTracks()[0];
        return {
            surface: this.surface,
            label: prettyLabel(track?.label || '', this.surface),
            width: s.width || 0,
            height: s.height || 0,
            hasAudio: Boolean(this.screenStream?.getAudioTracks().length),
            // Tabs are captured without the pointer, so there's nothing to track.
            pointerVisible: this.surface !== 'browser',
        };
    }

    setMicStream(stream) { this.micStream = stream; }
    setWebcamStream(stream) { this.webcamStream = stream; }

    _startWorker() {
        const track = this.screenStream.getVideoTracks()[0];
        const s = track.getSettings();
        let worker;
        try {
            worker = new Worker(new URL('./analysis.worker.js', import.meta.url), { type: 'module' });
        } catch (e) {
            this.onWarning?.(`Pointer tracking unavailable (${e?.message || e})`);
            return null;
        }
        worker.onerror = (e) => this.onWarning?.(`Pointer tracking error: ${e.message || e}`);
        this._acked = true;
        worker.onmessage = (e) => {
            if (e.data?.type === 'ack') this._acked = true;
            else if (e.data?.type === 'warn') console.warn('[Drift web] analysis:', e.data.message);
        };
        let streamed = false;
        if (typeof MediaStreamTrackProcessor !== 'undefined') {
            try {
                // A clone, so the analysis can't hold up the recording; stopped with the take.
                this._analysisTrack = track.clone();
                const processor = new MediaStreamTrackProcessor({ track: this._analysisTrack, maxBufferSize: 2 });
                worker.postMessage({ type: 'stream', readable: processor.readable, width: s.width, height: s.height }, [processor.readable]);
                streamed = true;
            } catch (e) {
                console.warn('[Drift web] Track processor unavailable, using frame callbacks:', e);
            }
        }
        if (!streamed) this._startFallbackFrames(worker);
        return worker;
    }

    /** Frames via a <video> and ImageBitmaps for browsers without track processors. */
    _startFallbackFrames(worker) {
        const v = document.createElement('video');
        v.muted = true;
        v.playsInline = true;
        v.srcObject = new MediaStream([this.screenStream.getVideoTracks()[0]]);
        v.play().catch(() => {});
        let alive = true;
        const tick = async () => {
            if (!alive) return;
            if (this.recording && this._acked && v.videoWidth) {
                this._acked = false;
                const t = performance.timeOrigin + performance.now() - this.startAbs;
                try {
                    const k = v.videoWidth > 2200 ? 0.5 : 1;
                    const bitmap = await createImageBitmap(v, { resizeWidth: Math.round(v.videoWidth * k), resizeHeight: Math.round(v.videoHeight * k) });
                    worker.postMessage({ type: 'bitmap', bitmap, t, width: v.videoWidth, height: v.videoHeight }, [bitmap]);
                } catch {
                    this._acked = true;
                }
            }
            if (typeof v.requestVideoFrameCallback === 'function') v.requestVideoFrameCallback(tick);
            else setTimeout(tick, 33);
        };
        tick();
        this._fallbackLoop = () => { alive = false; v.srcObject = null; };
    }

    /** Start recording everything that's enabled. */
    async start() {
        if (!this.screenStream?.active) throw new Error('Choose what to record first');
        const vMime = pickMime(VIDEO_MIMES);
        const aMime = pickMime(AUDIO_MIMES);
        const s = this.settings;
        const pixels = (s.width || 1920) * (s.height || 1080);
        const vbps = Math.round(Math.min(40_000_000, Math.max(8_000_000, pixels * 12)));

        this.recorders = {};
        this.recorders.screen = new TrackRecorder(new MediaStream(this.screenStream.getVideoTracks()), vMime, vbps);
        const sys = this.screenStream.getAudioTracks()[0];
        if (sys) this.recorders.system = new TrackRecorder(new MediaStream([sys]), aMime, 192_000);
        const mic = this.micStream?.getAudioTracks()[0];
        if (mic) this.recorders.mic = new TrackRecorder(new MediaStream([mic]), aMime, 160_000);
        if (this.webcamStream?.getVideoTracks()[0]) {
            this.recorders.webcam = new TrackRecorder(new MediaStream(this.webcamStream.getVideoTracks()), vMime, 6_000_000);
        }

        this.worker = this.describe().pointerVisible ? this._startWorker() : null;

        const list = Object.values(this.recorders);
        // The recorders take the next frame after start(); time from here.
        // (Any remaining offset is measured on the file after stopping.)
        this.startAbs = performance.timeOrigin + performance.now();
        this.worker?.postMessage({ type: 'record', at: this.startAbs });
        for (const r of list) r.start();
        await this.recorders.screen.started;
        this.recording = true;
        return this.startAbs;
    }

    elapsedMs() {
        return this.recording ? performance.timeOrigin + performance.now() - this.startAbs : 0;
    }

    /** Stop and collect the recording: media blobs plus recovered telemetry. */
    async stop() {
        const durationMs = Math.max(100, this.elapsedMs());
        this.recording = false;
        const telemetryPromise = this.worker
            ? new Promise((resolve) => {
                const done = (telemetry) => { clearTimeout(timer); resolve(telemetry); };
                const timer = setTimeout(() => done(null), 8000);
                this.worker.addEventListener('message', (e) => { if (e.data?.type === 'result') done(e.data.telemetry); });
                this.worker.postMessage({ type: 'stop' });
            })
            : Promise.resolve(null);

        const entries = Object.entries(this.recorders);
        const blobs = await Promise.all(entries.map(([, r]) => r.stop(durationMs)));
        const out = Object.fromEntries(entries.map(([k], i) => [k, blobs[i]]));
        let telemetry = await telemetryPromise;
        // Line the telemetry up with the file's own timeline.
        if (telemetry?.pointer?.raw?.length && out.screen && this.worker) {
            const result = await new Promise((resolve) => {
                const timer = setTimeout(() => resolve(null), 8000);
                this.worker.addEventListener('message', (e) => {
                    if (e.data?.type === 'synced') { clearTimeout(timer); resolve(e.data.result); }
                });
                this.worker.postMessage({ type: 'sync', blob: out.screen, pointer: telemetry.pointer });
            });
            if (result && Math.abs(result.offset) <= 400) telemetry = shiftTelemetry(telemetry, result.offset);
            if (telemetry) telemetry.stats = { ...telemetry.stats, sync: result };
        }
        this._fallbackLoop?.();
        this._fallbackLoop = null;
        this._stopAnalysisTrack();
        try { this.worker?.postMessage({ type: 'close' }); } catch {}
        this.worker = null;
        this.recorders = {};
        return {
            screen: out.screen || null,
            systemAudio: out.system || null,
            micAudio: out.mic || null,
            webcam: out.webcam || null,
            durationMs,
            telemetry,
            source: this.describe(),
        };
    }

    /** A still of the shared surface (for the area picker). */
    async snapshot() {
        const track = this.screenStream?.getVideoTracks()[0];
        if (!track) return null;
        const v = document.createElement('video');
        v.muted = true;
        v.playsInline = true;
        v.srcObject = new MediaStream([track]);
        await v.play().catch(() => {});
        await new Promise((r) => (v.videoWidth ? r() : (v.onloadeddata = r)));
        await new Promise((r) => setTimeout(r, 80));
        const c = document.createElement('canvas');
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        c.getContext('2d').drawImage(v, 0, 0);
        v.srcObject = null;
        const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
        return { url: URL.createObjectURL(blob), width: c.width, height: c.height };
    }

    _stopAnalysisTrack() {
        try { this._analysisTrack?.stop(); } catch {}
        this._analysisTrack = null;
    }

    releaseScreen() {
        this._stopAnalysisTrack();
        this.screenStream?.getTracks().forEach(t => t.stop());
        this.screenStream = null;
        this.surface = null;
    }

    dispose() {
        this.recording = false;
        for (const r of Object.values(this.recorders)) {
            try { if (r.rec.state !== 'inactive') r.rec.stop(); } catch {}
        }
        this.recorders = {};
        this._fallbackLoop?.();
        try { this.worker?.terminate(); } catch {}
        this.worker = null;
        this.releaseScreen();
    }
}

/**
 * Telemetry recorded on the whole capture, moved into a recorded area's
 * coordinates (the video keeps the full frame; the studio shows the area).
 */
export function telemetryToArea(t, area) {
    if (!t || !area) return t;
    const map = (list) => (list || []).map(p => {
        const u = (p.x - area.x) / area.w;
        const v = (p.y - area.y) / area.h;
        const out = u < -0.005 || u > 1.005 || v < -0.005 || v > 1.005;
        return {
            ...p,
            x: Math.max(0, Math.min(1, u)),
            y: Math.max(0, Math.min(1, v)),
            ...(p.h != null ? { h: p.h / area.h } : {}),
            ...(out || p.hidden ? { hidden: true } : {}),
        };
    });
    return { ...t, moves: map(t.moves), clicks: map(t.clicks), caret: map(t.caret) };
}
