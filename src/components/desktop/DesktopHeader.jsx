'use client';

import React, { useState } from 'react';
import { Monitor, Film, Keyboard, Sun, Moon, Sparkles, Palette, Check, Laptop, FileText } from 'lucide-react';

export default function DesktopHeader({
    viewMode,
    setViewMode,
    platform,
    hookStatus,
    onOpenHotkeys,
    onNewRecording,
    hasRecording,
    recordingTime,
    isRecording,
    clickCount,
    theme = 'dark',
    onSelectTheme,
    isTeleprompterOpen = false,
    onToggleTeleprompter
}) {
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const themes = [
        { id: 'dark', label: 'Zinc Dark', icon: Moon, desc: 'Classic Shadcn' },
        { id: 'light', label: 'Clean Light', icon: Sun, desc: 'High Contrast' },
        { id: 'midnight', label: 'Midnight', icon: Sparkles, desc: 'Deep Navy' },
        { id: 'drift', label: 'Drift Lime', icon: Palette, desc: 'Electric Accent' },
    ];

    return (
        <header className="flex items-center justify-between px-5 py-2.5 border-b border-[var(--border-app)] bg-[var(--bg-app)]/90 backdrop-blur-xl flex-shrink-0 z-40 select-none transition-colors duration-200">
            {/* Left: Brand + App Tabs */}
            <div className="flex items-center gap-5">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--accent-app)] text-[var(--accent-app-fg)] flex items-center justify-center font-black text-xs shadow-sm transition-colors">
                        D
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-app)]">
                            Drift
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--bg-card-subtle)] text-[var(--text-app-muted)] border border-[var(--border-app)] font-medium">
                            v2.0
                        </span>
                    </div>
                </div>

                {/* Shadcn Segmented Control Tabs */}
                <div className="flex items-center bg-[var(--pill-bg)] p-1 rounded-lg border border-[var(--border-app)]">
                    <button
                        onClick={() => setViewMode('recorder')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            viewMode === 'recorder'
                                ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-xs font-semibold'
                                : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                        }`}
                    >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Capture</span>
                        {isRecording && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-0.5" />
                        )}
                    </button>
                    <button
                        onClick={() => {
                            if (hasRecording) setViewMode('studio');
                        }}
                        disabled={!hasRecording}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            viewMode === 'studio'
                                ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-xs font-semibold'
                                : hasRecording
                                ? 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                                : 'text-[var(--text-app-muted)] opacity-40 cursor-not-allowed'
                        }`}
                    >
                        <Film className="w-3.5 h-3.5" />
                        <span>Studio</span>
                    </button>
                </div>
            </div>

            {/* Center: Live Recording Pill (when recording) */}
            {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>REC {recordingTime}</span>
                    <span className="text-[10px] text-red-400">({clickCount} clicks)</span>
                </div>
            )}

            {/* Right: Theme Picker & Hotkeys */}
            <div className="flex items-center gap-2">
                {/* Theme Switcher Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[var(--text-app-muted)] hover:text-[var(--text-app)] bg-[var(--bg-card)] border border-[var(--border-app)] hover:border-[var(--border-app-hover)] transition-all"
                        title="Change Theme"
                    >
                        {theme === 'light' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        <span className="capitalize">{theme}</span>
                    </button>

                    {showThemeMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowThemeMenu(false)}
                            />
                            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[var(--bg-card)] border border-[var(--border-app)] p-1.5 shadow-xl z-50 space-y-0.5">
                                {themes.map((t) => {
                                    const Icon = t.icon;
                                    const isSelected = theme === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                if (onSelectTheme) onSelectTheme(t.id);
                                                setShowThemeMenu(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                                                isSelected
                                                    ? 'bg-[var(--bg-card-subtle)] text-[var(--text-app)] font-semibold'
                                                    : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card-subtle)]/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-3.5 h-3.5" />
                                                <span>{t.label}</span>
                                            </div>
                                            {isSelected && <Check className="w-3.5 h-3.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Presenter Teleprompter Button */}
                <button
                    onClick={onToggleTeleprompter}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        isTeleprompterOpen
                            ? 'bg-[var(--accent-app)] text-[var(--accent-app-fg)] font-bold shadow-xs'
                            : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)] bg-[var(--bg-card)] border border-[var(--border-app)] hover:border-[var(--border-app-hover)]'
                    }`}
                    title="Toggle Presenter Script Teleprompter"
                >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Script</span>
                </button>

                {/* Hotkeys Button */}
                <button
                    onClick={onOpenHotkeys}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[var(--text-app-muted)] hover:text-[var(--text-app)] bg-[var(--bg-card)] border border-[var(--border-app)] hover:border-[var(--border-app-hover)] transition-all"
                >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>Shortcuts</span>
                </button>
            </div>
        </header>
    );
}
