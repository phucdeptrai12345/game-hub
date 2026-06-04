import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { getAllGames } from '@/lib/gamemonetize';
import TagsAnimations from './TagsAnimations';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Browse by Tag — GameZone',
  description: 'Explore hundreds of free browser games by tag — action, puzzle, racing, and more.',
};

export default async function TagsPage() {
  const games = await getAllGames();

  // Collect all tags from games
  const tagCount = new Map<string, number>();
  games.forEach((g) => {
    g.tags.forEach((tag) => {
      const t = tag.trim().toLowerCase();
      if (t.length > 1) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
    });
  });

  // Sort by count desc, take top 80 — keep count for size scaling
  const topTags = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([tag, count], i) => ({ tag, count, rank: i }));

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <TagsAnimations />

      <h1 className="tags-heading text-3xl font-black text-fg title-display uppercase tracking-tight mb-1">
        Browse by Tag
      </h1>
      <p className="tags-subheading text-muted text-sm font-semibold mb-8">
        Pick a tag to find exactly the kind of game you&apos;re in the mood for.
      </p>

      {/* Categories */}
      <section className="mb-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-muted mb-4">Categories</h2>
        <div className="tags-categories flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-surface border border-border text-sm font-bold text-fg hover:border-accent/50 hover:bg-accent-light hover:text-accent transition-colors duration-150"
            >
              <span aria-hidden="true">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular tags */}
      {topTags.length > 0 && (
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-muted mb-4">Popular Tags</h2>
          <div className="tags-popular flex flex-wrap gap-2 items-baseline">
            {topTags.map(({ tag, rank }) => {
              const sizeClass =
                rank < 5
                  ? 'text-base px-4 py-2 font-black text-fg border-accent/40'
                  : rank < 15
                  ? 'text-sm px-3 py-1.5 font-bold text-fg/80'
                  : 'text-xs px-2.5 py-1 font-semibold text-muted';
              return (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className={`rounded-full bg-navy border border-border hover:text-fg hover:border-accent/30 transition-colors duration-150 capitalize ${sizeClass}`}
                >
                  #{tag}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
