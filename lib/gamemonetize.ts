import { Game } from './types';
import { slugify, normalizeCategory } from './utils';

const FEED_BASE = 'https://gamemonetize.com/feed.php';
const PAGE_SIZE = 500;

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

function parseGame(raw: RawGame): Game {
  const title = decodeHtml(raw.title || '');
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

async function fetchPage(page: number): Promise<RawGame[]> {
  const url = `${FEED_BASE}?format=0&num=${PAGE_SIZE}&page=${page}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getAllGames(): Promise<Game[]> {
  const allRaw: RawGame[] = [];

  // Fetch sequentially to avoid rate limiting — API supports up to 5 pages (2500 games)
  for (let page = 1; page <= 5; page++) {
    const batch = await fetchPage(page);
    if (batch.length === 0) break;
    allRaw.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }

  const games = allRaw.map(parseGame);
  // Deduplicate by slug
  const seen = new Set<string>();
  return games.filter((g) => {
    if (seen.has(g.slug)) return false;
    seen.add(g.slug);
    return true;
  });
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

export async function getFeaturedGames(count = 8): Promise<Game[]> {
  const games = await getAllGames();
  return games.slice(0, count);
}

export async function getNewGames(count = 12): Promise<Game[]> {
  const games = await getAllGames();
  return games.slice(0, count);
}

export async function getRelatedGames(game: Game, count = 8): Promise<Game[]> {
  const games = await getAllGames();
  return games
    .filter((g) => g.id !== game.id && g.category === game.category)
    .slice(0, count);
}
