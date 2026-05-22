'use client';

import { useState } from 'react';
import SearchOverlay from './SearchOverlay';

interface Props {
  placeholder?: string;
}

export default function SearchTrigger({ placeholder = 'Search games...' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search games"
        className="relative w-full flex items-center gap-3 px-4 py-3.5 bg-surface border-2 border-border rounded-2xl text-muted hover:border-accent/40 hover:text-fg transition-colors duration-150"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-base font-bold">{placeholder}</span>
      </button>
      <SearchOverlay isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
