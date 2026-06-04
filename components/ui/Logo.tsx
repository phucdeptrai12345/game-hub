'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { icon: 'w-7 h-7',          text: 'text-xl',            mr: 'mr-2'    },
  md: { icon: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-xl sm:text-3xl', mr: 'mr-2 sm:mr-2.5' },
  lg: { icon: 'w-10 h-10',        text: 'text-3xl',           mr: 'mr-3'    },
};

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const s = sizes[size];

  return (
    <Link
      href="/"
      className={`shrink-0 flex items-center group active-click ${className}`}
      aria-label="GameZone home"
    >
      <svg
        className={`${s.icon} ${s.mr} text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] shrink-0`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path
          d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <path d="M6 12h4M8 10v4" />
        <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
      </svg>

      <span
        className={`hidden min-[360px]:inline text-fg font-black tracking-tight leading-none uppercase ${s.text}`}
        style={{ fontFamily: 'var(--font-nunito), "Nunito", sans-serif' }}
      >
        Game<span className="text-accent">Zone</span>
      </span>
    </Link>
  );
}
