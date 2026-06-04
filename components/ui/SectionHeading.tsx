'use client';

import Link from 'next/link';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  titleKey: string;
  icon?: string;
  seeAllHref?: string;
  seeAllKey?: string;
}

export default function SectionHeading({ titleKey, icon, seeAllHref, seeAllKey = 'game.seeAll' }: Props) {
  const { t } = useI18n();
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        {icon && <span className="shrink-0 text-xl" aria-hidden="true">{icon}</span>}
        <h2 className="text-2xl font-black uppercase tracking-tight text-fg title-display">
          {t(titleKey)}
        </h2>
      </div>
      {seeAllHref && (
        <Link href={seeAllHref} className="link-red-action text-sm font-bold">
          {t(seeAllKey)}
        </Link>
      )}
    </div>
  );
}
