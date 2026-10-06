'use client';

import React, { useRef } from 'react';
import { Play, Pause, ZoomIn, ArrowUpRight, Square, Type, Plus, X, Scissors } from 'lucide-react';

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
    zoomLevel = 1.55,
    onChangeZoomLevel,
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

    // m:ss.d (tabular), e.g. 0:02.3 or 12:04.0
    const formatTime = (s) => {
        if (!s || isNaN(s)) return '0:00.0';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        const tenth = Math.floor((s % 1) * 10);
        return `${m}:${sec}.${tenth}`;
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
        <div className="bg-[var(--bg-card)] border-t border-[var(--border-app)] px-4 py-3 select-none flex-shrink-0 space-y-3">
            {/* Top bar: transport, trim, annotations, zoom */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={onTogglePlay}
                        className="w-9 h-9 rounded-full bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:brightness-105 flex items-center justify-center"
                        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="font-mono text-[13px] px-1">
                        <span className="text-[var(--text-app)]">{formatTime(currentTime)}</span>
                        <span className="text-[var(--text-app-faint)]"> / {formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center h-8 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-app)] p-0.5 text-xs">
                        <span className="flex items-center gap-1 px-2 text-[var(--text-app-muted)]">
                            <Scissors className="w-3.5 h-3.5" />
                            Trim
                        </span>
                        <button
                            onClick={() => onChangeTrimStart && onChangeTrimStart(currentTime)}
                            className="h-full px-2 rounded-md text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-colors"
                            title="Start the video at the playhead"
                        >
                            Start <span className="font-mono text-[var(--text-app)]">{formatTime(trimStart)}</span>
                        </button>
                        <button
                            onClick={() => onChangeTrimEnd && onChangeTrimEnd(currentTime)}
                            className="h-full px-2 rounded-md text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-colors"
                            title="End the video at the playhead"
                        >
                            End <span className="font-mono text-[var(--text-app)]">{formatTime(effectiveTrimEnd)}</span>
                        </button>
                        {(trimStart > 0 || (trimEnd > 0 && trimEnd < duration)) && (
                            <button
                                onClick={() => {
                                    onChangeTrimStart?.(0);
                                    onChangeTrimEnd?.(duration);
                                }}
                                className="h-full px-1.5 rounded-md text-[var(--text-app-muted)] hover:text-red-500 transition-colors"
                                title="Clear trim"
                                aria-label="Clear trim"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center h-8 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-app)] p-0.5 gap-0.5">
                        {[
                            { kind: 'arrow', Icon: ArrowUpRight, title: 'Add an arrow' },
                            { kind: 'rect', Icon: Square, title: 'Add a highlight box' },
                            { kind: 'text', Icon: Type, title: 'Add a text callout' },
                        ].map(({ kind, Icon, title }) => (
                            <button
                                key={kind}
                                onClick={() => onAddAnnotation && onAddAnnotation(kind)}
                                className="h-full px-1.5 rounded-md text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-colors"
                                title={title}
                                aria-label={title}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center h-8 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-app)] p-0.5 gap-0.5 text-xs" title="How close auto-zoom gets">
                        {[
                            { id: 'subtle', scale: 1.35, label: 'Subtle' },
                            { id: 'cinema', scale: 1.55, label: 'Balanced' },
                            { id: 'focus', scale: 1.85, label: 'Close' },
                        ].map((preset) => {
                            const isCurrent = Math.abs((zoomLevel || 1.55) - preset.scale) < 0.05;
                            return (
                                <button
                                    key={preset.id}
                                    onClick={() => onChangeZoomLevel && onChangeZoomLevel(preset.scale)}
                                    className={`h-full px-2.5 rounded-md font-medium transition-colors ${
                                        isCurrent ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-sm' : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                    }`}
                                    title={`${preset.label} zoom (${preset.scale}×)`}
                                >
                                    {preset.label}
                                </button>
                            );
                        })}
                    </div>

                    <span className="flex items-center gap-1.5 h-8 px-2 text-xs text-[var(--text-app-muted)]">
                        <ZoomIn className="w-3.5 h-3.5" />
                        {focusSegments?.length || 0} {(focusSegments?.length || 0) === 1 ? 'zoom' : 'zooms'}
                    </span>

                    <button
                        onClick={onAddZoom}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:brightness-105 text-xs font-medium"
                        title="Add a zoom at the playhead"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add zoom</span>
                    </button>

                    {(focusSegments?.length > 0 || clicks.length > 0) && (
                        <button
                            onClick={onClearZooms}
                            className="h-8 px-2 rounded-lg text-xs text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card-subtle)] transition-colors"
                            title="Re-plan zooms automatically"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Selected zoom: scene, speed, depth, follow, and timing edits */}
            {selectedSeg && (() => {
                const upd = (patch) => onUpdateSegment && onUpdateSegment(selectedSeg.id, patch);
                const seg = selectedSeg;
                const canSplit = currentTime > seg.startTime + 0.1 && currentTime < seg.endTime - 0.1;
                const newId = () => 'seg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
                const Group = ({ label, children }) => (
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] text-[var(--text-app-faint)] shrink-0">{label}</span>
                        {children}
                    </div>
                );
                const Segmented = ({ value, onPick, options }) => (
                    <div className="flex rounded-lg bg-[var(--bg-card)] p-0.5 border border-[var(--border-app)]">
                        {options.map((o) => (
                            <button
                                key={String(o.value)}
                                onClick={() => onPick(o.value)}
                                className={`px-2 h-6 rounded-md text-[11px] tabular-nums transition-colors ${
                                    o.active(value)
                                        ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-semibold'
                                        : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                }`}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                );
                const ghost = 'px-2 h-6 rounded-md text-[11px] text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-colors';
                return (
                    <div className="rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] px-3 py-2 space-y-2 animate-fadeIn">
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                            <div className="flex items-baseline gap-2 text-xs">
                                <span className="font-medium text-[var(--text-app)]">Selected zoom</span>
                                <span className="text-[var(--text-app-faint)] tabular-nums">
                                    {seg.startTime.toFixed(1)}s – {seg.endTime.toFixed(1)}s
                                </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                {canSplit && (
                                    <button
                                        className={ghost}
                                        title="Split into two zooms at the playhead"
                                        onClick={() => {
                                            if (onSplitSegment) {
                                                onSplitSegment(seg.id, currentTime);
                                            } else if (onUpdateSegment && onAddFocusSegment) {
                                                const oldEnd = seg.endTime;
                                                onUpdateSegment(seg.id, { endTime: currentTime });
                                                onAddFocusSegment({ ...seg, id: newId(), startTime: currentTime, endTime: oldEnd });
                                            }
                                        }}
                                    >
                                        Split
                                    </button>
                                )}
                                <button
                                    className={ghost}
                                    title="Duplicate this zoom at the playhead"
                                    onClick={() => {
                                        if (!onAddFocusSegment) return;
                                        const len = seg.endTime - seg.startTime;
                                        const s = Math.min(duration - 0.2, currentTime);
                                        onAddFocusSegment({ ...seg, id: newId(), startTime: s, endTime: Math.min(duration, s + len) });
                                    }}
                                >
                                    Duplicate
                                </button>
                                <button className={ghost} title="Start 0.5s earlier" onClick={() => upd({ startTime: Math.max(0, seg.startTime - 0.5) })}>−0.5s</button>
                                <button className={ghost} title="End 0.5s later" onClick={() => upd({ endTime: Math.min(duration, seg.endTime + 0.5) })}>+0.5s</button>
                                <button
                                    className="px-2 h-6 rounded-md text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                    onClick={() => onDeleteSegment && onDeleteSegment(seg.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <Group label="Scene">
                                <select
                                    value={seg.sceneMode || 'focus'}
                                    onChange={(e) => upd({ sceneMode: e.target.value })}
                                    className="h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border-app)] text-[12px] text-[var(--text-app)] px-2 outline-none"
                                >
                                    <option value="focus">Focus</option>
                                    <option value="spotlight">Spotlight</option>
                                    <option value="full-camera">Full camera</option>
                                    <option value="overview">Overview</option>
                                    <option value="speed">Speed ramp</option>
                                </select>
                            </Group>
                            <Group label="Speed">
                                <Segmented
                                    value={seg.speed || 1}
                                    onPick={(v) => upd({ speed: v })}
                                    options={[0.5, 1, 1.5, 2, 4].map((v) => ({ value: v, label: `${v}×`, active: (cur) => cur === v }))}
                                />
                            </Group>
                            <Group label="Depth">
                                <Segmented
                                    value={seg.zoomScale || 1.55}
                                    onPick={(v) => upd({ zoomScale: v })}
                                    options={[1.35, 1.55, 1.85, 2.4].map((v) => ({ value: v, label: `${v}×`, active: (cur) => Math.abs(cur - v) < 0.05 }))}
                                />
                            </Group>
                            <Group label="Camera">
                                <Segmented
                                    value={seg.followCursor !== false}
                                    onPick={(v) => upd({ followCursor: v })}
                                    options={[
                                        { value: true, label: 'Follows cursor', active: (cur) => cur === true },
                                        { value: false, label: 'Fixed', active: (cur) => cur === false },
                                    ]}
                                />
                            </Group>
                        </div>
                    </div>
                );
            })()}

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
                        className="absolute top-0 bottom-0 left-0 bg-black/60 border-r-2 border-red-500/70 z-15 pointer-events-none"
                        style={{ width: `${(trimStart / duration) * 100}%` }}
                    />
                )}
                {duration > 0 && effectiveTrimEnd < duration && (
                    <div
                        className="absolute top-0 bottom-0 right-0 bg-black/60 border-l-2 border-red-500/70 z-15 pointer-events-none"
                        style={{ width: `${((duration - effectiveTrimEnd) / duration) * 100}%` }}
                    />
                )}

                {/* Focus Segment Blocks — Unified continuous camera track ribbon */}
                {duration > 0 && focusSegments && focusSegments.length > 0 && focusSegments.map((seg, idx) => {
                    const leftPct = (seg.startTime / duration) * 100;
                    const widthPct = Math.max(2, ((seg.endTime - seg.startTime) / duration) * 100);
                    const isSelected = selectedSegmentId === seg.id;

                    const prevSeg = idx > 0 ? focusSegments[idx - 1] : null;
                    const nextSeg = idx < focusSegments.length - 1 ? focusSegments[idx + 1] : null;

                    const isConnectedPrev = prevSeg && (seg.startTime - prevSeg.endTime <= 0.35);
                    const isConnectedNext = nextSeg && (nextSeg.startTime - seg.endTime <= 0.35);

                    const roundedClass = (isConnectedPrev && isConnectedNext)
                        ? 'rounded-none border-l-0 border-r-0'
                        : isConnectedPrev
                        ? 'rounded-r-lg rounded-l-none border-l-0'
                        : isConnectedNext
                        ? 'rounded-l-lg rounded-r-none border-r-0'
                        : 'rounded-lg';

                    return (
                        <div
                            key={seg.id || idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectSegment) onSelectSegment(seg);
                                onSeek(seg.startTime);
                            }}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                            className={`group/seg absolute top-1.5 bottom-1.5 ${roundedClass} flex items-center justify-between px-1.5 cursor-pointer z-10 transition-all border ${
                                isSelected
                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] border-[var(--accent-app)] shadow-md font-bold'
                                    : 'bg-[var(--accent-app)]/20 text-[var(--text-app)] border-[var(--accent-app)]/50 hover:bg-[var(--accent-app)]/35'
                            }`}
                            title={`Camera: ${formatTime(seg.startTime)} - ${formatTime(seg.endTime)} (${seg.zoomScale}x, focus [${Math.round((seg.targetX ?? 0.5) * 100)}%, ${Math.round((seg.targetY ?? 0.5) * 100)}%])`}
                        >
                            {/* Waypoint Divider for Connected Sequences */}
                            {isConnectedPrev && (
                                <div className="absolute -left-1 top-0 bottom-0 w-2 flex items-center justify-center z-25 pointer-events-none">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-app)] border border-black/40 shadow-xs" title="Camera Glide Junction" />
                                </div>
                            )}

                            {/* Left Trim Handle */}
                            <div
                                onMouseDown={(e) => handleResizeStart(e, seg, 'start')}
                                className={`absolute left-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-white/40 ${isConnectedPrev ? 'rounded-none' : 'rounded-l'} flex items-center justify-center opacity-0 group-hover/seg:opacity-100 transition-opacity z-20`}
                                title={isConnectedPrev ? "Drag to adjust glide timing" : "Drag to trim start time"}
                            >
                                <div className="w-0.5 h-3 bg-white/70 rounded-full" />
                            </div>

                            <span className="text-[11px] font-mono font-bold truncate select-none flex items-center gap-1 pl-1">
                                {seg.sceneMode === 'spotlight' ? '🎙️ Spotlight' :
                                 seg.sceneMode === 'overview' ? '🖥️ Overview' :
                                 seg.sceneMode === 'speed' ? `⏩ ${seg.speed || 2}x Speed` :
                                 isConnectedPrev ? (
                                     <span className="opacity-90 flex items-center gap-0.5">
                                         <span>→</span>
                                         <span>🎯 {Math.round((seg.targetX ?? 0.5) * 100)}%</span>
                                     </span>
                                 ) : (
                                     `${seg.reason === 'manual' ? '📌' : seg.reason === 'key' ? '⌨' : '⚡'} ${seg.zoomScale}x ${seg.speed && seg.speed !== 1 ? `(${seg.speed}x)` : ''}`
                                 )}
                            </span>

                            <div className="flex items-center pr-0.5">
                                {onDeleteSegment && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteSegment(seg.id);
                                        }}
                                        className="opacity-0 group-hover/seg:opacity-80 hover:!opacity-100 hover:text-red-400 text-xs font-bold ml-1 px-1 transition-opacity"
                                        title={isConnectedPrev ? "Remove waypoint" : "Delete focus segment"}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            {/* Right Trim Handle */}
                            <div
                                onMouseDown={(e) => handleResizeStart(e, seg, 'end')}
                                className={`absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-white/40 ${isConnectedNext ? 'rounded-none' : 'rounded-r'} flex items-center justify-center opacity-0 group-hover/seg:opacity-100 transition-opacity z-20`}
                                title={isConnectedNext ? "Drag to adjust glide timing" : "Drag to trim end time"}
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

                {/* Subtle Mouse Click Telemetry Ticks (independent of zoom segments) */}
                {duration > 0 && clicks.map((click, idx) => {
                    const clickTime = (click.time > 10000 || click.time < 0.001) ? click.time / 1000 : (click.time > 100 ? click.time / 1000 : click.time);
                    if (clickTime < 0.6) return null; // hide startup button click
                    const posPct = (clickTime / duration) * 100;

                    return (
                        <div
                            key={idx}
                            style={{ left: `${posPct}%` }}
                            className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-[var(--accent-app)] transition-colors pointer-events-auto cursor-pointer"
                            title={`Mouse Click at ${formatTime(clickTime)}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onSeek) onSeek(clickTime);
                            }}
                        />
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
