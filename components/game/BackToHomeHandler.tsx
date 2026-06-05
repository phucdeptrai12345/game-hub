'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Intercepts the browser Back button on game pages.
 * Instead of slow history.back(), calls router.push('/')
 * which uses Next.js prefetch cache → same speed as clicking the Home link.
 */
export default function BackToHomeHandler() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch home page while user is playing
    router.prefetch('/');

    // Push a dummy state so popstate fires when back is pressed
    window.history.pushState(null, '');

    function onPopState() {
      // Use push (leverages prefetch cache) instead of back (doesn't)
      router.push('/');
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [router]);

  return null;
}
