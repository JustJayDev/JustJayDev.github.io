import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { buzz, getBest, setBest } from './playUtil';

const COLORS = ['var(--color-accent)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)', '#8b5cf6', '#06b6d4'];

const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [level, setLevel] = useState(0);
  const [seq, setSeq] = useState<number[]>([]);
  const [lit, setLit] = useState(-1);
  const [phase, setPhase] = useState<'idle' | 'show' | 'input' | 'over'>('idle');
  const [inputIdx, setInputIdx] = useState(0);

  const playSeq = (s: number[]) => {
    setPhase('show');
    let t = 500;
    s.forEach((i) => {
      setTimeout(() => { setLit(i); buzz(8); }, t);
      t += 420;
      setTimeout(() => setLit(-1), t);
      t += 160;
    });
    setTimeout(() => { setInputIdx(0); setPhase('input'); }, t + 100);
  };

  const start = () => {
    const s = [Math.floor(Math.random() * 6)];
    setSeq(s); setLevel(1);
    playSeq(s);
  };

  const tapCell = (i: number) => {
    if (phase !== 'input') return;
    setLit(i);
    setTimeout(() => setLit(-1), 150);
    buzz(6);
    if (seq[inputIdx] === i) {
      if (inputIdx + 1 === seq.length) {
        const next = [...seq, Math.floor(Math.random() * 6)];
        setLevel(next.length);
        setSeq(next);
        setTimeout(() => playSeq(next), 600);
      } else {
        setInputIdx(inputIdx + 1);
      }
    } else {
      setPhase('over');
      setBest('jj_best_memory', level);
      buzz(60);
    }
  };

  return (
    <div className="play-stage">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black">🧠 Memory Flash</h2>
        <button className="play-back" onClick={onBack} aria-label="Back"><RotateCcw size={16} /></button>
      </div>
      <div className="play-stat"><span>Level</span><b>{level}</b></div>
      <div className="play-stat"><span>Your best</span><b>{getBest('jj_best_memory') || '—'}</b></div>
      <div className="play-msg">
        {phase === 'idle' && 'Watch the pattern, then repeat it'}
        {phase === 'show' && '👀 Watch…'}
        {phase === 'input' && 'Your turn!'}
        {phase === 'over' && `💀 Wrong cell — you reached level ${level}`}
      </div>
      {phase === 'idle' || phase === 'over' ? (
        <button className="play-btn" onClick={start}>{phase === 'over' ? 'Play again' : 'Start'}</button>
      ) : (
        <div className="mem-grid">
          {COLORS.map((c, i) => (
            <button
              key={i}
              className={`mem-cell ${lit === i ? 'lit' : ''}`}
              style={lit === i ? { background: c } : undefined}
              onClick={() => tapCell(i)}
              aria-label={`Cell ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default MemoryGame;