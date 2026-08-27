# Drift Architecture & Technical Design

Drift is a high-performance, lightweight screen recording and post-production studio built with **Tauri v2**, **Rust**, **Next.js 16**, and **WebCodecs**.

---

## 🏗️ System Overview

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                  │
│  (Recorder Studio, Timeline Scrubber, Canvas Renderer)  │
└───────────────────────────┬────────────────────────────┘
                            │ Tauri IPC (JSON / Events)
┌───────────────────────────▼────────────────────────────┐
│                    Tauri v2 Rust Core                  │
│  • Global Input Tracking (`rdev`)                       │
│  • Display & Screen Capture (`xcap`)                   │
│  • Global Shortcuts & System Tray                      │
│  • Multi-Tier GPU Hardware Fallback                    │
└────────────────────────────────────────────────────────┘
```

---

## 🧩 Core Modules

### 1. High-Density Telemetry (`src/lib/CursorTracker.js` & `src-tauri/src/commands/input.rs`)
- Captures global mouse movement and click events at unthrottled display refresh rates (120Hz/240Hz).
- Telemetry events are normalized to unit coordinates `[0.0, 1.0]` relative to the source display dimensions.

### 2. Cinema Zoom & Spring Physics (`src/lib/zoom/CinemaZoomEngine.js`)
- **3-Layer Architecture**:
  - **Activity Scorer**: Computes continuous interaction intensity based on click bursts and cursor velocity.
  - **State Machine**: Transitions between `IDLE`, `ZOOMING_IN`, `ACTIVE_TRACKING`, and `ZOOMING_OUT`.
  - **Analytical Spring Solvers**: 3-layer spring-mass-damper simulation providing smooth camera pans and anticipation pre-padding.

### 3. Cursor Smoothing Engine (`src/lib/zoom/CinemaCursorEngine.js`)
- Modeled with context-aware spring profiles (`Default`, `Snappy`, `Drag`).
- Filters micro-tremors and shaky hand movements while preserving click precision.

### 4. Post-Production Compositor & Export (`src/lib/StudioEngine.js`)
- **Real-Time WYSIWYG Compositing**: Multi-aspect ratio framing (`16:9`, `9:16`, `1:1`, `4:3`, `4:5`, `21:9`), dynamic video blur backdrops, luxury gradient meshes, squircle rounding, and multi-tier drop shadows.
- **Hardware-Accelerated MP4 Export**: Frame-by-frame encoding via `VideoEncoder` (WebCodecs AVC1/H.264) + `mp4-muxer` with fast-start web streaming optimization.
