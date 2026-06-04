'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Game } from '@/lib/types';
import GameImage from '@/components/ui/GameImage';

type Pick = 'all' | 'boys' | 'girls';

interface Props {
  boyGames: Game[];
  girlGames: Game[];
  allGames: Game[];
}

function GameTile({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`} className="group block min-w-0">
      <span className="relative block aspect-square overflow-hidden rounded-xl border border-border/60 bg-navy shadow-[0_5px_0_oklch(82%_0.04_72)] transition-transform duration-150 group-hover:-translate-y-1">
        <GameImage
          game={game}
          alt=""
          fill
          className="object-cover"
          fallbackClassName="kids-game-image-fallback"
          sizes="(max-width: 640px) 30vw, 14vw"
        />
      </span>
      <span className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold leading-tight text-fg transition-colors duration-150 group-hover:text-accent">
        {game.title}
      </span>
    </Link>
  );
}

export default function KidsGenderPicker({ boyGames, girlGames, allGames }: Props) {
  const [pick, setPick] = useState<Pick>('all');

  const games = pick === 'boys' ? boyGames : pick === 'girls' ? girlGames : allGames;

  return (
    <section className="kids-gender-section">
      <div className="kids-gender-row">
        {/* Boy */}
        <button
          type="button"
          onClick={() => setPick('boys')}
          className={`kids-gender-card kids-gender-card-boy ${pick === 'boys' ? 'kids-gender-selected' : ''}`}
          aria-pressed={pick === 'boys'}
        >
          <div className="kids-gender-icon-bubble">
            <span aria-hidden="true">🎮</span>
          </div>
          <span className="kids-gender-label">Boys</span>
          {pick === 'boys' && (
            <span className="kids-gender-badge" aria-hidden="true">✓</span>
          )}
        </button>

        {/* All */}
        <button
          type="button"
          onClick={() => setPick('all')}
          className={`kids-gender-all-btn ${pick === 'all' ? 'kids-gender-all-active' : ''}`}
          aria-pressed={pick === 'all'}
        >
          <span className="text-2xl leading-none" aria-hidden="true">🌈</span>
          <span className="text-base font-black">All</span>
        </button>

        {/* Girl */}
        <button
          type="button"
          onClick={() => setPick('girls')}
          className={`kids-gender-card kids-gender-card-girl ${pick === 'girls' ? 'kids-gender-selected' : ''}`}
          aria-pressed={pick === 'girls'}
        >
          <div className="kids-gender-icon-bubble">
            <span aria-hidden="true">🌸</span>
          </div>
          <span className="kids-gender-label">Girls</span>
          {pick === 'girls' && (
            <span className="kids-gender-badge" aria-hidden="true">✓</span>
          )}
        </button>
      </div>

      {games.length > 0 && (
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-3 sm:gap-4">
          {games.slice(0, 10).map((game) => (
            <GameTile key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
