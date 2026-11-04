const MAGIC = 'DRIFT001';
const MAX_MANIFEST_BYTES = 16 * 1024 * 1024;
const MAX_DURATION_SECONDS = 24 * 60 * 60;
const TRACKS = ['focusSegments', 'clicks', 'moves', 'annotations', 'captions', 'keystrokes', 'caret', 'cursorShapes', 'blurRegions'];

export async function encodeProject({ recording, webcam = null, ...state }) {
    if (!(recording instanceof Blob) || !recording.size) throw new Error('A recording is required.');
    const manifest = new TextEncoder().encode(JSON.stringify({
        version: 1, state,
        recording: { size: recording.size, type: recording.type },
        webcam: webcam ? { size: webcam.size, type: webcam.type } : null,
    }));
    if (manifest.length > MAX_MANIFEST_BYTES) throw new Error('Project metadata is too large.');
    const length = new Uint8Array(4);
    new DataView(length.buffer).setUint32(0, manifest.length, true);
    return new Blob([MAGIC, length, manifest, recording, ...(webcam ? [webcam] : [])], { type: 'application/x-drift-project' });
}

export async function decodeProject(file) {
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (header.length !== 12 || new TextDecoder().decode(header.slice(0, 8)) !== MAGIC) {
        throw new Error('This is not a Drift project.');
    }
    const length = new DataView(header.buffer).getUint32(8, true);
    if (length > MAX_MANIFEST_BYTES || length + 12 > file.size) throw new Error('Invalid project header.');
    const manifest = JSON.parse(await file.slice(12, 12 + length).text());
    if (manifest.version !== 1) throw new Error('Unsupported project version.');
    const sizes = [manifest.recording?.size, manifest.webcam?.size ?? 0];
    if (!sizes.every(size => Number.isSafeInteger(size) && size >= 0) || sizes[0] === 0 ||
        12 + length + sizes[0] + sizes[1] !== file.size) throw new Error('Project media is incomplete.');
    const state = manifest.state;
    if (!state || !Number.isFinite(state.duration) || state.duration <= 0 || state.duration > MAX_DURATION_SECONDS) {
        throw new Error('Invalid recording duration.');
    }
    for (const field of TRACKS) {
        const track = state[field];
        if (track !== undefined && (!Array.isArray(track) || track.some(entry => !entry || typeof entry !== 'object' || Array.isArray(entry)))) {
            throw new Error(`Invalid ${field}.`);
        }
    }
    // Cursor tracks are resampled on a fixed-rate grid. Bound the timestamp span
    // before any track reaches the renderer. Allow a little capture-end drift.
    for (const field of ['clicks', 'moves']) {
        for (const sample of state[field] ?? []) {
            const time = sample.timeMs ?? sample.time ?? sample.t ?? 0;
            if (!Number.isFinite(time) || time < -1000 || time > (state.duration + 5) * 1000) {
                throw new Error(`Invalid ${field} timestamp.`);
            }
        }
    }
    if ((state.focusSegments || []).some(segment => !Number.isFinite(segment.startTime) ||
        !Number.isFinite(segment.endTime) || segment.startTime < 0 || segment.endTime <= segment.startTime ||
        segment.endTime > state.duration || !Number.isFinite(segment.zoomScale) || segment.zoomScale < 1)) {
        throw new Error('Invalid zoom track.');
    }
    const offset = 12 + length;
    return {
        ...state,
        recording: file.slice(offset, offset + sizes[0], manifest.recording.type),
        webcam: sizes[1] ? file.slice(offset + sizes[0], file.size, manifest.webcam.type) : null,
    };
}
