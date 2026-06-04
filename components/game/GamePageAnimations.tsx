'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function GamePageAnimations() {
  useGSAP(() => {
    // Game title h1 — fade + slide up
    gsap.from('h1', {
      opacity: 0,
      y: 28,
      duration: 0.6,
      ease: 'power2.out',
      immediateRender: false,
      once: true,
    });

    // CategoryBadge — fade in with delay
    gsap.from('.category-badge', {
      opacity: 0,
      duration: 0.5,
      delay: 0.25,
      ease: 'power1.out',
      immediateRender: false,
      once: true,
    });

    // Description text — fade in
    gsap.from('.game-description', {
      opacity: 0,
      y: 16,
      duration: 0.55,
      delay: 0.4,
      ease: 'power2.out',
      immediateRender: false,
      once: true,
    });

    // "More Games" section heading — fade + slide up on scroll
    gsap.from('.more-games-heading', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.more-games-heading',
        start: 'top 88%',
        once: true,
      },
    });

    // "More Games" cards — stagger batch on scroll
    ScrollTrigger.batch('.more-games-card', {
      start: 'top 90%',
      once: true,
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 20,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.06,
          immediateRender: false,
        });
      },
    });
  });

  return null;
}
