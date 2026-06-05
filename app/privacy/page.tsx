import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy - GameZone',
  description:
    'How GameZone handles browser storage, ads, third-party games, and privacy choices.',
};

const LAST_UPDATED = 'June 2026';

const QUICK_POINTS = [
  'You can play without an account.',
  'Favorites, recent games, theme, and consent stay in your browser only.',
  'Game providers and ad partners may use their own cookies or similar technology.',
  'You can clear browser storage or change cookie settings at any time.',
];

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <section className="border-t border-border/60 py-10 grid grid-cols-[48px_1fr] gap-6 sm:grid-cols-[64px_1fr] sm:gap-8">
      <div className="pt-1">
        <span className="text-4xl font-black text-accent/20 title-display leading-none">{eyebrow}</span>
      </div>
      <div>
        <h2 className="text-xl font-black text-fg title-display uppercase tracking-tight mb-4">{title}</h2>
        <div className="space-y-3 text-[0.96rem] font-semibold leading-[1.85] text-muted">{children}</div>
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <div className="mx-auto max-w-[1500px]">

        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-5 w-1 rounded-full bg-accent" aria-hidden="true" />
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">Legal</p>
          </div>
          <h1 className="text-4xl font-black text-fg title-display uppercase tracking-tight sm:text-5xl leading-[0.95]">Privacy Policy</h1>
          <p className="text-muted text-sm font-semibold mt-3">Last updated: {LAST_UPDATED}</p>
        </header>

        {/* Summary box */}
        <div className="mb-10 border-l-4 border-accent bg-navy px-6 py-5">
          <p className="mb-4 text-sm font-semibold leading-7 text-muted">
            GameZone is built so you can open a browser game without creating an account.
            This page explains what the site needs to remember, what third-party games and ads may load,
            and how you can control those choices.
          </p>
          <ul className="space-y-2">
            {QUICK_POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-sm font-bold text-fg">
                <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">{'->'}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Document body */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 xl:gap-16 lg:items-start">
          <article>
            <Section eyebrow="01" title="What we do not ask for">
              <p>
                GameZone does not require an account to play. We do not ask for your name, email address,
                password, profile photo, or payment details just to use the site.
              </p>
              <p>
                If you contact us directly, we receive whatever information you choose to send in that message,
                such as your email address and the content of your request.
              </p>
            </Section>

            <Section eyebrow="02" title="Basic technical data">
              <p>
                Like most websites, our hosting provider may process standard server log information:
                IP address, browser type, device type, referring page, pages visited, timestamps, and error logs.
              </p>
              <p>
                We use this for security, troubleshooting, performance monitoring, and keeping the site reliable.
              </p>
            </Section>

            <Section eyebrow="03" title="What stays in your browser">
              <p>
                Favorites, recently played games, light or dark mode, loading preferences, and advertising consent
                are stored locally in your browser. This helps the site feel familiar when you come back.
              </p>
              <p>
                This browser storage is not an account. Clearing site data in your browser will remove it.
              </p>
            </Section>

            <Section eyebrow="04" title="Third-party games">
              <p>
                Games are provided by outside developers and game distribution platforms such as Famobi,
                GamePix, GameDistribution, and GameMonetize. When a game loads, your browser may connect to the
                provider that hosts it.
              </p>
              <p>
                Those providers may process technical information needed to deliver the game, keep it running,
                show in-game content, or apply their own privacy and terms rules.
              </p>
            </Section>

            <Section eyebrow="05" title="Ads, cookies, and similar technology">
              <p>
                GameZone is free to use and may be supported by advertising. Google, ad networks, or other ad
                technology vendors may use cookies, local storage, pixels, IP address, browser information, or
                similar identifiers to serve ads, measure ads, limit repeated ads, detect fraud, and personalize
                ads where allowed.
              </p>
              <p>
                Third-party vendors, including Google, may use cookies to serve ads based on your prior visits to
                GameZone or other websites. Google advertising cookies let Google and its partners serve ads based
                on visits to this site and other sites on the Internet.
              </p>
              <p>
                You can manage Google personalized ads in{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-accent hover:underline"
                >
                  Google Ads Settings
                </a>
                . You can also use industry opt-out tools such as{' '}
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-accent hover:underline"
                >
                  aboutads.info
                </a>{' '}
                or adjust cookie controls in your browser.
              </p>
            </Section>

            <Section eyebrow="06" title="Consent choices">
              <p>
                Where consent is required, we ask before loading advertising scripts or personalized ad features.
                If you decline, games should remain playable, but ad boxes may stay empty or show placeholders.
              </p>
              <p>
                Browser-level cookie blocking can also affect some games, ad measurement, or embedded content.
              </p>
            </Section>

            <Section eyebrow="07" title="Kids and younger players">
              <p>
                GameZone is a general-audience games site with a separate For Kids area. We do not knowingly collect
                personal information from children under 13.
              </p>
              <p>
                Younger players should use the site with a parent or guardian. If you believe a child has sent us
                personal information, contact us and we will handle the request promptly.
              </p>
            </Section>

            <Section eyebrow="08" title="Your controls">
              <p>
                You can clear GameZone preferences by clearing browser storage for this site. You can block or delete
                cookies through your browser settings, and you can use ad preference tools from Google or industry
                opt-out programs.
              </p>
              <p>
                For privacy questions, contact us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>
                . We may update this policy as the site changes; the updated date will stay visible on this page.
              </p>
            </Section>
          </article>

          {/* Sticky sidebar — desktop only */}
          <aside className="hidden lg:block sticky top-24 space-y-1">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted/50">
              Related
            </p>
            {[
              { href: '/terms', label: 'Terms of Use' },
              { href: '/contact', label: 'Contact us' },
              { href: 'https://adssettings.google.com/', label: 'Google Ads settings', external: true },
              { href: 'https://optout.aboutads.info/', label: 'Ad opt-out', external: true },
            ].map(({ href, label, external }) => (
              <a
                key={href}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-navy hover:text-fg"
              >
                {label}
                <svg className="w-3 h-3 shrink-0 text-muted/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            ))}
            <p className="mt-4 px-3 text-xs font-semibold leading-5 text-muted/50">
              Not a substitute for legal advice.
            </p>
          </aside>
        </div>

      </div>
    </div>
  );
}
