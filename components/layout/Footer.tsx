'use client';

import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';
import { useI18n } from '@/components/providers/I18nProvider';
import Logo from '@/components/ui/Logo';

const FOOTER_SECTIONS = [
  {
    title: 'Play',
    links: [
      { href: '/',               labelKey: 'nav.home' },
      { href: '/games',          labelKey: 'footer.allGames' },
      { href: '/games?sort=new', labelKey: 'footer.newGames' },
      { href: '/kids-site',      labelKey: 'nav.forKids' },
      { href: '/favorites',      labelKey: 'nav.favorites' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { href: '/category/action',   labelKey: 'cat.action',   fallback: 'Action' },
      { href: '/category/racing',   labelKey: 'cat.racing',   fallback: 'Racing' },
      { href: '/category/puzzle',   labelKey: 'cat.puzzle',   fallback: 'Puzzle' },
      { href: '/category/shooting', labelKey: 'cat.shooting', fallback: 'Shooting' },
      { href: '/blog',              labelKey: 'nav.blog',     fallback: 'Blog' },
    ],
  },
  {
    title: 'GameZone',
    links: [
      { href: '/about',   labelKey: 'footer.about' },
      { href: '/contact', labelKey: 'footer.contact' },
      { href: '/privacy', labelKey: 'footer.privacy' },
      { href: '/terms',   labelKey: 'footer.terms' },
    ],
  },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-14 border-t border-border/70 bg-surface/40">
      <div className="w-full px-3 py-10 sm:px-4 lg:px-5 xl:px-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] lg:gap-16">

          {/* Brand */}
          <div className="max-w-xs">
            <Logo size="sm" />
            <p className="mt-3 text-sm font-semibold leading-relaxed text-muted">
              {t('footer.tagline')}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block text-xs font-bold text-muted transition-colors duration-150 hover:text-accent"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Link columns */}
          <nav
            className="grid grid-cols-3 gap-x-10 gap-y-6 sm:gap-x-14"
            aria-label="Footer navigation"
          >
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-accent">
                  {section.title}
                </p>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-semibold text-muted transition-colors duration-150 hover:text-fg"
                      >
                        {'fallback' in link ? t(link.labelKey, link.fallback) : t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-1.5 border-t border-border/60 pt-5 text-xs font-semibold text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GameZone. All rights reserved.</p>
          <p className="text-muted/50">Free browser games — no download, no sign-up.</p>
        </div>
      </div>
    </footer>
  );
}
