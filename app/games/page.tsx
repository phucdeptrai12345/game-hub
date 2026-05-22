import { getAllGames } from '@/lib/gamemonetize';
import GameGrid from '@/components/ui/GameGrid';
import Pagination from '@/components/ui/Pagination';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'All Games',
  description: 'Browse hundreds of free HTML5 games. Filter by category, sort by newest or A-Z.',
};

const PAGE_SIZE = 250;

interface Props {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}

export default async function GamesPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort ?? 'new';
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  let games = await getAllGames();

  if (sort === 'az') {
    games = [...games].sort((a, b) => a.title.localeCompare(b.title));
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
