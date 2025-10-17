// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;

module.exports = {
  // ...other Next.js config...

  // Allow production builds to succeed even when TypeScript reports errors.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Optionally skip ESLint during `next build` to avoid failing the build for lint warnings/errors.
  eslint: {
    ignoreDuringBuilds: true,
  },
};