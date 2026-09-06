import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Gamepad2, Trophy, Users, MessageCircle, Heart, Archive, Menu, X, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/gaming', label: 'Gaming', icon: Gamepad2 },
  { path: '/esports', label: 'Esports', icon: Trophy },
  { path: '/social', label: 'Social', icon: Users },
  { path: '/contact', label: 'Contact', icon: MessageCircle },
  { path: '/support', label: 'Support', icon: Heart },
];

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
      if (currentY > lastScrollY && currentY > 100) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="page-container flex items-center justify-between h-14">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-bold text-lg tracking-tight"
          >
            <span className="gradient-text">JustJayDev</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--color-surface-2)' }}
              aria-label="Toggle theme"
            >
              <ThemeIcon size={18} style={{ color: 'var(--color-text-muted)' }} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl md:hidden"
              style={{ background: 'var(--color-surface-2)' }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-0 right-0 z-40 glass border-b md:hidden"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <nav className="page-container py-4 flex flex-col gap-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                      color: isActive ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
                    }}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => navigate('/archive')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
              >
                <Archive size={20} />
                <span className="font-medium">Archive</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-14 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile */}
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
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl min-w-[52px] transition-all"
                style={{
                  background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: isActive ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
                }}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl min-w-[52px]"
            style={{ color: mobileMenuOpen ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }}
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar hint */}
      <div className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map(({ path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="p-3 rounded-xl transition-all"
                style={{
                  background: isActive ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: isActive ? 'white' : 'var(--color-text-muted)',
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
                aria-label={path}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;