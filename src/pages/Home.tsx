import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gamepad2, User, ScrollText, Dices, RefreshCw, Copy, Share2 } from 'lucide-react';
import { profile } from '@/data/profile';
import { mainGames, type Game } from '@/data/games';
import { CountUp } from '@/components/CountUp';

const TAGLINES = ['Mobile gamer.', 'Builder.', 'Future trader.', 'AI-assisted dev.'];
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [tagIdx, setTagIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [spotlight, setSpotlight] = useState<Game | null>(null);

  useEffect(() => {
    document.title = 'JustJayDev — Mobile gamer. Builder. Future trader.';
    const id = setInterval(() => setTagIdx((i) => (i + 1) % TAGLINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  // live IST clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 4 ? 'Still awake?' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Late night grind';
  const istTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

  const [copied, setCopied] = useState(false);

  const buzz = (ms = 12) => {
    if ('vibrate' in navigator) navigator.vibrate(ms);
  };

  const copySite = async () => {
    buzz();
    try {
      await navigator.clipboard.writeText('https://justjaydev.github.io');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareSite = async () => {
    buzz();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'JustJayDev', text: 'Check out my site', url: 'https://justjaydev.github.io' });
      } else {
        await copySite();
      }
    } catch {
      /* share cancelled */
    }
  };

  const pickSpotlight = () => {
    const pool = mainGames.filter((g) => !g.nowPlaying);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setSpotlight(next || null);
  };

  // typewriter effect for the rotating tagline
  useEffect(() => {
    const full = TAGLINES[tagIdx];
    setTyped('');
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(tick);
    }, 55);
    return () => clearInterval(tick);
  }, [tagIdx]);

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
                'linear-gradient(var(--color-bg), var(--color-bg)) padding-box, linear-gradient(135deg, var(--color-accent), #d946ef, #22d3ee) border-box',
              boxShadow: '0 0 44px color-mix(in srgb, var(--color-accent) 35%, transparent)',
            }}
          >
            <img
              src={profile.heroImage}
              alt="Jay Kumar"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--color-accent-light)' }}
          >
            {greeting} · it's {istTime} IST
          </p>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            <span className="gradient-text">JustJayDev</span>
          </h1>

          <p className="mt-3 text-xl md:text-3xl font-bold h-9 md:h-12">
            <span className="gradient-text">
              {typed}
              <span className="type-caret" aria-hidden="true" />
            </span>
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

      {/* ============ STATS STRIP ============ */}
      <section className="page-container pb-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          {[
            [18, '+', 'games played'],
            [2, '', 'grinding now'],
            [100, '%', 'mobile-only'],
            [6, '+', 'apps & sites built'],
          ].map(([num, suffix, label], i) => (
            <motion.div
              key={label as string}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="tilt-card rounded-2xl p-4 text-center"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <p className="text-2xl md:text-3xl font-black gradient-text">
                <CountUp to={num as number} suffix={suffix as string} />
              </p>
              <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>
                {label}
              </p>
            </motion.div>
          ))}
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
                {g.image ? (
                  <img
                    src={g.image}
                    alt={`${g.name} artwork`}
                    loading="lazy"
                    className="w-14 h-14 rounded-xl object-cover"
                    style={{ border: '1px solid var(--color-border)' }}
                  />
                ) : (
                  <Gamepad2 size={28} style={{ color: 'var(--color-accent)' }} />
                )}
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
              {g.lastUpdated && (
                <p className="text-[10px] uppercase tracking-wider font-semibold mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  Updated {g.lastUpdated}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* ============ DEVLOG TEASER ============ */}
      <section className="page-container pb-16">
        <motion.button
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/devlog')}
          className="w-full max-w-2xl mx-auto block rounded-2xl p-5 md:p-6 text-left"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 0 0 rgba(99,102,241,0)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)', color: 'var(--color-accent-light)' }}>
              <ScrollText size={11} />
              Devlog
            </span>
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Sep 2026</span>
          </div>
          <h3 className="font-bold text-base md:text-lg mt-2.5">v3.3 shipped — search, custom 404 & copy-links</h3>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Games page got live search, every devlog entry is copy-linkable, and dead URLs now hit a proper 404. Full notes inside →
          </p>
        </motion.button>
      </section>

      {/* ============ SURPRISE SPOTLIGHT ============ */}
      <section className="page-container pb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={pickSpotlight}
            className="btn-ghost"
            style={{ textDecoration: 'none' }}
          >
            <Dices size={18} />
            Surprise me
          </motion.button>
        </div>
        <AnimatePresence mode="wait">
          {spotlight && (
            <motion.div
              key={spotlight.id}
              initial={{ opacity: 0, y: 14, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -14, rotateX: 8 }}
              transition={{ duration: 0.35 }}
              onClick={() => navigate('/games')}
              className="max-w-md mx-auto rounded-2xl p-6 text-center cursor-pointer tilt-card"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              {spotlight.image ? (
                <img
                  src={spotlight.image}
                  alt={`${spotlight.name} artwork`}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto"
                  style={{ border: '1px solid var(--color-border)' }}
                />
              ) : (
                <Gamepad2 size={48} className="mx-auto" style={{ color: 'var(--color-accent)' }} />
              )}
              <h3 className="mt-3 font-bold text-xl">{spotlight.name}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {spotlight.badges.slice(0, 3).join(' · ')}
              </p>
              <p
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider mt-4"
                style={{ color: 'var(--color-accent-light)' }}
              >
                Random pick from my shelf
                <RefreshCw size={12} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
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

          <div className="flex items-center justify-center gap-2.5 mt-5">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={copySite}
              className="btn-secondary !min-h-0 !py-2.5 !px-4 text-xs font-semibold rounded-xl"
            >
              <Copy size={14} />
              {copied ? 'Copied' : 'Copy link'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={shareSite}
              className="btn-secondary !min-h-0 !py-2.5 !px-4 text-xs font-semibold rounded-xl"
            >
              <Share2 size={14} />
              Share site
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
