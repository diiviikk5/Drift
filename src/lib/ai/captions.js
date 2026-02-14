/**
 * AI Auto-Captions for Drift
 * Uses Web Speech API for free client-side transcription
 * Then cleans up with AI for professional-quality captions
 */

import { getAIClient } from './openrouter-client';
import { captionCleanupPrompt } from './prompts';

// ============================================================
// WEB SPEECH API TRANSCRIPTION
// ============================================================

/**
 * Transcribe audio from a video blob using Web Speech API
 * This is completely free — runs in the browser
 *
 * @param {Blob} videoBlob - The recorded video blob
 * @param {Object} options
 * @param {Function} options.onPartialResult - Callback for interim results
 * @param {Function} options.onProgress - Progress callback
 * @param {string} options.language - Language code (default: 'en-US')
 * @returns {Promise<Array>} Array of {start, end, text} segments
 */
export async function transcribeWithSpeechAPI(videoBlob, options = {}) {
    const {
        onPartialResult,
        onProgress,
        language = 'en-US',
    } = options;

    // Check support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        throw new Error('Speech Recognition not supported in this browser. Try Chrome or Edge.');
    }

    return new Promise((resolve, reject) => {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;
        recognition.maxAlternatives = 1;

        const segments = [];
        let currentSegmentStart = 0;

        // Create an audio element to play the video's audio
        const audio = new Audio();
        audio.src = URL.createObjectURL(videoBlob);
        audio.muted = false;
        audio.volume = 1;

        // Track audio time for segment timestamps
        let audioStartTime = 0;

        recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const text = result[0].transcript.trim();

                if (result.isFinal && text) {
                    const now = (audio.currentTime * 1000) || 0;
                    segments.push({
                        start: currentSegmentStart,
                        end: now,
                        text,
                        confidence: result[0].confidence,
                    });
                    currentSegmentStart = now;
                }

                if (onPartialResult && !result.isFinal) {
                    onPartialResult(text);
                }
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                // Normal — just no speech in this segment
                return;
            }
            console.warn('[Captions] Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            // Recognition can stop unexpectedly — restart if audio is still playing
            if (!audio.paused && !audio.ended) {
                try {
                    recognition.start();
                } catch (e) {
                    // Already started
                }
            }
        };

        audio.onplay = () => {
            audioStartTime = Date.now();
            try {
                recognition.start();
            } catch (e) {
                reject(new Error('Failed to start speech recognition'));
            }
        };

        audio.ontimeupdate = () => {
            if (onProgress && audio.duration) {
                onProgress(audio.currentTime / audio.duration);
            }
        };

        audio.onended = () => {
            recognition.stop();
            URL.revokeObjectURL(audio.src);
            resolve(segments);
        };

        audio.onerror = () => {
            recognition.stop();
            URL.revokeObjectURL(audio.src);
            reject(new Error('Failed to load audio for transcription'));
        };

        // Start playback at normal speed
        audio.playbackRate = 1.0;
        audio.play().catch(reject);
    });
}

// ============================================================
// AI CAPTION CLEANUP
// ============================================================

/**
 * Clean up raw transcription with AI
 * Fixes grammar, punctuation, and creates proper timed segments
 *
 * @param {Array} rawSegments - Array of {start, end, text}
 * @param {number} duration - Total duration in ms
 * @returns {Promise<Array>} Cleaned caption segments
 */
export async function cleanupCaptionsWithAI(rawSegments, duration) {
    if (rawSegments.length === 0) return [];

    // Format raw transcript for the AI
    const rawTranscript = rawSegments
        .map(s => `[${formatTime(s.start)} - ${formatTime(s.end)}] ${s.text}`)
        .join('\n');

    const client = getAIClient();
    const messages = captionCleanupPrompt(rawTranscript, duration);

    try {
        const cleaned = await client.completeJSON({
            messages,
            taskType: 'fast',
            maxTokens: 4096,
            temperature: 0.3,
        });

        return validateCaptions(cleaned, duration);
    } catch (error) {
        console.warn('[Captions] AI cleanup failed, using raw segments:', error.message);
        // Return raw segments as-is
        return rawSegments.map(s => ({
            start: s.start,
            end: s.end,
            text: s.text,
        }));
    }
}

/**
 * Full caption pipeline: transcribe + cleanup
 */
export async function generateCaptions(videoBlob, options = {}) {
    const { onProgress, language } = options;

    // Step 1: Transcribe
    const rawSegments = await transcribeWithSpeechAPI(videoBlob, {
        onProgress: (p) => onProgress?.(p * 0.7), // 70% of progress for transcription
        language,
    });

    if (rawSegments.length === 0) {
        return [];
    }

    // Step 2: Get duration
    const duration = await getVideoDuration(videoBlob);

    // Step 3: Clean up with AI
    onProgress?.(0.75);
    const cleaned = await cleanupCaptionsWithAI(rawSegments, duration);
    onProgress?.(1.0);

    return cleaned;
}

// ============================================================
// SRT FORMAT CONVERSION
// ============================================================

/**
 * Convert caption segments to SRT format string
 */
export function toSRT(segments) {
    return segments
        .map((seg, i) => {
            return `${i + 1}\n${formatSRTTime(seg.start)} --> ${formatSRTTime(seg.end)}\n${seg.text}\n`;
        })
        .join('\n');
}

/**
 * Convert caption segments to VTT format string
 */
export function toVTT(segments) {
    const lines = ['WEBVTT\n'];
    segments.forEach(seg => {
        lines.push(`${formatVTTTime(seg.start)} --> ${formatVTTTime(seg.end)}\n${seg.text}\n`);
    });
    return lines.join('\n');
}

// ============================================================
// HELPERS
// ============================================================

function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
}

function formatSRTTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const milli = Math.floor(ms % 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(milli).padStart(3, '0')}`;
}

function formatVTTTime(ms) {
    return formatSRTTime(ms).replace(',', '.');
}

function validateCaptions(captions, duration) {
    if (!Array.isArray(captions)) return [];

    return captions
        .filter(c => c.text && typeof c.start === 'number' && typeof c.end === 'number')
        .map(c => ({
            start: Math.max(0, c.start),
            end: Math.min(duration, c.end),
            text: c.text.trim(),
        }))
        .filter(c => c.end > c.start && c.text.length > 0);
}

async function getVideoDuration(blob) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            const dur = isFinite(video.duration) ? video.duration * 1000 : 30000;
            URL.revokeObjectURL(video.src);
            resolve(dur);
        };
        video.onerror = () => resolve(30000);
        video.src = URL.createObjectURL(blob);
    });
}

export default generateCaptions;
