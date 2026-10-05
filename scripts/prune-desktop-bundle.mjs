/**
 * Keep only what the desktop app loads from the static export.
 *
 * The export also contains the whole marketing site (thousands of Labs
 * converter pages, installers for the download button, social images...).
 * The desktop window only opens /recorder, so everything else is removed
 * before Tauri bundles the folder. The website build is unaffected.
 *
 *   node scripts/prune-desktop-bundle.mjs [outDir]
 */
import fs from 'fs';
import path from 'path';

const out = path.resolve(process.argv[2] || 'out');

const KEEP = new Set([
    '_next',        // scripts, styles, fonts
    'recorder',     // the app
    'backgrounds',  // studio backgrounds
    'brand',        // app logo
    'index.html',
    '404.html',
    'icon.ico',
    'favicon.ico',
]);

function size(p) {
    const st = fs.statSync(p);
    if (!st.isDirectory()) return st.size;
    return fs.readdirSync(p).reduce((a, f) => a + size(path.join(p, f)), 0);
}

if (!fs.existsSync(path.join(out, 'recorder'))) {
    console.error(`[prune] ${out}/recorder not found - is this a static export?`);
    process.exit(1);
}
const before = size(out);
for (const entry of fs.readdirSync(out)) {
    if (!KEEP.has(entry)) fs.rmSync(path.join(out, entry), { recursive: true, force: true });
}
const after = size(out);
console.log(`[prune] desktop bundle ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
