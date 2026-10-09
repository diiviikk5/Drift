'use client';

import React, { useEffect, useRef, useState } from 'react';

const MIN_PX = 64; // smallest area worth recording, in screen pixels
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const HANDLES = [
    { id: 'nw', style: { left: 0, top: 0 }, cursor: 'nwse-resize' },
    { id: 'n', style: { left: '50%', top: 0 }, cursor: 'ns-resize' },
    { id: 'ne', style: { left: '100%', top: 0 }, cursor: 'nesw-resize' },
    { id: 'e', style: { left: '100%', top: '50%' }, cursor: 'ew-resize' },
    { id: 'se', style: { left: '100%', top: '100%' }, cursor: 'nwse-resize' },
    { id: 's', style: { left: '50%', top: '100%' }, cursor: 'ns-resize' },
    { id: 'sw', style: { left: 0, top: '100%' }, cursor: 'nesw-resize' },
    { id: 'w', style: { left: 0, top: '50%' }, cursor: 'ew-resize' },
];

/**
 * Snipping-tool style area selection over a frozen screenshot of the monitor.
 * Works in normalized monitor coordinates; reports {x, y, w, h} in 0..1.
 */
export default function AreaPicker({ imageUrl, screenWidth = 1920, screenHeight = 1080, initial = null, onConfirm, onCancel }) {
    const rootRef = useRef(null);
    const dragRef = useRef(null);
    const [sel, setSel] = useState(initial);

    const minW = MIN_PX / screenWidth;
    const minH = MIN_PX / screenHeight;

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') { e.preventDefault(); onCancel && onCancel(); }
            if (e.key === 'Enter' && sel) { e.preventDefault(); onConfirm && onConfirm(sel); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [sel, onConfirm, onCancel]);

    const pointAt = (e) => {
        const r = rootRef.current.getBoundingClientRect();
        return { x: clamp((e.clientX - r.left) / r.width, 0, 1), y: clamp((e.clientY - r.top) / r.height, 0, 1) };
    };

    const down = (e, mode = 'new') => {
        if (e.button !== 0) return;
        e.stopPropagation();
        const p = pointAt(e);
        dragRef.current = { mode, start: p, orig: sel };
        if (mode === 'new') setSel(null);
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };

    const move = (e) => {
        const d = dragRef.current;
        if (!d) return;
        const p = pointAt(e);
        if (d.mode === 'new') {
            const x = Math.min(d.start.x, p.x);
            const y = Math.min(d.start.y, p.y);
            setSel({ x, y, w: Math.abs(p.x - d.start.x), h: Math.abs(p.y - d.start.y) });
            return;
        }
        const o = d.orig;
        if (d.mode === 'move') {
            setSel({ ...o, x: clamp(o.x + p.x - d.start.x, 0, 1 - o.w), y: clamp(o.y + p.y - d.start.y, 0, 1 - o.h) });
            return;
        }
        let l = o.x, t = o.y, r = o.x + o.w, b = o.y + o.h;
        if (d.mode.includes('w')) l = Math.min(p.x, r - minW);
        if (d.mode.includes('e')) r = Math.max(p.x, l + minW);
        if (d.mode.includes('n')) t = Math.min(p.y, b - minH);
        if (d.mode.includes('s')) b = Math.max(p.y, t + minH);
        setSel({ x: l, y: t, w: r - l, h: b - t });
    };

    const up = () => {
        const d = dragRef.current;
        dragRef.current = null;
        if (d && d.mode === 'new') {
            setSel(s => (s && s.w * screenWidth >= MIN_PX && s.h * screenHeight >= MIN_PX ? s : null));
        }
    };

    const px = sel ? { w: Math.round(sel.w * screenWidth), h: Math.round(sel.h * screenHeight) } : null;
    const below = sel && sel.y + sel.h < 0.9;

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[9999] select-none"
            style={{ cursor: 'crosshair', background: '#000' }}
            onPointerDown={(e) => down(e, 'new')}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" draggable={false} className="absolute inset-0 w-full h-full pointer-events-none" />
            {!sel && <div className="absolute inset-0 bg-black/45 pointer-events-none" />}

            {!sel && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 text-white text-[13px] font-medium border border-white/15 pointer-events-none">
                    Drag to select the area to record · Esc to cancel
                </div>
            )}

            {sel && (
                <div
                    className="absolute"
                    style={{
                        left: `${sel.x * 100}%`, top: `${sel.y * 100}%`, width: `${sel.w * 100}%`, height: `${sel.h * 100}%`,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                        outline: '2px solid #d2ff2e',
                        cursor: 'move',
                    }}
                    onPointerDown={(e) => down(e, 'move')}
                >
                    {/* rule of thirds, very faint */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)',
                        backgroundSize: '33.333% 33.333%',
                        backgroundPosition: '-1px -1px',
                    }} />
                    {HANDLES.map(h => (
                        <div
                            key={h.id}
                            className="absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-[3px] bg-white border-2 border-[#d2ff2e]"
                            style={{ ...h.style, cursor: h.cursor }}
                            onPointerDown={(e) => down(e, h.id)}
                        />
                    ))}
                    <div
                        className="absolute left-0 flex items-center gap-2 whitespace-nowrap"
                        style={below ? { top: 'calc(100% + 10px)' } : { bottom: 'calc(100% + 10px)' }}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <span className="px-2.5 h-8 inline-flex items-center rounded-lg bg-black/85 text-white text-[12px] font-mono border border-white/15">
                            {px.w} × {px.h}
                        </span>
                        <button
                            type="button"
                            onClick={() => onConfirm && onConfirm(sel)}
                            className="px-3.5 h-8 rounded-lg bg-[#d2ff2e] text-black text-[13px] font-semibold border-2 border-black"
                        >
                            Record this area
                        </button>
                        <button
                            type="button"
                            onClick={() => onCancel && onCancel()}
                            className="px-3 h-8 rounded-lg bg-black/85 text-white text-[13px] border border-white/15"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
