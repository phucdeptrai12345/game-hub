import { searchGames } from '@/lib/gamemonetize';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (!q.trim()) return Response.json([]);
  const results = await searchGames(q);
  return Response.json(results.slice(0, 24));
}
