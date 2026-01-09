"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function Hero() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [waitlistCount, setWaitlistCount] = useState(0);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        async function fetchCount() {
            try {
                const response = await fetch("/api/waitlist");
                const data = await response.json();
                if (data.success) {
                    setWaitlistCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch waitlist count:", error);
            }
        }
        fetchCount();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus("error");
            setErrorMessage("Please enter a valid email");
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                if (data.count) {
                    setWaitlistCount(data.count);
                }
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Something went wrong");
            }
        } catch (error) {
            const existing = JSON.parse(localStorage.getItem("drift_waitlist") || "[]");
            if (!existing.includes(email.toLowerCase())) {
                existing.push(email.toLowerCase());
                localStorage.setItem("drift_waitlist", JSON.stringify(existing));
            }
            setStatus("success");
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 lg:py-32 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 brutal-grid-bg" />

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 border-[6px] border-[var(--border-default)] rotate-12 hidden lg:block" />
            <div className="absolute bottom-40 right-20 w-24 h-24 bg-[var(--brutal-yellow)] border-[4px] border-[var(--border-default)] -rotate-6 hidden lg:block" />
            <div className="absolute top-1/3 right-10 w-16 h-16 bg-[var(--brutal-pink)] border-[4px] border-[var(--border-default)] rotate-45 hidden lg:block" />

            {/* Main content */}
            <div className="relative z-10 max-w-6xl mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left column - Text */}
                    <div className="text-center lg:text-left">
                        {/* Sticker Badge */}
                        <motion.div
                            className="inline-block mb-8"
                            initial={{ opacity: 0, rotate: -10, y: -20 }}
                            animate={{ opacity: 1, rotate: -3, y: 0 }}
                            transition={{ delay: 0.1, type: "spring" }}
                        >
                            <div className="brutal-sticker text-sm">
                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                                Now Recording
                            </div>
                        </motion.div>

                        {/* Headline - Raw Typography */}
                        <motion.h1
                            className="font-mono font-bold tracking-tight mb-8"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--text-primary)] uppercase">
                                Record.
                            </span>
                            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase relative">
                                <span className="relative inline-block">
                                    <span className={`brutal-highlight ${isDark ? 'text-[#ff2d7a]' : 'text-[#0a0a0a]'}`}>
                                        Drift
                                    </span>
                                </span>
                                <span className="animate-blink ml-1">_</span>
                            </span>
                            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--text-primary)] uppercase">
                                Ship.
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-lg mx-auto lg:mx-0 mb-10 font-mono"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="font-bold uppercase text-[var(--text-primary)]">Cinema-grade</span> screen recording with{" "}
                            <span className={`brutal-highlight-pink px-1 font-bold ${isDark ? 'text-white' : 'text-[#0a0a0a]'}`}>AI-powered zoom</span>.
                            <br />
                            Runs entirely in your browser.
                        </motion.p>

                        {/* Email form */}
                        <motion.div
                            className="max-w-md mx-auto lg:mx-0 mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <AnimatePresence mode="wait">
                                {status !== "success" ? (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-4"
                                    >
                                        {/* Email input */}
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (status === "error") setStatus("idle");
                                            }}
                                            placeholder="YOUR@EMAIL.COM"
                                            disabled={status === "loading"}
                                            className={`brutal-input ${status === "error" ? "!border-red-500 !shadow-[4px_4px_0px_#ef4444]" : ""}`}
                                        />

                                        {status === "error" && (
                                            <motion.p
                                                className="font-mono text-sm text-red-500 uppercase"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                → {errorMessage}
                                            </motion.p>
                                        )}

                                        {/* Submit button */}
                                        <div className="flex justify-center lg:justify-start">
                                            {status === "loading" ? (
                                                <motion.div
                                                    className="brutal-button"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <span className="animate-pulse">JOINING...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    type="submit"
                                                    className="brutal-button group"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span>Join Waitlist</span>
                                                    <svg
                                                        className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="square" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        className="brutal-card bg-[var(--brutal-yellow)] !border-[4px]"
                                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                className="w-14 h-14 bg-[var(--bg-primary)] border-[3px] border-[var(--border-default)] flex items-center justify-center"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", delay: 0.2 }}
                                            >
                                                <svg className="w-8 h-8 text-[var(--brutal-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="square" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                            <div className="text-left font-mono">
                                                <p className="font-bold text-[#0a0a0a] text-xl uppercase">You're in!</p>
                                                <p className="text-sm text-[#333]">We'll notify you at launch.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Social Proof */}
                        {waitlistCount > 0 && (
                            <motion.div
                                className="flex items-center justify-center lg:justify-start gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                {/* Stacked avatars */}
                                <div className="flex -space-x-3">
                                    {[
                                        "bg-[var(--brutal-pink)]",
                                        "bg-[var(--brutal-blue)]",
                                        "bg-[var(--brutal-yellow)]",
                                    ].slice(0, Math.min(waitlistCount, 3)).map((bg, i) => (
                                        <motion.span
                                            key={i}
                                            className={`w-10 h-10 ${bg} border-[3px] border-[var(--border-default)] flex items-center justify-center text-xs font-bold`}
                                            initial={{ scale: 0, x: -20 }}
                                            animate={{ scale: 1, x: 0 }}
                                            transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                                        />
                                    ))}
                                </div>
                                <div className="font-mono text-sm text-[var(--text-secondary)]">
                                    <motion.span
                                        className="font-bold text-[var(--text-primary)]"
                                        key={waitlistCount}
                                        initial={{ scale: 1.2 }}
                                        animate={{ scale: 1 }}
                                    >
                                        {waitlistCount}
                                    </motion.span>{" "}
                                    {waitlistCount === 1 ? "PERSON" : "PEOPLE"} ON THE WAITLIST
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <motion.div
                        className="hidden lg:flex items-center justify-center"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <div className="relative">
                            {/* Main Browser Window */}
                            <div className="w-[420px] h-[320px] bg-[var(--bg-secondary)] border-[6px] border-[var(--border-default)] shadow-[12px_12px_0px_var(--border-default)]">
                                {/* Browser Header */}
                                <div className="h-12 bg-[var(--bg-tertiary)] border-b-[4px] border-[var(--border-default)] flex items-center px-4 gap-3">
                                    {/* Window Controls */}
                                    <div className="w-4 h-4 bg-[var(--brutal-pink)] border-2 border-[var(--border-default)]" />
                                    <div className="w-4 h-4 bg-[var(--brutal-yellow)] border-2 border-[var(--border-default)]" />
                                    <div className="w-4 h-4 bg-[var(--brutal-blue)] border-2 border-[var(--border-default)]" />
                                    <div className="ml-4 flex-1 h-6 bg-[var(--bg-secondary)] border-2 border-[var(--border-default)] px-2 flex items-center">
                                        <span className="font-mono text-xs text-[var(--text-muted)] uppercase truncate">drift.local</span>
                                    </div>
                                </div>

                                {/* Screen Content */}
                                <div className="relative h-[calc(100%-48px)] overflow-hidden brutal-screen">
                                    {/* Recording indicator */}
                                    <div className="absolute top-4 left-4 z-20 brutal-badge brutal-badge-pink">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        REC
                                    </div>

                                    {/* Animated content */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="brutal-stripes opacity-20 absolute inset-0" />
                                        <motion.div
                                            className="relative z-10 text-center"
                                            animate={{
                                                y: [0, -10, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <div className="w-20 h-20 mx-auto mb-4 bg-[var(--brutal-yellow)] border-[4px] border-[var(--border-default)] flex items-center justify-center">
                                                <svg className="w-10 h-10" fill="var(--border-default)" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                            <p className="font-mono font-bold text-[var(--text-primary)] uppercase">Click to Record</p>
                                        </motion.div>
                                    </div>

                                    {/* Cursor */}
                                    <motion.div
                                        className="absolute w-6 h-6 z-30"
                                        animate={{
                                            x: [100, 200, 150, 180, 100],
                                            y: [80, 120, 100, 160, 80],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 3l14 10-6 1-3 7-5-18z" fill="var(--border-default)" stroke="var(--bg-secondary)" strokeWidth="2" />
                                        </svg>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Sticker decoration */}
                            <div className="absolute -top-8 -right-8 bg-[var(--brutal-pink)] text-white font-mono font-bold text-xs uppercase px-4 py-2 border-[3px] border-[var(--border-default)] rotate-12 shadow-[4px_4px_0px_var(--border-default)]">
                                AI Powered ⚡
                            </div>

                            {/* Arrow decoration */}
                            <div className="absolute -bottom-6 -left-6">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="rotate-180">
                                    <path d="M10 50 L50 10 M50 10 L50 35 M50 10 L25 10" stroke="var(--border-default)" strokeWidth="6" fill="none" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Marquee Banner */}
                <motion.div
                    className="mt-20 lg:mt-32 overflow-hidden border-y-[4px] border-[var(--border-default)] bg-[var(--brutal-yellow)] py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...Array(8)].map((_, i) => (
                            <span key={i} className="inline-flex items-center mx-8 font-mono font-bold text-[#0a0a0a] uppercase text-lg">
                                <span className="w-3 h-3 bg-[#0a0a0a] mr-4" />
                                Screen Recording
                                <span className="w-3 h-3 bg-[var(--brutal-pink)] mx-4" />
                                AI Zoom
                                <span className="w-3 h-3 bg-[#0a0a0a] mx-4" />
                                Browser Based
                                <span className="w-3 h-3 bg-[var(--brutal-pink)] mx-4" />
                                Cinema Quality
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
