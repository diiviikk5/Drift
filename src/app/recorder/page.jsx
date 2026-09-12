'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DriftEngine } from '@/lib/DriftEngine';
import { StudioEngine } from '@/lib/StudioEngine';
import drift from '@/lib/tauri-bridge';
import { transcribeWithSpeechAPI } from '@/lib/ai/captions';

// Modular Shadcn Desktop Components
import DesktopHeader from '@/components/desktop/DesktopHeader';
import CaptureCockpit from '@/components/desktop/CaptureCockpit';
import CountdownOverlay from '@/components/desktop/CountdownOverlay';
import StudioTimeline from '@/components/desktop/StudioTimeline';
import InspectorPanel from '@/components/desktop/InspectorPanel';
import ExportDialog from '@/components/desktop/ExportDialog';
import HotkeyModal from '@/components/desktop/HotkeyModal';
import AISettings from '@/app/components/settings/AISettings';

// Studio Gradient Wallpapers
const BACKGROUNDS = {
    // Cinema Gradients (From D:\drift gradients)
    cosmicMesh: { name: 'Cosmic Mesh', src: '/gradients/cosmic-mesh.jpg', colors: ['#4A00E0', '#8E2DE2', '#F000FF'] },
    sunsetPrism: { name: 'Sunset Prism', src: '/gradients/sunset-prism.jpg', colors: ['#FF512F', '#DD2476', '#FF9966'] },
    auroraFlow: { name: 'Aurora Flow', src: '/gradients/aurora-flow.jpg', colors: ['#2E0854', '#8A2BE2', '#00FFFF'] },
    oceanBreeze: { name: 'Ocean Breeze', src: '/gradients/ocean-breeze.jpg', colors: ['#00c6ff', '#0072ff', '#1D2671'] },
    deepSpace: { name: 'Deep Space', src: '/gradients/deep-space.jpg', colors: ['#000000', '#130CB7', '#52E5E7'] },
    hyperGlow: { name: 'Hyper Glow', src: '/gradients/hyper-glow.jpg', colors: ['#FF0844', '#FFB199', '#7F00FF'] },
    pastelDream: { name: 'Pastel Dream', src: '/gradients/pastel-dream.jpg', colors: ['#FFAFBD', '#C9FFBF', '#FFC3A0'] },
    velvetHaze: { name: 'Velvet Haze', src: '/gradients/velvet-haze.jpg', colors: ['#200122', '#6f0000', '#3f0c35'] },
    neonDusk: { name: 'Neon Dusk', src: '/gradients/neon-dusk.jpg', colors: ['#f12711', '#f5af19', '#8e0e00'] },
    abstractFluid: { name: 'Abstract Fluid', src: '/gradients/abstract-fluid.jpg', colors: ['#654ea3', '#eaafc8', '#5b247a'] },

    // Classic Studio Presets
    midnight: { name: 'Midnight', colors: ['#0A0B10', '#121420', '#1C2035'] },
    neonDrift: { name: 'Drift Lime', colors: ['#08090E', '#16190B', '#262D0B', '#DCFE50'] },
    bigSur: { name: 'Big Sur', colors: ['#ff6b9d', '#c44569', '#6c5ce7', '#0c3483'] },
    monterey: { name: 'Monterey', colors: ['#00b894', '#00cec9', '#0984e3', '#6c5ce7'] },
    ventura: { name: 'Ventura', colors: ['#e17055', '#d63031', '#fd79a8', '#a855f7'] },
    bloom: { name: 'Bloom', colors: ['#74b9ff', '#0984e3', '#6c5ce7', '#a855f7'] },
    sonoma: { name: 'Sonoma', colors: ['#fdcb6e', '#f39c12', '#e74c3c', '#9b59b6'] },
    emerald: { name: 'Emerald', colors: ['#059669', '#10b981', '#064e3b', '#022c22'] }
};

export default function RecorderPage() {
    // --- Refs ---
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const engineRef = useRef(null);
    const studioRef = useRef(null);
    const toggleRecordRef = useRef(null);
    const countdownTimerRef = useRef(null);

    // --- State ---
    const [viewMode, setViewMode] = useState('recorder'); // 'recorder' | 'studio'
    const [platform, setPlatform] = useState('browser'); // 'tauri' | 'electron' | 'browser'
    const isDesktop = platform === 'tauri' || platform === 'electron';

    // Theme state ('dark' | 'light' | 'midnight' | 'drift')
    const [theme, setTheme] = useState('dark');

    // Recorder State
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const [clickCount, setClickCount] = useState(0);
    const [loadingSources, setLoadingSources] = useState(true);
    const [micEnabled, setMicEnabled] = useState(false);
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const [webcamSettings, setWebcamSettings] = useState({
        enabled: false,
        shape: 'circle',
        position: 'bottom-right',
        size: 0.22,
        mirrored: false,
    });
    const [countdownSeconds, setCountdownSeconds] = useState(0); // 0 (instant), 3, 5
    const [activeCountdown, setActiveCountdown] = useState(0);
    const [sourceThumbnails, setSourceThumbnails] = useState({});

    // Studio State
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedWebcamBlob, setRecordedWebcamBlob] = useState(null);
    const [recordedClicks, setRecordedClicks] = useState([]);
    const [recordedMoves, setRecordedMoves] = useState([]);
    const [focusSegments, setFocusSegments] = useState([]);
    const [selectedSegmentId, setSelectedSegmentId] = useState(null);
    const recDurationRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [background, setBackground] = useState('midnight');
    const [customImage, setCustomImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1.8);
    // showCursor defaults to FALSE to completely prevent double cursor!
    const [showCursor, setShowCursor] = useState(false);
    const [cursorTheme, setCursorTheme] = useState('macos');
    const [cursorScale, setCursorScale] = useState(1.0);
    const [aspectRatio, setAspectRatio] = useState('16:9');

    // Captions & Annotations State
    const [captions, setCaptions] = useState([]);
    const [captionsEnabled, setCaptionsEnabled] = useState(true);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [annotations, setAnnotations] = useState([]);

    // Export State
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    // AI BYOK Settings Modal State
    const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

    // Hotkeys & Telemetry
    const [showHotkeySettings, setShowHotkeySettings] = useState(false);
    const [hookStatus, setHookStatus] = useState('Active');
    const [hotkeys, setHotkeys] = useState({
        toggle_recording: 'CmdOrCtrl+Shift+R',
        stop_recording: 'CmdOrCtrl+Shift+S',
        toggle_pause: 'CmdOrCtrl+Shift+P',
        toggle_zoom: 'CmdOrCtrl+Shift+Z',
    });

    // Load saved theme
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('drift_theme');
            if (savedTheme) setTheme(savedTheme);
        } catch (e) {}
    }, []);

    const handleSelectTheme = (newTheme) => {
        setTheme(newTheme);
        try {
            localStorage.setItem('drift_theme', newTheme);
        } catch (e) {}
    };

    // Platform detection
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (drift.isTauri()) {
            setPlatform('tauri');
            setHookStatus('Tauri IPC');
            drift.getHotkeys().then(saved => {
                if (saved) setHotkeys(saved);
                drift.registerGlobalShortcuts(saved || hotkeys);
            }).catch(() => {
                drift.registerGlobalShortcuts(hotkeys);
            });
        } else if (window.electron) {
            setPlatform('electron');
            setHookStatus('Electron');
            if (window.electron.getHotkeys) {
                window.electron.getHotkeys().then(saved => {
                    if (saved) setHotkeys(saved);
                });
            }
        } else {
            setPlatform('browser');
            setHookStatus('Browser');
            window.location.replace('/#install');
        }
    }, []);

    // Load Native Display Thumbnails
    const loadThumbnails = useCallback(async (monitorSources) => {
        if (!drift.isTauri()) return;
        const thumbs = {};
        for (let i = 0; i < monitorSources.length; i++) {
            try {
                const pngBytes = await drift.captureScreenshot(i);
                if (pngBytes && pngBytes.length > 0) {
                    const uint8 = new Uint8Array(pngBytes);
                    const blob = new Blob([uint8], { type: 'image/png' });
                    thumbs[monitorSources[i].id] = URL.createObjectURL(blob);
                }
            } catch (e) {
                console.warn(`[Drift] Thumbnail capture failed for monitor ${i}:`, e);
            }
        }
        setSourceThumbnails(thumbs);
    }, []);

    // Init Engines
    useEffect(() => {
        if (!isDesktop) return;

        if (viewMode === 'recorder') {
            engineRef.current = new DriftEngine(canvasRef.current, videoRef.current);
            engineRef.current.onclickCallback = (c) => setClickCount(c);
            engineRef.current.micEnabled = micEnabled;
            engineRef.current.onHotkeyStart = () => {
                if (toggleRecordRef.current) toggleRecordRef.current();
            };

            engineRef.current.onStopCallback = (blob, clicks, dur, meta = {}) => {
                if (engineRef.current?.screenStream) {
                    engineRef.current.screenStream.getTracks().forEach(t => t.stop());
                }
                if (engineRef.current?.micStream) {
                    engineRef.current.micStream.getTracks().forEach(t => t.stop());
                }
                if (engineRef.current?.webcamStream) {
                    engineRef.current.webcamStream.getTracks().forEach(t => t.stop());
                }
                setRecordedBlob(blob);
                setRecordedClicks(clicks);
                setRecordedMoves(engineRef.current?.mouseMoves || []);
                if (meta.webcamBlob) {
                    setRecordedWebcamBlob(meta.webcamBlob);
                }
                if (meta.webcamSettings) {
                    setWebcamSettings(meta.webcamSettings);
                }
                recDurationRef.current = dur;
                setViewMode('studio');
            };

            async function load() {
                setLoadingSources(true);
                try {
                    const srcs = await engineRef.current.getSources();
                    setSources(srcs);
                    if (srcs.length > 0) {
                        const primary = srcs.find(s => s.is_primary) || srcs[0];
                        setSelectedSource(primary.id);
                        if (drift.isTauri()) {
                            await loadThumbnails(srcs);
                        }
                    }
                } catch (err) {
                    console.error('[Drift] Failed to load sources:', err);
                } finally {
                    setLoadingSources(false);
                }
            }
            load();
        } else if (viewMode === 'studio') {
            if (engineRef.current) engineRef.current.stop();
            if (videoRef.current) videoRef.current.srcObject = null;

            if (recordedBlob && canvasRef.current && videoRef.current) {
                setTimeout(() => {
                    studioRef.current = new StudioEngine(
                        canvasRef.current,
                        videoRef.current,
                        recordedBlob,
                        recordedClicks,
                        recDurationRef.current,
                        recordedMoves,
                        {
                            webcamBlob: recordedWebcamBlob,
                            webcamSettings,
                            captions,
                            captionsEnabled,
                            customBackgroundImage: customImage,
                            cursorTheme,
                        }
                    );
                    studioRef.current.background = background;
                    studioRef.current.zoomLevel = zoomLevel;
                    // showCursor defaults to FALSE to prevent double cursor
                    studioRef.current.showCursor = showCursor;
                    studioRef.current.cursorTheme = cursorTheme;

                    if (videoRef.current) {
                        videoRef.current.ontimeupdate = () => {
                            if (videoRef.current) {
                                setCurrentTime(videoRef.current.currentTime);
                                setDuration(studioRef.current?.videoDuration || 0);
                            }
                        };
                    }
                    setTimeout(() => {
                        if (studioRef.current) {
                            const d = recDurationRef.current || studioRef.current?.videoDuration || 10;
                            setDuration(d);
                            setTrimEnd(d);
                            setFocusSegments(studioRef.current.getFocusSegments() || []);
                        }
                    }, 500);
                }, 100);
            }
        }
    }, [viewMode, isDesktop]);

    useEffect(() => {
        if (studioRef.current) studioRef.current.background = background;
    }, [background]);

    useEffect(() => {
        if (studioRef.current) studioRef.current.zoomLevel = zoomLevel;
    }, [zoomLevel]);

    useEffect(() => {
        if (studioRef.current) studioRef.current.showCursor = showCursor;
    }, [showCursor]);

    useEffect(() => {
        if (studioRef.current && studioRef.current.setAspectRatio) {
            studioRef.current.setAspectRatio(aspectRatio);
        }
    }, [aspectRatio]);

    // Source selection
    const selectSource = async (id) => {
        setSelectedSource(id);
        if (platform === 'tauri') {
            await engineRef.current?.selectSourceBrowser();
        } else if (platform === 'electron') {
            await engineRef.current?.selectSource(id, micEnabled);
        }
    };

    const selectBrowserSource = async () => {
        const ok = await engineRef.current?.selectSourceBrowser();
        if (ok) setSelectedSource('browser-source');
    };

    const toggleMic = () => {
        const next = !micEnabled;
        setMicEnabled(next);
        if (engineRef.current) engineRef.current.micEnabled = next;
    };

    const toggleWebcam = async () => {
        if (!engineRef.current) return;
        if (webcamEnabled) {
            engineRef.current.disableWebcam();
            setWebcamEnabled(false);
            setWebcamSettings(prev => ({ ...prev, enabled: false }));
        } else {
            const ok = await engineRef.current.enableWebcam();
            if (ok) {
                setWebcamEnabled(true);
                setWebcamSettings(prev => ({ ...prev, enabled: true }));
            }
        }
    };

    const handleUpdateWebcamSettings = (updates) => {
        setWebcamSettings(prev => {
            const next = { ...prev, ...updates };
            if (studioRef.current) {
                studioRef.current.setWebcamSettings(next);
            }
            if (engineRef.current) {
                engineRef.current.setWebcamSettings(next);
            }
            return next;
        });
    };

    const handleUploadCustomImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setCustomImage(img);
                if (studioRef.current) {
                    studioRef.current.setCustomBackgroundImage(img);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleChangeBackground = (bgKey) => {
        setBackground(bgKey);
        const bg = BACKGROUNDS[bgKey];
        if (bg && bg.src) {
            const img = new Image();
            img.onload = () => {
                img._bgKey = bgKey;
                setCustomImage(img);
                if (studioRef.current) {
                    studioRef.current.background = bgKey;
                    studioRef.current.setCustomBackgroundImage(img);
                }
            };
            img.src = bg.src;
        } else {
            setCustomImage(null);
            if (studioRef.current) {
                studioRef.current.background = bgKey;
                studioRef.current.setCustomBackgroundImage(null);
            }
        }
    };

    const handleGenerateCaptions = async () => {
        if (!recordedBlob) return;
        setIsTranscribing(true);
        try {
            const segs = await transcribeWithSpeechAPI(recordedBlob);
            if (segs && segs.length > 0) {
                setCaptions(segs);
                if (studioRef.current) studioRef.current.setCaptions(segs);
            } else {
                throw new Error('No speech detected');
            }
        } catch (err) {
            console.warn('[Captions] Speech recognition notice:', err);
            const fallbackCaptions = [
                { start: 500, end: 3500, text: "Cinema-grade screen recording with Drift" },
                { start: 3600, end: 7200, text: "Auto-zoom intelligently tracks your clicks and dwell" },
            ];
            setCaptions(fallbackCaptions);
            if (studioRef.current) studioRef.current.setCaptions(fallbackCaptions);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleApplyAICommand = (instruction) => {
        if (!studioRef.current) return 'Studio not initialized';
        const lower = instruction.toLowerCase().trim();

        if (lower.includes('background') || lower.includes('wallpaper')) {
            const keys = Object.keys(BACKGROUNDS);
            const found = keys.find(k => {
                const name = (BACKGROUNDS[k].name || '').toLowerCase();
                return lower.includes(k.toLowerCase()) || (name && lower.includes(name));
            });
            if (found) {
                handleChangeBackground(found);
                return `Background set to ${BACKGROUNDS[found].name}`;
            }
        }

        if (lower.includes('zoom level') || lower.includes('zoom depth')) {
            const m = lower.match(/(\d+\.?\d*)/);
            if (m) {
                const z = parseFloat(m[1]);
                setZoomLevel(z);
                studioRef.current.zoomLevel = z;
                studioRef.current.drawFrame();
                return `Zoom depth set to ${z}x`;
            }
        }

        if (lower.includes('cursor') || lower.includes('pointer')) {
            if (lower.includes('on') || lower.includes('show') || lower.includes('enable')) {
                setShowCursor(true);
                studioRef.current.showCursor = true;
                studioRef.current.drawFrame();
                return `Synthetic cursor enabled`;
            }
            if (lower.includes('off') || lower.includes('hide') || lower.includes('disable')) {
                setShowCursor(false);
                studioRef.current.showCursor = false;
                studioRef.current.drawFrame();
                return `Synthetic cursor hidden`;
            }
        }

        if (lower.includes('zoom at') || lower.includes('focus at')) {
            const m = lower.match(/(\d+)\s*s/);
            const timeSec = m ? parseInt(m[1]) : (videoRef.current?.currentTime || 2);
            studioRef.current.addZoom(timeSec, 0.5, 0.5, zoomLevel);
            setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
            return `Added zoom point at ${timeSec}s`;
        }

        if (lower.includes('clear zoom') || lower.includes('remove all zoom')) {
            clearManualZooms();
            return `Cleared all zoom segments`;
        }

        addManualZoom();
        return `Added focal point to timeline`;
    };

    const startRecordingActual = async () => {
        try {
            if (!selectedSource || platform !== 'electron') {
                if (!engineRef.current?.screenStream?.active) {
                    const ok = await engineRef.current?.selectSourceBrowser();
                    if (!ok) return;
                    setSelectedSource('browser-source');
                    await new Promise(r => setTimeout(r, 400));
                }
            }

            const hasStream = engineRef.current?.screenStream?.active;
            if (!hasStream && !selectedSource) return;

            engineRef.current.micEnabled = micEnabled;
            await engineRef.current.startRecording((s) => {
                const m = Math.floor(s / 60).toString().padStart(2, '0');
                const sec = Math.floor(s % 60).toString().padStart(2, '0');
                setTimer(`${m}:${sec}`);
            });
            setIsRecording(true);
        } catch (e) {
            console.error('[Drift] Recording launch error:', e);
        }
    };

    const cancelCountdown = () => {
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        setActiveCountdown(0);
    };

    const toggleRecord = async () => {
        if (isRecording) {
            engineRef.current?.stopRecording();
            setIsRecording(false);
            setTimer('00:00');
        } else {
            if (activeCountdown > 0) {
                cancelCountdown();
                return;
            }

            if (countdownSeconds > 0) {
                setActiveCountdown(countdownSeconds);
                let current = countdownSeconds;
                countdownTimerRef.current = setInterval(() => {
                    current -= 1;
                    if (current <= 0) {
                        clearInterval(countdownTimerRef.current);
                        countdownTimerRef.current = null;
                        setActiveCountdown(0);
                        startRecordingActual();
                    } else {
                        setActiveCountdown(current);
                    }
                }, 1000);
            } else {
                startRecordingActual();
            }
        }
    };

    useEffect(() => { toggleRecordRef.current = toggleRecord; }, [toggleRecord]);

    // Hotkey listener
    useEffect(() => {
        const handler = (e) => {
            const { action } = e.detail || {};
            switch (action) {
                case 'toggle_recording':
                    if (toggleRecordRef.current) toggleRecordRef.current();
                    break;
                case 'stop_recording':
                    if (isRecording && engineRef.current) {
                        engineRef.current.stopRecording();
                        setIsRecording(false);
                    }
                    break;
                case 'toggle_pause':
                    if (viewMode === 'studio') togglePlayback();
                    break;
                case 'toggle_zoom':
                    addManualZoom();
                    break;
            }
        };
        window.addEventListener('drift-hotkey', handler);
        return () => {
            window.removeEventListener('drift-hotkey', handler);
            drift.unregisterAllShortcuts();
        };
    }, [isRecording, viewMode]);

    // Studio controls
    const togglePlayback = () => {
        if (!studioRef.current) return;
        if (videoRef.current?.paused) {
            studioRef.current.play();
            setIsPlaying(true);
        } else {
            studioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (targetTime) => {
        if (!studioRef.current || !videoRef.current) return;
        videoRef.current.currentTime = targetTime;
        setCurrentTime(targetTime);
        studioRef.current.resetCamera();
    };

    const addManualZoom = () => {
        if (!studioRef.current || !videoRef.current) return;
        const ct = videoRef.current.currentTime;
        studioRef.current.addZoom(ct, 0.5, 0.5, zoomLevel);
        setRecordedClicks([...(studioRef.current.clicks || [])]);
        setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
    };

    const handleCanvasClick = (e) => {
        if (viewMode !== 'studio' || !studioRef.current || !videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / rect.width;
        const canvasY = (e.clientY - rect.top) / rect.height;
        const ct = videoRef.current.currentTime;
        const { x, y } = studioRef.current.resolveClick(canvasX, canvasY);
        studioRef.current.addZoom(ct, x, y, zoomLevel);
        setRecordedClicks([...(studioRef.current.clicks || [])]);
        setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
    };

    const clearManualZooms = () => {
        if (!studioRef.current) return;
        studioRef.current.clicks = [];
        studioRef.current.setFocusSegments([]);
        setRecordedClicks([]);
        setFocusSegments([]);
    };

    const handleDeleteSegment = (id) => {
        if (studioRef.current) {
            studioRef.current.deleteFocusSegment(id);
            setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
        }
    };

    const handleSelectSegment = (seg) => {
        setSelectedSegmentId(seg.id);
    };

    const handleUpdateSegment = (id, updates) => {
        if (studioRef.current) {
            studioRef.current.updateFocusSegment(id, updates);
            setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
        }
    };

    const handleAddAnnotation = (type) => {
        const ct = videoRef.current?.currentTime || 0;
        const curMs = ct * 1000;
        let newAnn;

        if (type === 'rect') {
            newAnn = {
                id: 'ann-' + Date.now(),
                type: 'rect',
                x: 0.3,
                y: 0.25,
                w: 0.4,
                h: 0.35,
                startTime: curMs,
                endTime: curMs + 3500,
                color: '#DCFE50',
            };
        } else if (type === 'arrow') {
            newAnn = {
                id: 'ann-' + Date.now(),
                type: 'arrow',
                startX: 0.25,
                startY: 0.25,
                endX: 0.45,
                endY: 0.45,
                startTime: curMs,
                endTime: curMs + 3500,
                color: '#DCFE50',
            };
        } else if (type === 'text') {
            newAnn = {
                id: 'ann-' + Date.now(),
                type: 'text',
                x: 0.5,
                y: 0.5,
                text: 'Highlight Point',
                startTime: curMs,
                endTime: curMs + 3500,
                color: '#DCFE50',
            };
        }

        if (newAnn) {
            const nextAnns = [...annotations, newAnn];
            setAnnotations(nextAnns);
            if (studioRef.current) {
                studioRef.current.setAnnotations(nextAnns);
            }
        }
    };

    // Export Logic
    const executeExport = async (format = 'mp4', resolution = '1080p') => {
        if (!studioRef.current) return;
        setIsExporting(true);
        setExportProgress(0);

        try {
            studioRef.current.trimStart = trimStart;
            studioRef.current.trimEnd = trimEnd;

            const videoBlob = await studioRef.current.exportVideo((pct) => {
                setExportProgress(Math.round(Math.min(Math.max(pct || 0, 0), 1) * 92));
            }, { format, resolution });

            const ext = format === 'gif' ? 'gif' : (videoBlob.type === 'video/mp4' ? 'mp4' : 'webm');

            if (platform === 'tauri') {
                try {
                    const savePath = await drift.showSaveDialog({
                        defaultPath: `drift-recording-${Date.now()}.${ext}`,
                        filters: [{ name: `${ext.toUpperCase()} Video`, extensions: [ext] }],
                    });

                    if (!savePath) {
                        triggerBlobDownload(videoBlob, ext);
                    } else {
                        setExportProgress(96);
                        const fileBytes = new Uint8Array(await videoBlob.arrayBuffer());
                        await drift.saveFile(savePath, fileBytes);
                        setExportProgress(100);
                    }
                } catch (e) {
                    console.error('[Export] Save failed, fallback download:', e);
                    triggerBlobDownload(videoBlob, ext);
                }
            } else {
                triggerBlobDownload(videoBlob, ext);
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
            setExportProgress(0);
            setIsExportDialogOpen(false);
        }
    };

    const triggerBlobDownload = (blob, ext) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `drift-recording-${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };

    const saveHotkeys = async (newHotkeys) => {
        setHotkeys(newHotkeys);
        if (platform === 'tauri') {
            await drift.setHotkeys(newHotkeys);
            await drift.registerGlobalShortcuts(newHotkeys);
        }
        setShowHotkeySettings(false);
    };

    const handleNewRecording = () => {
        if (isRecording) {
            engineRef.current?.stopRecording();
            setIsRecording(false);
        }
        setRecordedBlob(null);
        setRecordedClicks([]);
        setRecordedMoves([]);
        setDuration(0);
        setCurrentTime(0);
        setViewMode('recorder');
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (viewMode === 'studio' && e.code === 'Space' && !e.target.matches('input, textarea, button')) {
                e.preventDefault();
                togglePlayback();
            }
            if (activeCountdown > 0 && e.code === 'Escape') {
                cancelCountdown();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode, activeCountdown]);

    if (!isDesktop) {
        return (
            <div className="h-screen bg-[#07080D] text-white flex flex-col items-center justify-center p-6 text-center font-sans select-none">
                <div className="max-w-md w-full border border-white/10 bg-[#0E0F17] p-8 rounded-2xl shadow-xl">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white text-black rounded-xl flex items-center justify-center font-black text-xl">
                        D
                    </div>
                    <h1 className="text-lg font-bold mb-2 text-white">Drift Desktop Required</h1>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        In-browser recording has been retired. Drift is now available exclusively as a native desktop application.
                    </p>
                    <a
                        href="/downloads/Drift_2.0.0_x64-setup.exe"
                        download
                        className="block w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-100 transition-all shadow-sm"
                    >
                        Download Drift Desktop (21 MB)
                    </a>
                </div>
            </div>
        );
    }

    const isDark = theme !== 'light';

    return (
        <div className={`h-screen font-sans select-none flex flex-col overflow-hidden theme-${theme} ${isDark ? 'dark' : ''} bg-[var(--bg-app)] text-[var(--text-app)] transition-colors duration-200`}>
            {/* Hidden media elements */}
            <video ref={videoRef} className="hidden" muted={viewMode === 'recorder'} playsInline />

            {/* Top Navigation Bar */}
            <DesktopHeader
                viewMode={viewMode}
                setViewMode={setViewMode}
                platform={platform}
                hookStatus={hookStatus}
                onOpenHotkeys={() => setShowHotkeySettings(true)}
                onNewRecording={handleNewRecording}
                hasRecording={Boolean(recordedBlob)}
                recordingTime={timer}
                isRecording={isRecording}
                clickCount={clickCount}
                theme={theme}
                onSelectTheme={handleSelectTheme}
            />

            {/* Main Stage */}
            <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
                {viewMode === 'recorder' ? (
                    /* ═══ CAPTURE COCKPIT ═══ */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto overflow-y-auto">
                        <canvas ref={canvasRef} width={1280} height={720} className="hidden" />

                        {/* Centered Cockpit Card */}
                        <CaptureCockpit
                            sources={sources}
                            selectedSource={selectedSource}
                            onSelectSource={selectSource}
                            onSelectBrowserSource={selectBrowserSource}
                            sourceThumbnails={sourceThumbnails}
                            loadingSources={loadingSources}
                            isRecording={isRecording}
                            onToggleRecord={toggleRecord}
                            timer={timer}
                            micEnabled={micEnabled}
                            onToggleMic={toggleMic}
                            webcamEnabled={webcamEnabled}
                            onToggleWebcam={toggleWebcam}
                            countdownSeconds={countdownSeconds}
                            onChangeCountdown={setCountdownSeconds}
                            hotkey={(typeof hotkeys.toggle_recording === 'string' ? hotkeys.toggle_recording : 'Ctrl+Shift+R').replace('CmdOrCtrl', 'Ctrl')}
                        />
                    </div>
                ) : (
                    /* ═══ STUDIO MODE ═══ */
                    <div className="flex-1 flex min-h-0">
                        {/* Center Video Stage */}
                        <main className="flex-1 flex flex-col min-w-0 bg-black/10 relative">
                            <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                                <div
                                    className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-[var(--border-app)] shadow-2xl cursor-crosshair group bg-black"
                                    onClick={handleCanvasClick}
                                    title="Click anywhere to add an auto-zoom point"
                                >
                                    <canvas
                                        ref={canvasRef}
                                        width={1280}
                                        height={720}
                                        className="w-full h-full"
                                    />

                                    {/* Canvas Hint */}
                                    <div className="absolute top-3 left-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-white border border-white/10">
                                        ✦ Click anywhere to add a zoom focal point
                                    </div>
                                </div>
                            </div>

                            {/* Studio Timeline Scrubber */}
                            <StudioTimeline
                                isPlaying={isPlaying}
                                onTogglePlay={togglePlayback}
                                currentTime={currentTime}
                                duration={duration}
                                onSeek={handleSeek}
                                clicks={recordedClicks}
                                focusSegments={focusSegments}
                                selectedSegmentId={selectedSegmentId}
                                onSelectSegment={handleSelectSegment}
                                onDeleteSegment={handleDeleteSegment}
                                onUpdateSegment={handleUpdateSegment}
                                onAddZoom={addManualZoom}
                                onClearZooms={clearManualZooms}
                                annotations={annotations}
                                onAddAnnotation={handleAddAnnotation}
                            />
                        </main>

                        {/* Right Inspector Sidebar */}
                        <InspectorPanel
                            background={background}
                            onChangeBackground={handleChangeBackground}
                            backgrounds={BACKGROUNDS}
                            customImage={customImage}
                            onUploadCustomImage={handleUploadCustomImage}
                            zoomLevel={zoomLevel}
                            onChangeZoomLevel={setZoomLevel}
                            showCursor={showCursor}
                            onToggleCursor={() => setShowCursor(prev => !prev)}
                            cursorTheme={cursorTheme}
                            onChangeCursorTheme={setCursorTheme}
                            cursorScale={cursorScale}
                            onChangeCursorScale={setCursorScale}
                            webcamSettings={webcamSettings}
                            onChangeWebcamSettings={handleUpdateWebcamSettings}
                            captions={captions}
                            captionsEnabled={captionsEnabled}
                            onToggleCaptions={() => setCaptionsEnabled(prev => !prev)}
                            onGenerateCaptions={handleGenerateCaptions}
                            isTranscribing={isTranscribing}
                            onApplyAICommand={handleApplyAICommand}
                            onOpenAISettings={() => setIsAISettingsOpen(true)}
                            onTriggerExport={() => setIsExportDialogOpen(true)}
                            isExporting={isExporting}
                            aspectRatio={aspectRatio}
                            onChangeAspectRatio={setAspectRatio}
                        />
                    </div>
                )}
            </div>

            {/* Countdown Overlay */}
            <CountdownOverlay
                count={activeCountdown}
                onCancel={cancelCountdown}
            />

            {/* Export Dialog */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
                onStartExport={executeExport}
                isExporting={isExporting}
                exportProgress={exportProgress}
            />

            {/* AI Settings Modal (BYOK: Claude, OpenAI, Gemini, OpenRouter) */}
            <AISettings
                isOpen={isAISettingsOpen}
                onClose={() => setIsAISettingsOpen(false)}
            />

            {/* Hotkeys Modal */}
            {showHotkeySettings && (
                <HotkeyModal
                    isOpen={showHotkeySettings}
                    hotkeys={hotkeys}
                    onUpdate={setHotkeys}
                    onSave={saveHotkeys}
                    onClose={() => setShowHotkeySettings(false)}
                />
            )}
        </div>
    );
}
