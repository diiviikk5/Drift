'use client';

import React from 'react';
import { Keyboard, X } from 'lucide-react';

export default function HotkeyModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const shortcuts = [
        { key: 'Ctrl + Shift + R', label: 'Toggle Recording (Start / Stop)' },
        { key: 'Ctrl + Shift + S', label: 'Instant Stop Recording' },
        { key: 'Ctrl + Shift + P', label: 'Pause / Resume Recording' },
        { key: 'Ctrl + Shift + Z', label: 'Trigger Zoom Keyframe at Mouse' },
        { key: 'Space', label: 'Play / Pause Video in Studio' },
        { key: 'Esc', label: 'Reset Camera / Cancel Countdown' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <div className="max-w-md w-full rounded-2xl bg-[#0D0E16] border border-white/[0.1] shadow-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Keyboard className="w-5 h-5 text-[#DCFE50]" />
                        <h3 className="text-lg font-bold text-white tracking-tight">Keyboard Shortcuts</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2">
                    {shortcuts.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                        >
                            <span className="text-xs text-gray-300">{item.label}</span>
                            <kbd className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-xs font-bold border border-white/20">
                                {item.key}
                            </kbd>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold text-xs transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
