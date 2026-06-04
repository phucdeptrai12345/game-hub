'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Game } from '@/lib/types';
import { slugify } from '@/lib/utils';
import GameCard, { type GameBadge } from './GameCard';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  title: string;
  titleKey?: string;
  icon: string;
  slug: string;
  games: Game[];
  badgeType?: GameBadge;
  badgeCount?: number;
  autoScroll?: boolean;
  autoScrollDelayMs?: number;
  size?: 'default' | 'large';
  seeAllHref?: string;
  seeAllCardTitle?: string;
}

export default function CategoryRow({
  title,
  icon,
  slug,
  games,
  badgeType,
  badgeCount = 2,
  autoScroll = false,
  autoScrollDelayMs = 5200,
  size = 'default',
  seeAllHref,
  seeAllCardTitle,
}: Props) {
  const { t } = useI18n();
  const shellRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const syncScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanPrev(scroller.scrollLeft > 4);
    setCanNext(scroller.scrollLeft < maxScroll - 4);
  }, []);

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
  }, [syncScrollState, games.length]);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.86, 420),
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!autoScroll) return;

    const shell = shellRef.current;
    if (!shell || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.28 }
    );

    observer.observe(shell);
    return () => observer.disconnect();
  }, [autoScroll]);

  useEffect(() => {
    if (!autoScroll || isHovered || !isInView || games.length < 8) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      const scroller = scrollerRef.current;
      if (!scroller || document.hidden) return;

      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (maxScroll <= 8) return;

      const atEnd = scroller.scrollLeft >= maxScroll - 8;
      scroller.scrollTo({
        left: atEnd ? 0 : Math.min(maxScroll, scroller.scrollLeft + Math.max(scroller.clientWidth * 0.72, 360)),
        behavior: 'smooth',
      });
    }, autoScrollDelayMs);

    return () => window.clearInterval(timer);
  }, [autoScroll, autoScrollDelayMs, games.length, isHovered, isInView]);

  if (games.length === 0) return null;

  const href = seeAllHref ?? `/category/${slug}`;
  const isLarge = size === 'large';

  function badgeFor(game: Game, index: number): GameBadge | undefined {
    if (!badgeType || index >= badgeCount) return undefined;

    const slugs = [game.category, ...game.tags].map((value) => slugify(value));
    if (slugs.some((value) => value === 'kids' || value === 'baby' || value === 'girls')) return undefined;
    if (game.orientation === 'portrait' || slugs.some((value) => value === 'mobile' || value === 'hypercasual')) return 'mobile';

    if (badgeType === 'new') {
      return 'new';
    }

    if (badgeType === 'editor') {
      return index % 3 === 0 ? 'editor' : index % 3 === 1 ? 'top' : 'hot';
    }

    if (badgeType === 'top') {
      return index % 2 === 0 ? 'top' : 'hot';
    }

    if (badgeType === 'fresh') {
      return 'new';
    }

    return index % 3 === 0 ? 'hot' : index % 3 === 1 ? 'top' : 'editor';
  }

  return (
    <section className="compact-shelf">
      <div className="mb-3 flex min-w-0 items-center gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-6 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span className="shrink-0 text-xl" aria-hidden="true">{icon}</span>
          <h2 className="truncate text-lg font-black uppercase tracking-tight text-fg title-display">
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="link-red-action shrink-0 text-sm font-bold"
        >
          {t('game.seeAll')}
        </Link>
      </div>

      <div
        ref={shellRef}
        className="category-row-shell"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={scrollerRef}
          className={`category-game-strip scrollbar-hidden ${isLarge ? 'category-game-strip-large' : ''}`}
        >
          {games.map((game, index) => {
            const badge = badgeFor(game, index);

            return (
              <div
                key={game.id}
                className={`category-game-item ${isLarge ? 'category-game-item-large' : ''}`}
              >
                <div className="aspect-square">
                  <GameCard
                    game={game}
                    badge={badge}
                    compact={!isLarge}
                    priority={isLarge && index < 8}
                  />
                </div>
              </div>
            );
          })}

          <Link
            href={href}
            className={`category-see-all-card category-game-item ${isLarge ? 'category-game-item-large category-see-all-card-large' : ''}`}
          >
            <span className="category-see-all-text">{seeAllCardTitle ?? `All ${title}`}</span>
            <span className="category-see-all-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>

        <button
          type="button"
          aria-label={`Previous ${title}`}
          onClick={() => scrollByPage(-1)}
          className={`category-row-nav category-row-nav-prev ${canPrev ? '' : 'category-row-nav-hidden'} ${isHovered ? 'category-row-nav-visible' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <button
          type="button"
          aria-label={`Next ${title}`}
          onClick={() => scrollByPage(1)}
          className={`category-row-nav category-row-nav-next ${canNext ? '' : 'category-row-nav-hidden'} ${isHovered ? 'category-row-nav-visible' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
