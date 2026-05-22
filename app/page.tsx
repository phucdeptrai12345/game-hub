import Link from 'next/link';
import { getAllGames } from '@/lib/gamemonetize';
import GameGrid from '@/components/ui/GameGrid';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'GameZone — Free Online Games',
  description:
    'Play 2500+ free HTML5 games instantly. No download, no sign-up. Action, puzzle, racing, and more.',
};

export default async function HomePage() {
  const allGames = await getAllGames();
  const homepageGames = allGames.slice(0, 200);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-10 md:py-16">
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light border border-accent/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
              <span className="text-accent text-[11px] font-black uppercase tracking-[0.14em]">
                2500+ free games · no sign-up
              </span>
            </div>
            <h1
              className="font-black text-fg leading-[1.05] tracking-tight mb-6 title-display uppercase"
              style={{ fontSize: 'clamp(2.25rem, 4vw + 1.25rem, 4.75rem)' }}
            >
              Play anything.
              <br />
              <span className="text-accent">Right now.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Game Grid ─────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-16">
        <section className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              <h2 className="text-2xl font-black text-fg title-display uppercase tracking-tight">
                Popular Now
              </h2>
            </div>
            <Link
              href="/games"
              aria-label="Browse all games"
              className="text-sm font-bold text-muted hover:text-accent transition-colors duration-150"
            >
              See all games →
            </Link>
          </div>

          <GameGrid
            games={homepageGames}
            priorityCount={12}
            spotlight={true}
            showAds={false}
            layout="poki"
          />
        </section>

        {/* ── Description ───────────────────────────────────────── */}
        <section className="mt-20 pt-10 border-t border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

            {/* Left: main */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-fg title-display uppercase tracking-tight mb-5">
                GameZone — Play Free Online Games
              </h2>
              <div className="space-y-4 text-muted text-[0.95rem] leading-relaxed">
                <p>
                  GameZone is your ultimate destination for free browser games. With over 2500 HTML5 games
                  across action, puzzle, racing, sports, shooting, adventure, strategy, .io, and more, there
                  is always something new to discover — no matter what kind of player you are.
                </p>
                <p>
                  Every game runs directly in your browser with zero downloads and zero sign-ups required.
                  Just click and play instantly on any device — desktop, laptop, tablet, or smartphone.
                  Our platform is fully optimized for smooth performance across all screen sizes, so you
                  never have to compromise on your gaming experience.
                </p>
                <p>
                  Whether you have five minutes to kill or an entire afternoon to dive deep, GameZone has
                  you covered. Fast-paced multiplayer .io games, relaxing idle clickers, intense shooting
                  challenges, brain-twisting puzzles, high-speed racing tracks — it is all here, all free,
                  ready to play the moment you arrive.
                </p>
                <p>
                  We update our library regularly with fresh titles from top indie developers and studios
                  worldwide. New games are added every week, so there is always something fresh waiting
                  for you each time you visit. Bookmark GameZone and never run out of things to play.
                </p>
              </div>
            </div>

            {/* Right: highlights */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-accent mb-3">Why GameZone</p>
                <ul className="space-y-2.5 text-[0.95rem] font-semibold text-muted leading-relaxed">
                  <li>2500+ games across 18 categories</li>
                  <li>No downloads, no accounts</li>
                  <li>Works on every device</li>
                  <li>New games added weekly</li>
                  <li>Completely free, forever</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-accent mb-3">Popular Categories</p>
                <ul className="space-y-2.5 text-[0.95rem] font-semibold text-muted leading-relaxed">
                  {['Action', 'Puzzle', 'Racing', 'Sports', '.IO Games', 'Shooting', 'Adventure', 'Strategy'].map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/category/${cat.toLowerCase().replace(/\s|\./g, '')}`}
                        className="hover:text-accent transition-colors duration-150"
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
    </>
  );
}
