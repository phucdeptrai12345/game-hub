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
  const slug = slugify(category);
  const cat = CATEGORIES.find((c) => c.slug === slug);

  const base =
    'inline-flex items-center px-3.5 py-1.5 rounded-full text-[11.5px] font-bold leading-none transition-colors duration-150 active-click';

  if (!interactive) {
    return (
      <span className={`${base} bg-accent-light text-accent border border-accent/10 ${className}`}>
        {category}
      </span>
    );
  }

  return (
    <Link
      href={`/category/${slug}`}
      className={`${base} bg-accent-light text-accent border border-accent/10 hover:bg-accent hover:text-white hover:border-transparent ${className}`}
    >
      {category}
    </Link>
  );
}
