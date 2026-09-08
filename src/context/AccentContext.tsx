import React, { createContext, useContext, useEffect, useState } from 'react';

export const ACCENTS = [
  { id: 'indigo', label: 'Indigo', accent: '#6366f1', light: '#818cf8' },
  { id: 'emerald', label: 'Emerald', accent: '#10b981', light: '#34d399' },
  { id: 'rose', label: 'Rose', accent: '#f43f5e', light: '#fb7185' },
  { id: 'amber', label: 'Amber', accent: '#f59e0b', light: '#fbbf24' },
  { id: 'cyan', label: 'Cyan', accent: '#06b6d4', light: '#22d3ee' },
  { id: 'violet', label: 'Violet', accent: '#8b5cf6', light: '#a78bfa' },
] as const;

export type AccentId = (typeof ACCENTS)[number]['id'];

interface AccentContextType {
  accent: AccentId;
  setAccent: (id: AccentId) => void;
}

const AccentContext = createContext<AccentContextType>({
  accent: 'indigo',
  setAccent: () => {},
});

export const AccentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<AccentId>(() => {
    const stored = localStorage.getItem('jjdev-accent') as AccentId | null;
    return stored && ACCENTS.some((a) => a.id === stored) ? stored : 'indigo';
  });

  useEffect(() => {
    const a = ACCENTS.find((x) => x.id === accent) || ACCENTS[0];
    const root = document.documentElement;
    root.style.setProperty('--color-accent', a.accent);
    root.style.setProperty('--color-accent-light', a.light);
    localStorage.setItem('jjdev-accent', accent);
  }, [accent]);

  const setAccent = (id: AccentId) => setAccentState(id);

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
};

export const useAccent = () => useContext(AccentContext);