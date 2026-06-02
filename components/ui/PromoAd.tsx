import Link from 'next/link';

interface Props {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  tone?: 'action' | 'racing';
}

export default function PromoAd({
  href,
  eyebrow,
  title,
  description,
  cta,
  tone = 'action',
}: Props) {
  const toneClass =
    tone === 'racing'
      ? 'from-[oklch(94%_0.04_55)] via-surface to-[oklch(96%_0.03_210)]'
      : 'from-[oklch(95%_0.045_28)] via-surface to-[oklch(96%_0.025_250)]';

  return (
    <Link
      href={href}
      className={`group relative flex h-full min-h-0 w-full overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br ${toneClass} p-4 shadow-[0_8px_28px_oklch(10%_0.01_250/0.06)] active-click`}
      aria-label={`${title}: ${cta}`}
    >
      <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-accent/15 transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-1.5 opacity-80" aria-hidden="true">
        <span className="h-8 w-8 rounded-lg bg-fg/10" />
        <span className="h-8 w-8 rounded-lg bg-accent/35" />
        <span className="h-8 w-8 rounded-lg bg-accent/25" />
        <span className="h-8 w-8 rounded-lg bg-fg/10" />
      </div>

      <div className="relative z-10 flex h-full max-w-[210px] flex-col justify-between">
        <div>
          <span className="mb-3 inline-flex rounded-full border border-border/70 bg-surface/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-muted">
            Picked for you
          </span>
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-accent">{eyebrow}</p>
          <h3 className="text-xl font-black leading-tight text-fg title-display">{title}</h3>
          <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-muted">{description}</p>
        </div>

        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-black text-white shadow-[0_2px_10px_oklch(61%_0.23_28/0.25)]">
          {cta}
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
