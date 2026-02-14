/**
 * AI Natural Language Editor for Drift
 * Translates natural language instructions into edit commands
 */

import { getAIClient } from './openrouter-client';
import { nlEditPrompt } from './prompts';

/**
 * Parse a natural language editing instruction into structured commands
 *
 * @param {string} instruction - User's natural language instruction
 * @param {Object} timelineState - Current state of the timeline
 * @param {number} timelineState.duration - Duration in ms
 * @param {Array} timelineState.zooms - Current zoom keyframes
 * @param {number} timelineState.zoomLevel - Current zoom level
 * @param {string} timelineState.speedPreset - Current speed preset
 * @returns {Promise<Array>} Array of structured edit commands
 */
export async function parseEditInstruction(instruction, timelineState) {
    // Quick local parsing for simple commands
    const localResult = parseLocally(instruction, timelineState);
    if (localResult) {
        return localResult;
    }

    // Use AI for complex instructions
    const client = getAIClient();
    const messages = nlEditPrompt(instruction, timelineState);

    try {
        const commands = await client.completeJSON({
            messages,
            taskType: 'reasoning',
            maxTokens: 1024,
            temperature: 0.3,
        });

        return validateCommands(commands, timelineState);
    } catch (error) {
        console.warn('[NLEditor] AI parsing failed:', error.message);
        throw new Error(`I couldn't understand that instruction. Try something like "zoom into the center at 5 seconds" or "speed up the first 10 seconds".`);
    }
}

/**
 * Try to parse simple instructions locally without AI
 */
function parseLocally(instruction, state) {
    const lower = instruction.toLowerCase().trim();

    // "set background to <name>"
    const bgMatch = lower.match(/(?:set|change|use)\s+background\s+(?:to\s+)?(\w+)/);
    if (bgMatch) {
        const names = ['bigsur', 'monterey', 'ventura', 'bloom', 'sonoma', 'midnight'];
        const name = names.find(n => bgMatch[1].includes(n)) || bgMatch[1];
        return [{ action: 'setBackground', name }];
    }

    // "zoom level <number>"
    const zoomLevelMatch = lower.match(/zoom\s+level\s+(\d+\.?\d*)/);
    if (zoomLevelMatch) {
        return [{ action: 'setZoomLevel', level: parseFloat(zoomLevelMatch[1]) }];
    }

    // "speed <preset>"
    const speedMatch = lower.match(/(?:set\s+)?speed\s+(?:to\s+)?(slow|normal|fast|instant)/);
    if (speedMatch) {
        return [{ action: 'setSpeed', preset: speedMatch[1] }];
    }

    // "remove all zooms"
    if (lower.includes('remove all zoom') || lower.includes('clear zoom') || lower.includes('delete all zoom')) {
        return [{ action: 'clearZooms' }];
    }

    // "zoom at <time>"
    const zoomAtMatch = lower.match(/zoom\s+(?:at|to)\s+(?:(\d+):)?(\d+)\s*(?:seconds?|s)?/);
    if (zoomAtMatch) {
        const minutes = parseInt(zoomAtMatch[1] || '0');
        const seconds = parseInt(zoomAtMatch[2]);
        const timeMs = (minutes * 60 + seconds) * 1000;
        return [{ action: 'addZoom', time: timeMs, x: 0.5, y: 0.5, scale: state.zoomLevel || 1.5, duration: 800 }];
    }

    return null; // Can't parse locally
}

/**
 * Validate and clean up AI-generated commands
 */
function validateCommands(commands, state) {
    if (!Array.isArray(commands)) {
        return [];
    }

    const validActions = ['addZoom', 'removeZoom', 'trim', 'speed', 'addCaption', 'setCrop', 'setBackground', 'setZoomLevel', 'setSpeed', 'clearZooms'];

    return commands.filter(cmd => {
        if (!cmd || !cmd.action) return false;
        if (!validActions.includes(cmd.action)) return false;

        // Validate specific commands
        switch (cmd.action) {
            case 'addZoom':
                return typeof cmd.time === 'number' && cmd.time >= 0 && cmd.time <= state.duration;
            case 'trim':
                return typeof cmd.startTime === 'number' && typeof cmd.endTime === 'number';
            case 'speed':
                return typeof cmd.factor === 'number' && cmd.factor > 0 && cmd.factor <= 4;
            case 'setZoomLevel':
                return typeof cmd.level === 'number' && cmd.level >= 1 && cmd.level <= 4;
            case 'setSpeed':
                return ['slow', 'normal', 'fast', 'instant'].includes(cmd.preset);
            default:
                return true;
        }
    });
}

/**
 * Execute an array of edit commands against the engine
 *
 * @param {Array} commands - Validated edit commands
 * @param {Object} engine - StudioEngine or similar
 * @param {Object} zoomEngine - UnifiedZoomEngine
 * @returns {Array} Results of each command execution
 */
export function executeCommands(commands, engine, zoomEngine) {
    const results = [];

    for (const cmd of commands) {
        try {
            switch (cmd.action) {
                case 'addZoom':
                    zoomEngine.addKeyframe({
                        time: cmd.time,
                        x: cmd.x || 0.5,
                        y: cmd.y || 0.5,
                        scale: cmd.scale || 1.5,
                        duration: cmd.duration || 800,
                    });
                    results.push({ command: cmd, success: true });
                    break;

                case 'removeZoom':
                    if (cmd.index !== undefined) {
                        const kfs = zoomEngine.getKeyframes();
                        if (kfs[cmd.index]) {
                            zoomEngine.removeKeyframe(kfs[cmd.index].id);
                        }
                    }
                    results.push({ command: cmd, success: true });
                    break;

                case 'clearZooms':
                    zoomEngine.clearKeyframes();
                    results.push({ command: cmd, success: true });
                    break;

                case 'setBackground':
                    if (engine && engine.background !== undefined) {
                        engine.background = cmd.name;
                    }
                    results.push({ command: cmd, success: true });
                    break;

                case 'setZoomLevel':
                    if (engine) engine.zoomLevel = cmd.level;
                    zoomEngine.zoomLevel = cmd.level;
                    results.push({ command: cmd, success: true });
                    break;

                case 'setSpeed':
                    if (engine) engine.speedPreset = cmd.preset;
                    zoomEngine.speedPreset = cmd.preset;
                    results.push({ command: cmd, success: true });
                    break;

                default:
                    results.push({ command: cmd, success: false, error: 'Not implemented' });
            }
        } catch (error) {
            results.push({ command: cmd, success: false, error: error.message });
        }
    }

    return results;
}

export default parseEditInstruction;
