import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gamepad2, User, BookOpen, Moon, Sun, ArrowUp, Rss, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { sfx } from '@/lib/sound';
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
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(sfx.isMuted());

  useEffect(() => {
    // unlock WebAudio on the very first user gesture (mobile autoplay policy)
    window.addEventListener('pointerdown', sfx.unlock, { once: true });
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', sfx.unlock);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  const toggleTheme = () => {
    sfx.toggle(resolvedTheme === 'dark');
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  const toggleSound = () => {
    sfx.setMuted(!muted);
    setMuted(!muted);
    if (muted) sfx.tick();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ============ SCROLL PROGRESS ============ */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left transition-transform duration-150 ease-out"
          style={{
            transform: `scaleX(${progress})`,
            background: 'linear-gradient(90deg, var(--color-accent), #8b5cf6, #d946ef)',
          }}
        />
      </div>

      {/* ============ TOP BAR ============ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="page-container h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="JustJayDev logo"
              className="w-8 h-8 rounded-lg"
              style={{ boxShadow: '0 2px 10px color-mix(in srgb, var(--color-accent) 40%, transparent)' }}
            />
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
                onClick={() => sfx.tick()}
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

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{ background: 'var(--color-surface-2)', color: muted ? 'var(--color-text-muted)' : 'var(--color-accent)' }}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ============ PAGE CONTENT ============ */}
      <div className="flex-1 pt-14">{children}</div>

      {/* ============ FOOTER (desktop) ============ */}
      <footer className="hidden md:block page-container py-8 text-center">
        <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="transition-colors hover:opacity-70 px-1.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {label}
            </NavLink>
          ))}
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-1 transition-colors hover:opacity-70 px-1.5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Rss size={11} />
            RSS
          </a>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
          © 2026 JustJayDev · built on a phone, shipped from India
        </p>
      </footer>

      {/* ============ BACK TO TOP ============ */}
      <AnimatePresence>
        {progress > 0.25 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="md:hidden fixed right-4 z-40 w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              bottom: 'calc(4.5rem + env(safe-area-inset-bottom))',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              color: 'var(--color-text)',
            }}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

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
                onClick={() => { if (navigator.vibrate) navigator.vibrate(8); sfx.tick(); }}
                className="relative flex flex-col items-center justify-center w-20 h-full"
                style={{ color: active ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-3 inset-y-2 rounded-xl"
                    style={{ background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)' }}
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