import { searchGames } from '@/lib/gamemonetize';
import { searchY8Games } from '@/lib/y8';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (!q.trim()) return Response.json([]);

  const [gmResults, y8Results] = await Promise.all([searchGames(q), searchY8Games(q)]);

  // Y8 classics first (more recognizable), then GM
  const combined = [...y8Results, ...gmResults];
  const seen = new Set<string>();
  const deduped = combined.filter((g) => {
    if (seen.has(g.id)) return false;
    seen.add(g.id);
    return true;
  });

  return Response.json(deduped.slice(0, 24));
}
