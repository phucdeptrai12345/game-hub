'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function KidsAnimations() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // --- Doodle icons: stagger pop-in with spring-like scale + rotation ---
      gsap.from('.kids-doodle', {
        scale: 0,
        rotation: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        immediateRender: false,
        clearProps: 'scale,rotation,opacity',
      });

      // --- "Pick your games!" button: bounce in ---
      gsap.from('.kids-play-button', {
        scale: 0,
        opacity: 0,
        duration: 0.7,
        delay: 0.3,
        ease: 'back.out(1.7)',
        immediateRender: false,
        clearProps: 'scale,opacity',
      });

      // --- Kids section headings: slide in on scroll ---
      gsap.utils.toArray<HTMLElement>('.kids-section h2').forEach((heading) => {
        gsap.from(heading, {
          x: -48,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          immediateRender: false,
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // --- Game tiles: ScrollTrigger.batch stagger reveal ---
      gsap.set('.kids-game-tile', { opacity: 0, y: 32 });

      ScrollTrigger.batch('.kids-game-tile', {
        start: 'top 90%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: 'back.out(1.7)',
            overwrite: true,
          });
        },
        once: true,
      });
    },
    { scope: scopeRef }
  );

  // Render nothing visible — this component exists only for side-effects.
  return <div ref={scopeRef} style={{ position: 'absolute', pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" />;
}
