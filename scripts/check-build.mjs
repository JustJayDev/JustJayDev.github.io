#!/usr/bin/env node
/* Post-build integrity checks for the GENERATED artefacts.
 *
 * Run after gen-static.mjs:  node scripts/check-build.mjs
 * Exits non-zero on any failure, so `npm run build` cannot ship a broken
 * dist. These exist because two real defects reached production unnoticed:
 *
 *   1. sw.js cached every navigation into the single './index.html' slot, so
 *      an offline deep link was served whichever page was visited last.
 *   2. sw.js matched immutable assets with /\.[0-9a-z]{8,}\./ , but Vite emits
 *      <base>-<hash>.ext. The pattern matched zero of the real files, so the
 *      cache-first arm was dead code that still looked correct in review.
 *
 * Both were invisible to `tsc` and to the content validator, because neither
 * touches TypeScript or the content layer. This does.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const errors = [];
const fail = (m) => errors.push(m);
const SITE = 'https://justjaydev.github.io';

if (!existsSync(out)) {
  console.error('check-build: dist/ does not exist — run the build first.');
  process.exit(1);
}

/* --- 1. the service worker actually matches the assets we ship ---------- */
const swPath = path.join(out, 'sw.js');
if (!existsSync(swPath)) {
  fail('sw.js was not generated');
} else {
  const sw = readFileSync(swPath, 'utf8');

  const cacheMatch = sw.match(/const CACHE = '([^']+)'/);
  if (!cacheMatch) fail('sw.js: no CACHE constant found');
  else if (!/^jjdev-v\d+-[0-9a-f]{12}$/.test(cacheMatch[1])) {
    fail(`sw.js: CACHE "${cacheMatch[1]}" is not <name>-<12 hex>, so it cannot be tied to a build`);
  }

  /* Pull the real regex literal out of the emitted file rather than
   * re-declaring it, so this test tracks the shipped bytes. */
  const line = sw.split('\n').find((l) => l.includes('.test(url.pathname)'));
  if (!line) {
    fail('sw.js: no immutable-asset test found');
  } else {
    const literal = line.match(/if \((\/(?:[^/\\]|\\.)+\/[a-z]*)\.test\(/);
    if (!literal) {
      fail(`sw.js: could not parse the immutable-asset regex from: ${line.trim()}`);
    } else {
      /* Split the flags off the END of the literal. Trimming the last two
       * characters blindly would eat the flag instead of the delimiter. */
      const raw = literal[1];
      const body = raw.slice(1, raw.lastIndexOf('/'));
      const flags = raw.slice(raw.lastIndexOf('/') + 1);
      const re = new RegExp(body, flags);
      const assets = readdirSync(path.join(out, 'assets')).filter((n) => /\.(js|css)$/.test(n));
      const missed = assets.filter((n) => !re.test(n));
      if (missed.length) {
        fail(
          `sw.js: the immutable-asset regex /${body}/${flags} matches none of the ` +
            `${assets.length} emitted js/css files, so the cache-first arm is dead code. ` +
            `Unmatched: ${missed.join(', ')}`,
        );
      }
    }
  }

  /* One cache entry per route, and the old single-slot behaviour is gone. */
  if (/put\('\.\/index\.html'/.test(sw)) {
    fail("sw.js: still caches every navigation into './index.html', which overwrites other routes");
  }
  if (!/routeKey/.test(sw)) {
    fail('sw.js: no per-route cache key, so an offline deep link resolves to the wrong page');
  }
  /* The old version cached 404s, pinning a deleted page to a live response. */
  if (!/res\.status === 200/.test(sw)) {
    fail('sw.js: no status guard on cached responses, so a 404 could be stored');
  }
  /* Registered from main.tsx as '/sw.js'; a relative path 404s on deep routes. */
  if (!/const SHELL = \['\/', '\/index\.html'/.test(sw)) {
    fail("sw.js: SHELL is not absolute, so it resolves against the current route");
  }
}

/* --- 2. every prerendered route has its own directory + correct SEO ----- */
const sitemapPath = path.join(out, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('sitemap.xml was not generated');
} else {
  const xml = readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) fail('sitemap.xml lists no URLs');

  for (const loc of locs) {
    if (!loc.startsWith(SITE)) fail(`sitemap.xml: "${loc}" is not an absolute ${SITE} URL`);
    const p = loc.slice(SITE.length) || '/';
    const dir = p === '/' ? out : path.join(out, p.replace(/^\/+/, ''));
    const file = path.join(dir, 'index.html');
    if (!existsSync(file)) {
      fail(`sitemap.xml: "${p}" has no dist/${p}/index.html, so Pages would answer 404`);
      continue;
    }
    const html = readFileSync(file, 'utf8');
    /* Canonical must be absolute AND specific to this route. */
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/);
    if (!canon) fail(`${p}: no canonical link`);
    else if (canon[1] !== loc) fail(`${p}: canonical is "${canon[1]}" but sitemap says "${loc}"`);
    /* Every route needs a real description, not the homepage's. */
    const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/s);
    if (!desc || !desc[1].trim()) fail(`${p}: empty meta description`);
    if (!/<meta property="og:url"/.test(html)) fail(`${p}: no og:url`);
    if (!/<meta name="twitter:title"/.test(html)) fail(`${p}: no twitter:title`);
    /* Assets in a prerendered shell must be root-absolute, or a deep route
     * asks for /games/assets/*.js and the page never boots. */
    for (const bad of html.match(/(?:src|href)="(?!https?:|\/\/|#|mailto:)([^"]*assets\/[^"]*)"/g) || []) {
      if (!bad.includes('"/assets/')) fail(`${p}: relative asset URL in shell: ${bad}`);
    }
  }
  /* Two URLs must never canonicalise to the same page. */
  const canons = locs.slice();
  if (new Set(canons).size !== canons.length) fail('sitemap.xml contains duplicate URLs');
}

/* --- 3. the XML and JSON artefacts must actually parse ---------------- */
for (const [f, kind] of [
  ['feed.xml', 'xml'],
  ['sitemap.xml', 'xml'],
]) {
  const p = path.join(out, f);
  if (!existsSync(p)) {
    fail(`${f} was not generated`);
    continue;
  }
  const s = readFileSync(p, 'utf8');
  if (kind === 'xml' && !s.startsWith('<?xml')) fail(`${f}: missing XML declaration`);
}
{
  const p = path.join(out, 'manifest.webmanifest');
  if (!existsSync(p)) fail('manifest.webmanifest is missing');
  else {
    try {
      JSON.parse(readFileSync(p, 'utf8'));
    } catch (e) {
      fail(`manifest.webmanifest is not valid JSON: ${e.message}`);
    }
  }
}

/* --- 4. no content-driven asset may point outside the site root ---------- */
const content = readFileSync(path.join(root, 'src', 'content', 'games.ts'), 'utf8');
for (const m of content.matchAll(/image:\s*'([^']+)'/g)) {
  const img = m[1];
  if (img.startsWith('/') || img.includes('..')) {
    fail(`games.ts: image "${img}" is not root-relative and will 404 on a deep route`);
  }
  if (!existsSync(path.join(root, 'public', img.replace(/^\.\//, '')))) {
    fail(`games.ts: image "${img}" does not exist in public/`);
  }
}

/* --- 5. 404.html must stay an honest 404 ------------------------------- */
{
  const p = path.join(out, '404.html');
  if (!existsSync(p)) fail('404.html is missing');
  else {
    const html = readFileSync(p, 'utf8');
    if (!/<meta name="robots" content="noindex"/.test(html)) {
      fail('404.html is not noindex, so a 404 could get indexed');
    }
    /* A meta-refresh here would hide genuinely missing pages from crawlers. */
    if (/http-equiv="refresh"/i.test(html)) {
      fail('404.html redirects away; a real 404 must not bounce to the homepage');
    }
  }
}

if (errors.length) {
  console.error(`check-build: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('check-build: ok — service worker, prerendered routes, sitemap, feed, manifest and 404 all verified.');
