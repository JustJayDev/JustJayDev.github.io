import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gamepad2, User, BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/games', label: 'Games', icon: Gamepad2 },
  { to: '/devlog', label: 'Devlog', icon: BookOpen },
  { to: '/about', label: 'About', icon: User },
];

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen flex flex-col">
      {/* ============ TOP BAR ============ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="page-container h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}
            >
              J
            </span>
            <span className="font-black tracking-tight text-lg">
              Just<span className="gradient-text">JayDev</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'gradient-text' : ''
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'var(--color-surface-2)' }
                    : { color: 'var(--color-text-muted)' }
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* ============ PAGE CONTENT ============ */}
      <div className="flex-1 pt-14">{children}</div>

      {/* ============ FOOTER (desktop) ============ */}
      <footer className="hidden md:block page-container py-8 text-center">
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          © 2026 JustJayDev · built on a phone, shipped from India 🇮🇳
        </p>
      </footer>

      {/* ============ BOTTOM NAV (mobile) ============ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-16">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active =
              to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex flex-col items-center justify-center w-20 h-full"
                style={{ color: active ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-3 inset-y-2 rounded-xl"
                    style={{ background: 'rgba(99,102,241,0.12)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="relative z-10 text-[10px] font-semibold mt-0.5">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Shell;