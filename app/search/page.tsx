import { searchGames } from '@/lib/gamemonetize';
import type { Game } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import GameGrid from '@/components/ui/GameGrid';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import type { Metadata } from 'next';
import SearchAnimations from './SearchAnimations';

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ q?: string }>;
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
  let results: Game[] = [];
  if (query) {
    results = await searchGames(query);
  }

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
        results.length > 0 ? (
          <>
            <p className="search-result-count text-muted text-sm font-bold mb-6" aria-live="polite" aria-atomic="true">
              {results.length.toLocaleString()} game{results.length !== 1 ? 's' : ''} found
            </p>
            <div className="search-results">
              <GameGrid games={results} priorityCount={8} />
            </div>
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
