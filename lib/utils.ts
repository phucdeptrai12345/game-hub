export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatCategory(raw: string): string {
  if (!raw) return 'Other';
  return raw
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

export function normalizeCategory(raw: string): string {
  const map: Record<string, string> = {
    action: 'Action',
    adventure: 'Adventure',
    puzzle: 'Puzzle',
    racing: 'Racing',
    sports: 'Sports',
    io: 'IO',
    '.io': 'IO',
    casual: 'Casual',
    shooting: 'Shooting',
    skill: 'Skill',
    arcade: 'Arcade',
    'two-player': 'Two Player',
    multiplayer: 'Multiplayer',
    '3d': '3D',
    car: 'Car',
    driving: 'Car',
    clicker: 'Clicker',
    cooking: 'Cooking',
    stickman: 'Stickman',
    'tower defense': 'Tower Defense',
    strategy: 'Strategy',
    girls: 'Girls',
    boys: 'Boys',
    kids: 'Kids',
  };

  const lower = raw.toLowerCase().trim();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return formatCategory(raw);
}
