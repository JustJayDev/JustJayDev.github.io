import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AccentProvider } from '@/context/AccentContext';
import Shell from '@/components/Shell';
import AccentPicker from '@/components/AccentPicker';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Games = lazy(() => import('@/pages/Games'));
const Devlog = lazy(() => import('@/pages/Devlog'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div
      className="w-8 h-8 rounded-full"
      style={{
        border: '3px solid color-mix(in srgb, var(--color-accent) 25%, transparent)',
        borderTopColor: 'var(--color-accent)',
        animation: 'bootspin 0.7s linear infinite',
      }}
    />
  </div>
);

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

const TITLES: Record<string, string> = {
  '/': 'JustJayDev — Jay Kumar · Builder, Gamer, Future Trader',
  '/about': 'About — JustJayDev',
  '/games': 'Games — JustJayDev',
  '/devlog': 'Devlog — JustJayDev',
};

const App: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    document.title = TITLES[location.pathname] || 'JustJayDev — Jay Kumar';
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <AccentProvider>
        <ScrollToTop />
        <div className="aurora" />
        <div className="bg-grid" />
        <Shell>
          <AccentPicker />
          <Suspense fallback={<PageLoader />}>
            <main key={location.pathname} className="page-enter pb-24 md:pb-12">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/games" element={<Games />} />
                <Route path="/devlog" element={<Devlog />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </Suspense>
        </Shell>
      </AccentProvider>
    </ThemeProvider>
  );
};

export default App;
