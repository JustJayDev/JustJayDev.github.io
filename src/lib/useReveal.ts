import { useEffect } from 'react';

/**
 * useReveal — adds .is-visible to every .reveal element as it scrolls in.
 * One global IntersectionObserver, created lazily on first use.
 */
let io: IntersectionObserver | null = null;
const watched = new Set<Element>();

function getObserver(): IntersectionObserver {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io?.unobserve(entry.target);
          watched.delete(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  return io;
}

/**
 * Call once per page (or app). Finds all current .reveal nodes and observes them.
 * Re-runs safely; existing nodes are skipped via the `watched` set.
 */
export function useReveal() {
  useEffect(() => {
    // Respect reduced motion: show everything immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const obs = getObserver();
    const nodes = document.querySelectorAll('.reveal:not(.is-visible)');
    nodes.forEach((n) => {
      if (!watched.has(n)) {
        watched.add(n);
        obs.observe(n);
      }
    });
    return () => {
      // observer is global; nodes clean themselves up on intersection
    };
  }, []);
}