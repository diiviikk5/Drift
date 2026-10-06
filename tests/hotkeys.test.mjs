import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_HOTKEYS, normalizeHotkeys, matchesAccelerator, formatAccelerator } from '../src/lib/hotkeys.js';

const key = (k, mods = {}) => ({ key: k, code: k.length === 1 ? `Key${k.toUpperCase()}` : k, ctrlKey: false, metaKey: false, altKey: false, shiftKey: false, ...mods });

test('old system-wide Ctrl+X recording binding is migrated', () => {
    const hk = normalizeHotkeys({ toggle_recording: 'CmdOrCtrl+X', stop_recording: 'Ctrl+X', toggle_zoom: 'Alt+Z' });
    assert.equal(hk.toggle_recording, DEFAULT_HOTKEYS.toggle_recording);
    assert.equal(hk.stop_recording, DEFAULT_HOTKEYS.stop_recording);
    assert.equal(hk.toggle_zoom, 'Alt+Z', 'custom bindings are kept');
    assert.deepEqual(normalizeHotkeys(), DEFAULT_HOTKEYS);
});

test('accelerators match exact modifier combinations only', () => {
    assert.ok(matchesAccelerator(key('r', { altKey: true, shiftKey: true }), 'Alt+Shift+R'));
    assert.ok(!matchesAccelerator(key('r', { altKey: true }), 'Alt+Shift+R'));
    assert.ok(!matchesAccelerator(key('r', { altKey: true, shiftKey: true, ctrlKey: true }), 'Alt+Shift+R'));
    assert.ok(matchesAccelerator(key('Z', { ctrlKey: true, shiftKey: true }), 'CmdOrCtrl+Shift+Z'));
    assert.ok(matchesAccelerator(key(' '), 'Space'));
    assert.ok(!matchesAccelerator(key('x', { ctrlKey: true }), ''));
});

test('accelerators display with Ctrl on Windows', () => {
    assert.equal(formatAccelerator('CmdOrCtrl+Shift+Z'), 'Ctrl+Shift+Z');
    assert.equal(formatAccelerator('Alt+Shift+R'), 'Alt+Shift+R');
});

test("Drift's own hotkeys are not recorded as demo actions", async () => {
    const { stripAppHotkeys } = await import('../src/lib/hotkeys.js');
    const keys = [
        { time: 1, text: 'Ctrl+S' },
        { time: 2, text: 'Alt + Q' },
        { time: 3, text: 'Alt+Shift+S' },
        { time: 4, text: '', typed: true },
    ];
    const kept = stripAppHotkeys(keys, { stop_recording: 'Alt+Q' });
    assert.deepEqual(kept.map(k => k.time), [1, 3, 4]);
    // Defaults fill in: Alt+Shift+S is the default stop key when not overridden.
    assert.deepEqual(stripAppHotkeys(keys, {}).map(k => k.time), [1, 2, 4]);
});
