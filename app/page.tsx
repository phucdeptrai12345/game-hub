import Link from 'next/link';
import { getMostPlayedGames } from '@/lib/gamemonetize';
import { getY8Games } from '@/lib/y8';
import GameCard from '@/components/ui/GameCard';
import GameGrid from '@/components/ui/GameGrid';
import FeaturedCollection from '@/components/ui/FeaturedCollection';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'GameZone - Free Online Games',
  description:
    'Play 3,000+ free HTML5 games instantly. No download, no sign-up. Action, puzzle, racing, and more.',
};

export default async function HomePage() {
  const [homepageGames, y8Games] = await Promise.all([
    getMostPlayedGames(200),
    getY8Games(),
  ]);

  const featuredGames = homepageGames.slice(0, 12);
  const trendingGames = homepageGames.slice(36, 48);
  const popularGames = homepageGames.slice(12, 36);
  const newReleases = y8Games.slice(0, 8);

  return (
    <div className="home-pattern relative overflow-hidden">
      <section className="relative py-8 md:py-10">
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(500px,1fr)] lg:items-start lg:gap-5">
            <div className="max-w-xl pt-1 md:pt-2">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-3 py-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-sm font-black uppercase tracking-[0.08em] text-accent">
                  3,000+ free games - no sign-up
                </span>
              </div>
              <h1
                className="mb-6 font-black uppercase leading-[1.05] tracking-tight text-fg title-display"
                style={{ fontSize: 'clamp(2rem, 3.4vw + 1.1rem, 4.25rem)' }}
              >
                Play anything.
                <br />
                <span className="text-accent">Right now.</span>
              </h1>
            </div>

            <div className="space-y-4">
              <FeaturedCollection games={featuredGames} />
              <FeaturedCollection title="Trending This Week" games={trendingGames} />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full px-4 pb-16 sm:px-6 lg:px-8 xl:px-12">
        <section className="pt-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-fg title-display">
                Popular Now
              </h2>
            </div>
            <Link
              href="/games"
              aria-label="Browse all games"
              className="text-sm font-bold text-muted transition-colors duration-150 hover:text-accent"
            >
              See all games -&gt;
            </Link>
          </div>

          <GameGrid
            games={popularGames}
            priorityCount={12}
            spotlight={false}
            showAds={false}
            layout="default"
            showRank
          />
        </section>

        <section className="pt-14">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-fg title-display">
                New Releases
              </h2>
            </div>
            <Link
              href="/games"
              className="text-sm font-bold text-muted transition-colors duration-150 hover:text-accent"
            >
              See all releases -&gt;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {newReleases.map((game, index) => (
              <div key={game.id} className="aspect-square">
                <GameCard game={game} priority={index < 4} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-border/60 pt-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2">
              <h2 className="mb-5 text-2xl font-black uppercase tracking-tight text-fg title-display">
                GameZone - Play Free Online Games
              </h2>
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-muted">
                <p>
                  GameZone is your destination for free browser games. With hundreds of HTML5 games across
                  action, puzzle, racing, sports, shooting, adventure, strategy, .io, and more, there is
                  always something new to discover.
                </p>
                <p>
                  Every game runs directly in your browser with zero downloads and zero sign-ups required.
                  Just click and play instantly on desktop, laptop, tablet, or smartphone.
                </p>
                <p>
                  Whether you have five minutes or an entire afternoon, GameZone has fast multiplayer games,
                  relaxing idle clickers, shooting challenges, puzzles, racing tracks, and more ready to play.
                </p>
              </div>
            </div>

            <div className="space-y-8 lg:col-span-1">
              <div>
                <p className="mb-3 text-base font-black uppercase tracking-wide text-accent">Why GameZone</p>
                <ul className="space-y-2.5 text-[0.95rem] font-semibold leading-relaxed text-muted">
                  <li>3,000+ games across 20 categories</li>
                  <li>No downloads, no accounts</li>
                  <li>Works on every device</li>
                  <li>New games added weekly</li>
                  <li>Completely free, forever</li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-base font-black uppercase tracking-wide text-accent">Popular Categories</p>
                <ul className="space-y-2.5 text-[0.95rem] font-semibold leading-relaxed text-muted">
                  {['Action', 'Puzzle', 'Racing', 'Sports', '.IO Games', 'Shooting', 'Adventure', 'Strategy'].map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/category/${cat.toLowerCase().replace(/\s|\./g, '')}`}
                        className="transition-colors duration-150 hover:text-accent"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
