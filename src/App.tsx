import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Shell from '@/components/Shell';
import CommandPalette from '@/components/CommandPalette';
import { useReveal } from '@/lib/useReveal';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Games = lazy(() => import('@/pages/Games'));
const GameProfile = lazy(() => import('@/pages/GameProfile'));
const Devlog = lazy(() => import('@/pages/Devlog'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const TITLES: Record<string, string> = {
  '/': 'JustJayDev //alt — Jay Kumar',
  '/about': 'About — JustJayDev //alt',
  '/games': 'Games — JustJayDev //alt',
  '/devlog': 'Devlog — JustJayDev //alt',
};

const Loader: React.FC = () => (
  <div className="wrap" style={{ paddingTop: 80, textAlign: 'center' }}>
    <div className="mono" style={{ color: 'var(--cy)' }}>
      &gt; loading_…
    </div>
  </div>
);

const App: React.FC = () => {
  const location = useLocation();
  useReveal();

  useEffect(() => {
    document.title =
      TITLES[location.pathname] ||
      (location.pathname.startsWith('/games/')
        ? 'Game Profile — JustJayDev //alt'
        : 'JustJayDev //alt — Jay Kumar');
  }, [location.pathname]);

  // scroll to top on nav
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  // scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  return (
    <>
      <div className="grid-bg" />
      <div className="glow-field" />
      <div className="vignette" />
      <div className="scanlines" />
      <div className="scroll-progress" id="scrollProgress" aria-hidden="true" />

      <Shell>
        <Suspense fallback={<Loader />}>
          <main key={location.pathname} className="page-enter">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:gameId" element={<GameProfile />} />
              <Route path="/devlog" element={<Devlog />} />
<Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </Suspense>
      </Shell>
      <CommandPalette />
    </>
  );
};

export default App;