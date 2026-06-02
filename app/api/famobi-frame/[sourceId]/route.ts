import { NextResponse } from 'next/server';
import { getFamobiPlayUrl, resolveFamobiEmbedUrl } from '@/lib/famobi';

export const runtime = 'nodejs';
export const revalidate = 300;

interface RouteContext {
  params: Promise<{ sourceId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { sourceId } = await params;

  try {
    const embedUrl = await resolveFamobiEmbedUrl(sourceId);
    const response = NextResponse.redirect(embedUrl, 307);
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return response;
  } catch (error) {
    const playUrl = getFamobiPlayUrl(sourceId);

    return NextResponse.json(
      {
        error: 'Unable to resolve Famobi iframe URL',
        sourceId,
        fallbackUrl: playUrl,
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
