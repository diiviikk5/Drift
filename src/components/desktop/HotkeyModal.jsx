'use client';

import React, { useState, useEffect } from 'react';
import { Keyboard, X, Sparkles, Check, RotateCcw } from 'lucide-react';

export default function HotkeyModal({
    isOpen,
    hotkeys = {},
    onUpdate,
    onSave,
    onClose,
    platform = 'tauri'
}) {
    // Also support conditional render if parent passes showHotkeySettings directly
    if (isOpen === false) return null;

    const [capturing, setCapturing] = useState(null); // which key action is being captured
    const [localHotkeys, setLocalHotkeys] = useState({
        toggle_recording: 'CmdOrCtrl+Shift+R',
        stop_recording: 'CmdOrCtrl+Shift+S',
        toggle_pause: 'CmdOrCtrl+Shift+P',
        toggle_zoom: 'CmdOrCtrl+Shift+Z',
        ...hotkeys
    });

    useEffect(() => {
        if (hotkeys && Object.keys(hotkeys).length > 0) {
            setLocalHotkeys(prev => ({ ...prev, ...hotkeys }));
        }
    }, [hotkeys]);

    // Capture key combinations
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

    const handleSave = () => {
        if (onSave) onSave(localHotkeys);
        onClose();
    };

    const entries = [
        { key: 'toggle_recording', label: 'Start / Stop Recording', defaultKey: 'Ctrl+Shift+R' },
        { key: 'stop_recording', label: 'Instant Force Stop', defaultKey: 'Ctrl+Shift+S' },
        { key: 'toggle_pause', label: 'Pause / Resume Recording', defaultKey: 'Ctrl+Shift+P' },
        { key: 'toggle_zoom', label: 'Trigger Auto-Zoom Keyframe', defaultKey: 'Ctrl+Shift+Z' },
    ];

    const staticShortcuts = [
        { key: 'Space', label: 'Play / Pause Video (in Studio)' },
        { key: 'Esc', label: 'Cancel Countdown / Reset Zoom' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-in fade-in duration-150">
            <div className="max-w-md w-full rounded-2xl bg-[#0D0E16] border border-white/[0.1] shadow-2xl p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#DCFE50]/15 border border-[#DCFE50]/30 flex items-center justify-center text-[#DCFE50]">
                            <Keyboard className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-tight">Global Shortcuts</h3>
                            <p className="text-[11px] text-gray-400">Click any shortcut to rebind with custom keys</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Interactive Hotkey Rebind List */}
                <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider">
                        Configurable Global Hotkeys
                    </label>
                    {entries.map((item) => {
                        const isBinding = capturing === item.key;
                        const currentVal = localHotkeys[item.key] || item.defaultKey;
                        const formatted = currentVal.replace('CmdOrCtrl', 'Ctrl');

                        return (
                            <button
                                key={item.key}
                                onClick={() => setCapturing(isBinding ? null : item.key)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                                    isBinding
                                        ? 'bg-[#DCFE50]/10 border-[#DCFE50] shadow-[0_0_15px_rgba(220,254,80,0.15)] ring-1 ring-[#DCFE50]/40'
                                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                                }`}
                            >
                                <span className="text-xs font-medium text-gray-200">{item.label}</span>
                                <kbd
                                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                                        isBinding
                                            ? 'bg-[#DCFE50] text-black border-[#DCFE50] animate-pulse'
                                            : 'bg-black/40 text-[#DCFE50] border-white/[0.1]'
                                    }`}
                                >
                                    {isBinding ? '⏎ Press keys...' : formatted}
                                </kbd>
                            </button>
                        );
                    })}
                </div>

                {/* Static Workspace Shortcuts */}
                <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                    <label className="text-[10px] font-mono uppercase font-bold text-gray-500 tracking-wider">
                        Workspace Hotkeys
                    </label>
                    <div className="space-y-1.5">
                        {staticShortcuts.map((s, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] text-xs"
                            >
                                <span className="text-gray-400 text-[11px]">{s.label}</span>
                                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] text-gray-300 font-mono text-[10px] border border-white/[0.08]">
                                    {s.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2.5 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-gray-300 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-2.5 rounded-xl bg-[#DCFE50] hover:bg-[#c9ea3e] text-black text-xs font-extrabold uppercase tracking-wide shadow-[0_0_15px_rgba(220,254,80,0.25)] transition-all flex items-center justify-center gap-1.5"
                    >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Save & Apply</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
