import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Play } from 'lucide-react';
import { buzz, getBest, setBest } from './playUtil';

const N = 15;
const SnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const st = useRef({ snake: [[7, 7]], dir: [1, 0], nextDir: [1, 0], food: [10, 7], timer: 0, score: 0 });

  const draw = () => {
    const cv = canvas.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const W = cv.width;
    const cell = W / N;
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--color-accent').trim() || '#6366f1';
    const bg = styles.getPropertyValue('--color-surface-2').trim() || '#1e293b';
    const fg = styles.getPropertyValue('--color-text').trim() || '#f8fafc';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, W);
    // food
    const [fr, fc] = st.current.food;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(fc * cell + cell / 2, fr * cell + cell / 2, cell * 0.32, 0, Math.PI * 2);
    ctx.fill();
    // snake
    ctx.fillStyle = accent;
    st.current.snake.forEach(([r, c], i) => {
      ctx.globalAlpha = i === 0 ? 1 : Math.max(0.45, 1 - i * 0.03);
      ctx.beginPath();
      ctx.roundRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2, 4);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = fg + '22';
    ctx.strokeRect(0.5, 0.5, W - 1, W - 1);
  };

  const tick = () => {
    const s = st.current;
    s.dir = s.nextDir;
    const head = s.snake[0];
    const nr = head[0] + s.dir[0];
    const nc = head[1] + s.dir[1];
    // wall or self collision
    if (nr < 0 || nc < 0 || nr >= N || nc >= N || s.snake.some(([r, c]) => r === nr && c === nc)) {
      setRunning(false);
      setBest('jj_best_snake', s.score);
      buzz([40, 60, 40]);
      return;
    }
    s.snake.unshift([nr, nc]);
    if (nr === s.food[0] && nc === s.food[1]) {
      s.score += 10;
      setScore(s.score);
      buzz(12);
      let f: number[];
      do {
        f = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)];
      } while (s.snake.some(([r, c]) => r === f[0] && c === f[1]));
      s.food = f;
      // speed up slightly
      clearInterval(s.timer);
      const speed = Math.max(70, 150 - s.snake.length * 2);
      s.timer = window.setInterval(tick, speed);
    } else {
      s.snake.pop();
    }
    draw();
  };

  const start = () => {
    st.current = { snake: [[7, 7]], dir: [1, 0], nextDir: [1, 0], food: [10, 7], timer: 0, score: 0 };
    setScore(0);
    setRunning(true);
    draw();
    st.current.timer = window.setInterval(tick, 150);
  };
  const stop = () => {
    clearInterval(st.current.timer);
    setRunning(false);
  };
  useEffect(() => () => clearInterval(st.current.timer), []);

  const setDir = (dr: number, dc: number) => {
    const s = st.current;
    if (s.dir[0] === -dr && s.dir[1] === -dc) return; // no 180°
    s.nextDir = [dr, dc];
  };

  const onTouch = (e: React.TouchEvent, isStart: boolean) => {
    if (!isStart) return;
    const t = e.touches[0];
    (canvas.current as any).__tx = t.clientX;
    (canvas.current as any).__ty = t.clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const cv = canvas.current as any;
    if (cv.__tx == null) return;
    const dx = e.changedTouches[0].clientX - cv.__tx;
    const dy = e.changedTouches[0].clientY - cv.__ty;
    cv.__tx = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) setDir(0, dx > 0 ? 1 : -1);
    else setDir(dy > 0 ? 1 : -1, 0);
  };

  return (
    <div className="play-stage">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black">🐍 Snake</h2>
        <button className="play-back" onClick={onBack} aria-label="Back"><RotateCcw size={16} /></button>
      </div>
      <div className="play-stat"><span>Score</span><b>{score}</b></div>
      <div className="play-stat"><span>Your best</span><b>{getBest('jj_best_snake') || '—'}</b></div>
      <canvas
        ref={canvas}
        width={330}
        height={330}
        className="play-canvas my-2"
        style={{ aspectRatio: '1', margin: '8px auto' }}
        onTouchStart={(e) => onTouch(e, true)}
        onTouchEnd={onTouchEnd}
      />
      <p className="text-[11px] text-center mb-2" style={{ color: 'var(--color-text-muted)' }}>Swipe on the board to steer</p>
      <div className="play-row">
        {!running ? (
          <button className="play-btn" onClick={start}>
            <Play size={14} className="inline mr-1" /> {score > 0 ? 'Play again' : 'Start'}
          </button>
        ) : (
          <button className="play-btn play-btn-ghost" onClick={stop}>Pause</button>
        )}
      </div>
    </div>
  );
};
export default SnakeGame;