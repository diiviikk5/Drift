import test from 'node:test';
import assert from 'node:assert/strict';
import { mixAudioTracks, MIC_GAIN_BOOST, MIC_FADE_IN_S } from '../src/lib/audio/audioMix.js';

test('mixAudioTracks returns system audio directly when no mic track is present', () => {
    const fakeSystemTrack = { kind: 'audio', id: 'sys-1' };
    const result = mixAudioTracks({ systemAudioTrack: fakeSystemTrack, micAudioTrack: null });
    assert.equal(result.context, null);
    assert.equal(result.track, fakeSystemTrack);
});

test('mixAudioTracks returns null when neither track is present', () => {
    const result = mixAudioTracks({ systemAudioTrack: null, micAudioTrack: null });
    assert.equal(result.context, null);
    assert.equal(result.track, null);
});

test('mixAudioTracks routes mic through gain ramp with 1.4 boost when system audio present', () => {
    let capturedRampGain = null;
    let capturedRampTime = null;
    let capturedInitialGain = null;

    class FakeAudioContext {
        constructor() {
            this.currentTime = 1.0;
        }
        createMediaStreamDestination() {
            return {
                stream: {
                    getAudioTracks: () => [{ kind: 'audio', id: 'mixed-1' }]
                }
            };
        }
        createMediaStreamSource() {
            return {
                connect: (target) => target
            };
        }
        createGain() {
            return {
                gain: {
                    setValueAtTime: (val, time) => {
                        capturedInitialGain = val;
                    },
                    linearRampToValueAtTime: (val, time) => {
                        capturedRampGain = val;
                        capturedRampTime = time;
                    }
                },
                connect: (target) => target
            };
        }
    }

    // Mock global MediaStream for Node.js test environment
    globalThis.MediaStream = class MockMediaStream {
        constructor(tracks = []) {
            this.tracks = tracks;
        }
        getAudioTracks() {
            return this.tracks;
        }
    };

    const sysTrack = { kind: 'audio', id: 'sys' };
    const micTrack = { kind: 'audio', id: 'mic' };

    const result = mixAudioTracks({
        systemAudioTrack: sysTrack,
        micAudioTrack: micTrack,
        AudioContextClass: FakeAudioContext
    });

    assert.ok(result.context instanceof FakeAudioContext);
    assert.equal(result.track.id, 'mixed-1');
    assert.equal(capturedInitialGain, 0);
    assert.equal(capturedRampGain, MIC_GAIN_BOOST);
    assert.equal(capturedRampTime, 1.0 + MIC_FADE_IN_S);
});

test('mixAudioTracks uses unity gain (1.0) when mic is solo without system audio', () => {
    let capturedRampGain = null;

    class FakeAudioContext {
        constructor() {
            this.currentTime = 0;
        }
        createMediaStreamDestination() {
            return {
                stream: {
                    getAudioTracks: () => [{ kind: 'audio', id: 'mixed-solo' }]
                }
            };
        }
        createMediaStreamSource() {
            return {
                connect: (target) => target
            };
        }
        createGain() {
            return {
                gain: {
                    setValueAtTime: () => {},
                    linearRampToValueAtTime: (val) => {
                        capturedRampGain = val;
                    }
                },
                connect: (target) => target
            };
        }
    }

    const micTrack = { kind: 'audio', id: 'mic' };

    const result = mixAudioTracks({
        systemAudioTrack: null,
        micAudioTrack: micTrack,
        AudioContextClass: FakeAudioContext
    });

    assert.ok(result.context);
    assert.equal(capturedRampGain, 1.0);
});
