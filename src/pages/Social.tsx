import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, MessageSquare, Instagram, Twitter, Reddit, Github, ExternalLink } from 'lucide-react';
import { useSocialLinks } from '@/hooks/useData';

const PLATFORM_CONFIG = {
  youtube: { icon: Youtube, color: '#FF0000', label: 'YouTube' },
  discord: { icon: MessageSquare, color: '#5865F2', label: 'Discord' },
  instagram: { icon: Instagram, color: '#E4405F', label: 'Instagram' },
  x: { icon: Twitter, color: '#000000', label: 'X (Twitter)' },
  reddit: { icon: Reddit, color: '#FF4500', label: 'Reddit' },
  github: { icon: Github, color: '#ffffff', label: 'GitHub' },
  twitter: { icon: Twitter, color: '#000000', label: 'Twitter' },
};

const Social: React.FC = () => {
  const { links, loading } = useSocialLinks();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const publicLinks = links.filter(l => l.visibility === 'public');

  return (
    <div className="page-container py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">Social</h1>

        {publicLinks.length === 0 ? (
          <div className="card p-8 text-center">
            <p style={{ color: 'var(--color-text-muted)' }}>No social links added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {publicLinks.map((link, index) => {
              const config = PLATFORM_CONFIG[link.platform] || PLATFORM_CONFIG.discord;
              const Icon = config.icon;
              return (
                <motion.a
                  key={link.id}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 flex items-center gap-4 group"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${config.color}15` }}
                  >
                    <Icon size={24} style={{ color: config.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{config.label}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      @{link.username}
                    </p>
                  </div>
                  <ExternalLink size={18} style={{ color: 'var(--color-text-muted)' }} className="group-hover:opacity-100 opacity-0 transition-opacity" />
                </motion.a>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Social;