import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Use - GameZone',
  description:
    'Plain-language terms for using GameZone, playing third-party browser games, and contacting us.',
};

const LAST_UPDATED = 'June 2026';

const QUICK_RULES = [
  'Use GameZone for personal play and discovery.',
  'Do not copy, scrape, attack, or overload the site.',
  'Games belong to their developers and publishers.',
  'Third-party games and ads may have their own rules.',
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

export default function TermsPage() {
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
              Terms of Use
            </p>
            <h1 className="max-w-5xl text-5xl font-black uppercase leading-none text-fg title-display sm:text-6xl lg:text-7xl">
              Simple rules for a free games site.
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-bold leading-8 text-muted">
              GameZone is made for quick browser play. These terms explain what is allowed,
              what is not allowed, and how third-party games, ads, and links fit into the site.
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-background/78 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide text-accent">Last updated</p>
            <p className="mt-1 text-lg font-black text-fg title-display">{LAST_UPDATED}</p>
            <div className="mt-5 space-y-2.5">
              {QUICK_RULES.map((rule) => (
                <p key={rule} className="flex gap-2 text-sm font-bold leading-6 text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {rule}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <main className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6 lg:grid-cols-2">
          <Section eyebrow="01" title="Using GameZone means accepting these terms" wide>
            <p>
              By visiting, browsing, or playing on GameZone, you agree to these Terms of Use and our{' '}
              <Link href="/privacy" className="font-black text-accent hover:underline">
                Privacy Policy
              </Link>
              . If you do not agree, please stop using the site.
            </p>
            <p>
              We may update these terms when the site changes. The updated date will be shown on this page.
              Continued use after an update means the new terms apply.
            </p>
          </Section>

          <Section eyebrow="02" title="What you can do">
            <p>
              You can browse the catalog, play games for personal entertainment, save favorites in your browser,
              come back to recently played games, and share links to GameZone pages.
            </p>
            <p>
              You may use the site on devices you own or control, including computer, tablet, and mobile.
            </p>
          </Section>

          <Section eyebrow="03" title="What you cannot do">
            <p>
              Do not scrape, copy, mirror, redistribute, or sell GameZone data, page layouts, game listings,
              images, or embedded game content without permission.
            </p>
            <p>
              Do not attack, overload, reverse engineer, bypass security, inject code, distribute malware,
              impersonate GameZone, or use bots in a way that damages the site or affects other players.
            </p>
          </Section>

          <Section eyebrow="04" title="Games belong to their owners">
            <p>
              GameZone owns its own branding, layout, text, and original site elements. Third-party browser games,
              game names, thumbnails, characters, and in-game content remain owned by their developers,
              publishers, or distribution platforms.
            </p>
            <p>
              We do not claim ownership of third-party games. If you are a rights holder and believe something
              should be removed or corrected, contact us so we can review it.
            </p>
          </Section>

          <Section eyebrow="05" title="Third-party games, ads, and links">
            <p>
              GameZone embeds games and services from outside providers. A game may load assets, scripts,
              ads, analytics, or settings from the provider that hosts it. Those providers may have their own
              terms and privacy policies.
            </p>
            <p>
              We may also link to external sites for ads, game providers, support pages, opt-out tools, or
              references. We are not responsible for content, policies, or availability on websites we do not control.
            </p>
          </Section>

          <Section eyebrow="06" title="Catalog quality and availability">
            <p>
              We try to keep the catalog playable, clean, and properly categorized, but browser games can change,
              move, break, or be removed by their providers. Some games may also behave differently depending on
              device, browser, network, region, or cookie settings.
            </p>
            <p>
              If a game is broken, inappropriate, or incorrectly listed, tell us and we will review it.
            </p>
          </Section>

          <Section eyebrow="07" title="Younger players">
            <p>
              GameZone is a general-audience site with many quick browser games and a separate For Kids area.
              Some games outside the kids area may include cartoon action, competition, or mild game violence.
            </p>
            <p>
              Parents and guardians should guide younger players and choose games that fit their age and comfort level.
            </p>
          </Section>

          <Section eyebrow="08" title="No promise that everything will be perfect">
            <p>
              GameZone is provided as it is and as available. We do not promise that every page, game, ad, search
              result, feature, or third-party embed will always be uninterrupted, error-free, accurate, secure,
              or available in every location.
            </p>
            <p>
              To the fullest extent allowed by law, GameZone and its operators are not responsible for indirect,
              incidental, special, consequential, or punitive damages connected to use of the site or third-party content.
            </p>
          </Section>

          <Section eyebrow="09" title="Contact and takedown requests" wide>
            <p>
              For legal questions, game removal requests, bug reports, or partnership questions, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-black text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>{' '}
              or use the contact page.
            </p>
            <p>
              Include enough detail for us to understand the issue, such as the game title, URL, rights claim,
              screenshot, or technical error.
            </p>
          </Section>
        </div>

        <aside className="h-fit rounded-[26px] border border-border bg-surface p-5 shadow-[0_18px_42px_oklch(18%_0.02_250/0.08)] lg:sticky lg:top-24">
          <p className="text-sm font-black uppercase tracking-wide text-accent">Useful links</p>
          <div className="mt-4 grid gap-2">
            <Link href="/privacy" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/contact" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
              Contact GameZone
            </Link>
            <Link href="/games" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
              Browse games
            </Link>
          </div>
          <p className="mt-5 text-xs font-bold leading-6 text-muted">
            These terms are written to be readable. They are not a substitute for legal advice for your own situation.
          </p>
        </aside>
      </main>
    </div>
  );
}
