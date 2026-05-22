'use client';

import { useRef, useState, useEffect } from 'react';
import { Game } from '@/lib/types';
import { CATEGORIES } from '@/constants/categories';
import { slugify } from '@/lib/utils';

interface Props {
  game: Game;
}

export default function GameIframe({ game }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  async function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  const aspectW = parseInt(game.width || '800', 10);
  const aspectH = parseInt(game.height || '600', 10);

  // Match category color for ambient glow tinting
  const cat = CATEGORIES.find((c) => c.slug === slugify(game.category));
  const glowColor = cat?.color?.text || 'var(--color-accent)';

  return (
    <div className="relative w-full">
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
        className="relative z-10 w-full rounded-[20px] overflow-hidden border border-black/5 shadow-[0_20px_50px_oklch(22%_0.015_255/0.08)]"
        style={{
          aspectRatio: `${aspectW} / ${aspectH}`,
          backgroundColor: 'var(--color-game-surface)',
        }}
      >
        {/* Loading spinner until iframe fires onLoad */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10" aria-label="Loading game">
            <svg className="w-10 h-10 text-accent animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        )}

        <iframe
          src={game.url}
          title={game.title}
          allowFullScreen
          allow="autoplay; fullscreen; gamepad"
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Scanlines overlay on iframe for high-tech cabinet look */}
        <div className="absolute inset-0 scanlines opacity-[0.04] pointer-events-none" />

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-accent rounded-lg transition-all duration-150 backdrop-blur-sm active-click"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 15v4.5M9 15H4.5M15 9h4.5M15 9V4.5M15 15h4.5M15 15v4.5" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
