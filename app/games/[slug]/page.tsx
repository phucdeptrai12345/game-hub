import { notFound } from 'next/navigation';
import { getGameBySlug, getAllGames } from '@/lib/gamemonetize';
import { getY8GameBySlug, getY8Games } from '@/lib/y8';
import GameIframe from '@/components/game/GameIframe';
import ControlGuide from '@/components/game/ControlGuide';
import CategoryBadge from '@/components/ui/CategoryBadge';
import PromoAd from '@/components/ui/PromoAd';
import Link from 'next/link';
import Image from 'next/image';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = slug.startsWith('y8-')
    ? await getY8GameBySlug(slug)
    : await getGameBySlug(slug);
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
  const [gmGames, y8Games] = await Promise.all([getAllGames(), getY8Games()]);
  return [
    ...gmGames.slice(0, 200).map((g) => ({ slug: g.slug })),
    ...y8Games.map((g) => ({ slug: g.slug })),
  ];
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;

  const isY8 = slug.startsWith('y8-');
  const [game, allGames, y8Games] = await Promise.all([
    isY8 ? getY8GameBySlug(slug) : getGameBySlug(slug),
    isY8 ? Promise.resolve([]) : getAllGames(),
    isY8 ? getY8Games() : Promise.resolve([]),
  ]);
  if (!game) notFound();

  // Related games: same source, same category
  const pool = isY8 ? y8Games : allGames;
  const sameCat = pool.filter((g) => g.id !== game.id && g.category === game.category);
  const related = sameCat.slice(0, 8);
  const moreGames = sameCat.slice(8, 24);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
      {/* Main layout: game + right column */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

        {/* Left: iframe + info */}
        <div className="min-w-0">
          <GameIframe game={game} />

          {/* Title + category */}
          <div className="flex items-start justify-between gap-4 mt-5">
            <h1 className="text-2xl md:text-3xl font-black text-fg leading-tight">
              {game.title}
            </h1>
            <CategoryBadge category={game.category} className="shrink-0 mt-1" />
          </div>

          {/* Description */}
          {game.description && (
            <p className="text-muted font-semibold leading-relaxed max-w-[68ch] mt-3">
              {game.description}
            </p>
          )}

          {/* How to play */}
          {game.instructions && (
            <ControlGuide instructions={game.instructions} />
          )}

          {game.developer && (
            <p className="text-xs text-muted font-semibold mt-4">
              Developer: <span className="text-fg font-bold">{game.developer}</span>
            </p>
          )}
        </div>

        {/* Right: ads + related games */}
        <aside className="flex flex-col gap-6">

          {/* Ad slot 1 */}
          <div className="h-[250px]" aria-label="Advertisement">
            <PromoAd
              href="/category/action"
              eyebrow="Action Picks"
              title="Fast games for short breaks"
              description="Jump into quick action, shooting, and survival games with no download."
              cta="Play Action"
            />
          </div>

          {/* Ad slot 2 */}
          <div className="h-[250px]" aria-label="Advertisement">
            <PromoAd
              href="/category/racing"
              eyebrow="Racing Hub"
              title="Race, drift, repeat"
              description="Try high-speed car games, stunt tracks, and browser racing challenges."
              cta="Start Racing"
              tone="racing"
            />
          </div>

          {/* Related games */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-accent" aria-hidden="true" />
                <p className="text-xs font-black text-fg uppercase tracking-widest">
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
                      <Image
                        src={g.thumb}
                        alt={g.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        unoptimized
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

        </aside>
      </div>

      {/* More games below — same category, non-overlapping with sidebar */}
      {moreGames.length > 0 && (
        <section className="mt-14 pt-8 border-t border-border/60">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 rounded-full bg-accent" aria-hidden="true" />
            <h2 className="text-xl font-black text-fg title-display uppercase tracking-tight">
              More Games
            </h2>
            <Link
              href={`/category/${slugify(game.category)}`}
              className="ml-auto text-sm font-bold text-muted hover:text-accent transition-colors duration-150"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {moreGames.map((g) => (
              <Link
                key={g.id}
                href={`/games/${g.slug}`}
                className="group flex flex-col gap-1.5 active-click"
              >
                <div className="relative w-full rounded-xl overflow-hidden bg-border/40 aspect-square">
                  <Image
                    src={g.thumb}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    unoptimized
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
  );
}
