import { useEffect, useState, useCallback } from 'react';

/**
 * useAchievements — visitors unlock badges for exploring the site.
 * Progress persists in localStorage. Purely client-side, no backend.
 */

const STORAGE_KEY = 'jj_achievements_v1';

interface Achievement {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', label: 'Welcome', desc: 'You found the site', icon: '👋' },
  { id: 'explorer', label: 'Explorer', desc: 'Visited every page', icon: '🧭' },
  { id: 'gamer', label: 'Gamer', desc: 'Opened the Games page', icon: '🎮' },
  { id: 'deep_diver', label: 'Deep Diver', desc: 'Reached the bottom of a page', icon: '🌊' },
  { id: 'regular', label: 'Regular', desc: 'Came back 3 times', icon: '🔁' },
];

function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveUnlocked(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* storage unavailable */
  }
}

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<Set<string>>(() => loadUnlocked());
  const [toast, setToast] = useState<Achievement | null>(null);

  // persist whenever unlocked changes
  useEffect(() => {
    saveUnlocked(unlocked);
  }, [unlocked]);

  const unlock = useCallback((id: string) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) setToast(ach);
      return next;
    });
  }, []);

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  return { unlocked, unlock, toast, all: ACHIEVEMENTS };
}