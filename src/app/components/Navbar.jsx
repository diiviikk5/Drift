"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
                ? "py-2 bg-[var(--bg-primary)] border-b-[4px] border-[var(--border-default)]"
                : "py-4"
                }`}
        >
            <div className="relative max-w-6xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="/"
                    className="flex items-center gap-3 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="relative">
                        <div className="w-12 h-12 bg-[var(--brutal-yellow)] border-[3px] border-[var(--border-default)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-default)] group-hover:shadow-[6px_6px_0px_var(--border-default)] transition-all">
                            <svg className="w-6 h-6" fill="var(--border-default)" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="4" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                    <span className="font-mono text-xl font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Drift
                    </span>
                </motion.a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-3">
                    {/* Section Links */}
                    <a
                        href="#install"
                        className="px-4 py-2 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] font-mono font-bold text-sm uppercase shadow-[4px_4px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_var(--border-default)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-[var(--text-primary)]"
                    >
                        Install
                    </a>
                    <a
                        href="#usage"
                        className="px-4 py-2 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] font-mono font-bold text-sm uppercase shadow-[4px_4px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_var(--border-default)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-[var(--text-primary)]"
                    >
                        Guide
                    </a>

                    {/* Theme Toggle */}
                    <motion.button
                        onClick={toggleTheme}
                        className="w-12 h-12 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_var(--border-default)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-mono font-bold text-lg"
                        whileTap={{ scale: 0.95 }}
                    >
                        {theme === "dark" ? "☀" : "☾"}
                    </motion.button>

                    {/* Social - Twitter */}
                    <a
                        href="https://x.com/divikkk1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_var(--border-default)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                        aria-label="Twitter/X"
                    >
                        <svg className="w-5 h-5" fill="var(--text-primary)" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>

                    {/* Social - GitHub */}
                    <a
                        href="https://github.com/diiviikk5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_var(--border-default)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                        aria-label="GitHub"
                    >
                        <svg className="w-5 h-5" fill="var(--text-primary)" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                    </a>
                </nav>

                {/* Mobile Controls */}
                <div className="flex md:hidden items-center gap-3">
                    {/* Theme Toggle */}
                    <motion.button
                        onClick={toggleTheme}
                        className="w-10 h-10 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] flex items-center justify-center shadow-[3px_3px_0px_var(--border-default)] font-mono font-bold"
                        whileTap={{ scale: 0.95 }}
                    >
                        {theme === "dark" ? "☀" : "☾"}
                    </motion.button>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-10 h-10 bg-[var(--brutal-yellow)] border-[3px] border-[var(--border-default)] flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_var(--border-default)]"
                    >
                        <motion.span
                            className="w-5 h-0.5 bg-[#0a0a0a]"
                            animate={{
                                rotate: mobileMenuOpen ? 45 : 0,
                                y: mobileMenuOpen ? 6 : 0,
                            }}
                        />
                        <motion.span
                            className="w-5 h-0.5 bg-[#0a0a0a]"
                            animate={{
                                opacity: mobileMenuOpen ? 0 : 1,
                            }}
                        />
                        <motion.span
                            className="w-5 h-0.5 bg-[#0a0a0a]"
                            animate={{
                                rotate: mobileMenuOpen ? -45 : 0,
                                y: mobileMenuOpen ? -6 : 0,
                            }}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-primary)] border-b-[4px] border-[var(--border-default)]"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="px-4 py-6 flex flex-col gap-3">
                            {/* Section Links */}
                            <div className="flex justify-center gap-3">
                                <a
                                    href="#install"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center px-4 py-3 bg-[var(--brutal-yellow)] border-[3px] border-[var(--border-default)] shadow-[4px_4px_0px_var(--border-default)] font-mono font-bold uppercase text-sm text-[#0a0a0a]"
                                >
                                    Install
                                </a>
                                <a
                                    href="#usage"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center px-4 py-3 bg-[var(--brutal-pink)] border-[3px] border-[var(--border-default)] shadow-[4px_4px_0px_var(--border-default)] font-mono font-bold uppercase text-sm text-white"
                                >
                                    Guide
                                </a>
                            </div>
                            {/* Social Links */}
                            <div className="flex justify-center gap-3">
                                <a
                                    href="https://x.com/divikkk1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] shadow-[4px_4px_0px_var(--border-default)] font-mono font-bold uppercase text-sm"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    Twitter
                                </a>
                                <a
                                    href="https://github.com/diiviikk5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] border-[3px] border-[var(--border-default)] shadow-[4px_4px_0px_var(--border-default)] font-mono font-bold uppercase text-sm"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
