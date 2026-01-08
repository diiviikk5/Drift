"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export function BentoGrid({
    children,
    className = "",
}) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                className
            )}
        >
            {children}
        </div>
    );
}

export function BentoCard({
    children,
    className = "",
    colSpan = 1,
    rowSpan = 1,
    icon,
    title,
    description,
    gradient,
    interactive = true,
    ...props
}) {
    const ref = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!ref.current || !interactive) return;
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const colSpanClass = {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
    };

    const rowSpanClass = {
        1: "md:row-span-1",
        2: "md:row-span-2",
        3: "md:row-span-3",
    };

    return (
        <motion.div
            ref={ref}
            className={cn(
                "group relative overflow-hidden rounded-2xl",
                "bg-[var(--bg-secondary)] border border-[var(--border-default)]",
                "p-6 transition-all duration-500",
                colSpanClass[colSpan],
                rowSpanClass[rowSpan],
                className
            )}
            onMouseMove={handleMouseMove}
            whileHover={interactive ? { scale: 1.02, borderColor: "rgba(99, 102, 241, 0.3)" } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...props}
        >
            {/* Spotlight effect */}
            {interactive && (
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
                    }}
                />
            )}

            {/* Gradient overlay */}
            {gradient && (
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ background: gradient }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">
                {icon && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                )}

                {title && (
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        {title}
                    </h3>
                )}

                {description && (
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        {description}
                    </p>
                )}

                {children}
            </div>
        </motion.div>
    );
}

// Feature showcase bento card with visual demo
export function BentoFeatureCard({
    title,
    description,
    demo,
    className = "",
    colSpan = 1,
    rowSpan = 1,
}) {
    const colSpanClass = {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
    };

    const rowSpanClass = {
        1: "md:row-span-1",
        2: "md:row-span-2",
        3: "md:row-span-3",
    };

    return (
        <motion.div
            className={cn(
                "group relative overflow-hidden rounded-2xl",
                "bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]",
                "border border-[var(--border-default)]",
                colSpanClass[colSpan],
                rowSpanClass[rowSpan],
                className
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Demo area */}
            <div className="relative h-48 overflow-hidden">
                {demo}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-indigo-400 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}

// Interactive zoom demo for bento
export function ZoomDemo() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
                className="absolute w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/50"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="absolute inset-0 flex items-center justify-center text-2xl"
                    animate={{
                        scale: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    🎬
                </motion.div>
            </motion.div>

            {/* Zoom ring */}
            <motion.div
                className="absolute w-32 h-32 rounded-full border-2 border-dashed border-indigo-500/30"
                animate={{
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}

// Privacy shield demo
export function PrivacyDemo() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
                className="relative"
                animate={{
                    y: [0, -5, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                {/* Shield rings */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-xl border border-emerald-500/20"
                        animate={{
                            scale: [1, 1.5 + i * 0.3],
                            opacity: [0.5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.6,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}

// Export demo
export function ExportDemo() {
    return (
        <div className="relative w-full h-full flex items-center justify-center gap-4">
            {["MP4", "WebM", "GIF"].map((format, i) => (
                <motion.div
                    key={format}
                    className={cn(
                        "px-3 py-2 rounded-lg text-xs font-mono font-medium",
                        i === 0 && "bg-violet-500/20 text-violet-300 border border-violet-500/30",
                        i === 1 && "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
                        i === 2 && "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                    )}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                >
                    {format}
                </motion.div>
            ))}
        </div>
    );
}
