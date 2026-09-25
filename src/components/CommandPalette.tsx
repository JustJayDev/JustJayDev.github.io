import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft, Home, Gamepad2, Newspaper, User, Flame } from 'lucide-react';
import { mainGames } from '@/data/games';

/**
 * CommandPalette — Ctrl+K quick-jump palette.
 * Fuzzy-ish filter over pages + game profiles.
 */
const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setActive(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const items = useMemo(() => {
    const base = [
      { to: '/', label: 'Home', icon: <Home size={16} /> },
      { to: '/games', label: 'Games', icon: <Gamepad2 size={16} /> },
      { to: '/devlog', label: 'Devlog', icon: <Newspaper size={16} /> },
      { to: '/about', label: 'About', icon: <User size={16} /> },
      ...mainGames
        .filter((g) => g.profile)
        .map((g) => ({
          to: `/games/${g.id}`,
          label: `Profile: ${g.name}`,
          icon: <Flame size={16} />,
        })),
    ];
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (it) => it.label.toLowerCase().includes(q) || it.to.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + items.length) % items.length);
    } else if (e.key === 'Enter' && items[active]) {
      e.preventDefault();
      go(items[active].to);
    }
  };

  return (
    <div
      className="cmd-overlay"
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3,4,10,0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '16vh',
      }}
    >
      <div
        className="cmd-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 92vw)',
          background: 'var(--panel-solid)',
          border: '1px solid var(--line-strong)',
          borderRadius: 14,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(34,211,238,0.12)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <Search size={16} style={{ color: 'var(--mg)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page or game profile…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontFamily: 'var(--mono)',
              fontSize: 15,
            }}
          />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--mg)', border: '1px solid var(--line)', borderRadius: 5, padding: '2px 6px' }}>
            ESC
          </span>
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto', padding: 8 }}>
          {items.length === 0 && (
            <div className="mono" style={{ padding: 16, color: 'var(--muted)', fontSize: 13 }}>
              &gt; no matches for "{query}"
            </div>
          )}
          {items.map((it, i) => (
            <button
              key={it.to + it.label}
              onClick={() => go(it.to)}
              onMouseEnter={() => setActive(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                textAlign: 'left',
                padding: '11px 14px',
                borderRadius: 8,
                border: 'none',
                background: i === active ? 'rgba(34,211,238,0.10)' : 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                fontSize: 14,
              }}
            >
              <span style={{ color: 'var(--cy)', display: 'flex' }}>{it.icon}</span>
              <span style={{ flex: 1 }}>{it.label}</span>
              {i === active && <CornerDownLeft size={13} style={{ color: 'var(--mg)' }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
