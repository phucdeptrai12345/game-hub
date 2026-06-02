#!/usr/bin/env node

const DEFAULT_URL = 'https://play.famobi.com/cooking-rage/A-FAMOBI-COM';
const targetUrl = process.argv[2] || DEFAULT_URL;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const HEADERS_TO_SHOW = [
  'content-type',
  'location',
  'x-frame-options',
  'content-security-policy',
  'access-control-allow-origin',
  'cache-control',
];

function withTimeout(ms = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, timer };
}

async function request(url, init = {}) {
  const { controller, timer } = withTimeout();

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'user-agent': USER_AGENT,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function printHeaders(res, indent = '  ') {
  for (const name of HEADERS_TO_SHOW) {
    const value = res.headers.get(name);
    if (value) {
      console.log(`${indent}${name}: ${value}`);
    }
  }
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function decodeJsString(value) {
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value.replace(/\\\//g, '/').replace(/\\u0026/g, '&');
  }
}

function absoluteUrl(value, baseUrl) {
  const clean = decodeHtml(value.trim()).replace(/\\\//g, '/');
  try {
    return new URL(clean, baseUrl).toString();
  } catch {
    return clean;
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function clip(value, max = 180) {
  if (!value || value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

function findTitle(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? decodeHtml(title).replace(/\s+/g, ' ').trim() : null;
}

function findMetaDescription(html) {
  const meta = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  return meta ? decodeHtml(meta[1]).replace(/\s+/g, ' ').trim() : null;
}

function findRedirectUrl(html) {
  const match = html.match(/redirectUrl\s*=\s*["']([^"']+)["']/i);
  return match ? decodeJsString(match[1]) : null;
}

function findIframeUrls(html, baseUrl) {
  return unique(
    [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)].map((match) =>
      absoluteUrl(match[1], baseUrl)
    )
  );
}

function findAllUrls(html, baseUrl) {
  const urls = [];

  for (const match of html.matchAll(/\b(?:src|href|data-src)=["']([^"']+)["']/gi)) {
    urls.push(absoluteUrl(match[1], baseUrl));
  }

  for (const match of html.matchAll(/https?:\\?\/\\?\/[^"'`<>\s)]+/gi)) {
    urls.push(absoluteUrl(match[0], baseUrl));
  }

  return unique(urls);
}

async function probeCandidate(url) {
  try {
    let res = await request(url, { method: 'HEAD', redirect: 'follow' });

    if (res.status === 405 || res.status === 403) {
      res = await request(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { range: 'bytes=0-2047' },
      });
    }

    console.log(`  ${res.status} ${res.statusText} -> ${res.url}`);
    printHeaders(res, '    ');
  } catch (error) {
    console.log(`  Failed: ${error.message}`);
  }
}

async function main() {
  console.log(`Famobi link test`);
  console.log(`Target: ${targetUrl}`);

  console.log('\n1) Request without following redirects');
  const manual = await request(targetUrl, { redirect: 'manual' });
  console.log(`  ${manual.status} ${manual.statusText}`);
  console.log(`  response url: ${manual.url}`);
  printHeaders(manual);

  console.log('\n2) Request with redirects enabled');
  const followed = await request(targetUrl, { redirect: 'follow' });
  console.log(`  ${followed.status} ${followed.statusText}`);
  console.log(`  final url: ${followed.url}`);
  printHeaders(followed);

  const contentType = followed.headers.get('content-type') || '';
  const html = contentType.includes('text/html') ? await followed.text() : '';

  if (!html) {
    console.log('\nNo HTML body was returned, so there is nothing to parse.');
    return;
  }

  console.log(`\n3) HTML parsed`);
  console.log(`  bytes/chars: ${html.length}`);
  console.log(`  title: ${findTitle(html) || 'not found'}`);

  const description = findMetaDescription(html);
  if (description) {
    console.log(`  description: ${clip(description)}`);
  }

  const redirectUrl = findRedirectUrl(html);
  const iframeUrls = findIframeUrls(html, followed.url);
  const allUrls = findAllUrls(html, followed.url);
  const famobiUrls = unique(
    [
      redirectUrl ? absoluteUrl(redirectUrl, followed.url) : null,
      ...iframeUrls,
      ...allUrls,
    ].filter((url) => url.includes('famobi.com'))
  );
  const cdnGameUrls = famobiUrls.filter((url) =>
    url.includes('games.cdn.famobi.com/html5games/')
  );

  console.log(`  redirectUrl variable: ${redirectUrl || 'not found'}`);
  console.log(`  iframe urls: ${iframeUrls.length}`);
  for (const url of iframeUrls.slice(0, 5)) {
    console.log(`    - ${url}`);
  }

  console.log(`  famobi urls found: ${famobiUrls.length}`);
  for (const url of famobiUrls.slice(0, 10)) {
    console.log(`    - ${clip(url, 220)}`);
  }

  console.log(`  direct CDN game urls found: ${cdnGameUrls.length}`);
  for (const url of cdnGameUrls.slice(0, 5)) {
    console.log(`    - ${clip(url, 260)}`);
  }

  if (cdnGameUrls.length > 0) {
    console.log('\n4) Probe direct CDN candidate');
    await probeCandidate(cdnGameUrls[0]);

    console.log('\nConclusion');
    console.log('  Can extract a direct games.cdn.famobi.com/html5games URL from this link.');
    console.log(
      '  If it still opens Famobi or stays blank in our site, the blocker is likely Famobi domain/affiliate runtime policy, not the ability to scrape the URL.'
    );
    console.log(`  Best candidate: ${cdnGameUrls[0]}`);
  } else {
    console.log('\nConclusion');
    console.log('  No direct Famobi CDN game URL was found in the returned HTML.');
    console.log(
      '  This link is probably only a portal/wrapper entry unless Famobi exposes the direct URL through an approved feed or partner setup.'
    );
  }
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
