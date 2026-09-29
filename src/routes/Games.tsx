import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, BadgeCheck } from 'lucide-react';
import { games, mainGames, casualGames } from '@/content/games';
import { stats } from '@/content/site';
import { PageHead, Reveal } from '@/components/ui/primitives';
import { useSeo } from '@/lib/seo';

type Filter = 'all' | 'main' | 'casual';

export default function Games() {
  useSeo('Games', 'Every game Jay plays — ranks, trophies, levels and badges, updated as they change.', '/games');

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = filter === 'main' ? mainGames : filter === 'casual' ? casualGames : games;
    if (!q) return base;
    return base.filter((g) =>
      [g.name, g.status, ...g.badges, ...g.details].join(' ').toLowerCase().includes(q),
    );
  }, [query, filter]);

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: games.length },
    { key: 'main', label: 'Main', count: mainGames.length },
    { key: 'casual', label: 'Casual', count: casualGames.length },
  ];

  return (
    <div className="shell">
      <PageHead
        eyebrow="The collection"
        title="Games"
        lede={`${stats.gamesPlayed} games, ${stats.grindingNow} of them on rotation right now. Ranks and trophies are the real numbers, not decoration.`}
      />

      {/* Controls */}
      <div className="flex flex-col gap-[--s-3] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-[--s-3] top-1/2 -translate-y-1/2 text-[var(--text-mute)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games, ranks, badges…"
            aria-label="Search games"
            className="h-11 w-full rounded-[var(--r-sm)] border border-[--line] bg-[var(--bg-sunken)] pl-[38px] pr-[38px] text-[0.95rem] outline-none transition-colors duration-200 placeholder:text-[var(--text-mute)] focus:border-[var(--accent-line)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-[--s-2] top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[var(--r-sm)] text-[var(--text-mute)] hover:text-[var(--accent)]"
            >
              <X size={15} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="flex gap-[6px]" role="group" aria-label="Filter games">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              aria-pressed={filter === t.key}
              className={`h-11 rounded-[var(--r-sm)] border px-[--s-3] text-[0.88rem] font-medium transition-colors duration-200 ${
                filter === t.key
                  ? 'border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[--line] text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              {t.label}
              <span className="mono-xs mute ml-[5px]">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mono-xs mute mt-[--s-3]">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <div className="panel panel--pad mt-[--s-5]">
          <p className="text-[var(--text-dim)]">No game matches “{query}”.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
            className="btn btn--sm btn--ghost mt-[--s-4]"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-[--s-5] grid gap-[--s-4] sm:grid-cols-2 lg:grid-cols-3">
          {results.map((g, i) => {
            const inner = (
              <>
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-sunken)]"
                  style={{ borderTop: `2px solid ${g.accent}` }}
                >
                  {g.image ? (
                    <img
                      src={g.image}
                      alt={`${g.name} artwork`}
                      loading="lazy"
                      width={480}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  {g.nowPlaying ? (
                    <span className="absolute left-[--s-2] top-[--s-2] inline-flex items-center gap-[5px] rounded-[var(--r-pill)] bg-black/60 px-[var(--s-2)] py-[3px] backdrop-blur-sm">
                      <span className="live-dot" aria-hidden="true" />
                      <span className="mono-xs text-white">Now playing</span>
                    </span>
                  ) : null}
                </div>
                <div className="p-[--s-4]">
                  <div className="flex items-start justify-between gap-[--s-2]">
                    <h2 className="text-[1.02rem]">{g.name}</h2>
                    {g.verified ? (
                      <BadgeCheck size={15} aria-label="Verified" className="mt-[3px] flex-none text-[var(--accent)]" />
                    ) : null}
                  </div>
                  <p className="mono-xs mute mt-[4px]">{g.status}</p>
                  <ul className="mt-[--s-3] flex flex-wrap gap-[6px]">
                    {g.badges.slice(0, 3).map((b) => (
                      <li key={b}>
                        <span className="pill">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            );

            return (
              <Reveal key={g.id} delay={Math.min(i, 8) * 0.04}>
                {g.hasProfile ? (
                  <Link
                    to={`/games/${g.id}`}
                    className="group block h-full overflow-hidden rounded-[var(--r-md)] border border-[--line] bg-[var(--bg-raise)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--line-2)] hover:shadow-[var(--shadow-2)]"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="group h-full overflow-hidden rounded-[var(--r-md)] border border-[--line] bg-[var(--bg-raise)]">
                    {inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}