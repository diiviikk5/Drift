'use client';

import React, { useState } from 'react';
import { Download, Film, CheckCircle2, X, Zap, Cpu, Sliders } from 'lucide-react';

export default function ExportDialog({
    isOpen,
    onClose,
    onStartExport,
    isExporting,
    exportProgress,
    exportStage = 'Rendering & Encoding',
}) {
    const [format, setFormat] = useState('mp4');
    const [resolution, setResolution] = useState('1080p');
    const [fps, setFps] = useState('60');
    const [quality, setQuality] = useState('pro'); // 'master' | 'pro' | 'standard'

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 select-none animate-in fade-in duration-150">
            <div className="max-w-lg w-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-app)] shadow-2xl p-6 space-y-5 text-[var(--text-app)]">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold tracking-tight">Export Cinema Studio Video</h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#DCFE50]/15 text-[#DCFE50] border border-[#DCFE50]/30">
                                <Zap className="w-2.5 h-2.5" />
                                GPU Accelerated
                            </span>
                        </div>
                        <p className="text-xs text-[var(--text-app-muted)] mt-0.5">Hardware H.264 & WebCodecs multi-track encoder</p>
                    </div>
                    {!isExporting && (
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-app-muted)] hover:text-[var(--text-app)] transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isExporting ? (
                    <div className="space-y-5 py-6 text-center">
                        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-3 border-[var(--border-app)] border-t-[#DCFE50] animate-spin" />
                            <Film className="w-6 h-6 text-[#DCFE50]" />
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl font-mono font-bold tracking-tight text-[var(--text-app)]">
                                {exportProgress}%
                            </div>
                            <p className="text-xs font-medium text-[#DCFE50] animate-pulse">
                                {exportProgress < 90 ? exportStage : 'Finalizing file and writing to disk...'}
                            </p>
                            <div className="w-full h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden border border-[var(--border-app)]">
                                <div
                                    className="h-full bg-gradient-to-r from-[#DCFE50]/80 to-[#DCFE50] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(220,254,80,0.5)]"
                                    style={{ width: `${Math.min(100, Math.max(2, exportProgress))}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Format */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] font-mono uppercase tracking-wider">
                                Container Format
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'mp4', label: 'MP4', desc: 'Universal H.264' },
                                    { id: 'webm', label: 'WebM', desc: 'Lossless VP9' },
                                    { id: 'gif', label: 'GIF', desc: 'Loop Animation' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setFormat(item.id)}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${
                                            format === item.id
                                                ? 'bg-[#DCFE50] text-black font-bold shadow-sm border-[#DCFE50]'
                                                : 'border-[var(--border-app)] bg-[var(--bg-surface)] text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:border-[var(--border-hover)]'
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">{item.label}</div>
                                        <div className="text-[10px] opacity-75">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resolution */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] font-mono uppercase tracking-wider">
                                Resolution
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { id: '4k', label: '4K UHD', desc: '2160p' },
                                    { id: '2k', label: '2K QHD', desc: '1440p' },
                                    { id: '1080p', label: '1080p', desc: 'FHD Pro' },
                                    { id: '720p', label: '720p', desc: 'HD Fast' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setResolution(item.id)}
                                        className={`p-2 rounded-xl border text-center transition-all ${
                                            resolution === item.id
                                                ? 'bg-[#DCFE50] text-black font-bold shadow-sm border-[#DCFE50]'
                                                : 'border-[var(--border-app)] bg-[var(--bg-surface)] text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:border-[var(--border-hover)]'
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">{item.label}</div>
                                        <div className="text-[10px] opacity-75">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Frame Rate & Quality Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Frame Rate */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-[var(--text-app-muted)] font-mono uppercase tracking-wider">
                                    Frame Rate
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                        { id: '60', label: '60 FPS', desc: 'Cinema Fluid' },
                                        { id: '30', label: '30 FPS', desc: 'Standard' },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setFps(item.id)}
                                            className={`p-2 rounded-xl border text-center transition-all ${
                                                fps === item.id
                                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs border-[var(--accent-app)]'
                                                    : 'border-[var(--border-app)] bg-[var(--bg-surface)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                            }`}
                                        >
                                            <div className="text-xs font-semibold">{item.label}</div>
                                            <div className="text-[9px] opacity-75">{item.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bitrate / Quality */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-[var(--text-app-muted)] font-mono uppercase tracking-wider">
                                    Quality Preset
                                </label>
                                <div className="grid grid-cols-3 gap-1">
                                    {[
                                        { id: 'master', label: 'Master', desc: '60M' },
                                        { id: 'pro', label: 'Pro', desc: '30M' },
                                        { id: 'standard', label: 'Fast', desc: '16M' },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setQuality(item.id)}
                                            className={`p-2 rounded-xl border text-center transition-all ${
                                                quality === item.id
                                                    ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs border-[var(--accent-app)]'
                                                    : 'border-[var(--border-app)] bg-[var(--bg-surface)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                            }`}
                                        >
                                            <div className="text-xs font-semibold">{item.label}</div>
                                            <div className="text-[9px] opacity-75">{item.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={() => onStartExport(format, resolution, parseInt(fps, 10), quality)}
                            className="w-full mt-2 py-3.5 rounded-xl bg-[#DCFE50] text-black hover:bg-[#c8e840] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Video Now</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
