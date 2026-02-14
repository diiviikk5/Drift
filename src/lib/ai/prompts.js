/**
 * AI Prompt Templates for Drift
 * Structured prompts for each AI feature
 */

// ============================================================
// AUTO-ZOOM PROMPTS
// ============================================================

export function autoZoomPrompt(clickEvents, duration, options = {}) {
    const { style = 'professional', maxZooms = 10 } = options;

    const clickData = clickEvents.map(c => ({
        time: Math.round(c.time),
        x: +c.x.toFixed(3),
        y: +c.y.toFixed(3),
    }));

    return [
        {
            role: 'system',
            content: `You are a professional video editor AI for a screen recording tool called Drift. Your job is to analyze click events from a screen recording and generate optimal zoom keyframes that create smooth, cinematic camera movements — like Screen Studio or Loom.

Rules:
- Coordinates are normalized 0-1 (x=0 is left, y=0 is top)
- Group nearby clicks (within 500ms and 0.1 distance) into a single zoom
- Don't zoom on every click — pick the most important ones
- Maximum ${maxZooms} zoom keyframes
- Each zoom has: time (ms), x, y, scale (1.3-2.5), duration (ms for zoom-in), easing
- Available easings: "driftSmooth", "easeOutQuint", "easeOutExpo", "easeInOutCubic"
- Style: "${style}" — professional = subtle 1.3-1.8x zooms, dramatic = 1.8-2.5x, minimal = only 1-3 key zooms
- Leave breathing room between zooms (at least 1500ms gap)
- Avoid zooming to edges (clamp x/y to 0.15-0.85)`,
        },
        {
            role: 'user',
            content: `Recording duration: ${duration}ms
Click events: ${JSON.stringify(clickData)}

Generate zoom keyframes as a JSON array:
[{"time": <ms>, "x": <0-1>, "y": <0-1>, "scale": <1.3-2.5>, "duration": <ms>, "easing": "<name>", "holdDuration": <ms>}]`,
        },
    ];
}

// ============================================================
// SMART CROP PROMPTS
// ============================================================

export function smartCropPrompt(clickHeatmap, screenDimensions) {
    return [
        {
            role: 'system',
            content: `You are a video framing AI. Given a heatmap of click activity on a screen recording, determine the optimal crop region to focus on the most interesting content. The goal is to remove dead space and center the action.`,
        },
        {
            role: 'user',
            content: `Screen dimensions: ${screenDimensions.width}x${screenDimensions.height}
Click heatmap (normalized coordinates with weights):
${JSON.stringify(clickHeatmap)}

Return the optimal crop region as JSON:
{"x": <left 0-1>, "y": <top 0-1>, "width": <0-1>, "height": <0-1>, "confidence": <0-1>, "reason": "<why this crop>"}`,
        },
    ];
}

// ============================================================
// CAPTION CLEANUP PROMPTS
// ============================================================

export function captionCleanupPrompt(rawTranscript, duration) {
    return [
        {
            role: 'system',
            content: `You are a subtitle/caption editor. Clean up raw speech-to-text transcription:
- Fix grammar and punctuation
- Split into natural segments (max 10 words per segment)
- Each segment should have start/end timestamps
- Remove filler words (um, uh, like) unless they add meaning
- Preserve technical terms accurately
- Output valid SRT-style JSON`,
        },
        {
            role: 'user',
            content: `Recording duration: ${duration}ms
Raw transcript:
${rawTranscript}

Return as JSON array:
[{"start": <ms>, "end": <ms>, "text": "<cleaned text>"}]`,
        },
    ];
}

// ============================================================
// SCENE DETECTION PROMPTS
// ============================================================

export function sceneDetectionPrompt(sceneBoundaries, clickEvents) {
    const boundaries = sceneBoundaries.map(s => ({
        time: Math.round(s.time),
        diffScore: +s.diffScore.toFixed(3),
    }));

    const clicks = clickEvents.map(c => ({
        time: Math.round(c.time),
        x: +c.x.toFixed(2),
        y: +c.y.toFixed(2),
    }));

    return [
        {
            role: 'system',
            content: `You are a video chapter AI. Given scene boundaries (detected by frame differences) and click events from a screen recording, create meaningful chapter titles and descriptions. Think about what the user was likely demonstrating.`,
        },
        {
            role: 'user',
            content: `Scene boundaries (by visual change): ${JSON.stringify(boundaries)}
Click activity: ${JSON.stringify(clicks)}

Group boundaries into logical chapters and name them. Return JSON:
[{"startTime": <ms>, "endTime": <ms>, "title": "<short title>", "description": "<what happens>"}]`,
        },
    ];
}

// ============================================================
// THUMBNAIL & TITLE PROMPTS
// ============================================================

export function thumbnailTitlePrompt(recordingMeta) {
    return [
        {
            role: 'system',
            content: `You are a marketing AI for product demos. Generate compelling titles and thumbnail suggestions for screen recordings. Think about what would make someone click on this video.`,
        },
        {
            role: 'user',
            content: `Recording metadata:
- Duration: ${recordingMeta.duration}s
- Resolution: ${recordingMeta.width}x${recordingMeta.height}
- Number of clicks: ${recordingMeta.clickCount}
- Number of scenes: ${recordingMeta.sceneCount || 'unknown'}
${recordingMeta.captions ? `- Topics mentioned: ${recordingMeta.captions}` : ''}

Generate 3 title options and suggest the best timestamp for a thumbnail frame. Return JSON:
{"titles": ["<title1>", "<title2>", "<title3>"], "thumbnailTime": <seconds>, "description": "<short description for sharing>"}`,
        },
    ];
}

// ============================================================
// NATURAL LANGUAGE EDITING PROMPTS
// ============================================================

export function nlEditPrompt(userInstruction, timelineState) {
    return [
        {
            role: 'system',
            content: `You are an AI video editor. The user gives natural language instructions to edit their screen recording. You translate these into structured edit commands.

Available commands:
- addZoom: {"action": "addZoom", "time": <ms>, "x": <0-1>, "y": <0-1>, "scale": <1.2-3>, "duration": <ms>}
- removeZoom: {"action": "removeZoom", "index": <zoom index>}
- trim: {"action": "trim", "startTime": <ms>, "endTime": <ms>}
- speed: {"action": "speed", "startTime": <ms>, "endTime": <ms>, "factor": <0.25-4>}
- addCaption: {"action": "addCaption", "time": <ms>, "text": "<text>", "duration": <ms>}
- setCrop: {"action": "setCrop", "x": <0-1>, "y": <0-1>, "width": <0-1>, "height": <0-1>}
- setBackground: {"action": "setBackground", "name": "<bigSur|monterey|ventura|bloom|sonoma|midnight>"}
- setZoomLevel: {"action": "setZoomLevel", "level": <1.2-3>}
- setSpeed: {"action": "setSpeed", "preset": "<slow|normal|fast>"}

Parse time references like "at 23 seconds" → 23000ms, "the first 10 seconds" → 0-10000ms.
Return an array of commands.`,
        },
        {
            role: 'user',
            content: `Current timeline state:
- Duration: ${timelineState.duration}ms
- Existing zooms: ${JSON.stringify(timelineState.zooms || [])}
- Current zoom level: ${timelineState.zoomLevel || 1.5}
- Current speed: ${timelineState.speedPreset || 'normal'}

User instruction: "${userInstruction}"

Return JSON array of edit commands:`,
        },
    ];
}
