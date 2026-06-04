'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, LOCALES, type Locale } from '@/lib/i18n';

const STORAGE_KEY = 'gz-lang';

// Languages where Russo One lacks glyphs — use Nunito for display text
const NON_LATIN_LOCALES = new Set(['vi', 'zh', 'ja']);

function applyLocale(l: string) {
  document.documentElement.lang = l;
  if (NON_LATIN_LOCALES.has(l)) {
    document.documentElement.setAttribute('data-locale-script', 'non-latin');
  } else {
    document.documentElement.removeAttribute('data-locale-script');
  }
}

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nCtx>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Language switching disabled — always use English
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    applyLocale('en');
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      applyLocale(l);
    } catch {}
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    return translations[locale]?.[key]
      ?? translations.en[key]
      ?? fallback
      ?? key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
