import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import KidsPickerButton from './KidsPickerButton';
import GameImage from '@/components/ui/GameImage';
import { getAllGames } from '@/lib/gamemonetize';
import { Game } from '@/lib/types';
import { slugify } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Kids Site - GameZone',
  description:
    'A bright, playful page with easy online games for younger players on GameZone.',
};

const FRIENDLY_SLUGS = new Set([
  'kids',
  'casual',
  'puzzle',
  'cooking',
  'beauty',
  'girls',
  'arcade',
  'skill',
  'hypercasual',
  'platformer',
  'simulation',
  'clicker',
]);

const BLOCKED_SLUGS = new Set(['horror', 'zombie', 'shooting', 'fighting']);

const BLOCKED_WORDS = [
  'battle',
  'betting',
  'blackjack',
  'blood',
  'casino',
  'dalgona',
  'dead',
  'fight',
  'gambling',
  'gun',
  'horror',
  'kill',
  'knife',
  'poppy',
  'poker',
  'roulette',
  'shoot',
  'slot',
  'squid',
  'sniper',
  'survival',
  'war',
  'weapon',
  'zombie',
];

const DOODLES = [
  { kind: 'ball', color: '#ef4c44', className: 'kids-doodle-large' },
  { kind: 'car', color: '#ff9a3d', className: 'kids-doodle-small' },
  { kind: 'gamepad', color: '#ef4c44', className: 'kids-doodle-large' },
  { kind: 'rocket', color: '#41b883', className: 'kids-doodle-large' },
  { kind: 'skate', color: '#ffb30f', className: 'kids-doodle-large' },
  { kind: 'soccer', color: '#ef4c44', className: 'kids-doodle-large' },
  { kind: 'bike', color: '#4f7cff', className: 'kids-doodle-small' },
  { kind: 'robot', color: '#41b883', className: 'kids-doodle-large' },
] as const;

function uniqueById(games: Game[]) {
  const seen = new Set<string>();
  return games.filter((game) => {
    if (seen.has(game.id)) return false;
    seen.add(game.id);
    return true;
  });
}

function gameSlugs(game: Game) {
  return [game.category, ...game.tags].map((value) => slugify(value));
}

function isFriendlyGame(game: Game) {
  const slugs = gameSlugs(game);
  if (slugs.some((slug) => BLOCKED_SLUGS.has(slug))) return false;

  const haystack = [game.title, game.category, game.description, ...game.tags]
    .join(' ')
    .toLowerCase();

  if (BLOCKED_WORDS.some((word) => haystack.includes(word))) return false;
  return slugs.some((slug) => FRIENDLY_SLUGS.has(slug));
}

function bySlugs(games: Game[], slugs: string[]) {
  const targets = new Set(slugs);
  return games.filter((game) => gameSlugs(game).some((slug) => targets.has(slug)));
}

function KidsGameTile({
  game,
  priority = false,
}: {
  game: Game;
  priority?: boolean;
}) {
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

function DoodleIcon({
  kind,
  color,
  className,
}: {
  kind: string;
  color: string;
  className?: string;
}) {
  const doodleStyle = { color } as CSSProperties;
  const common = {
    className: `kids-doodle ${className ?? ''}`,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '3.2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: doodleStyle,
    'aria-hidden': true,
  };

  switch (kind) {
    case 'ball':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" className="kids-doodle-fill" />
          <path d="M11 31c12 1 23-5 31-18" />
          <path d="M22 52c-1-16 8-29 26-36" />
          <path d="M14 43c15-2 28 2 38 11" />
          <path d="M19 22c2.3-3.3 5.7-5.5 10-6.4" className="kids-doodle-detail" />
          <circle cx="45" cy="47" r="1.7" className="kids-doodle-dot" />
        </svg>
      );
    case 'car':
      return (
        <svg {...common}>
          <path d="M12 39h40l-4-12c-.5-1.5-1.7-2.5-3.3-2.5H23.5c-1.5 0-2.7.8-3.5 2.1L12 39Z" className="kids-doodle-fill" />
          <path d="M24 24l5-7h14l5 7" />
          <path d="M28 24h15M18 39h32" />
          <circle cx="22" cy="43" r="5.2" />
          <circle cx="46" cy="43" r="5.2" />
          <circle cx="22" cy="43" r="1.8" className="kids-doodle-dot" />
          <circle cx="46" cy="43" r="1.8" className="kids-doodle-dot" />
          <path d="M27 30h10M43 31h3.5M15 35h4" className="kids-doodle-detail" />
        </svg>
      );
    case 'gamepad':
      return (
        <svg {...common}>
          <path d="M17 26h30c7 0 12 5 12 12v3c0 5.4-4.2 9.3-9.2 9.3-4 0-6.9-2-9.2-5.4H23.4c-2.3 3.4-5.2 5.4-9.2 5.4C9.2 50.3 5 46.4 5 41v-3c0-7 5-12 12-12Z" className="kids-doodle-fill" />
          <path d="M18.5 38h10M23.5 33v10" />
          <path d="M28 26c.8-4.2 2.1-6.4 4-6.4s3.2 2.2 4 6.4" className="kids-doodle-detail" />
          <circle cx="42.5" cy="36" r="2.1" className="kids-doodle-dot" />
          <circle cx="50" cy="41" r="2.1" className="kids-doodle-dot" />
          <circle cx="48.5" cy="34" r="1.4" className="kids-doodle-dot" />
        </svg>
      );
    case 'rocket':
      return (
        <svg {...common}>
          <path d="M35 8c9.5 5.4 14.2 15.4 13.4 29.5L34.5 52 20 37.5C20 23.5 25.2 13.4 35 8Z" className="kids-doodle-fill" />
          <circle cx="36" cy="27" r="5.2" />
          <circle cx="36" cy="27" r="2" className="kids-doodle-dot" />
          <path d="M21 37.5l-9.5 4.8 12.2 12.2 4.8-9.5M46.5 35.5l6.5 2.3-7.3 7.4" />
          <path d="M28 43.5c4.4-1.1 8-4 10.8-8.7" className="kids-doodle-detail" />
          <path d="M48 38l7 7M42 46l7.5 7.5M20 50l-4 7" />
        </svg>
      );
    case 'skate':
      return (
        <svg {...common}>
          <path d="M13 24c8 14 21 20.5 38 17.5" className="kids-doodle-fill" />
          <path d="M22 21c9 14 19 20 31 20" />
          <path d="M31 18l14 27" />
          <circle cx="25" cy="47" r="4.2" />
          <circle cx="48" cy="45" r="4.2" />
          <circle cx="25" cy="47" r="1.5" className="kids-doodle-dot" />
          <circle cx="48" cy="45" r="1.5" className="kids-doodle-dot" />
          <path d="M17 28c8.5.5 16-2 22.5-7.5M32 41h11" className="kids-doodle-detail" />
        </svg>
      );
    case 'soccer':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" className="kids-doodle-fill" />
          <path d="M32 20l10 7-4 12H26l-4-12 10-7Z" />
          <path d="M22 27l-8-3M42 27l8-3M26 39l-5 9M38 39l5 9" />
          <path d="M32 20v-9M14 24c2.5-4.8 6.3-8.4 11.4-10.6M50 40c-2.8 5.3-7.1 9-12.8 11" className="kids-doodle-detail" />
        </svg>
      );
    case 'bike':
      return (
        <svg {...common}>
          <circle cx="18" cy="43" r="9.5" className="kids-doodle-fill" />
          <circle cx="49" cy="43" r="9.5" className="kids-doodle-fill" />
          <path d="M18 43l10-18h9l12 18M28 25l11 18H18" />
          <path d="M18 33.5v19M8.5 43h19M49 33.5v19M39.5 43h19" className="kids-doodle-detail" />
          <path d="M35 25l7-8h8M30 18h-8M28 25l-4-7" />
          <circle cx="37" cy="25" r="1.6" className="kids-doodle-dot" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="18" y="20" width="28" height="29" rx="7" className="kids-doodle-fill" />
          <path d="M32 20v-8M27 12h10" />
          <circle cx="26" cy="33" r="2.7" className="kids-doodle-dot" />
          <circle cx="38" cy="33" r="2.7" className="kids-doodle-dot" />
          <path d="M27 43h10M24 26h16M23 49v4M41 49v4" />
          <path d="M12 31h6M46 31h6M13 40h5M46 40h5" className="kids-doodle-detail" />
        </svg>
      );
  }
}

function KidsGameStrip({ title, games }: { title: string; games: Game[] }) {
  if (games.length === 0) return null;

  return (
    <section className="kids-section">
      <h2>{title}</h2>
      <div className="kids-game-grid">
        {games.slice(0, 10).map((game) => (
          <KidsGameTile key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}

export default async function KidsSitePage() {
  const allGames = await getAllGames();
  const friendlyRaw = uniqueById(allGames.filter(isFriendlyGame));
  const friendlyGames = friendlyRaw;

  const easyGames = uniqueById([
    ...bySlugs(friendlyGames, ['kids', 'casual', 'hypercasual']),
    ...friendlyGames,
  ]);

  const puzzleGames = uniqueById([
    ...bySlugs(friendlyGames, ['puzzle', 'skill']),
    ...friendlyGames,
  ]);

  const creativeGames = uniqueById([
    ...bySlugs(friendlyGames, ['cooking', 'beauty', 'girls', 'simulation']),
    ...friendlyGames,
  ]);

  const allKidsGames = uniqueById([
    ...easyGames,
    ...puzzleGames,
    ...creativeGames,
    ...friendlyGames,
  ]).slice(0, 40);

  return (
    <div className="kids-site-page">
      <section className="kids-cloud-hero">
        <Link href="/" className="kids-logo" aria-label="GameZone home">
          <span className="kids-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
              <path d="M6 12h4M8 10v4" />
              <circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="18" cy="13.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span>
            <span className="kids-logo-small">GameZone</span>
            <span className="kids-logo-word">Kids Playroom</span>
          </span>
        </Link>
      </section>

      <main className="kids-site-main">
        <section className="kids-play-band">
          <div className="kids-doodle-row">
            {DOODLES.slice(0, 4).map((item) => (
              <DoodleIcon key={item.kind} {...item} />
            ))}
          </div>

          <h1>
            <KidsPickerButton />
          </h1>

          <div className="kids-doodle-row">
            {DOODLES.slice(4).map((item) => (
              <DoodleIcon key={item.kind} {...item} />
            ))}
          </div>
        </section>

        <section id="kids-games" className="kids-game-grid kids-game-grid-main">
          {allKidsGames.slice(0, 20).map((game, index) => (
            <KidsGameTile key={game.id} game={game} priority={index < 8} />
          ))}
        </section>

        <KidsGameStrip title="Easy picks" games={easyGames.slice(20, 30)} />
        <KidsGameStrip title="Puzzle time" games={puzzleGames.slice(8, 18)} />
        <KidsGameStrip title="Cooking, dress up, and calm games" games={creativeGames.slice(8, 18)} />

        <section className="kids-parent-note">
          <div>
            <h2>For parents</h2>
            <p>
              Kids Site is a lighter game area inside GameZone. Games run in the browser with no
              account required, but younger players should still play with guidance from a parent or
              guardian.
            </p>
          </div>
          <div className="kids-parent-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/category/kids">More kids games</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
