const DEFAULT_FAMOBI_AFFILIATE_ID = 'A-FAMOBI-COM';

const FAMOBI_AFFILIATE_ID =
  process.env.FAMOBI_AFFILIATE_ID ||
  process.env.NEXT_PUBLIC_FAMOBI_AFFILIATE_ID ||
  DEFAULT_FAMOBI_AFFILIATE_ID;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

function decodeJsString(value: string): string {
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value.replace(/\\\//g, '/').replace(/\\u0026/g, '&');
  }
}

function normalizeSourceId(sourceId: string): string | null {
  const clean = sourceId.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{1,80}$/.test(clean) ? clean : null;
}

export function getFamobiAffiliateId(): string {
  return FAMOBI_AFFILIATE_ID;
}

export function getFamobiPlayUrl(sourceId: string): string | null {
  const clean = normalizeSourceId(sourceId);
  if (!clean) return null;
  return `https://play.famobi.com/${clean}/${encodeURIComponent(FAMOBI_AFFILIATE_ID)}`;
}

export function extractFamobiRedirectUrl(html: string): string | null {
  const match = html.match(/redirectUrl\s*=\s*["']([^"']+)["']/i);
  if (!match) return null;

  const directUrl = decodeJsString(match[1]).replace(/&amp;/g, '&');

  try {
    const parsed = new URL(directUrl);
    const isFamobiCdn = parsed.hostname === 'games.cdn.famobi.com';
    const isHtml5Game = parsed.pathname.includes('/html5games/');
    return isFamobiCdn && isHtml5Game ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export async function resolveFamobiEmbedUrl(sourceId: string): Promise<string> {
  const playUrl = getFamobiPlayUrl(sourceId);
  if (!playUrl) {
    throw new Error(`Invalid Famobi source id: ${sourceId}`);
  }

  const response = await fetch(playUrl, {
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': USER_AGENT,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Famobi returned ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const directUrl = extractFamobiRedirectUrl(html);

  if (!directUrl) {
    throw new Error(`Famobi redirectUrl not found for ${sourceId}`);
  }

  return directUrl;
}
