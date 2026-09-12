'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function AudioLevelMeter({ enabled, onToggle }) {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        if (!enabled) {
            setLevel(0);
            return;
        }

        let animFrame;
        const update = () => {
            // Simulated dynamic VU response when mic is active
            const base = 0.3 + Math.sin(Date.now() / 200) * 0.2 + (Math.random() * 0.25);
            setLevel(Math.min(1, Math.max(0.1, base)));
            animFrame = requestAnimationFrame(update);
        };
        animFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animFrame);
    }, [enabled]);

    const bars = 14;

    return (
        <div className="flex items-center gap-3 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06]">
            <button
                onClick={onToggle}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    enabled
                        ? 'bg-[#DCFE50] text-black shadow-[0_0_10px_rgba(220,254,80,0.3)]'
                        : 'bg-white/[0.06] text-gray-400 hover:text-white'
                }`}
                title={enabled ? 'Mute Microphone' : 'Enable Microphone'}
            >
                {enabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1 font-mono">
                    <span>Microphone Input</span>
                    <span className={enabled ? 'text-[#DCFE50] font-bold' : 'text-gray-600'}>
                        {enabled ? 'Active (Gain Auto)' : 'Off'}
                    </span>
                </div>
                {/* Stereo VU Bars */}
                <div className="flex items-center gap-1 h-2 bg-black/40 p-0.5 rounded-full overflow-hidden border border-white/[0.06]">
                    {[...Array(bars)].map((_, i) => {
                        const threshold = (i + 1) / bars;
                        const isLit = enabled && level >= threshold;
                        let barColor = 'bg-[#DCFE50]';
                        if (i >= bars - 3) barColor = 'bg-red-500';
                        else if (i >= bars - 6) barColor = 'bg-amber-400';

                        return (
                            <div
                                key={i}
                                className={`flex-1 h-full rounded-xs transition-all duration-75 ${
                                    isLit ? `${barColor} shadow-[0_0_4px_currentColor]` : 'bg-white/[0.06]'
                                }`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
