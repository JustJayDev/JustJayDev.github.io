import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Details = lazy(() => import('@/pages/Details'));
const Devlog = lazy(() => import('@/pages/Devlog'));
const Gaming = lazy(() => import('@/pages/Gaming'));
const Esports = lazy(() => import('@/pages/Esports'));
const Social = lazy(() => import('@/pages/Social'));
const Contact = lazy(() => import('@/pages/Contact'));
const Support = lazy(() => import('@/pages/Support'));
const Archive = lazy(() => import('@/pages/Archive'));
const Quiz = lazy(() => import('@/pages/Quiz'));
const Photos = lazy(() => import('@/pages/Photos'));
const Guestbook = lazy(() => import('@/pages/Guestbook'));
const Admin = lazy(() => import('@/pages/Admin'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div
      className="w-8 h-8 rounded-full border-2 animate-spin"
      style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
    />
  </div>
);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
          <AuthProvider>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/details" element={<Details />} />
              <Route path="/devlog" element={<Devlog />} />
              <Route path="/gaming" element={<Gaming />} />
              <Route path="/esports" element={<Esports />} />
              <Route path="/social" element={<Social />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/photos" element={<Photos />} />
              <Route path="/guestbook" element={<Guestbook />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;