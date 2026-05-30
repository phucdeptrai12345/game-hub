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
      {
        protocol: 'https',
        hostname: '*.y8.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.y8.com',
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Apply to all game pages — allows embedded games full API access
        source: '/games/:slug*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'gamepad=*, autoplay=*, fullscreen=*, accelerometer=*, gyroscope=*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
