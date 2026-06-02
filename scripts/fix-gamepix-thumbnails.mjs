#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';

const CATALOG_FILE = new URL('../data/games.json', import.meta.url);
const REPORT_FILE = new URL('../data/gamepix-thumbnail-report.json', import.meta.url);
const CONCURRENCY = Number(process.env.GAMEPIX_THUMB_CONCURRENCY || 24);

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function candidatesFor(src) {
  if (!src || !src.includes('games.assets.gamepix.com') || !src.includes('/thumbnail/')) {
    return [src].filter(Boolean);
  }

  const big = src.replace(/\/thumbnail\/(?:small|medium|big)\.png(?:\?.*)?$/i, '/thumbnail/big.png');
  const medium = src.replace(/\/thumbnail\/(?:small|medium|big)\.png(?:\?.*)?$/i, '/thumbnail/medium.png');
  const small = src.replace(/\/thumbnail\/(?:small|medium|big)\.png(?:\?.*)?$/i, '/thumbnail/small.png');
  return unique([big, medium, small]);
}

async function headOk(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        accept: 'image/avif,image/webp,image/png,image/jpeg,*/*',
        'user-agent': USER_AGENT,
      },
    });

    const type = response.headers.get('content-type') || '';
    return response.ok && type.startsWith('image/');
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function chooseThumbnail(game) {
  const candidates = candidatesFor(game.thumb);

  for (const url of candidates) {
    if (await headOk(url)) {
      return { game, ok: true, url };
    }
  }

  return { game, ok: false, url: game.thumb };
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
      done += 1;
      if (done % 100 === 0 || done === items.length) {
        process.stdout.write(`\rChecked ${done}/${items.length} GamePix thumbnails`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  process.stdout.write('\n');
  return results;
}

async function main() {
  const games = JSON.parse(await readFile(CATALOG_FILE, 'utf8'));
  const gamepixGames = games.filter((game) => game.provider === 'gamepix');

  console.log(`GamePix games: ${gamepixGames.length}`);
  const results = await mapWithConcurrency(gamepixGames, CONCURRENCY, chooseThumbnail);

  let changed = 0;
  const failed = [];
  const chosenById = new Map();

  for (const result of results) {
    if (!result.ok) {
      failed.push({
        id: result.game.id,
        title: result.game.title,
        thumb: result.game.thumb,
      });
      continue;
    }

    chosenById.set(result.game.id, result.url);
    if (result.url !== result.game.thumb) changed += 1;
  }

  const updatedGames = games.map((game) => {
    if (game.provider !== 'gamepix') return game;
    const thumb = chosenById.get(game.id);
    return thumb ? { ...game, thumb } : game;
  });

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      gamepix: gamepixGames.length,
      changed,
      failed: failed.length,
    },
    failed,
  };

  await writeFile(CATALOG_FILE, `${JSON.stringify(updatedGames, null, 2)}\n`);
  await writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`);

  console.log('\nGamePix thumbnail fix result');
  console.table(report.totals);
  console.log(`Report: ${REPORT_FILE.pathname}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
