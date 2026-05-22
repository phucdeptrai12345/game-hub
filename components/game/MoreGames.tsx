import { Game } from '@/lib/types';
import GameGrid from '@/components/ui/GameGrid';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

interface Props {
  games: Game[];
  currentGame: Game;
}

export default function MoreGames({ games, currentGame }: Props) {
  const sameCat = games.filter((g) => g.id !== currentGame.id && g.category === currentGame.category);
  const filtered = (sameCat.length >= 4 ? sameCat : games.filter((g) => g.id !== currentGame.id)).slice(0, 8);
  if (filtered.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="text-xl font-black text-fg">
            More {currentGame.category} Games
          </h2>
        </div>
        <Link
          href={`/category/${slugify(currentGame.category)}`}
          className="text-sm font-bold text-accent hover:text-accent-hover transition-colors"
        >
          View all →
        </Link>
      </div>
      <GameGrid games={filtered} />
    </section>
  );
}
