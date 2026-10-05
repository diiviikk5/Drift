'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CountdownOverlay({ count, onCancel }) {
    if (!count || count <= 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 select-none">
            <motion.div
                key={count}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex items-center justify-center w-36 h-36 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--accent-app)]"
                style={{ boxShadow: 'var(--shadow-pop)' }}
            >
                <span className="text-7xl font-semibold text-[var(--text-app)] tabular-nums">{count}</span>
            </motion.div>

            <p className="mt-6 text-[15px] text-white/80">Recording starts in {count}…</p>

            <button
                onClick={onCancel}
                className="mt-4 h-8 px-4 rounded-full bg-white/10 hover:bg-white/20 text-[13px] text-white/70 hover:text-white transition-colors"
            >
                Cancel <span className="opacity-60">(Esc)</span>
            </button>
        </div>
    );
}
