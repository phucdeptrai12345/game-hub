import type { Game } from './types';

const GAMEMONETIZE_ID_RE = /^[a-z0-9]{24,}$/i;

function idFromPathSegment(segment: string | undefined): string | null {
  if (!segment) return null;
  const clean = segment.replace(/\.mp4$/i, '').split('-')[0];
  return GAMEMONETIZE_ID_RE.test(clean) ? clean : null;
}

export function getGameMonetizeVideoId(game: Pick<Game, 'provider' | 'url' | 'sourceUrl' | 'thumb' | 'previewVideo'>): string | null {
  if (game.provider !== 'gamemonetize') return null;

  for (const value of [game.url, game.sourceUrl, game.thumb, game.previewVideo]) {
    if (!value) continue;

    try {
      const url = new URL(value);
      const segments = url.pathname.split('/').filter(Boolean);

      if (url.hostname === 'gamemonetize.video' && segments[0] === 'video') {
        const id = idFromPathSegment(segments[1]);
        if (id) return id;
      }

      if (url.hostname.endsWith('gamemonetize.co') || url.hostname.endsWith('gamemonetize.com')) {
        const id = idFromPathSegment(segments[0]);
        if (id) return id;
      }
    } catch {}
  }

  return null;
}

export function getPlayablePreviewVideo(src?: string): string {
  if (!src) return '';
  if (src.startsWith('/previews/')) return src;

  try {
    const url = new URL(src);
    if (
      url.protocol === 'https:' &&
      url.hostname === 'gamemonetize.video' &&
      url.pathname.startsWith('/video/') &&
      url.pathname.endsWith('.mp4')
    ) {
      return src;
    }
  } catch {}

  return '';
}
