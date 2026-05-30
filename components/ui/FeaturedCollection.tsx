'use client';

import { useMemo, useState } from 'react';
import GameCard from '@/components/ui/GameCard';
import type { Game } from '@/lib/types';

interface Props {
  title?: string;
  games: Game[];
}

function ArrowIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d={direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  );
}

export default function FeaturedCollection({ title = 'Featured Collection', games }: Props) {
  const pages = useMemo(() => {
    const chunks: Game[][] = [];
    for (let i = 0; i < games.length; i += 4) {
      chunks.push(games.slice(i, i + 4));
    }
    return chunks;
  }, [games]);

  const [page, setPage] = useState(0);

  if (pages.length === 0) return null;

  const currentGames = pages[page] ?? pages[0];
  const canCycle = pages.length > 1;

  function goPrev() {
    setPage((current) => (current === 0 ? pages.length - 1 : current - 1));
  }

  function goNext() {
    setPage((current) => (current + 1) % pages.length);
  }

  return (
    <section aria-labelledby={`game-shelf-${title.toLowerCase().replace(/\W+/g, '-')}`} className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 id={`game-shelf-${title.toLowerCase().replace(/\W+/g, '-')}`} className="text-base font-black uppercase tracking-wide text-fg">
          {title}
        </h2>
        <div className="flex items-center gap-1.5">
          {canCycle && (
            <>
              <button
                onClick={goPrev}
                className="active-click flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-surface/95 text-muted shadow-[0_2px_10px_oklch(10%_0.01_250/0.16)] transition-colors duration-150 hover:text-accent"
                aria-label="Previous featured games"
              >
                <ArrowIcon direction="prev" />
              </button>
              <button
                onClick={goNext}
                className="active-click flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-surface/95 text-muted shadow-[0_2px_10px_oklch(10%_0.01_250/0.16)] transition-colors duration-150 hover:text-accent"
                aria-label="Next featured games"
              >
                <ArrowIcon direction="next" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {currentGames.map((game, index) => (
          <div key={`${page}-${game.id}`} className="featured-card-page aspect-[16/11] min-h-[92px]">
            <GameCard game={game} priority={page === 0 && index < 4} variant="wide" />
          </div>
        ))}
      </div>
    </section>
  );
}
