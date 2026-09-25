import React, { useEffect, useMemo, useState } from 'react';
import { Rss, ExternalLink, Copy, Check, Search, X } from 'lucide-react';

interface DevlogEntry {
  title: string;
  link: string;
  date: string;
  excerpt: string;
  full: string;
  version: string;
  category: string;
}

type Category = 'all' | 'feature' | 'design' | 'art' | 'bugfix' | 'content';

const CATEGORIES: Category[] = ['all', 'feature', 'design', 'art', 'bugfix', 'content'];

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  feature: { label: 'feature', color: 'var(--cy)' },
  design: { label: 'design', color: 'var(--mg)' },
  art: { label: 'art', color: 'var(--am)' },
  bugfix: { label: 'bugfix', color: 'var(--rd)' },
  content: { label: 'content', color: 'var(--gr)' },
};

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

const guessCategory = (text: string): string => {
  const t = text.toLowerCase();
  if (/(art|banner|graphic|image|asset|webp|svg|logo)/.test(t)) return 'art';
  if (/(fix|bug|broken|refuse|crop|patch)/.test(t)) return 'bugfix';
  if (/(design|theme|style|palette|glass|neon|animation|motion|revamp|rebuild|launch|live)/.test(t)) return 'design';
  if (/(profile|bio|tagline|social|link|content|stats|info|detail)/.test(t)) return 'content';
  return 'feature';
};

/**
 * Devlog — RSS-driven build log, neon timeline style.
 * Glowing spine, version badges, category tags + filter, search,
 * expandable excerpts, scanline sweep, staggered reveals.
 */
const Devlog: React.FC = () => {
  const [entries, setEntries] = useState<DevlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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
          items.map((item) => {
            const title = item.querySelector('title')?.textContent || 'Untitled';
            const full = stripHtml(item.querySelector('description')?.textContent || '');
            const versionMatch = title.match(/^(v[\d.]+)/i);
            return {
              title: title.replace(/^(v[\d.]+)\s*[\u2014\u2013-]\s*/i, '').trim(),
              link: item.querySelector('link')?.textContent || '#',
              date: parseDate(item.querySelector('pubDate')?.textContent || ''),
              full,
              excerpt: full.slice(0, 220),
              version: versionMatch ? versionMatch[1] : '',
              category: guessCategory(title + ' ' + full),
            };
          })
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (filter !== 'all' && e.category !== filter) return false;
      if (q && !(e.title + ' ' + e.full).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: entries.length };
    entries.forEach((e) => {
      c[e.category] = (c[e.category] || 0) + 1;
    });
    return c;
  }, [entries]);

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
        site updates &amp; logs — newest first
      </p>

      {/* controls */}
      <div className="reveal" style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* search */}
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
          <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search build notes…"
            className="mono"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 13,
              width: '100%',
              fontFamily: 'var(--mono)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 0 }}
              aria-label="clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* filter chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((c) => {
            const meta = c === 'all' ? null : CATEGORY_META[c];
            const active = filter === c;
            const n = counts[c] || 0;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className="chip"
                style={{
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  borderColor: active ? (meta ? meta.color : 'var(--cy)') : 'var(--line-strong)',
                  color: active ? (meta ? meta.color : 'var(--cy)') : 'var(--muted)',
                  background: active ? 'rgba(34,211,238,0.08)' : 'rgba(10,12,28,0.7)',
                  boxShadow: active ? '0 0 12px ' + (meta ? meta.color : 'var(--cy)') + '33' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {meta && <span style={{ fontSize: 9, opacity: 0.8 }}>●</span>} {c} <span style={{ opacity: 0.5 }}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

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
              <a href="./feed.xml" style={{ color: 'var(--cy)' }}>
                feed.xml
              </a>
            </p>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="glass reveal" style={{ padding: 24 }}>
            <p className="mono" style={{ color: 'var(--muted)', margin: 0 }}>
              &gt; no entries match "{query}"{filter !== 'all' ? ' in ' + filter : ''}.
            </p>
          </div>
        )}

        <div className="devlog-timeline" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {visible.map((e, i) => {
            const meta = CATEGORY_META[e.category] || CATEGORY_META.feature;
            const isOpen = expanded.has(e.title);
            const canExpand = e.full.length > 220;
            return (
              <div
                key={e.title}
                className="devlog-item devlog-pop reveal"
                style={{ animationDelay: String(i * 60) + 'ms', ['--node' as string]: meta.color }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {e.version && <span className="devlog-version">{e.version}</span>}
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{e.title}</h3>
                  <span
                    className="chip"
                    style={{ borderColor: meta.color + '55', color: meta.color, fontSize: 10, padding: '2px 8px', cursor: 'default' }}
                  >
                    ● {meta.label}
                  </span>
                  <time>{e.date}</time>
                </div>
                <p className="mono" style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, margin: '8px 0' }}>
                  {isOpen ? e.full : e.excerpt}
                  {!isOpen && canExpand ? '…' : ''}
                </p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
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
                  {canExpand && (
                    <button
                      onClick={() => toggleExpand(e.title)}
                      className="mono"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--mg)', fontFamily: 'var(--mono)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      {isOpen ? 'show less' : 'read more'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
