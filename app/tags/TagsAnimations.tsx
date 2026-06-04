'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function TagsAnimations() {
  useGSAP(() => {
    // ── 1. Page heading: fade + slide up ────────────────────────
    const heading = document.querySelector<HTMLElement>('.tags-heading');
    if (heading) {
      gsap.from(heading, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
        immediateRender: false,
      });
    }

    const subheading = document.querySelector<HTMLElement>('.tags-subheading');
    if (subheading) {
      gsap.from(subheading, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.15,
        immediateRender: false,
      });
    }

    // ── 2. Category cards: stagger reveal with ScrollTrigger.batch ──
    const categoryChips = gsap.utils.toArray<HTMLElement>('.tags-categories a');
    if (categoryChips.length) {
      gsap.set(categoryChips, { opacity: 0, y: 16, scale: 0.95 });

      ScrollTrigger.batch(categoryChips, {
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
        start: 'top 92%',
        interval: 0.08,
        batchMax: 10,
      });
    }

    // ── 3. Tag items: stagger reveal ─────────────────────────────
    const tagItems = gsap.utils.toArray<HTMLElement>('.tags-popular a');
    if (tagItems.length) {
      gsap.set(tagItems, { opacity: 0, scale: 0.88 });

      ScrollTrigger.batch(tagItems, {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            scale: 1,
            duration: 0.38,
            ease: 'back.out(1.4)',
            stagger: 0.025,
            overwrite: true,
          });
        },
        once: true,
        start: 'top 92%',
        interval: 0.06,
        batchMax: 20,
      });
    }
  });

  return null;
}
