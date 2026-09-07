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
    slug: 'site-v2-live',
    date: 'September 2026',
    title: 'Site v2 is live — and the QR works',
    body: `Rebuilt the whole site: PWA offline support, animated stats, glare-tilt cards, magnetic buttons, a glitch 404, and a footer with a real scannable QR code that opens this site.\n\nFun part: the QR got machine-verified by decoding the live deployed bundle itself. If it scans in the test, it scans in real life.`,
  },
  {
    slug: 'details-page',
    date: 'September 2026',
    title: 'New Details page — everything in one place',
    body: `Added a Details page: one page with all my info, setup, skills, projects, a timeline, and an FAQ.\n\nBest part: it runs on a single data file. I can add any detail anytime without touching the design.`,
  },
  {
    slug: 'seo-pass',
    date: 'September 2026',
    title: 'Getting found on Google',
    body: `Added the full SEO pack: sitemap, robots, Open Graph share image (so WhatsApp/Discord links show a nice card), and structured data for Google.\n\nNext step: submit the sitemap in Google Search Console and wait for the crawl.`,
  },
];