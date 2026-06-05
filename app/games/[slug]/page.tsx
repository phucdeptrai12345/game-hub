import { notFound } from 'next/navigation';
import { getGameBySlug, getAllGames } from '@/lib/gamemonetize';
import GameIframe from '@/components/game/GameIframe';
import GameMonetizeVideo from '@/components/game/GameMonetizeVideo';
import TrackRecentlyPlayed from '@/components/game/TrackRecentlyPlayed';
import ControlGuide from '@/components/game/ControlGuide';
import GameDescription from '@/components/game/GameDescription';
import CategoryBadge from '@/components/ui/CategoryBadge';
import AdSlot from '@/components/ui/AdSlot';
import GameImage from '@/components/ui/GameImage';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import GamePageAnimations from '@/components/game/GamePageAnimations';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: 'Game Not Found' };
  return {
    title: game.title,
    description:
      game.description ||
      `Play ${game.title} free online. No download needed — instant play in your browser.`,
    openGraph: {
      images: game.thumb ? [{ url: game.thumb, width: 512, height: 384, alt: game.title }] : [],
    },
  };
}

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.slice(0, 3000).map((g) => ({ slug: g.slug }));
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;

  const [game, allGames] = await Promise.all([
    getGameBySlug(slug),
    getAllGames(),
  ]);
  if (!game) notFound();

  const sameCat = allGames.filter((g) => g.id !== game.id && g.category === game.category);
  const related = sameCat.slice(0, 8);
  const moreGames = sameCat.slice(8, 24);

  return (
    <div className="w-full">
      <GamePageAnimations />
      {/* Hero background — blurred thumbnail */}
      {game.thumb && (
        <div className="absolute top-16 left-0 right-0 h-64 overflow-hidden pointer-events-none -z-10" aria-hidden>
          <img src={game.thumb} alt="" className="w-full h-full object-cover blur-2xl scale-110 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      )}

      <div className="relative w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-6">
      {/* Main layout: game + right column */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* Left: iframe + info */}
        <div className="min-w-0">
          <TrackRecentlyPlayed game={game} />
          <GameIframe game={game} />

          <AdSlot slot="game-below-player" variant="leaderboard" className="mt-5" />

          <GameMonetizeVideo game={game} />

          {/* Title + category */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-2xl md:text-3xl font-black text-fg leading-tight title-display">
              {game.title}
            </h1>
            <CategoryBadge category={game.category} className="category-badge self-start sm:mt-1 sm:shrink-0" />
          </div>

          {/* Description */}
          {game.description && (
            <div className="game-description">
              <GameDescription text={game.description} />
            </div>
          )}

          {/* How to play */}
          {game.instructions && (
            <ControlGuide instructions={game.instructions} />
          )}

          {game.developer && (
            <p className="text-xs text-muted mt-4">
              Developer: <span className="text-fg font-semibold">{game.developer}</span>
            </p>
          )}
        </div>

        {/* Right: ads + related games */}
        <aside className="flex flex-col gap-6">

          <AdSlot slot="game-side-top" variant="rectangle" />

          {/* Related games */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-accent" aria-hidden="true" />
                <p className="text-base font-black text-fg uppercase tracking-wide title-display">
                  More {game.category} Games
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {related.map((g) => (
                  <Link
                    key={g.id}
                    href={`/games/${g.slug}`}
                    className="group flex flex-col gap-1.5 active-click"
                  >
                    <div className="relative w-full rounded-xl overflow-hidden bg-border/40 aspect-square">
                      <GameImage
                        game={g}
                        alt={g.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        fallbackClassName="text-xs"
                        sizes="150px"
                      />
                    </div>
                    <p className="text-xs font-bold text-fg group-hover:text-accent transition-colors duration-150 line-clamp-2 leading-snug">
                      {g.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <AdSlot slot="game-side-bottom" variant="rectangle" />

        </aside>
      </div>

      {/* More games below */}
      {moreGames.length > 0 && (
        <section className="mt-14 pt-8 border-t border-border/60">
          <AdSlot slot="game-before-more" variant="leaderboard" className="mb-8" />

          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 rounded-full bg-accent" aria-hidden="true" />
            <h2 className="more-games-heading text-xl font-black text-fg title-display uppercase tracking-tight">
              More {game.category} Games
            </h2>
            <Link
              href={`/category/${slugify(game.category)}`}
              className="link-red-action text-sm font-bold"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {moreGames.map((g) => (
              <Link
                key={g.id}
                href={`/games/${g.slug}`}
                className="more-games-card group flex flex-col gap-1.5 active-click"
              >
                <div className="relative w-full rounded-lg overflow-hidden bg-border/40 aspect-square">
                  <GameImage
                    game={g}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    fallbackClassName="text-xs"
                    sizes="120px"
                  />
                </div>
                <p className="text-xs font-bold text-fg group-hover:text-accent transition-colors duration-150 line-clamp-2 leading-snug">
                  {g.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      </div>
    </div>
  );
}
