'use client';

import React, { useState } from 'react';
import { Palette, Camera, MousePointer, Layers, Sliders, Check, Sparkles } from 'lucide-react';

export default function InspectorPanel({
    background,
    onChangeBackground,
    backgrounds,
    zoomLevel,
    onChangeZoomLevel,
    showCursor,
    onToggleCursor,
    exportFormat,
    onChangeExportFormat,
    onTriggerExport,
    isExporting
}) {
    const [activeTab, setActiveTab] = useState('style');

    const aspectRatios = [
        { id: '16:9', label: '16:9 Landscape', desc: 'YouTube & Presentation' },
        { id: '9:16', label: '9:16 Vertical', desc: 'TikTok & Reels' },
        { id: '1:1', label: '1:1 Square', desc: 'Social & Feed' },
        { id: '4:5', label: '4:5 Portrait', desc: 'Instagram Post' },
    ];
    const [selectedAspect, setSelectedAspect] = useState('16:9');
    const [springProfile, setSpringProfile] = useState('cinematic'); // 'cinematic' | 'natural' | 'snappy'
    const [cursorScale, setCursorScale] = useState(1.2);
    const [clickHighlight, setClickHighlight] = useState(true);

    return (
        <aside className="w-80 flex-shrink-0 border-l border-white/[0.08] bg-[#090A10]/95 backdrop-blur-2xl flex flex-col h-full select-none">
            {/* Inspector Tab Bar */}
            <div className="flex border-b border-white/[0.08] bg-white/[0.02]">
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
                            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                                isActive
                                    ? 'border-[#DCFE50] text-[#DCFE50] bg-white/[0.02]'
                                    : 'border-transparent text-gray-400 hover:text-white'
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
                        {/* Aspect Ratio Presets */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                                Framing Aspect Ratio
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {aspectRatios.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedAspect(item.id)}
                                        className={`p-2.5 rounded-xl border text-left transition-all ${
                                            selectedAspect === item.id
                                                ? 'bg-[#DCFE50]/10 border-[#DCFE50] text-white shadow-xs ring-1 ring-[#DCFE50]/20'
                                                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        <div className="font-mono font-bold text-xs">{item.id}</div>
                                        <div className="text-[10px] text-gray-500">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Background Wallpapers */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                                Studio Wallpaper
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(backgrounds).map(([key, val]) => {
                                    const isSelected = background === key;
                                    const gradient = `linear-gradient(135deg, ${val.colors.join(', ')})`;

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => onChangeBackground(key)}
                                            className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                                                isSelected
                                                    ? 'border-[#DCFE50] bg-white/[0.06] ring-1 ring-[#DCFE50]/30'
                                                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <div
                                                className="w-7 h-7 rounded-lg shadow-sm flex-shrink-0"
                                                style={{ background: gradient }}
                                            />
                                            <span className="text-xs font-medium text-white truncate">{val.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'camera' && (
                    <>
                        {/* Zoom Factor */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                                    Zoom Depth
                                </label>
                                <span className="text-xs font-mono font-bold text-[#DCFE50]">{zoomLevel}×</span>
                            </div>
                            <input
                                type="range"
                                min="1.2"
                                max="3.0"
                                step="0.1"
                                value={zoomLevel}
                                onChange={(e) => onChangeZoomLevel(parseFloat(e.target.value))}
                                className="w-full accent-[#DCFE50] cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                <span>Subtle (1.2×)</span>
                                <span>Cinema (2.0×)</span>
                                <span>Extreme (3.0×)</span>
                            </div>
                        </div>

                        {/* Spring Physics Presets */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                                Spring Physics Motion
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { id: 'cinematic', label: 'Cinema', desc: 'Damped' },
                                    { id: 'natural', label: 'Natural', desc: 'Fluid' },
                                    { id: 'snappy', label: 'Snappy', desc: 'Fast' },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSpringProfile(p.id)}
                                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                                            springProfile === p.id
                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] font-bold'
                                                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">{p.label}</div>
                                        <div className="text-[9px] text-gray-500">{p.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#DCFE50]" />
                                <span>Harmonic Camera Engine</span>
                            </h5>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Drift tracks clicks and smoothly pans the camera using damped harmonic spring curves to keep context clear.
                            </p>
                        </div>
                    </>
                )}

                {activeTab === 'cursor' && (
                    <>
                        <div className="space-y-4">
                            {/* Show Cursor Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white">Render Cursor</span>
                                <button
                                    onClick={onToggleCursor}
                                    className={`w-10 h-5 rounded-full transition-all relative ${
                                        showCursor ? 'bg-[#DCFE50]' : 'bg-gray-700'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-black shadow transition-transform ${
                                        showCursor ? 'left-[22px]' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>

                            {/* Cursor Scale Slider */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                                        Cursor Size
                                    </label>
                                    <span className="text-xs font-mono font-bold text-[#DCFE50]">{cursorScale}×</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="2.0"
                                    step="0.1"
                                    value={cursorScale}
                                    onChange={(e) => setCursorScale(parseFloat(e.target.value))}
                                    className="w-full accent-[#DCFE50] cursor-pointer"
                                />
                            </div>

                            {/* Click Highlight Ripple Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-300">Click Highlight Ring</span>
                                <button
                                    onClick={() => setClickHighlight(!clickHighlight)}
                                    className={`w-9 h-[18px] rounded-full transition-all relative ${
                                        clickHighlight ? 'bg-[#DCFE50]' : 'bg-gray-700'
                                    }`}
                                >
                                    <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-transform ${
                                        clickHighlight ? 'left-[19px]' : 'left-[2px]'
                                    }`} />
                                </button>
                            </div>

                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                                    240Hz sub-pixel cursor interpolation smooths jittery hand movements into cinematic sweeps.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Export Action */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0E0F17] space-y-2">
                <button
                    onClick={onTriggerExport}
                    disabled={isExporting}
                    className="w-full py-3.5 rounded-xl bg-[#DCFE50] hover:bg-[#c9ea3e] text-black font-extrabold text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(220,254,80,0.3)] transition-all flex items-center justify-center gap-2"
                >
                    {isExporting ? 'Exporting Video...' : 'Export Final Video'}
                </button>
            </div>
        </aside>
    );
}
