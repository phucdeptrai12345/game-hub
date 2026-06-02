/**
 * Run: node scripts/count-games.mjs
 * Counts the synced local game catalog by provider and category.
 */

import { readFile } from 'node:fs/promises';

const games = JSON.parse(
  await readFile(new URL('../data/games.json', import.meta.url), 'utf8')
);

function countBy(key) {
  return games.reduce((acc, game) => {
    const value = game[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

console.log(`Total games: ${games.length}`);
console.log('\nBy provider');
console.table(countBy('provider'));
console.log('\nTop categories');
console.table(
  Object.entries(countBy('category'))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([category, count]) => ({ category, count }))
);
