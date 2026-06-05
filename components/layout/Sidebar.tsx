'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { CATEGORIES } from '@/constants/categories';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { getRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { useI18n } from '@/components/providers/I18nProvider';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const NewIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
const PopularIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);
const AboutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
const KidsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="5" width="16" height="16" rx="7" />
    <path d="M5 6.5 3.5 4M19 6.5 20.5 4" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    <path d="M8 15s1.5 2 4 2 4-2 4-2" />
  </svg>
);
const MultiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const TwoPlayerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const TagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const BlogIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"/>
    <path d="M8 9h8M8 13h5"/>
  </svg>
);

const NAV_ITEMS = [
  { labelKey: 'nav.home',        href: '/',                     Icon: HomeIcon },
  { labelKey: 'nav.newGames',    href: '/games?sort=new',        Icon: NewIcon },
  { labelKey: 'nav.allGames',    href: '/games',                Icon: PopularIcon },
  { labelKey: 'nav.forKids',     href: '/kids-site',            Icon: KidsIcon },
  { labelKey: 'nav.multiplayer', href: '/category/multiplayer', Icon: MultiIcon },
  { labelKey: 'nav.twoPlayer',   href: '/category/2player',     Icon: TwoPlayerIcon },
  { labelKey: 'nav.favorites',   href: '/favorites',            Icon: HeartIcon },
  { labelKey: 'nav.blog',        href: '/blog',                 Icon: BlogIcon  },
  { labelKey: 'nav.about',       href: '/about',                Icon: AboutIcon },
];

const SIDEBAR_CATEGORY_SLUGS = [
  'action',
  'puzzle',
  'racing',
  'sports',
  'shooting',
  'adventure',
  'arcade',
  'strategy',
  '3d',
  'kids',
];

const SIDEBAR_CATEGORIES = CATEGORIES.filter((cat) =>
  SIDEBAR_CATEGORY_SLUGS.includes(cat.slug)
);

function NavItem({
  href, label, active, children,
}: { href: string; label: string; active: boolean; children: React.ReactNode; }) {
  return (
    <Link
      href={href}
      className={`group/nav mx-2 flex h-12 items-center rounded-2xl font-bold text-base transition-colors duration-150 ${
        active
          ? 'text-accent group-hover/sidebar:bg-accent group-hover/sidebar:text-white'
          : 'text-fg hover:bg-navy'
      }`}
    >
      <span className={`ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
        active
          ? 'bg-accent text-white'
          : 'group-hover/nav:bg-surface'
      }`}>
        {children}
      </span>
      <span className="ml-2 whitespace-nowrap pr-4 opacity-0 transition-opacity duration-150 delay-75 group-hover/sidebar:opacity-100">
        {label}
      </span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="h-0 overflow-hidden px-4 text-[10px] font-black uppercase tracking-widest text-muted/60 opacity-0 transition-all duration-150 delay-75 group-hover/sidebar:h-auto group-hover/sidebar:pb-1 group-hover/sidebar:pt-3 group-hover/sidebar:opacity-100">
      {children}
    </p>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hidden, toggle } = useSidebar();
  const { t } = useI18n();
  const [hasRecent, setHasRecent] = useState(false);

  useEffect(() => {
    setHasRecent(getRecentlyPlayed().length > 0);
  }, [pathname]);

  useEffect(() => {
    const onChanged = () => setHasRecent(getRecentlyPlayed().length > 0);
    window.addEventListener('gz-recent-changed', onChanged);
    return () => window.removeEventListener('gz-recent-changed', onChanged);
  }, []);

  function isNavActive(href: string) {
    if (href === '/') return pathname === '/';

    const [path, queryStr] = href.split('?');
    if (pathname !== path) return false;

    if (!queryStr) return !searchParams.get('sort');

    const hrefSort = new URLSearchParams(queryStr).get('sort');
    return searchParams.get('sort') === hrefSort;
  }

  return (
    <div className={`hidden lg:block shrink-0 transition-[width] duration-200 ${hidden ? 'w-0' : 'w-16'}`}>
      <div className={hidden ? '' : 'group/sidebar'}>
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-[width,background-color,box-shadow] duration-200 ease-out overflow-hidden flex flex-col ${
        hidden
          ? 'w-0 bg-transparent'
          : 'w-16 bg-transparent group-hover/sidebar:w-56 group-hover/sidebar:bg-surface group-hover/sidebar:border-r group-hover/sidebar:border-border group-hover/sidebar:shadow-[4px_0_24px_oklch(10%_0.01_250/0.08)]'
      }`}>
        <div className="w-56 min-w-[224px] h-full overflow-y-auto scrollbar-hidden flex flex-col py-3 gap-1.5">

          {/* Nav items — hidden when sidebar is toggled off */}
          {!hidden && (
            <>
              {/* Nav items */}
              <SectionLabel>Main</SectionLabel>
              {NAV_ITEMS.map(({ labelKey, href, Icon }) => (
                <NavItem key={href} href={href} label={t(labelKey)} active={isNavActive(href)}>
                  <Icon />
                </NavItem>
              ))}

              {/* Recently Played */}
              <Link
                href="/recently-played"
                className={`group/nav mx-2 flex h-12 items-center rounded-2xl font-bold text-base transition-colors duration-150 ${
                  pathname === '/recently-played'
                    ? 'text-accent group-hover/sidebar:bg-accent group-hover/sidebar:text-white'
                    : 'text-fg hover:bg-navy'
                }`}
              >
                <span className={`relative ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
                  pathname === '/recently-played'
                    ? 'bg-accent text-white'
                    : 'group-hover/nav:bg-surface'
                }`}>
                  <ClockIcon />
                  {hasRecent && pathname !== '/recently-played' && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
                  )}
                </span>
                <span className="ml-2 whitespace-nowrap pr-4 opacity-0 transition-opacity duration-150 delay-75 group-hover/sidebar:opacity-100">
                  {t('nav.recentlyPlayed')}
                </span>
              </Link>

              {/* Divider */}
              <div className="mx-3 my-1 border-t border-border/60" />

              {/* Categories */}
              <SectionLabel>Categories</SectionLabel>
              {SIDEBAR_CATEGORIES.map((cat) => {
                const active = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className={`group/nav mx-2 flex h-12 items-center rounded-2xl font-bold text-base transition-colors duration-150 ${
                      active
                        ? 'text-accent group-hover/sidebar:bg-accent group-hover/sidebar:text-white'
                        : 'text-fg hover:bg-navy'
                    }`}
                  >
                    <span className={`ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
                      active
                        ? 'bg-accent text-white'
                        : 'group-hover/nav:bg-surface'
                    }`}>
                      <CategoryIcon slug={cat.slug} size={22} />
                    </span>
                    <span className="ml-2 whitespace-nowrap pr-4 opacity-0 transition-opacity duration-150 delay-75 group-hover/sidebar:opacity-100">
                      {t(`cat.${cat.slug}`, cat.name)}
                    </span>
                  </Link>
                );
              })}

              <Link
                href="/tags"
                className={`group/nav mx-2 flex h-12 items-center rounded-2xl font-bold text-base transition-colors duration-150 ${
                  pathname === '/tags'
                    ? 'text-accent group-hover/sidebar:bg-accent group-hover/sidebar:text-white'
                    : 'text-fg hover:bg-navy'
                }`}
              >
                <span className={`ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
                  pathname === '/tags'
                    ? 'bg-accent text-white'
                    : 'group-hover/nav:bg-surface'
                }`}>
                  <TagIcon />
                </span>
                <span className="ml-2 whitespace-nowrap pr-4 opacity-0 transition-opacity duration-150 delay-75 group-hover/sidebar:opacity-100">
                  {t('nav.moreCategories')}
                </span>
              </Link>

              {/* Bottom info section */}
              <div className="mx-3 my-2 border-t border-border/60" />

              {/* Contact button */}
              <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75 px-3 pb-1">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white font-bold text-sm transition-colors duration-150"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {t('nav.contact')}
                </Link>
              </div>

              {/* Text links */}
              <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75 px-4 pb-1 flex flex-col gap-3 pt-1">
                {[
                  { href: '/about',   label: 'About' },
                  { href: '/privacy', label: 'Privacy' },
                  { href: '/kids-site', label: 'Kids site' },
                  { href: '/terms',   label: 'Terms & conditions' },
                  { href: '/games',   label: 'All games' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-semibold transition-colors duration-150 whitespace-nowrap ${
                      pathname === href ? 'text-accent' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Social icons */}
              <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75 px-3 py-2 flex flex-wrap gap-2">
                {[
                  { label: 'Twitter/X', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label: 'YouTube',   icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                  { label: 'Discord',   icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg> },
                  { label: 'TikTok',    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/></svg> },
                ].map(({ label, icon }) => (
                  <button key={label} aria-label={label}
                    className="w-8 h-8 rounded-full bg-navy border border-border flex items-center justify-center text-muted hover:text-fg hover:border-accent/30 transition-colors duration-150">
                    {icon}
                  </button>
                ))}
              </div>

              {/* Copyright */}
              <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75 px-4 pb-4">
                <p className="text-[11px] text-muted/60 font-semibold whitespace-nowrap">
                  (c) {new Date().getFullYear()} GameZone
                </p>
              </div>
            </>
          )}
        </div>
      </aside>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={null}>
      <SidebarInner />
    </Suspense>
  );
}
