#!/usr/bin/env node
/* Generates the build-time static files that must stay in sync with the content
 * layer: feed.xml (from src/content/devlog.ts), sitemap.xml, and sw.js.
 *
 * The service-worker cache name is derived from the SHA-256 of the emitted
 * asset filenames, so it can never drift out of sync the way a hand-edited
 * version string did in the previous site.
 *
 * Run: node scripts/gen-static.mjs [--hash <string>]
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const pub = path.join(root, 'public');
const SITE = 'https://justjaydev.github.io';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(new RegExp('"', 'g'), '&#34;');

/* --- load the real content layer by transpiling it on the fly --- */
async function loadContent() {
  const tmp = path.join(root, 'node_modules', '.cache', 'content.mjs');
  await mkdir(path.dirname(tmp), { recursive: true });
  await esbuild.build({
    entryPoints: [path.join(root, 'src', 'content', 'index.ts')],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    outfile: tmp,
    logLevel: 'silent',
  });
  return import(pathToFileURL(tmp).href + '?t=' + Date.now());
}

/* --- feed.xml --- */
function buildFeed(devlog, site) {
  const items = devlog
    .map((e) => {
      const link = `${SITE}/devlog#${e.slug}`;
      return `    <item>
      <title>${esc(e.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(e.date + 'T09:00:00Z').toUTCString()}</pubDate>
      <description>${esc(e.excerpt)}</description>
    </item>`;
    })
    .join('\n');
  const newest = devlog[0].date;
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.title)} — Devlog</title>
    <link>${SITE}/devlog</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Build notes for ${esc(site.title)}: the site, TitleForge, PixVault and the Developer Vault.</description>
    <language>en</language>
    <lastBuildDate>${new Date(newest + 'T09:00:00Z').toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

/* --- prerender ---
 * GitHub Pages serves <dir>/index.html for <dir> with HTTP 200, and only
 * falls through to 404.html (HTTP 404) when nothing matches. A single
 * catch-all shell therefore forces every deep route to answer 404, which
 * breaks link previews and tells crawlers 5 of 9 sitemap URLs are missing.
 *
 * So each real route gets its own directory containing a copy of the built
 * index.html with that route's <title>/description/og/canonical pre-filled
 * from the content layer. The runtime is untouched -- React Router still
 * mounts and takes over -- but the bytes a crawler or preview bot sees are
 * now the correct ones, served with a 200.
 *
 * Genuine unknown paths still reach 404.html and still answer 404.
 */
function seoFor(c, pathname) {
  const { site, profile, games } = c;
  const p = pathname === '/' ? '/' : pathname;
  if (p === '/') {
    return {
      title: `${site.title} — ${site.tagline}`,
      desc: site.description,
      path: '/',
    };
  }
  if (p === '/games') {
    return {
      title: `Games — ${site.title}`,
      desc: 'Every game Jay plays — ranks, trophies, levels and badges, updated as they change.',
      path: '/games',
    };
  }
  if (p === '/projects') {
    return {
      title: `Projects — ${site.title}`,
      desc: 'TitleForge and PixVault — the apps Jay builds and ships. Plus the Developer Vault that keeps their secrets out of the browser.',
      path: '/projects',
    };
  }
  if (p === '/devlog') {
    return {
      title: `Devlog — ${site.title}`,
      desc: 'Build notes across this site, TitleForge, PixVault and the Developer Vault — newest first.',
      path: '/devlog',
    };
  }
  if (p === '/about') {
    return {
      title: `About — ${site.title}`,
      desc: `${profile.name} — ${profile.tagline} Mobile gamer, AI builder, and the developer behind TitleForge and PixVault.`,
      path: '/about',
    };
  }
  const m = /^\/games\/([^/]+)$/.exec(p);
  if (m) {
    const g = games.find((x) => x.id === m[1]);
    return {
      title: g ? `${g.name} — ${site.title}` : `Game not found — ${site.title}`,
      desc: g ? `${g.name} — ${g.status}. ${g.badges.join(' · ')}.` : 'Game not found.',
      path: p,
    };
  }
  return { title: `Not found — ${site.title}`, desc: 'That page does not exist.', path: p };
}

function applySeo(html, seo) {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  out = out.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${esc(seo.desc)}$2`,
  );
  out = out.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${esc(seo.title)}$2`,
  );
  /* og:description was REPLACED unconditionally, but index.html never
   * ships the tag -- so the regex never matched and every prerendered page
   * shipped with no og:description. seo.ts injected it at runtime, which a
   * link-preview bot never runs. Insert it if absent, replace if present. */
  if (/<meta\s+property="og:description"/.test(out)) {
    out = out.replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${esc(seo.desc)}$2`,
    );
  } else {
    out = out.replace('</head>', `  <meta property="og:description" content="${esc(seo.desc)}" />\n  </head>`);
  }
  if (/<meta\s+property="og:url"/.test(out)) {
    out = out.replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
      `$1${SITE}${seo.path}$2`,
    );
  } else {
    out = out.replace('</head>', `  <meta property="og:url" content="${SITE}${seo.path}" />\n  </head>`);
  }
  if (/<meta\s+name="twitter:title"/.test(out)) {
    out = out.replace(
      /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
      `$1${esc(seo.title)}$2`,
    );
    out = out.replace(
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
      `$1${esc(seo.desc)}$2`,
    );
  } else {
    // index.html only ships twitter:card, so a preview bot would otherwise
    // fall back to og:title with no per-route twitter copy.
    out = out.replace(
      '</head>',
      `  <meta name="twitter:title" content="${esc(seo.title)}" />\n` +
        `  <meta name="twitter:description" content="${esc(seo.desc)}" />\n  </head>`,
    );
  }
  /* twitter:image was the one social tag index.html never ships. seo.ts
   * injects it at runtime, but a preview bot reads the static HTML and
   * never runs the bundle, so every Twitter/X card rendered with no image.
   * Inject it here, alongside the other per-route twitter tags. */
  const TW_IMG = SITE + '/og-image.jpg';
  if (/<meta\s+name="twitter:image"/.test(out)) {
    out = out.replace(
      /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
      '$1' + TW_IMG + '$2',
    );
  } else {
    out = out.replace(
      '</head>',
      '  <meta name="twitter:image" content="' + TW_IMG + '" />\n  </head>',
    );
  }
  // Canonical must be absolute and route-specific, or every profile page
  // would advertise itself as the homepage.
  if (/<link\s+rel="canonical"/.test(out)) {
    out = out.replace(
      /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
      `$1${SITE}${seo.path}$2`,
    );
  } else {
    out = out.replace(
      '</head>',
      `  <link rel="canonical" href="${SITE}${seo.path}" />\n  </head>`,
    );
  }
  return out;
}

/* --- sitemap.xml --- */
function buildSitemap(paths) {
  const urls = paths
    .map((p) => {
      const loc = `${SITE}/${p.replace(/^\/+/, '')}`;
      const pri = p === '/' ? '1.0' : p === '/devlog' || p === '/games' ? '0.9' : '0.7';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${pri}</priority>\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/* --- sw.js --- */
function buildSw(hash) {
  return `/* Generated by scripts/gen-static.mjs — do not edit by hand.
 * Cache version is derived from the build output hash, so a new deploy always
 * lands in a new cache and the activate handler drops the old one.
 *
 * Registered from an ABSOLUTE '/sw.js' in src/main.tsx. A relative './sw.js'
 * resolved against the current document, so on a deep route it asked for
 * /games/dragon-city/sw.js, 404ed, and the visitor silently got no worker. */
const CACHE = 'jjdev-v8-${hash}';
const SHELL = ['/', '/index.html', '/manifest.webmanifest'];

/* One cache entry per real route, keyed by its own pathname. The previous
 * version wrote EVERY navigation into the single './index.html' slot, so the
 * most recently visited page replaced the shell for all of them: go offline
 * after visiting /devlog and /games/dragon-city served you the devlog HTML. */
const routeKey = (pathname) =>
  new URL(pathname.endsWith('/') ? pathname : pathname + '/', self.location.origin).pathname;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first, so a fresh deploy is picked up on the next
  // visit. Cached per route, so an offline deep link still resolves to ITS OWN
  // page instead of whatever page was visited last. 404s are never cached --
  // caching one would pin a deleted page to a "live" response forever.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(routeKey(url.pathname), copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(routeKey(url.pathname))
            .then((hit) => hit || caches.match('/index.html')),
        ),
    );
    return;
  }

  // Hashed build output is immutable: cache first. Vite names these
  // <base>-<8 char hash>.ext, NOT a dot-suffixed hash, so the previous
  // pattern matched NONE of the 15 emitted assets and this arm was dead code.
  if (/-[A-Za-z0-9_-]{8}\\.(js|css|woff2?|png|jpe?g|svg|webp|avif)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res && res.status === 200) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
`;
}

const argv = process.argv.slice(2);
const hashArg = argv.includes('--hash') ? argv[argv.indexOf('--hash') + 1] : null;

let hash = hashArg;
if (!hash) {
  const assetsDir = path.join(out, 'assets');
  const names = existsSync(assetsDir)
    ? (await readdir(assetsDir)).sort()
    : (await readdir(pub)).sort();
  hash = createHash('sha256').update(names.join('|')).digest('hex').slice(0, 12);
}

await mkdir(out, { recursive: true });

// Static copies that live in public/ get written by Vite already; these three
// are generated so they can never disagree with the content layer.
const c = await loadContent();
await writeFile(path.join(out, 'feed.xml'), buildFeed(c.devlog, c.site));
// Derived from the content layer, not hand-listed, so a new game profile can
// never ship without being discoverable.
const sitemapPaths = [
  '/',
  '/games',
  '/projects',
  '/devlog',
  '/about',
  ...c.mainGames.filter((g) => g.hasProfile).map((g) => `/games/${g.id}`),
];
await writeFile(path.join(out, 'sitemap.xml'), buildSitemap(sitemapPaths));
await writeFile(path.join(out, 'sw.js'), buildSw(hash));

/* Write the per-route shells. */
const indexHtml = await readFile(path.join(out, 'index.html'), 'utf8');
let prerendered = 0;
for (const route of sitemapPaths) {
  const dir = route === '/' ? out : path.join(out, route.replace(/^\/+/, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), applySeo(indexHtml, seoFor(c, route)));
  prerendered += 1;
}

console.log(
  `gen-static: sw cache jjdev-v8-${hash}, feed=${c.devlog.length} entries, prerendered ${prerendered} routes`,
);
