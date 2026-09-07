import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Send, MessageSquareHeart, ShieldAlert } from 'lucide-react';
import { useSiteData } from '@/hooks/useSiteData';
import VisitorBadge from '@/components/VisitorBadge';
import { useLang } from '@/context/LanguageContext';

const Guestbook: React.FC = () => {
  const { t } = useLang();
  const { data, loading, failed, save } = useSiteData();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim().slice(0, 24);
    const m = msg.trim().slice(0, 240);
    if (!n || !m || sending) return;
    setSending(true);
    const entry = {
      name: n,
      msg: m,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    await save({ ...data, guestbook: [entry, ...data.guestbook].slice(0, 200) });
    setName('');
    setMsg('');
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="page-container py-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}>
          <MessageSquareHeart size={12} /> GUESTBOOK
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"><span className="gradient-text">{t('guestbookTitle')}</span></h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          {t('guestbookDesc')}
        </p>
      </motion.div>

      <div className="mb-8">
        <VisitorBadge />
      </div>

      {/* Form */}
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }} className="card p-5 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3 mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder={t('yourName')}
            className="rounded-xl px-4 py-3 text-sm outline-none border focus:border-[var(--color-accent)] transition-colors"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            maxLength={240}
            placeholder={t('yourMsg')}
            className="rounded-xl px-4 py-3 text-sm outline-none border focus:border-[var(--color-accent)] transition-colors"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{msg.length}/240</span>
          <button type="submit" disabled={!name.trim() || !msg.trim() || sending} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
            <Send size={16} />
            {sending ? t('signing') : sent ? t('signed') : t('sign')}
          </button>
        </div>
      </motion.form>

      {/* Entries */}
      <h2 className="section-title flex items-center gap-2 mb-4">
        <PenLine size={18} /> {t('messages')} <span className="text-sm font-normal" style={{ color: 'var(--color-text-muted)' }}>({data.guestbook.length})</span>
      </h2>

      {failed && (
        <p className="text-xs mb-4 flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
          <ShieldAlert size={13} /> Couldn't reach the server — messages may be out of date.
        </p>
      )}

      {loading ? (
        <div className="card p-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading messages…</div>
      ) : data.guestbook.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm font-medium mb-1">{t('noMsgs')}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('firstSign')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.guestbook.map((g, i) => (
            <motion.div
              key={`${g.date}-${i}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.35 }}
              className="card p-4 flex gap-3"
            >
              <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm gradient-text" style={{ background: 'var(--color-surface-2)' }}>
                {g.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold flex items-baseline gap-2 flex-wrap">
                  {g.name}
                  <span className="text-[10px] font-normal" style={{ color: 'var(--color-text-muted)' }}>{g.date}</span>
                </p>
                <p className="text-sm break-words" style={{ color: 'var(--color-text-muted)' }}>{g.msg}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guestbook;