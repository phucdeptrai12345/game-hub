'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomeAnimations() {
  useGSAP(() => {
    // ── 1. Category rows: fade + slide up on scroll ──────────────
    gsap.utils.toArray<HTMLElement>('.compact-shelf').forEach((shelf) => {
      gsap.from(shelf, {
        opacity: 0,
        y: 32,
        duration: 0.6,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: shelf,
          start: 'top 90%',
          once: true,
        },
      });
    });

    // ── 2. Game cards stagger: Popular Now grid ──────────────────
    // Targets direct children of both grid types
    ScrollTrigger.batch('.grid-standard > *, .grid-poki > *', {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 20,
          scale: 0.96,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.03,
          immediateRender: false,
          overwrite: true,
        });
      },
      once: true,
      start: 'top 94%',
      interval: 0.08,
      batchMax: 12,
    });

    // ── 3. Section headings slide in ─────────────────────────────
    // Targets h2 with title-display inside sections (not hero)
    gsap.utils.toArray<HTMLElement>('section h2.title-display').forEach((el) => {
      const section = el.closest('section');
      // skip hero / above-fold
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight) return; // already in viewport, skip

      gsap.from(el, {
        opacity: 0,
        y: 18,
        duration: 0.55,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    });

    // ── 4. AdSlots fade in ───────────────────────────────────────
    gsap.utils.toArray<HTMLElement>('.ad-slot').forEach((ad) => {
      gsap.from(ad, {
        opacity: 0,
        duration: 0.5,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: ad,
          start: 'top 95%',
          once: true,
        },
      });
    });
  });

  return null;
}
