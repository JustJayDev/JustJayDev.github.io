import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Gamepad2, User, ScrollText, Dices, Copy, Share2, ExternalLink, Sparkles,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { mainGames, type Game } from '@/data/games';
import { hubProjects, railWords } from '@/data/hub';
import { CountUp } from '@/components/CountUp';
import { useAch } from '@/context/AchievementContext';
import { useParallax, useRipple, setRef } from '@/lib/useCinematic';
import { useMagnetic } from '@/lib/useMagnetic';

const ROTATING = ['Mobile gamer.', 'Builder.', 'Future trader.', 'AI-assisted dev.'];

/* ------------------------------------------------------------------ *
 * Decorative marquee rail. The track is duplicated so the loop is
 * seamless, so the visible copy is hidden from assistive tech and the
 * same content is announced exactly once via the sr-only paragraph.
 * ------------------------------------------------------------------ */
const WordRail: React.FC = () => (
  <div className="rail">
    <p className="sr-only">Site highlights: {railWords.join(', ')}.</p>
    <div className="rail-track" aria-hidden="true">
      {railWords.concat(railWords).map((w, i) => (
        <span className="rail-item" key={i}>
          <span className="live-dot" />
          <b>{w}</b>
        </span>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Project hub card
 * ------------------------------------------------------------------ */
const HubCard: React.FC<{ p: (typeof hubProjects)[number]; i: number }> = ({ p, i }) => {
  const glow =
    p.accent === 'cyan' ? 'var(--v5-cyan)' : p.accent === 'magenta' ? 'var(--v5-magenta)' : 'var(--v5-lime)';
  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      whileTap={{ scale: 0.985 }}
      className="hub-card"
    >
      <div className="hub-card-art">
        <img src={p.art} alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className="hub-body">
        <div className="flex items-center gap-2">
          <span className="hub-index">{p.index}</span>
          <span
            className="text-[10px] font-mono uppercase tracking-[0.16em]"
            style={{ color: glow }}
          >
            {p.kind}
          </span>
        </div>
        <h3 className="mt-1.5 text-lg font-bold flex items-center gap-1.5">
          {p.name}
          <ExternalLink size={14} style={{ color: 'var(--v5-muted)' }} />
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--v5-muted)' }}>
          {p.blurb}
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.14em]"
          style={{ color: glow }}
        >
          {p.cta}
          <ArrowRight size={12} />
        </span>
      </div>
    </motion.a>
  );
};

/* ------------------------------------------------------------------ *
 * Now-playing card
 * ------------------------------------------------------------------ */
const NowPlayingCard: React.FC<{ game: Game; index: number }> = ({ game, index }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/games')}
      className="p-5 rounded-2xl text-left w-full"
      style={{ background: 'var(--v5-surface)', border: '1px solid var(--v5-line)' }}
    >
      <div className="flex items-center justify-between gap-2">
        {game.image ? (
          <img
            src={game.image}
            alt={`${game.name} artwork`}
            loading="lazy"
            className="kenburns w-14 h-14 rounded-xl object-cover"
            style={{ border: '1px solid var(--v5-line)' }}
          />
        ) : (
          <Gamepad2 size={26} style={{ color: 'var(--v5-lime)' }} />
        )}
        <span
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{
            background: 'color-mix(in srgb, var(--v5-cyan) 12%, transparent)',
            color: 'var(--v5-cyan)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span className="live-dot" />
          Now playing
        </span>
      </div>
      <h3 className="mt-3 font-bold text-lg">{game.name}</h3>
      <p className="text-[13px] mt-1" style={{ color: 'var(--v5-muted)' }}>
        {game.badges.slice(0, 3).join(' · ')}
      </p>
      {game.lastUpdated && (
        <p
          className="text-[10px] mt-2 font-mono uppercase tracking-[0.14em]"
          style={{ color: 'var(--v5-muted)' }}
        >
          Updated {game.lastUpdated}
        </p>
      )}
    </motion.button>
  );
};

/* ================================================================== */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [tagIdx, setTagIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [spotlight, setSpotlight] = useState<Game | null>(null);
  const [copied, setCopied] = useState(false);
  const { unlock } = useAch();

  const heroBtnRef = useMagnetic<HTMLButtonElement>(0.22);
  const aboutBtnRef = useMagnetic<HTMLButtonElement>(0.22);
  const gamesRipple = useRipple<HTMLButtonElement>();
  const aboutRipple = useRipple<HTMLButtonElement>();
  const heroRef = useParallax<HTMLDivElement>();

  useEffect(() => {
    unlock('first_visit');
  }, [unlock]);

  // "deep diver" achievement once the visitor nears the bottom of the page
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.92) unlock('deep_diver');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [unlock]);

  useEffect(() => {
    const id = setInterval(() => setTagIdx((i) => (i + 1) % ROTATING.length), 3400);
    return () => clearInterval(id);
  }, []);

  // live IST clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // typewriter — shows the whole word at once when motion is reduced
  useEffect(() => {
    const full = ROTATING[tagIdx];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(full);
      return;
    }
    setTyped('');
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(tick);
    }, 55);
    return () => clearInterval(tick);
  }, [tagIdx]);

  const hour = now.getHours();
  const greeting =
    hour < 4 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Late night';
  const istTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });

  const nowPlaying = mainGames.filter((g) => g.nowPlaying);

  const buzz = (ms = 12) => {
    if ('vibrate' in navigator) navigator.vibrate(ms);
  };

  const copySite = async () => {
    buzz();
    try {
      await navigator.clipboard.writeText('https://justjaydev.github.io/');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the label simply does not flip */
    }
  };

  const shareSite = async () => {
    buzz();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'JustJayDev',
          text: profile.bio,
          url: 'https://justjaydev.github.io/',
        });
      } else {
        await copySite();
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const pickSpotlight = () => {
    buzz();
    const pool = mainGames.filter((g) => !g.nowPlaying);
    if (!pool.length) return;
    setSpotlight(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="page-container relative pt-10 pb-14 md:pt-16 md:pb-16">
        <div ref={heroRef} className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="mesh-hero" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* ---- text column ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow flex items-center gap-2 flex-wrap">
              <span className="live-dot" />
              {greeting} · {istTime} IST
            </p>

            <h1 className="mt-4">
              <span className="hero-word">Just</span>
              <span className="hero-word hero-outline">Jay</span>
              <span className="hero-word gradient-text">Dev</span>
            </h1>

            <p className="mt-4 h-9 md:h-11 text-xl md:text-2xl font-bold font-display">
              <span className="gradient-text">{typed}</span>
              <span className="type-caret" aria-hidden="true" />
            </p>

            <p className="mt-4 max-w-lg text-[15px] leading-relaxed" style={{ color: 'var(--v5-muted)' }}>
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {profile.chips.map((chip, i) => (
                <motion.span
                  key={chip}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
                  className="badge badge-accent"
                >
                  {chip}
                </motion.span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <motion.button
                ref={(n) => { setRef(heroBtnRef, n); setRef(gamesRipple, n); }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { buzz(); navigate('/games'); }}
                className="btn-primary btn-magnet"
                style={{ textDecoration: 'none' }}
              >
                <Gamepad2 size={18} />
                See my games
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                ref={(n) => { setRef(aboutBtnRef, n); setRef(aboutRipple, n); }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { buzz(); navigate('/about'); }}
                className="btn-ghost btn-magnet"
                style={{ textDecoration: 'none' }}
              >
                <User size={18} />
                About me
              </motion.button>
            </div>
          </motion.div>

          {/* ---- portrait column ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-none"
          >
            <div
              className="aspect-[4/5] rounded-3xl overflow-hidden"
              style={{ border: '1px solid var(--v5-line)', background: 'var(--v5-surface)' }}
            >
              <img
                src={profile.heroImage}
                alt="Jay Kumar"
                className="w-full h-full object-cover"
                loading="eager"
                width={640}
                height={800}
              />
            </div>
            {/* caption plate */}
            <div
              className="absolute -bottom-5 left-3 right-3 sm:left-6 sm:right-auto rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{
                background: 'color-mix(in srgb, var(--v5-bg) 84%, transparent)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid var(--v5-line)',
              }}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{profile.name}</p>
                <p
                  className="text-[10px] font-mono uppercase tracking-[0.14em]"
                  style={{ color: 'var(--v5-muted)' }}
                >
                  {profile.location} · Mobile only
                </p>
              </div>
              <Sparkles size={16} className="ml-auto shrink-0" style={{ color: 'var(--v5-lime)' }} />
            </div>
          </motion.div>
        </div>
      </section>

      <WordRail />

      {/* ================= STATS ================= */}
      <section className="page-container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            [19, '+', 'games played'],
            [2, '', 'grinding now'],
            [100, '%', 'built on a phone'],
            [3, '', 'live projects'],
          ].map(([num, suffix, label], i) => (
            <motion.div
              key={label as string}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="stat"
            >
              <p className="stat-value gradient-text">
                <CountUp to={num as number} suffix={suffix as string} />
              </p>
              <p className="stat-label">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PROJECT HUB ================= */}
      <section className="page-container pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow">Projects</p>
            <h2 className="mt-1 text-3xl md:text-4xl">Things I built</h2>
          </div>
          <a
            href="https://github.com/JustJayDev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.14em] shrink-0"
            style={{ color: 'var(--v5-lime)' }}
          >
            All repos <ArrowRight size={13} />
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubProjects.map((p, i) => (
            <HubCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>

      {/* ================= NOW PLAYING ================= */}
      <section className="page-container pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow">Live</p>
            <h2 className="mt-1 text-3xl md:text-4xl">Now playing</h2>
          </div>
          <button
            onClick={() => navigate('/games')}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.14em] shrink-0"
            style={{ color: 'var(--v5-lime)' }}
          >
            All games <ArrowRight size={13} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {nowPlaying.map((g, i) => (
            <NowPlayingCard key={g.id} game={g} index={i} />
          ))}
        </div>
      </section>

      {/* ================= DEVLOG TEASER ================= */}
      <section className="page-container pb-14">
        <p className="eyebrow">Changelog</p>
        <h2 className="mt-1 mb-2 text-3xl md:text-4xl">Devlog</h2>
        <div style={{ borderTop: '1px solid var(--v5-line)' }}>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate('/devlog')}
            className="row-link text-left"
          >
            <span className="row-num">v5.0</span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">Full visual rebuild — new identity and hub layout</span>
              <span className="block text-[13px] mt-0.5" style={{ color: 'var(--v5-muted)' }}>
                Redesigned from the ground up: new palette, new type pairing, a project hub and a
                mobile-first layout.
              </span>
            </span>
            <ScrollText size={16} className="shrink-0" style={{ color: 'var(--v5-muted)' }} />
          </motion.button>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate('/devlog')}
            className="row-link text-left"
          >
            <span className="row-num">v3.3</span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">Search, custom 404 and copy-links</span>
              <span className="block text-[13px] mt-0.5" style={{ color: 'var(--v5-muted)' }}>
                Live search on the games page, copy-link on every devlog entry, proper 404 handling.
              </span>
            </span>
            <ScrollText size={16} className="shrink-0" style={{ color: 'var(--v5-muted)' }} />
          </motion.button>
        </div>
      </section>

      {/* ================= SURPRISE ================= */}
      <section className="page-container pb-14 text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={pickSpotlight}
          className="btn-ghost"
          style={{ textDecoration: 'none' }}
        >
          <Dices size={17} />
          Surprise me
        </motion.button>
        <AnimatePresence mode="wait">
          {spotlight && (
            <motion.div
              key={spotlight.id}
              initial={{ opacity: 0, y: 16, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -16, rotateX: 10 }}
              transition={{ duration: 0.35 }}
              onClick={() => navigate('/games')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate('/games');
              }}
              className="mt-6 mx-auto max-w-sm rounded-2xl p-6 text-center cursor-pointer"
              style={{ background: 'var(--v5-surface)', border: '1px solid var(--v5-line)' }}
            >
              {spotlight.image ? (
                <img
                  src={spotlight.image}
                  alt={`${spotlight.name} artwork`}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto"
                  style={{ border: '1px solid var(--v5-line)' }}
                />
              ) : (
                <Gamepad2 size={44} className="mx-auto" style={{ color: 'var(--v5-lime)' }} />
              )}
              <h3 className="mt-3 font-bold text-xl">{spotlight.name}</h3>
              <p className="text-[13px] mt-1" style={{ color: 'var(--v5-muted)' }}>
                {spotlight.badges.slice(0, 3).join(' · ')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ================= SETUP + SHARE ================= */}
      <section className="page-container pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'var(--v5-surface)', border: '1px solid var(--v5-line)' }}
          >
            <p className="eyebrow">The setup</p>
            <p className="mt-3 text-2xl font-bold font-display">{profile.setup.phone}</p>
            <div className="mt-4" style={{ borderTop: '1px solid var(--v5-line)' }}>
              {[
                profile.setup.chipset,
                profile.setup.display,
                `${profile.setup.ram} RAM · ${profile.setup.storage} free`,
                profile.setup.tuning,
                profile.setup.extra,
              ].map((line, i) => (
                <p
                  key={line}
                  className="row-link !py-3 text-[13px]"
                  style={{ color: 'var(--v5-muted)' }}
                >
                  <span className="row-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{line}</span>
                </p>
              ))}
            </div>
          </div>

          <div
            className="p-6 rounded-2xl flex flex-col justify-between"
            style={{ background: 'var(--v5-surface)', border: '1px solid var(--v5-line)' }}
          >
            <div>
              <p className="eyebrow">Found this useful?</p>
              <p className="mt-3 font-bold font-display text-xl">Send it to someone else.</p>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--v5-muted)' }}>
                Every project and every write-up, all in one place.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={copySite}
                className="btn-primary !min-h-0 !py-2.5 !px-4 text-[13px] rounded-lg"
              >
                <Copy size={14} />
                {copied ? 'Copied' : 'Copy link'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={shareSite}
                className="btn-secondary !min-h-0 !py-2.5 !px-4 text-[13px] rounded-lg"
              >
                <Share2 size={14} />
                Share
              </motion.button>
              <motion.a
                whileTap={{ scale: 0.95 }}
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !min-h-0 !py-2.5 !px-4 text-[13px] rounded-lg"
              >
                GitHub <ExternalLink size={13} />
              </motion.a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;