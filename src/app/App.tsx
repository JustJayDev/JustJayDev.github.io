import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, Readout } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';
import { Field } from '@/components/shell/Field';
import { ScrollProgress } from '@/components/shell/ScrollProgress';
import { usePrefersReducedMotion } from '@/lib/motion';

const Home = lazy(() => import('@/routes/Home'));
const Games = lazy(() => import('@/routes/Games'));
const GameProfile = lazy(() => import('@/routes/GameProfile'));
const Projects = lazy(() => import('@/routes/Projects'));
const Devlog = lazy(() => import('@/routes/Devlog'));
const About = lazy(() => import('@/routes/About'));
const NotFound = lazy(() => import('@/routes/NotFound'));

function Page({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        id="main"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

function RouteFallback() {
  return (
    <div className="shell py-[--s-8]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="skel h-[42px] w-[45%] rounded-[var(--r-sm)]" />
      <div className="skel mt-[--s-4] h-[16px] w-[70%] rounded-[var(--r-sm)]" />
      <div className="skel mt-[--s-6] h-[180px] w-full rounded-[var(--r-md)]" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <ScrollProgress />
      <Field />
      <Header />

      <Readout />

      <Suspense fallback={<RouteFallback />}>
        <Page>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameProfile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/devlog" element={<Devlog />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Page>
      </Suspense>

      <Footer />
    </>
  );
}