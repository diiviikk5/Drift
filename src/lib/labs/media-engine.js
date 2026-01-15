'use client';

/**
 * DRIFT LABS - Ultimate High Performance Media Engine
 * 
 * Priority order for maximum speed:
 * 1. Canvas API for images (instant, native)
 * 2. WebCodecs API for video (hardware GPU encoding)
 * 3. FFmpeg stream copy for containers (instant, no re-encoding)
 * 4. FFmpeg WASM ultrafast (fallback)
 */

// ============================================
// FEATURE DETECTION
// ============================================

export function supportsWebCodecs() {
    return typeof VideoEncoder !== 'undefined' && typeof VideoDecoder !== 'undefined';
}

export function supportsOffscreenCanvas() {
    return typeof OffscreenCanvas !== 'undefined';
}

// ============================================
// IMAGE CONVERSIONS (Canvas API - INSTANT)
// ============================================

/**
 * Convert image using Canvas API - instant, no external libraries
 */
export async function convertImageWithCanvas(file, outputFormat, quality = 0.92) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext('2d');

            // Fill with white for JPG (no transparency support)
            if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas conversion failed'));
                    }
                },
                `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}`,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

// ============================================
// VIDEO CONVERSIONS (WebCodecs + FFmpeg hybrid)
// ============================================

/**
 * Smart video conversion with automatic method selection
 */
export async function convertVideoSmart(file, outputExt, ffmpegArgs, onProgress) {
    const inputExt = file.name.split('.').pop().toLowerCase();

    // 1. Container-only conversions (INSTANT - no re-encoding)
    const containerCopyConversions = {
        'mkv-mp4': true,
        'mp4-mkv': true,
        'm4v-mp4': true,
        'mov-mp4': true, // MOV often has H.264 which MP4 supports
    };

    if (containerCopyConversions[`${inputExt}-${outputExt}`]) {
        console.log('[Engine] Using stream copy (instant)');
        const { convertFileWithFFmpeg } = await import('./ffmpeg.js');
        return convertFileWithFFmpeg(file, outputExt, ['-c', 'copy', '-movflags', '+faststart'], onProgress);
    }

    // 2. Try WebCodecs for hardware-accelerated encoding
    if (supportsWebCodecs() && outputExt === 'mp4') {
        try {
            console.log('[Engine] Attempting WebCodecs hardware encoding');
            const { convertVideoWithWebCodecs } = await import('./webcodecs-engine.js');
            return await convertVideoWithWebCodecs(file, onProgress);
        } catch (e) {
            console.warn('[Engine] WebCodecs failed:', e.message, '- falling back to FFmpeg');
        }
    }

    // 3. Fall back to FFmpeg WASM with ultrafast settings
    console.log('[Engine] Using FFmpeg WASM (ultrafast preset)');
    const { convertFileWithFFmpeg } = await import('./ffmpeg.js');
    return convertFileWithFFmpeg(file, outputExt, ffmpegArgs, onProgress);
}

// ============================================
// SPECIAL TOOLS
// ============================================

/**
 * Extract audio - this is fast since we're just demuxing
 */
export async function extractAudioFast(file, onProgress) {
    const { extractAudio } = await import('./ffmpeg.js');
    return extractAudio(file, onProgress);
}

/**
 * Compress video with quality setting
 */
export async function compressVideoSmart(file, quality, onProgress) {
    // Try WebCodecs first for much faster compression
    if (supportsWebCodecs()) {
        try {
            const { convertVideoWithWebCodecs } = await import('./webcodecs-engine.js');
            return await convertVideoWithWebCodecs(file, onProgress);
        } catch (e) {
            console.warn('[Engine] WebCodecs compression failed:', e.message);
        }
    }

    const { compressVideo } = await import('./ffmpeg.js');
    return compressVideo(file, quality, onProgress);
}

/**
 * Trim video - uses stream copy for instant trimming
 */
export async function trimVideoFast(file, startTime, endTime, onProgress) {
    const { trimVideo } = await import('./ffmpeg.js');
    return trimVideo(file, startTime, endTime, onProgress);
}

// ============================================
// MAIN CONVERSION DISPATCHER
// ============================================

/**
 * Intelligent conversion - automatically picks the fastest method
 */
export async function convertMedia(file, config, onProgress) {
    const inputExt = file.name.split('.').pop().toLowerCase();
    const outputExt = config.to?.ext || config.output?.ext;
    const category = config.category;

    // IMAGE CONVERSIONS - Canvas API (instant)
    if (category === 'image') {
        try {
            return await convertImageWithCanvas(file, outputExt, 0.92);
        } catch (e) {
            console.warn('[Engine] Canvas failed, trying FFmpeg');
            const { convertFileWithFFmpeg } = await import('./ffmpeg.js');
            return convertFileWithFFmpeg(file, outputExt, config.ffmpegArgs || [], onProgress);
        }
    }

    // AUDIO CONVERSIONS - FFmpeg (fast for audio)
    if (category === 'audio') {
        const { convertFileWithFFmpeg } = await import('./ffmpeg.js');
        return convertFileWithFFmpeg(file, outputExt, config.ffmpegArgs, onProgress);
    }

    // VIDEO CONVERSIONS - Smart routing
    if (category === 'video') {
        return convertVideoSmart(file, outputExt, config.ffmpegArgs, onProgress);
    }

    // SPECIAL TOOLS
    if (category === 'tool') {
        switch (config.type) {
            case 'extract':
                return extractAudioFast(file, onProgress);
            case 'compress':
                return compressVideoSmart(file, 'medium', onProgress);
            case 'trim':
                return trimVideoFast(file, 0, 30, onProgress);
            default:
                const { convertFileWithFFmpeg } = await import('./ffmpeg.js');
                return convertFileWithFFmpeg(file, outputExt, config.ffmpegArgs, onProgress);
        }
    }

    throw new Error('Unknown conversion type');
}

// ============================================
// SPEED ESTIMATION
// ============================================

export function getConversionSpeedTier(inputExt, outputExt, category) {
    if (category === 'image') return 'instant';

    const containerCopy = ['mkv-mp4', 'mp4-mkv', 'mov-mp4', 'm4v-mp4'];
    if (containerCopy.includes(`${inputExt}-${outputExt}`)) return 'instant';

    if (category === 'audio') return 'fast';

    // Check if WebCodecs will be used (hardware accelerated)
    if (supportsWebCodecs() && outputExt === 'mp4') return 'fast';

    return 'medium'; // FFmpeg WASM
}

export function estimateConversionTime(fileSize, inputExt, outputExt, category) {
    const tier = getConversionSpeedTier(inputExt, outputExt, category);
    const mbSize = fileSize / (1024 * 1024);

    switch (tier) {
        case 'instant':
            return Math.max(0.5, mbSize * 0.05);
        case 'fast':
            return Math.max(2, mbSize * 0.5); // WebCodecs ~2x realtime
        case 'medium':
            return Math.max(10, mbSize * 3); // FFmpeg WASM
        default:
            return mbSize * 5;
    }
}
