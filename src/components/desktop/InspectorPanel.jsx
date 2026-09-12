'use client';

import React, { useState } from 'react';
import { Palette, Camera, MousePointer, Sparkles, Download, Check } from 'lucide-react';

export default function InspectorPanel({
    background,
    onChangeBackground,
    backgrounds,
    zoomLevel,
    onChangeZoomLevel,
    showCursor,
    onToggleCursor,
    onTriggerExport,
    isExporting
}) {
    const [activeTab, setActiveTab] = useState('style');

    const aspectRatios = [
        { id: '16:9', label: '16:9', desc: 'Landscape' },
        { id: '9:16', label: '9:16', desc: 'Vertical' },
        { id: '1:1', label: '1:1', desc: 'Square' },
        { id: '4:5', label: '4:5', desc: 'Portrait' },
    ];
    const [selectedAspect, setSelectedAspect] = useState('16:9');
    const [springProfile, setSpringProfile] = useState('cinematic');

    return (
        <aside className="w-72 flex-shrink-0 border-l border-[var(--border-app)] bg-[var(--bg-card)] flex flex-col h-full select-none transition-colors">
            {/* Tab Bar */}
            <div className="flex border-b border-[var(--border-app)] bg-[var(--bg-card-subtle)] p-1">
                {[
                    { id: 'style', label: 'Canvas', icon: Palette },
                    { id: 'camera', label: 'Zoom', icon: Camera },
                    { id: 'cursor', label: 'Cursor', icon: MousePointer },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-1.5 text-xs font-medium flex items-center justify-center gap-1.5 rounded-md transition-all ${
                                isActive
                                    ? 'bg-[var(--bg-card)] text-[var(--text-app)] shadow-xs font-semibold'
                                    : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
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
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] uppercase tracking-wider font-mono">
                                Studio Wallpaper
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {Object.entries(backgrounds).map(([key, val]) => {
                                    const isSelected = background === key;
                                    const gradient = `linear-gradient(135deg, ${val.colors.join(', ')})`;

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => onChangeBackground(key)}
                                            className={`p-1.5 rounded-lg border flex items-center gap-2 transition-all text-left ${
                                                isSelected
                                                    ? 'border-[var(--accent-app)] bg-[var(--bg-card-subtle)]'
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
                        </div>
                    </>
                )}

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
                                Spring Easing
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

                {activeTab === 'cursor' && (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-semibold text-[var(--text-app)]">Overlay Synthetic Cursor</div>
                                    <div className="text-[10px] text-[var(--text-app-muted)]">Default off to prevent double cursor</div>
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

                            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] text-[11px] text-[var(--text-app-muted)] leading-relaxed">
                                Click ripple effects are automatically applied on user clicks. Synthetic cursor overlay can be enabled if your screen recorder hides the system mouse.
                            </div>
                        </div>
                    </>
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
