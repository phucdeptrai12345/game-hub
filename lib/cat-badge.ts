export const CAT_BADGE: Record<string, string> = {
  action: 'bg-red-500',      puzzle: 'bg-violet-500',   racing: 'bg-yellow-500',
  sports: 'bg-emerald-500',  shooting: 'bg-zinc-500',   adventure: 'bg-green-500',
  arcade: 'bg-fuchsia-500',  strategy: 'bg-blue-500',   cooking: 'bg-orange-400',
  girls: 'bg-pink-400',      kids: 'bg-sky-400',         casual: 'bg-lime-500',
  multiplayer: 'bg-cyan-500','2player': 'bg-teal-500',   io: 'bg-indigo-500',
};

export function catBadgeClass(category: string): string {
  return CAT_BADGE[category.toLowerCase()] ?? 'bg-accent';
}
