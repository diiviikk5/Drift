/**
 * AI Thumbnail & Title Generation for Drift
 * Generates compelling titles and suggests thumbnail timestamps
 */

import { getAIClient } from './openrouter-client';
import { thumbnailTitlePrompt } from './prompts';

/**
 * Generate title suggestions and thumbnail timestamp
 *
 * @param {Object} recordingMeta
 * @param {number} recordingMeta.duration - Duration in seconds
 * @param {number} recordingMeta.width - Video width
 * @param {number} recordingMeta.height - Video height
 * @param {number} recordingMeta.clickCount - Number of clicks
 * @param {Array} recordingMeta.chapters - Optional chapter data
 * @param {string} recordingMeta.captions - Optional transcript summary
 * @returns {Promise<Object>} {titles: string[], thumbnailTime: number, description: string}
 */
export async function generateTitleAndThumbnail(recordingMeta) {
    const client = getAIClient();
    const messages = thumbnailTitlePrompt({
        duration: recordingMeta.duration,
        width: recordingMeta.width || 1920,
        height: recordingMeta.height || 1080,
        clickCount: recordingMeta.clickCount || 0,
        sceneCount: recordingMeta.chapters?.length || undefined,
        captions: recordingMeta.captions || '',
    });

    try {
        const result = await client.completeJSON({
            messages,
            taskType: 'creative',
            maxTokens: 512,
            temperature: 0.7,
        });

        return {
            titles: (result.titles || ['Product Demo']).slice(0, 5),
            thumbnailTime: Math.max(0, result.thumbnailTime || 2),
            description: result.description || '',
        };
    } catch (error) {
        console.warn('[Metadata] AI generation failed:', error.message);
        return {
            titles: [
                `Product Demo - ${Math.round(recordingMeta.duration)}s`,
                'Screen Recording',
                'Drift Demo',
            ],
            thumbnailTime: Math.min(2, recordingMeta.duration * 0.1),
            description: `A ${Math.round(recordingMeta.duration)}s screen recording`,
        };
    }
}

/**
 * Capture a frame from a video at a specific time
 *
 * @param {Blob|HTMLVideoElement} source - Video source
 * @param {number} timeSec - Time in seconds to capture
 * @returns {Promise<Blob>} PNG image blob
 */
export async function captureFrame(source, timeSec) {
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
    }

    // Seek to the desired time
    video.currentTime = timeSec;
    await new Promise(resolve => {
        video.onseeked = resolve;
    });

    // Draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Cleanup
    if (createdVideo) {
        URL.revokeObjectURL(video.src);
    }

    // Convert to blob
    return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
    });
}

export default generateTitleAndThumbnail;
