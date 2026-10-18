'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Monitor, Mic, Camera, Timer, Square, AppWindow, Crop, Globe, PictureInPicture2, Volume2, MousePointer2, AlertTriangle, X, History, Trash2, Film } from 'lucide-react';
import { createAudioLevelMeter } from '@/lib/audio/audioMix';

function Switch({ checked, onChange, label, disabled = false }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange?.(!checked)}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 disabled:opacity-40 ${checked ? 'bg-[var(--accent-app)]' : 'bg-[var(--border-app-hover)]'}`}
        >
            <span
                className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-[left] duration-150 ${checked ? 'left-[18px]' : 'left-0.5'}`}
                style={{ background: checked ? 'var(--accent-app-fg)' : '#ffffff' }}
            />
        </button>
    );
}

function Tile({ icon: Icon, title, status, control, children }) {
    return (
        <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] flex flex-col gap-2.5 min-w-0">
            <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[var(--bg-card-subtle)] flex items-center justify-center text-[var(--text-app-muted)] flex-shrink-0">
                    <Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[var(--text-app)] leading-tight">{title}</div>
                    <div className="text-xs text-[var(--text-app-muted)] truncate">{status}</div>
                </div>
                {control}
            </div>
            {children}
        </div>
    );
}

function DeviceSelect({ value, onChange, devices, fallback }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full h-8 text-xs bg-[var(--bg-card-subtle)] text-[var(--text-app)] border border-[var(--border-app)] rounded-lg px-2 truncate focus:outline-none cursor-pointer"
        >
            {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `${fallback} (${d.deviceId.slice(0, 6)})`}
                </option>
            ))}
        </select>
    );
}

const SURFACES = [
    { id: 'monitor', label: 'Screen', icon: Monitor, hint: 'Your whole display' },
    { id: 'window', label: 'Window', icon: AppWindow, hint: 'One app window' },
    { id: 'browser', label: 'Tab', icon: Globe, hint: 'A browser tab' },
];

const surfaceName = (s) => (s === 'monitor' ? 'Screen' : s === 'window' ? 'Window' : s === 'browser' ? 'Tab' : 'Source');

/**
 * Capture setup for Drift on the web: choose what to share through the
 * browser's picker, see it live, optionally crop to an area, then record.
 */
export default function WebCockpit({
    support,
    source,               // { surface, label, width, height, hasAudio, pointerVisible } | null
    stream,               // the shared MediaStream (live preview)
    onPickSource,         // (preferSurface) => void
    onStopSharing,
    captureArea,
    onPickArea,
    onClearArea,
    isRecording,
    onToggleRecord,
    timer,
    micEnabled,
    micStream,
    onToggleMic,
    audioDevices = [],
    selectedMicId = '',
    onSelectMic,
    webcamEnabled,
    webcamStream,
    onToggleWebcam,
    videoDevices = [],
    selectedWebcamId = '',
    onSelectWebcam,
    countdownSeconds,
    onChangeCountdown,
    floatingControls,
    onToggleFloatingControls,
    hotkey,
    busy = false,
    recentTakes = [],
    onOpenTake,
    onDeleteTake,
}) {
    const videoRef = useRef(null);
    const camRef = useRef(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [preferred, setPreferred] = useState('monitor');

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
            if (stream) videoRef.current.play().catch(() => {});
        }
    }, [stream]);

    useEffect(() => {
        if (camRef.current) {
            camRef.current.srcObject = webcamStream || null;
            if (webcamStream) camRef.current.play().catch(() => {});
        }
    }, [webcamStream]);

    useEffect(() => {
        if (!micEnabled || !micStream) {
            setAudioLevel(0);
            return;
        }
        return createAudioLevelMeter(micStream, (lvl) => setAudioLevel(lvl));
    }, [micEnabled, micStream]);

    const unsupported = support && (!support.displayCapture || support.mobile);
    const live = Boolean(stream && source);
    const resolution = source?.width
        ? captureArea
            ? `${Math.round(captureArea.w * source.width)} × ${Math.round(captureArea.h * source.height)}`
            : `${source.width} × ${source.height}`
        : null;
    const activeSurface = source?.surface || preferred;

    const choose = (id) => {
        setPreferred(id);
        onPickSource?.(id);
    };

    if (unsupported) {
        return (
            <div className="w-full max-w-xl mx-auto my-auto flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-app)]">
                <span className="w-12 h-12 rounded-xl bg-[var(--bg-card-subtle)] flex items-center justify-center text-[var(--text-app-muted)]">
                    <Monitor className="w-6 h-6" />
                </span>
                <div>
                    <h1 className="text-lg font-semibold text-[var(--text-app)]">Screen recording needs a desktop browser</h1>
                    <p className="text-[13px] text-[var(--text-app-muted)] mt-1.5">
                        {support.mobile
                            ? 'Phones and tablets don’t let web pages record the screen. Open Drift in Chrome, Edge, Firefox or Safari on a computer.'
                            : 'This browser can’t share the screen with web pages. Try the latest Chrome or Edge.'}
                    </p>
                </div>
                <p className="text-xs text-[var(--text-app-faint)]">You can still open a video or a .drift project here and edit it.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto my-auto flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold tracking-tight text-[var(--text-app)]">New recording</h1>
                    <p className="text-[13px] text-[var(--text-app-muted)] mt-0.5">
                        Right in your browser. Drift follows your pointer, clicks, typing and scrolling to zoom and edit for you.
                    </p>
                </div>
                <div className="grid grid-cols-3 w-72 gap-0.5 p-0.5 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-app)] flex-shrink-0">
                    {SURFACES.map(({ id, label, icon: Icon, hint }) => (
                        <button
                            key={id}
                            type="button"
                            title={hint}
                            disabled={isRecording || busy}
                            onClick={() => choose(id)}
                            className={`flex items-center justify-center gap-2 h-8 rounded-md text-[13px] font-medium transition-colors disabled:opacity-50 ${
                                activeSurface === id ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-sm' : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {support && !support.chromium && (
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] text-[13px] text-[var(--text-app-muted)]">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                    <span>
                        Drift works in this browser, but Chrome or Edge record faster, include system audio and can show floating controls over other apps.
                    </span>
                </div>
            )}

            {/* Shared surface */}
            {live && (
                <div className="flex items-center justify-between gap-3 px-3.5 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] text-[13px]">
                    <span className="text-[var(--text-app)] flex items-center gap-2 min-w-0">
                        {source.surface === 'browser' ? <Globe className="w-3.5 h-3.5 flex-shrink-0" /> : source.surface === 'window' ? <AppWindow className="w-3.5 h-3.5 flex-shrink-0" /> : <Monitor className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="truncate">{captureArea ? 'Area of ' : ''}{source.label || surfaceName(source.surface)}</span>
                        {source.hasAudio && (
                            <span className="flex items-center gap-1 text-xs text-[var(--text-app-faint)] flex-shrink-0">
                                <Volume2 className="w-3 h-3" /> audio
                            </span>
                        )}
                    </span>
                    <span className="flex items-center gap-3 flex-shrink-0">
                        {!isRecording && (
                            <>
                                <button type="button" onClick={onPickArea} className="flex items-center gap-1.5 text-[var(--text-app-muted)] hover:text-[var(--text-app)]">
                                    <Crop className="w-3.5 h-3.5" />
                                    <span>{captureArea ? 'Change area' : 'Crop to area'}</span>
                                </button>
                                {captureArea && (
                                    <button type="button" onClick={onClearArea} className="text-[var(--text-app-muted)] hover:text-[var(--text-app)]">Full</button>
                                )}
                                <button type="button" onClick={() => choose(activeSurface)} className="text-[var(--text-app-muted)] hover:text-[var(--text-app)]">Change</button>
                                <button type="button" onClick={onStopSharing} aria-label="Stop sharing" className="text-[var(--text-app-muted)] hover:text-[var(--text-app)]">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </>
                        )}
                    </span>
                </div>
            )}

            {live && source.surface === 'browser' && (
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] text-[13px] text-[var(--text-app-muted)]">
                    <MousePointer2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Browsers record tabs without the pointer, so Drift can’t follow it there. Share a Window or your Screen for automatic zooms and a smooth pointer.</span>
                </div>
            )}

            {/* Preview */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-app)] bg-black">
                <video ref={videoRef} muted playsInline className={`w-full h-full object-contain ${live ? '' : 'hidden'}`} />
                {live && captureArea && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <AreaOverlay area={captureArea} width={source.width} height={source.height} />
                    </div>
                )}
                {webcamEnabled && webcamStream && (
                    <video ref={camRef} muted playsInline className="absolute bottom-3 right-3 w-[18%] aspect-square object-cover rounded-full border-2 border-white/80 shadow-xl" style={{ transform: 'scaleX(-1)' }} />
                )}
                {!live && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6 bg-[var(--bg-card)]">
                        <span className="w-12 h-12 rounded-xl bg-[var(--bg-card-subtle)] flex items-center justify-center text-[var(--text-app-muted)]">
                            {activeSurface === 'window' ? <AppWindow className="w-6 h-6" /> : activeSurface === 'browser' ? <Globe className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                        </span>
                        <div>
                            <p className="text-[14px] font-medium text-[var(--text-app)]">Choose what to record</p>
                            <p className="text-[13px] text-[var(--text-app-muted)] mt-0.5">Your browser asks which screen, window or tab to share. Nothing leaves this device.</p>
                        </div>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => choose(activeSurface)}
                            className="h-9 px-4 rounded-lg bg-[var(--accent-app)] text-[var(--accent-app-fg)] text-[13px] font-semibold flex items-center gap-2 hover:brightness-105 disabled:opacity-60"
                        >
                            {React.createElement(SURFACES.find(s => s.id === activeSurface)?.icon || Monitor, { className: 'w-4 h-4' })}
                            <span>Share {surfaceName(activeSurface).toLowerCase()}</span>
                        </button>
                    </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 h-6 px-2 rounded-md bg-black/60 text-white text-xs pointer-events-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${live ? (isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-400') : 'bg-white/50'}`} />
                    <span>{live ? (isRecording ? 'Recording' : 'Live preview') : 'Not sharing'}</span>
                    {resolution && <span className="text-white/60 font-mono">{resolution}</span>}
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Tile
                    icon={Mic}
                    title="Microphone"
                    status={micEnabled ? (audioDevices.find(d => d.deviceId === selectedMicId)?.label || 'On') : 'Off'}
                    control={<Switch checked={micEnabled} onChange={() => onToggleMic()} label="Microphone" disabled={isRecording} />}
                >
                    {micEnabled && (
                        <div className="h-1.5 rounded-full bg-[var(--bg-card-subtle)] overflow-hidden" title="Input level">
                            <div className="h-full rounded-full bg-emerald-400 transition-[width] duration-75" style={{ width: `${Math.round(Math.min(1, audioLevel) * 100)}%` }} />
                        </div>
                    )}
                    {micEnabled && audioDevices.length > 1 && (
                        <DeviceSelect value={selectedMicId} onChange={onSelectMic} devices={audioDevices} fallback="Microphone" />
                    )}
                </Tile>

                <Tile
                    icon={Camera}
                    title="Camera"
                    status={webcamEnabled ? (videoDevices.find(d => d.deviceId === selectedWebcamId)?.label || 'On, shown in a bubble') : 'Off'}
                    control={<Switch checked={webcamEnabled} onChange={() => onToggleWebcam()} label="Camera" disabled={isRecording} />}
                >
                    {webcamEnabled && videoDevices.length > 1 && (
                        <DeviceSelect value={selectedWebcamId} onChange={onSelectWebcam} devices={videoDevices} fallback="Camera" />
                    )}
                </Tile>

                <Tile icon={Timer} title="Countdown" status={countdownSeconds === 0 ? 'Starts immediately' : `${countdownSeconds} seconds to get ready`}>
                    <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-app)]">
                        {[0, 3, 5].map((sec) => (
                            <button
                                key={sec}
                                disabled={isRecording}
                                onClick={() => onChangeCountdown(sec)}
                                className={`h-7 rounded-md text-xs font-medium transition-colors ${
                                    countdownSeconds === sec ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-sm' : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                }`}
                            >
                                {sec === 0 ? 'Off' : `${sec}s`}
                            </button>
                        ))}
                    </div>
                </Tile>
            </div>

            {/* Record */}
            <div className="flex flex-wrap items-center gap-4">
                {support?.documentPiP && (
                    <label className="flex items-center gap-2.5 text-[13px] text-[var(--text-app-muted)] cursor-pointer select-none flex-shrink-0" title="A small always-on-top panel with the timer and a stop button">
                        <Switch checked={floatingControls} onChange={(v) => onToggleFloatingControls?.(v)} label="Floating controls" disabled={isRecording} />
                        <PictureInPicture2 className="w-4 h-4" />
                        <span>Floating controls</span>
                    </label>
                )}
                <button
                    onClick={onToggleRecord}
                    disabled={busy}
                    className={`flex-1 min-w-[240px] h-12 px-5 rounded-xl flex items-center justify-between transition-[filter,transform] active:scale-[0.99] disabled:opacity-60 ${
                        isRecording ? 'bg-red-500 text-white hover:brightness-110' : 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:brightness-105'
                    }`}
                    style={{ boxShadow: 'var(--shadow-app)' }}
                >
                    <span className="flex items-center gap-3">
                        {isRecording ? <Square className="w-4 h-4 fill-current" /> : <span className="w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-white/40" />}
                        <span className="text-[15px] font-semibold">{busy ? 'Finishing…' : isRecording ? 'Stop recording' : live ? 'Start recording' : 'Choose and record'}</span>
                    </span>
                    {isRecording ? (
                        <span className="font-mono text-sm">{timer || '00:00'}</span>
                    ) : (
                        hotkey && <kbd className="font-mono text-xs px-2 py-0.5 rounded-md bg-black/10 border border-current/20 opacity-80">{hotkey}</kbd>
                    )}
                </button>
            </div>

            {!isRecording && recentTakes.length > 0 && (
                <div className="rounded-xl border border-[var(--border-app)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="flex items-center gap-2 px-3.5 h-10 border-b border-[var(--border-app)] text-[13px] font-medium text-[var(--text-app)]">
                        <History className="w-3.5 h-3.5" />
                        <span>Recent recordings</span>
                        <span className="ml-auto text-xs font-normal text-[var(--text-app-faint)]">Kept in this browser only</span>
                    </div>
                    <div className="p-1">
                        {recentTakes.map((t) => (
                            <div key={t.id} className="flex items-center gap-2.5 px-2.5 h-10 rounded-lg hover:bg-[var(--bg-card-subtle)] group">
                                <Film className="w-4 h-4 text-[var(--text-app-muted)] flex-shrink-0" />
                                <button type="button" onClick={() => onOpenTake?.(t.id)} className="flex-1 min-w-0 text-left">
                                    <span className="text-[13px] text-[var(--text-app)]">{formatWhen(t.createdAt)}</span>
                                    <span className="text-xs text-[var(--text-app-faint)] ml-2">
                                        {formatDuration(t.durationMs)} · {(t.size / 1024 / 1024).toFixed(1)} MB{t.surface ? ` · ${surfaceName(t.surface)}` : ''}
                                    </span>
                                </button>
                                <button type="button" onClick={() => onOpenTake?.(t.id)} className="h-7 px-2.5 rounded-md text-xs font-medium text-[var(--text-app)] bg-[var(--bg-card-subtle)] border border-[var(--border-app)] hover:border-[var(--border-app-hover)]">
                                    Edit
                                </button>
                                <button type="button" onClick={() => onDeleteTake?.(t.id)} aria-label="Delete recording" className="h-7 w-7 flex items-center justify-center rounded-md text-[var(--text-app-faint)] hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function formatDuration(ms = 0) {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function formatWhen(ts) {
    const d = new Date(ts);
    const today = new Date();
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}

/** Dim everything outside the chosen area in the preview (object-contain aware). */
function AreaOverlay({ area, width, height }) {
    const ratio = width && height ? width / height : 16 / 9;
    return (
        <div className="relative" style={ratio >= 16 / 9 ? { width: '100%', aspectRatio: `${ratio}` } : { height: '100%', aspectRatio: `${ratio}` }}>
            <div
                className="absolute rounded-sm border-2 border-[var(--accent-app)] shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
                style={{ left: `${area.x * 100}%`, top: `${area.y * 100}%`, width: `${area.w * 100}%`, height: `${area.h * 100}%` }}
            />
        </div>
    );
}
