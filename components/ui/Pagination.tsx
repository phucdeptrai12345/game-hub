'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2.5 rounded-lg text-sm font-semibold text-muted hover:bg-accent hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t('pagination.prev')}
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
              p === currentPage
                ? 'bg-accent text-white'
                : 'text-fg hover:bg-accent/10'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2.5 rounded-lg text-sm font-semibold text-muted hover:bg-accent hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t('pagination.next')}
      </button>
    </nav>
  );
}
