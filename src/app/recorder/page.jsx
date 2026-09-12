'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DriftEngine } from '@/lib/DriftEngine';
import { StudioEngine } from '@/lib/StudioEngine';
import drift from '@/lib/tauri-bridge';

// Modular Desktop Components
import DesktopHeader from '@/components/desktop/DesktopHeader';
import SourcePickerGrid from '@/components/desktop/SourcePickerGrid';
import CaptureDock from '@/components/desktop/CaptureDock';
import CountdownOverlay from '@/components/desktop/CountdownOverlay';
import StudioTimeline from '@/components/desktop/StudioTimeline';
import InspectorPanel from '@/components/desktop/InspectorPanel';
import ExportDialog from '@/components/desktop/ExportDialog';
import HotkeyModal from '@/components/desktop/HotkeyModal';

// macOS & Studio Gradient Wallpapers
const BACKGROUNDS = {
    midnight: { name: 'Midnight', colors: ['#0A0B10', '#121420', '#1C2035'] },
    bigSur: { name: 'Big Sur', colors: ['#ff6b9d', '#c44569', '#6c5ce7', '#0c3483'] },
    monterey: { name: 'Monterey', colors: ['#00b894', '#00cec9', '#0984e3', '#6c5ce7'] },
    ventura: { name: 'Ventura', colors: ['#e17055', '#d63031', '#fd79a8', '#a855f7'] },
    bloom: { name: 'Bloom', colors: ['#74b9ff', '#0984e3', '#6c5ce7', '#a855f7'] },
    sonoma: { name: 'Sonoma', colors: ['#fdcb6e', '#f39c12', '#e74c3c', '#9b59b6'] },
    emerald: { name: 'Emerald', colors: ['#059669', '#10b981', '#064e3b', '#022c22'] },
    neonDrift: { name: 'Drift Lime', colors: ['#08090E', '#16190B', '#262D0B', '#DCFE50'] }
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

    // Recorder State
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const [clickCount, setClickCount] = useState(0);
    const [loadingSources, setLoadingSources] = useState(true);
    const [micEnabled, setMicEnabled] = useState(false);
    const [countdownSeconds, setCountdownSeconds] = useState(0); // 0 (instant), 3, 5
    const [activeCountdown, setActiveCountdown] = useState(0);
    const [sourceThumbnails, setSourceThumbnails] = useState({});

    // Studio State
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedClicks, setRecordedClicks] = useState([]);
    const [recordedMoves, setRecordedMoves] = useState([]);
    const recDurationRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [background, setBackground] = useState('midnight');
    const [zoomLevel, setZoomLevel] = useState(1.8);
    const [showCursor, setShowCursor] = useState(true);

    // Export State
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    // Hotkeys & Telemetry
    const [showHotkeySettings, setShowHotkeySettings] = useState(false);
    const [hookStatus, setHookStatus] = useState('Initializing...');
    const [hotkeys, setHotkeys] = useState({
        toggle_recording: 'CmdOrCtrl+Shift+R',
        stop_recording: 'CmdOrCtrl+Shift+S',
        toggle_pause: 'CmdOrCtrl+Shift+P',
        toggle_zoom: 'CmdOrCtrl+Shift+Z',
    });

    // --- PLATFORM DETECTION ---
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (drift.isTauri()) {
            setPlatform('tauri');
            setHookStatus('Active (Tauri IPC)');
            drift.getHotkeys().then(saved => {
                if (saved) setHotkeys(saved);
                drift.registerGlobalShortcuts(saved || hotkeys);
            }).catch(() => {
                drift.registerGlobalShortcuts(hotkeys);
            });
        } else if (window.electron) {
            setPlatform('electron');
            setHookStatus(window.electron.onGlobalClick ? 'Active (Electron)' : 'Unavailable');
            if (window.electron.getHotkeys) {
                window.electron.getHotkeys().then(saved => {
                    if (saved) setHotkeys(saved);
                });
            }
        } else {
            setPlatform('browser');
            setHookStatus('Browser Mode');
            // Browser recorder is retired - redirect web users to download section
            window.location.replace('/#install');
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
        if (!isDesktop) return;

        if (viewMode === 'recorder') {
            engineRef.current = new DriftEngine(canvasRef.current, videoRef.current);
            engineRef.current.onclickCallback = (c) => setClickCount(c);
            engineRef.current.micEnabled = micEnabled;
            engineRef.current.onHotkeyStart = () => {
                if (toggleRecordRef.current) toggleRecordRef.current();
            };

            engineRef.current.onStopCallback = (blob, clicks, dur) => {
                if (engineRef.current?.screenStream) {
                    engineRef.current.screenStream.getTracks().forEach(t => t.stop());
                }
                if (engineRef.current?.micStream) {
                    engineRef.current.micStream.getTracks().forEach(t => t.stop());
                }
                setRecordedBlob(blob);
                setRecordedClicks(clicks);
                setRecordedMoves(engineRef.current?.mouseMoves || []);
                recDurationRef.current = dur;
                setViewMode('studio');
            };

            // Load Sources
            async function load() {
                setLoadingSources(true);
                try {
                    const srcs = await engineRef.current.getSources();
                    setSources(srcs);
                    if (srcs.length > 0) {
                        // Default to primary monitor or first available
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
                        recordedMoves
                    );
                    studioRef.current.background = background;
                    studioRef.current.zoomLevel = zoomLevel;
                    studioRef.current.showCursor = showCursor;

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

    // --- ACTIONS ---
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

    // Global Hotkey Event Handler
    useEffect(() => {
        const handler = (e) => {
            const { action } = e.detail || {};
            console.log('[Drift] Global hotkey received:', action);
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

    // Studio Controls
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
        setRecordedClicks(prev => [...prev, { time: ct * 1000, x: 0.5, y: 0.5 }]);
    };

    const handleCanvasClick = (e) => {
        if (viewMode !== 'studio' || !studioRef.current || !videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / rect.width;
        const canvasY = (e.clientY - rect.top) / rect.height;
        const ct = videoRef.current.currentTime;
        const { x, y } = studioRef.current.resolveClick(canvasX, canvasY);
        studioRef.current.addZoom(ct, x, y, zoomLevel);
        setRecordedClicks(prev => [...prev, { time: ct * 1000, x, y }]);
    };

    const clearManualZooms = () => {
        if (!studioRef.current) return;
        studioRef.current.clicks = [];
        studioRef.current.activeZoom = null;
        studioRef.current.lastClickIdx = -1;
        setRecordedClicks([]);
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
            });

            const ext = format === 'gif' ? 'gif' : (videoBlob.type === 'video/mp4' ? 'mp4' : 'webm');

            if (platform === 'tauri') {
                try {
                    const savePath = await drift.showSaveDialog({
                        defaultPath: `drift-cinema-${Date.now()}.${ext}`,
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

    const saveHotkeys = async () => {
        if (platform === 'tauri') {
            await drift.setHotkeys(hotkeys);
            await drift.registerGlobalShortcuts(hotkeys);
        } else if (window.electron?.setHotkeys) {
            await window.electron.setHotkeys(hotkeys);
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

    // Keyboard Spacebar play/pause in Studio
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

    // ══════════════════════════════════════════════
    //  DESKTOP GATE (Browser redirect)
    // ══════════════════════════════════════════════
    if (!isDesktop) {
        return (
            <div className="h-screen bg-[#07080D] text-white flex flex-col items-center justify-center p-6 text-center font-mono select-none">
                <div className="max-w-md w-full border-2 border-[#DCFE50] bg-[#0E0F17] p-8 rounded-3xl shadow-[0_20px_60px_rgba(220,254,80,0.15)]">
                    <div className="w-16 h-16 mx-auto mb-6 bg-[#DCFE50] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(220,254,80,0.4)]">
                        <span className="text-black font-black text-2xl font-mono">D</span>
                    </div>
                    <h1 className="text-xl font-bold uppercase mb-2 text-white font-mono">Drift Desktop Required</h1>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        In-browser recording has been retired. Drift is now available exclusively as a native desktop application for cinema-grade auto-zoom and GPU-accelerated capture.
                    </p>
                    <a
                        href="/downloads/Drift_2.0.0_x64-setup.exe"
                        download
                        className="block w-full py-3.5 bg-[#DCFE50] text-black font-black uppercase text-xs rounded-xl hover:bg-[#c8ea3c] transition-all shadow-lg"
                    >
                        Download Drift Desktop (21 MB)
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#07080D] text-white font-sans select-none flex flex-col overflow-hidden">
            {/* Hidden media elements for canvas rendering */}
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
            />

            {/* Main Stage */}
            <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
                {viewMode === 'recorder' ? (
                    /* ═══ CAPTURE MODE ═══ */
                    <div className="flex-1 flex flex-col items-center justify-between p-6 max-w-5xl w-full mx-auto overflow-y-auto">
                        {/* Hidden canvas in recorder view */}
                        <canvas ref={canvasRef} width={1280} height={720} className="hidden" />

                        {/* Top: Source Picker */}
                        <div className="w-full mt-4">
                            <SourcePickerGrid
                                sources={sources}
                                selectedSource={selectedSource}
                                onSelectSource={selectSource}
                                onSelectBrowserSource={selectBrowserSource}
                                sourceThumbnails={sourceThumbnails}
                                loadingSources={loadingSources}
                            />
                        </div>

                        {/* Center / Bottom: Floating Command Dock */}
                        <div className="w-full max-w-2xl my-6">
                            <CaptureDock
                                isRecording={isRecording}
                                onToggleRecord={toggleRecord}
                                timer={timer}
                                micEnabled={micEnabled}
                                onToggleMic={toggleMic}
                                countdownSeconds={countdownSeconds}
                                onChangeCountdown={setCountdownSeconds}
                                hotkey={(typeof hotkeys.toggle_recording === 'string' ? hotkeys.toggle_recording : 'Ctrl+Shift+R').replace('CmdOrCtrl', 'Ctrl')}
                            />
                        </div>
                    </div>
                ) : (
                    /* ═══ STUDIO MODE ═══ */
                    <div className="flex-1 flex min-h-0">
                        {/* Center Canvas Stage */}
                        <main className="flex-1 flex flex-col min-w-0 bg-[#06070B] relative">
                            <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                                <div
                                    className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-crosshair group"
                                    onClick={handleCanvasClick}
                                    title="Click anywhere on the preview to place an auto-zoom focal point"
                                >
                                    <canvas
                                        ref={canvasRef}
                                        width={1280}
                                        height={720}
                                        className="w-full h-full bg-[#0E0F17]"
                                    />

                                    {/* Subtle Canvas Hint Overlay */}
                                    <div className="absolute top-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-[#DCFE50]">
                                        ✦ Click anywhere to add a zoom focal point
                                    </div>
                                </div>
                            </div>

                            {/* Studio Timeline Bar */}
                            <StudioTimeline
                                isPlaying={isPlaying}
                                onTogglePlay={togglePlayback}
                                currentTime={currentTime}
                                duration={duration}
                                onSeek={handleSeek}
                                clicks={recordedClicks}
                                onAddZoom={addManualZoom}
                                onClearZooms={clearManualZooms}
                            />
                        </main>

                        {/* Right Inspector Sidebar */}
                        <InspectorPanel
                            background={background}
                            onChangeBackground={setBackground}
                            backgrounds={BACKGROUNDS}
                            zoomLevel={zoomLevel}
                            onChangeZoomLevel={setZoomLevel}
                            showCursor={showCursor}
                            onToggleCursor={() => setShowCursor(prev => !prev)}
                            onTriggerExport={() => setIsExportDialogOpen(true)}
                            isExporting={isExporting}
                        />
                    </div>
                )}
            </div>

            {/* ═══ MODALS & OVERLAYS ═══ */}
            {/* Countdown Overlay */}
            <CountdownOverlay
                count={activeCountdown}
                onCancel={cancelCountdown}
            />

            {/* Export Modal */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
                onStartExport={executeExport}
                isExporting={isExporting}
                exportProgress={exportProgress}
            />

            {/* Hotkeys Config Modal */}
            {showHotkeySettings && (
                <HotkeyModal
                    hotkeys={hotkeys}
                    onUpdate={setHotkeys}
                    onSave={saveHotkeys}
                    onClose={() => setShowHotkeySettings(false)}
                    platform={platform}
                />
            )}
        </div>
    );
}
