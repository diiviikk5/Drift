/**
 * AI Scene Detection for Drift
 * Detects visual scene changes using frame differencing
 * Then uses AI to generate chapter titles
 */

import { getAIClient } from './openrouter-client';
import { sceneDetectionPrompt } from './prompts';

/**
 * Detect scene boundaries using frame differencing
 *
 * @param {HTMLVideoElement|Blob} source - Video element or blob
 * @param {Object} options
 * @param {number} options.sampleRate - Frames per second to sample (default: 2)
 * @param {number} options.threshold - Diff threshold for scene change (default: 0.15)
 * @param {Function} options.onProgress - Progress callback
 * @returns {Promise<Array>} Array of {time, diffScore} scene boundaries
 */
export async function detectSceneBoundaries(source, options = {}) {
    const {
        sampleRate = 2,
        threshold = 0.15,
        onProgress,
    } = options;

    // Get or create video element
    let video;
    let createdVideo = false;

    if (source instanceof HTMLVideoElement) {
        video = source;
    } else if (source instanceof Blob) {
        video = document.createElement('video');
        video.src = URL.createObjectURL(source);
        video.muted = true;
        createdVideo = true;
        await new Promise((resolve, reject) => {
            video.onloadedmetadata = resolve;
            video.onerror = reject;
        });
    } else {
        throw new Error('Source must be a video element or blob');
    }

    const duration = isFinite(video.duration) ? video.duration : 30;
    const sampleInterval = 1 / sampleRate;

    // Create canvas for frame comparison
    const canvas = document.createElement('canvas');
    // Use small resolution for fast comparison
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const boundaries = [];
    let prevFrameData = null;

    // Sample frames
    const totalSamples = Math.floor(duration / sampleInterval);

    for (let i = 0; i < totalSamples; i++) {
        const time = i * sampleInterval;

        // Seek to time
        video.currentTime = time;
        await new Promise(resolve => {
            video.onseeked = resolve;
        });

        // Draw frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (prevFrameData) {
            const diff = calculateFrameDiff(prevFrameData.data, frameData.data);

            if (diff > threshold) {
                boundaries.push({
                    time: time * 1000, // Convert to ms
                    diffScore: +diff.toFixed(4),
                });
            }
        }

        prevFrameData = frameData;

        if (onProgress) {
            onProgress(i / totalSamples);
        }
    }

    // Cleanup
    if (createdVideo) {
        URL.revokeObjectURL(video.src);
    }

    // Merge boundaries that are too close together (within 2 seconds)
    return mergeBoundaries(boundaries, 2000);
}

/**
 * Calculate normalized difference between two frames
 */
function calculateFrameDiff(data1, data2) {
    let totalDiff = 0;
    const pixels = data1.length / 4;

    for (let i = 0; i < data1.length; i += 4) {
        // Compare RGB (skip alpha)
        const dr = Math.abs(data1[i] - data2[i]);
        const dg = Math.abs(data1[i + 1] - data2[i + 1]);
        const db = Math.abs(data1[i + 2] - data2[i + 2]);
        totalDiff += (dr + dg + db) / (3 * 255);
    }

    return totalDiff / pixels;
}

/**
 * Merge boundaries that are too close together
 */
function mergeBoundaries(boundaries, minGap) {
    if (boundaries.length <= 1) return boundaries;

    const merged = [boundaries[0]];

    for (let i = 1; i < boundaries.length; i++) {
        const prev = merged[merged.length - 1];
        const curr = boundaries[i];

        if (curr.time - prev.time < minGap) {
            // Keep the one with higher diff score
            if (curr.diffScore > prev.diffScore) {
                merged[merged.length - 1] = curr;
            }
        } else {
            merged.push(curr);
        }
    }

    return merged;
}

/**
 * Generate AI-powered chapter titles for scene boundaries
 *
 * @param {Array} boundaries - Scene boundaries from detectSceneBoundaries
 * @param {Array} clickEvents - Click events for context
 * @param {number} totalDuration - Total recording duration in ms
 * @returns {Promise<Array>} Array of {startTime, endTime, title, description}
 */
export async function generateChapters(boundaries, clickEvents = [], totalDuration) {
    if (boundaries.length === 0) {
        return [{
            startTime: 0,
            endTime: totalDuration,
            title: 'Full Recording',
            description: 'Complete recording',
        }];
    }

    // Create chapter segments from boundaries
    const segments = [];
    for (let i = 0; i < boundaries.length; i++) {
        const start = i === 0 ? 0 : boundaries[i].time;
        const end = i < boundaries.length - 1 ? boundaries[i + 1].time : totalDuration;
        segments.push({ startTime: start, endTime: end });
    }

    // Use AI to name chapters
    try {
        const client = getAIClient();
        const messages = sceneDetectionPrompt(boundaries, clickEvents);

        const chapters = await client.completeJSON({
            messages,
            taskType: 'fast',
            maxTokens: 1024,
            temperature: 0.5,
        });

        return validateChapters(chapters, totalDuration);
    } catch (error) {
        console.warn('[SceneDetection] AI chapter naming failed:', error.message);
        // Return basic numbered chapters
        return segments.map((seg, i) => ({
            ...seg,
            title: `Scene ${i + 1}`,
            description: `Scene starting at ${formatTime(seg.startTime)}`,
        }));
    }
}

/**
 * Full scene detection pipeline
 */
export async function detectScenes(source, clickEvents = [], options = {}) {
    const { onProgress } = options;

    // Step 1: Detect boundaries
    const boundaries = await detectSceneBoundaries(source, {
        ...options,
        onProgress: (p) => onProgress?.(p * 0.7),
    });

    // Step 2: Get duration
    let duration;
    if (source instanceof HTMLVideoElement) {
        duration = (isFinite(source.duration) ? source.duration : 30) * 1000;
    } else {
        duration = await getVideoDuration(source);
    }

    // Step 3: Generate chapters
    onProgress?.(0.75);
    const chapters = await generateChapters(boundaries, clickEvents, duration);
    onProgress?.(1.0);

    return { boundaries, chapters };
}

function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
}

async function getVideoDuration(blob) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            resolve(isFinite(video.duration) ? video.duration * 1000 : 30000);
            URL.revokeObjectURL(video.src);
        };
        video.onerror = () => resolve(30000);
        video.src = URL.createObjectURL(blob);
    });
}

function validateChapters(chapters, duration) {
    if (!Array.isArray(chapters)) return [];

    return chapters
        .filter(c => typeof c.startTime === 'number' && typeof c.title === 'string')
        .map(c => ({
            startTime: Math.max(0, c.startTime),
            endTime: Math.min(duration, c.endTime || duration),
            title: c.title.slice(0, 100),
            description: (c.description || '').slice(0, 300),
        }));
}

export default detectScenes;
