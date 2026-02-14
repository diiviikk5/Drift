"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Monitor, AppWindow, Chrome } from "lucide-react";
import drift from "@/lib/tauri-bridge";

export default function SourceSelector({ onSelect, onClose }) {
    const [platform, setPlatform] = useState('browser');
    const [nativeSources, setNativeSources] = useState([]);
    const [thumbnails, setThumbnails] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const p = drift.isTauri() ? 'tauri' : drift.isElectron() ? 'electron' : 'browser';
        setPlatform(p);

        if (p === 'tauri') {
            setLoading(true);
            drift.getSources().then(async (srcs) => {
                setNativeSources(srcs);
                // Load thumbnails
                const thumbs = {};
                for (let i = 0; i < srcs.length; i++) {
                    try {
                        const pngBytes = await drift.captureScreenshot(i);
                        if (pngBytes?.length > 0) {
                            const blob = new Blob([new Uint8Array(pngBytes)], { type: 'image/png' });
                            thumbs[srcs[i].id] = URL.createObjectURL(blob);
                        }
                    } catch {}
                }
                setThumbnails(thumbs);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, []);

    const browserSources = [
        {
            id: "screen",
            icon: Monitor,
            title: "Entire Screen",
            description: "Record your full screen",
            displaySurface: "monitor",
        },
        {
            id: "window",
            icon: AppWindow,
            title: "Application Window",
            description: "Record a specific app",
            displaySurface: "window",
        },
        {
            id: "tab",
            icon: Chrome,
            title: "Browser Tab",
            description: "Record a browser tab with audio",
            displaySurface: "browser",
        },
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
                className="brutal-box p-6 max-w-xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-mono font-bold text-xl uppercase">
                        {platform === 'tauri' ? 'Select Monitor' : 'Select Source'}
                    </h2>
                    <motion.button
                        onClick={onClose}
                        className="p-2 border-2 border-[var(--border-default)] hover:bg-[var(--brutal-pink)] hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Native Monitors (Tauri) */}
                {platform === 'tauri' && (
                    <div className="grid gap-3 mb-4">
                        {loading ? (
                            <div className="text-center py-8 text-sm text-gray-400">Loading monitors...</div>
                        ) : nativeSources.map((src, i) => (
                            <motion.button
                                key={src.id}
                                onClick={() => onSelect(src.id)}
                                className="brutal-box p-3 flex items-center gap-4 text-left hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_var(--border-default)] transition-all"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="w-24 h-14 border-2 border-[var(--border-default)] overflow-hidden rounded bg-black flex-shrink-0">
                                    {thumbnails[src.id] ? (
                                        <img src={thumbnails[src.id]} alt={src.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Monitor className="w-6 h-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-mono font-bold text-base uppercase">{src.name}</h3>
                                    <p className="font-mono text-xs text-[var(--text-muted)]">
                                        {src.width}×{src.height} {src.is_primary ? '• Primary' : ''}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Browser Sources */}
                <div className="grid gap-4">
                    {browserSources.map((source) => {
                        const Icon = source.icon;
                        return (
                            <motion.button
                                key={source.id}
                                onClick={() => onSelect(source.displaySurface)}
                                className="brutal-box p-4 flex items-center gap-4 text-left hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_var(--border-default)] transition-all"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="w-14 h-14 bg-[var(--brutal-yellow)] border-2 border-[var(--border-default)] flex items-center justify-center shrink-0">
                                    <Icon className="w-7 h-7 text-[#0a0a0a]" />
                                </div>
                                <div>
                                    <h3 className="font-mono font-bold text-lg uppercase">{source.title}</h3>
                                    <p className="font-mono text-sm text-[var(--text-muted)]">{source.description}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <p className="mt-6 font-mono text-xs text-[var(--text-muted)] text-center">
                    {platform === 'tauri'
                        ? 'Select a monitor or use the system screen picker'
                        : 'Your browser will prompt you to select the specific source'
                    }
                </p>
            </motion.div>
        </motion.div>
    );
}
