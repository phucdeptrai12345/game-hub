import { getMostPlayedGames, getNewestGames, getAllGames } from '@/lib/gamemonetize';
import type { Game } from '@/lib/types';
import GameGrid from '@/components/ui/GameGrid';
import Pagination from '@/components/ui/Pagination';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

const PAGE_SIZE = 200;

interface Props {
  searchParams: Promise<{ sort?: string; page?: string }>;
}

const SORT_OPTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'new',     label: 'New'     },
  { value: 'az',      label: 'A–Z'     },
];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { sort } = await searchParams;
  if (sort === 'new') return { title: 'New Games', description: 'Play the latest free HTML5 games — freshly added, no download needed.' };
  if (sort === 'az')  return { title: 'All Games A–Z', description: 'Browse all free HTML5 games in alphabetical order.' };
  return { title: 'Popular Games', description: 'Browse 9,000+ free HTML5 games. No download, no sign-up.' };
}

function dedup(list: Game[]): Game[] {
  const seen = new Set<string>();
  return list.filter((g) => (seen.has(g.slug) ? false : (seen.add(g.slug), true)));
}

export default async function GamesPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort ?? 'popular';
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  let games: Game[];
  let heading: string;
  let subtext: string;
  let showRank = false;
  let badge: 'new' | 'hot' | undefined;

  if (sort === 'new') {
    // Only newest — completely separate from mostPlayed
    games = await getNewestGames(500);
    heading = 'New Games';
    subtext = 'Freshly added games';
    badge = 'new';

  } else if (sort === 'az') {
    const all = await getAllGames();
    games = dedup(all).sort((a, b) => a.title.localeCompare(b.title));
    heading = 'All Games A–Z';
    subtext = `${games.length.toLocaleString()} games`;

  } else {
    // popular — mostPlayed only, with ranks
    games = await getMostPlayedGames(500);
    heading = 'Popular Games';
    subtext = 'Most played right now';
    showRank = true;
  }

  const totalPages = Math.ceil(games.length / PAGE_SIZE);
  const paged = games.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight">
            {heading}
          </h1>
          <p className="text-muted text-sm font-semibold mt-1">{subtext}</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:mt-1 sm:w-auto sm:shrink-0">
          {SORT_OPTS.map((opt) => (
            <Link
              key={opt.value}
              href={`/games?sort=${opt.value}`}
              className={`flex-1 rounded-full px-3 py-2 text-center text-xs font-bold transition-colors duration-150 sm:flex-none ${
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

      {paged.length > 0 ? (
        <>
          <GameGrid
            games={paged}
            priorityCount={8}
            showRank={showRank}
            badge={badge}
            badgeCount={sort === 'new' ? 500 : 20}
          />
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-28">
          <p className="text-5xl mb-5" aria-hidden="true">🎮</p>
          <p className="text-xl font-black text-fg">No games found</p>
          <Link href="/games" className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl">
            View all games
          </Link>
        </div>
      )}
    </div>
  );
}
