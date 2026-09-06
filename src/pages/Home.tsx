import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gamepad2, Users, MessageCircle, Heart, Share2, Copy, Check, QrCode } from 'lucide-react';
import { useProfile } from '@/hooks/useData';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowExplore(true), 500);
    return () => clearTimeout(t);
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'JustJayDev',
        text: profile?.tagline || 'Check out my digital identity!',
        url: window.location.href,
      });
    } else {
      handleCopyUrl();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-16">
      {/* Hero / Landing */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center gap-6 pt-8"
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-full overflow-hidden border-2" style={{ borderColor: 'var(--color-accent)' }}>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold gradient-text">
                {profile?.displayName?.charAt(0) || 'J'}
              </div>
            )}
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <span className="text-white text-xs">👑</span>
          </motion.div>
        </motion.div>

        {/* Branding */}
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: 'var(--color-accent-light)' }}
          >
            {profile?.brandName || 'JustJayDev'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-black tracking-tight"
          >
            {profile?.displayName || 'Jay Kumar'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {profile?.tagline || 'Gamer • Creator • Builder'}
          </motion.p>
        </div>

        {/* Digital ID */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
        >
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
            ID:
          </span>
          <span className="text-sm font-mono font-semibold" style={{ color: 'var(--color-accent-light)' }}>
            {profile?.digitalId || 'JJDEV-001'}
          </span>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-2"
        >
          <button onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
            Explore
            <ArrowRight size={18} />
          </button>
          <button onClick={handleShare} className="btn-secondary">
            <Share2 size={18} />
            Share
          </button>
          <button onClick={handleCopyUrl} className="btn-secondary">
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </motion.div>
      </motion.div>

      {/* Explore Section */}
      <motion.div
        id="explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: showExplore ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mt-16 space-y-6"
      >
        <h2 className="section-title text-center">Digital Space</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLinkCard
            icon={<Gamepad2 size={28} />}
            label="Gaming"
            desc="Stats & profiles"
            onClick={() => navigate('/gaming')}
            delay={0}
          />
          <QuickLinkCard
            icon={<Users size={28} />}
            label="Social"
            desc="Connect with me"
            onClick={() => navigate('/social')}
            delay={0.1}
          />
          <QuickLinkCard
            icon={<MessageCircle size={28} />}
            label="Contact"
            desc="Get in touch"
            onClick={() => navigate('/contact')}
            delay={0.2}
          />
          <QuickLinkCard
            icon={<Heart size={28} />}
            label="Support"
            desc="Support my work"
            onClick={() => navigate('/support')}
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* Role badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-2"
      >
        {(profile?.roles || ['Gamer', 'Creator', 'Builder']).map((role) => (
          <span key={role} className="badge badge-accent">
            {role}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const QuickLinkCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
  delay: number;
}> = ({ icon, label, desc, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 + delay }}
    onClick={onClick}
    className="card p-5 flex flex-col items-center gap-3 text-center group"
  >
    <div style={{ color: 'var(--color-accent-light)' }} className="group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
    </div>
  </motion.button>
);

export default Home;