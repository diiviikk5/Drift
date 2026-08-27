# Drift Rendering & Audio Pipeline

Comprehensive guide to Drift's recording, telemetry synchronization, compositing, and hardware export pipeline.

---

## 🎞️ Video & Telemetry Flow

1. **Capture**: `navigator.mediaDevices.getDisplayMedia` or native monitor capture with `cursor: 'never'`.
2. **Telemetry Ingestion**: Unthrottled 120Hz/240Hz mouse coordinates from Rust `rdev` or universal window listeners.
3. **Spring Simulation**: Analytical spring-mass solvers compute camera transformation and smoothed cursor position per frame ($<0.05\text{ ms}$).
4. **WYSIWYG Compositor**: Multi-layer canvas compositing with background mesh/blur, squircle window clipping, ambient drop shadow, and cursor ripple waves.
5. **Hardware Encoding**: `VideoEncoder` (WebCodecs H.264 High Profile) + `mp4-muxer` writes frame-exact MP4 with FastStart streaming.
