/**
 * AI Natural Language Editor for Drift
 * Translates natural language instructions into edit commands
 */

import { getAIClient } from './openrouter-client.js';
import { nlEditPrompt } from './prompts.js';

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

    // "set background to <name>" or "use <name> background"
    const bgNames = [
        'cosmicmesh', 'cosmic mesh', 'sunsetprism', 'sunset prism', 'auroraflow', 'aurora flow',
        'oceanbreeze', 'ocean breeze', 'deepspace', 'deep space', 'hyperglow', 'hyper glow',
        'pasteldream', 'pastel dream', 'velvethaze', 'velvet haze', 'neondusk', 'neon dusk',
        'abstractfluid', 'abstract fluid', 'neondrift', 'drift lime', 'midnight', 'bigsur',
        'big sur', 'monterey', 'ventura', 'bloom', 'sonoma', 'emerald'
    ];
    const foundBg = bgNames.find(n => lower.includes(n));
    if (foundBg && (lower.includes('background') || lower.includes('wallpaper') || lower.includes('theme') || lower.includes('set') || lower.includes('use') || lower.includes('change'))) {
        const canonical = foundBg.replace(/\s+/g, '');
        return [{ action: 'setBackground', name: canonical }];
    }

    // "zoom level <number>" or "zoom <number>x"
    const zoomLevelMatch = lower.match(/zoom\s+(?:level\s+)?(\d+\.?\d*)x?/);
    if (zoomLevelMatch && (lower.includes('level') || lower.includes('depth') || lower.match(/^zoom\s+\d/))) {
        return [{ action: 'setZoomLevel', level: parseFloat(zoomLevelMatch[1]) }];
    }

    // "speed <preset>"
    const speedMatch = lower.match(/(?:set\s+)?speed\s+(?:to\s+)?(slow|normal|fast|instant|gentle|punchy|cinematic)/);
    if (speedMatch) {
        return [{ action: 'setSpeed', preset: speedMatch[1] }];
    }

    // "remove all zooms" / "clear zoom" / "zoom out"
    if (
        ((lower.includes('clear') || lower.includes('remove') || lower.includes('delete')) && (lower.includes('zoom') || lower.includes('camera'))) ||
        lower.includes('reset') || lower.includes('overview') || lower.includes('zoom out') || lower.includes('unzoom')
    ) {
        return [{ action: 'clearZooms' }];
    }

    // "zoom [into ...] [at <time>]"
    if (lower.includes('zoom') || lower.includes('focus')) {
        let timeMs = 0;
        const timeMatch = lower.match(/(?:at|from|after)?\s*(\d+(?:\.\d+)?)\s*(?:seconds?|s\b)/i) || lower.match(/at\s+(\d+)/i);
        if (timeMatch) {
            timeMs = Math.round(parseFloat(timeMatch[1]) * 1000);
        }

        let x = 0.5;
        let y = 0.5;
        if (lower.includes('top') && lower.includes('left')) { x = 0.25; y = 0.25; }
        else if (lower.includes('top') && lower.includes('right')) { x = 0.75; y = 0.25; }
        else if (lower.includes('bottom') && lower.includes('left')) { x = 0.25; y = 0.75; }
        else if (lower.includes('bottom') && lower.includes('right')) { x = 0.75; y = 0.75; }
        else if (lower.includes('left')) { x = 0.25; y = 0.5; }
        else if (lower.includes('right')) { x = 0.75; y = 0.5; }
        else if (lower.includes('top')) { x = 0.5; y = 0.25; }
        else if (lower.includes('bottom')) { x = 0.5; y = 0.75; }

        let scale = state?.zoomLevel || 2.0;
        const scaleMatch = lower.match(/(\d+(?:\.\d+)?)\s*x/i);
        if (scaleMatch) {
            scale = parseFloat(scaleMatch[1]);
        }

        return [{ action: 'addZoom', time: timeMs, x, y, scale, duration: 800 }];
    }

    return null; // Can't parse locally
}

/**
 * Validate and clean up AI-generated commands
 */
function validateCommands(rawCommands, state) {
    let commands = rawCommands;
    if (!Array.isArray(commands)) {
        if (commands && typeof commands === 'object') {
            commands = [commands];
        } else {
            return [];
        }
    }

    const durationMs = state?.duration || 10000;

    return commands.map(cmd => {
        if (!cmd) return null;
        let action = cmd.action || cmd.type || cmd.effect;
        if (!action) return null;

        const actLower = String(action).toLowerCase().replace(/[-_]/g, '');
        if (['zoom', 'addzoom', 'zoomin', 'focus', 'zoompoint'].includes(actLower)) {
            action = 'addZoom';
        } else if (['clearzoom', 'clearzooms', 'removeallzooms', 'resetzoom', 'resetcamera', 'zoomout', 'overview'].includes(actLower)) {
            action = 'clearZooms';
        } else if (['removezoom', 'deletezoom'].includes(actLower)) {
            action = 'removeZoom';
        } else if (['setbackground', 'background', 'wallpaper', 'theme'].includes(actLower)) {
            action = 'setBackground';
        } else if (['setzoomlevel', 'zoomlevel', 'zoomdepth', 'scale'].includes(actLower)) {
            action = 'setZoomLevel';
        } else if (['setspeed', 'speed', 'tempo'].includes(actLower)) {
            action = 'setSpeed';
        }

        // Normalize time: convert seconds to ms if < 100
        let time = cmd.time ?? cmd.timestamp ?? cmd.start ?? cmd.startTime ?? 0;
        if (typeof time === 'number' && time > 0 && time < 100 && durationMs > 100) {
            time = time * 1000;
        }

        // Normalize target position
        let x = cmd.x;
        let y = cmd.y;
        if (cmd.focus || cmd.target || cmd.position) {
            const pos = String(cmd.focus || cmd.target || cmd.position).toLowerCase();
            if (pos.includes('top') && pos.includes('left')) { x = 0.25; y = 0.25; }
            else if (pos.includes('top') && pos.includes('right')) { x = 0.75; y = 0.25; }
            else if (pos.includes('bottom') && pos.includes('left')) { x = 0.25; y = 0.75; }
            else if (pos.includes('bottom') && pos.includes('right')) { x = 0.75; y = 0.75; }
            else if (pos.includes('center') || pos.includes('middle')) { x = 0.5; y = 0.5; }
            else if (pos.includes('left')) { x = 0.25; y = 0.5; }
            else if (pos.includes('right')) { x = 0.75; y = 0.5; }
            else if (pos.includes('top')) { x = 0.5; y = 0.25; }
            else if (pos.includes('bottom')) { x = 0.5; y = 0.75; }
        }

        const normX = (typeof x === 'number' && Number.isFinite(x)) ? Math.max(0, Math.min(1, x)) : 0.5;
        const normY = (typeof y === 'number' && Number.isFinite(y)) ? Math.max(0, Math.min(1, y)) : 0.5;
        const scale = Number(cmd.scale || cmd.amount || cmd.level || 2.0);

        return {
            ...cmd,
            action,
            time: typeof time === 'number' ? time : 0,
            x: normX,
            y: normY,
            scale: Math.max(1.0, Math.min(4.0, scale)),
            name: cmd.name || cmd.value || cmd.color || '',
        };
    }).filter(cmd => cmd !== null);
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
