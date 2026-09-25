import { useEffect } from 'react';

/**
 * useReveal — global scroll-reveal. Adds .in to every .reveal element
 * as it enters the viewport (IntersectionObserver).
 *
 * Because pages are lazy-loaded and swap on navigation, we can't rely on a
 * one-time scan: newly mounted .reveal elements (from lazy chunks / route
 * changes) must be picked up too. We use a MutationObserver to watch the
 * document for new .reveal nodes and observe them as they appear, so reveal
 * animations work on every page, every navigation — not just the first mount.
 */
export function useReveal() {
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    const seen = new WeakSet<Element>();

    const reveal = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('in');
    };

    const observe = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (!io) return;
      io.observe(el);
    };

    const scan = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
      if (!('IntersectionObserver' in window)) {
        // No IO support: just reveal everything immediately.
        els.forEach(reveal);
        return;
      }
      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
      }
      els.forEach(observe);
    };

    // Initial scan (covers elements already in the DOM).
    scan();

    // Watch for newly added .reveal nodes (lazy chunk loads, route swaps).
    if ('MutationObserver' in window) {
      mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of Array.from(m.addedNodes)) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            const el = node as Element;
            if (el.classList && el.classList.contains('reveal')) observe(el);
            // Also catch .reveal elements nested inside the added subtree.
            el.querySelectorAll?.('.reveal').forEach(observe);
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, []);
}