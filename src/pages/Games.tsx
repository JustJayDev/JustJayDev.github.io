import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Swords, Trophy } from 'lucide-react';
import { mainGames, casualGames, type Game } from '@/data/games';

const GameCard: React.FC<{ game: Game; index: number }> = ({ game, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.45 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${game.nowPlaying ? 'rgba(99,102,241,0.55)' : 'var(--color-border)'}`,
        boxShadow: game.nowPlaying ? '0 0 28px rgba(99,102,241,0.18)' : 'none',
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
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {game.status}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {game.badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    color: 'var(--color-accent-light)',
                  }}
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
            <div
              className="px-5 pb-5 pt-1 border-t"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <ul className="mt-3 space-y-2">
                {game.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: 'var(--color-text)' }}
                  >
                    <Swords
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{ color: 'var(--color-accent)' }}
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              {game.flex && (
                <div
                  className="mt-4 rounded-xl px-4 py-3 flex items-start gap-2"
                  style={{ background: 'rgba(217,70,239,0.08)' }}
                >
                  <Zap size={15} className="mt-0.5 shrink-0" style={{ color: '#d946ef' }} />
                  <p className="text-sm font-medium italic">{game.flex}</p>
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

      <div className="mt-10 max-w-2xl mx-auto flex flex-col gap-4">
        {mainGames.map((g, i) => (
          <GameCard key={g.id} game={g} index={i} />
        ))}
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

export default Games;