# JustJayDev.github.io

Personal site of **Jay Kumar (JustJayDev)** — mobile gamer. Builder. Future trader.

**Live:** https://justjaydev.github.io/

## Stack

React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion.

- 3 pages: Home (hero + now playing), Games (18 games, expandable stat cards), About (bio, setup, idols, socials)
- Lazy-loaded pages, code-split vendor chunks
- Dark / light / system theme
- PWA: offline support, installable, app icons
- SPA routing with GitHub Pages 404 fallback
- SEO: meta + Open Graph + Twitter cards + JSON-LD + sitemap + robots
- RSS devlog feed at `/feed.xml`

## Develop

```bash
pnpm install
pnpm dev      # local dev server
pnpm build    # production build to dist/
```

## Deploy

Push to `main` → GitHub Actions builds and publishes to the `gh-pages` branch automatically.