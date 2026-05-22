'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '@/constants/categories';
import SearchOverlay from '@/components/ui/SearchOverlay';
import { useTheme } from '@/components/providers/ThemeProvider';

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-panel absolute right-0 top-full mt-2 w-44 bg-surface border border-border rounded-2xl shadow-[0_8px_32px_oklch(10%_0.01_250/0.14)] p-3 z-[200]">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted px-1 mb-2">Theme</p>
      <div className="flex gap-1.5">
        <button
          onClick={() => { if (theme !== 'light') toggleTheme(); onClose(); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active-click ${
            theme === 'light'
              ? 'bg-accent text-white shadow-[0_2px_8px_oklch(64%_0.21_25/0.3)]'
              : 'bg-navy text-muted hover:text-fg border border-border'
          }`}
        >
          <SunIcon /> Light
        </button>
        <button
          onClick={() => { if (theme !== 'dark') toggleTheme(); onClose(); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active-click ${
            theme === 'dark'
              ? 'bg-accent text-white shadow-[0_2px_8px_oklch(64%_0.21_25/0.3)]'
              : 'bg-navy text-muted hover:text-fg border border-border'
          }`}
        >
          <MoonIcon /> Dark
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Category strip drag-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close settings panel on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    function onPointer(e: PointerEvent) {
      if (
        settingsBtnRef.current?.contains(e.target as Node) ||
        settingsPanelRef.current?.contains(e.target as Node)
      ) return;
      setSettingsOpen(false);
    }
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [settingsOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setHasDragged(false);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    if (Math.abs(x - startX) > 5) setHasDragged(true);
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };
  const handleLinkClick = (e: React.MouseEvent) => { if (hasDragged) e.preventDefault(); };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        {/* Row 1: Logo + Action buttons */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center gap-3 h-16">

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center group active-click" aria-label="GameZone home">
              <svg
                className="w-9 h-9 text-accent mr-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.15" />
                <path d="M6 12h4M8 10v4" />
                <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="17.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-fg font-black text-3xl tracking-tight leading-none title-display uppercase">
                Game<span className="text-accent">Zone</span>
              </span>
            </Link>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Desktop + Mobile icon buttons */}
            <div className="flex items-center gap-1.5">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-1 text-muted hover:text-accent transition-colors duration-150 active-click"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Settings button */}
              <div className="relative">
                <button
                  ref={settingsBtnRef}
                  onClick={() => setSettingsOpen((o) => !o)}
                  aria-label="Settings"
                  aria-expanded={settingsOpen}
                  className={`p-1 transition-colors duration-150 active-click ${
                    settingsOpen ? 'text-accent' : 'text-muted hover:text-accent'
                  }`}
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {settingsOpen && (
                  <div ref={settingsPanelRef}>
                    <SettingsPanel onClose={() => setSettingsOpen(false)} />
                  </div>
                )}
              </div>

              {/* Mobile hamburger (hidden on md+) */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden p-3 rounded-xl bg-navy border border-border text-muted hover:text-fg transition-colors duration-150 active-click"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category strip — hidden on game pages */}
        <div className={`w-full border-t border-border/50 bg-surface select-none ${pathname.startsWith('/games/') ? 'hidden' : ''}`}>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-2 overflow-x-auto scrollbar-hidden py-2.5 px-4 sm:px-6 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={handleLinkClick}
                className={`shrink-0 px-4 py-2 rounded-full text-base font-bold transition-all duration-150 active-click whitespace-nowrap ${
                  isActive(`/category/${cat.slug}`)
                    ? 'bg-accent text-white shadow-md shadow-accent/15'
                    : 'bg-surface border border-border text-fg hover:text-accent hover:bg-accent-light hover:border-accent/30'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/40 bg-surface px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">
              Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-full text-sm font-bold bg-navy border border-border text-fg active-click whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Search overlay — rendered outside header to avoid z-index issues */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
