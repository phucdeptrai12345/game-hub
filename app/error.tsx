'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  const { t } = useI18n();

  useEffect(() => {
    console.error('[GameZone]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="mb-5 text-5xl" aria-hidden="true">⚡</p>
      <h2 className="mb-3 text-2xl font-black text-fg">{t('error.title')}</h2>
      <p className="mb-10 max-w-xs font-semibold leading-relaxed text-muted">
        {t('error.description')}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-accent px-6 py-3 font-bold text-white transition-colors duration-150 hover:bg-accent-hover"
        >
          {t('error.retry')}
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-surface px-6 py-3 font-bold text-fg transition-colors duration-150 hover:border-accent/40"
        >
          {t('nav.home')}
        </Link>
      </div>
    </div>
  );
}
