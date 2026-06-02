export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://gamezone.fun'
).replace(/\/+$/, '');

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
  process.env.CONTACT_EMAIL ||
  'hello@gamezone.fun';
