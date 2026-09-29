import { Link, useLocation } from 'react-router-dom';
import { nav } from '@/content/site';
import { useSeo } from '@/lib/seo';

export default function NotFound() {
  const { pathname } = useLocation();
  useSeo('Page not found', 'That page does not exist.', pathname);

  // Suggest based on what they actually typed.
  const guess = nav
    .filter((n) => n.to !== '/')
    .map((n) => ({ item: n, score: n.label.toLowerCase().split('').filter((ch) => pathname.toLowerCase().includes(ch)).length }))
    .sort((a, b) => b.score - a.score)[0];

  return (
    <div className="shell">
      <div className="flex min-h-[58vh] flex-col justify-center py-[--s-8]">
        <p className="mono accent">404</p>
        <h1 className="mt-[--s-3] text-[length:var(--t-h1)]">This page went AFK</h1>
        <p className="lede mt-[--s-4]">
          Nothing at <span className="mono mute">{pathname}</span>. The good stuff is one tap away.
        </p>

        <nav aria-label="Suggested pages" className="mt-[--s-6]">
          <ul className="flex flex-wrap gap-[--s-3]">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="btn btn--ghost">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {guess && guess.score > 1 ? (
          <p className="mono-xs mute mt-[--s-5]">
            Looking for <Link to={guess.item.to} className="link">{guess.item.label}</Link>?
          </p>
        ) : null}
      </div>
    </div>
  );
}