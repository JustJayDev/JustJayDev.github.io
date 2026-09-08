import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Swords, Trophy, ShieldAlert, ExternalLink, Search } from 'lucide-react';
import { mainGames, casualGames, type Game } from '@/data/games';

type Filter = 'all' | 'active' | 'casual';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'casual', label: 'Casual' },
];

const GameCard: React.FC<{ game: Game; index: number }> = ({ game, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.45 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${game.nowPlaying ? 'color-mix(in srgb, var(--color-accent) 55%, transparent)' : 'var(--color-border)'}`,
        boxShadow: game.nowPlaying ? '0 0 28px color-mix(in srgb, var(--color-accent) 18%, transparent)' : 'none',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 flex items-start justify-between gap-3"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl leading-none mt-0.5">{game.emoji}</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-lg">{game.name}</h3>
              {game.nowPlaying && (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#ef4444' }} />
                  Now Playing
                </span>
              )}
              {game.verified === false && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
                >
                  <ShieldAlert size={10} />
                  Unverified
                </span>
              )}
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {game.status}
              {game.lastUpdated ? ` · Updated ${game.lastUpdated}` : ''}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {game.badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg"
                  style={{ background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', color: 'var(--color-accent-light)' }}
                >
                  <Trophy size={11} />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {game.verified === false && (
                <p className="mt-3 text-[11px] italic flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                  <ShieldAlert size={12} className="shrink-0" />
                  unverified — update when confirmed
                </p>
              )}
              <ul className="mt-3 space-y-2">
                {game.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                    <Swords size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              {game.flex && (
                <div className="mt-4 rounded-xl px-4 py-3 flex items-start gap-2" style={{ background: 'rgba(217,70,239,0.08)' }}>
                  <Zap size={15} className="mt-0.5 shrink-0" style={{ color: '#d946ef' }} />
                  <p className="text-sm font-medium italic">
                    {game.flex}
                    {game.proofUrl && (
                      <a
                        href={game.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 ml-2 not-italic text-xs font-semibold align-middle"
                        style={{ color: 'var(--color-accent-light)' }}
                      >
                        proof
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
const Games: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = mainGames.filter((g) => {
    if (filter === 'active') return g.nowPlaying;
    if (filter === 'casual') return !g.nowPlaying;
    return true;
  }).filter((g) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      g.name.toLowerCase().includes(q) ||
      g.status.toLowerCase().includes(q) ||
      g.badges.some((b) => b.toLowerCase().includes(q)) ||
      g.details.some((d) => d.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page-container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          <span className="gradient-text">Games</span>
        </h1>
        <p className="mt-3 text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          18 games played · 2 grinding right now · 100% mobile, zero PC
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-6 max-w-xs mx-auto"
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-shadow focus-within:shadow-lg"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games, badges, achievements…"
            aria-label="Search games"
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: 'var(--color-text)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="text-xs font-bold shrink-0"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ✕
            </button>
          )}
        </div>
      </motion.div>

      {/* Filter button-group */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 flex justify-center"
      >
        <div
          className="inline-flex gap-1 p-1 rounded-2xl"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ color: active ? '#fff' : 'var(--color-text-muted)' }}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, var(--color-accent), #8b5cf6)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-8 max-w-2xl mx-auto flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((g, i) => (
            <motion.div
              key={g.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ delay: Math.min(i * 0.06, 0.3), duration: 0.45 }}
            >
              <GameCard game={g} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-center text-sm py-10" style={{ color: 'var(--color-text-muted)' }}>
            No games match “{query}” — try another search.
          </p>
        )}
      </div>
      {/* Casual classics strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 max-w-2xl mx-auto rounded-2xl p-6"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="section-title text-lg md:text-xl">Casual classics</h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {casualGames.map((g) => (
            <span
              key={g}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
            >
              {g}
            </span>
          ))}
        </div>
      </motion.section>
    </div>
  );
};