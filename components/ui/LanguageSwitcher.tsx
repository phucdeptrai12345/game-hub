'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/components/providers/I18nProvider';
import { LOCALES, LANGUAGE_META, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const current = LANGUAGE_META[locale];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="active-click flex h-9 items-center gap-1.5 rounded-full border border-border bg-navy px-2.5 text-xs font-black text-fg shadow-[inset_0_1px_3px_oklch(10%_0.01_250/0.06)] transition-colors duration-150 hover:bg-navy-light sm:h-10 sm:px-3"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <svg
          className={`h-3 w-3 shrink-0 text-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="settings-panel absolute right-0 top-full z-[120] mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_14px_40px_oklch(10%_0.01_250/0.18)]"
        >
          {LOCALES.map((code) => {
            const meta = LANGUAGE_META[code];
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLocale(code as Locale);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors duration-100 hover:bg-navy active-click ${
                  active ? 'text-accent' : 'text-fg'
                }`}
              >
                <span className="text-base leading-none">{meta.flag}</span>
                <span className="flex-1 text-left">{meta.label}</span>
                {active && (
                  <svg className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
