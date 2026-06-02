import Link from 'next/link';
import type { Game } from '@/lib/types';
import GameImage from './GameImage';

interface Props {
  games: Game[];
}

export default function HeroGameTicker({ games }: Props) {
  const strip = games.slice(0, 14);
  if (strip.length === 0) return null;

  const loop = [...strip, ...strip];

  return (
    <div className="hero-game-ticker mt-6" aria-label="Featured computer and mobile games">
      <div className="hero-game-ticker-track">
        {loop.map((game, index) => (
          <Link
            key={`${game.id}-${index}`}
            href={`/games/${game.slug}`}
            className="hero-game-tile group"
            aria-label={`Play ${game.title}`}
          >
            <GameImage
              game={game}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              fallbackClassName="absolute inset-0 flex items-center justify-center bg-navy text-[10px] font-black text-muted"
              sizes="72px"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
