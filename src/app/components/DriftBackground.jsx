"use client";

import { useEffect, useRef } from "react";

export default function DriftBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        // Add willReadFrequently for performance (even though we removed getImageData)
        const ctx = canvas.getContext("2d", { willReadFrequently: false });
        let animationId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        // Simplified floating orbs - no grain effect for better performance
        const orbs = [
            { x: 0.15, y: 0.2, radius: 350, color: "rgba(168, 85, 247, 0.12)", speed: 0.0002 },
            { x: 0.85, y: 0.7, radius: 450, color: "rgba(6, 182, 212, 0.08)", speed: 0.00025 },
            { x: 0.5, y: 0.1, radius: 300, color: "rgba(236, 72, 153, 0.06)", speed: 0.0003 },
        ];

        const animate = () => {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            orbs.forEach((orb, i) => {
                const offsetX = Math.sin(time * orb.speed + i * 2) * 80;
                const offsetY = Math.cos(time * orb.speed * 0.7 + i * 2) * 60;

                const x = orb.x * canvas.width + offsetX;
                const y = orb.y * canvas.height + offsetY;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radius);
                gradient.addColorStop(0, orb.color);
                gradient.addColorStop(1, "transparent");

                ctx.beginPath();
                ctx.arc(x, y, orb.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
            aria-hidden="true"
        />
    );
}


