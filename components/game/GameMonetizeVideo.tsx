'use client';

import { useEffect, useState } from 'react';
import type { Game } from '@/lib/types';
import { getGameMonetizeVideoId } from '@/lib/gamemonetize-video';

interface Props {
  game: Game;
}

export default function GameMonetizeVideo({ game }: Props) {
  const gameId = getGameMonetizeVideoId(game);
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (!gameId) return;

    const params = new URLSearchParams({
      domain: window.location.hostname || 'localhost',
      gameid: gameId,
      game: game.title,
      getads: process.env.NEXT_PUBLIC_GAMEMONETIZE_VIDEO_ADS === '1' ? 'true' : 'false',
      color: '#ff1733',
    });

    setSrc(`https://gamemonetize.video/index.php?${params.toString()}`);
  }, [gameId, game.title]);

  if (!gameId || !src) return null;

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        <h2 className="title-display text-lg font-black uppercase tracking-tight text-fg">
          Gameplay Video
        </h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-[0_18px_42px_oklch(18%_0.025_260/0.10)]">
        <iframe
          src={src}
          title={`${game.title} gameplay video`}
          className="h-[300px] w-full border-0 sm:h-[420px]"
          loading="lazy"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>
    </section>
  );
}
