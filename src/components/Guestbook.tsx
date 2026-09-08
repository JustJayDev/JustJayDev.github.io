import React, { useEffect, useState, useRef } from 'react';
import { MessageCircleHeart, Send, Loader2, PartyPopper } from 'lucide-react';
import { buzz, sfx } from '@/lib/sound';

/** Guestbook — textdb.dev messages + Abacus cheers counter (both free, no signup) */
const DB_URL = 'https://textdb.dev/api/data/';
const DB_KEY = 'jj-guestbook-v1';
const CHEERS_GET = 'https://abacus.jasoncameron.dev/get/jjdevsite/gb_cheers';
const CHEERS_HIT = 'https://abacus.jasoncameron.dev/hit/jjdevsite/gb_cheers';

interface Msg { n: string; m: string; t: number; }

const readMsgs = async (): Promise<Msg[]> => {
  try {
    const raw = await (await fetch(DB_URL + DB_KEY)).text();
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
};

const Guestbook: React.FC = () => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem('jj_gb_name') || '');
  const [text, setText] = useState('');
  const [cheers, setCheers] = useState<number | null>(null);
  const [cheered, setCheered] = useState(() => localStorage.getItem('jj_gb_cheered') === '1');
  const [err, setErr] = useState('');
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    readMsgs().then((m) => { if (alive.current) { setMsgs(m); setLoading(false); } });
    fetch(CHEERS_GET).then((r) => r.text()).then((v) => { if (alive.current) setCheers(parseInt(v, 10) || 0); }).catch(() => {});
    return () => { alive.current = false; };
  }, []);

  const submit = async () => {
    const n = name.trim().slice(0, 20);
    const m = text.trim().slice(0, 200);
    if (!n || !m || sending) return;
    setSending(true); setErr(''); buzz(8);
    try {
      const cur = await readMsgs();
      const next = [...cur, { n, m, t: Date.now() }].slice(-100);
      await fetch(DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ key: DB_KEY, value: JSON.stringify(next) }),
      });
      localStorage.setItem('jj_gb_name', n);
      sfx.confirm();
      if (alive.current) { setMsgs(next); setText(''); }
    } catch { sfx.error(); if (alive.current) setErr('Failed to send — try again'); }
    if (alive.current) setSending(false);
  };

  const cheer = async () => {
    if (cheered) return;
    setCheered(true);
    localStorage.setItem('jj_gb_cheered', '1');
    setCheers((c) => (c ?? 0) + 1);
    buzz([10, 30, 10]);
    sfx.fanfare();
    try { await fetch(CHEERS_HIT); } catch { /* keep optimistic */ }
  };

  return (
    <div className="no-swipe no-pull">
      <h2 className="text-xl font-black mb-1 flex items-center gap-2">
        <MessageCircleHeart size={20} style={{ color: 'var(--color-accent)' }} /> Guestbook
      </h2>
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
        Say hi, drop feedback — it stays here for everyone.
      </p>
      <button
        onClick={cheer}
        className="mb-5 px-4 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 active:scale-95 transition-transform"
        style={{
          background: cheered ? 'var(--color-surface-2)' : 'var(--color-accent)',
          color: cheered ? 'var(--color-text-muted)' : '#fff',
          border: '1px solid var(--color-border)',
        }}
      >
        <PartyPopper size={16} />
        {cheered ? `Cheers! ${cheers ?? ''}` : <span className="inline-flex items-center gap-1">Leave a cheer</span>}
      </button>
      <div className="rounded-2xl p-3 mb-5" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={20}
          className="w-full mb-2 px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your message…"
          maxLength={200}
          rows={3}
          className="w-full mb-2 px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        />
        <button
          onClick={submit}
          disabled={sending || !name.trim() || !text.trim()}
          className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {sending ? 'Sending…' : 'Sign guestbook'}
        </button>
        {err && <p className="text-xs mt-2" style={{ color: 'var(--color-error)' }}>{err}</p>}
      </div>
      <MsgList loading={loading} msgs={msgs} />
    </div>
  );
};

const MsgList: React.FC<{ loading: boolean; msgs: Msg[] }> = ({ loading, msgs }) => {
  if (loading) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading messages…</p>
    );
  }
  if (!msgs.length) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>No messages yet — be the first</p>
    );
  }
  return (
    <div className="space-y-2.5">
      {[...msgs].reverse().map((msg, i) => (
        <div key={i} className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold">{msg.n}</span>
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              {new Date(msg.t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <p className="text-sm break-words" style={{ color: 'var(--color-text-muted)' }}>{msg.m}</p>
        </div>
      ))}
    </div>
  );
};

export default Guestbook;