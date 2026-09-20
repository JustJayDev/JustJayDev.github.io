import { createContext, useContext, ReactNode } from 'react';
import { useAchievements } from '@/lib/useAchievements';

interface AchContextValue {
  unlocked: Set<string>;
  unlock: (id: string) => void;
  toast: { id: string; label: string; desc: string; icon: string } | null;
  all: { id: string; label: string; desc: string; icon: string }[];
}

const AchContext = createContext<AchContextValue | null>(null);

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ach = useAchievements();
  return <AchContext.Provider value={ach}>{children}</AchContext.Provider>;
};

export function useAch() {
  const ctx = useContext(AchContext);
  if (!ctx) throw new Error('useAch must be used inside AchievementProvider');
  return ctx;
};