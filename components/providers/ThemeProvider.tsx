'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'light';
    setTheme(saved);
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.add('theme-transition');
    setTheme(next);
    localStorage.setItem('theme', next);
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 260);
  };

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
