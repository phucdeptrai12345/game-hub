'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface Props {
  initialValue?: string;
  size?: 'md' | 'lg';
  placeholder?: string;
}

export default function SearchBar({
  initialValue = '',
  size = 'md',
  placeholder = 'Search games...',
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  useEffect(() => { setQuery(initialValue); }, [initialValue]);

  function handleChange(value: string) {
    setQuery(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const isLg = size === 'lg';

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full">
      <svg
        className={`absolute top-1/2 -translate-y-1/2 text-muted pointer-events-none ${
          isLg ? 'w-5 h-5 left-4' : 'w-4 h-4 left-3'
        }`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full bg-surface border-2 border-border font-bold text-fg placeholder-muted outline-none rounded-xl transition-colors duration-150 focus:border-accent ${
          isLg
            ? 'text-base py-3.5 pl-12 pr-4 rounded-2xl'
            : 'text-sm py-2.5 pl-10 pr-4'
        }`}
      />
    </form>
  );
}
