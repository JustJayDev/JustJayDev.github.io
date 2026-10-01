# JustJayDev — v7

The main JustJayDev site. A ground-up rebuild: new architecture, new visual
identity, content sourced entirely from the real ecosystem.

Live: https://justjaydev.github.io

## Stack

React 18 · TypeScript (strict) · Vite 5 · Tailwind 3 · Framer Motion

## Scripts

```bash
npm install
npm run dev        # dev server
npm run typecheck  # tsc --noEmit
npm test           # content-derivation tests (node --test, no extra deps; not part of build)
npm run check:a11y # static a11y check on dist/ (run after build; not part of build)
npm run build      # tsc --noEmit && validate-content && vite build && gen-static && check-build
npm run preview    # serve the production build
```

CI runs the test suite before the deploy build; the local `npm run build` gate deliberately excludes it, so a test failure never changes what a local production build does.

## Architecture

```
src/
  content/        ← all copy and data. Components never hardcode strings.
    types.ts      ← the shape of everything below
    profile.ts    ← identity, socials, bio, device setup
    games.ts      ← 19 games (9 main + 10 casual)
    projects.ts   ← TitleForge, PixVault, Developer Vault (infra)
    achievements.ts
    devlog.ts     ← 19 merged build entries
    site.ts       ← nav + derived stats (nothing typed by hand)
  lib/            ← theme, seo, motion primitives
  components/     ← shell (header/footer/field) + ui + home sections
  routes/         ← one file per route, all lazy-loaded
  styles/         ← tokens → keyframes → base → components
scripts/
  gen-static.mjs  ← feed.xml, sitemap.xml, sw.js
docs/
  SECURITY.md     ← why ALT's secret area was not carried forward
```

### Three decisions worth knowing

**The type-check gates the build.** `build` runs `tsc --noEmit` before Vite.
The previous pipeline had four type errors sitting in `main` for months
because nothing gated on them. It also means `docs/SECURITY.md`'s claim about
a working deploy is enforced by CI, not by good intentions.

**The design tokens live in exactly one file.** `styles/tokens.css`, with no
versioned override layers. The v5 and v6 redesigns were each added as another
CSS file that loaded after the last, and the sprawl that followed is why this
one file is written to be complete.

**The service-worker cache version is generated, never hand-edited.**
`scripts/gen-static.mjs` derives it from a hash of the emitted asset filenames,
so it cannot drift. The old site maintained that string by hand and served
stale bundles because of it.

## Content rules

Every game rank, trophy count, achievement, project and devlog entry traces
back to a real repo in the ecosystem. Nothing is invented to fill space.
Derived numbers (counts, totals) are computed in `site.ts`, never typed.

## Accessibility

Dark-first with a peer light mode, both verified to WCAG AA on every text
token. `prefers-reduced-motion` is honoured globally in `base.css` and again
in JS via `usePrefersReducedMotion`. Skip link, one `h1` per route, per-route
titles and JSON-LD, live-region result counts, focus-visible rings throughout.

`npm run check:a11y` enforces the parts that exist in the emitted bytes: document
language, one non-empty unique title per route, a zoom-permitting viewport, and
no-JS content on every prerendered page. It also checks at source level that the
skip link's target and the `<main>` landmark still agree.

It deliberately does not claim to check `<main>`, heading order, `alt` text or
form labels. The prerenderer ships `<div id="root"></div>`, so that markup only
exists in the browser — a check for it would either pass vacuously or fail on
every page, and a green run that proves nothing is worse than an honest gap.
Rendering-level coverage needs a DOM and remains open.

## Deployment

Push to `main`. GitHub Actions builds (type-check gated), scans `dist/` for
leaked secret patterns, and deploys to Pages.
