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
  // Keys are substrings to match (checked in order — put longer/more-specific keys first).
  // Values must exactly match a CATEGORIES[].name so CategoryBadge can resolve the slug.
  const map: Record<string, string> = {
    // Specific multi-word patterns first
    'hyper casual': 'Hypercasual',
    hypercasual: 'Hypercasual',
    'tower defense': 'Strategy',
    'tower defence': 'Strategy',
    'two-player': '2 Player',
    'two player': '2 Player',
    '2player': '2 Player',
    '2 player': '2 Player',
    'dress up': 'Girls',
    dressup: 'Girls',
    // Single-word patterns
    action: 'Action',
    adventure: 'Adventure',
    puzzle: 'Puzzle',
    racing: 'Racing',
    sport: 'Sports',
    '.io': 'IO',
    io: 'IO',
    casual: 'Casual',
    shooting: 'Shooting',
    'bullet hell': 'Shooting',
    skill: 'Skill',
    arcade: 'Arcade',
    strategy: 'Strategy',
    multiplayer: 'Multiplayer',
    '3d': '3D',
    driving: 'Car',
    car: 'Car',
    clicker: 'Clicker',
    idle: 'Clicker',
    cooking: 'Cooking',
    stickman: 'Stickman',
    fighting: 'Fighting',
    fight: 'Fighting',
    running: 'Running',
    runner: 'Running',
    zombie: 'Zombie',
    horror: 'Horror',
    scary: 'Horror',
    beauty: 'Beauty',
    makeup: 'Beauty',
    simulation: 'Simulation',
    simulator: 'Simulation',
    football: 'Soccer',
    soccer: 'Soccer',
    basketball: 'Sports',
    platformer: 'Platformer',
    platform: 'Platformer',
    girls: 'Girls',
    kids: 'Kids',
    boys: 'Action',       // no Boys category — closest is Action
  };

  const lower = raw.toLowerCase().trim();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return formatCategory(raw);
}
