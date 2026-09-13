import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeProject, decodeProject } from '../src/lib/project-file.js';

test('project preserves media and editable state without base64 conversion', async () => {
    const recording = new Blob(['screen'], { type: 'video/webm' });
    const webcam = new Blob(['camera'], { type: 'video/webm' });
    const state = { duration: 5, focusSegments: [], annotations: [{ text: 'Demo' }], background: 'midnight' };
    const restored = await decodeProject(await encodeProject({ recording, webcam, ...state }));
    assert.equal(await restored.recording.text(), 'screen');
    assert.equal(await restored.webcam.text(), 'camera');
    assert.deepEqual(restored.annotations, state.annotations);
    assert.equal(restored.background, state.background);
});

test('truncated projects are rejected instead of opening broken media', async () => {
    const file = await encodeProject({ recording: new Blob(['screen']), duration: 5 });
    await assert.rejects(decodeProject(file.slice(0, file.size - 1)), /incomplete/);
});

test('foreign files and invalid timelines are rejected', async () => {
    await assert.rejects(decodeProject(new Blob(['not a project'])), /not a Drift/);
    const file = await encodeProject({ recording: new Blob(['screen']), duration: 5,
        focusSegments: [{ startTime: 3, endTime: 1, zoomScale: 2 }] });
    await assert.rejects(decodeProject(file), /Invalid zoom track/);
});
