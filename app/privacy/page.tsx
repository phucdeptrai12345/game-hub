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
  'Favorites, recent games, theme, and consent stay in your browser.',
  'Game providers and ad partners may use their own cookies or similar technology.',
  'You can clear browser storage or change cookie settings at any time.',
];

function Section({
  title,
  eyebrow,
  children,
  wide = false,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <article
      className={`rounded-[26px] border border-border bg-surface p-6 shadow-[0_18px_42px_oklch(18%_0.02_250/0.08)] ${
        wide ? 'lg:col-span-2' : ''
      }`}
    >
      <p className="mb-3 text-xs font-black uppercase tracking-wide text-accent">{eyebrow}</p>
      <h2 className="mb-4 text-2xl font-black leading-tight text-fg title-display">{title}</h2>
      <div className="space-y-4 text-[0.98rem] font-semibold leading-8 text-muted">{children}</div>
    </article>
  );
}

export default function PrivacyPage() {
  return (
    <div className="home-pattern min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
      <section className="relative overflow-hidden rounded-[34px] border border-border bg-surface px-6 py-10 shadow-[0_24px_60px_oklch(18%_0.02_250/0.10)] sm:px-8 lg:px-10">
        <div
          className="absolute right-[-8%] top-[-20%] h-[145%] w-[38%] rotate-[-12deg] bg-accent/12"
          aria-hidden="true"
          style={{ clipPath: 'polygon(18% 0, 100% 0, 82% 100%, 0 82%)' }}
        />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-accent">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Privacy at GameZone
            </p>
            <h1 className="max-w-5xl text-5xl font-black uppercase leading-none text-fg title-display sm:text-6xl lg:text-7xl">
              Play first. Sign-up never.
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-bold leading-8 text-muted">
              GameZone is built so you can open a browser game without creating an account.
              This page explains what the site needs to remember, what third-party games and ads may load,
              and how you can control those choices.
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-background/78 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide text-accent">Last updated</p>
            <p className="mt-1 text-lg font-black text-fg title-display">{LAST_UPDATED}</p>
            <div className="mt-5 space-y-2.5">
              {QUICK_POINTS.map((point) => (
                <p key={point} className="flex gap-2 text-sm font-bold leading-6 text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {point}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <main className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6 lg:grid-cols-2">
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

          <Section eyebrow="05" title="Ads, cookies, and similar technology" wide>
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
                className="font-black text-accent hover:underline"
              >
                Google Ads Settings
              </a>
              . You can also use industry opt-out tools such as{' '}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-accent hover:underline"
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

          <Section eyebrow="08" title="Your controls" wide>
            <p>
              You can clear GameZone preferences by clearing browser storage for this site. You can block or delete
              cookies through your browser settings, and you can use ad preference tools from Google or industry
              opt-out programs.
            </p>
            <p>
              For privacy questions, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-black text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
              . We may update this policy as the site changes; the updated date will stay visible on this page.
            </p>
          </Section>
        </div>

        <aside className="h-fit rounded-[26px] border border-border bg-surface p-5 shadow-[0_18px_42px_oklch(18%_0.02_250/0.08)] lg:sticky lg:top-24">
          <p className="text-sm font-black uppercase tracking-wide text-accent">Useful links</p>
          <div className="mt-4 grid gap-2">
            <Link href="/terms" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
              Terms of Use
            </Link>
            <Link href="/contact" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
              Contact GameZone
            </Link>
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
              Google ads info
            </a>
          </div>
          <p className="mt-5 text-xs font-bold leading-6 text-muted">
            This page is written to be readable. It is not a substitute for legal advice for your own situation.
          </p>
        </aside>
      </main>
    </div>
  );
}
