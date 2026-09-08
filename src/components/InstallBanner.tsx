import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

type BIPEvent = Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };

/**
 * InstallBanner — smart "Add to Home Screen" prompt.
 * Shows after 2.5s for repeat visitors who haven't installed yet.
 */
const InstallBanner: React.FC = () => {
  const [promptEvent, setPromptEvent] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BIPEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!promptEvent) return;
    const installed = localStorage.getItem('jj_installed') === '1';
    const dismissed = sessionStorage.getItem('jj_install_dismissed') === '1';
    if (installed || dismissed) return;
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [promptEvent]);

  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') localStorage.setItem('jj_installed', '1');
    setVisible(false);
  };

  const dismiss = () => {
    sessionStorage.setItem('jj_install_dismissed', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed left-4 right-4 z-[65] md:left-auto md:right-6 md:w-96"
          style={{ bottom: 'calc(4.75rem + env(safe-area-inset-bottom))' }}
        >
          <div
            className="glass rounded-2xl p-4 flex items-center gap-3"
            style={{ border: '1px solid var(--color-border)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
          >
            <span
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), #d946ef)' }}
            >
              J
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">Install JustJayDev</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Fullscreen app · works offline
              </p>
            </div>
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), #d946ef)' }}
            >
              <Download size={13} />
              Install
            </button>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 active:scale-90 transition-transform"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallBanner;