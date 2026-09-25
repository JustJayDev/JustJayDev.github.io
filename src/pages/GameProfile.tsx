import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { mainGames } from '@/data/games';

/**
 * GameProfile — detailed neon profile for games with `profile: true` (Dragon City).
 */
const GameProfile: React.FC = () => {
  const { gameId } = useParams();
  const [copied, setCopied] = useState<string | null>(null);

  const game = mainGames.find((g) => g.id === gameId);

  if (!game || !game.profile) {
    return (
      <div className="wrap" style={{ paddingTop: 60 }}>
        <p className="mono" style={{ color: 'var(--rd)' }}>
          &gt; profile not found for "{gameId}"
        </p>
        <Link to="/games" className="btn" style={{ marginTop: 16 }}>
          <ArrowLeft size={16} /> back to games
        </Link>
      </div>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: 'IGN', value: 'SHURA GOD' },
    { label: 'UID', value: '3573597772887622722' },
    { label: 'Level', value: '55' },
    { label: 'Alliance', value: 'SHURA GOD' },
    { label: 'Dragonbook', value: '163 / 2217' },
    { label: 'Unique Dragons', value: '161' },
    { label: 'Alliance Trophies', value: '19,217' },
    { label: 'Master Points', value: '2,009' },
    { label: 'Top Dragon', value: 'High Famine Dragon (Lv 45)' },
  ];

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <Link to="/games" className="mono" style={{ color: 'var(--cy)', textDecoration: 'none', fontSize: 13 }}>
        ← back to games
      </Link>

      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '18px 0 8px' }}>
        <img src={game.image} alt={game.name} style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 14, background: 'var(--panel-solid)', padding: 8, border: '1px solid var(--line)' }} />
        <div>
          <div className="section-title" style={{ marginBottom: 4 }}>
            game_profile
          </div>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800 }}>
            <span className="neon-text">{game.name}</span>
          </h2>
        </div>
      </div>

      <div className="glass neon-border reveal" style={{ marginTop: 20, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              padding: '14px 20px',
              borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none',
              fontFamily: 'var(--mono)',
              fontSize: 14,
            }}
          >
            <span style={{ color: 'var(--mg)' }}>{r.label}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--text)' }}>{r.value}</span>
              <button
                onClick={() => copy(r.label, r.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: copied === r.label ? 'var(--gr)' : 'var(--muted)',
                }}
                aria-label={`copy ${r.label}`}
              >
                {copied === r.label ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </span>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ marginTop: 26 }}>
        <div className="section-title">details</div>
        <ul className="glass" style={{ marginTop: 14, padding: '20px 20px 20px 38px', listStyle: 'none' }}>
          {game.details.map((d) => (
            <li key={d} style={{ margin: '10px 0', color: 'var(--muted)', lineHeight: 1.6, position: 'relative' }}>
              <span style={{ position: 'absolute', left: -18, color: 'var(--cy)' }}>›</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {game.flex && (
        <div className="glass neon-border reveal" style={{ marginTop: 20, padding: 18, fontFamily: 'var(--mono)', fontSize: 13 }}>
          <span style={{ color: 'var(--am)' }}>★ flex</span> — {game.flex}
        </div>
      )}
    </div>
  );
};

export default GameProfile;