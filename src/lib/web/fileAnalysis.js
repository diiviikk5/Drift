/**
 * Analyze an existing screen recording (a video file opened in the studio)
 * the way a live web take is analyzed, so it gets the same automatic zooms,
 * smooth pointer and recorded-pointer removal.
 */
export function analyzeVideoFile(blob, onProgress) {
    return new Promise((resolve, reject) => {
        let worker;
        try {
            worker = new Worker(new URL('./analysis.worker.js', import.meta.url), { type: 'module' });
        } catch (e) {
            reject(e);
            return;
        }
        const done = (fn, v) => { try { worker.postMessage({ type: 'close' }); } catch {} fn(v); };
        worker.onerror = (e) => done(reject, new Error(e.message || 'analysis failed'));
        worker.onmessage = (e) => {
            const m = e.data || {};
            if (m.type === 'progress') onProgress?.(m.value);
            else if (m.type === 'file-result') {
                if (m.telemetry) done(resolve, m.telemetry);
                else done(reject, new Error(m.error || 'analysis failed'));
            }
        };
        worker.postMessage({ type: 'analyze-file', blob });
    });
}
