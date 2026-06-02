const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
const publisherId = adsenseClient.replace(/^ca-/, '');

export function GET() {
  const body = publisherId.startsWith('pub-')
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# Configure NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX before running ads.\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
