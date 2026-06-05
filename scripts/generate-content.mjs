/**
 * Bulk-generate AI content for all games using Groq + Mistral in parallel.
 * Two workers run concurrently — each picks from the same queue.
 * Skips games that already have a cached file in data/game-content/.
 *
 * Usage:
 *   node scripts/generate-content.mjs             — generate all missing
 *   node scripts/generate-content.mjs --limit 100 — only first 100 missing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load .env.local ────────────────────────────────────────────────────────
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
  console.error('❌  GROQ_API_KEY not found in .env.local');
  process.exit(1);
}

// ── CLI args ───────────────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const limitArg = args.indexOf('--limit');
const LIMIT    = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : Infinity;

// ── Paths ──────────────────────────────────────────────────────────────────
const GAMES_FILE = path.join(ROOT, 'data', 'games.json');
const CACHE_DIR  = path.join(ROOT, 'data', 'game-content');

if (!fs.existsSync(GAMES_FILE)) {
  console.error('❌  data/games.json not found');
  process.exit(1);
}
fs.mkdirSync(CACHE_DIR, { recursive: true });

// ── Load and filter games ──────────────────────────────────────────────────
const allGames = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf-8'));
const games    = allGames
  .filter((g) => g.slug && g.title && g.description && g.provider !== 'famobi')
  .sort((a, b) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0));

const missing = games.filter((g) => !fs.existsSync(path.join(CACHE_DIR, `${g.slug}.json`)));
const todo    = missing.slice(0, LIMIT);

console.log(`\n📚  Games total:    ${games.length.toLocaleString()}`);
console.log(`✅  Already cached: ${(games.length - missing.length).toLocaleString()}`);
console.log(`📝  To generate:    ${todo.length.toLocaleString()}${LIMIT < Infinity ? ` (limited to ${LIMIT})` : ''}`);
console.log(`🤖  Worker:         groq (llama-3.1-8b-instant)\n`);

if (todo.length === 0) {
  console.log('✨  Nothing to do — all games already have cached content.');
  process.exit(0);
}

// ── Prompt ─────────────────────────────────────────────────────────────────
function buildPrompt(game) {
  return `You are a passionate game reviewer writing a comprehensive review and strategy guide for "${game.title}", a ${game.category} browser game${game.developer ? ` by ${game.developer}` : ''}.

Game description: ${game.description || 'A fun browser game.'}
${game.instructions ? `Controls/Instructions: ${game.instructions}` : ''}

Write a LONG, DETAILED review and guide with the following structure:

1. Introduction (3-4 paragraphs): Hook the reader, explain what the game is, its genre, core premise, and why it stands out.

2. Six to eight sections, each with 3-4 paragraphs. Cover:
   - Core Gameplay Mechanics
   - What Makes It Addictive
   - Visual Style and Atmosphere
   - Beginner Tips and Tricks
   - Advanced Strategies
   - Game Modes and Features
   - Who Should Play This Game
   - Final Thoughts on Replayability

3. Conclusion (2-3 paragraphs): Final verdict, who it's perfect for.

STRICT RULES:
- MINIMUM 1500 words total
- No markdown symbols (no **, no ##, no *, no _)
- Plain paragraphs only

Respond ONLY with valid JSON:
{
  "intro": "paragraph1\\n\\nparagraph2\\n\\nparagraph3",
  "sections": [
    {"heading": "Section Title", "body": "paragraph1\\n\\nparagraph2\\n\\nparagraph3"},
    ...
  ],
  "conclusion": "paragraph1\\n\\nparagraph2"
}`;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    // Try to salvage truncated JSON by closing open structures
    let fixed = text.trimEnd();
    // Close open string
    if ((fixed.match(/"/g) ?? []).length % 2 !== 0) fixed += '"';
    // Close open objects/arrays
    const opens = [...fixed].reduce((d, c) => {
      if (c === '{' || c === '[') d.push(c);
      else if (c === '}' || c === ']') d.pop();
      return d;
    }, []);
    for (const c of opens.reverse()) fixed += c === '{' ? '}' : ']';
    return JSON.parse(fixed);
  }
}

function validate(parsed) {
  if (!parsed?.intro || !Array.isArray(parsed?.sections)) throw new Error('Invalid JSON shape');
  return parsed;
}

// ── API callers ────────────────────────────────────────────────────────────
const groqClient = GROQ_KEY ? new Groq({ apiKey: GROQ_KEY }) : null;

async function callGroq(game) {
  const res = await groqClient.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: buildPrompt(game) }],
    temperature: 0.75,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  });
  return validate(JSON.parse(res.choices[0]?.message?.content ?? '{}'));
}

async function callMistral(game) {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_KEY}`,
    },
    body: JSON.stringify({
      model: 'open-mistral-7b',
      messages: [{ role: 'user', content: buildPrompt(game) }],
      temperature: 0.75,
      max_tokens: 16384,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    const e = new Error(err.slice(0, 120));
    e.status = res.status;
    throw e;
  }
  const json = await res.json();
  return validate(parseJson(json.choices[0]?.message?.content ?? '{}'));
}

// ── Shared queue ───────────────────────────────────────────────────────────
let queueIdx = 0;
let done = 0, errors = 0;
const startTime = Date.now();
const PAD = String(todo.length).length;

function nextGame() {
  if (queueIdx >= todo.length) return null;
  return todo[queueIdx++];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Worker ─────────────────────────────────────────────────────────────────
async function worker(name, callFn, delayMs) {
  try {
    while (true) {
      const game = nextGame();
      if (!game) break;

      const displayIdx = String(queueIdx).padStart(PAD, ' ');
      const prefix = `[${displayIdx}/${todo.length}][${name}]`;
      const label  = game.title.slice(0, 40).padEnd(40);

      let attempts = 0;
      let success  = false;

      while (attempts < 6) {
        attempts++;
        try {
          const content = await callFn(game);
          fs.writeFileSync(
            path.join(CACHE_DIR, `${game.slug}.json`),
            JSON.stringify(content, null, 2),
            'utf-8'
          );
          done++;
          const elapsed   = Math.round((Date.now() - startTime) / 1000);
          const rate      = done / (elapsed || 1);
          const left      = Math.round((todo.length - done) / rate);
          const leftStr   = left > 3600 ? `${(left/3600).toFixed(1)}h` : `${Math.round(left/60)}m`;
          console.log(`${prefix} ✅  ${label}  (~${leftStr} left)`);
          success = true;
          break;
        } catch (err) {
          const msg   = String(err?.message ?? '');
          const is429 = err?.status === 429 || msg.includes('429') || msg.toLowerCase().includes('rate limit');
          if (is429 && attempts < 6) {
            const backoff = Math.min(attempts * 30000, 120000);
            console.log(`${prefix} ⏳  ${label}  rate limit, waiting ${backoff/1000}s...`);
            await sleep(backoff);
          } else if (attempts < 6) {
            console.log(`${prefix} ⚠️   ${label}  retry ${attempts}: ${msg.slice(0, 80)}`);
            await sleep(4000);
          } else {
            console.log(`${prefix} ❌  ${label}  ${msg.slice(0, 80)}`);
            errors++;
          }
        }
      }

      if (success) await sleep(delayMs);
    }
    console.log(`\n[${name}] ✔  Worker finished.`);
  } catch (fatal) {
    console.error(`\n[${name}] 💀 Worker crashed: ${fatal?.message ?? fatal}`);
  }
}

await worker('groq', callGroq, 3000);

// ── Summary ────────────────────────────────────────────────────────────────
const totalSecs = Math.round((Date.now() - startTime) / 1000);
const mins = Math.floor(totalSecs / 60), secs = totalSecs % 60;
console.log(`\n${'─'.repeat(65)}`);
console.log(`✅  Generated: ${done}  ❌ Failed: ${errors}  ⏱ Time: ${mins}m ${secs}s`);
console.log(`📁  Saved to: data/game-content/`);
