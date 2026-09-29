import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck } from 'lucide-react';
import { gameById, mainGames } from '@/content/games';
import { PageHead, SpecTable } from '@/components/ui/primitives';
import { useSeo } from '@/lib/seo';
import NotFound from './NotFound';

export default function GameProfile() {
  const { id = '' } = useParams();
  const game = gameById(id);

  useSeo(
    game ? game.name : 'Game not found',
    game ? `${game.name} — ${game.status}. ${game.badges.join(' · ')}.` : 'Game not found.',
    `/games/${id}`,
  );

  if (!game) return <NotFound />;

  const withProfiles = mainGames.filter((g) => g.hasProfile);
  const idx = withProfiles.findIndex((g) => g.id === game.id);
  const prev = idx > 0 ? withProfiles[idx - 1] : undefined;
  const next = idx >= 0 && idx < withProfiles.length - 1 ? withProfiles[idx + 1] : undefined;

  const rows = game.profileRows ?? [
    { label: 'Status', value: game.status },
    { label: 'Category', value: game.category === 'main' ? 'Main game' : 'Casual' },
    ...(game.lastUpdated ? [{ label: 'Updated', value: game.lastUpdated }] : []),
  ];

  return (
    <div className="shell">
      <PageHead eyebrow={game.category === 'main' ? 'Main game' : 'Casual'} title={game.name} lede={game.status} />

      <div className="grid gap-[--s-6] lg:grid-cols-[1.2fr_1fr]">
        <div>
          {game.image ? (
            <div
              className="overflow-hidden rounded-[var(--r-md)] border border-[--line] bg-[var(--bg-sunken)]"
              style={{ borderTop: `2px solid ${game.accent}` }}
            >
              <img
                src={game.image}
                alt={`${game.name} artwork`}
                width={720}
                height={450}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-[--s-5]">
            <h2 className="text-[1.1rem]">Details</h2>
            <div className="prose mt-[--s-3] text-[0.95rem]">
              {game.details.map((d) => (
                <p key={d}>{d}</p>
              ))}
            </div>
          </div>

          {game.flex ? (
            <blockquote className="mt-[--s-5] border-l-2 border-[var(--accent)] pl-[--s-4]">
              <p className="font-display text-[1.05rem] font-medium leading-snug">{game.flex}</p>
            </blockquote>
          ) : null}
        </div>

        <aside>
          <div className="panel panel--pad">
            <div className="flex items-center justify-between gap-[--s-2]">
              <h2 className="text-[1.02rem]">Profile</h2>
              {game.verified ? (
                <span className="inline-flex items-center gap-[5px]">
                  <BadgeCheck size={15} className="text-[var(--accent)]" aria-hidden="true" />
                  <span className="mono-xs accent">Verified</span>
                </span>
              ) : null}
            </div>
            <dl className="mt-[--s-4]">
              <SpecTable rows={rows} />
            </dl>
          </div>

          <div className="panel panel--pad mt-[--s-4]">
            <h2 className="text-[1.02rem]">Badges</h2>
            <ul className="mt-[--s-3] flex flex-wrap gap-[6px]">
              {game.badges.map((b) => (
                <li key={b}>
                  <span className="pill">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Prev / next */}
      <nav aria-label="Other games" className="mt-[--s-7] flex items-center justify-between gap-[--s-3] border-t border-[--line] pt-[--s-5]">
        {prev ? (
          <Link to={`/games/${prev.id}`} className="btn btn--sm btn--ghost">
            <ArrowLeft size={14} aria-hidden="true" /> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/games" className="mono-xs mute">
          All games
        </Link>
        {next ? (
          <Link to={`/games/${next.id}`} className="btn btn--sm btn--ghost">
            {next.name} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}