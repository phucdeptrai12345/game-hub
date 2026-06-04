'use client';

import { useRef, useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Game } from '@/lib/types';
import { CATEGORIES } from '@/constants/categories';
import { slugify } from '@/lib/utils';
import { readStoredGames, writeStoredGames } from '@/lib/stored-games';
import GameImage from '@/components/ui/GameImage';
import { useI18n } from '@/components/providers/I18nProvider';

const FAVORITES_KEY = 'gz-favs';

interface Props {
  game: Game;
}

export default function GameIframe({ game }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(8);
  const [isFav, setIsFav] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showVolume, setShowVolume] = useState(false);
  const { t } = useI18n();

  const rawW = parseInt(game.width || '800', 10);
  const rawH = parseInt(game.height || '600', 10);
  const safeW = Number.isFinite(rawW) && rawW > 0 ? rawW : 800;
  const safeH = Number.isFinite(rawH) && rawH > 0 ? rawH : 600;
  const frameW = safeW;
  const frameH = safeH;
  const aspectRatio = frameW / frameH;
  // Use 16:9 as minimum for landscape games; narrower games get letterboxed.
  const displayAspectRatio = aspectRatio >= 1 ? Math.max(aspectRatio, 16 / 9) : (aspectRatio > 0 ? aspectRatio : 4 / 3);
  const frameSrc =
    game.provider === 'famobi' && game.sourceId
      ? `/api/famobi-frame/${encodeURIComponent(game.sourceId)}`
      : game.url;
  const sandboxPermissions = [
    'allow-scripts',
    'allow-same-origin',
    'allow-forms',
    'allow-modals',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    'allow-pointer-lock',
    'allow-presentation',
    'allow-downloads',
    'allow-storage-access-by-user-activation',
  ].filter(Boolean).join(' ');

  useEffect(() => {
    setIsLoaded(false);
    setLoadProgress(8);
  }, [frameSrc]);

  useEffect(() => {
    if (isLoaded) {
      setLoadProgress(100);
      return;
    }

    const timer = window.setInterval(() => {
      setLoadProgress((current) => {
        if (current >= 92) return current;
        const next = current + 4 + Math.random() * 7;
        return Math.min(92, next);
      });
    }, 420);

    return () => window.clearInterval(timer);
  }, [frameSrc, isLoaded]);

  useEffect(() => {
    setIsFav(readStoredGames(FAVORITES_KEY).some((storedGame) => storedGame.id === game.id));
  }, [game.id]);

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem('gz-volume') ?? '80', 10);
      if (stored === 0) { setMuted(true); setVolume(0); }
      else setVolume(Math.min(100, Math.max(0, stored)));
    } catch {}
  }, []);

  useEffect(() => {
    const val = muted ? 0 : volume / 100;
    document.querySelectorAll<HTMLMediaElement>('audio,video').forEach((el) => {
      el.volume = val;
      el.muted = muted;
    });
    try { localStorage.setItem('gz-volume', String(muted ? 0 : volume)); } catch {}
  }, [muted, volume]);

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  async function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement === containerRef.current) {
      await document.exitFullscreen();
    } else {
      await containerRef.current.requestFullscreen();
    }
  }

  function toggleFavorite() {
    try {
      const favs = readStoredGames(FAVORITES_KEY);
      const next = isFav ? favs.filter((storedGame) => storedGame.id !== game.id) : [game, ...favs];
      writeStoredGames(FAVORITES_KEY, next);
      setIsFav(!isFav);
    } catch {}
  }

  // Match category color for ambient glow tinting
  const cat = CATEGORIES.find((c) => c.slug === slugify(game.category));
  const glowColor = cat?.color?.text || 'var(--color-accent)';

  return (
    <div className="relative flex w-full justify-center">
      {/* Ambient Glow Backdrop (pulsating category tint) */}
      <div
        className="absolute -inset-3 sm:-inset-5 rounded-[28px] pointer-events-none transition-colors duration-1000 ambient-glow-bg z-0"
        style={{
          backgroundColor: glowColor,
        }}
      />

      {/* Screen Frame Cabinet */}
      <div
        ref={containerRef}
        className="game-frame-shell relative z-10 rounded-[20px] overflow-hidden border border-black/5 shadow-[0_20px_50px_oklch(22%_0.015_255/0.08)]"
        style={{
          aspectRatio: `${displayAspectRatio}`,
          '--game-aspect': displayAspectRatio,
          width: `min(96%, calc((100dvh - 148px) * ${displayAspectRatio}))`,
          maxHeight: 'calc(100dvh - 148px)',
          backgroundColor: '#000',
        } as CSSProperties}
      >
        {/* Loading layer until iframe fires onLoad */}
        {!isLoaded && (
          <div className="game-loader-overlay" aria-label="Loading game" role="status">
            <div className="game-loader-thumb" aria-hidden="true">
              <GameImage
                game={game}
                alt=""
                fill
                className="object-cover"
                fallbackClassName="text-[10px]"
                sizes="96px"
                priority
              />
            </div>
            <p className="game-loader-title">{t('game.loading')}</p>
            <p className="game-loader-subtitle">{game.title}</p>
            <div className="game-loader-bar" aria-hidden="true">
              <span style={{ width: `${loadProgress}%` }} />
            </div>
            <p className="game-loader-percent">{Math.round(loadProgress)}%</p>
          </div>
        )}

        <iframe
          key={frameSrc}
          src={frameSrc}
          title={game.title}
          allowFullScreen
          allow="autoplay *; fullscreen *; gamepad *; accelerometer *; gyroscope *"
          sandbox={sandboxPermissions}
          scrolling="no"
          referrerPolicy={game.provider === 'famobi' ? 'origin' : undefined}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          onLoad={() => {
            setLoadProgress(100);
            window.setTimeout(() => setIsLoaded(true), 180);
          }}
        />

        {/* Scanlines overlay on iframe for high-tech cabinet look */}
        <div className="absolute inset-0 scanlines opacity-[0.04] pointer-events-none" />

        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
          {/* Volume control */}
          <div className="relative flex items-center gap-1.5">
            {showVolume && (
              <div className="flex items-center gap-1.5 rounded-lg bg-black/70 px-2 py-1.5 backdrop-blur-sm">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    setMuted(v === 0);
                  }}
                  className="h-1 w-20 cursor-pointer accent-accent"
                  aria-label={t('game.volume')}
                />
              </div>
            )}
            <button
              onClick={() => {
                if (!showVolume) { setShowVolume(true); return; }
                setMuted((m) => !m);
              }}
              onBlur={() => setTimeout(() => setShowVolume(false), 200)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/45 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-accent active-click"
              aria-label={muted ? t('game.unmute') : t('game.mute')}
              title={muted ? t('game.unmute') : t('game.mute')}
            >
              {muted || volume === 0 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0 2-2m-2 2-2-2m2 2 2 2" />
                </svg>
              ) : volume < 50 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 0 1 0 7.072M5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 0 1 0 7.072M12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5zM19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={toggleFavorite}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-white backdrop-blur-sm transition-colors duration-150 active-click ${
              isFav ? 'bg-red-500 hover:bg-red-600' : 'bg-black/45 hover:bg-accent'
            }`}
            aria-label={isFav ? t('game.removeFavorite') : t('game.addFavorite')}
            title={isFav ? t('game.removeFavorite') : t('game.addFavorite')}
          >
            <svg className="h-4 w-4" fill={isFav ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.3} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 0 1 6.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 0 1 0-6.364z" />
            </svg>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/45 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-accent active-click"
            aria-label={isFullscreen ? t('game.exitFullscreen') : t('game.fullscreen')}
            title={isFullscreen ? t('game.exitFullscreen') : t('game.fullscreen')}
          >
            {isFullscreen ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 9V4.5M9 9H4.5M9 15v4.5M9 15H4.5M15 9h4.5M15 9V4.5M15 15h4.5M15 15v4.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
