import type { Metadata } from 'next';
import Link from 'next/link';
import GameImage from '@/components/ui/GameImage';
import AboutReveal from './AboutReveal';
import { getAllGames, getCatalogStats, getNewestGames } from '@/lib/gamemonetize';
import { slugify } from '@/lib/utils';
import type { Game } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About GameZone',
  description:
    'GameZone is a free browser games platform built for instant play across computer, tablet, and mobile.',
};

const PRINCIPLES = [
  {
    label: 'Discovery',
    title: 'Find something good fast.',
    text: 'Popular games, fresh releases, categories, search, favorites, and recently played lists keep the catalog easy to scan.',
  },
  {
    label: 'Access',
    title: 'No install wall.',
    text: 'Games open in the browser, so players can jump in from a computer, tablet, or phone without a launcher or account step.',
  },
  {
    label: 'Curation',
    title: 'A cleaner catalog.',
    text: 'The library is filtered around playable HTML5 games and organized by genre, source, quality, and repeat play value.',
  },
  {
    label: 'Sustainability',
    title: 'Built for a real games site.',
    text: 'Ad placements are planned into the layout so the site can stay free without covering the game experience.',
  },
];

const PLAY_MODES = [
  'Action',
  'Racing',
  'Puzzle',
  'Sports',
  'IO',
  'Kids',
  'Cooking',
  'Arcade',
  'Strategy',
  'Adventure',
];

function compactNumber(value: number) {
  if (value >= 1000) return `${Math.floor(value / 1000).toLocaleString()}k+`;
  return `${value}+`;
}

function uniqueCategories(games: Game[]) {
  return [...new Set(games.map((game) => game.category).filter(Boolean))].sort();
}

function VisualTile({ game, index }: { game: Game; index: number }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`about-visual-tile group relative block overflow-hidden rounded-2xl border border-border bg-navy shadow-[0_16px_34px_oklch(20%_0.02_250/0.14)] ${
        index === 0 ? 'col-span-2 row-span-2' : ''
      }`}
    >
      <GameImage
        game={game}
        alt=""
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        fallbackClassName="text-xs"
        sizes={index === 0 ? '360px' : '160px'}
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 via-black/30 to-transparent p-3">
        <span className="line-clamp-1 text-sm font-black text-white drop-shadow">
          {game.title}
        </span>
      </span>
    </Link>
  );
}

export default async function AboutPage() {
  const [games, newestGames, stats] = await Promise.all([
    getAllGames(),
    getNewestGames(8),
    getCatalogStats(),
  ]);

  const topGames = games.slice(0, 5);
  const visualGames = [...newestGames, ...games].slice(0, 6);
  const categories = uniqueCategories(games);
  const providerCount = Object.keys(stats.byProvider).length;

  const statBlocks = [
    { value: compactNumber(stats.total), label: 'browser games' },
    { value: `${categories.length}+`, label: 'game categories' },
    { value: `${providerCount}`, label: 'catalog sources' },
    { value: '0', label: 'downloads required' },
  ];

  return (
    <div className="about-page home-pattern relative overflow-hidden">
      <AboutReveal />
      <section className="about-hero-section relative overflow-hidden border-b border-border/70 px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
        <div className="about-hero-wash" aria-hidden="true" />
        <div className="about-hero-ribbon" aria-hidden="true" />

        <div className="about-hero-grid relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,0.72fr)]">
          <div className="about-copy max-w-4xl">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-accent">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              About GameZone
            </p>
            <h1 className="about-hero-title max-w-4xl font-black leading-[0.98] text-fg title-display">
              GameZone keeps browser games close at hand.
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-muted sm:text-xl">
              A quick place to open a game, find another one, and come back later without losing the thread.
              It works across computer, tablet, and mobile with no install step in the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/games"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-black text-white shadow-[0_14px_28px_oklch(63%_0.26_28/0.24)] transition-colors duration-150 hover:bg-accent-hover"
              >
                Browse games
              </Link>
              <Link
                href="/kids-site"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-surface px-6 text-sm font-black text-fg transition-colors duration-150 hover:border-accent/40 hover:text-accent"
              >
                For kids
              </Link>
            </div>
          </div>

          <div className="about-visual-wrap relative mx-auto w-full max-w-[640px]">
            <div className="about-visual-card relative grid aspect-[1.06] grid-cols-3 grid-rows-3 gap-3 rounded-[28px] border border-border/70 bg-background/80 p-3 shadow-[0_30px_80px_oklch(12%_0.02_250/0.18)] backdrop-blur">
              {visualGames.slice(0, 6).map((game, index) => (
                <VisualTile key={game.id} game={game} index={index} />
              ))}
            </div>
            <div className="about-stat-strip absolute -bottom-5 left-6 right-6 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-surface/95 p-3 shadow-[0_18px_36px_oklch(12%_0.02_250/0.16)] sm:grid-cols-4">
              {statBlocks.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xl font-black text-accent title-display">{item.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-wide text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-surface/80 py-7">
        <div className="about-mode-rail overflow-hidden">
          <div className="about-mode-track flex w-max items-center gap-3 px-4">
            {[...PLAY_MODES, ...PLAY_MODES].map((mode, index) => (
              <Link
                key={`${mode}-${index}`}
                href={`/category/${slugify(mode)}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs font-black uppercase tracking-wide text-fg transition-colors duration-150 hover:border-accent/40 hover:text-accent"
                aria-hidden={index >= PLAY_MODES.length}
                tabIndex={index >= PLAY_MODES.length ? -1 : undefined}
              >
                {mode} games
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="about-dark-panel bg-[oklch(15%_0.035_276)] px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="about-section-title mx-auto max-w-4xl font-black leading-none title-display">
            Simple for players.
            <br />
            <span className="text-accent">Careful behind the scenes.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-7 text-white/72">
            The boring parts are handled quietly: catalog quality, playable embeds, fast browsing, and sensible ad space.
          </p>

          <div className="about-principle-grid mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {PRINCIPLES.map((item, index) => (
              <article
                key={item.title}
                className="about-principle-card about-reveal-item rounded-2xl bg-[oklch(97%_0.014_88)] p-6 text-left text-fg shadow-[0_18px_40px_oklch(5%_0.02_276/0.28)] lg:p-8"
              >
                <p className="mb-8 text-xs font-black uppercase tracking-wide text-accent">{item.label}</p>
                <h3 className="max-w-md text-3xl font-black leading-none title-display">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm font-bold leading-7 text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
        <div className="about-soft-sash" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-accent">
              What we are building
            </p>
            <h2 className="max-w-4xl text-4xl font-black uppercase leading-tight text-fg title-display sm:text-6xl">
              A game site that feels fast, clear, and worth returning to.
            </h2>
            <div className="mt-6 max-w-4xl space-y-4 text-base font-semibold leading-8 text-muted">
              <p>
                GameZone organizes thousands of HTML5 games into a layout that is quick to scan:
                featured picks, trending games, category rows, new releases, search, favorites, and
                recently played history.
              </p>
              <p>
                The goal is not to make players learn the site. The goal is to make the next game obvious,
                keep the player area comfortable, and leave room for ads without letting ads become the product.
              </p>
            </div>
          </div>

          <aside className="about-top-card rounded-[26px] border border-border bg-surface p-5 shadow-[0_24px_54px_oklch(18%_0.02_250/0.12)]">
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-accent">
              Players open most
            </p>
            <ol className="divide-y divide-border/70">
              {topGames.map((game, index) => (
                <li key={game.id}>
                  <Link href={`/games/${game.slug}`} className="group flex items-center gap-3 py-3">
                    <span className="w-7 shrink-0 text-sm font-black text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-navy">
                      <GameImage
                        game={game}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        fallbackClassName="text-[10px]"
                        sizes="56px"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-1 font-black text-fg transition-colors duration-150 group-hover:text-accent">
                        {game.title}
                      </span>
                      <span className="mt-0.5 block text-xs font-black uppercase tracking-wide text-muted">
                        Play now
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2">
          <article className="about-large-card rounded-[28px] border border-border bg-surface p-7 shadow-[0_22px_50px_oklch(18%_0.02_250/0.10)]">
            <p className="mb-16 text-sm font-black uppercase tracking-wide text-accent">For players</p>
            <h3 className="max-w-xl text-4xl font-black uppercase leading-tight text-fg title-display">
              Open the game. Keep your progress nearby.
            </h3>
            <p className="mt-5 max-w-xl text-sm font-bold leading-7 text-muted">
              Favorites and recently played games make it easier to come back to a session without digging
              through the whole catalog again.
            </p>
            <Link href="/favorites" className="link-red-action mt-6 text-sm font-black">
              View favorites
            </Link>
          </article>

          <article className="about-large-card about-red-card relative overflow-hidden rounded-[28px] border border-border bg-accent p-7 text-white shadow-[0_22px_50px_oklch(63%_0.26_28/0.18)]">
            <div className="about-red-card-stripe" aria-hidden="true" />
            <p className="relative mb-16 text-sm font-black uppercase tracking-wide text-white/80">
              For developers and partners
            </p>
            <h3 className="relative max-w-xl text-4xl font-black uppercase leading-tight title-display">
              Browser games deserve clean discovery.
            </h3>
            <p className="relative mt-5 max-w-xl text-sm font-bold leading-7 text-white/82">
              GameZone is built around playable embeds, category discovery, and ad-ready page structure.
              The site can grow without making the game screen feel like an afterthought.
            </p>
            <Link
              href="/contact"
              className="relative mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-black text-accent transition-opacity duration-150 hover:opacity-90"
            >
              Contact us
            </Link>
          </article>
        </div>
      </section>

      <section className="border-t border-border/70 px-4 py-16 sm:px-6 lg:px-8 xl:px-12">
        <div className="about-final-cta mx-auto flex max-w-7xl flex-col gap-6 rounded-[32px] bg-[oklch(15%_0.035_276)] p-8 text-white shadow-[0_24px_60px_oklch(8%_0.02_276/0.22)] md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-accent">
              Ready to play?
            </p>
            <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight title-display sm:text-5xl">
              Start with what is trending right now.
            </h2>
          </div>
          <Link
            href="/games"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-sm font-black text-white transition-colors duration-150 hover:bg-accent-hover"
          >
            Browse all games
          </Link>
        </div>
      </section>
    </div>
  );
}
