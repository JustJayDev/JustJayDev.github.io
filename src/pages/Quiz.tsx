import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Brain } from 'lucide-react';
import QUESTIONS from '@/data/quiz';
import { useLang } from '@/context/LanguageContext';

const RANKS = [
  { min: 8, title: 'Certified Jay Insider 🏆', desc: 'You know me better than my alarm clock.' },
  { min: 6, title: 'True Fan 🔥', desc: 'You pay attention. Respect.' },
  { min: 4, title: 'Casual Visitor 👋', desc: 'Good try — the Details page will help.' },
  { min: 0, title: 'First Time Here 😄', desc: 'Welcome! Explore and come back.' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Quiz: React.FC = () => {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const questions = useMemo(
    () => QUESTIONS.map((q) => ({ ...q, shuffled: shuffle(q.options.map((o, i) => ({ text: o, correct: i === q.answer }))) })),
    []
  );
  const current = questions[step];
  const rank = RANKS.find((r) => score >= r.min) || RANKS[RANKS.length - 1];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (current.shuffled[i].correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (step + 1 >= questions.length) setDone(true);
      else { setStep(step + 1); setPicked(null); }
    }, 900);
  };

  const restart = () => { setStep(0); setScore(0); setPicked(null); setDone(false); };

  if (done) {
    return (
      <div className="page-container py-16 max-w-lg mx-auto text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <Trophy size={56} className="mx-auto mb-4" style={{ color: 'var(--color-accent-light)' }} />
          <p className="text-5xl font-black gradient-text mb-2">{score}/{questions.length}</p>
          <h2 className="text-xl font-bold mb-1">{rank.title}</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{rank.desc}</p>
          <button onClick={restart} className="btn-primary inline-flex items-center gap-2">
            <RotateCcw size={16} /> {t('playAgain')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-accent-light)' }}>
          <Brain size={12} /> QUIZ
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2"><span className="gradient-text">{t('quizTitle')}</span></h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t('quizDesc')}</p>
      </div>

      <div className="flex items-center gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: i < step ? 'var(--color-accent)' : 'var(--color-border)' }} />
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="card p-5">
        <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('question')} {step + 1} {t('of')} {questions.length}</p>
        <h2 className="font-bold text-base md:text-lg mb-4">{current.q}</h2>
        <div className="space-y-2">
          {current.shuffled.map((opt, i) => {
            const isCorrect = opt.correct;
            const show = picked !== null;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={show}
                className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                style={{
                  background: show && isCorrect ? 'rgba(34,197,94,0.15)' : picked === i ? 'rgba(239,68,68,0.12)' : 'var(--color-surface-2)',
                  borderColor: show && isCorrect ? 'rgba(34,197,94,0.5)' : picked === i ? 'rgba(239,68,68,0.5)' : 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {opt.text}{show && isCorrect ? ' ✓' : ''}
              </button>
            );
          })}
        </div>
        {picked !== null && <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>{current.explain}</p>}
      </motion.div>
    </div>
  );
};

export default Quiz;