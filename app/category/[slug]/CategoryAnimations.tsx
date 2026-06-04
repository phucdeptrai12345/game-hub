'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CategoryAnimations() {
  useGSAP(() => {
    // ── 1. Category heading + description stagger in on load ────────
    const headerItems = gsap.utils.toArray<HTMLElement>('.cat-header-anim');
    if (headerItems.length) {
      gsap.from(headerItems, {
        opacity: 0,
        y: 22,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.12,
        immediateRender: false,
      });
    }

    // ── 2. Sort buttons slide in from right on load ─────────────────
    const sortButtons = gsap.utils.toArray<HTMLElement>('.cat-sort-btn');
    if (sortButtons.length) {
      gsap.from(sortButtons, {
        opacity: 0,
        x: 30,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.2,
        immediateRender: false,
      });
    }

    // ── 3. Game grid cards stagger with ScrollTrigger.batch ─────────
    ScrollTrigger.batch('.grid-standard > *', {
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

    // ── 4. Pagination fade in on scroll ────────────────────────────
    const pagination = document.querySelector<HTMLElement>('.cat-pagination');
    if (pagination) {
      gsap.from(pagination, {
        opacity: 0,
        duration: 0.5,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: pagination,
          start: 'top 95%',
          once: true,
        },
      });
    }

    // ── 5. Description block slide up on scroll ─────────────────────
    const descBlock = document.querySelector<HTMLElement>('.cat-desc-block');
    if (descBlock) {
      gsap.from(descBlock, {
        opacity: 0,
        y: 40,
        duration: 0.65,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: descBlock,
          start: 'top 82%',
          once: true,
        },
      });
    }
  });

  return null;
}
