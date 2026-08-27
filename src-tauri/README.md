# Drift Tauri v2 Native Core

This directory contains the native Rust backend for Drift built on Tauri v2.

---

## 🦀 Native Modules

- **`commands/capture.rs`**: Multi-monitor screen enumeration and screenshot capture via `xcap`.
- **`commands/input.rs`**: High-density global mouse tracking and click listeners via `rdev`.
- **`commands/hotkeys.rs`**: System-wide global shortcut registration and keybinding dispatch.
- **`commands/export.rs`**: Native GPU hardware-accelerated rendering fallback (NVENC, QSV, AMF, MF, libx264).
- **`rendering/`**: Rust-native analytical spring physics and cursor smoothing solvers.
