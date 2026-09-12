'use client';

import React from 'react';
import { Monitor, Check, ExternalLink, Sparkles } from 'lucide-react';

export default function SourcePickerGrid({
    sources,
    selectedSource,
    onSelectSource,
    onSelectBrowserSource,
    sourceThumbnails,
    loadingSources
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-[#DCFE50]" />
                        <span>Display Capture</span>
                    </h3>
                    <p className="text-xs text-gray-400">Select the display or window to record with auto-zoom</p>
                </div>
                <button
                    onClick={onSelectBrowserSource}
                    className="flex items-center gap-1.5 text-xs text-[#DCFE50] hover:underline font-medium"
                >
                    <span>System Picker</span>
                    <ExternalLink className="w-3 h-3" />
                </button>
            </div>

            {loadingSources ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="h-44 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
                    ))}
                </div>
            ) : sources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sources.map((src) => {
                        const isSelected = selectedSource === src.id;
                        const thumb = sourceThumbnails[src.id] || src.thumbnailDataUrl;

                        return (
                            <div
                                key={src.id}
                                onClick={() => onSelectSource(src.id)}
                                className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-[#0E0F17] ${
                                    isSelected
                                        ? 'border-[#DCFE50] shadow-[0_0_24px_rgba(220,254,80,0.18)] scale-[1.01]'
                                        : 'border-white/[0.08] hover:border-white/20 hover:bg-[#13141F]'
                                }`}
                            >
                                {/* Thumbnail Preview */}
                                <div className="relative aspect-video w-full bg-[#050608] overflow-hidden">
                                    {thumb ? (
                                        <img
                                            src={thumb}
                                            alt={src.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                                            <Monitor className="w-8 h-8 opacity-40" />
                                            <span className="text-[10px] font-mono">Live Display Feed</span>
                                        </div>
                                    )}

                                    {/* Primary Badge */}
                                    {src.is_primary && (
                                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#DCFE50] text-black text-[9px] font-extrabold tracking-wider uppercase shadow-md">
                                            Primary Display
                                        </div>
                                    )}

                                    {/* Resolution Tag */}
                                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[10px] font-mono border border-white/10">
                                        {src.width ? `${src.width} × ${src.height}` : '1920 × 1080'}
                                    </div>

                                    {/* Selected Checkmark */}
                                    {isSelected && (
                                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#DCFE50] text-black flex items-center justify-center shadow-lg font-bold">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                    )}
                                </div>

                                {/* Label Bar */}
                                <div className="p-3 flex items-center justify-between border-t border-white/[0.06]">
                                    <div>
                                        <h4 className="text-xs font-bold text-white truncate max-w-[200px]">{src.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-mono">Hardware accelerated capture</p>
                                    </div>
                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                        isSelected ? 'text-[#DCFE50] bg-[#DCFE50]/10' : 'text-gray-500'
                                    }`}>
                                        {isSelected ? 'Ready' : 'Click to Select'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <Monitor className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-white mb-1">No Native Displays Listed</h4>
                    <p className="text-xs text-gray-400 mb-4">Click below to open the system display selector dialog</p>
                    <button
                        onClick={onSelectBrowserSource}
                        className="px-4 py-2 rounded-xl bg-[#DCFE50] text-black font-bold text-xs hover:bg-[#c8ea3e] transition-all"
                    >
                        Open Display Picker
                    </button>
                </div>
            )}
        </div>
    );
}
