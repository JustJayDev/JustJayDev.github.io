import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { mainGames, casualGames } from '@/data/games';
import GameCard from '@/components/GameCard';

/**
 * Games — searchable neon grid of all games + casual classics marquee.
 */
const Games: React.FC = () => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'casual'>('all');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    // 'casual' tab shows only the casual classics section below; the main grid
    // is intentionally empty for that tab.
    let list = filter === 'casual' ? [] : mainGames;
    if (filter === 'active') list = mainGames.filter((g) => g.nowPlaying);
    if (term) {
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(term) ||
          g.status.toLowerCase().includes(term) ||
          g.badges.some((b) => b.toLowerCase().includes(term))
      );
    }
    return list;
  }, [q, filter]);

  const casualFiltered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return casualGames;
    return casualGames.filter((c) => c.toLowerCase().includes(term));
  }, [q]);

  const tabs: { key: 'all' | 'active' | 'casual'; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'active', label: 'ACTIVE' },
    { key: 'casual', label: 'CASUAL' },
  ];

  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div className="section-title reveal">games</div>
      <h2 className="reveal" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '8px 0 4px' }}>
        <span className="neon-text">{mainGames.length + casualGames.length} games</span> played
      </h2>
      <p className="mono reveal" style={{ color: 'var(--muted)', margin: 0 }}>
        {mainGames.filter((g) => g.nowPlaying).length} grinding right now · 100% mobile, zero PC
      </p>

      {/* search + filter */}
      <div className="reveal" style={{ display: 'flex', gap: 10, margin: '24px 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 200,
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid var(--line-strong)',
            background: 'var(--panel)',
          }}
        >
          <Search size={16} style={{ color: 'var(--muted)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="filter games…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontFamily: 'var(--mono)',
              fontSize: 14,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="btn"
              style={{
                padding: '10px 16px',
                fontSize: 12,
                ...(filter === t.key
                  ? { background: 'linear-gradient(100deg,var(--cy),var(--mg))', color: '#05060f', borderColor: 'transparent', fontWeight: 700 }
                  : {}),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div
        className="reveal"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
          marginTop: 10,
        }}
      >
        {filtered.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>

      {filtered.length === 0 && !q && filter === 'casual' && (
        <div className="mono" style={{ color: 'var(--muted)', marginTop: 20 }}>
          &gt; casual classics listed below
        </div>
      )}

      {/* casual classics */}
      {(filter === 'all' || filter === 'casual') && (
        <section style={{ margin: '40px 0' }}>
          <div className="section-title">casual_classics</div>
          {q && casualFiltered.length === 0 ? (
            <p className="mono" style={{ color: 'var(--muted)', marginTop: 16 }}>
              &gt; no casual games match "{q}"
            </p>
          ) : (
            <div
              className="reveal"
              style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}
            >
              {casualFiltered.map((c) => (
                <span key={c} className="chip" style={{ fontSize: 13, padding: '8px 16px' }}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {q && filtered.length === 0 && casualFiltered.length === 0 && (
        <p className="mono" style={{ color: 'var(--rd)', marginTop: 20 }}>
          &gt; no results for "{q}"
        </p>
      )}
    </div>
  );
};

export default Games;