import { Game } from '@/lib/types';
import { slugify } from '@/lib/utils';
import GameCard, { type GameBadge } from './GameCard';
import AdCard from './AdCard';
import React from 'react';

interface Props {
  games: Game[];
  priorityCount?: number;
  spotlight?: boolean;
  showAds?: boolean;
  layout?: 'default' | 'poki';
  showRank?: boolean;
  rankStart?: number;
  badge?: GameBadge;
  badgeCount?: number;
}


// Deterministic block sizes pattern (repeating sequence: every 6th card is a 2x2 spotlight, others are 1x1 default)
function getItemVariant(index: number, usePoki: boolean): 'default' | 'spotlight' {
  if (!usePoki) return 'default';
  
  // Every 6th card is a 2x2 spotlight card, creating a beautiful balance of squares and double-squares
  return index % 6 === 0 ? 'spotlight' : 'default';
}

function badgeFor(game: Game, index: number, preferred?: GameBadge, badgeCount = 30): GameBadge | undefined {
  if (!preferred || index >= badgeCount) return undefined;

  const slugs = [game.category, ...game.tags].map((value) => slugify(value));
  if (slugs.some((value) => value === 'kids' || value === 'baby' || value === 'girls')) return undefined;
  if (game.orientation === 'portrait' || slugs.some((value) => value === 'mobile' || value === 'hypercasual')) return 'mobile';

  if (preferred === 'new') return 'new';
  if (preferred === 'top') return index % 2 === 0 ? 'top' : 'hot';
  if (preferred === 'editor') return index % 3 === 0 ? 'editor' : index % 3 === 1 ? 'top' : 'hot';
  if (preferred === 'fresh') return 'new';

  return index % 3 === 0 ? preferred : index % 3 === 1 ? 'top' : 'editor';
}

export default function GameGrid({
  games,
  priorityCount = 6,
  spotlight = true,
  showAds = false,
  layout = 'poki',
  showRank = false,
  rankStart = 1,
  badge,
  badgeCount = 30,
}: Props) {
  if (games.length === 0) return null;

  const usePoki = layout === 'poki';

  // Inject ads at specific intervals inside the grid to maximize impressions
  const items: ({ type: 'game'; data: Game } | { type: 'ad'; id: string })[] = [];
  let adCount = 0;

  games.forEach((game, index) => {
    // For Poki layout, scatter multiple ads natively. For default, inject one near the beginning.
    if (showAds) {
      const shouldInjectAd = usePoki
        ? index === 4 || index === 18 || index === 35 || index === 52 || index === 70 || index === 88
        : index === (spotlight ? 4 : 3);

      if (shouldInjectAd) {
        items.push({ type: 'ad', id: `ad-${adCount++}` });
      }
    }
    items.push({ type: 'game', data: game });
  });


  return (
    <div className={usePoki ? 'grid-poki' : 'grid-standard'}>
      {items.map((item, i) => {
        const variant = getItemVariant(i, usePoki);
        const staggerDelay = Math.min(i * 35, 450); // faster stagger for dense grids
        
        let spanClass = 'col-span-1 row-span-1';
        if (usePoki) {
          if (variant === 'spotlight') spanClass = 'col-span-2 row-span-2';
        } else if (spotlight && i === 0) {
          // Fallback legacy spotlight span
          spanClass = 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
        }

        if (item.type === 'ad') {
          const adVariant = variant === 'spotlight' ? 'wide' : 'default';
          return (
            <div
              key={item.id}
              className={`card-enter ${spanClass}`}
              style={{ '--stagger': `${staggerDelay}ms` } as React.CSSProperties}
            >
              <AdCard variant={adVariant} />
            </div>
          );
        }

        const gameIndex = items.filter((x) => x.type === 'game').indexOf(item);
        const cardVariant = !usePoki && spotlight && gameIndex === 0 ? 'spotlight' : variant;

        return (
          <div
            key={item.data.id}
            className={`card-enter ${spanClass}`}
            style={{ '--stagger': `${staggerDelay}ms` } as React.CSSProperties}
          >
            <GameCard
              game={item.data}
              priority={gameIndex < priorityCount}
              variant={cardVariant}
              rank={showRank ? rankStart + gameIndex : undefined}
              badge={badgeFor(item.data, gameIndex, badge, badgeCount)}
            />
          </div>
        );
      })}
    </div>
  );
}
