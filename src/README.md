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
│   ├── zoom/             # Auto-zoom planner, camera track, cursor smoothing
│   ├── rendering/        # Compositor, stage layout, procedural wallpapers
│   ├── export/           # Sequential WebCodecs frame source for export
│   ├── DriftEngine.js    # Live screen recording orchestrator
│   ├── StudioEngine.js   # Studio canvas compositor & timeline renderer
│   └── tauri-bridge.js   # Cross-platform Tauri / Electron / Web abstraction
└── hooks/                # Custom React lifecycle and device hooks
```

---

## 🧈 Core Engines

- **`InteractionAnalyzer`**: plans zooms from clicks, typing and dwell, grouped into work sessions.
- **`cameraTrack`**: plans the camera like an edit: held shots joined by smooth zoom-and-pan moves (van Wijk & Nuij) whose duration grows with how big the move feels, reframing only when the cursor is about to leave the frame. Preview and export sample the same precomputed track.
- **`tools/camera-metrics.mjs`**: measures how the camera feels (perceived speed, acceleration, cursor visibility) on synthetic scenarios or real sessions; `tests/camera-feel.test.mjs` enforces the budget.
- **`StudioEngine`**: Real-time canvas compositor supporting multi-aspect framing (`16:9`, `9:16`, `1:1`, `4:3`, `4:5`, `21:9`), 66 procedural wallpapers, dynamic video blur backdrops, and WebCodecs 4K/60fps hardware MP4 export.
