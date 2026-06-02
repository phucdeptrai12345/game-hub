#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';

const OUT_FILE = new URL('../data/games.json', import.meta.url);

const FAMOBI_FEED_URL = 'https://api.famobi.com/feed';
const FAMOBI_AFFILIATE_ID = process.env.FAMOBI_AFFILIATE_ID || 'A-FAMOBI-COM';
const FAMOBI_DIRECT_EMBED = process.env.FAMOBI_DIRECT_EMBED !== '0';
const FAMOBI_CONCURRENCY = Number(process.env.FAMOBI_CONCURRENCY || 10);
const GAMEPIX_SID = process.env.GAMEPIX_SID || process.env.NEXT_PUBLIC_GAMEPIX_SID || '1';
const GAMEPIX_PAGE_SIZE = Number(process.env.GAMEPIX_PAGE_SIZE || 1000);
const GAMEPIX_PAGES = Number(process.env.GAMEPIX_PAGES || 7);
const GAMEMONETIZE_FEED_URL = 'https://rss.gamemonetize.com/rssfeed.php';
const GAMEMONETIZE_CATEGORY_FEEDS = (
  process.env.GAMEMONETIZE_CATEGORY_FEEDS ||
  'Action,Adventure,Arcade,Shooting,Sports,Racing,Multiplayer,3D,Cooking,Girls,Hypercasual,Soccer,Fighting,2 Player'
).split(',').map((category) => category.trim()).filter(Boolean);
const GAMEDISTRIBUTION_FEED_URL = process.env.GAMEDISTRIBUTION_FEED_URL || '';

const PROVIDER_WEIGHT = {
  famobi: 100,
  gamedistribution: 92,
  gamepix: 82,
  gamemonetize: 55,
};

const BLOCKED_KEYWORDS = [
  'xxx',
  'adult',
  'nude',
  'naked',
  'porn',
  'strip',
  'erotic',
  'sex ',
  'sexy girls',
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-');
}

function cleanText(value) {
  return decodeHtml(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\bIN APP PURCHASES\b[\s\S]*$/i, '')
    .replace(/\bIMPORTANT NOTICE\b[\s\S]*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatCategory(raw) {
  if (!raw) return 'Other';
  return String(raw)
    .replace(/[-_]+/g, ' ')
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function normalizeCategory(raw) {
  const map = {
    zombie: 'Zombie',
    horror: 'Horror',
    scary: 'Horror',
    simulation: 'Simulation',
    simulator: 'Simulation',
    running: 'Running',
    runner: 'Running',
    stickman: 'Stickman',
    fighting: 'Fighting',
    fight: 'Fighting',
    clicker: 'Clicker',
    idle: 'Clicker',
    driving: 'Car',
    cars: 'Car',
    car: 'Car',
    '3d': '3D',
    'time management': 'Strategy',
    'tower defense': 'Strategy',
    'tower defence': 'Strategy',
    'bubble shooter': 'Puzzle',
    'bubble-shooter': 'Puzzle',
    'match 3': 'Puzzle',
    'match-3': 'Puzzle',
    puzzles: 'Puzzle',
    mahjong: 'Puzzle',
    quiz: 'Puzzle',
    junior: 'Kids',
    educational: 'Kids',
    'jump and run': 'Platformer',
    'jump-and-run': 'Platformer',
    platformer: 'Platformer',
    platform: 'Platformer',
    'hyper casual': 'Hypercasual',
    hypercasual: 'Hypercasual',
    'two-player': '2 Player',
    'two player': '2 Player',
    '2player': '2 Player',
    '2 player': '2 Player',
    multiplayer: 'Multiplayer',
    wedding: 'Girls',
    fashion: 'Girls',
    girl: 'Girls',
    'dress up': 'Girls',
    'dress-up': 'Girls',
    dressup: 'Girls',
    'make up': 'Beauty',
    'make-up': 'Beauty',
    makeup: 'Beauty',
    beauty: 'Beauty',
    restaurant: 'Cooking',
    'ice cream': 'Cooking',
    pastry: 'Cooking',
    pastries: 'Cooking',
    cafe: 'Cooking',
    cake: 'Cooking',
    food: 'Cooking',
    cooking: 'Cooking',
    management: 'Strategy',
    strategy: 'Strategy',
    action: 'Action',
    adventure: 'Adventure',
    puzzle: 'Puzzle',
    racing: 'Racing',
    race: 'Racing',
    sports: 'Sports',
    sport: 'Sports',
    football: 'Soccer',
    soccer: 'Soccer',
    basketball: 'Sports',
    '.io': 'IO',
    io: 'IO',
    casual: 'Casual',
    shooting: 'Shooting',
    shooter: 'Shooting',
    arcade: 'Arcade',
    skill: 'Skill',
    cards: 'Arcade',
    classics: 'Arcade',
    classic: 'Arcade',
    board: 'Puzzle',
    breakout: 'Arcade',
    girls: 'Girls',
    kids: 'Kids',
    boys: 'Action',
  };

  const lower = String(raw || '').toLowerCase().trim();
  for (const [key, category] of Object.entries(map)) {
    if (matchesCategoryKeyword(lower, key)) return category;
  }
  return 'Arcade';
}

function matchesCategoryKeyword(value, keyword) {
  if (!value || !keyword) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (keyword.includes(' ') || keyword.includes('-') || keyword.includes('.')) {
    return value.includes(keyword);
  }

  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(value);
}

function compactTags(values) {
  const seen = new Set();
  const out = [];
  for (const value of values.flat().filter(Boolean)) {
    const tag = formatCategory(String(value));
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out.slice(0, 12);
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || ''));
}

function dimensionsFromAspect(aspectRatio, orientation) {
  const ratio = Number(aspectRatio);
  if (Number.isFinite(ratio) && ratio > 0.2) {
    const width = ratio >= 1 ? 960 : 540;
    return { width: String(width), height: String(Math.round(width / ratio)) };
  }

  if (String(orientation || '').toLowerCase() === 'portrait') {
    return { width: '540', height: '960' };
  }

  return { width: '800', height: '600' };
}

function completeDescription(title, description, category) {
  if (description.length >= 24) return description;
  return `Play ${title} online for free. Enjoy a fast ${category.toLowerCase()} game directly in your browser with no download.`;
}

function calculateQuality(game, sourceRank, popularity = 0) {
  let score = PROVIDER_WEIGHT[game.provider] || 40;
  score += Math.min(12, Math.max(0, cleanText(game.description).length - 60) / 80);
  score += game.category && game.category !== 'Other' ? 5 : 0;
  score += game.featured ? 8 : 0;
  score += Number(popularity || 0) * 12;

  const date = game.dateAdded ? Date.parse(game.dateAdded) : 0;
  if (date > 0) {
    const ageDays = Math.max(0, (Date.now() - date) / 86400000);
    score += Math.max(0, 7 - ageDays / 60);
  }

  score -= Math.min(12, sourceRank * 0.006);
  return Number(score.toFixed(2));
}

function makeGame(input) {
  const title = cleanText(input.title);
  const primaryCategory = normalizeCategory(input.category || '');
  const titleCategory = normalizeCategory(input.title || '');
  const tagCategory = normalizeCategory((input.tags || []).join(' '));
  const enrichedCategory = titleCategory !== 'Arcade' ? titleCategory : tagCategory;
  const category = shouldOverridePrimaryCategory(primaryCategory, enrichedCategory)
    ? enrichedCategory
    : primaryCategory;
  const description = completeDescription(title, cleanText(input.description), category);
  const sourceId = String(input.sourceId || slugify(title));
  const width = String(input.width || '800');
  const height = String(input.height || '600');
  const tags = compactTags([category, input.tags || []]);

  const game = {
    id: `${input.provider}:${sourceId}`,
    sourceId,
    provider: input.provider,
    title,
    slug: slugify(title),
    thumb: input.thumb,
    url: input.url,
    sourceUrl: input.sourceUrl || input.url,
    category,
    tags,
    description,
    instructions: cleanText(input.instructions) || 'Use mouse, keyboard, or touch controls to play.',
    width,
    height,
    developer: cleanText(input.developer) || providerLabel(input.provider),
    dateAdded: input.dateAdded || undefined,
    orientation: input.orientation || undefined,
    qualityScore: 0,
    featured: Boolean(input.featured),
    previewVideo: input.previewVideo || undefined,
  };

  game.qualityScore = calculateQuality(game, input.sourceRank || 0, input.popularity || 0);
  return game;
}

function shouldOverridePrimaryCategory(primaryCategory, enrichedCategory) {
  if (!primaryCategory || primaryCategory === 'Arcade') return enrichedCategory !== 'Arcade';
  if (!enrichedCategory || enrichedCategory === primaryCategory || enrichedCategory === 'Arcade') return false;

  const specific = new Set([
    'Zombie',
    'Horror',
    'Simulation',
    'Running',
    'Stickman',
    'Fighting',
    'Clicker',
    'Cooking',
    'Girls',
    'Beauty',
  ]);

  return specific.has(enrichedCategory);
}

function providerLabel(provider) {
  if (provider === 'famobi') return 'Famobi';
  if (provider === 'gamedistribution') return 'GameDistribution';
  if (provider === 'gamepix') return 'GamePix';
  return 'GameMonetize';
}

function highQualityGamePixThumb(value) {
  return String(value || '').replace(/\/thumbnail\/(?:small|big)\.png(?:\?.*)?$/i, '/thumbnail/medium.png');
}

function passesQuality(game) {
  if (!game.title || game.title.length < 3 || !game.slug) return false;
  if (!isHttpUrl(game.url) || !isHttpUrl(game.thumb)) return false;

  const width = Number.parseInt(game.width, 10);
  const height = Number.parseInt(game.height, 10);
  if (Number.isFinite(width) && width > 0 && width < 200) return false;
  if (Number.isFinite(height) && height > 0 && height < 150) return false;

  const haystack = [
    game.title,
    game.category,
    game.description,
    game.developer,
    ...game.tags,
  ].join(' ').toLowerCase();
  if (BLOCKED_KEYWORDS.some((keyword) => haystack.includes(keyword))) return false;

  if (game.provider === 'gamemonetize' && cleanText(game.description).length < 45) {
    return false;
  }

  return true;
}

function titleKey(title) {
  return slugify(title)
    .replace(/-(html5|online|free|game|games)$/g, '')
    .replace(/-\d+$/g, '');
}

function dedupeAndSort(games) {
  const bestByTitle = new Map();

  for (const game of games.filter(passesQuality)) {
    const key = titleKey(game.title);
    const existing = bestByTitle.get(key);
    if (!existing || (game.qualityScore || 0) > (existing.qualityScore || 0)) {
      bestByTitle.set(key, game);
    }
  }

  const sorted = [...bestByTitle.values()]
    .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0) || a.title.localeCompare(b.title));

  const usedSlugs = new Set();
  return blendProviders(sorted)
    .map((game) => {
      let slug = game.slug;
      if (usedSlugs.has(slug)) slug = `${slug}-${game.provider}`;
      let uniqueSlug = slug;
      let suffix = 2;
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${slug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(uniqueSlug);
      return { ...game, slug: uniqueSlug };
    });
}

function blendProviders(sortedGames) {
  const buckets = new Map();
  for (const game of sortedGames) {
    if (!buckets.has(game.provider)) buckets.set(game.provider, []);
    buckets.get(game.provider).push(game);
  }

  const pattern = [
    'famobi',
    'gamepix',
    'famobi',
    'gamepix',
    'famobi',
    'gamemonetize',
    'famobi',
    'gamepix',
    'gamedistribution',
  ];

  const total = sortedGames.length;
  const out = [];
  while (out.length < total) {
    let moved = false;

    for (const provider of pattern) {
      const bucket = buckets.get(provider);
      if (!bucket?.length) continue;
      out.push(bucket.shift());
      moved = true;
      if (out.length >= total) break;
    }

    if (!moved) {
      const nextBucket = [...buckets.values()].find((bucket) => bucket.length > 0);
      if (!nextBucket) break;
      out.push(nextBucket.shift());
    }
  }

  return out;
}

async function fetchJson(url, timeoutMs = 45000) {
  const res = await fetch(url, {
    headers: { accept: 'application/json,text/plain,*/*' },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function fetchText(url, timeoutMs = 30000) {
  const res = await fetch(url, {
    headers: { accept: 'text/html,*/*' },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return res.text();
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );

  return results;
}

function decodeJsString(value) {
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value.replace(/\\\//g, '/').replace(/\\u0026/g, '&');
  }
}

async function getFamobiDirectEmbedUrl(raw) {
  const playUrl = `${raw.link || `https://play.famobi.com/${raw.package_id}`}/${FAMOBI_AFFILIATE_ID}`;
  const html = await fetchText(playUrl);
  const match = html.match(/redirectUrl\s*=\s*"([^"]+)"/);
  if (!match) return raw.link || playUrl;
  return decodeJsString(match[1]);
}

async function fetchFamobi() {
  const data = await fetchJson(FAMOBI_FEED_URL);
  const rawGames = Array.isArray(data?.games) ? data.games : [];

  return mapWithConcurrency(rawGames, FAMOBI_CONCURRENCY, async (raw, index) => {
    const dims = dimensionsFromAspect(raw.aspect_ratio, raw.orientation);
    const sourceUrl = raw.link || `https://play.famobi.com/${raw.package_id}`;
    let embedUrl = sourceUrl;

    if (FAMOBI_DIRECT_EMBED) {
      try {
        embedUrl = await getFamobiDirectEmbedUrl(raw);
      } catch (error) {
        console.warn(`Famobi direct URL failed for ${raw.package_id}: ${error.message}`);
      }
    }

    return makeGame({
      provider: 'famobi',
      sourceId: raw.package_id,
      title: raw.name,
      description: raw.description,
      thumb: raw.thumb || raw.thumb_180 || raw.thumb_120,
      url: embedUrl,
      sourceUrl,
      category: Array.isArray(raw.categories) ? raw.categories[0] : '',
      tags: Array.isArray(raw.categories) ? raw.categories : [],
      width: dims.width,
      height: dims.height,
      developer: 'Famobi',
      dateAdded: raw.date,
      orientation: raw.orientation,
      featured: Boolean(raw.highscores_enabled),
      sourceRank: index,
    });
  });
}

async function fetchGamePix() {
  const offsets = Array.from({ length: GAMEPIX_PAGES }, (_, page) => page * GAMEPIX_PAGE_SIZE);
  const pages = await Promise.all(offsets.map(async (offset) => {
    const url = new URL('https://games.gamepix.com/games');
    url.searchParams.set('sid', GAMEPIX_SID);
    url.searchParams.set('limit', String(GAMEPIX_PAGE_SIZE));
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('order', 'q');
    const data = await fetchJson(url.toString(), 60000);
    return Array.isArray(data?.data) ? data.data.map((raw, index) => ({ raw, sourceRank: offset + index })) : [];
  }));

  return pages.flat().map(({ raw, sourceRank }) => makeGame({
    provider: 'gamepix',
    sourceId: raw.id,
    title: raw.title,
    description: raw.desc_en || raw.description,
    thumb: highQualityGamePixThumb(raw.thumbnailUrl || raw.thumbnailUrl100),
    url: raw.url,
    sourceUrl: raw.url,
    category: raw.category || (Array.isArray(raw.categories) ? raw.categories[0] : ''),
    tags: Array.isArray(raw.categories) ? raw.categories : [raw.category],
    width: raw.width,
    height: raw.height,
    developer: raw.author || 'GamePix',
    dateAdded: raw.creation || raw.approval_date || raw.lastUpdate,
    orientation: raw.orientation,
    featured: Boolean(raw.featured),
    popularity: Number(raw.rkScore || raw.rks || 0),
    sourceRank,
  }));
}

async function fetchGameMonetize(popularity, category = 'All', rankOffset = 0) {
  const url = new URL(GAMEMONETIZE_FEED_URL);
  url.searchParams.set('format', 'json');
  url.searchParams.set('type', 'html5');
  url.searchParams.set('popularity', popularity);
  url.searchParams.set('category', category);
  url.searchParams.set('company', 'All');
  url.searchParams.set('amount', '500');
  url.searchParams.set('page', '1');

  const data = await fetchJson(url.toString());
  const rawGames = Array.isArray(data) ? data : [];

  return rawGames.map((raw, index) => makeGame({
    provider: 'gamemonetize',
    sourceId: raw.id,
    title: raw.title,
    description: raw.description,
    instructions: raw.instructions,
    thumb: raw.thumb,
    url: raw.url,
    sourceUrl: raw.url,
    category: raw.category || raw.tags,
    tags: typeof raw.tags === 'string' ? raw.tags.split(',') : [],
    width: raw.width,
    height: raw.height,
    developer: raw.developer || 'GameMonetize',
    popularity: popularity === 'mostplayed' ? Math.max(0, 1 - index / 500) : 0,
    sourceRank: rankOffset + index,
    // GameMonetize walkthrough videos need the separate video.php resolver.
    // Run scripts/sync-gamemonetize-videos.mjs after catalog sync.
    previewVideo: undefined,
  }));
}

async function fetchGameMonetizeCategories() {
  const pages = await Promise.all(
    GAMEMONETIZE_CATEGORY_FEEDS.map((category, categoryIndex) =>
      fetchGameMonetize('mostplayed', category, 500 + categoryIndex * 500)
    )
  );

  return pages.flat();
}

async function fetchGameDistribution() {
  if (!GAMEDISTRIBUTION_FEED_URL) return [];

  const data = await fetchJson(GAMEDISTRIBUTION_FEED_URL);
  const rawGames = Array.isArray(data) ? data : (data.games || data.data || data.items || []);
  if (!Array.isArray(rawGames)) return [];

  return rawGames.map((raw, index) => {
    const sourceId = raw.id || raw.gameId || raw.guid || raw.uuid || slugify(raw.title || raw.name);
    return makeGame({
      provider: 'gamedistribution',
      sourceId,
      title: raw.title || raw.name,
      description: raw.description || raw.desc,
      instructions: raw.instructions,
      thumb: raw.thumb || raw.thumbnail || raw.thumbnailUrl || raw.image || raw.icon,
      url: raw.embedUrl || raw.embed_url || raw.url || raw.gameUrl || raw.link,
      sourceUrl: raw.url || raw.link,
      category: raw.category || (Array.isArray(raw.categories) ? raw.categories[0] : ''),
      tags: Array.isArray(raw.tags) ? raw.tags : (Array.isArray(raw.categories) ? raw.categories : []),
      width: raw.width || 800,
      height: raw.height || 600,
      developer: raw.developer || raw.author || 'GameDistribution',
      dateAdded: raw.date || raw.createdAt || raw.updatedAt,
      orientation: raw.orientation,
      featured: Boolean(raw.featured),
      sourceRank: index,
    });
  });
}

async function loadProvider(name, loader) {
  try {
    const games = await loader();
    console.log(`${name}: ${games.length} raw games`);
    return games;
  } catch (error) {
    console.warn(`${name}: skipped (${error.message})`);
    return [];
  }
}

async function main() {
  const providerResults = await Promise.all([
    loadProvider('Famobi', fetchFamobi),
    loadProvider('GameDistribution', fetchGameDistribution),
    loadProvider('GamePix', fetchGamePix),
    loadProvider('GameMonetize popular', () => fetchGameMonetize('mostplayed')),
    loadProvider('GameMonetize newest', () => fetchGameMonetize('newest')),
    loadProvider('GameMonetize categories', fetchGameMonetizeCategories),
  ]);

  const games = dedupeAndSort(providerResults.flat());
  await mkdir(new URL('../data/', import.meta.url), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(games, null, 2)}\n`, 'utf8');

  const counts = games.reduce((acc, game) => {
    acc[game.provider] = (acc[game.provider] || 0) + 1;
    return acc;
  }, {});

  console.log(`Wrote ${games.length} games to ${OUT_FILE.pathname}`);
  console.table(counts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
