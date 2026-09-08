import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gamepad2, ScrollText } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="page-container py-16 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-7xl md:text-9xl font-black gradient-text select-none">404</p>
        <h1 className="mt-2 text-xl md:text-2xl font-bold">This page went AFK</h1>
        <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          Nothing here — but the good stuff is one tap away.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { to: '/', label: 'Home', icon: <Home size={16} /> },
            { to: '/games', label: 'Games', icon: <Gamepad2 size={16} /> },
            { to: '/devlog', label: 'Devlog', icon: <ScrollText size={16} /> },
          ].map((l, i) => (
            <motion.div
              key={l.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <Link
                to={l.to}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
                style={{ background: 'var(--color-accent)', color: '#fff', textDecoration: 'none' }}
              >
                {l.icon}
                {l.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
