import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Gamepad2, Trophy, Users, MessageCircle, Heart, Archive, Search, CornerDownLeft, Shield, BookOpen, Info } from 'lucide-react';

interface Cmd {
  path: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ size?: number }>;
}

const COMMANDS: Cmd[] = [
  { path: '/', label: 'Home', hint: 'Go to homepage', icon: Home },
  { path: '/about', label: 'About', hint: 'Who is JustJayDev', icon: User },
  { path: '/details', label: 'Details', hint: 'Everything about me, in detail', icon: Info },
  { path: '/devlog', label: 'Devlog', hint: 'Build log & updates', icon: BookOpen },
  { path: '/gaming', label: 'Gaming', hint: 'Game library & stats', icon: Gamepad2 },
  { path: '/esports', label: 'Esports', hint: 'Competitive achievements', icon: Trophy },
  { path: '/social', label: 'Social', hint: 'Links & community', icon: Users },
  { path: '/contact', label: 'Contact', hint: 'Get in touch', icon: MessageCircle },
  { path: '/support', label: 'Support', hint: 'Support the work', icon: Heart },
  { path: '/archive', label: 'Archive', hint: 'Hidden lore & posts', icon: Archive },
  { path: '/admin-login', label: 'Admin', hint: 'Owner sign-in', icon: Shield },
];

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      c => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q) || c.path.includes(q)
    );
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const go = useCallback(
    (path: string) => {
      close();
      navigate(path);
    },
    [close, navigate]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') close();
    };
    // Allow opening from UI (e.g. header search button) via custom event
    const onOpenEvent = () => setOpen(o => !o);
    window.addEventListener('keydown', onKey);
    window.addEventListener('jjdev:palette', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('jjdev:palette', onOpenEvent);
    };
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        onClick={close}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl glass"
          style={{ border: '1px solid var(--color-border)' }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Command palette"
        >
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
                if (e.key === 'Enter' && results[active]) go(results[active].path);
              }}
              placeholder="Jump to page…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--color-text)' }}
              aria-label="Search pages"
            />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>ESC</kbd>
          </div>
          <div className="max-h-[46vh] overflow-y-auto py-2">
            {results.length === 0 && (
              <p className="px-4 py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                No matches for “{query}”
              </p>
            )}
            {results.map((c, i) => {
              const Icon = c.icon;
              const isActive = i === active;
              return (
                <button
                  key={c.path}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(c.path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{ background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent' }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-surface-2)', color: isActive ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>{c.label}</span>
                    <span className="block text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{c.hint}</span>
                  </span>
                  {isActive && <CornerDownLeft size={14} style={{ color: 'var(--color-text-muted)' }} />}
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 text-[11px] flex items-center gap-2" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
            <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'var(--color-surface-2)' }}>↑↓</kbd> navigate
            <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'var(--color-surface-2)' }}>↵</kbd> open
            <span className="ml-auto">Ctrl / ⌘ + K</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;