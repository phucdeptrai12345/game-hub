'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export interface SortDropdownOption {
  value: string;
  label: string;
  href: string;
}

interface Props {
  options: SortDropdownOption[];
  activeValue: string;
  ariaLabel?: string;
  className?: string;
}

export default function SortDropdown({
  options,
  activeValue,
  ariaLabel = 'Sort games',
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = options.find((option) => option.value === activeValue) ?? options[0];

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`sort-dropdown ${open ? 'sort-dropdown-open' : ''} ${className}`}>
      <button
        type="button"
        className="sort-dropdown-trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{active.label}</span>
        <svg className="sort-dropdown-chevron" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="sort-dropdown-menu">
          {options.map((option) => (
            <Link
              key={option.value}
              href={option.href}
              onClick={() => setOpen(false)}
              className={`sort-dropdown-item ${option.value === activeValue ? 'sort-dropdown-item-active' : ''}`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
