'use client';

/**
 * DRIFT LABS - WebCodecs Hardware-Accelerated Video Encoder
 * 
 * Uses WebCodecs API for hardware-accelerated video encoding.
 * Falls back to FFmpeg WASM if WebCodecs is not supported.
 */

import * as Mp4Muxer from 'mp4-muxer';

// ============================================
// FEATURE DETECTION
// ============================================

export function supportsWebCodecs() {
    return typeof VideoEncoder !== 'undefined' &&
        typeof VideoDecoder !== 'undefined' &&
        typeof AudioEncoder !== 'undefined' &&
        typeof AudioDecoder !== 'undefined';
}

export function supportsHardwareEncoding() {
    // Check if we're likely to have hardware encoding
    return supportsWebCodecs() &&
        typeof navigator !== 'undefined' &&
        navigator.hardwareConcurrency > 2;
}

// ============================================
// WEBCODECS VIDEO CONVERSION
// ============================================

/**
 * Convert video using WebCodecs API with hardware acceleration
 * This is MUCH faster than FFmpeg WASM
 */
export async function convertVideoWithWebCodecs(file, onProgress) {
    if (!supportsWebCodecs()) {
        throw new Error('WebCodecs not supported');
    }

    // Create video element to get metadata
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = () => reject(new Error('Failed to load video'));
        setTimeout(() => reject(new Error('Video load timeout')), 10000);
    });

    const { videoWidth, videoHeight, duration } = video;

    if (!videoWidth || !videoHeight) {
        URL.revokeObjectURL(videoUrl);
        throw new Error('Invalid video dimensions');
    }

    // Setup MP4 muxer
    const muxer = new Mp4Muxer.Muxer({
        target: new Mp4Muxer.ArrayBufferTarget(),
        video: {
            codec: 'avc',
            width: videoWidth,
            height: videoHeight,
        },
        fastStart: 'in-memory',
    });

    // Try multiple encoder configurations in order of preference
    const codecConfigs = [
        { codec: 'avc1.42E01E', profile: 'Baseline' },     // Baseline L3
        { codec: 'avc1.4D401E', profile: 'Main' },          // Main L3
        { codec: 'avc1.640028', profile: 'High' },          // High L4
    ];

    let encoderConfig = null;

    for (const { codec, profile } of codecConfigs) {
        const config = {
            codec,
            width: videoWidth,
            height: videoHeight,
            bitrate: 2_500_000,
            framerate: 30,
            hardwareAcceleration: 'prefer-hardware',
            latencyMode: 'realtime',
            avc: { format: 'avc' }, // Required for AVC codecs
        };

        try {
            const support = await VideoEncoder.isConfigSupported(config);
            if (support.supported) {
                console.log(`[WebCodecs] Using ${profile} profile (${codec})`);
                encoderConfig = config;
                break;
            }
        } catch (e) {
            // Continue to next config if an error occurs (e.g., invalid codec string)
            continue;
        }
    }

    if (!encoderConfig) {
        URL.revokeObjectURL(videoUrl);
        throw new Error('No supported video encoder configuration found');
    }

    let encodedFrames = 0;
    const totalFrames = Math.ceil(duration * 30);
    let encodingComplete = false;

    const encoder = new VideoEncoder({
        output: (chunk, meta) => {
            muxer.addVideoChunk(chunk, meta);
            encodedFrames++;
            if (onProgress) {
                onProgress(Math.round((encodedFrames / totalFrames) * 95));
            }
        },
        error: (e) => {
            console.error('VideoEncoder error:', e);
        },
    });

    encoder.configure(encoderConfig);

    // Create canvas for frame extraction
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Process video frames
    const frameInterval = 1000 / 30; // 30 fps in ms
    let currentTime = 0;
    let frameCount = 0;

    // Seek and capture approach (more reliable)
    while (currentTime < duration) {
        video.currentTime = currentTime;

        await new Promise((resolve) => {
            video.onseeked = resolve;
            setTimeout(resolve, 100); // Timeout fallback
        });

        ctx.drawImage(video, 0, 0);

        const frame = new VideoFrame(canvas, {
            timestamp: currentTime * 1_000_000, // microseconds
            duration: frameInterval * 1000, // microseconds
        });

        encoder.encode(frame, { keyFrame: frameCount % 60 === 0 });
        frame.close();

        currentTime += frameInterval / 1000;
        frameCount++;

        if (onProgress) {
            onProgress(Math.round((currentTime / duration) * 90));
        }
    }

    // Flush encoder
    await encoder.flush();
    encoder.close();

    // Finalize muxer
    muxer.finalize();

    // Cleanup
    URL.revokeObjectURL(videoUrl);

    if (onProgress) {
        onProgress(100);
    }

    // Get output
    const { buffer } = muxer.target;
    return new Blob([buffer], { type: 'video/mp4' });
}

/**
 * Check if we should use WebCodecs for this conversion
 */
export function shouldUseWebCodecs(inputExt, outputExt) {
    if (!supportsWebCodecs()) return false;

    // WebCodecs works for these input/output combinations
    const supported = {
        'webm': ['mp4'],
        'mp4': ['mp4', 'webm'],
        'mov': ['mp4'],
        'avi': ['mp4'],
    };

    return supported[inputExt]?.includes(outputExt) || false;
}

/**
 * Smart video conversion - tries WebCodecs first, falls back to FFmpeg
 */
export async function convertVideoSmart(file, outputExt, ffmpegArgs, onProgress) {
    const inputExt = file.name.split('.').pop().toLowerCase();

    // Container-only conversions are always fast with FFmpeg
    const containerOnly = ['mkv', 'm4v'];
    if (containerOnly.includes(inputExt) && outputExt === 'mp4') {
        const { convertFileWithFFmpeg } = await import('./ffmpeg.js');
        return convertFileWithFFmpeg(file, outputExt, ['-c', 'copy', '-movflags', '+faststart'], onProgress);
    }

    // Try WebCodecs for supported conversions (hardware accelerated!)
    if (shouldUseWebCodecs(inputExt, outputExt)) {
        try {
            console.log('[WebCodecs] Using hardware-accelerated encoding');
            return await convertVideoWithWebCodecs(file, onProgress);
        } catch (e) {
            console.warn('[WebCodecs] Failed, falling back to FFmpeg:', e.message);
        }
    }

    // Fall back to FFmpeg WASM
    const { convertFileWithFFmpeg } = await import('./ffmpeg.js');
    return convertFileWithFFmpeg(file, outputExt, ffmpegArgs, onProgress);
}

// ============================================
// AUDIO HANDLING (WebCodecs for extraction)
// ============================================

/**
 * Extract audio using WebCodecs (when available) or FFmpeg
 */
export async function extractAudioSmart(file, onProgress) {
    // For now, FFmpeg is more reliable for audio extraction
    const { extractAudio } = await import('./ffmpeg.js');
    return extractAudio(file, onProgress);
}
