import React from 'react';
import { achievements } from '@/data/profile';

/**
 * Achievements — trophies wall of real milestones.
 */
const Achievements: React.FC = () => {
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">achievements</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}>
        <span className="neon-text">Trophy wall</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        milestones, ranks &amp; wins — everything earned on mobile
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 28 }}>
        {achievements.map((a, i) => (
          <div
            key={a.title}
            className="glass brackets reveal"
            style={{ padding: 22, animationDelay: String(i * 60) + 'ms' }}
          >
            <div style={{ fontSize: 34, lineHeight: 1 }}>{a.icon}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--cy)', margin: '10px 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>
              {a.tag}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{a.title}</div>
            <div className="mono" style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
              {a.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
