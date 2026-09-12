'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownOverlay({ count, onCancel }) {
    if (!count || count <= 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md select-none">
            <motion.div
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative flex items-center justify-center w-40 h-40 rounded-full border-4 border-[#DCFE50] bg-[#0E0F17] shadow-[0_0_60px_rgba(220,254,80,0.4)]"
            >
                <span className="text-7xl font-mono font-black text-[#DCFE50] tracking-tighter drop-shadow-[0_0_20px_rgba(220,254,80,0.6)]">
                    {count}
                </span>
            </motion.div>

            <p className="mt-8 font-mono text-sm uppercase tracking-widest text-gray-300">
                Recording starts in...
            </p>

            <button
                onClick={onCancel}
                className="mt-4 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-gray-400 hover:text-white transition-colors"
            >
                Cancel (Esc)
            </button>
        </div>
    );
}
