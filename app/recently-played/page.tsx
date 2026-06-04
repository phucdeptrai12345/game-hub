'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Game } from '@/lib/types';
import { getRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import GameImage from '@/components/ui/GameImage';
import { useI18n } from '@/components/providers/I18nProvider';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function RecentlyPlayedPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGames(getRecentlyPlayed());
    setLoaded(true);
  }, []);

  useGSAP(() => {
    gsap.from('h1', {
      y: 32,
      opacity: 0,
      duration: 0.55,
      ease: 'power3.out',
      immediateRender: false,
    });
  }, { scope: containerRef });

  useGSAP(() => {
    if (!loaded || games.length === 0) return;
    gsap.from('.game-card', {
      y: 24,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.out',
      stagger: 0.06,
      immediateRender: false,
    });
  }, { scope: containerRef, dependencies: [loaded, games.length] });

  return (
    <div ref={containerRef} className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <div className="mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight flex items-center gap-3">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              {t('recentlyPlayed.title')}
            </h1>
            {games.length > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem('gz-recently-played');
                  setGames([]);
                  window.dispatchEvent(new CustomEvent('gz-recent-changed'));
                }}
                className="link-red-action text-sm font-bold"
              >
                {t('recentlyPlayed.clearHistory')}
              </button>
            )}
          </div>
          <p className="text-muted text-sm font-semibold mt-1">
            {games.length} {games.length === 1 ? t('favorites.game') : t('favorites.games')} {t('recentlyPlayed.inHistory')}
          </p>
        </div>
      </div>

      {!loaded ? null : games.length === 0 ? (
        <div className="text-center py-28">
          <svg className="w-16 h-16 text-border mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 6v6l4 2" />
          </svg>
          <p className="text-xl font-bold text-fg">{t('recentlyPlayed.empty')}</p>
          <p className="text-muted font-semibold mt-2 mb-8">
            {t('recentlyPlayed.emptyDesc')}
          </p>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors duration-150"
          >
            {t('common.browseAll')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group flex flex-col gap-1.5 active-click"
            >
              <div className="game-card relative w-full rounded-xl overflow-hidden bg-border/40 aspect-square border border-border/60">
                <GameImage
                  game={game}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  fallbackClassName="absolute inset-0 flex items-center justify-center bg-navy text-xs font-black text-muted"
                  unoptimized
                />
              </div>
              <p className="text-xs font-bold text-fg group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                {game.title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
