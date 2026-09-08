import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * SwipeNav — horizontal swipe gestures to switch pages (mobile, app-like).
 * Swipe left → next page · swipe right → previous page.
 * Ignores swipes that start on links, buttons, inputs or .no-swipe zones.
 */
const ORDER = ['/', '/games', '/play', '/devlog', '/about'];

const SwipeNav: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const touch = useRef<{ x: number; y: number; t: number } | null>(null);

  const currentIdx = ORDER.indexOf(location.pathname);

  const onStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const target = e.target as HTMLElement;
    // Don't hijack swipes that start on interactive elements
    if (
      target.closest('a, button, input, textarea, select, [role="button"], .no-swipe')
    ) {
      touch.current = null;
      return;
    }
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };

  const onEnd = (e: React.TouchEvent) => {
    if (!touch.current || currentIdx === -1) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    const dt = Date.now() - touch.current.t;
    touch.current = null;

    const isHorizontal = Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.8;
    const isFast = dt < 700;
    if (!isHorizontal || !isFast) return;

    // Swipe left (dx negative) → next page · Swipe right → previous page
    const nextIdx = dx < 0 ? currentIdx + 1 : currentIdx - 1;
    if (nextIdx < 0 || nextIdx >= ORDER.length) return;
    document.documentElement.setAttribute('data-navdir', dx < 0 ? 'forward' : 'back');
    if (navigator.vibrate) navigator.vibrate(8);
    navigate(ORDER[nextIdx]);
  };

  return (
    <div onTouchStart={onStart} onTouchEnd={onEnd} className="swipe-zone">
      {children}
    </div>
  );
};

export default SwipeNav;
