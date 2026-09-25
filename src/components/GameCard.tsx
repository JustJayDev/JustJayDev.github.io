import React from 'react';
import { Link } from 'react-router-dom';
import type { Game } from '@/data/games';
import { useTilt } from '@/lib/useTilt';

/**
 * GameCard — neon cyber game card (tilt, glow, sheen, banners).
 */
const GameCard: React.FC<{ game: Game; wide?: boolean }> = ({ game, wide }) => {
  const tiltRef = useTilt<HTMLAnchorElement>(8);

  return (
    <div className={wide ? '' : undefined}>
      <Link
        to={game.profile ? `/games/${game.id}` : `/games`}
        className="game-card sheen brackets"
        ref={tiltRef}
        style={{ ['--acc' as string]: game.accent, display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        {game.image && (
          <div className="card-banner">
            <img src={game.image} alt={game.name} loading="lazy" />
          </div>
        )}
        <div style={{ padding: '16px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: game.accent,
                boxShadow: `0 0 10px ${game.accent}`,
              }}
            />
            <h3 style={{ margin: 0, fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 700 }}>
              {game.name}
            </h3>
            {game.nowPlaying && (
              <span className="chip" style={{ borderColor: 'rgba(74,222,128,.4)', color: 'var(--gr)' }}>
                ▶ NOW
              </span>
            )}
          </div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
            {game.status}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {game.badges.slice(0, 4).map((b) => (
              <span key={b} className="chip neon-chip">
                {b}
              </span>
            ))}
            {game.badges.length > 4 && (
              <span className="chip">+{game.badges.length - 4}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GameCard;