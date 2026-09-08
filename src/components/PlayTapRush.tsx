import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { buzz, getBest, setBest } from './playUtil';

const TapRushGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [running, setRunning] = useState(false);
  const [taps, setTaps] = useState(0);
  const [left, setLeft] = useState(10.0);
  const raf = useRef(0);
  const endAt = useRef(0);
  const tapsRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const start = () => {
    tapsRef.current = 0;
    setTaps(0);
    setLeft(10);
    setRunning(true);
    endAt.current = performance.now() + 10000;
    const loop = () => {
      const remain = Math.max(0, endAt.current - performance.now());
      setLeft(remain / 1000);
      if (remain <= 0) {
        setRunning(false);
        setBest('jj_best_taprush', tapsRef.current);
        buzz(60);
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };

  const tap = () => {
    if (!running) {
      start();
      return;
    }
    tapsRef.current += 1;
    setTaps(tapsRef.current);
    if (tapsRef.current % 10 === 0) buzz(4);
  };

  return (
    <div className="play-stage">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black">👆 Tap Rush</h2>
        <button className="play-back" onClick={onBack} aria-label="Back"><RotateCcw size={16} /></button>
      </div>
      <div className="play-stat"><span>Time left</span><b>{left.toFixed(1)}s</b></div>
      <div className="play-stat"><span>Taps</span><b>{taps}</b></div>
      <div className="play-stat"><span>Your best</span><b>{getBest('jj_best_taprush') || '—'} taps</b></div>
      <div className="play-msg">{!running && taps > 0 ? `Last round: ${taps} taps (${(taps / 10).toFixed(1)} CPS)` : ''}</div>
      <button
        className="rxn-pad w-full"
        style={{ background: running ? 'var(--color-accent)' : 'var(--color-surface-2)', color: '#fff' }}
        onPointerDown={tap}
      >
        {running ? 'TAP TAP TAP!' : taps > 0 ? `${taps} taps — tap to go again` : 'Tap to start'}
      </button>
    </div>
  );
};
export default TapRushGame;