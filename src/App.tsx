import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import Shell from '@/components/Shell';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Games = lazy(() => import('@/pages/Games'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div
      className="w-8 h-8 rounded-full"
      style={{
        border: '3px solid rgba(99,102,241,0.25)',
        borderTopColor: '#6366f1',
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

const App: React.FC = () => {
  const location = useLocation();

  return (
    <ThemeProvider>
      <ScrollToTop />
      <div className="aurora" />
      <div className="bg-grid" />
      <Shell>
        <Suspense fallback={<PageLoader />}>
          <main key={location.pathname} className="page-enter pb-24 md:pb-12">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/games" element={<Games />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </Suspense>
      </Shell>
    </ThemeProvider>
  );
};

export default App;
