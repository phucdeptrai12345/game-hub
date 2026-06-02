import { getMostPlayedGames, getNewestGames } from '@/lib/gamemonetize';

export const revalidate = 3600;

export async function GET() {
  const [popular, gmNew] = await Promise.all([
    getMostPlayedGames(12),
    getNewestGames(12),
  ]);
  return Response.json({ popular, new: gmNew });
}
