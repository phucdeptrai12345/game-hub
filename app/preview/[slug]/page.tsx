import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getGameBySlug } from '@/lib/gamemonetize';
import GameIframe from '@/components/game/GameIframe';

export const metadata: Metadata = {
  title: 'Game Preview Capture',
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PreviewCapturePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) notFound();

  return (
    <div className="preview-capture-page" aria-label={`Preview capture for ${game.title}`}>
      <GameIframe game={game} />
    </div>
  );
}
