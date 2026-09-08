import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Zap, Flame } from 'lucide-react';
import { buzz, getBest, setBest } from './playUtil';

const ReactionGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [state, setState] = useState<'idle' | 'wait' | 'go' | 'early' | 'done'>('idle');
  const [ms, setMs] = useState(0);
  const goAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const start = () => {
    setState('wait');
    timer.current = setTimeout(() => {
      goAt.current = performance.now();
      setState('go');
      buzz(10);
    }, 1200 + Math.random() * 2600);
  };
  const tap = () => {
    if (state === 'wait') {
      if (timer.current) clearTimeout(timer.current);
      setState('early');
      buzz(40);
      return;
    }
    if (state === 'go') {
      const d = Math.round(performance.now() - goAt.current);
      setMs(d);
      setBest('jj_best_reaction', d);
      setState('done');
      buzz(d < 250 ? [12, 40, 12] : 12);
      return;
    }
    start();
  };
  const padColor =
    state === 'go' ? 'var(--color-success)'
    : state === 'wait' ? 'var(--color-error)'
    : state === 'early' ? 'var(--color-warning)'
    : 'var(--color-surface-2)';
  const padText =
    state === 'idle' ? 'Tap to start'
    : state === 'wait' ? 'Wait for green…'
    : state === 'go' ? 'TAP NOW!'
    : state === 'early' ? 'Too early! Tap to retry'
    : `${ms} ms — tap to retry`;
  return (
    <div className="play-stage">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black flex items-center gap-2"><Zap size={18} style={{ color: 'var(--color-accent)' }} /> Reaction Test</h2>
        <button className="play-back" onClick={onBack} aria-label="Back"><RotateCcw size={16} /></button>
      </div>
      <div className="play-stat"><span>Your best</span><b>{getBest('jj_best_reaction') || '—'} ms</b></div>
      <div className="play-msg">{state === 'done' && ms < 250 ? <span className="inline-flex items-center gap-1"><Flame size={14} style={{ color: 'var(--color-accent)' }} /> Insane reflexes!</span> : ''}</div>
      <button className="rxn-pad w-full" style={{ background: padColor, color: '#fff' }} onClick={tap}>
        {padText}
      </button>
    </div>
  );
};
export default ReactionGame;
