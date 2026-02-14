/**
 * AI Smart Crop for Drift
 * Analyzes click patterns and cursor movement to determine optimal crop region
 * Uses client-side heuristics + AI refinement
 */

import { getAIClient } from './openrouter-client';
import { smartCropPrompt } from './prompts';

/**
 * Analyze a recording and suggest the optimal crop region
 *
 * @param {Array} clickEvents - Array of {time, x, y} (normalized 0-1)
 * @param {Array} cursorPath - Array of {time, x, y} cursor positions
 * @param {Object} dimensions - {width, height} of the recording
 * @returns {Promise<Object>} Crop region {x, y, width, height, confidence}
 */
export async function generateSmartCrop(clickEvents, cursorPath = [], dimensions = { width: 1920, height: 1080 }) {
    // Step 1: Build a click heatmap
    const heatmap = buildClickHeatmap(clickEvents, cursorPath);

    // Step 2: Calculate the bounding box of activity
    const activityBounds = calculateActivityBounds(heatmap);

    // Step 3: If we have few clicks, use simple center-crop
    if (clickEvents.length < 3) {
        return {
            ...activityBounds,
            confidence: 0.5,
            reason: 'Few clicks detected — using center crop',
            method: 'heuristic',
        };
    }

    // Step 4: Use AI for intelligent crop decision
    try {
        const client = getAIClient();
        const messages = smartCropPrompt(heatmap, dimensions);
        const result = await client.completeJSON({
            messages,
            taskType: 'reasoning',
            maxTokens: 512,
            temperature: 0.3,
        });

        return {
            x: Math.max(0, Math.min(0.8, result.x || 0)),
            y: Math.max(0, Math.min(0.8, result.y || 0)),
            width: Math.max(0.2, Math.min(1, result.width || 1)),
            height: Math.max(0.2, Math.min(1, result.height || 1)),
            confidence: result.confidence || 0.7,
            reason: result.reason || 'AI-suggested crop',
            method: 'ai',
        };
    } catch (error) {
        console.warn('[SmartCrop] AI failed, using heuristic:', error.message);
        return {
            ...activityBounds,
            confidence: 0.6,
            reason: 'Heuristic crop based on click clustering',
            method: 'heuristic',
        };
    }
}

/**
 * Build a weighted heatmap from click and cursor data
 */
function buildClickHeatmap(clicks, cursorPath = []) {
    const gridSize = 8; // 8x8 grid
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

    // Weight clicks heavily
    clicks.forEach(click => {
        const gx = Math.min(gridSize - 1, Math.floor(click.x * gridSize));
        const gy = Math.min(gridSize - 1, Math.floor(click.y * gridSize));
        grid[gy][gx] += 3;

        // Spread to neighbors
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = gx + dx;
                const ny = gy + dy;
                if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                    grid[ny][nx] += 1;
                }
            }
        }
    });

    // Weight cursor movement lightly
    cursorPath.forEach(pos => {
        const gx = Math.min(gridSize - 1, Math.floor(pos.x * gridSize));
        const gy = Math.min(gridSize - 1, Math.floor(pos.y * gridSize));
        grid[gy][gx] += 0.5;
    });

    // Flatten to a list of weighted cells
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (grid[y][x] > 0) {
                cells.push({
                    x: (x + 0.5) / gridSize,
                    y: (y + 0.5) / gridSize,
                    weight: +(grid[y][x]).toFixed(1),
                });
            }
        }
    }

    return cells.filter(c => c.weight > 0).sort((a, b) => b.weight - a.weight);
}

/**
 * Calculate a bounding box from activity data
 */
function calculateActivityBounds(heatmap) {
    if (heatmap.length === 0) {
        return { x: 0, y: 0, width: 1, height: 1 };
    }

    // Get the top 70% of weighted cells
    const totalWeight = heatmap.reduce((s, c) => s + c.weight, 0);
    let accWeight = 0;
    const significantCells = [];

    for (const cell of heatmap) {
        significantCells.push(cell);
        accWeight += cell.weight;
        if (accWeight >= totalWeight * 0.7) break;
    }

    const minX = Math.min(...significantCells.map(c => c.x)) - 0.1;
    const maxX = Math.max(...significantCells.map(c => c.x)) + 0.1;
    const minY = Math.min(...significantCells.map(c => c.y)) - 0.1;
    const maxY = Math.max(...significantCells.map(c => c.y)) + 0.1;

    // Ensure minimum size and maintain aspect ratio
    const width = Math.max(0.4, maxX - minX);
    const height = Math.max(0.3, maxY - minY);

    return {
        x: Math.max(0, Math.min(1 - width, minX)),
        y: Math.max(0, Math.min(1 - height, minY)),
        width: Math.min(1, width),
        height: Math.min(1, height),
    };
}

export default generateSmartCrop;
