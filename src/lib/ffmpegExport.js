// FFmpeg WASM Export Utility for MP4 conversion
// Using a simpler loading approach for Next.js/Electron compatibility

let ffmpeg = null;
let loaded = false;
let loading = false;

// Initialize FFmpeg (lazy load)
export async function initFFmpeg(onProgress) {
    if (loaded) return true;
    if (loading) {
        // Wait for existing load to complete
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (loaded || !loading) {
                    clearInterval(check);
                    resolve(loaded);
                }
            }, 100);
        });
    }

    loading = true;

    try {
        // Dynamic import to avoid SSR issues
        const { FFmpeg } = await import('@ffmpeg/ffmpeg');
        const { fetchFile } = await import('@ffmpeg/util');

        ffmpeg = new FFmpeg();

        ffmpeg.on('log', ({ message }) => {
            console.log('[FFmpeg]', message);
        });

        ffmpeg.on('progress', ({ progress }) => {
            if (onProgress) {
                onProgress(Math.round(progress * 100));
            }
        });

        // Load FFmpeg core - using multithread false for better compatibility
        await ffmpeg.load({
            coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
            wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
        });

        loaded = true;
        loading = false;
        console.log('[FFmpeg] Loaded successfully');
        return true;
    } catch (error) {
        console.error('[FFmpeg] Failed to load:', error);
        loading = false;
        return false;
    }
}

// Convert WebM blob to MP4
export async function convertToMP4(webmBlob, onProgress) {
    if (!loaded) {
        onProgress?.(0);
        const success = await initFFmpeg(onProgress);
        if (!success) throw new Error('Failed to load FFmpeg. Try WebM export instead.');
    }

    try {
        const { fetchFile } = await import('@ffmpeg/util');

        // Write input file
        const inputName = 'input.webm';
        const outputName = 'output.mp4';

        console.log('[FFmpeg] Writing input file...');
        await ffmpeg.writeFile(inputName, await fetchFile(webmBlob));

        console.log('[FFmpeg] Starting conversion...');
        // Convert to MP4 with H.264 encoding
        // Using faster preset for quicker encoding
        await ffmpeg.exec([
            '-i', inputName,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '23',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            '-y',
            outputName
        ]);

        console.log('[FFmpeg] Reading output file...');
        // Read output file
        const data = await ffmpeg.readFile(outputName);
        const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

        // Cleanup
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        console.log('[FFmpeg] Conversion complete, size:', (mp4Blob.size / 1024 / 1024).toFixed(2), 'MB');
        return mp4Blob;

    } catch (error) {
        console.error('[FFmpeg] Conversion failed:', error);
        throw new Error('MP4 conversion failed: ' + error.message);
    }
}

// Check if FFmpeg is available
export function isFFmpegLoaded() {
    return loaded;
}
