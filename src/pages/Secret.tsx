import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, ShieldCheck } from 'lucide-react';
import { secret } from '@/data/profile';

/**
 * Secret — password-protected private area.
 * Shows surname, age, class, exact location behind a gate.
 */
const Secret: React.FC = () => {
  const [input, setInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);

  const tryUnlock = () => {
    if (input.trim() === secret.password) {
      setUnlocked(true);
      setWrong(false);
    } else {
      setWrong(true);
      setInput('');
    }
  };

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">secret_area</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}>
        <span className="neon-text">🔒 Restricted</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        enter the password to access private details
      </p>

      {!unlocked ? (
        <div className="glass neon-border reveal" style={{ marginTop: 28, padding: 28, maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <Lock size={22} style={{ color: 'var(--cy)' }} />
            <span className="mono" style={{ color: 'var(--mg)' }}>access_denied</span>
          </div>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setWrong(false); }}
            onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
            placeholder="enter password…"
            className="mono"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: wrong ? '1px solid var(--rd)' : '1px solid var(--line-strong)',
              background: 'rgba(10,12,28,0.7)',
              color: 'var(--text)',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'var(--mono)',
            }}
          />
          {wrong && (
            <p className="mono" style={{ color: 'var(--rd)', fontSize: 12, margin: '10px 0 0' }}>
              &gt; wrong password. try again.
            </p>
          )}
          <button className="btn btn-primary" onClick={tryUnlock} style={{ marginTop: 18, width: '100%', justifyContent: 'center' }}>
            <KeyRound size={16} /> Unlock
          </button>
        </div>
      ) : (
        <div className="glass neon-border reveal" style={{ marginTop: 28, padding: 28, maxWidth: 540 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <ShieldCheck size={22} style={{ color: 'var(--gr)' }} />
            <span className="mono" style={{ color: 'var(--gr)' }}>access_granted</span>
          </div>
          <p className="mono" style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 18px' }}>
            {secret.note}
          </p>
          {[
            ['Full name', secret.fullName],
            ['Age', String(secret.age)],
            ['Class', secret.class],
            ['Location', secret.location],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--line)',
                fontFamily: 'var(--mono)',
                fontSize: 14,
              }}
            >
              <span style={{ color: 'var(--mg)' }}>{k}</span>
              <span style={{ color: 'var(--text)' }}>{v}</span>
            </div>
          ))}
          <button className="btn" onClick={() => { setUnlocked(false); setInput(''); }} style={{ marginTop: 18 }}>
            <Lock size={15} /> Lock again
          </button>
        </div>
      )}
    </div>
  );
};

export default Secret;
