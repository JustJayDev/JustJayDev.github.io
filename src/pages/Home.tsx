import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gamepad2, User } from 'lucide-react';
import { profile } from '@/data/profile';
import { mainGames } from '@/data/games';

const TAGLINES = ['Mobile gamer.', 'Builder.', 'Future trader.'];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [tagIdx, setTagIdx] = useState(0);

  useEffect(() => {
    document.title = 'JustJayDev — Mobile gamer. Builder. Future trader.';
    const id = setInterval(() => setTagIdx((i) => (i + 1) % TAGLINES.length), 2600);
    return () => clearInterval(id);
  }, []);

  const nowPlaying = mainGames.filter((g) => g.nowPlaying);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="page-container pt-12 pb-16 md:pt-20 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div
            className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-6"
            style={{
              border: '3px solid transparent',
              background:
                'linear-gradient(var(--color-bg), var(--color-bg)) padding-box, linear-gradient(135deg, #6366f1, #d946ef, #22d3ee) border-box',
              boxShadow: '0 0 44px rgba(99,102,241,0.35)',
            }}
          >
            <img
              src={profile.heroImage}
              alt="Jay Kumar"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            <span className="gradient-text">JustJayDev</span>
          </h1>

          <p className="mt-3 text-xl md:text-3xl font-bold h-9 md:h-12">
            <motion.span
              key={tagIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="inline-block gradient-text"
            >
              {TAGLINES[tagIdx]}
            </motion.span>
          </p>

          <p
            className="mt-4 max-w-xl text-sm md:text-base leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {profile.bio}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {profile.chips.map((chip, i) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="badge badge-accent"
              >
                {chip}
              </motion.span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/games')}
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <Gamepad2 size={18} />
              See my games
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/about')}
              className="btn-ghost"
              style={{ textDecoration: 'none' }}
            >
              <User size={18} />
              About me
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ============ NOW PLAYING ============ */}
      <section className="page-container pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title text-center"
        >
          Now Playing
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
          {nowPlaying.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/games')}
              className="tilt-card p-5 rounded-2xl text-left"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{g.emoji}</span>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    color: '#ef4444',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full pulse-dot"
                    style={{ background: '#ef4444' }}
                  />
                  Now Playing
                </span>
              </div>
              <h3 className="mt-3 font-bold text-lg">{g.name}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {g.badges.slice(0, 3).join(' · ')}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ============ QUICK LINKS STRIP ============ */}
      <section className="page-container pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6 md:p-8 text-center"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {profile.setup.phone} · {profile.setup.chipset} · {profile.setup.display}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {profile.setup.tuning} — {profile.setup.extra}
          </p>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium mt-4 transition-opacity hover:opacity-75"
            style={{ color: 'var(--color-accent-light)' }}
          >
            github.com/JustJayDev
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
