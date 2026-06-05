'use client';

/**
 * Defers rendering of below-fold content until after the initial paint.
 * When navigating back, above-fold content appears instantly while
 * below-fold sections mount in the next frame — avoiding a "frozen" page.
 */
import { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function DeferredSection({ children, fallback = null }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for the first paint, then schedule below-fold render
    const raf = requestAnimationFrame(() => {
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return ready ? <>{children}</> : <>{fallback}</>;
}
