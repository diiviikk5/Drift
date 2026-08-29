# Drift Electron Desktop App (OpenScreen Architecture)

Production-grade Electron desktop application featuring unthrottled cursor telemetry, multi-window screen recording, spring auto-zoom, and hardware-accelerated WebCodecs MP4 export.

---

## ⚡ Architecture Overview

- **Native Screen & Window Capture**: `desktopCapturer` with 16:9 high-resolution preview thumbnails for all connected displays and open applications.
- **Unthrottled Telemetry (`uiohook-napi`)**: Global mouse tracking and click event streaming at 120Hz/240Hz with unit coordinate normalization.
- **Global Shortcuts (`globalShortcut`)**: System-wide recording toggles (`Ctrl+Shift+R`, `Ctrl+Shift+S`) across all applications.
- **Hardware MP4 Export**: Direct GPU frame encoding via WebCodecs + `mp4-muxer` with native save dialogs (`dialog.showSaveDialog`).

---

## 🚀 Running in Electron

```bash
# Start development mode (Next.js + Electron hot reload)
npm run electron:dev

# Build standalone Windows installer (.exe)
npm run electron:build
```
