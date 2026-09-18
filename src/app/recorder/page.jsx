'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DriftEngine } from '@/lib/DriftEngine';
import { StudioEngine } from '@/lib/StudioEngine';
import drift from '@/lib/tauri-bridge';
import { transcribeWithSpeechAPI } from '@/lib/ai/captions';
import { encodeProject, decodeProject } from '@/lib/project-file';

// Modular Shadcn Desktop Components
import DesktopHeader from '@/components/desktop/DesktopHeader';
import CaptureCockpit from '@/components/desktop/CaptureCockpit';
import CountdownOverlay from '@/components/desktop/CountdownOverlay';
import StudioTimeline from '@/components/desktop/StudioTimeline';
import InspectorPanel from '@/components/desktop/InspectorPanel';
import ExportDialog from '@/components/desktop/ExportDialog';
import HotkeyModal from '@/components/desktop/HotkeyModal';
import AISettings from '@/app/components/settings/AISettings';
import NotesTeleprompter from '@/components/desktop/NotesTeleprompter';

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
    const recorderCanvasRef = useRef(null);
    const recorderVideoRef = useRef(null);
    const studioCanvasRef = useRef(null);
    const studioVideoRef = useRef(null);
    const engineRef = useRef(null);
    const studioRef = useRef(null);
    const toggleRecordRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const savedSegmentsRef = useRef(null);
    const projectInputRef = useRef(null);
    const isRecordingRef = useRef(false);
    const viewModeRef = useRef('recorder');
    const [projectRevision, setProjectRevision] = useState(0);
    const [notice, setNotice] = useState('');
    const [hasActiveStream, setHasActiveStream] = useState(false);

    const isNativeRecordingRef = useRef(false);
    const nativeTimerIntervalRef = useRef(null);
    const nativeSessionStartRef = useRef(null);
    const nativeWebcamRecorderRef = useRef(null);
    const nativeWebcamChunksRef = useRef([]);
    const [isNativeSupported, setIsNativeSupported] = useState(false);
    const [nativeAudioTracks, setNativeAudioTracks] = useState({ systemAudioUrl: null, micAudioUrl: null });
    const [autoZoomOnClicks, setAutoZoomOnClicks] = useState(false);

    // --- State ---
    const [viewMode, setViewMode] = useState('recorder'); // 'recorder' | 'studio'
    const [platform, setPlatform] = useState('browser'); // 'tauri' | 'electron' | 'browser'
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
    const [micStream, setMicStream] = useState(null);
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
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedMicId, setSelectedMicId] = useState('');
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedWebcamId, setSelectedWebcamId] = useState('');
    const [autoMinimize, setAutoMinimize] = useState(true);

    // Studio State
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedWebcamBlob, setRecordedWebcamBlob] = useState(null);
    const [recordedClicks, setRecordedClicks] = useState([]);
    const [recordedMoves, setRecordedMoves] = useState([]);
    const [recordedKeystrokes, setRecordedKeystrokes] = useState([]);
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
    const [splineSmoothing, setSplineSmoothing] = useState(true);
    const [systemAudioVolume, setSystemAudioVolume] = useState(1.0);
    const [micAudioVolume, setMicAudioVolume] = useState(1.2);
    const [isSystemAudioMuted, setIsSystemAudioMuted] = useState(false);
    const [isMicAudioMuted, setIsMicAudioMuted] = useState(false);
    const [autoDuck, setAutoDuck] = useState(true);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [insetPadding, setInsetPadding] = useState(0.08);
    const [borderRadius, setBorderRadius] = useState(18);
    const [windowChrome, setWindowChrome] = useState(true);
    const [springProfile, setSpringProfile] = useState('cinematic');
    const [showKeystrokes, setShowKeystrokes] = useState(true);

    // Interactive Drag-to-Zoom State
    const [dragBox, setDragBox] = useState(null);
    const isDraggingCanvasRef = useRef(false);
    const dragStartPosRef = useRef({ clientX: 0, clientY: 0, canvasX: 0, canvasY: 0, rect: null });

    // OpenScreen & Recordly Features State
    const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
    const [tiltAngle, setTiltAngle] = useState(3.5);
    const [connectedZooms, setConnectedZooms] = useState(true);
    const [reactiveWebcam, setReactiveWebcam] = useState(true);

    // Captions & Annotations State
    const [captions, setCaptions] = useState([]);
    const [captionsEnabled, setCaptionsEnabled] = useState(true);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [annotations, setAnnotations] = useState([]);

    // Export State
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportStage, setExportStage] = useState('Rendering & Encoding');

    // AI BYOK Settings Modal State
    const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

    // Hotkeys & Telemetry
    const [showHotkeySettings, setShowHotkeySettings] = useState(false);
    const [hookStatus, setHookStatus] = useState('Active');
    const [hotkeys, setHotkeys] = useState({
        toggle_recording: 'CmdOrCtrl+X',
        stop_recording: 'CmdOrCtrl+X',
        toggle_pause: 'CmdOrCtrl+Shift+P',
        toggle_zoom: 'CmdOrCtrl+Shift+Z',
    });

    const isDesktop = platform === 'tauri' || platform === 'electron';

    useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
    useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

    // Load media devices (microphones & webcams)
    const loadMediaDevices = useCallback(async () => {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const mics = devices.filter(d => d.kind === 'audioinput');
            const cams = devices.filter(d => d.kind === 'videoinput');
            setAudioDevices(mics);
            setVideoDevices(cams);
            if (mics.length > 0) setSelectedMicId(prev => prev || mics[0].deviceId);
            if (cams.length > 0) setSelectedWebcamId(prev => prev || cams[0].deviceId);
        } catch (e) {
            console.warn('[Drift] Media device enumeration notice:', e);
        }
    }, []);

    // Load saved settings
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('drift_theme');
            if (savedTheme) setTheme(savedTheme);
            const savedAutoMin = localStorage.getItem('drift_auto_minimize');
            if (savedAutoMin !== null) setAutoMinimize(savedAutoMin === 'true');
        } catch (e) {}
        loadMediaDevices();
    }, [loadMediaDevices]);

    const handleToggleAutoMinimize = (val) => {
        setAutoMinimize(val);
        try {
            localStorage.setItem('drift_auto_minimize', String(val));
        } catch (e) {}
    };

    const handleSelectMic = async (deviceId) => {
        setSelectedMicId(deviceId);
        if (micEnabled && engineRef.current) {
            const ok = await engineRef.current.enableMic(deviceId);
            if (ok && engineRef.current.micStream) {
                setMicStream(engineRef.current.micStream);
            }
        }
    };

    const handleSelectWebcam = async (deviceId) => {
        setSelectedWebcamId(deviceId);
        if (webcamEnabled && engineRef.current) {
            await engineRef.current.enableWebcam(deviceId);
        }
    };

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
            drift.isNativeCaptureSupported().then(supported => {
                setIsNativeSupported(Boolean(supported));
            }).catch(() => {
                setIsNativeSupported(false);
            });
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
            setHookStatus('Web Browser');
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
        if (viewMode === 'recorder') {
            if (studioRef.current) {
                savedSegmentsRef.current = studioRef.current.getFocusSegments();
                studioRef.current.dispose();
                studioRef.current = null;
            }
            engineRef.current = new DriftEngine(recorderCanvasRef.current, recorderVideoRef.current);
            engineRef.current.onclickCallback = (c) => setClickCount(c);
            engineRef.current.micEnabled = micEnabled;
            engineRef.current.onHotkeyStart = () => {
                if (toggleRecordRef.current) toggleRecordRef.current();
            };

            engineRef.current.onStopCallback = (blob, clicks, dur, meta = {}) => {
                savedSegmentsRef.current = null;
                setIsRecording(false);
                setHasActiveStream(false);
                if (drift.isTauri() && typeof drift.restoreWindow === 'function') {
                    drift.restoreWindow();
                }
                if (engineRef.current?.screenStream) {
                    engineRef.current.screenStream.getTracks().forEach(t => t.stop());
                }
                if (engineRef.current?.micStream) {
                    engineRef.current.micStream.getTracks().forEach(t => t.stop());
                }
                if (engineRef.current?.webcamStream) {
                    engineRef.current.webcamStream.getTracks().forEach(t => t.stop());
                }
                const moves = engineRef.current?.mouseMoves || [];
                const clickList = clicks || [];
                setRecordedBlob(blob);
                setRecordedClicks(clickList);
                setRecordedMoves(moves);
                if (moves.length > 0 || clickList.length > 0) {
                    setShowCursor(true);
                }
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
            if (engineRef.current) {
                engineRef.current.stop();
                setHasActiveStream(false);
            }
            if (recorderVideoRef.current) recorderVideoRef.current.srcObject = null;

            if (recordedBlob && studioCanvasRef.current && studioVideoRef.current) {
                if (studioRef.current) {
                    studioRef.current.dispose();
                    studioRef.current = null;
                }

                studioRef.current = new StudioEngine(
                    studioCanvasRef.current,
                    studioVideoRef.current,
                    recordedBlob,
                    recordedClicks,
                    recDurationRef.current,
                    recordedMoves,
                    {
                        webcamBlob: recordedWebcamBlob,
                        webcamSettings,
                        captions,
                        annotations,
                        captionsEnabled,
                        customBackgroundImage: customImage,
                        cursorTheme,
                        cursorScale,
                        splineSmoothing,
                        systemAudioVolume,
                        micAudioVolume,
                        isSystemAudioMuted,
                        isMicAudioMuted,
                        autoDuck,
                        insetPadding,
                        borderRadius,
                        windowChrome,
                        springProfile,
                        showKeystrokes,
                        keystrokes: recordedKeystrokes,
                        focusSegments: savedSegmentsRef.current,
                        autoZoomOnClicks,
                        showCursor: showCursor || ((recordedMoves && recordedMoves.length > 0) || (recordedClicks && recordedClicks.length > 0)),
                        systemAudioUrl: nativeAudioTracks.systemAudioUrl,
                        micAudioUrl: nativeAudioTracks.micAudioUrl,
                    }
                );
                const hasTelemetry = (recordedMoves && recordedMoves.length > 0) || (recordedClicks && recordedClicks.length > 0);
                const effectiveShowCursor = showCursor || hasTelemetry;
                studioRef.current.background = background;
                studioRef.current.zoomLevel = zoomLevel;
                studioRef.current.showCursor = effectiveShowCursor;
                if (effectiveShowCursor && !showCursor) {
                    setShowCursor(true);
                }
                studioRef.current.cursorTheme = cursorTheme;
                Object.assign(studioRef.current, {
                    cursorScale,
                    splineSmoothing,
                    systemAudioVolume,
                    micAudioVolume,
                    isSystemAudioMuted,
                    isMicAudioMuted,
                    autoDuck,
                    insetPadding,
                    borderRadius,
                    windowChrome,
                    springProfile,
                    showKeystrokes,
                    keystrokes: recordedKeystrokes,
                    tiltAngle,
                    connectedZooms,
                    reactiveWebcam,
                    captionsEnabled,
                });
                studioRef.current.setAspectRatio(aspectRatio);

                if (studioVideoRef.current) {
                    studioVideoRef.current.ontimeupdate = () => {
                        if (studioVideoRef.current) {
                            setCurrentTime(studioVideoRef.current.currentTime);
                            setDuration(studioRef.current?.videoDuration || 0);
                        }
                    };
                }
                [40, 120, 300, 600].forEach(delay => {
                    setTimeout(() => {
                        if (studioRef.current) {
                            const d = recDurationRef.current || studioRef.current?.videoDuration || 10;
                            setDuration(d);
                            setTrimEnd(d);
                            setFocusSegments(studioRef.current.getFocusSegments() || []);
                            studioRef.current.drawFrame();
                        }
                    }, delay);
                });
            }
        }
    }, [viewMode, platform, projectRevision]);

    useEffect(() => {
        if (studioRef.current) studioRef.current.setBackground(background);
    }, [background]);

    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.zoomLevel = zoomLevel;
            studioRef.current.drawFrame();
        }
    }, [zoomLevel]);

    useEffect(() => {
        if (studioRef.current) {
            Object.assign(studioRef.current, { showCursor, cursorScale, cursorTheme, captionsEnabled });
            studioRef.current.drawFrame();
        }
    }, [showCursor, cursorScale, cursorTheme, captionsEnabled]);

    useEffect(() => {
        if (studioRef.current && studioRef.current.setAspectRatio) {
            studioRef.current.setAspectRatio(aspectRatio);
        }
    }, [aspectRatio]);

    // Source selection & live preview
    const selectSource = async (id) => {
        setSelectedSource(id);
        if (platform === 'tauri') {
            const idx = typeof id === 'number' ? id : (parseInt(String(id).replace(/\D+/g, ''), 10) || 0);
            try {
                const bytes = await drift.captureScreenshot(idx);
                if (bytes && bytes.length > 0) {
                    const blob = new Blob([new Uint8Array(bytes)], { type: 'image/png' });
                    const url = URL.createObjectURL(blob);
                    setSourceThumbnails(prev => ({ ...prev, [id]: url }));
                }
            } catch (e) {
                console.warn('[Drift] Screenshot refresh failed:', e);
            }
        } else if (platform === 'electron') {
            const ok = await engineRef.current?.selectSource(id, micEnabled);
            if (ok) setHasActiveStream(true);
        }
    };

    const handleStartPreview = async () => {
        if (platform === 'tauri') {
            const idx = typeof selectedSource === 'number' ? selectedSource : (parseInt(String(selectedSource || '0').replace(/\D+/g, ''), 10) || 0);
            try {
                const bytes = await drift.captureScreenshot(idx);
                if (bytes && bytes.length > 0) {
                    const blob = new Blob([new Uint8Array(bytes)], { type: 'image/png' });
                    const url = URL.createObjectURL(blob);
                    setSourceThumbnails(prev => ({ ...prev, [selectedSource || `screen:${idx}`]: url }));
                }
            } catch (e) {
                console.warn('[Drift] Screenshot preview failed:', e);
            }
        } else {
            await selectBrowserSource();
        }
    };

    const selectBrowserSource = async () => {
        const ok = await engineRef.current?.selectSourceBrowser();
        if (ok) {
            setSelectedSource('browser-source');
            setHasActiveStream(true);
        }
    };

    const toggleMic = async () => {
        const next = !micEnabled;
        setMicEnabled(next);
        if (engineRef.current) {
            engineRef.current.micEnabled = next;
            if (next) {
                const ok = await engineRef.current.enableMic(selectedMicId || null);
                if (ok && engineRef.current.micStream) {
                    setMicStream(engineRef.current.micStream);
                }
                loadMediaDevices();
            } else {
                engineRef.current.disableMic();
                setMicStream(null);
            }
        }
    };

    const toggleWebcam = async () => {
        if (!engineRef.current) return;
        if (webcamEnabled) {
            engineRef.current.disableWebcam();
            setWebcamEnabled(false);
            setWebcamSettings(prev => ({ ...prev, enabled: false }));
        } else {
            const ok = await engineRef.current.enableWebcam(selectedWebcamId || null);
            if (ok) {
                setWebcamEnabled(true);
                setWebcamSettings(prev => ({ ...prev, enabled: true }));
                loadMediaDevices();
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
            setNotice(`Captions could not be generated: ${err.message}`);
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
            const timeSec = m ? parseInt(m[1]) : (studioVideoRef.current?.currentTime || 2);
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
            if (isNativeSupported && drift.isTauri()) {
                try {
                    isNativeRecordingRef.current = true;
                    const monitorIndex = typeof selectedSource === 'number'
                        ? selectedSource
                        : (parseInt(String(selectedSource || '0').replace(/\D+/g, ''), 10) || 0);

                    await drift.startNativeSession({
                        monitorIndex,
                        fps: 60,
                        withSystemAudio: true,
                        withMic: micEnabled,
                        withoutCursor: true,
                    });
                    await drift.startSessionTelemetry();

                    // Capture webcam stream in parallel if enabled
                    if (webcamEnabled && engineRef.current?.webcamStream) {
                        try {
                            const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
                            const rec = new MediaRecorder(engineRef.current.webcamStream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
                            nativeWebcamChunksRef.current = [];
                            rec.ondataavailable = (e) => {
                                if (e.data.size > 0) nativeWebcamChunksRef.current.push(e.data);
                            };
                            rec.start(1000);
                            nativeWebcamRecorderRef.current = rec;
                        } catch (camErr) {
                            console.warn('[Drift] Native webcam recorder start failed:', camErr);
                            nativeWebcamRecorderRef.current = null;
                        }
                    } else {
                        nativeWebcamRecorderRef.current = null;
                    }

                    nativeSessionStartRef.current = Date.now();
                    nativeTimerIntervalRef.current = setInterval(() => {
                        const s = (Date.now() - nativeSessionStartRef.current) / 1000;
                        const m = Math.floor(s / 60).toString().padStart(2, '0');
                        const sec = Math.floor(s % 60).toString().padStart(2, '0');
                        setTimer(`${m}:${sec}`);
                    }, 1000);

                    setIsRecording(true);
                    setHasActiveStream(true);

                    if (autoMinimize && typeof drift.minimizeWindow === 'function') {
                        try {
                            await drift.minimizeWindow();
                        } catch (minErr) {
                            console.warn('[Drift] Window auto-minimize notice:', minErr);
                        }
                    }
                    return;
                } catch (nativeErr) {
                    console.warn('[Drift] Native recording failed, falling back to screen capture:', nativeErr);
                    setNotice(`Native capture notice: ${nativeErr?.message || nativeErr} — recording via screen capture`);
                    isNativeRecordingRef.current = false;
                }
            }

            if (!selectedSource || platform !== 'electron') {
                if (!engineRef.current?.screenStream?.active) {
                    const ok = await engineRef.current?.selectSourceBrowser();
                    if (!ok) return;
                    setSelectedSource('browser-source');
                    setHasActiveStream(true);
                    await new Promise(r => setTimeout(r, 400));
                }
            }

            const hasStream = engineRef.current?.screenStream?.active;
            if (!hasStream && !selectedSource) return;

            setHasActiveStream(true);

            engineRef.current.micEnabled = micEnabled;
            await engineRef.current.startRecording((s) => {
                const m = Math.floor(s / 60).toString().padStart(2, '0');
                const sec = Math.floor(s % 60).toString().padStart(2, '0');
                setTimer(`${m}:${sec}`);
            });
            setIsRecording(true);

            // Cinema Recorder: auto-minimize Drift window so user records their clean screen/apps
            if (autoMinimize && drift.isTauri() && typeof drift.minimizeWindow === 'function') {
                try {
                    await drift.minimizeWindow();
                } catch (minErr) {
                    console.warn('[Drift] Window auto-minimize notice:', minErr);
                }
            }
        } catch (e) {
            console.error('[Drift] Recording launch error:', e);
            setNotice(`Recording error: ${e?.message || e}`);
            isNativeRecordingRef.current = false;
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
        if (isRecordingRef.current) {
            if (isNativeRecordingRef.current) {
                isNativeRecordingRef.current = false;
                if (nativeTimerIntervalRef.current) {
                    clearInterval(nativeTimerIntervalRef.current);
                    nativeTimerIntervalRef.current = null;
                }
                setIsRecording(false);
                setTimer('00:00');
                setHasActiveStream(false);

                if (drift.isTauri() && typeof drift.restoreWindow === 'function') {
                    try { await drift.restoreWindow(); } catch (e) {}
                }

                try {
                    const result = await drift.stopNativeSession();
                    const nativeSamples = typeof drift.stopSessionTelemetry === 'function'
                        ? await drift.stopSessionTelemetry()
                        : await drift.getSessionTelemetry();

                    const videoUrl = await drift.resolveAssetUrl(result.screen_video_path);
                    const sysAudioUrl = result.system_audio_path ? await drift.resolveAssetUrl(result.system_audio_path) : null;
                    const micAudioUrl = result.mic_audio_path ? await drift.resolveAssetUrl(result.mic_audio_path) : null;

                    const activeSource = sources.find(s => s.id === selectedSource) || sources[0] || { width: 1920, height: 1080 };
                    const srcW = activeSource.width || 1920;
                    const srcH = activeSource.height || 1080;

                    const moves = (nativeSamples || []).map(s => ({
                        time: s.t,
                        x: s.x > 1 ? s.x / srcW : s.x,
                        y: s.y > 1 ? s.y / srcH : s.y,
                        click: s.click,
                    }));

                    const clickList = (nativeSamples || []).filter(s => Boolean(s.click)).map(s => ({
                        time: s.t,
                        x: s.x > 1 ? s.x / srcW : s.x,
                        y: s.y > 1 ? s.y / srcH : s.y,
                        button: s.click,
                    }));

                    let keystrokeList = [];
                    if (typeof drift.getSessionKeystrokes === 'function') {
                        try {
                            keystrokeList = await drift.getSessionKeystrokes();
                        } catch (e) {
                            console.warn('[Drift] Keystroke fetch notice:', e);
                        }
                    }
                    if ((!keystrokeList || keystrokeList.length === 0) && result.keystrokes_path) {
                        try {
                            const keysUrl = await drift.resolveAssetUrl(result.keystrokes_path);
                            const res = await fetch(keysUrl);
                            if (res.ok) keystrokeList = await res.json();
                        } catch (e) {}
                    }
                    setRecordedKeystrokes(keystrokeList || []);

                    setNativeAudioTracks({ systemAudioUrl: sysAudioUrl, micAudioUrl });
                    setRecordedBlob(videoUrl);
                    setRecordedClicks(clickList);
                    setRecordedMoves(moves);

                    // Finalize native webcam recording if active
                    if (nativeWebcamRecorderRef.current) {
                        try {
                            if (nativeWebcamRecorderRef.current.state !== 'inactive') {
                                nativeWebcamRecorderRef.current.stop();
                            }
                            if (nativeWebcamChunksRef.current.length > 0) {
                                const camBlob = new Blob(nativeWebcamChunksRef.current, { type: 'video/webm' });
                                setRecordedWebcamBlob(camBlob);
                                setWebcamSettings(prev => ({ ...prev, enabled: true }));
                            }
                        } catch (camErr) {
                            console.warn('[Drift] Native webcam finalize notice:', camErr);
                        }
                        nativeWebcamRecorderRef.current = null;
                    }

                    setShowCursor(true);
                    recDurationRef.current = (result.duration_ms || (Date.now() - (nativeSessionStartRef.current || Date.now()))) / 1000;
                    setViewMode('studio');
                } catch (err) {
                    console.error('[Drift] Stop native session error:', err);
                }
                return;
            }

            engineRef.current?.stopRecording();
            setIsRecording(false);
            setTimer('00:00');
            if (drift.isTauri() && typeof drift.restoreWindow === 'function') {
                try {
                    await drift.restoreWindow();
                } catch (e) {}
            }
        } else {
            if (activeCountdown > 0) {
                cancelCountdown();
                return;
            }

            // If stream is not active yet and not native, acquire it BEFORE starting the countdown
            // so the system screen picker doesn't interrupt the 3, 2, 1 flow!
            if (!isNativeSupported && !engineRef.current?.screenStream?.active) {
                let ok = false;
                if (platform === 'electron' && selectedSource) {
                    ok = await engineRef.current?.selectSource(selectedSource, micEnabled);
                } else {
                    ok = await engineRef.current?.selectSourceBrowser();
                    if (ok) setSelectedSource('browser-source');
                }
                if (!ok) return;
                setHasActiveStream(true);
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

    // Permanent hotkey listener — stays active through recording without unregistering
    useEffect(() => {
        const handler = (e) => {
            const { action } = e.detail || {};
            switch (action) {
                case 'toggle_recording':
                    if (toggleRecordRef.current) toggleRecordRef.current();
                    break;
                case 'stop_recording':
                    if (isRecordingRef.current) {
                        if (toggleRecordRef.current) toggleRecordRef.current();
                    }
                    break;
                case 'toggle_pause':
                    if (viewModeRef.current === 'studio') togglePlayback();
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
    }, []);

    // Studio controls
    const togglePlayback = () => {
        if (!studioRef.current) return;
        if (studioVideoRef.current?.paused) {
            studioRef.current.play();
            setIsPlaying(true);
        } else {
            studioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (targetTime) => {
        if (!studioRef.current) return;
        studioRef.current.seek(targetTime);
        setCurrentTime(targetTime);
    };

    const addManualZoom = () => {
        if (!studioRef.current || !studioVideoRef.current) return;
        const ct = studioVideoRef.current.currentTime;
        studioRef.current.addZoom(ct, 0.5, 0.5, zoomLevel);
        setRecordedClicks([...(studioRef.current.clicks || [])]);
        setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
    };

    const handleCanvasClick = (e) => {
        if (viewMode !== 'studio' || !studioRef.current || !studioVideoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / rect.width;
        const canvasY = (e.clientY - rect.top) / rect.height;
        const ct = studioVideoRef.current.currentTime;
        const { x, y } = studioRef.current.resolveClick(canvasX, canvasY);
        studioRef.current.addZoom(ct, x, y, zoomLevel);
        setRecordedClicks([...(studioRef.current.clicks || [])]);
        setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
    };

    const handleCanvasMouseDown = (e) => {
        if (viewMode !== 'studio' || !studioRef.current || !studioVideoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        isDraggingCanvasRef.current = true;
        dragStartPosRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            canvasX: e.clientX - rect.left,
            canvasY: e.clientY - rect.top,
            rect,
        };
        setDragBox(null);
    };

    const handleCanvasMouseMove = (e) => {
        if (!isDraggingCanvasRef.current) return;
        const start = dragStartPosRef.current;
        const rect = start.rect;
        if (!rect) return;

        const curCanvasX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const curCanvasY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        const dist = Math.hypot(e.clientX - start.clientX, e.clientY - start.clientY);
        if (dist > 6) {
            const left = Math.min(start.canvasX, curCanvasX);
            const top = Math.min(start.canvasY, curCanvasY);
            const width = Math.abs(curCanvasX - start.canvasX);
            const height = Math.abs(curCanvasY - start.canvasY);

            const normW = Math.max(0.04, width / rect.width);
            const normH = Math.max(0.04, height / rect.height);
            const previewScale = Math.min(3.5, Math.max(1.2, Math.min(1.0 / normW, 1.0 / normH))).toFixed(1);

            setDragBox({
                left,
                top,
                width,
                height,
                previewScale,
            });
        }
    };

    const handleCanvasMouseUp = (e) => {
        if (!isDraggingCanvasRef.current) return;
        isDraggingCanvasRef.current = false;
        const start = dragStartPosRef.current;
        const dist = Math.hypot(e.clientX - start.clientX, e.clientY - start.clientY);

        if (dist <= 6) {
            // Quick point click
            handleCanvasClick(e);
        } else if (dragBox && dragBox.width > 12 && dragBox.height > 12 && studioRef.current && studioVideoRef.current) {
            // Drag box focal crop
            const rect = start.rect;
            const normX1 = dragBox.left / rect.width;
            const normY1 = dragBox.top / rect.height;
            const normX2 = (dragBox.left + dragBox.width) / rect.width;
            const normY2 = (dragBox.top + dragBox.height) / rect.height;

            const c1 = studioRef.current.resolveClick(normX1, normY1);
            const c2 = studioRef.current.resolveClick(normX2, normY2);

            const vidMinX = Math.min(c1.x, c2.x);
            const vidMaxX = Math.max(c1.x, c2.x);
            const vidMinY = Math.min(c1.y, c2.y);
            const vidMaxY = Math.max(c1.y, c2.y);

            const boxW = Math.max(0.04, vidMaxX - vidMinX);
            const boxH = Math.max(0.04, vidMaxY - vidMinY);
            const targetX = (vidMinX + vidMaxX) / 2;
            const targetY = (vidMinY + vidMaxY) / 2;

            const computedScale = Math.min(3.5, Math.max(1.2, Math.min(1.0 / boxW, 1.0 / boxH)));
            const scale = Math.round(computedScale * 10) / 10;

            const ct = studioVideoRef.current.currentTime;
            studioRef.current.addZoom(ct, targetX, targetY, scale);
            setRecordedClicks([...(studioRef.current.clicks || [])]);
            setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
        }

        setDragBox(null);
    };

    const handleAddFocusSegment = (seg) => {
        if (studioRef.current) {
            studioRef.current.addFocusSegment(seg);
            setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
            setSelectedSegmentId(seg.id);
        }
    };

    const handleSplitSegment = (segId, splitTime) => {
        if (studioRef.current) {
            const segs = studioRef.current.getFocusSegments() || [];
            const seg = segs.find(s => s.id === segId);
            if (seg && splitTime > seg.startTime + 0.1 && splitTime < seg.endTime - 0.1) {
                const oldEnd = seg.endTime;
                studioRef.current.updateFocusSegment(segId, { endTime: splitTime });
                const newSeg = {
                    ...seg,
                    id: 'seg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
                    startTime: splitTime,
                    endTime: oldEnd,
                };
                studioRef.current.addFocusSegment(newSeg);
                setFocusSegments([...(studioRef.current.getFocusSegments() || [])]);
                setSelectedSegmentId(newSeg.id);
            }
        }
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
        const ct = studioVideoRef.current?.currentTime || 0;
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
    const executeExport = async (format = 'mp4', resolution = '1080p', fps = 60, quality = 'pro') => {
        if (!studioRef.current) return;
        setIsExporting(true);
        setExportProgress(0);
        setExportStage('Rendering frames & camera transforms...');

        try {
            studioRef.current.trimStart = trimStart;
            studioRef.current.trimEnd = trimEnd;

            const videoBlob = await studioRef.current.exportVideo((pct) => {
                const scaled = Math.round(Math.min(Math.max(pct || 0, 0), 1) * 92);
                setExportProgress(scaled);
                if (scaled < 40) {
                    setExportStage(`Compositing ${resolution.toUpperCase()} @ ${fps}fps...`);
                } else if (scaled < 85) {
                    setExportStage('Hardware encoding audio & video tracks...');
                } else {
                    setExportStage('Finalizing MP4 container...');
                }
            }, { format, resolution, fps, quality });

            const ext = format === 'gif' ? 'gif' : (videoBlob.type === 'video/mp4' ? 'mp4' : 'webm');

            if (platform === 'tauri') {
                try {
                    setExportStage('Selecting save location...');
                    const savePath = await drift.showSaveDialog({
                        defaultPath: `drift-cinema-${resolution}-${fps}fps-${Date.now()}.${ext}`,
                        filters: [{ name: `${ext.toUpperCase()} Video`, extensions: [ext] }],
                    });

                    if (!savePath) {
                        triggerBlobDownload(videoBlob, ext);
                    } else {
                        setExportStage('Saving high-speed video to disk...');
                        setExportProgress(96);
                        const fileBytes = new Uint8Array(await videoBlob.arrayBuffer());
                        await drift.saveFile(savePath, fileBytes);
                        setExportProgress(100);
                        setNotice(`Exported ${ext.toUpperCase()} video successfully to ${savePath}`);
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
            setNotice(`Export failed: ${error.message}`);
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
            if (isNativeRecordingRef.current) {
                drift.stopNativeSession().catch(() => {});
                isNativeRecordingRef.current = false;
            } else {
                engineRef.current?.stopRecording();
            }
            setIsRecording(false);
        }
        if (nativeTimerIntervalRef.current) {
            clearInterval(nativeTimerIntervalRef.current);
            nativeTimerIntervalRef.current = null;
        }
        if (studioRef.current) {
            studioRef.current.dispose();
            studioRef.current = null;
        }
        setHasActiveStream(false);
        setRecordedBlob(null);
        setNativeAudioTracks({ systemAudioUrl: null, micAudioUrl: null });
        setRecordedClicks([]);
        setRecordedMoves([]);
        setDuration(0);
        setCurrentTime(0);
        setViewMode('recorder');
    };

    const saveProject = async () => {
        try {
            let blobToSave = recordedBlob;
            if (typeof blobToSave === 'string') {
                const res = await fetch(blobToSave);
                blobToSave = await res.blob();
            }
            let webcamToSave = recordedWebcamBlob;
            if (typeof webcamToSave === 'string') {
                const res = await fetch(webcamToSave);
                webcamToSave = await res.blob();
            }
            const project = await encodeProject({
                recording: blobToSave, webcam: webcamToSave, duration,
                clicks: recordedClicks, moves: recordedMoves, keystrokes: recordedKeystrokes,
                focusSegments: studioRef.current?.getFocusSegments() ?? focusSegments,
                annotations, captions, captionsEnabled, background,
                customBackground: customImage?.src ?? null,
                zoomLevel, showCursor, cursorTheme, cursorScale, splineSmoothing, aspectRatio,
                systemAudioVolume, micAudioVolume, isSystemAudioMuted, isMicAudioMuted, autoDuck,
                insetPadding, borderRadius, windowChrome, springProfile, showKeystrokes,
                tiltAngle, connectedZooms, reactiveWebcam, webcamSettings, trimStart, trimEnd,
            });
            triggerBlobDownload(project, 'drift');
            setNotice('Project saved.');
        } catch (error) { setNotice(error.message); }
    };

    const openProject = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        try {
            let project;
            if (file.name.toLowerCase().endsWith('.drift')) {
                project = await decodeProject(file);
            } else {
                const media = document.createElement('video');
                const url = URL.createObjectURL(file);
                try {
                    const mediaDuration = await new Promise((resolve, reject) => {
                        const timer = setTimeout(() => reject(new Error('Video metadata timed out.')), 15000);
                        media.onloadedmetadata = () => {
                            clearTimeout(timer);
                            Number.isFinite(media.duration) && media.duration > 0
                                ? resolve(media.duration) : reject(new Error('This video has no readable duration.'));
                        };
                        media.onerror = () => { clearTimeout(timer); reject(new Error('This video format cannot be opened.')); };
                        media.src = url;
                    });
                    project = { recording: file, duration: mediaDuration };
                } finally { media.removeAttribute('src'); media.load(); URL.revokeObjectURL(url); }
            }
            let image = null;
            if (project.customBackground) {
                image = new Image();
                image.src = project.customBackground;
                await image.decode();
            }
            studioRef.current?.dispose();
            studioRef.current = null;
            engineRef.current?.stop();
            setRecordedBlob(project.recording);
            setRecordedWebcamBlob(project.webcam ?? null);
            setRecordedClicks(project.clicks ?? []);
            setRecordedMoves(project.moves ?? []);
            setRecordedKeystrokes(project.keystrokes ?? []);
            savedSegmentsRef.current = project.focusSegments ?? [];
            setFocusSegments(savedSegmentsRef.current);
            recDurationRef.current = project.duration;
            setDuration(project.duration);
            setCurrentTime(0);
            setIsPlaying(false);
            setAnnotations(project.annotations ?? []);
            setCaptions(project.captions ?? []);
            setCaptionsEnabled(project.captionsEnabled ?? true);
            setBackground(project.background ?? 'midnight');
            setCustomImage(image);
            setZoomLevel(project.zoomLevel ?? 1.8);
            setShowCursor(project.showCursor ?? false);
            setCursorTheme(project.cursorTheme ?? 'macos');
            setCursorScale(project.cursorScale ?? 1);
            setSplineSmoothing(project.splineSmoothing ?? true);
            setShowKeystrokes(project.showKeystrokes ?? true);
            setSystemAudioVolume(project.systemAudioVolume ?? 1.0);
            setMicAudioVolume(project.micAudioVolume ?? 1.2);
            setIsSystemAudioMuted(project.isSystemAudioMuted ?? false);
            setIsMicAudioMuted(project.isMicAudioMuted ?? false);
            setAutoDuck(project.autoDuck ?? true);
            setAspectRatio(project.aspectRatio ?? '16:9');
            setInsetPadding(project.insetPadding ?? 0.08);
            setBorderRadius(project.borderRadius ?? 18);
            setWindowChrome(project.windowChrome !== false);
            setSpringProfile(project.springProfile ?? 'cinematic');
            setTiltAngle(project.tiltAngle ?? 0);
            setConnectedZooms(project.connectedZooms ?? true);
            setReactiveWebcam(project.reactiveWebcam ?? true);
            setWebcamSettings(project.webcamSettings ?? { enabled: false, size: 0.22, shape: 'circle', position: 'bottom-right' });
            setTrimStart(project.trimStart ?? 0);
            setTrimEnd(project.trimEnd ?? project.duration);
            setViewMode('studio');
            setProjectRevision(revision => revision + 1);
            setNotice(`Opened ${file.name}`);
        } catch (error) { setNotice(error.message); }
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

    const isDark = theme !== 'light';

    return (
        <div className={`h-screen font-sans select-none flex flex-col overflow-hidden theme-${theme} ${isDark ? 'dark' : ''} bg-[var(--bg-app)] text-[var(--text-app)] transition-colors duration-200`}>
            {/* Offscreen media elements for Canvas pipeline - MUST NOT use display:none so Chromium decodes frames */}
            <video
                ref={recorderVideoRef}
                style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                muted
                playsInline
            />
            <video
                ref={studioVideoRef}
                style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                playsInline
            />

            {/* Top Navigation Bar */}
            <DesktopHeader
                viewMode={viewMode}
                setViewMode={setViewMode}
                platform={platform}
                hookStatus={hookStatus}
                onOpenHotkeys={() => setShowHotkeySettings(true)}
                onNewRecording={handleNewRecording}
                onOpenProject={() => projectInputRef.current?.click()}
                onSaveProject={saveProject}
                hasRecording={Boolean(recordedBlob)}
                recordingTime={timer}
                isRecording={isRecording}
                clickCount={clickCount}
                theme={theme}
                onSelectTheme={handleSelectTheme}
                isTeleprompterOpen={isTeleprompterOpen}
                onToggleTeleprompter={() => setIsTeleprompterOpen(prev => !prev)}
            />

            <input ref={projectInputRef} type="file" accept=".drift,video/*" onChange={openProject} className="hidden" />
            {notice && <div role="status" className="flex items-center justify-between px-5 py-2 text-sm border-b border-[var(--border-app)]">
                <span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification">Dismiss</button>
            </div>}
            {/* Main Stage */}
            <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
                {viewMode === 'recorder' ? (
                    /* ═══ CAPTURE COCKPIT ═══ */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto overflow-y-auto">
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
                            micStream={micStream}
                            onToggleMic={toggleMic}
                            audioDevices={audioDevices}
                            selectedMicId={selectedMicId}
                            onSelectMic={handleSelectMic}
                            webcamEnabled={webcamEnabled}
                            onToggleWebcam={toggleWebcam}
                            videoDevices={videoDevices}
                            selectedWebcamId={selectedWebcamId}
                            onSelectWebcam={handleSelectWebcam}
                            countdownSeconds={countdownSeconds}
                            onChangeCountdown={setCountdownSeconds}
                            autoMinimize={autoMinimize}
                            onToggleAutoMinimize={handleToggleAutoMinimize}
                            hotkey={(typeof hotkeys.toggle_recording === 'string' ? hotkeys.toggle_recording : 'Ctrl+X').replace('CmdOrCtrl', 'Ctrl')}
                            previewCanvas={
                                <canvas
                                    ref={recorderCanvasRef}
                                    width={1280}
                                    height={720}
                                    className="w-full h-full object-contain"
                                />
                            }
                            hasActiveStream={hasActiveStream || isRecording}
                            onStartPreview={handleStartPreview}
                            isNativeSupported={isNativeSupported}
                            webcamStream={engineRef.current?.webcamStream || null}
                        />
                    </div>
                ) : (
                    /* ═══ STUDIO MODE ═══ */
                    <div className="flex-1 flex min-h-0">
                        {/* Center Video Stage */}
                        <main className="flex-1 flex flex-col min-w-0 bg-black/10 relative">
                            <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                                {recordedBlob ? (
                                    <div
                                        className="relative max-w-full max-h-full overflow-hidden cursor-crosshair group bg-black select-none"
                                        style={{ aspectRatio: aspectRatio.replace(':', '/'), height: '100%', width: 'auto' }}
                                        onMouseDown={handleCanvasMouseDown}
                                        onMouseMove={handleCanvasMouseMove}
                                        onMouseUp={handleCanvasMouseUp}
                                        title="Click or drag a box to frame a zoom focus area"
                                    >
                                        <canvas
                                            ref={studioCanvasRef}
                                            width={1280}
                                            height={720}
                                            className="w-full h-full pointer-events-none"
                                        />

                                        {/* Live Glowing Drag-to-Zoom Selection Box */}
                                        {dragBox && (
                                            <div
                                                className="absolute pointer-events-none border-2 border-[var(--accent-app)] bg-[var(--accent-app)]/15 rounded-lg shadow-[0_0_15px_rgba(220,254,80,0.45)] z-30 transition-none"
                                                style={{
                                                    left: dragBox.left,
                                                    top: dragBox.top,
                                                    width: dragBox.width,
                                                    height: dragBox.height,
                                                }}
                                            >
                                                {/* Corner bracket accents */}
                                                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[var(--accent-app)]" />
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[var(--accent-app)]" />
                                                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[var(--accent-app)]" />
                                                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[var(--accent-app)]" />

                                                {/* Live Zoom Scale Badge */}
                                                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/90 text-[var(--accent-app)] border border-[var(--accent-app)]/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
                                                    <span>🔍 Focus Crop ({dragBox.previewScale}x)</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Canvas Hint */}
                                        <div className="absolute top-3 left-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-white border border-white/10">
                                            ✦ Drag a box or click to add a zoom focal point
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--text-app-muted)] gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-app)] flex items-center justify-center text-[var(--accent-app)] shadow-lg">
                                            <span className="text-2xl">🎬</span>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-[var(--text-app)]">No Recording Loaded</h3>
                                            <p className="text-xs text-[var(--text-app-muted)] mt-1 max-w-xs">
                                                Record your screen in Capture Cockpit or open an existing .drift project to start editing.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setViewMode('recorder')}
                                            className="px-4 py-2 rounded-xl bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                                        >
                                            Go to Capture Cockpit
                                        </button>
                                    </div>
                                )}
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
                                onAddFocusSegment={handleAddFocusSegment}
                                onSplitSegment={handleSplitSegment}
                                trimStart={trimStart}
                                onChangeTrimStart={(val) => {
                                    setTrimStart(val);
                                    if (studioRef.current) studioRef.current.trimStart = val;
                                }}
                                trimEnd={trimEnd}
                                onChangeTrimEnd={(val) => {
                                    setTrimEnd(val);
                                    if (studioRef.current) studioRef.current.trimEnd = val;
                                }}
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
                            onChangeZoomLevel={(level) => {
                                setZoomLevel(level);
                                if (studioRef.current) studioRef.current.setZoomLevel(level);
                            }}
                            showCursor={showCursor}
                            onToggleCursor={() => setShowCursor(prev => !prev)}
                            cursorTheme={cursorTheme}
                            onChangeCursorTheme={(theme) => {
                                setCursorTheme(theme);
                                if (studioRef.current) studioRef.current.setCursorTheme(theme);
                            }}
                            cursorScale={cursorScale}
                            onChangeCursorScale={(scale) => {
                                setCursorScale(scale);
                                if (studioRef.current) studioRef.current.setCursorScale(scale);
                            }}
                            splineSmoothing={splineSmoothing}
                            onToggleSplineSmoothing={(enabled) => {
                                setSplineSmoothing(enabled);
                                if (studioRef.current) studioRef.current.setSplineSmoothing(enabled);
                            }}
                            systemAudioVolume={systemAudioVolume}
                            onChangeSystemAudioVolume={(vol) => {
                                setSystemAudioVolume(vol);
                                if (studioRef.current) studioRef.current.setSystemAudioVolume(vol);
                            }}
                            micAudioVolume={micAudioVolume}
                            onChangeMicAudioVolume={(vol) => {
                                setMicAudioVolume(vol);
                                if (studioRef.current) studioRef.current.setMicAudioVolume(vol);
                            }}
                            isSystemAudioMuted={isSystemAudioMuted}
                            onToggleSystemAudioMute={(muted) => {
                                setIsSystemAudioMuted(muted);
                                if (studioRef.current) studioRef.current.setSystemAudioMuted(muted);
                            }}
                            isMicAudioMuted={isMicAudioMuted}
                            onToggleMicAudioMute={(muted) => {
                                setIsMicAudioMuted(muted);
                                if (studioRef.current) studioRef.current.setMicAudioMuted(muted);
                            }}
                            autoDuck={autoDuck}
                            onToggleAutoDuck={(duck) => {
                                setAutoDuck(duck);
                                if (studioRef.current) studioRef.current.setAutoDuck(duck);
                            }}
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
                            tiltAngle={tiltAngle}
                            onChangeTiltAngle={(angle) => {
                                setTiltAngle(angle);
                                if (studioRef.current) studioRef.current.setTiltAngle(angle);
                            }}
                            connectedZooms={connectedZooms}
                            onToggleConnectedZooms={(enabled) => {
                                setConnectedZooms(enabled);
                                if (studioRef.current) studioRef.current.setConnectedZooms(enabled);
                            }}
                            reactiveWebcam={reactiveWebcam}
                            onToggleReactiveWebcam={(enabled) => {
                                setReactiveWebcam(enabled);
                                if (studioRef.current) studioRef.current.setReactiveWebcam(enabled);
                            }}
                            insetPadding={insetPadding}
                            onChangeInsetPadding={(pad) => {
                                setInsetPadding(pad);
                                if (studioRef.current) studioRef.current.setInsetPadding(pad);
                            }}
                            borderRadius={borderRadius}
                            onChangeBorderRadius={(rad) => {
                                setBorderRadius(rad);
                                if (studioRef.current) studioRef.current.setBorderRadius(rad);
                            }}
                            windowChrome={windowChrome}
                            onToggleWindowChrome={(chrome) => {
                                setWindowChrome(chrome);
                                if (studioRef.current) studioRef.current.setWindowChrome(chrome);
                            }}
                            springProfile={springProfile}
                            onChangeSpringProfile={(profile) => {
                                setSpringProfile(profile);
                                if (studioRef.current) studioRef.current.setSpringProfile(profile);
                            }}
                            showKeystrokes={showKeystrokes}
                            onToggleKeystrokes={(enabled) => {
                                setShowKeystrokes(enabled);
                                if (studioRef.current) studioRef.current.setShowKeystrokes(enabled);
                            }}
                            autoZoomOnClicks={autoZoomOnClicks}
                            onToggleAutoZoomOnClicks={(val) => {
                                setAutoZoomOnClicks(val);
                                if (studioRef.current) {
                                    studioRef.current.setAutoZoomOnClicks(val).then(segs => {
                                        setFocusSegments([...(segs || [])]);
                                    });
                                }
                            }}
                            onResetToOverview={() => {
                                setAutoZoomOnClicks(false);
                                if (studioRef.current) {
                                    studioRef.current.resetToOverview();
                                    setFocusSegments([]);
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Presenter Teleprompter Notes (OpenScreen) */}
            <NotesTeleprompter
                isOpen={isTeleprompterOpen}
                onClose={() => setIsTeleprompterOpen(false)}
                isRecording={isRecording}
            />

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
                exportStage={exportStage}
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
