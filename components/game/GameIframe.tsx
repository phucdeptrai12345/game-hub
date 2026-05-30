'use client';

import { useRef, useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
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
  const [iframeScale, setIframeScale] = useState(1);

  const rawW = parseInt(game.width || '800', 10);
  const rawH = parseInt(game.height || '600', 10);
  const safeW = Number.isFinite(rawW) && rawW > 0 ? rawW : 800;
  const safeH = Number.isFinite(rawH) && rawH > 0 ? rawH : 600;
  const frameW = safeW;
  const frameH = safeH;
  const aspectRatio = frameW / frameH;
  // Use 16:9 as minimum for landscape games so we never clip wider content
  // (e.g. Y8 games stored as 4:3 but actually rendered 16:9 in the embed).
  // Any narrower game (4:3, 3:2) gets letterboxed — container bg is black so
  // it looks like cinema bars, not broken layout.
  const displayAspectRatio = aspectRatio >= 1 ? Math.max(aspectRatio, 16 / 9) : (aspectRatio > 0 ? aspectRatio : 4 / 3);
  const isExternalEmbed = /^https?:\/\//i.test(game.url);
  const cropEmbedChrome = isExternalEmbed;
  const renderW = Math.max(frameW, displayAspectRatio >= 1 ? 960 : 540);
  const renderCanvasH = Math.round(renderW / displayAspectRatio);
  const chromeBottom = cropEmbedChrome
    ? Math.round(Math.min(aspectRatio >= 1 ? 100 : 56, renderCanvasH * 0.15))
    : 0;
  const renderH = renderCanvasH + chromeBottom;

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !Number.isFinite(renderW) || !Number.isFinite(renderH)) return;
    const frame = container;

    function syncScale() {
      const rect = frame.getBoundingClientRect();
      const nextScale = Math.min(rect.width / renderW, rect.height / renderCanvasH);
      setIframeScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    }

    syncScale();
    const observer = new ResizeObserver(syncScale);
    observer.observe(frame);
    window.addEventListener('resize', syncScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncScale);
    };
  }, [renderW, renderCanvasH]);

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
          width: `min(100%, calc((100dvh - 112px) * ${displayAspectRatio}))`,
          maxHeight: 'calc(100dvh - 112px)',
          backgroundColor: '#000',
        } as CSSProperties}
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
          allow="autoplay *; fullscreen *; gamepad *; accelerometer *; gyroscope *"
          scrolling="no"
          className="absolute left-1/2 top-0 border-0"
          style={{
            width: `${renderW}px`,
            height: `${renderH}px`,
            transform: `translateX(-50%) scale(${iframeScale})`,
            transformOrigin: 'top center',
          }}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Scanlines overlay on iframe for high-tech cabinet look */}
        <div className="absolute inset-0 scanlines opacity-[0.04] pointer-events-none" />

        <button
          onClick={toggleFullscreen}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-black/45 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-accent active-click"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
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
  );
}
