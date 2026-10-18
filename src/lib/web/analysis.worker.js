/**
 * Live analysis worker: reads captured frames while recording and turns them
 * into session telemetry (see vision/ScreenAnalyzer.js). Runs off the main
 * thread so the recorder UI and MediaRecorder never wait on it; when frames
 * come faster than they can be analyzed, older ones are dropped.
 *
 * Frames arrive either as a ReadableStream of VideoFrames
 * (MediaStreamTrackProcessor, transferred from the page) or as ImageBitmaps
 * posted one at a time (browsers without it).
 */
import { ScreenAnalyzer } from '../vision/ScreenAnalyzer.js';
import { estimateOffset, syncProbeTimes } from '../vision/pointerSync.js';
import { lumaFromRGBA } from '../vision/ScreenAnalyzer.js';

let canvas = null;
let ctx = null;
let size = null;          // analysis { width, height }
let analyzer = null;
let recording = false;
let recStartAbs = null;   // wall clock (ms, timeOrigin-based) of the recorder start
let zeroTs = null;        // VideoFrame timestamp (us) of the recording's first frame
let reader = null;
let busyMs = 0;
let analyzed = 0;

const nowAbs = () => performance.timeOrigin + performance.now();

function setup(width, height) {
    // Large captures are analyzed at half size: the pointer is drawn bigger
    // there anyway (high-DPI scaling), and normalized results are unchanged.
    const k = width > 2200 ? 0.5 : 1;
    size = { width: Math.round(width * k), height: Math.round(height * k), sourceWidth: width, sourceHeight: height };
    canvas = new OffscreenCanvas(size.width, size.height);
    ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: false });
}

function analyze(image, t) {
    if (!analyzer) analyzer = new ScreenAnalyzer({ width: size.width, height: size.height });
    const t0 = performance.now();
    ctx.drawImage(image, 0, 0, size.width, size.height);
    const { data } = ctx.getImageData(0, 0, size.width, size.height);
    analyzer.push(data, t);
    busyMs += performance.now() - t0;
    analyzed++;
}

async function readStream(readable) {
    reader = readable.getReader();
    for (;;) {
        let res;
        try { res = await reader.read(); } catch { break; }
        if (res.done) break;
        const frame = res.value;
        try {
            if (recording) {
                if (zeroTs == null) {
                    // The first frame that reached us after the recorder started
                    // is the recording's first frame.
                    if (nowAbs() >= recStartAbs) zeroTs = frame.timestamp;
                }
                if (zeroTs != null) {
                    const w = frame.displayWidth, h = frame.displayHeight;
                    if (!size) setup(w, h);
                    analyze(frame, (frame.timestamp - zeroTs) / 1000);
                }
            }
        } catch (e) {
            self.postMessage({ type: 'warn', message: String(e?.message || e) });
        } finally {
            frame.close();
        }
    }
}

/**
 * Find the pointer again in a few frames of the recorded file and measure how
 * far the telemetry clock is from the video's (see vision/pointerSync.js).
 */
async function sync(blob, pointer) {
    if (!blob || !pointer?.raw?.length) return null;
    const times = syncProbeTimes(pointer.raw);
    if (times.length < 3) return null;
    const { Input, BlobSource, ALL_FORMATS, VideoSampleSink } = await import('mediabunny');
    const input = new Input({ source: new BlobSource(blob), formats: ALL_FORMATS });
    try {
        const track = await input.getPrimaryVideoTrack();
        if (!track || (typeof track.canDecode === 'function' && !(await track.canDecode()))) return null;
        const sink = new VideoSampleSink(track);
        const w = pointer.width, h = pointer.height;
        const c = new OffscreenCanvas(w, h);
        const g = c.getContext('2d', { willReadFrequently: true, alpha: false });
        const frames = [];
        let lastTs = null;
        for await (const sample of sink.samplesAtTimestamps(times.map(t => t / 1000))) {
            if (!sample) continue;
            try {
                const t = sample.timestamp * 1000;
                if (lastTs != null && Math.abs(t - lastTs) < 1) continue; // same frame twice
                lastTs = t;
                const frame = sample.toVideoFrame();
                g.drawImage(frame, 0, 0, w, h);
                frame.close();
                const luma = lumaFromRGBA(g.getImageData(0, 0, w, h).data, new Uint8Array(w * h));
                frames.push({ t, luma });
            } finally {
                sample.close();
            }
        }
        return estimateOffset(frames, pointer);
    } finally {
        input.dispose?.();
    }
}

/**
 * Analyze a finished video file (an imported screen recording): every frame
 * in order, at most ~30 per second, with the file's own timestamps.
 */
async function analyzeFile(blob) {
    const { Input, BlobSource, ALL_FORMATS, VideoSampleSink } = await import('mediabunny');
    const input = new Input({ source: new BlobSource(blob), formats: ALL_FORMATS });
    try {
        const track = await input.getPrimaryVideoTrack();
        if (!track) throw new Error('no video track');
        if (typeof track.canDecode === 'function' && !(await track.canDecode())) throw new Error(`can't decode ${track.codec || 'this video'}`);
        const duration = await input.computeDuration().catch(() => 0);
        setup(track.displayWidth, track.displayHeight);
        const local = new ScreenAnalyzer({ width: size.width, height: size.height });
        const sink = new VideoSampleSink(track);
        let last = -Infinity;
        let lastReport = 0;
        for await (const sample of sink.samples()) {
            try {
                const t = sample.timestamp * 1000;
                if (t - last < 30) continue;
                last = t;
                const frame = sample.toVideoFrame();
                ctx.drawImage(frame, 0, 0, size.width, size.height);
                frame.close();
                local.push(ctx.getImageData(0, 0, size.width, size.height).data, t);
                if (duration && t - lastReport > 500) {
                    lastReport = t;
                    self.postMessage({ type: 'progress', value: Math.min(1, t / 1000 / duration) });
                }
            } finally {
                sample.close();
            }
        }
        const out = local.finish();
        out.stats = { ...out.stats, analysisSize: size, source: 'file' };
        return out;
    } finally {
        input.dispose?.();
    }
}

self.onmessage = (e) => {
    const m = e.data || {};
    switch (m.type) {
        case 'stream':
            if (m.width && m.height) setup(m.width, m.height);
            readStream(m.readable);
            break;
        case 'record':
            recStartAbs = m.at;
            zeroTs = null;
            analyzer = null;
            recording = true;
            busyMs = 0;
            analyzed = 0;
            break;
        case 'bitmap': {
            // Fallback path: one frame at a time; ack so the page sends the next.
            try {
                if (recording && m.bitmap) {
                    if (!size) setup(m.width || m.bitmap.width, m.height || m.bitmap.height);
                    analyze(m.bitmap, m.t);
                }
            } catch (err) {
                self.postMessage({ type: 'warn', message: String(err?.message || err) });
            } finally {
                m.bitmap?.close?.();
                self.postMessage({ type: 'ack' });
            }
            break;
        }
        case 'stop': {
            recording = false;
            const out = analyzer ? analyzer.finish() : null;
            if (out) out.stats = { ...out.stats, analyzed, avgMs: analyzed ? busyMs / analyzed : 0, analysisSize: size };
            self.postMessage({ type: 'result', telemetry: out });
            analyzer = null;
            break;
        }
        case 'sync':
            sync(m.blob, m.pointer).then(
                (result) => self.postMessage({ type: 'synced', result }),
                (err) => self.postMessage({ type: 'synced', result: null, error: String(err?.message || err) }),
            );
            break;
        case 'analyze-file':
            analyzeFile(m.blob).then(
                (telemetry) => self.postMessage({ type: 'file-result', telemetry }),
                (err) => self.postMessage({ type: 'file-result', telemetry: null, error: String(err?.message || err) }),
            );
            break;
        case 'close':
            try { reader?.cancel(); } catch {}
            self.close();
            break;
    }
};
