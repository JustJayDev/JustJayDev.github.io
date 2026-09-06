import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="page-container py-16 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-7xl md:text-8xl font-black" style={{ color: 'var(--color-accent)' }}>404</p>
        <h1 className="section-title mt-4">Page not found</h1>
        <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
          The page you're looking for doesn't exist or was moved.
        </p>
        <Link
          to="/"
          className="card inline-block mt-6 px-6 py-3 font-semibold"
          style={{ textDecoration: 'none' }}
        >
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
