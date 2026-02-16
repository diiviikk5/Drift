# Drift

> **Cinema-grade screen recording. Zero cost. Privacy-first.**

A lightweight desktop app for screen recording with cinematic auto-zoom, webcam overlay, and timeline editing. Built with Tauri + Next.js.

[![Website](https://img.shields.io/badge/Website-dvkk.dev-blue)](https://dvkk.dev)
[![Download](https://img.shields.io/badge/Download-Windows%20Installer-green)](https://dvkk.dev/downloads/Drift_2.0.0_x64-setup.exe)
[![Stars](https://img.shields.io/github/stars/diiviikk5/Drift?style=social)](https://github.com/diiviikk5/Drift)

---

## Download

**[⬇ Download Drift v2.0 for Windows (21 MB)](https://dvkk.dev/downloads/Drift_2.0.0_x64-setup.exe)**

Run the installer → takes ~10 seconds → launch from Start Menu. Done.

---

## Features

- **Screen Recording** — Capture your entire screen, a window, or a browser tab
- **Webcam Overlay** — Picture-in-picture with customizable shapes and positioning
- **The Drift Effect** — Cinematic auto-zoom that smoothly follows your cursor
- **Timeline Editor** — Adjust zoom keyframes and timing after recording
- **Export** — MP4, WebM, or high-quality GIF
- **100% Local** — No uploads, no accounts, no tracking

## Drift Labs

Browser-based file conversion tool — 1250+ format conversions for audio, video, and images. Zero uploads, runs entirely client-side.

**[Try Drift Labs →](https://dvkk.dev/labs)**

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop | Tauri v2 (Rust) |
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Animations | Framer Motion |
| Export | FFmpeg WASM / WebCodecs |
| Installer | NSIS (21 MB) |

## Development

```bash
# Clone
git clone https://github.com/diiviikk5/Drift.git
cd Drift

# Install dependencies
npm install

# Run the web app
npm run dev

# Run the desktop app (requires Rust)
npm run tauri:dev

# Build the installer
npm run tauri:build
```

## Project Structure

```
Drift/
├── src/
│   └── app/
│       ├── components/       # UI components
│       ├── recorder/         # Recording studio page
│       ├── editor/           # Timeline editor page
│       ├── labs/             # File conversion tools
│       └── studio/           # Recording studio
├── src-tauri/                # Tauri/Rust backend
│   ├── src/
│   │   └── lib.rs            # Rust commands
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/
│   └── downloads/            # Installer binary
└── package.json
```

---

MIT License

**[dvkk.dev](https://dvkk.dev)** · Built by [@diiviikk5](https://github.com/diiviikk5)
