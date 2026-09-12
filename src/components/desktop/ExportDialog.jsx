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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none animate-in fade-in duration-150">
            <div className="max-w-md w-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-app)] shadow-2xl p-6 space-y-6 text-[var(--text-app)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold tracking-tight">Export Cinema Video</h3>
                        <p className="text-xs text-[var(--text-app-muted)]">Hardware accelerated WebCodecs encoding</p>
                    </div>
                    {!isExporting && (
                        <button onClick={onClose} className="text-[var(--text-app-muted)] hover:text-[var(--text-app)]">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isExporting ? (
                    <div className="space-y-4 py-6 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full border-3 border-[var(--border-app)] border-t-[var(--accent-app)] animate-spin" />
                        <div>
                            <div className="text-xl font-mono font-bold">{exportProgress}%</div>
                            <p className="text-xs text-[var(--text-app-muted)] mt-1">Rendering auto-zoom and encoding video...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Format */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] font-mono uppercase">
                                Format
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'mp4', label: 'MP4', desc: 'Universal' },
                                    { id: 'webm', label: 'WebM', desc: 'Lossless' },
                                    { id: 'gif', label: 'GIF', desc: 'Animated' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setFormat(item.id)}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${
                                            format === item.id
                                                ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                                                : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">{item.label}</div>
                                        <div className="text-[10px] opacity-75">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resolution */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-[var(--text-app-muted)] font-mono uppercase">
                                Resolution
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: '4k', label: '4K UHD', desc: '2160p' },
                                    { id: '1080p', label: '1080p', desc: 'FHD' },
                                    { id: '720p', label: '720p', desc: 'HD' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setResolution(item.id)}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${
                                            resolution === item.id
                                                ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                                                : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">{item.label}</div>
                                        <div className="text-[10px] opacity-75">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={() => onStartExport(format, resolution)}
                            className="w-full py-3.5 rounded-xl bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:opacity-90 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Video Now</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
