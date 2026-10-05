'use client';

import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

/** A row of mutually exclusive options. */
function Choice({ label, value, onChange, options, columns }) {
    return (
        <div className="space-y-1.5">
            <div className="text-xs font-medium text-[var(--text-app-muted)]">{label}</div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns || options.length}, minmax(0, 1fr))` }}>
                {options.map((o) => {
                    const selected = value === o.id;
                    return (
                        <button
                            key={o.id}
                            onClick={() => onChange(o.id)}
                            className={`px-2.5 py-2 rounded-lg border text-left transition-colors ${
                                selected
                                    ? 'border-[var(--accent-app)] bg-[var(--accent-soft)] text-[var(--text-app)]'
                                    : 'border-[var(--border-app)] text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:border-[var(--border-app-hover)]'
                            }`}
                        >
                            <div className="text-[13px] font-medium">{o.label}</div>
                            {o.desc && <div className="text-xs opacity-75 truncate">{o.desc}</div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function ExportDialog({
    isOpen,
    onClose,
    onStartExport,
    isExporting,
    exportProgress,
    exportStage = 'Rendering',
}) {
    const [format, setFormat] = useState('mp4');
    const [resolution, setResolution] = useState('1080p');
    const [fps, setFps] = useState('60');
    const [quality, setQuality] = useState('pro'); // 'master' | 'pro' | 'standard'

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 select-none">
            <div className="max-w-lg w-full rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-app)] p-5 space-y-5 text-[var(--text-app)]" style={{ boxShadow: 'var(--shadow-pop)' }}>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-semibold tracking-tight">Export video</h3>
                        <p className="text-[13px] text-[var(--text-app-muted)] mt-0.5">Rendered on this computer. Nothing is uploaded.</p>
                    </div>
                    {!isExporting && (
                        <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card-subtle)] transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isExporting ? (
                    <div className="space-y-3 py-4">
                        <div className="flex items-baseline justify-between">
                            <span className="text-[13px] text-[var(--text-app-muted)]">
                                {exportProgress < 90 ? exportStage : 'Saving the file'}
                            </span>
                            <span className="font-mono text-lg">{exportProgress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg-card-subtle)] overflow-hidden">
                            <div
                                className="h-full bg-[var(--accent-app)] rounded-full transition-[width] duration-300"
                                style={{ width: `${Math.min(100, Math.max(2, exportProgress))}%` }}
                            />
                        </div>
                        <p className="text-xs text-[var(--text-app-faint)]">You can keep using your computer while this runs.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Choice
                            label="Format"
                            value={format}
                            onChange={setFormat}
                            options={[
                                { id: 'mp4', label: 'MP4', desc: 'Plays everywhere (recommended)' },
                                { id: 'webm', label: 'WebM', desc: 'For the web' },
                            ]}
                        />
                        <Choice
                            label="Resolution"
                            value={resolution}
                            onChange={setResolution}
                            options={[
                                { id: '4k', label: '4K', desc: '2160p' },
                                { id: '2k', label: '1440p', desc: 'QHD' },
                                { id: '1080p', label: '1080p', desc: 'Full HD' },
                                { id: '720p', label: '720p', desc: 'Smaller file' },
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Choice
                                label="Frame rate"
                                value={fps}
                                onChange={setFps}
                                options={[
                                    { id: '60', label: '60 fps', desc: 'Smoothest' },
                                    { id: '30', label: '30 fps', desc: 'Smaller' },
                                ]}
                            />
                            <Choice
                                label="Quality"
                                value={quality}
                                onChange={setQuality}
                                options={[
                                    { id: 'master', label: 'Best' },
                                    { id: 'pro', label: 'High' },
                                    { id: 'standard', label: 'Small' },
                                ]}
                            />
                        </div>

                        <button
                            onClick={() => onStartExport(format, resolution, parseInt(fps, 10), quality)}
                            className="w-full h-11 rounded-xl bg-[var(--accent-app)] text-[var(--accent-app-fg)] hover:brightness-105 text-[14px] font-semibold flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
