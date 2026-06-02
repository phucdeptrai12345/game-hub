import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact - GameZone',
  description:
    'Contact GameZone for broken games, catalog feedback, rights requests, partnerships, or general questions.',
};

const TOPICS = [
  {
    label: 'Broken game',
    title: 'A game will not load',
    text: 'Send the game name, page URL, browser, device, and what you see on screen.',
  },
  {
    label: 'Catalog',
    title: 'Suggest or fix a game',
    text: 'Found a better source, wrong category, missing image, or a game we should add? Point us to it.',
  },
  {
    label: 'Safety',
    title: 'Report content',
    text: 'Tell us if a game looks inappropriate, harmful, misleading, or not suitable for its category.',
  },
  {
    label: 'Rights',
    title: 'Removal or ownership request',
    text: 'Developers and rights holders can send the game URL, claim details, and preferred next step.',
  },
  {
    label: 'Business',
    title: 'Ads and partnerships',
    text: 'For ad placements, distribution, or partnership ideas, include your website and proposal.',
  },
  {
    label: 'Product',
    title: 'Feedback for the site',
    text: 'Navigation, search, categories, kids site, game player, or UI ideas are welcome.',
  },
];

const MESSAGE_TIPS = [
  'Game title or page link',
  'Browser and device',
  'Screenshot or short screen recording if useful',
  'What you expected to happen',
  'What happened instead',
];

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="m22 8-10 6L2 8" />
    </svg>
  );
}

function TopicCard({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <article className="rounded-[26px] border border-border bg-surface p-6 shadow-[0_18px_42px_oklch(18%_0.02_250/0.08)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-accent/40">
      <p className="mb-4 text-xs font-black uppercase tracking-wide text-accent">{label}</p>
      <h2 className="text-2xl font-black leading-tight text-fg title-display">{title}</h2>
      <p className="mt-3 text-sm font-semibold leading-7 text-muted">{text}</p>
    </article>
  );
}

function SideBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_18px_42px_oklch(18%_0.02_250/0.08)]">
      <h2 className="text-lg font-black text-fg title-display">{title}</h2>
      <div className="mt-4 text-sm font-semibold leading-7 text-muted">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const mailSubject = 'GameZone contact';

  return (
    <div className="home-pattern min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
      <section className="relative overflow-hidden rounded-[34px] border border-border bg-surface px-6 py-10 shadow-[0_24px_60px_oklch(18%_0.02_250/0.10)] sm:px-8 lg:px-10">
        <div
          className="absolute right-[-8%] top-[-20%] h-[145%] w-[38%] rotate-[-12deg] bg-accent/12"
          aria-hidden="true"
          style={{ clipPath: 'polygon(18% 0, 100% 0, 82% 100%, 0 82%)' }}
        />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-accent">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Contact GameZone
            </p>
            <h1 className="max-w-5xl text-5xl font-black uppercase leading-none text-fg title-display sm:text-6xl lg:text-7xl">
              Tell us what needs attention.
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-bold leading-8 text-muted">
              Broken game, catalog issue, rights request, partnership idea, or general feedback:
              send the details and we will route it to the right place.
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-background/78 p-5 backdrop-blur">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_12px_24px_oklch(63%_0.26_28/0.22)]">
              <MailIcon />
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-wide text-accent">Email</p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}`}
              className="mt-1 block break-all text-xl font-black text-fg title-display transition-colors hover:text-accent"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 text-sm font-bold leading-7 text-muted">
              We read incoming messages and usually reply within 1-3 business days. Complex rights or partnership requests may take longer.
            </p>
          </aside>
        </div>
      </section>

      <main className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-accent">What to send</p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-fg title-display sm:text-4xl">
                Choose the closest topic.
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TOPICS.map((topic) => (
              <TopicCard key={topic.title} {...topic} />
            ))}
          </div>

          <section className="mt-6 rounded-[30px] border border-border bg-[oklch(15%_0.035_276)] p-7 text-white shadow-[0_24px_60px_oklch(8%_0.02_276/0.20)]">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-accent">Ready to send?</p>
                <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight title-display">
                  A clear message gets fixed faster.
                </h2>
                <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-white/74">
                  Include the game page, what happened, and the device or browser you used. If it is a rights request,
                  include the ownership details and the action you are asking for.
                </p>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}`}
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-black text-white transition-colors hover:bg-accent-hover"
              >
                Send email
              </a>
            </div>
          </section>
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
          <SideBlock title="Helpful details">
            <ul className="space-y-2.5">
              {MESSAGE_TIPS.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </SideBlock>

          <SideBlock title="Related pages">
            <div className="grid gap-2">
              <Link href="/about" className="rounded-xl border border-border bg-background px-4 py-3 font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
                About GameZone
              </Link>
              <Link href="/privacy" className="rounded-xl border border-border bg-background px-4 py-3 font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
                Privacy Policy
              </Link>
              <Link href="/terms" className="rounded-xl border border-border bg-background px-4 py-3 font-black text-fg transition-colors hover:border-accent/40 hover:text-accent">
                Terms of Use
              </Link>
            </div>
          </SideBlock>
        </aside>
      </main>
    </div>
  );
}
