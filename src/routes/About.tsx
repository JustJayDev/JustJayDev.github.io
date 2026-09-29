import { achievements } from '@/content/achievements';
import { profile, socials } from '@/content/profile';
import { stats } from '@/content/site';
import { PageHead, Reveal, SpecTable } from '@/components/ui/primitives';
import { useSeo } from '@/lib/seo';

export default function About() {
  useSeo('About', `${profile.name} — ${profile.tagline} Mobile gamer, AI builder, and the developer behind TitleForge and PixVault.`, '/about');

  const setupRows = [
    { label: 'Phone', value: profile.setup.phone },
    { label: 'Chipset', value: profile.setup.chipset },
    { label: 'CPU', value: profile.setup.cpu },
    { label: 'Display', value: profile.setup.display },
    { label: 'Tuning', value: profile.setup.tuning },
    { label: 'RAM', value: profile.setup.ram },
    { label: 'Storage', value: profile.setup.storage },
    { label: 'OS', value: profile.setup.os },
  ];

  return (
    <div className="shell">
      <PageHead eyebrow={profile.location} title="About me" lede={profile.bio} />

      {/* Motto */}
      <div className="panel panel--pad">
        <p className="eyebrow">Motto</p>
        <p className="mt-[--s-3] font-display text-[1.5rem] font-bold leading-tight tracking-tight md:text-[1.9rem]">
          {profile.motto}
        </p>
        <p className="mono accent mt-[--s-3]">{profile.mottoCode}</p>
        <ul className="mt-[--s-3] flex flex-wrap gap-[6px]">
          {profile.mottoWords.map((w) => (
            <li key={w}>
              <span className="pill">{w}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="prose mt-[--s-5] text-[0.98rem]">
        <p>{profile.bioLong}</p>
      </div>

      {/* Interests */}
      <div className="section border-t border-[--line]">
        <p className="eyebrow">Into</p>
        <ul className="mt-[--s-3] flex flex-wrap gap-[6px]">
          {profile.interests.map((i) => (
            <li key={i}>
              <span className="pill">{i}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Football */}
      <div className="section border-t border-[--line]">
        <p className="eyebrow">Football</p>
        <div className="mt-[--s-3] flex flex-wrap gap-[6px]">
          {profile.footballers.map((f) => (
            <span key={f} className="pill">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-[--s-2] flex flex-wrap gap-[6px]">
          {profile.footballClubs.map((c) => (
            <span key={c} className="pill pill--accent">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Setup */}
      <div className="section border-t border-[--line]">
        <p className="eyebrow">Setup — everything is built from this one phone</p>
        <div className="panel panel--pad mt-[--s-3]">
          <SpecTable rows={setupRows} />
          <p className="mono-xs mute mt-[--s-3]">{profile.setup.extra}</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="section border-t border-[--line]">
        <p className="eyebrow">Milestones</p>
        <div className="mt-[--s-4] grid gap-[--s-3] sm:grid-cols-2">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={Math.min(i, 8) * 0.04}>
              <div className="flex items-start gap-[--s-3] border-l-2 border-[--line] pl-[--s-3]">
                <span className="text-[1.1rem] leading-none" aria-hidden="true">
                  {a.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.95rem] font-medium leading-snug">{a.title}</p>
                  <p className="mono-xs mute mt-[4px]">{a.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Socials — all six, all live */}
      <div className="section border-t border-[--line] pb-[--s-8]">
        <p className="eyebrow">Find me</p>
        <ul className="mt-[--s-4] grid gap-[--s-3] sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((s, i) => (
            <Reveal key={s.label} delay={Math.min(i, 8) * 0.04}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="panel flex h-full items-center justify-between gap-[--s-3] px-[--s-4] py-[--s-3] transition-colors duration-200 hover:border-[var(--accent-line)]"
              >
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-medium">{s.label}</span>
                  <span className="mono-xs mute block truncate">{s.handle}</span>
                </span>
                <span className="mono-xs accent flex-none">↗</span>
              </a>
            </Reveal>
          ))}
        </ul>
        <p className="mono-xs mute mt-[--s-4]">
          {stats.mobileOnly}% mobile-only · {stats.projects} projects shipped
        </p>
      </div>
    </div>
  );
}