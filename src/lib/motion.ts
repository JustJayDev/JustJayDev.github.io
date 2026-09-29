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

/** Motion presets, so durations and easings are never typed ad hoc. */
export const motion = {
  micro: { duration: 0.14, ease: [0.22, 0.61, 0.36, 1] },
  state: { duration: 0.24, ease: [0.65, 0.05, 0.36, 1] },
  enter: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
  spring: { type: 'spring' as const, stiffness: 420, damping: 32 },
  softSpring: { type: 'spring' as const, stiffness: 300, damping: 22 },
  stagger: (i: number) => ({ delay: Math.min(i, 8) * 0.05 }),
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