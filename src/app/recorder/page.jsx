'use client';
import { useEffect, useRef, useState } from 'react';
import { DriftEngine } from '@/lib/DriftEngine';
import { StudioEngine } from '@/lib/StudioEngine';

// macOS-style gradient backgrounds
const BACKGROUNDS = {
    bigSur: { name: 'Big Sur', colors: ['#ff6b9d', '#c44569', '#6c5ce7', '#0c3483'] },
    monterey: { name: 'Monterey', colors: ['#00b894', '#00cec9', '#0984e3', '#6c5ce7'] },
    ventura: { name: 'Ventura', colors: ['#e17055', '#d63031', '#fd79a8', '#a855f7'] },
    bloom: { name: 'Bloom', colors: ['#74b9ff', '#0984e3', '#6c5ce7', '#a855f7'] },
    sonoma: { name: 'Sonoma', colors: ['#fdcb6e', '#f39c12', '#e74c3c', '#9b59b6'] },
    midnight: { name: 'Midnight', colors: ['#2c3e50', '#1a1a2e', '#0a0a0f'] }
};

const SPEED_PRESETS = {
    slow: { name: 'Slow', desc: 'Cinematic' },
    normal: { name: 'Normal', desc: 'Balanced' },
    fast: { name: 'Fast', desc: 'Snappy' }
};

const START_POSITIONS = {
    center: { name: '🎯 Center', x: 0.5, y: 0.5 },
    'top-left': { name: '↖ Top Left', x: 0.25, y: 0.25 },
    'top-right': { name: '↗ Top Right', x: 0.75, y: 0.25 },
    none: { name: '❌ None', x: 0.5, y: 0.5, noZoom: true }
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

    // Recorder State
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const [clickCount, setClickCount] = useState(0);
    const [loadingSources, setLoadingSources] = useState(true);
    const [micEnabled, setMicEnabled] = useState(false);
    const [startPosition, setStartPosition] = useState('center');

    // Studio State
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordedClicks, setRecordedClicks] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [background, setBackground] = useState('bigSur');
    const [speedPreset, setSpeedPreset] = useState('slow');

    // Hotkey Settings
    const [showHotkeySettings, setShowHotkeySettings] = useState(false);
    const [hotkeys, setHotkeys] = useState({
        start: { key: 'S', ctrl: true, shift: true, alt: false },
        stop: { key: 'X', ctrl: true, shift: true, alt: false }
    });

    // Hydration Fix State
    const [hookStatus, setHookStatus] = useState('Loading...');

    // --- INIT RECORDER ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHookStatus(window.electron?.onGlobalClick ? 'Active' : 'Unavailable');

            // Load saved hotkeys
            if (window.electron?.getHotkeys) {
                window.electron.getHotkeys().then(savedHotkeys => {
                    if (savedHotkeys) setHotkeys(savedHotkeys);
                });
            }
        }

        if (viewMode === 'recorder') {
            engineRef.current = new DriftEngine(canvasRef.current, videoRef.current);
            engineRef.current.onclickCallback = (c) => setClickCount(c);
            engineRef.current.micEnabled = micEnabled;
            engineRef.current.onHotkeyStart = () => {
                if (toggleRecordRef.current) toggleRecordRef.current();
            };

            engineRef.current.onStopCallback = (blob, clicks) => {
                if (engineRef.current.screenStream) {
                    engineRef.current.screenStream.getTracks().forEach(t => t.stop());
                }
                if (engineRef.current.micStream) {
                    engineRef.current.micStream.getTracks().forEach(t => t.stop());
                }

                setRecordedBlob(blob);
                setRecordedClicks(clicks);
                setViewMode('studio');
            };

            // Load Sources
            async function load() {
                setLoadingSources(true);
                const srcs = await engineRef.current.getSources();
                setSources(srcs);
                setLoadingSources(false);
            }
            load();

        } else if (viewMode === 'studio') {
            // STOP the recorder engine
            if (engineRef.current) {
                engineRef.current.stop();
            }

            // Clear video srcObject
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            // Init Studio Engine
            if (recordedBlob && canvasRef.current && videoRef.current) {
                setTimeout(() => {
                    studioRef.current = new StudioEngine(
                        canvasRef.current,
                        videoRef.current,
                        recordedBlob,
                        recordedClicks
                    );

                    // Apply settings
                    studioRef.current.speedPreset = speedPreset;
                    studioRef.current.background = background;
                    studioRef.current.startPosition = startPosition;

                    // Set up time updates
                    if (videoRef.current) {
                        videoRef.current.ontimeupdate = () => {
                            if (videoRef.current) {
                                setCurrentTime(videoRef.current.currentTime);
                                setDuration(studioRef.current?.videoDuration || 0);
                            }
                        };
                    }

                    // Initialize trim to full duration
                    setTimeout(() => {
                        if (studioRef.current) {
                            const d = studioRef.current?.videoDuration || 10;
                            setDuration(d);
                            setTrimEnd(d);
                        }
                    }, 500);
                }, 100);
            }
        }
    }, [viewMode]);

    // --- Update Studio settings when changed ---
    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.speedPreset = speedPreset;
        }
    }, [speedPreset]);

    useEffect(() => {
        if (studioRef.current) {
            studioRef.current.background = background;
        }
    }, [background]);

    // --- ACTIONS ---
    const selectSource = async (id) => {
        const ok = await engineRef.current.selectSource(id, micEnabled);
        if (ok) setSelectedSource(id);
    };

    const toggleMic = () => {
        setMicEnabled(!micEnabled);
    };

    const toggleRecord = async () => {
        if (isRecording) {
            engineRef.current.stopRecording();
            setIsRecording(false);
        } else {
            try {
                // Check if we have an active stream (more reliable than state when minimized)
                const hasStream = engineRef.current?.screenStream?.active;

                if (!hasStream && !selectedSource) {
                    console.log('[Drift] No screen selected, cannot start recording');
                    // Don't use alert() as it blocks - just log and return
                    return;
                }

                // Store settings
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

    useEffect(() => {
        toggleRecordRef.current = toggleRecord;
    }, [toggleRecord]);

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

    const seekTo = (e) => {
        if (!studioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const time = pct * duration;
        videoRef.current.currentTime = time;
        studioRef.current.resetCamera();
    };

    const setTrimStartPoint = () => {
        setTrimStart(currentTime);
    };

    const setTrimEndPoint = () => {
        setTrimEnd(currentTime);
    };

    const resetTrim = () => {
        setTrimStart(0);
        setTrimEnd(duration);
    };

    const handleExport = async () => {
        if (!studioRef.current) return;
        setIsExporting(true);
        setExportProgress(0);

        try {
            // Apply trim settings
            studioRef.current.trimStart = trimStart;
            studioRef.current.trimEnd = trimEnd;

            // Render the video with effects
            const blob = await studioRef.current.exportVideo((pct) => {
                const safePct = Math.min(Math.max(pct || 0, 0), 1);
                setExportProgress(Math.round(safePct * 100));
            });

            // Download the file
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `drift-export-${Date.now()}.webm`;
            a.click();
            URL.revokeObjectURL(a.href);

        } catch (error) {
            console.error('Export failed:', error);
        }

        setIsExporting(false);
        setExportProgress(0);
    };

    // Export raw recording without any effects
    const handleRawExport = () => {
        if (!recordedBlob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(recordedBlob);
        a.download = `drift-raw-${Date.now()}.webm`;
        a.click();
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    // Format hotkey for display
    const formatHotkey = (hk) => {
        const parts = [];
        if (hk.ctrl) parts.push('Ctrl');
        if (hk.shift) parts.push('Shift');
        if (hk.alt) parts.push('Alt');
        parts.push(hk.key);
        return parts.join(' + ');
    };

    // Save hotkeys to Electron
    const saveHotkeys = async () => {
        if (window.electron?.setHotkeys) {
            await window.electron.setHotkeys(hotkeys);
            setShowHotkeySettings(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans p-6 overflow-auto select-none">

            <video ref={videoRef} className="hidden" muted={viewMode === 'recorder'} playsInline />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <span className="bg-[#DCFE50] text-black px-3 py-1 text-xl font-black rounded-sm shadow-[4px_4px_0_rgba(255,255,255,0.2)]">DRIFT_</span>
                    <h1 className="text-2xl font-bold">{viewMode === 'recorder' ? 'Desktop Recorder' : 'Studio Editor'}</h1>
                </div>
                {viewMode === 'studio' && (
                    <button onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-lg">
                        ← New Recording
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-4 flex flex-col">

                    {viewMode === 'recorder' ? (
                        <>
                            {/* Source Selector */}
                            <div className="bg-[#1a1a24] p-5 rounded-xl border border-white/10 shadow-2xl flex-1 flex flex-col min-h-0 max-h-[40vh]">
                                <h2 className="text-base font-bold mb-3 text-[#DCFE50]">1. Select Source</h2>
                                <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                    {loadingSources ? (
                                        <div className="text-gray-500 text-sm animate-pulse">Loading sources...</div>
                                    ) : sources.length === 0 ? (
                                        <div className="text-gray-500 text-sm">No sources found. Are you in Electron?</div>
                                    ) : (
                                        sources.map(src => (
                                            <button
                                                key={src.id}
                                                onClick={() => selectSource(src.id)}
                                                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all border ${selectedSource === src.id
                                                    ? 'bg-[#DCFE50]/10 border-[#DCFE50] text-[#DCFE50]'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                                    }`}
                                            >
                                                <img src={src.thumbnailDataUrl} className="w-10 h-10 rounded object-cover" alt="" />
                                                <span className="truncate text-sm font-medium">{src.name}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="bg-[#1a1a24] p-5 rounded-xl border border-white/10 shadow-2xl">
                                <h2 className="text-base font-bold mb-3 text-[#DCFE50]">2. Settings</h2>

                                {/* Mic Toggle */}
                                <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg">
                                    <span className="text-sm font-medium">🎤 Microphone</span>
                                    <button
                                        onClick={toggleMic}
                                        className={`w-12 h-6 rounded-full transition-all ${micEnabled ? 'bg-[#DCFE50]' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${micEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>

                                {/* Initial Zoom */}
                                <div className="mb-4">
                                    <label className="text-xs text-gray-400 mb-2 block">Initial Zoom Direction</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(START_POSITIONS).map(([key, val]) => (
                                            <button
                                                key={key}
                                                onClick={() => setStartPosition(key)}
                                                className={`p-2 text-xs rounded-lg border transition-all ${startPosition === key
                                                    ? 'bg-[#DCFE50]/20 border-[#DCFE50] text-[#DCFE50]'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                                    }`}
                                            >
                                                {val.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Record */}
                            <div className="bg-[#1a1a24] p-5 rounded-xl border border-white/10 shadow-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-base font-bold text-[#DCFE50]">3. Record</h2>
                                    <button
                                        onClick={() => setShowHotkeySettings(true)}
                                        className="text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        ⚙️ Hotkeys
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-3xl font-mono font-black tracking-wider">{timer}</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>🖱️ {clickCount}</span>
                                        {isRecording && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
                                    </div>
                                </div>
                                <button
                                    onClick={toggleRecord}
                                    disabled={!selectedSource}
                                    className={`w-full py-4 text-lg font-bold rounded-lg shadow-[4px_4px_0_black] active:translate-y-1 active:shadow-none transition-all ${isRecording
                                        ? 'bg-red-500 hover:bg-red-400 text-white'
                                        : 'bg-[#DCFE50] hover:bg-[#c9e845] text-black disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {isRecording ? `⏹️ STOP (${formatHotkey(hotkeys.stop)})` : `🎬 START (${formatHotkey(hotkeys.start)})`}
                                </button>
                                <div className="mt-2 text-[10px] text-gray-500 text-center font-mono">
                                    TIP: Use hotkeys to keep Drift out of your captures
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Stats */}
                            <div className="bg-[#1a1a24] p-5 rounded-xl border border-white/10 shadow-xl">
                                <h2 className="text-base font-bold mb-3 text-[#DCFE50]">Recording Info</h2>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold">{formatTime(duration)}</div>
                                        <div className="text-xs text-gray-500">Duration</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{recordedClicks.length}</div>
                                        <div className="text-xs text-gray-500">Clicks</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{recordedBlob ? (recordedBlob.size / 1024 / 1024).toFixed(1) : '0'} MB</div>
                                        <div className="text-xs text-gray-500">Size</div>
                                    </div>
                                </div>
                            </div>

                            {/* Speed Preset */}
                            <div className="bg-[#1a1a24] p-5 rounded-xl border border-white/10 shadow-xl">
                                <h2 className="text-base font-bold mb-3 text-[#DCFE50]">Zoom Speed</h2>
                                <div className="flex gap-2">
                                    {Object.entries(SPEED_PRESETS).map(([key, val]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSpeedPreset(key)}
                                            className={`flex-1 py-2 text-sm rounded-lg border transition-all ${speedPreset === key
                                                ? 'bg-[#DCFE50]/20 border-[#DCFE50] text-[#DCFE50]'
                                                : 'bg-white/5 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-bold">{val.name}</div>
                                            <div className="text-[10px] text-gray-400">{val.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Background */}
                            <div className="bg-[#1a1a24] p-5 rounded-xl border border-white/10 shadow-xl">
                                <h2 className="text-base font-bold mb-3 text-[#DCFE50]">Background</h2>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(BACKGROUNDS).map(([key, val]) => (
                                        <button
                                            key={key}
                                            onClick={() => setBackground(key)}
                                            className={`p-2 rounded-lg border-2 transition-all ${background === key
                                                ? 'border-[#DCFE50] ring-1 ring-[#DCFE50]'
                                                : 'border-gray-700 hover:border-gray-500'
                                                }`}
                                        >
                                            <div
                                                className="w-full h-6 rounded-md mb-1"
                                                style={{
                                                    background: `linear-gradient(135deg, ${val.colors.join(', ')})`
                                                }}
                                            />
                                            <div className="text-[10px] text-gray-400">{val.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Export */}
                            <div className="bg-[#1a1a24] p-5 rounded-xl border border-white/10 shadow-xl">
                                <h2 className="text-base font-bold mb-3 text-[#DCFE50]">Export</h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    Exports as WebM (universal format). Convert to MP4 later using <a href="https://cloudconvert.com/webm-to-mp4" target="_blank" className="text-[#DCFE50] hover:underline">CloudConvert</a> if needed.
                                </p>

                                <div className="space-y-3">
                                    <button
                                        className="w-full py-3 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                                        onClick={togglePlayback}
                                    >
                                        {isPlaying ? '⏸️ Pause' : '▶️ Play Preview'}
                                    </button>
                                    <button
                                        className="w-full py-3 bg-[#DCFE50] text-black font-bold rounded-lg shadow-[4px_4px_0_black] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleExport}
                                        disabled={isExporting}
                                    >
                                        {isExporting
                                            ? `⚡ Exporting... ${exportProgress}%`
                                            : '⚡ EXPORT WITH EFFECTS'}
                                    </button>
                                    <button
                                        className="w-full py-2 bg-white/5 text-gray-300 text-sm font-medium rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                                        onClick={handleRawExport}
                                    >
                                        📁 Download Raw Recording
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Canvas Area */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="bg-black rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center p-4 shadow-2xl aspect-video">
                        <canvas
                            ref={canvasRef}
                            width={1280}
                            height={720}
                            className="max-w-full max-h-full rounded-lg bg-[#1a1a2e] shadow-lg"
                        />

                        {viewMode === 'recorder' && !selectedSource && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <div className="text-gray-500 font-mono">Select a source to preview</div>
                            </div>
                        )}
                    </div>

                    {/* Timeline (Studio Mode Only) */}
                    {viewMode === 'studio' && (
                        <div className="bg-[#1a1a24] p-4 rounded-xl border border-white/10">
                            {/* Timeline Bar */}
                            <div
                                className="h-10 bg-gray-800 rounded-lg relative cursor-pointer mb-3 overflow-hidden"
                                onClick={seekTo}
                            >
                                {/* Trim Range */}
                                <div
                                    className="absolute top-0 h-full bg-[#DCFE50]/20 border-l-2 border-r-2 border-[#DCFE50]"
                                    style={{
                                        left: `${(trimStart / duration) * 100}%`,
                                        width: `${((trimEnd - trimStart) / duration) * 100}%`
                                    }}
                                />

                                {/* Progress */}
                                <div
                                    className="absolute top-0 h-full bg-white/10 border-r-2 border-white"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                />

                                {/* Click Markers */}
                                {recordedClicks.map((click, i) => (
                                    <div
                                        key={i}
                                        className="absolute top-0 w-0.5 h-full bg-[#DCFE50]"
                                        style={{ left: `${(click.time / 1000 / duration) * 100}%` }}
                                        title={`Click ${i + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button
                                        onClick={setTrimStartPoint}
                                        className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded border border-white/20"
                                    >
                                        [ Set Start
                                    </button>
                                    <button
                                        onClick={setTrimEndPoint}
                                        className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded border border-white/20"
                                    >
                                        ] Set End
                                    </button>
                                    <button
                                        onClick={resetTrim}
                                        className="px-3 py-1 text-xs text-red-400 bg-white/10 hover:bg-white/20 rounded border border-red-400/30"
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="font-mono text-sm text-gray-400">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-4 right-4 text-xs text-gray-600 font-mono">
                Drift Desktop v0.1.0 • Global Hook: {hookStatus}
            </div>

            {/* Export Overlay */}
            {isExporting && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1a1a24] p-8 rounded-xl border border-white/10 text-center max-w-md">
                        <h2 className="text-2xl font-bold mb-2">⚡ Rendering Video</h2>
                        <p className="text-gray-400 mb-6">Applying cinema-grade zoom effects...</p>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#DCFE50] transition-all"
                                style={{ width: `${exportProgress}%` }}
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-500">{exportProgress}%</div>
                    </div>
                </div>
            )}

            {/* Hotkey Settings Modal */}
            {showHotkeySettings && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a24] rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-[#DCFE50]">⌨️ Hotkey Settings</h2>

                        {/* Start Recording Hotkey */}
                        <div className="mb-6">
                            <label className="text-sm text-gray-400 mb-2 block">Start Recording</label>
                            <div className="flex gap-2 mb-2">
                                {['ctrl', 'shift', 'alt'].map((mod) => (
                                    <button
                                        key={mod}
                                        onClick={() => setHotkeys(prev => ({
                                            ...prev,
                                            start: { ...prev.start, [mod]: !prev.start[mod] }
                                        }))}
                                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${hotkeys.start[mod]
                                            ? 'bg-[#DCFE50]/20 border-[#DCFE50] text-[#DCFE50]'
                                            : 'bg-white/5 border-gray-700 text-gray-400'
                                            }`}
                                    >
                                        {mod.charAt(0).toUpperCase() + mod.slice(1)}
                                    </button>
                                ))}
                                <select
                                    value={hotkeys.start.key}
                                    onChange={(e) => setHotkeys(prev => ({
                                        ...prev,
                                        start: { ...prev.start, key: e.target.value }
                                    }))}
                                    className="flex-1 bg-[#0a0a0f] border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
                                >
                                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(k => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(k => (
                                        <option key={k} value={String(k)}>{k}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-xs text-gray-500">Current: {formatHotkey(hotkeys.start)}</div>
                        </div>

                        {/* Stop Recording Hotkey */}
                        <div className="mb-6">
                            <label className="text-sm text-gray-400 mb-2 block">Stop Recording</label>
                            <div className="flex gap-2 mb-2">
                                {['ctrl', 'shift', 'alt'].map((mod) => (
                                    <button
                                        key={mod}
                                        onClick={() => setHotkeys(prev => ({
                                            ...prev,
                                            stop: { ...prev.stop, [mod]: !prev.stop[mod] }
                                        }))}
                                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${hotkeys.stop[mod]
                                            ? 'bg-[#DCFE50]/20 border-[#DCFE50] text-[#DCFE50]'
                                            : 'bg-white/5 border-gray-700 text-gray-400'
                                            }`}
                                    >
                                        {mod.charAt(0).toUpperCase() + mod.slice(1)}
                                    </button>
                                ))}
                                <select
                                    value={hotkeys.stop.key}
                                    onChange={(e) => setHotkeys(prev => ({
                                        ...prev,
                                        stop: { ...prev.stop, key: e.target.value }
                                    }))}
                                    className="flex-1 bg-[#0a0a0f] border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
                                >
                                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(k => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(k => (
                                        <option key={k} value={String(k)}>{k}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-xs text-gray-500">Current: {formatHotkey(hotkeys.stop)}</div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowHotkeySettings(false)}
                                className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveHotkeys}
                                className="flex-1 py-2 bg-[#DCFE50] text-black font-bold rounded-lg hover:bg-[#c9e845] transition-all"
                            >
                                Save Hotkeys
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
