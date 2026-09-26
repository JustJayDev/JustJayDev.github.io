import React, { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { profile } from '@/data/profile';

/**
 * Contact — CTA + socials. Dedicated email coming soon.
 */
const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const submit = () => {
    if (!name.trim() || !msg.trim()) return;
    const subject = encodeURIComponent('Message from ' + name);
    const body = encodeURIComponent(msg + '\n\n— ' + name);
    window.open('mailto:hello@justjaydev.dev?subject=' + subject + '&body=' + body, '_self');
    setSent(true);
  };

  const live = profile.socials.filter((s) => s.live);

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">contact</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}>
        <span className="neon-text">Say hi</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        reach me anywhere — or drop a message below
      </p>

      <div className="glass neon-border reveal" style={{ marginTop: 28, padding: 26, maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Mail size={18} style={{ color: 'var(--cy)' }} />
          <span className="mono" style={{ color: 'var(--muted)', fontSize: 13 }}>{profile.email}</span>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your name"
          className="mono"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid var(--line-strong)',
            background: 'rgba(10,12,28,0.7)',
            color: 'var(--text)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--mono)',
            marginBottom: 12,
          }}
        />
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="your message…"
          className="mono"
          rows={4}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid var(--line-strong)',
            background: 'rgba(10,12,28,0.7)',
            color: 'var(--text)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--mono)',
            resize: 'vertical',
          }}
        />
        <button className="btn btn-primary" onClick={submit} style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
          {sent ? <Check size={16} /> : <Send size={16} />} {sent ? 'opening mail…' : 'send message'}
        </button>
      </div>

      <div className="reveal" style={{ marginTop: 28 }}>
        <div className="section-title">find_me</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
          {live.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="btn">
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
