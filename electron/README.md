# Drift Electron Desktop Shell

Fallback desktop shell providing Chromium integration and IPC bridges when running outside Tauri.

---

## 📁 Key Files

- **`main.js`**: Main process lifecycle, native window management, and global hotkey dispatch.
- **`preload.js`**: Context bridge exposing `window.electron` APIs to the renderer.
- **`server.js`**: Local streaming and media bridge server.
