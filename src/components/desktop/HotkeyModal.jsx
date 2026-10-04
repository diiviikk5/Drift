'use client';

import React, { useState, useEffect } from 'react';
import { Keyboard, X, Check, Globe } from 'lucide-react';
import { DEFAULT_HOTKEYS, GLOBAL_HOTKEY_ACTIONS, formatAccelerator } from '@/lib/hotkeys';
import drift from '@/lib/tauri-bridge';

export default function HotkeyModal({
    isOpen,
    hotkeys = {},
    onUpdate,
    onSave,
    onClose
}) {
    const [capturing, setCapturing] = useState(null);
    const [localHotkeys, setLocalHotkeys] = useState({ ...DEFAULT_HOTKEYS, ...hotkeys });
    const [closeToTray, setCloseToTrayState] = useState(true);
    const isDesktopApp = drift.isTauri();

    useEffect(() => {
        if (isDesktopApp) drift.getCloseToTray().then(setCloseToTrayState);
    }, [isDesktopApp]);

    useEffect(() => {
        if (hotkeys && Object.keys(hotkeys).length > 0) {
            setLocalHotkeys(prev => ({ ...prev, ...hotkeys }));
        }
    }, [hotkeys]);

    // Key capture
    useEffect(() => {
        if (!capturing) return;

        const handleKeyDown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const parts = [];
            if (e.ctrlKey || e.metaKey) parts.push('CmdOrCtrl');
            if (e.altKey) parts.push('Alt');
            if (e.shiftKey) parts.push('Shift');

            const ignore = ['Control', 'Shift', 'Alt', 'Meta'];
            if (ignore.includes(e.key)) return;

            const keyMap = {
                ' ': 'Space',
                'ArrowUp': 'Up',
                'ArrowDown': 'Down',
                'ArrowLeft': 'Left',
                'ArrowRight': 'Right',
                'Escape': 'Escape'
            };

            const keyName = keyMap[e.key] || (e.key.length === 1 ? e.key.toUpperCase() : e.key);

            if (keyName === 'Escape' && parts.length === 0) {
                setCapturing(null);
                return;
            }

            parts.push(keyName);
            const combo = parts.join('+');

            setLocalHotkeys(prev => ({ ...prev, [capturing]: combo }));
            if (onUpdate) {
                onUpdate(prev => ({ ...prev, [capturing]: combo }));
            }
            setCapturing(null);
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [capturing, onUpdate]);

    if (isOpen === false) return null;

    const handleSave = () => {
        if (onSave) onSave(localHotkeys);
        onClose();
    };

    const toggleCloseToTray = async () => {
        const next = !closeToTray;
        setCloseToTrayState(next);
        try { await drift.setCloseToTray(next); } catch (e) { setCloseToTrayState(!next); }
    };

    const entries = [
        { key: 'toggle_recording', label: 'Start / Stop Recording' },
        { key: 'stop_recording', label: 'Stop Recording' },
        { key: 'toggle_pause', label: 'Play / Pause (Studio)' },
        { key: 'toggle_zoom', label: 'Add Zoom at Playhead (Studio)' },
    ];

    const staticShortcuts = [
        { key: 'Space', label: 'Play / Pause Video (in Studio)' },
        { key: 'Esc', label: 'Cancel Countdown / Reset' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none animate-in fade-in duration-150">
            <div className="max-w-md w-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-app)] shadow-2xl p-6 space-y-5 text-[var(--text-app)]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-app)] flex items-center justify-center text-[var(--accent-app)]">
                            <Keyboard className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold tracking-tight">Keyboard Shortcuts</h3>
                            <p className="text-[11px] text-[var(--text-app-muted)]">Click any shortcut to rebind</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-app-muted)] hover:text-[var(--text-app)]"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Configurable Shortcuts */}
                <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-semibold text-[var(--text-app-muted)] tracking-wider">
                        Configurable Hotkeys
                    </label>
                    {entries.map((item) => {
                        const isBinding = capturing === item.key;
                        const currentVal = localHotkeys[item.key] || DEFAULT_HOTKEYS[item.key];
                        const formatted = formatAccelerator(currentVal);
                        const isGlobal = isDesktopApp && GLOBAL_HOTKEY_ACTIONS.includes(item.key);

                        return (
                            <button
                                key={item.key}
                                onClick={() => setCapturing(isBinding ? null : item.key)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                                    isBinding
                                        ? 'bg-[var(--bg-card-subtle)] border-[var(--accent-app)] ring-1 ring-[var(--accent-app)]'
                                        : 'border-[var(--border-app)] hover:border-[var(--border-app-hover)]'
                                }`}
                            >
                                <span className="text-xs text-[var(--text-app)] flex items-center gap-1.5">
                                    {item.label}
                                    {isGlobal && (
                                        <span title="Works even when Drift is in the background or tray" className="text-[var(--accent-app)]">
                                            <Globe className="w-3 h-3" />
                                        </span>
                                    )}
                                </span>
                                <kbd
                                    className={`px-2 py-0.5 rounded-md font-mono text-xs font-semibold border ${
                                        isBinding
                                            ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] border-[var(--accent-app)] animate-pulse'
                                            : 'bg-[var(--bg-card-subtle)] text-[var(--accent-app)] border-[var(--border-app)]'
                                    }`}
                                >
                                    {isBinding ? '⏎ Press keys...' : formatted}
                                </kbd>
                            </button>
                        );
                    })}
                </div>

                {/* Workspace Shortcuts */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-app)]">
                    <label className="text-[10px] font-mono uppercase font-semibold text-[var(--text-app-muted)] tracking-wider">
                        Workspace Hotkeys
                    </label>
                    <div className="space-y-1">
                        {staticShortcuts.map((s, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs"
                            >
                                <span className="text-[var(--text-app-muted)] text-[11px]">{s.label}</span>
                                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-app)] font-mono text-[10px] border border-[var(--border-app)]">
                                    {s.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>

                {isDesktopApp && (
                    <div className="pt-2 border-t border-[var(--border-app)] space-y-1.5">
                        <p className="text-[10px] text-[var(--text-app-muted)] flex items-center gap-1.5">
                            <Globe className="w-3 h-3 text-[var(--accent-app)]" />
                            Works anywhere, even when Drift is minimized or in the tray. Stopping opens the studio with your recording.
                        </p>
                        <button
                            type="button"
                            onClick={toggleCloseToTray}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-app)] hover:border-[var(--border-app-hover)] text-left"
                        >
                            <span>
                                <span className="block text-xs text-[var(--text-app)]">Keep running in the tray when closed</span>
                                <span className="block text-[10px] text-[var(--text-app-muted)]">Quit from the tray icon menu</span>
                            </span>
                            <span className={`w-9 h-5 rounded-full relative transition-all flex-shrink-0 ${closeToTray ? 'bg-[var(--accent-app)]' : 'bg-gray-600'}`}>
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${closeToTray ? 'left-[18px]' : 'left-0.5'}`} />
                            </span>
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-card-subtle)]/80 text-xs font-medium text-[var(--text-app-muted)] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-2.5 rounded-xl bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:opacity-90 text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Save Shortcuts</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
