import { getAllGames } from '@/lib/gamemonetize';

export const revalidate = 3600;

export async function GET() {
  const games = await getAllGames();
  return Response.json({
    popular: games.slice(0, 12),
    new: games.slice(12, 24),
  });
}
