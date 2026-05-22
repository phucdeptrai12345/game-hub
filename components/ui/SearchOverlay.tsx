'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import type { Game } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function MiniCard({ game, onClose }: { game: Game; onClose: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Link
      href={`/games/${game.slug}`}
      onClick={onClose}
      className="group flex flex-col gap-1.5 active-click"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-navy border border-border/60">
        {!imgErr ? (
          <Image
            src={game.thumb}
            alt=""
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="100px"
            unoptimized
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            🎮
          </div>
        )}
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
  const [query, setQuery] = useState('');
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [searching, setSearching] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const catDragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onCatMouseDown = (e: React.MouseEvent) => {
    const el = catScrollRef.current;
    if (!el) return;
    catDragRef.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
  };
  const onCatMouseMove = (e: React.MouseEvent) => {
    const d = catDragRef.current;
    const el = catScrollRef.current;
    if (!d.active || !el) return;
    e.preventDefault();
    el.scrollLeft = d.scrollLeft - (e.pageX - el.offsetLeft - d.startX) * 1.5;
  };
  const onCatMouseUp = () => { catDragRef.current.active = false; };

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
    if (!query.trim()) { setSearchResults([]); return; }
    const id = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        setSearchResults(await res.json());
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => clearTimeout(id);
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
                placeholder="Search games..."
                aria-label="Search games"
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
              <h2 className="text-xs font-black uppercase tracking-widest text-muted mb-4">
                {searching ? '...' : `${searchResults.length} games`}
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
                  <p className="font-black text-fg">No games found</p>
                  <p className="text-muted text-sm mt-1 font-semibold">Try a different search term</p>
                </div>
              )}
            </section>

          ) : (
            /* ── Default: categories + popular + new ── */
            <>
              {/* Categories — edge-to-edge, draggable */}
              <section className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12">
                <div
                  ref={catScrollRef}
                  onMouseDown={onCatMouseDown}
                  onMouseMove={onCatMouseMove}
                  onMouseUp={onCatMouseUp}
                  onMouseLeave={onCatMouseUp}
                  className="flex items-center gap-2 overflow-x-auto scrollbar-hidden py-1 px-4 sm:px-6 cursor-grab active:cursor-grabbing select-none"
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="shrink-0 px-4 py-2 rounded-full text-sm font-bold bg-navy border border-border hover:bg-accent-light hover:text-accent hover:border-accent/30 text-fg transition-all duration-150 active-click whitespace-nowrap"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Popular */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1.5 h-6 rounded-full bg-accent" aria-hidden="true" />
                  <h2 className="text-xl font-black text-fg title-display uppercase tracking-tight">
                    Popular
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
                    New Games
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
