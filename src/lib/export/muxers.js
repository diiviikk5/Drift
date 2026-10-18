/**
 * Muxers for the frame-accurate WebCodecs export: H.264 + AAC into MP4
 * (mp4-muxer), or VP9/VP8 + Opus into WebM (mediabunny) for browsers that
 * can't encode H.264 (Chromium builds without proprietary codecs).
 * Both take encoder chunks as they come and return a Blob on finalize().
 */

export async function createMuxer({ container, width, height, fps, videoCodec, audio = null }) {
    if (container === 'mp4') {
        const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
        const target = new ArrayBufferTarget();
        const muxer = new Muxer({
            target,
            video: { codec: 'avc', width, height, frameRate: fps },
            ...(audio ? { audio: { codec: 'aac', numberOfChannels: audio.numberOfChannels, sampleRate: audio.sampleRate } } : {}),
            fastStart: 'in-memory',
            firstTimestampBehavior: 'offset',
        });
        return {
            addVideoChunk: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
            addAudioChunk: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
            async finalize() {
                muxer.finalize();
                return new Blob([target.buffer], { type: 'video/mp4' });
            },
        };
    }

    const { Output, WebMOutputFormat, BufferTarget, EncodedVideoPacketSource, EncodedAudioPacketSource, EncodedPacket } = await import('mediabunny');
    const output = new Output({ format: new WebMOutputFormat(), target: new BufferTarget() });
    const video = new EncodedVideoPacketSource(videoCodec.startsWith('vp09') ? 'vp9' : videoCodec.startsWith('av01') ? 'av1' : 'vp8');
    output.addVideoTrack(video, { frameRate: fps });
    const sound = audio ? new EncodedAudioPacketSource('opus') : null;
    if (sound) output.addAudioTrack(sound);
    await output.start();
    // Packets must be added in order; encoder callbacks are synchronous.
    let chain = Promise.resolve();
    let failure = null;
    const queue = (fn) => { chain = chain.then(fn).catch((e) => { failure = failure || e; }); };
    let firstVideoUs = null;
    let firstAudioUs = null;
    return {
        addVideoChunk(chunk, meta) {
            if (firstVideoUs == null) firstVideoUs = chunk.timestamp;
            const packet = EncodedPacket.fromEncodedChunk(chunk).clone({ timestamp: (chunk.timestamp - firstVideoUs) / 1e6 });
            queue(() => video.add(packet, meta));
        },
        addAudioChunk(chunk, meta) {
            if (!sound) return;
            if (firstAudioUs == null) firstAudioUs = chunk.timestamp;
            const packet = EncodedPacket.fromEncodedChunk(chunk).clone({ timestamp: (chunk.timestamp - firstAudioUs) / 1e6 });
            queue(() => sound.add(packet, meta));
        },
        async finalize() {
            await chain;
            if (failure) throw failure;
            await output.finalize();
            return new Blob([output.target.buffer], { type: 'video/webm' });
        },
    };
}

/** VP9 / VP8 encoder configs to try when H.264 isn't available. */
export const WEBM_VIDEO_CODECS = ['vp09.00.41.08', 'vp09.00.40.08', 'vp09.00.31.08', 'vp8'];
