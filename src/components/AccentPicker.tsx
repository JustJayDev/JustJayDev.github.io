import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { ACCENTS, useAccent } from '@/context/AccentContext';

const AccentPicker: React.FC = () => {
  const { accent, setAccent } = useAccent();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-3 top-16 md:top-24 md:right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="glass rounded-2xl p-3 mb-2 shadow-xl"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <p className="text-[10px] uppercase tracking-wider font-bold mb-2 px-1" style={{ color: 'var(--color-text-muted)' }}>
              Accent
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  aria-label={`Set accent ${a.label}`}
                  title={a.label}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{
                    background: a.accent,
                    outline: accent === a.id ? '2px solid var(--color-text)' : 'none',
                    outlineOffset: 2,
                  }}
                >
                  {accent === a.id && <span className="text-[10px] font-black text-white">✓</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close accent picker' : 'Open accent picker'}
        aria-expanded={open}
        className="w-10 h-10 rounded-full flex items-center justify-center glass shadow-lg"
        style={{ color: 'var(--color-text)' }}
      >
        {open ? <X size={17} /> : <Palette size={17} />}
      </motion.button>
    </div>
  );
};

export default AccentPicker;