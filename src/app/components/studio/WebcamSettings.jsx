"use client";

import { motion } from "framer-motion";
import { X, Circle, Square, RectangleHorizontal } from "lucide-react";

export default function WebcamSettings({ settings, onUpdate, onClose }) {
    const shapes = [
        { id: "circle", icon: Circle, label: "Circle" },
        { id: "rounded", icon: RectangleHorizontal, label: "Rounded" },
        { id: "square", icon: Square, label: "Square" },
    ];

    const positions = [
        { id: "top-left", label: "TL" },
        { id: "top-right", label: "TR" },
        { id: "bottom-left", label: "BL" },
        { id: "bottom-right", label: "BR" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="brutal-box p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-mono font-bold text-xl uppercase">
                        Webcam Settings
                    </h2>
                    <motion.button
                        onClick={onClose}
                        className="p-2 border-2 border-[var(--border-default)] hover:bg-[var(--brutal-pink)] 
                       hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Shape Selection */}
                <div className="mb-6">
                    <label className="font-mono font-bold text-sm uppercase block mb-3">
                        Shape
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {shapes.map((shape) => {
                            const Icon = shape.icon;
                            const isActive = settings.webcamShape === shape.id;
                            return (
                                <motion.button
                                    key={shape.id}
                                    onClick={() => onUpdate({ webcamShape: shape.id })}
                                    className={`p-4 border-3 flex flex-col items-center gap-2 transition-all
                             ${isActive
                                            ? "bg-[var(--brutal-yellow)] border-[var(--border-default)] shadow-[4px_4px_0px_var(--border-default)]"
                                            : "bg-[var(--bg-tertiary)] border-[var(--border-default)] hover:shadow-[4px_4px_0px_var(--border-default)]"
                                        }`}
                                    style={{ borderWidth: "3px" }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Icon className={`w-6 h-6 ${isActive ? "text-[#0a0a0a]" : ""}`} />
                                    <span className={`font-mono text-xs uppercase ${isActive ? "text-[#0a0a0a]" : ""}`}>
                                        {shape.label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Position Selection */}
                <div className="mb-6">
                    <label className="font-mono font-bold text-sm uppercase block mb-3">
                        Position
                    </label>
                    <div className="grid grid-cols-2 gap-2 w-32 mx-auto aspect-video border-3 border-[var(--border-default)] p-1 bg-[var(--bg-tertiary)]">
                        {positions.map((pos) => {
                            const isActive = settings.webcamPosition === pos.id;
                            return (
                                <motion.button
                                    key={pos.id}
                                    onClick={() => onUpdate({ webcamPosition: pos.id })}
                                    className={`aspect-square flex items-center justify-center font-mono text-xs font-bold
                             border-2 border-[var(--border-default)] transition-all
                             ${isActive
                                            ? "bg-[var(--brutal-pink)] text-white"
                                            : "bg-[var(--bg-secondary)] hover:bg-[var(--brutal-pink)] hover:text-white"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {pos.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Size */}
                <div className="mb-6">
                    <label className="font-mono font-bold text-sm uppercase block mb-2">
                        Size: {settings.webcamSize}px
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="400"
                        step="20"
                        value={settings.webcamSize}
                        onChange={(e) => onUpdate({ webcamSize: parseInt(e.target.value) })}
                        className="w-full"
                    />
                </div>

                {/* Mirror Toggle */}
                <label className="flex items-center justify-between p-4 brutal-box">
                    <span className="font-mono font-bold text-sm uppercase">
                        Mirror Webcam
                    </span>
                    <input
                        type="checkbox"
                        checked={settings.webcamMirrored}
                        onChange={(e) => onUpdate({ webcamMirrored: e.target.checked })}
                        className="w-6 h-6 accent-[var(--brutal-yellow)]"
                    />
                </label>
            </motion.div>
        </motion.div>
    );
}
