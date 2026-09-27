/**
 * CENTRAL DEVLOG — the single source of truth for public development
 * updates across every JustJayDev project.
 *
 * HOW TO ADD AN UPDATE (Phase 1 workflow):
 *   1. Append one object to the front of UPDATES below.
 *   2. `npm run build` — the Devlog page, the RSS feed and the home
 *      "latest updates" strip all regenerate automatically.
 * That's it. No CMS, no extra config, nothing else to touch.
 *
 * RULES (see Task spec):
 *   - Never put API keys, passwords, tokens, private URLs, infrastructure
 *     details or personal info here. This file is PUBLIC.
 *   - Write what an outsider would find interesting: what shipped, what
 *     improved, what got fixed. Skip internal secrets entirely.
 */

export type ProjectId =
  | 'main-site'
  | 'pixvault'
  | 'titleforge'
  | 'future'
  | 'other';

export interface DevlogProject {
  id: ProjectId;
  name: string;
  /** Short public description shown on the devlog landing. */
  blurb: string;
  /** Live URL (public only). */
  url?: string;
  /** Lifecycle status shown as a badge. */
  status: 'live' | 'in-progress' | 'planned' | 'maintained';
  /** Brand color used for the logo mark + timeline node. */
  accent: string;
  /** Inline SVG logo mark (24x24 viewBox). Kept simple so it scales. */
  logo: string;
}

export interface DevlogUpdate {
  project: ProjectId;
  /** ISO date, e.g. '2026-09-27'. */
  date: string;
  title: string;
  /** One-line summary shown on cards + RSS. */
  summary: string;
  /** Full public body. Keep it human, not a commit dump. */
  body: string;
  /** Type of change — drives the category filter + tag colour. */
  type: 'release' | 'feature' | 'improvement' | 'bugfix' | 'design' | 'status';
  /** Optional semver/version tag, e.g. 'v2.1'. */
  version?: string;
}

/* ============================================================
   PROJECT REGISTRY
   Add a project here once; it becomes available everywhere:
   the devlog filter rail, project cards, RSS channel, and the
   home page "latest updates" strip.
   ============================================================ */
export const PROJECTS: DevlogProject[] = [
  {
    id: 'main-site',
    name: 'Main Website',
    blurb: 'The central hub — who I am, what I play, and everything I build.',
    url: 'https://justjaydev.github.io/',
    status: 'live',
    accent: '#22d3ee',
    logo: '<path d="M12 2 3 7v10l9 5 9-5V7z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5 7.5 10v5L12 17.5 16.5 15v-5z" fill="currentColor"/>',
  },
  {
    id: 'pixvault',
    name: 'PixVault',
    blurb: 'Wallpaper library — browse, preview and grab high-quality walls.',
    url: 'https://justjaydev.github.io/pixvault/',
    status: 'live',
    accent: '#a855f7',
    logo: '<rect x="3" y="4.5" width="18" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.8" fill="currentColor"/><path d="M4 17l4.5-4.5 3 3L15 12l4 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  },
  {
    id: 'titleforge',
    name: 'TitleForge',
    blurb: 'AI bulk YouTube title renamer. Connect, analyze, forge, apply.',
    url: 'https://justjaydev.github.io/TitleForge/',
    status: 'maintained',
    accent: '#fbbf24',
    logo: '<path d="M4 5h16M4 12h10M4 19h13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17.5 10.5l4 4M21.5 10.5l-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
  {
    id: 'future',
    name: 'Future Projects',
    blurb: 'Not shipped yet. Ideas in the queue and early experiments.',
    status: 'planned',
    accent: '#4ade80',
    logo: '<path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  },
  {
    id: 'other',
    name: 'Other Project Websites',
    blurb: 'Smaller sites, experiments and one-off builds.',
    status: 'maintained',
    accent: '#f87171',
    logo: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
  },
];

/* ============================================================
   UPDATES — newest first.
   This is the only list you edit day-to-day.
   ============================================================ */
export const UPDATES: DevlogUpdate[] = [
  {
    project: 'pixvault',
    date: '2026-09-27',
    title: 'Admin panel rebuilt as a dashboard',
    summary:
      'The PixVault admin is now a proper dashboard with live stats, search, loading states and a hashed login.',
    body:
      'The admin panel outgrew its chip-tab layout, so it was rebuilt as a real dashboard: a sidebar with navigation and live counts, a status card showing how many wallpapers are live, how many prompts are awaiting an image and how many are ready to publish, plus search and sorting across the wallpaper list. Loading now shows skeleton rows instead of a frozen screen, empty states explain what to do next, and actions confirm with toasts. The login compares a salted hash instead of a plaintext password, and the whole publishing pipeline was verified end to end against the live repository.',
    type: 'design',
    version: 'v2.3',
  },
  {
    project: 'pixvault',
    date: '2026-09-27',
    title: 'Health check: orphaned wallpaper recovered, downloads fixed',
    summary:
      'A desktop wallpaper that was uploaded but never appeared on the site is now live, and downloads keep their real file format.',
    body:
      'A full health pass over PixVault found a wallpaper that had been committed to the repository with its thumbnail but never registered in the catalog, so it was invisible on the site. It is now listed — the vault has its first desktop wallpaper. Downloads also kept naming every file .jpg even when the original was a PNG, so saved files now keep their true extension. A site-wide sweep confirmed every wallpaper asset resolves, the service worker and install manifest are healthy, and no API key appears as a complete literal in the shipped bundle.',
    type: 'bugfix',
    version: 'v2.3',
  },
  {
    project: 'pixvault',
    date: '2026-09-27',
    title: 'Publishing pipeline hardened',
    summary:
      'Wallpaper publishing now reads the live catalog before writing and auto-recovers from sync conflicts.',
    body:
      'Publishing a wallpaper from the admin panel could fail with a sync conflict if anything else had committed since the page loaded. The pipeline now fetches the current catalog straight from the repository at publish time instead of trusting the copy bundled with the page, and it retries automatically when it detects a stale-file conflict. Deleting and editing entries read live too, so two publishes in a row can no longer silently overwrite each other. End-to-end verified: a real wallpaper was published and confirmed visible on the live site.',
    type: 'bugfix',
    version: 'v2.2',
  },
  {
    project: 'main-site',
    date: '2026-09-27',
    title: 'Devlog becomes the central project hub',
    summary:
      'The devlog is no longer just about the main site — it now tracks every project from one place.',
    body:
      'The devlog was rebuilt as a central development hub for the whole ecosystem instead of a main-site-only changelog. Updates are now organised by project — Main Website, PixVault, TitleForge, Future Projects and other sites — each with its own branding, status and filter. A single data file holds every public update, so adding a new entry is one line and the page, the RSS feed and the home preview all regenerate from it. Private details, credentials and infrastructure stay out by design.',
    type: 'feature',
    version: 'v2.2',
  },
  {
    project: 'main-site',
    date: '2026-09-27',
    title: 'Secret area no longer stores its password in plain text',
    summary:
      'The locked area now compares a salted hash instead of a plaintext string in the bundle.',
    body:
      'The secret area used to keep its password as a readable string right in the frontend source — anyone could find it by reading the shipped JavaScript. It now stores only a one-way hash and compares digests on unlock, so the passphrase itself exists nowhere in the code or the built bundle. The gate is still client-side, so treat it as privacy-by-obfuscation rather than a vault — but it no longer hands the key to anyone who opens devtools.',
    type: 'improvement',
  },
  {
    project: 'main-site',
    date: '2026-09-26',
    title: 'UI v2 — spotlight cursor, card depth, skeleton loaders',
    summary:
      'Layered polish pass across the whole site: pointer-aware lighting, hover lift, gradient borders and loading states.',
    body:
      'A full polish pass landed. The hero name sits under layered glow, the cursor now carries a soft spotlight on desktop, game and project cards lift with a gradient border sweep on hover, lazy-loaded pages show shimmering skeletons instead of a blank gap, and the mobile nav became a proper drawer. Every addition respects prefers-reduced-motion and touch devices skip the pointer effects entirely.',
    type: 'design',
    version: 'v2.0',
  },
  {
    project: 'main-site',
    date: '2026-09-25',
    title: 'Projects section + official game art',
    summary:
      'Added a dedicated projects section and swapped every game banner for its official artwork.',
    body:
      'Two upgrades. Every game banner is now the official store feature graphic — real, current artwork instead of placeholders, all verified and converted to webp. A new projects section collects the things I have built in one place, reachable from the nav and previewed on the home page.',
    type: 'feature',
    version: 'v1.9',
  },
  {
    project: 'pixvault',
    date: '2026-09-27',
    title: 'Admin panel goes zero-setup',
    summary:
      'The wallpaper admin now works the moment you open it — no keys to paste, with automatic failover.',
    body:
      'The admin panel stopped asking for configuration. The prompt engine and publishing tools now use the project’s built-in setup, with automatic rotation across the available endpoints so a slow or unresponsive one hands off to another instead of hanging. Everything from prompt generation to publishing works on first load.',
    type: 'feature',
    version: 'v2.1',
  },
  {
    project: 'titleforge',
    date: '2026-09-25',
    title: 'TitleForge skeleton shipped',
    summary:
      'Connect a channel, let AI analyse every video, forge better titles, apply in one click.',
    body:
      'The first working build of TitleForge is live: a landing page and a connect → fetch → forge → apply flow with a pluggable AI engine. It is open source and bring-your-own-AI, so it works with any compatible endpoint.',
    type: 'release',
    version: 'v1.0',
  },
  {
    project: 'future',
    date: '2026-09-27',
    title: 'Next phase: autonomous build & polish',
    summary: 'A dedicated development phase to improve, test and harden every project.',
    body:
      'Kicked off a structured development phase: inspect every project, fix what is broken, polish what is rough, and verify the results end to end. The devlog you are reading is part of it — from now on, meaningful changes anywhere in the ecosystem get logged here.',
    type: 'status',
  },
];

/* ============================================================
   LOOKUPS + HELPERS  (used by Devlog.tsx, feed generation, Home)
   ============================================================ */
export const projectById = (id: ProjectId): DevlogProject =>
  PROJECTS.find((p) => p.id === id) || PROJECTS[0];

export const TYPE_META: Record<DevlogUpdate['type'], { label: string; color: string }> = {
  release: { label: 'release', color: '#4ade80' },
  feature: { label: 'feature', color: '#22d3ee' },
  improvement: { label: 'improvement', color: '#a855f7' },
  bugfix: { label: 'bugfix', color: '#f87171' },
  design: { label: 'design', color: '#fbbf24' },
  status: { label: 'status', color: '#9aa0c3' },
};

/** Newest-first ordering is guaranteed regardless of input order. */
export const sortedUpdates = (): DevlogUpdate[] =>
  [...UPDATES].sort((a, b) => (a.date < b.date ? 1 : -1));

/** Public-safe projection for RSS / JSON feeds. */
export const toFeedItem = (u: DevlogUpdate) => ({
  project: projectById(u.project).name,
  title: u.title,
  description: u.body,
  pubDate: new Date(u.date + 'T12:00:00+05:30').toUTCString(),
  link: projectById(u.project).url || 'https://justjaydev.github.io/',
  guid: `${u.project}-${u.date}-${u.title.slice(0, 24)}`.toLowerCase().replace(/\s+/g, '-'),
});
