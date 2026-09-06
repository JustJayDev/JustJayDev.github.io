import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Archive as ArchiveIcon, Gift, Star, FlaskConical, BookOpen, Sparkles, Lock } from 'lucide-react';
import { useArchive } from '@/hooks/useData';

const TYPE_CONFIG = {
  achievement: { icon: Star, color: '#f59e0b', label: 'Achievement' },
  message: { icon: Gift, color: '#ec4899', label: 'Message' },
  experiment: { icon: FlaskConical, color: '#10b981', label: 'Experiment' },
  lore: { icon: BookOpen, color: '#8b5cf6', label: 'Lore' },
  easter_egg: { icon: Sparkles, color: '#f59e0b', label: 'Easter Egg' },
};

const Archive: React.FC = () => {
  const { items, loading } = useArchive();
  const [found, setFound] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);

  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      setTapCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
          setFound(true);
        }
        return next;
      });
    } else {
      setTapCount(1);
    }
    lastTapRef.current = now;
    setTimeout(() => setTapCount(0), 2000);
  };

  const publicItems = found ? items.filter(i => i.visibility === 'public') : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!found) {
    return (
      <div className="page-container py-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="p-8 rounded-full mx-auto cursor-pointer select-none" style={{ background: 'var(--color-surface)' }} onClick={handleLogoTap}>
            <ArchiveIcon size={64} style={{ color: 'var(--color-accent-light)', opacity: 0.3 }} />
          </div>
          <div>
            <h1 className="section-title">Archive</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              This section is hidden. Something might unlock it...
            </p>
            {tapCount > 0 && (
              <p className="text-xs mt-2" style={{ color: 'var(--color-accent-light)' }}>
                {tapCount}/3 taps
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="section-title flex items-center gap-3">
          <Sparkles size={32} style={{ color: 'var(--color-accent-light)' }} />
          Jay's Archive
        </h1>

        {publicItems.length === 0 ? (
          <div className="card p-8 text-center">
            <ArchiveIcon size={48} style={{ color: 'var(--color-text-muted)' }} className="mx-auto mb-4 opacity-50" />
            <p style={{ color: 'var(--color-text-muted)' }}>No archive items yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {publicItems.map((item, index) => {
              const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.lore;
              const Icon = config.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg" style={{ background: `${config.color}15` }}>
                      <Icon size={20} style={{ color: config.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{item.title}</h3>
                        <span className="badge text-xs">{config.label}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Archive;