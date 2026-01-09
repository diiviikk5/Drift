"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function AnimatedBorderCard({
    children,
    className,
    borderWidth = 2,
    duration = 4,
    ...props
}) {
    return (
        <div
            className={cn(
                "relative rounded-2xl p-[2px]",
                className
            )}
            style={{ padding: borderWidth }}
            {...props}
        >
            {/* Animated gradient border */}
            <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #06b6d4, #6366f1)",
                    backgroundSize: "300% 100%",
                    animation: `border-flow ${duration}s linear infinite`,
                }}
            />

            {/* Inner content */}
            <div className="relative bg-[var(--bg-primary)] rounded-[calc(1rem-2px)] z-10">
                {children}
            </div>
        </div>
    );
}

export function GlowCard({
    children,
    className,
    glowColor = "indigo",
    ...props
}) {
    const glowColors = {
        indigo: "rgba(99, 102, 241, 0.4)",
        purple: "rgba(168, 85, 247, 0.4)",
        pink: "rgba(236, 72, 153, 0.4)",
        cyan: "rgba(6, 182, 212, 0.4)",
    };

    return (
        <motion.div
            className={cn(
                "relative rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]",
                "transition-all duration-500",
                className
            )}
            whileHover={{
                boxShadow: `0 0 40px ${glowColors[glowColor]}, 0 0 80px ${glowColors[glowColor]}40`,
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function BeamBorderCard({
    children,
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]",
                className
            )}
            {...props}
        >
            {/* Beam effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div
                    className="absolute w-[200px] h-[200px] bg-indigo-500/30 blur-3xl"
                    style={{
                        animation: "beam-move 8s ease-in-out infinite",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            <style jsx>{`
        @keyframes beam-move {
          0%, 100% {
            top: -100px;
            left: -100px;
          }
          25% {
            top: -100px;
            left: calc(100% - 100px);
          }
          50% {
            top: calc(100% - 100px);
            left: calc(100% - 100px);
          }
          75% {
            top: calc(100% - 100px);
            left: -100px;
          }
        }
      `}</style>
        </div>
    );
}


