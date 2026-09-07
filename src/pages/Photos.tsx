import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { PHOTOS } from '@/data/photos';
import { useLang } from '@/context/LanguageContext';

const Photos: React.FC = () => {
  const { t } = useLang();
  const tags = useMemo(() => ['All', ...Array.from(new Set(PHOTOS.map((p) => p.tag)))], []);
  const [tag, setTag] = useState('All');
  const [open, setOpen] = useState<number | null>(null);
  const shown = tag === 'All' ? PHOTOS : PHOTOS.filter((p) => p.tag === tag);

  return (
    <div className="page-container py-10 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}>
          <Camera size={12} /> GALLERY
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"><span className="gradient-text">{t('galleryTitle')}</span></h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          {t('galleryDesc')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => { setTag(t); setOpen(null); }}
            className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              background: tag === t ? 'var(--color-accent)' : 'var(--color-surface-2)',
              color: tag === t ? 'white' : 'var(--color-text-muted)',
              borderColor: tag === t ? 'var(--color-accent)' : 'var(--color-border)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.button
              layout
              key={p.title}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => setOpen(i)}
              className="card p-0 overflow-hidden text-left group relative"
              style={{ aspectRatio: '4/3' }}
            >
              {p.src ? (
                <img src={p.src} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: 'var(--color-surface-2)' }}>
                  <span className="text-4xl group-hover:scale-125 transition-transform duration-300">{p.emoji}</span>
                  <span className="text-[10px] px-2 text-center" style={{ color: 'var(--color-text-muted)' }}>{t('photoSoon')}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-2.5 pt-8" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}>
                <p className="text-xs font-semibold text-white truncate">{p.title}</p>
                <p className="text-[10px] text-white/70">{p.tag}</p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && shown[open] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {shown[open].src ? (
                <img src={shown[open].src} alt={shown[open].title} className="w-full rounded-2xl" />
              ) : (
                <div className="rounded-2xl flex items-center justify-center" style={{ aspectRatio: '4/3', background: 'var(--color-surface-2)' }}>
                  <span className="text-7xl">{shown[open].emoji}</span>
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm font-semibold text-white">{shown[open].title}</p>
                <button onClick={() => setOpen(null)} className="p-2 rounded-full glass" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photos;