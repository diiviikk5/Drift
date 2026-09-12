'use client';

import React from 'react';
import { Monitor, Film, Keyboard, Plus, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DesktopHeader({
    viewMode,
    setViewMode,
    platform,
    hookStatus,
    onOpenHotkeys,
    onNewRecording,
    hasRecording,
    recordingTime,
    isRecording,
    clickCount
}) {
    return (
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.08] bg-[#090A10]/95 backdrop-blur-2xl flex-shrink-0 z-40 select-none">
            {/* Brand & Identity */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DCFE50] to-[#88B800] flex items-center justify-center text-black font-black text-base shadow-[0_0_16px_rgba(220,254,80,0.35)]">
                        D
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm tracking-tight text-white font-mono">DRIFT STUDIO</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DCFE50]/15 text-[#DCFE50] border border-[#DCFE50]/30 font-semibold">
                                v2.0
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">Cinema Screen Recorder & Auto-Zoom</p>
                    </div>
                </div>

                {/* Live Mode Tabs */}
                <div className="hidden sm:flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] ml-2">
                    <button
                        onClick={() => setViewMode('recorder')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'recorder'
                                ? 'bg-[#DCFE50] text-[#07070A] shadow-md font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Capture</span>
                        {isRecording && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-0.5" />
                        )}
                    </button>
                    <button
                        onClick={() => {
                            if (hasRecording) setViewMode('studio');
                        }}
                        disabled={!hasRecording}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'studio'
                                ? 'bg-[#DCFE50] text-[#07070A] shadow-md font-bold'
                                : hasRecording
                                ? 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                                : 'text-gray-600 opacity-50 cursor-not-allowed'
                        }`}
                    >
                        <Film className="w-3.5 h-3.5" />
                        <span>Studio</span>
                        {hasRecording && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-white font-mono">
                                Active
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Recording Status Pill (if recording) */}
            {isRecording ? (
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-mono font-bold tracking-wider">{recordingTime}</span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-[11px] font-mono text-gray-300">{clickCount} Clicks</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-red-300">REC</span>
                </div>
            ) : null}

            {/* Right Controls & Telemetry */}
            <div className="flex items-center gap-3">
                {/* Hardware Status */}
                <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-gray-400 bg-white/[0.03] px-3.5 py-1.5 rounded-lg border border-white/[0.06]">
                    <span className="flex items-center gap-1.5 text-[#DCFE50]">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>WGPU 60fps</span>
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-300">{platform === 'tauri' ? 'Tauri Native' : 'Desktop'}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-emerald-400">{hookStatus?.includes('Active') ? '240Hz Telemetry' : hookStatus}</span>
                </div>

                {/* Hotkeys */}
                <button
                    onClick={onOpenHotkeys}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/[0.08] transition-all"
                >
                    <Keyboard className="w-3.5 h-3.5 text-gray-400" />
                    <span>Hotkeys</span>
                </button>

                {/* New Session Button in Studio */}
                {viewMode === 'studio' && (
                    <button
                        onClick={onNewRecording}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-black bg-[#DCFE50] hover:bg-[#c9ea3e] shadow-[0_0_12px_rgba(220,254,80,0.25)] transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Capture</span>
                    </button>
                )}
            </div>
        </header>
    );
}
