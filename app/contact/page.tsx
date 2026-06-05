import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact - GameZone',
  description:
    'Contact GameZone for broken games, catalog feedback, rights requests, partnerships, or general questions.',
};

const REQUESTS = [
  {
    label: 'Broken game',
    title: 'A game does not load',
    text: 'Send the game link, browser, device, and what happened on screen.',
    subject: 'Broken game report',
  },
  {
    label: 'Catalog fix',
    title: 'Wrong image, category, or source',
    text: 'Tell us what looks off and the page where you found it.',
    subject: 'Catalog correction',
  },
  {
    label: 'Safety',
    title: 'Report unsuitable content',
    text: 'Flag games that feel misleading, harmful, or placed in the wrong area.',
    subject: 'Content report',
  },
  {
    label: 'Rights',
    title: 'Removal or ownership request',
    text: 'Include the game URL, rights details, and the action you want us to take.',
    subject: 'Rights or removal request',
  },
  {
    label: 'Business',
    title: 'Ads, distribution, partnerships',
    text: 'Share your site, company, proposal, and the best contact person.',
    subject: 'Partnership request',
  },
  {
    label: 'Feedback',
    title: 'Improve GameZone',
    text: 'Search, categories, kids site, game player, UI feedback, or game suggestions.',
    subject: 'GameZone feedback',
  },
];

const CHECKLIST = [
  'Game title or page URL',
  'Device and browser',
  'Short description of the issue',
  'Screenshot or short clip if useful',
];

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="m22 8-10 6L2 8" />
    </svg>
  );
}

function RequestCard({
  label,
  title,
  text,
  subject,
}: {
  label: string;
  title: string;
  text: string;
  subject: string;
}) {
  return (
    <a
      href={mailto(subject)}
      className="group block rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_10px_26px_oklch(22%_0.04_35/0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-accent-light px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-accent">
          {label}
        </span>
        <span className="text-sm font-black text-accent opacity-60 transition-opacity group-hover:opacity-100">
          {'->'}
        </span>
      </div>
      <h2 className="text-lg font-black leading-tight text-fg">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-muted">{text}</p>
    </a>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full px-3 py-10 sm:px-4 lg:px-5 xl:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="grid gap-8 border-b border-border/70 pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-accent" aria-hidden="true" />
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
                Contact
              </p>
            </div>
            <h1 className="title-display max-w-4xl text-4xl font-black uppercase leading-[0.98] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Need help with GameZone?
            </h1>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-muted sm:text-lg">
              Send broken games, rights requests, catalog fixes, partnership notes, or site feedback.
              Clear details help us find the right page and fix the right thing.
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_28px_oklch(22%_0.04_35/0.08)]">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
                <MailIcon />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">
                  Main inbox
                </p>
                <a
                  href={mailto('GameZone contact')}
                  className="mt-1 block break-all text-xl font-black text-fg transition-colors hover:text-accent"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-accent">Reply</p>
                <p className="mt-1 text-sm font-bold text-muted">Usually 1-2 business days</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-accent">Best for</p>
                <p className="mt-1 text-sm font-bold text-muted">Support, rights, partners</p>
              </div>
            </div>
          </aside>
        </header>

        <main className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
                  Start here
                </p>
                <h2 className="title-display mt-2 text-3xl font-black uppercase leading-tight text-fg sm:text-4xl">
                  Pick the closest reason.
                </h2>
              </div>
              <a
                href={mailto('GameZone contact')}
                className="link-red-action text-sm font-bold"
              >
                Email directly {'->'}
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {REQUESTS.map((item) => (
                <RequestCard key={item.subject} {...item} />
              ))}
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-lg font-black text-fg">What helps us reply</h2>
              <ol className="mt-4 space-y-3">
                {CHECKLIST.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-muted">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light text-[11px] font-black text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-lg font-black text-fg">Useful pages</h2>
              <div className="mt-4 grid gap-2">
                {[
                  { href: '/about', label: 'About GameZone' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Use' },
                  { href: '/kids-site', label: 'For Kids' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl border border-border bg-background/70 px-4 py-3 text-sm font-bold text-fg transition-colors hover:border-accent/45 hover:text-accent"
                  >
                    {link.label}
                    <span aria-hidden="true">{'->'}</span>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </main>

        <section className="mt-8 rounded-2xl border border-border bg-surface/80 p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
                Rights holders
              </p>
              <p className="mt-2 max-w-4xl text-sm font-semibold leading-7 text-muted">
                If you own a game or asset listed on GameZone, include proof of ownership, the exact page URL,
                and whether you want attribution corrected, source updated, or content removed.
              </p>
            </div>
            <a
              href={mailto('Rights or removal request')}
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-black text-white transition-colors hover:bg-accent-hover"
            >
              Send rights request
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
