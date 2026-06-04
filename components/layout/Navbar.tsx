'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import SearchOverlay from '@/components/ui/SearchOverlay';
import CategoryDrawer from '@/components/ui/CategoryDrawer';
import SearchCategoryScroller from '@/components/ui/SearchCategoryScroller';
import GameImage from '@/components/ui/GameImage';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import type { Game } from '@/lib/types';
import Logo from '@/components/ui/Logo';

function SunIcon() {
  return (
    <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <div className="flex h-9 shrink-0 items-center gap-0.5 rounded-full border border-border bg-navy p-0.5 shadow-[inset_0_1px_3px_oklch(10%_0.01_250/0.06)] sm:h-10 sm:gap-1 sm:p-1">
      <button
        type="button"
        onClick={() => { if (theme !== 'light') toggleTheme(); }}
        aria-pressed={theme === 'light'}
        aria-label="Switch to light mode"
        className={`group flex h-8 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-bold transition-all duration-150 active-click sm:px-3 ${
          theme === 'light'
            ? 'bg-accent text-white shadow-[0_3px_10px_oklch(64%_0.21_25/0.28)]'
            : 'text-muted hover:bg-navy-light hover:text-fg'
        }`}
      >
        <SunIcon />
        <span className="hidden lg:inline">{t('theme.light')}</span>
      </button>
      <button
        type="button"
        onClick={() => { if (theme !== 'dark') toggleTheme(); }}
        aria-pressed={theme === 'dark'}
        aria-label="Switch to dark mode"
        className={`group flex h-8 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-bold transition-all duration-150 active-click sm:px-3 ${
          theme === 'dark'
            ? 'bg-accent text-white shadow-[0_3px_10px_oklch(64%_0.21_25/0.28)]'
            : 'text-muted hover:bg-navy-light hover:text-fg'
        }`}
      >
        <MoonIcon />
        <span className="hidden lg:inline">{t('theme.dark')}</span>
      </button>
    </div>
  );
}

const NAV_LINKS = [
  { href: '/',          labelKey: 'nav.home'      },
  { href: '/games',     labelKey: 'nav.allGames'  },
  { href: '/about',     labelKey: 'nav.about'     },
  { href: '/kids-site', labelKey: 'nav.forKids'   },
  { href: '/favorites', labelKey: 'nav.favorites' },
] as const;

function DesktopSearchResult({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col gap-1.5 active-click"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-navy">
        <GameImage
          game={game}
          alt=""
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          fallbackClassName="absolute inset-0 flex items-center justify-center text-sm font-bold text-muted"
          sizes="120px"
        />
      </div>
      <p className="line-clamp-1 text-[13px] font-bold leading-tight text-fg transition-colors duration-150 group-hover:text-accent">
        {game.title}
      </p>
    </Link>
  );
}

function DesktopSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Game[]>([]);
  const [searching, setSearching] = useState(false);
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setSearching(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [open]);

  useEffect(() => {
    if (!open || dataLoaded) return;

    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        setPopularGames(Array.isArray(data.popular) ? data.popular.slice(0, 12) : []);
        setNewGames(Array.isArray(data.new) ? data.new.slice(0, 12) : []);
        setDataLoaded(true);
      })
      .catch(() => setDataLoaded(true));
  }, [open, dataLoaded]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const id = window.setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 12) : []);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 240);

    return () => {
      controller.abort();
      window.clearTimeout(id);
    };
  }, [query]);

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
  };

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submitSearch();
      }}
      className="relative hidden w-full max-w-xl md:block"
    >
      <div className="flex h-10 items-center gap-3 rounded-full border border-border/80 bg-navy px-4 text-muted shadow-[inset_0_1px_3px_oklch(10%_0.01_250/0.06)] transition-colors duration-150 hover:bg-navy-light focus-within:bg-navy-light focus-within:text-fg">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
              e.currentTarget.blur();
            }
          }}
          placeholder={t('search.placeholder')}
          aria-label="Search games"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-fg outline-none ring-0 placeholder:text-muted focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          style={{ outline: 'none' }}
        />
      </div>

      {open && (
        <div className="absolute left-1/2 top-full z-[120] mt-2 w-[min(880px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_14px_40px_oklch(10%_0.01_250/0.18)]">
          <div className="max-h-[min(78vh,620px)] overflow-y-auto p-5">
            {!query.trim() ? (
              !dataLoaded ? (
                <div className="space-y-5">
                  <div className="flex gap-2 overflow-hidden">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="skeleton h-9 w-24 shrink-0 rounded-full" />
                    ))}
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="skeleton aspect-square rounded-xl" />
                        <div className="skeleton h-2.5 w-3/4 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <section>
                    <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                      {t('search.categories')}
                    </h2>
                    <SearchCategoryScroller onNavigate={() => setOpen(false)} />
                  </section>

                  {popularGames.length > 0 && (
                    <section>
                      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                        {t('search.popular')}
                      </h2>
                      <div className="grid grid-cols-6 gap-3">
                        {popularGames.map((game) => (
                          <DesktopSearchResult key={game.id} game={game} />
                        ))}
                      </div>
                    </section>
                  )}

                  {newGames.length > 0 && (
                    <section>
                      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                        {t('search.newGames')}
                      </h2>
                      <div className="grid grid-cols-6 gap-3">
                        {newGames.map((game) => (
                          <DesktopSearchResult key={game.id} game={game} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )
            ) : searching ? (
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="skeleton aspect-square rounded-xl" />
                    <div className="skeleton h-2.5 w-3/4 rounded-full" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                  {results.length} {t('search.results')}
                </h2>
                <div className="grid grid-cols-6 gap-3">
                  {results.map((game) => (
                    <DesktopSearchResult key={game.id} game={game} />
                  ))}
                </div>
                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-accent px-3 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-accent-hover active-click"
                >
                  {t('search.seeAll')}
                </button>
              </>
            ) : (
              <div className="px-3 py-5 text-center">
                <p className="text-sm font-bold text-fg">{t('search.noResults')}</p>
                <p className="mt-1 text-xs font-bold text-muted">{t('search.tryDifferent')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { hidden, toggle: toggleSidebar } = useSidebar();
  const { t } = useI18n();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => { setCategoriesOpen(false); }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-[0_2px_20px_oklch(10%_0.01_250/0.10)]">
        <div className="flex items-center h-16">

          {/* Desktop: hamburger in w-14 box — aligns with sidebar column */}
          <div className="hidden lg:flex w-16 items-center justify-center shrink-0">
            <button
              onClick={toggleSidebar}
              aria-label={hidden ? 'Show sidebar' : 'Hide sidebar'}
              className={`active-click flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150 ${
                hidden ? 'text-muted hover:bg-navy hover:text-accent' : 'text-fg hover:bg-navy hover:text-accent'
              }`}
            >
              <MenuIcon />
            </button>
          </div>

          {/* Rest of navbar: structured columns keep the theme switch pinned right */}
          <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-4 lg:px-0 lg:pr-4 xl:grid-cols-[auto_auto_minmax(320px,1fr)_auto] xl:gap-6">
            <div className="col-start-1 flex min-w-0 items-center gap-3">

            {/* Mobile: opens CategoryDrawer */}
            <button
              onClick={() => setCategoriesOpen(true)}
              aria-label="Browse categories"
              className="lg:hidden active-click p-1 text-muted hover:text-accent transition-colors duration-150"
            >
              <MenuIcon />
            </button>

            {/* Logo */}
            <Logo />
            </div>

            {/* Center search bar — desktop only */}
            <nav className="hidden shrink-0 items-center gap-2 xl:col-start-2 xl:flex" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-150 active-click ${
                      active
                        ? 'bg-accent/10 text-accent ring-1 ring-inset ring-accent/25'
                        : 'text-muted hover:bg-navy hover:text-accent'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>

            <div className="col-start-2 hidden min-w-0 justify-center md:flex xl:col-start-3">
              <DesktopSearch />
            </div>

            {/* Desktop + Mobile icon buttons */}
            <div className="col-start-3 flex items-center justify-self-end gap-1.5 xl:col-start-4">
              {/* Search icon — mobile only */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="md:hidden p-1 text-muted hover:text-accent transition-colors duration-150 active-click"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <ThemeSwitch />
            </div>
          </div>{/* end padded flex */}
        </div>{/* end h-16 flex */}
      </header>

      {/* Search overlay — rendered outside header to avoid z-index issues */}
      <CategoryDrawer
        isOpen={categoriesOpen}
        pathname={pathname}
        onClose={() => setCategoriesOpen(false)}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
