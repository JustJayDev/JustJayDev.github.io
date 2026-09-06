import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Heart } from 'lucide-react';
import { useProfile } from '@/hooks/useData';

const About: React.FC = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">About</h1>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Sparkles size={24} style={{ color: 'var(--color-accent-light)' }} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Introduction</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                {profile?.bio || 'Personal digital identity powered by JustJayDev.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Heart size={24} style={{ color: 'var(--color-accent-light)' }} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {(profile?.interests || ['Gaming', 'Coding', 'Building']).map((item) => (
                  <span key={item} className="badge badge-accent">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Target size={24} style={{ color: 'var(--color-accent-light)' }} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Goals</h3>
              <ul className="space-y-2">
                {(profile?.goals || ['Keep building', 'Keep growing']).map((goal, i) => (
                  <li key={i} className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="font-bold text-lg mb-4">What I Do</h3>
          <div className="flex flex-wrap gap-2">
            {(profile?.roles || ['Gamer', 'Creator', 'Builder']).map((role) => (
              <span key={role} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                {role}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;