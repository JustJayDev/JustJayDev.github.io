/**
 * v5 hub data — the projects shown on the MAIN site front page.
 * Each entry points at a live, working URL owned by this account.
 */
export interface HubProject {
  id: string;
  index: string;
  name: string;
  kind: string;
  blurb: string;
  url: string;
  cta: string;
  accent: 'lime' | 'cyan' | 'magenta';
  art: string;
}

export const hubProjects: HubProject[] = [
  {
    id: 'pixvault',
    index: '01',
    name: 'PixVault',
    kind: 'Wallpaper vault',
    blurb:
      'HD and 4K wallpapers served in original full quality. Free, no watermark, no signup — just tap and download.',
    url: 'https://justjaydev.github.io/pixvault/',
    cta: 'Open PixVault',
    accent: 'cyan',
    art: '/games/freefire.png',
  },
  {
    id: 'titleforge',
    index: '02',
    name: 'TitleForge',
    kind: 'YouTube title renamer',
    blurb:
      'Bulk-rename videos with AI-generated titles. Preview every change, apply in one pass, undo if you change your mind.',
    url: 'https://justjaydev.github.io/TitleForge/',
    cta: 'Open TitleForge',
    accent: 'lime',
    art: '/games/fcmobile.jpg',
  },
  {
    id: 'justjaydev',
    index: '03',
    name: 'This site',
    kind: 'Portfolio · v5',
    blurb:
      'React, Vite and Tailwind, animated with Framer Motion. Built, debugged and shipped entirely from a phone.',
    url: 'https://github.com/JustJayDev',
    cta: 'View the source',
    accent: 'magenta',
    art: '/games/mlbb.png',
  },
];

/** Words for the scrolling hero rail — a real summary of the site. */
export const railWords: string[] = [
  'Mobile gamer',
  'Builder',
  'Free Fire Max',
  'FC Mobile',
  'Paper trading',
  'AI-assisted dev',
  'PixVault',
  'TitleForge',
  'Shipped from a phone',
];
