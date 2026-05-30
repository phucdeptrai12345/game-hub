/**
 * Curated list of popular Y8 games.
 * y8Slug  — the slug used in https://y8.com/embed/[y8Slug]
 * category — must match one of the CATEGORIES slugs in constants/categories.ts
 */
export interface Y8GameRaw {
  y8Slug: string;
  title: string;
  category: string;
  width: number;
  height: number;
  description: string;
}

export const Y8_GAMES_RAW: Y8GameRaw[] = [
  // ── Skill / Platformer ────────────────────────────────────────
  {
    y8Slug: 'slope',
    title: 'Slope',
    category: 'skill',
    width: 960, height: 641,
    description: 'Control a ball rolling down an endless slope at breakneck speed. Dodge obstacles and survive as long as you can.',
  },
  {
    y8Slug: 'vex_3',
    title: 'Vex 3',
    category: 'platformer',
    width: 900, height: 600,
    description: 'A challenging platformer with deadly traps, wall-running, and precise jumps across 10 acts.',
  },
  {
    y8Slug: 'vex_4',
    title: 'Vex 4',
    category: 'platformer',
    width: 900, height: 600,
    description: 'The fourth installment of the Vex series with new mechanics, harder levels, and more creative traps.',
  },
  {
    y8Slug: 'death_run_3d',
    title: 'Death Run 3D',
    category: 'skill',
    width: 900, height: 600,
    description: 'Sprint through an endless tunnel of deadly obstacles. How far can you go before you die?',
  },
  {
    y8Slug: 'geometry_jump_',
    title: 'Geometry Jump',
    category: 'skill',
    width: 900, height: 500,
    description: 'Tap to jump and fly your way through a series of impossible obstacles in this rhythm-based platformer.',
  },
  {
    y8Slug: 'stickman_boost',
    title: 'Stickman Boost',
    category: 'stickman',
    width: 800, height: 600,
    description: 'A fast-paced stickman platformer with boost jumps, wall runs, and insane speed challenges.',
  },
  {
    y8Slug: 'stickman_boost_2',
    title: 'Stickman Boost 2',
    category: 'stickman',
    width: 800, height: 600,
    description: 'More levels, more speed, more tricks. The stickman is back with an even bigger boost.',
  },
  {
    y8Slug: 'ball_fall_3d',
    title: 'Ball Fall 3D',
    category: 'skill',
    width: 720, height: 1280,
    description: 'Guide a falling ball through rotating platforms, breaking through tiles to survive.',
  },
  {
    y8Slug: 'parkour_go_2_urban',
    title: 'Parkour GO 2',
    category: 'running',
    width: 960, height: 600,
    description: 'Run, jump, and slide through an urban obstacle course in this parkour runner.',
  },
  {
    y8Slug: 'skytrip',
    title: 'Skytrip',
    category: 'skill',
    width: 900, height: 600,
    description: 'Navigate a glider through impossible sky courses. React fast or fall.',
  },

  // ── Racing / Car ──────────────────────────────────────────────
  {
    y8Slug: 'moto_x3m',
    title: 'Moto X3M',
    category: 'racing',
    width: 900, height: 600,
    description: 'Ride your motorbike through extreme obstacle courses. Perform stunts and reach the finish line.',
  },
  {
    y8Slug: 'moto_x3m_2',
    title: 'Moto X3M 2',
    category: 'racing',
    width: 900, height: 600,
    description: 'More tracks, bigger stunts, and faster bikes in this sequel to the hit moto racer.',
  },
  {
    y8Slug: 'moto_x3m_3',
    title: 'Moto X3M 3',
    category: 'racing',
    width: 900, height: 600,
    description: 'Race over insane jumps, exploding barrels, and collapsing platforms in Moto X3M 3.',
  },
  {
    y8Slug: 'moto_x3m_spooky_land',
    title: 'Moto X3M Spooky Land',
    category: 'racing',
    width: 900, height: 600,
    description: 'A Halloween-themed Moto X3M with haunted tracks, ghosts, and spooky obstacles.',
  },
  {
    y8Slug: 'earn_to_die_v1',
    title: 'Earn to Die',
    category: 'car',
    width: 800, height: 450,
    description: 'Upgrade your car and drive through zombie hordes to reach an evacuation plane.',
  },
  {
    y8Slug: 'burnout_drift',
    title: 'Burnout Drift',
    category: 'car',
    width: 960, height: 600,
    description: 'Drift your car around corners and rack up points in this drift challenge game.',
  },
  {
    y8Slug: 'turbo_moto_racer',
    title: 'Turbo Moto Racer',
    category: 'racing',
    width: 480, height: 854,
    description: 'High-speed motorcycle racing on busy highways. Dodge traffic and win the race.',
  },
  {
    y8Slug: 'traffic_tour',
    title: 'Traffic Tour',
    category: 'racing',
    width: 480, height: 854,
    description: 'Race through heavy traffic, collect coins, and unlock new vehicles in this endless racer.',
  },
  {
    y8Slug: 'rally_point_xform',
    title: 'Rally Point',
    category: 'racing',
    width: 900, height: 600,
    description: 'Rally racing through rugged terrain. Hit checkpoints and beat the clock.',
  },

  // ── Action ────────────────────────────────────────────────────
  {
    y8Slug: 'gun_mayhem',
    title: 'Gun Mayhem',
    category: 'action',
    width: 900, height: 600,
    description: 'A chaotic platform shooter. Equip weapons and blast opponents off the platforms.',
  },
  {
    y8Slug: 'gun_mayhem_redux',
    title: 'Gun Mayhem Redux',
    category: 'action',
    width: 900, height: 600,
    description: 'Upgraded visuals and new weapons in the ultimate platform shooting battle.',
  },
  {
    y8Slug: 'hide_online',
    title: 'Hide Online',
    category: 'action',
    width: 960, height: 600,
    description: 'Hide as furniture or hunt players in this quirky multiplayer hide-and-seek shooter.',
  },
  {
    y8Slug: 'crime_city_3d',
    title: 'Crime City 3D',
    category: '3d',
    width: 960, height: 600,
    description: 'Drive through an open 3D city, complete missions, and escape the police.',
  },
  {
    y8Slug: 'freefall_tournament',
    title: 'Freefall Tournament',
    category: 'action',
    width: 960, height: 640,
    description: 'A multiplayer third-person shooter set on floating platforms in the sky.',
  },
  {
    y8Slug: 'evowars_io',
    title: 'EvoWars.io',
    category: 'io',
    width: 960, height: 600,
    description: 'Start as a tiny warrior and grow into a giant by defeating enemies in this .io battle.',
  },

  // ── Shooting ──────────────────────────────────────────────────
  {
    y8Slug: 'gunblood',
    title: 'Gunblood',
    category: 'shooting',
    width: 800, height: 500,
    description: 'Wild West quick-draw duels. Shoot faster than your opponent or die trying.',
  },
  {
    y8Slug: 'dead_zed_2',
    title: 'Dead Zed 2',
    category: 'zombie',
    width: 900, height: 600,
    description: 'Defend your base against zombie waves. Aim and shoot the undead before they reach you.',
  },
  {
    y8Slug: 'hazmob_fps',
    title: 'Hazmob FPS',
    category: 'shooting',
    width: 960, height: 600,
    description: 'A first-person shooter with multiple maps, weapons, and online multiplayer modes.',
  },

  // ── Puzzle / Adventure ────────────────────────────────────────
  {
    y8Slug: 'fireboy_and_watergirl_forest_temple',
    title: 'Fireboy and Watergirl',
    category: 'puzzle',
    width: 840, height: 504,
    description: 'Guide Fireboy and Watergirl through elemental temples. Work together to solve puzzles.',
  },
  {
    y8Slug: 'fireboy_and_watergirl_5_elements',
    title: 'Fireboy and Watergirl 5',
    category: 'puzzle',
    width: 840, height: 504,
    description: 'The fifth Forest Temple adventure with new elements, portals, and co-op challenges.',
  },
  {
    y8Slug: 'haunt_the_house',
    title: 'Haunt the House',
    category: 'casual',
    width: 640, height: 480,
    description: 'Possess objects to scare the humans out of the house before dawn.',
  },
  {
    y8Slug: 'swords_souls_a_soul_adventure',
    title: 'Swords & Souls',
    category: 'adventure',
    width: 900, height: 600,
    description: 'Train your hero, master skills, and fight your way through the soul arena.',
  },

  // ── Fighting ──────────────────────────────────────────────────
  {
    y8Slug: 'dragon_fist_3_age_of_the_warrior',
    title: 'Dragon Fist 3',
    category: 'fighting',
    width: 800, height: 600,
    description: 'Master martial arts combos and defeat opponents in this action-packed fighting game.',
  },
  {
    y8Slug: 'mutant_fighting_cup',
    title: 'Mutant Fighting Cup',
    category: 'fighting',
    width: 800, height: 600,
    description: 'Breed and train mutant animals to fight in brutal tournament battles.',
  },

  // ── Sports / Arcade ───────────────────────────────────────────
  {
    y8Slug: 'penalty_shooters_2',
    title: 'Penalty Shooters 2',
    category: 'soccer',
    width: 800, height: 600,
    description: 'Take penalty kicks and save shots as goalkeeper in this football penalty shootout.',
  },
  {
    y8Slug: 'football_legends_2019',
    title: 'Football Legends',
    category: 'soccer',
    width: 900, height: 500,
    description: 'Choose your football legend and compete in fast-paced 1v1 or 2v2 matches.',
  },
  {
    y8Slug: 'basketball_legends',
    title: 'Basketball Legends',
    category: 'sports',
    width: 900, height: 500,
    description: 'Play basketball with legendary players. Dunk, block, and score in arcade-style matches.',
  },
  {
    y8Slug: 'fish_eat_fish_3_players',
    title: 'Fish Eat Fish',
    category: 'arcade',
    width: 800, height: 600,
    description: 'Eat smaller fish and avoid larger ones. Grow to be the biggest fish in the sea.',
  },
  {
    y8Slug: 'hole_io',
    title: 'Hole.io',
    category: 'io',
    width: 900, height: 600,
    description: 'Control a black hole and swallow up the city. Grow bigger by consuming objects and rivals.',
  },
  {
    y8Slug: 'worms_zone',
    title: 'Worms Zone',
    category: 'io',
    width: 960, height: 600,
    description: 'Grow your worm by eating food and outmaneuver opponents in this popular .io game.',
  },
  {
    y8Slug: 'om_nom_run',
    title: 'Om Nom Run',
    category: 'running',
    width: 720, height: 1280,
    description: 'Om Nom is back in an endless runner. Collect candy, dodge obstacles, and run forever.',
  },

  // ── Strategy ──────────────────────────────────────────────────
  {
    y8Slug: 'age_of_war_2',
    title: 'Age of War 2',
    category: 'strategy',
    width: 900, height: 540,
    description: 'Evolve through ages of warfare. Build units, defend your base, and destroy the enemy.',
  },
  {
    y8Slug: 'orion_sandbox',
    title: 'Orion Sandbox',
    category: 'strategy',
    width: 900, height: 600,
    description: 'Dig, build, and survive in this sandbox world. Mine resources and craft your way to victory.',
  },

  // ── Casual / Fun ──────────────────────────────────────────────
  {
    y8Slug: 'short_life',
    title: 'Short Life',
    category: 'casual',
    width: 800, height: 600,
    description: 'Survive a physics-based obstacle course without losing any limbs. Harder than it looks.',
  },
  {
    y8Slug: 'dumb_ways_to_die_original',
    title: 'Dumb Ways to Die',
    category: 'casual',
    width: 750, height: 500,
    description: 'Complete mini-challenges to save the dumbest characters from the dumbest deaths.',
  },
  {
    y8Slug: 'elastic_man',
    title: 'Elastic Man',
    category: 'casual',
    width: 800, height: 600,
    description: 'Stretch, pull, and squish an elastic face. Oddly satisfying stress relief.',
  },
  {
    y8Slug: 'papa_s_freezeria',
    title: "Papa's Freezeria",
    category: 'cooking',
    width: 800, height: 600,
    description: 'Serve frozen sundaes to demanding customers in this time-management cooking game.',
  },
  {
    y8Slug: 'papas_cheeseria',
    title: "Papa's Cheeseria",
    category: 'cooking',
    width: 800, height: 600,
    description: 'Make the perfect grilled cheese sandwiches and serve hungry customers in Papa\'s Cheeseria.',
  },

  // ── Skill / Music ─────────────────────────────────────────────
  {
    y8Slug: 'perfect_piano',
    title: 'Perfect Piano',
    category: 'skill',
    width: 800, height: 600,
    description: 'Play piano songs by pressing the right keys at the right time.',
  },
];
