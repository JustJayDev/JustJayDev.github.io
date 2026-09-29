/**
 * Home — the v6 "Observatory" console.
 *
 * Design rule for this file: the metaphor is a deep-space observatory, so a
 * surface is an instrument panel, a label is telemetry, and light comes from
 * aurora / starfield / orbital rings rather than flat fills. Nothing here is a
 * flat hairline box, because that is exactly what made v5 look thin.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Gamepad2, User, Dices, Copy, Share2, ExternalLink, Sparkles, Radio,
} from 'lucide-react';
import { profile, achievements, readouts } from '@/data/profile';
import { mainGames, type Game } from '@/data/games';
import { hubProjects, railWords } from '@/data/hub';
import { CountUp } from '@/components/CountUp';
import { useAch } from '@/context/AchievementContext';
import { useParallax, useRipple, setRef } from '@/lib/useCinematic';
import { useMagnetic } from '@/lib/useMagnetic';

const ROTATING = profile.rotating;

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
          <b>{w}</b>
        </span>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Project card
 * ------------------------------------------------------------------ */
const HubCard: React.FC<{ p: (typeof hubProjects)[number]; i: number }> = ({ p, i }) => {
  const glow = p.accent === 'cyan' ? 'var(--au-2)' : p.accent === 'magenta' ? 'var(--au-3)' : 'var(--au-1)';
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
      className="proj"
    >
      <div className="proj-art">
        <img src={p.art} alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className="proj-body">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="proj-idx">{p.index}</span>
          <span className="medal-tag !m-0" style={{ color: glow }}>
            {p.kind}
          </span>
        </div>
        <h3 className="mt-1.5 text-lg font-bold flex items-center gap-1.5">
          {p.name}
          <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
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
 * Now-playing / grinding panel
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
      className="panel w-full text-left p-5"
    >
      <div className="flex items-center justify-between gap-2">
        {game.image ? (
          <img
            src={game.image}
            alt={`${game.name} artwork`}
            loading="lazy"
            className="w-14 h-14 rounded-xl object-cover"
            style={{ border: '1px solid var(--line)' }}
          />
        ) : (
          <Gamepad2 size={26} style={{ color: 'var(--au-1)' }} />
        )}
        <span className="live">
          <i />
          Live
        </span>
      </div>
      <h3 className="mt-3 font-bold text-lg">{game.name}</h3>
      <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
        {game.badges.slice(0, 3).join(' · ')}
      </p>
      {game.lastUpdated && (
        <p className="text-[10px] mt-2 font-mono uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Updated {game.lastUpdated}
        </p>
      )}
    </motion.button>
  );
};

/* ------------------------------------------------------------------ *
 * Telemetry row list — used for setup + socials
 * ------------------------------------------------------------------ */
const Telemetry: React.FC<{ rows: [string, React.ReactNode][] }> = ({ rows }) => (
  <div>
    {rows.map(([k, v], i) => (
      <div className="trow" key={`${k}-${i}`}>
        <span className="trow-key">{k}</span>
        <span className="flex-1 min-w-0 text-[13px]">{v}</span>
      </div>
    ))}
  </div>
);

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
    hour < 4
      ? 'Still up'
      : hour < 12
        ? 'Good morning'
        : hour < 17
          ? 'Good afternoon'
          : hour < 21
            ? 'Good evening'
            : 'Late night';
  const istTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
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
        <div ref={heroRef} className="absolute inset-0 -z-10" aria-hidden="true" />

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* ---- text column ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="telemetry flex-wrap">
              <span className="live !text-[10px]">
                <i />
                {greeting}
              </span>
              <span style={{ color: 'var(--muted)' }}>{istTime} IST · {profile.location}</span>
            </p>

            <h1 className="hero-name mt-4 hero-name-glow">
              <span className="aurora-text">Just</span>
              <span className="hero-outline">Jay</span>
              <span className="aurora-text">Dev</span>
            </h1>

            <p className="mt-4 h-9 md:h-11 text-xl md:text-2xl font-bold font-display">
              <span className="aurora-text">{typed}</span>
              <span className="type-caret" aria-hidden="true" />
            </p>

            <p className="mt-4 max-w-lg text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {profile.chips.map((chip, i) => (
                <motion.span
                  key={chip}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
                  className="badge"
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
                className="btn-primary btn-magnet inline-flex items-center gap-2"
              >
                <Gamepad2 size={18} />
                See my games
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                ref={(n) => { setRef(aboutBtnRef, n); setRef(aboutRipple, n); }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { buzz(); navigate('/about'); }}
                className="btn-ghost btn-magnet inline-flex items-center gap-2"
              >
                <User size={18} />
                About me
              </motion.button>
            </div>
          </motion.div>

          {/* ---- portrait in its orbital ring ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-none"
          >
            <div className="orbit aspect-[4/5]">
              <img
                src={profile.heroImage}
                alt="Jay Kumar"
                className="w-full h-full object-cover"
                loading="eager"
                width={640}
                height={800}
              />
            </div>
            <span className="orbit-tag" style={{ top: 12, left: 12 }}>
              <Radio size={11} className="inline mr-1" />
              Tracking
            </span>
            <span className="orbit-tag" style={{ bottom: 12, right: 12 }}>
              {profile.location}
            </span>
            {/* caption plate */}
            <div className="absolute -bottom-5 left-3 right-3 sm:left-6 sm:right-auto panel px-4 py-3 flex items-center gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{profile.name}</p>
                <p className="trow-key !min-w-0">{profile.handle} · mobile only</p>
              </div>
              <Sparkles size={16} className="ml-auto shrink-0" style={{ color: 'var(--au-1)' }} />
            </div>
          </motion.div>
        </div>
      </section>

      <WordRail />

      {/* ================= INSTRUMENT READOUTS ================= */}
      <section className="page-container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {readouts.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="readout"
            >
              <p className="readout-value aurora-text">
                <CountUp to={r.value} suffix={r.suffix} />
              </p>
              <p className="readout-label">{r.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MILESTONES ================= */}
      <section className="page-container pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="telemetry">Milestones</p>
            <h2 className="section-title mt-1.5">Logged and verified</h2>
          </div>
          <span className="hidden sm:inline text-sm font-mono uppercase tracking-[0.14em] shrink-0" style={{ color: 'var(--au-2)' }}>
            {achievements.length} entries
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, i) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 4) * 0.07, duration: 0.45 }}
              className="medal"
            >
              <span className="medal-icon" aria-hidden="true">{a.icon}</span>
              <p className="medal-tag">{a.tag}</p>
              <h3 className="font-bold text-[15px] leading-snug">{a.title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                {a.detail}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ================= PROJECT HUB ================= */}
      <section className="page-container pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="telemetry">Payload</p>
            <h2 className="section-title mt-1.5">Things I built</h2>
          </div>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.14em] shrink-0"
            style={{ color: 'var(--au-1)' }}
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
            <p className="telemetry">Console</p>
            <h2 className="section-title mt-1.5">Now playing</h2>
          </div>
          <button
            onClick={() => navigate('/games')}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.14em] shrink-0"
            style={{ color: 'var(--au-1)' }}
          >
            All games <ArrowRight size={13} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {nowPlaying.map((g, i) => (
            <NowPlayingCard key={g.id} game={g} index={i} />
          ))}
          {/* what the player is actually chasing right now */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="panel p-5"
          >
            <span className="live">
              <i />
              Current objective
            </span>
            <h3 className="mt-3 font-bold text-lg">{profile.nowGrinding.goal}</h3>
            <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
              {profile.nowGrinding.game} · {profile.nowGrinding.mode}
            </p>
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--muted)' }}>
              {profile.nowGrinding.note}
            </p>
            <button
              onClick={() => navigate('/games')}
              className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.14em]"
              style={{ color: 'var(--au-1)' }}
            >
              Open game profile <ArrowRight size={12} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= DEVLOG TEASER ================= */}
      <section className="page-container pb-14">
        <p className="telemetry">Changelog</p>
        <h2 className="section-title mt-1.5 mb-4">Devlog</h2>
        <Telemetry
          rows={[
            [
              'v6.0',
              <span key="a">
                <b className="block font-bold">Observatory rebuild — new design system</b>
                <span className="block text-[13px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  A ground-up visual rebuild: layered starfield and aurora backdrop, glass instrument
                  panels, telemetry labels and real milestone data.
                </span>
              </span>,
            ],
            [
              'v3.3',
              <span key="b">
                <b className="block font-bold">Search, custom 404 and copy-links</b>
                <span className="block text-[13px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  Live search on the games page, copy-link on every devlog entry, proper 404 handling.
                </span>
              </span>,
            ],
          ].map((r) => [r[0], r[1]] as [string, React.ReactNode])}
        />
        <button
          onClick={() => navigate('/devlog')}
          className="mt-4 inline-flex items-center gap-1 text-[12px] font-mono uppercase tracking-[0.14em]"
          style={{ color: 'var(--au-1)' }}
        >
          Full devlog <ArrowRight size={12} />
        </button>
      </section>

      {/* ================= SURPRISE ================= */}
      <section className="page-container pb-14 text-center">
        <motion.button whileTap={{ scale: 0.95 }} onClick={pickSpotlight} className="btn-ghost">
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate('/games');
              }}
              role="button"
              tabIndex={0}
              className="panel mt-6 mx-auto max-w-sm p-6 text-center cursor-pointer"
            >
              {spotlight.image ? (
                <img
                  src={spotlight.image}
                  alt={`${spotlight.name} artwork`}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto"
                  style={{ border: '1px solid var(--line)' }}
                />
              ) : (
                <Gamepad2 size={44} className="mx-auto" style={{ color: 'var(--au-1)' }} />
              )}
              <h3 className="mt-3 font-bold text-xl">{spotlight.name}</h3>
              <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
                {spotlight.badges.slice(0, 3).join(' · ')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ================= SETUP + SOCIALS + SHARE ================= */}
      <section className="page-container pb-24">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="panel p-6">
            <p className="telemetry">Hardware</p>
            <p className="mt-3 text-2xl font-bold font-display">{profile.setup.phone}</p>
            <div className="mt-2">
              <Telemetry
                rows={[
                  ['SoC', profile.setup.chipset],
                  ['Panel', profile.setup.display],
                  ['Memory', `${profile.setup.ram} RAM · ${profile.setup.storage} free`],
                  ['Input', profile.setup.tuning],
                ]}
              />
            </div>
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--muted)' }}>
              {profile.setup.extra}
            </p>
          </div>

          <div className="panel p-6">
            <p className="telemetry">Downlink</p>
            <p className="mt-3 font-bold font-display text-xl">Find me here</p>
            <div className="mt-2">
              <Telemetry
                rows={profile.socials.map((s) => [
                  s.label,
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                    style={{ color: 'var(--au-2)' }}
                  >
                    {s.handle ?? 'open'} <ExternalLink size={11} />
                  </a>,
                ])}
              />
            </div>
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--muted)' }}>
              {profile.email}
            </p>
          </div>

          <div className="panel p-6 flex flex-col justify-between">
            <div>
              <p className="telemetry">Share</p>
              <p className="mt-3 font-bold font-display text-xl">Send it to someone else.</p>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
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