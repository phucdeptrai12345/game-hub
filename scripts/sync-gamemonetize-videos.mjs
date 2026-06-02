#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';

const DATA_FILE = new URL('../data/games.json', import.meta.url);
const REPORT_FILE = new URL('../data/gamemonetize-video-sync-report.json', import.meta.url);

const LIMIT_ENV = process.env.GM_VIDEO_LIMIT || 'all';
const LIMIT = LIMIT_ENV.toLowerCase() === 'all' ? Infinity : Number(LIMIT_ENV);
const CONCURRENCY = Number(process.env.GM_VIDEO_CONCURRENCY || 8);
const FORCE = process.env.GM_VIDEO_FORCE === '1';
const DOMAIN = process.env.GM_VIDEO_DOMAIN || 'localhost';

const GAMEMONETIZE_ID_RE = /^[a-z0-9]{24,}$/i;

function idFromPathSegment(segment) {
  if (!segment) return null;
  const clean = segment.replace(/\.mp4$/i, '').split('-')[0];
  return GAMEMONETIZE_ID_RE.test(clean) ? clean : null;
}

function getGameMonetizeVideoId(game) {
  for (const value of [game.url, game.sourceUrl, game.thumb, game.previewVideo]) {
    if (!value) continue;

    try {
      const url = new URL(value);
      const segments = url.pathname.split('/').filter(Boolean);

      if (url.hostname === 'gamemonetize.video' && segments[0] === 'video') {
        const id = idFromPathSegment(segments[1]);
        if (id) return id;
      }

      if (url.hostname.endsWith('gamemonetize.co') || url.hostname.endsWith('gamemonetize.com')) {
        const id = idFromPathSegment(segments[0]);
        if (id) return id;
      }
    } catch {}
  }

  return null;
}

function isResolvedGameMonetizeVideo(src) {
  if (!src) return false;

  try {
    const url = new URL(src);
    return url.hostname === 'gamemonetize.video' && url.pathname.startsWith('/video/') && url.pathname.endsWith('.mp4');
  } catch {
    return false;
  }
}

async function fetchVideoUrl(game, token) {
  const params = new URLSearchParams({
    page_url: DOMAIN,
    gameid: token,
    game: game.title,
  });

  const res = await fetch(`https://gamemonetize.video/video.php?${params.toString()}`, {
    headers: { accept: 'application/json,*/*' },
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const json = await res.json();
  const mediaUrl = json?.data?.detail?.[0]?.mediaURL;
  if (!json?.isSuccess || typeof mediaUrl !== 'string') {
    throw new Error('no video data');
  }

  if (!mediaUrl.includes(`/video/${token}-`)) {
    throw new Error('video id mismatch');
  }

  return mediaUrl.replace(/^http:\/\//i, 'https://');
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

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function main() {
  const games = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  const candidates = games
    .map((game, index) => ({ game, index, token: game.provider === 'gamemonetize' ? getGameMonetizeVideoId(game) : null }))
    .filter(({ game, token }) => {
      if (!token) return false;
      if (!FORCE && game.previewVideo?.startsWith('/previews/')) return false;
      if (!FORCE && isResolvedGameMonetizeVideo(game.previewVideo)) return false;
      return true;
    })
    .slice(0, Number.isFinite(LIMIT) ? LIMIT : undefined);

  let updated = 0;
  const failures = [];

  await mapWithConcurrency(candidates, CONCURRENCY, async ({ game, index, token }, order) => {
    try {
      const previewVideo = await fetchVideoUrl(game, token);
      games[index] = { ...game, previewVideo };
      updated += 1;
      if ((order + 1) % 25 === 0) {
        console.log(`Resolved ${order + 1}/${candidates.length} GameMonetize videos`);
      }
    } catch (error) {
      failures.push({
        id: game.id,
        title: game.title,
        token,
        error: error.message,
      });
    }
  });

  await writeFile(DATA_FILE, `${JSON.stringify(games, null, 2)}\n`, 'utf8');
  await writeFile(REPORT_FILE, `${JSON.stringify({
    checked: candidates.length,
    updated,
    failed: failures.length,
    failures: failures.slice(0, 100),
  }, null, 2)}\n`, 'utf8');

  console.log(`Updated ${updated}/${candidates.length} GameMonetize video previews`);
  if (failures.length) console.log(`Failures: ${failures.length}; see ${REPORT_FILE.pathname}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
