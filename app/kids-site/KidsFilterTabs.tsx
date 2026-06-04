'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/components/providers/I18nProvider';
import Link from 'next/link';
import GameImage from '@/components/ui/GameImage';
import type { Game } from '@/lib/types';

export type KidsFilter = {
  id: string;
  label: string;
  games: Game[];
};

function KidsFilterTile({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <Link href={`/games/${game.slug}`} className="kids-game-tile group" data-kids-game-card="true">
      <span className="kids-game-thumb">
        <GameImage
          game={game}
          alt=""
          fill
          className="object-cover"
          fallbackClassName="kids-game-image-fallback"
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 18vw"
          priority={priority}
        />
      </span>
      <span className="kids-game-title">{game.title}</span>
    </Link>
  );
}

export default function KidsFilterTabs({ filters }: { filters: KidsFilter[] }) {
  const { t } = useI18n();
  const safeFilters = useMemo(() => filters.filter((filter) => filter.games.length > 0), [filters]);
  const [activeId, setActiveId] = useState(safeFilters[0]?.id ?? '');
  const activeFilter = safeFilters.find((filter) => filter.id === activeId) ?? safeFilters[0];

  if (!activeFilter) return null;

  return (
    <section id="kids-games" className="kids-filter-panel" aria-label={t('kids.chooseGames')}>
      <div className="kids-filter-tabs" role="tablist" aria-label={t('kids.gameFilters')}>
        {safeFilters.map((filter) => {
          const active = filter.id === activeFilter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`kids-filter-tab ${active ? 'kids-filter-tab-active' : ''}`}
              onClick={() => setActiveId(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="kids-game-grid kids-game-grid-main">
        {activeFilter.games.slice(0, 20).map((game, index) => (
          <KidsFilterTile key={game.id} game={game} priority={index < 8} />
        ))}
      </div>
    </section>
  );
}
