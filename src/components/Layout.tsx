import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Gamepad2, Trophy, Users, MessageCircle, Heart, Archive, Menu, X, Moon, Sun, Monitor, Search, BookOpen, Info } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import CommandPalette from '@/components/CommandPalette';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/details', label: 'Details', icon: Info },
  { path: '/devlog', label: 'Devlog', icon: BookOpen },
  { path: '/gaming', label: 'Gaming', icon: Gamepad2 },
  { path: '/esports', label: 'Esports', icon: Trophy },
  { path: '/social', label: 'Social', icon: Users },
  { path: '/contact', label: 'Contact', icon: MessageCircle },
  { path: '/support', label: 'Support', icon: Heart },
];

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme, theme } = useTheme();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admin-login';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);
      if (currentY > lastScrollY.current && currentY > 100) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };
  const ThemeIcon = resolvedTheme === 'dark' ? Moon : resolvedTheme === 'light' ? Sun : Monitor;

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="aurora" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <ScrollProgress />
      <CommandPalette />
      <header
        className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300"
        style={{
          borderBottom: '1px solid var(--color-border)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.25)' : 'none',
          transform: scrolled ? 'scale(0.995)' : 'scale(1)',
        }}
      >
        <div className="page-container flex items-center justify-between h-14">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-bold text-lg tracking-tight group"
          >
            <span className="gradient-text transition-transform duration-300 group-hover:scale-105 inline-block">JustJayDev</span>
          </button>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => window.dispatchEvent(new Event('jjdev:palette'))}
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--color-surface-2)' }}
              whileTap={{ scale: 0.85 }}
              aria-label="Search (Ctrl+K)"
            >
              <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
            </motion.button>
            <motion.button
              onClick={cycleTheme}
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--color-surface-2)' }}
              whileTap={{ scale: 0.85, rotate: -20 }}
              aria-label="Toggle theme"
            >
              <motion.span
                key={resolvedTheme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="block"
              >
                <ThemeIcon size={18} style={{ color: 'var(--color-text-muted)' }} />
              </motion.span>
            </motion.button>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl md:hidden"
              style={{ background: 'var(--color-surface-2)' }}
              whileTap={{ scale: 0.85 }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
        <motion.div
          className="h-px origin-left"
          style={{ background: 'linear-gradient(90deg, #6366f1, #d946ef)' }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-14 left-0 right-0 z-40 glass border-b md:hidden overflow-hidden"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <nav className="page-container py-4 flex flex-col gap-1">
              {[...NAV_ITEMS, { path: '/archive', label: 'Archive', icon: Archive }].map(({ path, label, icon: Icon }, i) => {
                const isActive = location.pathname === path;
                return (
                  <motion.button
                    key={path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate(path)}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                      color: isActive ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
                    }}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                    {isActive && <motion.span layoutId="mobile-nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />}
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="pt-14 pb-24 md:pb-8">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 glass border-t md:hidden transition-transform duration-300"
        style={{
          borderColor: 'var(--color-border)',
          transform: showBottomNav ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.slice(0, 5).map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                whileTap={{ scale: 0.85 }}
                className="relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl min-w-[52px] transition-all"
                style={{
                  color: isActive ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(99,102,241,0.12)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.span
                  animate={isActive ? { y: [-2, 0], scale: [1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Icon size={20} />
                </motion.span>
                <span className="relative text-[10px] font-medium">{label}</span>
              </motion.button>
            );
          })}
          <motion.button
            onClick={() => setMobileMenuOpen(true)}
            whileTap={{ scale: 0.85 }}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl min-w-[52px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">More</span>
          </motion.button>
        </div>
      </nav>
      <BackToTop />
      <Footer />
      <div className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                whileHover={{ scale: 1.12, x: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl transition-all relative group/side"
                style={{
                  background: isActive ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: isActive ? 'white' : 'var(--color-text-muted)',
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
                aria-label={label}
              >
                <Icon size={18} />
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover/side:opacity-100 transition-opacity pointer-events-none glass">
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Layout;
