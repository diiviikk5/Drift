'use client';

import React from 'react';
import { Play, Square, Timer, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import AudioLevelMeter from './AudioLevelMeter';

export default function CaptureDock({
    isRecording,
    onToggleRecord,
    timer,
    micEnabled,
    onToggleMic,
    countdownSeconds,
    onChangeCountdown,
    hotkey
}) {
    return (
        <div className={`backdrop-blur-2xl rounded-2xl border p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 transition-all duration-300 ${
            isRecording
                ? 'bg-[#120A0E]/95 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
                : 'bg-[#0D0E16]/95 border-white/[0.08]'
        }`}>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Audio Input Meter */}
                <div className="flex-1">
                    <AudioLevelMeter enabled={micEnabled} onToggle={onToggleMic} />
                </div>

                {/* Countdown Selector (Hidden while recording) */}
                {!isRecording && (
                    <div className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.06]">
                        <Timer className="w-4 h-4 text-gray-400 ml-1.5" />
                        <span className="text-[11px] text-gray-400 font-mono">Timer:</span>
                        {[0, 3, 5].map((sec) => (
                            <button
                                key={sec}
                                onClick={() => onChangeCountdown(sec)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                                    countdownSeconds === sec
                                        ? 'bg-[#DCFE50] text-black shadow-sm'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                {sec === 0 ? 'Instant' : `${sec}s`}
                            </button>
                        ))}
                    </div>
                )}

                {/* Live Recording Indicator */}
                {isRecording && (
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        <span className="text-base font-mono font-black text-red-400 tracking-wider">
                            {timer || '00:00'}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                            Live
                        </span>
                    </div>
                )}

                {/* Hero Record Button */}
                <button
                    onClick={onToggleRecord}
                    className={`group relative px-7 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 ${
                        isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)]'
                            : 'bg-[#DCFE50] hover:bg-[#c9ea3e] text-[#07070A] shadow-[0_0_25px_rgba(220,254,80,0.3)] hover:scale-[1.02]'
                    }`}
                >
                    {isRecording ? (
                        <>
                            <Square className="w-4 h-4 fill-white" />
                            <span className="font-extrabold text-sm tracking-wide uppercase">STOP RECORDING</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white font-semibold ml-1">
                                {hotkey || 'Ctrl+Shift+S'}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="font-extrabold text-sm tracking-wide uppercase">START RECORDING</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-black font-semibold ml-1">
                                {hotkey || 'Ctrl+Shift+R'}
                            </span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
