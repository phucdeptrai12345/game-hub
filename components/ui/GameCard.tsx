'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useCallback } from 'react';
import { Game } from '@/lib/types';

interface Props {
  game: Game;
  priority?: boolean;
  variant?: 'default' | 'wide' | 'tall' | 'spotlight';
  rank?: number;
}

export default function GameCard({ game, priority = false, variant = 'default', rank }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isSpotlight = variant === 'spotlight';
  const isWide = variant === 'wide';

  const videoSrc = game.thumb.replace(/\/[^/?#]+\.(jpe?g|png|webp|gif)(\?.*)?$/i, '/video.mp4');

  const handleEnter = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || videoFailed) return;
    vid.play().catch(() => {});
  }, [videoFailed]);

  const handleLeave = useCallback(() => {
    setVideoPlaying(false);
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    try { vid.currentTime = 0; } catch (_) {}
  }, []);

  const sizes = isSpotlight
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw'
    : isWide
    ? '(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 33vw'
    : '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw';

  return (
    <div className="relative h-full w-full">
      <Link
        href={`/games/${game.slug}`}
        className={`game-card group relative flex h-full w-full rounded-xl overflow-hidden active-click ${
          isSpotlight ? 'game-card-spotlight' : 'border border-border/60'
        }`}
        aria-label={`Play ${game.title}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {/* Thumbnail */}
        {!imgError ? (
          <Image
            src={game.thumb}
            alt=""
            fill
            className={`game-card-thumb object-cover transition-opacity duration-300 ${videoPlaying ? 'opacity-0' : 'opacity-100'}`}
            sizes={sizes}
            priority={priority}
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-navy flex items-center justify-center">
            <span className={isSpotlight ? 'text-5xl' : 'text-3xl'} aria-hidden="true">🎮</span>
          </div>
        )}

        {/* Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted loop playsInline preload="none"
          onPlaying={() => setVideoPlaying(true)}
          onError={() => { setVideoFailed(true); setVideoPlaying(false); }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />

        {/* Bottom gradient + title */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none"
          style={{ height: isSpotlight ? '45%' : '55%' }}
        />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ padding: isSpotlight ? '14px' : '8px 8px 7px' }}
        >
          <p className={`text-white font-bold leading-tight line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${
            isSpotlight ? 'text-sm md:text-base title-display font-black' : 'text-sm'
          }`}>
            {game.title}
          </p>
        </div>

        {rank !== undefined && (
          <div className="absolute left-2 top-2 z-10 flex h-8 min-w-8 items-center justify-center rounded-lg bg-surface/95 px-2.5 text-base font-black leading-none text-accent shadow-[0_2px_8px_oklch(10%_0.01_250/0.18)]">
            {rank}
          </div>
        )}
      </Link>

      {/* Spotlight star — outside overflow-hidden, half sticking out */}
      {isSpotlight && (
        <div className="absolute -top-4 -left-4 z-20 pointer-events-none" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="oklch(61% 0.24 28)"
            style={{ filter: 'drop-shadow(0 0 8px oklch(61% 0.24 28 / 0.9)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}
