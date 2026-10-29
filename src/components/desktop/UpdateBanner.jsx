'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import { isTauri, checkForUpdate, installUpdate } from '@/lib/tauri-bridge';

/**
 * In-app updates for the desktop app. Checks GitHub a few seconds after
 * launch and when "Check for updates" is picked in the tray, then offers
 * a one-click "Restart to update". Never shows while recording.
 */
export default function UpdateBanner({ busy = false, onNotice }) {
    const [update, setUpdate] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState('');
    const checking = useRef(false);

    const runCheck = useCallback(async (manual) => {
        if (checking.current) return;
        checking.current = true;
        try {
            const found = await checkForUpdate();
            if (found) {
                setUpdate(found);
                setDismissed(false);
                setError('');
            } else if (manual) {
                onNotice?.("You're on the latest version of Drift.");
            }
        } finally {
            checking.current = false;
        }
    }, [onNotice]);

    useEffect(() => {
        if (!isTauri()) return undefined;
        const timer = setTimeout(() => runCheck(false), 5000);
        let unlisten = null;
        import('@tauri-apps/api/event')
            .then(({ listen }) => listen('drift-check-updates', () => runCheck(true)))
            .then((fn) => { unlisten = fn; })
            .catch(() => {});
        return () => {
            clearTimeout(timer);
            if (unlisten) unlisten();
        };
    }, [runCheck]);

    if (!update || dismissed || busy) return null;

    const install = async () => {
        setInstalling(true);
        setError('');
        try {
            await installUpdate(update, setProgress);
        } catch (e) {
            setInstalling(false);
            setError('The update could not be installed. Try again, or download it from drift.dvkk.dev.');
            console.warn('[drift] Update install failed:', e);
        }
    };

    const pct = progress == null ? null : Math.round(progress * 100);

    return (
        <div
            role="status"
            className="fixed bottom-5 right-5 z-[60] w-[340px] rounded-xl border border-[var(--border-app)] bg-[var(--bg-card)] shadow-2xl p-4 text-[var(--text-app)]"
        >
            <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-app)] flex-shrink-0">
                    <Download className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold leading-tight">Drift {update.version} is ready</div>
                    <div className="text-xs text-[var(--text-app-muted)] mt-0.5 line-clamp-2">
                        {error || (installing ? (!pct ? 'Downloading…' : pct >= 100 ? 'Installing… Drift will restart.' : `Downloading… ${pct}%`) : (update.body?.split('\n').find(Boolean) || 'A new version of Drift is available.'))}
                    </div>
                </div>
                {!installing && (
                    <button onClick={() => setDismissed(true)} aria-label="Later" className="text-[var(--text-app-muted)] hover:text-[var(--text-app)]">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            {installing && pct > 0 && (
                <div className="mt-3 h-1.5 rounded-full bg-[var(--bg-card-subtle)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--accent-app)] transition-[width] duration-150" style={{ width: `${pct}%` }} />
                </div>
            )}
            {!installing && (
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={install}
                        className="flex-1 h-8 rounded-lg bg-[var(--pill-active-bg)] text-[var(--pill-active-fg)] text-[13px] font-medium"
                    >
                        Restart to update
                    </button>
                    <button
                        onClick={() => setDismissed(true)}
                        className="h-8 px-3 rounded-lg border border-[var(--border-app)] text-[13px] text-[var(--text-app-muted)] hover:text-[var(--text-app)]"
                    >
                        Later
                    </button>
                </div>
            )}
        </div>
    );
}
