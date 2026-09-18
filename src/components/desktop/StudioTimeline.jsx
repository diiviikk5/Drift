'use client';

import React, { useRef } from 'react';
import { Play, Pause, ZoomIn, ArrowUpRight, Square, Type, Gauge } from 'lucide-react';

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
    onUpdateSegment,
    selectedSegmentId,
    onAddZoom,
    onClearZooms,
    annotations = [],
    onAddAnnotation,
    trimStart = 0,
    onChangeTrimStart,
    trimEnd = 0,
    onChangeTrimEnd,
    onAddFocusSegment,
    onSplitSegment,
}) {
    const trackRef = useRef(null);

    const handleResizeStart = (e, seg, edge) => {
        e.stopPropagation();
        e.preventDefault();
        const startX = e.clientX;
        const origStartTime = seg.startTime;
        const origEndTime = seg.endTime;
        const trackWidth = trackRef.current ? trackRef.current.getBoundingClientRect().width : 1;

        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dt = (dx / trackWidth) * duration;
            if (edge === 'start') {
                const newStart = Math.max(0, Math.min(origEndTime - 0.2, origStartTime + dt));
                if (onUpdateSegment) onUpdateSegment(seg.id, { startTime: newStart });
            } else {
                const newEnd = Math.max(origStartTime + 0.2, Math.min(duration, origEndTime + dt));
                if (onUpdateSegment) onUpdateSegment(seg.id, { endTime: newEnd });
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

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
    const selectedSeg = focusSegments.find(s => s.id === selectedSegmentId);
    const effectiveTrimEnd = (trimEnd > 0 && trimEnd <= duration) ? trimEnd : duration;

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

                    {/* Timeline Range In/Out Trim */}
                    <div className="flex items-center bg-[var(--bg-card-subtle)] border border-[var(--border-app)] rounded-lg p-0.5 gap-1 text-[11px] font-mono">
                        <button
                            onClick={() => onChangeTrimStart && onChangeTrimStart(currentTime)}
                            className="px-2 py-1 rounded-md text-[var(--text-app-muted)] hover:text-[var(--accent-app)] hover:bg-[var(--bg-card)] transition-all font-semibold"
                            title="Set In-Point / Trim Start at current playhead"
                        >
                            [ In ({formatTime(trimStart)})
                        </button>
                        <button
                            onClick={() => onChangeTrimEnd && onChangeTrimEnd(currentTime)}
                            className="px-2 py-1 rounded-md text-[var(--text-app-muted)] hover:text-[var(--accent-app)] hover:bg-[var(--bg-card)] transition-all font-semibold"
                            title="Set Out-Point / Trim End at current playhead"
                        >
                            ] Out ({formatTime(effectiveTrimEnd)})
                        </button>
                        {(trimStart > 0 || (trimEnd > 0 && trimEnd < duration)) && (
                            <button
                                onClick={() => {
                                    if (onChangeTrimStart) onChangeTrimStart(0);
                                    if (onChangeTrimEnd) onChangeTrimEnd(duration);
                                }}
                                className="px-1.5 py-1 text-red-400 hover:text-red-300 transition-colors"
                                title="Reset Trim Range"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Keyframe Badges, Annotation Tools & Actions */}
                <div className="flex items-center gap-2">
                    {/* Annotation Presets */}
                    <div className="flex items-center bg-[var(--bg-card-subtle)] border border-[var(--border-app)] rounded-lg p-0.5 gap-0.5">
                        <button
                            onClick={() => onAddAnnotation && onAddAnnotation('arrow')}
                            className="p-1.5 rounded-md text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-all"
                            title="Add Directional Arrow"
                        >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onAddAnnotation && onAddAnnotation('rect')}
                            className="p-1.5 rounded-md text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-all"
                            title="Add Box Highlight"
                        >
                            <Square className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onAddAnnotation && onAddAnnotation('text')}
                            className="p-1.5 rounded-md text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-all"
                            title="Add Text Callout"
                        >
                            <Type className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-app-muted)] bg-[var(--bg-card-subtle)] px-2.5 py-1.5 rounded-lg border border-[var(--border-app)]">
                        <ZoomIn className="w-3.5 h-3.5 text-[var(--accent-app)]" />
                        <span className="font-mono font-bold text-[var(--text-app)]">{focusSegments?.length || clicks.length}</span>
                        <span>{focusSegments?.length ? 'Focus Tracks' : 'Zooms'}</span>
                    </div>

                    <button
                        onClick={onAddZoom}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:opacity-90 text-xs font-bold transition-all shadow-xs"
                    >
                        <span>+ Zoom Point</span>
                    </button>

                    {clicks.length > 0 && (
                        <button
                            onClick={onClearZooms}
                            className="text-xs text-[var(--text-app-muted)] hover:text-red-500 transition-colors px-1"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Selected Segment Speed & Depth Tuning Bar */}
            {selectedSeg && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--accent-app)] text-xs animate-fadeIn">
                    {/* Scene Mode Selector */}
                    <div className="flex items-center gap-1.5 border-r border-[var(--border-app)] pr-2.5">
                        <span className="font-mono font-bold text-[var(--accent-app)] text-[10px] uppercase">
                            Scene:
                        </span>
                        <div className="flex gap-1">
                            {[
                                { id: 'focus', label: '⚡ Focus' },
                                { id: 'spotlight', label: '🎙️ Spotlight' },
                                { id: 'full-camera', label: '🎥 Full Camera' },
                                { id: 'overview', label: '🖥️ Overview' },
                                { id: 'speed', label: '⏩ Speed Ramp' },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => onUpdateSegment && onUpdateSegment(selectedSeg.id, { sceneMode: mode.id })}
                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-all ${
                                        (selectedSeg.sceneMode || 'focus') === mode.id
                                            ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                                            : 'bg-black/20 text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                    }`}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 font-mono font-bold text-[var(--accent-app)] text-[10px] uppercase">
                            <Gauge className="w-3 h-3" />
                            <span>Segment Speed:</span>
                        </div>
                        <div className="flex gap-1">
                            {[0.5, 1.0, 1.5, 2.0, 4.0].map((spd) => (
                                <button
                                    key={spd}
                                    onClick={() => onUpdateSegment && onUpdateSegment(selectedSeg.id, { speed: spd })}
                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-all ${
                                        (selectedSeg.speed || 1.0) === spd
                                            ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                                            : 'bg-black/20 text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                    }`}
                                >
                                    {spd}x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--text-app-muted)]">
                            Depth:
                        </span>
                        <div className="flex gap-1">
                            {[1.4, 1.8, 2.2, 2.8].map((z) => (
                                <button
                                    key={z}
                                    onClick={() => onUpdateSegment && onUpdateSegment(selectedSeg.id, { zoomScale: z })}
                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] transition-all ${
                                        (selectedSeg.zoomScale || 1.8) === z
                                            ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold'
                                            : 'bg-black/20 text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                    }`}
                                >
                                    {z}x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {currentTime > selectedSeg.startTime + 0.1 && currentTime < selectedSeg.endTime - 0.1 && (
                            <button
                                onClick={() => {
                                    if (onSplitSegment) {
                                        onSplitSegment(selectedSeg.id, currentTime);
                                    } else if (onUpdateSegment && onAddFocusSegment) {
                                        const oldEnd = selectedSeg.endTime;
                                        onUpdateSegment(selectedSeg.id, { endTime: currentTime });
                                        onAddFocusSegment({
                                            ...selectedSeg,
                                            id: 'seg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
                                            startTime: currentTime,
                                            endTime: oldEnd,
                                        });
                                    }
                                }}
                                className="px-2 py-0.5 bg-[var(--accent-app)]/20 text-[var(--accent-app)] hover:bg-[var(--accent-app)] hover:text-[var(--accent-app-fg)] rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1"
                                title="Split segment into two at current playhead"
                            >
                                <span>✂ Split</span>
                            </button>
                        )}
                        <button
                            onClick={() => {
                                const segDuration = selectedSeg.endTime - selectedSeg.startTime;
                                const newStart = Math.min(duration - 0.2, currentTime);
                                const newEnd = Math.min(duration, newStart + segDuration);
                                if (onAddFocusSegment) {
                                    onAddFocusSegment({
                                        ...selectedSeg,
                                        id: 'seg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
                                        startTime: newStart,
                                        endTime: newEnd,
                                    });
                                }
                            }}
                            className="px-1.5 py-0.5 bg-black/20 text-[var(--text-app-muted)] hover:text-[var(--text-app)] rounded text-[10px] font-mono"
                            title="Duplicate this segment at playhead"
                        >
                            + Copy
                        </button>
                        <button
                            onClick={() => {
                                const newStart = Math.max(0, selectedSeg.startTime - 0.5);
                                onUpdateSegment && onUpdateSegment(selectedSeg.id, { startTime: newStart });
                            }}
                            className="px-1.5 py-0.5 bg-black/20 text-[var(--text-app-muted)] hover:text-[var(--text-app)] rounded text-[10px] font-mono"
                            title="Expand start by 0.5s"
                        >
                            -0.5s
                        </button>
                        <button
                            onClick={() => {
                                const newEnd = Math.min(duration, selectedSeg.endTime + 0.5);
                                onUpdateSegment && onUpdateSegment(selectedSeg.id, { endTime: newEnd });
                            }}
                            className="px-1.5 py-0.5 bg-black/20 text-[var(--text-app-muted)] hover:text-[var(--text-app)] rounded text-[10px] font-mono"
                            title="Extend end by 0.5s"
                        >
                            +0.5s
                        </button>
                        <button
                            onClick={() => onDeleteSegment && onDeleteSegment(selectedSeg.id)}
                            className="text-[10px] text-red-400 hover:text-red-300 font-mono ml-1 font-semibold"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

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

                {/* Trim Out-of-bounds Shading */}
                {duration > 0 && trimStart > 0 && (
                    <div
                        className="absolute top-0 bottom-0 left-0 bg-black/60 backdrop-blur-[1px] border-r-2 border-red-500/70 z-15 pointer-events-none"
                        style={{ width: `${(trimStart / duration) * 100}%` }}
                    />
                )}
                {duration > 0 && effectiveTrimEnd < duration && (
                    <div
                        className="absolute top-0 bottom-0 right-0 bg-black/60 backdrop-blur-[1px] border-l-2 border-red-500/70 z-15 pointer-events-none"
                        style={{ width: `${((duration - effectiveTrimEnd) / duration) * 100}%` }}
                    />
                )}

                {/* Focus Segment Blocks */}
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
                            className={`group/seg absolute top-1.5 bottom-1.5 rounded-lg flex items-center justify-between px-2 cursor-pointer z-10 transition-all border ${
                                isSelected
                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] border-[var(--accent-app)] shadow-md font-bold'
                                    : 'bg-[var(--accent-app)]/20 text-[var(--text-app)] border-[var(--accent-app)]/50 hover:bg-[var(--accent-app)]/35'
                            }`}
                            title={`Focus: ${formatTime(seg.startTime)} - ${formatTime(seg.endTime)} (${seg.zoomScale}x, speed ${seg.speed || 1}x)`}
                        >
                            {/* Left Trim Handle */}
                            <div
                                onMouseDown={(e) => handleResizeStart(e, seg, 'start')}
                                className="absolute left-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-white/40 rounded-l flex items-center justify-center opacity-0 group-hover/seg:opacity-100 transition-opacity z-20"
                                title="Drag to trim start time"
                            >
                                <div className="w-0.5 h-3 bg-white/70 rounded-full" />
                            </div>

                            <span className="text-[9px] font-mono font-bold truncate select-none flex items-center gap-1 pl-1">
                                {seg.sceneMode === 'spotlight' ? '🎙️ Spotlight' :
                                 seg.sceneMode === 'overview' ? '🖥️ Overview' :
                                 seg.sceneMode === 'speed' ? `⏩ ${seg.speed || 2}x Speed` :
                                 `${seg.reason === 'dwell' ? '👁' : '⚡'} ${seg.zoomScale}x ${seg.speed && seg.speed !== 1 ? `(${seg.speed}x)` : ''}`}
                            </span>

                            <div className="flex items-center pr-1">
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

                            {/* Right Trim Handle */}
                            <div
                                onMouseDown={(e) => handleResizeStart(e, seg, 'end')}
                                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-white/40 rounded-r flex items-center justify-center opacity-0 group-hover/seg:opacity-100 transition-opacity z-20"
                                title="Drag to trim end time"
                            >
                                <div className="w-0.5 h-3 bg-white/70 rounded-full" />
                            </div>
                        </div>
                    );
                })}

                {/* Annotations Marker Pins */}
                {duration > 0 && annotations && annotations.map((ann, idx) => {
                    const posPct = ((ann.startTime || 0) / duration) * 100;
                    return (
                        <div
                            key={ann.id || idx}
                            style={{ left: `${posPct}%` }}
                            className="absolute bottom-0 w-2 h-2 bg-yellow-400 rounded-full shadow-sm -ml-1 z-15"
                            title={`Annotation: ${ann.type}`}
                        />
                    );
                })}

                {/* Individual Click Keyframe Pins */}
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
