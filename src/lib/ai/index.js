/**
 * AI module index for Drift
 * Re-exports all AI features
 */

export { OpenRouterClient, getAIClient, FREE_MODELS } from './openrouter-client';
export { generateAutoZoom } from './auto-zoom';
export { generateSmartCrop } from './smart-crop';
export { generateCaptions, transcribeWithSpeechAPI, cleanupCaptionsWithAI, toSRT, toVTT } from './captions';
export { detectScenes, detectSceneBoundaries, generateChapters } from './scene-detection';
export { generateTitleAndThumbnail, captureFrame } from './metadata';
export { parseEditInstruction, executeCommands } from './nl-editor';
