'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export interface BlogCategoryItem {
  label: string;
  count: number;
  href: string;
  active: boolean;
}

interface Props {
  items: BlogCategoryItem[];
}

export default function BlogCategoryScroller({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function syncScrollState() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanPrev(scroller.scrollLeft > 4);
    setCanNext(scroller.scrollLeft < maxScroll - 4);
  }

  useEffect(() => {
    syncScrollState();

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const resizeObserver = new ResizeObserver(syncScrollState);
    resizeObserver.observe(scroller);
    scroller.addEventListener('scroll', syncScrollState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener('scroll', syncScrollState);
    };
  }, [items.length]);

  function scrollByPage(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.72, 320),
      behavior: 'smooth',
    });
  }

  return (
    <div
      className="relative -mx-3 mb-8 overflow-visible sm:mx-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div
        ref={scrollerRef}
        className="scrollbar-hidden flex w-full min-w-0 snap-x snap-proximity flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden px-12 pb-2 scroll-smooth sm:px-12"
        aria-label="Blog categories"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 snap-start rounded-full px-4 py-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              item.active
                ? 'bg-accent text-white'
                : 'border border-border bg-surface/80 text-muted hover:border-accent/45 hover:text-fg'
            }`}
          >
            {item.label}
            <span className={`ml-1.5 text-[10px] font-semibold ${item.active ? 'opacity-75' : 'opacity-45'}`}>
              {item.count.toLocaleString()}
            </span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous blog categories"
        onClick={() => scrollByPage(-1)}
        className={`category-row-nav category-row-nav-prev ${canPrev ? '' : 'category-row-nav-hidden'} ${isHovered ? 'category-row-nav-visible' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next blog categories"
        onClick={() => scrollByPage(1)}
        className={`category-row-nav category-row-nav-next ${canNext ? '' : 'category-row-nav-hidden'} ${isHovered ? 'category-row-nav-visible' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
