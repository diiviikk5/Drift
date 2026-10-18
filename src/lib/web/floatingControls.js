/**
 * Floating recording controls: a tiny always-on-top window (Document
 * Picture-in-Picture) with the timer, a countdown and Stop, so you can record
 * other apps and still reach Drift — the web counterpart of the desktop
 * app's tray. Plain DOM: it lives in a separate window.
 */

const CSS = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  html, body { height: 100%; }
  body {
    font: 500 13px/1.2 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    background: #0d0f14; color: #f3f4f6; display: flex; align-items: center;
    justify-content: center; gap: 10px; padding: 0 12px; user-select: none; overflow: hidden;
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #ef4444; flex: none;
    box-shadow: 0 0 0 0 rgba(239,68,68,.6); animation: pulse 1.6s infinite; }
  .dot.wait { background: #f59e0b; animation: none; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,.55); } 70% { box-shadow: 0 0 0 9px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
  .time { font: 600 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: .02em; min-width: 52px; }
  .label { color: #9ca3af; font-size: 12px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  button { font: inherit; border: 0; cursor: pointer; border-radius: 9px; height: 32px; padding: 0 12px;
    display: inline-flex; align-items: center; gap: 7px; flex: none; }
  .stop { background: #ef4444; color: #fff; }
  .stop:hover { filter: brightness(1.1); }
  .ghost { background: #1f2430; color: #d1d5db; }
  .ghost:hover { background: #2a3040; }
  .sq { width: 10px; height: 10px; border-radius: 2px; background: currentColor; }
  .count { font: 700 28px ui-sans-serif, system-ui; color: #dcfe50; min-width: 34px; text-align: center; }
`;

export function floatingControlsSupported() {
    return typeof window !== 'undefined' && Boolean(window.documentPictureInPicture);
}

/**
 * Open the panel. Must be called from a user gesture (the Record click).
 * @returns {Promise<{setTime, setCountdown, setRecording, close, window}|null>}
 */
export async function openFloatingControls({ onStop, onCancel } = {}) {
    if (!floatingControlsSupported()) return null;
    let pip;
    try {
        pip = await window.documentPictureInPicture.requestWindow({ width: 320, height: 64, disallowReturnToOpener: false });
    } catch (e) {
        console.warn('[Drift web] Floating controls unavailable:', e);
        return null;
    }
    const doc = pip.document;
    doc.title = 'Drift';
    const style = doc.createElement('style');
    style.textContent = CSS;
    doc.head.appendChild(style);

    const dot = doc.createElement('span');
    dot.className = 'dot wait';
    const count = doc.createElement('span');
    count.className = 'count';
    const time = doc.createElement('span');
    time.className = 'time';
    time.textContent = '00:00';
    const label = doc.createElement('span');
    label.className = 'label';
    label.textContent = 'Get ready…';
    const stop = doc.createElement('button');
    stop.className = 'stop';
    stop.innerHTML = '<span class="sq"></span><span>Stop</span>';
    stop.title = 'Stop recording and open the editor';
    stop.onclick = () => onStop?.();
    const cancel = doc.createElement('button');
    cancel.className = 'ghost';
    cancel.textContent = 'Cancel';
    cancel.onclick = () => onCancel?.();

    doc.body.append(dot, count, time, label, cancel, stop);
    time.style.display = 'none';
    stop.style.display = 'none';

    let closedByUs = false;
    pip.addEventListener('pagehide', () => {
        if (!closedByUs) onCancel?.('closed');
    });

    return {
        window: pip,
        setCountdown(n) {
            count.style.display = n > 0 ? '' : 'none';
            count.textContent = String(n);
        },
        setRecording(on) {
            dot.className = on ? 'dot' : 'dot wait';
            time.style.display = on ? '' : 'none';
            stop.style.display = on ? '' : 'none';
            cancel.style.display = on ? 'none' : '';
            count.style.display = on ? 'none' : count.style.display;
            label.textContent = on ? 'Recording' : 'Get ready…';
        },
        setTime(text) { time.textContent = text; },
        close() {
            closedByUs = true;
            try { pip.close(); } catch {}
        },
    };
}
