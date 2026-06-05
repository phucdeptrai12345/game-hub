import { searchGames } from '@/lib/gamemonetize';
import type { Game } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import GameGrid from '@/components/ui/GameGrid';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import type { Metadata } from 'next';
import SearchAnimations from './SearchAnimations';

export const revalidate = 3600;

const PAGE_SIZE = 48;

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q ?? '';
  return {
    title: q ? `"${q}" — Search` : 'Search Games',
    description: 'Search hundreds of free HTML5 games by name, genre, or tag — no download needed.',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q ?? '';
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  let allResults: Game[] = [];
  if (query) {
    allResults = await searchGames(query);
  }

  const total = allResults.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const results = allResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <SearchAnimations />

      {/* Header + search */}
      <div className="mb-10">
        <h1 className="search-heading text-3xl font-black text-fg mb-5">
          {query ? (
            <>
              Results for{' '}
              <span className="text-accent">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            'What are you looking for?'
          )}
        </h1>
        <div className="max-w-lg">
          <SearchBar initialValue={query} size="lg" placeholder="Game name, category, tag..." />
        </div>
      </div>

      {query ? (
        total > 0 ? (
          <>
            <p className="search-result-count text-muted text-sm font-bold mb-6" aria-live="polite" aria-atomic="true">
              {total.toLocaleString()} game{total !== 1 ? 's' : ''} found
              {totalPages > 1 && ` — page ${page} of ${totalPages}`}
            </p>
            <div className="search-results">
              <GameGrid games={results} priorityCount={8} />
            </div>
            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center flex-wrap gap-2" aria-label="Search results pagination">
                {page > 1 && (
                  <Link href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                    className="rounded-xl border border-border bg-surface px-5 py-2 text-sm font-bold text-fg hover:bg-navy hover:border-accent/40 transition-all">
                    ← Prev
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 7) p = i + 1;
                  else if (page <= 4) p = i + 1;
                  else if (page >= totalPages - 3) p = totalPages - 6 + i;
                  else p = page - 3 + i;
                  return (
                    <Link key={p} href={`/search?q=${encodeURIComponent(query)}${p > 1 ? `&page=${p}` : ''}`}
                      className={`min-w-[2.5rem] rounded-xl px-3 py-2 text-sm font-bold text-center transition-all ${
                        p === page ? 'bg-accent text-white' : 'border border-border bg-surface text-muted hover:bg-navy hover:text-fg'
                      }`}>
                      {p}
                    </Link>
                  );
                })}
                {page < totalPages && (
                  <Link href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                    className="rounded-xl border border-border bg-surface px-5 py-2 text-sm font-bold text-fg hover:bg-navy hover:border-accent/40 transition-all">
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <NoResults query={query} />
        )
      ) : (
        <EmptySearch />
      )}
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="py-20">
      <div className="text-center mb-12">
        <p className="text-5xl mb-5" aria-hidden="true">🔍</p>
        <p className="text-xl font-black text-fg">
          Nothing for &ldquo;{query}&rdquo;
        </p>
        <p className="text-muted font-semibold mt-2 mb-8 max-w-xs mx-auto leading-relaxed">
          Double-check the spelling, or pick a category to explore instead.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/games"
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors duration-150"
          >
            Browse all games →
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-surface border border-border hover:border-accent/40 text-fg font-bold rounded-xl transition-colors duration-150"
          >
            Home
          </Link>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4 text-center">
          Or jump to a category
        </p>
        <div className="search-category-chips flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-xl text-sm font-bold text-fg hover:border-accent/40 hover:bg-accent-light hover:text-accent transition-colors duration-150"
            >
              <span aria-hidden="true">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptySearch() {
  return (
    <div className="py-16">
      <p className="text-2xl font-bold text-fg mb-2">Hundreds of free games, one search away</p>
      <p className="text-muted font-semibold mb-10 max-w-sm leading-relaxed">
        Try a game name, a genre like &ldquo;racing&rdquo;, or a vibe like &ldquo;relaxing&rdquo;.
      </p>

      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">
        Jump to a category
      </p>
      <div className="search-category-chips flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-bold text-fg hover:border-accent/40 hover:bg-accent-light hover:text-accent transition-colors duration-150"
          >
            <span className="text-base" aria-hidden="true">{cat.icon}</span>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
