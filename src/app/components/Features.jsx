"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { BentoGrid, BentoCard, ZoomDemo, PrivacyDemo, ExportDemo } from "@/components/ui/bento-grid";
import { SpotlightGridCard } from "@/components/ui/spotlight-card";

const features = [
    {
        title: "The Drift Effect",
        description: "Cinematic auto-zoom that follows your cursor with smooth, eased motion. Your tutorials will look like they were made by a pro.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
        ),
        accentColor: "#6366f1",
        demo: <ZoomDemo />,
        colSpan: 2,
    },
    {
        title: "100% Private",
        description: "Your recordings never leave your device. No uploads, no tracking, no cloud. Complete privacy.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        accentColor: "#10b981",
        demo: <PrivacyDemo />,
        colSpan: 1,
    },
    {
        title: "Export Anywhere",
        description: "MP4, WebM, or GIF. Professional quality with instant download. No watermarks.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        ),
        accentColor: "#8b5cf6",
        demo: <ExportDemo />,
        colSpan: 1,
    },
    {
        title: "Webcam Overlay",
        description: "Add your face cam with beautiful circular or rectangular overlays. Draggable positioning.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        accentColor: "#ec4899",
        colSpan: 1,
    },
    {
        title: "System Audio",
        description: "Capture tab audio, microphone, or both. Perfect sync every time with noise reduction.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        ),
        accentColor: "#06b6d4",
        colSpan: 1,
    },
];

export default function Features() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <section className="py-24 px-4 bg-[var(--bg-secondary)] relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.span
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        Features
                    </motion.span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        Built for creators who{" "}
                        <span className="gradient-text">care about quality</span>
                    </h2>

                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Every feature designed to make your recordings look professional without the learning curve.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <BentoGrid className="md:grid-cols-3 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={feature.colSpan === 2 ? "md:col-span-2" : ""}
                        >
                            {feature.demo ? (
                                <div className="group relative overflow-hidden rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-all duration-500">
                                    {/* Demo area */}
                                    <div className="relative h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden">
                                        {feature.demo}

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                                            style={{
                                                background: `${feature.accentColor}15`,
                                                color: feature.accentColor,
                                            }}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Hover glow */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(600px circle at center, ${feature.accentColor}08, transparent 40%)`
                                        }}
                                    />
                                </div>
                            ) : (
                                <SpotlightGridCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    accentColor={feature.accentColor}
                                    className="h-full"
                                />
                            )}
                        </motion.div>
                    ))}
                </BentoGrid>

                {/* Coming soon note */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        More features in development. Building in public.
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
