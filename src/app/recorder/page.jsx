'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { DriftEngine } from '@/lib/DriftEngine';
import { StudioEngine } from '@/lib/StudioEngine';
import drift from '@/lib/tauri-bridge';

// Luxury wallpapers matching Screen Studio aesthetic
const BACKGROUNDS = {
    bigSur: { name: 'Big Sur', colors: ['#ff6b9d', '#c44569', '#6c5ce7', '#0c3483'] },
    monterey: { name: 'Monterey', colors: ['#00b894', '#00cec9', '#0984e3', '#6c5ce7'] },
    ventura: { name: 'Ventura', colors: ['#e17055', '#d63031', '#fd79a8', '#a855f7'] },
    bloom: { name: 'Bloom', colors: ['#74b9ff', '#0984e3', '#6c5ce7', '#a855f7'] },
    sonoma: { name: 'Sonoma', colors: ['#fdcb6e', '#f39c12', '#e74c3c', '#9b59b6'] },
    midnight: { name: 'Midnight', colors: ['#2c3e50', '#1a1a2e', '#0a0a0f'] },
    cyberpunk: { name: 'Cyberpunk', colors: ['#ff007f', '#7928ca', '#0070f3', '#00dfd8'] },
    sunset: { name: 'Sunset', colors: ['#ff7e5f', '#feb47b', '#6a11cb'] },
    obsidian: { name: 'Obsidian', colors: ['#1f1f2e', '#111116', '#08080a'] },
    nordic: { name: 'Nordic Aurora', colors: ['#0575E6', '#00F260', '#001f3f'] },
    hyperDark: { name: 'Hyper Dark', colors: ['#18181f', '#0d0d12', '#050508'] },
    ocean: { name: 'Ocean Depth', colors: ['#00c6ff', '#0072ff', '#081735'] },
};

const ASPECT_RATIOS = [
    { id: '16:9', label: '16:9', desc: 'YouTube / Desktop 4K' },
    { id: '9:16', label: '9:16', desc: 'Shorts / TikTok / Reels' },
    { id: '1:1', label: '1:1', desc: 'Square / Social Feed' },
    { id: '4:3', label: '4:3', desc: 'Classic / iPad' },
    { id: '4:5', label: '4:5', desc: 'Portrait / Instagram' },
    { id: '21:9', label: '21:9', desc: 'Ultrawide Cinematic' },
];

export default function RecorderPage() {
    // --- Refs ---
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const engineRef = useRef(null);
    const studioRef = useRef(null);
    const toggleRecordRef = useRef(null);

    // --- State ---
    const [viewMode, setViewMode] = useState('recorder'); // 'recorder' | 'studio'

    // Platform detection
    const [platform, setPlatform] = useState('browser'); // 'tauri' | 'electron' | 'browser'
    const isDesktop = platform === 'tauri' || platform === 'electron';

    // Recorder State
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const [clickCount, setClickCount] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [loadingSources, setLoadingSources] = useState(true);
    const [micEnabled, setMicEnabled] = useState(false);
    const [sourceThumbnails, setSourceThumbnails] = useState({});

    // Studio State & Data
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedClicks, setRecordedClicks] = useState([]);
    const [recordedMoves, setRecordedMoves] = useState([]);
    const recordedDataRef = useRef({ blob: null, clicks: [], moves: [], dur: 0 });
    const recDurationRef = useRef(null);

    // Playback & Timeline State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioPeaks, setAudioPeaks] = useState(null);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [isLooping, setIsLooping] = useState(false);

    // Inspector Tabs
    const [inspectorTab, setInspectorTab] = useState('frame'); // 'frame' | 'bg' | 'camera' | 'cursor' | 'export'

    // Framing & Presentation Settings
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [padding, setPadding] = useState(0.14);
    const [borderRadius, setBorderRadius] = useState(16);
    const [shadowPreset, setShadowPreset] = useState('deep');
    const [titleBar, setTitleBar] = useState('macos');
    const [background, setBackground] = useState('bigSur');
    const [customBgColor, setCustomBgColor] = useState('#12121a');

    // Camera & Zoom Settings
    const [zoomLevel, setZoomLevel] = useState(1.8);

    // Cursor & FX Settings
    const [cursorMode, setCursorMode] = useState('smooth'); // 'smooth' | 'native' | 'none'
    const [showCursor, setShowCursor] = useState(true);
    const [cursorSize, setCursorSize] = useState(1.0);
    const [cursorStyle, setCursorStyle] = useState('macos');
    const [clickEffect, setClickEffect] = useState('ripple');
    const [clickSound, setClickSound] = useState('pop'); // 'pop' | 'mechanical' | 'none'

    // Export State & Settings
    const [exportFormat, setExportFormat] = useState('mp4');
    const [exportResolution, setExportResolution] = useState('1080p');
    const [exportFps, setExportFps] = useState(60);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportFrames, setExportFrames] = useState({ current: 0, total: 0 });
    const [exportEta, setExportEta] = useState(0);

    // Hotkey Settings
    const [hotkeys, setHotkeys] = useState({
        toggle_recording: 'CmdOrCtrl+Shift+R',
        stop_recording: 'CmdOrCtrl+Shift+S',
        toggle_pause: 'CmdOrCtrl+Shift+P',
        toggle_zoom: 'CmdOrCtrl+Shift+Z',
    });

    const [hookStatus, setHookStatus] = useState('Loading...');

    // --- PLATFORM DETECTION ---
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (drift.isTauri()) {
            setPlatform('tauri');
            setHookStatus('Active (Tauri v2 Native)');
            drift.getHotkeys().then(saved => {
                if (saved) setHotkeys(saved);
                drift.registerGlobalShortcuts(saved || hotkeys);
            }).catch(() => {
                drift.registerGlobalShortcuts(hotkeys);
            });
        } else if (window.electron) {
            setPlatform('electron');
            setHookStatus(window.electron.onGlobalClick ? 'Active' : 'Unavailable');
            if (window.electron.getHotkeys) {
                window.electron.getHotkeys().then(saved => {
                    if (saved) setHotkeys(saved);
                });
            }
        } else {
            setPlatform('browser');
            setHookStatus('Browser WebCodecs');
        }
    }, []);

    // --- LOAD NATIVE THUMBNAILS (Tauri only) ---
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
                console.warn('[Drift] Thumbnail capture failed for monitor ' + i + ':', e);
            }
        }
        setSourceThumbnails(thumbs);
    }, []);

    // --- INIT ENGINES ---
    useEffect(() => {
        if (viewMode === 'recorder') {
            engineRef.current = new DriftEngine(canvasRef.current, videoRef.current);
            engineRef.current.onclickCallback = (c) => setClickCount(c);
            engineRef.current.micEnabled = micEnabled;
            engineRef.current.onHotkeyStart = () => {
                if (toggleRecordRef.current) toggleRecordRef.current();
            };

            engineRef.current.onStopCallback = (blob, clicks, dur) => {
                if (engineRef.current.screenStream) {
                    engineRef.current.screenStream.getTracks().forEach(t => t.stop());
                }
                if (engineRef.current.micStream) {
                    engineRef.current.micStream.getTracks().forEach(t => t.stop());
                }
                const moves = engineRef.current.mouseMoves || [];
                recordedDataRef.current = { blob, clicks, moves, dur };
                setRecordedBlob(blob);
                setRecordedClicks(clicks);
                setRecordedMoves(moves);
                recDurationRef.current = dur;
                setViewMode('studio');
            };

            async function load() {
                setLoadingSources(true);
                const srcs = await engineRef.current.getSources();
                setSources(srcs);
                if (srcs.length > 0 && drift.isTauri()) {
                    await loadThumbnails(srcs);
                }
                setLoadingSources(false);
            }
            load();
        } else if (viewMode === 'studio') {
            if (engineRef.current) engineRef.current.stop();
            if (videoRef.current) videoRef.current.srcObject = null;

            const currentData = recordedDataRef.current.blob ? recordedDataRef.current : {
                blob: recordedBlob,
                clicks: recordedClicks,
                moves: recordedMoves,
                dur: recDurationRef.current
            };

            if (currentData.blob && canvasRef.current && videoRef.current) {
                setTimeout(() => {
                    studioRef.current = new StudioEngine(
                        canvasRef.current, videoRef.current,
                        currentData.blob, currentData.clicks, currentData.dur, currentData.moves
                    );
                    studioRef.current.cursorMode = cursorMode;
                    studioRef.current.aspectRatio = aspectRatio;
                    studioRef.current.padding = padding;
                    studioRef.current.borderRadius = borderRadius;
                    studioRef.current.shadowPreset = shadowPreset;
                    studioRef.current.titleBar = titleBar;
                    studioRef.current.background = background;
                    studioRef.current.customBgColor = customBgColor;
                    studioRef.current.showCursor = showCursor;
                    studioRef.current.cursorSize = cursorSize;
                    studioRef.current.cursorStyle = cursorStyle;
                    studioRef.current.clickEffect = clickEffect;
                    studioRef.current.setZoomLevel(zoomLevel);

                    if (videoRef.current) {
                        videoRef.current.ontimeupdate = () => {
                            if (videoRef.current) {
                                setCurrentTime(videoRef.current.currentTime);
                                setDuration(studioRef.current?.videoDuration || 0);

                                if (isLooping && trimEnd > 0 && videoRef.current.currentTime >= trimEnd) {
                                    videoRef.current.currentTime = trimStart || 0;
                                    studioRef.current.resetCamera();
                                }
                            }
                        };
                    }
                    setTimeout(() => {
                        if (studioRef.current) {
                            const d = recDurationRef.current || studioRef.current?.videoDuration || 10;
                            setDuration(d);
                            setTrimEnd(d);
                        }
                    }, 400);
                }, 100);
            }
        }
    }, [viewMode]);

    // Update settings in studioRef on change
    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.setAspectRatio(aspectRatio);
        }
    }, [aspectRatio]);

    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.padding = padding;
            studioRef.current.borderRadius = borderRadius;
            studioRef.current.shadowPreset = shadowPreset;
            studioRef.current.titleBar = titleBar;
            studioRef.current.drawFrame();
        }
    }, [padding, borderRadius, shadowPreset, titleBar]);

    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.background = background;
            studioRef.current.customBgColor = customBgColor;
            studioRef.current.drawFrame();
        }
    }, [background, customBgColor]);

    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.cursorMode = cursorMode;
            studioRef.current.showCursor = showCursor;
            studioRef.current.clickSoundEnabled = clickSound !== 'none';
            studioRef.current.clickSoundStyle = clickSound;
            studioRef.current.cursorSize = cursorSize;
            studioRef.current.cursorStyle = cursorStyle;
            studioRef.current.clickEffect = clickEffect;
            studioRef.current.drawFrame();
        }
    }, [showCursor, cursorSize, cursorStyle, clickEffect]);

    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.setZoomLevel(zoomLevel);
        }
    }, [zoomLevel]);

    // Spacebar to toggle playback in studio
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.code === 'Space' && viewMode === 'studio') {
                e.preventDefault();
                togglePlayback();
            } else if (e.code === 'ArrowLeft' && viewMode === 'studio') {
                e.preventDefault();
                skipTime(-5);
            } else if (e.code === 'ArrowRight' && viewMode === 'studio') {
                e.preventDefault();
                skipTime(5);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode]);


    // Compute audio waveform peaks from recorded blob
    useEffect(() => {
        if (!recordedBlob) {
            setAudioPeaks(null);
            return;
        }
        (async () => {
            try {
                const arrayBuffer = await recordedBlob.arrayBuffer();
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                const rawData = audioBuffer.getChannelData(0);
                const samples = 70; // 70 visual bars across the timeline
                const blockSize = Math.floor(rawData.length / samples);
                const peaks = [];
                for (let i = 0; i < samples; i++) {
                    let sum = 0;
                    for (let j = 0; j < blockSize; j++) {
                        sum += Math.abs(rawData[i * blockSize + j] || 0);
                    }
                    peaks.push(Math.min(1.0, (sum / blockSize) * 4.5));
                }
                setAudioPeaks(peaks);
            } catch (err) {
                // If no audio track exists, silent fallback
                setAudioPeaks(null);
            }
        })();
    }, [recordedBlob]);

    // --- ACTIONS ---
    const selectSource = async (id) => {
        if (platform === 'tauri') {
            const ok = await engineRef.current.selectSourceBrowser();
            if (ok) setSelectedSource(id);
        } else if (platform === 'electron') {
            const ok = await engineRef.current.selectSource(id, micEnabled);
            if (ok) setSelectedSource(id);
        }
    };

    const selectBrowserSource = async () => {
        const ok = await engineRef.current.selectSourceBrowser();
        if (ok) setSelectedSource('browser-source');
    };

    const toggleMic = () => setMicEnabled(!micEnabled);

    const startRecordingActual = async () => {
        try {
            setClickCount(0);
            await engineRef.current.startRecording((s) => {
                const m = Math.floor(s / 60).toString().padStart(2, '0');
                const sec = Math.floor(s % 60).toString().padStart(2, '0');
                setTimer(`${m}:${sec}`);
            });
            setIsRecording(true);
        } catch (e) {
            console.error('[Drift] Start recording failed:', e);
        }
    };

    const toggleRecord = async () => {
        if (isRecording) {
            engineRef.current.stopRecording();
            setIsRecording(false);
        } else {
            if (!selectedSource || (platform !== 'electron' && !window.electron)) {
                if (!engineRef.current?.screenStream?.active) {
                    const ok = await engineRef.current.selectSourceBrowser();
                    if (!ok) return;
                    setSelectedSource('browser-source');
                }
            }

            // 3-second OpenScreen countdown overlay
            setCountdown(3);
            let count = 3;
            const countInterval = setInterval(() => {
                count -= 1;
                if (count > 0) {
                    setCountdown(count);
                } else {
                    clearInterval(countInterval);
                    setCountdown(0);
                    startRecordingActual();
                }
            }, 800);
        }
    };

    useEffect(() => { toggleRecordRef.current = toggleRecord; }, [toggleRecord]);

    const togglePlayback = () => {
        if (!studioRef.current || !videoRef.current) return;
        if (videoRef.current.paused) {
            studioRef.current.play();
            setIsPlaying(true);
        } else {
            studioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const skipTime = (delta) => {
        if (!videoRef.current || !duration) return;
        const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
        videoRef.current.currentTime = target;
        studioRef.current?.resetCamera();
    };

    const handleSpeedChange = (speed) => {
        setPlaybackSpeed(speed);
        if (studioRef.current) studioRef.current.setSpeed(speed);
    };

    const seekTo = (e) => {
        if (!studioRef.current || !videoRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = Math.max(0, Math.min(duration, pct * duration));
        studioRef.current.resetCamera();
    };

    const addManualZoom = () => {
        if (!studioRef.current || !videoRef.current) return;
        const ct = videoRef.current.currentTime;
        studioRef.current.addZoom(ct, 0.5, 0.5, zoomLevel);
        setRecordedClicks(prev => [...prev, { time: ct * 1000, x: 0.5, y: 0.5, scale: zoomLevel }]);
    };

    const handleCanvasClick = (e) => {
        if (viewMode !== 'studio' || !studioRef.current || !videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / rect.width;
        const canvasY = (e.clientY - rect.top) / rect.height;
        const ct = videoRef.current.currentTime;
        const { x, y } = studioRef.current.resolveClick(canvasX, canvasY);
        studioRef.current.addZoom(ct, x, y, zoomLevel);
        setRecordedClicks(prev => [...prev, { time: ct * 1000, x, y, scale: zoomLevel }]);
    };

    const clearManualZooms = () => {
        if (!studioRef.current) return;
        studioRef.current.clicks = [];
        studioRef.current.zoomSegments = [];
        setRecordedClicks([]);
        studioRef.current.resetCamera();
    };

    const setTrimStartPoint = () => { setTrimStart(currentTime); if (trimEnd <= currentTime) setTrimEnd(duration); };
    const setTrimEndPoint = () => { setTrimEnd(currentTime); if (trimStart >= currentTime) setTrimStart(0); };
    const resetTrim = () => { setTrimStart(0); setTrimEnd(duration); };

    // --- PRODUCTION EXPORT ---
    const handleExport = async () => {
        if (!studioRef.current) return;
        setIsExporting(true);
        setExportProgress(0);
        setExportFrames({ current: 0, total: 0 });
        setExportEta(0);

        try {
            studioRef.current.trimStart = trimStart;
            studioRef.current.trimEnd = trimEnd;

            let exportWidth = 1920;
            let exportHeight = 1080;

            if (exportResolution === '4k') {
                exportWidth = aspectRatio === '9:16' ? 2160 : 3840;
                exportHeight = aspectRatio === '9:16' ? 3840 : 2160;
            } else if (exportResolution === '1440p') {
                exportWidth = aspectRatio === '9:16' ? 1440 : 2560;
                exportHeight = aspectRatio === '9:16' ? 2560 : 1440;
            } else if (exportResolution === '720p') {
                exportWidth = aspectRatio === '9:16' ? 720 : 1280;
                exportHeight = aspectRatio === '9:16' ? 1280 : 720;
            }

            const videoBlob = await studioRef.current.exportVideo({
                width: exportWidth,
                height: exportHeight,
                fps: exportFps,
                format: exportFormat,
            }, ({ progress, frameIndex, totalFrames, etaSeconds }) => {
                setExportProgress(Math.round(Math.min(Math.max(progress || 0, 0), 1) * 94));
                setExportFrames({ current: frameIndex, total: totalFrames });
                if (etaSeconds !== undefined) setExportEta(etaSeconds);
            });

            const isMP4 = videoBlob.type === 'video/mp4';
            const ext = isMP4 ? 'mp4' : 'webm';

            if (platform === 'tauri') {
                try {
                    const savePath = await drift.showSaveDialog({
                        defaultPath: `drift-studio-${Date.now()}.${ext}`,
                        filters: [{ name: isMP4 ? 'MP4 Video (4K Hardware Accelerated)' : 'WebM Video', extensions: [ext] }],
                    });

                    if (savePath) {
                        setExportProgress(98);
                        const fileBytes = new Uint8Array(await videoBlob.arrayBuffer());
                        await drift.saveFile(savePath, fileBytes);
                        setExportProgress(100);
                        console.log(`[Export] Successfully saved to: ${savePath}`);
                    } else {
                        triggerBlobDownload(videoBlob, ext);
                    }
                } catch (e) {
                    console.error('[Export] Save dialog failed, fallback to download:', e);
                    triggerBlobDownload(videoBlob, ext);
                }
            } else {
                triggerBlobDownload(videoBlob, ext);
            }
        } catch (error) {
            console.error('Export failed:', error);
        }

        setIsExporting(false);
        setExportProgress(0);
    };

    const triggerBlobDownload = (blob, ext) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `drift-studio-${Date.now()}.${ext}`;
        a.click();
    };


    const loadSampleDemoStudio = async () => {
        try {
            // Generate synthetic 5-second demo video canvas
            const demoCanvas = document.createElement('canvas');
            demoCanvas.width = 1920;
            demoCanvas.height = 1080;
            const ctx = demoCanvas.getContext('2d');
            
            // Draw a high-tech demo interface
            ctx.fillStyle = '#0c0c14';
            ctx.fillRect(0, 0, 1920, 1080);
            ctx.fillStyle = '#181824';
            ctx.roundRect(80, 80, 1760, 920, 24);
            ctx.fill();
            
            // Header
            ctx.fillStyle = '#DCFE50';
            ctx.font = 'bold 36px sans-serif';
            ctx.fillText('Drift Cinema Studio — Interactive Demo', 140, 160);
            
            // Cards
            ctx.fillStyle = '#222234';
            ctx.roundRect(140, 220, 500, 320, 16);
            ctx.fill();
            ctx.roundRect(680, 220, 500, 320, 16);
            ctx.fill();
            ctx.roundRect(1220, 220, 500, 320, 16);
            ctx.fill();

            const stream = demoCanvas.captureStream(30);
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];
            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const sampleClicks = [
                    { x: 0.2, y: 0.3, time: 1.2, duration: 1.8 },
                    { x: 0.5, y: 0.4, time: 2.8, duration: 1.6 },
                    { x: 0.8, y: 0.3, time: 4.2, duration: 1.5 },
                ];
                const sampleMoves = [];
                for (let i = 0; i < 50; i++) {
                    const t = i / 10;
                    sampleMoves.push({ x: 0.2 + (i / 50) * 0.6, y: 0.3 + Math.sin(i / 5) * 0.1, time: t });
                }
                recordedDataRef.current = { blob, clicks: sampleClicks, moves: sampleMoves, dur: 5.0 };
                setRecordedBlob(blob);
                setRecordedClicks(sampleClicks);
                setRecordedMoves(sampleMoves);
                recDurationRef.current = 5.0;
                setViewMode('studio');
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 500);
        } catch (e) {
            console.error('Demo studio loader failed:', e);
        }
    };

    const formatTime = (seconds) => {
        if (!isFinite(seconds) || isNaN(seconds)) return '00:00';
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        const ms = Math.floor((seconds % 1) * 100).toString().padStart(2, '0');
        return `${m}:${s}.${ms}`;
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-[#07070a] text-white select-none overflow-hidden font-sans">
            <video ref={videoRef} className="hidden" playsInline />

            {/* ═══ TOP NAVBAR (Glassmorphic Header) ═══ */}
            <header className="h-12 border-b border-white/[0.06] bg-[#0c0c13]/90 backdrop-blur-xl flex items-center justify-between px-4 z-30 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#DCFE50] to-[#80c000] flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(220,254,80,0.35)]">
                            D
                        </div>
                        <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            DRIFT <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-[#DCFE50] ml-1">STUDIO 2.0</span>
                        </span>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="text-[10px] text-gray-400 font-medium">{hookStatus}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    
                    <button
                        onClick={loadSampleDemoStudio}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-300 hover:text-white text-[11px] font-bold border border-purple-500/30 transition-all flex items-center gap-1.5"
                    >
                        <span>🎬</span> Try Studio Demo
                    </button>

                    {viewMode === 'studio' && (
                        <button
                            onClick={() => {
                                setRecordedBlob(null);
                                setRecordedClicks([]);
                                setRecordedMoves([]);
                                setViewMode('recorder');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-[11px] font-semibold border border-white/[0.06] transition-all flex items-center gap-1.5"
                        >
                            <span>↺</span> New Recording
                        </button>
                    )}

                    {viewMode === 'studio' && (
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="px-4 py-1.5 rounded-lg bg-[#DCFE50] hover:bg-[#c9e845] text-black text-[11px] font-extrabold shadow-[0_0_20px_rgba(220,254,80,0.3)] transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                            <span>⚡</span> {isExporting ? `Rendering (${exportProgress}%)` : `Export ${exportResolution.toUpperCase()} MP4`}
                        </button>
                    )}
                </div>
            </header>

            {/* ═══ MAIN WORKSPACE ═══ */}
            <div className="flex-1 flex overflow-hidden">

                {/* ─── RECORDER LEFT PANEL (Source & Audio Setup) ─── */}
                {viewMode === 'recorder' && (
                    <aside className="w-72 border-r border-white/[0.06] bg-[#0c0c14] p-4 flex flex-col gap-3.5 overflow-y-auto flex-shrink-0">
                        {/* Monitor Sources */}
                        <Section title="Capture Screen" icon="🖥">
                            {loadingSources ? (
                                <div className="text-[11px] text-gray-500 py-3 text-center">Scanning displays...</div>
                            ) : sources.length === 0 ? (
                                <div className="text-[10px] text-gray-400 py-2">
                                    <button onClick={selectBrowserSource} className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-[10px] font-medium border border-white/10 transition-all">
                                        Choose Screen / Window
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                                    {sources.map(src => (
                                        <button
                                            key={src.id}
                                            onClick={() => selectSource(src.id)}
                                            className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-all border ${
                                                selectedSource === src.id
                                                    ? 'bg-[#DCFE50]/10 border-[#DCFE50]/40 text-white shadow-[0_0_12px_rgba(220,254,80,0.1)]'
                                                    : 'bg-white/[0.02] border-white/[0.04] text-gray-400 hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            {sourceThumbnails[src.id] ? (
                                                <img src={sourceThumbnails[src.id]} alt="preview" className="w-14 h-9 rounded-lg object-cover border border-white/10 shadow-sm" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-sm">🖥</div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[11px] font-bold truncate text-gray-200">{src.name}</div>
                                                <div className="text-[9px] text-gray-500">{src.display_type || 'Display'}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* Audio Setup */}
                        <Section title="Audio Pipeline" icon="🎙">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[11px] font-semibold text-gray-200">Microphone Audio</div>
                                    <div className="text-[9px] text-gray-500">Auto-mixed with desktop audio</div>
                                </div>
                                <button
                                    onClick={toggleMic}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                                        micEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-gray-500 border border-white/10'
                                    }`}
                                >
                                    {micEnabled ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </Section>

                        {/* Record Trigger */}
                        <div className="mt-auto pt-2 space-y-2">
                            <button
                                onClick={toggleRecord}
                                className={`w-full py-3.5 rounded-xl font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
                                    isRecording
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 animate-pulse'
                                        : 'bg-[#DCFE50] hover:bg-[#c9e845] text-black shadow-[#DCFE50]/25 hover:scale-[1.01]'
                                }`}
                            >
                                <span className="text-base">{isRecording ? '■' : '●'}</span>
                                {isRecording ? `STOP RECORDING (${timer})` : 'START RECORDING'}
                            </button>

                            {isDesktop && !isRecording && (
                                <div className="text-center">
                                    <kbd className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-gray-400">
                                        Ctrl + Shift + R
                                    </kbd>
                                </div>
                            )}
                        </div>
                    </aside>
                )}

                {/* ─── CENTER: WYSIWYG CANVAS WORKSPACE ─── */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#060609]">
                    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                        <div className={`relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all ${
                            aspectRatio === '9:16' ? 'aspect-[9/16] h-full max-h-[760px]' :
                            aspectRatio === '1:1' ? 'aspect-square h-full max-h-[660px]' :
                            aspectRatio === '4:3' ? 'aspect-[4/3] w-full max-w-4xl' :
                            aspectRatio === '4:5' ? 'aspect-[4/5] h-full max-h-[720px]' :
                            aspectRatio === '21:9' ? 'aspect-[21/9] w-full max-w-5xl' :
                            'aspect-video w-full max-w-5xl'
                        }`}>
                            <canvas
                                ref={canvasRef}
                                width={1920}
                                height={1080}
                                onClick={handleCanvasClick}
                                className={`w-full h-full object-contain ${isRecording ? 'cursor-none' : viewMode === 'studio' ? 'cursor-crosshair' : ''}`}
                            />

                            {/* Recorder Overlay State */}
                            {viewMode === 'recorder' && !selectedSource && !isRecording && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-md">
                                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-3xl mb-3 shadow-inner">
                                        🖥
                                    </div>
                                    <p className="text-gray-200 text-sm font-bold mb-1">
                                        Drift Screen Studio
                                    </p>
                                    <p className="text-gray-500 text-xs max-w-sm text-center mb-4 leading-relaxed">
                                        Select a display from the left panel or press Start Recording to capture with 60fps cinema auto-zoom.
                                    </p>
                                    <button
                                        onClick={toggleRecord}
                                        className="px-5 py-2.5 bg-[#DCFE50] text-black text-xs font-extrabold rounded-xl shadow-[0_0_20px_rgba(220,254,80,0.3)] hover:bg-[#c9e845] transition-all"
                                    >
                                        ● Start Recording
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── BOTTOM MULTI-TRACK PRO TIMELINE (Studio Mode) ─── */}
                    {viewMode === 'studio' && (
                        <div className="border-t border-white/[0.08] bg-[#0b0b12] px-6 py-3 flex-shrink-0 z-20">
                            {/* Track Container */}
                            <div
                                className="h-9 bg-[#12121e] rounded-xl relative cursor-pointer mb-2.5 overflow-hidden border border-white/[0.06] shadow-inner"
                                onClick={seekTo}
                            >
                                {/* Trim Region Highlight */}
                                <div
                                    className="absolute top-0 h-full bg-[#DCFE50]/15 border-l-2 border-r-2 border-[#DCFE50] shadow-[0_0_15px_rgba(220,254,80,0.15)]"
                                    style={{
                                        left: `${(trimStart / (duration || 1)) * 100}%`,
                                        width: `${(((trimEnd || duration) - trimStart) / (duration || 1)) * 100}%`
                                    }}
                                />

                                {/* Playhead Progress */}
                                <div
                                    className="absolute top-0 h-full bg-white/[0.06] border-r-2 border-white shadow-[0_0_10px_white]"
                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                />

                                {/* Click Event Pins */}
                                {recordedClicks.map((click, i) => (
                                    <div
                                        key={i}
                                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#DCFE50] rounded-full border border-black z-10 shadow-[0_0_8px_rgba(220,254,80,0.7)] -translate-x-1/2"
                                        style={{ left: `${(click.time / 1000 / (duration || 1)) * 100}%` }}
                                        title={`Zoom @ ${(click.time / 1000).toFixed(1)}s`}
                                    />
                                ))}
                            </div>

                            {/* Controls Bar */}
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5">
                                    <button
                                        onClick={togglePlayback}
                                        className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/15 flex items-center justify-center transition-all border border-white/10 text-white"
                                        title="Play / Pause (Space)"
                                    >
                                        {isPlaying ? (
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M5 3l14 9-14 9V3z" />
                                            </svg>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => skipTime(-5)}
                                        className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white flex items-center justify-center text-[10px] font-bold"
                                        title="Skip -5s (Left Arrow)"
                                    >
                                        -5s
                                    </button>
                                    <button
                                        onClick={() => skipTime(5)}
                                        className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white flex items-center justify-center text-[10px] font-bold"
                                        title="Skip +5s (Right Arrow)"
                                    >
                                        +5s
                                    </button>

                                    <div className="font-mono text-gray-400 text-[11px] bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5">
                                        <span className="text-white font-bold">{formatTime(currentTime)}</span> / {formatTime(duration)}
                                    </div>

                                    {/* Playback Speed */}
                                    <div className="flex items-center bg-white/[0.03] rounded-lg p-0.5 border border-white/5">
                                        {[0.5, 1.0, 1.5, 2.0].map(s => (
                                            <button
                                                key={s} onClick={() => handleSpeedChange(s)}
                                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                                                    playbackSpeed === s ? 'bg-[#DCFE50] text-black' : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={addManualZoom}
                                        className="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-all text-[11px] font-bold"
                                    >
                                        + Add Zoom
                                    </button>
                                    {recordedClicks.length > 0 && (
                                        <button
                                            onClick={clearManualZooms}
                                            className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-[11px]"
                                        >
                                            Clear Zooms
                                        </button>
                                    )}

                                    <span className="w-px h-4 bg-white/10 mx-1" />

                                    <button onClick={setTrimStartPoint} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] text-[10px] font-semibold">◀ Set In</button>
                                    <button onClick={setTrimEndPoint} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] text-[10px] font-semibold">Set Out ▶</button>
                                    <button onClick={resetTrim} className="text-gray-500 hover:text-white text-[10px] ml-1">Reset</button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* ─── STUDIO RIGHT INSPECTOR PANEL (Screen Studio Style) ─── */}
                {viewMode === 'studio' && (
                    <aside className="w-80 border-l border-white/[0.08] bg-[#0c0c14] flex flex-col overflow-hidden flex-shrink-0 z-30">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-white/[0.06] bg-[#0f0f18] p-1.5 gap-1">
                            {[
                                { id: 'frame', label: 'Frame' },
                                { id: 'bg', label: 'Canvas' },
                                { id: 'camera', label: 'Zoom' },
                                { id: 'cursor', label: 'Cursor' },
                                { id: 'export', label: 'Export' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setInspectorTab(tab.id)}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                        inspectorTab === tab.id
                                            ? 'bg-white/10 text-[#DCFE50] shadow-sm'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Inspector Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* TAB 1: FRAME & ASPECT RATIO */}
                            {inspectorTab === 'frame' && (
                                <>
                                    <Section title="Aspect Ratio" icon="📐">
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {ASPECT_RATIOS.map(ar => (
                                                <button
                                                    key={ar.id}
                                                    onClick={() => setAspectRatio(ar.id)}
                                                    className={`py-2 rounded-xl border text-center transition-all ${
                                                        aspectRatio === ar.id
                                                            ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] font-bold shadow-[0_0_12px_rgba(220,254,80,0.15)]'
                                                            : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05]'
                                                    }`}
                                                >
                                                    <div className="text-[11px] font-bold">{ar.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title="Window Framing" icon="🖼">
                                        <div className="space-y-3.5">
                                            <div>
                                                <div className="flex justify-between text-[10px] mb-1.5">
                                                    <span className="text-gray-400">Canvas Padding</span>
                                                    <span className="font-mono text-[#DCFE50] font-bold">{Math.round(padding * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="0.30" step="0.01"
                                                    value={padding} onChange={e => setPadding(parseFloat(e.target.value))}
                                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#DCFE50]"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-[10px] mb-1.5">
                                                    <span className="text-gray-400">Corner Squircle Radius</span>
                                                    <span className="font-mono text-[#DCFE50] font-bold">{borderRadius}px</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="32" step="1"
                                                    value={borderRadius} onChange={e => setBorderRadius(parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#DCFE50]"
                                                />
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-gray-400 block mb-1.5">Studio Drop Shadow</span>
                                                <div className="grid grid-cols-4 gap-1">
                                                    {['deep', 'soft', 'crisp', 'glow'].map(s => (
                                                        <button
                                                            key={s} onClick={() => setShadowPreset(s)}
                                                            className={`py-1.5 rounded-lg text-[9px] uppercase font-bold border transition-all ${
                                                                shadowPreset === s
                                                                    ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50]'
                                                                    : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                                                            }`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-gray-400 block mb-1.5">Window Header</span>
                                                <div className="grid grid-cols-3 gap-1">
                                                    {[['macos', 'macOS'], ['windows', 'Windows'], ['none', 'None']].map(([id, label]) => (
                                                        <button
                                                            key={id} onClick={() => setTitleBar(id)}
                                                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                                                titleBar === id
                                                                    ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50]'
                                                                    : 'bg-white/[0.02] border-white/5 text-gray-500'
                                                            }`}
                                                        >
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Section>
                                </>
                            )}

                            {/* TAB 2: BACKGROUNDS */}
                            {inspectorTab === 'bg' && (
                                <>
                                    <Section title="Ambient Backdrop" icon="✨">
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <button
                                                onClick={() => setBackground('blur')}
                                                className={`p-2.5 rounded-xl border text-center transition-all ${
                                                    background === 'blur'
                                                        ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] font-bold'
                                                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05]'
                                                }`}
                                            >
                                                <div className="text-[11px] font-bold">Video Blur</div>
                                                <div className="text-[8px] text-gray-500">Screen Studio look</div>
                                            </button>
                                            <button
                                                onClick={() => setBackground('solid')}
                                                className={`p-2.5 rounded-xl border text-center transition-all ${
                                                    background === 'solid'
                                                        ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] font-bold'
                                                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05]'
                                                }`}
                                            >
                                                <div className="text-[11px] font-bold">Solid Dark</div>
                                                <div className="text-[8px] text-gray-500">Minimal matte</div>
                                            </button>
                                        </div>
                                    </Section>

                                    <Section title="Luxury Wallpapers" icon="🎨">
                                        <div className="grid grid-cols-3 gap-1.5 max-h-64 overflow-y-auto pr-1">
                                            {Object.entries(BACKGROUNDS).map(([key, val]) => (
                                                <button
                                                    key={key} onClick={() => setBackground(key)}
                                                    className={`rounded-xl border-2 overflow-hidden transition-all shadow-sm ${
                                                        background === key ? 'border-[#DCFE50] scale-[1.02]' : 'border-transparent hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="w-full h-8" style={{ background: `linear-gradient(135deg, ${val.colors.join(', ')})` }} />
                                                    <div className="text-[8px] text-gray-300 py-1 bg-[#141420] text-center font-medium truncate px-1">{val.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </Section>
                                </>
                            )}

                            {/* TAB 3: ZOOM & CAMERA */}
                            {inspectorTab === 'camera' && (
                                <Section title="Cinema Auto-Zoom" icon="🔍">
                                    <div className="space-y-3.5">
                                        <div>
                                            <div className="flex justify-between text-[10px] mb-1.5">
                                                <span className="text-gray-400">Magnification</span>
                                                <span className="font-mono text-[#DCFE50] font-bold">{zoomLevel.toFixed(1)}x</span>
                                            </div>
                                            <input
                                                type="range" min="1.2" max="2.8" step="0.1"
                                                value={zoomLevel} onChange={e => setZoomLevel(parseFloat(e.target.value))}
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#DCFE50]"
                                            />
                                        </div>

                                        <div className="pt-2 border-t border-white/5 space-y-2">
                                            <div className="text-[10px] text-gray-400 font-semibold">Active Zoom Targets</div>
                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                                <div>
                                                    <span className="text-base font-black text-white">{recordedClicks.length}</span>
                                                    <span className="text-[10px] text-gray-400 ml-2">focal points</span>
                                                </div>
                                                <span className="text-[9px] text-[#DCFE50] font-mono bg-[#DCFE50]/10 px-2 py-0.5 rounded">60 FPS Spring</span>
                                            </div>
                                        </div>
                                    </div>
                                </Section>
                            )}

                            {/* TAB 4: CURSOR & EFFECTS */}
                            {inspectorTab === 'cursor' && (
                                <Section title="Cursor & Double-Cursor Fix" icon="🖱">
                                    <div className="space-y-3.5">
                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1.5">Cursor Mode</span>
                                            <div className="grid grid-cols-3 gap-1">
                                                {[
                                                    ['smooth', '✨ Smooth Pro'],
                                                    ['native', '🖥 Native Video'],
                                                    ['none', '🚫 Hide'],
                                                ].map(([mode, label]) => (
                                                    <button
                                                        key={mode} onClick={() => setCursorMode(mode)}
                                                        className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all ${
                                                            cursorMode === mode
                                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] shadow-sm'
                                                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-gray-500 mt-1">
                                                {cursorMode === 'smooth' && 'Smoothed macOS pointer overlay with ripple effects.'}
                                                {cursorMode === 'native' && 'Shows video cursor only — eliminates double cursor!'}
                                                {cursorMode === 'none' && 'Hides all cursor overlays.'}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-[10px] mb-1.5">
                                                <span className="text-gray-400">Cursor Scale</span>
                                                <span className="font-mono text-[#DCFE50] font-bold">{cursorSize.toFixed(1)}x</span>
                                            </div>
                                            <input
                                                type="range" min="0.6" max="2.4" step="0.1"
                                                value={cursorSize} onChange={e => setCursorSize(parseFloat(e.target.value))}
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#DCFE50]"
                                            />
                                        </div>

                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1.5">Pointer Style</span>
                                            <div className="grid grid-cols-4 gap-1">
                                                {[['macos', 'macOS'], ['light', 'Light'], ['dot', 'Dot'], ['glow', 'Glow']].map(([id, label]) => (
                                                    <button
                                                        key={id} onClick={() => setCursorStyle(id)}
                                                        className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all ${
                                                            cursorStyle === id
                                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50]'
                                                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>


                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1.5">Tactile Click Sound (ASMR)</span>
                                            <div className="grid grid-cols-3 gap-1">
                                                {[
                                                    ['pop', '🫧 Soft Pop'],
                                                    ['mechanical', '⌨️ Mechanical'],
                                                    ['none', '🚫 Mute'],
                                                ].map(([sound, label]) => (
                                                    <button
                                                        key={sound} onClick={() => {
                                                            setClickSound(sound);
                                                            if (studioRef.current) {
                                                                studioRef.current.clickSoundEnabled = sound !== 'none';
                                                                studioRef.current.clickSoundStyle = sound;
                                                                if (sound !== 'none') studioRef.current.playClickSound(sound);
                                                            }
                                                        }}
                                                        className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all ${
                                                            clickSound === sound
                                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] shadow-sm'
                                                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-gray-500 mt-1">
                                                Synthesizes realistic tactile feedback on clicks during preview and export.
                                            </p>
                                        </div>

                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1.5">Click Ripple FX</span>
                                            <div className="grid grid-cols-4 gap-1">
                                                {['ripple', 'pulse', 'ring', 'none'].map(fx => (
                                                    <button
                                                        key={fx} onClick={() => setClickEffect(fx)}
                                                        className={`py-1.5 rounded-lg text-[9px] uppercase font-bold border transition-all ${
                                                            clickEffect === fx
                                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50]'
                                                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                                                        }`}
                                                    >
                                                        {fx}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Section>
                            )}

                            {/* TAB 5: EXPORT STUDIO */}
                            {inspectorTab === 'export' && (
                                <Section title="Hardware Export" icon="⚡">
                                    <div className="space-y-3.5">
                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1">Resolution</span>
                                            <div className="grid grid-cols-3 gap-1">
                                                {['4k', '1440p', '1080p'].map(res => (
                                                    <button
                                                        key={res} onClick={() => setExportResolution(res)}
                                                        className={`py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                                                            exportResolution === res
                                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50] shadow-sm'
                                                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                                                        }`}
                                                    >
                                                        {res}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[10px] text-gray-400 block mb-1">Framerate</span>
                                            <div className="grid grid-cols-2 gap-1">
                                                {[60, 30].map(fps => (
                                                    <button
                                                        key={fps} onClick={() => setExportFps(fps)}
                                                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                                                            exportFps === fps
                                                                ? 'bg-[#DCFE50]/15 border-[#DCFE50] text-[#DCFE50]'
                                                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                                                        }`}
                                                    >
                                                        {fps} FPS {fps === 60 && '🔥'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                onClick={handleExport}
                                                disabled={isExporting}
                                                className="w-full py-3 rounded-xl bg-[#DCFE50] hover:bg-[#c9e845] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(220,254,80,0.3)] transition-all flex items-center justify-center gap-2"
                                            >
                                                <span>⚡</span> Render & Export Video
                                            </button>
                                        </div>
                                    </div>
                                </Section>
                            )}
                        </div>
                    </aside>
                )}

            </div>

            
            {/* ═══ 3-2-1 OPENSCREEN COUNTDOWN OVERLAY ═══ */}
            {countdown > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="flex flex-col items-center">
                        <div className="text-9xl font-black text-[#DCFE50] tracking-tighter drop-shadow-[0_0_40px_rgba(220,254,80,0.6)] animate-pulse">
                            {countdown}
                        </div>
                        <div className="text-sm font-bold text-gray-300 mt-4 tracking-widest uppercase">
                            Recording Starting...
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ EXPORT PROGRESS MODAL ═══ */}
            {isExporting && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12121e] p-6 rounded-3xl border border-white/10 text-center max-w-sm w-full shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#DCFE50]/10 border border-[#DCFE50]/30 flex items-center justify-center text-2xl mx-auto text-[#DCFE50] shadow-[0_0_20px_rgba(220,254,80,0.2)]">
                            ⚡
                        </div>
                        <div>
                            <h2 className="text-base font-black text-white">Rendering {exportResolution.toUpperCase()} MP4</h2>
                            <p className="text-gray-400 text-xs mt-1">Applying WebCodecs hardware camera & cursor physics</p>
                        </div>

                        <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden p-0.5 border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-[#DCFE50] to-[#80c000] transition-all rounded-full shadow-[0_0_12px_rgba(220,254,80,0.5)]"
                                style={{ width: `${exportProgress}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                            <span>{exportFrames.total > 0 ? `Frame ${exportFrames.current} / ${exportFrames.total}` : 'Encoding...'}</span>
                            <span className="text-[#DCFE50] font-bold">{exportProgress}%</span>
                        </div>
                        {exportEta > 0 && (
                            <div className="text-[10px] text-gray-500 font-mono">
                                Approx. {exportEta}s remaining
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="rounded-2xl border border-white/[0.06] bg-[#11111c] p-3.5 space-y-2.5 shadow-sm">
            {title && (
                <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
                    {icon && <span className="text-xs">{icon}</span>}
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-300">{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
}
