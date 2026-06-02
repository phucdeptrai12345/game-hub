import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { getAllGames } from '@/lib/gamemonetize';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Tags — GameZone',
  description: 'Browse all game tags and categories on GameZone.',
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

  // Sort by count desc, take top 80
  const topTags = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([tag]) => tag);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">

      <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight mb-1">
        Tags
      </h1>
      <p className="text-muted text-sm font-semibold mb-8">
        Browse games by tag or category
      </p>

      {/* Categories */}
      <section className="mb-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-muted mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 rounded-full bg-navy border border-border text-sm font-semibold text-muted hover:text-fg hover:border-accent/30 transition-colors duration-150 capitalize"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
