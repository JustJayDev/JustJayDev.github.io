import { useEffect, useRef } from 'react';

/**
 * useTilt — 3D tilt + pointer glow for neon cards (desktop only).
 * Sets --px/--py for the card's radial glow and applies a subtle rotateX/Y.
 * Returns a callback ref so it works on any element/host.
 */
export function useTilt<T extends HTMLElement>(max = 8) {
  const elRef = useRef<T | null>(null);

  const setRef = (el: T | null) => {
    elRef.current = el;
  };

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 100;
      const py = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--px', px + '%');
      el.style.setProperty('--py', py + '%');

      const rx = ((py - 50) / 50) * -max;
      const ry = ((px - 50) / 50) * max;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return setRef;
}