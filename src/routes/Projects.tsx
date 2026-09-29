import { ExternalLink, Github, ShieldCheck } from 'lucide-react';
import { infra, projects } from '@/content/projects';
import { PageHead, Reveal } from '@/components/ui/primitives';
import { useSeo } from '@/lib/seo';

export default function Projects() {
  useSeo(
    'Projects',
    'TitleForge and PixVault — the apps Jay builds and ships. Plus the Developer Vault that keeps their secrets out of the browser.',
    '/projects',
  );

  return (
    <div className="shell">
      <PageHead
        eyebrow="What I build"
        title="Projects"
        lede="Everything here is real, running, and built on a single phone. No mockups, no placeholder projects."
      />

      <div className="grid gap-[--s-5] lg:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <article className="panel panel--pad flex h-full flex-col">
              <div className="flex items-start justify-between gap-[--s-3]">
                <div className="min-w-0">
                  <h2 className="text-[1.2rem]">{p.name}</h2>
                  <p className="mono-xs accent mt-[4px]">{p.tagline}</p>
                </div>
                <span className="pill pill--accent flex-none">{p.status}</span>
              </div>

              <p className="prose mt-[--s-4] text-[0.95rem]">{p.detail}</p>

              <ul className="mt-[--s-4] flex flex-col gap-[8px]">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-[--s-2] text-[0.9rem] leading-relaxed text-[var(--text-dim)]">
                    <span className="mt-[7px] h-1 w-1 flex-none rounded-full bg-[var(--accent)]" aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-[--s-4] flex flex-wrap gap-[6px]">
                {p.stack.map((s) => (
                  <li key={s}>
                    <span className="pill">{s}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-[--s-3] pt-[--s-5]">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--primary">
                  <ExternalLink size={14} aria-hidden="true" /> Live site
                </a>
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--ghost">
                  <Github size={14} aria-hidden="true" /> Source
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Infrastructure — listed for honesty, not as a product */}
      <div className="section border-t border-[--line]">
        <div className="panel panel--pad">
          <div className="flex flex-wrap items-start justify-between gap-[--s-3]">
            <div className="min-w-0">
              <p className="eyebrow">Infrastructure · not a public product</p>
              <h2 className="mt-[6px] flex items-center gap-[--s-2] text-[1.15rem]">
                <ShieldCheck size={18} className="text-[var(--accent)]" aria-hidden="true" />
                {infra.name}
              </h2>
            </div>
            <a href={infra.url} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--ghost">
              <ExternalLink size={14} aria-hidden="true" /> Console
            </a>
          </div>

          <p className="prose mt-[--s-4] text-[0.95rem]">{infra.detail}</p>
          <p className="mono-xs mute mt-[--s-3]">{infra.role}</p>

          <ul className="mt-[--s-4] flex flex-wrap gap-[6px]">
            {infra.policies.map((p) => (
              <li key={p}>
                <span className="pill">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}