import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeMode } from '@/types';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('jjdev-theme') as ThemeMode | null;
    return stored || 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('jjdev-theme') as ThemeMode | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let resolved: 'dark' | 'light';

    if (stored === 'system' || !stored) {
      resolved = systemPrefersDark ? 'dark' : 'light';
    } else {
      resolved = stored as 'dark' | 'light';
    }

    setResolvedTheme(resolved);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
    // notify embedded widgets (giscus guestbook) about the theme change
    window.dispatchEvent(new CustomEvent('giscus-theme', { detail: { theme: resolved } }));
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        const newResolved = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(newResolved);
        document.documentElement.style.colorScheme = newResolved;
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('jjdev-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);