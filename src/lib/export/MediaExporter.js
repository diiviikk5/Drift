/**
 * Consolidated Media Exporter for Drift
 * Replaces both ExportEngine.js and ffmpegExport.js
 *
 * Export pipeline priority:
 * 1. WebCodecs + mp4-muxer (hardware-accelerated H.264 → MP4, preferred)
 * 2. FFmpeg WASM (fallback for unsupported browsers / GIF export)
 * 3. Raw WebM (MediaRecorder output, always works)
 */

// ============================================================
// QUALITY PRESETS
// ============================================================

export const QUALITY_PRESETS = {
    '4k': { width: 3840, height: 2160, bitrate: 20_000_000, label: '4K', fps: 60 },
    '1080p': { width: 1920, height: 1080, bitrate: 8_000_000, label: '1080p', fps: 60 },
    '720p': { width: 1280, height: 720, bitrate: 4_000_000, label: '720p', fps: 30 },
    'high': { bitrate: 12_000_000, label: 'High Quality', fps: 60 },
    'medium': { bitrate: 6_000_000, label: 'Medium', fps: 30 },
    'low': { bitrate: 2_000_000, label: 'Low / Small File', fps: 30 },
};

export const EXPORT_FORMATS = {
    mp4: { mime: 'video/mp4', ext: 'mp4', label: 'MP4 (H.264)' },
    webm: { mime: 'video/webm', ext: 'webm', label: 'WebM (VP9)' },
    gif: { mime: 'image/gif', ext: 'gif', label: 'GIF' },
};

// ============================================================
// WEBCODECS MP4 EXPORTER (Primary)
// ============================================================

async function exportWithWebCodecs(canvasStream, options = {}) {
    const {
        width = 1920,
        height = 1080,
        bitrate = 8_000_000,
        fps = 60,
        duration,
        onProgress,
    } = options;

    // Check WebCodecs support
    if (typeof VideoEncoder === 'undefined') {
        throw new Error('WebCodecs not supported');
    }

    const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');

    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
        target,
        video: {
            codec: 'avc',
            width,
            height,
        },
        audio: options.audioTrack ? {
            codec: 'aac',
            numberOfChannels: 2,
            sampleRate: 48000,
        } : undefined,
        fastStart: 'in-memory',
    });

    // Try H.264 profiles from most to least compatible
    const profiles = ['avc1.42001f', 'avc1.4d001f', 'avc1.640028'];
    let encoderConfig = null;

    for (const codec of profiles) {
        try {
            const support = await VideoEncoder.isConfigSupported({
                codec,
                width,
                height,
                bitrate,
                framerate: fps,
                hardwareAcceleration: 'prefer-hardware',
            });
            if (support.supported) {
                encoderConfig = support.config;
                break;
            }
        } catch {
            continue;
        }
    }

    if (!encoderConfig) {
        throw new Error('No supported H.264 profile found');
    }

    return new Promise((resolve, reject) => {
        let frameCount = 0;
        const frameDuration = 1_000_000 / fps; // microseconds

        const encoder = new VideoEncoder({
            output: (chunk, meta) => {
                muxer.addVideoChunk(chunk, meta);
            },
            error: (e) => reject(e),
        });

        encoder.configure({
            ...encoderConfig,
            hardwareAcceleration: 'prefer-hardware',
        });

        const videoTrack = canvasStream.getVideoTracks()[0];
        const reader = new MediaStreamTrackProcessor({ track: videoTrack }).readable.getReader();

        async function processFrames() {
            try {
                while (true) {
                    const { done, value: frame } = await reader.read();
                    if (done) break;

                    const timestamp = frameCount * frameDuration;

                    encoder.encode(frame, {
                        keyFrame: frameCount % (fps * 2) === 0, // Keyframe every 2 seconds
                    });

                    frame.close();
                    frameCount++;

                    if (onProgress && duration) {
                        const progress = Math.min((frameCount / fps) / (duration / 1000), 1);
                        onProgress(progress);
                    }
                }

                await encoder.flush();
                muxer.finalize();

                const blob = new Blob([target.buffer], { type: 'video/mp4' });
                resolve(blob);
            } catch (e) {
                reject(e);
            }
        }

        processFrames();
    });
}

// ============================================================
// FFMPEG WASM EXPORTER (Fallback)
// ============================================================

let ffmpegInstance = null;
let ffmpegLoaded = false;

async function loadFFmpeg(onProgress) {
    if (ffmpegLoaded) return ffmpegInstance;

    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');

    ffmpegInstance = new FFmpeg();
    ffmpegInstance._fetchFile = fetchFile;

    ffmpegInstance.on('progress', ({ progress }) => {
        if (onProgress) onProgress(progress);
    });

    // Use UMD build for broader compatibility
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegLoaded = true;
    return ffmpegInstance;
}

export async function exportWithFFmpeg(inputBlob, options = {}) {
    const {
        format = 'mp4',
        quality = 'high',
        onProgress,
    } = options;

    const ffmpeg = await loadFFmpeg(onProgress);
    const fetchFile = ffmpegInstance._fetchFile;

    const inputName = 'input.webm';
    const outputName = `output.${format}`;

    await ffmpeg.writeFile(inputName, await fetchFile(inputBlob));

    let command;

    if (format === 'mp4') {
        const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.high;
        command = [
            '-i', inputName,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-b:v', `${Math.round(preset.bitrate / 1_000_000)}M`,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            '-y', outputName,
        ];
    } else if (format === 'gif') {
        command = [
            '-i', inputName,
            '-vf', 'fps=15,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
            '-loop', '0',
            '-y', outputName,
        ];
    } else {
        // WebM passthrough / re-encode
        command = ['-i', inputName, '-c', 'copy', '-y', outputName];
    }

    await ffmpeg.exec(command);

    const data = await ffmpeg.readFile(outputName);
    const mimeType = EXPORT_FORMATS[format]?.mime || 'video/webm';

    // Cleanup
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});

    return new Blob([data.buffer], { type: mimeType });
}

// ============================================================
// TAURI SYSTEM FFMPEG EXPORTER (Desktop — fast, native)
// ============================================================

async function exportWithTauriFfmpeg(webmBlob, options = {}) {
    const { quality = '1080p', onProgress } = options;

    const { invoke } = await import('@tauri-apps/api/core');

    if (onProgress) onProgress(0.05);

    // Convert blob to Uint8Array for IPC
    const arrayBuffer = await webmBlob.arrayBuffer();
    const webmData = Array.from(new Uint8Array(arrayBuffer));

    if (onProgress) onProgress(0.1);

    console.log('[MediaExporter] Sending', (webmData.length / 1024 / 1024).toFixed(1), 'MB to Rust ffmpeg');

    // Ask user where to save via Tauri dialog
    let outputPath = '';
    try {
        const { save } = await import('@tauri-apps/plugin-dialog');
        const chosen = await save({
            defaultPath: `drift-recording-${Date.now()}.mp4`,
            filters: [{ name: 'MP4 Video', extensions: ['mp4'] }],
        });
        if (chosen) {
            outputPath = chosen;
        }
    } catch (e) {
        console.log('[MediaExporter] Dialog not available, using default path');
    }

    if (onProgress) onProgress(0.15);

    const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS['1080p'];

    // Call Rust — system ffmpeg converts WebM→MP4
    const resultPath = await invoke('convert_webm_to_mp4', {
        webmData,
        config: {
            crf: 18,
            preset: 'medium',
            fps: preset.fps || 60,
            use_hw_accel: true,
            output_path: outputPath,
        },
    });

    console.log('[MediaExporter] MP4 saved to:', resultPath);

    if (onProgress) onProgress(0.95);

    // Read the MP4 back as a blob for the download UI
    try {
        const { readFile } = await import('@tauri-apps/plugin-fs');
        const mp4Bytes = await readFile(resultPath);
        if (onProgress) onProgress(1.0);
        return new Blob([mp4Bytes], { type: 'video/mp4' });
    } catch {
        // If fs plugin not available, just return a marker blob
        // The file is already saved to disk
        if (onProgress) onProgress(1.0);
        console.log('[MediaExporter] MP4 saved to disk at:', resultPath);
        return new Blob([], { type: 'video/mp4' });
    }
}

// ============================================================
// MAIN EXPORTER CLASS
// ============================================================

export class MediaExporter {
    constructor() {
        this.isExporting = false;
        this.progress = 0;
    }

    /**
     * Export video with the best available method
     *
     * @param {Blob|MediaStream} input - WebM blob or canvas MediaStream
     * @param {Object} options
     * @param {string} options.format - 'mp4', 'webm', or 'gif'
     * @param {string} options.quality - Quality preset key
     * @param {Function} options.onProgress - Progress callback (0-1)
     * @param {number} options.duration - Duration in ms (for progress calculation)
     * @param {MediaStreamTrack} options.audioTrack - Optional audio track
     * @returns {Promise<Blob>}
     */
    async export(input, options = {}) {
        const {
            format = 'mp4',
            quality = '1080p',
            onProgress,
            duration,
            audioTrack,
        } = options;

        this.isExporting = true;
        this.progress = 0;

        const progressCallback = (p) => {
            this.progress = p;
            if (onProgress) onProgress(p);
        };

        try {
            // WebM direct passthrough
            if (format === 'webm' && input instanceof Blob) {
                progressCallback(1);
                return input;
            }

            // GIF always uses FFmpeg
            if (format === 'gif') {
                const blob = input instanceof Blob ? input : await this._streamToBlob(input);
                return await exportWithFFmpeg(blob, { format: 'gif', quality, onProgress: progressCallback });
            }

            // MP4 export — try Tauri (system ffmpeg) → WebCodecs → FFmpeg WASM
            if (format === 'mp4') {
                // In Tauri desktop mode: use system ffmpeg via Rust (fast, reliable)
                if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
                    try {
                        const blob = input instanceof Blob ? input : await this._streamToBlob(input);
                        return await exportWithTauriFfmpeg(blob, { quality, onProgress: progressCallback });
                    } catch (e) {
                        console.warn('[MediaExporter] Tauri ffmpeg failed, trying other methods:', e.message);
                    }
                }

                // If input is a MediaStream, try WebCodecs (hardware-accelerated)
                if (input instanceof MediaStream) {
                    try {
                        const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS['1080p'];
                        const videoTrack = input.getVideoTracks()[0];
                        const settings = videoTrack?.getSettings() || {};

                        return await exportWithWebCodecs(input, {
                            width: preset.width || settings.width || 1920,
                            height: preset.height || settings.height || 1080,
                            bitrate: preset.bitrate,
                            fps: preset.fps,
                            duration,
                            audioTrack,
                            onProgress: progressCallback,
                        });
                    } catch (e) {
                        console.warn('[MediaExporter] WebCodecs failed, falling back to FFmpeg WASM:', e.message);
                    }
                }

                // Last resort: FFmpeg WASM
                const blob = input instanceof Blob ? input : await this._streamToBlob(input);
                return await exportWithFFmpeg(blob, { format: 'mp4', quality, onProgress: progressCallback });
            }

            throw new Error(`Unsupported format: ${format}`);
        } finally {
            this.isExporting = false;
        }
    }

    /**
     * Trim video using FFmpeg
     */
    async trim(inputBlob, startTime, endTime, options = {}) {
        const { format = 'mp4', onProgress } = options;

        const ffmpeg = await loadFFmpeg(onProgress);
        const fetchFile = ffmpegInstance._fetchFile;

        const inputName = 'trim_input.webm';
        const outputName = `trim_output.${format}`;

        await ffmpeg.writeFile(inputName, await fetchFile(inputBlob));

        await ffmpeg.exec([
            '-i', inputName,
            '-ss', String(startTime),
            '-t', String(endTime - startTime),
            '-c', 'copy',
            '-y', outputName,
        ]);

        const data = await ffmpeg.readFile(outputName);
        const mimeType = EXPORT_FORMATS[format]?.mime || 'video/webm';

        await ffmpeg.deleteFile(inputName).catch(() => {});
        await ffmpeg.deleteFile(outputName).catch(() => {});

        return new Blob([data.buffer], { type: mimeType });
    }

    /**
     * Convert a MediaStream to a Blob by recording it
     */
    async _streamToBlob(stream, durationMs) {
        return new Promise((resolve) => {
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 15_000_000,
            });
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };
            recorder.onstop = () => {
                resolve(new Blob(chunks, { type: 'video/webm' }));
            };

            recorder.start();

            if (durationMs) {
                setTimeout(() => recorder.stop(), durationMs);
            }
        });
    }

    /**
     * Estimate file size for a given duration and quality
     */
    estimateSize(durationSec, quality = '1080p') {
        const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS['1080p'];
        return (preset.bitrate * durationSec) / 8;
    }

    /**
     * Cleanup FFmpeg instance
     */
    destroy() {
        if (ffmpegInstance) {
            ffmpegInstance.terminate();
            ffmpegInstance = null;
            ffmpegLoaded = false;
        }
    }
}

// Singleton
let exporterInstance = null;

export function getMediaExporter() {
    if (!exporterInstance) {
        exporterInstance = new MediaExporter();
    }
    return exporterInstance;
}

export default MediaExporter;
