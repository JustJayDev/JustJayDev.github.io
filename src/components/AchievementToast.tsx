import { AnimatePresence, motion } from 'framer-motion';
import { useAch } from '@/context/AchievementContext';

/**
 * AchievementToast — bottom sheet that pops when a visitor unlocks a badge.
 */
const AchievementToast: React.FC = () => {
  const { toast } = useAch();

  return (
    <div className={`ach-toast ${toast ? 'show' : ''}`} aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, scale: 0.85, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid color-mix(in srgb, var(--color-accent) 45%, transparent)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            }}
          >
            <span className="text-2xl" aria-hidden="true">{toast.icon}</span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-accent-light)' }}>
                Achievement unlocked
              </span>
              <span className="block text-sm font-bold">{toast.label}</span>
              <span className="block text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                {toast.desc}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementToast;