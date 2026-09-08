import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AccentProvider } from '@/context/AccentContext';
import Shell from '@/components/Shell';
import ThemeStudio from '@/components/ThemeStudio';
import SwipeNav from '@/components/SwipeNav';
import PullToRefresh from '@/components/PullToRefresh';
import OfflineIndicator from '@/components/OfflineIndicator';
import InstallBanner from '@/components/InstallBanner';
import { sfx } from '@/lib/sound';
import { HomeSkeleton, GamesSkeleton, DevlogSkeleton, AboutSkeleton } from '@/components/Skeletons';
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Games = lazy(() => import('@/pages/Games'));
const Devlog = lazy(() => import('@/pages/Devlog'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PageLoader: React.FC<{ which?: 'home' | 'games' | 'devlog' | 'about' }> = ({ which = 'home' }) => {
  if (which === 'games') return <GamesSkeleton />;
  if (which === 'devlog') return <DevlogSkeleton />;
  if (which === 'about') return <AboutSkeleton />;
  return <HomeSkeleton />;
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    // Restore remembered scroll position for this page (0 if first visit)
    const saved = parseInt(sessionStorage.getItem('jj_scroll_' + pathname) || '0', 10);
    window.scrollTo({ top: saved, behavior: 'instant' as ScrollBehavior });
    // Re-restore shortly after lazy content mounts (position may shift)
    const t = setTimeout(() => {
      if (Math.abs(window.scrollY - saved) < 4 && saved > 0) {
        window.scrollTo({ top: saved, behavior: 'instant' as ScrollBehavior });
      }
    }, 150);
    // Save position while scrolling + on leave
    const onSave = () => sessionStorage.setItem('jj_scroll_' + pathname, String(window.scrollY));
    window.addEventListener('scroll', onSave, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onSave);
      sessionStorage.setItem('jj_scroll_' + pathname, String(window.scrollY));
    };
  }, [pathname]);
  return null;
};
const TITLES: Record<string, string> = {
  '/': 'JustJayDev — Jay Kumar · Builder, Gamer, Future Trader',
  '/about': 'About — JustJayDev',
  '/games': 'Games — JustJayDev',
  '/devlog': 'Devlog — JustJayDev',
};
const SKELETON: Record<string, 'home' | 'games' | 'devlog' | 'about'> = {
  '/': 'home',
  '/games': 'games',
  '/devlog': 'devlog',
  '/about': 'about',
};
const App: React.FC = () => {
  const location = useLocation();
  React.useEffect(() => {
    document.title = TITLES[location.pathname] || 'JustJayDev — Jay Kumar';
    sfx.whoosh();
  }, [location.pathname]);
  return (
    <ThemeProvider>
      <AccentProvider>
        <ScrollToTop />
        <div className="aurora" />
        <div className="bg-grid" />
        <Shell>
          <ThemeStudio />
          <OfflineIndicator />
          <SwipeNav>
            <PullToRefresh>
              <Suspense fallback={<PageLoader which={SKELETON[location.pathname] || 'home'} />}>
                <main
                  key={location.pathname}
                  className={`page-enter pb-24 md:pb-12 ${
                    document.documentElement.getAttribute('data-navdir') === 'forward'
                      ? 'page-dir-forward'
                      : document.documentElement.getAttribute('data-navdir') === 'back'
                        ? 'page-dir-back'
                        : ''
                  }`}
                >
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/devlog" element={<Devlog />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </Suspense>
            </PullToRefresh>
          </SwipeNav>
          <InstallBanner />
        </Shell>
      </AccentProvider>
    </ThemeProvider>
  );
};
export default App;