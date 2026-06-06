import catalog from '@/data/games.json';
import type { Game } from './types';
import { BLOCKED_DEVELOPERS, BLOCKED_GAME_IDS, BLOCKED_KEYWORDS } from './game-blocklist';
import { slugify } from './utils';

const games = catalog as Game[];
const ENABLE_FAMOBI_INLINE =
  process.env.ENABLE_FAMOBI_INLINE !== '0' && process.env.NEXT_PUBLIC_ENABLE_FAMOBI_INLINE !== '0';

function scoreForSearch(game: Game, q: string): number {
  const title = game.title.toLowerCase();
  const category = game.category.toLowerCase();
  const tags = game.tags.map((tag) => tag.toLowerCase());

  if (title === q) return 1000;
  if (title.startsWith(q)) return 850;
  if (title.includes(q)) return 700;
  if (category === q) return 560;
  if (category.includes(q)) return 500;
  if (tags.some((tag) => tag === q)) return 450;
  if (tags.some((tag) => tag.includes(q))) return 400;
  return 0;
}

function isBlocked(game: Game): boolean {
  if (BLOCKED_GAME_IDS.has(game.id) || (game.sourceId && BLOCKED_GAME_IDS.has(game.sourceId))) {
    return true;
  }

  if (game.developer && BLOCKED_DEVELOPERS.has(game.developer.toLowerCase())) {
    return true;
  }

  const haystack = [
    game.title,
    game.category,
    game.description,
    ...game.tags,
  ].join(' ').toLowerCase();

  return BLOCKED_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

function isDirectPlayable(game: Game): boolean {
  // Famobi games are rendered through /api/famobi-frame/:sourceId, which resolves
  // the play wrapper to the direct CDN URL before the iframe loads it.
  return game.provider !== 'famobi' || ENABLE_FAMOBI_INLINE;
}

// Module-level caches — computed once per server instance
let _activeCache: Game[] | null = null;
let _newestCache: Game[] | null = null;
const _catGamesCache = new Map<string, Game[]>();

function activeGames(): Game[] {
  if (!_activeCache) {
    _activeCache = games.filter((game) => isDirectPlayable(game) && !isBlocked(game));
  }
  return _activeCache;
}

function sortedByNewest(): Game[] {
  if (!_newestCache) {
    _newestCache = [...activeGames()].sort(byNewest);
  }
  return _newestCache;
}

function byQuality(a: Game, b: Game): number {
  return (b.qualityScore ?? 0) - (a.qualityScore ?? 0) || a.title.localeCompare(b.title);
}

function byNewest(a: Game, b: Game): number {
  const da = a.dateAdded ? Date.parse(a.dateAdded) : 0;
  const db = b.dateAdded ? Date.parse(b.dateAdded) : 0;
  return db - da || byQuality(a, b);
}

export async function getAllGames(): Promise<Game[]> {
  return activeGames();
}

function uniqueById(items: Game[]): Game[] {
  const seen = new Set<string>();
  return items.filter((g) => (seen.has(g.id) ? false : (seen.add(g.id), true)));
}

export function getGamesForCategoryRow(slug: string, fallbackSlugs: string[] = [], limit = 16): Game[] {
  const key = `${slug}|${fallbackSlugs.join(',')}|${limit}`;
  if (_catGamesCache.has(key)) return _catGamesCache.get(key)!;

  const all = activeGames();
  const catSlug = slug;
  const result = uniqueById([
    ...all.filter((g) => slugify(g.category) === catSlug),
    ...all.filter((g) => fallbackSlugs.includes(slugify(g.category))),
    ...all.filter((g) => g.tags.some((t) => slugify(t) === catSlug)),
  ]).slice(0, limit);

  _catGamesCache.set(key, result);
  return result;
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  return activeGames().find((game) => game.slug === slug) ?? null;
}

export async function getGamesByCategory(category: string): Promise<Game[]> {
  const normalized = category.toLowerCase();
  return activeGames()
    .filter((game) => game.category.toLowerCase() === normalized)
    .sort(byQuality);
}

export async function searchGames(query: string): Promise<Game[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return activeGames()
    .map((game) => ({ game, score: scoreForSearch(game, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || byQuality(a.game, b.game))
    .map(({ game }) => game);
}

export async function getMostPlayedGames(count = 200): Promise<Game[]> {
  return activeGames().slice(0, count);
}

export async function getNewestGames(count = 200): Promise<Game[]> {
  return sortedByNewest().slice(0, count);
}

export async function getCatalogStats() {
  const active = activeGames();
  const byProvider = active.reduce<Record<string, number>>((acc, game) => {
    const provider = game.provider ?? 'unknown';
    acc[provider] = (acc[provider] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: active.length,
    byProvider,
  };
}
