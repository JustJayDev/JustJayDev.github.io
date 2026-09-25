import React, { useEffect, useState } from 'react';
import { Rss, ExternalLink, Copy, Check } from 'lucide-react';

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

/**
 * Devlog — RSS-driven build log, neon timeline style.
 */
const Devlog: React.FC = () => {
  const [entries, setEntries] = useState<DevlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch('./feed.xml')
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
            excerpt: stripHtml(item.querySelector('description')?.textContent || '').slice(0, 220),
          }))
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = (link: string) => {
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(link);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">devlog</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}>
        <span className="neon-text">Build notes</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        site updates & logs — newest first
      </p>

      <div style={{ marginTop: 28 }}>
        {loading && (
          <div className="mono" style={{ color: 'var(--cy)', padding: '40px 0' }}>
            &gt; fetching feed…
          </div>
        )}

        {error && (
          <div className="glass reveal" style={{ padding: 24 }}>
            <p className="mono" style={{ color: 'var(--muted)', margin: 0 }}>
              &gt; couldn't load the feed. Read it directly:{' '}
              <a href="/feed.xml" style={{ color: 'var(--cy)' }}>
                feed.xml
              </a>
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {entries.map((e) => (
            <div key={e.title} className="devlog-item reveal">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{e.title}</h3>
                <time>{e.date}</time>
              </div>
              <p className="mono" style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, margin: '8px 0' }}>
                {e.excerpt}
                {e.excerpt.length >= 220 ? '…' : ''}
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <a href={e.link} target="_blank" rel="noreferrer" className="mono" style={{ color: 'var(--cy)', textDecoration: 'none', fontSize: 13 }}>
                  open <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                </a>
                <button
                  onClick={() => copyLink(e.link)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copied === e.link ? 'var(--gr)' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  {copied === e.link ? <Check size={13} /> : <Copy size={13} />}
                  {copied === e.link ? 'copied' : 'copy link'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reveal" style={{ marginTop: 40 }}>
        <a href="./feed.xml" className="btn">
          <Rss size={16} /> Subscribe via RSS
        </a>
      </div>
    </div>
  );
};

export default Devlog;