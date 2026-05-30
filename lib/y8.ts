import { Game } from './types';
import { slugify } from './utils';
import { Y8_GAMES_RAW } from './y8-games';
import extendedRaw from './y8-games-extended.json';

const Y8_EMBED_BASE = 'https://y8.com/embed';
const Y8_PAGE_BASE = 'https://www.y8.com/games';

async function fetchY8Thumbnail(y8Slug: string): Promise<string> {
  try {
    const res = await fetch(`${Y8_PAGE_BASE}/${y8Slug}`, {
      next: { revalidate: 86400 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html',
      },
    });
    if (!res.ok) return '';
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match?.[1] ?? '';
  } catch {
    return '';
  }
}

function buildGame(
  y8Slug: string,
  title: string,
  thumb: string,
  category: string,
  extra?: { description?: string; width?: number; height?: number },
): Game {
  return {
    id: `y8-${y8Slug}`,
    title,
    slug: `y8-${slugify(title)}`,
    thumb,
    url: `${Y8_EMBED_BASE}/${y8Slug}`,
    category,
    tags: [],
    description: extra?.description ?? '',
    instructions: '',
    width: String(extra?.width ?? 800),
    height: String(extra?.height ?? 600),
    developer: 'Y8 Games',
  };
}

// Build extended games directly from pre-fetched JSON (no HTTP needed at runtime)
const MANUAL_SLUGS = new Set(Y8_GAMES_RAW.map((g) => g.y8Slug));

/** Game slugs from the hand-curated Y8 list (Slope, Vex, Moto X3M, …) */
export const Y8_CURATED_GAME_SLUGS: ReadonlySet<string> = new Set(
  Y8_GAMES_RAW.map((g) => `y8-${slugify(g.title)}`),
);

const extendedGames: Game[] = (extendedRaw as Array<{
  y8Slug: string; title: string; category: string; thumb: string; description?: string;
}>)
  .filter((g) => g.thumb && !MANUAL_SLUGS.has(g.y8Slug))
  .map((g) => buildGame(g.y8Slug, g.title, g.thumb, g.category, { description: g.description }));

let _cache: Game[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function getY8Games(): Promise<Game[]> {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  // Manual curated list: fetch thumbnails at runtime (ISR-cached)
  const BATCH = 10;
  const thumbs: string[] = [];
  for (let i = 0; i < Y8_GAMES_RAW.length; i += BATCH) {
    const results = await Promise.all(
      Y8_GAMES_RAW.slice(i, i + BATCH).map((g) => fetchY8Thumbnail(g.y8Slug)),
    );
    thumbs.push(...results);
  }

  const manualGames = Y8_GAMES_RAW
    .map((raw, i) =>
      buildGame(raw.y8Slug, raw.title, thumbs[i] ?? '', raw.category, {
        description: raw.description,
        width: raw.width,
        height: raw.height,
      }),
    )
    .filter((g) => !!g.thumb);

  // Merge: manual first (higher quality / curated), then extended
  _cache = [...manualGames, ...extendedGames];
  _cacheTime = Date.now();
  return _cache;
}

export async function getY8GameBySlug(slug: string): Promise<Game | null> {
  const games = await getY8Games();
  return games.find((g) => g.slug === slug) ?? null;
}

export async function getY8GamesByCategory(category: string): Promise<Game[]> {
  const games = await getY8Games();
  return games.filter((g) => g.category.toLowerCase() === category.toLowerCase());
}

export async function searchY8Games(query: string): Promise<Game[]> {
  if (!query.trim()) return [];
  const games = await getY8Games();
  const q = query.toLowerCase();
  return games.filter(
    (g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q),
  );
}
