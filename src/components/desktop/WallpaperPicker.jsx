'use client';

import { BACKGROUND_LIST } from '@/lib/rendering/backgrounds';

/** Grid of studio background images. */
export default function WallpaperPicker({ background, customImage, onChange }) {
    const isSelected = (id) => background === id && (!customImage || customImage._bgKey === id);

    return (
        <div className="grid grid-cols-3 gap-1.5 max-h-80 overflow-y-auto pr-1">
            {BACKGROUND_LIST.map((bg) => (
                <button
                    key={bg.id}
                    onClick={() => onChange(bg.id)}
                    title={bg.name}
                    className={`group relative aspect-video rounded-lg overflow-hidden border transition-all ${
                        isSelected(bg.id)
                            ? 'border-[var(--accent-app)] ring-2 ring-[var(--accent-app)]/40'
                            : 'border-[var(--border-app)] hover:border-[var(--border-app-hover)]'
                    }`}
                >
                    <img src={bg.src} alt={bg.name} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 px-1.5 py-0.5 text-[9px] font-medium text-white/90 bg-gradient-to-t from-black/70 to-transparent truncate text-left opacity-0 group-hover:opacity-100 transition-opacity">
                        {bg.name}
                    </span>
                </button>
            ))}
        </div>
    );
}
