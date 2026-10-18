/** Installable Drift Web: opens straight into the recorder. */
export default function manifest() {
    return {
        name: 'Drift — screen recording with auto-zoom',
        short_name: 'Drift',
        description: 'Record your screen in the browser. Drift follows your pointer, clicks and typing to add cinematic zooms, then exports MP4 locally.',
        start_url: '/app',
        scope: '/',
        display: 'standalone',
        background_color: '#0d0f14',
        theme_color: '#0d0f14',
        icons: [
            { src: '/app-icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/app-icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/app-icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    };
}
