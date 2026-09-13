/**
 * Drift Audio Mixing & Level Metering Module
 * Inspired by OpenScreen's audio architecture.
 *
 * Provides:
 * 1. mixAudioTracks: merges microphone and system audio streams with anti-pop fade-in
 *    and automatic voice gain boosting over system audio.
 * 2. createAudioLevelMeter: real-time audio volume analyzer for live visualizer meters.
 */

export const MIC_GAIN_BOOST = 1.4;
export const MIC_FADE_IN_S = 0.02;

/**
 * Mix system audio and microphone into a single unified MediaStreamTrack.
 *
 * @param {Object} input
 * @param {MediaStreamTrack|null} [input.systemAudioTrack]
 * @param {MediaStreamTrack|null} [input.micAudioTrack]
 * @param {typeof AudioContext} [input.AudioContextClass]
 * @returns {{ context: AudioContext|null, track: MediaStreamTrack|null }}
 */
export function mixAudioTracks({
    systemAudioTrack = null,
    micAudioTrack = null,
    AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null,
} = {}) {
    // If no mic is attached, pass system audio track directly without spinning up AudioContext
    if (!micAudioTrack) {
        return { context: null, track: systemAudioTrack ?? null };
    }

    if (!AudioContextClass) {
        return { context: null, track: micAudioTrack ?? systemAudioTrack ?? null };
    }

    const context = new AudioContextClass();
    if (context.state === 'suspended') {
        context.resume().catch(() => {});
    }
    const destination = context.createMediaStreamDestination();

    // 1. Connect system audio at unity gain (if present)
    if (systemAudioTrack) {
        try {
            const systemSource = context.createMediaStreamSource(new MediaStream([systemAudioTrack]));
            systemSource.connect(destination);
        } catch (err) {
            console.warn('[audioMix] Failed to route system audio track:', err);
        }
    }

    // 2. Route microphone through gain node with anti-pop ramp
    // Mic is boosted 1.4x when competing with system audio; unity (1.0x) when solo.
    const micTargetGain = systemAudioTrack ? MIC_GAIN_BOOST : 1.0;
    try {
        const micSource = context.createMediaStreamSource(new MediaStream([micAudioTrack]));
        const micGain = context.createGain();
        const now = context.currentTime || 0;

        micGain.gain.setValueAtTime(0, now);
        micGain.gain.linearRampToValueAtTime(micTargetGain, now + MIC_FADE_IN_S);

        micSource.connect(micGain);
        micGain.connect(destination);
    } catch (err) {
        console.warn('[audioMix] Failed to route mic audio track:', err);
    }

    const mixedTrack = destination.stream.getAudioTracks()[0] || null;
    return { context, track: mixedTrack };
}

/**
 * Connects an audio stream to an analyser node and calls `onLevel(0..1)` at 60fps.
 *
 * @param {MediaStream|null} stream
 * @param {(level: number) => void} onLevel
 * @param {typeof AudioContext} [AudioContextClass]
 * @returns {() => void} Teardown function to disconnect and close audio context.
 */
export function createAudioLevelMeter(
    stream,
    onLevel,
    AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null
) {
    if (!stream || !onLevel || !AudioContextClass) return () => {};
    const tracks = stream.getAudioTracks ? stream.getAudioTracks() : [];
    if (!tracks.length) return () => {};

    try {
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        const source = ctx.createMediaStreamSource(new MediaStream([tracks[0]]));
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        let animId = null;
        let active = true;

        const update = () => {
            if (!active) return;
            analyser.getByteFrequencyData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum += data[i];
            }
            const avg = sum / (data.length || 1);
            // Non-linear perception mapping: boost lower audible ranges
            const rawNormalized = Math.min(1, avg / 100);
            const level = Math.pow(rawNormalized, 0.7);
            onLevel(level);
            animId = requestAnimationFrame(update);
        };

        if (ctx.state === 'suspended') {
            ctx.resume().then(() => {
                if (active) animId = requestAnimationFrame(update);
            }).catch(() => {});
        } else {
            animId = requestAnimationFrame(update);
        }

        return () => {
            active = false;
            if (animId && typeof cancelAnimationFrame === 'function') {
                cancelAnimationFrame(animId);
            }
            try { source.disconnect(); } catch (e) {}
            try { analyser.disconnect(); } catch (e) {}
            try { ctx.close(); } catch (e) {}
        };
    } catch (err) {
        console.warn('[AudioLevelMeter] Failed to start:', err);
        return () => {};
    }
}
