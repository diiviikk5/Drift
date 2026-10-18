# Drift on the web

Drift Web (`/app`) is the full recorder and studio running in the browser —
no install, no extension, nothing uploaded. It produces the same edit as the
desktop app: auto-zoom planned from your work, a smooth synthetic pointer,
studio framing, webcam bubble, separate audio tracks and frame-accurate export.

## What the desktop gets from the OS, and how the web gets it

| Desktop (Tauri, Rust) | Web |
|---|---|
| Screen / window capture (`xcap`, WGC) | `getDisplayMedia` with a `CaptureController` (Drift keeps focus while you set up) |
| Global mouse position and clicks (`rdev`) | Read back from the captured frames (`src/lib/vision`) |
| Cursor shape (`GetCursorInfo`) | Which pointer template matches (arrow, link hand, I-beam) |
| Text caret (Win32 / accessibility caret) | Glyph-sized changes marching along a line; the blinking caret bar |
| Typing timing (keyboard hook) | One anonymous "typed" sample per detected glyph (no keys, ever) |
| Scroll detection (`scroll_detect.rs`) | The same row-profile method, in JS |
| Recording without the hardware cursor | The baked pointer is erased from every frame in the studio |
| System audio + mic files | Separate `MediaRecorder` tracks for tab/system audio and the mic |
| Tray menu, global hotkeys | Floating controls (Document Picture-in-Picture), browser "Stop sharing" |
| Area recording (frozen-screen picker) | Crop to an area on a still of the shared surface |

Shortcut combos (Ctrl+C…) can't be seen from a web page, so the keystroke
overlay stays empty for web recordings.

## Pipeline

1. **Capture** — `src/lib/web/WebRecorder.js`. Screen video, system audio,
   microphone and webcam each get their own `MediaRecorder`.
2. **Live analysis** — `src/lib/web/analysis.worker.js` reads the same video
   track through `MediaStreamTrackProcessor` (or `<video>` frame callbacks and
   `ImageBitmap`s where that isn't available) and feeds
   `vision/ScreenAnalyzer.js`. Large captures are analyzed at half size. A
   per-frame time budget keeps busy pictures from stalling it.
3. **Pointer** — `vision/CursorTracker.js`: colour-agnostic class templates
   (interior vs outline) for Windows/macOS arrows, hand and I-beam at 100–300%
   display scale; tracking around the predicted position, re-acquisition in
   changed areas, a gated bootstrap sweep; once the pointer has been seen over
   a few different backgrounds its exact pixels are learned.
4. **Clicks, scrolling, typing** — `vision/ScreenAnalyzer.js`: a click is the
   UI responding next to a settled pointer after a human reaction time (not a
   hover effect that started on arrival, not the start of a scroll).
5. **Sync** — `vision/pointerSync.js`: after stopping, the pointer is found
   again in ~20 fast-motion frames of the recorded file and all telemetry is
   shifted onto the file's own timeline.
6. **Studio** — the telemetry drives the same planner, camera and renderer as
   the desktop. `vision/cursorEraser.js` fills the recorded pointer's
   footprint from its surroundings before compositing, in preview and export.
7. **Export** — WebCodecs H.264/AAC MP4; where H.264 encoding isn't available
   (Chromium without proprietary codecs) VP9/Opus WebM, still frame-accurate
   (`src/lib/export/muxers.js`).

Takes are kept in IndexedDB (newest four) until you're done with them; `.drift`
projects save the separate audio tracks and the pointer track too.

## Browser support

Chrome and Edge get everything. Firefox and Safari record and edit (frames are
analyzed through `<video>` callbacks instead of a track processor); system
audio and floating controls depend on the browser. Browsers capture tabs
without the pointer, so share a window or the screen for automatic zooms.

## Testing

- `npm test` — unit tests, including the vision modules on synthetic desktops.
- `npm run build && node tools/web-e2e/run.mjs [outDir]` — end to end in
  headless Chromium: a rendered desktop video (real screenshots of
  `tools/web-e2e/target.html` with a moving pointer that clicks and types) is
  the shared screen; the run records through `/app`, compares the recovered
  telemetry with the scene's ground truth, reopens the take and exports.
