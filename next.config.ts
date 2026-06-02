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
        hostname: '**.famobi.com',
      },
      {
        protocol: 'https',
        hostname: '**.gamepix.com',
      },
      {
        protocol: 'https',
        hostname: '**.gamedistribution.com',
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
