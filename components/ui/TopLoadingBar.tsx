'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';

const MIN_ROUTE_LOADER_MS = 200;
const IMAGE_WAIT_TIMEOUT_MS = 400;
const MAX_ROUTE_IMAGES = 12;

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

  function reset() {
    clear();
    activeRef.current = false;
    doneRef.current = true;
    setVisible(false);
    setWidth(0);
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

  // Intercept in-app link clicks to start bar. Browser Back/Forward should stay
  // native-fast because those paths are usually restored from the browser cache.
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
    window.addEventListener('pageshow', reset);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', reset);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading page"
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] h-[2px] pointer-events-none"
      style={{
        width: `${width}%`,
        transition: width === 100 ? 'width 0.2s ease-out' : 'width 0.4s ease-out',
        background: 'var(--color-accent)',
        boxShadow: '0 0 8px var(--color-accent)',
      }}
    />
  );
}

export default function TopLoadingBar() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
