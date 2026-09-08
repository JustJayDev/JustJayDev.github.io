import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * OfflineIndicator — toast when connection drops/recovers.
 * When offline, the PWA service worker serves the cached copy automatically.
 */
const OfflineIndicator: React.FC = () => {
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const goOffline = () => {
      setOnline(false);
      if (navigator.vibrate) navigator.vibrate([20, 60, 20]);
    };
    const goOnline = () => {
      setOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 2600);
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold glass"
            style={{
              border: '1px solid #f59e0b55',
              color: '#fbbf24',
              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
            }}
          >
            <WifiOff size={13} />
            Offline — showing saved copy
          </div>
        </motion.div>
      )}
      {online && showReconnected && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold glass"
            style={{
              border: '1px solid #22c55e55',
              color: '#4ade80',
              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
            }}
          >
            <Wifi size={13} />
            Back online
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;