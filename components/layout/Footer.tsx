import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

const SOCIALS = [
  {
    label: 'Twitter / X',
    href: process.env.NEXT_PUBLIC_X_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: process.env.NEXT_PUBLIC_DISCORD_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
].filter((social) => Boolean(social.href));

export default function Footer() {
  return (
    <footer className="border-t border-border/70 mt-16">
      <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 pt-12 pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 mb-10">

          {/* Left: brand + description + socials */}
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center group mb-4" aria-label="GameZone home">
              <svg className="w-7 h-7 text-accent mr-2.5 shrink-0" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.15" />
                <path d="M6 12h4M8 10v4" />
                <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="17.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-fg font-black text-2xl tracking-tight leading-none title-display uppercase">
                Game<span className="text-accent">Zone</span>
              </span>
            </Link>

            <p className="text-muted text-sm leading-relaxed font-semibold mb-5">
              Your destination for free browser games. 9,000+ HTML5 games across every genre —
              no downloads, no sign-up, instant play on any device.
            </p>

            {/* Social links */}
            {SOCIALS.length > 0 ? (
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-navy border border-border text-muted hover:text-accent hover:border-accent/30 transition-colors duration-150">
                  {icon}
                </a>
              ))}
            </div>
            ) : (
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-black text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
            )}
          </div>

          {/* Right: links */}
          <div className="flex gap-12 shrink-0">
            <div>
              <p className="text-fg/40 text-xs font-black uppercase tracking-widest mb-4">Games</p>
              <ul className="space-y-3">
                {[['All Games', '/games'], ['New Games', '/games?sort=new'], ['A–Z', '/games?sort=az'], ['Favorites', '/favorites']].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-muted hover:text-accent transition-colors duration-150 font-semibold text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-fg/40 text-xs font-black uppercase tracking-widest mb-4">Info</p>
              <ul className="space-y-3">
                {[['About', '/about'], ['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Contact', '/contact']].map(([label, href]) => (
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

        <div className="border-t border-border/60 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted/60 font-semibold">
          <p>© {new Date().getFullYear()} GameZone. All rights reserved.</p>
          <p>9,000+ free games · No downloads · No sign-up</p>
        </div>
      </div>
    </footer>
  );
}
