import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

/**
 * PullToRefresh — drag down at the top of the page to reload, like a native app.
 * Shows a springy spinner that follows your finger, then refreshes.
 */
const THRESHOLD = 70;

const PullToRefresh: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const start = useRef<number | null>(null);
  const armed = useRef(false);

  useEffect(() => {
    // Only arm pull-to-refresh when scrolled to the very top
    const check = () => {
      armed.current = window.scrollY <= 2;
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const doRefresh = () => {
    setRefreshing(true);
    if (navigator.vibrate) navigator.vibrate(12);
    setTimeout(() => window.location.reload(), 350);
  };

  const onStart = (e: React.TouchEvent) => {
    if (!armed.current || refreshing) return;
    const target = e.target as HTMLElement;
    if (target.closest('.no-pull')) return;
    start.current = e.touches[0].clientY;
  };

  const onMove = (e: React.TouchEvent) => {
    if (start.current === null || refreshing) return;
    const dy = e.touches[0].clientY - start.current;
    if (dy > 0 && window.scrollY <= 2) {
      // Rubber-band resistance
      setPull(Math.min(dy * 0.45, 110));
      if (dy >= THRESHOLD * 2 && navigator.vibrate) navigator.vibrate(5);
    } else {
      setPull(0);
    }
  };

  const onEnd = () => {
    start.current = null;
    if (pull >= THRESHOLD) {
      doRefresh();
    } else {
      setPull(0);
    }
  };

  const progress = Math.min(pull / THRESHOLD, 1);

  return (
    <>
      {/* Pull indicator */}
      <AnimatePresence>
        {(pull > 8 || refreshing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-[55] flex justify-center pointer-events-none"
          >
            <motion.div
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
              animate={{
                scale: refreshing ? 1 : 0.7 + progress * 0.5,
                rotate: refreshing ? 360 : progress * 180,
              }}
              transition={refreshing ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : { duration: 0.1 }}
              style={{
                color: progress >= 1 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <RefreshCw size={16} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        style={{
          transform: pull > 0 && !refreshing ? `translateY(${pull * 0.5}px)` : undefined,
          transition: start.current === null ? 'transform 0.25s ease-out' : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default PullToRefresh;