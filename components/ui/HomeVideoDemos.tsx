'use client';

import Link from 'next/link';
import type { Game } from '@/lib/types';
import { getPlayablePreviewVideo } from '@/lib/gamemonetize-video';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  games: Game[];
}

export default function HomeVideoDemos({ games }: Props) {
  const { t } = useI18n();

  const demos = games
    .map((game) => ({ game, videoSrc: getPlayablePreviewVideo(game.previewVideo) }))
    .filter((item) => item.videoSrc)
    .slice(0, 4);

  if (demos.length === 0) return null;

  return (
    <section className="home-video-demos">
      <div className="mb-3 flex min-w-0 items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-6 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="truncate text-2xl font-black uppercase tracking-tight text-fg title-display">
            {t('section.videoDemos')}
          </h2>
        </div>
        <span className="hidden text-sm font-black text-muted sm:inline">
          {t('section.videoDemosSubtitle')}
        </span>
      </div>

      <div className="home-video-demo-grid">
        {demos.map(({ game, videoSrc }, index) => (
          <Link
            key={game.id}
            href={`/games/${game.slug}`}
            className="home-video-demo-card group active-click"
            aria-label={`${t('common.playNow')} ${game.title}`}
          >
            <video
              className="home-video-demo-media"
              src={videoSrc}
              poster={game.thumb}
              autoPlay
              muted
              loop
              playsInline
              preload={index < 2 ? 'auto' : 'metadata'}
            />
            <span className="home-video-demo-shade" aria-hidden="true" />
            <span className="home-video-demo-chip">{game.category || 'Game'}</span>
            <span className="home-video-demo-copy">
              <span className="home-video-demo-title">{game.title}</span>
              <span className="home-video-demo-action">{t('common.playNow')}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
