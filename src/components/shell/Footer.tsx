import { Link } from 'react-router-dom';
import { Github, Rss } from 'lucide-react';
import { nav, site, stats } from '@/content/site';
import { profile, socials } from '@/content/profile';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-[--s-8] border-t border-[--line]">
      <div className="shell py-[--s-7]">
        <div className="grid gap-[--s-6] md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-[1.05rem] font-bold">{profile.handle}</p>
            <p className="mt-[6px] max-w-[38ch] text-[0.9rem] leading-relaxed text-[var(--text-dim)]">
              {profile.tagline} {profile.motto} — {profile.mottoCode}
            </p>
            <p className="mono-xs mute mt-[--s-4]">
              {stats.gamesPlayed} games · {stats.projects} projects · {stats.devlogEntries} devlog entries
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Pages</p>
            <ul className="link-row mt-[--s-3]">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-quiet text-[0.9rem]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="link-row mt-[--s-3]">
              {socials.slice(0, 4).map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-quiet text-[0.9rem]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/feed.xml" className="link-quiet inline-flex items-center gap-[6px] text-[0.9rem]">
                  <Rss size={13} aria-hidden="true" /> RSS
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/JustJayDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet inline-flex items-center gap-[6px] text-[0.9rem]"
                >
                  <Github size={13} aria-hidden="true" /> Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-[--s-7] flex flex-col gap-[6px] border-t border-[--line] pt-[--s-4] sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-xs mute">
            © {year} {profile.name} · Built on a phone
          </p>
          <p className="mono-xs mute">
            <a href={site.url} className="link-quiet link-target">
              justjaydev.github.io
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}