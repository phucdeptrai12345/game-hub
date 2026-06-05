import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GameImage from '@/components/ui/GameImage';
import AdSlot from '@/components/ui/AdSlot';
import { getGameBySlug, getAllGames, getGamesByCategory } from '@/lib/gamemonetize';
import { readGameContent, type GeneratedContent } from '@/lib/generateGameContent';
import type { Game } from '@/lib/types';
import { catBadgeClass } from '@/lib/cat-badge';

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: 'Game Not Found' };

  return {
    title: `${game.title} - GameZone`,
    description:
      game.description?.slice(0, 155) ||
      `Play ${game.title} free in your browser. No download, no sign-up.`,
    openGraph: {
      title: game.title,
      description: game.description?.slice(0, 155) ?? `Play ${game.title} free.`,
      images: game.thumb ? [{ url: game.thumb, width: 512, height: 384, alt: game.title }] : [],
    },
  };
}

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.slice(0, 2000).map((game) => ({ slug: game.slug }));
}

const catBar = catBadgeClass;

function toRating(score?: number): number {
  if (!score) return 4.0;
  const rating = Math.round((score / 20) * 10) / 10;
  return Math.max(0, Math.min(5, rating));
}

function formatDate(dateStr?: string, compact = false): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', compact
    ? { year: 'numeric', month: 'short' }
    : { year: 'numeric', month: 'short', day: 'numeric' });
}

function readTime(game: Game): number {
  const text = `${game.description || ''} ${game.instructions || ''} ${game.tags.join(' ')}`;
  const words = text.trim().split(/\s+/).filter(Boolean).length + 900;
  return Math.max(4, Math.min(8, Math.round(words / 190)));
}

function articleType(game: Game): string {
  const category = game.category.toLowerCase();
  if (category.includes('puzzle') || category.includes('skill')) return 'Guide';
  if (category.includes('kids') || category.includes('girls') || category.includes('cooking')) return 'Pick';
  if (game.featured || (game.qualityScore ?? 0) >= 82) return 'Review';
  return 'Tips';
}

function makeFallbackContent(game: Game): GeneratedContent {
  const title = game.title;
  const category = game.category || 'browser';
  const description = game.description || `${title} is a free browser game you can open quickly on GameZone.`;

  return {
    intro: `${description}\n\nThis GameZone note keeps things practical: what the game feels like, why it is worth opening, and who will probably enjoy it most. It is written for players who want to choose fast instead of scrolling forever.`,
    sections: [
      {
        heading: 'What the game is about',
        body: `${title} fits into the ${category} side of the catalog, so the main appeal is easy access and quick play. You do not need an install, launcher, or account step before trying it.\n\nThe best way to judge it is simple: open the game, play one short round, and see whether the controls and pace click for you.`,
      },
      {
        heading: 'Why it works as a browser game',
        body: `A good browser game should load quickly, explain itself through play, and stay readable on different screens. ${title} is listed here because it fits that quick-session style.\n\nIf you are on desktop, you can usually play with keyboard or mouse. On mobile, the experience depends on the game's own touch controls and screen layout.`,
      },
      {
        heading: 'Who should try it first',
        body: `Try ${title} if you want something light, direct, and easy to sample. It is a good fit when you want a short break but still want a game with a clear goal.\n\nPlayers who prefer deeper progression may want to browse more ${category} games after trying a round or two.`,
      },
    ],
    conclusion: `${title} is worth a quick try if the thumbnail and category match your mood. Open it, test one round, then keep it in favorites if it earns a second play.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const relatedAll = await getGamesByCategory(game.category);
  const related = relatedAll.filter((item) => item.id !== game.id).slice(0, 6);

  const steps = game.instructions?.trim().split(/\n+/).filter(Boolean) ?? [];
  const rating = toRating(game.qualityScore);
  const generated = readGameContent(game.slug) ?? makeFallbackContent(game);
  const published = formatDate(game.dateAdded);

  return (
    <div className="w-full px-3 py-9 sm:px-4 lg:px-5 xl:px-6">
      <header className="mb-9">
        <nav className="mb-6 flex items-center gap-2" aria-label="Breadcrumb">
          <Link
            href="/blog"
            className="text-[11px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-fg"
          >
            Blog
          </Link>
          <span className="text-[10px] text-border">/</span>
          <Link
            href={`/blog?category=${encodeURIComponent(game.category)}`}
            className="text-[11px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-fg"
          >
            {game.category}
          </Link>
        </nav>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`block h-4 w-[3px] shrink-0 rounded-full ${catBar(game.category)}`} aria-hidden />
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
            {articleType(game)}
          </span>
          <span className="text-xs font-semibold text-muted">-</span>
          <span className="text-xs font-semibold text-muted">{readTime(game)} min read</span>
          {published && (
            <>
              <span className="text-xs font-semibold text-muted">-</span>
              <span className="text-xs font-semibold text-muted">{published}</span>
            </>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">
          <div className="max-w-5xl">
            <h1
              className="title-display mb-5 text-4xl font-black leading-[0.98] tracking-tight text-fg sm:text-5xl lg:text-[3.45rem]"
              style={{ textWrap: 'balance' }}
            >
              {game.title} review and quick guide
            </h1>

            <p className="max-w-3xl text-base font-semibold leading-relaxed text-muted sm:text-lg">
              A practical look at {game.title}: how it plays, what kind of session it fits,
              and whether it is worth opening on desktop or mobile.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <StarRating rating={rating} />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-muted">
                {game.developer && <span>{game.developer}</span>}
                {game.developer && <span className="opacity-40">-</span>}
                <span>Browser - HTML5</span>
                <span className="opacity-40">-</span>
                <span className="font-black text-emerald-700 dark:text-emerald-400">Free</span>
              </div>
            </div>
          </div>

          <div className="mt-1 hidden lg:block">
            <AdSlot slot="blog-sidebar" variant="rectangle" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
        <article className="min-w-0">
          {game.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {game.tags.slice(0, 8).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface/80 px-3 py-1 text-[11px] font-bold text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <QuickTake game={game} rating={rating} />

          <AdSlot slot="blog-post-top" variant="leaderboard" className="my-8" />

          <div className="max-w-[78ch] text-[16px] font-semibold leading-[1.82] text-fg/86">
            {(generated.intro || '').split(/\n+/).filter(Boolean).map((paragraph, index) => (
              <p key={`intro-${index}`} className="mb-[1.25em]" style={{ textWrap: 'pretty' }}>
                {paragraph}
              </p>
            ))}

            {generated.sections.filter(s => s.heading && s.body).map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`}>
                <h2 className="title-display mt-10 mb-4 text-2xl font-black uppercase leading-tight tracking-tight text-fg">
                  {section.heading}
                </h2>

                {(section.body || '').split(/\n+/).filter(Boolean).map((paragraph, paragraphIndex) => (
                  <p
                    key={`section-${sectionIndex}-paragraph-${paragraphIndex}`}
                    className="mb-[1.25em]"
                    style={{ textWrap: 'pretty' }}
                  >
                    {paragraph}
                  </p>
                ))}

                {sectionIndex === 2 && (
                  <AdSlot slot="blog-post-mid" variant="leaderboard" className="my-8" />
                )}
              </div>
            ))}

            {generated.conclusion && (
              <div>
                <h2 className="title-display mt-10 mb-4 text-2xl font-black uppercase leading-tight tracking-tight text-fg">
                  Verdict
                </h2>
                {generated.conclusion.split(/\n+/).filter(Boolean).map((paragraph, index) => (
                  <p key={`conclusion-${index}`} className="mb-[1.25em]" style={{ textWrap: 'pretty' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {steps.length > 0 && (
            <section className="mt-10">
              <SectionHead label="How to play" />
              <div className="grid gap-5 sm:grid-cols-[1fr_210px]">
                <ol className="space-y-3">
                  {steps.map((line, index) => (
                    <li key={index} className="flex items-baseline gap-4">
                      <span className="w-5 shrink-0 text-right text-xs font-black tabular-nums text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14.5px] font-semibold leading-relaxed text-fg/82">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-navy">
                  <GameImage game={game} alt="" fill className="object-cover saturate-125" sizes="210px" />
                </div>
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-10">
              <SectionHead label={`More ${game.category}`} />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {related.map((relatedGame) => (
                  <RelatedCard key={relatedGame.id} game={relatedGame} />
                ))}
              </div>

              <Link
                href={`/blog?category=${encodeURIComponent(game.category)}`}
                className="mt-5 inline-flex items-center gap-1.5 rounded text-sm font-bold text-accent hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Browse all {game.category} games {'->'}
              </Link>
            </section>
          )}
        </article>

        <aside className="self-start space-y-6 lg:sticky lg:top-20">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <Link
              href={`/games/${game.slug}`}
              className="group relative block aspect-video w-full overflow-hidden bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
            >
              <GameImage
                game={game}
                alt={`Play ${game.title}`}
                fill
                className="object-cover saturate-125 transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="300px"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent py-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-widest text-white">Play</span>
              </div>
            </Link>

            <div className="space-y-3 p-4">
              <div>
                <p className="line-clamp-1 text-sm font-black leading-tight text-fg">{game.title}</p>
                <p className="mt-0.5 text-xs font-semibold capitalize text-muted">{game.category}</p>
              </div>

              <div className="flex items-center gap-2 border-y border-border/60 py-2">
                <StarRating rating={rating} compact />
                <span className="text-xs font-black text-fg">{rating.toFixed(1)}</span>
                <span className="text-[10px] font-semibold text-muted">GameZone rating</span>
              </div>

              <Link
                href={`/games/${game.slug}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-black text-white shadow-[0_4px_14px_oklch(57%_0.23_50/0.22)] transition-all duration-150 hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Play free
              </Link>
            </div>
          </div>

          <div>
            <SectionHead label="Game details" />
            <dl className="divide-y divide-border/60">
              {game.developer && <DetailRow label="Studio" value={game.developer} />}
              <DetailRow label="Platform" value="Browser - HTML5" />
              <DetailRow label="Price" value="Free" highlight />
              {game.orientation && game.orientation.toLowerCase() !== 'none' && (
                <DetailRow label="Orientation" value={game.orientation} />
              )}
              {game.dateAdded && <DetailRow label="Released" value={formatDate(game.dateAdded, true)} />}
            </dl>
          </div>

          <div className="space-y-2 pt-1">
            <Link
              href={`/blog?category=${encodeURIComponent(game.category)}`}
              className="flex items-center gap-2 rounded text-sm font-black capitalize text-fg transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              More {game.category} games {'->'}
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded text-xs font-semibold text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {'<-'} Back to blog
            </Link>
          </div>

          <AdSlot slot="blog-sidebar-bottom" variant="leaderboard" />
        </aside>
      </div>
    </div>
  );
}

function QuickTake({ game, rating }: { game: Game; rating: number }) {
  const points = [
    `Best for quick ${game.category} sessions`,
    'Works in the browser with no install',
    rating >= 4.2 ? 'Strong pick from the GameZone catalog' : 'Worth trying if the genre fits your mood',
  ];

  return (
    <aside className="mb-8 rounded-2xl border border-border bg-surface/80 p-5">
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-accent">Quick take</p>
      <ul className="grid gap-2 sm:grid-cols-3">
        {points.map((point) => (
          <li key={point} className="text-sm font-bold leading-snug text-fg/82">
            {point}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function StarRating({ rating, compact = false }: { rating: number; compact?: boolean }) {
  const size = compact ? 'h-3 w-3' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-1" aria-label={`GameZone rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating >= star - 0.5;

        return (
          <span key={star} className={`relative inline-block ${size}`}>
            <svg className={`${size} text-border`} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {(filled || partial) && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? '100%' : '50%' }}>
                <svg className={`${size} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            )}
          </span>
        );
      })}
      {!compact && <span className="ml-1.5 text-base font-black text-fg">{rating.toFixed(1)}</span>}
    </div>
  );
}

function SectionHead({ label }: { label: string }) {
  return (
    <div className="mb-5 mt-2 flex items-center gap-3">
      <h2 className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em] text-muted">
        {label}
      </h2>
      <div className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5">
      <dt className="shrink-0 text-xs font-semibold text-muted">{label}</dt>
      <dd className={`max-w-[60%] truncate text-right text-xs font-black ${
        highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-fg'
      }`}>
        {value}
      </dd>
    </div>
  );
}

function RelatedCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/blog/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-150 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-video overflow-hidden bg-navy">
        <GameImage
          game={game}
          alt={game.title}
          fill
          className="object-cover saturate-125 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width:640px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="line-clamp-2 text-xs font-black leading-tight text-fg transition-colors group-hover:text-accent">
          {game.title}
        </p>
        <p className="mt-auto text-[10px] font-semibold capitalize text-muted">{game.category}</p>
      </div>
    </Link>
  );
}
