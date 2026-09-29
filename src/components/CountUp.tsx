import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * useCountUp — animates a number from 0 to its target when it scrolls into view.
 * Used by the Home stats strip for that satisfying "odometer" effect.
 */
export const useCountUp = (target: number, durationMs = 1200): { ref: React.RefObject<HTMLSpanElement | null>; value: number } => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      // easeOutExpo for a snappy finish
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, durationMs]);

  return { ref, value };
};

/**
 * CountUp — ready-made span that counts up when visible.
 */
export const CountUp: React.FC<{ to: number; suffix?: string; className?: string }> = ({ to, suffix = '', className }) => {
  const { ref, value } = useCountUp(to);
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {value}
      {suffix}
    </span>
  );
};