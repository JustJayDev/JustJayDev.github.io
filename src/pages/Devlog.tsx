import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PenLine } from 'lucide-react';
import { POSTS } from '../data/devlogPosts';

const Devlog: React.FC = () => {
  const [open, setOpen] = useState<string | null>(POSTS[0]?.slug ?? null);

  return (
    <div className="page-container py-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4"
          style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}
        >
          <PenLine size={12} /> DEVLOG
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          <span className="gradient-text">Build Log</span>
        </h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          What I am working on, what broke, what shipped. Raw and real.
        </p>
      </motion.div>

      <div className="space-y-3">
        {POSTS.map((post, i) => {
          const isOpen = open === post.slug;
          return (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : post.slug)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-accent-light)' }}>
                    {post.date}
                  </p>
                  <h2 className="font-semibold text-sm md:text-base" style={{ color: 'var(--color-text)' }}>
                    {post.title}
                  </h2>
                </div>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                  <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-muted)' }}>
                      {post.body}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default Devlog;
