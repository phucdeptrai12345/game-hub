import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About GameZone',
  description: 'Learn about GameZone — your destination for 3,000+ free online HTML5 games, no download or sign-up required.',
};

export default function AboutPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight mb-2">
          About GameZone
        </h1>
        <p className="text-muted font-semibold text-sm mb-10">
          Free online games, instantly in your browser
        </p>

        <div className="space-y-6 text-muted leading-relaxed font-semibold text-[0.95rem]">
          <p>
            GameZone is a free browser-game platform giving players instant access to hundreds of
            HTML5 games — no downloads, no installations, no accounts. Click a game, start playing.
          </p>
          <p>
            Our catalog covers every style of gaming: fast-paced action and shooting, brain-teasing
            puzzles, high-speed racing, sports simulations, .io multiplayer battles, casual clickers,
            adventure RPGs, strategy titles, and much more. Games are sourced from talented indie
            developers and studios worldwide.
          </p>
          <p>
            The library is updated regularly so there's always something new waiting on your next
            visit. We're committed to keeping GameZone free, fast, and accessible on every device
            — desktop, laptop, tablet, or smartphone.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-border/60">
          <p className="text-xs font-black uppercase tracking-widest text-muted mb-4">Quick links</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Browse all games', href: '/games' },
              { label: 'Action', href: '/category/action' },
              { label: 'Puzzle', href: '/category/puzzle' },
              { label: 'Racing', href: '/category/racing' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 bg-surface border border-border rounded-xl text-sm font-bold text-fg hover:border-accent/40 hover:text-accent transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
