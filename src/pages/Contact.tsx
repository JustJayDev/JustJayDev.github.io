import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="page-container py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">Contact</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <MessageSquare size={32} style={{ color: 'var(--color-accent-light)' }} />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Get in Touch</h3>
              <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
                The best way to reach me is through Discord. Join my server or send a direct message.
              </p>
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                Open Discord
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="font-bold mb-3">Quick Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Response time varies — I check messages regularly
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                For business / collaboration inquiries, use Discord
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                No spam or unsolicited messages please
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;