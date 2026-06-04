'use client';

import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';
import { useI18n } from '@/components/providers/I18nProvider';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  const { t } = useI18n();

  const footerLinks = [
    { href: '/',               label: t('nav.home') },
    { href: '/games',          label: t('footer.allGames') },
    { href: '/games?sort=new', label: t('footer.newGames') },
    { href: '/kids-site',      label: t('nav.forKids') },
    { href: '/favorites',      label: t('nav.favorites') },
    { href: '/about',          label: t('footer.about') },
    { href: '/privacy',        label: t('footer.privacy') },
    { href: '/terms',          label: t('footer.terms') },
    { href: '/contact',        label: t('footer.contact') },
  ];

  return (
    <footer className="site-footer mt-14 border-t border-border/70">
      <div className="w-full px-3 py-7 sm:px-4 lg:px-5 xl:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <Logo size="sm" />
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-muted">
              {t('footer.tagline')}
            </p>
          </div>

          <nav className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-muted" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors duration-150 hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-border/60 pt-4 text-xs font-semibold text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GameZone. All rights reserved.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors duration-150 hover:text-accent">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
