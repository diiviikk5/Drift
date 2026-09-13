'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    FileText, 
    Play, 
    Pause, 
    RotateCcw, 
    Type, 
    ChevronUp, 
    ChevronDown, 
    X, 
    Maximize2, 
    Minimize2,
    Move
} from 'lucide-react';

/**
 * NotesTeleprompter — Floating Presenter Notes & Teleprompter
 * Inspired by OpenScreen's NotesWindow / notesTeleprompter architecture.
 * Allows product demo creators to paste their script and auto-scroll it while recording.
 */
export default function NotesTeleprompter({
    isOpen = false,
    onClose,
    isRecording = false
}) {
    const [scriptText, setScriptText] = useState(
        "Welcome to this demo of our new features!\n\nToday, I'll walk you through our updated dashboard, highlighting the new analytics views and seamless export capabilities.\n\nNotice how fluidly the interface navigates as we dive into real-time metrics."
    );
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(2); // 1 to 5
    const [fontSize, setFontSize] = useState(16); // 12 to 28
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 24, y: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const scrollContainerRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        let animId;
        if (isScrolling && scrollContainerRef.current) {
            const step = () => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop += scrollSpeed * 0.5;
                }
                animId = requestAnimationFrame(step);
            };
            animId = requestAnimationFrame(step);
        }
        return () => cancelAnimationFrame(animId);
    }, [isScrolling, scrollSpeed]);

    // Auto-start scrolling when recording begins
    useEffect(() => {
        if (isRecording) {
            setIsScrolling(true);
        } else {
            setIsScrolling(false);
        }
    }, [isRecording]);

    // Dragging logic
    const handleMouseDown = (e) => {
        if (e.target.closest('button') || e.target.closest('textarea')) return;
        setIsDragging(true);
        dragOffsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setPosition({
                x: Math.max(10, Math.min(window.innerWidth - 340, e.clientX - dragOffsetRef.current.x)),
                y: Math.max(10, Math.min(window.innerHeight - 200, e.clientY - dragOffsetRef.current.y))
            });
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    return (
        <div 
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            className="fixed z-50 w-80 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-shadow duration-200 select-none"
        >
            {/* Window Header */}
            <div 
                onMouseDown={handleMouseDown}
                className="flex items-center justify-between px-3 py-2.5 bg-white/5 border-b border-white/10 cursor-move"
            >
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#DCFE50]" />
                    <span className="text-xs font-semibold text-white tracking-wide font-mono">
                        Presenter Script
                    </span>
                    {isRecording && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title={isMinimized ? "Expand" : "Minimize"}
                    >
                        {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Close Script"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Controls Bar */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-white/5 text-[11px] text-zinc-300">
                        {/* Play/Pause & Reset */}
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setIsScrolling(!isScrolling)}
                                className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-all ${
                                    isScrolling 
                                        ? 'bg-[#DCFE50] text-black font-bold' 
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                {isScrolling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                <span>{isScrolling ? 'Pause' : 'Scroll'}</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                                }}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                                title="Rewind to top"
                            >
                                <RotateCcw className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Font Size & Speed */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-zinc-400 font-mono">Speed</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={scrollSpeed}
                                    onChange={(e) => setScrollSpeed(Number(e.target.value))}
                                    className="w-14 accent-[#DCFE50] cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <Type className="w-3 h-3 text-zinc-400" />
                                <button
                                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                                    className="px-1 bg-white/5 rounded hover:bg-white/10"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                                    className="px-1 bg-white/5 rounded hover:bg-white/10"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Script Container */}
                    <div 
                        ref={scrollContainerRef}
                        className="p-4 max-h-64 overflow-y-auto space-y-3 font-sans leading-relaxed text-zinc-100"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        <textarea
                            value={scriptText}
                            onChange={(e) => setScriptText(e.target.value)}
                            placeholder="Type or paste your presenter script here..."
                            rows={8}
                            className="w-full bg-transparent border-0 outline-none resize-none text-zinc-200 placeholder-zinc-500 font-sans leading-relaxed"
                            style={{ fontSize: `${fontSize}px` }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
