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

export default function TermsPage() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <div className="mx-auto max-w-[1500px]">

        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-5 w-1 rounded-full bg-accent" aria-hidden="true" />
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">Legal</p>
          </div>
          <h1 className="text-4xl font-black text-fg title-display uppercase tracking-tight sm:text-5xl leading-[0.95]">Terms of Use</h1>
          <p className="text-muted text-sm font-semibold mt-3">Last updated: {LAST_UPDATED}</p>
        </header>

        {/* Summary box */}
        <div className="mb-10 border-l-4 border-accent bg-navy px-6 py-5">
          <p className="mb-4 text-sm font-semibold leading-7 text-muted">
            GameZone is made for quick browser play. These terms explain what is allowed,
            what is not allowed, and how third-party games, ads, and links fit into the site.
          </p>
          <ul className="space-y-2">
            {QUICK_RULES.map((rule) => (
              <li key={rule} className="flex gap-3 text-sm font-bold text-fg">
                <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">{'->'}</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Document body */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 xl:gap-16 lg:items-start">
          <article>
            <Section eyebrow="01" title="Using GameZone means accepting these terms">
              <p>
                By visiting, browsing, or playing on GameZone, you agree to these Terms of Use and our{' '}
                <Link href="/privacy" className="font-bold text-accent hover:underline">
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

            <Section eyebrow="09" title="Contact and takedown requests">
              <p>
                For legal questions, game removal requests, bug reports, or partnership questions, contact us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>{' '}
                or use the contact page.
              </p>
              <p>
                Include enough detail for us to understand the issue, such as the game title, URL, rights claim,
                screenshot, or technical error.
              </p>
            </Section>
          </article>

          {/* Sticky sidebar — desktop only */}
          <aside className="hidden lg:block sticky top-24 space-y-1">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted/50">
              Related
            </p>
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/contact', label: 'Contact us' },
              { href: '/games', label: 'Browse games' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-navy hover:text-fg"
              >
                {label}
                <svg className="w-3 h-3 shrink-0 text-muted/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
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
