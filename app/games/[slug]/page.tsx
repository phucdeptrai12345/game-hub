import { notFound } from 'next/navigation';
import { getGameBySlug, getAllGames } from '@/lib/gamemonetize';
import GameIframe from '@/components/game/GameIframe';
import CategoryBadge from '@/components/ui/CategoryBadge';
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
  const game = await getGameBySlug(slug);
  if (!game) return { title: 'Game Not Found' };
  return {
    title: game.title,
    description:
      game.description ||
      `Play ${game.title} free online. No download needed — instant play in your browser.`,
    openGraph: {
      images: [{ url: game.thumb, width: 512, height: 384, alt: game.title }],
    },
  };
}

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.slice(0, 200).map((g) => ({ slug: g.slug }));
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const [game, allGames] = await Promise.all([getGameBySlug(slug), getAllGames()]);
  if (!game) notFound();

  const related = allGames
    .filter((g) => g.id !== game.id && g.category === game.category)
    .slice(0, 8);

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
            <div className="bg-surface border border-border rounded-2xl px-4 py-3.5 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3.5 h-3.5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <p className="text-xs font-black text-fg uppercase tracking-widest">How to play</p>
              </div>
              <p className="text-sm font-semibold text-muted leading-relaxed">{game.instructions}</p>
            </div>
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
          <div className="w-full rounded-2xl bg-navy border border-border/60 flex items-center justify-center text-muted/40 text-xs font-bold uppercase tracking-widest"
            style={{ minHeight: '250px' }}
            aria-label="Advertisement"
          >
            Ad
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

          {/* Ad slot 2 */}
          <div className="w-full rounded-2xl bg-navy border border-border/60 flex items-center justify-center text-muted/40 text-xs font-bold uppercase tracking-widest"
            style={{ minHeight: '250px' }}
            aria-label="Advertisement"
          >
            Ad
          </div>

        </aside>
      </div>

      {/* More games below — same category */}
      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-border/60">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 rounded-full bg-accent" aria-hidden="true" />
            <h2 className="text-xl font-black text-fg title-display uppercase tracking-tight">
              More {game.category} Games
            </h2>
            <Link
              href={`/category/${slugify(game.category)}`}
              className="ml-auto text-sm font-bold text-muted hover:text-accent transition-colors duration-150"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {allGames
              .filter((g) => g.id !== game.id && g.category === game.category)
              .slice(0, 16)
              .map((g) => (
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
