import type { DevlogEntry } from './types';

/** Merged devlog — the site's own history (from MAIN) plus the build log for
 *  TitleForge, PixVault and the Developer Vault (from ALT). Newest first.
 *  Every entry describes real work that happened. */

export const devlog: DevlogEntry[] = [
  {
    slug: 'v7-rebuild',
    date: '2026-10-04',
    project: 'site',
    version: 'v7',
    title: 'v7 — the site rebuilt from scratch',
    excerpt:
      'A ground-up rebuild on a new architecture and visual identity. New token system, a real content layer, and type-checking that actually blocks the build.',
    body: [
      'The old site had accreted four visual generations on top of each other, each one added as a CSS layer that loaded after the last. This rebuild starts from an empty repository.',
      'Three structural changes matter more than the visuals. First, every string and every dataset now lives in a single content layer that is validated at build time, so copy changes no longer require touching components. Second, the design tokens live in exactly one file with no versioned override layers, which is what caused the previous sprawl. Third, the build now runs the type-checker before bundling — the old pipeline had four type errors sitting in main for months because nothing gated on them.',
      'Motion was cut back hard on purpose. One ambient element on screen at rest, everything else in response to actual input.',
    ],
  },
  {
    slug: 'vault-password-rotate',
    date: '2026-09-30',
    project: 'vault',
    version: 'v1.4',
    title: 'Authenticated password-rotate route added to the Vault',
    excerpt:
      'The Vault can now rotate its own admin password through an authenticated route instead of a redeploy.',
    body: [
      'Rotating the password previously meant editing configuration and redeploying. The rotate route requires a valid admin session, re-hashes with a fresh salt, and invalidates outstanding sessions on success.',
      'Also in this pass: softened the console aurora, and added reduced-motion and focus-visible handling across the Vault UI.',
    ],
  },
  {
    slug: 'pixvault-admin-dashboard',
    date: '2026-09-28',
    project: 'pixvault',
    version: 'v2.1',
    title: 'PixVault admin rebuilt as a dashboard',
    excerpt:
      'Upload management, health checks and orphaned-wallpaper recovery in one place instead of a raw admin form.',
    body: [
      'The old admin was a form with a table. It is now a dashboard: pending uploads at the top, a health-check row that probes every wallpaper, and automatic recovery of files that were uploaded but never linked.',
      'A health check runs on deploy, so a broken or orphaned wallpaper gets caught before a visitor sees it rather than after.',
    ],
  },
  {
    slug: 'titleforge-forge-policy',
    date: '2026-09-26',
    project: 'titleforge',
    version: 'v1.2',
    title: 'TitleForge forge proxy + title:forge policy live in the Vault',
    excerpt:
      'The AI key now decrypts inside the Vault under a scoped policy. It has never been in the repo or the browser bundle.',
    body: [
      'The architecture is deliberately one-directional: the browser sends video metadata to the Vault, the Vault calls the AI provider, and the key decrypts and dies inside the worker. Nothing sensitive is ever returned to the client.',
      'The policy is least-privilege — TitleForge can be granted title_forge and nothing else. Tokens are scoped, expire in an hour, and live only in JavaScript memory.',
      'The OAuth flow also got fixed: a pending authorisation now resumes correctly when the admin is already signed in, instead of dropping the user into a 401.',
    ],
  },
  {
    slug: 'v5-cinematic-motion',
    date: '2026-09-20',
    project: 'site',
    version: 'v5.1',
    title: 'The Roblox banner finally loaded',
    excerpt:
      'The file was SVG content saved with a .png extension, so GitHub served it as image/png and every browser refused to render it.',
    body: [
      'A genuinely silly bug with a genuinely useful fix: the artwork pipeline now validates that a file extension matches its actual content before shipping.',
      'The cinematic motion system — character-by-character title reveal, mesh-gradient hero — rolled out to the About and game profile pages in the same pass.',
    ],
  },
  {
    slug: 'site-v4-command-palette',
    date: '2026-09-19',
    project: 'site',
    version: 'v4.1',
    title: 'Command palette, achievements, and a 404 that behaves',
    excerpt:
      'Cmd/Ctrl+K to jump anywhere, a visitor achievement system, and dead URLs that land on a real 404 instead of a blank screen.',
    body: [
      'The command palette indexes every route and action. Achievements unlock as you explore, which turns a static site into something that rewards a second visit.',
      'Game card banners were also fixed here: every game art is a different shape, so the old fixed-height crop was cutting logos in half. Banners are now aspect-ratio safe with object-fit: contain.',
    ],
  },
  {
    slug: 'site-v4-revamp',
    date: '2026-09-18',
    project: 'site',
    version: 'v4',
    title: 'The revamp: command palette, achievements, cinematic hero',
    excerpt:
      'A big visual pass. Animated mesh-gradient backdrop, a character-by-character title reveal, and a proper 404.',
    body: [
      'The first real visual overhaul of the site. The hero gained an animated mesh-gradient backdrop and the title reveal, and the site gained the command palette and the achievement system.',
      'The devlog, achievements and the game data all moved into structured data files rather than living inside components.',
    ],
  },
  {
    slug: 'vault-console',
    date: '2026-09-14',
    project: 'vault',
    version: 'v1.0',
    title: 'Developer Vault — the credential control plane',
    excerpt:
      'One secure backend holding every project secret, so no API key ever has to live in a browser bundle.',
    body: [
      'The problem it solves is architectural, not cosmetic. GitHub Pages is static hosting, so anything secret that reaches the browser is already public. The Vault keeps keys encrypted at rest and decrypts them only inside the worker, for approved operations only.',
      'The console UI got visual toggles, project tabs, and self-explanatory credential entries in a later pass.',
    ],
  },
  {
    slug: 'titleforge-skeleton',
    date: '2026-09-10',
    project: 'titleforge',
    version: 'v1.0',
    title: 'TitleForge skeleton shipped',
    excerpt:
      'The four-step flow works end to end: connect your channel, load videos, forge titles, review and apply.',
    body: [
      'Batch forging runs with explicit concurrency control rather than firing every request at once. Titles can be reviewed individually or in bulk, exported to CSV, and applied in one click — with undo for anything already applied.',
    ],
  },
  {
    slug: 'site-v39-cleanup',
    date: '2026-09-08',
    project: 'site',
    version: 'v3.9',
    title: 'Dead code cleanup + verified stats',
    excerpt:
      'Removed an unused guestbook component and five dead CSS classes, and re-verified every number on the site.',
    body: [
      'A pass whose entire value was subtraction. The Clash Royale and Brawl Stars trophy counts were also re-checked against the game and corrected.',
    ],
  },
  {
    slug: 'site-v33-polish',
    date: '2026-09-04',
    project: 'site',
    version: 'v3.3',
    title: 'The overnight polish sprint',
    excerpt:
      'Scroll progress, back-to-top, typewriter taglines, a stats strip, live search, copy-link buttons and per-page titles.',
    body: [
      'The Games page got live search filtering on name, status and badges. Every devlog entry became copy-linkable. Dead URLs started hitting a real 404.',
      'The scroll progress bar and back-to-top button are small things that made the site feel finished rather than merely deployed.',
    ],
  },
  {
    slug: 'site-v3-lean',
    date: '2026-08-31',
    project: 'site',
    version: 'v3',
    title: 'The lean rebuild — 16 pages down to 3',
    excerpt:
      'Home, Games and About. Every page lazy-loaded, Firebase and thirteen unused pages removed.',
    body: [
      'Sixteen routes were carrying a single JavaScript bundle. The rebuild kept three pages that were actually used and code-split them, so the browser only downloads the page you open.',
      'Same URL, same QR code, a fraction of the weight.',
    ],
  },
  {
    slug: 'site-root-migration',
    date: '2026-08-26',
    project: 'site',
    version: 'v2.4',
    title: 'The site moved to the domain root',
    excerpt:
      'Four old repositories deleted, one repo renamed to JustJayDev.github.io, and every path config migrated in a single pass.',
    body: [
      'The site is now served at the root of the domain rather than a subfolder, which meant updating base paths, the 404 handler, robots.txt and the sitemap together.',
      'The QR code in the footer still resolved to the old location, so it was the first thing that had to be re-pointed.',
    ],
  },
  {
    slug: 'site-motto-hero',
    date: '2026-08-22',
    project: 'site',
    version: 'v2.3',
    title: 'New hero: the motto wall',
    excerpt:
      'The homepage hero became the motto wallpaper — "A King Never Wavers" — with a new OG share image and PWA icon.',
    body: [
      'Focus, Discipline, Freedom. Code. Build. Improve. Repeat. Putting the words on the front page felt more honest than another stock gradient.',
    ],
  },
  {
    slug: 'pixvault-launch',
    date: '2026-08-18',
    project: 'pixvault',
    version: 'v1.0',
    title: 'PixVault — a wallpaper library with no signup wall',
    excerpt:
      'Original-resolution HD and 4K wallpapers, free, no watermark, and no account required to download.',
    body: [
      'Most wallpaper sites gate downloads behind a signup. This one does not. The whole catalogue is browsable, filterable by category and resolution, and viewable in a full-screen lightbox.',
    ],
  },
  {
    slug: 'site-lazy-pages',
    date: '2026-08-14',
    project: 'site',
    version: 'v2.2',
    title: 'Every page made lazy',
    excerpt:
      'All sixteen pages were loading in one bundle. Now every page is code-split with React.lazy.',
    body: [
      'The browser stopped downloading JavaScript for pages you never open. It was the single biggest performance win in the project\'s history and it took one afternoon.',
    ],
  },
  {
    slug: 'site-v2-launch',
    date: '2026-08-09',
    project: 'site',
    version: 'v2',
    title: 'Site v2 is live — and the QR code works',
    excerpt:
      'PWA offline support, animated stats, glare-tilt cards, magnetic buttons, a glitch 404 and a real scannable QR in the footer.',
    body: [
      'The first version that was genuinely installable. The QR code in the footer was tested with an actual phone before shipping, which is the only way to know it works.',
    ],
  },
  {
    slug: 'site-first-post',
    date: '2026-08-04',
    project: 'site',
    version: 'v2.0',
    title: 'justjaydev.github.io — this site is now my main home',
    excerpt:
      'Promoted to the main GitHub Pages home. The URL is now just the bare domain, with no subfolder.',
    body: [
      'Old project repositories were retired so that everything ships from one place. Every project got its own repository and a link from here.',
    ],
  },
  {
    slug: 'autonomous-phase',
    date: '2026-07-28',
    project: 'site',
    version: 'roadmap',
    title: 'Next phase: autonomous build and polish',
    excerpt:
      'A working plan for keeping the projects shipping without each one needing a fresh decision.',
    body: [
      'The goal was to remove the bottleneck of deciding what to build next, by letting the devlog, the Vault and the deploy pipelines drive the work instead of ad-hoc prompts.',
    ],
  },
];

export const devlogBySlug = (slug: string): DevlogEntry | undefined =>
  devlog.find((e) => e.slug === slug);

export const projectLabels: Record<DevlogEntry['project'], string> = {
  site: 'This site',
  titleforge: 'TitleForge',
  pixvault: 'PixVault',
  vault: 'Developer Vault',
};
