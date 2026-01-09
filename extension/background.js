// Drift Background - Click forwarding + Hotkey handling

let isRecording = false;

// Open recorder when icon clicked
chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ url: chrome.runtime.getURL('recorder.html') }, tabs => {
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, { active: true });
        } else {
            chrome.tabs.create({ url: chrome.runtime.getURL('recorder.html') });
        }
    });
});

// Handle messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'START_RECORDING') {
        isRecording = true;
        chrome.action.setBadgeText({ text: 'REC' });
        chrome.action.setBadgeBackgroundColor({ color: '#ff3366' });

        // Tell ALL tabs to start tracking
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                if (!tab.url?.startsWith('chrome://')) {
                    chrome.tabs.sendMessage(tab.id, { type: 'START_TRACKING' }).catch(() => { });
                }
            });
        });
        sendResponse({ ok: true });

    } else if (msg.type === 'STOP_RECORDING' || msg.type === 'STOP_RECORDING_HOTKEY') {
        isRecording = false;
        chrome.action.setBadgeText({ text: '' });

        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                if (!tab.url?.startsWith('chrome://')) {
                    chrome.tabs.sendMessage(tab.id, { type: 'STOP_TRACKING' }).catch(() => { });
                }
            });
        });

        // If hotkey was used, also tell the recorder page to stop
        if (msg.type === 'STOP_RECORDING_HOTKEY') {
            chrome.tabs.query({ url: chrome.runtime.getURL('recorder.html') }, tabs => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_FROM_HOTKEY' }).catch(() => { });
                    chrome.tabs.update(tabs[0].id, { active: true }); // Switch to recorder
                }
            });
        }

        sendResponse({ ok: true });

    } else if (msg.type === 'CLICK_EVENT' && isRecording) {
        // Forward click to recorder tab
        chrome.tabs.query({ url: chrome.runtime.getURL('recorder.html') }, tabs => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, msg).catch(() => { });
            }
        });
    }
    return true;
});

// When new tabs open during recording, enable tracking
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    if (info.status === 'complete' && isRecording && !tab.url?.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tabId, { type: 'START_TRACKING' }).catch(() => { });
    }
});
