import type { Project } from './types';

/** Projects — real, from the ecosystem. Nothing invented to pad the list. */
export const projects: Project[] = [
  {
    id: 'titleforge',
    name: 'TitleForge',
    tagline: 'AI bulk YouTube title renamer',
    detail:
      'Connect your channel → AI analyses every video → forges click-worthy titles → apply in one click. Open source, bring-your-own-AI.',
    url: 'https://justjaydev.github.io/TitleForge/',
    repo: 'https://github.com/JustJayDev/TitleForge',
    status: 'live',
    stack: ['Vanilla JS', 'YouTube Data API v3', 'Developer Vault'],
    highlights: [
      'AI key never shipped in the repo or the browser bundle — held server-side by the Developer Vault',
      'Four-step flow: connect → load videos → forge → review & apply',
      'Batch forge with concurrency control, CSV export, and undo for applied changes',
      'Google OAuth with a 1-hour in-memory token, never written to localStorage',
    ],
  },
  {
    id: 'pixvault',
    name: 'PixVault',
    tagline: 'Wallpaper library',
    detail:
      'A clean, fast wallpaper gallery — browse, preview and grab high-quality walls for your phone. Free, no watermark, no signup.',
    url: 'https://justjaydev.github.io/pixvault/',
    repo: 'https://github.com/JustJayDev/pixvault',
    status: 'live',
    stack: ['React', 'Vite', 'Tailwind'],
    highlights: [
      'Original-resolution HD & 4K walls, no watermark and no signup wall',
      'Category and resolution filters, plus a lightbox for full-screen preview',
      'Admin dashboard for uploading and health-checking wallpapers',
      'Deploy pipeline hardened with automated recovery of orphaned uploads',
    ],
  },
];

/** The Developer Vault is infrastructure, not a public product — listed for honesty. */
export const infra = {
  name: 'Developer Vault',
  detail:
    'A server-side credential control plane for every JustJayDev project. Holds API keys encrypted at rest, decrypts them only for approved operations, and never sends them to the browser.',
  url: 'https://devvault.justjaydev.workers.dev',
  role: 'Built and operated by me. Powers TitleForge and PixVault.',
  policies: ['youtube-ai · title_forge', 'least-privilege scoped tokens', 'authenticated password-rotate route'],
};