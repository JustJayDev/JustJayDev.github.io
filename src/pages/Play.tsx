import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ReactionGame from '@/components/PlayReaction';
import MemoryGame from '@/components/PlayMemory';
import TapRushGame from '@/components/PlayTapRush';
import SlideGame from '@/components/PlaySlide';
import SnakeGame from '@/components/PlaySnake';

type GameId = 'reaction' | 'memory' | 'taprush' | 'slide' | 'snake';

const GAMES: { id: GameId; emoji: string; name: string; desc: string; best: string }[] = [
  { id: 'reaction', emoji: '⚡', name: 'Reaction Test', desc: 'Tap the instant it turns green', best: 'ms' },
  { id: 'memory', emoji: '🧠', name: 'Memory Flash', desc: 'Repeat the growing pattern', best: 'level' },
  { id: 'taprush', emoji: '👆', name: 'Tap Rush', desc: 'Max taps in 10 seconds', best: 'taps' },
  { id: 'slide', emoji: '🔢', name: '2048 Slide', desc: 'Merge tiles, reach 2048', best: 'pts' },
  { id: 'snake', emoji: '🐍', name: 'Snake', desc: 'Swipe to eat, don\u2019t bite', best: 'pts' },
];

const Play: React.FC = () => {
  const [active, setActive] = useState<GameId | null>(null);

  if (active) {
    const back = () => setActive(null);
    if (active === 'reaction') return <div className="play-shell"><ReactionGame onBack={back} /></div>;
    if (active === 'memory') return <div className="play-shell"><MemoryGame onBack={back} /></div>;
    if (active === 'taprush') return <div className="play-shell"><TapRushGame onBack={back} /></div>;
    if (active === 'slide') return <div className="play-shell"><SlideGame onBack={back} /></div>;
    return <div className="play-shell"><SnakeGame onBack={back} /></div>;
  }

  return (
    <div className="play-shell">
      <h1 className="text-2xl font-black mb-1">🎮 Play</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
        5 mini-games built into the site — works offline, best scores saved on your device.
      </p>
      <div className="play-grid">
        {GAMES.map((g) => (
          <button key={g.id} className="play-card" onClick={() => setActive(g.id)}>
            <span className="pc-emoji">{g.emoji}</span>
            <span className="pc-name block">{g.name}</span>
            <span className="pc-desc block">{g.desc}</span>
            <span className="pc-best">best: {g.best}</span>
          </button>
        ))}
      </div>
      <p className="text-[11px] text-center mt-6" style={{ color: 'var(--color-text-muted)' }}>
        More games coming soon 👀
      </p>
    </div>
  );
};
export default Play;