import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '@/data/profile';
import { PROJECTS, sortedUpdates, type ProjectId } from '@/data/devlog';
import ProjectLogo from '@/components/ProjectLogo';

/** Map the central devlog registry onto the shipped-project cards so each
 *  card carries its real branding instead of an emoji. */
const LIVE_PROJECTS: Record<string, ProjectId> = {
  TitleForge: 'titleforge',
  PixVault: 'pixvault',
};

/**
 * Projects — things I've built, with real per-project branding.
 */
const Projects: React.FC = () => {
  const latest = sortedUpdates().slice(0, 3);

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">projects</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}>
        <span className="neon-text">Things I&rsquo;ve built</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        shipped from a phone · open source
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, marginTop: 28 }}>
        {projects.map((p, i) => {
          const pid = LIVE_PROJECTS[p.name];
          return (
            <div
              key={p.name}
              className="glass brackets glass-hover sweep-border reveal"
              style={{ padding: 24, animationDelay: String(i * 80) + 'ms' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {pid ? (
                  <ProjectLogo projectId={pid} size={44} />
                ) : (
                  <span style={{ fontSize: 32, lineHeight: 1 }}>{p.icon}</span>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{p.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--cy)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {p.tagline}
                  </div>
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    padding: '3px 8px',
                    borderRadius: 6,
                    color: 'var(--gr)',
                    border: '1px solid rgba(74,222,128,0.3)',
                  }}
                >
                  {p.status}
                </span>
              </div>

              <p className="mono" style={{ color: 'var(--muted)', fontSize: 13, margin: '14px 0 0', lineHeight: 1.7 }}>
                {p.detail}
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: 13, padding: '9px 16px' }}>
                  <ExternalLink size={15} /> Open
                </a>
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13, padding: '9px 16px' }}>
                  <Github size={15} /> Source
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* everything else in the ecosystem, from the central registry */}
      <div className="reveal" style={{ marginTop: 44 }}>
        <div className="section-title">ecosystem</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginTop: 16 }}>
          {PROJECTS.map((p) => (
            <a
              key={p.id}
              href={p.url || '#'}
              target="_blank"
              rel="noreferrer"
              className="glass glass-hover reveal"
              style={{
                padding: 18,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <ProjectLogo projectId={p.id} size={36} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.blurb}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* latest dev activity */}
      <div className="reveal" style={{ marginTop: 44 }}>
        <div className="section-title">latest_activity</div>
        <div className="glass" style={{ marginTop: 16, overflow: 'hidden' }}>
          {latest.map((u, i, arr) => {
            const p = PROJECTS.find((x) => x.id === u.project)!;
            return (
              <div
                key={u.title}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none',
                }}
              >
                <ProjectLogo projectId={u.project} size={30} withGlow={false} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.title}
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {p.name} · {u.date}
                  </div>
                </div>
                <span
                  className="mono"
                  style={{ fontSize: 10, color: p.accent, border: `1px solid ${p.accent}44`, borderRadius: 999, padding: '2px 8px', flex: 'none' }}
                >
                  {u.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;