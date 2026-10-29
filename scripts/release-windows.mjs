#!/usr/bin/env node
/**
 * Build a signed Windows release of Drift Recorder and the latest.json the
 * in-app updater reads.
 *
 *   node scripts/release-windows.mjs              build + latest.json (local test)
 *   node scripts/release-windows.mjs --publish    ...and upload to the GitHub release v<version>
 *
 * The version comes from src-tauri/tauri.conf.json: bump it first. The update
 * signing key stays outside the repo (C:\Users\Divik\.tauri\drift-updater.key,
 * password beside it); override with TAURI_SIGNING_PRIVATE_KEY(_PASSWORD).
 * Installed apps check https://github.com/diiviikk5/Drift/releases/latest/download/latest.json,
 * so a release only reaches users once it is the latest (non-pre-release) one.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publish = process.argv.includes('--publish');
const conf = JSON.parse(readFileSync(join(root, 'src-tauri/tauri.conf.json'), 'utf8'));
const version = conf.version;
const tag = `v${version}`;
const repo = 'diiviikk5/Drift';

const keyDir = join(homedir(), '.tauri');
const env = { ...process.env };
if (!env.TAURI_SIGNING_PRIVATE_KEY) {
    const keyFile = join(keyDir, 'drift-updater.key');
    if (!existsSync(keyFile)) throw new Error(`Signing key not found: ${keyFile}`);
    env.TAURI_SIGNING_PRIVATE_KEY = readFileSync(keyFile, 'utf8');
    env.TAURI_SIGNING_PRIVATE_KEY_PASSWORD = readFileSync(join(keyDir, 'drift-updater.password'), 'utf8').trim();
}
// Build output lives on D: (C: is nearly full)
env.CARGO_TARGET_DIR = env.CARGO_TARGET_DIR || 'D:/drift_target';

console.log(`Building Drift Recorder ${version} (signed)...`);
execSync('npx tauri build --bundles nsis', { cwd: root, env, stdio: 'inherit' });

const nsisDir = join(env.CARGO_TARGET_DIR, 'release/bundle/nsis');
const exe = readdirSync(nsisDir).find((f) => f.includes(`_${version}_`) && f.endsWith('-setup.exe'));
if (!exe || !existsSync(join(nsisDir, `${exe}.sig`))) throw new Error(`Signed installer for ${version} not found in ${nsisDir}`);

// Upload under a stable, space-free name
const assetName = `Drift-Recorder_${version}_x64-setup.exe`;
const outDir = join(root, 'dist-release', version);
mkdirSync(outDir, { recursive: true });
copyFileSync(join(nsisDir, exe), join(outDir, assetName));
const signature = readFileSync(join(nsisDir, `${exe}.sig`), 'utf8').trim();

const latest = {
    version,
    notes: process.env.RELEASE_NOTES || `Drift Recorder ${version}`,
    pub_date: new Date().toISOString(),
    platforms: {
        'windows-x86_64': {
            signature,
            url: `https://github.com/${repo}/releases/download/${tag}/${assetName}`,
        },
    },
};
writeFileSync(join(outDir, 'latest.json'), JSON.stringify(latest, null, 2));
console.log(`\nReady in ${outDir}:\n  ${assetName}\n  latest.json`);

if (publish) {
    const quiet = { cwd: root, stdio: 'pipe' };
    let exists = true;
    try { execSync(`gh release view ${tag} --repo ${repo}`, quiet); } catch { exists = false; }
    if (!exists) {
        execSync(`gh release create ${tag} --repo ${repo} --title "Drift Recorder ${version}" --notes "${latest.notes.replace(/"/g, '\\"')}"`, { cwd: root, stdio: 'inherit' });
    }
    execSync(`gh release upload ${tag} --repo ${repo} --clobber "${join(outDir, assetName)}" "${join(outDir, 'latest.json')}"`, { cwd: root, stdio: 'inherit' });
    console.log(`\nPublished ${tag}. Installed copies of Drift will offer it on their next launch.`);
} else {
    console.log('\nNot published. Re-run with --publish to upload to GitHub.');
}
