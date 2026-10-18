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
        case 'close':
            try { reader?.cancel(); } catch {}
            self.close();
            break;
    }
};
