'use client';

import React from 'react';
import { EyeOff, Plus, Trash2, Clock } from 'lucide-react';

const fmt = (t) => {
    if (!Number.isFinite(t)) return '';
    const m = Math.floor(t / 60);
    const s = (t - m * 60).toFixed(1).padStart(4, '0');
    return `${m}:${s}`;
};

/**
 * Privacy tab: frosted blur over anything that shouldn't be seen (emails,
 * keys, names). Regions are drawn on the preview and stick to the content.
 */
export default function PrivacyPanel({
    blurRegions = [],
    selectedBlurId = null,
    drawingBlur = false,
    currentTime = 0,
    onStartDrawBlur,
    onSelectBlur,
    onUpdateBlur,
    onDeleteBlur,
}) {
    return (
        <div className="space-y-5">
            <div>
                <div className="text-xs font-semibold text-[var(--text-app)]">Blur</div>
                <div className="text-[11px] text-[var(--text-app-muted)] mt-0.5">
                    Hide passwords, emails or anything private. The blur follows the content when the camera zooms.
                </div>
            </div>

            <button
                onClick={onStartDrawBlur}
                className={`w-full h-10 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold border transition-colors ${
                    drawingBlur
                        ? 'bg-[var(--accent-app)] text-black border-transparent'
                        : 'border-[var(--border-app)] text-[var(--text-app)] hover:bg-[var(--bg-hover,rgba(255,255,255,0.06))]'
                }`}
            >
                {drawingBlur ? <EyeOff size={14} /> : <Plus size={14} />}
                {drawingBlur ? 'Drag over the preview to blur…' : 'Add blur'}
            </button>

            {blurRegions.length === 0 && !drawingBlur && (
                <div className="text-[11px] text-[var(--text-app-muted)] text-center py-4 border border-dashed border-[var(--border-app)] rounded-lg">
                    No blurs yet
                </div>
            )}

            <div className="space-y-2">
                {blurRegions.map((r, i) => {
                    const selected = r.id === selectedBlurId;
                    const whole = !Number.isFinite(r.start) && !Number.isFinite(r.end);
                    return (
                        <div
                            key={r.id}
                            onClick={() => onSelectBlur && onSelectBlur(r.id)}
                            className={`rounded-lg border p-3 space-y-3 cursor-pointer transition-colors ${
                                selected ? 'border-[var(--accent-app)] bg-[rgba(255,255,255,0.03)]' : 'border-[var(--border-app)]'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-app)]">
                                    <EyeOff size={13} /> Blur {i + 1}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteBlur && onDeleteBlur(r.id); }}
                                    className="p-1 rounded text-[var(--text-app-muted)] hover:text-red-400"
                                    title="Remove blur"
                                    aria-label={`Remove blur ${i + 1}`}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-app-muted)]">
                                <Clock size={12} />
                                {whole
                                    ? 'Whole video'
                                    : `${Number.isFinite(r.start) ? fmt(r.start) : 'start'} – ${Number.isFinite(r.end) ? fmt(r.end) : 'end'}`}
                            </div>

                            {selected && (
                                <>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateBlur(r.id, { start: currentTime, end: Number.isFinite(r.end) && r.end > currentTime ? r.end : null }); }}
                                            className="h-7 rounded-md border border-[var(--border-app)] text-[11px] text-[var(--text-app)]"
                                            title="The blur starts at the playhead"
                                        >From here</button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateBlur(r.id, { end: currentTime, start: Number.isFinite(r.start) && r.start < currentTime ? r.start : null }); }}
                                            className="h-7 rounded-md border border-[var(--border-app)] text-[11px] text-[var(--text-app)]"
                                            title="The blur ends at the playhead"
                                        >Until here</button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateBlur(r.id, { start: null, end: null }); }}
                                            className="h-7 rounded-md border border-[var(--border-app)] text-[11px] text-[var(--text-app)]"
                                        >Whole</button>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-medium text-[var(--text-app)]">Strength</label>
                                            <span className="text-[11px] font-mono text-[var(--text-app-muted)]">{Math.round((r.strength ?? 1) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.4"
                                            max="2"
                                            step="0.05"
                                            value={r.strength ?? 1}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => onUpdateBlur(r.id, { strength: parseFloat(e.target.value) })}
                                            aria-label={`Blur ${i + 1} strength`}
                                            className="w-full accent-[var(--accent-app)] cursor-pointer"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
