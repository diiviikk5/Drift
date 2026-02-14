'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects to /recorder when running inside Tauri desktop app.
 * This ensures the marketing landing page never shows in the desktop app.
 */
export default function TauriRedirect() {
    const router = useRouter();

    useEffect(() => {
        const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
        if (isTauri) {
            router.replace('/recorder');
        }
    }, [router]);

    return null;
}
