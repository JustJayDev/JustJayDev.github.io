import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '@/data/profile';

/**
 * Projects — things I've built.
 */
const Projects: React.FC = () => {
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
        {projects.map((p, i) => (
          <div
            key={p.name}
            className="glass brackets reveal"
            style={{ padding: 24, animationDelay: String(i * 80) + 'ms' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32, lineHeight: 1 }}>{p.icon}</div>
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
        ))}
      </div>
    </div>
  );
};

export default Projects;