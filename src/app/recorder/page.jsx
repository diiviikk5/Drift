'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { DriftEngine } from '@/lib/DriftEngine';
import { StudioEngine } from '@/lib/StudioEngine';
import drift from '@/lib/tauri-bridge';

// macOS-style gradient backgrounds
const BACKGROUNDS = {
    bigSur: { name: 'Big Sur', colors: ['#ff6b9d', '#c44569', '#6c5ce7', '#0c3483'] },
    monterey: { name: 'Monterey', colors: ['#00b894', '#00cec9', '#0984e3', '#6c5ce7'] },
    ventura: { name: 'Ventura', colors: ['#e17055', '#d63031', '#fd79a8', '#a855f7'] },
    bloom: { name: 'Bloom', colors: ['#74b9ff', '#0984e3', '#6c5ce7', '#a855f7'] },
    sonoma: { name: 'Sonoma', colors: ['#fdcb6e', '#f39c12', '#e74c3c', '#9b59b6'] },
    midnight: { name: 'Midnight', colors: ['#2c3e50', '#1a1a2e', '#0a0a0f'] }
};

const START_POSITIONS = {
    center: { name: 'Center', x: 0.5, y: 0.5 },
    'top-left': { name: 'Top Left', x: 0.25, y: 0.25 },
    'top-right': { name: 'Top Right', x: 0.75, y: 0.25 },
    none: { name: 'None', x: 0.5, y: 0.5, noZoom: true }
};

export default function RecorderPage() {
    // --- Refs ---
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const engineRef = useRef(null);
    const studioRef = useRef(null);
    const toggleRecordRef = useRef(null);

    // --- State ---
    const [viewMode, setViewMode] = useState('recorder');

    // Platform detection
    const [platform, setPlatform] = useState('browser'); // 'tauri' | 'electron' | 'browser'
    const isDesktop = platform === 'tauri' || platform === 'electron';

    // Recorder State
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const [clickCount, setClickCount] = useState(0);
    const [loadingSources, setLoadingSources] = useState(true);
    const [micEnabled, setMicEnabled] = useState(false);
    const [startPosition, setStartPosition] = useState('center');
    const [sourceThumbnails, setSourceThumbnails] = useState({});

    // Studio State
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedClicks, setRecordedClicks] = useState([]);
    const [recordedMoves, setRecordedMoves] = useState([]);
    const recDurationRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [background, setBackground] = useState('bigSur');

    // Zoom Settings
    const [activeClickIdx, setActiveClickIdx] = useState(-1);

    // Hotkey Settings
    const [showHotkeySettings, setShowHotkeySettings] = useState(false);
    const [hotkeys, setHotkeys] = useState({
        toggle_recording: 'CmdOrCtrl+Shift+R',
        stop_recording: 'CmdOrCtrl+Shift+S',
        toggle_pause: 'CmdOrCtrl+Shift+P',
        toggle_zoom: 'CmdOrCtrl+Shift+Z',
    });

    // Hydration Fix State
    const [hookStatus, setHookStatus] = useState('Loading...');

    // --- PLATFORM DETECTION ---
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (drift.isTauri()) {
            setPlatform('tauri');
            setHookStatus('Active (Tauri)');
            drift.getHotkeys().then(saved => {
                if (saved) setHotkeys(saved);
                // Register global shortcuts from saved config
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
            setHookStatus('Browser Mode');
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
                console.warn(`[Drift] Thumbnail capture failed for monitor ${i}:`, e);
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
                setRecordedBlob(blob);
                setRecordedClicks(clicks);
                setRecordedMoves(engineRef.current.mouseMoves || []);
                recDurationRef.current = dur;
                setViewMode('studio');
            };

            // Load Sources
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

            if (recordedBlob && canvasRef.current && videoRef.current) {
                setTimeout(() => {
                    studioRef.current = new StudioEngine(
                        canvasRef.current, videoRef.current,
                        recordedBlob, recordedClicks, recDurationRef.current, recordedMoves
                    );
                    studioRef.current.background = background;
                    studioRef.current.startPosition = startPosition;

                    if (videoRef.current) {
                        videoRef.current.ontimeupdate = () => {
                            if (videoRef.current) {
                                setCurrentTime(videoRef.current.currentTime);
                                setDuration(studioRef.current?.videoDuration || 0);
                                const idx = studioRef.current?.lastClickIdx ?? -1;
                                if (idx !== activeClickIdx) {
                                    setActiveClickIdx(idx);
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
                    }, 500);
                }, 100);
            }
        }
    }, [viewMode]);

    useEffect(() => {
        if (studioRef.current) studioRef.current.background = background;
    }, [background]);

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

    const toggleRecord = async () => {
        if (isRecording) {
            engineRef.current.stopRecording();
            setIsRecording(false);
        } else {
            try {
                if (!selectedSource || platform !== 'electron') {
                    if (!engineRef.current?.screenStream?.active) {
                        const ok = await engineRef.current.selectSourceBrowser();
                        if (!ok) return;
                        setSelectedSource('browser-source');
                        await new Promise(r => setTimeout(r, 500));
                    }
                }
                const hasStream = engineRef.current?.screenStream?.active;
                if (!hasStream && !selectedSource) return;

                engineRef.current.startPosition = startPosition;
                engineRef.current.micEnabled = micEnabled;
                await engineRef.current.startRecording((s) => {
                    const m = Math.floor(s / 60).toString().padStart(2, '0');
                    const sec = Math.floor(s % 60).toString().padStart(2, '0');
                    setTimer(`${m}:${sec}`);
                });
                setIsRecording(true);
            } catch (e) {
                console.error('[Drift] Recording error:', e);
            }
        }
    };

    useEffect(() => { toggleRecordRef.current = toggleRecord; }, [toggleRecord]);

    // --- GLOBAL HOTKEY EVENT HANDLER ---
    useEffect(() => {
        const handler = (e) => {
            const { action } = e.detail || {};
            console.log('[Drift] Global hotkey:', action);
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

    const togglePlayback = () => {
        if (!studioRef.current) return;
        if (videoRef.current?.paused) { studioRef.current.play(); setIsPlaying(true); }
        else { studioRef.current.pause(); setIsPlaying(false); }
    };

    const seekTo = (e) => {
        if (!studioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pct * duration;
        studioRef.current.resetCamera();
    };

    const addManualZoom = () => {
        if (!studioRef.current || !videoRef.current) return;
        const ct = videoRef.current.currentTime;
        studioRef.current.addZoom(ct, 0.5, 0.5, 1.8);
        setRecordedClicks(prev => [...prev, { time: ct * 1000, x: 0.5, y: 0.5 }]);
    };

    const handleCanvasClick = (e) => {
        if (viewMode !== 'studio' || !studioRef.current || !videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / rect.width;
        const canvasY = (e.clientY - rect.top) / rect.height;
        const ct = videoRef.current.currentTime;
        const { x, y } = studioRef.current.resolveClick(canvasX, canvasY);
        studioRef.current.addZoom(ct, x, y, 1.8);
        setRecordedClicks(prev => [...prev, { time: ct * 1000, x, y }]);
    };

    const clearManualZooms = () => {
        if (!studioRef.current) return;
        studioRef.current.clicks = [];
        studioRef.current.activeZoom = null;
        studioRef.current.lastClickIdx = -1;
        setRecordedClicks([]);
        setActiveClickIdx(-1);
    };

    const setTrimStartPoint = () => { setTrimStart(currentTime); setTrimEnd(duration); };
    const setTrimEndPoint = () => setTrimEnd(currentTime);
    const resetTrim = () => { setTrimStart(0); setTrimEnd(duration); };

    const handleExport = async () => {
        if (!studioRef.current) return;
        setIsExporting(true);
        setExportProgress(0);
        try {
            studioRef.current.trimStart = trimStart;
            studioRef.current.trimEnd = trimEnd;

            // exportVideo() now returns MP4 (WebCodecs) or WebM (fallback) automatically
            const videoBlob = await studioRef.current.exportVideo((pct) => {
                setExportProgress(Math.round(Math.min(Math.max(pct || 0, 0), 1) * 90));
            });

            const isMP4 = videoBlob.type === 'video/mp4';
            const ext = isMP4 ? 'mp4' : 'webm';

            if (platform === 'tauri') {
                // Desktop: save dialog → write to disk
                try {
                    const savePath = await drift.showSaveDialog({
                        defaultPath: `drift-recording-${Date.now()}.${ext}`,
                        filters: [{ name: isMP4 ? 'MP4 Video' : 'WebM Video', extensions: [ext] }],
                    });

                    if (!savePath) {
                        // User cancelled
                        triggerBlobDownload(videoBlob, ext);
                    } else {
                        setExportProgress(95);
                        const fileBytes = new Uint8Array(await videoBlob.arrayBuffer());
                        await drift.saveFile(savePath, fileBytes);
                        setExportProgress(100);
                        console.log(`[Export] ${ext.toUpperCase()} saved to:`, savePath);
                    }
                } catch (e) {
                    console.error('[Export] Save failed, downloading instead:', e);
                    triggerBlobDownload(videoBlob, ext);
                }
            } else {
                // Browser: direct download
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
        a.download = `drift-export-${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };

    const handleRawExport = () => {
        if (!recordedBlob) return;
        triggerBlobDownload(recordedBlob, 'webm');
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    const saveHotkeys = async () => {
        if (platform === 'tauri') {
            await drift.setHotkeys(hotkeys);
            // Re-register global shortcuts with new config
            await drift.registerGlobalShortcuts(hotkeys);
        } else if (window.electron?.setHotkeys) {
            await window.electron.setHotkeys(hotkeys);
        }
        setShowHotkeySettings(false);
    };

    // ══════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════

    return (
        <div className="h-screen bg-[#0a0a0f] text-white font-sans select-none flex flex-col overflow-hidden">
            <video ref={videoRef} className="hidden" muted={viewMode === 'recorder'} playsInline />

            {/* ═══ HEADER ═══ */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-xl flex-shrink-0 z-40">
                <div className="flex items-center gap-3">
                    <span className="bg-[#DCFE50] text-black px-2.5 py-0.5 text-base font-black tracking-tight rounded-[3px] shadow-[2px_2px_0_rgba(255,255,255,0.08)]">
                        DRIFT
                    </span>
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm font-semibold tracking-tight">
                            {viewMode === 'recorder' ? 'Record' : 'Edit'}
                        </h1>
                        {isDesktop && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#DCFE50]/10 text-[#DCFE50] border border-[#DCFE50]/20 uppercase">
                                {platform === 'tauri' ? 'Desktop' : 'Electron'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isDesktop && (
                        <button
                            onClick={() => setShowHotkeySettings(true)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                            ⌨ Hotkeys
                        </button>
                    )}
                    {viewMode === 'studio' && (
                        <button onClick={() => window.location.reload()}
                            className="text-[10px] text-gray-500 hover:text-white border border-white/[0.06] px-2.5 py-1 rounded-md transition-all hover:bg-white/[0.03]">
                            + New
                        </button>
                    )}
                </div>
            </header>

            {/* ═══ MAIN LAYOUT ═══ */}
            <div className="flex flex-1 min-h-0">

                {/* ─── LEFT PANEL ─── */}
                <aside className="w-72 flex-shrink-0 border-r border-white/[0.06] overflow-y-auto p-3 space-y-3 bg-[#0c0c14]">
                    {viewMode === 'recorder' ? (
                        <>
                            {/* SOURCE SELECTOR (Desktop) */}
                            {isDesktop && (
                                <Section title="Monitors" icon="🖥">
                                    {loadingSources ? (
                                        <div className="flex items-center justify-center h-16">
                                            <div className="w-4 h-4 border-2 border-[#DCFE50]/30 border-t-[#DCFE50] rounded-full animate-spin" />
                                        </div>
                                    ) : sources.length > 0 ? (
                                        <div className="space-y-1.5">
                                            {sources.map((src) => (
                                                <button
                                                    key={src.id}
                                                    onClick={() => selectSource(src.id)}
                                                    className={`w-full text-left rounded-lg overflow-hidden transition-all border-2 ${
                                                        selectedSource === src.id
                                                            ? 'border-[#DCFE50] ring-1 ring-[#DCFE50]/20'
                                                            : 'border-transparent hover:border-white/10'
                                                    }`}
                                                >
                                                    <div className="relative aspect-video bg-[#1a1a2e] overflow-hidden">
                                                        {sourceThumbnails[src.id] ? (
                                                            <img src={sourceThumbnails[src.id]} alt={src.name} className="w-full h-full object-cover" />
                                                        ) : src.thumbnailDataUrl ? (
                                                            <img src={src.thumbnailDataUrl} alt={src.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px] font-mono">
                                                                No preview
                                                            </div>
                                                        )}
                                                        {selectedSource === src.id && (
                                                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DCFE50] flex items-center justify-center text-[8px] text-black font-bold">✓</div>
                                                        )}
                                                        {src.is_primary && (
                                                            <span className="absolute top-1 left-1 text-[7px] font-bold px-1 py-px rounded bg-[#DCFE50]/90 text-black">PRIMARY</span>
                                                        )}
                                                    </div>
                                                    <div className="px-2 py-1.5 bg-white/[0.02]">
                                                        <div className="text-[10px] font-medium truncate">{src.name}</div>
                                                        {src.width && <div className="text-[9px] text-gray-600">{src.width}×{src.height}</div>}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-[10px] text-gray-600 mb-1">No native sources</p>
                                            <button onClick={selectBrowserSource} className="text-[10px] text-[#DCFE50] hover:underline">
                                                Use system picker
                                            </button>
                                        </div>
                                    )}
                                    {platform === 'tauri' && sources.length > 0 && (
                                        <p className="text-[8px] text-gray-600 mt-2 text-center">
                                            Click a monitor → system picker will open
                                        </p>
                                    )}
                                </Section>
                            )}

                            {/* SETTINGS */}
                            <Section title="Settings" icon="⚙">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-medium text-gray-300">Microphone</span>
                                        <button
                                            onClick={toggleMic}
                                            className={`w-9 h-[18px] rounded-full transition-all relative ${micEnabled ? 'bg-[#DCFE50]' : 'bg-gray-700'}`}
                                        >
                                            <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-transform ${micEnabled ? 'left-[19px]' : 'left-[2px]'}`} />
                                        </button>
                                    </div>
                                    {isDesktop && (
                                        <div>
                                            <label className="text-[9px] text-gray-600 font-medium uppercase tracking-wider block mb-1.5">Initial Zoom</label>
                                            <div className="grid grid-cols-2 gap-1">
                                                {Object.entries(START_POSITIONS).map(([key, val]) => (
                                                    <button key={key} onClick={() => setStartPosition(key)}
                                                        className={`py-1 text-[9px] font-medium rounded border transition-all ${
                                                            startPosition === key
                                                                ? 'bg-[#DCFE50]/10 border-[#DCFE50]/40 text-[#DCFE50]'
                                                                : 'bg-white/[0.03] border-transparent text-gray-500 hover:bg-white/[0.06]'
                                                        }`}>{val.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Section>

                            {/* RECORD */}
                            <Section title={null}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-2xl font-mono font-black tracking-wider">{timer}</div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                        <span>Clicks: {clickCount}</span>
                                        {isRecording && (
                                            <span className="flex items-center gap-1 text-red-400 font-medium">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                REC
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={toggleRecord}
                                    className={`w-full py-3 text-xs font-bold rounded-lg shadow-[2px_2px_0_black] active:translate-y-[1px] active:shadow-none transition-all ${
                                        isRecording
                                            ? 'bg-red-500 hover:bg-red-400 text-white'
                                            : 'bg-[#DCFE50] hover:bg-[#c9e845] text-black'
                                    }`}
                                >
                                    {isRecording ? '■  STOP' : '●  RECORD'}
                                </button>
                                {isDesktop && !isRecording && (
                                    <div className="mt-2 flex items-center justify-center">
                                        <kbd className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-gray-500">
                                            {(typeof hotkeys.toggle_recording === 'string' ? hotkeys.toggle_recording : 'Ctrl+Shift+R').replace('CmdOrCtrl', 'Ctrl')}
                                        </kbd>
                                    </div>
                                )}
                            </Section>

                            {/* STATUS */}
                            <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-2.5 space-y-1">
                                {[
                                    ['Platform', platform, platform === 'tauri' ? 'text-[#DCFE50]' : 'text-gray-400'],
                                    ['Hook', hookStatus, hookStatus.includes('Active') ? 'text-green-400' : 'text-gray-500'],
                                    ['Sources', `${sources.length}`, 'text-gray-400'],
                                ].map(([label, value, cls]) => (
                                    <div key={label} className="flex justify-between text-[9px]">
                                        <span className="text-gray-600">{label}</span>
                                        <span className={`font-mono ${cls}`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* STUDIO MODE */
                        <>
                            <Section title="Recording">
                                <div className="grid grid-cols-3 gap-1.5 text-center">
                                    {[
                                        [formatTime(duration), 'Duration'],
                                        [recordedClicks.length, 'Zooms'],
                                        [recordedBlob ? (recordedBlob.size / 1024 / 1024).toFixed(1) : '0', 'MB'],
                                    ].map(([val, label]) => (
                                        <div key={label} className="bg-white/[0.03] rounded-md p-1.5">
                                            <div className="text-sm font-bold">{val}</div>
                                            <div className="text-[8px] text-gray-600">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            <Section title="Background">
                                <div className="grid grid-cols-3 gap-1">
                                    {Object.entries(BACKGROUNDS).map(([key, val]) => (
                                        <button key={key} onClick={() => setBackground(key)}
                                            className={`rounded-md border-2 overflow-hidden transition-all ${
                                                background === key ? 'border-[#DCFE50]' : 'border-transparent hover:border-white/10'
                                            }`}>
                                            <div className="w-full h-4" style={{ background: `linear-gradient(135deg, ${val.colors.join(', ')})` }} />
                                            <div className="text-[7px] text-gray-500 py-0.5 bg-white/[0.02]">{val.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </Section>

                            <Section title="Export">
                                <div className="space-y-1.5">
                                    <button className="w-full py-2 bg-[#DCFE50] text-black text-[10px] font-bold rounded-md shadow-[2px_2px_0_black] hover:translate-y-[-1px] transition-all disabled:opacity-50"
                                        onClick={handleExport} disabled={isExporting}>
                                        {isExporting ? `Rendering ${exportProgress}%` : recordedClicks.length > 0 ? 'EXPORT WITH EFFECTS' : 'EXPORT VIDEO'}
                                    </button>
                                    <button className="w-full py-1.5 bg-white/[0.03] text-gray-500 text-[9px] font-medium rounded-md border border-white/[0.04] hover:bg-white/[0.06] transition-all"
                                        onClick={handleRawExport}>Download Raw</button>
                                </div>
                            </Section>
                        </>
                    )}
                </aside>

                {/* ─── CENTER: CANVAS ─── */}
                <main className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 flex items-center justify-center p-4 bg-[#08080c]">
                        <div className={`relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-white/[0.04] shadow-2xl ${isRecording ? 'cursor-none' : viewMode === 'studio' ? 'cursor-crosshair' : ''}`}>
                            <canvas ref={canvasRef} width={1280} height={720}
                                onClick={handleCanvasClick}
                                className={`w-full h-full bg-[#1a1a2e] ${isRecording ? 'cursor-none' : viewMode === 'studio' ? 'cursor-crosshair' : ''}`} />
                            {viewMode === 'recorder' && !selectedSource && !isRecording && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <div className="text-gray-600 text-3xl mb-3">🖥</div>
                                    <p className="text-gray-400 text-xs font-medium mb-0.5">
                                        {isDesktop ? 'Select a monitor or press Record' : 'Click Record to start'}
                                    </p>
                                    <p className="text-gray-600 text-[9px] max-w-xs text-center">
                                        {isDesktop
                                            ? 'Pick a monitor from the left panel. The system picker will appear for screen selection.'
                                            : 'Your browser will prompt you to choose a screen or window.'}
                                    </p>
                                    {!isDesktop && (
                                        <button onClick={selectBrowserSource}
                                            className="mt-3 px-3 py-1.5 bg-[#DCFE50] text-black text-[10px] font-bold rounded-md hover:bg-[#c9e845] transition-all">
                                            Select Source
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TIMELINE (Studio) */}
                    {viewMode === 'studio' && (
                        <div className="border-t border-white/[0.06] bg-[#0c0c14] px-5 py-2.5 flex-shrink-0">
                            <div className="h-7 bg-[#14141e] rounded-md relative cursor-pointer mb-2 overflow-hidden border border-white/[0.04]" onClick={seekTo}>
                                <div className="absolute top-0 h-full bg-[#DCFE50]/[0.06] border-l border-r border-[#DCFE50]/20"
                                    style={{ left: `${(trimStart / duration) * 100}%`, width: `${((trimEnd - trimStart) / duration) * 100}%` }} />
                                <div className="absolute top-0 h-full bg-white/[0.04] border-r-2 border-white/70"
                                    style={{ width: `${(currentTime / duration) * 100}%` }} />
                                {recordedClicks.map((click, i) => (
                                    <div key={i}
                                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full border border-white/80 z-10 shadow-[0_0_6px_rgba(255,0,0,0.3)] -translate-x-1/2"
                                        style={{ left: `${(click.time / 1000 / duration) * 100}%` }} />
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-1.5">
                                    <button onClick={togglePlayback} className="w-7 h-7 rounded-md bg-white/[0.06] hover:bg-white/10 flex items-center justify-center transition-all">
                                        {isPlaying
                                            ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                            : <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>}
                                    </button>
                                    <span className="font-mono text-gray-500">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={addManualZoom} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15 hover:bg-blue-500/20 transition-all">+ Zoom</button>
                                    {recordedClicks.length > 0 && (
                                        <button onClick={clearManualZooms} className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15 hover:bg-red-500/20 transition-all">Clear</button>
                                    )}
                                    <span className="w-px h-3 bg-white/[0.06] mx-0.5" />
                                    <button onClick={() => { setTrimStart(currentTime); setTrimEnd(duration); }} className="px-1.5 py-0.5 rounded bg-white/[0.03] text-gray-500 hover:bg-white/[0.06] transition-all">◀ Trim</button>
                                    <button onClick={() => setTrimEnd(currentTime)} className="px-1.5 py-0.5 rounded bg-white/[0.03] text-gray-500 hover:bg-white/[0.06] transition-all">Trim ▶</button>
                                    <button onClick={resetTrim} className="text-gray-600 hover:text-white ml-0.5">Reset</button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

            </div>

            {/* ═══ OVERLAYS ═══ */}
            {isExporting && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#13131f] p-6 rounded-xl border border-white/10 text-center max-w-xs w-full shadow-2xl">
                        <div className="text-2xl mb-2">⚡</div>
                        <h2 className="text-base font-bold mb-0.5">Rendering</h2>
                        <p className="text-gray-500 text-[10px] mb-4">Applying cinema-grade zoom effects</p>
                        <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#DCFE50] to-[#a8d600] transition-all rounded-full" style={{ width: `${exportProgress}%` }} />
                        </div>
                        <div className="mt-1.5 text-[10px] text-gray-500 font-mono">{exportProgress}%</div>
                    </div>
                </div>
            )}

            {showHotkeySettings && (
                <HotkeyModal hotkeys={hotkeys} onUpdate={setHotkeys} onSave={saveHotkeys} onClose={() => setShowHotkeySettings(false)} platform={platform} />
            )}
        </div>
    );
}


// ─────────────────────────────────
//  SECTION COMPONENT
// ─────────────────────────────────
function Section({ title, icon, children }) {
    return (
        <div className="rounded-lg border border-white/[0.06] bg-[#11111a] overflow-hidden">
            {title && (
                <div className="px-3 py-2 border-b border-white/[0.04] flex items-center gap-1.5">
                    {icon && <span className="text-xs">{icon}</span>}
                    <h3 className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
                </div>
            )}
            <div className="p-3">{children}</div>
        </div>
    );
}


// ─────────────────────────────────
//  HOTKEY MODAL
// ─────────────────────────────────
function HotkeyModal({ hotkeys, onUpdate, onSave, onClose, platform }) {
    const [capturing, setCapturing] = useState(null); // which key is being captured
    const entries = [
        { key: 'toggle_recording', label: 'Start / Stop Recording' },
        { key: 'stop_recording', label: 'Force Stop' },
        { key: 'toggle_pause', label: 'Pause / Resume' },
        { key: 'toggle_zoom', label: 'Manual Zoom' },
    ];

    // Capture key combo when a row is in capture mode
    useEffect(() => {
        if (!capturing) return;
        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Build accelerator string (Tauri format)
            const parts = [];
            if (e.ctrlKey || e.metaKey) parts.push('CmdOrCtrl');
            if (e.altKey) parts.push('Alt');
            if (e.shiftKey) parts.push('Shift');
            // Ignore modifier-only presses
            const ignore = ['Control', 'Shift', 'Alt', 'Meta'];
            if (ignore.includes(e.key)) return;
            // Map special keys
            const keyMap = { ' ': 'Space', 'ArrowUp': 'Up', 'ArrowDown': 'Down', 'ArrowLeft': 'Left', 'ArrowRight': 'Right', 'Escape': 'Escape' };
            const keyName = keyMap[e.key] || (e.key.length === 1 ? e.key.toUpperCase() : e.key);
            if (keyName === 'Escape' && parts.length === 0) {
                // Pressing bare Escape cancels capture
                setCapturing(null);
                return;
            }
            parts.push(keyName);
            const accelerator = parts.join('+');
            onUpdate(prev => ({ ...prev, [capturing]: accelerator }));
            setCapturing(null);
        };
        window.addEventListener('keydown', handler, true);
        return () => window.removeEventListener('keydown', handler, true);
    }, [capturing, onUpdate]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#13131f] rounded-xl p-5 max-w-sm w-full border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white">⌨ Global Hotkeys</h2>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-gray-600">{platform}</span>
                </div>
                <p className="text-[9px] text-gray-500 mb-3">Click a shortcut to rebind it. Press your new key combo, or Escape to cancel.</p>
                <div className="space-y-2 mb-4">
                    {entries.map(entry => (
                        <button
                            key={entry.key}
                            onClick={() => setCapturing(capturing === entry.key ? null : entry.key)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                                capturing === entry.key
                                    ? 'bg-[#DCFE50]/10 border-[#DCFE50]/40 ring-1 ring-[#DCFE50]/20'
                                    : 'bg-white/[0.03] border-white/[0.04] hover:border-white/10'
                            }`}
                        >
                            <span className="text-[10px] font-medium text-gray-300">{entry.label}</span>
                            <kbd className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                capturing === entry.key
                                    ? 'bg-[#DCFE50]/20 border-[#DCFE50]/30 text-[#DCFE50] animate-pulse'
                                    : 'bg-black/30 border-white/[0.08] text-[#DCFE50]'
                            }`}>
                                {capturing === entry.key
                                    ? '⏎ Press keys...'
                                    : (hotkeys[entry.key] || 'Not set').replace('CmdOrCtrl', 'Ctrl')}
                            </kbd>
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-2 bg-white/[0.06] text-white text-[10px] font-medium rounded-lg hover:bg-white/10 transition-all">Cancel</button>
                    <button onClick={onSave} className="flex-1 py-2 bg-[#DCFE50] text-black text-[10px] font-bold rounded-lg hover:bg-[#c9e845] transition-all">Save</button>
                </div>
            </div>
        </div>
    );
}
