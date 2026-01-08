"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SpotlightCard({
    children,
    className,
    spotlightColor = "rgba(99, 102, 241, 0.15)",
    ...props
}) {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-2xl",
                "bg-[var(--bg-secondary)] border border-[var(--border-default)]",
                "transition-all duration-300",
                className
            )}
            whileHover={{
                scale: 1.02,
                borderColor: "rgba(99, 102, 241, 0.3)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...props}
        >
            {/* Spotlight effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />

            {/* Gradient border on hover */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
                style={{
                    opacity: isFocused ? 1 : 0,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

export function SpotlightGridCard({
    children,
    icon,
    title,
    description,
    className,
    accentColor = "#6366f1",
    ...props
}) {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-6",
                "bg-[var(--bg-secondary)] border border-[var(--border-default)]",
                "hover:border-[var(--border-hover)]",
                "transition-all duration-500",
                className
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...props}
        >
            {/* Spotlight */}
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${accentColor}15, transparent 40%)`,
                }}
            />

            {/* Icon */}
            {icon && (
                <div
                    className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}05)`,
                        color: accentColor,
                    }}
                >
                    {icon}
                </div>
            )}

            {/* Title */}
            {title && (
                <h3 className="relative z-10 text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {title}
                </h3>
            )}

            {/* Description */}
            {description && (
                <p className="relative z-10 text-[var(--text-secondary)] leading-relaxed">
                    {description}
                </p>
            )}

            {/* Custom content */}
            {children && <div className="relative z-10">{children}</div>}
        </motion.div>
    );
}
