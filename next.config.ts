import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.gamemonetize.com',
      },
      {
        protocol: 'https',
        hostname: '*.gamemonetize.com',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
