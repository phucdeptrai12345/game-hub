'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutAnimations() {
  useGSAP(() => {
    const scroller = document.querySelector<HTMLElement>('.about-page-scroll');
    if (!scroller) return;

    const ST = (trigger: string | Element, extra: object = {}) => ({
      scroller,
      trigger,
      start: 'top 78%',
      once: true,
      ...extra,
    });

    // ════════════════════════════════════════════════════════════════
    // ENTRY ANIMATIONS
    // ════════════════════════════════════════════════════════════════

    // S1 Hero
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.about-badge',      { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2.5)' })
      .from('.about-hero-l1',    { x: -80, opacity: 0, duration: 0.65 }, '-=0.15')
      .from('.about-hero-l2',    { x:  80, opacity: 0, duration: 0.65 }, '-=0.5')
      .from('.about-hero-sub',   { y: 28,  opacity: 0, duration: 0.5  }, '-=0.3')
      .from('.about-hero-btns > *', { y: 20, opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(2)', stagger: 0.12 }, '-=0.25')
      .from('.about-scroll-ind', { opacity: 0, y: -12, duration: 0.4 }, '-=0.1')
      .from('.about-orb',        { scale: 0, opacity: 0, duration: 1.2, ease: 'power2.out', stagger: 0.25 }, 0)
      // start idle animations once hero finishes
      .call(startIdleAnimations);

    // S2 Numbers
    gsap.from('.about-s2-head > *', {
      y: 36, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: ST('#s2', { start: 'top 70%' }),
    });
    gsap.from('.about-stat-item', {
      y: 40, opacity: 0, duration: 0.55, ease: 'back.out(1.6)', stagger: 0.1,
      scrollTrigger: ST('.about-section-numbers'),
    });
    gsap.from('.about-s2-desc', {
      y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
      scrollTrigger: ST('.about-s2-desc'),
    });

    // S3 Principles
    gsap.from('.about-s3-head > *', {
      y: 30, opacity: 0, duration: 0.55, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: ST('#s3', { start: 'top 70%' }),
    });
    gsap.from('.about-principle-item', {
      x: -50, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: ST('.about-principles-list'),
    });

    // S4 Platform
    gsap.from('.about-s4-text > *', {
      x: -50, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: ST('#s4', { start: 'top 75%' }),
    });
    gsap.from('.about-games-card', {
      x: 60, opacity: 0, duration: 0.6, ease: 'back.out(1.4)',
      scrollTrigger: ST('.about-games-card'),
    });
    gsap.from('.about-game-item', {
      x: 30, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08,
      scrollTrigger: ST('.about-games-list'),
    });

    // S5 Tech — rings scale in then GSAP-spin
    const ringA = gsap.to('#ring-a', { rotation: 360,  duration: 20, repeat: -1, ease: 'none', paused: true });
    const ringB = gsap.to('#ring-b', { rotation: -360, duration: 15, repeat: -1, ease: 'none', paused: true });
    const ringC = gsap.to('#ring-c', { rotation: 360,  duration: 28, repeat: -1, ease: 'none', paused: true });

    gsap.from('.about-tech-ring', {
      scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(1.5)', stagger: 0.15,
      scrollTrigger: ST('#s5', { start: 'top 70%' }),
      onComplete: () => { ringA.play(); ringB.play(); ringC.play(); },
    });
    gsap.from('.about-tech-core', {
      scale: 0.3, opacity: 0, duration: 0.6, ease: 'back.out(2)', delay: 0.4,
      scrollTrigger: ST('#s5', { start: 'top 70%' }),
    });
    gsap.from('.about-tech-text > *', {
      x: 50, opacity: 0, duration: 0.55, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: ST('.about-tech-text'),
    });

    // S6 CTA
    gsap.from('.about-cta-ready', {
      scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)',
      scrollTrigger: ST('#s6', { start: 'top 75%' }),
    });
    gsap.from('.about-cta-word', {
      y: -50, opacity: 0, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.07,
      scrollTrigger: ST('.about-cta-title', { start: 'top 80%' }),
    });
    gsap.from('.about-cta-btn', {
      scale: 0, opacity: 0, duration: 0.85, ease: 'elastic.out(1, 0.5)', delay: 0.3,
      scrollTrigger: ST('.about-cta-btn'),
    });

    // Orb parallax
    gsap.to('.about-orb-1', { y: -120, ease: 'none', scrollTrigger: { scroller, trigger: '#s1', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    gsap.to('.about-orb-2', { y: -80,  ease: 'none', scrollTrigger: { scroller, trigger: '#s1', start: 'top top', end: 'bottom top', scrub: 2   } });

    // ════════════════════════════════════════════════════════════════
    // IDLE ANIMATIONS
    // ════════════════════════════════════════════════════════════════
    function startIdleAnimations() {
      // Badge gentle float
      gsap.to('.about-badge', {
        y: -5, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1,
      });

      // Scroll indicator bounce (reinforce)
      gsap.to('.about-scroll-ind', {
        y: 6, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
      });
    }

    // CTA glow idle pulse (starts immediately, section gated by opacity)
    gsap.to('.about-cta-glow', {
      scale: 1.18, opacity: 0.6, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });

    // ════════════════════════════════════════════════════════════════
    // HOVER: Hero cursor parallax
    // ════════════════════════════════════════════════════════════════
    const heroSection = document.getElementById('s1');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e: Event) => {
        const me = e as MouseEvent;
        const { clientX, clientY } = me;
        const { innerWidth: w, innerHeight: h } = window;
        const nx = (clientX / w - 0.5) * 2; // -1 → 1
        const ny = (clientY / h - 0.5) * 2;

        gsap.to('.about-hero-l1', { x: nx * -18, y: ny * -10, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.about-hero-l2', { x: nx *  22, y: ny *  12, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.about-orb-1',   { x: nx * -35, y: ny * -22, duration: 1.4, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.about-orb-2',   { x: nx *  25, y: ny *  16, duration: 1.8, ease: 'power2.out', overwrite: 'auto' });
      });

      heroSection.addEventListener('mouseleave', () => {
        gsap.to(['.about-hero-l1', '.about-hero-l2', '.about-orb-1', '.about-orb-2'], {
          x: 0, y: 0, duration: 1.2, ease: 'power3.out', overwrite: 'auto',
        });
      });
    }

    // ════════════════════════════════════════════════════════════════
    // HOVER: Stat items — magnetic pull + number pop
    // ════════════════════════════════════════════════════════════════
    gsap.utils.toArray<HTMLElement>('.about-stat-item').forEach((item) => {
      const num = item.querySelector<HTMLElement>('.about-stat-num');

      item.addEventListener('mouseenter', () => {
        if (num) gsap.to(num, { scale: 1.1, duration: 0.25, ease: 'back.out(2)' });
        gsap.to(item, { y: -6, duration: 0.3, ease: 'back.out(2)' });
      });

      item.addEventListener('mousemove', (e: Event) => {
        const me = e as MouseEvent;
        const rect = item.getBoundingClientRect();
        const x = (me.clientX - rect.left - rect.width  / 2) * 0.18;
        const y = (me.clientY - rect.top  - rect.height / 2) * 0.18;
        gsap.to(item, { x, y: y - 6, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      });

      item.addEventListener('mouseleave', () => {
        if (num) gsap.to(num, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });

    // ════════════════════════════════════════════════════════════════
    // HOVER: Principle items — num bounce
    // ════════════════════════════════════════════════════════════════
    gsap.utils.toArray<HTMLElement>('.about-principle-item').forEach((item) => {
      const num = item.querySelector<HTMLElement>('.about-principle-num');

      item.addEventListener('mouseenter', () => {
        if (num) {
          gsap.from(num, { scale: 0.8, duration: 0.35, ease: 'back.out(2)' });
        }
      });
    });

    // ════════════════════════════════════════════════════════════════
    // HOVER: Tech rings — speed up on hover
    // ════════════════════════════════════════════════════════════════
    const techWrap = document.querySelector('.about-tech-rings-wrap');
    if (techWrap) {
      techWrap.addEventListener('mouseenter', () => {
        gsap.to(ringA, { timeScale: 6, duration: 0.4, ease: 'power2.in' });
        gsap.to(ringB, { timeScale: 6, duration: 0.4, ease: 'power2.in' });
        gsap.to(ringC, { timeScale: 6, duration: 0.4, ease: 'power2.in' });
      });
      techWrap.addEventListener('mouseleave', () => {
        gsap.to(ringA, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
        gsap.to(ringB, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
        gsap.to(ringC, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
      });
    }

    // ════════════════════════════════════════════════════════════════
    // HOVER: CTA button — magnetic + bounce
    // ════════════════════════════════════════════════════════════════
    const ctaBtn = document.querySelector<HTMLElement>('.about-cta-btn a');
    if (ctaBtn) {
      ctaBtn.addEventListener('mousemove', (e: Event) => {
        const me = e as MouseEvent;
        const rect = ctaBtn.getBoundingClientRect();
        const x = (me.clientX - rect.left - rect.width  / 2) * 0.25;
        const y = (me.clientY - rect.top  - rect.height / 2) * 0.25;
        gsap.to(ctaBtn, { x, y, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      });

      ctaBtn.addEventListener('mouseleave', () => {
        gsap.to(ctaBtn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });

      ctaBtn.addEventListener('mousedown', () => {
        gsap.to(ctaBtn, { scale: 0.94, duration: 0.1, ease: 'power2.in' });
      });
      ctaBtn.addEventListener('mouseup', () => {
        gsap.to(ctaBtn, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      });
    }

    // ════════════════════════════════════════════════════════════════
    // HOVER: Platform game items — glow thumbnail
    // ════════════════════════════════════════════════════════════════
    gsap.utils.toArray<HTMLElement>('.about-game-item').forEach((item, i) => {
      const thumb = item.querySelector<HTMLElement>('.relative.h-10');

      item.addEventListener('mouseenter', () => {
        if (thumb) {
          gsap.to(thumb, {
            scale: 1.12, rotation: i % 2 === 0 ? 4 : -4,
            boxShadow: '0 0 0 2px var(--color-accent)',
            duration: 0.25, ease: 'back.out(2)',
          });
        }
      });

      item.addEventListener('mouseleave', () => {
        if (thumb) {
          gsap.to(thumb, {
            scale: 1, rotation: 0,
            boxShadow: '0 0 0 0px transparent',
            duration: 0.35, ease: 'power2.out',
          });
        }
      });
    });

    // ════════════════════════════════════════════════════════════════
    // HOVER: Hero badge — wiggle
    // ════════════════════════════════════════════════════════════════
    const badge = document.querySelector<HTMLElement>('.about-badge');
    if (badge) {
      badge.addEventListener('mouseenter', () => {
        gsap.timeline()
          .to(badge, { rotation: -6, scale: 1.08, duration: 0.12, ease: 'power2.out' })
          .to(badge, { rotation:  6, duration: 0.1, ease: 'power1.inOut' })
          .to(badge, { rotation: -3, duration: 0.08 })
          .to(badge, { rotation:  0, scale: 1, duration: 0.15, ease: 'back.out(1.5)' });
      });
    }
  });

  return null;
}
