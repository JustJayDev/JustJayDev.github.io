import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Gamepad2 } from 'lucide-react';
import { useGames } from '@/hooks/useData';
import toast from 'react-hot-toast';

const GAME_ICONS: Record<string, string> = {
  'Free Fire MAX': '🔥',
  'BGMI': '🎯',
  'Fortnite': '🃏',
  'Roblox': '🧱',
  'Minecraft': '⛏️',
  'Call of Duty': '🎖️',
  'FC Mobile': '⚽',
  'PUBG': '💀',
};

const Gaming: React.FC = () => {
  const { games, loading } = useGames();
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const handleCopyUid = (uid: string, gameId: string) => {
    if (!uid || uid.startsWith('[')) return;
    navigator.clipboard.writeText(uid);
    setCopiedUid(gameId);
    toast.success('UID copied!');
    setTimeout(() => setCopiedUid(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const publicGames = games.filter(g => g.visibility === 'public');

  return (
    <div className="page-container py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">Gaming</h1>

        {publicGames.length === 0 ? (
          <div className="card p-8 text-center">
            <Gamepad2 size={48} style={{ color: 'var(--color-text-muted)' }} className="mx-auto mb-4 opacity-50" />
            <p style={{ color: 'var(--color-text-muted)' }}>No games added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {publicGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-5"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">
                    {GAME_ICONS[game.name] || game.icon || '🎮'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{game.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {game.server && `Server: ${game.server}`}
                    </p>
                  </div>
                  {game.externalUrl && (
                    <a
                      href={game.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl transition-colors"
                      style={{ background: 'var(--color-surface-2)' }}
                    >
                      <ExternalLink size={18} style={{ color: 'var(--color-text-muted)' }} />
                    </a>
                  )}
                </div>

                {/* Username */}
                <div className="mb-3">
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Username</p>
                  <p className="font-semibold text-lg">{game.username || '—'}</p>
                </div>

                {/* UID with Copy */}
                {game.uid && (
                  <div className="flex items-center justify-between p-3 rounded-xl mb-3" style={{ background: 'var(--color-surface-2)' }}>
                    <div>
                      <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>UID / Player ID</p>
                      <p className="font-mono font-semibold">{game.uid}</p>
                    </div>
                    <button
                      onClick={() => handleCopyUid(game.uid, game.id)}
                      disabled={!game.uid || game.uid.startsWith('[')}
                      className="p-2 rounded-xl transition-all disabled:opacity-30"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      {copiedUid === game.id ? (
                        <Check size={18} className="text-white" />
                      ) : (
                        <Copy size={18} className="text-white" />
                      )}
                    </button>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatItem label="Current Rank" value={game.currentRank} />
                  <StatItem label="Highest Rank" value={game.highestRank} />
                  <StatItem label="K/D" value={game.kd} />
                  <StatItem label="Win Rate" value={game.winRate} />
                </div>

                {/* Playstyle */}
                {game.playstyle && !game.playstyle.startsWith('[') && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Playstyle</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{game.playstyle}</p>
                  </div>
                )}

                {/* Achievements */}
                {game.achievements && game.achievements.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Achievements</p>
                    <div className="flex flex-wrap gap-1">
                      {game.achievements.map((ach, i) => (
                        <span key={i} className="badge badge-accent text-xs">{ach}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  if (!value || value.startsWith('[')) return null;
  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
};

export default Gaming;