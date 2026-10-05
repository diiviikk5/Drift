'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Mic, Camera, Timer, Play, Square, AppWindow, RefreshCw, ExternalLink } from 'lucide-react';
import { createAudioLevelMeter } from '@/lib/audio/audioMix';

/** Accessible on/off switch. */
function Switch({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange?.(!checked)}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[var(--accent-app)]' : 'bg-[var(--border-app-hover)]'}`}
        >
            <span
                className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-[left] duration-150 ${checked ? 'left-[18px]' : 'left-0.5'}`}
                style={{ background: checked ? 'var(--accent-app-fg)' : '#ffffff' }}
            />
        </button>
    );
}

/** Option tile: icon, title, state, and optional detail below. */
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

export default function CaptureCockpit({
    sources = [],
    selectedSource,
    onSelectSource,
    onSelectBrowserSource,
    captureWindows = [],
    onSelectWindowMode = null,
    onRefreshWindows = null,
    sourceThumbnails = {},
    isRecording,
    onToggleRecord,
    timer,
    micEnabled,
    micStream = null,
    onToggleMic,
    audioDevices = [],
    selectedMicId = '',
    onSelectMic = null,
    webcamEnabled,
    onToggleWebcam,
    videoDevices = [],
    selectedWebcamId = '',
    onSelectWebcam = null,
    countdownSeconds,
    onChangeCountdown,
    hotkey,
    previewCanvas = null,
    hasActiveStream = false,
    onStartPreview = null,
    autoMinimize = true,
    onToggleAutoMinimize = null,
    isNativeSupported = false,
}) {
    const [audioLevel, setAudioLevel] = useState(0);

    // Real input level only; no meter without a live microphone stream.
    useEffect(() => {
        if (!micEnabled || !micStream) {
            setAudioLevel(0);
            return;
        }
        return createAudioLevelMeter(micStream, (lvl) => setAudioLevel(lvl));
    }, [micEnabled, micStream]);

    const isNativeWindowMode = String(selectedSource || '').startsWith('window:');
    const isWindowMode = selectedSource === 'browser-source' || isNativeWindowMode;
    const nativeWindow = isNativeWindowMode ? captureWindows.find(w => w.id === selectedSource) : null;
    const useNativeWindows = isNativeSupported && Boolean(onSelectWindowMode);

    const activeSource = nativeWindow
        ? { name: nativeWindow.title, width: nativeWindow.width, height: nativeWindow.height }
        : !isWindowMode
        ? (sources.find(s => s.id === selectedSource) || sources[0] || { name: 'Primary display', width: 1920, height: 1080, is_primary: true })
        : { name: 'Window' };
    const resolution = activeSource.width ? `${activeSource.width} × ${activeSource.height}` : null;
    const thumb = !isWindowMode ? (sourceThumbnails[activeSource.id] || activeSource.thumbnailDataUrl) : null;

    const selectScreen = () => {
        const primary = sources.find(s => s.is_primary) || sources[0];
        onSelectSource(primary ? primary.id : 'screen:0');
    };

    const sourceButton = (active, onClick, Icon, label) => (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-center gap-2 h-8 rounded-md text-[13px] font-medium transition-colors ${
                active ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-sm' : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    const previewStatus = hasActiveStream ? (isRecording ? 'Recording' : 'Live preview') : 'Ready';

    return (
        <div className="w-full max-w-3xl mx-auto my-auto flex flex-col gap-5">
            {/* Title */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-[var(--text-app)]">New recording</h1>
                    <p className="text-[13px] text-[var(--text-app-muted)] mt-0.5">
                        Clicks, typing and scrolling are tracked so Drift can zoom and edit for you.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-app)] w-56 flex-shrink-0">
                    {sourceButton(!isWindowMode, selectScreen, Monitor, 'Screen')}
                    {sourceButton(isWindowMode, useNativeWindows ? onSelectWindowMode : onSelectBrowserSource, AppWindow, 'Window')}
                </div>
            </div>

            {/* Displays */}
            {!isWindowMode && sources.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto">
                    {sources.map((src, i) => {
                        const selected = selectedSource === src.id || (!selectedSource && i === 0);
                        return (
                            <button
                                key={src.id}
                                onClick={() => onSelectSource(src.id)}
                                className={`h-8 px-3 rounded-lg text-[13px] border flex items-center gap-2 flex-shrink-0 transition-colors ${
                                    selected
                                        ? 'bg-[var(--accent-soft)] border-[var(--accent-app)] text-[var(--text-app)]'
                                        : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:border-[var(--border-app-hover)]'
                                }`}
                            >
                                <Monitor className="w-3.5 h-3.5" />
                                <span>{src.name || `Display ${i + 1}`}</span>
                                {src.is_primary && <span className="text-xs text-[var(--text-app-faint)]">Main</span>}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Windows */}
            {isNativeWindowMode && (
                <div className="rounded-xl border border-[var(--border-app)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="flex items-center justify-between px-3.5 h-10 border-b border-[var(--border-app)]">
                        <span className="text-[13px] font-medium text-[var(--text-app)]">Choose a window</span>
                        {onRefreshWindows && (
                            <button type="button" onClick={onRefreshWindows} className="flex items-center gap-1.5 text-xs text-[var(--text-app-muted)] hover:text-[var(--text-app)]">
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Refresh</span>
                            </button>
                        )}
                    </div>
                    <div className="max-h-44 overflow-y-auto p-1">
                        {captureWindows.length === 0 && (
                            <div className="text-[13px] text-[var(--text-app-muted)] px-3 py-5 text-center">
                                No windows found. Open the app you want to record, then refresh.
                            </div>
                        )}
                        {captureWindows.map((w) => (
                            <button
                                key={w.id}
                                type="button"
                                onClick={() => onSelectSource(w.id)}
                                className={`w-full flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-left transition-colors ${
                                    selectedSource === w.id ? 'bg-[var(--accent-soft)] text-[var(--text-app)]' : 'text-[var(--text-app-muted)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-app)]'
                                }`}
                            >
                                <AppWindow className="w-4 h-4 flex-shrink-0" />
                                <span className="text-[13px] truncate flex-1">{w.title}</span>
                                <span className="text-xs text-[var(--text-app-faint)] flex-shrink-0">{w.process}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isWindowMode && !isNativeWindowMode && (
                <div className="flex items-center justify-between px-3.5 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] text-[13px]">
                    <span className="text-[var(--text-app)]">{hasActiveStream ? 'Window selected' : 'Pick the window to record'}</span>
                    <button onClick={onSelectBrowserSource} className="flex items-center gap-1.5 text-[var(--text-app-muted)] hover:text-[var(--text-app)]">
                        <span>{hasActiveStream ? 'Change' : 'Choose'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Preview */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-app)] bg-black group">
                {/* Always mounted so the recorder canvas ref is never null */}
                <div className={`w-full h-full flex items-center justify-center ${hasActiveStream ? 'block' : 'hidden'}`}>
                    {previewCanvas}
                </div>

                {!hasActiveStream && (thumb ? (
                    <div className="relative w-full h-full">
                        <img src={thumb} alt="" className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={onStartPreview || onSelectBrowserSource}
                                className="h-9 px-4 rounded-lg bg-white/95 text-black text-[13px] font-medium flex items-center gap-2 shadow-lg"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Show live preview</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-6 bg-[var(--bg-card)]">
                        <span className="w-12 h-12 rounded-xl bg-[var(--bg-card-subtle)] flex items-center justify-center text-[var(--text-app-muted)]">
                            {isWindowMode ? <AppWindow className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                        </span>
                        <div>
                            <p className="text-[14px] font-medium text-[var(--text-app)]">
                                {isNativeWindowMode ? (nativeWindow ? nativeWindow.title : 'No window chosen yet') : isWindowMode ? 'No window chosen yet' : activeSource.name || 'Primary display'}
                            </p>
                            <p className="text-[13px] text-[var(--text-app-muted)] mt-0.5">
                                {isNativeWindowMode ? 'Only this window is recorded' : isWindowMode ? 'Only the chosen app or tab is recorded' : resolution ? `${resolution} · 60 fps` : '60 fps'}
                            </p>
                        </div>
                        {!isNativeWindowMode && (
                            <button
                                type="button"
                                onClick={isWindowMode ? onSelectBrowserSource : (onStartPreview || onSelectBrowserSource)}
                                className="h-8 px-3.5 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-app)] hover:border-[var(--border-app-hover)] text-[var(--text-app)] text-[13px] font-medium flex items-center gap-2 transition-colors"
                            >
                                {isWindowMode ? <AppWindow className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                <span>{isWindowMode ? 'Choose window' : 'Show live preview'}</span>
                            </button>
                        )}
                    </div>
                ))}

                <div className="absolute top-3 left-3 flex items-center gap-1.5 h-6 px-2 rounded-md bg-black/60 text-white text-xs pointer-events-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${hasActiveStream ? (isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-400') : 'bg-white/50'}`} />
                    <span>{previewStatus}</span>
                    {resolution && <span className="text-white/60 font-mono">{resolution}</span>}
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-3">
                <Tile
                    icon={Mic}
                    title="Microphone"
                    status={micEnabled ? (audioDevices.find(d => d.deviceId === selectedMicId)?.label || 'On') : 'Off'}
                    control={<Switch checked={micEnabled} onChange={() => onToggleMic()} label="Microphone" />}
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
                    control={<Switch checked={webcamEnabled} onChange={() => onToggleWebcam()} label="Camera" />}
                >
                    {webcamEnabled && videoDevices.length > 1 && (
                        <DeviceSelect value={selectedWebcamId} onChange={onSelectWebcam} devices={videoDevices} fallback="Camera" />
                    )}
                </Tile>

                <Tile icon={Timer} title="Countdown" status={countdownSeconds === 0 ? 'Starts immediately' : `${countdownSeconds} seconds before recording`}>
                    <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-app)]">
                        {[0, 3, 5].map((sec) => (
                            <button
                                key={sec}
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
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2.5 text-[13px] text-[var(--text-app-muted)] cursor-pointer select-none flex-shrink-0">
                    <Switch checked={autoMinimize} onChange={(v) => onToggleAutoMinimize?.(v)} label="Hide Drift while recording" />
                    <span>Hide Drift while recording</span>
                </label>
                <button
                    onClick={onToggleRecord}
                    className={`flex-1 h-12 px-5 rounded-xl flex items-center justify-between transition-[filter,transform] active:scale-[0.99] ${
                        isRecording ? 'bg-red-500 text-white hover:brightness-110' : 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:brightness-105'
                    }`}
                    style={{ boxShadow: 'var(--shadow-app)' }}
                >
                    <span className="flex items-center gap-3">
                        {isRecording ? <Square className="w-4 h-4 fill-current" /> : <span className="w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-white/40" />}
                        <span className="text-[15px] font-semibold">{isRecording ? 'Stop recording' : 'Start recording'}</span>
                    </span>
                    {isRecording ? (
                        <span className="font-mono text-sm">{timer || '00:00'}</span>
                    ) : (
                        <kbd className="font-mono text-xs px-2 py-0.5 rounded-md bg-black/10 border border-current/20 opacity-80">{hotkey || 'Alt+Shift+R'}</kbd>
                    )}
                </button>
            </div>
        </div>
    );
}
