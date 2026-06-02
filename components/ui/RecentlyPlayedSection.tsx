'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { Game } from '@/lib/types';
import GameImage from './GameImage';

export default function RecentlyPlayedSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const refresh = useCallback(() => {
    setGames(getRecentlyPlayed().slice(0, 20));
  }, []);

  const syncScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanPrev(scroller.scrollLeft > 4);
    setCanNext(scroller.scrollLeft < maxScroll - 4);
  }, []);

  // Refresh khi navigate về homepage
  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  // Refresh khi user quay lại tab
  useEffect(() => {
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, [refresh]);

  useEffect(() => {
    syncScrollState();

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const resizeObserver = new ResizeObserver(syncScrollState);
    resizeObserver.observe(scroller);
    scroller.addEventListener('scroll', syncScrollState, { passive: true });
    window.addEventListener('resize', syncScrollState);

    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener('scroll', syncScrollState);
      window.removeEventListener('resize', syncScrollState);
    };
  }, [syncScrollState, games.length]);

  function scrollByPage(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.86, 420),
      behavior: 'smooth',
    });
  }

  if (games.length === 0) return null;

  return (
    <section id="recently-played" className="mb-8 scroll-mt-20">
      <div className="mb-3 flex min-w-0 items-center gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-6 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="text-xl font-black uppercase tracking-tight text-fg title-display sm:text-2xl">
            Continue Playing
          </h2>
        </div>
        <button
          onClick={() => { localStorage.removeItem('gz-recently-played'); setGames([]); }}
          className="link-red-action shrink-0 text-sm font-black sm:text-[15px]"
        >
          Clear
        </button>
      </div>

      <div
        className="recently-row-shell"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={scrollerRef} className="recently-game-strip scrollbar-hidden">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="recently-game-item group active-click"
            >
              <div className="relative mb-1.5 aspect-square w-full overflow-hidden rounded-xl bg-border/40 ring-2 ring-accent/25">
                <GameImage
                  game={game}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  fallbackClassName="absolute inset-0 flex items-center justify-center bg-navy text-xs font-black text-muted"
                  unoptimized
                />
              </div>
              <p className="line-clamp-2 text-xs font-bold leading-snug text-fg transition-colors group-hover:text-accent">
                {game.title}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous continue playing"
          onClick={() => scrollByPage(-1)}
          className={`category-row-nav category-row-nav-prev ${canPrev ? '' : 'category-row-nav-hidden'} ${isHovered ? 'category-row-nav-visible' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next continue playing"
          onClick={() => scrollByPage(1)}
          className={`category-row-nav category-row-nav-next ${canNext ? '' : 'category-row-nav-hidden'} ${isHovered ? 'category-row-nav-visible' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
