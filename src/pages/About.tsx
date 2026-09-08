import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Smartphone, Sparkles } from 'lucide-react';
import { profile } from '@/data/profile';
import { casualGames } from '@/data/games';

const About: React.FC = () => {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          <span className="gradient-text">About me</span>
        </h1>
        <p className="mt-3 text-lg font-semibold">{profile.tagline}</p>
      </motion.div>

      {/* Bio */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 max-w-2xl mx-auto rounded-2xl p-6 md:p-8"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <p className="leading-relaxed" style={{ color: 'var(--color-text)' }}>
          {profile.bio}
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {profile.chips.map((chip) => (
            <span key={chip} className="badge badge-accent">
              {chip}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Setup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 max-w-2xl mx-auto rounded-2xl p-6 md:p-8"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="section-title flex items-center gap-2 text-xl md:text-2xl">
          <Smartphone size={22} style={{ color: 'var(--color-accent)' }} />
          My setup
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {[
            ['Phone', profile.setup.phone],
            ['Chipset', profile.setup.chipset],
            ['Display', profile.setup.display],
            ['Tuning', profile.setup.tuning],
            ['RAM', profile.setup.ram],
            ['Storage', profile.setup.storage],
          ].map(([label, value], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl px-4 py-3"
              style={{ background: 'var(--color-surface-2)' }}
            >
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--color-text-muted)' }}>
                {label}
              </p>
              <p className="text-sm font-semibold mt-0.5">{value}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
          {profile.setup.extra}
        </p>
      </motion.section>

      {/* Footballers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 max-w-2xl mx-auto rounded-2xl p-6 md:p-8"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="section-title flex items-center gap-2 text-xl md:text-2xl">
          <Sparkles size={22} style={{ color: 'var(--color-accent)' }} />
          Football idols
        </h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.footballers.map((p) => (
            <span key={p} className="badge badge-accent text-sm">
              {p}
            </span>
          ))}
        </div>
        <p className="text-sm mt-3" style={{ color: 'var(--color-text-muted)' }}>
          Play it and watch it — Ronaldo’s mentality is the blueprint.
        </p>
      </motion.section>

      {/* What I'm working on */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 max-w-2xl mx-auto rounded-2xl p-6 md:p-8"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="section-title flex items-center gap-2 text-xl md:text-2xl">
          <Sparkles size={22} style={{ color: 'var(--color-accent)' }} />
          What I'm working on
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {[
            ['📱', 'FF Sensi Analyzer', 'Android app that reads your device & recommends Free Fire sensitivity settings.', 'In progress'],
            ['🕹️', 'Asteroids', 'A classic arcade game rebuilt in one HTML file — canvas + pure JS.', 'Building'],
            ['📈', 'Paper trading', 'Learning chart patterns, risk management & market structure.', 'Learning'],
            ['📚', 'Manhua shelf', 'Daily reader — always hunting underrated series before they blow up.', 'Daily'],
          ].map(([emoji, title, desc, status], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface-2)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl">{emoji}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}
                >
                  {status}
                </span>
              </div>
              <p className="font-bold text-sm mt-2">{title}</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Casual classics */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 max-w-2xl mx-auto rounded-2xl p-6 md:p-8"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="section-title flex items-center gap-2 text-xl md:text-2xl">
          <Gamepad2 size={22} style={{ color: 'var(--color-accent)' }} />
          Casual classics
        </h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {casualGames.map((g) => (
            <span
              key={g}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
            >
              {g}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Socials */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 max-w-2xl mx-auto rounded-2xl p-6 md:p-8 mb-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="section-title text-xl md:text-2xl">Find me</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {profile.socials
            .filter((s) => s.url && s.url !== '#')
            .map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                {s.label}
              </a>
            ))}
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
          {profile.email}
        </p>
      </motion.section>
    </div>
  );
};

export default About;