import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/70 mt-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 pb-10">

        {/* Top: logo + description + links */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 mb-14">

          {/* Left: brand + description */}
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex items-center group mb-5" aria-label="GameZone home">
              <svg
                className="w-7 h-7 text-accent mr-2.5 shrink-0"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              >
                <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.15" />
                <path d="M6 12h4M8 10v4" />
                <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="17.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-fg font-black text-2xl tracking-tight leading-none title-display uppercase">
                Game<span className="text-accent">Zone</span>
              </span>
            </Link>

            <h2 className="text-fg font-black text-2xl mb-4 leading-snug">
              Free online games — play instantly in your browser
            </h2>

            <div className="space-y-4 text-muted text-base leading-loose font-semibold">
              <p>
                GameZone is your ultimate destination for free online games. With over 500 carefully selected HTML5 games
                spanning action, puzzle, racing, sports, shooting, adventure, strategy, and many more genres, there is
                always something new and exciting to discover — no matter what kind of player you are.
              </p>
              <p>
                Every game runs directly in your browser with zero downloads, zero installations, and zero sign-ups
                required. Play instantly on any device — desktop, laptop, tablet, or smartphone — optimized for smooth
                performance across all screen sizes.
              </p>
              <p>
                We update our library regularly with fresh titles from top indie developers and studios around the world.
                From fast-paced multiplayer .io games to relaxing casual experiences, from brain-twisting puzzles to
                adrenaline-fueled car races — GameZone has it all, completely free, always ready to play.
              </p>
            </div>
          </div>

          {/* Right: links */}
          <div className="flex gap-16 shrink-0">
            <div>
              <p className="text-fg/40 text-xs font-black uppercase tracking-widest mb-5">Games</p>
              <ul className="space-y-3.5">
                {[
                  ['All Games', '/games'],
                  ['New Games', '/games?sort=new'],
                  ['A–Z', '/games?sort=az'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-muted hover:text-accent transition-colors duration-150 font-semibold text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-fg/40 text-xs font-black uppercase tracking-widest mb-5">Info</p>
              <ul className="space-y-3.5">
                {[
                  ['About', '/about'],
                  ['Privacy Policy', '/privacy'],
                  ['Terms of Use', '/terms'],
                  ['Contact', '/contact'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-muted hover:text-accent transition-colors duration-150 font-semibold text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted/60 font-semibold">
          <p>© {new Date().getFullYear()} GameZone. All rights reserved.</p>
          <p>500+ free games. No downloads. No sign-up.</p>
        </div>

      </div>
    </footer>
  );
}
