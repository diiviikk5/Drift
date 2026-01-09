"use client";

import { motion } from "framer-motion";

export default function CountdownOverlay({ value }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
            <motion.div
                key={value}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
                className="relative"
            >
                {/* Main number */}
                <div
                    className="w-48 h-48 flex items-center justify-center
                     bg-[var(--brutal-yellow)] border-4 border-[var(--brutal-black)]
                     shadow-[8px_8px_0px_var(--brutal-black)]"
                    style={{ transform: "rotate(-3deg)" }}
                >
                    <span className="font-mono font-bold text-[120px] text-[#0a0a0a] leading-none">
                        {value}
                    </span>
                </div>

                {/* Decorative elements */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--brutal-pink)] 
                     border-2 border-[var(--brutal-black)]"
                    style={{ transform: "rotate(45deg)" }}
                />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    className="absolute -bottom-3 -left-3 w-6 h-6 bg-[var(--brutal-blue)] 
                     border-2 border-[var(--brutal-black)]"
                />
            </motion.div>

            {/* Text */}
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-32 font-mono font-bold text-xl uppercase tracking-widest text-white"
            >
                Recording starts in...
            </motion.p>
        </motion.div>
    );
}
