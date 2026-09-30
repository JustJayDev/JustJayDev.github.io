import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { motion as M, usePrefersReducedMotion } from '@/lib/motion';

/** Reveal once on scroll into view. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...M.enter, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Count from 0 to `value` the first time it scrolls into view. */
export function CountUp({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const done = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        const dur = 1100;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** Section heading with an eyebrow, title and optional trailing slot. */
export function SectionHead({
  eyebrow,
  title,
  aside,
}: {
  eyebrow: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="section-head section-head--row">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-[6px]">{title}</h2>
        <div className="section-head__rule" />
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}

/** Page-level header used by every non-home route. */
export function PageHead({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  const reduced = usePrefersReducedMotion();
  const anim = reduced
    ? {}
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: M.enter };
  return (
    <header className="pt-[--s-8] pb-[--s-6] md:pt-[--s-8] md:pb-[--s-7]" {...anim}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-[10px] text-[length:var(--t-h1)]">{title}</h1>
      {lede ? <p className="lede mt-[--s-4]">{lede}</p> : null}
    </header>
  );
}

/** Key/value spec table. Used for device setup and game profiles. */
export function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="spec">
      {rows.map((r) => (
        <div className="spec__row" key={r.label}>
          <dt className="spec__key">{r.label}</dt>
          <dd className="spec__val">{r.value}</dd>
        </div>
      ))}
    </div>
  );
}

/** Asset paths in the content layer are written as "./games/foo.webp". A
 *  relative URL resolves against the CURRENT path, so on /games/dragon-city
 *  that becomes /games/games/foo.webp and 404s. Every asset here lives at the
 *  site root, so resolve against the base href instead. */
export function assetUrl(src: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const rel = src.replace(/^\.\//, '');
  return `${base}/${rel}`;
}

/** Game artwork banner, shared by the Games grid and the profile hero.
 *
 *  Games with real artwork get the image. The casual classics have none, so
 *  instead of an empty grey rectangle the frame renders a typographic plate
 *  built from the game's own accent, name and status — all of which already
 *  exist in the content layer, so nothing here is invented.
 */
export function GameArt({
  name,
  image,
  accent,
  kind,
  eager = false,
}: {
  name: string;
  image?: string;
  accent: string;
  kind: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  // `src` is only read when showImage is true, which already proves image exists,
  // but TS cannot see that through a Boolean() so narrow it explicitly.
  const showImage = Boolean(image) && !failed;
  const src = showImage ? assetUrl(image as string) : undefined;

  return (
    <div className="artframe" style={{ '--frame-accent': accent } as React.CSSProperties}>
      {showImage ? (
        <img
          className="artframe__img"
          src={src}
          alt={`${name} artwork`}
          width={1294}
          height={728}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          /* If the file 404s or fails to decode, fall through to the plate
             rather than leaving a broken image icon on the card. */
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="artframe__plate" aria-hidden="true">
          <span className="artframe__mark">{name}</span>
          <span className="artframe__kind">{kind}</span>
        </div>
      )}

      {/* The scrim only exists under real artwork; the plate keeps its wash. */}
      {showImage ? <span className="artframe__scrim" aria-hidden="true" /> : null}
    </div>
  );
}

export { motion };
