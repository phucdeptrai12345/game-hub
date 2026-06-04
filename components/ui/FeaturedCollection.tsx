'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import GameCard from '@/components/ui/GameCard';
import type { Game } from '@/lib/types';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  title?: string;
  titleKey?: string;
  games: Game[];
  autoPlay?: boolean;
}

function ArrowIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d={direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

export default function FeaturedCollection({ title, titleKey = 'section.featured', games, autoPlay = true }: Props) {
  const { t } = useI18n();
  const displayTitle = title ?? t(titleKey);
  const pages = useMemo(() => {
    const chunks: Game[][] = [];
    for (let i = 0; i < games.length; i += 6) chunks.push(games.slice(i, i + 6));
    return chunks;
  }, [games]);

  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(() => setPage((p) => (p + 1) % pages.length), [pages.length]);
  const goPrev = useCallback(() => setPage((p) => (p === 0 ? pages.length - 1 : p - 1)), [pages.length]);

  useEffect(() => {
    if (!autoPlay || paused || pages.length <= 1) return;
    const t = setInterval(goNext, 4000);
    return () => clearInterval(t);
  }, [autoPlay, paused, pages.length, goNext]);

  if (pages.length === 0) return null;

  const currentGames = pages[page] ?? pages[0];
  const canCycle = pages.length > 1;

  return (
    <section
      aria-labelledby={`shelf-${displayTitle.toLowerCase().replace(/\W+/g, '-')}`}
      className="min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <h2
            id={`shelf-${displayTitle.toLowerCase().replace(/\W+/g, '-')}`}
            className="truncate text-lg font-black uppercase tracking-tight text-fg title-display"
          >
            {displayTitle}
          </h2>
        </div>

        {canCycle && (
          <div className="flex items-center gap-2">
            {/* Dot indicators */}
            <div className="flex gap-1 items-center">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Page ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    i === page
                      ? 'w-4 h-1.5 bg-accent'
                      : 'w-1.5 h-1.5 bg-border hover:bg-muted'
                  }`}
                />
              ))}
            </div>
            <button onClick={goPrev}
              className="active-click flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-surface/95 text-muted shadow-sm transition-colors hover:text-accent"
              aria-label="Previous">
              <ArrowIcon direction="prev" />
            </button>
            <button onClick={goNext}
              className="active-click flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-surface/95 text-muted shadow-sm transition-colors hover:text-accent"
              aria-label="Next">
              <ArrowIcon direction="next" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {currentGames.map((game, index) => (
          <div key={`${page}-${game.id}`} className="featured-card-page aspect-square min-h-[78px]">
            <GameCard game={game} priority={page === 0 && index < 6} variant="default" compact />
          </div>
        ))}
      </div>
    </section>
  );
}
