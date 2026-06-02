'use client';

import { useEffect } from 'react';

export default function AboutReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.about-reveal-item'));
    if (items.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('about-reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target as HTMLElement;
          const index = items.indexOf(item);
          window.setTimeout(() => {
            item.classList.add('about-reveal-visible');
          }, Math.max(index, 0) * 120);
          observer.unobserve(item);
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -12% 0px',
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return null;
}
