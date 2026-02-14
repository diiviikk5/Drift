const isProd = process.env.NODE_ENV === 'production';
const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined;
const isTauriBuild = isTauri && isProd;
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  // When building for Tauri production, use static export (SSG)
  // During tauri dev, keep SSR so headers/rewrites work
  ...(isTauriBuild ? {
    output: 'export',
  } : {}),

  // Always unoptimize images in Tauri (no Next.js image server)
  ...(isTauri ? {
    images: { unoptimized: true },
  } : {}),

  // Headers for SharedArrayBuffer (required for multi-threaded FFmpeg WASM)
  // and AI discovery files
  async headers() {
    return [
      {
        source: '/labs/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless', // More permissive than require-corp
          },
        ],
      },
      // AI/LLM Discovery files - allow CORS for AI agents
      {
        source: '/llms.txt',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
    ];
  },

  // Allow external resources for FFmpeg WASM
  async rewrites() {
    return [];
  },
};

export default nextConfig;
