/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  // Headers for SharedArrayBuffer (required for multi-threaded FFmpeg WASM)
  // Only apply to /labs routes to avoid breaking other parts of the site
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
    ];
  },

  // Allow external resources for FFmpeg WASM
  async rewrites() {
    return [];
  },
};

export default nextConfig;
