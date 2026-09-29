/**
 * Shell — v6 "Observatory" chrome.
 *
 * The three fixed backdrop layers (starfield, aurora ribbons, horizon grid)
 * are mounted here so the whole document shares one set of depth layers.
 * Without these the design has no metaphor, which is exactly what made v5
 * read as flat.
 */
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Gamepad2, User, BookOpen, Moon, Sun, ArrowUp, Rss, Volume2, VolumeX,
  Image as ImageIcon, ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { sfx } from '@/lib/sound';

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/games', label: 'Games', icon: Gamepad2 },
  { to: '/devlog', label: 'Devlog', icon: BookOpen },
  { to: '/about', label: 'About', icon: User },
];

/** Icon button used in the header for sound + theme. */
const GhostButton: React.FC<{
  onClick: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ onClick, label, active, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-95 hover:scale-105"
    style={{
      border: `1px solid ${active ? 'var(--au-1)' : 'var(--line)'}`,
      color: active ? 'var(--au-1)' : 'var(--muted)',
      background: 'transparent',
    }}
  >
    {children}
  </button>
);

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
      {/* ============ BACKDROP (the observatory) ============ */}
      <div className="starfield" aria-hidden="true" />
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="bg-grid" aria-hidden="true" />

      {/* orbital scroll arc */}
      <div
        className="scroll-progress"
        aria-hidden="true"
        style={{ ['--p' as string]: progress }}
      />

      {/* ============ HEADER ============ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
        <div className="page-container h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.svg" alt="" className="w-8 h-8 rounded-lg" style={{ border: '1px solid var(--line)' }} />
            <span className="font-display text-[17px] tracking-tight">
              Just<span className="aurora-text">JayDev</span>
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
                  `px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    isActive ? 'aurora-text' : ''
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: 'var(--au-1)',
                        background: 'color-mix(in srgb, var(--au-1) 10%, transparent)',
                      }
                    : { color: 'var(--muted)' }
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <GhostButton onClick={toggleSound} label={muted ? 'Unmute sounds' : 'Mute sounds'} active={!muted}>
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </GhostButton>
            <GhostButton onClick={toggleTheme} label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}>
              {resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </GhostButton>
          </div>
        </div>
      </header>

      {/* ============ PAGE CONTENT ============ */}
      <div className="flex-1 pt-16">{children}</div>

      {/* ============ FOOTER ============ */}
      <footer className="page-container py-10 text-center">
        <div
          className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-xs font-mono uppercase tracking-[0.12em]"
          style={{ color: 'var(--muted)' }}
        >
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className="hover:opacity-70 transition-opacity">
              {label}
            </NavLink>
          ))}
          <a
            href="https://justjaydev.github.io/pixvault/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <ImageIcon size={11} /> PixVault
          </a>
          <a
            href="https://justjaydev.github.io/TitleForge/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <ExternalLink size={11} /> TitleForge
          </a>
          <a href="/feed.xml" className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity">
            <Rss size={11} /> RSS
          </a>
        </div>
        <p className="text-[11px] mt-4 font-mono tracking-[0.12em]" style={{ color: 'var(--muted)' }}>
          © 2026 JustJayDev · built on a phone, shipped from India
        </p>
      </footer>

      {/* ============ BACK TO TOP (mobile) ============ */}
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
              bottom: 'calc(5rem + env(safe-area-inset-bottom))',
              background: 'var(--panel-solid)',
              border: '1px solid var(--line)',
              color: 'var(--text)',
            }}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ============ BOTTOM NAV (mobile) ============ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(8);
                  sfx.tick();
                }}
                className="relative flex flex-col items-center justify-center w-20 h-full"
                style={{ color: active ? 'var(--au-1)' : 'var(--muted)' }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-x-3 inset-y-2 rounded-lg"
                    style={{ background: 'color-mix(in srgb, var(--au-1) 12%, transparent)' }}
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