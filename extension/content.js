// Drift Content Script - Click tracking + Stop hotkey

(function () {
    let isTracking = false;

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.type === 'START_TRACKING') {
            isTracking = true;
            showRecordingIndicator();
            sendResponse({ ok: true });
        } else if (msg.type === 'STOP_TRACKING') {
            isTracking = false;
            hideRecordingIndicator();
            sendResponse({ ok: true });
        }
        return true;
    });

    // Track clicks
    document.addEventListener('mousedown', (e) => {
        if (!isTracking) return;
        chrome.runtime.sendMessage({
            type: 'CLICK_EVENT',
            screenX: e.screenX,
            screenY: e.screenY,
            timestamp: Date.now()
        }).catch(() => { });
    }, true);

    // Track mouse movement (throttled 15fps)
    let lastMove = 0;
    document.addEventListener('mousemove', (e) => {
        if (!isTracking) return;
        const now = Date.now();
        if (now - lastMove > 60) { // ~15fps
            lastMove = now;
            chrome.runtime.sendMessage({
                type: 'MOUSE_MOVE',
                screenX: e.screenX,
                screenY: e.screenY,
                timestamp: now
            }).catch(() => { });
        }
    }, true);

    // KEYBOARD SHORTCUT: Ctrl+Shift+X to stop recording
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            e.preventDefault();
            chrome.runtime.sendMessage({ type: 'STOP_RECORDING_HOTKEY' }).catch(() => { });
        }
    });

    // Small recording indicator
    let indicator = null;

    function showRecordingIndicator() {
        if (indicator) return;
        indicator = document.createElement('div');
        indicator.id = 'drift-indicator';
        indicator.innerHTML = `
            <style>
                #drift-indicator {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #ff3366;
                    color: white;
                    padding: 8px 14px;
                    border-radius: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    z-index: 2147483647;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(255,51,102,0.4);
                    cursor: pointer;
                    user-select: none;
                }
                #drift-indicator:hover {
                    background: #e62e5c;
                }
                #drift-indicator .dot {
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    animation: drift-blink 1s infinite;
                }
                @keyframes drift-blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.3; }
                }
            </style>
            <span class="dot"></span>
            <span>REC</span>
            <span style="opacity:0.7;font-size:10px">Ctrl+Shift+X to stop</span>
        `;
        indicator.onclick = () => {
            chrome.runtime.sendMessage({ type: 'STOP_RECORDING_HOTKEY' }).catch(() => { });
        };
        document.body.appendChild(indicator);
    }

    function hideRecordingIndicator() {
        if (indicator) {
            indicator.remove();
            indicator = null;
        }
    }
})();
