import React from 'react';

/**
 * Anime — anime / donghua / manhua / manhwa library.
 * Placeholder — Jay will add titles later.
 */
const Anime: React.FC = () => {
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">anime_library</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}>
        <span className="neon-text">Anime &amp; Manga</span>
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        anime · donghua · manhua · manhwa
      </p>

      <div className="glass reveal" style={{ marginTop: 28, padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>📚</div>
        <div className="mono" style={{ color: 'var(--mg)', marginTop: 12, fontSize: 14 }}>
          library_coming_soon
        </div>
        <p className="mono" style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          I'm building my anime, donghua, manhua &amp; manhwa list — it'll appear here once I've picked my favourites.
        </p>
      </div>
    </div>
  );
};

export default Anime;
