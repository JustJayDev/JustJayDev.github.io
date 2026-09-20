import { useEffect, useRef } from 'react';

/**
 * Spotlight — soft glow that follows the cursor on desktop.
 * Hidden on touch + reduced-motion via CSS.
 */
const Spotlight: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
        el.classList.add('on');
      });
    };
    const onLeave = () => el.classList.remove('on');

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="spotlight" aria-hidden="true" />;
};

export default Spotlight;