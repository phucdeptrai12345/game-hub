import { getMostPlayedGames, getNewestGames, getAllGames } from '@/lib/gamemonetize';
import type { Game } from '@/lib/types';
import GameGrid from '@/components/ui/GameGrid';
import Pagination from '@/components/ui/Pagination';
import SortDropdown from '@/components/ui/SortDropdown';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

const PAGE_SIZE = 200;

interface Props {
  searchParams: Promise<{ sort?: string; page?: string }>;
}

const SORT_OPTS = [
  { value: 'popular', label: 'Top games' },
  { value: 'new',     label: 'New games' },
  { value: 'az',      label: 'A-Z'       },
];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { sort } = await searchParams;
  if (sort === 'new') return { title: 'New Games', description: 'Play the latest free HTML5 games, freshly added with no download needed.' };
  if (sort === 'az')  return { title: 'All Games A-Z', description: 'Browse all free HTML5 games in alphabetical order.' };
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

  if (sort === 'new') {
    // Only newest — completely separate from mostPlayed
    games = await getNewestGames(500);
    heading = 'New Arrivals';
    subtext = 'Just dropped';

  } else if (sort === 'az') {
    const all = await getAllGames();
    games = dedup(all).sort((a, b) => a.title.localeCompare(b.title));
    heading = 'All Games';
    subtext = `${games.length.toLocaleString()} titles, A–Z`;

  } else {
    // popular — mostPlayed only, with ranks
    games = await getMostPlayedGames(500);
    heading = 'Top Games';
    subtext = 'Ranked by plays';
  }

  const totalPages = Math.ceil(games.length / PAGE_SIZE);
  const paged = games.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight">
            {heading}
          </h1>
          <p className="text-muted text-xs font-medium mt-0.5 uppercase tracking-wider">{subtext}</p>
        </div>
        <SortDropdown
          activeValue={sort}
          options={SORT_OPTS.map((opt) => ({
            ...opt,
            href: `/games?sort=${opt.value}`,
          }))}
        />
      </div>

      {paged.length > 0 ? (
        <>
          <GameGrid
            games={paged}
            priorityCount={8}
          />
          <div className="games-pagination">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </>
      ) : (
        <div className="text-center py-28">
          <p className="text-5xl mb-5" aria-hidden="true">🎮</p>
          <p className="text-xl font-black text-fg">No games found</p>
          <Link href="/games" className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-md">
            View all games
          </Link>
        </div>
      )}
    </div>
  );
}
