'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface SidebarCtx { hidden: boolean; toggle: () => void; }

const Ctx = createContext<SidebarCtx>({ hidden: false, toggle: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(localStorage.getItem('gz-sidebar-hidden') === '1');
  }, []);

  function toggle() {
    setHidden((h) => {
      localStorage.setItem('gz-sidebar-hidden', h ? '0' : '1');
      return !h;
    });
  }

  return <Ctx.Provider value={{ hidden, toggle }}>{children}</Ctx.Provider>;
}

export const useSidebar = () => useContext(Ctx);
