'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'gz_ads_consent';
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type Consent = 'accepted' | 'declined' | 'unknown';

function loadAdSense() {
  if (!ADSENSE_CLIENT || document.querySelector('script[data-gz-adsense="true"]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.dataset.gzAdsense = 'true';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.addEventListener('load', () => {
    window.dispatchEvent(new CustomEvent('gz-adsense-ready'));
  });
  document.head.appendChild(script);
}

export default function ConsentManager() {
  const [consent, setConsent] = useState<Consent>('unknown');

  useEffect(() => {
    if (!ADSENSE_CLIENT) return;

    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === 'accepted' || saved === 'declined') {
      setConsent(saved);
      if (saved === 'accepted') loadAdSense();
    }
  }, []);

  function choose(next: Exclude<Consent, 'unknown'>) {
    localStorage.setItem(CONSENT_KEY, next);
    setConsent(next);
    window.dispatchEvent(new CustomEvent('gz-ads-consent-change', { detail: next }));
    if (next === 'accepted') loadAdSense();
  }

  if (!ADSENSE_CLIENT || consent !== 'unknown') return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-border bg-surface/96 p-4 shadow-[0_18px_48px_oklch(8%_0.01_250/0.22)] backdrop-blur-md sm:bottom-5 sm:flex sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-fg">Ads and privacy</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-muted">
          We use ads to keep GameZone free. With your consent, Google may use cookies or similar
          storage for personalized ads. You can decline and still play.
          {' '}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => choose('declined')}
          className="rounded-full border border-border bg-navy px-4 py-2 text-xs font-black text-muted transition-colors hover:text-fg"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="rounded-full bg-accent px-4 py-2 text-xs font-black text-white transition-colors hover:bg-accent-hover"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
