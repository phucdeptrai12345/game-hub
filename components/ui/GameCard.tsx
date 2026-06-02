'use client';

import Link from 'next/link';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Game } from '@/lib/types';
import { readStoredGames, writeStoredGames } from '@/lib/stored-games';
import { getPlayablePreviewVideo } from '@/lib/gamemonetize-video';
import GameImage from './GameImage';

const FAVORITES_KEY = 'gz-favs';

interface Props {
  game: Game;
  priority?: boolean;
  variant?: 'default' | 'wide' | 'tall' | 'spotlight';
  rank?: number;
  badge?: 'new' | 'hot';
  compact?: boolean;
}

function FavoriteButton({ game, compact = false }: { game: Game; compact?: boolean }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    try {
      const favs = readStoredGames(FAVORITES_KEY);
      setIsFav(favs.some((g) => g.id === game.id));
    } catch {}
  }, [game.id]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs = readStoredGames(FAVORITES_KEY);
      const next = isFav ? favs.filter((g) => g.id !== game.id) : [game, ...favs];
      writeStoredGames(FAVORITES_KEY, next);
      setIsFav(!isFav);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      className={`game-card-favorite absolute z-30 flex items-center justify-center rounded-full transition-all duration-150 active-click ${
        compact ? 'right-1.5 top-1.5 h-6 w-6' : 'right-2 top-2 h-7 w-7'
      } ${
        isFav
          ? 'game-card-favorite-active bg-red-500 opacity-100 scale-100'
          : 'bg-black/50 backdrop-blur-sm opacity-0 group-hover/card:opacity-100 scale-90 group-hover/card:scale-100'
      }`}
    >
      <svg className="game-card-favorite-icon" width={compact ? '11' : '12'} height={compact ? '11' : '12'} viewBox="0 0 24 24" fill={isFav ? 'white' : 'none'} stroke="white" strokeWidth="2.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}

function CardBadge({ badge, compact }: { badge: 'new' | 'hot'; compact: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute -left-1.5 z-30 inline-flex items-center justify-center gap-1 border-2 border-background font-black leading-none shadow-[0_8px_18px_oklch(12%_0.012_250/0.22),0_1px_3px_oklch(12%_0.012_250/0.14)] ${
        compact ? '-top-2 h-6 rounded-full px-2.5 text-[10px]' : '-top-2.5 h-7 rounded-full px-3 text-xs'
      } ${
        badge === 'new'
          ? 'bg-emerald-500 text-white'
          : 'bg-amber-300 text-zinc-950'
      }`}
    >
      {badge === 'new' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a9 9 0 0 1-15.5 6.2" />
          <path d="M3 12a9 9 0 0 1 15.5-6.2" />
          <path d="M3 18v-5h5" />
          <path d="M21 6v5h-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.6l2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17l-5.6 2.9 1.1-6.3-4.6-4.4 6.3-.9L12 2.6z" />
        </svg>
      )}
      <span>{badge === 'new' ? 'Fresh' : 'Choice'}</span>
    </div>
  );
}

export default function GameCard({ game, priority = false, variant = 'default', rank, badge, compact = false }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [videoInView, setVideoInView] = useState(false);

  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); }, []);

  const isSpotlight = variant === 'spotlight';
  const isWide = variant === 'wide';

  // Only use preview URLs that are known to return playable video files.
  const videoSrc = getPlayablePreviewVideo(game.previewVideo);
  const hasVideoPreview = Boolean(videoSrc);
  const shouldRenderVideo = hasVideoPreview && !videoFailed && (hovered || videoInView);

  const playPreviewVideo = useCallback((vid: HTMLVideoElement) => {
    vid.muted = false;
    vid.volume = 0.55;
    vid.play().catch(() => {
      // Browsers can block hover-started audio; keep the motion working.
      vid.muted = true;
      vid.play().catch(() => {});
    });
  }, []);

  useEffect(() => {
    if (!hasVideoPreview || videoInView) return;
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasVideoPreview, videoInView]);

  const handleEnter = useCallback(() => {
    setHovered(true);
    if (!hasVideoPreview || videoFailed) return;
    setVideoInView(true);
    const vid = videoRef.current;
    if (!vid) return;
    vid.preload = 'auto';
    vid.load();
    playPreviewVideo(vid);
  }, [hasVideoPreview, videoFailed, playPreviewVideo]);

  useEffect(() => {
    if (!hovered || !shouldRenderVideo) return;
    const vid = videoRef.current;
    if (!vid) return;
    vid.preload = 'auto';
    vid.load();
    playPreviewVideo(vid);
  }, [hovered, shouldRenderVideo, playPreviewVideo]);

  const handleLeave = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHovered(false);
    setVideoPlaying(false);
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    try { vid.currentTime = 0; } catch {}
  }, []);

  const sizes = isSpotlight
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw'
    : isWide
    ? '(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 33vw'
    : '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw';

  return (
    <div ref={cardRef} className="group/card relative h-full w-full">
      <Link
        href={`/games/${game.slug}`}
        className={`game-card group relative flex h-full w-full rounded-xl overflow-hidden active-click ${
          compact ? 'game-card-compact' : ''
        } ${
          isSpotlight ? 'game-card-spotlight' : 'border border-border/60'
        }`}
        aria-label={`Play ${game.title}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        {/* Thumbnail — zooms on hover, fades out when video plays */}
        <GameImage
          game={game}
          alt=""
          fill
          className={`game-card-thumb object-cover transition-[opacity,transform] duration-300 ease-out group-hover:scale-105 ${videoPlaying ? 'opacity-0' : 'opacity-100'}`}
          fallbackClassName="absolute inset-0 flex items-center justify-center bg-navy text-sm font-black text-muted"
          sizes={sizes}
          priority={priority}
        />

        {/* Video preview */}
        {shouldRenderVideo && (
          <video
            ref={videoRef}
            src={videoSrc}
            loop playsInline preload={hovered ? 'auto' : 'metadata'}
            poster={game.thumb}
            onLoadedData={() => { if (hovered) setVideoPlaying(true); }}
            onCanPlay={() => { if (hovered && videoRef.current) playPreviewVideo(videoRef.current); }}
            onPlaying={() => setVideoPlaying(true)}
            onError={() => { setVideoFailed(true); setVideoPlaying(false); }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden="true"
          />
        )}

        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none"
          style={{ height: isSpotlight ? '50%' : '60%' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ padding: isSpotlight ? '14px' : '8px 8px 7px' }}
        >
          <p className={`text-white font-bold leading-tight line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] ${
            isSpotlight ? 'text-sm md:text-base title-display font-black' : 'text-[0.78rem]'
          }`}>
            {game.title}
          </p>
        </div>
      </Link>

      {badge && <CardBadge badge={badge} compact={compact} />}

      {rank !== undefined && (
        <div className={`pointer-events-none absolute -left-2 z-30 flex items-center justify-center border-2 border-background bg-accent font-black leading-none text-white shadow-[0_8px_18px_oklch(12%_0.012_250/0.24),0_1px_3px_oklch(12%_0.012_250/0.16)] ${
          compact ? '-top-2 h-6 min-w-7 rounded-[10px] px-1.5 text-xs' : '-top-2.5 h-8 min-w-9 rounded-[13px] px-2.5 text-base'
        }`}>
          <span>{rank}</span>
        </div>
      )}

      <FavoriteButton game={game} compact={compact} />
    </div>
  );
}
