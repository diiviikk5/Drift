/**
 * Export Engine for Drift
 * Handles video encoding and format conversion
 * Uses FFmpeg WASM for client-side processing - zero server costs
 */

// Note: FFmpeg WASM integration is optional and can be added later
// For now, we support direct WebM download which is native to browsers

export class ExportEngine {
    constructor() {
        this.ffmpeg = null;
        this.isLoaded = false;
        this.onProgress = null;
    }

    /**
     * Load FFmpeg WASM (optional, for MP4/GIF export)
     * To use this, install: npm install @ffmpeg/ffmpeg @ffmpeg/util
     */
    async loadFFmpeg() {
        if (this.isLoaded) return true;

        try {
            // Dynamic import to avoid bundling if not used
            const { FFmpeg } = await import("@ffmpeg/ffmpeg");
            const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

            this.ffmpeg = new FFmpeg();
            this.fetchFile = fetchFile;

            // Progress callback
            this.ffmpeg.on("progress", ({ progress }) => {
                if (this.onProgress) {
                    this.onProgress(Math.round(progress * 100));
                }
            });

            // Load FFmpeg core
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm";
            await this.ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });

            this.isLoaded = true;
            return true;
        } catch (error) {
            console.error("Failed to load FFmpeg:", error);
            return false;
        }
    }

    /**
     * Export video to specified format
     * @param {Blob} inputBlob - Input video blob (WebM)
     * @param {Object} options - Export options
     * @returns {Blob} - Exported video blob
     */
    async export(inputBlob, options = {}) {
        const {
            format = "webm",
            quality = "high",
            onProgress = null,
        } = options;

        this.onProgress = onProgress;

        // WebM direct export (no conversion needed)
        if (format === "webm") {
            return inputBlob;
        }

        // For MP4/GIF, we need FFmpeg
        const loaded = await this.loadFFmpeg();
        if (!loaded) {
            throw new Error("FFmpeg not available. Use WebM format instead.");
        }

        const inputName = "input.webm";
        const outputName = `output.${format}`;

        // Write input file to FFmpeg virtual filesystem
        await this.ffmpeg.writeFile(inputName, await this.fetchFile(inputBlob));

        // Build FFmpeg command based on format and quality
        let command = [];

        if (format === "mp4") {
            const bitrate = quality === "high" ? "8M" : quality === "medium" ? "4M" : "2M";
            command = [
                "-i", inputName,
                "-c:v", "libx264",
                "-preset", "fast",
                "-b:v", bitrate,
                "-c:a", "aac",
                "-b:a", "128k",
                "-movflags", "+faststart",
                outputName,
            ];
        } else if (format === "gif") {
            // GIF conversion with palette for better quality
            command = [
                "-i", inputName,
                "-vf", "fps=15,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
                "-loop", "0",
                outputName,
            ];
        }

        // Execute
        await this.ffmpeg.exec(command);

        // Read output
        const data = await this.ffmpeg.readFile(outputName);

        // Determine MIME type
        const mimeType = format === "mp4" ? "video/mp4" : format === "gif" ? "image/gif" : "video/webm";

        return new Blob([data.buffer], { type: mimeType });
    }

    /**
     * Trim video
     * @param {Blob} inputBlob - Input video blob
     * @param {number} startTime - Start time in seconds
     * @param {number} endTime - End time in seconds
     * @returns {Blob} - Trimmed video blob
     */
    async trim(inputBlob, startTime, endTime, options = {}) {
        const loaded = await this.loadFFmpeg();
        if (!loaded) {
            throw new Error("FFmpeg not available for trimming.");
        }

        const { format = "webm", onProgress = null } = options;
        this.onProgress = onProgress;

        const inputName = "input.webm";
        const outputName = `output.${format}`;

        await this.ffmpeg.writeFile(inputName, await this.fetchFile(inputBlob));

        const duration = endTime - startTime;

        await this.ffmpeg.exec([
            "-i", inputName,
            "-ss", String(startTime),
            "-t", String(duration),
            "-c", "copy",
            outputName,
        ]);

        const data = await this.ffmpeg.readFile(outputName);
        const mimeType = format === "mp4" ? "video/mp4" : "video/webm";

        return new Blob([data.buffer], { type: mimeType });
    }

    /**
     * Check if FFmpeg is available
     */
    isAvailable() {
        return this.isLoaded;
    }

    /**
     * Get estimated file size
     * @param {number} duration - Duration in seconds
     * @param {string} quality - Quality preset
     * @returns {number} - Estimated size in bytes
     */
    estimateFileSize(duration, quality = "high") {
        const bitrates = {
            high: 8000000, // 8 Mbps
            medium: 4000000, // 4 Mbps
            low: 2000000, // 2 Mbps
        };

        const bitrate = bitrates[quality] || bitrates.high;
        return (bitrate * duration) / 8; // Convert to bytes
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.ffmpeg) {
            this.ffmpeg.terminate();
            this.ffmpeg = null;
        }
        this.isLoaded = false;
    }
}

// Singleton instance
let exportEngineInstance = null;

export function getExportEngine() {
    if (!exportEngineInstance) {
        exportEngineInstance = new ExportEngine();
    }
    return exportEngineInstance;
}
