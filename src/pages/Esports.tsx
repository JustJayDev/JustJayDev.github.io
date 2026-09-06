import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useEsportsRecords, useSettings } from '@/hooks/useData';
import { hashPassword } from '@/firebase/auth';
import toast from 'react-hot-toast';

const Esports: React.FC = () => {
  const { records, loading } = useEsportsRecords();
  const { settings } = useSettings();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const maxAttempts = 5;

  const handleUnlock = async () => {
    if (attempts >= maxAttempts) {
      toast.error('Too many attempts. Try again later.');
      return;
    }
    if (!password.trim()) {
      toast.error('Enter the password');
      return;
    }

    setIsVerifying(true);
    setError(false);

    try {
      const hashed = await hashPassword(password);
      if (settings?.esportsPasswordHash && hashed === settings.esportsPasswordHash) {
        setIsUnlocked(true);
        setError(false);
        toast.success('Access granted!');
      } else {
        setError(true);
        setAttempts(prev => prev + 1);
        setPassword('');
        toast.error('Incorrect password');
      }
    } catch {
      setError(true);
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isUnlocked) {
    return (
      <div className="page-container py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Unlock size={28} style={{ color: 'var(--color-accent-light)' }} />
            </div>
            <div>
              <h1 className="section-title !mb-0">Competitive Profile</h1>
              <p className="text-sm" style={{ color: 'var(--color-accent-light)' }}>Unlocked</p>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="card p-8 text-center">
              <p style={{ color: 'var(--color-text-muted)' }}>No esports records yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{record.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {record.game} • {record.date}
                      </p>
                    </div>
                    <span className="badge badge-accent">{record.placement}</span>
                  </div>
                  {record.description && (
                    <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>{record.description}</p>
                  )}
                  {record.prize && (
                    <p className="text-sm mt-1 font-medium" style={{ color: 'var(--color-accent-light)' }}>
                      Prize: {record.prize}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center"
      >
        <div className="p-6 rounded-full mb-6" style={{ background: 'rgba(99,102,241,0.1)' }}>
          <Lock size={48} style={{ color: 'var(--color-accent-light)' }} />
        </div>
        <h1 className="section-title">Competitive Profile</h1>
        <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
          This section is private. Enter the password to unlock.
        </p>

        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter password"
              className="input-field pr-12"
              disabled={attempts >= maxAttempts}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
            >
              <AlertCircle size={16} />
              Incorrect password. {maxAttempts - attempts} attempts remaining.
            </motion.div>
          )}

          <button
            onClick={handleUnlock}
            disabled={isVerifying || attempts >= maxAttempts}
            className="btn-primary w-full"
          >
            {isVerifying ? 'Verifying...' : 'Unlock'}
          </button>

          <p className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
            Protected content • Rate-limited
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Esports;