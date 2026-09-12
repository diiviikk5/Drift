'use client';

import React, { useRef } from 'react';
import { Play, Pause, ZoomIn, RotateCcw } from 'lucide-react';

export default function StudioTimeline({
    isPlaying,
    onTogglePlay,
    currentTime,
    duration,
    onSeek,
    clicks = [],
    focusSegments = [],
    onDeleteSegment,
    onSelectSegment,
    selectedSegmentId,
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
        <div className="bg-[var(--bg-card)] border-t border-[var(--border-app)] p-4 select-none flex-shrink-0 space-y-3 transition-colors">
            {/* Top Bar: Controls & Zoom Tools */}
            <div className="flex items-center justify-between">
                {/* Transport Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onTogglePlay}
                        className="w-9 h-9 rounded-xl bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:opacity-90 flex items-center justify-center shadow-sm transition-all font-bold"
                        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    {/* Timecode */}
                    <div className="flex items-center gap-1.5 font-mono text-xs bg-[var(--bg-card-subtle)] px-3 py-1.5 rounded-lg border border-[var(--border-app)]">
                        <span className="font-bold text-[var(--text-app)]">{formatTime(currentTime)}</span>
                        <span className="text-[var(--text-app-muted)]">/</span>
                        <span className="text-[var(--text-app-muted)]">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Keyframe Badges & Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-app-muted)] bg-[var(--bg-card-subtle)] px-2.5 py-1 rounded-lg border border-[var(--border-app)]">
                        <ZoomIn className="w-3.5 h-3.5 text-[var(--accent-app)]" />
                        <span className="font-mono font-bold text-[var(--text-app)]">{focusSegments?.length || clicks.length}</span>
                        <span>{focusSegments?.length ? 'Focus Tracks' : 'Zooms'}</span>
                    </div>

                    <button
                        onClick={onAddZoom}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-card-subtle)] hover:border-[var(--border-app-hover)] text-xs font-medium text-[var(--text-app)] border border-[var(--border-app)] transition-all"
                    >
                        <span>+ Add Zoom Point</span>
                    </button>

                    {clicks.length > 0 && (
                        <button
                            onClick={onClearZooms}
                            className="text-xs text-[var(--text-app-muted)] hover:text-red-500 transition-colors"
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
                className="relative h-10 w-full bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-app)] overflow-hidden cursor-pointer group shadow-inner"
            >
                {/* Simulated Audio Waveform Peaks */}
                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-25 pointer-events-none">
                    {[...Array(60)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-[var(--text-app)] rounded-full"
                            style={{ height: `${12 + Math.sin(i * 0.4) * 12 + ((i % 5) * 3)}px` }}
                        />
                    ))}
                </div>

                {/* Progress Fill */}
                <div
                    className="absolute top-0 bottom-0 left-0 bg-[var(--accent-app)]/20 border-r-2 border-[var(--accent-app)] pointer-events-none"
                    style={{ width: `${progressPct}%` }}
                />

                {/* Focus Segment Blocks (Screen Studio / OpenScreen style) */}
                {duration > 0 && focusSegments && focusSegments.length > 0 && focusSegments.map((seg, idx) => {
                    const leftPct = (seg.startTime / duration) * 100;
                    const widthPct = Math.max(3, ((seg.endTime - seg.startTime) / duration) * 100);
                    const isSelected = selectedSegmentId === seg.id;

                    return (
                        <div
                            key={seg.id || idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectSegment) onSelectSegment(seg);
                                onSeek(seg.startTime);
                            }}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                            className={`absolute top-1.5 bottom-1.5 rounded-lg flex items-center justify-between px-2 cursor-pointer z-10 transition-all border ${
                                isSelected
                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] border-[var(--accent-app)] shadow-md'
                                    : 'bg-[var(--accent-app)]/20 text-[var(--text-app)] border-[var(--accent-app)]/50 hover:bg-[var(--accent-app)]/35'
                            }`}
                            title={`Focus Region: ${formatTime(seg.startTime)} - ${formatTime(seg.endTime)} (${seg.zoomScale}x)`}
                        >
                            <span className="text-[9px] font-mono font-bold truncate select-none">
                                {seg.reason === 'dwell' ? '👁 Dwell' : '⚡ Focus'} {seg.zoomScale}x
                            </span>
                            {onDeleteSegment && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteSegment(seg.id);
                                    }}
                                    className="opacity-60 hover:opacity-100 hover:text-red-400 text-xs font-bold ml-1 px-1 transition-opacity"
                                    title="Delete focus segment"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    );
                })}

                {/* Individual Click Keyframe Pins (if no focusSegments or complementary) */}
                {duration > 0 && (!focusSegments || focusSegments.length === 0) && clicks.map((click, idx) => {
                    const clickTime = click.time / 1000;
                    const posPct = (clickTime / duration) * 100;

                    return (
                        <div
                            key={idx}
                            style={{ left: `${posPct}%` }}
                            className="absolute top-0 bottom-0 w-1 bg-[var(--accent-app)] shadow-sm group/pin pointer-events-auto"
                            title={`Zoom Keyframe ${idx + 1} at ${formatTime(clickTime)}`}
                        >
                            <div className="absolute -top-1 -left-2 w-4 h-4 rounded-full bg-[var(--accent-app)] text-[var(--accent-app-fg)] text-[8px] font-mono font-black flex items-center justify-center shadow-md transform group-hover/pin:scale-125 transition-transform">
                                {idx + 1}
                            </div>
                        </div>
                    );
                })}

                {/* Playhead Marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[var(--text-app)] shadow-sm pointer-events-none z-20"
                    style={{ left: `${progressPct}%` }}
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-app)] -ml-[4px] -mt-1 shadow-md" />
                </div>
            </div>
        </div>
    );
}
