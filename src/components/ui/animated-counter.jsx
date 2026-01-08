"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

export function AnimatedCounter({
    value,
    duration = 2,
    className = "",
    suffix = "",
    prefix = "",
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const spring = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    });

    const display = useTransform(spring, (current) =>
        Math.round(current).toLocaleString()
    );

    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, spring, value]);

    useEffect(() => {
        return display.on("change", (latest) => {
            setDisplayValue(latest);
        });
    }, [display]);

    return (
        <span ref={ref} className={className}>
            {prefix}{displayValue}{suffix}
        </span>
    );
}

export function AnimatedCounterCard({
    value,
    label,
    suffix = "",
    prefix = "",
    icon,
    accentColor = "#6366f1",
    className = "",
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className={`relative group p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Accent glow */}
            <div
                className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: accentColor }}
            />

            {/* Icon */}
            {icon && (
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                        background: `${accentColor}20`,
                        color: accentColor,
                    }}
                >
                    {icon}
                </div>
            )}

            {/* Counter */}
            <div className="relative">
                <span
                    className="text-4xl font-bold"
                    style={{ color: accentColor }}
                >
                    {prefix}
                    <AnimatedCounter value={value} duration={2} />
                    {suffix}
                </span>
            </div>

            {/* Label */}
            <p className="mt-2 text-[var(--text-secondary)]">
                {label}
            </p>
        </motion.div>
    );
}

export function StatsRow({ stats, className = "" }) {
    return (
        <div className={`flex flex-wrap items-center justify-center gap-8 ${className}`}>
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                >
                    <span className="block text-3xl font-bold gradient-text">
                        <AnimatedCounter
                            value={stat.value}
                            prefix={stat.prefix || ""}
                            suffix={stat.suffix || ""}
                        />
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
                </motion.div>
            ))}
        </div>
    );
}
