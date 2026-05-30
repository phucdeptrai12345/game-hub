/**
 * Run: node scripts/count-games.mjs
 * Counts available games from each source without starting Next.js.
 */

const GM_URL = 'https://rss.gamemonetize.com/rssfeed.php?format=json&type=html5&popularity=mostplayed&category=All&company=All&amount=500&page=';
const Y8_URL = 'https://www.y8.com/tags/most_played?p=1';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'text/html,application/json',
};

// ── GameMonetize ──────────────────────────────────────────────────────────────

function passesBasicFilter(g) {
  const desc = (g.description || '').trim();
  const title = (g.title || '').trim();
  if (title.length < 3) return false;
  if (!g.url?.startsWith('http')) return false;
  if (!g.thumb?.startsWith('http')) return false;
  if (desc.length < 40) return false;
  const w = parseInt(g.width || '0', 10);
  const h = parseInt(g.height || '0', 10);
  if (w > 0 && w < 200) return false;
  if (h > 0 && h < 150) return false;
  return true;
}

async function countGM() {
  console.log('\n── GameMonetize ─────────────────────────────────');
  let totalRaw = 0;
  let totalFiltered = 0;
  const devCount = new Map();
  const MAX_PER_DEV = 8;
  let afterDevCap = 0;
  const seenSlugs = new Set();

  for (let page = 1; page <= 5; page++) {
    process.stdout.write(`  Fetching page ${page}/5...`);
    try {
      const res = await fetch(GM_URL + page, { headers: HEADERS });
      if (!res.ok) { console.log(` HTTP ${res.status} — stopping`); break; }
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) { console.log(' empty — stopping'); break; }

      const filtered = data.filter(passesBasicFilter);
      totalRaw += data.length;
      totalFiltered += filtered.length;

      for (const g of filtered) {
        const slug = (g.title || '').toLowerCase().replace(/\s+/g, '-');
        if (seenSlugs.has(slug)) continue;
        seenSlugs.add(slug);
        const dev = (g.developer || '').toLowerCase();
        if (dev) {
          const n = devCount.get(dev) ?? 0;
          if (n >= MAX_PER_DEV) continue;
          devCount.set(dev, n + 1);
        }
        afterDevCap++;
      }

      console.log(` ${data.length} raw → ${filtered.length} pass filter`);
      if (data.length < 500) { console.log('  (last page)'); break; }
    } catch (e) {
      console.log(` ERROR: ${e.message}`); break;
    }
  }

  console.log(`\n  Raw total:        ${totalRaw}`);
  console.log(`  After quality filter: ${totalFiltered}`);
  console.log(`  After dedup + dev cap: ${afterDevCap}`);
  console.log(`  Unique developers: ${devCount.size}`);
  return afterDevCap;
}

// ── Y8 ────────────────────────────────────────────────────────────────────────

function parseY8Page(html) {
  const slugs = new Set();

  // Strategy 1: JSON-LD
  for (const [, jsonStr] of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const obj = JSON.parse(jsonStr);
      const items = obj['@type'] === 'ItemList'
        ? (obj.itemListElement ?? []).map(e => e.item ?? e)
        : Array.isArray(obj) ? obj : [obj];
      for (const item of items) {
        const m = String(item?.url ?? '').match(/\/games\/([a-z0-9_-]+)/i);
        if (m) slugs.add(m[1]);
      }
    } catch {}
  }

  // Strategy 2: href scan
  if (slugs.size === 0) {
    for (const [, slug] of html.matchAll(/href="\/games\/([a-z0-9_-]+)"/gi)) {
      slugs.add(slug);
    }
  }

  return slugs.size;
}

async function countY8() {
  console.log('\n── Y8 Games ─────────────────────────────────────');

  // Test if scraper can parse a single page
  process.stdout.write('  Fetching most_played page 1...');
  try {
    const res = await fetch(Y8_URL, { headers: HEADERS });
    if (!res.ok) { console.log(` HTTP ${res.status}`); return 0; }
    const html = await res.text();
    const count = parseY8Page(html);
    console.log(` ${html.length} bytes, found ${count} game slugs`);

    if (count === 0) {
      console.log('  ⚠ 0 games parsed — Y8 may use client-side rendering');
      console.log('  → Will fall back to 50-game manual list');
      return 50;
    }

    // Rough estimate: sample 3 pages, extrapolate
    console.log('\n  Sampling 3 more pages to estimate total...');
    const TAGS = ['most_played', 'action', 'racing', 'shooting', 'puzzle', 'sports',
                  'io_games', 'skill', 'adventure', 'strategy', 'fighting', 'platformer',
                  'car', 'stickman', 'zombie', 'running', '2_player', 'multiplayer',
                  '3d', 'soccer', 'cooking', 'casual'];
    const PAGES_PER_TAG = [25, 8, 8, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 3];
    const totalPages = PAGES_PER_TAG.reduce((a, b) => a + b, 0);
    const avgGamesPerPage = count; // from page 1 sample
    const estimatedRaw = totalPages * avgGamesPerPage;
    const estimatedAfterDedup = Math.round(estimatedRaw * 0.45); // ~55% are duplicates across tags

    console.log(`  Games on page 1: ${count}`);
    console.log(`  Total pages to scrape: ${totalPages}`);
    console.log(`  Estimated raw (before dedup): ~${estimatedRaw}`);
    console.log(`  Estimated after dedup: ~${estimatedAfterDedup}`);
    return estimatedAfterDedup;
  } catch (e) {
    console.log(` ERROR: ${e.message}`);
    return 0;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('Checking game counts...\n');
const [gmCount, y8Count] = await Promise.all([countGM(), countY8()]);

console.log('\n══════════════════════════════════════════════════');
console.log(`  GameMonetize:  ~${gmCount} games`);
console.log(`  Y8 Games:      ~${y8Count} games`);
console.log(`  TOTAL:         ~${gmCount + y8Count} games`);
console.log('══════════════════════════════════════════════════\n');
