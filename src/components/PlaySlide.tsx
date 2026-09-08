import React, { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { buzz, getBest, setBest } from './playUtil';

type Grid = number[][];
const emptyGrid = (): Grid => Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const addTile = (g: Grid): Grid => {
  const free: [number, number][] = [];
  g.forEach((row, r) => row.forEach((v, c) => { if (!v) free.push([r, c]); }));
  if (!free.length) return g;
  const [r, c] = free[Math.floor(Math.random() * free.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
};
const TCOL: Record<number, string> = {
  2: '#3a4a63', 4: '#4a5a75', 8: '#6366f1', 16: '#8b5cf6', 32: '#a855f7',
  64: '#d946ef', 128: '#ec4899', 256: '#f43f5e', 512: '#f59e0b', 1024: '#10b981', 2048: '#06b6d4',
};
const slide = (g0: Grid, dir: 'l' | 'r' | 'u' | 'd') => {
  let gained = 0; let moved = false;
  const g = g0.map((r) => [...r]);
  const line = (get: (i: number) => number, set: (i: number, v: number) => void) => {
    const vals = Array.from({ length: 4 }, (_, i) => get(i)).filter(Boolean);
    for (let i = 0; i < vals.length - 1; i++) {
      if (vals[i] === vals[i + 1]) { vals[i] *= 2; gained += vals[i]; vals.splice(i + 1, 1); }
    }
    while (vals.length < 4) vals.push(0);
    for (let i = 0; i < 4; i++) { if (get(i) !== vals[i]) moved = true; set(i, vals[i]); }
  };
  for (let k = 0; k < 4; k++) {
    if (dir === 'l') line((i) => g[k][i], (i, v) => { g[k][i] = v; });
    if (dir === 'r') line((i) => g[k][3 - i], (i, v) => { g[k][3 - i] = v; });
    if (dir === 'u') line((i) => g[i][k], (i, v) => { g[i][k] = v; });
    if (dir === 'd') line((i) => g[3 - i][k], (i, v) => { g[3 - i][k] = v; });
  }
  return { g, gained, moved };
};

const SlideGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [grid, setGrid] = useState<Grid>(() => addTile(addTile(emptyGrid())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const scoreRef = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const doMove = (dir: 'l' | 'r' | 'u' | 'd') => {
    if (over) return;
    const { g, gained, moved } = slide(grid, dir);
    if (!moved) return;
    addTile(g);
    setGrid(g);
    scoreRef.current += gained;
    setScore(scoreRef.current);
    if (scoreRef.current) setBest('jj_best_slide', scoreRef.current);
    buzz(6);
    const stuck = (['l', 'r', 'u', 'd'] as const).every((d) => !slide(g, d).moved);
    if (stuck) { setOver(true); buzz(60); }
  };
  const restart = () => { setGrid(addTile(addTile(emptyGrid()))); scoreRef.current = 0; setScore(0); setOver(false); };

  return (
    <div className="play-stage">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black">🔢 2048 Slide</h2>
        <button className="play-back" onClick={onBack} aria-label="Back"><RotateCcw size={16} /></button>
      </div>
      <div className="play-stat"><span>Score</span><b>{score}</b></div>
      <div className="play-stat"><span>Your best</span><b>{getBest('jj_best_slide') || '—'}</b></div>
      <div
        className="mem-grid my-2"
        style={{ gridTemplateColumns: 'repeat(4,1fr)', padding: 6, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', touchAction: 'none' }}
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current.x;
          const dy = e.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
          doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : dy > 0 ? 'd' : 'u');
        }}
      >
        {grid.flat().map((v, i) => (
          <div
            key={i}
            className="mem-cell"
            style={{
              background: v ? TCOL[v] || '#06b6d4' : 'var(--color-bg)',
              color: v ? '#fff' : 'var(--color-text-muted)',
              fontSize: v >= 1024 ? 13 : 16,
              fontWeight: 900,
            }}
          >
            {v || ''}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-center mb-2" style={{ color: 'var(--color-text-muted)' }}>Swipe on the board to slide</p>
      {over && <div className="play-msg">💀 Board full — final score {score}</div>}
      <button className="play-btn" onClick={restart}>{over ? 'Play again' : 'Restart'}</button>
    </div>
  );
};
export default SlideGame;