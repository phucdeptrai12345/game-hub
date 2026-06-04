'use client';

import { useState } from 'react';
import { useI18n } from '@/components/providers/I18nProvider';

interface Props {
  text: string;
}

export default function GameDescription({ text }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();
  const canCollapse = text.length > 420;

  return (
    <div className="mt-3 max-w-[72ch]">
      <p
        className={`text-muted font-semibold leading-relaxed ${
          canCollapse && !expanded ? 'line-clamp-6' : ''
        }`}
      >
        {text}
      </p>
      {canCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-sm font-black text-accent transition-colors duration-150 hover:text-accent-hover"
          aria-expanded={expanded}
        >
          {expanded ? t('game.showLess') : t('game.readMore')}
        </button>
      )}
    </div>
  );
}
