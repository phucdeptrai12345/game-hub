import { notFound } from 'next/navigation';
import { getGamesByCategory } from '@/lib/gamemonetize';
import { getCategoryBySlug, CATEGORIES } from '@/constants/categories';
import GameGrid from '@/components/ui/GameGrid';
import Pagination from '@/components/ui/Pagination';
import SortDropdown from '@/components/ui/SortDropdown';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

const PAGE_SIZE = 120;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

const categoryContent: Record<string, { intro: string; body: string[]; tip: string }> = {
  action: {
    intro: 'Action games are the heart of online gaming — fast, intense, and endlessly replayable. Whether you\'re fighting waves of enemies, running through dangerous levels, or surviving impossible odds, action games demand quick reflexes and sharp focus.',
    body: [
      'From classic side-scrollers to modern beat-em-ups, the action genre has something for every kind of player. Beginners can jump in and have fun immediately, while experienced players will find deeper mechanics and challenges that push their skills to the limit.',
      'Many of our action games feature upgradeable characters, unlockable weapons, and escalating difficulty curves that keep you coming back. Boss fights, combo systems, and time-attack modes add layers of depth that reward mastery.',
      'Action games are also great for short sessions — most levels can be completed in a few minutes, making them perfect for a quick break or an extended gaming marathon. The satisfaction of clearing a tough stage or beating your own high score never gets old.',
    ],
    tip: 'Pro tip: Most action games reward aggressive play. Don\'t play too safe — keep moving, attack constantly, and learn enemy patterns to dominate every stage.',
  },
  puzzle: {
    intro: 'Puzzle games exercise your brain in the best way possible. They challenge you to think creatively, spot patterns, and solve problems that seem impossible at first — until that satisfying moment when everything clicks into place.',
    body: [
      'Our puzzle collection spans dozens of styles: sliding puzzles, logic grids, match-3 games, physics-based challenges, word puzzles, and more. Whether you prefer quiet contemplation or frantic timed challenges, there\'s a puzzle game that fits your mood.',
      'Research consistently shows that puzzle games improve cognitive function, memory, and problem-solving skills. But you don\'t need a reason beyond the fact that they\'re genuinely fun. Few feelings in gaming match the "aha!" moment of cracking a puzzle that stumped you for minutes.',
      'Many puzzle games in our collection start simple and gradually introduce new mechanics, keeping the experience fresh for hours. Some feature thousands of handcrafted levels, while others generate infinite unique challenges — meaning you\'ll never run out of new problems to solve.',
    ],
    tip: 'Stuck on a puzzle? Step away for a minute. Your brain keeps working in the background, and you\'ll often return with a fresh perspective that unlocks the solution immediately.',
  },
  racing: {
    intro: 'Racing games deliver pure adrenaline — the roar of engines, the screech of tires, and the thrill of crossing the finish line first. From casual kart racing to hardcore simulation, our collection covers every style of motorsport imaginable.',
    body: [
      'Experience high-speed competition across hundreds of tracks: city circuits, mountain roads, desert highways, and fantasy courses with loops and jumps. Choose from dozens of vehicles — sports cars, trucks, motorcycles, go-karts, and even exotic machines — each with unique handling characteristics.',
      'Racing games sharpen spatial awareness and reaction time. You\'ll learn to read corners, manage tire grip, and find the perfect racing line through each curve. Drafting, drifting, and overtaking at exactly the right moment are skills that improve with every race.',
      'Many of our racing titles feature upgrade systems where you can tune your vehicle\'s engine, suspension, and aerodynamics. Unlocking faster cars by winning championships gives a strong sense of progression that keeps you motivated to push harder each race.',
    ],
    tip: 'The racing line is everything. Brake before the corner, not during it. Hug the inside of the turn at the apex, then accelerate hard as you exit wide — this technique works in virtually every racing game.',
  },
  sports: {
    intro: 'Sports games bring the excitement of real-world athletics straight to your browser. Play football, basketball, tennis, golf, baseball, and dozens more — no equipment needed, just click and play.',
    body: [
      'Our sports games range from realistic simulations that mirror the rules and physics of actual sports, to exaggerated arcade experiences where impossible moves are encouraged. Want a serious football management challenge? We have it. Want to score ridiculous bicycle kicks from halfway? That too.',
      'Multiplayer sports games are some of the most competitive experiences in our library. Head-to-head matchups against other players or challenging AI opponents create genuine tension — every match matters, every goal counts.',
      'Sports games also serve as a great introduction to real sports. Many players discover a genuine interest in football, golf, or basketball by first experiencing it through games. The simplified controls make learning sports fundamentals surprisingly accessible and enjoyable.',
    ],
    tip: 'Timing is everything in sports games. Whether shooting, passing, or swinging — most sports titles reward perfectly timed button presses with power boosts or special animations that give you the edge over opponents.',
  },
  io: {
    intro: '.io games are massively multiplayer browser games where you compete against hundreds of real players simultaneously. Simple to learn but deeply competitive, they capture the raw thrill of human competition in pure, distilled form.',
    body: [
      'The .io genre started with Agar.io and exploded into hundreds of variations. Eat smaller players to grow bigger, capture territory, shoot others down, or build and defend your base — the concepts are simple, but the competition against real humans makes every session unique and intense.',
      'What makes .io games special is the emergent strategy. You\'re not just fighting AI patterns you can memorize — you\'re outsmarting real people who are trying just as hard to beat you. Alliance-forming, betrayal, clever positioning, and reading opponent behavior all come into play.',
      'Most .io games are session-based with no permanent progression, which means every match is a fresh start. This makes them incredibly easy to jump into at any moment and equally easy to put down — perfect for quick gaming sessions that somehow stretch into hours.',
    ],
    tip: 'In most .io games, patience beats aggression early on. Build up size or resources before picking fights. Let aggressive players eliminate each other, then strike when you\'re strong enough to win decisively.',
  },
  casual: {
    intro: 'Casual games are designed for everyone — easy to pick up, friendly to beginners, and endlessly enjoyable without requiring hours of practice. They\'re the perfect companion for relaxed moments when you want fun without pressure.',
    body: [
      'The casual genre covers an enormous range: idle clickers, time management games, simple platformers, matching games, and countless creative concepts that defy easy categorization. What unites them is accessibility — you can start playing and genuinely enjoy yourself within seconds.',
      'Don\'t mistake "casual" for shallow. Many casual games feature surprisingly deep systems: progression trees with hundreds of upgrades, story campaigns spanning dozens of hours, daily challenges and seasonal events that keep content fresh for months.',
      'Casual games are also the most socially universal category. Kids, parents, and grandparents can all enjoy the same casual game together, making them uniquely powerful for bridging generational gaps through shared play.',
    ],
    tip: 'Casual games often hide their depth behind simple exteriors. Spend a few sessions really exploring the mechanics — most reward patient players with satisfying complexity that isn\'t obvious at first glance.',
  },
  shooting: {
    intro: 'Shooting games test your aim, reflexes, and tactical awareness. From arcade shooters where enemies pour in from all sides, to strategic sniping challenges that demand patience and precision — the genre rewards players who stay calm under pressure.',
    body: [
      'Our shooting collection includes top-down shooters, first-person perspectives, side-scrolling shoot-em-ups, tower defense hybrids, and everything in between. Different styles suit different moods: sometimes you want chaotic bullet-hell action, other times a methodical stealth approach.',
      'Shooting games build genuine skill over time. Improving your aim, learning weapon characteristics, understanding bullet drop and travel time, and developing muscle memory for reloading and switching weapons all translate into measurable performance improvements.',
      'Many shooting games feature extensive weapon customization. Choosing between high damage and fast fire rate, or scopes versus iron sights, creates meaningful decisions that affect your playstyle. Experimenting with different loadouts to find your perfect setup is a game within the game.',
    ],
    tip: 'Aim for the head whenever possible — most shooting games apply significant damage multipliers to headshots. It\'s more important to aim precisely at a stationary target than to spray quickly at a moving one.',
  },
  adventure: {
    intro: 'Adventure games are journeys — into strange worlds, mysterious dungeons, vast open landscapes, and the depths of compelling narratives. They invite you to explore, discover, and experience stories that unfold through interaction rather than passive watching.',
    body: [
      'From classic point-and-click adventures with rich dialogue and clever puzzles, to action-adventure epics with vast maps to explore, the genre celebrates curiosity. Every chest to open, every NPC to speak with, and every new area to discover holds the promise of something interesting.',
      'Adventure games often feature the strongest storytelling in all of gaming. The best titles in our collection have memorable characters, surprising plot twists, and emotional moments that stick with players long after the game is finished.',
      'The exploration aspect creates a unique relationship between player and world. Unlike linear games, adventure titles reward thorough players — go off the beaten path and you might find secret areas, optional bosses, rare items, or hidden lore that completely recontextualizes the main story.',
    ],
    tip: 'Talk to every character, examine every object, and revisit areas after major story events. Adventure games are designed to reward thorough exploration, and the best secrets are always off the obvious path.',
  },
  skill: {
    intro: 'Skill games are pure tests of ability — games where the only path to success is genuine improvement through practice. No luck, no pay-to-win, no shortcuts. Just you, the challenge, and the deeply satisfying arc of getting measurably better.',
    body: [
      'Precision platformers, timing challenges, dexterity tests, and reflex games all fall under the skill umbrella. These are the games that give you that perfect "just one more try" feeling — you know you can do better, and every attempt brings you closer to mastery.',
      'Skill games are uniquely honest. A failed run is never the game\'s fault — it\'s a data point showing you exactly what to improve. This creates a powerful feedback loop where failure feels instructive rather than frustrating, and success feels genuinely earned.',
      'The community around skill games is especially passionate. Speedrunning communities form around challenging titles, sharing strategies and celebrating records. Watching an expert player breeze through levels that took you hours is both humbling and inspiring.',
    ],
    tip: 'Focus on consistency before speed. In skill games, slow and accurate beats fast and careless. Build reliable technique first — speed comes naturally as the movements become instinctive.',
  },
  arcade: {
    intro: 'Arcade games capture the golden age of gaming — quarter-munching classics reinvented for the browser age. High scores, tight gameplay loops, escalating difficulty, and the pure joy of games designed to be fun above everything else.',
    body: [
      'The arcade tradition values simplicity of concept and depth of execution. Easy to understand in seconds, difficult to truly master — this philosophy produces games with incredible staying power. The same session can be experienced completely differently by a beginner and an expert.',
      'Leaderboards are central to the arcade experience. Seeing your name climb the rankings, chasing the high score of the player just above you, or defending your top position against challengers creates endless motivation to play one more round.',
      'Modern browser arcade games maintain the spirit of the originals while adding contemporary features: achievements, daily challenges, unlockable characters and cosmetics, and online multiplayer modes that let you compete against other players worldwide.',
    ],
    tip: 'Learn the scoring system inside out. Most arcade games have hidden multipliers, combo systems, and bonus conditions that massively amplify your score. Understanding these systems separates good players from great ones.',
  },
  strategy: {
    intro: 'Strategy games are mental workouts that reward careful thinking, long-term planning, and the ability to adapt when your plans fall apart. Whether building empires, commanding armies, or managing limited resources, every decision carries weight.',
    body: [
      'From real-time strategy games where quick decisions under pressure determine victory, to turn-based titles that let you contemplate your moves as long as needed, the strategy genre accommodates every thinking style. Both approaches demand intelligence — just applied differently.',
      'Resource management is the backbone of most strategy games. Balancing income against spending, expansion against defense, short-term gains against long-term investment — these economic decisions create a satisfying web of tradeoffs that makes every playthrough unique.',
      'Strategy games have a rich esports tradition. The depth of decision-making possible in these games creates enormous skill gaps between players, and watching high-level play reveals layers of strategy that casual players never encounter. Many players improve dramatically simply by studying how experts approach the same situations.',
    ],
    tip: 'Scout before you commit. In strategy games, information is often more valuable than resources. Knowing your opponent\'s position, unit composition, and intentions lets you make optimal decisions while they\'re operating blind.',
  },
  multiplayer: {
    intro: 'Multiplayer games transform gaming from a solo activity into a social experience. Competing against, cooperating with, or simply playing alongside other real humans creates moments that no AI can replicate — the unpredictability of human opponents and allies makes every session genuinely unique.',
    body: [
      'Our multiplayer collection includes competitive titles where victory means outplaying opponents, cooperative games that require teamwork and communication, and social experiences where the fun comes from interaction itself rather than winning or losing.',
      'Playing multiplayer games builds real social skills. Learning to communicate under pressure, coordinating strategies with strangers, handling defeat gracefully, and celebrating wins as a team are all experiences that extend beyond the game screen.',
      'The community aspect of multiplayer games creates lasting connections. Many players form genuine friendships through shared gaming experiences, joining regular groups that meet weekly for sessions. The best multiplayer games foster communities that outlast the games themselves.',
    ],
    tip: 'Communication wins games more consistently than individual skill. Even simple callouts — enemy positions, your own status, planned actions — dramatically improve team coordination and win rates compared to playing in silence.',
  },
  '3d': {
    intro: '3D games deliver immersive visual experiences that transport you into fully realized three-dimensional worlds. Explore realistic environments, experience convincing physics, and engage with gameplay that uses the full depth of three-dimensional space.',
    body: [
      'The jump to 3D completely transformed gaming possibilities. Movement in three dimensions opens up game design approaches impossible in 2D: true exploration, realistic vehicle physics, spatial puzzles, and the sensation of genuine presence inside a game world.',
      'Our 3D collection showcases impressive technical achievements running entirely in your browser — no downloads, no installations. Modern web technology allows complex 3D rendering that previously required dedicated gaming hardware.',
      '3D games often feature the most detailed and atmospheric environments in gaming. Lighting systems, particle effects, realistic water and cloth simulation, and dynamic weather all contribute to worlds that feel alive and convincing in ways that still amaze even experienced players.',
    ],
    tip: 'Take time to explore the environment fully in 3D games. Designers spend enormous effort creating detailed spaces, and the most interesting content — hidden areas, collectibles, environmental storytelling — rewards players who look beyond the obvious path.',
  },
  car: {
    intro: 'Car games celebrate the machine that defined the 20th century — sleek, powerful, and built for speed. From precise parking simulators to extreme stunt drivers, our car game collection captures every aspect of automotive culture through interactive play.',
    body: [
      'The variety within car games is staggering. Realistic driving simulations challenge you to master real vehicle physics: weight transfer, understeer, oversteer, and brake modulation. Meanwhile, arcade car games let you perform gravity-defying stunts and crash spectacularly without consequences.',
      'Car customization is a beloved feature across the genre. Choosing your vehicle, applying paint jobs and decals, upgrading the engine and suspension, and fitting performance parts creates a personal connection to your machine that makes every race feel more meaningful.',
      'Stunt and destruction games offer a uniquely cathartic experience. The spectacular physics of crashes, jumps, and impossible maneuvers tap into a primal enjoyment of chaos that\'s completely safe to explore in digital form — and endlessly entertaining to watch.',
    ],
    tip: 'Learn your car\'s weight distribution. Front-heavy cars oversteer on corner exit; rear-heavy cars understeer on entry. Knowing which tendency your vehicle has lets you adjust your driving line and throttle inputs to compensate.',
  },
  clicker: {
    intro: 'Clicker and idle games tap into the most primal satisfaction in gaming: the number going up. Deceptively simple at first, these games reveal surprisingly deep progression systems that reward both active players and those who prefer to let the numbers grow while they sleep.',
    body: [
      'The clicker genre birthed the "idle game" concept — games that continue progressing even when you\'re not actively playing. Coming back after several hours to discover enormous resources accumulated in your absence, then spending them on dramatic upgrades, creates a uniquely satisfying gameplay loop.',
      'Behind the simple clicking interface lies genuine strategic depth. Deciding which upgrades to prioritize, when to reset for permanent bonuses (prestige mechanics), and how to balance manual clicking against automated production requires real optimization thinking.',
      'Clicker games are also masterclasses in reward psychology. The escalating number scales, achievement chains, and upgrade unlock moments are perfectly tuned to maintain engagement. Understanding how these systems work doesn\'t diminish the fun — if anything, it makes the design choices even more impressive.',
    ],
    tip: 'Don\'t neglect the prestige/reset mechanic. It feels counterintuitive to give up progress, but prestige multipliers compound rapidly. Players who reset regularly always end up further ahead than those who resist the reset.',
  },
  cooking: {
    intro: 'Cooking games blend time management, creativity, and the universal appeal of food into satisfying gameplay experiences. From managing a bustling restaurant kitchen to following recipes in a calm cooking simulator, these games celebrate the art and science of food preparation.',
    body: [
      'Restaurant management cooking games create genuinely stressful but rewarding scenarios. Handling multiple orders simultaneously, managing ingredient preparation, upgrading kitchen equipment, and keeping customers happy before they leave requires real multitasking ability and prioritization skills.',
      'Creative cooking games function more like digital cookbooks — explore ingredients, discover recipes, and experiment with combinations to create dishes. These titles appeal to genuine food enthusiasts and have introduced many players to real-world ingredients and techniques they went on to try in their own kitchens.',
      'The cooking game genre has excellent accessibility. The themes are universally relatable, the mechanics are intuitive, and the difficulty scales gently from beginner-friendly tutorials to expert-level time crunches that would stress even veteran players. This makes them genuinely fun for all ages.',
    ],
    tip: 'In time-management cooking games, preparation beats reaction. Pre-chop ingredients before orders arrive, keep common items ready, and identify which dishes take longest — start those first even before the order comes in.',
  },
  girls: {
    intro: 'Fashion, design, and creative expression games offer a space to explore style, aesthetics, and personal creativity without limits. From designing dream outfits to decorating spaces and managing beauty businesses, these games celebrate creativity and self-expression.',
    body: [
      'Dress-up and styling games feature enormous wardrobes with thousands of clothing combinations, accessories, hairstyles, and makeup options. The creative freedom to mix and match unexpected combinations produces genuinely surprising and stylish results — many players spend more time in the styling screen than in actual gameplay.',
      'Fashion games often incorporate real-world trends and brands, making them genuinely educational about style, color theory, and design principles. Many fashion professionals cite childhood games in this genre as early sparks of their creative interest.',
      'Story-driven games in this category blend social simulation with creative elements — manage relationships, run a fashion business, style clients for important events, or compete in design challenges. The narrative contexts give creative decisions meaningful weight and consequence.',
    ],
    tip: 'Don\'t stick to obvious combinations. The most interesting looks come from mixing unexpected styles — formal with casual, vintage with modern, minimalist with maximalist accents. Experiment freely; there are no wrong answers in fashion.',
  },
  stickman: {
    intro: 'Stickman games prove that great gameplay needs no elaborate graphics. These minimalist stick-figure games pack incredible action, physics, and creativity into the simplest visual form — and the results are often more entertaining than games with far more detailed art.',
    body: [
      'The stickman aesthetic has a long history in gaming and animation. Something about the minimalist human form is universally appealing and immediately readable — you understand what\'s happening in a stickman game within seconds, with no learning curve for interpreting the visuals.',
      'Physics simulations are a stickman game specialty. Ragdoll physics, joint systems, and realistic weight distribution create hilariously unpredictable results that are endlessly entertaining. No two playthroughs look exactly alike when physics is involved.',
      'Fighting, platforming, and physics sandbox games dominate the stickman category. Each subgenre uses the simple visual style to different effect: fighters emphasize animation fluidity and combo systems, platformers focus purely on movement feel, and sandboxes let you create chaotic situations and watch the physics do their work.',
    ],
    tip: 'In stickman fighting games, timing and spacing beat button mashing every time. Learn the reach of your attacks, keep appropriate distance from opponents, and punish their whiffed moves rather than attacking randomly.',
  },
};

function getCategoryContent(slug: string) {
  return categoryContent[slug] ?? {
    intro: 'Explore free online games in this category and start playing instantly in your browser. No download, no sign-up, just open a game and play on computer, tablet, or mobile.',
    body: [
      'This category mixes quick sessions, familiar browser game controls, and a range of styles so you can try a few titles and keep the ones that feel right.',
      'All games are free to play directly in your browser — no downloads, no installations, no account required. Just click and play immediately on any device, from desktop computers to tablets and smartphones.',
    ],
    tip: 'Try a few games in this category and keep the ones that feel good. Favorites are the fastest way to come back later.',
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.name} Games`,
    description: `Play free ${cat.name.toLowerCase()} games online. ${cat.description}`,
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const sort = sp.sort ?? 'popular';

  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const rawGames = await getGamesByCategory(cat.name);

  const sorted = sort === 'az'
    ? [...rawGames].sort((a, b) => a.title.localeCompare(b.title))
    : sort === 'new'
    ? [...rawGames].sort((a, b) => {
        if (!a.dateAdded && !b.dateAdded) return 0;
        if (!a.dateAdded) return 1;
        if (!b.dateAdded) return -1;
        return b.dateAdded.localeCompare(a.dateAdded);
      })
    : rawGames;

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const content = getCategoryContent(slug);

  const SORT_OPTS = [
    { value: 'popular', label: 'Top games' },
    { value: 'new',     label: 'New games' },
    { value: 'az',      label: 'A-Z'       },
  ];

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="cat-header-anim text-3xl font-black text-fg title-display uppercase tracking-tight">
            {cat.name} Games
          </h1>
          <p className="cat-header-anim text-muted font-semibold text-sm mt-1.5 max-w-lg">
            {cat.description} — {rawGames.length.toLocaleString()} free games
          </p>
        </div>

        <SortDropdown
          activeValue={sort}
          ariaLabel={`Sort ${cat.name} games`}
          className="sm:mt-1"
          options={SORT_OPTS.map((opt) => ({
            ...opt,
            href: `/category/${slug}?sort=${opt.value}`,
          }))}
        />
      </div>

      {paged.length > 0 ? (
        <>
          <GameGrid games={paged} priorityCount={8} showAds={false} />
          {totalPages > 1 && (
            <div className="cat-pagination">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}

          {/* Description block */}
          <div className="cat-desc-block mt-16 pt-10 border-t border-border/60">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

              {/* Left: main description */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-black text-fg title-display uppercase tracking-tight mb-5">
                  About {cat.name} Games
                </h2>
                <p className="text-fg/80 text-base leading-relaxed font-semibold mb-5">
                  {content.intro}
                </p>
                {content.body.map((para, i) => (
                  <p key={i} className="text-muted text-[0.95rem] leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>

              {/* Right: Pro Tip */}
              <div className="lg:col-span-1">
                <div className="rounded-xl bg-accent/8 border border-accent/20 px-5 py-5">
                  <p className="text-xs font-black uppercase tracking-widest text-accent mb-3">Pro Tip</p>
                  <p className="text-fg/80 text-[0.95rem] leading-relaxed">{content.tip}</p>
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-28">
          <p className="text-4xl mb-4">🎮</p>
          <p className="text-xl font-bold text-fg">No {cat.name} games yet</p>
          <p className="text-muted font-semibold mt-2 mb-8">
            Check back soon — new games are added regularly.
          </p>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors duration-150"
          >
            Browse all games →
          </Link>
        </div>
      )}
    </div>
  );
}
