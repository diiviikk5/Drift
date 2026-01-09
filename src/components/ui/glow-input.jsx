"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlowInput({
    className,
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const inputRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!inputRef.current) return;
        const rect = inputRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={inputRef}
            className="relative"
            onMouseMove={handleMouseMove}
        >
            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                animate={{
                    boxShadow: isFocused
                        ? "0 0 30px rgba(99, 102, 241, 0.3), 0 0 60px rgba(99, 102, 241, 0.1)"
                        : "0 0 0px rgba(99, 102, 241, 0)",
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Spotlight on hover */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
                style={{
                    background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.06), transparent 40%)`,
                }}
            />

            {/* Input container */}
            <div
                className={cn(
                    "relative flex items-center gap-3 px-4 py-3.5 rounded-xl",
                    "bg-[var(--bg-secondary)] border border-[var(--border-default)]",
                    "transition-all duration-300",
                    isFocused && "border-indigo-500/50",
                    className
                )}
            >
                {icon && (
                    <span className="text-[var(--text-muted)]">
                        {icon}
                    </span>
                )}

                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                        "flex-1 bg-transparent outline-none",
                        "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                        "text-sm"
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}

export function GlowEmailInput({
    value,
    onChange,
    onSubmit,
    isLoading,
    buttonText = "Get Early Access",
    className,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <form
            onSubmit={onSubmit}
            className={cn(
                "relative rounded-2xl p-1",
                className
            )}
        >
            {/* Animated border */}
            <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                    background: isFocused
                        ? "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)"
                        : "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))",
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Inner container */}
            <div className="relative flex flex-col sm:flex-row gap-2 p-1.5 bg-[var(--bg-primary)] rounded-xl">
                <div className="flex-1 relative">
                    <input
                        type="email"
                        placeholder="you@email.com"
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={cn(
                            "w-full px-5 py-4 bg-[var(--bg-secondary)] rounded-lg",
                            "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                            "outline-none border border-transparent",
                            "focus:border-indigo-500/30",
                            "transition-all duration-300"
                        )}
                        {...props}
                    />
                </div>

                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        "relative overflow-hidden px-6 py-4 rounded-lg font-semibold text-white",
                        "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600",
                        "hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500",
                        "disabled:opacity-70 disabled:cursor-not-allowed",
                        "transition-all duration-300",
                        "shadow-lg shadow-indigo-500/25",
                        "flex items-center justify-center gap-2"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Shimmer */}
                    <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {isLoading ? (
                        <motion.span
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    ) : (
                        <>
                            <span className="relative z-10">{buttonText}</span>
                            <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </motion.button>
            </div>
        </form>
    );
}


