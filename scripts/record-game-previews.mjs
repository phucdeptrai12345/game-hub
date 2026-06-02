#!/usr/bin/env node

import { chromium } from 'playwright';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CATALOG_FILE = new URL('../data/games.json', import.meta.url);
const PREVIEW_DIR = new URL('../public/previews/', import.meta.url);
const TEMP_DIR = new URL('../.tmp/previews/', import.meta.url);
const REPORT_FILE = new URL('../data/game-preview-record-report.json', import.meta.url);

const PREVIEW_DIR_PATH = fileURLToPath(PREVIEW_DIR);
const TEMP_DIR_PATH = fileURLToPath(TEMP_DIR);
const REPORT_FILE_PATH = fileURLToPath(REPORT_FILE);

const BASE_URL = process.env.PREVIEW_BASE_URL || 'http://localhost:3000';
const COUNT = Number(process.env.PREVIEW_COUNT || 6);
const SECONDS = Number(process.env.PREVIEW_SECONDS || 7);
const WARMUP_SECONDS = Number(process.env.PREVIEW_WARMUP_SECONDS || 12);
const WIDTH = Number(process.env.PREVIEW_WIDTH || 960);
const HEIGHT = Number(process.env.PREVIEW_HEIGHT || 540);
const SLUGS = (process.env.PREVIEW_SLUGS || '')
  .split(',')
  .map((slug) => slug.trim())
  .filter(Boolean);
const FORCE = process.env.PREVIEW_FORCE === '1';
const FFMPEG_PATH =
  process.env.FFMPEG_PATH ||
  path.join(process.env.LOCALAPPDATA || '', 'ms-playwright', 'ffmpeg-1011', 'ffmpeg-win64.exe');

function localPreviewPath(slug) {
  return path.join(PREVIEW_DIR_PATH, `${slug}.webm`);
}

function publicPreviewUrl(slug) {
  return `/previews/${slug}.webm`;
}

function shouldRecord(game) {
  if (SLUGS.length > 0) return SLUGS.includes(game.slug);
  if (!FORCE && game.previewVideo?.startsWith('/previews/')) return false;
  return true;
}

async function ensureServer() {
  const response = await fetch(BASE_URL, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) {
    throw new Error(`Local site returned ${response.status}`);
  }
}

async function focusGame(page) {
  const box = await page.locator('.game-frame-shell').boundingBox();
  if (!box) return;

  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(250);
}

async function playDemoInput(page, durationMs) {
  const deadline = Date.now() + durationMs;
  const keys = ['ArrowRight', 'ArrowUp', 'Space', 'ArrowLeft', 'ArrowDown', 'Space'];
  let index = 0;

  while (Date.now() < deadline) {
    const key = keys[index % keys.length];
    index += 1;

    await page.keyboard.down(key).catch(() => {});
    await page.waitForTimeout(180);
    await page.keyboard.up(key).catch(() => {});

    if (index % 3 === 0) {
      await page.mouse.move(WIDTH * 0.35, HEIGHT * 0.42, { steps: 5 }).catch(() => {});
      await page.mouse.down().catch(() => {});
      await page.mouse.move(WIDTH * 0.66, HEIGHT * 0.56, { steps: 8 }).catch(() => {});
      await page.mouse.up().catch(() => {});
    }

    await page.waitForTimeout(420);
  }
}

async function trimTailVideo(inputPath, outputPath, seconds) {
  const { spawn } = await import('node:child_process');

  if (!existsSync(FFMPEG_PATH)) {
    await copyFile(inputPath, outputPath);
    return;
  }

  await new Promise((resolve, reject) => {
    const child = spawn(FFMPEG_PATH, [
      '-y',
      '-sseof',
      `-${seconds}`,
      '-i',
      inputPath,
      '-t',
      String(seconds),
      '-an',
      '-c:v',
      'libvpx',
      '-deadline',
      'realtime',
      '-cpu-used',
      '8',
      '-b:v',
      '900k',
      outputPath,
    ], { stdio: 'ignore' });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function isolateGameFrame(page) {
  await page.addStyleTag({
    content: `
      html, body { width: 100% !important; height: 100% !important; margin: 0 !important; overflow: hidden !important; background: #000 !important; }
      body > *:not(script):not(style) { visibility: hidden !important; }
      .game-frame-shell,
      .game-frame-shell * { visibility: visible !important; }
      .game-frame-shell {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        aspect-ratio: auto !important;
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        z-index: 2147483647 !important;
        background: #000 !important;
      }
      .game-frame-shell iframe {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        border: 0 !important;
      }
      .game-frame-shell .scanlines,
      .game-frame-shell button,
      .ambient-glow-bg { display: none !important; }
    `,
  });

  await page.evaluate(() => {
    const shell = document.querySelector('.game-frame-shell');
    shell?.scrollIntoView({ block: 'center', inline: 'center' });
  });
}

async function recordGame(browser, game) {
  const outputPath = localPreviewPath(game.slug);

  if (!FORCE && existsSync(outputPath)) {
    return {
      ok: true,
      skipped: true,
      slug: game.slug,
      previewVideo: publicPreviewUrl(game.slug),
    };
  }

  await rm(TEMP_DIR_PATH, { recursive: true, force: true });
  await mkdir(TEMP_DIR_PATH, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: TEMP_DIR_PATH,
      size: { width: WIDTH, height: HEIGHT },
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    await page.goto(`${BASE_URL}/preview/${game.slug}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('.game-frame-shell iframe', { state: 'attached', timeout: 30000 });
    await page.waitForTimeout(1500);
    await isolateGameFrame(page);
    await page.waitForTimeout(WARMUP_SECONDS * 1000);
    await focusGame(page);
    await page.waitForTimeout(400);
    await playDemoInput(page, SECONDS * 1000);
    await page.waitForTimeout(500);

    const video = page.video();
    await context.close();

    if (!video) {
      throw new Error('Playwright did not create a video');
    }

    const videoPath = await video.path();
    await mkdir(PREVIEW_DIR_PATH, { recursive: true });
    await trimTailVideo(videoPath, outputPath, SECONDS);

    return {
      ok: true,
      skipped: false,
      slug: game.slug,
      title: game.title,
      previewVideo: publicPreviewUrl(game.slug),
    };
  } catch (error) {
    await context.close().catch(() => {});
    return {
      ok: false,
      slug: game.slug,
      title: game.title,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function main() {
  await ensureServer();
  await mkdir(PREVIEW_DIR_PATH, { recursive: true });

  const games = JSON.parse(await readFile(CATALOG_FILE, 'utf8'));
  const targets = games.filter(shouldRecord).slice(0, COUNT);

  if (targets.length === 0) {
    console.log('No games selected for recording.');
    return;
  }

  console.log(`Recording ${targets.length} previews from ${BASE_URL}`);
  console.log(`Viewport: ${WIDTH}x${HEIGHT}, warmup: ${WARMUP_SECONDS}s, duration: ${SECONDS}s`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const [index, game] of targets.entries()) {
    console.log(`[${index + 1}/${targets.length}] ${game.title}`);
    const result = await recordGame(browser, game);
    results.push(result);
    console.log(result.ok ? `  -> ${result.previewVideo}${result.skipped ? ' (exists)' : ''}` : `  -> failed: ${result.error}`);
  }

  await browser.close();

  const previewBySlug = new Map(
    results.filter((result) => result.ok).map((result) => [result.slug, result.previewVideo])
  );
  const updatedGames = games.map((game) => (
    previewBySlug.has(game.slug)
      ? { ...game, previewVideo: previewBySlug.get(game.slug) }
      : game
  ));

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    count: targets.length,
    seconds: SECONDS,
    warmupSeconds: WARMUP_SECONDS,
    size: { width: WIDTH, height: HEIGHT },
    success: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  };

  await writeFile(CATALOG_FILE, `${JSON.stringify(updatedGames, null, 2)}\n`);
  await writeFile(REPORT_FILE_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log('\nRecord result');
  console.table({ success: report.success, failed: report.failed });
  console.log(`Report: ${REPORT_FILE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
