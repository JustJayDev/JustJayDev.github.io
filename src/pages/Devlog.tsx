import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rss, CalendarDays } from 'lucide-react';

interface DevlogEntry {
  title: string;
  link: string;
  date: string;
  excerpt: string;
}

const parseDate = (raw: string) => {
  try {
    return new Date(raw).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return raw;
  }
};

const stripHtml = (s: string) => {
  const el = document.createElement('div');
  el.innerHTML = s;
  return (el.textContent || '').trim();
};

const Devlog: React.FC = () => {
  const [entries, setEntries] = useState<DevlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = 'Devlog — JustJayDev';
    fetch('/feed.xml')
      .then((r) => {
        if (!r.ok) throw new Error('feed fetch failed');
        return r.text();
      })
      .then((text) => {
        const xml = new DOMParser().parseFromString(text, 'text/xml');
        const items = Array.from(xml.querySelectorAll('item'));
        setEntries(
          items.map((item) => ({
            title: item.querySelector('title')?.textContent || 'Untitled',
            link: item.querySelector('link')?.textContent || '#',
            date: parseDate(item.querySelector('pubDate')?.textContent || ''),
            excerpt: stripHtml(item.querySelector('description')?.textContent || '').slice(0, 180),
          }))
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          <span className="gradient-text">Devlog</span>
        </h1>
        <p className="mt-3 text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          Build notes & site updates — newest first
        </p>
      </motion.div>

      <div className="mt-10 max-w-2xl mx-auto flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full" style={{ border: '3px solid rgba(99,102,241,0.25)', borderTopColor: '#6366f1', animation: 'bootspin 0.7s linear infinite' }} />
          </div>
        )}

        {error && (
          <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Couldn't load the feed. Read it directly:{' '}
              <a href="/feed.xml" className="font-semibold" style={{ color: 'var(--color-accent-light)' }}>feed.xml</a>
            </p>
          </div>
        )}

        {!loading && !error && entries.map((e, i) => (
          <motion.a
            key={e.link + i}
            href={e.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.06, 0.3), duration: 0.45 }}
            className="tilt-card rounded-2xl p-5 block"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-base md:text-lg">{e.title}</h2>
              <span className="inline-flex items-center gap-1 text-[11px] shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                <CalendarDays size={12} />
                {e.date}
              </span>
            </div>
            {e.excerpt && (
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {e.excerpt}…
              </p>
            )}
          </motion.a>
        ))}

        {!loading && !error && entries.length === 0 && (
          <p className="text-center text-sm py-10" style={{ color: 'var(--color-text-muted)' }}>No entries yet.</p>
        )}

        <a
          href="/feed.xml"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold mt-2 mb-4"
          style={{ color: 'var(--color-accent-light)' }}
        >
          <Rss size={15} />
          Subscribe via RSS
        </a>
      </div>
    </div>
  );
};

export default Devlog;
