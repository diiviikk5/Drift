"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function UsageGuide() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const usageSteps = [
        {
            step: "1",
            title: "Select Recording Area",
            description: "Choose full screen, a specific window, or custom region to capture.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={2.5} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v3a1 1 0 01-2 0V5zM20 5a1 1 0 00-1-1h-4a1 1 0 000 2h3v3a1 1 0 002 0V5zM4 19a1 1 0 001 1h4a1 1 0 000-2H6v-3a1 1 0 00-2 0v4zM20 19a1 1 0 01-1 1h-4a1 1 0 010-2h3v-3a1 1 0 012 0v4z" />
                </svg>
            ),
        },
        {
            step: "2",
            title: "Hit Record",
            description: "Click the record button or use keyboard shortcut to start capturing.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" strokeWidth={2.5} fill="var(--brutal-pink)" />
                </svg>
            ),
        },
        {
            step: "3",
            title: "Edit in Studio",
            description: "Apply auto-zoom effects, trim clips, and polish your recording.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            ),
        },
        {
            step: "4",
            title: "Export as WebM",
            description: "Export your cinema-quality video in WebM format, ready to share.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
        },
    ];

    return (
        <section id="usage" className="relative py-24 lg:py-32 px-4 overflow-hidden bg-[var(--bg-secondary)]">
            {/* Grid Background */}
            <div className="absolute inset-0 brutal-grid-bg" />

            {/* Decorative elements */}
            <div className="absolute top-16 right-20 w-24 h-24 bg-[var(--brutal-yellow)] border-[4px] border-[var(--border-default)] rotate-6 hidden lg:block" />
            <div className="absolute bottom-24 left-16 w-16 h-16 bg-[var(--brutal-blue)] border-[4px] border-[var(--border-default)] -rotate-12 hidden lg:block" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-block mb-6">
                        <div className="brutal-sticker !bg-[var(--brutal-pink)] !text-white !-rotate-1">
                            <span className="text-sm">HOW TO USE →</span>
                        </div>
                    </div>
                    <h2 className="font-mono font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] uppercase mb-4">
                        Quick Start{" "}
                        <span className={`brutal-highlight-pink ${isDark ? 'text-white' : 'text-[#0a0a0a]'}`}>
                            Guide
                        </span>
                    </h2>
                    <p className="font-mono text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
                        From launch to export in minutes.
                    </p>
                </motion.div>

                {/* Usage Steps - Vertical Timeline */}
                <div className="relative">
                    {/* Vertical Line (desktop) */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-[var(--border-default)] -translate-x-1/2" />

                    <div className="space-y-8 lg:space-y-0">
                        {usageSteps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                className={`relative lg:flex lg:items-center lg:gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                    }`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Content Card */}
                                <div className={`lg:w-[calc(50%-40px)] ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                                    <div className="brutal-card hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_var(--border-default)] transition-all duration-100">
                                        <div className={`flex items-start gap-4 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                                            {/* Icon */}
                                            <div className="flex-shrink-0 w-16 h-16 bg-[var(--bg-tertiary)] border-[3px] border-[var(--border-default)] flex items-center justify-center text-[var(--text-primary)]">
                                                {item.icon}
                                            </div>

                                            <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : ""}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`font-mono font-bold text-sm px-2 py-1 ${index === 0 ? "bg-[var(--brutal-pink)] text-white" :
                                                            index === 1 ? "bg-[var(--brutal-yellow)] text-[#0a0a0a]" :
                                                                index === 2 ? "bg-[var(--brutal-blue)] text-white" :
                                                                    "bg-[var(--brutal-pink)] text-white"
                                                        } border-2 border-[var(--border-default)]`}>
                                                        STEP {item.step}
                                                    </span>
                                                </div>
                                                <h3 className="font-mono font-bold text-xl text-[var(--text-primary)] uppercase mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="font-mono text-sm text-[var(--text-secondary)]">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Node (desktop) */}
                                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-[var(--brutal-yellow)] border-[4px] border-[var(--border-default)] items-center justify-center z-10 shadow-[4px_4px_0px_var(--border-default)]">
                                    <span className="font-mono font-bold text-lg text-[#0a0a0a]">{item.step}</span>
                                </div>

                                {/* Empty space for alternating layout */}
                                <div className="hidden lg:block lg:w-[calc(50%-40px)]" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* WebM Notice & Feedback Box */}
                <motion.div
                    className="mt-16 grid md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    {/* WebM Only Notice */}
                    <div className="brutal-card !bg-[var(--brutal-yellow)] !border-[4px]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-[#0a0a0a] flex items-center justify-center">
                                <svg className="w-8 h-8 text-[var(--brutal-yellow)]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.5 3H5.5C4.67 3 4 3.67 4 4.5v15c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5V8.5L14.5 3zm0 5.5V4l5 5h-4.5c-.28 0-.5-.22-.5-.5z" />
                                    <path d="M7 14v4h2.5l1.5-2 1.5 2H15v-4h-1.5v2.5L12 13l-1.5 3.5V14H7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-mono font-bold text-xl text-[#0a0a0a] uppercase mb-2">
                                    WebM Export Only
                                </h3>
                                <p className="font-mono text-sm text-[#333]">
                                    Currently exporting to WebM format. MP4 and GIF support coming soon based on your feedback!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Box */}
                    <div className="brutal-card !bg-[var(--brutal-blue)] !border-[4px]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-white flex items-center justify-center">
                                <svg className="w-8 h-8 text-[var(--brutal-blue)]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-mono font-bold text-xl text-white uppercase mb-2">
                                    We Want Your Feedback!
                                </h3>
                                <p className="font-mono text-sm text-white/90">
                                    Drift is in early beta. Got ideas? Found bugs? We're all ears — <a href="https://github.com/diiviikk5/Drift/issues" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:no-underline">open an issue</a> on GitHub!
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
