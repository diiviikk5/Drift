/**
 * Sequential frame source for export.
 *
 * Seeking an HTMLVideoElement for every output frame re-decodes from the
 * previous keyframe each time — painfully slow on long-GOP H.264 and prone to
 * stale frames. Instead we demux the file and decode it in order with
 * WebCodecs (via mediabunny), asking for the frame at each export timestamp.
 * Every packet is decoded at most once.
 */

/**
 * @param {Blob|string} src recording blob or URL (blob:, asset:, http:)
 * @param {Iterable<number>} timestamps monotonically increasing, in seconds
 * @returns {Promise<{width:number, height:number, next:() => Promise<(() => (VideoFrame|OffscreenCanvas|null))>, dispose: () => void}>}
 *   `next()` advances to the next timestamp and resolves to a getter. Call the
 *   getter synchronously right before drawing: the VideoFrame it returns is
 *   closed automatically on the next microtask.
 */
export async function openSequentialFrames(src, timestamps) {
    if (!src) throw new Error('no source');
    const { Input, BlobSource, UrlSource, ALL_FORMATS, VideoSampleSink } = await import('mediabunny');
    const source = typeof src === 'string' ? new UrlSource(src) : new BlobSource(src);
    const input = new Input({ source, formats: ALL_FORMATS });
    const track = await input.getPrimaryVideoTrack();
    if (!track) throw new Error('no video track');
    if (typeof track.canDecode === 'function' && !(await track.canDecode())) {
        throw new Error(`cannot decode ${track.codec || 'video'} with WebCodecs`);
    }

    const sink = new VideoSampleSink(track);
    const iterator = sink.samplesAtTimestamps(timestamps);
    let last = null;

    return {
        width: track.displayWidth,
        height: track.displayHeight,
        async next() {
            const { value, done } = await iterator.next();
            // A null sample means "no newer frame": keep showing the previous one.
            if (!done && value) {
                if (last && last !== value) last.close();
                last = value;
            }
            const sample = last;
            return () => (sample && !sample._closed ? sample.toCanvasImageSource() : null);
        },
        dispose() {
            try { last?.close(); } catch {}
            try { iterator.return?.(); } catch {}
            try { input.dispose?.(); } catch {}
        },
    };
}
