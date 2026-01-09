// Drift Extension - Popup Controller
// Handles all recording logic directly in the extension

class DriftRecorder {
    constructor() {
        // State
        this.state = 'idle'; // idle, ready, recording
        this.screenStream = null;
        this.micStream = null;
        this.webcamStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.clickEvents = [];
        this.startTime = null;
        this.timerInterval = null;

        // Settings
        this.settings = {
            driftEnabled: true,
            zoomLevel: 2,
            zoomSpeed: 400,
            micEnabled: false,
            webcamEnabled: false
        };

        // Elements
        this.elements = {};

        this.init();
    }

    init() {
        // Cache DOM elements
        this.elements = {
            statusBadge: document.getElementById('statusBadge'),
            previewVideo: document.getElementById('previewVideo'),
            previewPlaceholder: document.getElementById('previewPlaceholder'),
            timer: document.getElementById('timer'),
            idleControls: document.getElementById('idleControls'),
            readyControls: document.getElementById('readyControls'),
            recordingControls: document.getElementById('recordingControls'),
            clicksCounter: document.getElementById('clicksCounter'),
            clickCount: document.getElementById('clickCount'),
            selectSourceBtn: document.getElementById('selectSourceBtn'),
            micBtn: document.getElementById('micBtn'),
            micBtn2: document.getElementById('micBtn2'),
            webcamBtn: document.getElementById('webcamBtn'),
            recordBtn: document.getElementById('recordBtn'),
            stopBtn: document.getElementById('stopBtn'),
            changeSourceBtn: document.getElementById('changeSourceBtn'),
            driftToggle: document.getElementById('driftToggle'),
            zoomSlider: document.getElementById('zoomSlider'),
            zoomValue: document.getElementById('zoomValue'),
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue')
        };

        // Load saved settings
        this.loadSettings();

        // Bind events
        this.bindEvents();

        // Check for existing recording session
        this.checkSession();
    }

    bindEvents() {
        // Source selection
        this.elements.selectSourceBtn.onclick = () => this.selectSource();
        this.elements.changeSourceBtn.onclick = () => this.selectSource();

        // Mic toggle
        this.elements.micBtn.onclick = () => this.toggleMic();
        this.elements.micBtn2.onclick = () => this.toggleMic();

        // Webcam toggle
        this.elements.webcamBtn.onclick = () => this.toggleWebcam();

        // Recording controls
        this.elements.recordBtn.onclick = () => this.startRecording();
        this.elements.stopBtn.onclick = () => this.stopRecording();

        // Settings
        this.elements.driftToggle.onclick = () => {
            this.settings.driftEnabled = !this.settings.driftEnabled;
            this.elements.driftToggle.classList.toggle('active', this.settings.driftEnabled);
            this.saveSettings();
        };

        this.elements.zoomSlider.oninput = (e) => {
            this.settings.zoomLevel = parseFloat(e.target.value);
            this.elements.zoomValue.textContent = this.settings.zoomLevel + 'x';
            this.saveSettings();
        };

        this.elements.speedSlider.oninput = (e) => {
            this.settings.zoomSpeed = parseInt(e.target.value);
            this.elements.speedValue.textContent = this.settings.zoomSpeed + 'ms';
            this.saveSettings();
        };
    }

    async loadSettings() {
        try {
            const data = await chrome.storage.local.get(['driftSettings']);
            if (data.driftSettings) {
                this.settings = { ...this.settings, ...data.driftSettings };

                // Update UI
                this.elements.driftToggle.classList.toggle('active', this.settings.driftEnabled);
                this.elements.zoomSlider.value = this.settings.zoomLevel;
                this.elements.zoomValue.textContent = this.settings.zoomLevel + 'x';
                this.elements.speedSlider.value = this.settings.zoomSpeed;
                this.elements.speedValue.textContent = this.settings.zoomSpeed + 'ms';
            }
        } catch (e) {
            console.log('Could not load settings');
        }
    }

    saveSettings() {
        chrome.storage.local.set({ driftSettings: this.settings });
    }

    async checkSession() {
        // Check if there's an active recording session
        const data = await chrome.storage.local.get(['recordingActive']);
        if (data.recordingActive) {
            // Resume UI state
        }
    }

    async selectSource() {
        try {
            // Request screen capture
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 60 }
                },
                audio: true // System audio
            });

            // Show preview
            this.elements.previewVideo.srcObject = this.screenStream;
            this.elements.previewPlaceholder.classList.add('hidden');

            // Handle stream end
            this.screenStream.getVideoTracks()[0].onended = () => {
                this.resetToIdle();
            };

            // Update state
            this.setState('ready');

        } catch (err) {
            console.error('Screen capture failed:', err);
            if (err.name !== 'NotAllowedError') {
                alert('Failed to capture screen: ' + err.message);
            }
        }
    }

    async toggleMic() {
        if (this.micStream) {
            this.micStream.getTracks().forEach(t => t.stop());
            this.micStream = null;
            this.settings.micEnabled = false;
            this.elements.micBtn.classList.remove('active');
            this.elements.micBtn2.classList.remove('active');
        } else {
            try {
                this.micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true
                    }
                });
                this.settings.micEnabled = true;
                this.elements.micBtn.classList.add('active');
                this.elements.micBtn2.classList.add('active');
            } catch (err) {
                console.error('Mic capture failed:', err);
            }
        }
    }

    async toggleWebcam() {
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(t => t.stop());
            this.webcamStream = null;
            this.settings.webcamEnabled = false;
            this.elements.webcamBtn.classList.remove('active');
        } else {
            try {
                this.webcamStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: 'user' }
                });
                this.settings.webcamEnabled = true;
                this.elements.webcamBtn.classList.add('active');
            } catch (err) {
                console.error('Webcam capture failed:', err);
            }
        }
    }

    async startRecording() {
        if (!this.screenStream) return;

        this.recordedChunks = [];
        this.clickEvents = [];
        this.startTime = Date.now();

        // Notify all tabs to start tracking clicks
        chrome.runtime.sendMessage({ type: 'START_RECORDING' });

        // Create combined stream
        const tracks = [...this.screenStream.getTracks()];

        // Add mic audio if enabled
        if (this.micStream) {
            const micTracks = this.micStream.getAudioTracks();
            tracks.push(...micTracks);
        }

        const combinedStream = new MediaStream(tracks);

        // Setup MediaRecorder
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm';

        this.mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType,
            videoBitsPerSecond: 12000000 // 12 Mbps
        });

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                this.recordedChunks.push(e.data);
            }
        };

        this.mediaRecorder.onstop = () => {
            this.onRecordingComplete();
        };

        this.mediaRecorder.start(100);

        // Start timer
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            this.elements.timer.textContent = `${mins}:${secs}`;
        }, 1000);

        // Listen for click events from content scripts
        chrome.runtime.onMessage.addListener(this.handleClickEvent.bind(this));

        this.setState('recording');
    }

    handleClickEvent(message) {
        if (message.type === 'CLICK_EVENT' && this.state === 'recording') {
            this.clickEvents.push({
                timestamp: Date.now() - this.startTime,
                screenX: message.screenX,
                screenY: message.screenY,
                clientX: message.clientX,
                clientY: message.clientY
            });
            this.elements.clickCount.textContent = this.clickEvents.length;
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Notify tabs to stop tracking
        chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });
    }

    async onRecordingComplete() {
        // Create blob
        const mimeType = this.mediaRecorder.mimeType;
        const blob = new Blob(this.recordedChunks, { type: mimeType });

        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result;

            // Store recording data
            await chrome.storage.local.set({
                recordingData: base64,
                recordingClickEvents: this.clickEvents,
                recordingSettings: this.settings,
                recordingDuration: Date.now() - this.startTime
            });

            // Open studio with the recording
            chrome.tabs.create({
                url: 'http://localhost:3000/studio?source=extension'
            });

            // Close popup
            window.close();
        };
        reader.readAsDataURL(blob);
    }

    resetToIdle() {
        // Stop all streams
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(t => t.stop());
            this.screenStream = null;
        }

        // Reset preview
        this.elements.previewVideo.srcObject = null;
        this.elements.previewPlaceholder.classList.remove('hidden');

        this.setState('idle');
    }

    setState(state) {
        this.state = state;

        // Update UI
        this.elements.idleControls.classList.toggle('hidden', state !== 'idle');
        this.elements.readyControls.classList.toggle('hidden', state !== 'ready');
        this.elements.recordingControls.classList.toggle('hidden', state !== 'recording');
        this.elements.timer.classList.toggle('hidden', state !== 'recording');
        this.elements.clicksCounter.classList.toggle('hidden', state !== 'recording');

        // Update status badge
        switch (state) {
            case 'idle':
                this.elements.statusBadge.textContent = 'Ready';
                this.elements.statusBadge.classList.remove('recording');
                break;
            case 'ready':
                this.elements.statusBadge.textContent = 'Source Selected';
                this.elements.statusBadge.classList.remove('recording');
                break;
            case 'recording':
                this.elements.statusBadge.textContent = 'Recording';
                this.elements.statusBadge.classList.add('recording');
                break;
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new DriftRecorder();
});
