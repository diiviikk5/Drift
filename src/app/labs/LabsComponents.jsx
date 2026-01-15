'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Zap, HardDrive, Wifi, Video, Music, Image, Wand2, ArrowRight } from 'lucide-react';

// Industrial Marquee
export function LabsMarquee() {
    const text = "100% PRIVATE • ZERO UPLOADS • HARDWARE ACCELERATED • NO SIZE LIMIT • BROWSER NATIVE • SECURE • FAST • ";
    return (
        <div className="labs-marquee mb-16">
            <div className="labs-marquee-content">
                {text}{text}{text}
            </div>
        </div>
    );
}

// Aggressive Tool card
export function ToolCard({ tool, href, index }) {
    const categoryIcons = {
        video: Video,
        audio: Music,
        image: Image,
        tool: Wand2,
    };

    const Icon = categoryIcons[tool.category] || Video;
    const isInstant = tool.ffmpegArgs?.includes('copy') || tool.category === 'image';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 4) * 0.05 }}
            className="h-full"
        >
            <Link href={href} className="block h-full">
                <div className="labs-tool-card group">
                    <div className="labs-card-index">{String(index + 1).padStart(2, '0')}</div>

                    <div className="labs-tool-card-icon group-hover:bg-[var(--labs-cyan)] transition-colors">
                        <Icon size={32} strokeWidth={2.5} />
                    </div>

                    <h3 className="font-mono font-black text-xl uppercase leading-none mb-4 group-hover:text-[var(--labs-cyan)] transition-colors">
                        {tool.title}
                    </h3>

                    <p className="font-mono text-xs font-bold text-gray-500 mb-8 flex-grow">
                        {tool.shortDesc || tool.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        {isInstant ? (
                            <span className="labs-badge text-[10px] bg-black text-[var(--labs-cyan)]">⚡ INSTANT</span>
                        ) : (
                            <span className="labs-badge text-[10px] bg-gray-200">TRANSCODE</span>
                        )}
                        <div className="w-12 h-12 bg-black flex items-center justify-center text-white group-hover:bg-[var(--labs-cyan)] group-hover:text-black transition-all">
                            <ArrowRight size={24} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Giant Hero Section
export function HeroSection() {
    return (
        <section className="pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <div className="labs-hero-badge">
                        FAST_PRIVATE_SECURE
                    </div>
                </motion.div>

                <h1 className="labs-hero-title mb-8">
                    <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block"
                    >
                        DRIFT
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block labs-hero-title-stroke"
                    >
                        LABS
                    </motion.span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="font-mono text-lg font-black uppercase leading-tight"
                    >
                        Fast browser-based <span className="text-[var(--labs-orange)]">media tools</span>.
                        No file uploads. No limits. 100% private processing.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4 md:justify-end"
                    >
                        {[
                            { icon: Shield, text: 'SECURE' },
                            { icon: Zap, text: 'FAST' },
                            { icon: HardDrive, text: 'PRIVATE' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 border-b-4 border-black pb-1">
                                <item.icon size={20} className="text-[var(--labs-orange)]" />
                                <span className="font-mono font-black text-sm">{item.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// Bolder Stats
export function StatsSection({ conversionsCount, toolsCount }) {
    return (
        <section className="py-24 bg-[var(--labs-black)]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { val: conversionsCount, label: 'TOTAL_CONVERTERS' },
                        { val: toolsCount, label: 'UTILITY_TOOLS' },
                        { val: '100%', label: 'PRIVATE_SECURE' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="border-4 border-[var(--labs-white)] p-8 text-[var(--labs-white)]"
                        >
                            <div className="font-mono text-5xl font-black mb-2 text-[var(--labs-cyan)]">{stat.val}</div>
                            <div className="font-mono text-xs font-bold tracking-widest opacity-60 uppercase">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
