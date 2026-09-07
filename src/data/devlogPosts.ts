// ============================================================
//  DEVLOG POSTS — add a new post by copying a block below.
//  slug: unique short name (no spaces)
//  date: any label you want shown
//  body: use \n for a new line
// ============================================================

export interface DevlogPost {
  slug: string;
  date: string;
  title: string;
  body: string;
}

export const POSTS: DevlogPost[] = [
  {
    slug: 'repo-restructure',
    date: 'September 7, 2026',
    title: 'One repo to rule them all',
    body: `Big cleanup day: deleted 4 old repos (old main site, awesome-free-llm-apis, teachers-day, jay-workspace) and renamed this one to JustJayDev.github.io — so the site now lives at the ROOT: justjaydev.github.io.\n\nEvery path config (vite base, router, sitemap, feed, manifest, 404 redirect) was migrated in one pass. The QR code still works because it points at the domain, not a path.\n\nAlso planted the Google Search Console verification file. Next: hit Verify and submit the sitemap.`,
  },
  {
    slug: 'hero-photo-motto',
    date: 'September 7, 2026',
    title: 'New hero: the motto wall',
    body: `Added my motto wallpaper as the homepage hero — "A King Never Wavers", Code. Build. Improve. Repeat., Focus. Discipline. Freedom.\n\nIt is also the new OG share image now, so links sent on WhatsApp or Discord show it too. Same image got turned into the PWA icons (192px + 512px), so installing the site as an app uses it as the logo.`,
  },
  {
    slug: 'speed-pass',
    date: 'September 7, 2026',
    title: 'Made every page load lazy',
    body: `All 16 pages used to load in one big JavaScript bundle. Now every page is code-split with React.lazy — the browser only downloads the page you actually open.\n\nFirst paint should feel snappier, especially on slow data. Also added real PNG icons to the PWA manifest (install prompt was silently failing without them) and hooked the RSS feed into the page head so browsers can detect it.`,
  },
  {
    slug: 'details-page',
    date: 'September 6, 2026',
    title: 'New Details page — everything in one place',
    body: `Added a Details page: one page with all my info, setup, skills, projects, a timeline, and an FAQ.\n\nBest part: it runs on a single data file. I can add any detail anytime without touching the design.`,
  },
  {
    slug: 'site-v2-live',
    date: 'September 5, 2026',
    title: 'Site v2 is live — and the QR works',
    body: `Rebuilt the whole site: PWA offline support, animated stats, glare-tilt cards, magnetic buttons, a glitch 404, and a footer with a real scannable QR code that opens this site.\n\nFun part: the QR got machine-verified by decoding the live deployed bundle itself. If it scans in the test, it scans in real life.`,
  },
];