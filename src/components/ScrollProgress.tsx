import React, { useEffect, useState } from 'react';

/** Thin gradient progress bar fixed at the very top of the page. */
const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
    >
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${progress})`,
          background: 'linear-gradient(90deg, #6366f1, #d946ef, #22d3ee)',
          transition: 'transform 80ms linear',
          opacity: progress > 0.002 ? 1 : 0,
        }}
      />
    </div>
  );
};

export default ScrollProgress;