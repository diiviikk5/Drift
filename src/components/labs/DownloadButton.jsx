'use client';

import { motion } from 'framer-motion';
import { Download, FileDown, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

/**
 * Download Button Component
 * Allows users to download converted files with neo-brutalist styling
 */
export default function DownloadButton({
    blob,
    filename,
    disabled = false,
    size = 'default', // 'default' | 'large'
}) {
    const [downloaded, setDownloaded] = useState(false);

    const handleDownload = useCallback(() => {
        if (!blob || disabled) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    }, [blob, filename, disabled]);

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isLarge = size === 'large';

    return (
        <div className="w-full">
            {/* File info card */}
            {blob && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-[var(--bg-tertiary)] border-[3px] border-[var(--border-default)]"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center bg-[var(--brutal-yellow)] border-2 border-[var(--brutal-black)]">
                            <FileDown className="w-6 h-6 text-[var(--brutal-black)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-mono font-bold text-[var(--text-primary)] text-sm truncate">
                                {filename}
                            </p>
                            <p className="font-mono text-[var(--text-muted)] text-xs mt-1">
                                {formatFileSize(blob.size)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Download button */}
            <motion.button
                onClick={handleDownload}
                disabled={disabled || !blob}
                whileHover={!disabled && blob ? { scale: 1.02, x: -3, y: -3 } : undefined}
                whileTap={!disabled && blob ? { scale: 0.98, x: 3, y: 3 } : undefined}
                className={`
          w-full flex items-center justify-center gap-3
          ${isLarge ? 'py-5 px-8' : 'py-4 px-6'}
          font-mono font-bold uppercase tracking-wider
          border-[3px] border-[var(--brutal-black)]
          transition-all duration-100
          ${disabled || !blob
                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                        : downloaded
                            ? 'bg-[var(--brutal-yellow)] text-[var(--brutal-black)] shadow-[var(--shadow-brutal-md)]'
                            : 'bg-[var(--brutal-pink)] text-white shadow-[var(--shadow-brutal-md)] hover:shadow-[10px_10px_0px_var(--brutal-black)]'
                    }
        `}
            >
                {downloaded ? (
                    <>
                        <Check className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
                        <span className={isLarge ? 'text-lg' : 'text-base'}>Downloaded!</span>
                    </>
                ) : (
                    <>
                        <Download className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
                        <span className={isLarge ? 'text-lg' : 'text-base'}>Download File</span>
                    </>
                )}
            </motion.button>

            {/* Privacy reminder */}
            <p className="mt-3 text-center font-mono text-[var(--text-muted)] text-xs">
                🔒 File processed locally. Never uploaded.
            </p>
        </div>
    );
}
