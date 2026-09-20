import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft } from 'lucide-react';
import { sfx } from '@/lib/sound';

interface PaletteCommand {
  label: string;
  hint: string;
  action: () => void;
}

/**
 * CommandPalette — ⌘K / Ctrl-K quick navigation (desktop).
 * Opens with Cmd/Ctrl+K, type to filter, Enter to run, Esc to close.
 */
const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: PaletteCommand[] = [
    { label: 'Go to Home', hint: '/', action: () => navigate('/') },
    { label: 'Go to Games', hint: '/games', action: () => navigate('/games') },
    { label: 'Go to Devlog', hint: '/devlog', action: () => navigate('/devlog') },
    { label: 'Go to About', hint: '/about', action: () => navigate('/about') },
    {
      label: 'Open PixVault',
      hint: 'external',
      action: () => window.open('https://justjaydev.github.io/pixvault/', '_blank', 'noopener'),
    },
    { label: 'Toggle theme', hint: 'dark/light', action: () => document.documentElement.click() },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  // global keybind
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // focus input on open + reset
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // clamp active index when filter changes
  useEffect(() => {
    if (active >= filtered.length) setActive(0);
  }, [filtered.length, active]);

  const run = (cmd?: PaletteCommand) => {
    if (!cmd) return;
    sfx.tick();
    setOpen(false);
    cmd.action();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[18vh] px-4"
          style={{ background: 'rgba(2,6,37,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <Search size={17} style={{ color: 'var(--color-text-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); run(filtered[active]); }
                  if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                }}
                placeholder="Jump to…"
                className="w-full bg-transparent outline-none text-sm"
                style={{ color: 'var(--color-text)' }}
                aria-label="Search commands"
              />
              <kbd className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                esc
              </kbd>
            </div>
            <div className="max-h-64 overflow-y-auto py-1.5">
              {filtered.map((c, i) => (
                <button
                  key={c.label}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(c)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm"
                  style={{
                    background: i === active ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)' : 'transparent',
                    color: i === active ? 'var(--color-accent-light)' : 'var(--color-text)',
                  }}
                >
                  <span className="font-medium">{c.label}</span>
                  <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{c.hint}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-4 text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
                  No matches.
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 px-4 py-2 border-t text-[10px]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft size={10} /> run
              </span>
              <span>↑↓ navigate</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;