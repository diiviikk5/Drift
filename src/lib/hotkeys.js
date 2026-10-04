/**
 * Hotkey defaults and helpers shared by the recorder and the settings modal.
 *
 * Only the recording keys are registered system-wide (they must work while
 * Drift is in the background or tray). Studio keys only apply while Drift is
 * focused, so they never steal shortcuts from other apps.
 */

export const DEFAULT_HOTKEYS = {
    toggle_recording: 'Alt+Shift+R',
    stop_recording: 'Alt+Shift+S',
    toggle_pause: 'CmdOrCtrl+Shift+P',
    toggle_zoom: 'CmdOrCtrl+Shift+Z',
};

export const GLOBAL_HOTKEY_ACTIONS = ['toggle_recording', 'stop_recording'];

const CUT = new Set(['cmdorctrl+x', 'ctrl+x', 'control+x', 'commandorcontrol+x']);

/** Fill gaps and move away from the old system-wide Ctrl+X binding. */
export function normalizeHotkeys(saved) {
    const out = { ...DEFAULT_HOTKEYS, ...(saved || {}) };
    for (const action of GLOBAL_HOTKEY_ACTIONS) {
        if (CUT.has(String(out[action] || '').replace(/\s+/g, '').toLowerCase())) out[action] = DEFAULT_HOTKEYS[action];
    }
    return out;
}

/** Human-readable accelerator, e.g. "CmdOrCtrl+Shift+Z" -> "Ctrl+Shift+Z". */
export function formatAccelerator(accel) {
    return String(accel || '').replace(/^(CmdOrCtrl|CommandOrControl)/i, 'Ctrl');
}

/** Does a keydown event match an accelerator string? */
export function matchesAccelerator(e, accel) {
    if (!accel) return false;
    const parts = String(accel).split('+').map(p => p.trim().toLowerCase());
    const key = parts.pop();
    const want = {
        ctrl: parts.some(p => ['cmdorctrl', 'commandorcontrol', 'ctrl', 'control', 'cmd', 'command', 'meta', 'super'].includes(p)),
        alt: parts.includes('alt') || parts.includes('option'),
        shift: parts.includes('shift'),
    };
    if ((e.ctrlKey || e.metaKey) !== want.ctrl || e.altKey !== want.alt || e.shiftKey !== want.shift) return false;
    const pressed = e.key === ' ' ? 'space' : String(e.key).toLowerCase();
    const code = String(e.code || '').toLowerCase().replace(/^key|^digit/, '');
    return pressed === key || code === key;
}
