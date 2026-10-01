import { useEffect, useState } from 'react';

/** Global reduced-motion. One hook, applied at the root — not per component. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** Motion presets, so durations and easings are never typed ad hoc.
 *  Only the presets that are actually referenced live here — an unreferenced
 *  easing curve is just a second place for the design to drift. */
export const motion = {
  enter: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
  spring: { type: 'spring' as const, stiffness: 420, damping: 32 },

  /* --- the entrance ramp ---------------------------------------------------
   * Three distances, one easing, one duration each. Everything that enters
   * the page picks a distance from this ladder, so nothing in the site
   * invents its own "y: 12" and the motion stays legible as one system.
   *  near -- chrome and labels: 8px, 0.36s
   *  mid  -- body copy and buttons: 14px, 0.50s
   *  far  -- the one thing that matters on a screen: 26px, 0.62s       */
  enterNear: { duration: 0.36, ease: [0.16, 0.84, 0.28, 1] },
  enterMid: { duration: 0.5, ease: [0.16, 0.84, 0.28, 1] },
  enterFar: { duration: 0.62, ease: [0.16, 0.84, 0.28, 1] },

  /* Stagger step for lists. 60ms reads as a wave at a deliberate pace;
   * anything under ~40ms collapses into one simultaneous blip, and anything
   * over ~90ms makes a short list feel slow to finish arriving. */
  stagger: 0.06,

  /* The per-glyph hero cascade. 22ms is about the ceiling of what reads as
   * sequential rather than random -- past that, a long handle stops looking
   * like a wave and starts looking like a slow serial port. */
  glyph: 0.022,
} as const;

/** Distance presets paired with the transition that suits them. Exported as
 *  one object so a component writes `V.mid.hidden` and cannot pair a small
 *  distance with the long duration, or the reverse. */
export const enter = {
  near: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: motion.enterNear } },
  mid: { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: motion.enterMid } },
  far: { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: motion.enterFar } },
} as const;

/** Parent that hands its children a staggered `show`. Only framer-motion knows
 *  each child's index at runtime, so the step lives here rather than in every
 *  list that would otherwise type its own delay. */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: motion.stagger, delayChildren: 0.06 } },
} as const;

/** Scroll progress 0→1, throttled to animation frames. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}