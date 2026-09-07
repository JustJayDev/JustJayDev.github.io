import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Crosshair, Smartphone, Gauge, Zap } from 'lucide-react';
import { SENS_PRESETS, DEVICE_INFO } from '../data/loadout';
import { useLang } from '@/context/LanguageContext';

const SENS_ROWS: { key: keyof (typeof SENS_PRESETS)[0]; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'redDot', label: 'Red Dot' },
  { key: 'scope2x', label: '2x Scope' },
  { key: 'scope4x', label: '4x Scope' },
  { key: 'sniper', label: 'Sniper' },
  { key: 'freeLook', label: 'Free Look' },
];

const GAMING_STATS = [
  { label: 'Main Game', value: 'Free Fire Max' },
  { label: 'Also Playing', value: 'FC Mobile' },
  { label: 'Style', value: 'Aggressive rusher' },
  { label: 'Role', value: 'Entry fragger' },
];

const Gaming: React.FC = () => {
  const { t } = useLang();
  return (
    <div className="page-container py-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}>
          <Gamepad2 size={12} /> GAMING
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"><span className="gradient-text">{t('loadoutTitle')}</span></h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          {t('loadoutDesc')}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {GAMING_STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }} className="card p-4 text-center">
            <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
            <p className="text-sm font-bold" style={{ color: 'var(--color-accent-light)' }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="section-title flex items-center gap-2"><Crosshair size={20} /> {t('presets')} <span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>(200 scale)</span></h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{DEVICE_INFO.note}</p>

      <div className="space-y-4 mb-10">
        {SENS_PRESETS.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }} className="card p-5">
            <div className="flex items-baseline justify-between gap-2 mb-4">
              <h3 className="font-bold text-base md:text-lg" style={{ color: 'var(--color-text)' }}>{p.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full shrink-0" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}>Preset {i + 1}</span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>{p.desc}</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {SENS_ROWS.map((row) => (
                <div key={row.key} className="rounded-xl p-3 text-center" style={{ background: 'var(--color-surface-2)' }}>
                  <p className="text-lg font-black gradient-text">{p[row.key] as number}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{row.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <h2 className="section-title flex items-center gap-2"><Smartphone size={20} /> {t('deviceSetup')}</h2>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="card p-5 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="flex items-center gap-3">
          <Smartphone size={22} style={{ color: 'var(--color-accent-light)' }} />
          <div><p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Device</p><p className="text-sm font-semibold">{DEVICE_INFO.device}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <Gauge size={22} style={{ color: 'var(--color-accent-light)' }} />
          <div><p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Refresh</p><p className="text-sm font-semibold">{DEVICE_INFO.refresh}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <Zap size={22} style={{ color: 'var(--color-accent-light)' }} />
          <div><p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Graphics</p><p className="text-sm font-semibold">{DEVICE_INFO.graphics}</p></div>
        </div>
      </motion.div>

      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        No sensitivity removes recoil — that comes from practice, grips and drag technique. These presets just give you the right starting point.
      </p>
    </div>
  );
};

export default Gaming;