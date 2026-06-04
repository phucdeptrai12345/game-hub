'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutAnimations() {
  useGSAP(() => {
    ScrollTrigger.defaults({ scroller: '.about-page-scroll' });

    // ── 1. All .about-anim elements in each section ──────────────
    gsap.utils.toArray<HTMLElement>('.about-section').forEach((section) => {
      const items = section.querySelectorAll<HTMLElement>('.about-anim');
      if (!items.length) return;
      gsap.from(items, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: { trigger: section, scroller: '.about-page-scroll', start: 'top 75%', once: true },
      });
    });

    // ── 2. Stats: 3D Flip & Slide ────────────────────
    ScrollTrigger.batch('.about-stat-item', {
      onEnter: (els) =>
        gsap.from(els, {
          opacity: 0, 
          y: 50, 
          rotationX: -45,
          transformPerspective: 800,
          duration: 1.4, 
          ease: 'expo.out', 
          stagger: 0.12,
        }),
      start: 'top 80%', 
      once: true,
    });

    // ── 3. Principle items: Cinematic slide ────────────────────
    ScrollTrigger.batch('.about-principle-item', {
      onEnter: (els) =>
        gsap.from(els, {
          opacity: 0, 
          x: -40, 
          rotationY: 15,
          transformPerspective: 1000,
          duration: 1.4, 
          ease: 'expo.out', 
          stagger: 0.2,
        }),
      start: 'top 80%', 
      once: true,
    });

    // ── 4. Top games list items ──────────────────────────────────
    gsap.utils.toArray<HTMLElement>('.about-games-list').forEach((list) => {
      const items = list.querySelectorAll<HTMLElement>('.about-game-item');
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          x: 60,
          scale: 0.9,
          duration: 1.0,
          ease: 'elastic.out(1, 0.7)',
          stagger: 0.12,
          scrollTrigger: {
            trigger: list,
            scroller: '.about-page-scroll',
            start: 'top 75%',
            once: true,
          }
        });
      }
    });

    // ── 5. Accent orb parallax ───────────────────────────────────
    gsap.utils.toArray<HTMLElement>('.about-section > .pointer-events-none').forEach((orb) => {
      gsap.to(orb, {
        y: -80, 
        rotation: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: orb.parentElement ?? orb,
          scroller: '.about-page-scroll',
          start: 'top bottom', end: 'bottom top', scrub: 1.4,
        },
      });
    });

    // ── 6. Section Transition (3D Card Fold Parallax) ────────────
    gsap.utils.toArray<HTMLElement>('.about-section').forEach((section) => {
      if (section.nextElementSibling) {
        gsap.to(section, {
          opacity: 0.1,
          scale: 0.92,
          y: -120,
          rotationX: 4,
          transformPerspective: 1200,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            scroller: '.about-page-scroll',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });
  });

  return null;
}
