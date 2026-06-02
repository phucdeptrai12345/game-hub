'use client';

import { useEffect, useRef } from 'react';
import { saveRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { Game } from '@/lib/types';

export default function TrackRecentlyPlayed({ game }: { game: Game }) {
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    saveRecentlyPlayed(game);
  }, [game]);

  return null;
}
