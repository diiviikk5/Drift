/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: process.env.ELECTRON_BUILD ? 'export' : undefined,
  distDir: process.env.ELECTRON_BUILD ? '.next-electron' : '.next',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
