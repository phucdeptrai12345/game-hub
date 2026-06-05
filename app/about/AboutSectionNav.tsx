'use client';

import { useEffect, useState, useCallback } from 'react';

const SECTIONS = [
  { id: 's1', label: 'Welcome',       icon: '👋' },
  { id: 's2', label: 'By the Numbers', icon: '📊' },
  { id: 's3', label: 'How We Do It',  icon: '⚙️' },
  { id: 's4', label: 'The Platform',  icon: '🎮' },
  { id: 's5', label: 'Technology',    icon: '⚡' },
  { id: 's6', label: 'Play Now',      icon: '🚀' },
];

export default function AboutSectionNav() {
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const scroller = document.querySelector<HTMLElement>('.about-page-scroll');
    if (!scroller) return;
    const h = scroller.clientHeight;
    if (!h) return;
    const idx = Math.round(scroller.scrollTop / h);
    setActive(Math.min(Math.max(idx, 0), SECTIONS.length - 1));
  }, []);

  useEffect(() => {
    const scroller = document.querySelector('.about-page-scroll');
    if (!scroller) return;
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (idx: number) => {
    const el = document.getElementById(SECTIONS[idx].id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-2"
    >
      {/* Vertical connector line */}
      <div className="absolute right-[5px] top-0 bottom-0 w-px bg-border/50 -z-10" />

      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          onClick={() => scrollTo(i)}
          aria-label={`Go to ${s.label}`}
          className="group relative flex items-center gap-3 py-1"
        >
          {/* Label tooltip — left of dot */}
          <span
            className={`
              text-[11px] font-black whitespace-nowrap rounded-full px-3 py-1
              bg-surface border border-border shadow-md
              transition-all duration-200
              ${i === active
                ? 'opacity-100 translate-x-0 text-accent border-accent/40'
                : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-fg'
              }
            `}
          >
            {s.label}
          </span>

          {/* Dot */}
          <span
            className={`
              relative block rounded-full transition-all duration-300 ease-out shrink-0
              ${i === active
                ? 'w-3 h-3 bg-accent shadow-[0_0_10px_var(--color-accent)]'
                : 'w-2 h-2 bg-border group-hover:bg-muted group-hover:scale-125'
              }
            `}
          >
            {/* Active pulse ring */}
            {i === active && (
              <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
            )}
          </span>
        </button>
      ))}
    </nav>
  );
}
