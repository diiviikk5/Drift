import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLPAPER_LIBRARY, WALLPAPER_CATEGORIES, drawWallpaper, getWallpaper } from '../src/lib/rendering/wallpapers.js';

function mockCtx(width, height) {
    const noop = () => {};
    const grad = { addColorStop: noop };
    return new Proxy({ canvas: { width, height } }, {
        get(target, key) {
            if (key in target) return target[key];
            if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => grad;
            return noop;
        },
        set(target, key, value) { target[key] = value; return true; },
    });
}

test('library has 60+ wallpapers with unique ids across the expected categories', () => {
    assert.ok(WALLPAPER_LIBRARY.length >= 60, `only ${WALLPAPER_LIBRARY.length}`);
    const ids = new Set(WALLPAPER_LIBRARY.map(w => w.id));
    assert.equal(ids.size, WALLPAPER_LIBRARY.length);
    for (const w of WALLPAPER_LIBRARY) assert.ok(WALLPAPER_CATEGORIES.includes(w.category), w.id);
    assert.ok(WALLPAPER_LIBRARY.filter(w => w.category === 'Nature').length >= 18);
    assert.ok(WALLPAPER_LIBRARY.filter(w => w.category === 'Flow').length >= 12);
});

test('every wallpaper renders at every aspect ratio', () => {
    for (const [w, h] of [[1920, 1080], [1080, 1920], [1080, 1080], [1080, 1350], [128, 72]]) {
        for (const wp of WALLPAPER_LIBRARY) {
            assert.doesNotThrow(() => drawWallpaper(mockCtx(w, h), w, h, wp.id), `${wp.id} @ ${w}x${h}`);
        }
    }
});

test('legacy background keys still resolve', () => {
    for (const key of ['bigSur', 'monterey', 'ventura', 'sonoma', 'midnight', 'neonDrift', 'bloom', 'emerald']) {
        assert.ok(getWallpaper(key), key);
    }
    assert.doesNotThrow(() => drawWallpaper(mockCtx(100, 100), 100, 100, 'unknown-key'));
});
