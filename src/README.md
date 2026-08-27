# Drift Frontend Architecture

This directory contains the Next.js 16 frontend for Drift.

---

## 📁 Directory Structure

```
src/
├── app/                  # Next.js App Router pages & UI components
│   ├── components/       # Reusable UI widgets & timeline controls
│   ├── recorder/         # Main Studio & Screen Recording workspace
│   ├── editor/           # Post-recording editor
│   └── labs/             # Drift Labs media format conversion tools
├── context/              # Global React Context providers (RecordingContext)
├── lib/                  # Core engines, physics solvers & bridge layers
│   ├── zoom/             # CinemaZoomEngine, CinemaCursorEngine, SpringPhysics
│   ├── export/           # MediaExporter & WebCodecs hardware exporters
│   ├── DriftEngine.js    # Live screen recording orchestrator
│   ├── StudioEngine.js   # Studio canvas compositor & timeline renderer
│   └── tauri-bridge.js   # Cross-platform Tauri / Electron / Web abstraction
└── hooks/                # Custom React lifecycle and device hooks
```

---

## 🧈 Core Engines

- **`CinemaZoomEngine`**: 3-layer spring-mass-damper simulation with anticipation pre-padding, attention scoring, and smooth hold-times.
- **`CinemaCursorEngine`**: Analytical spring smoothing for high-frequency cursor telemetry (120Hz/240Hz).
- **`StudioEngine`**: Real-time canvas compositor supporting multi-aspect framing (`16:9`, `9:16`, `1:1`, `4:3`, `4:5`, `21:9`), 12 luxury backgrounds, dynamic video blur backdrops, and WebCodecs 4K/60fps hardware MP4 export.
