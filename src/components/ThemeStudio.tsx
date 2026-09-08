import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check } from 'lucide-react';
import { ACCENTS, useAccent } from '@/context/AccentContext';
import { sfx } from '@/lib/sound';

const FONTS = [
  { id: 'system', label: 'Clean' },
  { id: 'serif', label: 'Classic' },
  { id: 'mono', label: 'Coder' },
] as const;

const RADIUS = [
  { id: 'sharp', label: 'Sharp', value: '0.35rem' },
  { id: 'cozy', label: 'Cozy', value: '0.75rem' },
  { id: 'round', label: 'Bubbly', value: '1.15rem' },
] as const;

/**
 * ThemeStudio — visitor theming: accent color, font style, corner style.
 * Everything saves on the visitor's device (localStorage) instantly.
 */
const ThemeStudio: React.FC = () => {
  const { accent, setAccent } = useAccent();
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState(() => localStorage.getItem('jj_font') || 'system');
  const [radius, setRadius] = useState(() => localStorage.getItem('jj_radius') || 'cozy');

  // Apply saved font + corner style on first mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(`font-${localStorage.getItem('jj_font') || 'system'}`);
    const r = RADIUS.find((x) => x.id === (localStorage.getItem('jj_radius') || 'cozy'))?.value || '0.75rem';
    root.style.setProperty('--radius-lg', r);
    root.style.setProperty('--radius-md', `calc(${r} - 0.2rem)`);
    root.style.setProperty('--radius-sm', `calc(${r} - 0.4rem)`);
  }, []);

  const applyFont = (id: string) => {
    setFont(id);
    localStorage.setItem('jj_font', id);
    const root = document.documentElement;
    root.classList.remove('font-system', 'font-serif', 'font-mono');
    root.classList.add(`font-${id}`);
    sfx.tick();
    if (navigator.vibrate) navigator.vibrate(6);
  };

  const applyRadius = (id: string) => {
    setRadius(id);
    localStorage.setItem('jj_radius', id);
    const root = document.documentElement;
    const r = RADIUS.find((x) => x.id === id)?.value || '0.75rem';
    root.style.setProperty('--radius-lg', r);
    root.style.setProperty('--radius-md', `calc(${r} - 0.2rem)`);
    root.style.setProperty('--radius-sm', `calc(${r} - 0.4rem)`);
    sfx.tick();
    if (navigator.vibrate) navigator.vibrate(6);
  };

  return (
    <div className="fixed right-3 top-16 md:top-20 md:right-5 z-40 no-swipe no-pull">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="glass rounded-2xl p-4 mb-2 shadow-xl w-64"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <p
              className="text-[10px] uppercase tracking-wider font-bold mb-2 px-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Accent
            </p>
            <div className="grid grid-cols-6 gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAccent(a.id);
                    if (navigator.vibrate) navigator.vibrate(6);
                  }}
                  aria-label={`Set accent ${a.label}`}
                  title={a.label}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{
                    background: a.accent,
                    outline: accent === a.id ? '2px solid var(--color-text)' : 'none',
                    outlineOffset: 2,
                  }}
                >
                  {accent === a.id && <Check size={12} strokeWidth={3} />}
                </button>
              ))}
            </div>

            <p
              className="text-[10px] uppercase tracking-wider font-bold mb-2 px-1 mt-4"
              style={{ color: 'var(--color-muted, var(--color-text-muted))' }}
            >
              Font
            </p>
            <div className="flex gap-1.5">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => applyFont(f.id)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-transform active:scale-95 ${
                    f.id === 'serif' ? 'font-serif-preview' : f.id === 'mono' ? 'font-mono-preview' : ''
                  }`}
                  style={{
                    background: font === f.id ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    color: font === f.id ? '#fff' : 'var(--color-text-muted)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <p
              className="text-[10px] uppercase tracking-wider font-bold mb-2 px-1 mt-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Corners
            </p>
            <div className="flex gap-1.5">
              {RADIUS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => applyRadius(r.id)}
                  className="flex-1 py-1.5 text-[11px] font-bold transition-transform active:scale-95"
                  style={{
                    borderRadius: r.value,
                    background: radius === r.id ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    color: radius === r.id ? '#fff' : 'var(--color-text-muted)',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <p className="text-[10px] mt-3 px-1" style={{ color: 'var(--color-text-muted)' }}>
              Saved on your device
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close theme studio' : 'Open theme studio'}
        aria-expanded={open}
        className="w-10 h-10 rounded-full flex items-center justify-center glass shadow-lg"
        style={{ color: 'var(--color-text)' }}
      >
        {open ? <X size={17} /> : <Palette size={17} />}
      </motion.button>
    </div>
  );
};

export default ThemeStudio;