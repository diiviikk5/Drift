'use client';

import React, { useState, useRef } from 'react';
import { 
    Palette, 
    Camera, 
    MousePointer, 
    Video, 
    Sparkles, 
    Download, 
    Upload, 
    Check, 
    Circle, 
    Square, 
    RectangleHorizontal,
    Send,
    Subtitles,
    RefreshCw,
    Settings2,
    Volume2,
    VolumeX,
    Mic,
    MicOff,
    Activity,
    AppWindow
} from 'lucide-react';
import WallpaperPicker from './WallpaperPicker';
import { DEFAULT_BACKGROUND } from '@/lib/rendering/backgrounds';

export default function InspectorPanel({
    background,
    onChangeBackground,
    backgrounds = {},
    customImage = null,
    onUploadCustomImage,
    zoomLevel,
    onChangeZoomLevel,
    showCursor,
    cursorBakedIn = false,
    onToggleCursor,
    cursorTheme = 'macos',
    onChangeCursorTheme,
    cursorScale = 1.0,
    onChangeCursorScale,
    splineSmoothing = true,
    onToggleSplineSmoothing,
    systemAudioVolume = 1.0,
    onChangeSystemAudioVolume,
    micAudioVolume = 1.2,
    onChangeMicAudioVolume,
    isSystemAudioMuted = false,
    onToggleSystemAudioMute,
    isMicAudioMuted = false,
    onToggleMicAudioMute,
    autoDuck = true,
    onToggleAutoDuck,
    webcamSettings = {
        enabled: false,
        shape: 'circle',
        position: 'bottom-right',
        size: 0.22,
        mirrored: false,
    },
    onChangeWebcamSettings,
    captions = [],
    captionsEnabled = true,
    onToggleCaptions,
    onGenerateCaptions,
    isTranscribing = false,
    onApplyAICommand,
    onOpenAISettings,
    onTriggerExport,
    isExporting = false,
    aspectRatio = '16:9',
    onChangeAspectRatio,
    frameFit = 'contain',
    onChangeFrameFit,
    tiltAngle = 3.5,
    onChangeTiltAngle,
    connectedZooms = true,
    onToggleConnectedZooms,
    reactiveWebcam = true,
    onToggleReactiveWebcam,
    insetPadding = 0.05,
    onChangeInsetPadding,
    borderRadius = 12,
    onChangeBorderRadius,
    windowChrome = false,
    onToggleWindowChrome,
    springProfile = 'cinematic',
    onChangeSpringProfile,
    showKeystrokes = true,
    onToggleKeystrokes,
    autoZoomOnClicks = false,
    onToggleAutoZoomOnClicks,
    onResetToOverview,
    onChangeFramingPreset,
    zoomFrequency = 'minimal',
    onChangeZoomFrequency,
    playbackSpeed = 1.0,
    onChangePlaybackSpeed,
}) {
    const [activeTab, setActiveTab] = useState('style');
    const fileInputRef = useRef(null);
    const [aiInput, setAiInput] = useState('');
    const [aiNotice, setAiNotice] = useState('');

    const aspectRatios = [
        { id: '16:9', label: '16:9', desc: 'Landscape (YouTube, X)' },
        { id: '9:16', label: '9:16', desc: 'Vertical (TikTok, Shorts)' },
        { id: '1:1', label: '1:1', desc: 'Square (LinkedIn, Feed)' },
        { id: '4:5', label: '4:5', desc: 'Portrait (Instagram)' },
        { id: 'native', label: 'Original', desc: 'Keep the recording size' },
    ];

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && onUploadCustomImage) {
            onUploadCustomImage(file);
        }
    };

    const handleAISubmit = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;
        const text = aiInput.trim();
        setAiInput('');
        if (onApplyAICommand) {
            try {
                const res = await onApplyAICommand(text);
                setAiNotice(res || 'Edit command applied to timeline');
            } catch (err) {
                setAiNotice(`Failed: ${err.message}`);
            }
            setTimeout(() => setAiNotice(''), 4500);
        }
    };

    return (
        <aside className="w-80 flex-shrink-0 border-l border-[var(--border-app)] bg-[var(--bg-card)] flex flex-col h-full select-none">
            {/* Tab Bar */}
            <div className="grid grid-cols-6 gap-0.5 p-1.5 border-b border-[var(--border-app)]">
                {[
                    { id: 'style', label: 'Canvas', icon: Palette },
                    { id: 'camera', label: 'Zoom', icon: Camera },
                    { id: 'cursor', label: 'Cursor', icon: MousePointer },
                    { id: 'audio', label: 'Audio', icon: Volume2 },
                    { id: 'webcam', label: 'Camera', icon: Video },
                    { id: 'ai', label: 'AI', icon: Sparkles },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            title={tab.label}
                            className={`flex flex-col items-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                                isActive
                                    ? 'bg-[var(--accent-soft)] text-[var(--text-app)]'
                                    : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card-subtle)]'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* ═══ CANVAS TAB ═══ */}
                {activeTab === 'style' && (
                    <>
                        {/* Aspect Ratio */}
                        <div className="space-y-2">
                            <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                Aspect ratio
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {aspectRatios.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onChangeAspectRatio && onChangeAspectRatio(item.id)}
                                        className={`p-2 rounded-lg border text-left transition-all ${
                                            (aspectRatio || '16:9') === item.id
                                                ? 'bg-[var(--bg-card-subtle)] border-[var(--accent-app)] text-[var(--text-app)] shadow-xs font-bold'
                                                : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                        }`}
                                    >
                                        <div className={`text-[13px] ${item.id === 'native' ? '' : 'font-mono'}`}>{item.label}</div>
                                        <div className="text-[11px] opacity-75">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                            {(aspectRatio || '16:9') !== 'native' && (
                                <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    {[
                                        { id: 'contain', label: 'Fit', desc: 'Show the whole recording' },
                                        { id: 'fill', label: 'Fill', desc: 'Fill frame, auto-reframe' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => onChangeFrameFit && onChangeFrameFit(opt.id)}
                                            title={opt.id === 'fill' ? 'Crops the recording to fill the frame and keeps the camera on the action - great for vertical and square clips' : 'Letterboxes the whole recording inside the frame'}
                                            className={`p-2 rounded-lg border text-left transition-all ${
                                                (frameFit || 'contain') === opt.id
                                                    ? 'bg-[var(--bg-card-subtle)] border-[var(--accent-app)] text-[var(--text-app)] shadow-xs font-bold'
                                                    : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                            }`}
                                        >
                                            <div className="text-[13px]">{opt.label}</div>
                                            <div className="text-[11px] opacity-75">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Wallpapers */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                    Background
                                </label>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1 text-[11px] text-[var(--accent-app)] hover:underline font-mono"
                                >
                                    <Upload className="w-3 h-3" />
                                    <span>Custom Image</span>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <WallpaperPicker
                                background={background}
                                customImage={customImage}
                                onChange={onChangeBackground}
                            />

                            {customImage && !customImage._bgKey && (
                                <div className="p-2.5 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--accent-app)] flex items-center justify-between text-xs">
                                    <span className="text-[var(--accent-app)] font-mono font-medium">Uploaded Image Active</span>
                                    <button
                                        onClick={() => onChangeBackground(DEFAULT_BACKGROUND)}
                                        className="text-[11px] text-[var(--text-app-muted)] hover:text-red-400"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Framing & Presentation Presets */}
                        <div className="space-y-2 pt-2 border-t border-[var(--border-app)]">
                            <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                Layout
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onChangeFramingPreset) {
                                            onChangeFramingPreset('full');
                                        } else {
                                            onChangeInsetPadding && onChangeInsetPadding(0);
                                            onChangeBorderRadius && onChangeBorderRadius(0);
                                            onToggleWindowChrome && onToggleWindowChrome(false);
                                        }
                                    }}
                                    className={`p-2 rounded-lg border text-xs text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                        insetPadding <= 0.001 && !windowChrome && borderRadius === 0
                                            ? 'border-[var(--accent-app)] bg-[var(--bg-card-subtle)] font-bold shadow-xs text-[var(--text-app)]'
                                            : 'border-[var(--border-app)] hover:border-[var(--border-app-hover)] text-[var(--text-app-muted)]'
                                    }`}
                                >
                                    <Square className="w-3.5 h-3.5 text-[var(--accent-app)]" />
                                    <span>Full Frame</span>
                                    <span className="text-[11px] text-[var(--text-app-muted)]">Edge-to-edge</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onChangeFramingPreset) {
                                            onChangeFramingPreset('studio');
                                        } else {
                                            onChangeInsetPadding && onChangeInsetPadding(0.05);
                                            onChangeBorderRadius && onChangeBorderRadius(14);
                                            onToggleWindowChrome && onToggleWindowChrome(false);
                                        }
                                    }}
                                    className={`p-2 rounded-lg border text-xs text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                        insetPadding > 0.001 && !windowChrome
                                            ? 'border-[var(--accent-app)] bg-[var(--bg-card-subtle)] font-bold shadow-xs text-[var(--text-app)]'
                                            : 'border-[var(--border-app)] hover:border-[var(--border-app-hover)] text-[var(--text-app-muted)]'
                                    }`}
                                >
                                    <RectangleHorizontal className="w-3.5 h-3.5 text-[var(--accent-app)]" />
                                    <span>Studio</span>
                                    <span className="text-[11px] text-[var(--text-app-muted)]">Floating canvas</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onChangeFramingPreset) {
                                            onChangeFramingPreset('mockup');
                                        } else {
                                            onChangeInsetPadding && onChangeInsetPadding(0.08);
                                            onChangeBorderRadius && onChangeBorderRadius(18);
                                            onToggleWindowChrome && onToggleWindowChrome(true);
                                        }
                                    }}
                                    className={`p-2 rounded-lg border text-xs text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                        windowChrome
                                            ? 'border-[var(--accent-app)] bg-[var(--bg-card-subtle)] font-bold shadow-xs text-[var(--text-app)]'
                                            : 'border-[var(--border-app)] hover:border-[var(--border-app-hover)] text-[var(--text-app-muted)]'
                                    }`}
                                >
                                    <AppWindow className="w-3.5 h-3.5 text-[var(--accent-app)]" />
                                    <span>Mockup</span>
                                    <span className="text-[11px] text-[var(--text-app-muted)]">Titlebar dots</span>
                                </button>
                            </div>
                        </div>

                        {/* Canvas Inset / Padding */}
                        <div className="space-y-2 pt-2 border-t border-[var(--border-app)]">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                    Padding
                                </label>
                                <span className="text-xs font-mono font-bold text-[var(--accent-app)]">{Math.round(insetPadding * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="0.16"
                                step="0.01"
                                value={insetPadding}
                                onChange={(e) => onChangeInsetPadding && onChangeInsetPadding(parseFloat(e.target.value))}
                                className="w-full accent-[var(--accent-app)] cursor-pointer"
                            />
                            <div className="flex justify-between text-[11px] text-[var(--text-app-muted)] font-mono">
                                <span>0% (Flush)</span>
                                <span>8% (Studio)</span>
                                <span>16% (Wide)</span>
                            </div>
                        </div>

                        {/* Corner Radius & Window Header */}
                        <div className="space-y-3 pt-2 border-t border-[var(--border-app)]">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                    Corner radius
                                </label>
                                <span className="text-xs font-mono font-bold text-[var(--accent-app)]">{borderRadius}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="32"
                                step="2"
                                value={borderRadius}
                                onChange={(e) => onChangeBorderRadius && onChangeBorderRadius(parseInt(e.target.value))}
                                className="w-full accent-[var(--accent-app)] cursor-pointer"
                            />
                            <div className="flex justify-between text-[11px] text-[var(--text-app-muted)] font-mono">
                                <span>0px (Sharp)</span>
                                <span>18px (Modern)</span>
                                <span>32px (Soft)</span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div>
                                    <div className="text-xs font-semibold text-[var(--text-app)]">Window Title Bar</div>
                                    <div className="text-[11px] text-[var(--text-app-muted)]">Show macOS style header chrome with traffic lights</div>
                                </div>
                                <button
                                    onClick={() => onToggleWindowChrome && onToggleWindowChrome(!windowChrome)}
                                    className={`w-9 h-5 rounded-full transition-all relative ${
                                        windowChrome ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                        windowChrome ? 'left-[18px]' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* ═══ ZOOM TAB ═══ */}
                {activeTab === 'camera' && (() => {
                    const mode = !autoZoomOnClicks ? 'off' : (zoomFrequency === 'every' ? 'every' : 'minimal');
                    const pickMode = (m) => {
                        if (m === 'off') {
                            if (autoZoomOnClicks) onToggleAutoZoomOnClicks && onToggleAutoZoomOnClicks(false);
                            return;
                        }
                        onChangeZoomFrequency && onChangeZoomFrequency(m);
                        if (!autoZoomOnClicks) onToggleAutoZoomOnClicks && onToggleAutoZoomOnClicks(true);
                    };
                    const level = zoomLevel || 1.35;
                    const Option = ({ selected, onClick, title, desc }) => (
                        <button
                            onClick={onClick}
                            className={`py-2 px-2 rounded-lg border text-left transition-colors ${
                                selected
                                    ? 'border-[var(--accent-app)] bg-[var(--accent-soft)] text-[var(--text-app)]'
                                    : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:border-[var(--border-app-hover)]'
                            }`}
                        >
                            <div className="text-xs font-semibold">{title}</div>
                            {desc && <div className="text-[11px] opacity-75 leading-snug mt-0.5">{desc}</div>}
                        </button>
                    );
                    const Toggle = ({ on, onClick, label, desc }) => (
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-xs font-medium text-[var(--text-app)]">{label}</div>
                                <div className="text-[11px] text-[var(--text-app-muted)]">{desc}</div>
                            </div>
                            <button
                                onClick={onClick}
                                role="switch"
                                aria-checked={on}
                                className={`w-9 h-5 shrink-0 rounded-full transition-colors relative ${on ? 'bg-[var(--accent-app)]' : 'bg-[var(--border-app-hover)]'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'left-[18px]' : 'left-0.5'}`} />
                            </button>
                        </div>
                    );
                    return (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs text-[var(--text-app-muted)] font-medium">Auto zoom</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <Option selected={mode === 'off'} onClick={() => pickMode('off')} title="Off" desc="Full frame" />
                                    <Option selected={mode === 'minimal'} onClick={() => pickMode('minimal')} title="Minimal" desc="Focused work only" />
                                    <Option selected={mode === 'every'} onClick={() => pickMode('every')} title="Every action" desc="Each click" />
                                </div>
                                <p className="text-[11px] text-[var(--text-app-faint)] leading-snug">
                                    {mode === 'minimal' && 'Zooms when you type or work in one spot. Single clicks, scrolling and the scrollbar stay on the full frame.'}
                                    {mode === 'every' && 'Zooms toward each deliberate click or shortcut. Quick hops across the screen still stay wide.'}
                                    {mode === 'off' && 'No automatic zooms. Click the preview to add one by hand.'}
                                </p>
                            </div>

                            <div className={`space-y-2 ${mode === 'off' ? 'opacity-50' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-[var(--text-app-muted)] font-medium">Zoom depth</label>
                                    <span className="text-xs font-mono text-[var(--text-app)] tabular-nums">{level.toFixed(2)}×</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { scale: 1.35, title: 'Subtle', desc: 'Keeps context' },
                                        { scale: 1.55, title: 'Balanced', desc: 'Closer' },
                                        { scale: 1.85, title: 'Close', desc: 'Small details' },
                                    ].map(p => (
                                        <Option key={p.scale} selected={Math.abs(level - p.scale) < 0.05} onClick={() => onChangeZoomLevel(p.scale)} title={p.title} desc={p.desc} />
                                    ))}
                                </div>
                                <input
                                    type="range"
                                    min="1.15"
                                    max="2.5"
                                    step="0.05"
                                    value={level}
                                    onChange={(e) => onChangeZoomLevel(parseFloat(e.target.value))}
                                    aria-label="Zoom depth"
                                    className="w-full accent-[var(--accent-app)] cursor-pointer"
                                />
                            </div>

                            <div className={`space-y-2 ${mode === 'off' ? 'opacity-50' : ''}`}>
                                <label className="text-xs text-[var(--text-app-muted)] font-medium">Camera speed</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { id: 'gentle', title: 'Calm' },
                                        { id: 'cinematic', title: 'Natural' },
                                        { id: 'snappy', title: 'Quick' },
                                    ].map(p => (
                                        <Option key={p.id} selected={(springProfile || 'cinematic') === p.id} onClick={() => onChangeSpringProfile && onChangeSpringProfile(p.id)} title={p.title} />
                                    ))}
                                </div>
                            </div>

                            <details className="group pt-2 border-t border-[var(--border-app)]">
                                <summary className="cursor-pointer list-none flex items-center justify-between text-xs font-medium text-[var(--text-app-muted)] hover:text-[var(--text-app)] py-1">
                                    <span>More</span>
                                    <span className="transition-transform group-open:rotate-90">›</span>
                                </summary>
                                <div className="space-y-4 pt-3">
                                    <Toggle
                                        on={connectedZooms}
                                        onClick={() => onToggleConnectedZooms && onToggleConnectedZooms(!connectedZooms)}
                                        label="Pan between nearby zooms"
                                        desc="Glide across instead of zooming out and back in"
                                    />
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-[var(--text-app)]">Playback speed</label>
                                            <span className="text-xs font-mono text-[var(--text-app)] tabular-nums">{(playbackSpeed || 1).toFixed(2)}×</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.75"
                                            max="1.5"
                                            step="0.05"
                                            value={playbackSpeed || 1}
                                            onChange={(e) => onChangePlaybackSpeed && onChangePlaybackSpeed(parseFloat(e.target.value))}
                                            aria-label="Playback speed"
                                            className="w-full accent-[var(--accent-app)] cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-[var(--text-app)]">Perspective tilt</label>
                                            <span className="text-xs font-mono text-[var(--text-app)] tabular-nums">{tiltAngle}°</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="8"
                                            step="0.5"
                                            value={tiltAngle}
                                            onChange={(e) => onChangeTiltAngle && onChangeTiltAngle(parseFloat(e.target.value))}
                                            aria-label="Perspective tilt"
                                            className="w-full accent-[var(--accent-app)] cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </details>
                        </>
                    );
                })()}

                {/* ═══ CURSOR TAB ═══ */}
                {activeTab === 'cursor' && (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-semibold text-[var(--text-app)]">Synthetic Cursor Overlay</div>
                                    <div className="text-[11px] text-[var(--text-app-muted)]">
                                        {cursorBakedIn
                                            ? 'This recording already contains the system cursor'
                                            : 'Smooth, resizable pointer drawn over the recording'}
                                    </div>
                                </div>
                                <button
                                    onClick={onToggleCursor}
                                    disabled={cursorBakedIn && !showCursor}
                                    title={cursorBakedIn ? 'This recording was made with screen capture, which records the real cursor. Record with a display (native capture) to use the synthetic cursor.' : undefined}
                                    className={`w-9 h-5 rounded-full transition-all relative disabled:opacity-40 disabled:cursor-not-allowed ${
                                        showCursor ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                        showCursor ? 'left-[18px]' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>

                            {/* Cursor Themes */}
                            <div className="space-y-2">
                                <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                    Pointer style
                                </label>
                                <div className="grid grid-cols-3 gap-1">
                                    {[
                                        { id: 'windows', label: 'Windows 11' },
                                        { id: 'macos', label: 'macOS' },
                                        { id: 'cyber', label: 'Cyber Lime' },
                                        { id: 'neon', label: 'Neon Glow' },
                                        { id: 'dot', label: 'Minimal Dot' },
                                        { id: 'ring', label: 'Studio Ring' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => onChangeCursorTheme && onChangeCursorTheme(t.id)}
                                            className={`py-1.5 px-1 rounded-md border text-center text-[11px] transition-all cursor-pointer ${
                                                cursorTheme === t.id
                                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                                                    : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cursor Scale */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                        Pointer size
                                    </label>
                                    <span className="text-xs font-mono font-bold text-[var(--accent-app)]">
                                        {(cursorScale || 1.0).toFixed(1)}×
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.4"
                                    max="2"
                                    step="0.1"
                                    value={cursorScale || 1.0}
                                    onChange={(e) => onChangeCursorScale && onChangeCursorScale(parseFloat(e.target.value))}
                                    className="w-full accent-[var(--accent-app)] cursor-pointer"
                                />
                            </div>

                            {/* Catmull-Rom Spline Trajectory Smoothing */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)]">
                                <div>
                                    <div className="text-xs font-semibold text-[var(--text-app)]">Smooth Movement</div>
                                    <div className="text-[11px] text-[var(--text-app-muted)]">Removes hand jitter without lag</div>
                                </div>
                                <button
                                    onClick={() => onToggleSplineSmoothing && onToggleSplineSmoothing(!splineSmoothing)}
                                    className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${
                                        splineSmoothing ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                        splineSmoothing ? 'left-[18px]' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>

                            {/* Keystroke Overlay Badges (KeyCast) */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)]">
                                <div>
                                    <div className="text-xs font-semibold text-[var(--text-app)]">Keystroke Badges</div>
                                    <div className="text-[11px] text-[var(--text-app-muted)]">Show pressed shortcuts as on-screen badges</div>
                                </div>
                                <button
                                    onClick={() => onToggleKeystrokes && onToggleKeystrokes(!showKeystrokes)}
                                    className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${
                                        showKeystrokes ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                        showKeystrokes ? 'left-[18px]' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>

                            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] text-[11px] text-[var(--text-app-muted)] leading-relaxed">
                                Click ripple waves, vector pointer paths, and shortcut badges are dynamically composited with sub-pixel accuracy.
                            </div>
                        </div>
                    </>
                )}

                {/* ═══ AUDIO MIXER TAB ═══ */}
                {activeTab === 'audio' && (
                    <div className="space-y-4">
                        {/* Desktop Audio Track Card */}
                        <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onToggleSystemAudioMute && onToggleSystemAudioMute(!isSystemAudioMuted)}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                            isSystemAudioMuted
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-[var(--accent-app)] text-[var(--accent-app-fg)]'
                                        }`}
                                        title={isSystemAudioMuted ? 'Unmute Desktop Sound' : 'Mute Desktop Sound'}
                                    >
                                        {isSystemAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                    <div>
                                        <div className="text-xs font-semibold text-[var(--text-app)]">Desktop Audio</div>
                                        <div className="text-[11px] text-[var(--text-app-muted)]">WASAPI Loopback</div>
                                    </div>
                                </div>
                                <span className="font-mono text-xs font-bold text-[var(--accent-app)]">
                                    {isSystemAudioMuted ? 'MUTED' : `${Math.round((systemAudioVolume ?? 1.0) * 100)}%`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1.5"
                                step="0.05"
                                value={isSystemAudioMuted ? 0 : (systemAudioVolume ?? 1.0)}
                                onChange={(e) => onChangeSystemAudioVolume && onChangeSystemAudioVolume(parseFloat(e.target.value))}
                                disabled={isSystemAudioMuted}
                                className="w-full accent-[var(--accent-app)] cursor-pointer"
                            />
                        </div>

                        {/* Microphone Voice Card */}
                        <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onToggleMicAudioMute && onToggleMicAudioMute(!isMicAudioMuted)}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                            isMicAudioMuted
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-[var(--accent-app)] text-[var(--accent-app-fg)]'
                                        }`}
                                        title={isMicAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                                    >
                                        {isMicAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </button>
                                    <div>
                                        <div className="text-xs font-semibold text-[var(--text-app)]">Microphone Voice</div>
                                        <div className="text-[11px] text-[var(--text-app-muted)]">Voice Narration</div>
                                    </div>
                                </div>
                                <span className="font-mono text-xs font-bold text-[var(--accent-app)]">
                                    {isMicAudioMuted ? 'MUTED' : `${Math.round((micAudioVolume ?? 1.2) * 100)}%`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="2.0"
                                step="0.05"
                                value={isMicAudioMuted ? 0 : (micAudioVolume ?? 1.2)}
                                onChange={(e) => onChangeMicAudioVolume && onChangeMicAudioVolume(parseFloat(e.target.value))}
                                disabled={isMicAudioMuted}
                                className="w-full accent-[var(--accent-app)] cursor-pointer"
                            />
                        </div>

                        {/* Smart Voice Ducking */}
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)]">
                            <div>
                                <div className="text-xs font-semibold text-[var(--text-app)]">Smart Voice Ducking</div>
                                <div className="text-[11px] text-[var(--text-app-muted)] leading-tight mt-0.5">
                                    Auto-dip desktop volume 70% during speech
                                </div>
                            </div>
                            <button
                                onClick={() => onToggleAutoDuck && onToggleAutoDuck(!autoDuck)}
                                className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${
                                    autoDuck ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                }`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                    autoDuck ? 'left-[18px]' : 'left-0.5'
                                }`} />
                            </button>
                        </div>

                        <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1.5 text-[11px] text-[var(--text-app-muted)]">
                            <div className="flex items-center gap-1.5 text-[var(--text-app)] font-semibold">
                                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Cinema Multi-Track Processing</span>
                            </div>
                            <p className="leading-relaxed">
                                Audio tracks are balanced non-destructively. Adjustments synchronize seamlessly with live Studio playback and hardware-accelerated MP4 export.
                            </p>
                        </div>
                    </div>
                )}

                {/* ═══ WEBCAM TAB ═══ */}
                {activeTab === 'webcam' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold text-[var(--text-app)]">Webcam Overlay (PiP)</div>
                                <div className="text-[11px] text-[var(--text-app-muted)]">Show facecam in preview & export</div>
                            </div>
                            <button
                                onClick={() => onChangeWebcamSettings && onChangeWebcamSettings({ enabled: !webcamSettings?.enabled })}
                                className={`w-9 h-5 rounded-full transition-all relative ${
                                    webcamSettings?.enabled ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                }`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                    webcamSettings?.enabled ? 'left-[18px]' : 'left-0.5'
                                }`} />
                            </button>
                        </div>

                        {/* Shape Selector */}
                        <div className="space-y-2">
                            <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                Bubble shape
                            </label>
                            <div className="grid grid-cols-4 gap-1">
                                {[
                                    { id: 'circle', label: 'Circle', icon: Circle },
                                    { id: 'squircle', label: 'Squircle', icon: Square },
                                    { id: 'rounded', label: 'Rounded', icon: RectangleHorizontal },
                                    { id: 'square', label: 'Square', icon: Square },
                                ].map((s) => {
                                    const Icon = s.icon;
                                    const isSel = (webcamSettings?.shape || 'circle') === s.id;
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => onChangeWebcamSettings && onChangeWebcamSettings({ shape: s.id })}
                                            className={`py-2 px-1 rounded-md border flex flex-col items-center gap-1 transition-all ${
                                                isSel
                                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold'
                                                    : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-[11px]">{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Position Selector */}
                        <div className="space-y-2">
                            <label className="text-xs text-[var(--text-app-muted)] font-medium">
                                Position
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {[
                                    { id: 'top-left', label: 'Top left' },
                                    { id: 'top-right', label: 'Top right' },
                                    { id: 'bottom-left', label: 'Bottom left' },
                                    { id: 'bottom-right', label: 'Bottom right' },
                                    { id: 'center', label: 'Center (intro or outro)', colSpan: true },
                                ].map((p) => {
                                    const isSel = (webcamSettings?.position || 'bottom-right') === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => onChangeWebcamSettings && onChangeWebcamSettings({ position: p.id })}
                                            className={`py-1.5 px-2 rounded-md border text-center text-xs transition-all ${
                                                p.colSpan ? 'col-span-2' : ''
                                            } ${
                                                isSel
                                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                                                    : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Webcam Mirror */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-app)]">Mirror Camera Horizontally</span>
                            <button
                                onClick={() => onChangeWebcamSettings && onChangeWebcamSettings({ mirrored: !webcamSettings?.mirrored })}
                                className={`w-9 h-5 rounded-full transition-all relative ${
                                    webcamSettings?.mirrored ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                }`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                    webcamSettings?.mirrored ? 'left-[18px]' : 'left-0.5'
                                }`} />
                            </button>
                        </div>

                        {/* Dynamic Reactive Webcam Scaling */}
                        <div className="pt-2 border-t border-[var(--border-app)] flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold text-[var(--text-app)]">Reactive Zoom Scaling</div>
                                <div className="text-[11px] text-[var(--text-app-muted)]">Auto-shrink facecam during deep zooms so UI is visible</div>
                            </div>
                            <button
                                onClick={() => onToggleReactiveWebcam && onToggleReactiveWebcam(!reactiveWebcam)}
                                className={`w-9 h-5 rounded-full transition-all relative ${
                                    reactiveWebcam ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                }`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                    reactiveWebcam ? 'left-[18px]' : 'left-0.5'
                                }`} />
                            </button>
                        </div>

                        {/* Presenter Full Camera Mode Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold text-[var(--text-app)]">Full Camera Mode</div>
                                <div className="text-[11px] text-[var(--text-app-muted)]">Presenter fills entire viewport (intro / outro speech)</div>
                            </div>
                            <button
                                onClick={() => onChangeWebcamSettings && onChangeWebcamSettings({ fullCamera: !webcamSettings?.fullCamera })}
                                className={`w-9 h-5 rounded-full transition-all relative ${
                                    webcamSettings?.fullCamera ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                }`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                    webcamSettings?.fullCamera ? 'left-[18px]' : 'left-0.5'
                                }`} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ AI STUDIO & CAPTIONS TAB ═══ */}
                {activeTab === 'ai' && (
                    <div className="space-y-4">
                        {/* Auto-Captions Section */}
                        <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Subtitles className="w-4 h-4 text-[var(--accent-app)]" />
                                    <span className="text-xs font-semibold text-[var(--text-app)]">
                                        Captions
                                    </span>
                                </div>
                                <button
                                    onClick={onToggleCaptions}
                                    className={`w-9 h-5 rounded-full transition-all relative ${
                                        captionsEnabled ? 'bg-[var(--accent-app)]' : 'bg-gray-600'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                        captionsEnabled ? 'left-[18px]' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>

                            <p className="text-[11px] text-[var(--text-app-muted)] leading-relaxed">
                                Free, offline voiceover transcription rendered in sleek cinema subtitle pills.
                            </p>

                            <button
                                onClick={onGenerateCaptions}
                                disabled={isTranscribing}
                                className="w-full py-2 px-3 rounded-lg border border-[var(--border-app)] hover:border-[var(--accent-app)] text-xs font-mono flex items-center justify-center gap-2 transition-all"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isTranscribing ? 'animate-spin' : ''}`} />
                                <span>{isTranscribing ? 'Transcribing...' : `Transcribe Audio (${captions.length} captions)`}</span>
                            </button>
                        </div>

                        {/* Natural Language AI Editor */}
                        <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[var(--accent-app)]" />
                                    <span className="text-xs font-semibold text-[var(--text-app)]">
                                        AI editing
                                    </span>
                                </div>
                                {onOpenAISettings && (
                                    <button
                                        onClick={onOpenAISettings}
                                        className="p-1 rounded-md text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card)] transition-colors"
                                        title="Configure AI Providers (BYOK: Claude, OpenAI, Gemini, OpenRouter)"
                                    >
                                        <Settings2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <p className="text-[11px] text-[var(--text-app-muted)] leading-relaxed">
                                Describe timeline edits in plain English (e.g., &quot;zoom into center at 3s&quot;, &quot;speed 2x&quot;).
                            </p>

                            <form onSubmit={handleAISubmit} className="flex gap-1.5">
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    placeholder="Describe edit..."
                                    className="flex-1 bg-black/20 border border-[var(--border-app)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-app)] focus:outline-none focus:border-[var(--accent-app)] font-sans"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-[var(--accent-app)] text-[var(--accent-app-fg)] rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>

                            {aiNotice && (
                                <div className="text-[11px] text-[var(--accent-app)] font-mono animate-fadeIn">
                                    ✓ {aiNotice}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Export Action */}
            <div className="p-4 border-t border-[var(--border-app)] bg-[var(--bg-card)]">
                <button
                    onClick={onTriggerExport}
                    disabled={isExporting}
                    className="w-full py-3 rounded-xl bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:opacity-90 text-xs shadow-sm transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? 'Exporting…' : 'Export'}</span>
                </button>
            </div>
        </aside>
    );
}
