#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';

const CATALOG_FILE = new URL('../data/games.json', import.meta.url);
const REPORT_FILE = new URL('../data/famobi-playable-report.json', import.meta.url);

const FAMOBI_AFFILIATE_ID = process.env.FAMOBI_AFFILIATE_ID || 'A-FAMOBI-COM';
const CONCURRENCY = Number(process.env.FAMOBI_VERIFY_CONCURRENCY || 16);
const LIMIT = Number(process.env.FAMOBI_VERIFY_LIMIT || 0);
const VERIFY_CDN = process.env.FAMOBI_VERIFY_CDN !== '0';
const DRY_RUN = process.env.DRY_RUN === '1';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

function decodeJsString(value) {
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value.replace(/\\\//g, '/').replace(/\\u0026/g, '&');
  }
}

function extractRedirectUrl(html) {
  const match = html.match(/redirectUrl\s*=\s*["']([^"']+)["']/i);
  if (!match) return null;

  const value = decodeJsString(match[1]).replace(/&amp;/g, '&');

  try {
    const url = new URL(value);
    if (url.hostname !== 'games.cdn.famobi.com') return null;
    if (!url.pathname.includes('/html5games/')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function sourceIdFor(game) {
  if (game.sourceId) return String(game.sourceId).trim();

  if (game.sourceUrl) {
    try {
      const url = new URL(game.sourceUrl);
      const [, sourceId] = url.pathname.split('/').filter(Boolean);
      if (sourceId) return sourceId;
    } catch {}
  }

  return game.slug || game.id?.replace(/^famobi:/, '');
}

function cleanSourceId(value) {
  const clean = String(value || '').trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{1,80}$/.test(clean) ? clean : null;
}

function playUrlFor(sourceId) {
  return `https://play.famobi.com/${sourceId}/${encodeURIComponent(FAMOBI_AFFILIATE_ID)}`;
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'user-agent': USER_AGENT,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function probeCdn(url) {
  let response = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' }, 10000);

  if (response.status === 403 || response.status === 405) {
    response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        redirect: 'follow',
        headers: { range: 'bytes=0-2047' },
      },
      10000
    );
  }

  return {
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get('content-type') || '',
  };
}

async function verifyFamobiGame(game) {
  const sourceId = cleanSourceId(sourceIdFor(game));

  if (!sourceId) {
    return {
      ok: false,
      game,
      reason: 'invalid-source-id',
    };
  }

  const playUrl = playUrlFor(sourceId);

  try {
    const response = await fetchWithTimeout(playUrl, { redirect: 'follow' });

    if (!response.ok) {
      return {
        ok: false,
        game,
        sourceId,
        playUrl,
        reason: `play-url-http-${response.status}`,
      };
    }

    const html = await response.text();
    const directUrl = extractRedirectUrl(html);

    if (!directUrl) {
      return {
        ok: false,
        game,
        sourceId,
        playUrl,
        reason: 'missing-direct-cdn-url',
      };
    }

    const cdnProbe = VERIFY_CDN ? await probeCdn(directUrl) : { ok: true, status: 0, contentType: '' };

    if (!cdnProbe.ok) {
      return {
        ok: false,
        game,
        sourceId,
        playUrl,
        directUrl,
        reason: `cdn-http-${cdnProbe.status}`,
      };
    }

    return {
      ok: true,
      game: {
        ...game,
        sourceId,
        url: directUrl,
        sourceUrl: `https://play.famobi.com/${sourceId}`,
      },
      sourceId,
      playUrl,
      directUrl,
      cdnStatus: cdnProbe.status,
      contentType: cdnProbe.contentType,
    };
  } catch (error) {
    return {
      ok: false,
      game,
      sourceId,
      playUrl,
      reason: error instanceof Error ? error.message : 'unknown-error',
    };
  }
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
      if (done % 25 === 0 || done === items.length) {
        process.stdout.write(`\rChecked ${done}/${items.length} Famobi games`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  process.stdout.write('\n');
  return results;
}

function summarizeFailures(failures) {
  return failures.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  const games = JSON.parse(await readFile(CATALOG_FILE, 'utf8'));
  const famobiGames = games.filter((game) => game.provider === 'famobi');
  const nonFamobiGames = games.filter((game) => game.provider !== 'famobi');
  const targetFamobiGames = LIMIT > 0 ? famobiGames.slice(0, LIMIT) : famobiGames;

  console.log(`Famobi affiliate: ${FAMOBI_AFFILIATE_ID}`);
  console.log(`Famobi games in catalog: ${famobiGames.length}`);
  console.log(`Checking: ${targetFamobiGames.length}`);
  console.log(`Verify CDN: ${VERIFY_CDN ? 'yes' : 'no'}`);
  console.log(`Dry run: ${DRY_RUN ? 'yes' : 'no'}`);

  const results = await mapWithConcurrency(targetFamobiGames, CONCURRENCY, verifyFamobiGame);
  const playable = results.filter((result) => result.ok).map((result) => result.game);
  const failed = results.filter((result) => !result.ok);
  const skippedTail = LIMIT > 0 ? famobiGames.slice(LIMIT) : [];

  const playableById = new Map(playable.map((game) => [game.id, game]));
  const updatedCatalog = games
    .map((game) => {
      if (game.provider !== 'famobi') return game;
      if (playableById.has(game.id)) return playableById.get(game.id);
      if (skippedTail.some((skipped) => skipped.id === game.id)) return game;
      return null;
    })
    .filter(Boolean);

  const report = {
    generatedAt: new Date().toISOString(),
    affiliateId: FAMOBI_AFFILIATE_ID,
    verifyCdn: VERIFY_CDN,
    dryRun: DRY_RUN,
    totals: {
      before: games.length,
      nonFamobi: nonFamobiGames.length,
      famobiBefore: famobiGames.length,
      famobiChecked: targetFamobiGames.length,
      famobiPlayable: playable.length,
      famobiFailed: failed.length,
      famobiSkipped: skippedTail.length,
      after: updatedCatalog.length,
    },
    failuresByReason: summarizeFailures(failed),
    failed: failed.map((item) => ({
      id: item.game?.id,
      title: item.game?.title,
      sourceId: item.sourceId,
      reason: item.reason,
      playUrl: item.playUrl,
      directUrl: item.directUrl,
    })),
  };

  if (!DRY_RUN) {
    await writeFile(CATALOG_FILE, `${JSON.stringify(updatedCatalog, null, 2)}\n`);
  }
  await writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`);

  console.log('\nFamobi playable filter result');
  console.table(report.totals);
  console.log('\nFailures by reason');
  console.table(report.failuresByReason);
  console.log(`Report: ${REPORT_FILE.pathname}`);
  if (DRY_RUN) {
    console.log('Catalog was not changed because DRY_RUN=1.');
  } else {
    console.log(`Catalog updated: ${CATALOG_FILE.pathname}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
