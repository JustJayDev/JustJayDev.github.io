import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, User, Hash, Zap, Swords, Gamepad2 } from 'lucide-react';
import sfx, { buzz } from '@/lib/sound';

interface ProfileRow { label: string; value: string; icon: 'user' | 'hash'; }
interface GameProfileData {
  id: string;
  title: string;
  subtitle: string;
  profileImage: string;
  rows: ProfileRow[];
  stats: { label: string; value: string }[];
  source: string;
  flex?: string;
  verified?: boolean;
  updated?: string;
  chips?: string[];
}

const PROFILES: Record<string, GameProfileData> = {
  'dragon-city': {
    id: 'dragon-city',
    title: 'Dragon City',
    subtitle: 'Dragon collector · Socialpoint',
    profileImage: '/games/dragoncity.svg',
    rows: [
      { label: 'In-Game Name (IGN)', value: 'SHURA GOD', icon: 'user' },
      { label: 'User ID (UID)', value: '3573597772887622722', icon: 'hash' },
    ],
    stats: [
      { label: 'Level', value: '55' },
      { label: 'Dragonbook', value: '163 / 2217' },
      { label: 'Unique Dragons', value: '161' },
    ],
    chips: ['High Famine 45', 'High Reborn 40', 'Terra Titan 40', 'Skullface 40', 'Pixel 40', 'High Zephyr 40'],
    source: 'Screenshot of in-game profile (Settings → Account).',
    flex: '161 unique dragons — including High-tier and Zodiac legendaries most players never hatch.',
    verified: true,
    updated: '2026-09-08',
  },
};

const CopyRow: React.FC<{ row: ProfileRow }> = ({ row }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(row.value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = row.value;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    sfx.confirm();
    buzz([12, 40, 12]);
    setTimeout(() => setCopied(false), 1800);
  };
  const Icon = row.icon === 'user' ? User : Hash;
  return (
    <button
      onClick={copy}
      className="w-full rounded-xl px-4 py-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${copied ? 'color-mix(in srgb, #22c55e 55%, transparent)' : 'var(--color-border)'}`,
      }}
      aria-label={`Copy ${row.label}`}
    >
      <span
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)', color: 'var(--color-accent-light)' }}
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)' }}>
          {row.label}
        </span>
        <span className="block font-mono text-sm md:text-base font-semibold truncate" style={{ color: 'var(--color-text)' }}>
          {row.value}
        </span>
      </span>
      <span
        className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-lg"
        style={{
          background: copied ? 'rgba(34,197,94,0.14)' : 'color-mix(in srgb, var(--color-accent) 14%, transparent)',
          color: copied ? '#22c55e' : 'var(--color-accent-light)',
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
};

const GameProfilePage: React.FC = () => {
  const { gameId = '' } = useParams();
  const navigate = useNavigate();
  const [bothCopied, setBothCopied] = useState(false);
  const p = PROFILES[gameId];

  if (!p) {
    return (
      <div className="page-container py-20 text-center">
        <p className="text-lg font-semibold">No profile page for this game yet.</p>
        <button
          onClick={() => { sfx.tick(); navigate('/games'); }}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)', color: 'var(--color-accent-light)' }}
        >
          <ArrowLeft size={15} /> Back to Games
        </button>
      </div>
    );
  }

  return (
    <div className="page-container py-10 md:py-14">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <button
          onClick={() => { sfx.tick(); buzz(8); navigate('/games'); }}
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={16} /> All games
        </button>

        <div className="relative rounded-3xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          <img src={p.profileImage} alt={`${p.title} banner`} className="w-full h-52 md:h-72 object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, var(--color-bg) 4%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.35))' }}
          />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.85)' }}>
                {p.title}
              </h1>
              {p.verified && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.9)', color: '#fff' }}
                >
                  <Gamepad2 size={11} /> Verified
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm mt-1" style={{ color: 'rgba(255,255,255,0.78)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
              {p.subtitle}{p.updated ? ` · Updated ${p.updated}` : ''}
            </p>
          </div>
        </div>

        <h2 className="mt-8 mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          Game profile
        </h2>
        <div className="space-y-2.5">
          {p.rows.map((r) => <CopyRow key={r.label} row={r} />)}
        </div>
        <button
          onClick={async () => {
            const text = p.rows.map((r) => `${r.label}: ${r.value}`).join('\n');
            try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
            setBothCopied(true);
            sfx.fanfare();
            buzz([15, 40, 15, 40, 15]);
            setTimeout(() => setBothCopied(false), 2000);
          }}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl active:scale-[0.98] transition-transform"
          style={{
            background: bothCopied ? 'rgba(34,197,94,0.14)' : 'color-mix(in srgb, var(--color-accent) 16%, transparent)',
            color: bothCopied ? '#22c55e' : 'var(--color-accent-light)',
          }}
        >
          {bothCopied ? <Check size={15} /> : <Copy size={15} />}
          {bothCopied ? 'Both copied!' : 'Copy name + ID together'}
        </button>

        <h2 className="mt-8 mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          Quick stats
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {p.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-3 py-4 text-center"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="text-lg md:text-xl font-extrabold gradient-text">{s.value}</div>
              <div className="mt-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {p.chips && p.chips.length > 0 && (
          <>
            <h2 className="mt-8 mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Best dragons
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.chips.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  <Swords size={12} style={{ color: 'var(--color-accent)' }} />
                  {c}
                </span>
              ))}
            </div>
          </>
        )}

        {p.flex && (
          <div className="mt-6 rounded-xl px-4 py-3 flex items-start gap-2" style={{ background: 'rgba(217,70,239,0.08)' }}>
            <Zap size={15} className="mt-0.5 shrink-0" style={{ color: '#d946ef' }} />
            <p className="text-sm font-medium italic">{p.flex}</p>
          </div>
        )}

        <p className="mt-6 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          Source: {p.source}
        </p>
        <p className="mt-3 text-[11px] italic" style={{ color: 'var(--color-text-muted)' }}>
          Want to add me in-game? Copy the ID above and send a friend request — mention the site.
        </p>
      </motion.div>
    </div>
  );
};

export default GameProfilePage;
export { PROFILES };
export type { GameProfileData, ProfileRow };
