"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Particle = ({ delay, duration, x, size, color }) => (
    <motion.div
        className="absolute bottom-0 rounded-full pointer-events-none"
        style={{
            left: `${x}%`,
            width: size,
            height: size,
            background: color,
            filter: "blur(1px)",
        }}
        initial={{ y: 0, opacity: 0, scale: 0 }}
        animate={{
            y: "-100vh",
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear",
        }}
    />
);

export function FloatingParticles({
    count = 30,
    className = "",
}) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const colors = [
            "rgba(99, 102, 241, 0.6)",
            "rgba(168, 85, 247, 0.6)",
            "rgba(236, 72, 153, 0.5)",
            "rgba(6, 182, 212, 0.5)",
        ];

        const generated = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 8 + Math.random() * 12,
            size: 3 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));

        setParticles(generated);
    }, [count]);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {particles.map((particle) => (
                <Particle key={particle.id} {...particle} />
            ))}
        </div>
    );
}

// Mesh gradient background
export function MeshBackground({ className = "" }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Main mesh gradients */}
            <div className="absolute inset-0 bg-[var(--bg-primary)]" />

            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
                    left: "20%",
                    top: "10%",
                    filter: "blur(60px)",
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
                    right: "10%",
                    top: "30%",
                    filter: "blur(60px)",
                }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
                    left: "50%",
                    bottom: "20%",
                    filter: "blur(60px)",
                }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}

// Grid pattern background
export function GridBackground({ className = "" }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Fade out at edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" />
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" />
        </div>
    );
}


