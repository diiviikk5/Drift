"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function RecordingPreview({ className = "" }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    useEffect(() => {
        // Auto-start recording animation
        const timer = setTimeout(() => setIsRecording(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isRecording) {
            const interval = setInterval(() => {
                setRecordingTime((t) => (t + 1) % 3600);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <motion.div
            className={`relative rounded-2xl overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            {/* Browser window frame */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-[#2a2a4a] overflow-hidden shadow-2xl shadow-indigo-500/10">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#12121f] border-b border-[#2a2a4a]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="bg-[#1a1a2e] px-4 py-1 rounded-md text-xs text-gray-400 font-mono">
                            drift.app
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="relative p-6 min-h-[280px] bg-gradient-to-br from-[#1a1a2e] to-[#12121f]">
                    {/* Grid background */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.8) 1px, transparent 1px)
              `,
                            backgroundSize: "30px 30px",
                        }}
                    />

                    {/* Mock IDE content */}
                    <div className="relative">
                        {/* Code lines */}
                        <div className="space-y-2 font-mono text-sm">
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className="text-gray-600 w-6">1</span>
                                <span className="text-purple-400">const</span>
                                <span className="text-blue-300">drift</span>
                                <span className="text-white">=</span>
                                <span className="text-yellow-300">{`{`}</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <span className="text-gray-600 w-6">2</span>
                                <span className="text-gray-500 pl-4">effect:</span>
                                <span className="text-green-400">"cinematic"</span><span className="text-white">,</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <span className="text-gray-600 w-6">3</span>
                                <span className="text-gray-500 pl-4">quality:</span>
                                <span className="text-orange-400">4</span><span className="text-white">K,</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1 }}
                            >
                                <span className="text-gray-600 w-6">4</span>
                                <span className="text-gray-500 pl-4">privacy:</span>
                                <span className="text-cyan-400">true</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 }}
                            >
                                <span className="text-gray-600 w-6">5</span>
                                <span className="text-yellow-300">{`}`}</span>
                            </motion.div>
                        </div>

                        {/* Animated cursor */}
                        <motion.div
                            className="absolute w-0.5 h-5 bg-indigo-400"
                            animate={{
                                opacity: [1, 0, 1],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                            }}
                            style={{
                                left: "200px",
                                top: "75px",
                            }}
                        />

                        {/* Drift zoom effect overlay */}
                        <motion.div
                            className="absolute inset-0 border-2 border-indigo-500/30 rounded-lg pointer-events-none"
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>
                </div>

                {/* Recording overlay */}
                <div className="absolute top-16 right-6 flex items-center gap-3">
                    <motion.div
                        className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        <motion.div
                            className="w-2.5 h-2.5 rounded-full bg-red-500"
                            animate={{
                                opacity: isRecording ? [1, 0.4, 1] : 1,
                            }}
                            transition={{
                                duration: 1,
                                repeat: isRecording ? Infinity : 0,
                            }}
                        />
                        <span className="text-white text-xs font-mono">
                            {formatTime(recordingTime)}
                        </span>
                    </motion.div>
                </div>

                {/* Control bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#12121f] border-t border-[#2a2a4a]">
                    <div className="flex items-center gap-3">
                        <motion.button
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? "bg-red-500/20 text-red-400" : "bg-indigo-500/20 text-indigo-400"
                                }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsRecording(!isRecording)}
                        >
                            {isRecording ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="8" />
                                </svg>
                            )}
                        </motion.button>

                        <span className="text-xs text-gray-500">
                            {isRecording ? "Recording..." : "Ready"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">1920×1080</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500 font-mono">60fps</span>
                    </div>
                </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 opacity-60" />
        </motion.div>
    );
}

// Smaller inline preview
export function MiniRecordingPreview({ className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4a] overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#12121f]">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                </div>
                <div className="p-4 h-24 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <polygon points="9 6 19 12 9 18 9 6" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
