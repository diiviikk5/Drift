"use client";

import { motion } from "framer-motion";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 px-4 border-t-[4px] border-[var(--border-default)] bg-[var(--bg-secondary)]">
            {/* Decorative shapes */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-[var(--brutal-yellow)] border-[3px] border-[var(--border-default)] rotate-12 hidden lg:block" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-[3px] border-[var(--border-default)] -rotate-6 hidden lg:block" />

            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center gap-8">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-14 h-14 bg-[var(--brutal-yellow)] border-[4px] border-[var(--border-default)] flex items-center justify-center shadow-[6px_6px_0px_var(--border-default)]">
                            <svg className="w-7 h-7" fill="var(--border-default)" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="4" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="font-mono text-2xl font-bold text-[var(--text-primary)] uppercase tracking-wider">
                            Drift
                        </span>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        className="text-center text-[var(--text-secondary)] max-w-md font-mono uppercase tracking-wide"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Cinema-grade screen recording for Windows.
                    </motion.p>

                    {/* Social Links */}
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <a
                            href="https://x.com/divikkk1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-[var(--bg-primary)] border-[3px] border-[var(--border-default)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_var(--border-default)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-[var(--brutal-pink)] transition-all group"
                            aria-label="Twitter/X"
                        >
                            <svg className="w-5 h-5 group-hover:fill-white transition-colors" fill="var(--text-primary)" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>

                        <a
                            href="https://github.com/diiviikk5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-[var(--bg-primary)] border-[3px] border-[var(--border-default)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_var(--border-default)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-[var(--brutal-blue)] transition-all group"
                            aria-label="GitHub"
                        >
                            <svg className="w-5 h-5 group-hover:fill-white transition-colors" fill="var(--text-primary)" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </a>
                    </motion.div>

                    {/* Divider */}
                    <div className="w-full max-w-xs h-1 bg-[var(--border-default)]" />

                    {/* Copyright */}
                    <motion.p
                        className="font-mono text-sm text-[var(--text-muted)] uppercase tracking-wider"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        © {currentYear} Drift — Built Different
                    </motion.p>
                    {/* Comparison Links (SEO) */}
                    <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-[var(--text-muted)] mt-8 max-w-2xl px-4">
                        <span className="opacity-50">COMPARE:</span>
                        <a href="/compare/loom-alternative" className="hover:text-[var(--text-primary)] transition-colors">LOOM ALTERNATIVE</a>
                        <span className="opacity-30">•</span>
                        <a href="/compare/obs-alternative" className="hover:text-[var(--text-primary)] transition-colors">OBS ALTERNATIVE</a>
                        <span className="opacity-30">•</span>
                        <a href="/compare/camtasia-alternative" className="hover:text-[var(--text-primary)] transition-colors">CAMTASIA ALTERNATIVE</a>
                        <span className="opacity-30">•</span>
                        <a href="/compare/snagit-alternative" className="hover:text-[var(--text-primary)] transition-colors">SNAGIT ALTERNATIVE</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
