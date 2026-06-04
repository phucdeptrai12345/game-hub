'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SearchAnimations() {
  useGSAP(() => {
    // ── 1. Search heading + result count: fade + slide up ────────
    const heading = document.querySelector<HTMLElement>('.search-heading');
    if (heading) {
      gsap.from(heading, {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: 'power2.out',
        immediateRender: false,
      });
    }

    const resultCount = document.querySelector<HTMLElement>('.search-result-count');
    if (resultCount) {
      gsap.from(resultCount, {
        opacity: 0,
        y: 12,
        duration: 0.45,
        ease: 'power2.out',
        delay: 0.15,
        immediateRender: false,
      });
    }

    // ── 2. Search result cards: stagger reveal with ScrollTrigger.batch ──
    const cardEls = gsap.utils.toArray<HTMLElement>(
      '.search-results .card-enter, .search-results .grid-poki > *, .search-results .grid-standard > *'
    );
    if (cardEls.length) {
      // Set initial state for all cards before batch fires
      gsap.set(cardEls, { opacity: 0, y: 20, scale: 0.97 });

      ScrollTrigger.batch(cardEls, {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.04,
            overwrite: true,
          });
        },
        once: true,
        start: 'top 94%',
        interval: 0.08,
        batchMax: 12,
      });
    }

    // ── 3. Category chips: stagger in ───────────────────────────
    const chips = gsap.utils.toArray<HTMLElement>('.search-category-chips a');
    if (chips.length) {
      gsap.from(chips, {
        opacity: 0,
        y: 14,
        scale: 0.94,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.035,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.search-category-chips',
          start: 'top 90%',
          once: true,
        },
      });
    }
  });

  return null;
}
