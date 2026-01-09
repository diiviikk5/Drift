"use client";

import { motion } from "framer-motion";
import {
    Play,
    Pause,
    Square,
    Video,
    VideoOff,
    Settings,
    Zap,
    ZapOff,
    Monitor
} from "lucide-react";

export default function ControlBar({
    recordingState,
    onStart,
    onPause,
    onResume,
    onStop,
    onToggleWebcam,
    onOpenWebcamSettings,
    onChangeSource,
    webcamEnabled,
    driftEnabled,
    onToggleDrift,
}) {
    const isRecording = recordingState === "recording";
    const isPaused = recordingState === "paused";
    const isIdle = recordingState === "idle" || recordingState === "stopped";

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-4 flex items-center justify-center gap-4"
        >
            <div className="brutal-box flex items-center gap-2 p-2">
                {/* Change Source */}
                <motion.button
                    onClick={onChangeSource}
                    className="p-3 border-2 border-[var(--border-default)] bg-[var(--bg-tertiary)] 
                     hover:bg-[var(--brutal-yellow)] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Change Source"
                >
                    <Monitor className="w-5 h-5" />
                </motion.button>

                {/* Webcam Toggle */}
                <motion.button
                    onClick={onToggleWebcam}
                    className={`p-3 border-2 border-[var(--border-default)] transition-colors
                     ${webcamEnabled
                            ? "bg-[var(--brutal-pink)] text-white"
                            : "bg-[var(--bg-tertiary)] hover:bg-[var(--brutal-pink)] hover:text-white"
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={webcamEnabled ? "Disable Webcam" : "Enable Webcam"}
                >
                    {webcamEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </motion.button>

                {/* Webcam Settings */}
                {webcamEnabled && (
                    <motion.button
                        onClick={onOpenWebcamSettings}
                        className="p-3 border-2 border-[var(--border-default)] bg-[var(--bg-tertiary)] 
                       hover:bg-[var(--brutal-blue)] hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Webcam Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </motion.button>
                )}

                {/* Drift Toggle */}
                <motion.button
                    onClick={onToggleDrift}
                    className={`p-3 border-2 border-[var(--border-default)] transition-colors
                     ${driftEnabled
                            ? "bg-[var(--brutal-yellow)] text-black"
                            : "bg-[var(--bg-tertiary)] hover:bg-[var(--brutal-yellow)]"
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={driftEnabled ? "Disable Drift Effect" : "Enable Drift Effect"}
                >
                    {driftEnabled ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
                </motion.button>
            </div>

            {/* Recording Controls */}
            <div className="brutal-box flex items-center gap-2 p-2">
                {isIdle && (
                    <motion.button
                        onClick={onStart}
                        className="brutal-button brutal-button-pink px-8 py-3 flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Play className="w-5 h-5" />
                        <span>RECORD</span>
                    </motion.button>
                )}

                {isRecording && (
                    <>
                        <motion.button
                            onClick={onPause}
                            className="brutal-button px-6 py-3 flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Pause className="w-5 h-5" />
                            <span>PAUSE</span>
                        </motion.button>

                        <motion.button
                            onClick={onStop}
                            className="brutal-button brutal-button-pink px-6 py-3 flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Square className="w-5 h-5" />
                            <span>STOP</span>
                        </motion.button>
                    </>
                )}

                {isPaused && (
                    <>
                        <motion.button
                            onClick={onResume}
                            className="brutal-button px-6 py-3 flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Play className="w-5 h-5" />
                            <span>RESUME</span>
                        </motion.button>

                        <motion.button
                            onClick={onStop}
                            className="brutal-button brutal-button-pink px-6 py-3 flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Square className="w-5 h-5" />
                            <span>STOP</span>
                        </motion.button>
                    </>
                )}
            </div>
        </motion.div>
    );
}
