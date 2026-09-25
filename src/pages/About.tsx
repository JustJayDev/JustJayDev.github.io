import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { profile } from '@/data/profile';
import { casualGames } from '@/data/games';

/**
 * About — neon terminal-style bio, setup, chips, footballers, socials.
 */
const About: React.FC = () => {
  const liveSocials = profile.socials.filter((s) => s.live);

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">about</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 6px' }}>
        <span className="neon-text">Jay Kumar</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        @{profile.handle} · {profile.location}
      </p>

      {/* bio terminal */}
      <div className="glass neon-border reveal" style={{ marginTop: 24, padding: 22, fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.9 }}>
        <div>
          <span style={{ color: 'var(--gr)' }}>jay@justjaydev</span>
          <span style={{ color: 'var(--muted)' }}>:</span>
          <span style={{ color: 'var(--cy)' }}>~</span>
          <span style={{ color: 'var(--muted)' }}>$</span> echo $BIO
        </div>
        <p style={{ margin: '10px 0 0', color: 'var(--text)' }}>
          {profile.bio}
        </p>
      </div>

      {/* chips */}
      <div className="reveal" style={{ marginTop: 26 }}>
        <div className="section-title">tags</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {profile.chips.map((c) => (
            <span key={c} className="chip neon-chip">
              #{c}
            </span>
          ))}
        </div>
      </div>

      {/* setup */}
      <div className="reveal" style={{ marginTop: 34 }}>
        <div className="section-title">setup</div>
        <div className="glass" style={{ marginTop: 14, overflow: 'hidden' }}>
          {[
            ['Phone', profile.setup.phone],
            ['Chipset', profile.setup.chipset],
            ['Display', profile.setup.display],
            ['Tuning', profile.setup.tuning],
            ['RAM', profile.setup.ram],
            ['Storage', profile.setup.storage],
            ['Extra', profile.setup.extra],
          ].map(([k, v], i, arr) => (
            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none',
                fontFamily: 'var(--mono)',
                fontSize: 13,
              }}
            >
              <span style={{ color: 'var(--mg)' }}>{k}</span>
              <span style={{ color: 'var(--text)', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* footballers */}
      <div className="reveal" style={{ marginTop: 34 }}>
        <div className="section-title">football_idols</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {profile.footballers.map((f) => (
            <span key={f} className="chip">
              ⚽ {f}
            </span>
          ))}
        </div>
      </div>

      {/* casual classics */}
      <div className="reveal" style={{ marginTop: 34 }}>
        <div className="section-title">casual_classics</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {casualGames.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* socials */}
      <div className="reveal" style={{ marginTop: 34 }}>
        <div className="section-title">links</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
          {liveSocials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="btn">
              <Github size={16} /> {s.label} <ExternalLink size={13} />
            </a>
          ))}
          <span className="chip" style={{ fontSize: 13, padding: '12px 18px' }}>
            ✉ {profile.email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;