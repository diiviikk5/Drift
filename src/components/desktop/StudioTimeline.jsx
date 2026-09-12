'use client';

import React, { useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Scissors, Sparkles, Volume2, ZoomIn } from 'lucide-react';

export default function StudioTimeline({
    isPlaying,
    onTogglePlay,
    currentTime,
    duration,
    onSeek,
    zoomSegments = [],
    clicks = [],
    onAddZoom,
    onClearZooms
}) {
    const trackRef = useRef(null);

    const formatTime = (s) => {
        if (!s || isNaN(s)) return '00:00.0';
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        const ms = Math.floor((s % 1) * 10);
        return `${m}:${sec}.${ms}`;
    };

    const handleTrackClick = (e) => {
        if (!trackRef.current || !duration) return;
        const rect = trackRef.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        onSeek(pct * duration);
    };

    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="bg-[#0B0C13]/95 backdrop-blur-2xl border-t border-white/[0.08] p-4 select-none flex-shrink-0 space-y-3">
            {/* Top Bar: Playback Controls & Keyframe Tools */}
            <div className="flex items-center justify-between">
                {/* Transport Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onTogglePlay}
                        className="w-10 h-10 rounded-xl bg-[#DCFE50] hover:bg-[#c8ea3e] text-black flex items-center justify-center shadow-[0_0_15px_rgba(220,254,80,0.3)] transition-all font-bold"
                        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                    </button>

                    {/* Timecode */}
                    <div className="flex items-center gap-1.5 font-mono text-xs bg-white/[0.04] px-3 py-2 rounded-xl border border-white/[0.08]">
                        <span className="text-[#DCFE50] font-bold">{formatTime(currentTime)}</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-400">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Zoom Pins Badges & Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.06]">
                        <ZoomIn className="w-3.5 h-3.5 text-[#DCFE50]" />
                        <span className="font-mono font-bold text-white">{clicks.length}</span>
                        <span className="text-gray-400">Zoom Focal Points</span>
                    </div>

                    <button
                        onClick={onAddZoom}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08] transition-all"
                    >
                        <span>+ Add Zoom at Cursor</span>
                    </button>

                    {clicks.length > 0 && (
                        <button
                            onClick={onClearZooms}
                            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                        >
                            Reset Zooms
                        </button>
                    )}
                </div>
            </div>

            {/* Scrubber Track with Zoom Markers */}
            <div
                ref={trackRef}
                onClick={handleTrackClick}
                className="relative h-12 w-full bg-[#11121C] rounded-xl border border-white/[0.08] overflow-hidden cursor-pointer group"
            >
                {/* Simulated Audio Waveform Peaks */}
                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-20 pointer-events-none">
                    {[...Array(60)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-white rounded-full"
                            style={{ height: `${15 + Math.sin(i * 0.4) * 15 + ((i % 5) * 4)}px` }}
                        />
                    ))}
                </div>

                {/* Progress Fill */}
                <div
                    className="absolute top-0 bottom-0 left-0 bg-[#DCFE50]/15 border-r-2 border-[#DCFE50] transition-none pointer-events-none"
                    style={{ width: `${progressPct}%` }}
                />

                {/* Zoom Keyframe Pins */}
                {duration > 0 && clicks.map((click, idx) => {
                    const clickTime = click.time / 1000;
                    const posPct = (clickTime / duration) * 100;

                    return (
                        <div
                            key={idx}
                            style={{ left: `${posPct}%` }}
                            className="absolute top-0 bottom-0 w-1 bg-[#DCFE50] shadow-[0_0_8px_#DCFE50] group/pin pointer-events-auto"
                            title={`Zoom Keyframe ${idx + 1} at ${formatTime(clickTime)}`}
                        >
                            <div className="absolute -top-1 -left-2 w-5 h-5 rounded-full bg-[#DCFE50] text-black text-[9px] font-mono font-black flex items-center justify-center shadow-lg transform group-hover/pin:scale-125 transition-transform">
                                {idx + 1}
                            </div>
                        </div>
                    );
                })}

                {/* Playhead Marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_white] pointer-events-none"
                    style={{ left: `${progressPct}%` }}
                >
                    <div className="w-3 h-3 rounded-full bg-white -ml-[5px] -mt-1 shadow-md" />
                </div>
            </div>
        </div>
    );
}
