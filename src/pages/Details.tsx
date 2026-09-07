import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Code, Smartphone, Gamepad2, Rocket, Link as LinkIcon,
  ChevronDown, Sparkles, BookOpen, HelpCircle, Clock,
} from 'lucide-react';
import {
  DETAILS_INTRO, ABOUT_TEXT, DETAIL_SECTIONS, TIMELINE, FAQ,
  type DetailSection,
} from '../data/details';

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  User,
  Code,
  Smartphone,
  Gamepad2,
  Rocket,
  Link: LinkIcon,
  BookOpen,
  Clock,
  HelpCircle,
};

const SectionCard: React.FC<{ section: DetailSection; index: number }> = ({ section, index }) => {
  const Icon = ICONS[section.icon] || Sparkles;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="rounded-2xl p-5 border"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}
        >
          <Icon size={20} />
        </span>
        <h3 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
          {section.title}
        </h3>
      </div>
      <dl className="space-y-2.5">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-3 pb-2.5 border-b last:border-0 last:pb-0"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <dt className="text-xs shrink-0" style={{ color: 'var(--color-text-muted)' }}>
              {item.label}
            </dt>
            <dd className="text-sm text-right font-medium" style={{ color: 'var(--color-text)' }}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
};

const Details: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="page-container py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4"
          style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}
        >
          <Sparkles size={12} /> THE FULL PICTURE
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          <span className="gradient-text">{DETAILS_INTRO.heading}</span>
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base" style={{ color: 'var(--color-text-muted)' }}>
          {DETAILS_INTRO.subheading}
        </p>
      </motion.div>

      {ABOUT_TEXT && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl p-6 border mb-10"
          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            Quick Intro
          </h2>
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-muted)' }}>
            {ABOUT_TEXT}
          </p>
        </motion.section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {DETAIL_SECTIONS.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} />
        ))}
      </div>

      {TIMELINE.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Clock size={20} style={{ color: 'var(--color-accent)' }} /> My Journey
          </h2>
          <div className="relative pl-6">
            <div
              className="absolute left-0 top-1 bottom-1 w-px"
              style={{ background: 'linear-gradient(180deg, #6366f1, #d946ef)' }}
            />
            {TIMELINE.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative pb-6 last:pb-0"
              >
                <span
                  className="absolute -left-[26px] top-1 w-3 h-3 rounded-full border-2"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-accent)' }}
                />
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-accent-light)' }}>
                  {t.date}
                </p>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                  {t.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {t.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {FAQ.length > 0 && (
        <section className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <HelpCircle size={20} style={{ color: 'var(--color-accent)' }} /> FAQ
          </h2>
          <div className="space-y-2">
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border overflow-hidden"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                    aria-expanded={open}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {f.q}
                    </span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-4 pb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Details;
