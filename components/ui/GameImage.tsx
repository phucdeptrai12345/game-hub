'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { Game } from '@/lib/types';

type GameImageGame = Pick<Game, 'thumb' | 'provider' | 'title'>;

type Props = Omit<ImageProps, 'src' | 'alt' | 'onError'> & {
  game: GameImageGame;
  alt?: string;
  fallbackClassName?: string;
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function gamePixFallbacks(src: string): string[] {
  if (!src.includes('games.assets.gamepix.com') || !src.includes('/thumbnail/')) {
    return [src];
  }

  const big = src.replace(/\/thumbnail\/(?:small|medium|big)\.png(?:\?.*)?$/i, '/thumbnail/big.png');
  const medium = src.replace(/\/thumbnail\/(?:small|medium|big)\.png(?:\?.*)?$/i, '/thumbnail/medium.png');
  const small = src.replace(/\/thumbnail\/(?:small|medium|big)\.png(?:\?.*)?$/i, '/thumbnail/small.png');

  if (src.includes('/thumbnail/big.png')) return unique([src, medium, small]);
  if (src.includes('/thumbnail/medium.png')) return unique([src, small, big]);
  return unique([src, medium, big]);
}

function candidatesFor(game: GameImageGame): string[] {
  const src = game.thumb || '';
  if (game.provider === 'gamepix') return gamePixFallbacks(src);
  return [src].filter(Boolean);
}

function ImageFallback({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const fallbackClassName =
    'game-image-fallback absolute inset-0 flex flex-col items-center justify-center gap-1 bg-navy px-2 text-center';

  return (
    <div
      className={`${fallbackClassName} ${className ?? ''}`}
    >
      <span className="game-image-fallback-mark" aria-hidden="true">
        GZ
      </span>
      <span className="game-image-fallback-title line-clamp-2 max-w-full">
        {title || 'Game'}
      </span>
    </div>
  );
}

export default function GameImage({
  game,
  alt = '',
  className,
  fallbackClassName,
  onLoad,
  ...props
}: Props) {
  const candidates = useMemo(() => candidatesFor(game), [game]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIndex(0);
    setLoaded(false);
  }, [candidates]);

  const src = candidates[index];

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  if (!src) {
    return <ImageFallback title={game.title} className={fallbackClassName} />;
  }

  return (
    <>
      {!loaded && <ImageFallback title={game.title} className={fallbackClassName} />}
      <Image
        {...props}
        src={src}
        alt={alt}
        className={className}
        unoptimized
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        onError={() => {
          setLoaded(false);
          setIndex((current) => {
            const next = current + 1;
            return next < candidates.length ? next : candidates.length;
          });
        }}
      />
    </>
  );
}
