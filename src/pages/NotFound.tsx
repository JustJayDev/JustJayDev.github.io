import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';

const GLITCH_CHARS = '▚▞¤ø§Ø×±#@%&$?';
const SUGGESTED = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/gaming', label: 'Gaming' },
  { path: '/esports', label: 'Esports' },
  { path: '/social', label: 'Social' },
  { path: '/contact', label: 'Contact' },
  { path: '/support', label: 'Support' },
  { path: '/archive', label: 'Archive' },
];

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState('404');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (frame % 6 === 0) {
        setGlitch(
          '404'.split('').map((c) => (Math.random() > 0.6 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c)).join('')
        );
      } else {
        setGlitch('404');
      }
    }, 220);
    return () => clearInterval(id);
  }, []);

  const matches = query.trim()
    ? SUGGESTED.filter((s) => s.label.toLowerCase().includes(query.trim().toLowerCase()))
    : SUGGESTED;

  return (
    <div className="page-container py-16 md:py-24 text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg flex flex-col items-center"
      >
        <p
          className="text-7xl md:text-8xl font-black gradient-text select-none"
          style={{ textShadow: '0 0 40px rgba(99,102,241,0.4)' }}
          aria-label="404"
        >
          {glitch}
        </p>
        <h1 className="section-title mt-4">Lost in the grid</h1>
        <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
          This page doesn't exist — but everything else is one tap away.
        </p>

        <div className="relative w-full mt-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            className="input-field pl-11"
            placeholder="Search pages… (try 'gaming')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search pages"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {matches.map((s, i) => (
            <motion.button
              key={s.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(s.path)}
              className="badge badge-accent"
            >
              {s.label}
              <ArrowRight size={12} />
            </motion.button>
          ))}
          {matches.length === 0 && (
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No page matches "{query}"</span>
          )}
        </div>

        <Link
          to="/"
          className="btn-primary mt-10"
          style={{ textDecoration: 'none' }}
        >
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;