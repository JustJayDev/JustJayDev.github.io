import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dices, ExternalLink, Github } from 'lucide-react';
import { mainGames, nowPlaying } from '@/content/games';
import { projects } from '@/content/projects';
import { devlog, projectLabels } from '@/content/devlog';
import { stats } from '@/content/site';
import { motion } from '@/lib/motion';
import { CountUp, Reveal, SectionHead, assetUrl } from '@/components/ui/primitives';

function StatRow() {
  const items = [
    { value: stats.gamesPlayed, suffix: '+', label: 'games played' },
    { value: stats.grindingNow, suffix: '', label: 'grinding now' },
    { value: stats.mobileOnly, suffix: '%', label: 'mobile-only' },
    { value: stats.projects, suffix: '+', label: 'apps & sites built' },
  ];
  return (
    <dl className="grid grid-cols-2 gap-[--s-4] sm:grid-cols-4">
      {items.map((s, i) => (
        <Reveal key={s.label} delay={i * motion.stagger} distance="near">
          <div className="stat border-l border-[--line] pl-[--s-3]">
            <dd className="font-display text-[1.7rem] font-bold leading-none tracking-tight">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mono-xs mute mt-[6px]">{s.label}</dt>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}

function NowPlaying() {
  return (
    <div className="grid gap-[--s-4] sm:grid-cols-2 lg:grid-cols-3">
      {nowPlaying.map((g, i) => (
        <Reveal key={g.id} delay={Math.min(i, 6) * motion.stagger}>
          <Link
            to={`/games/${g.id}`}
            className="cardlink group block overflow-hidden rounded-[var(--r-md)] border border-[--line] bg-[var(--bg-raise)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-sunken)]">
              <img
                src={g.image ? assetUrl(g.image) : undefined}
                alt={`${g.name} artwork`}
                loading="lazy"
                width={480}
                height={300}
                className="kb h-full w-full object-cover"
                style={{ animationDelay: `${i * 1.5}s` }}
              />
              <span className="absolute left-[--s-2] top-[--s-2] inline-flex items-center gap-[5px] rounded-[var(--r-pill)] bg-black/60 px-[var(--s-2)] py-[3px] backdrop-blur-sm">
                <span className="live-dot" aria-hidden="true" />
                <span className="mono-xs text-white">Now playing</span>
              </span>
            </div>
            <div className="p-[--s-4]">
              <h3 className="text-[1.02rem]">{g.name}</h3>
              <p className="mono-xs mute mt-[4px]">{g.status}</p>
              <ul className="mt-[--s-3] flex flex-wrap gap-[6px]">
                {g.badges.slice(0, 3).map((b) => (
                  <li key={b}>
                    <span className="pill">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

function SurpriseMe() {
  const [pick, setPick] = useState<typeof mainGames[number] | null>(null);
  const [key, setKey] = useState(0);

  const roll = () => {
    const pool = mainGames;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setPick(next);
    setKey((k) => k + 1);
  };

  return (
    <div className="panel panel--pad">
      <div className="flex flex-wrap items-center justify-between gap-[--s-4]">
        <div>
          <p className="eyebrow">Random</p>
          <p className="mt-[6px] text-[0.95rem] text-[var(--text-dim)]">
            {pick ? 'Here is one from the collection.' : 'Pick a game at random from the main list.'}
          </p>
        </div>
        <button type="button" onClick={roll} className="btn btn--ghost">
          <Dices size={16} aria-hidden="true" /> Surprise me
        </button>
      </div>

      <div aria-live="polite" className="mt-[--s-4]">
        {pick ? (
          <div key={key} className="flipped flex items-center gap-[--s-4]">
            <img
              src={pick.image ? assetUrl(pick.image) : undefined}
              alt={`${pick.name} artwork`}
              loading="lazy"
              decoding="async"
              width={72}
              height={72}
              className="h-[72px] w-[72px] flex-none rounded-[var(--r-sm)] object-cover ring-1 ring-[--line]"
            />
            <div className="min-w-0">
              <p className="font-display text-[1.05rem] font-bold">{pick.name}</p>
              <p className="mono-xs mute mt-[4px]">{pick.status}</p>
            </div>
            <Link to={`/games/${pick.id}`} className="btn btn--sm btn--ghost ml-auto">
              View
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FeaturedProject() {
  const p = projects[0];
  return (
    <Reveal>
      <div className="panel panel--pad">
        <div className="flex flex-wrap items-start justify-between gap-[--s-4]">
          <div className="min-w-0">
            <p className="eyebrow">Latest project</p>
            <h3 className="mt-[6px] text-[1.25rem]">{p.name}</h3>
            <p className="mono-xs accent mt-[4px]">{p.tagline}</p>
          </div>
          <span className="pill pill--accent">{p.status}</span>
        </div>
        <p className="prose mt-[--s-4] text-[0.95rem]">{p.detail}</p>
        <div className="mt-[--s-4] flex flex-wrap gap-[--s-3]">
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--ghost">
            <ExternalLink size={14} aria-hidden="true" /> Live site
          </a>
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--ghost">
            <Github size={14} aria-hidden="true" /> Source
          </a>
          <Link to="/projects" className="btn btn--sm btn--ghost">
            All projects
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function DevlogTeaser() {
  const [copied, setCopied] = useState(false);
  const entry = devlog[0];
  const url = `https://justjaydev.github.io/devlog#${entry.slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Reveal>
      <div className="panel panel--pad">
        <div className="flex flex-wrap items-center justify-between gap-[--s-3]">
          <p className="eyebrow">
            Devlog · {projectLabels[entry.project]} · {entry.version}
          </p>
          <p className="mono-xs mute">{entry.date}</p>
        </div>
        <h3 className="mt-[--s-3] text-[1.15rem]">{entry.title}</h3>
        <p className="prose mt-[--s-2] text-[0.95rem]">{entry.excerpt}</p>
        <div className="mt-[--s-4] flex flex-wrap gap-[--s-3]">
          <Link to="/devlog" className="btn btn--sm btn--ghost">
            Read the devlog
          </Link>
          <button type="button" onClick={copy} className="btn btn--sm btn--ghost">
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export function HomeSections() {
  return (
    <>
      <section className="section border-t border-[--line]">
        <StatRow />
      </section>

      <section className="section border-t border-[--line]">
        <SectionHead
          eyebrow="Live right now"
          title="Now playing"
          aside={
            <Link to="/games" className="link-quiet link-target inline-flex min-h-[24px] items-center text-[0.9rem]">
              All {stats.gamesPlayed} games →
            </Link>
          }
        />
        <NowPlaying />
      </section>

      <section className="section border-t border-[--line]">
        <div className="grid gap-[--s-5] lg:grid-cols-2">
          <FeaturedProject />
          <DevlogTeaser />
        </div>
      </section>

      <section className="section border-t border-[--line]">
        <SurpriseMe />
      </section>
    </>
  );
}