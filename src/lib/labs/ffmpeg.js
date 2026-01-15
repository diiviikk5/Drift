'use client';

/**
 * DRIFT LABS - FFmpeg WASM Engine
 * Uses script-based loading to avoid Turbopack bundling issues
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// Global state for FFmpeg
let ffmpegLoadPromise = null;
let ffmpegInstance = null;

/**
 * Load FFmpeg via script tags (bypasses bundler issues)
 */
async function loadFFmpegScripts() {
    if (ffmpegInstance) return ffmpegInstance;
    if (ffmpegLoadPromise) return ffmpegLoadPromise;

    ffmpegLoadPromise = new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.FFmpeg) {
            resolve(window.FFmpeg);
            return;
        }

        // Create script element for FFmpeg
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js';
        script.async = true;

        script.onload = () => {
            // Load util as well
            const utilScript = document.createElement('script');
            utilScript.src = 'https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js';
            utilScript.async = true;

            utilScript.onload = () => {
                if (window.FFmpegWASM && window.FFmpegUtil) {
                    resolve({ FFmpeg: window.FFmpegWASM, FFmpegUtil: window.FFmpegUtil });
                } else {
                    reject(new Error('FFmpeg failed to initialize'));
                }
            };

            utilScript.onerror = () => reject(new Error('Failed to load FFmpeg util'));
            document.head.appendChild(utilScript);
        };

        script.onerror = () => reject(new Error('Failed to load FFmpeg'));
        document.head.appendChild(script);
    });

    return ffmpegLoadPromise;
}

/**
 * React hook for using FFmpeg
 */
export function useFFmpeg() {
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const ffmpegRef = useRef(null);

    const load = useCallback(async () => {
        if (ffmpegRef.current) return ffmpegRef.current;

        setIsLoading(true);
        setError(null);

        try {
            // Use the simpler createFFmpeg approach
            const { FFmpeg } = await import('@ffmpeg/ffmpeg');
            const { fetchFile } = await import('@ffmpeg/util');

            const ffmpeg = new FFmpeg();

            ffmpeg.on('log', ({ message }) => {
                console.log('[FFmpeg]', message);
            });

            ffmpeg.on('progress', ({ progress: p }) => {
                setProgress(Math.round(p * 100));
            });

            // Load with specific URLs
            await ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
                wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
            });

            ffmpegRef.current = { ffmpeg, fetchFile };
            setIsReady(true);
            setIsLoading(false);
            return ffmpegRef.current;
        } catch (err) {
            console.error('[FFmpeg] Load error:', err);
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    return { load, isLoading, isReady, progress, error, setProgress };
}

/**
 * Convert a file using FFmpeg - standalone function
 */
export async function convertFileWithFFmpeg(inputFile, outputExt, ffmpegArgs, onProgress) {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
    });

    if (onProgress) {
        ffmpeg.on('progress', ({ progress }) => {
            onProgress(Math.round(progress * 100));
        });
    }

    // Load FFmpeg with UMD build (more compatible)
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
    });

    const inputName = 'input' + getExtensionWithDot(inputFile.name);
    const outputName = 'output.' + outputExt;

    // Write input file
    await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

    // Run conversion
    await ffmpeg.exec(['-i', inputName, ...ffmpegArgs, outputName]);

    // Read output
    const data = await ffmpeg.readFile(outputName);

    // Cleanup
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    // Terminate
    await ffmpeg.terminate();

    return new Blob([data.buffer], { type: getMimeType(outputExt) });
}

// Helper functions
function getExtensionWithDot(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return '.' + ext;
}

function getMimeType(ext) {
    const types = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        mkv: 'video/x-matroska',
        avi: 'video/x-msvideo',
        mov: 'video/quicktime',
        gif: 'image/gif',
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        aac: 'audio/aac',
        flac: 'audio/flac',
        ogg: 'audio/ogg',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
    };
    return types[ext] || 'application/octet-stream';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration for display
 */
export function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Download blob as file
 */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export specific tool functions
export async function extractAudio(videoFile, onProgress) {
    return convertFileWithFFmpeg(videoFile, 'mp3', ['-vn', '-acodec', 'libmp3lame', '-b:a', '320k'], onProgress);
}

export async function compressVideo(videoFile, quality = 'medium', onProgress) {
    const settings = {
        low: ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '35', '-c:a', 'aac', '-b:a', '64k'],
        medium: ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '30', '-c:a', 'aac', '-b:a', '96k'],
        high: ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26', '-c:a', 'aac', '-b:a', '128k'],
    };
    return convertFileWithFFmpeg(videoFile, 'mp4', settings[quality] || settings.medium, onProgress);
}

export async function trimVideo(videoFile, startTime, endTime, onProgress) {
    const duration = endTime - startTime;
    return convertFileWithFFmpeg(videoFile, 'mp4', [
        '-ss', startTime.toString(),
        '-t', duration.toString(),
        '-c', 'copy',
    ], onProgress);
}
