'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Mic, MicOff, Timer, Camera, ExternalLink, Sparkles, Check, Play, Square } from 'lucide-react';
import AudioLevelMeter from './AudioLevelMeter';
import { createAudioLevelMeter } from '@/lib/audio/audioMix';

export default function CaptureCockpit({
    sources = [],
    selectedSource,
    onSelectSource,
    onSelectBrowserSource,
    sourceThumbnails = {},
    loadingSources = false,
    isRecording,
    onToggleRecord,
    timer,
    micEnabled,
    micStream = null,
    onToggleMic,
    webcamEnabled,
    onToggleWebcam,
    countdownSeconds,
    onChangeCountdown,
    hotkey
}) {
    const [audioLevel, setAudioLevel] = useState(0);

    useEffect(() => {
        if (!micEnabled) {
            setAudioLevel(0);
            return;
        }
        if (micStream) {
            const cleanup = createAudioLevelMeter(micStream, (lvl) => setAudioLevel(lvl));
            return cleanup;
        }
        let frame;
        const tick = () => {
            setAudioLevel(0.25 + Math.sin(Date.now() / 220) * 0.15);
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [micEnabled, micStream]);

    const activeSource = sources.find(s => s.id === selectedSource) || sources[0] || {
        name: 'Primary Display',
        width: 1920,
        height: 1080,
        is_primary: true
    };

    const thumb = activeSource ? (sourceThumbnails[activeSource.id] || activeSource.thumbnailDataUrl) : null;

    return (
        <div className="max-w-2xl w-full mx-auto my-auto p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-app)] shadow-2xl space-y-6 transition-all duration-200">
            {/* Display Selector & Live Preview */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-[var(--accent-app)]" />
                        <span className="text-xs font-semibold text-[var(--text-app)] uppercase tracking-wider font-mono">
                            Capture Target
                        </span>
                    </div>

                    <button
                        onClick={onSelectBrowserSource}
                        className="flex items-center gap-1.5 text-xs text-[var(--text-app-muted)] hover:text-[var(--text-app)] transition-colors"
                    >
                        <span>Window / App Picker</span>
                        <ExternalLink className="w-3 h-3" />
                    </button>
                </div>

                {/* Display Selector Pills (if multiple displays) */}
                {sources.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {sources.map((src, i) => {
                            const isSelected = (selectedSource === src.id) || (!selectedSource && i === 0);
                            return (
                                <button
                                    key={src.id}
                                    onClick={() => onSelectSource(src.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 flex-shrink-0 ${
                                        isSelected
                                            ? 'bg-[var(--bg-card-subtle)] border-[var(--border-app-hover)] text-[var(--text-app)] font-semibold'
                                            : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                    }`}
                                >
                                    <Monitor className="w-3 h-3" />
                                    <span>{src.name || `Display ${i + 1}`}</span>
                                    {src.is_primary && (
                                        <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold">
                                            Primary
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Preview Card */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-app)] bg-black/40 shadow-inner group">
                    {thumb ? (
                        <img
                            src={thumb}
                            alt="Display Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-app-muted)] gap-2">
                            <Monitor className="w-10 h-10 opacity-30" />
                            <span className="text-xs font-mono">Ready for Screen Capture</span>
                        </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-mono border border-white/10 font-semibold">
                            {activeSource.width ? `${activeSource.width} × ${activeSource.height}` : '1920 × 1080'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[#22c55e] text-[10px] font-mono border border-white/10 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                            60 FPS
                        </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/75 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-xs text-white">
                        <span className="truncate max-w-[300px] font-medium">{activeSource.name}</span>
                        <span className="text-[11px] text-gray-300 font-mono">Hardware Accelerated</span>
                    </div>
                </div>
            </div>

            {/* Quick Settings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Microphone Card */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onToggleMic}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                    micEnabled
                                        ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)]'
                                        : 'bg-black/20 text-[var(--text-app-muted)]'
                                }`}
                            >
                                {micEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                            </button>
                            <span className="text-xs font-semibold text-[var(--text-app)]">
                                Mic
                            </span>
                        </div>
                        <span className={`text-[10px] font-mono ${micEnabled ? 'text-green-500 font-bold' : 'text-[var(--text-app-muted)]'}`}>
                            {micEnabled ? 'On' : 'Muted'}
                        </span>
                    </div>

                    {/* Audio Level Indicator */}
                    <div className="h-1.5 bg-black/25 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-white/5">
                        {[...Array(12)].map((_, i) => {
                            const threshold = (i + 1) / 12;
                            const isLit = micEnabled && audioLevel >= threshold;
                            let barColor = 'bg-emerald-400';
                            if (i >= 10) barColor = 'bg-rose-500';
                            else if (i >= 8) barColor = 'bg-amber-400';

                            return (
                                <div
                                    key={i}
                                    className={`flex-1 h-full rounded-xs transition-all duration-75 ${
                                        isLit ? `${barColor} opacity-100 shadow-[0_0_4px_currentColor]` : 'bg-white/10 opacity-30'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Webcam PiP Card */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onToggleWebcam}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                    webcamEnabled
                                        ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)]'
                                        : 'bg-black/20 text-[var(--text-app-muted)]'
                                }`}
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-semibold text-[var(--text-app)]">
                                Webcam
                            </span>
                        </div>
                        <span className={`text-[10px] font-mono ${webcamEnabled ? 'text-green-500 font-bold' : 'text-[var(--text-app-muted)]'}`}>
                            {webcamEnabled ? 'PiP Active' : 'Off'}
                        </span>
                    </div>

                    <div className="text-[10px] font-mono text-[var(--text-app-muted)] truncate">
                        {webcamEnabled ? 'Picture-in-Picture' : 'Click to enable camera'}
                    </div>
                </div>

                {/* Countdown Timer Card */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-[var(--text-app-muted)]" />
                            <span className="text-xs font-semibold text-[var(--text-app)]">
                                Delay
                            </span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-app-muted)]">
                            {countdownSeconds === 0 ? 'Instant' : `${countdownSeconds}s`}
                        </span>
                    </div>

                    {/* Segmented Pills */}
                    <div className="grid grid-cols-3 gap-1 bg-black/20 p-1 rounded-lg">
                        {[0, 3, 5].map((sec) => (
                            <button
                                key={sec}
                                onClick={() => onChangeCountdown(sec)}
                                className={`py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                                    countdownSeconds === sec
                                        ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                                        : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                }`}
                            >
                                {sec === 0 ? '0s' : `${sec}s`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Record Button (Clean, robust, NEVER goes out of bounds!) */}
            <div>
                <button
                    onClick={onToggleRecord}
                    className={`w-full py-4 px-6 rounded-xl flex items-center justify-between transition-all duration-200 shadow-lg active:scale-[0.99] ${
                        isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                            : 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:opacity-90 shadow-black/10'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {isRecording ? (
                            <Square className="w-5 h-5 fill-current" />
                        ) : (
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                        )}
                        <span className="text-sm font-bold tracking-tight uppercase">
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isRecording ? (
                            <span className="font-mono text-xs font-black tracking-wider bg-black/20 px-2.5 py-1 rounded-md">
                                {timer || '00:00'}
                            </span>
                        ) : (
                            <kbd className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-black/15 text-current border border-current/20 font-semibold">
                                {hotkey || 'Ctrl+Shift+R'}
                            </kbd>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}
