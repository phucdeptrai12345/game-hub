import type { Metadata } from 'next';
import Link from 'next/link';
import GameImage from '@/components/ui/GameImage';
import { getAllGames, getCatalogStats } from '@/lib/gamemonetize';
import AboutAnimations from './AboutAnimations';
import AboutSectionNav from './AboutSectionNav';
import './about.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About GameZone',
  description: 'GameZone is a free browser games platform built for instant play across computer, tablet, and mobile.',
};

const PRINCIPLES = [
  {
    num: '01',
    title: 'Find good games instantly.',
    body: 'Popular rows, new releases, categories, search, favorites, and recently played lists make the next click obvious — no hunting required.',
    color: 'oklch(65% 0.22 290)',
  },
  {
    num: '02',
    title: 'Zero friction.',
    body: 'Games run right in the browser on your computer, tablet, and phone. No launcher, no download, no account step before playing.',
    color: 'oklch(60% 0.22 245)',
  },
  {
    num: '03',
    title: 'Curated quality.',
    body: 'The catalog filters out low-quality and broken titles. What stays is grouped by genre so you find something worth playing quickly.',
    color: 'oklch(58% 0.20 160)',
  },
  {
    num: '04',
    title: 'Respectful ads.',
    body: 'Ad spaces are planned into the layout so the site stays free without annoying banners covering the game or popping over the player.',
    color: 'oklch(65% 0.22 50)',
  },
];

function compactNumber(value: number) {
  if (value >= 1000) return `${Math.floor(value / 1000).toLocaleString()}k+`;
  return `${value}+`;
}

export default async function AboutPage() {
  const [games, stats] = await Promise.all([getAllGames(), getCatalogStats()]);
  const topGames = games.slice(0, 5);

  const STATS = [
    { value: compactNumber(stats.total), label: 'Browser games',    desc: 'No download needed'   },
    { value: '0',                        label: 'Downloads needed',  desc: 'Open & play instantly' },
    { value: '3',                        label: 'Screen types',      desc: 'Desktop, tablet, phone' },
    { value: '100%',                     label: 'Free forever',      desc: 'No paywall, ever'      },
  ];

  return (
    <div className="about-page-scroll h-[calc(100vh-4rem)] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth relative text-fg overflow-x-hidden selection:bg-accent/30">
      <AboutAnimations />
      <AboutSectionNav />

      {/* ══ S1 · HERO ═════════════════════════════════════════════════ */}
      <section
        id="s1"
        className="about-section snap-start snap-always relative px-6 sm:px-10 lg:px-16 xl:px-24 min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden"
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 -z-10 about-grid-pattern" />

        {/* Floating orbs */}
        <div className="about-orb about-orb-1 absolute w-[500px] h-[500px] rounded-full -top-32 -left-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 blur-[80px] pointer-events-none -z-10" />
        <div className="about-orb about-orb-2 absolute w-[400px] h-[400px] rounded-full bottom-0 right-0 bg-gradient-to-tl from-fuchsia-500/20 to-rose-500/10 blur-[80px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto w-full">
          {/* Badge */}
          <div className="about-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-muted">About GameZone</span>
          </div>

          {/* Headline */}
          <h1 className="title-display font-black leading-[1] tracking-tight mb-8 text-4xl sm:text-5xl lg:text-[4.5rem]">
            <span className="about-hero-l1 block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              Open a game.
            </span>
            <span className="about-hero-l2 block bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-rose-500">
              Start playing.
            </span>
          </h1>

          <p className="about-hero-sub max-w-2xl text-lg md:text-xl font-bold leading-8 text-muted mb-10">
            A free browser games platform built purely for fun. No installations, no forced sign-ups,
            no hidden paywalls — just pick a title and it runs, on any screen, right now.
          </p>

          <div className="about-hero-btns flex flex-wrap items-center gap-4">
            <Link href="/games" className="btn-bouncy">Play Now</Link>
            <Link href="/kids-site" className="btn-bouncy btn-bouncy-ghost">For Kids</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="about-scroll-ind absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted/30 flex justify-center p-1.5">
            <div className="w-1 h-2 bg-muted/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══ S2 · NUMBERS ══════════════════════════════════════════════ */}
      <section
        id="s2"
        className="about-section snap-start snap-always relative px-6 sm:px-10 lg:px-16 xl:px-24 py-16 min-h-[calc(100vh-4rem)] flex items-center"
      >
        <div className="max-w-5xl mx-auto w-full">
          {/* Heading */}
          <div className="about-s2-head mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-accent mb-3">By the numbers</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black title-display leading-[1.05]">
              Massive scale.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Zero barriers.
              </span>
            </h2>
          </div>

          {/* Stat strip */}
          <div className="about-section-numbers grid grid-cols-2 md:grid-cols-4 gap-0 pt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="about-stat-item px-6 first:pl-0">
                <span className="about-stat-num">{stat.value}</span>
                <span className="about-stat-lbl">{stat.label}</span>
                <span className="about-stat-desc">{stat.desc}</span>
              </div>
            ))}
          </div>

          <p className="about-s2-desc mt-14 text-base lg:text-lg font-bold text-muted max-w-2xl leading-relaxed">
            We've built a platform that handles millions of gaming sessions every month — without ever
            asking for a login, a download, or a dollar.
          </p>
        </div>
      </section>

      {/* ══ S3 · PRINCIPLES ═══════════════════════════════════════════ */}
      <section
        id="s3"
        className="about-section snap-start snap-always relative px-6 sm:px-10 lg:px-16 xl:px-24 py-16 min-h-[calc(100vh-4rem)] flex items-center"
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="about-s3-head mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-accent mb-3">Our philosophy</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black title-display">
              How we do it right.
            </h2>
            <p className="mt-2 text-base font-bold text-muted">Everything is built around the player.</p>
          </div>

          <ol className="about-principles-list">
            {PRINCIPLES.map((item) => (
              <li
                key={item.num}
                className="about-principle-item"
                style={{ '--pc': item.color } as React.CSSProperties}
              >
                <div className="about-principle-track" />
                <span className="about-principle-num">{item.num}</span>
                <div className="about-principle-content">
                  <p className="about-principle-title">{item.title}</p>
                  <p className="about-principle-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ S4 · PLATFORM ════════════════════════════════════════════ */}
      <section
        id="s4"
        className="about-section snap-start snap-always px-6 sm:px-10 lg:px-16 xl:px-24 py-16 min-h-[calc(100vh-4rem)] flex items-center"
      >
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-center">
          {/* Left: text */}
          <div className="about-s4-text space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-accent block">
              What we are building
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] title-display uppercase">
              A game site that feels fast, clear, and worth returning to.
            </h2>
            <p className="text-base lg:text-lg font-semibold leading-relaxed text-muted">
              GameZone organizes thousands of HTML5 games into a layout that is quick to scan:
              featured picks, trending games, category rows, new releases, search, favorites,
              and recently played history.
            </p>
            <p className="text-base lg:text-lg font-semibold leading-relaxed text-muted">
              The goal is not to make players learn the site. The goal is to make the next game
              obvious, keep the player area comfortable, and leave room for ads without letting
              ads become the product.
            </p>
          </div>

          {/* Right: top games card */}
          <aside className="about-games-card bento-card !p-6 md:!p-8 border border-border rounded-[24px]">
            <p className="mb-5 text-xs font-black uppercase tracking-widest text-accent">
              Players open most
            </p>
            <ol className="about-games-list space-y-3 divide-y divide-border/50">
              {topGames.map((game, i) => (
                <li key={game.id} className="about-game-item pt-3 first:pt-0">
                  <Link
                    href={`/games/${game.slug}`}
                    className="group flex items-center gap-3 transition-transform hover:translate-x-1 duration-200"
                  >
                    <span className="w-5 text-sm font-black text-accent shrink-0">
                      0{i + 1}
                    </span>
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-border bg-navy shadow-sm group-hover:scale-105 group-hover:border-accent/40 transition-all duration-300">
                      <GameImage game={game} alt={game.title} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-black text-fg transition-colors group-hover:text-accent">
                        {game.title}
                      </p>
                      <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-muted group-hover:text-accent transition-colors">
                        Play now →
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* ══ S5 · TECHNOLOGY — KEEP EXACTLY ═══════════════════════════ */}
      <section
        id="s5"
        className="about-section snap-start snap-always px-6 sm:px-10 lg:px-16 xl:px-20 py-12 md:py-16 min-h-[calc(100vh-4rem)] flex items-center relative z-10"
      >
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="about-tech-rings-wrap order-2 md:order-1 relative aspect-square w-full max-w-sm mx-auto flex items-center justify-center cursor-pointer">
            {/* Spinning decorative geometric elements — spun by GSAP */}
            <div id="ring-a" className="about-tech-ring absolute inset-0 rounded-[2rem] border-2 border-dashed border-accent/20" />
            <div id="ring-b" className="about-tech-ring absolute inset-8 rounded-full border border-fuchsia-500/30" />
            <div id="ring-c" className="about-tech-ring absolute inset-16 rounded-3xl border border-cyan-500/40" />

            {/* Glowing core */}
            <div className="about-tech-core absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-accent via-fuchsia-500 to-cyan-500 blur-3xl opacity-50 animate-pulse" />
              <div className="z-10 text-center">
                <span className="block text-4xl lg:text-5xl font-black title-display text-fg">HTML5</span>
                <span className="block text-sm font-black uppercase tracking-widest text-muted mt-2">WebGL & WASM</span>
              </div>
            </div>
          </div>

          <div className="about-tech-text order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] title-display mb-6">
              Lightning fast.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-fuchsia-500">
                Built on modern tech.
              </span>
            </h2>
            <p className="text-base lg:text-lg font-semibold leading-relaxed text-muted mb-5">
              Every single game on our platform is optimized to run natively in your browser.
              By leveraging HTML5, WebGL, and WebAssembly, we deliver console-quality graphics
              without requiring a single plugin.
            </p>
            <p className="text-base lg:text-lg font-semibold leading-relaxed text-muted">
              Our global CDN infrastructure ensures that whether you're playing from New York or
              Tokyo, your game loads instantly and runs smoothly at a buttery 60 frames per second.
            </p>
          </div>
        </div>
      </section>

      {/* ══ S6 · CTA ══════════════════════════════════════════════════ */}
      <section
        id="s6"
        className="about-section snap-start snap-always relative px-6 min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="about-cta-glow w-[600px] h-[400px] rounded-full bg-gradient-to-r from-accent/20 via-fuchsia-500/15 to-cyan-500/20 blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="about-cta-ready inline-block mb-6 text-xs font-black uppercase tracking-widest text-accent border border-accent/30 rounded-full px-4 py-1.5">
            Ready to play?
          </p>

          <h2 className="about-cta-title text-5xl sm:text-6xl lg:text-7xl font-black title-display mb-10 leading-[1]">
            {'Start playing\nright now.'.split(/\s+/).map((word, i) => (
              <span key={i} className="about-cta-word inline-block mr-[0.25em]">{word}</span>
            ))}
          </h2>

          <div className="about-cta-btn">
            <Link href="/games" className="btn-bouncy !text-xl !px-12 !py-5">
              Let&apos;s Go 🎮
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
