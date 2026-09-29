import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import { profile } from '@/content/profile';
import { marqueeItems, stats } from '@/content/site';
import { motion as M, usePrefersReducedMotion } from '@/lib/motion';

/** The name, in three staged layers: per-glyph rise, a primed chromatic
 *  split, and a single deliberate glitch after settle. */
function HeroName() {
  const reduced = usePrefersReducedMotion();
  const [glitch, setGlitch] = useState(false);
  const text = profile.handle;

  useEffect(() => {
    if (reduced) return;
    const armed = sessionStorage.getItem('jj-glitch-fired') === '1';
    if (armed) return;
    const t = window.setTimeout(() => {
      setGlitch(true);
      sessionStorage.setItem('jj-glitch-fired', '1');
      window.setTimeout(() => setGlitch(false), 260);
    }, 1200);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <h1 className="relative font-display text-[length:var(--t-display)] font-bold leading-[0.95] tracking-[-0.03em]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="relative inline-block">
        {text.split('').map((ch, i) =>
          reduced ? (
            <span key={i}>{ch}</span>
          ) : (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...M.spring, delay: i * 0.014 }}
            >
              {ch}
            </motion.span>
          ),
        )}
        {/* Chromatic split — armed at rest, fires deliberately */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-display font-bold leading-[0.95] tracking-[-0.03em]"
          style={{
            color: 'var(--accent)',
            opacity: glitch ? 0.85 : 0,
            transform: glitch ? 'translateX(-4px)' : 'translateX(-1.5px)',
            mixBlendMode: 'screen',
            transition: 'transform 260ms var(--ease-in-out), opacity 90ms linear',
          }}
        >
          {text}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-display font-bold leading-[0.95] tracking-[-0.03em]"
          style={{
            color: 'var(--live)',
            opacity: glitch ? 0.85 : 0,
            transform: glitch ? 'translateX(4px)' : 'translateX(1.5px)',
            mixBlendMode: 'screen',
            transition: 'transform 260ms var(--ease-in-out), opacity 90ms linear',
          }}
        >
          {text}
        </span>
      </span>
    </h1>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  return (
    <section className="pt-[--s-7] pb-[--s-6] md:pt-[--s-8]">
      <div className="flex items-start gap-[--s-4]">
        <img
          src={profile.heroImage}
          alt={`${profile.name} — ${profile.handle}`}
          width={56}
          height={56}
          className="h-14 w-14 flex-none rounded-[var(--r-md)] object-cover ring-1 ring-[--line] md:h-16 md:w-16"
        />
        <div className="min-w-0 flex-1">
          <p className="mono-xs mute">{greeting()} · {profile.location}</p>
          <div className="mt-[--s-4]">
            <HeroName />
          </div>
          <p className="mono mt-[--s-3] accent">{profile.tagline}</p>
        </div>
      </div>

      <motion.p
        className="lede mt-[--s-5]"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...M.enter, delay: 0.25 }}
      >
        {profile.bioLong}
      </motion.p>

      <motion.div
        className="mt-[--s-5] flex flex-wrap gap-[--s-3]"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...M.enter, delay: 0.35 }}
      >
        <Link to="/games" className="btn btn--primary">
          See my games <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link to="/about" className="btn btn--ghost">
          <User size={16} aria-hidden="true" /> About me
        </Link>
      </motion.div>

      {/* Interest marquee — the only continuous motion besides the field */}
      <div className="mt-[--s-6] overflow-hidden border-y border-[--line] py-[10px]">
        <div className="flex w-max gap-[--s-5] pr-[--s-5] motion-safe:animate-[marquee_38s_linear_infinite]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-[--s-5]" aria-hidden={dup === 1}>
              {marqueeItems.map((item) => (
                <span key={item} className="mono-xs mute whitespace-nowrap">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="mono-xs mute mt-[--s-3]">
        {stats.gamesPlayed} games · {stats.grindingNow} grinding now · {stats.projects} projects shipped
      </p>
    </section>
  );
}
