/**
 * Run: node scripts/build-y8-list.mjs
 *
 * Fetches Y8 sitemap → extracts slugs → filters by category tags → fetches
 * og:image + og:title for each game in batches → writes game-hub/lib/y8-games-extended.json
 *
 * Takes ~5-10 min for 500 games (ISR will cache after first run).
 * Pass a limit: node scripts/build-y8-list.mjs 200
 */

import { writeFile, readFile } from 'fs/promises';
import { gunzip } from 'zlib';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const gunzipAsync = promisify(gunzip);
const __dir = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(__dir, '..', 'lib', 'y8-games-extended.json');

const LIMIT = parseInt(process.argv[2] || '500', 10);
const BATCH = 8; // concurrent requests

const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'text/html',
};

// Slug keyword → portal category slug
// Rules: prefer specific suffixed/prefixed patterns to avoid false matches
const SLUG_CATEGORY = [
  [['moto', 'motorbike', 'bike_race', 'dirt_bike', 'bmx', 'bike_mania', 'bike_'], 'racing'],
  [['car_', '_car_', 'drift', 'rally', 'kart', 'racing', 'road_race', 'highway', 'turbo_', 'nitro', 'speed_'], 'racing'],
  [['shoot', 'sniper', 'gun_', '_gun', 'bullet', 'warfare', 'military', 'combat', 'war_', 'tank_', 'micro_tank', 'galaga', 'gunner'], 'shooting'],
  [['puzzle', 'block_puzzle', 'mahjong', 'sudoku', '2048', 'tetris', 'bubble_', 'bloxor', 'glassez', 'frescoz', 'connect_4', 'bejeweled', 'jewel_'], 'puzzle'],
  [['football', 'soccer', 'penalty', 'free_kick'], 'soccer'],
  [['basketball', 'hoops', 'slam_dunk', 'tennis', 'baseball', 'volleyball', '_golf', 'cricket', 'sport_', 'sprinter_', 'swimming', 'ski_', 'snowboard', 'skateboard'], 'sports'],
  // IO: only slugs that end with _io (real .io games)
  [['_io'], 'io'],
  [['stickman', 'stick_man'], 'stickman'],
  [['zombie', '_dead_', 'undead'], 'zombie'],
  [['_runner', 'running_', 'endless_run', 'temple_run', 'canabalt', 'subway_surf', 'jetpack_', 'robot_unicorn'], 'running'],
  [['_platform', 'platformer', 'jump_king', 'mario_', 'sonic_', 'megaman', 'spelunky'], 'platformer'],
  [['_fight', 'boxing', 'punch_', 'martial', 'battle_arena', 'swords_and_sandals', 'street_fighter', 'brawl_'], 'fighting'],
  [['strategy_', 'tower_defense', 'age_of_war', 'kingdom_', 'territory_war', 'bomb_it'], 'strategy'],
  [['cooking_', 'pizza_', 'burger_', 'sushi_', 'bakery', 'chef_', 'papa_', '_diner', 'restaurant_'], 'cooking'],
  [['makeup', 'dress_up', 'dressup', 'fashion_', 'beauty_', '_salon', 'princess_', 'patchgirl', 'makeover'], 'beauty'],
  [['adventure_', 'quest_', 'dungeon_', '_rpg', 'riddle_school', 'sonny_', 'sinjid', 'raze_', 'learn_to_fly', 'fancy_pants'], 'adventure'],
  [['_3d', '3d_', 'kogama'], '3d'],
  [['2player', 'two_player', '2_player'], '2player'],
  [['slope_', 'geometry_dash', 'curve_ball', 'flappy_'], 'skill'],
  [['ninja_', '_ninja', 'gold_miner', 'kitten_cannon', 'bowman_', 'siege_hero'], 'action'],
  [['_run', 'run_'], 'running'],
];

function decodeHtml(str) {
  if (!str) return str;
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&nbsp;/g, ' ').trim();
}

function inferCategory(slug) {
  const s = slug.toLowerCase();
  for (const [keywords, cat] of SLUG_CATEGORY) {
    if (keywords.some(k => s.includes(k))) return cat;
  }
  return 'casual';
}

function slugToTitle(slug) {
  return slug
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+\d+$/, (m) => m) // keep trailing numbers
    .trim();
}

async function fetchGameMeta(slug) {
  try {
    const res = await fetch(`https://www.y8.com/games/${slug}`, { headers: H });
    if (!res.ok) return null;
    const html = await res.text();

    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
                 || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1];
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
                 || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
                || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1];

    if (!ogImage || !ogImage.startsWith('http')) return null;

    // Clean title: decode HTML entities, remove " - Play Now on Y8.com" suffix
    const title = decodeHtml((ogTitle || slugToTitle(slug))
      .replace(/\s*[-|]\s*(Play|Free|Online|Y8\.com|Y8).*$/i, '')
      .trim());

    return {
      y8Slug: slug,
      title: title || slugToTitle(slug),
      category: inferCategory(slug),
      thumb: ogImage,
      description: decodeHtml(ogDesc) || '',
    };
  } catch {
    return null;
  }
}

async function fetchSitemapSlugs() {
  const allSlugs = [];
  for (const n of [1, 2]) {
    const url = `https://www.y8.com/sitemaps/y8/en/sitemap${n}.xml.gz`;
    const res = await fetch(url, { headers: H });
    const buf = Buffer.from(await res.arrayBuffer());
    const xml = (await gunzipAsync(buf)).toString('utf8');
    const slugs = [...xml.matchAll(/https:\/\/www\.y8\.com\/games\/([a-z0-9_-]+)/gi)].map(m => m[1]);
    allSlugs.push(...[...new Set(slugs)]);
  }
  return [...new Set(allSlugs)];
}

// Load existing slugs so we don't re-fetch them
async function loadExisting() {
  try {
    const raw = await readFile(OUT_FILE, 'utf8');
    const data = JSON.parse(raw);
    return new Set(data.map(g => g.y8Slug));
  } catch {
    return new Set();
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`Building Y8 game list (limit: ${LIMIT} new games)...\n`);

const allSlugs = await fetchSitemapSlugs();
console.log(`Total slugs in sitemap: ${allSlugs.length}`);

// Load existing to skip
const existing = await loadExisting();
console.log(`Already fetched: ${existing.size}`);

// Known manual list slugs (skip these too — already in y8-games.ts)
const MANUAL = new Set([
  'slope','vex_3','vex_4','death_run_3d','geometry_jump_','stickman_boost','stickman_boost_2',
  'ball_fall_3d','parkour_go_2_urban','skytrip','moto_x3m','moto_x3m_2','moto_x3m_3',
  'moto_x3m_spooky_land','earn_to_die_v1','burnout_drift','turbo_moto_racer','traffic_tour',
  'rally_point_xform','gun_mayhem','gun_mayhem_redux','hide_online','crime_city_3d',
  'freefall_tournament','evowars_io','gunblood','dead_zed_2','hazmob_fps',
  'fireboy_and_watergirl_forest_temple','fireboy_and_watergirl_5_elements','haunt_the_house',
  'swords_souls_a_soul_adventure','dragon_fist_3_age_of_the_warrior','mutant_fighting_cup',
  'penalty_shooters_2','football_legends_2019','basketball_legends','fish_eat_fish_3_players',
  'hole_io','worms_zone','om_nom_run','age_of_war_2','orion_sandbox','short_life',
  'dumb_ways_to_die_original','elastic_man','papa_s_freezeria','papas_cheeseria','perfect_piano',
]);

const toFetch = allSlugs.filter(s => !existing.has(s) && !MANUAL.has(s)).slice(0, LIMIT);
console.log(`Will fetch: ${toFetch.length} games\n`);

const results = [];
let ok = 0, skip = 0;

for (let i = 0; i < toFetch.length; i += BATCH) {
  const batch = toFetch.slice(i, i + BATCH);
  const metas = await Promise.all(batch.map(fetchGameMeta));

  for (const meta of metas) {
    if (meta) { results.push(meta); ok++; }
    else skip++;
  }

  const pct = Math.round((i + batch.length) / toFetch.length * 100);
  process.stdout.write(`\r  ${i + batch.length}/${toFetch.length} (${pct}%) — found: ${ok}, no image: ${skip}`);
}

console.log('\n');

// Merge with existing
let existing_data = [];
try { existing_data = JSON.parse(await readFile(OUT_FILE, 'utf8')); } catch {}
const merged = [...existing_data, ...results];

await writeFile(OUT_FILE, JSON.stringify(merged, null, 2), 'utf8');
console.log(`✓ Saved ${merged.length} games to lib/y8-games-extended.json`);
console.log(`  New this run: ${results.length} games with thumbnails`);
console.log(`  Skipped (no image/404): ${skip}`);
