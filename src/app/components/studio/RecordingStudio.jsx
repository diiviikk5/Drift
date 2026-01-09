"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Professional easing
const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export default function RecordingStudio() {
    // Video/Canvas refs
    const sourceVideoRef = useRef(null);
    const outputCanvasRef = useRef(null);
    const ctxRef = useRef(null);
    const renderIntervalRef = useRef(null);

    // State
    const [videoUrl, setVideoUrl] = useState(null);
    const [clickEvents, setClickEvents] = useState([]);
    const [settings, setSettings] = useState({ zoomLevel: 2, zoomSpeed: 400 });
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedUrl, setProcessedUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Zoom state for rendering
    const zoomRef = useRef({
        current: 1,
        target: 1,
        centerX: 960,
        centerY: 540,
        targetX: 960,
        targetY: 540,
        animating: false,
        startTime: 0,
        startZoom: 1,
        startX: 960,
        startY: 540,
    });

    // Load recording from extension storage
    useEffect(() => {
        const loadRecording = async () => {
            // Check URL params
            const params = new URLSearchParams(window.location.search);
            const fromExtension = params.get('source') === 'extension';

            if (fromExtension && typeof chrome !== 'undefined' && chrome.storage) {
                try {
                    const data = await chrome.storage.local.get([
                        'recordingData',
                        'recordingClickEvents',
                        'recordingSettings',
                        'recordingDuration'
                    ]);

                    if (data.recordingData) {
                        setVideoUrl(data.recordingData);
                        setClickEvents(data.recordingClickEvents || []);
                        setSettings(data.recordingSettings || { zoomLevel: 2, zoomSpeed: 400 });
                        setDuration(data.recordingDuration || 0);
                    }
                } catch (e) {
                    console.error('Failed to load from extension:', e);
                }
            }

            setIsLoading(false);
        };

        loadRecording();
    }, []);

    // Initialize canvas
    useEffect(() => {
        if (outputCanvasRef.current) {
            outputCanvasRef.current.width = 1920;
            outputCanvasRef.current.height = 1080;
            ctxRef.current = outputCanvasRef.current.getContext("2d", { alpha: false });
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (renderIntervalRef.current) clearInterval(renderIntervalRef.current);
        };
    }, []);

    // Check if we should zoom at current time
    const checkZoomTrigger = useCallback((time) => {
        const timeMs = time * 1000;

        for (const click of clickEvents) {
            const clickTime = click.timestamp;
            // Trigger zoom if we're within 50ms of a click
            if (Math.abs(timeMs - clickTime) < 50) {
                triggerZoom(click.screenX, click.screenY);
                break;
            }
        }
    }, [clickEvents]);

    // Trigger zoom
    const triggerZoom = useCallback((screenX, screenY) => {
        const z = zoomRef.current;

        // Convert screen coords to canvas coords
        const scaleX = 1920 / (window.screen?.width || 1920);
        const scaleY = 1080 / (window.screen?.height || 1080);
        const canvasX = Math.max(200, Math.min(1720, screenX * scaleX));
        const canvasY = Math.max(200, Math.min(880, screenY * scaleY));

        z.startTime = performance.now();
        z.startZoom = z.current;
        z.startX = z.centerX;
        z.startY = z.centerY;
        z.target = settings.zoomLevel;
        z.targetX = canvasX;
        z.targetY = canvasY;
        z.animating = true;

        // Auto reset
        setTimeout(() => {
            z.startTime = performance.now();
            z.startZoom = z.current;
            z.startX = z.centerX;
            z.startY = z.centerY;
            z.target = 1;
            z.targetX = 960;
            z.targetY = 540;
            z.animating = true;
        }, 1200 + settings.zoomSpeed);
    }, [settings]);

    // Render loop with zoom
    const render = useCallback(() => {
        if (!ctxRef.current || !sourceVideoRef.current) return;

        const ctx = ctxRef.current;
        const canvas = outputCanvasRef.current;
        const video = sourceVideoRef.current;
        const now = performance.now();
        const z = zoomRef.current;

        // Update zoom animation
        if (z.animating) {
            const elapsed = now - z.startTime;
            const progress = Math.min(elapsed / settings.zoomSpeed, 1);
            const eased = easeOutExpo(progress);

            z.current = z.startZoom + (z.target - z.startZoom) * eased;
            z.centerX = z.startX + (z.targetX - z.startX) * eased;
            z.centerY = z.startY + (z.targetY - z.startY) * eased;

            if (progress >= 1) z.animating = false;
        }

        // Clear
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw video with zoom
        if (video.readyState >= 2) {
            ctx.save();

            if (z.current !== 1) {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(z.current, z.current);
                ctx.translate(-z.centerX, -z.centerY);
            }

            // Scale video to fill canvas
            const vw = video.videoWidth || 1920;
            const vh = video.videoHeight || 1080;
            const scale = Math.max(canvas.width / vw, canvas.height / vh);
            const dw = vw * scale;
            const dh = vh * scale;
            const dx = (canvas.width - dw) / 2;
            const dy = (canvas.height - dh) / 2;

            ctx.drawImage(video, dx, dy, dw, dh);
            ctx.restore();

            // Draw click ripple during zoom
            if (z.current > 1.1) {
                const gradient = ctx.createRadialGradient(z.centerX, z.centerY, 0, z.centerX, z.centerY, 50);
                gradient.addColorStop(0, "rgba(255, 220, 0, 0.5)");
                gradient.addColorStop(1, "rgba(255, 220, 0, 0)");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(z.centerX, z.centerY, 50, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Check for zoom triggers
        checkZoomTrigger(video.currentTime);
    }, [settings, checkZoomTrigger]);

    // Start/stop preview render loop
    const startPreview = useCallback(() => {
        if (!renderIntervalRef.current) {
            renderIntervalRef.current = setInterval(render, 1000 / 60);
        }
    }, [render]);

    const stopPreview = useCallback(() => {
        if (renderIntervalRef.current) {
            clearInterval(renderIntervalRef.current);
            renderIntervalRef.current = null;
        }
    }, []);

    // Video event handlers
    const handleVideoLoad = () => {
        if (sourceVideoRef.current) {
            setDuration(sourceVideoRef.current.duration);
            startPreview();
        }
    };

    const handleTimeUpdate = () => {
        if (sourceVideoRef.current) {
            setCurrentTime(sourceVideoRef.current.currentTime);
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const togglePlay = () => {
        if (sourceVideoRef.current) {
            if (isPlaying) {
                sourceVideoRef.current.pause();
            } else {
                sourceVideoRef.current.play();
            }
        }
    };

    // Export with zoom effects baked in
    const handleExport = async () => {
        if (!sourceVideoRef.current || !outputCanvasRef.current) return;

        setIsProcessing(true);

        const video = sourceVideoRef.current;
        const canvas = outputCanvasRef.current;

        // Reset video to start
        video.currentTime = 0;
        await new Promise(r => setTimeout(r, 100));

        // Capture stream from canvas
        const canvasStream = canvas.captureStream(60);
        const chunks = [];

        const recorder = new MediaRecorder(canvasStream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 15000000
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            setProcessedUrl(URL.createObjectURL(blob));
            setIsProcessing(false);
        };

        recorder.start(100);

        // Play video through and record
        video.play();

        video.onended = () => {
            recorder.stop();
            video.pause();
        };
    };

    // Download
    const handleDownload = () => {
        if (processedUrl) {
            const a = document.createElement('a');
            a.href = processedUrl;
            a.download = `drift-${Date.now()}.webm`;
            a.click();
        }
    };

    // File upload handler
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoUrl(URL.createObjectURL(file));
        }
    };

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = Math.floor(s % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-center">
                    <div className="brutal-badge-pink text-lg mb-4">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
            {/* Header */}
            <header className="h-16 border-b-4 border-[var(--border-default)] bg-[var(--bg-secondary)] flex items-center justify-between px-6">
                <Link href="/" className="font-mono font-bold text-2xl uppercase tracking-wider text-[var(--text-primary)]">
                    Drift<span className="text-[var(--brutal-pink)]">_</span>Studio
                </Link>
                <div className="flex items-center gap-3">
                    {clickEvents.length > 0 && (
                        <div className="brutal-badge" style={{ background: 'var(--brutal-yellow)', color: '#000' }}>
                            ⚡ {clickEvents.length} zoom points
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 flex">
                {/* Preview Area */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1 bg-[var(--brutal-black)] border-4 border-[var(--border-default)] shadow-[8px_8px_0px_var(--border-default)] relative overflow-hidden">
                        {/* Hidden source video */}
                        <video
                            ref={sourceVideoRef}
                            src={videoUrl}
                            onLoadedMetadata={handleVideoLoad}
                            onTimeUpdate={handleTimeUpdate}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            className="hidden"
                            muted
                        />

                        {/* Output canvas with zoom effects */}
                        <canvas
                            ref={outputCanvasRef}
                            className="w-full h-full object-contain"
                            style={{ display: videoUrl ? 'block' : 'none' }}
                        />

                        {/* No video loaded state */}
                        {!videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <label className="brutal-button text-lg cursor-pointer">
                                        📁 Load Video File
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="mt-4 font-mono text-sm text-[var(--text-muted)]">
                                        Or record with the Drift extension
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Processing overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="brutal-badge-pink text-lg mb-2">Processing...</div>
                                    <p className="font-mono text-sm">Applying zoom effects</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    {videoUrl && (
                        <div className="mt-4 brutal-box p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={togglePlay} className="brutal-button px-6 py-3">
                                    {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                                </button>
                                <div className="flex-1 font-mono text-sm">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="h-2 bg-[var(--bg-tertiary)] border-2 border-[var(--border-default)] relative">
                                <div
                                    className="h-full bg-[var(--brutal-pink)]"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                />
                                {/* Click markers */}
                                {clickEvents.map((click, i) => (
                                    <div
                                        key={i}
                                        className="absolute top-0 w-1 h-full bg-[var(--brutal-yellow)]"
                                        style={{ left: `${(click.timestamp / (duration * 1000)) * 100}%` }}
                                        title={`Zoom at ${formatTime(click.timestamp / 1000)}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Export buttons */}
                    {videoUrl && (
                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={handleExport}
                                disabled={isProcessing}
                                className="brutal-button flex-1 py-4"
                                style={{ background: 'var(--brutal-yellow)', color: '#000' }}
                            >
                                ✨ Apply Zoom Effects & Export
                            </button>
                            {processedUrl && (
                                <button onClick={handleDownload} className="brutal-button brutal-button-pink flex-1 py-4">
                                    ⬇️ Download Processed Video
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar: Zoom Settings */}
                <aside className="w-80 border-l-4 border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
                    <h2 className="font-mono font-bold text-lg uppercase mb-4 border-b-2 border-[var(--border-default)] pb-2">
                        Zoom Settings
                    </h2>

                    <div className="brutal-box p-4 mb-4">
                        <label className="block mb-4">
                            <span className="font-mono text-sm block mb-2">Zoom Level: {settings.zoomLevel}x</span>
                            <input
                                type="range"
                                min="1.5"
                                max="3.5"
                                step="0.1"
                                value={settings.zoomLevel}
                                onChange={(e) => setSettings(s => ({ ...s, zoomLevel: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                        </label>

                        <label className="block">
                            <span className="font-mono text-sm block mb-2">Zoom Speed: {settings.zoomSpeed}ms</span>
                            <input
                                type="range"
                                min="200"
                                max="800"
                                step="50"
                                value={settings.zoomSpeed}
                                onChange={(e) => setSettings(s => ({ ...s, zoomSpeed: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                        </label>
                    </div>

                    {clickEvents.length > 0 && (
                        <div className="brutal-box p-4">
                            <h3 className="font-mono font-bold text-sm uppercase mb-3">⚡ Zoom Points</h3>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {clickEvents.map((click, i) => (
                                    <div key={i} className="flex justify-between font-mono text-xs p-2 bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                                        <span>#{i + 1}</span>
                                        <span>{formatTime(click.timestamp / 1000)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
}
