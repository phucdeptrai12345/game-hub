import Link from 'next/link';
import { getAllGames, getMostPlayedGames, getNewestGames } from '@/lib/gamemonetize';
import GameGrid from '@/components/ui/GameGrid';
import FeaturedCollection from '@/components/ui/FeaturedCollection';
import CategoryRow from '@/components/ui/CategoryRow';
import RecentlyPlayedSection from '@/components/ui/RecentlyPlayedSection';
import HeroGameTicker from '@/components/ui/HeroGameTicker';
import HomeVideoDemos from '@/components/ui/HomeVideoDemos';
import AdSlot from '@/components/ui/AdSlot';
import GameImage from '@/components/ui/GameImage';
import type { Metadata } from 'next';
import { slugify } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'GameZone - Free Online Games',
  description:
    'Play 9,000+ free HTML5 games instantly. No download, no sign-up. Action, puzzle, racing, and more.',
};

const CATEGORY_ROWS = [
  { slug: 'action',    name: 'Action Games',     icon: '⚡' },
  { slug: 'racing',    name: 'Racing Games',      icon: '🏎️' },
  { slug: 'puzzle',    name: 'Puzzle Games',      icon: '🧩' },
  { slug: 'io',        name: '.IO Games',         icon: '🌐' },
  { slug: 'shooting',  name: 'Shooting Games',    icon: '🎯' },
  { slug: 'sports',    name: 'Sports Games',      icon: '🏅' },
  { slug: 'casual',    name: 'Casual Games',      icon: '🎮' },
  { slug: 'adventure', name: 'Adventure Games',   icon: '🗺️' },
];

const CATEGORY_FALLBACKS: Record<string, string[]> = {
  casual: ['casual', 'hypercasual', 'arcade', 'skill'],
  io: ['io', 'multiplayer', 'action'],
};

const SEO_CATEGORY_LINKS = [
  { href: '/category/racing', label: 'Racing games' },
  { href: '/category/puzzle', label: 'Puzzle games' },
  { href: '/category/cooking', label: 'Cooking games' },
  { href: '/kids-site', label: 'Kids games' },
  { href: '/games?sort=new', label: 'New games' },
];

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function shortText(text: string, fallback: string) {
  const cleaned = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return fallback;
  if (cleaned.length <= 145) return cleaned;
  return `${cleaned.slice(0, 142).trim()}...`;
}

export default async function HomePage() {
  const [homepageGames, newReleases, allGames] = await Promise.all([
    getMostPlayedGames(900),
    getNewestGames(60),
    getAllGames(),
  ]);

  const featuredGames = homepageGames.slice(0, 18);
  const trendingGames = homepageGames.slice(54, 72);
  const popularGames  = homepageGames.slice(18, 58);
  const tickerGames = homepageGames.slice(6, 30);
  const topFreeGames = homepageGames.slice(0, 5);
  const featuredPicks = homepageGames.slice(72, 77);
  const topPickGames = uniqueById([
    ...homepageGames.slice(30, 48),
    ...newReleases.slice(0, 10),
    ...homepageGames.slice(84, 112),
  ]).slice(0, 30);
  const videoDemoGames = [
    'cooking-rage',
    'zigzag-snow-mountain',
    'cut-the-rope-2',
    'fun-race-3d',
  ].flatMap((slug) => allGames.filter((game) => game.slug === slug).slice(0, 1));

  // Build category rows from the full catalog so rows do not look empty.
  const catRows = CATEGORY_ROWS.map(({ slug, name, icon }) => ({
    slug, name, icon,
    games: uniqueById([
      ...allGames.filter((g) => slugify(g.category) === slug),
      ...allGames.filter((g) => (CATEGORY_FALLBACKS[slug] ?? []).includes(slugify(g.category))),
      ...allGames.filter((g) => g.tags.some((tag) => slugify(tag) === slug)),
    ]).slice(0, 30),
  }));

  const categoryCount = (...slugs: string[]) => {
    const targets = new Set(slugs);
    return allGames.filter((game) => {
      const categorySlug = slugify(game.category);
      return targets.has(categorySlug) || game.tags.some((tag) => targets.has(slugify(tag)));
    }).length;
  };

  const playWithFriends = [
    {
      href: '/category/2player',
      title: '2 player games',
      count: categoryCount('2player', 'two-player'),
      text: 'Play side by side on the same keyboard, settle quick matches, or share a fast browser challenge with a friend.',
    },
    {
      href: '/category/io',
      title: '.io games',
      count: categoryCount('io'),
      text: 'Jump into live arenas, grow stronger round by round, and try to outlast other players online.',
    },
    {
      href: '/category/multiplayer',
      title: 'Multiplayer games',
      count: categoryCount('multiplayer'),
      text: 'Find online races, battles, party games, and quick competitions you can start without installing anything.',
    },
  ];

  const challengeGroups = [
    {
      href: '/category/racing',
      title: 'Car and racing games',
      count: categoryCount('racing', 'car', 'cars', 'driving'),
      text: 'Drift, climb, dodge traffic, or keep your car balanced when the track gets messy.',
    },
    {
      href: '/category/shooting',
      title: 'Shooting games',
      count: categoryCount('shooting', 'shooter'),
      text: 'Aim fast, react faster, and survive arcade battles where timing matters as much as accuracy.',
    },
    {
      href: '/category/sports',
      title: 'Sports games',
      count: categoryCount('sports', 'football', 'soccer', 'basketball'),
      text: 'Play quick soccer, basketball, penalty, racing, and skill-based sports rounds in the browser.',
    },
    {
      href: '/category/puzzle',
      title: 'Puzzle games',
      count: categoryCount('puzzle', 'brain', 'logic'),
      text: 'Solve levels that reward planning, pattern spotting, and one more smart move.',
    },
  ];

  const relaxGroups = [
    {
      href: '/category/girls',
      title: 'Dress up games',
      count: categoryCount('girls', 'dress-up', 'dressup', 'fashion'),
      text: 'Build outfits, try new styles, and switch looks at your own pace.',
    },
    {
      href: '/category/kids',
      title: 'Drawing and kids games',
      count: categoryCount('kids', 'drawing', 'coloring'),
      text: 'Color, draw, decorate, and play calmer games that are easy to start.',
    },
    {
      href: '/category/cooking',
      title: 'Cooking games',
      count: categoryCount('cooking', 'food'),
      text: 'Run small kitchens, prepare meals, serve customers, or relax with food games.',
    },
  ];

  return (
    <div className="home-pattern relative overflow-hidden">
      {/* Hero */}
      <section className="home-hero-glow relative pt-5 pb-4 md:py-6">
        {/* Floating bubbles */}
        <div className="hero-bubbles" aria-hidden="true">
          {[
            { cls: 'b1', size: '7px', x: '12%', dur: '9s',  delay: '0s',  color: 'var(--bubble-red)'    },
            { cls: 'b2', size: '5px', x: '28%', dur: '11s', delay: '-3s', color: 'var(--bubble-orange)' },
            { cls: 'b3', size: '9px', x: '45%', dur: '8s',  delay: '-5s', color: 'var(--bubble-red)'    },
            { cls: 'b4', size: '6px', x: '62%', dur: '13s', delay: '-1s', color: 'var(--bubble-teal)'   },
            { cls: 'b5', size: '4px', x: '78%', dur: '10s', delay: '-7s', color: 'var(--bubble-orange)' },
            { cls: 'b6', size: '8px', x: '90%', dur: '12s', delay: '-4s', color: 'var(--bubble-red)'    },
          ].map(({ cls, size, x, dur, delay, color }) => (
            <span
              key={cls}
              className="hero-bubble"
              style={{ width: size, height: size, left: x, '--dur': dur, '--delay': delay, '--bcolor': color } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="relative z-10 w-full px-3 sm:px-4 lg:px-5 xl:px-6">
          <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(620px,0.95fr)] lg:items-start lg:gap-4">
            <div className="min-w-0 max-w-full pt-1 md:pt-2 lg:max-w-[920px]">
              <div className="mb-3 flex max-w-full items-center gap-2">
                <span className="relative flex h-3 w-3 shrink-0 items-center justify-center" aria-hidden="true">
                  <span className="home-live-dot absolute h-3 w-3 rounded-full bg-emerald-400/35" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_oklch(76%_0.18_145/0.55)]" />
                </span>
                <span className="min-w-0 truncate text-[0.72rem] font-bold tracking-[0.06em] text-muted/70 sm:text-sm sm:tracking-[0.07em]">
                  Computer &amp; mobile games · No sign-up
                </span>
              </div>
              <h1
                className="home-hero-title mb-4 font-black leading-[1.07] tracking-tight text-fg title-display"
                style={{ fontSize: 'clamp(1.82rem, 7.8vw, 4.2rem)' }}
              >
                <span className="whitespace-nowrap">Play free games </span>
                <br />
                <span className="home-hero-accent whitespace-nowrap"><span className="home-hero-gradient">on any screen.</span></span>
              </h1>
              <p className="max-w-[calc(100vw-2rem)] break-words text-sm font-bold leading-relaxed text-muted sm:max-w-none sm:text-lg lg:max-w-[880px]">
                <span className="block">9,000+ browser games for computer, tablet, and mobile.</span>
                <span className="block">Action, racing, puzzles, sports, and quick arcade sessions instantly.</span>
              </p>
              <HeroGameTicker games={tickerGames} />
            </div>

            <div className="min-w-0 space-y-3">
              <FeaturedCollection titleKey="section.featured" games={featuredGames} />
              <FeaturedCollection titleKey="section.trending" games={trendingGames} />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full px-3 pb-12 sm:px-4 lg:px-5 xl:px-6 space-y-8">

        {/* Recently Played — client component, shows only if localStorage has data */}
        <AdSlot slot="home-top-leaderboard" variant="leaderboard" />

        <HomeVideoDemos games={videoDemoGames} />

        <RecentlyPlayedSection />

        <CategoryRow
          title="Top picks for you"
          icon="★"
          slug="top-picks"
          games={topPickGames}
          badgeType="editor"
          badgeCount={5}
          size="large"
          seeAllHref="/games?sort=popular"
          seeAllCardTitle="All top picks"
          autoScroll
          autoScrollDelayMs={4300}
        />

        {/* Popular Now */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-accent section-bar-glow" aria-hidden="true" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-fg title-display">
                Popular Now
              </h2>
            </div>
            <Link
              href="/games"
              className="link-red-action text-sm font-bold"
            >
              See all →
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

        <AdSlot slot="home-after-popular" variant="infeed" />

        {/* Category rows */}
        {catRows.map(({ slug, name, icon, games }, index) => (
          <div key={slug} className="space-y-5">
            <CategoryRow
              title={name}
              icon={icon}
              slug={slug}
              games={games}
              badgeType={index % 3 === 0 ? 'top' : index % 3 === 1 ? 'mobile' : 'hot'}
              badgeCount={2}
              autoScroll
              autoScrollDelayMs={4800 + index * 350}
            />
            {(index === 2 || index === 5) && (
              <AdSlot slot={`home-category-${index + 1}`} variant="leaderboard" />
            )}
          </div>
        ))}

        {/* New Releases */}
        <CategoryRow
          title="New Releases"
          icon="+"
          slug="new"
          games={newReleases.slice(0, 36)}
          badgeType="new"
          badgeCount={6}
          seeAllHref="/games?sort=new"
          seeAllCardTitle="All new games"
          autoScroll
          autoScrollDelayMs={5000}
        />

        <AdSlot slot="home-before-footer" variant="leaderboard" />

        {/* Footer description */}
        <section className="border-t border-border/60 pt-10">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-14">
            <article className="space-y-9">
              <header className="max-w-5xl">
                <p className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-accent">
                  About GameZone
                </p>
                <h2 className="max-w-4xl text-3xl font-black uppercase leading-tight tracking-tight text-fg title-display sm:text-4xl">
                  Free online games on GameZone
                </h2>
                <div className="mt-4 max-w-5xl space-y-4 text-[1rem] font-semibold leading-8 text-muted">
                  <p>
                    GameZone is built for the moment when you just want to open a game and start playing.
                    No launcher, no install, no account step. Pick a browser game and it runs on desktop,
                    tablet, or mobile.
                  </p>
                  <nav className="home-seo-link-row" aria-label="Popular game categories">
                    {SEO_CATEGORY_LINKS.map((item) => (
                      <Link key={item.href} href={item.href}>
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <p>
                    The library mixes quick arcade rounds, racing tracks, puzzle levels, sports games,
                    shooting challenges, multiplayer arenas, cooking games, dress up games, and slower
                    games for when you want to relax. Some games are perfect for a two-minute break; others
                    are the kind you keep open longer than planned.
                  </p>
                  <p>
                    Start with what is trending today, jump into a familiar category, or try one of the
                    newer games if you want something fresh.
                  </p>
                </div>
              </header>

              <section className="border-l-2 border-accent/60 pl-5">
                <h3 className="text-xl font-black uppercase tracking-tight text-fg title-display">
                  What to play first
                </h3>
                <div className="mt-4 divide-y divide-border/60">
                  {featuredPicks.map((game, index) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.slug}`}
                      className="group flex items-start gap-3 py-4"
                    >
                      <span className="w-8 shrink-0 pt-1 text-sm font-black text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-navy shadow-[0_7px_16px_oklch(20%_0.02_250/0.10)]">
                        <GameImage
                          game={game}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          fallbackClassName="text-[10px]"
                          sizes="56px"
                        />
                      </span>
                      <span>
                        <span className="block font-black leading-tight text-fg transition-colors duration-150 group-hover:text-accent">
                          {game.title}
                        </span>
                        <span className="mt-1 block max-w-3xl text-sm font-semibold leading-relaxed text-muted">
                          {shortText(game.description, 'A quick browser game you can start instantly on any screen.')}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-8 border-y border-border/60 py-8 lg:grid-cols-3">
                <div>
                  <h3 className="mb-4 text-base font-black uppercase tracking-wide text-accent">
                    Play with friends
                  </h3>
                  <div className="space-y-4">
                    {playWithFriends.map((item) => (
                      <p key={item.title} className="text-sm font-semibold leading-relaxed text-muted">
                        <Link href={item.href} className="font-bold text-fg transition-colors duration-150 hover:text-accent">
                          {item.title}
                        </Link>
                        {item.count > 0 ? ` has ${item.count}+ games. ` : '. '}
                        {item.text}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-base font-black uppercase tracking-wide text-accent">
                    Challenge yourself
                  </h3>
                  <div className="space-y-4">
                    {challengeGroups.map((item) => (
                      <p key={item.title} className="text-sm font-semibold leading-relaxed text-muted">
                        <Link href={item.href} className="font-bold text-fg transition-colors duration-150 hover:text-accent">
                          {item.title}
                        </Link>
                        {item.count > 0 ? ` has ${item.count}+ games. ` : '. '}
                        {item.text}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-base font-black uppercase tracking-wide text-accent">
                    Games to relax
                  </h3>
                  <div className="space-y-4">
                    {relaxGroups.map((item) => (
                      <p key={item.title} className="text-sm font-semibold leading-relaxed text-muted">
                        <Link href={item.href} className="font-bold text-fg transition-colors duration-150 hover:text-accent">
                          {item.title}
                        </Link>
                        {item.count > 0 ? ` has ${item.count}+ games. ` : '. '}
                        {item.text}
                      </p>
                    ))}
                  </div>
                </div>
              </section>

              <section className="max-w-5xl">
                <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-fg title-display">
                  What is GameZone?
                </h3>
                <div className="space-y-4 text-[0.98rem] font-semibold leading-8 text-muted">
                  <p>
                    GameZone is a free online games site for instant browser play. It keeps the experience
                    simple: open a game, let it load, and play. The catalog is organized by category so you
                    can quickly move from action to puzzle, racing, sports, .io, kids, cooking, and more.
                  </p>
                  <p>
                    The homepage changes around popular games, new releases, recent plays, and category
                    rows, so there is always a straightforward way back into something fun.
                  </p>
                </div>
              </section>
            </article>

            <aside className="border-t border-border/60 pt-7 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
              <h3 className="text-xl font-black uppercase tracking-tight text-fg title-display">
                Top free games
              </h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-muted">
                A quick look at games players are opening most right now.
              </p>

              <ol className="mt-5 divide-y divide-border/60">
                {topFreeGames.map((game, index) => (
                  <li key={game.id}>
                    <Link href={`/games/${game.slug}`} className="group flex items-center gap-3 py-3.5">
                      <span className="w-6 shrink-0 text-sm font-black text-accent">
                        {index + 1}
                      </span>
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-navy shadow-[0_7px_16px_oklch(20%_0.02_250/0.10)]">
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
                        <span className="line-clamp-1 font-black leading-tight text-fg transition-colors duration-150 group-hover:text-accent">
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

              <div className="mt-7 border-t border-border/60 pt-5">
                <p className="mb-3 text-base font-black uppercase tracking-wide text-accent">
                  Good to know
                </p>
                <ul className="space-y-2.5 text-sm font-semibold leading-relaxed text-muted">
                  <li>9,000+ browser games</li>
                  <li>No downloads or account required</li>
                  <li>Works on computer, tablet, and mobile</li>
                  <li>Categories for fast browsing</li>
                </ul>
                <Link href="/games" className="link-red-action mt-5 text-sm font-bold">
                  Browse all games →
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
