import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareHeart, Github, ExternalLink } from 'lucide-react';
import VisitorBadge from '@/components/VisitorBadge';
import { useLang } from '@/context/LanguageContext';

/**
 * Guestbook powered by giscus (GitHub Discussions).
 * Messages are real GitHub Discussions in JustJayDev/JustJayDev.github.io —
 * visible to everyone, shared across all devices, zero server cost.
 */

const GISCUS = {
  repo: 'JustJayDev/JustJayDev.github.io',
  repoId: 'R_kgDOUP-CdQ',
  category: 'General',
  categoryId: 'DIC_kwDOUP-Cdc4DFEHv',
  mapping: 'specific',
  'term': 'Guestbook',
  'reactionsEnabled': '1',
  'emitMetadata': '0',
  'inputPosition': 'top',
  'theme': 'dark',
  'lang': 'en',
  'loading': 'lazy',
} as const;

const Guestbook: React.FC = () => {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.childElementCount > 0) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    Object.entries(GISCUS).forEach(([k, v]) => {
      script.setAttribute(`data-${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, v);
    });

    // giscus needs a stable element; mount once
    const mount = document.createElement('div');
    mount.className = 'giscus';
    el.appendChild(mount);
    mount.appendChild(script);
    setReady(true);

    // re-theme when site theme changes
    const onTheme = (e: Event) => {
      const detail = (e as CustomEvent<{ theme?: string }>).detail;
      if (detail?.theme) {
        const frame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
        frame?.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: detail.theme } } },
          'https://giscus.app'
        );
      }
    };
    window.addEventListener('giscus-theme', onTheme);
    return () => window.removeEventListener('giscus-theme', onTheme);
  }, []);

  return (
    <div className="page-container py-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}>
          <MessageSquareHeart size={12} /> GUESTBOOK
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"><span className="gradient-text">{t('guestbookTitle')}</span></h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          {t('guestbookDesc')}
        </p>
      </motion.div>

      <div className="mb-8">
        <VisitorBadge />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }} className="card p-4 mb-6">
        <p className="text-xs flex items-start gap-2 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          <Github size={14} className="shrink-0 mt-0.5" />
          <span>
            Messages live in <a href="https://github.com/JustJayDev/JustJayDev.github.io/discussions" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent-light)' }}>GitHub Discussions</a> — sign in with GitHub once and your note shows up for every visitor, on every device. No spam, no database, no cost. <ExternalLink size={11} className="inline" />
          </span>
        </p>
      </motion.div>

      <div ref={containerRef} className="giscus-wrap min-h-[320px]" />
      {!ready && (
        <div className="card p-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading guestbook…</div>
      )}
    </div>
  );
};

export default Guestbook;