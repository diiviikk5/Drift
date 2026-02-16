"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function InstallGuide() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const steps = [
        {
            number: "01",
            title: "Download",
            description: "Click 'Download' on the homepage — it's a 21 MB installer, no sign-up needed",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
            color: "bg-[var(--brutal-pink)]",
        },
        {
            number: "02",
            title: "Install",
            description: "Run the installer — it takes ~10 seconds",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={3} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            ),
            color: "bg-[var(--brutal-yellow)]",
        },
        {
            number: "03",
            title: "Launch",
            description: "Open Drift from Start Menu — that's it!",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="square" strokeWidth={3} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-[var(--brutal-blue)]",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, rotate: -2 },
        visible: { opacity: 1, y: 0, rotate: 0 },
    };

    return (
        <section id="install" className="relative py-24 lg:py-32 px-4 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 brutal-dots-bg" />

            {/* Decorative shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--brutal-pink)] border-[4px] border-[var(--border-default)] rotate-12 hidden lg:block" />
            <div className="absolute bottom-20 right-16 w-16 h-16 border-[4px] border-[var(--border-default)] -rotate-6 hidden lg:block" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-block mb-6">
                        <div className="brutal-sticker !rotate-2">
                            <span className="text-sm">SUPER SIMPLE →</span>
                        </div>
                    </div>
                    <h2 className="font-mono font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] uppercase mb-4">
                        Install in{" "}
                        <span className={`brutal-highlight ${isDark ? 'text-[#ff2d7a]' : 'text-[#0a0a0a]'}`}>
                            3 Steps
                        </span>
                    </h2>
                    <p className="font-mono text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
                        No sign-ups. No bloatware. No BS.
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <motion.div
                    className="grid md:grid-cols-3 gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            variants={itemVariants}
                            className="group"
                        >
                            <div className="brutal-card h-full hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_var(--border-default)] transition-all duration-100">
                                {/* Step Number */}
                                <div className={`inline-flex items-center justify-center w-14 h-14 ${step.color} border-[3px] border-[var(--border-default)] mb-6`}>
                                    <span className="font-mono font-bold text-xl text-[#0a0a0a]">{step.number}</span>
                                </div>

                                {/* Icon */}
                                <div className="mb-4 text-[var(--text-primary)]">
                                    {step.icon}
                                </div>

                                {/* Title */}
                                <h3 className="font-mono font-bold text-2xl text-[var(--text-primary)] uppercase mb-3">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="font-mono text-[var(--text-secondary)]">
                                    {step.description}
                                </p>
                            </div>

                            {/* Arrow between steps (desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
                                    <span className="font-mono text-3xl text-[var(--text-muted)]">→</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Note */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="inline-flex items-center gap-3 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] px-6 py-3 shadow-[4px_4px_0px_var(--border-default)]">
                        <svg className="w-5 h-5 text-[var(--brutal-blue)]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12s5.374 12 12 12 12-5.373 12-12-5.374-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
                        </svg>
                        <span className="font-mono text-sm text-[var(--text-secondary)]">
                            Windows only (for now)
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
