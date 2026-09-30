import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { nav, readout } from '@/content/site';
import { useTheme } from '@/lib/theme';
import { assetUrl } from '@/components/ui/primitives';

export function Header() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[--line]">
      <div className="shell flex h-[60px] items-center justify-between gap-[--s-4]">
        <Link
          to="/"
          className="flex items-center gap-[--s-2] font-display text-[0.95rem] font-bold tracking-tight"
          aria-label="JustJayDev — home"
        >
          <img src={assetUrl('./logo.svg')} alt="" width={22} height={22} aria-hidden="true" className="rounded-[6px]" />
          <span>JustJayDev</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-[2px]">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `inline-flex h-9 items-center rounded-[var(--r-sm)] px-[--s-3] text-[0.88rem] font-medium transition-colors duration-200 ${
                      isActive ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-[--s-2]">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--r-sm)] border border-[--line] text-[var(--text-dim)] transition-colors duration-200 hover:border-[var(--accent-line)] hover:text-[var(--accent)]"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--r-sm)] border border-[--line] text-[var(--text-dim)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open ? (
        <div id="mobile-nav" className="glass border-t border-[--line] md:hidden">
          <nav aria-label="Mobile" className="shell py-[--s-3]">
            <ul className="flex flex-col gap-[2px]">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex h-12 items-center rounded-[var(--r-sm)] px-[--s-3] text-[0.95rem] font-medium transition-colors ${
                        isActive ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-dim)]'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/** Live ambient readout. Every value is real, sourced from the games data. */
export function Readout() {
  return (
    <div className="shell pt-[--s-3]">
      <ul className="flex flex-wrap items-center gap-x-[--s-5] gap-y-[6px]">
        {readout.map((item, i) => (
          <li key={item.label} className="flex items-center gap-[6px]">
            {i === 0 ? <span className="live-dot" aria-hidden="true" /> : null}
            <span className="mono-xs mute">{item.label}</span>
            <span className="mono dim">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}