"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Download, Loader2, Check, Film, Image, Sparkles } from "lucide-react";
import { getMediaExporter, QUALITY_PRESETS, EXPORT_FORMATS } from "@/lib/export/MediaExporter";

export default function ExportModal({ videoBlob, onClose }) {
    const [format, setFormat] = useState("mp4");
    const [quality, setQuality] = useState("1080p");
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);

    const formats = [
        { id: "mp4", label: "MP4", icon: Film, description: "H.264 · Universal" },
        { id: "webm", label: "WebM", icon: Film, description: "VP9 · Web-native" },
        { id: "gif", label: "GIF", icon: Image, description: "Animated image" },
    ];

    const qualities = [
        { id: "4k", label: "4K", detail: "3840×2160 · 20 Mbps" },
        { id: "1080p", label: "1080p", detail: "1920×1080 · 8 Mbps" },
        { id: "720p", label: "720p", detail: "1280×720 · 4 Mbps" },
    ];

    // Export video
    const handleExport = useCallback(async () => {
        if (!videoBlob) {
            setError("No video to export");
            return;
        }

        setIsExporting(true);
        setProgress(0);
        setError(null);

        try {
            const exporter = getMediaExporter();
            const blob = await exporter.export(videoBlob, {
                format,
                quality,
                onProgress: (p) => setProgress(Math.round(p * 100)),
            });

            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (err) {
            console.error('[Export] Failed:', err);
            setError(err.message);
        } finally {
            setIsExporting(false);
        }
    }, [videoBlob, format, quality]);

    // Trigger download
    const handleDownload = useCallback(() => {
        if (!downloadUrl) return;

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `drift-recording-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, [downloadUrl, format]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [downloadUrl]);

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
                className="brutal-box p-6 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-mono font-bold text-xl uppercase">
                        Export Recording
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

                {/* Format Selection */}
                <div className="mb-6">
                    <label className="font-mono font-bold text-sm uppercase block mb-3">
                        Format
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {formats.map((f) => {
                            const Icon = f.icon;
                            const isActive = format === f.id;

                            return (
                                <motion.button
                                    key={f.id}
                                    onClick={() => setFormat(f.id)}
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
                                    <span className={`font-mono text-sm font-bold uppercase ${isActive ? "text-[#0a0a0a]" : ""}`}>
                                        {f.label}
                                    </span>
                                    <span className={`font-mono text-xs ${isActive ? "text-[#0a0a0a]" : "text-[var(--text-muted)]"}`}>
                                        {f.description}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Quality Selection */}
                <div className="mb-6">
                    <label className="font-mono font-bold text-sm uppercase block mb-3">
                        Quality
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {qualities.map((q) => {
                            const isActive = quality === q.id;
                            return (
                                <motion.button
                                    key={q.id}
                                    onClick={() => setQuality(q.id)}
                                    className={`p-3 border-3 transition-all
                             ${isActive
                                            ? "bg-[var(--brutal-pink)] text-white border-[var(--border-default)] shadow-[4px_4px_0px_var(--border-default)]"
                                            : "bg-[var(--bg-tertiary)] border-[var(--border-default)] hover:shadow-[4px_4px_0px_var(--border-default)]"
                                        }`}
                                    style={{ borderWidth: "3px" }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="font-mono text-sm font-bold uppercase block">
                                        {q.label}
                                    </span>
                                    <span className={`font-mono text-xs ${isActive ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                                        {q.detail}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Progress Bar */}
                {isExporting && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm">Exporting...</span>
                            <span className="font-mono text-sm">{progress}%</span>
                        </div>
                        <div className="h-4 bg-[var(--bg-tertiary)] border-2 border-[var(--border-default)]">
                            <motion.div
                                className="h-full bg-[var(--brutal-yellow)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-[var(--brutal-pink)] text-white border-2 border-[var(--border-default)] font-mono text-sm">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    {!downloadUrl ? (
                        <motion.button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="brutal-button brutal-button-pink flex-1 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <Film className="w-5 h-5" />
                                    <span>Export</span>
                                </>
                            )}
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={handleDownload}
                            className="brutal-button flex-1 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Download className="w-5 h-5" />
                            <span>Download {format.toUpperCase()}</span>
                        </motion.button>
                    )}
                </div>

                {/* File Info */}
                {videoBlob && (
                    <p className="mt-4 font-mono text-xs text-[var(--text-muted)] text-center">
                        File size: {(videoBlob.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
}
