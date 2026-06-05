import type { Metadata } from 'next';
import Link from 'next/link';
import GameImage from '@/components/ui/GameImage';
import AdSlot from '@/components/ui/AdSlot';
import BlogCategoryScroller, { type BlogCategoryItem } from '@/components/ui/BlogCategoryScroller';
import { getAllGames } from '@/lib/gamemonetize';
import type { Game } from '@/lib/types';
import { catBadgeClass } from '@/lib/cat-badge';

export const revalidate = 3600;

const PAGE_SIZE = 21;

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  if (category) {
    return {
      title: `${cap(category)} Game Reviews - GameZone`,
      description: `Read reviews and quick guides for ${category} browser games on GameZone.`,
    };
  }

  return {
    title: 'Game Reviews & Guides - GameZone',
    description: 'Reviews, tips, and quick guides for free browser games on GameZone.',
  };
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function articleType(game: Game): string {
  const cat = game.category.toLowerCase();
  if (cat.includes('puzzle') || cat.includes('skill')) return 'Guide';
  if (cat.includes('kids') || cat.includes('girls') || cat.includes('cooking')) return 'Pick';
  if (game.featured || (game.qualityScore ?? 0) >= 82) return 'Review';
  return 'Tips';
}

function readTime(game: Game): number {
  const text = `${game.description || ''} ${game.instructions || ''} ${game.tags.join(' ')}`;
  const words = text.trim().split(/\s+/).filter(Boolean).length + 520;
  return Math.max(3, Math.min(7, Math.round(words / 180)));
}

function shortDescription(game: Game, fallback: string, limit = 150): string {
  const text = (game.description || fallback).replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

const catBadge = catBadgeClass;

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeCategory = params.category ?? '';
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  const all = await getAllGames();

  const catCount = all.reduce<Record<string, number>>((acc, game) => {
    acc[game.category] = (acc[game.category] ?? 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const filtered = activeCategory
    ? all.filter((game) => game.category.toLowerCase() === activeCategory.toLowerCase())
    : all;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const games = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const buildHref = (p: number, cat?: string) => {
    const category = cat !== undefined ? cat : activeCategory;
    const parts: string[] = [];
    if (category) parts.push(`category=${encodeURIComponent(category)}`);
    if (p > 1) parts.push(`page=${p}`);
    return `/blog${parts.length ? `?${parts.join('&')}` : ''}`;
  };

  return (
    <div className="w-full px-3 py-9 sm:px-4 lg:px-5 xl:px-6">
      <header className="mb-8 max-w-5xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-accent" aria-hidden="true" />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            GameZone Blog
          </p>
        </div>

        <h1 className="title-display text-4xl font-black uppercase leading-[0.96] tracking-tight text-fg sm:text-5xl">
          {activeCategory ? `${cap(activeCategory)} games` : 'Game reviews & guides'}
        </h1>

        <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-muted">
          Quick reads for browser games you can open fast. Find what is worth playing,
          what works on mobile, and which games are best for a short break.
        </p>

        <p className="mt-3 text-sm font-semibold text-muted">
          <span className="font-black text-fg">{total.toLocaleString()}</span>{' '}
          {activeCategory ? activeCategory : 'browser'} games covered
        </p>
      </header>

      <BlogCategoryScroller
        items={[
          { label: 'All', count: all.length, href: buildHref(1, ''), active: !activeCategory },
          ...categories.slice(0, 18).map<BlogCategoryItem>((cat) => ({
            label: cap(cat),
            count: catCount[cat],
            href: buildHref(1, cat),
            active: activeCategory.toLowerCase() === cat.toLowerCase(),
          })),
        ]}
      />

      {games.length > 0 ? (
        <>
          <HeroCard game={games[0]} />

          <AdSlot slot="blog-top" variant="leaderboard" className="my-8" />

          {games.length > 1 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {games.slice(1, 11).map((game, index) => (
                <ArticleCard key={game.id} game={game} priority={index < 3} />
              ))}
            </div>
          )}

          {games.length > 11 && (
            <AdSlot slot="blog-infeed" variant="leaderboard" className="my-8" />
          )}

          {games.length > 11 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {games.slice(11).map((game) => (
                <ArticleCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-8">
          <p className="text-lg font-black text-fg">No articles found.</p>
          <p className="mt-2 text-sm font-semibold text-muted">
            Try another category or go back to all GameZone blog posts.
          </p>
          <Link href="/blog" className="mt-5 inline-flex text-sm font-bold text-accent hover:opacity-70">
            View all posts {'->'}
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          {page > 1 && (
            <Link
              href={buildHref(page - 1)}
              className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-bold text-fg transition-all hover:border-accent/45 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {'<-'} Prev
            </Link>
          )}

          {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => {
            let p: number;
            if (totalPages <= 9) p = i + 1;
            else if (page <= 5) p = i + 1;
            else if (page >= totalPages - 4) p = totalPages - 8 + i;
            else p = page - 4 + i;

            return (
              <Link
                key={p}
                href={buildHref(p)}
                className={`min-w-[2.45rem] rounded-full px-3 py-2 text-center text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  p === page
                    ? 'bg-accent text-white shadow-[0_8px_20px_oklch(57%_0.23_50/0.22)]'
                    : 'border border-border bg-surface text-muted hover:border-accent/45 hover:text-fg'
                }`}
              >
                {p}
              </Link>
            );
          })}

          {page < totalPages && (
            <Link
              href={buildHref(page + 1)}
              className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-bold text-fg transition-all hover:border-accent/45 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Next {'->'}
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

function HeroCard({ game }: { game: Game }) {
  const date = formatDate(game.dateAdded);

  return (
    <Link
      href={`/blog/${game.slug}`}
      className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-surface/72 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface/82 hover:shadow-[0_18px_50px_oklch(22%_0.04_35/0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >

      <div className="relative z-10 grid min-h-[270px] gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_320px] lg:p-9">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
              {articleType(game)}
            </span>
            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white ${catBadge(game.category)}`}>
              {game.category}
            </span>
          </div>

          <h2
            className="title-display mb-3 font-black leading-[0.96] text-fg"
            style={{ fontSize: 'clamp(1.8rem, 3vw + 0.4rem, 3.5rem)', textWrap: 'balance' }}
          >
            {game.title}: is it worth playing?
          </h2>

          <p className="max-w-2xl text-sm font-semibold leading-relaxed text-muted sm:text-base">
            {shortDescription(game, `A quick look at ${game.title}, how it plays, and who will enjoy it most.`, 180)}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-muted">
            <span>{readTime(game)} min read</span>
            {date && (
              <>
                <span className="opacity-35">-</span>
                <span>{date}</span>
              </>
            )}
            <span className="opacity-35">-</span>
            <span className="font-black text-accent transition-opacity group-hover:opacity-70">Read review {'->'}</span>
          </div>
        </div>

        <div className="hidden items-center lg:flex">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-navy shadow-[0_12px_34px_oklch(22%_0.04_35/0.18)] transition-transform duration-500 group-hover:scale-[1.015]">
            <GameImage
              game={game}
              alt={game.title}
              fill
              className="object-cover saturate-125"
              sizes="320px"
              priority
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  const date = formatDate(game.dateAdded);

  return (
    <Link
      href={`/blog/${game.slug}`}
      className="group flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_10px_28px_oklch(22%_0.04_35/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <GameImage
          game={game}
          alt={game.title}
          fill
          className="object-cover saturate-125 transition-transform duration-500 group-hover:scale-[1.035]"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 20vw"
          priority={priority}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 py-3">
          <span className="rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#171922] shadow-sm">
            {articleType(game)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted">
          <span className="capitalize text-accent">{game.category}</span>
          <span className="opacity-35">-</span>
          <span>{readTime(game)} min read</span>
          {date && (
            <>
              <span className="opacity-35">-</span>
              <span>{date}</span>
            </>
          )}
        </div>

        <h2 className="text-lg font-black leading-tight text-fg transition-colors group-hover:text-accent">
          {game.title}
        </h2>

        <p className="line-clamp-2 flex-1 text-sm font-semibold leading-relaxed text-muted">
          {shortDescription(game, `Quick tips and play notes for ${game.title}.`, 135)}
        </p>

        <span className="mt-auto pt-1 text-xs font-black text-accent transition-opacity group-hover:opacity-65">
          Read more {'->'}
        </span>
      </div>
    </Link>
  );
}
