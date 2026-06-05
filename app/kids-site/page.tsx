import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import KidsPickerButton from './KidsPickerButton';
import KidsFilterTabs, { type KidsFilter } from './KidsFilterTabs';
import KidsAnimations from './KidsAnimations';
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
  { kind: 'star',    color: '#ffb30f', className: 'kids-doodle-large', anim: 'kids-hover-spin' },
  { kind: 'gamepad', color: '#ef4c44', className: 'kids-doodle-large', anim: 'kids-hover-shake' },
  { kind: 'rocket',  color: '#41b883', className: 'kids-doodle-large', anim: 'kids-hover-launch' },
  { kind: 'rainbow', color: '#4f7cff', className: 'kids-doodle-large', anim: 'kids-hover-sway' },
  { kind: 'heart',   color: '#ef4c44', className: 'kids-doodle-large', anim: 'kids-hover-pulse' },
  { kind: 'crown',   color: '#ffb30f', className: 'kids-doodle-large', anim: 'kids-hover-bounce' },
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

function byWords(games: Game[], words: string[]) {
  return games.filter((game) => {
    const text = [game.title, game.category, game.description, ...game.tags].join(' ').toLowerCase();
    return words.some((word) => text.includes(word));
  });
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
  anim,
}: {
  kind: string;
  color: string;
  className?: string;
  anim?: string;
}) {
  const doodleStyle = { color } as CSSProperties;
  const doodleClass = `kids-doodle ${className ?? ''} ${anim ?? ''}`.trim();
  const common = {
    className: doodleClass,
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
    case 'star':
      return (
        <svg {...common}>
          <path d="M32 9 L37 24 L53 24 L41 34 L45 50 L32 41 L19 50 L23 34 L11 24 L27 24 Z" className="kids-doodle-fill" />
          <path d="M32 9 L37 24 L53 24 L41 34 L45 50 L32 41 L19 50 L23 34 L11 24 L27 24 Z" />
          <circle cx="32" cy="32" r="4" className="kids-doodle-dot" />
          <circle cx="43" cy="17" r="2" className="kids-doodle-dot" />
        </svg>
      );
    case 'lollipop':
      return (
        <svg {...common}>
          <circle cx="32" cy="24" r="15" className="kids-doodle-fill" />
          <circle cx="32" cy="24" r="15" />
          <line x1="32" y1="38" x2="35" y2="57" />
          <path d="M32 12 Q42 15 43 24 Q42 34 32 36" className="kids-doodle-detail" />
          <circle cx="32" cy="24" r="5" className="kids-doodle-dot" />
        </svg>
      );
    case 'gamepad':
      return (
        <svg {...common}>
          <path d="M17 26h30c7 0 12 5 12 12v3c0 5.4-4.2 9.3-9.2 9.3-4 0-6.9-2-9.2-5.4H23.4c-2.3 3.4-5.2 5.4-9.2 5.4C9.2 50.3 5 46.4 5 41v-3c0-7 5-12 12-12Z" className="kids-doodle-fill" />
          <path d="M18.5 38h10M23.5 33v10" />
          <path d="M28 26c.8-4.2 2.1-6.4 4-6.4s3.2 2.2 4 6.4" className="kids-doodle-detail" />
          <circle cx="42.5" cy="36" r="2.5" className="kids-doodle-dot" />
          <circle cx="50" cy="41" r="2.5" className="kids-doodle-dot" />
          <circle cx="48.5" cy="34" r="1.8" className="kids-doodle-dot" />
        </svg>
      );
    case 'rocket':
      return (
        <svg {...common}>
          {/* Nose cone */}
          <path d="M22 30 L32 8 L42 30 Z" className="kids-doodle-fill" />
          <path d="M22 30 L32 8 L42 30" />
          {/* Body */}
          <rect x="22" y="29" width="20" height="22" rx="3" className="kids-doodle-fill" />
          <rect x="22" y="29" width="20" height="22" rx="3" />
          {/* Left fin */}
          <path d="M22 44 L13 55 L22 50 Z" className="kids-doodle-fill" />
          <path d="M22 44 L13 55 L22 50" />
          {/* Right fin */}
          <path d="M42 44 L51 55 L42 50 Z" className="kids-doodle-fill" />
          <path d="M42 44 L51 55 L42 50" />
          {/* Window */}
          <circle cx="32" cy="38" r="5.5" />
          <circle cx="32" cy="38" r="2.5" className="kids-doodle-dot" />
          {/* Flame */}
          <path d="M25 54 Q29 63 32 57 Q35 63 39 54" strokeWidth="3.5" />
        </svg>
      );
    case 'rainbow': {
      return (
        <svg className={doodleClass} viewBox="0 0 64 64" fill="none" strokeLinecap="round" style={doodleStyle} aria-hidden>
          <path d="M6 48 A26 26 0 0 1 58 48" stroke="#ef4c44" strokeWidth="3.8" />
          <path d="M12 48 A20 20 0 0 1 52 48" stroke="#ff9a3d" strokeWidth="3.8" />
          <path d="M18 48 A14 14 0 0 1 46 48" stroke="#41b883" strokeWidth="3.8" />
          <path d="M24 48 A8 8 0 0 1 40 48" stroke="#4f7cff" strokeWidth="3.8" />
          <circle cx="4"  cy="49" r="5"   fill={`${color}22`} stroke={color} strokeWidth="2.2" />
          <circle cx="9"  cy="45" r="4"   fill={`${color}22`} stroke={color} strokeWidth="2.2" />
          <circle cx="1"  cy="45" r="3.2" fill={`${color}22`} stroke={color} strokeWidth="2" />
          <circle cx="60" cy="49" r="5"   fill={`${color}22`} stroke={color} strokeWidth="2.2" />
          <circle cx="55" cy="45" r="4"   fill={`${color}22`} stroke={color} strokeWidth="2.2" />
          <circle cx="63" cy="45" r="3.2" fill={`${color}22`} stroke={color} strokeWidth="2" />
        </svg>
      );
    }
    case 'heart':
      return (
        <svg {...common}>
          <path d="M32 52 C14 40 7 28 7 20 C7 13 12 8 20 8 C25.5 8 29.5 11 32 16 C34.5 11 38.5 8 44 8 C52 8 57 13 57 20 C57 28 50 40 32 52Z" className="kids-doodle-fill" />
          <path d="M32 52 C14 40 7 28 7 20 C7 13 12 8 20 8 C25.5 8 29.5 11 32 16 C34.5 11 38.5 8 44 8 C52 8 57 13 57 20 C57 28 50 40 32 52Z" />
          <circle cx="21" cy="18" r="3.5" className="kids-doodle-dot" />
        </svg>
      );
    case 'butterfly':
      return (
        <svg {...common}>
          <path d="M32 30 Q18 12 10 20 Q5 30 20 34 Z" className="kids-doodle-fill" />
          <path d="M32 30 Q46 12 54 20 Q59 30 44 34 Z" className="kids-doodle-fill" />
          <path d="M32 36 Q14 42 14 50 Q16 57 26 50 Z" className="kids-doodle-fill" />
          <path d="M32 36 Q50 42 50 50 Q48 57 38 50 Z" className="kids-doodle-fill" />
          <path d="M32 22 Q30 33 32 44 Q34 33 32 22" strokeWidth="3.5" />
          <path d="M32 22 Q26 14 22 10" />
          <path d="M32 22 Q38 14 42 10" />
          <circle cx="22" cy="10" r="2.5" className="kids-doodle-dot" />
          <circle cx="42" cy="10" r="2.5" className="kids-doodle-dot" />
          <circle cx="17" cy="24" r="3" className="kids-doodle-detail" />
          <circle cx="47" cy="24" r="3" className="kids-doodle-detail" />
        </svg>
      );
    case 'crown':
      return (
        <svg {...common}>
          <path d="M9 46 L9 30 L19 40 L32 16 L45 40 L55 30 L55 46 Z" className="kids-doodle-fill" />
          <path d="M9 46 L9 30 L19 40 L32 16 L45 40 L55 30 L55 46 Z" />
          <path d="M9 40 H55" />
          <circle cx="32" cy="24" r="4"   className="kids-doodle-dot" />
          <circle cx="19" cy="39" r="3"   className="kids-doodle-dot" />
          <circle cx="45" cy="39" r="3"   className="kids-doodle-dot" />
          <circle cx="9"  cy="43" r="2.2" className="kids-doodle-dot" />
          <circle cx="55" cy="43" r="2.2" className="kids-doodle-dot" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M32 9 L37 24 L53 24 L41 34 L45 50 L32 41 L19 50 L23 34 L11 24 L27 24 Z" className="kids-doodle-fill" />
          <path d="M32 9 L37 24 L53 24 L41 34 L45 50 L32 41 L19 50 L23 34 L11 24 L27 24 Z" />
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

  const learningGames = uniqueById([
    ...byWords(friendlyGames, ['learn', 'learning', 'letter', 'word', 'math', 'school', 'kindergarten', 'quiz', 'brain', 'find']),
    ...bySlugs(friendlyGames, ['puzzle', 'skill']),
    ...friendlyGames,
  ]);

  const cuteGames = uniqueById([
    ...byWords(friendlyGames, ['baby', 'hazel', 'cute', 'pet', 'cat', 'pony', 'chick', 'dolphin', 'princess', 'santa']),
    ...bySlugs(friendlyGames, ['kids', 'girls', 'beauty']),
    ...friendlyGames,
  ]);

  const dressUpGames = uniqueById([
    ...byWords(friendlyGames, ['dress', 'fashion', 'makeup', 'hair', 'salon', 'princess', 'style']),
    ...bySlugs(friendlyGames, ['girls', 'beauty']),
    ...creativeGames,
  ]);

  const kidsFilters: KidsFilter[] = [
    { id: 'learning', label: 'Learning', games: learningGames.slice(0, 24) },
    { id: 'cute', label: 'Cute', games: cuteGames.slice(0, 24) },
    { id: 'puzzle', label: 'Puzzle', games: puzzleGames.slice(0, 24) },
    { id: 'dress-up', label: 'Dress Up', games: dressUpGames.slice(0, 24) },
    { id: 'easy', label: 'Easy', games: easyGames.slice(0, 24) },
  ];


  return (
    <div className="kids-site-page">
      <section className="kids-cloud-hero">
        <div className="kids-logo kids-logo-display" aria-label="GameZone Kids Playroom">
          <span className="kids-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
              <path d="M6 12h4M8 10v4" />
              <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="17.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span>
            <span className="kids-logo-small">GameZone</span>
            <span className="kids-logo-word">Kids Playroom</span>
          </span>
        </div>
      </section>

      <main className="kids-site-main">
        <section className="kids-play-band">
          <div className="kids-doodle-row">
            {DOODLES.slice(0, 3).map((item) => (
              <DoodleIcon key={item.kind} {...item} />
            ))}
          </div>

          <h1>
            <KidsPickerButton />
          </h1>

          <div className="kids-doodle-row">
            {DOODLES.slice(3).map((item) => (
              <DoodleIcon key={item.kind} {...item} />
            ))}
          </div>
        </section>

        <KidsFilterTabs filters={kidsFilters} />

        <KidsGameStrip title="Easy picks" games={easyGames.slice(0, 10)} />
        <KidsGameStrip title="Puzzle time" games={puzzleGames.slice(0, 10)} />
        <KidsGameStrip title="Cooking, dress up, and calm games" games={creativeGames.slice(0, 10)} />

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
      <KidsAnimations />
    </div>
  );
}
