'use client';

import React, { useState } from 'react';
import { Download, Film, CheckCircle2, X } from 'lucide-react';

export default function ExportDialog({
    isOpen,
    onClose,
    onStartExport,
    isExporting,
    exportProgress
}) {
    const [format, setFormat] = useState('mp4');
    const [resolution, setResolution] = useState('1080p');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <div className="max-w-md w-full rounded-2xl bg-[#0D0E16] border border-white/[0.1] shadow-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Export Cinema Video</h3>
                        <p className="text-xs text-gray-400">Select rendering bitrate, format, and destination</p>
                    </div>
                    {!isExporting && (
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {isExporting ? (
                    <div className="space-y-4 py-6 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#DCFE50]/20 border-t-[#DCFE50] animate-spin" />
                        <div>
                            <div className="text-2xl font-mono font-bold text-white">{exportProgress}%</div>
                            <p className="text-xs text-gray-400 mt-1">Baking Auto-Zoom & Hardware Encoding...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Format Selection */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 font-mono uppercase">Video Format</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'mp4', label: 'MP4', desc: 'Universal' },
                                    { id: 'webm', label: 'WebM', desc: 'Lossless' },
                                    { id: 'gif', label: 'GIF', desc: 'Animated' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setFormat(item.id)}
                                        className={`p-3 rounded-xl border text-center transition-all ${
                                            format === item.id
                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] font-bold'
                                                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <div className="text-sm font-mono">{item.label}</div>
                                        <div className="text-[10px] text-gray-500">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resolution Selection */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 font-mono uppercase">Resolution</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: '4k', label: '4K UHD', desc: '3840×2160' },
                                    { id: '1080p', label: '1080p', desc: '1920×1080' },
                                    { id: '720p', label: '720p', desc: 'Fast Share' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setResolution(item.id)}
                                        className={`p-3 rounded-xl border text-center transition-all ${
                                            resolution === item.id
                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] font-bold'
                                                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <div className="text-sm font-mono">{item.label}</div>
                                        <div className="text-[10px] text-gray-500">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Export Button */}
                        <button
                            onClick={() => onStartExport(format, resolution)}
                            className="w-full py-3.5 rounded-xl bg-[#DCFE50] hover:bg-[#c9ea3e] text-black font-extrabold text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(220,254,80,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4 stroke-[3]" />
                            <span>Export Video Now</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
