'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CATEGORIES } from '@/constants/categories';
import CategoryIcon from '@/components/ui/CategoryIcon';

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

export default function CategoryDrawer({ isOpen, pathname, onClose }: Props) {
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
            <p className="text-xs font-black uppercase tracking-widest text-muted">Browse</p>
            <p className="truncate text-lg font-black leading-tight text-fg title-display uppercase">
              Categories
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Game categories">
          <Link
            href="/games"
            onClick={onClose}
            aria-current={isAllGamesActive ? 'page' : undefined}
            className={`active-click mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-black transition-colors duration-150 ${
              isAllGamesActive
                ? 'bg-accent text-white shadow-[0_2px_10px_oklch(61%_0.24_28/0.25)]'
                : 'bg-surface text-fg hover:bg-accent-light hover:text-accent'
            }`}
          >
            <AllGamesIcon />
            <span>All Games</span>
          </Link>

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
