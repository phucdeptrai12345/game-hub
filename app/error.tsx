'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error('[GameZone]', error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center py-32 min-h-[60vh]">
      <p className="text-5xl mb-5" aria-hidden="true">⚡</p>
      <h2 className="text-2xl font-black text-fg mb-3">Something went wrong</h2>
      <p className="text-muted font-semibold max-w-xs mb-10 leading-relaxed">
        Couldn't load the games. Check your connection and try again.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors duration-150"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-surface border border-border hover:border-accent/40 text-fg font-bold rounded-xl transition-colors duration-150"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
