/**
 * Scrapes Y8.com browse/tag pages to discover games dynamically.
 * Uses Next.js ISR fetch cache (revalidate 24h) so Y8 is only hit once per day.
 * Two parsing strategies: JSON-LD structured data first, HTML fallback second.
 */

export interface Y8ScrapedGame {
  slug: string;    // Y8's own slug — used in embed URL
  title: string;
  thumb: string;   // CDN URL extracted from listing HTML; '' if not found
  category: string;
}

const BASE = 'https://www.y8.com';

const FETCH_OPTS = {
  next: { revalidate: 86400 },
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
  },
};

// Y8 tag slug → portal category slug
const TAG_CATEGORY: Record<string, string> = {
  action: 'action',
  racing: 'racing',
  shooting: 'shooting',
  puzzle: 'puzzle',
  sports: 'sports',
  io: 'io',
  io_games: 'io',
  skill: 'skill',
  adventure: 'adventure',
  strategy: 'strategy',
  fighting: 'fighting',
  platformer: 'platformer',
  car: 'car',
  cars: 'car',
  stickman: 'stickman',
  zombie: 'zombie',
  running: 'running',
  cooking: 'cooking',
  '2_player': '2player',
  two_player: '2player',
  multiplayer: 'multiplayer',
  '3d': '3d',
  soccer: 'soccer',
  basketball: 'sports',
  casual: 'casual',
  arcade: 'arcade',
  hypercasual: 'hypercasual',
};

function parseTagPage(html: string, fallbackCategory: string): Y8ScrapedGame[] {
  const results: Y8ScrapedGame[] = [];
  const seen = new Set<string>();

  // ── Strategy 1: JSON-LD structured data ────────────────────────────────────
  // Modern sites embed ItemList / VideoGame schema — most reliable if present
  const jsonLdRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jm: RegExpExecArray | null;
  while ((jm = jsonLdRe.exec(html)) !== null) {
    try {
      const obj = JSON.parse(jm[1]);
      const items: any[] =
        obj['@type'] === 'ItemList'
          ? (obj.itemListElement ?? []).map((e: any) => e.item ?? e)
          : Array.isArray(obj)
          ? obj
          : [obj];

      for (const item of items) {
        const url = String(item?.url ?? item?.['@id'] ?? '');
        const slugM = url.match(/\/games\/([a-z0-9_-]+)/i);
        if (!slugM || seen.has(slugM[1])) continue;
        const thumb = String(item?.image ?? item?.thumbnailUrl ?? '');
        if (!thumb.startsWith('http')) continue;
        seen.add(slugM[1]);
        results.push({
          slug: slugM[1],
          title: String(item?.name ?? slugM[1]).trim(),
          thumb,
          category: fallbackCategory,
        });
      }
    } catch {}
  }

  if (results.length > 0) return results;

  // ── Strategy 2: href + position-based image extraction ─────────────────────
  // Walk every /games/[slug] href and look for an img within the surrounding
  // 600-char window. Skips pure-text nav links (no image nearby = not a card).
  const hrefRe = /href="\/games\/([a-z0-9_-]+)"/gi;
  let hm: RegExpExecArray | null;
  while ((hm = hrefRe.exec(html)) !== null) {
    const slug = hm[1];
    if (seen.has(slug)) continue;

    const start = Math.max(0, hm.index - 80);
    const end = Math.min(html.length, hm.index + 700);
    const snippet = html.slice(start, end);

    // Thumbnail: prefer data-src (lazy-loaded) → src on img.y8.com → any image URL
    const thumbM =
      snippet.match(/data-src="(https?:\/\/img\.y8\.com[^"']+)"/i) ||
      snippet.match(/data-src="(https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)"/i) ||
      snippet.match(/src="(https?:\/\/img\.y8\.com[^"']+)"/i) ||
      snippet.match(/<img\b[^>]+src="(https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)"/i);

    const thumb = thumbM?.[1] ?? '';
    if (!thumb) continue; // no image nearby → breadcrumb / nav link, skip

    // Title: title attr > img alt > any visible text node > formatted slug
    const titleM =
      snippet.match(/\btitle="([^"]{2,80})"/i) ||
      snippet.match(/\balt="([^"]{2,80})"/i) ||
      snippet.match(/<(?:span|div|h[1-6]|p|strong)[^>]*>\s*([^<]{2,80}?)\s*<\//i);
    const title = (titleM?.[1] ?? slug.replace(/_/g, ' ')).trim();

    // Category: nearby /tags/[tag] link
    const catM = snippet.match(/\/tags\/([a-z0-9_-]+)/i);
    const category = (catM?.[1] && TAG_CATEGORY[catM[1]]) ?? fallbackCategory;

    seen.add(slug);
    results.push({ slug, title, thumb, category });
  }

  return results;
}

interface TagConfig {
  tag: string;
  pages: number;
  category: string;
}

// Tags to scrape, roughly in priority order (most_played first for best games)
const SCRAPE_TAGS: TagConfig[] = [
  { tag: 'most_played', pages: 25, category: 'action' },
  { tag: 'new_games',   pages: 10, category: 'action' },
  { tag: 'action',      pages: 8,  category: 'action' },
  { tag: 'racing',      pages: 8,  category: 'racing' },
  { tag: 'shooting',    pages: 6,  category: 'shooting' },
  { tag: 'puzzle',      pages: 6,  category: 'puzzle' },
  { tag: 'sports',      pages: 5,  category: 'sports' },
  { tag: 'io_games',    pages: 5,  category: 'io' },
  { tag: 'skill',       pages: 5,  category: 'skill' },
  { tag: 'adventure',   pages: 5,  category: 'adventure' },
  { tag: 'strategy',    pages: 4,  category: 'strategy' },
  { tag: 'fighting',    pages: 4,  category: 'fighting' },
  { tag: 'platformer',  pages: 4,  category: 'platformer' },
  { tag: 'car',         pages: 4,  category: 'car' },
  { tag: 'stickman',    pages: 3,  category: 'stickman' },
  { tag: 'zombie',      pages: 3,  category: 'zombie' },
  { tag: 'running',     pages: 3,  category: 'running' },
  { tag: '2_player',    pages: 3,  category: '2player' },
  { tag: 'multiplayer', pages: 3,  category: 'multiplayer' },
  { tag: '3d',          pages: 3,  category: '3d' },
  { tag: 'soccer',      pages: 3,  category: 'soccer' },
  { tag: 'cooking',     pages: 2,  category: 'cooking' },
  { tag: 'casual',      pages: 3,  category: 'casual' },
];

async function fetchTagPage(tag: string, page: number): Promise<string> {
  try {
    const url = `${BASE}/tags/${tag}?p=${page}`;
    const res = await fetch(url, FETCH_OPTS);
    return res.ok ? res.text() : '';
  } catch {
    return '';
  }
}

export async function scrapeY8Games(): Promise<Y8ScrapedGame[]> {
  const all: Y8ScrapedGame[] = [];
  const seen = new Set<string>();

  // Flatten all pages into a task list
  const tasks = SCRAPE_TAGS.flatMap(({ tag, pages, category }) =>
    Array.from({ length: pages }, (_, i) => ({ tag, page: i + 1, category })),
  );

  // Process in batches of 8 concurrent requests to avoid rate limiting
  const BATCH = 8;
  for (let i = 0; i < tasks.length; i += BATCH) {
    const slice = tasks.slice(i, i + BATCH);
    const htmls = await Promise.all(slice.map(({ tag, page }) => fetchTagPage(tag, page)));

    for (let j = 0; j < slice.length; j++) {
      const html = htmls[j];
      if (!html) continue;
      const games = parseTagPage(html, slice[j].category);
      for (const g of games) {
        if (!seen.has(g.slug)) {
          seen.add(g.slug);
          all.push(g);
        }
      }
    }
  }

  return all;
}
