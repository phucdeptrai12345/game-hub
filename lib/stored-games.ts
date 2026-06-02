import type { Game } from './types';

const ENABLE_FAMOBI_INLINE = process.env.NEXT_PUBLIC_ENABLE_FAMOBI_INLINE !== '0';

function isPlayableStoredGame(game: Game): boolean {
  return game.provider !== 'famobi' || ENABLE_FAMOBI_INLINE;
}

export function readStoredGames(key: string): Game[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(parsed)) return [];

    const games = parsed.filter(isPlayableStoredGame);
    if (games.length !== parsed.length) {
      localStorage.setItem(key, JSON.stringify(games));
    }
    return games;
  } catch {
    return [];
  }
}

export function writeStoredGames(key: string, games: Game[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(games.filter(isPlayableStoredGame)));
  } catch {}
}
