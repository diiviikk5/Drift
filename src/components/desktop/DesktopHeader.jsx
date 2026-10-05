'use client';

import React, { useState } from 'react';
import { Monitor, Film, Keyboard, Check, FileText, FolderOpen, Save, Settings, ChevronDown } from 'lucide-react';
import { APP_THEMES, getAppTheme } from '@/lib/ui/themes';

/** Small ghost button used across the header. */
function HeaderButton({ active = false, children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                active
                    ? 'bg-[var(--accent-soft)] text-[var(--text-app)]'
                    : 'text-[var(--text-app-muted)] hover:text-[var(--text-app)] hover:bg-[var(--bg-card-subtle)]'
            } ${className}`}
        >
            {children}
        </button>
    );
}

/** Miniature of a theme: window, card and accent. */
function ThemePreview({ swatch }) {
    const [bg, card, accent] = swatch;
    return (
        <span className="relative block w-11 h-8 rounded-md overflow-hidden border border-black/10 flex-shrink-0" style={{ background: bg }}>
            <span className="absolute left-1.5 top-1.5 right-1.5 h-2 rounded-sm" style={{ background: card }} />
            <span className="absolute left-1.5 bottom-1.5 w-4 h-2 rounded-sm" style={{ background: accent }} />
            <span className="absolute right-1.5 bottom-1.5 w-3 h-2 rounded-sm" style={{ background: card }} />
        </span>
    );
}

export default function DesktopHeader({
    viewMode,
    setViewMode,
    onOpenHotkeys,
    onOpenSettings,
    onOpenProject,
    onSaveProject,
    hasRecording,
    recordingTime,
    isRecording,
    clickCount,
    theme = 'dark',
    onSelectTheme,
    isTeleprompterOpen = false,
    onToggleTeleprompter,
}) {
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const current = getAppTheme(theme);

    const tab = (id, label, Icon, enabled = true) => (
        <button
            onClick={() => enabled && setViewMode(id)}
            disabled={!enabled}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-[13px] font-medium transition-colors ${
                viewMode === id
                    ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] shadow-sm'
                    : enabled
                    ? 'text-[var(--text-app-muted)] hover:text-[var(--text-app)]'
                    : 'text-[var(--text-app-faint)] cursor-not-allowed'
            }`}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
            {id === 'recorder' && isRecording && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
        </button>
    );

    return (
        <header className="flex items-center justify-between h-12 px-4 border-b border-[var(--border-app)] bg-[var(--bg-app)] flex-shrink-0 z-40 select-none">
            {/* Brand + views */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img src="/brand/drift-mark.png" alt="" width={24} height={24} className="w-6 h-6 rounded-md" draggable={false} />
                    <span className="font-semibold text-[15px] tracking-tight text-[var(--text-app)]">Drift</span>
                </div>
                <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-app)]">
                    {tab('recorder', 'Record', Monitor)}
                    {tab('studio', 'Edit', Film, hasRecording && !isRecording)}
                </div>
            </div>

            {/* Recording status */}
            {isRecording && (
                <div className="flex items-center gap-2 h-7 px-3 rounded-full bg-red-500/10 text-red-500 text-[13px] font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>Recording</span>
                    <span className="font-mono">{recordingTime}</span>
                    {clickCount > 0 && <span className="text-red-500/70">· {clickCount} {clickCount === 1 ? 'click' : 'clicks'}</span>}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-0.5">
                <HeaderButton onClick={onOpenProject} disabled={isRecording} title="Open a recording or Drift project" aria-label="Open">
                    <FolderOpen className="w-4 h-4" />
                </HeaderButton>
                <HeaderButton onClick={onSaveProject} disabled={!hasRecording || isRecording} title="Save as a Drift project" aria-label="Save">
                    <Save className="w-4 h-4" />
                </HeaderButton>

                <span className="w-px h-5 bg-[var(--border-app)] mx-1.5" />

                <div className="relative">
                    <HeaderButton onClick={() => setShowThemeMenu(v => !v)} active={showThemeMenu} title="Theme">
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: current.swatch[2] }} />
                        <span>{current.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </HeaderButton>
                    {showThemeMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-app)] p-1.5 z-50" style={{ boxShadow: 'var(--shadow-pop)' }}>
                                <div className="px-2.5 pt-1.5 pb-2 text-xs font-medium text-[var(--text-app-faint)]">Theme</div>
                                {APP_THEMES.map((t) => {
                                    const selected = current.id === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                onSelectTheme?.(t.id);
                                                setShowThemeMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-left transition-colors ${
                                                selected ? 'bg-[var(--bg-card-subtle)]' : 'hover:bg-[var(--bg-card-subtle)]'
                                            }`}
                                        >
                                            <ThemePreview swatch={t.swatch} />
                                            <span className="flex-1 min-w-0">
                                                <span className="block text-[13px] font-medium text-[var(--text-app)]">{t.label}</span>
                                                <span className="block text-xs text-[var(--text-app-muted)] truncate">{t.desc}</span>
                                            </span>
                                            {selected && <Check className="w-4 h-4 text-[var(--accent-app)]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                <HeaderButton onClick={onToggleTeleprompter} active={isTeleprompterOpen} title="Presenter script">
                    <FileText className="w-4 h-4" />
                    <span>Script</span>
                </HeaderButton>
                <HeaderButton onClick={onOpenHotkeys} title="Keyboard shortcuts">
                    <Keyboard className="w-4 h-4" />
                    <span>Shortcuts</span>
                </HeaderButton>
                <HeaderButton onClick={onOpenSettings} title="Settings">
                    <Settings className="w-4 h-4" />
                </HeaderButton>
            </div>
        </header>
    );
}
