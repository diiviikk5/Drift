'use client';

import { useEffect, useRef, useState } from 'react';
import { WALLPAPER_LIBRARY, WALLPAPER_CATEGORIES, drawWallpaper } from '@/lib/rendering/wallpapers';

function WallpaperThumb({ id }) {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current;
        if (!c) return;
        // Defer so opening the panel never blocks on drawing every thumbnail.
        const handle = requestAnimationFrame(() => drawWallpaper(c.getContext('2d'), c.width, c.height, id));
        return () => cancelAnimationFrame(handle);
    }, [id]);
    return <canvas ref={ref} width={128} height={72} className="w-full h-full block" />;
}

/**
 * Grouped wallpaper grid: procedural library + photo backgrounds.
 * `photos` is { key: { name, src } }.
 */
export default function WallpaperPicker({ background, customImage, photos = {}, onChange }) {
    const photoEntries = Object.entries(photos).filter(([, v]) => v.src);
    const categories = [...WALLPAPER_CATEGORIES, ...(photoEntries.length ? ['Photos'] : [])];
    const current = WALLPAPER_LIBRARY.find(w => w.id === background);
    const [category, setCategory] = useState(current?.category || (photos[background]?.src ? 'Photos' : 'macOS'));

    const isSelected = (key) => background === key && (!customImage || customImage._bgKey === key);

    const tile = (key, name, content) => (
        <button
            key={key}
            onClick={() => onChange(key)}
            title={name}
            className={`group relative aspect-video rounded-lg overflow-hidden border transition-all ${
                isSelected(key)
                    ? 'border-[var(--accent-app)] ring-2 ring-[var(--accent-app)]/40'
                    : 'border-[var(--border-app)] hover:border-[var(--border-app-hover)]'
            }`}
        >
            {content}
            <span className="absolute inset-x-0 bottom-0 px-1.5 py-0.5 text-[9px] font-medium text-white/90 bg-gradient-to-t from-black/70 to-transparent truncate text-left opacity-0 group-hover:opacity-100 transition-opacity">
                {name}
            </span>
        </button>
    );

    return (
        <div className="space-y-2">
            <div className="flex gap-1 flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                            category === cat
                                ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold'
                                : 'bg-black/20 text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5 max-h-72 overflow-y-auto pr-1">
                {category === 'Photos'
                    ? photoEntries.map(([key, val]) => tile(key, val.name, (
                        <div className="w-full h-full" style={{ backgroundImage: `url(${val.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    )))
                    : WALLPAPER_LIBRARY.filter(w => w.category === category).map(w => tile(w.id, w.name, <WallpaperThumb id={w.id} />))}
            </div>
        </div>
    );
}
