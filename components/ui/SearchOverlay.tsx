'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GameImage from '@/components/ui/GameImage';
import SearchCategoryScroller from '@/components/ui/SearchCategoryScroller';
import type { Game } from '@/lib/types';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function MiniCard({ game, onClose }: { game: Game; onClose: () => void }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      onClick={onClose}
      className="group flex flex-col gap-1.5 active-click"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-navy border border-border/60">
        <GameImage
          game={game}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          fallbackClassName="text-xs"
          sizes="100px"
        />
      </div>
      <p className="text-[15px] font-bold text-fg line-clamp-1 group-hover:text-accent transition-colors duration-150 leading-tight">
        {game.title}
      </p>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="skeleton aspect-square rounded-xl" />
          <div className="skeleton h-2.5 rounded-full w-3/4" />
        </div>
      ))}
    </div>
  );
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [searching, setSearching] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load popular + new on first open
  useEffect(() => {
    if (isOpen && !dataLoaded) {
      fetch('/api/games')
        .then((r) => r.json())
        .then((data) => {
          setPopularGames(data.popular ?? []);
          setNewGames(data.new ?? []);
          setDataLoaded(true);
        })
        .catch(() => setDataLoaded(true));
    }

    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(id);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSearchResults([]);
    }
  }, [isOpen, dataLoaded]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const id = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setSearchResults([]);
          return;
        }
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 280);
    return () => {
      controller.abort();
      clearTimeout(id);
    };
  }, [query]);

  if (!isOpen) return null;

  const showResults = query.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99] bg-fg/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search games"
        className="search-overlay-panel fixed top-0 left-0 right-0 z-[100] bg-background shadow-[0_8px_40px_oklch(10%_0.01_250/0.18)] max-h-[85vh] overflow-y-auto"
      >
        {/* Search bar — sticky inside panel */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/60">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || !query.trim()) return;
                  e.preventDefault();
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  onClose();
                }}
                placeholder={t('search.overlayPlaceholder')}
                aria-label={t('search.overlayPlaceholder')}
                className="flex-1 text-base sm:text-lg font-bold bg-transparent text-fg placeholder-muted outline-none min-w-0"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="shrink-0 p-2 rounded-xl text-muted hover:text-fg hover:bg-navy transition-colors duration-150"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 pb-10">

          {showResults ? (
            /* ── Search results ── */
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
                {searching ? '...' : `${searchResults.length} ${t('search.results')}`}
              </h2>
              {searching ? (
                <SkeletonGrid />
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {searchResults.map((g) => (
                    <MiniCard key={g.id} game={g} onClose={onClose} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-bold text-fg">{t('search.noResults')}</p>
                  <p className="text-muted text-sm mt-1 font-semibold">{t('search.tryDifferent')}</p>
                </div>
              )}
            </section>

          ) : (
            /* ── Default: categories + popular + new ── */
            <>
              {/* Categories — edge-to-edge, draggable */}
              <section className="mb-6 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12">
                <SearchCategoryScroller onNavigate={onClose} />
              </section>

              {/* Popular */}
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1.5 h-6 rounded-full bg-accent" aria-hidden="true" />
                  <h2 className="text-xl font-black text-fg title-display uppercase tracking-tight">
                    {t('search.popular')}
                  </h2>
                </div>
                {!dataLoaded ? (
                  <SkeletonGrid />
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {popularGames.map((g) => (
                      <MiniCard key={g.id} game={g} onClose={onClose} />
                    ))}
                  </div>
                )}
              </section>

              {/* New */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1.5 h-6 rounded-full bg-accent" aria-hidden="true" />
                  <h2 className="text-xl font-black text-fg title-display uppercase tracking-tight">
                    {t('search.newGames')}
                  </h2>
                </div>
                {!dataLoaded ? (
                  <SkeletonGrid />
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {newGames.map((g) => (
                      <MiniCard key={g.id} game={g} onClose={onClose} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
