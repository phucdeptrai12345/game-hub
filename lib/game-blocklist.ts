/**
 * Manual blocklist — add IDs here to permanently hide a game from the portal.
 * Find a game's ID by hovering over it in the GameMonetize dashboard,
 * or from the URL: gamemonetize.com/game/GAME_ID
 */
export const BLOCKED_GAME_IDS = new Set<string>([
  // Example: '550c75e5b8dae862cc338c3b71a10ede',
]);

/**
 * Developer blocklist — blocks all games from a specific developer/publisher.
 * Names are matched case-insensitively.
 */
export const BLOCKED_DEVELOPERS = new Set<string>([
  // Example: 'SpamStudio',
]);

/**
 * Keywords that, if found in a game's title or tags, will hide the game.
 * Use lowercase. Matched as whole-word substrings.
 */
export const BLOCKED_KEYWORDS: string[] = [
  'xxx',
  'adult',
  'nude',
  'naked',
  'porn',
  'sexy girls',
  'strip',
];
