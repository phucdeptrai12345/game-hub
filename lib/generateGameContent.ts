import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import type { Game } from './types';

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const CACHE_DIR = path.join(process.cwd(), 'data', 'game-content');

export interface GeneratedContent {
  intro: string;
  sections: { heading: string; body: string }[];
  conclusion: string;
}

function cacheFile(slug: string) {
  return path.join(CACHE_DIR, `${slug}.json`);
}

function readCache(slug: string): GeneratedContent | null {
  try {
    const file = cacheFile(slug);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as GeneratedContent;
  } catch {
    return null;
  }
}

function writeCache(slug: string, content: GeneratedContent) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cacheFile(slug), JSON.stringify(content, null, 2), 'utf-8');
  } catch {
    // non-fatal — page still works without cache
  }
}

export function readGameContent(slug: string): GeneratedContent | null {
  return readCache(slug);
}

export async function generateGameContent(game: Game): Promise<GeneratedContent | null> {
  if (!process.env.GROQ_API_KEY) return null;

  const cached = readCache(game.slug);
  if (cached) return cached;

  const prompt = `You are a passionate game reviewer writing a comprehensive review and strategy guide for "${game.title}", a ${game.category} browser game${game.developer ? ` by ${game.developer}` : ''}.

Game description: ${game.description || 'A fun browser game.'}
${game.instructions ? `Controls/Instructions: ${game.instructions}` : ''}

Write a LONG, DETAILED review and guide with the following structure:

1. Introduction (3-4 paragraphs): Hook the reader, explain what the game is, its genre, core premise, and why it stands out. Give context about similar games in this genre.

2. Six to eight detailed sections. Each section MUST have 3-5 paragraphs. Cover:
   - Core Gameplay Mechanics (how the game works in detail)
   - What Makes It Addictive (the hook, progression, rewards)
   - Visual Style and Atmosphere (graphics, sound, feel)
   - Beginner Tips and Tricks (5-7 specific actionable tips)
   - Advanced Strategies (for players who want to master it)
   - Game Modes and Features (variety, replay value)
   - Who Should Play This Game (target audience, comparisons)
   - Final Thoughts on Replayability

3. Conclusion (2-3 paragraphs): Final verdict, rating justification, who it's perfect for.

STRICT RULES:
- MINIMUM 2000 words total — write as much as possible
- Each section body must be at minimum 3 full paragraphs
- Be specific to the ${game.category} genre — reference real mechanics common in this genre
- Write with genuine enthusiasm and expertise
- No markdown symbols (no **, no ##, no *, no _)
- Plain paragraphs only, section headings are separate fields

Respond ONLY with valid JSON in this exact format:
{
  "intro": "paragraph1\\n\\nparagraph2\\n\\nparagraph3",
  "sections": [
    {"heading": "Section Title", "body": "paragraph1\\n\\nparagraph2\\n\\nparagraph3\\n\\nparagraph4"},
    ...
  ],
  "conclusion": "paragraph1\\n\\nparagraph2"
}`;

  try {
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
      max_tokens: 6000,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) return null;

    const parsed = JSON.parse(text) as GeneratedContent;
    if (!parsed.intro || !Array.isArray(parsed.sections)) return null;
    parsed.sections = parsed.sections.filter(
      (s) => s && typeof s.heading === 'string' && typeof s.body === 'string',
    );

    // Save to disk — won't regenerate next time
    writeCache(game.slug, parsed);

    return parsed;
  } catch {
    return null;
  }
}
