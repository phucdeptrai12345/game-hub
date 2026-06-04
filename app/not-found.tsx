'use client';

import Link from 'next/link';
import { useI18n } from '@/components/providers/I18nProvider';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <p
        className="select-none text-[9rem] font-black leading-none md:text-[12rem]"
        style={{ color: 'oklch(94% 0.005 255 / 0.07)' }}
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="-mt-4 mb-3 text-3xl font-black text-fg">{t('notFound.title')}</h1>
      <p className="mb-10 max-w-xs font-semibold leading-relaxed text-muted">
        {t('notFound.description')}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-accent px-6 py-3 font-bold text-white transition-colors duration-150 hover:bg-accent-hover"
        >
          {t('notFound.backHome')}
        </Link>
        <Link
          href="/games"
          className="rounded-xl border border-border bg-surface px-6 py-3 font-bold text-fg transition-colors duration-150 hover:border-accent/40"
        >
          {t('notFound.browseGames')}
        </Link>
      </div>
    </div>
  );
}
