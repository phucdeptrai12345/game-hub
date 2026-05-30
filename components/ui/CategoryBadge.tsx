import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { CATEGORIES } from '@/constants/categories';
import CategoryIcon from './CategoryIcon';

interface Props {
  category: string;
  className?: string;
  interactive?: boolean;
}

export default function CategoryBadge({
  category,
  className = '',
  interactive = true,
}: Props) {
  // Resolve slug: try exact name match first (handles "2 Player" → "2player"),
  // then fall back to slugify for unknown categories.
  const cat =
    CATEGORIES.find((c) => c.name.toLowerCase() === category.toLowerCase()) ??
    CATEGORIES.find((c) => c.slug === slugify(category));
  const slug = cat?.slug ?? slugify(category);

  const base =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black leading-none transition-colors duration-150 active-click';

  if (!interactive) {
    return (
      <span className={`${base} bg-surface text-fg border border-border ${className}`}>
        <CategoryIcon slug={slug} size={15} className="text-accent" />
        {category}
      </span>
    );
  }

  return (
    <Link
      href={`/category/${slug}`}
      className={`${base} bg-surface text-fg border border-border hover:border-accent/40 hover:text-accent ${className}`}
    >
      <CategoryIcon slug={slug} size={15} className="text-accent" />
      {category}
    </Link>
  );
}
