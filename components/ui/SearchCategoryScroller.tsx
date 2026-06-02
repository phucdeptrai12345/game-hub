'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

interface Props {
  onNavigate?: () => void;
}

export default function SearchCategoryScroller({ onNavigate }: Props) {
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
    window.addEventListener('resize', syncScrollState);

    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener('scroll', syncScrollState);
      window.removeEventListener('resize', syncScrollState);
    };
  }, []);

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
      className="search-category-shell"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={scrollerRef} className="search-category-strip scrollbar-hidden">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            onClick={onNavigate}
            className="search-category-chip active-click"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => scrollByPage(-1)}
        className={`category-row-nav category-row-nav-prev ${canPrev ? '' : 'category-row-nav-hidden'} ${isHovered ? 'category-row-nav-visible' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next categories"
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
