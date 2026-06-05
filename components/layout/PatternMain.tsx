'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

function shouldUsePattern(pathname: string) {
  return !(
    pathname === '/about' ||
    pathname.startsWith('/about/') ||
    pathname === '/kids-site' ||
    pathname.startsWith('/kids-site/')
  );
}

export default function PatternMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const patterned = shouldUsePattern(pathname);

  return (
    <main
      id="main-content"
      className={`page-pattern-main w-full min-w-0 flex-1 overflow-x-clip ${
        patterned ? 'home-pattern relative isolate' : ''
      }`}
    >
      {children}
    </main>
  );
}
