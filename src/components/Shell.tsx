import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { profile } from '@/data/profile';

/**
 * Shell — neon cyber nav + footer wrapper.
 */
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: 'home' },
    { to: '/games', label: 'games' },
    { to: '/devlog', label: 'devlog' },
    { to: '/about', label: 'about' },
  ];

  return (
    <>
      <nav className="topnav" style={scrolled ? { borderBottomColor: 'var(--line-strong)' } : undefined}>
        <div className="nav-inner">
          <Link to="/" className="logo-mark">
            <img src="./logo.svg" alt="JustJayDev" />
            <span className="logo-name">
              Just<b>JayDev</b>
              <span style={{ color: 'var(--mg)', marginLeft: 6 }}>//alt</span>
            </span>
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
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
    </>
  );
};

export default Shell;