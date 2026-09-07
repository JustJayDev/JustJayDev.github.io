import React from 'react';
import { Heart, Github, Zap, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import qrJay from '../assets/qr-jay.png';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  return (
    <footer
      className="relative mt-16 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="page-container py-10 flex flex-col items-center gap-5 text-center">
        <button
          onClick={() => navigate('/')}
          className="font-bold text-lg tracking-tight"
          style={{ color: 'var(--color-text)' }}
        >
          <span className="gradient-text">JustJayDev</span>
        </button>
        <a
          href="https://JustJayDev.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all hover:-translate-y-0.5"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
          aria-label="Scan QR code to visit JustJayDev.github.io"
        >
          <img
            src={qrJay}
            alt="QR code linking to https://JustJayDev.github.io/"
            width={88}
            height={88}
            className="rounded-lg"
            style={{ background: '#fff', padding: 4 }}
            loading="lazy"
          />
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity group-hover:opacity-80"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <QrCode size={13} style={{ color: 'var(--color-accent)' }} />
            Scan to visit my site
          </span>
        </a>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          {['/', '/about', '/gaming', '/esports', '/social', '/contact'].map((p, i) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className="transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {['Home', 'About', 'Gaming', 'Esports', 'Social', 'Contact'][i]}
            </button>
          ))}
        </nav>
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>© {year} Jay Kumar</span>
          <span aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1">
            Built with <Heart size={12} style={{ color: '#ef4444' }} className="inline" /> and <Zap size={12} className="inline" style={{ color: 'var(--color-accent)' }} />
          </span>
          <span aria-hidden="true">•</span>
          <a
            href="https://github.com/JustJayDev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            aria-label="GitHub profile"
          >
            <Github size={13} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;