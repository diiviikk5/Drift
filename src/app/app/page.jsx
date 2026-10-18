import WebApp from './WebApp';

export const metadata = {
    title: 'Drift Web — Record your screen with auto-zoom, in the browser',
    description: 'Record your screen, a window or a tab right in the browser. Drift follows your pointer, clicks, typing and scrolling to add cinematic zooms, a smooth cursor and studio framing. No install, no extension, no upload.',
    alternates: { canonical: '/app' },
    openGraph: {
        title: 'Drift Web — screen recording with auto-zoom, in your browser',
        description: 'No install, no extension. Record, auto-zoom, edit and export MP4 locally.',
        url: '/app',
    },
};

export default function AppPage() {
    return <WebApp />;
}
