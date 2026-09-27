import React, { useMemo, useState } from 'react';
import { Rss, ExternalLink, Search, X, ArrowRight } from 'lucide-react';
import {
  PROJECTS,
  sortedUpdates,
  projectById,
  TYPE_META,
  type ProjectId,
  type DevlogUpdate,
} from '@/data/devlog';
import ProjectLogo from '@/components/ProjectLogo';

type Filter = ProjectId | 'all';

/**
 * Devlog — central development hub for every JustJayDev project.
 *
 * Fed entirely by src/data/devlog.ts. Adding an update there regenerates
 * this page, the RSS feed and the home preview — no other wiring needed.
 *
 * Layout: project filter rail → grouped timeline, each project reading as
 * its own section with branding, status badge and its own update entries.
 */
const Devlog: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Set<string>>(new Set());

  const all = useMemo(() => sortedUpdates(), []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((u) => {
      if (filter !== 'all' && u.project !== filter) return false;
      if (q && !(u.title + ' ' + u.summary + ' ' + u.body).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [all, filter, query]);

  /* group visible updates by project so each project reads as a section */
  const grouped = useMemo(() => {
    const map = new Map<ProjectId, DevlogUpdate[]>();
    visible.forEach((u) => {
      if (!map.has(u.project)) map.set(u.project, []);
      map.get(u.project)!.push(u);
    });
    return Array.from(map.entries());
  }, [visible]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    all.forEach((u) => (c[u.project] = (c[u.project] || 0) + 1));
    return c;
  }, [all]);

  const toggle = (key: string) =>
    setOpen((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">devlog</div>
      <h2
        className="reveal"
        style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}
      >
        <span className="neon-text">Build log</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        development updates for every project — newest first
      </p>

      {/* ---------- search ---------- */}
      <div
        className="glass reveal"
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginTop: 24 }}
      >
        <Search size={15} style={{ color: 'var(--mg)', flex: 'none' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search updates across all projects…"
          className="mono"
          aria-label="search devlog"
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
            aria-label="clear search"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 0 }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ---------- project rail ---------- */}
      <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        <button
          onClick={() => setFilter('all')}
          className="chip"
          style={chipStyle(filter === 'all', 'var(--cy)')}
        >
          all projects <span style={{ opacity: 0.5 }}>{counts.all}</span>
        </button>
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilter(p.id)}
            className="chip"
            style={chipStyle(filter === p.id, p.accent)}
          >
            <span style={{ fontSize: 9, lineHeight: 1 }}>●</span> {p.name}{' '}
            <span style={{ opacity: 0.5 }}>{counts[p.id] || 0}</span>
          </button>
        ))}
      </div>

      {/* ---------- body ---------- */}
      <div style={{ marginTop: 30 }}>
        {visible.length === 0 && (
          <div className="glass reveal" style={{ padding: 24 }}>
            <p className="mono" style={{ color: 'var(--muted)', margin: 0 }}>
              &gt; no updates match{query ? ` "${query}"` : ''}
              {filter !== 'all' ? ` in ${projectById(filter).name}` : ''}.
            </p>
          </div>
        )}

        {grouped.map(([pid, items]) => {
          const p = projectById(pid);
          return (
            <section key={pid} style={{ marginBottom: 42 }}>
              {/* project header */}
              <div
                className="reveal"
                style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}
              >
                <ProjectLogo projectId={pid} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{p.name}</h3>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        color: accentOf(pid),
                        border: `1px solid ${accentOf(pid)}44`,
                        padding: '3px 8px',
                        borderRadius: 999,
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p
                    className="mono"
                    style={{ color: 'var(--muted)', fontSize: 12, margin: '4px 0 0', lineHeight: 1.5 }}
                  >
                    {p.blurb}
                  </p>
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{ fontSize: 12, padding: '8px 14px', flex: 'none' }}
                  >
                    open <ExternalLink size={13} />
                  </a>
                )}
              </div>

              {/* timeline for this project */}
              <div style={{ ['--node' as string]: accentOf(pid) }}>
                {items.map((u, i) => {
                  const meta = TYPE_META[u.type];
                  const key = pid + u.date + u.title;
                  const isOpen = open.has(key);
                  const proj = projectById(u.project);
                  return (
                    <div
                      key={key}
                      className="devlog-item devlog-pop reveal"
                      style={{ animationDelay: String(i * 55) + 'ms' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {u.version && <span className="devlog-version">{u.version}</span>}
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                          {u.title}
                        </h4>
                        <span
                          className="chip"
                          style={{
                            borderColor: meta.color + '55',
                            color: meta.color,
                            fontSize: 10,
                            padding: '2px 8px',
                            cursor: 'default',
                          }}
                        >
                          ● {meta.label}
                        </span>
                        <time style={{ marginLeft: 'auto' }}>{fmt(u.date)}</time>
                      </div>
                      <p
                        className="mono"
                        style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, margin: '8px 0' }}
                      >
                        {isOpen ? u.body : u.summary}
                      </p>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => toggle(key)}
                          className="mono"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--mg)',
                            fontFamily: 'var(--mono)',
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          {isOpen ? 'show less' : 'read more'}
                          <ArrowRight
                            size={12}
                            style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                          />
                        </button>
                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mono"
                            style={{ color: 'var(--cy)', textDecoration: 'none', fontSize: 13 }}
                          >
                            view project <ExternalLink size={11} style={{ verticalAlign: 'middle' }} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="reveal" style={{ marginTop: 8 }}>
        <a href="./feed.xml" className="btn">
          <Rss size={16} /> Subscribe via RSS
        </a>
      </div>
    </div>
  );
};

const chipStyle = (active: boolean, color: string): React.CSSProperties =>
  active
    ? {
        cursor: 'pointer',
        borderColor: color,
        color,
        background: color + '14',
        boxShadow: `0 0 12px ${color}33`,
      }
    : { cursor: 'pointer' };

const accentOf = (id: ProjectId) => projectById(id).accent;

const fmt = (iso: string) => {
  try {
    return new Date(iso + 'T12:00:00+05:30').toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export default Devlog;