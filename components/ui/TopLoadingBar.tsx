'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';

const MIN_ROUTE_LOADER_MS = 850;
const IMAGE_WAIT_TIMEOUT_MS = 1200;
const MAX_ROUTE_IMAGES = 72;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function isNearViewport(img: HTMLImageElement) {
  const rect = img.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  return rect.top < window.innerHeight * 1.8 && rect.bottom > -window.innerHeight * 0.4;
}

async function waitForImageReady(img: HTMLImageElement) {
  const src = img.currentSrc || img.src;
  if (!src) return;

  img.loading = 'eager';
  img.decoding = 'async';
  if ('fetchPriority' in img) {
    (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = 'high';
  }

  if (!img.complete || img.naturalWidth === 0) {
    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        resolve();
      };

      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });

      const preloader = new window.Image();
      preloader.decoding = 'async';
      preloader.onload = done;
      preloader.onerror = done;
      preloader.src = src;
      if (preloader.complete) done();
    });
  }

  if (img.decode) {
    await img.decode().catch(() => {});
  }
}

async function waitForGameCardImages() {
  await nextFrame();

  const imageSelectors = [
    '#main-content .game-card img',
    '#main-content .game-card-thumb',
    '#main-content .recently-game-item img',
    '#main-content .hero-game-tile img',
    '#main-content .grid-poki img',
    '#main-content .grid-standard img',
  ].join(',');

  const seen = new Set<string>();
  const images = Array.from(document.querySelectorAll<HTMLImageElement>(imageSelectors))
    .filter((img) => isNearViewport(img))
    .filter((img) => {
      const src = img.currentSrc || img.src;
      if (!src || seen.has(src)) return false;
      seen.add(src);
      return true;
    })
    .slice(0, MAX_ROUTE_IMAGES);

  if (images.length === 0) return;

  await Promise.race([
    Promise.all(images.map(waitForImageReady)).then(() => {}),
    wait(IMAGE_WAIT_TIMEOUT_MS),
  ]);
}

function Bar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const doneRef = useRef(false);
  const activeRef = useRef(false);
  const startedAtRef = useRef(0);
  const runIdRef = useRef(0);

  function clear() {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }

  function start() {
    clear();
    activeRef.current = true;
    doneRef.current = false;
    startedAtRef.current = Date.now();
    runIdRef.current += 1;
    setVisible(true);
    setWidth(0);
    timerRef.current.push(setTimeout(() => setWidth(20), 20));
    timerRef.current.push(setTimeout(() => setWidth(45), 200));
    timerRef.current.push(setTimeout(() => setWidth(65), 600));
    timerRef.current.push(setTimeout(() => setWidth(80), 1200));
    timerRef.current.push(setTimeout(() => setWidth(90), 1900));
  }

  async function finish() {
    if (!activeRef.current) return;
    if (doneRef.current) return;
    const runId = runIdRef.current;
    doneRef.current = true;
    clear();
    setWidth(92);

    const elapsed = Date.now() - startedAtRef.current;
    const minDelay = Math.max(MIN_ROUTE_LOADER_MS - elapsed, 0);
    await Promise.all([wait(minDelay), waitForGameCardImages()]);

    if (runId !== runIdRef.current) return;

    setWidth(100);
    timerRef.current.push(setTimeout(() => {
      activeRef.current = false;
      setVisible(false);
      setWidth(0);
    }, 350));
  }

  // Finish bar when route changes
  useEffect(() => {
    void finish();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept link clicks to start bar
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest('a');
      if (!a || !a.href) return;
      try {
        const dest = new URL(a.href);
        const same = dest.origin === location.origin;
        const blank = a.target === '_blank';
        const changed = dest.pathname !== location.pathname || dest.search !== location.search;
        if (same && !blank && changed) start();
      } catch {}
    }
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', start);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', start);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none"
        style={{
          width: `${width}%`,
          transition: width === 100 ? 'width 0.2s ease-out' : 'width 0.4s ease-out',
          background: 'linear-gradient(90deg, var(--color-accent), oklch(70% 0.22 42))',
          boxShadow: '0 0 10px var(--color-accent), 0 0 4px var(--color-accent)',
        }}
      />

      <div className="route-loading-overlay" role="status" aria-label="Loading page">
        <div className="route-loading-content">
          <div className="route-loading-mark" aria-hidden="true">
            <svg className="route-loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
              <path d="M6 12h4M8 10v4" />
              <circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="18" cy="13.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="route-loading-brand">
            Game<span>Zone</span>
          </div>
          <div className="route-loading-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </>
  );
}

export default function TopLoadingBar() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
