import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ArrowUp, Command, Menu, X } from 'lucide-react';
import { profile } from '@/data/profile';

/**
 * Shell — neon cyber nav + footer wrapper.
 */
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the mobile menu on route change / resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 720) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const links = [
    { to: '/', label: 'home' },
    { to: '/games', label: 'games' },
    { to: '/achievements', label: 'trophies' },
    { to: '/projects', label: 'projects' },
    { to: '/devlog', label: 'devlog' },
    { to: '/about', label: 'about' },
    { to: '/secret', label: '🔒 secret' },
  ];

  return (
    <>
      <nav className={'topnav' + (scrolled ? ' scrolled' : '')}>
        <div className="nav-inner">
          <Link to="/" className="logo-mark">
            <img src="./logo.svg" alt="JustJayDev" />
            <span className="logo-name">
              Just<b>JayDev</b>
              
            </span>
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                {l.label}
              </NavLink>
            ))}
            <button
              className="cmd-trigger"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))}
              aria-label="command palette (Ctrl+K)"
              title="Ctrl+K"
            >
              <Command size={15} />
              <span className="mono" style={{ fontSize: 10, color: 'var(--mg)' }}>K</span>
            </button>
          </div>
          <button
            className="burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {/* mobile drawer */}
        <div className={'mobile-menu' + (menuOpen ? ' open' : '')}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => 'mobile-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="wrap">
          <p style={{ marginBottom: 8 }}>
            <span style={{ color: 'var(--cy)' }}>$</span> JustJayDev — {profile.tagline}
          </p>
          <p style={{ margin: 0 }}>
            Built on a phone · © {new Date().getFullYear()} Jay Kumar ·{' '}
            <a href="https://github.com/JustJayDev" target="_blank" rel="noreferrer">
              github.com/JustJayDev
            </a>
          </p>
        </div>
      </footer>

      <button
        className={'back-to-top' + (showTop ? ' show' : '')}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="back to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
};

export default Shell;