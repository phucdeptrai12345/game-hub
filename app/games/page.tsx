import { getMostPlayedGames, getNewestGames } from '@/lib/gamemonetize';
import { getY8Games, Y8_CURATED_GAME_SLUGS } from '@/lib/y8';
import type { Game } from '@/lib/types';
import GameGrid from '@/components/ui/GameGrid';
import Pagination from '@/components/ui/Pagination';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'All Games',
  description: 'Browse 3,000+ free HTML5 games. No download, no sign-up. Action, puzzle, racing, and more.',
};

const PAGE_SIZE = 200;

interface Props {
  searchParams: Promise<{ sort?: string; page?: string }>;
}

function dedup(list: Game[]): Game[] {
  const seen = new Set<string>();
  return list.filter((g) => (seen.has(g.slug) ? false : (seen.add(g.slug), true)));
}

// Interleave Y8 curated games (hand-picked list, ~every 4th slot) into a base list.
// This surfaces iconic Y8 games (Slope, Vex, Moto X3M…) near the top
// rather than burying them after 500 GM games.
function interleaveY8Curated(base: Game[], y8All: Game[], interval = 4): Game[] {
  const curated = y8All.filter((g) => Y8_CURATED_GAME_SLUGS.has(g.slug));
  const extended = y8All.filter((g) => !Y8_CURATED_GAME_SLUGS.has(g.slug));

  const result: Game[] = [];
  const seen = new Set<string>();
  let ci = 0;

  for (let i = 0; i < base.length || ci < curated.length; i++) {
    // Insert one curated Y8 game every `interval` slots
    if (ci < curated.length && i > 0 && i % interval === 0) {
      const g = curated[ci++];
      if (!seen.has(g.slug)) { seen.add(g.slug); result.push(g); }
    }
    if (i < base.length) {
      const g = base[i];
      if (!seen.has(g.slug)) { seen.add(g.slug); result.push(g); }
    }
  }
  // Flush remaining curated
  for (; ci < curated.length; ci++) {
    const g = curated[ci];
    if (!seen.has(g.slug)) { seen.add(g.slug); result.push(g); }
  }
  // Append extended Y8 games at the end
  for (const g of extended) {
    if (!seen.has(g.slug)) { seen.add(g.slug); result.push(g); }
  }
  return result;
}

export default async function GamesPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort ?? 'popular';
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  const [mostPlayed, newest, y8Games] = await Promise.all([
    getMostPlayedGames(500),
    getNewestGames(500),
    getY8Games(),
  ]);

  let games: Game[];
  if (sort === 'new') {
    // GM newest API order first (genuinely new), then Y8, then remaining popular-only
    const newestSlugs = new Set(newest.map((g) => g.slug));
    games = dedup([...newest, ...y8Games, ...mostPlayed.filter((g) => !newestSlugs.has(g.slug))]);
  } else if (sort === 'az') {
    games = dedup([...mostPlayed, ...newest, ...y8Games]).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  } else {
    // popular: interleave Y8 curated into GM mostplayed (every 4th slot),
    // then extended Y8 at the back
    games = interleaveY8Curated([...mostPlayed, ...newest.filter(g => !mostPlayed.find(m => m.slug === g.slug))], y8Games, 4);
  }

  const totalPages = Math.ceil(games.length / PAGE_SIZE);
  const paged = games.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10">

      {/* Page header + Sort */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight">
            All Games
          </h1>
          <p className="text-muted text-sm font-semibold mt-1">
            {games.length.toLocaleString()} {games.length === 1 ? 'game' : 'games'} available
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-muted uppercase tracking-widest hidden sm:inline">Sort</span>
          <div className="flex gap-1.5">
            {[
              { value: 'popular', label: 'Popular' },
              { value: 'new', label: 'Newest' },
              { value: 'az', label: 'A–Z' },
            ].map((opt) => (
              <Link
                key={opt.value}
                href={`/games?sort=${opt.value}`}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-colors duration-150 ${
                  sort === opt.value
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-border text-fg hover:bg-accent/10'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {paged.length > 0 ? (
        <>
          <GameGrid games={paged} priorityCount={8} />
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-28">
      <p className="text-5xl mb-5" aria-hidden="true">🎮</p>
      <p className="text-xl font-black text-fg">No games found</p>
      <p className="text-muted font-semibold mt-2 mb-8">
        Try a different sort option.
      </p>
      <Link
        href="/games"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors duration-150"
      >
        View all games
      </Link>
    </div>
  );
}
