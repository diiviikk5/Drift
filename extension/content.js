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
            chrome.runtime.sendMessage({ type: 'TOGGLE_RECORDING_HOTKEY' }).catch(() => { });
        }
    });

    // Small recording indicator
    let indicator = null;

    function showRecordingIndicator() {
        // Disabled by user request
    }

    function hideRecordingIndicator() {
        if (indicator) {
            indicator.remove();
            indicator = null;
        }
    }
})();
