"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedBorderCard } from "@/components/ui/animated-border";

const steps = [
    {
        number: "01",
        title: "Open Drift",
        description: "Launch Drift. No installation, no sign-ups required. Just open and go.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
        ),
        color: "#6366f1",
        visual: (
            <div className="relative w-24 h-24 mx-auto">
                <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        ),
    },
    {
        number: "02",
        title: "Record",
        description: "Choose your capture source — screen, window, or tab. Enable webcam and mic with one click. Start recording instantly.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        color: "#ec4899",
        visual: (
            <div className="relative w-24 h-24 mx-auto">
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-pink-500/30"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-4 rounded-full border-4 border-pink-500/50"
                    animate={{ scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center"
                        animate={{ scale: [1, 0.9, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <div className="w-4 h-4 rounded-full bg-white" />
                    </motion.div>
                </div>
            </div>
        ),
    },
    {
        number: "03",
        title: "Export",
        description: "Apply cinematic drift zoom effects, trim your video, and export in your preferred format — MP4, WebM, or GIF.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
        ),
        color: "#10b981",
        visual: (
            <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <motion.div
                        className="flex flex-col items-center gap-1"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <motion.div
                            className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline points="7 10 12 15 17 10" />
                            </svg>
                        </motion.div>
                        <div className="flex gap-1">
                            <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/20 px-1 rounded">MP4</span>
                            <span className="text-[8px] font-mono text-teal-400 bg-teal-500/20 px-1 rounded">GIF</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        ),
    },
];

export default function HowItWorks() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    return (
        <section ref={containerRef} className="py-24 px-4 relative overflow-hidden" id="how-it-works">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-500 border border-purple-500/20 mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        How It Works
                    </motion.span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                        Three steps to{" "}
                        <span className="gradient-text">cinematic</span> recordings
                    </h2>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2">
                        <div className="absolute inset-0 bg-[var(--border-default)]" />
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-500"
                            style={{
                                width: useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]),
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                            >
                                <AnimatedBorderCard borderWidth={2} duration={3 + index}>
                                    <div className="p-8 text-center">
                                        {/* Step number */}
                                        <div
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold mb-6"
                                            style={{
                                                background: `${step.color}20`,
                                                color: step.color,
                                            }}
                                        >
                                            {step.number}
                                        </div>

                                        {/* Visual */}
                                        <div className="mb-6">
                                            {step.visual}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[var(--text-secondary)] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </AnimatedBorderCard>

                                {/* Connection dot for desktop */}
                                <div
                                    className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 z-10"
                                    style={{
                                        backgroundColor: "var(--bg-primary)",
                                        borderColor: step.color,
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                    >
                        Get Started Free
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
