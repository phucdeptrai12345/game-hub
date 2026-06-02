'use client';

import { useEffect, useState } from 'react';

interface Props {
  slot: string;
  variant?: 'leaderboard' | 'infeed' | 'rectangle';
  className?: string;
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const CONSENT_KEY = 'gz_ads_consent';

const AD_SLOT_IDS: Record<string, string | undefined> = {
  'home-top-leaderboard': process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP_LEADERBOARD,
  'home-after-popular': process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_AFTER_POPULAR,
  'home-category-3': process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_CATEGORY_3,
  'home-category-6': process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_CATEGORY_6,
  'home-before-footer': process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BEFORE_FOOTER,
  'game-below-player': process.env.NEXT_PUBLIC_ADSENSE_SLOT_GAME_BELOW_PLAYER,
  'game-side-top': process.env.NEXT_PUBLIC_ADSENSE_SLOT_GAME_SIDE_TOP,
  'game-side-bottom': process.env.NEXT_PUBLIC_ADSENSE_SLOT_GAME_SIDE_BOTTOM,
  'game-before-more': process.env.NEXT_PUBLIC_ADSENSE_SLOT_GAME_BEFORE_MORE,
};

const variantClass = {
  leaderboard: 'min-h-[90px]',
  infeed: 'min-h-[120px]',
  rectangle: 'min-h-[250px]',
};

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdSlot({ slot, variant = 'leaderboard', className = '' }: Props) {
  const [adsConsent, setAdsConsent] = useState(false);
  const resolvedSlot = AD_SLOT_IDS[slot] || (/^\d+$/.test(slot) ? slot : undefined);
  const canRenderAd = Boolean(ADSENSE_CLIENT && resolvedSlot && adsConsent);

  useEffect(() => {
    const sync = () => setAdsConsent(localStorage.getItem(CONSENT_KEY) === 'accepted');
    const onConsentChange = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      setAdsConsent(next === 'accepted');
    };

    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('gz-ads-consent-change', onConsentChange);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('gz-ads-consent-change', onConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!canRenderAd) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [canRenderAd, resolvedSlot]);

  return (
    <aside
      className={`ad-slot ${variantClass[variant]} ${className}`}
      aria-label="Advertisement"
      data-ad-slot={slot}
    >
      {canRenderAd ? (
        <ins
          className="adsbygoogle block h-full w-full"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={resolvedSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex h-full min-h-[inherit] items-center justify-center px-4 text-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted">
              Advertisement
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
