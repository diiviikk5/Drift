/**
 * AI Auto-Zoom for Drift
 * Analyzes click events and cursor movement to generate optimal zoom keyframes
 * Uses free OpenRouter models for intelligent zoom placement
 */

import { getAIClient } from './openrouter-client';
import { autoZoomPrompt } from './prompts';

/**
 * Generate AI-powered zoom keyframes from click data
 *
 * @param {Array} clickEvents - Array of {time: ms, x: 0-1, y: 0-1}
 * @param {number} duration - Recording duration in ms
 * @param {Object} options
 * @param {string} options.style - 'professional', 'dramatic', 'minimal'
 * @param {number} options.maxZooms - Maximum number of zoom keyframes
 * @returns {Promise<Array>} Zoom keyframes ready for UnifiedZoomEngine
 */
export async function generateAutoZoom(clickEvents, duration, options = {}) {
    const { style = 'professional', maxZooms = 10 } = options;

    // Pre-filter: remove duplicate clicks that are too close together
    const filteredClicks = deduplicateClicks(clickEvents);

    if (filteredClicks.length === 0) {
        return [];
    }

    // If very few clicks, generate simple zooms without AI
    if (filteredClicks.length <= 3) {
        return generateSimpleZooms(filteredClicks, style);
    }

    // Use AI to generate intelligent keyframes
    const client = getAIClient();
    const messages = autoZoomPrompt(filteredClicks, duration, { style, maxZooms });

    try {
        const keyframes = await client.completeJSON({
            messages,
            taskType: 'reasoning',
            maxTokens: 2048,
            temperature: 0.4,
        });

        // Validate and clean up the AI output
        return validateKeyframes(keyframes, duration);
    } catch (error) {
        console.warn('[AutoZoom] AI generation failed, using heuristic fallback:', error.message);
        return generateHeuristicZooms(filteredClicks, duration, style);
    }
}

/**
 * Remove clicks that are too close in time and space
 */
function deduplicateClicks(clicks) {
    if (clicks.length === 0) return [];

    const result = [clicks[0]];

    for (let i = 1; i < clicks.length; i++) {
        const prev = result[result.length - 1];
        const curr = clicks[i];

        const timeDiff = curr.time - prev.time;
        const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);

        // Skip if within 300ms and 0.08 distance
        if (timeDiff < 300 && dist < 0.08) continue;

        result.push(curr);
    }

    return result;
}

/**
 * Generate simple zooms for very few clicks (no AI needed)
 */
function generateSimpleZooms(clicks, style) {
    const scaleMap = {
        professional: 1.5,
        dramatic: 2.0,
        minimal: 1.3,
    };
    const scale = scaleMap[style] || 1.5;

    return clicks.map(click => ({
        time: click.time,
        x: Math.max(0.15, Math.min(0.85, click.x)),
        y: Math.max(0.15, Math.min(0.85, click.y)),
        scale,
        duration: 800,
        holdDuration: 1000,
        easing: 'driftSmooth',
    }));
}

/**
 * Heuristic zoom generation (fallback when AI is unavailable)
 */
function generateHeuristicZooms(clicks, duration, style) {
    const scaleMap = {
        professional: { min: 1.3, max: 1.8 },
        dramatic: { min: 1.8, max: 2.5 },
        minimal: { min: 1.2, max: 1.5 },
    };
    const scales = scaleMap[style] || scaleMap.professional;

    // Group clicks by proximity (time and space)
    const groups = [];
    let currentGroup = [clicks[0]];

    for (let i = 1; i < clicks.length; i++) {
        const prev = clicks[i - 1];
        const curr = clicks[i];

        if (curr.time - prev.time < 1500 && Math.hypot(curr.x - prev.x, curr.y - prev.y) < 0.15) {
            currentGroup.push(curr);
        } else {
            groups.push(currentGroup);
            currentGroup = [curr];
        }
    }
    groups.push(currentGroup);

    // Take the most important groups (most clicks = most important)
    const sorted = groups
        .map(group => ({
            clicks: group,
            count: group.length,
            centerX: group.reduce((s, c) => s + c.x, 0) / group.length,
            centerY: group.reduce((s, c) => s + c.y, 0) / group.length,
            time: group[0].time,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    // Sort back by time
    sorted.sort((a, b) => a.time - b.time);

    return sorted.map((group, i) => {
        const importance = group.count / Math.max(...sorted.map(g => g.count));
        const scale = scales.min + (scales.max - scales.min) * importance;

        return {
            time: group.time,
            x: Math.max(0.15, Math.min(0.85, group.centerX)),
            y: Math.max(0.15, Math.min(0.85, group.centerY)),
            scale: +scale.toFixed(2),
            duration: 800,
            holdDuration: 800 + group.count * 200,
            easing: 'driftSmooth',
        };
    });
}

/**
 * Validate and clean AI-generated keyframes
 */
function validateKeyframes(keyframes, duration) {
    if (!Array.isArray(keyframes)) return [];

    return keyframes
        .filter(kf => {
            return (
                typeof kf.time === 'number' &&
                typeof kf.x === 'number' &&
                typeof kf.y === 'number' &&
                kf.time >= 0 &&
                kf.time <= duration
            );
        })
        .map(kf => ({
            time: Math.round(kf.time),
            x: Math.max(0.15, Math.min(0.85, kf.x)),
            y: Math.max(0.15, Math.min(0.85, kf.y)),
            scale: Math.max(1.1, Math.min(3, kf.scale || 1.5)),
            duration: Math.max(200, Math.min(2000, kf.duration || 800)),
            holdDuration: Math.max(200, Math.min(3000, kf.holdDuration || 1000)),
            easing: kf.easing || 'driftSmooth',
        }))
        .sort((a, b) => a.time - b.time);
}

export default generateAutoZoom;
