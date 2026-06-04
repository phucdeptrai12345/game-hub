'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CATEGORIES } from '@/constants/categories';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function AllGamesIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <rect x="3" y="4" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.14" />
      <rect x="14" y="4" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.14" />
      <rect x="3" y="15" width="7" height="5" rx="2" fill="currentColor" fillOpacity="0.14" />
      <rect x="14" y="15" width="7" height="5" rx="2" fill="currentColor" fillOpacity="0.14" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 11 8-7 8 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 10v10h11V10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-5h4v5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01" />
    </svg>
  );
}

function KidsSiteIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <rect x="4" y="5" width="16" height="16" rx="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 6.5 3.5 4M19 6.5 20.5 4M8 15s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.3 6.3a4.5 4.5 0 0 1 6.4 0L12 7.6l1.3-1.3a4.5 4.5 0 0 1 6.4 6.4L12 20.4 4.3 12.7a4.5 4.5 0 0 1 0-6.4Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5l3 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-2.7-6.4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 4v5h-5" />
    </svg>
  );
}

export default function CategoryDrawer({ isOpen, pathname, onClose }: Props) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = window.setTimeout(() => closeRef.current?.focus(), 80);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAllGamesActive = pathname === '/games';
  const quickLinks = [
    { href: '/',               label: t('nav.home'),         Icon: HomeIcon },
    { href: '/about',          label: t('nav.about'),        Icon: InfoIcon },
    { href: '/kids-site',      label: t('nav.forKids'),      Icon: KidsSiteIcon },
    { href: '/favorites',      label: t('nav.favorites'),    Icon: HeartIcon },
    { href: '/recently-played',label: t('nav.recent'),       Icon: ClockIcon },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-fg/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Browse categories"
        className="category-drawer fixed left-0 top-0 z-[100] flex h-dvh w-[min(86vw,340px)] flex-col border-r border-border bg-background shadow-[0_16px_48px_oklch(10%_0.01_250/0.18)]"
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close categories"
            className="active-click flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-muted transition-colors duration-150 hover:text-accent"
          >
            <CloseIcon />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">{t('drawer.browse')}</p>
            <p className="truncate text-lg font-black leading-tight text-fg title-display uppercase">
              {t('drawer.categories')}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Game categories">
          <Link
            href="/games"
            onClick={onClose}
            aria-current={isAllGamesActive ? 'page' : undefined}
            className={`active-click mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors duration-150 ${
              isAllGamesActive
                ? 'bg-accent text-white shadow-[0_2px_10px_oklch(61%_0.24_28/0.25)]'
                : 'bg-surface text-fg hover:bg-accent-light hover:text-accent'
            }`}
          >
            <AllGamesIcon />
            <span>{t('drawer.allGames')}</span>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={`active-click flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors duration-150 ${
                    active
                      ? 'bg-accent text-white shadow-[0_2px_10px_oklch(61%_0.24_28/0.25)]'
                      : 'bg-surface text-fg hover:bg-accent-light hover:text-accent'
                  }`}
                >
                  <Icon />
                  <span className="min-w-0 truncate">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="my-3 h-px bg-border/70" />

          <div className="space-y-1.5">
            {CATEGORIES.map((cat) => {
              const href = `/category/${cat.slug}`;
              const active = pathname === href;

              return (
                <Link
                  key={cat.slug}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={`active-click flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors duration-150 ${
                    active
                      ? 'bg-accent text-white shadow-[0_2px_10px_oklch(61%_0.24_28/0.25)]'
                      : 'text-fg hover:bg-accent-light hover:text-accent'
                  }`}
                >
                  <CategoryIcon slug={cat.slug} size={20} />
                  <span className="min-w-0 truncate">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
