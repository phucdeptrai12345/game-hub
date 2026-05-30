import { Game } from './types';
import { slugify, normalizeCategory } from './utils';
import { BLOCKED_GAME_IDS, BLOCKED_DEVELOPERS, BLOCKED_KEYWORDS } from './game-blocklist';

const FEED_BASE = 'https://rss.gamemonetize.com/rssfeed.php';
const PAGE_SIZE = 500;

let _gmCache: Game[] | null = null;
let _gmCacheTime = 0;
const GM_CACHE_TTL = 60 * 60 * 1000; // 1 hour in-process cache

interface RawGame {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  thumb: string;
  width: string;
  height: string;
  category: string;
  tags: string;
  developer: string;
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function passesQualityFilter(raw: RawGame): boolean {
  // Manual blocklists
  if (BLOCKED_GAME_IDS.has(raw.id)) return false;
  if (raw.developer && BLOCKED_DEVELOPERS.has(raw.developer.toLowerCase())) return false;

  // Must have a real title (not just numbers or <3 chars)
  const title = (raw.title || '').trim();
  if (title.length < 3) return false;

  // Must have a valid game URL
  if (!raw.url || !raw.url.startsWith('http')) return false;

  // Must have a thumbnail
  if (!raw.thumb || !raw.thumb.startsWith('http')) return false;

  // Must have a real description — 40 chars filters out "Play this game!" placeholders
  const desc = (raw.description || '').trim();
  if (desc.length < 40) return false;

  // Reasonable dimensions (not 0 or absurdly small)
  const w = parseInt(raw.width || '0', 10);
  const h = parseInt(raw.height || '0', 10);
  if (w > 0 && w < 200) return false;
  if (h > 0 && h < 150) return false;

  // Keyword filter on title + tags
  const haystack = `${title} ${raw.tags || ''}`.toLowerCase();
  if (BLOCKED_KEYWORDS.some((kw) => haystack.includes(kw))) return false;

  return true;
}

function parseGame(raw: RawGame): Game {
  const title = decodeHtml(raw.title || '').trim();
  return {
    id: raw.id,
    title,
    slug: slugify(title),
    thumb: raw.thumb,
    url: raw.url,
    category: normalizeCategory(raw.category || raw.tags || ''),
    tags: raw.tags
      ? raw.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    description: raw.description || '',
    instructions: raw.instructions || '',
    width: raw.width || '800',
    height: raw.height || '600',
    developer: raw.developer || '',
  };
}

async function fetchPage(page: number, popularity = 'mostplayed'): Promise<RawGame[]> {
  // New endpoint supports popularity= sort; amount=500 for bulk fetch
  const url = `${FEED_BASE}?format=json&type=html5&popularity=${popularity}&category=All&company=All&amount=${PAGE_SIZE}&page=${page}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getAllGames(): Promise<Game[]> {
  if (_gmCache && Date.now() - _gmCacheTime < GM_CACHE_TTL) return _gmCache;

  // API returns same ~500 games for every page (no real pagination for mostplayed).
  // Fetch mostplayed + newest in parallel to maximise unique games.
  const [rawMostPlayed, rawNewest] = await Promise.all([
    fetchPage(1, 'mostplayed'),
    fetchPage(1, 'newest'),
  ]);

  const seen = new Set<string>();
  _gmCache = [...rawMostPlayed, ...rawNewest]
    .filter(passesQualityFilter)
    .map(parseGame)
    .filter((g) => {
      if (seen.has(g.slug)) return false;
      seen.add(g.slug);
      return true;
    });

  _gmCacheTime = Date.now();
  return _gmCache;
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const games = await getAllGames();
  return games.find((g) => g.slug === slug) ?? null;
}

export async function getGamesByCategory(category: string): Promise<Game[]> {
  const games = await getAllGames();
  return games.filter(
    (g) => g.category.toLowerCase() === category.toLowerCase()
  );
}

export async function searchGames(query: string): Promise<Game[]> {
  if (!query.trim()) return [];
  const games = await getAllGames();
  const q = query.toLowerCase();
  return games.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function dedupeSlice(games: Game[], count: number): Game[] {
  const seen = new Set<string>();
  const result: Game[] = [];
  for (const g of games) {
    if (seen.has(g.slug)) continue;
    seen.add(g.slug);
    result.push(g);
    if (result.length >= count) break;
  }
  return result;
}

/** Returns the most-played games according to GameMonetize's own popularity ranking. */
export async function getMostPlayedGames(count = 200): Promise<Game[]> {
  const raw = await fetchPage(1, 'mostplayed');
  return dedupeSlice(raw.filter(passesQualityFilter).map(parseGame), count);
}

/** Returns the newest games according to GameMonetize. */
export async function getNewestGames(count = 200): Promise<Game[]> {
  const raw = await fetchPage(1, 'newest');
  return dedupeSlice(raw.filter(passesQualityFilter).map(parseGame), count);
}
