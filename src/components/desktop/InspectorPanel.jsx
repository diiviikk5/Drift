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
    Settings2
} from 'lucide-react';

export default function InspectorPanel({
    background,
    onChangeBackground,
    backgrounds = {},
    customImage = null,
    onUploadCustomImage,
    zoomLevel,
    onChangeZoomLevel,
    showCursor,
    onToggleCursor,
    cursorTheme = 'macos',
    onChangeCursorTheme,
    cursorScale = 1.0,
    onChangeCursorScale,
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
    isExporting = false
}) {
    const [activeTab, setActiveTab] = useState('style');
    const fileInputRef = useRef(null);
    const [aiInput, setAiInput] = useState('');
    const [aiNotice, setAiNotice] = useState('');

    const aspectRatios = [
        { id: '16:9', label: '16:9', desc: 'Landscape' },
        { id: '9:16', label: '9:16', desc: 'Vertical' },
        { id: '1:1', label: '1:1', desc: 'Square' },
        { id: '4:5', label: '4:5', desc: 'Portrait' },
    ];
    const [selectedAspect, setSelectedAspect] = useState('16:9');
    const [springProfile, setSpringProfile] = useState('cinematic');

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && onUploadCustomImage) {
            onUploadCustomImage(file);
        }
    };

    const handleAISubmit = (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;
        if (onApplyAICommand) {
            const res = onApplyAICommand(aiInput.trim());
            setAiNotice(res || 'Edit command applied to timeline');
            setTimeout(() => setAiNotice(''), 3500);
        }
        setAiInput('');
    };

    return (
        <aside className="w-80 flex-shrink-0 border-l border-[var(--border-app)] bg-[var(--bg-card)] flex flex-col h-full select-none transition-colors">
            {/* Tab Bar */}
            <div className="flex border-b border-[var(--border-app)] bg-[var(--bg-card-subtle)] p-1 overflow-x-auto">
                {[
                    { id: 'style', label: 'Canvas', icon: Palette },
                    { id: 'camera', label: 'Zoom', icon: Camera },
                    { id: 'cursor', label: 'Cursor', icon: MousePointer },
                    { id: 'webcam', label: 'Webcam', icon: Video },
                    { id: 'ai', label: 'AI Studio', icon: Sparkles },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-1.5 px-2 text-[11px] font-medium flex items-center justify-center gap-1.5 rounded-md transition-all whitespace-nowrap ${
                                isActive
                                    ? 'bg-[var(--bg-card)] text-[var(--text-app)] shadow-xs font-bold'
                                    : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
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
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                Framing Aspect Ratio
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {aspectRatios.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedAspect(item.id)}
                                        className={`p-2 rounded-lg border text-left transition-all ${
                                            selectedAspect === item.id
                                                ? 'bg-[var(--bg-card-subtle)] border-[var(--accent-app)] text-[var(--text-app)] shadow-xs'
                                                : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                        }`}
                                    >
                                        <div className="font-mono font-bold text-xs">{item.id}</div>
                                        <div className="text-[10px] opacity-75">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Wallpapers */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                    Studio Wallpaper
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

                            <div className="grid grid-cols-2 gap-1.5">
                                {Object.entries(backgrounds).map(([key, val]) => {
                                    const isSelected = background === key && !customImage;
                                    const gradient = `linear-gradient(135deg, ${val.colors.join(', ')})`;

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => onChangeBackground(key)}
                                            className={`p-1.5 rounded-lg border flex items-center gap-2 transition-all text-left ${
                                                isSelected
                                                    ? 'border-[var(--accent-app)] bg-[var(--bg-card-subtle)] font-bold'
                                                    : 'border-[var(--border-app)] hover:border-[var(--border-app-hover)]'
                                            }`}
                                        >
                                            <div
                                                className="w-5 h-5 rounded-md shadow-xs flex-shrink-0"
                                                style={{ background: gradient }}
                                            />
                                            <span className="text-xs text-[var(--text-app)] truncate">{val.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {customImage && (
                                <div className="p-2.5 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--accent-app)] flex items-center justify-between text-xs">
                                    <span className="text-[var(--accent-app)] font-mono font-medium">Custom Image Active</span>
                                    <button
                                        onClick={() => onChangeBackground('midnight')}
                                        className="text-[10px] text-[var(--text-app-muted)] hover:text-red-400"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ═══ ZOOM TAB ═══ */}
                {activeTab === 'camera' && (
                    <>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                    Zoom Depth
                                </label>
                                <span className="text-xs font-mono font-bold text-[var(--accent-app)]">{zoomLevel}×</span>
                            </div>
                            <input
                                type="range"
                                min="1.2"
                                max="3.0"
                                step="0.1"
                                value={zoomLevel}
                                onChange={(e) => onChangeZoomLevel(parseFloat(e.target.value))}
                                className="w-full accent-[var(--accent-app)] cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-app-muted)] font-mono">
                                <span>1.2×</span>
                                <span>2.0×</span>
                                <span>3.0×</span>
                            </div>
                        </div>

                        {/* Motion Presets */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                Spring Easing Profile
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                                {[
                                    { id: 'cinematic', label: 'Cinema' },
                                    { id: 'natural', label: 'Natural' },
                                    { id: 'snappy', label: 'Snappy' },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSpringProfile(p.id)}
                                        className={`py-1.5 px-1 rounded-md border text-center text-xs transition-all ${
                                            springProfile === p.id
                                                ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold'
                                                : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ═══ CURSOR TAB ═══ */}
                {activeTab === 'cursor' && (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-semibold text-[var(--text-app)]">Synthetic Cursor Overlay</div>
                                    <div className="text-[10px] text-[var(--text-app-muted)]">Off by default to avoid double cursor</div>
                                </div>
                                <button
                                    onClick={onToggleCursor}
                                    className={`w-9 h-5 rounded-full transition-all relative ${
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
                                <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                    Cursor Style Theme
                                </label>
                                <div className="grid grid-cols-3 gap-1">
                                    {[
                                        { id: 'macos', label: 'macOS' },
                                        { id: 'dot', label: 'Minimal Dot' },
                                        { id: 'neon', label: 'Neon Glow' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => onChangeCursorTheme && onChangeCursorTheme(t.id)}
                                            className={`py-1.5 px-1 rounded-md border text-center text-xs transition-all ${
                                                cursorTheme === t.id
                                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold'
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
                                    <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                        Pointer Size
                                    </label>
                                    <span className="text-xs font-mono font-bold text-[var(--accent-app)]">
                                        {(cursorScale || 1.0).toFixed(1)}×
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.6"
                                    max="2.5"
                                    step="0.1"
                                    value={cursorScale || 1.0}
                                    onChange={(e) => onChangeCursorScale && onChangeCursorScale(parseFloat(e.target.value))}
                                    className="w-full accent-[var(--accent-app)] cursor-pointer"
                                />
                            </div>

                            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] text-[11px] text-[var(--text-app-muted)] leading-relaxed">
                                Click ripple waves are automatically rendered in sync with user interaction events.
                            </div>
                        </div>
                    </>
                )}

                {/* ═══ WEBCAM TAB ═══ */}
                {activeTab === 'webcam' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold text-[var(--text-app)]">Webcam Overlay (PiP)</div>
                                <div className="text-[10px] text-[var(--text-app-muted)]">Show facecam in preview & export</div>
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
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                PiP Shape
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
                                            <span className="text-[10px]">{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Position Selector */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                Corner Position
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {[
                                    { id: 'top-left', label: 'Top-Left' },
                                    { id: 'top-right', label: 'Top-Right' },
                                    { id: 'bottom-left', label: 'Bottom-Left' },
                                    { id: 'bottom-right', label: 'Bottom-Right' },
                                ].map((p) => {
                                    const isSel = (webcamSettings?.position || 'bottom-right') === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => onChangeWebcamSettings && onChangeWebcamSettings({ position: p.id })}
                                            className={`py-1.5 px-2 rounded-md border text-center text-xs transition-all ${
                                                isSel
                                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold'
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
                                        On-Device Captions
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
                                        AI Editing Assistant
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
                    className="w-full py-3 rounded-xl bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:opacity-90 font-bold text-xs uppercase tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? 'Exporting...' : 'Export Video'}</span>
                </button>
            </div>
        </aside>
    );
}
