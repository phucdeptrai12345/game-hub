import type { Metadata } from 'next';
import Link from 'next/link';
import GameImage from '@/components/ui/GameImage';
import { getAllGames, getCatalogStats } from '@/lib/gamemonetize';
import AboutAnimatedBackground from './AboutAnimatedBackground';
import AboutAnimations from './AboutAnimations';
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
    text: 'Popular rows, new releases, categories, search, favorites, and recently played lists make the next click obvious — no hunting required.',
    color: 'from-purple-500 to-purple-400',
    solidColor: 'bg-purple-500',
    textColor: 'text-purple-500',
    glow: 'hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)]',
  },
  {
    num: '02',
    title: 'Zero friction.',
    text: 'Games run right in the browser on your computer, tablet, and phone. No launcher, no download, no account step before playing.',
    color: 'from-blue-500 to-blue-400',
    solidColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    glow: 'hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)]',
  },
  {
    num: '03',
    title: 'Curated quality.',
    text: 'The catalog filters out low-quality and broken titles. What stays is grouped by genre so you find something worth playing quickly.',
    color: 'from-emerald-500 to-emerald-400',
    solidColor: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    glow: 'hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)]',
  },
  {
    num: '04',
    title: 'Respectful ads.',
    text: 'Ad spaces are planned into the layout so the site stays free without annoying banners covering the game or popping over the player.',
    color: 'from-orange-500 to-orange-400',
    solidColor: 'bg-orange-500',
    textColor: 'text-orange-500',
    glow: 'hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)]',
  },
];

function compactNumber(value: number) {
  if (value >= 1000) return `${Math.floor(value / 1000).toLocaleString()}k+`;
  return `${value}+`;
}

export default async function AboutPage() {
  const [games, stats] = await Promise.all([
    getAllGames(),
    getCatalogStats(),
  ]);

  const topGames = games.slice(0, 5);

  const STATS = [
    { value: compactNumber(stats.total), label: 'Browser games', color: 'text-rose-500', bgHover: 'hover:border-rose-500/30' },
    { value: '0',    label: 'Downloads needed', color: 'text-blue-500', bgHover: 'hover:border-blue-500/30' },
    { value: '3',    label: 'Screen types', color: 'text-amber-500', bgHover: 'hover:border-amber-500/30' },
    { value: '100%', label: 'Free forever', color: 'text-emerald-500', bgHover: 'hover:border-emerald-500/30' },
  ];

  return (
    <div className="about-page-scroll h-[calc(100vh-3.5rem)] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth relative text-fg overflow-x-hidden selection:bg-accent/30">
      <AboutAnimatedBackground />
      <AboutAnimations />

      {/* ══ 1. HERO ══════════════════════════════════════════════════ */}
      <section className="about-section snap-start snap-always relative px-6 sm:px-10 lg:px-16 xl:px-20 pt-16 pb-12 min-h-[calc(100vh-3.5rem)] flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full text-center">
          <div className="about-anim inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm mb-6 hover-wiggle cursor-pointer transition-colors hover:border-accent/50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-muted">About GameZone</span>
          </div>

          <h1 className="about-anim text-5xl sm:text-6xl lg:text-[5rem] font-black leading-[0.95] tracking-tight title-display mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Open a game.</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-rose-500">Start playing.</span>
          </h1>

          <p className="about-anim max-w-3xl mx-auto text-lg md:text-xl font-bold leading-8 text-muted mb-10">
            A free browser games platform built purely for fun. No installations, no forced sign-ups, no hidden paywalls. 
            Just pick a title and it runs — flawlessly, on any screen, right this very second. Welcome to the new era of instant gaming.
          </p>

          <div className="about-anim flex flex-wrap items-center justify-center gap-4">
            <Link href="/games" className="btn-bouncy">
              Play Now
            </Link>
            <Link href="/kids-site" className="btn-bouncy btn-bouncy-ghost">
              For Kids
            </Link>
          </div>
        </div>

        {/* Bouncing Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 animate-pulse">Scroll</span>
          <div className="w-8 h-12 rounded-full border-2 border-muted flex justify-center p-1">
            <div className="w-1.5 h-3 bg-muted rounded-full animate-bounce mt-1" />
          </div>
        </div>
      </section>

      {/* ══ 2. NUMBERS ═══════════════════════════════════════════════ */}
      <section className="about-section snap-start snap-always px-6 sm:px-10 lg:px-16 xl:px-20 py-12 md:py-16 min-h-[calc(100vh-3.5rem)] flex items-center relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="about-anim text-4xl sm:text-5xl lg:text-6xl font-black title-display mb-4">
              Massive scale.<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">Zero barriers.</span>
            </h2>
            <p className="about-anim text-base lg:text-lg font-bold text-muted max-w-3xl mx-auto">
              We've built a robust global platform that effortlessly handles millions of gaming sessions every single month. We never ask you to log in, download a launcher, or pay a dime to jump into the action.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className={`about-stat-item bento-card stat-card text-center overflow-hidden relative !p-6 lg:!p-8 flex flex-col justify-center items-center transition-colors ${stat.bgHover}`}>
                {/* Decorative background glow for the card */}
                <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-[2.5rem] opacity-30 ${stat.color.replace('text-', 'bg-')} pointer-events-none group-hover:opacity-50 transition-opacity`} />
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${stat.color.replace('text-', '')} to-transparent opacity-20`} />

                <p className={`text-4xl sm:text-5xl lg:text-6xl font-black title-display mb-2 lg:mb-3 relative z-10 ${stat.color} transition-transform duration-300`}>{stat.value}</p>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted group-hover:text-fg transition-colors relative z-10">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. BENTO GRID PRINCIPLES ═════════════════════════════════ */}
      <section className="about-section snap-start snap-always px-6 sm:px-10 lg:px-16 xl:px-20 py-8 lg:py-12 min-h-[calc(100vh-3.5rem)] flex items-center relative z-10">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="about-anim text-3xl sm:text-4xl lg:text-5xl font-black title-display mb-2">How we do it right.</h2>
            <p className="about-anim text-sm lg:text-base font-bold text-muted">Everything is built around the player.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRINCIPLES.map((item, index) => (
              <div 
                key={item.num} 
                className={`about-principle-item bento-card group flex flex-col justify-between transition-all duration-300 ${item.glow} !p-6 lg:!p-8 gap-4 lg:gap-6 overflow-hidden relative hover:-translate-y-2 hover:scale-[1.02] hover:z-10`}
              >
                {/* Solid colorful top border line (thicker) */}
                <div className={`absolute top-0 left-0 w-full h-2 ${item.solidColor}`} />
                
                {/* Subtle colorful background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none`} />

                <div className="flex-1 relative z-10 mt-2">
                  <div className={`font-black text-xs uppercase tracking-widest mb-3 ${item.textColor}`}>
                    Principle {item.num}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black mb-3 text-fg transition-colors">{item.title}</h3>
                  <p className="text-sm lg:text-base font-bold text-muted leading-relaxed group-hover:text-fg/80 transition-colors">{item.text}</p>
                </div>
                
                <div className={`absolute -bottom-2 -right-4 font-black text-[7rem] lg:text-[9rem] title-display select-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-2 z-0 bg-clip-text text-transparent bg-gradient-to-br ${item.color} opacity-[0.04] group-hover:opacity-[0.15]`}>
                  {item.num}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. GET OUT OF THE WAY ════════════════════════════════════ */}
      <section className="about-section snap-start snap-always px-6 sm:px-10 lg:px-16 xl:px-20 py-12 md:py-16 min-h-[calc(100vh-3.5rem)] flex items-center relative z-10">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="about-anim text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-500 block">
              What we are building
            </span>
            <h2 className="about-anim text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] title-display text-slate-800 dark:text-white uppercase">
              A game site that feels fast, clear, and worth returning to.
            </h2>
            <div className="about-anim space-y-4 text-base lg:text-lg font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
              <p>
                GameZone organizes thousands of HTML5 games into a layout that is quick to scan:
                featured picks, trending games, category rows, new releases, search, favorites, and recently played history.
              </p>
              <p>
                The goal is not to make players learn the site. The goal is to make the next game obvious,
                keep the player area comfortable, and leave room for ads without letting ads become the product.
              </p>
            </div>
          </div>

          <aside className="about-anim bento-card !p-6 md:!p-8 !bg-white/95 dark:!bg-slate-900/95 border border-border shadow-xl rounded-[24px]">
            <p className="mb-6 text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-500">
              Players open most
            </p>
            <ol className="about-games-list space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {topGames.map((game, i) => (
                <li key={game.id} className="about-game-item pt-4 first:pt-0">
                  <Link href={`/games/${game.slug}`} className="group flex items-center gap-4 transition-transform hover:translate-x-1 duration-200">
                    <span className="w-6 text-base font-black text-red-600 dark:text-red-500 shrink-0">
                      0{i + 1}
                    </span>
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-navy shadow-sm group-hover:scale-105 group-hover:border-red-500 dark:group-hover:border-red-500 transition-all duration-300">
                      <GameImage game={game} alt={game.title} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-black text-slate-800 dark:text-white transition-colors group-hover:text-red-600 dark:group-hover:text-red-500">
                        {game.title}
                      </p>
                      <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-500">
                        Play now
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* ══ 5. TECHNOLOGY ════════════════════════════════════════════ */}
      <section className="about-section snap-start snap-always px-6 sm:px-10 lg:px-16 xl:px-20 py-12 md:py-16 min-h-[calc(100vh-3.5rem)] flex items-center relative z-10">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1 relative aspect-square w-full max-w-sm mx-auto flex items-center justify-center about-anim">
            {/* Spinning decorative geometric elements */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-dashed border-accent/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-fuchsia-500/30 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-16 rounded-3xl border border-cyan-500/40 animate-[spin_25s_linear_infinite]" />
            
            {/* Glowing core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-accent via-fuchsia-500 to-cyan-500 blur-3xl opacity-50 animate-pulse" />
              <div className="z-10 text-center">
                <span className="block text-4xl lg:text-5xl font-black title-display text-fg">HTML5</span>
                <span className="block text-sm font-black uppercase tracking-widest text-muted mt-2">WebGL & WASM</span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="about-anim text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] title-display mb-6">
              Lightning fast.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-fuchsia-500">Built on modern tech.</span>
            </h2>
            <p className="about-anim text-base lg:text-lg font-semibold leading-relaxed text-muted mb-6">
              Every single game on our platform is meticulously optimized to run natively in your browser. By leveraging HTML5, WebGL, and WebAssembly, we deliver console-quality graphics without requiring a single plugin.
            </p>
            <p className="about-anim text-base lg:text-lg font-semibold leading-relaxed text-muted">
              Our global CDN infrastructure ensures that whether you're playing from New York or Tokyo, your game loads instantly and runs smoothly at a buttery 60 frames per second. This is the future of accessible, high-performance gaming.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 6. CTA ═══════════════════════════════════════════════════ */}
      <section className="about-section snap-start snap-always px-6 py-32 min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center text-center relative z-10">
        <div className="max-w-3xl mx-auto w-full">
          <p className="about-anim mb-6 text-sm font-black uppercase tracking-widest text-accent">Ready?</p>
          <h2 className="about-anim text-5xl sm:text-6xl font-black title-display mb-8">
            Start playing right now.
          </h2>
          <div className="about-anim mt-12">
            <Link href="/games" className="btn-bouncy !text-xl !px-10 !py-5">
              Let's Go
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
