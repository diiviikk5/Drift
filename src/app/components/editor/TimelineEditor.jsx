"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRecording } from "@/context/RecordingContext";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Download,
    Scissors,
    ZoomIn,
    Trash2,
    ArrowLeft,
    Volume2,
    VolumeX,
} from "lucide-react";
import ExportModal from "./ExportModal";

export default function TimelineEditor() {
    const { recordedUrl, recordedBlob, zoomKeyframes, removeZoomKeyframe, updateZoomKeyframe } = useRecording();

    const videoRef = useRef(null);
    const timelineRef = useRef(null);

    // State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(100);
    const [selectedKeyframe, setSelectedKeyframe] = useState(null);

    // Update time on video progress
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setTrimEnd(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("ended", handleEnded);
        };
    }, []);

    // Format time as MM:SS.ms
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
    };

    // Play/Pause toggle
    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    // Seek to position
    const seekTo = useCallback((time) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(0, Math.min(duration, time));
    }, [duration]);

    // Skip forward/back
    const skip = useCallback((seconds) => {
        seekTo(currentTime + seconds);
    }, [currentTime, seekTo]);

    // Handle timeline click
    const handleTimelineClick = useCallback((e) => {
        if (!timelineRef.current || duration === 0) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * duration;

        seekTo(newTime);
    }, [duration, seekTo]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !isMuted;
        setIsMuted(!isMuted);
    }, [isMuted]);

    // Check if we have a recording
    if (!recordedUrl) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
                <header className="h-16 border-b-4 border-[var(--border-default)] bg-[var(--bg-secondary)] flex items-center px-6">
                    <Link href="/studio" className="flex items-center gap-2 font-mono font-bold uppercase hover:text-[var(--brutal-pink)]">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Studio
                    </Link>
                </header>

                <main className="flex-1 flex items-center justify-center">
                    <div className="brutal-box p-8 text-center max-w-md">
                        <h2 className="font-mono font-bold text-2xl uppercase mb-4">
                            No Recording Found
                        </h2>
                        <p className="font-mono text-sm text-[var(--text-muted)] mb-6">
                            Record something first, then come back here to edit it.
                        </p>
                        <Link href="/studio" className="brutal-button inline-block">
                            Go to Studio
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
            {/* Header */}
            <header className="h-16 border-b-4 border-[var(--border-default)] bg-[var(--bg-secondary)] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link href="/studio" className="flex items-center gap-2 font-mono font-bold uppercase hover:text-[var(--brutal-pink)]">
                        <ArrowLeft className="w-5 h-5" />
                        Studio
                    </Link>
                    <div className="w-px h-8 bg-[var(--border-default)]" />
                    <h1 className="font-mono font-bold text-xl uppercase">
                        Timeline Editor
                    </h1>
                </div>

                <motion.button
                    onClick={() => setShowExportModal(true)}
                    className="brutal-button brutal-button-pink flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Download className="w-5 h-5" />
                    Export
                </motion.button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-6 gap-6">
                {/* Video Preview */}
                <div className="flex-1 flex items-center justify-center bg-[var(--brutal-black)] border-4 border-[var(--border-default)] shadow-[8px_8px_0px_var(--border-default)]">
                    <video
                        ref={videoRef}
                        src={recordedUrl}
                        className="max-w-full max-h-full"
                        onClick={togglePlay}
                    />
                </div>

                {/* Controls Bar */}
                <div className="brutal-box p-4">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        {/* Skip Back */}
                        <motion.button
                            onClick={() => skip(-5)}
                            className="p-3 border-2 border-[var(--border-default)] bg-[var(--bg-tertiary)] 
                         hover:bg-[var(--brutal-yellow)] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <SkipBack className="w-5 h-5" />
                        </motion.button>

                        {/* Play/Pause */}
                        <motion.button
                            onClick={togglePlay}
                            className="p-4 border-3 border-[var(--border-default)] bg-[var(--brutal-yellow)] 
                         shadow-[4px_4px_0px_var(--border-default)]"
                            style={{ borderWidth: "3px" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </motion.button>

                        {/* Skip Forward */}
                        <motion.button
                            onClick={() => skip(5)}
                            className="p-3 border-2 border-[var(--border-default)] bg-[var(--bg-tertiary)] 
                         hover:bg-[var(--brutal-yellow)] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <SkipForward className="w-5 h-5" />
                        </motion.button>

                        <div className="w-px h-8 bg-[var(--border-default)]" />

                        {/* Mute Toggle */}
                        <motion.button
                            onClick={toggleMute}
                            className={`p-3 border-2 border-[var(--border-default)] transition-colors
                         ${isMuted
                                    ? "bg-[var(--brutal-pink)] text-white"
                                    : "bg-[var(--bg-tertiary)] hover:bg-[var(--brutal-pink)] hover:text-white"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </motion.button>

                        {/* Time Display */}
                        <div className="font-mono text-sm bg-[var(--bg-tertiary)] px-4 py-2 border-2 border-[var(--border-default)]">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div
                        ref={timelineRef}
                        onClick={handleTimelineClick}
                        className="relative h-16 bg-[var(--bg-tertiary)] border-3 border-[var(--border-default)] cursor-pointer"
                        style={{ borderWidth: "3px" }}
                    >
                        {/* Progress */}
                        <div
                            className="absolute top-0 left-0 h-full bg-[var(--brutal-yellow)] opacity-50"
                            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        />

                        {/* Playhead */}
                        <div
                            className="absolute top-0 w-1 h-full bg-[var(--brutal-pink)] z-10"
                            style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--brutal-pink)] border-2 border-[var(--border-default)] rotate-45" />
                        </div>

                        {/* Zoom Keyframes */}
                        {zoomKeyframes.map((keyframe, index) => (
                            <motion.div
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedKeyframe(index);
                                }}
                                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer
                           border-2 border-[var(--border-default)]
                           ${selectedKeyframe === index
                                        ? "bg-[var(--brutal-blue)] scale-125"
                                        : "bg-[var(--brutal-yellow)]"
                                    }
                           ${keyframe.type === "zoomIn" ? "rotate-45" : "rounded-full"}`}
                                style={{ left: `calc(${(keyframe.time / 1000 / duration) * 100}% - 8px)` }}
                                whileHover={{ scale: 1.2 }}
                            >
                                <ZoomIn className="w-2 h-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Keyframe Editor Panel */}
                {selectedKeyframe !== null && zoomKeyframes[selectedKeyframe] && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="brutal-box p-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-mono font-bold uppercase">
                                Keyframe #{selectedKeyframe + 1}
                            </h3>
                            <motion.button
                                onClick={() => {
                                    removeZoomKeyframe(selectedKeyframe);
                                    setSelectedKeyframe(null);
                                }}
                                className="p-2 border-2 border-[var(--border-default)] bg-[var(--brutal-pink)] text-white"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <label className="block">
                                <span className="font-mono text-sm block mb-1">Zoom Level</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="4"
                                    step="0.1"
                                    value={zoomKeyframes[selectedKeyframe].zoom}
                                    onChange={(e) => updateZoomKeyframe(selectedKeyframe, { zoom: parseFloat(e.target.value) })}
                                    className="w-full"
                                />
                                <span className="font-mono text-xs">{zoomKeyframes[selectedKeyframe].zoom}x</span>
                            </label>

                            <label className="block">
                                <span className="font-mono text-sm block mb-1">Duration</span>
                                <input
                                    type="range"
                                    min="200"
                                    max="1000"
                                    step="50"
                                    value={zoomKeyframes[selectedKeyframe].duration}
                                    onChange={(e) => updateZoomKeyframe(selectedKeyframe, { duration: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <span className="font-mono text-xs">{zoomKeyframes[selectedKeyframe].duration}ms</span>
                            </label>

                            <label className="block">
                                <span className="font-mono text-sm block mb-1">Type</span>
                                <select
                                    value={zoomKeyframes[selectedKeyframe].type}
                                    onChange={(e) => updateZoomKeyframe(selectedKeyframe, { type: e.target.value })}
                                    className="brutal-input py-2"
                                >
                                    <option value="zoomIn">Zoom In</option>
                                    <option value="zoomOut">Zoom Out</option>
                                </select>
                            </label>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Export Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <ExportModal
                        videoBlob={recordedBlob}
                        onClose={() => setShowExportModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
