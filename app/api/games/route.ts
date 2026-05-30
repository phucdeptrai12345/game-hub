import { getMostPlayedGames, getNewestGames } from '@/lib/gamemonetize';
import { getY8Games } from '@/lib/y8';

export const revalidate = 3600;

export async function GET() {
  const [gmPopular, gmNew, y8Games] = await Promise.all([
    getMostPlayedGames(12),
    getNewestGames(12),
    getY8Games(),
  ]);

  // Popular: Y8 classics first (Slope, Moto X3M, etc.) then GM most-played
  const popular = [...y8Games.slice(0, 6), ...gmPopular.slice(0, 6)];
  return Response.json({ popular, new: gmNew });
}
