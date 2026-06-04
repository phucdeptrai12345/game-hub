import { Game } from '@/lib/types';
import { readStoredGames, writeStoredGames } from '@/lib/stored-games';

const KEY = 'gz-recently-played';
const MAX = 20;

export function saveRecentlyPlayed(game: Game): void {
  try {
    const stored = readStoredGames(KEY);
    const next = [game, ...stored.filter((g) => g.id !== game.id)].slice(0, MAX);
    writeStoredGames(KEY, next);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gz-recent-changed'));
    }
  } catch {}
}

export function getRecentlyPlayed(): Game[] {
  return readStoredGames(KEY);
}
