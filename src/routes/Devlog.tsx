import { useMemo, useState } from 'react';
import { Rss } from 'lucide-react';
import { devlog, projectLabels } from '@/content/devlog';
import type { DevlogEntry } from '@/content/types';
import { site, stats } from '@/content/site';
import { PageHead } from '@/components/ui/primitives';
import { useSeo } from '@/lib/seo';

type Scope = 'all' | DevlogEntry['project'];

export default function Devlog() {
  useSeo('Devlog', 'Build notes across this site, TitleForge, PixVault and the Developer Vault — newest first.', '/devlog');

  const [scope, setScope] = useState<Scope>('all');
  const [copied, setCopied] = useState<string | null>(null);

  const entries = useMemo(
    () => (scope === 'all' ? devlog : devlog.filter((e) => e.project === scope)),
    [scope],
  );

  const scopes: { key: Scope; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'site', label: 'This site' },
    { key: 'titleforge', label: 'TitleForge' },
    { key: 'pixvault', label: 'PixVault' },
    { key: 'vault', label: 'Vault' },
  ];

  const copy = async (slug: string) => {
    const url = `${site.url}/devlog#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(slug);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="shell">
      <PageHead
        eyebrow={`${stats.devlogEntries} entries`}
        title="Devlog"
        lede="What actually got built, when, and why. Every entry is real work across four projects."
      />

      <div className="flex flex-wrap items-center justify-between gap-[--s-3]">
        <div className="flex flex-wrap gap-[6px]" role="group" aria-label="Filter by project">
          {scopes.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setScope(s.key)}
              aria-pressed={scope === s.key}
              className={`h-9 rounded-[var(--r-pill)] border px-[--s-3] text-[0.85rem] font-medium transition-colors duration-200 ${
                scope === s.key
                  ? 'border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[--line] text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <a href="./feed.xml" className="btn btn--sm btn--ghost">
          <Rss size={14} aria-hidden="true" /> RSS
        </a>
      </div>

      <p aria-live="polite" className="mono-xs mute mt-[--s-3]">
        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
      </p>

      <ol className="mt-[--s-5] flex flex-col">
        {entries.map((e) => (
          <li key={e.slug} id={e.slug} className="scroll-mt-[80px] border-t border-[--line] py-[--s-5] first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center gap-x-[--s-3] gap-y-[6px]">
              <time dateTime={e.date} className="mono accent">
                {e.date}
              </time>
              <span className="mono-xs mute">{projectLabels[e.project]}</span>
              <span className="pill">{e.version}</span>
              <button
                type="button"
                onClick={() => copy(e.slug)}
                className="mono-xs mute ml-auto transition-colors hover:text-[var(--accent)]"
              >
                {copied === e.slug ? 'Copied' : 'Copy link'}
              </button>
            </div>

            <h2 className="mt-[--s-3] text-[1.15rem]">{e.title}</h2>
            <p className="prose mt-[--s-2] text-[0.95rem]">{e.excerpt}</p>

            <details className="group mt-[--s-3]">
              <summary className="mono-xs mute cursor-pointer list-none transition-colors hover:text-[var(--accent)]">
                <span className="group-open:hidden">Read entry</span>
                <span className="hidden group-open:inline">Close</span>
              </summary>
              <div className="prose mt-[--s-3] text-[0.92rem]">
                {e.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}