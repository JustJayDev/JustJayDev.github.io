import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Flame, Heart, Glasses, RefreshCw } from 'lucide-react';
import { useSiteData, countVisitOnce } from '@/hooks/useSiteData';
import { useLang } from '@/context/LanguageContext';

const REACTIONS = [
  { key: 'fire', label: 'Fire', icon: Flame },
  { key: 'heart', label: 'Love', icon: Heart },
  { key: 'cool', label: 'Cool', icon: Glasses },
];

const VisitorBadge: React.FC = () => {
  const { t } = useLang();
  const { data, refresh, save } = useSiteData();
  const [visits, setVisits] = useState<number | null>(null);
  const [reacted, setReacted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    countVisitOnce((v) => setVisits(v));
  }, []);

  useEffect(() => {
    try {
      setReacted(localStorage.getItem('jjdev-reacted'));
    } catch { /* private mode */ }
  }, []);

  const react = async (key: string) => {
    if (reacted || busy) return;
    setBusy(true);
    const next = {
      ...data,
      reactions: { ...data.reactions, [key]: (data.reactions[key] || 0) + 1 },
    };
    await save(next);
    try { localStorage.setItem('jjdev-reacted', key); } catch { /* ignore */ }
    setReacted(key);
    setBusy(false);
  };

  const shownVisits = visits ?? data.visits ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass"
        style={{ border: '1px solid var(--color-border)' }}
      >
        <Eye size={15} style={{ color: 'var(--color-accent-light)' }} />
        <span className="text-sm font-bold tabular-nums">{shownVisits.toLocaleString()}</span>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('visits')}</span>
        <button
          onClick={() => refresh()}
          className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Refresh count"
        >
          <RefreshCw size={12} />
        </button>
      </motion.div>

      <div className="flex items-center gap-2">
        {REACTIONS.map(({ key, label, icon: Icon }) => {
          const isMine = reacted === key;
          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.85 }}
              whileHover={{ y: -2 }}
              onClick={() => react(key)}
              disabled={!!reacted || busy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full glass transition-all disabled:cursor-default"
              style={{
                border: `1px solid ${isMine ? 'var(--color-accent)' : 'var(--color-border)'}`,
                opacity: reacted && !isMine ? 0.55 : 1,
              }}
              aria-label={`React ${label}`}
            >
              <Icon size={15} style={{ color: isMine ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }} />
              <span className="text-xs font-bold tabular-nums">{(data.reactions[key] || 0).toLocaleString()}</span>
            </motion.button>
          );
        })}
      </div>
      {reacted && (
        <p className="text-[11px] w-full text-center" style={{ color: 'var(--color-text-muted)' }}>
          {t('reacted')}
        </p>
      )}
    </div>
  );
};

export default VisitorBadge;