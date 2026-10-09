'use client';

import React, { useEffect, useRef } from 'react';

const CORNERS = [
    { id: 'nw', cls: '-left-1.5 -top-1.5 cursor-nwse-resize' },
    { id: 'ne', cls: '-right-1.5 -top-1.5 cursor-nesw-resize' },
    { id: 'sw', cls: '-left-1.5 -bottom-1.5 cursor-nesw-resize' },
    { id: 'se', cls: '-right-1.5 -bottom-1.5 cursor-nwse-resize' },
];
const MIN = 0.02;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Editable boxes over the preview for the privacy blur regions. Region
 * coordinates are normalized to the recording; the boxes are placed through
 * the camera at the current frame, so they sit exactly on the blur.
 */
export default function BlurHandles({ studio, regions = [], selectedId, onSelect, onChange, onDelete, frame = 0 }) {
    const rootRef = useRef(null);
    const dragRef = useRef(null);

    // Delete / Backspace removes the selected blur (not while typing).
    useEffect(() => {
        const onKey = (e) => {
            if (!selectedId) return;
            const tag = (e.target?.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                onDelete && onDelete(selectedId);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedId, onDelete]);

    if (!studio || !regions.length) return null;

    const toSource = (e) => {
        const rect = rootRef.current?.parentElement?.getBoundingClientRect();
        if (!rect) return null;
        return studio.resolveClick(clamp((e.clientX - rect.left) / rect.width, 0, 1), clamp((e.clientY - rect.top) / rect.height, 0, 1));
    };

    const begin = (e, region, mode) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect && onSelect(region.id);
        const p = toSource(e);
        if (!p) return;
        dragRef.current = { id: region.id, mode, start: p, orig: { ...region } };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };

    const move = (e) => {
        const d = dragRef.current;
        if (!d) return;
        const p = toSource(e);
        if (!p) return;
        const o = d.orig;
        if (d.mode === 'move') {
            onChange(d.id, {
                x: clamp(o.x + (p.x - d.start.x), 0, 1 - o.w),
                y: clamp(o.y + (p.y - d.start.y), 0, 1 - o.h),
            });
            return;
        }
        // Resize: the opposite corner stays put.
        const left = d.mode.includes('w') ? Math.min(p.x, o.x + o.w - MIN) : o.x;
        const right = d.mode.includes('e') ? Math.max(p.x, o.x + MIN) : o.x + o.w;
        const top = d.mode.includes('n') ? Math.min(p.y, o.y + o.h - MIN) : o.y;
        const bottom = d.mode.includes('s') ? Math.max(p.y, o.y + MIN) : o.y + o.h;
        onChange(d.id, { x: clamp(left, 0, 1), y: clamp(top, 0, 1), w: clamp(right, 0, 1) - clamp(left, 0, 1), h: clamp(bottom, 0, 1) - clamp(top, 0, 1) });
    };

    const end = () => { dragRef.current = null; };

    return (
        <div ref={rootRef} className="absolute inset-0 z-20 pointer-events-none" data-frame={frame}>
            {regions.map((r) => {
                const a = studio.sourceToCanvasNorm(r.x, r.y);
                const b = studio.sourceToCanvasNorm(r.x + r.w, r.y + r.h);
                const selected = r.id === selectedId;
                return (
                    <div
                        key={r.id}
                        className={`absolute pointer-events-auto rounded-md cursor-move ${
                            selected
                                ? 'outline outline-2 outline-[var(--accent-app)] shadow-[0_0_0_4px_rgba(0,0,0,0.25)]'
                                : 'outline outline-1 outline-white/40 hover:outline-white/80'
                        }`}
                        style={{
                            left: `${a.x * 100}%`,
                            top: `${a.y * 100}%`,
                            width: `${(b.x - a.x) * 100}%`,
                            height: `${(b.y - a.y) * 100}%`,
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}
                        onPointerDown={(e) => begin(e, r, 'move')}
                        onPointerMove={move}
                        onPointerUp={end}
                        onPointerCancel={end}
                        title="Drag to move · corners to resize · Delete to remove"
                    >
                        {selected && CORNERS.map(c => (
                            <div
                                key={c.id}
                                className={`absolute w-3 h-3 rounded-sm bg-white border-2 border-[var(--accent-app)] ${c.cls}`}
                                onPointerDown={(e) => begin(e, r, c.id)}
                                onPointerMove={move}
                                onPointerUp={end}
                                onPointerCancel={end}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
