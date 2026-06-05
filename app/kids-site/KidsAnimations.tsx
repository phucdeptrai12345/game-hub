'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FloatConfig = { y: number; rot: number; duration: number; delay: number };

function startFloat(el: HTMLElement, cfg: FloatConfig): gsap.core.Tween {
  return gsap.to(el, {
    y: cfg.y,
    rotation: cfg.rot,
    duration: cfg.duration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: cfg.delay,
  });
}

function playHoverAnim(el: HTMLElement, onDone: () => void) {
  const tl = gsap.timeline({ onComplete: onDone });
  const has = (c: string) => el.classList.contains(c);

  if (has('kids-hover-spin')) {
    // Star: full 360° spin
    tl.to(el, { rotation: '+=360', scale: 1.25, duration: 0.45, ease: 'power2.inOut' })
      .to(el, { scale: 1, duration: 0.2, ease: 'back.out(2)' });

  } else if (has('kids-hover-shake')) {
    // Gamepad: rapid side-to-side shake
    tl.to(el, { x: -10, rotation: -12, scale: 1.1, duration: 0.07, ease: 'power1.inOut' })
      .to(el, { x: 10, rotation: 12, duration: 0.07, ease: 'power1.inOut' })
      .to(el, { x: -7, rotation: -8, duration: 0.06, ease: 'power1.inOut' })
      .to(el, { x: 7, rotation: 8, duration: 0.06, ease: 'power1.inOut' })
      .to(el, { x: -4, rotation: -4, duration: 0.06, ease: 'power1.inOut' })
      .to(el, { x: 0, rotation: 0, scale: 1, duration: 0.12, ease: 'power2.out' });

  } else if (has('kids-hover-launch')) {
    // Rocket: shoot up then fall back with bounce
    tl.to(el, { y: -28, scale: 1.2, rotation: -5, duration: 0.22, ease: 'power3.out' })
      .to(el, { y: 0, scale: 1, rotation: 0, duration: 0.55, ease: 'bounce.out' });

  } else if (has('kids-hover-sway')) {
    // Rainbow: gentle sway left-right
    tl.to(el, { rotation: 18, scale: 1.1, duration: 0.18, ease: 'power1.out' })
      .to(el, { rotation: -18, duration: 0.22, ease: 'power1.inOut' })
      .to(el, { rotation: 10, duration: 0.16, ease: 'power1.inOut' })
      .to(el, { rotation: 0, scale: 1, duration: 0.18, ease: 'back.out(1.5)' });

  } else if (has('kids-hover-pulse')) {
    // Heart: pump 2×
    tl.to(el, { scale: 1.35, duration: 0.18, ease: 'power2.out' })
      .to(el, { scale: 1.0, duration: 0.13, ease: 'power2.in' })
      .to(el, { scale: 1.2, duration: 0.14, ease: 'power2.out' })
      .to(el, { scale: 1.0, duration: 0.13, ease: 'power2.in' });

  } else if (has('kids-hover-bounce')) {
    // Crown: arc up and bounce landing
    tl.to(el, { y: -22, scale: 1.15, rotation: 8, duration: 0.22, ease: 'power2.out' })
      .to(el, { y: 0, scale: 1, rotation: 0, duration: 0.5, ease: 'bounce.out' });

  } else {
    tl.to(el, { scale: 1.2, duration: 0.15, ease: 'back.out(2)' })
      .to(el, { scale: 1, duration: 0.15, ease: 'power2.out' });
  }
}

export default function KidsAnimations() {
  useGSAP(() => {
    // ── Logo mark: pop-in + hover wiggle ───────────────────────────────
    const logoMark = document.querySelector<HTMLElement>('.kids-logo-mark');

    gsap.from('.kids-logo-mark', {
      scale: 0,
      rotation: -20,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(2.2)',
      immediateRender: false,
      clearProps: 'scale,rotation,opacity',
    });

    gsap.from('.kids-logo-small, .kids-logo-word', {
      y: 16,
      opacity: 0,
      duration: 0.5,
      delay: 0.25,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      immediateRender: false,
      clearProps: 'y,opacity',
    });

    if (logoMark) {
      logoMark.style.cursor = 'pointer';
      logoMark.addEventListener('mouseenter', () => {
        gsap.killTweensOf(logoMark);
        const tl = gsap.timeline();
        tl.to(logoMark, { rotation: -15, scale: 1.2, duration: 0.14, ease: 'power2.out' })
          .to(logoMark, { rotation: 12, duration: 0.11, ease: 'power2.inOut' })
          .to(logoMark, { rotation: -6, duration: 0.1, ease: 'power2.inOut' })
          .to(logoMark, { rotation: 0, scale: 1, duration: 0.18, ease: 'back.out(1.7)' });
      });
    }

    // ── Doodles: pop-in → idle float → hover animations ────────────────
    const doodles = gsap.utils.toArray<HTMLElement>('.kids-doodle');
    const floatCfgs: FloatConfig[] = doodles.map((_, i) => ({
      y: -(7 + (i % 3) * 4),
      rot: i % 2 === 0 ? 6 : -6,
      duration: 1.6 + i * 0.22,
      delay: i * 0.12,
    }));

    // Store active float tweens so hover can kill & restart them
    const floatTweens: (gsap.core.Tween | null)[] = doodles.map(() => null);

    gsap.from(doodles, {
      scale: 0,
      rotation: (i) => (i % 2 === 0 ? -28 : 28),
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      delay: 0.1,
      ease: 'back.out(2)',
      immediateRender: false,
      clearProps: 'scale,rotation,opacity',
      onComplete: () => {
        doodles.forEach((el, i) => {
          floatTweens[i] = startFloat(el, floatCfgs[i]);
        });
      },
    });

    doodles.forEach((el, i) => {
      el.addEventListener('mouseenter', () => {
        floatTweens[i]?.kill();
        floatTweens[i] = null;
        gsap.killTweensOf(el);
        playHoverAnim(el, () => {
          floatTweens[i] = startFloat(el, { ...floatCfgs[i], delay: 0 });
        });
      });
    });

    // ── Play button: elastic bounce ─────────────────────────────────────
    gsap.from('.kids-play-button', {
      scale: 0,
      opacity: 0,
      duration: 0.85,
      delay: 0.55,
      ease: 'elastic.out(1, 0.5)',
      immediateRender: false,
      clearProps: 'scale,opacity',
    });

    // ── Section headings: slide in on scroll ───────────────────────────
    gsap.utils.toArray<HTMLElement>('.kids-section h2').forEach((el) => {
      gsap.from(el, {
        x: -40,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    // ── Game tiles: batch stagger reveal ───────────────────────────────
    ScrollTrigger.batch('.kids-game-tile', {
      start: 'top 93%',
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          y: 24,
          scale: 0.96,
          duration: 0.45,
          stagger: 0.05,
          ease: 'back.out(1.5)',
          overwrite: true,
        });
      },
      once: true,
    });

    // ── Parent note: fade up ────────────────────────────────────────────
    gsap.from('.kids-parent-note', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.kids-parent-note',
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  return null;
}
