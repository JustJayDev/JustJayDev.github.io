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
/* Every URL the sitemap promises, read once and reused by the
 * prerender, lazy-chunk and og:image checks below. Hoisted to module
 * scope so each check validates the SAME route set. */
let locs = [];

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
  locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
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


/* --- 6. every lazy route chunk must exist, and be reachable -------------- */
/* App.tsx lazy()s seven routes. If a chunk were renamed, dropped by a
 * tree-shake, or simply never emitted, the failure is a blank screen at
 * runtime -- tsc and the content validator both pass. So read the real
 * chunk graph out of the emitted entry instead of trusting the source. */
{
  const assetsDir = path.join(out, 'assets');
  const all = readdirSync(assetsDir);
  const emitted = new Set(all);
  const entry = all.filter((n) => /^index-.*\.js$/.test(n))[0];
  if (!entry) {
    fail('assets: no index-*.js entry chunk was emitted');
  } else {
    /* The entry references its route chunks as "./Home-XXXX.js" in the
     * static-import map. Walk the graph transitively from the entry. */
    const seen = {};
    seen[entry] = 1;
    const queue = [entry];
    const referenced = {};
    while (queue.length) {
      const name = queue.pop();
      const src = readFileSync(path.join(assetsDir, name), 'utf8');
      const re = /"\.\/(?!\.)([A-Za-z0-9_.-]+)"/g;
      let m;
      while ((m = re.exec(src))) {
        const dep = m[1];
        referenced[dep] = 1;
        if (emitted.has(dep) && !seen[dep]) {
          seen[dep] = 1;
          queue.push(dep);
        }
      }
    }
    /* Every src/routes/*.tsx must have produced a chunk. Vite names a lazy
     * chunk after its module, so the basename must be present. */
    const routesDir = path.join(root, 'src', 'routes');
    const routeNames = readdirSync(routesDir)
      .filter((n) => n.slice(-4) === '.tsx')
      .map((n) => n.slice(0, -4));
    for (const r of routeNames) {
      const chunk = all.filter(
        (n) => n.indexOf(r + '-') === 0 && n.slice(-3) === '.js',
      )[0];
      if (!chunk) {
        fail('routes/' + r + '.tsx is lazy()d but no assets/' + r + '-<hash>.js chunk was emitted');
      } else if (!referenced[chunk]) {
        fail('assets/' + chunk + ' is emitted but the entry chunk never references it -- dead weight');
      }
    }
    /* Any /assets/ URL referenced from a prerendered shell must exist. */
    for (const loc of locs) {
      const p = loc.slice(SITE.length) || '/';
      const dir = p === '/' ? out : path.join(out, p.replace(/^\/+/, ''));
      const html = readFileSync(path.join(dir, 'index.html'), 'utf8');
      const are = /(?:src|href)="(\/assets\/[^"]+)"/g;
      let am;
      while ((am = are.exec(html))) {
        const rel = am[1].replace(/^\/assets\//, '');
        if (!emitted.has(rel)) fail(p + ': references /assets/' + rel + ', which was not emitted');
      }
    }
  }
}
/* --- 7. every route needs an absolute og:image that exists --------------- */
{
  const og = path.join(out, 'og-image.jpg');
  if (!existsSync(og)) {
    fail('og-image.jpg is missing from dist');
  } else {
    /* Under 1KB is a placeholder, not a real share card. */
    const size = readFileSync(og).length;
    if (size < 1024) fail('og-image.jpg is only ' + size + ' bytes -- too small to be a real share card');
  }
  for (const loc of locs) {
    const p = loc.slice(SITE.length) || '/';
    const dir = p === '/' ? out : path.join(out, p.replace(/^\/+/, ''));
    const html = readFileSync(path.join(dir, 'index.html'), 'utf8');
    const m = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (!m) {
      fail(p + ': no og:image -- link previews would have no image');
    } else if (m[1].indexOf(SITE + '/') !== 0) {
      fail(p + ': og:image "' + m[1] + '" is not an absolute URL on ' + SITE);
    }
    /* og:description and twitter:description must both be present AND must
     * agree with the route's own <meta name="description">. The generator
     * once did an unconditional .replace() on an og:description tag that
     * index.html never shipped, so the regex silently never matched and no
     * prerendered page carried the tag. A missing social description is
     * invisible to a browser and invisible to the eye -- only dist can see
     * it, so that is where it is checked. */
    const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1];
    if (!desc || !desc.trim()) fail(p + ': no meta description');
    for (const [attr, label] of [
      ['og:description', 'og:description'],
      ['twitter:description', 'twitter:description'],
    ]) {
      const m2 = html.match(
        new RegExp('<meta\\s+(?:property|name)="' + attr + '"\\s+content="([^"]*)"'),
      );
      if (!m2) {
        fail(p + ': no ' + label + ' -- social previews fall back to the page title alone');
      } else if (desc && m2[1] !== desc) {
        fail(p + ': ' + label + ' disagrees with the meta description');
      }
    }
    /* Same trap for og:title / twitter:title vs <title>. */
    const ttl = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    for (const [attr, label] of [
      ['og:title', 'og:title'],
      ['twitter:title', 'twitter:title'],
    ]) {
      const m3 = html.match(
        new RegExp('<meta\\s+(?:property|name)="' + attr + '"\\s+content="([^"]*)"'),
      );
      if (m3 && ttl && m3[1] !== ttl) fail(p + ': ' + label + ' (' + m3[1] + ') disagrees with <title> (' + ttl + ')');
    }
    const tw = html.match(/<meta name="twitter:image" content="([^"]+)"/);
    if (!tw) {
      fail(p + ': no twitter:image');
    } else if (m && tw[1] !== m[1]) {
      fail(p + ': twitter:image (' + tw[1] + ') disagrees with og:image (' + m[1] + ')');
    }
  }
}
/* --- 8. 404.html must stay an honest 404 ------------------------------- */
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

/* --- 9. every prerendered route must ship parseable, route-correct JSON-LD --
 * The structured-data graph was emitted only by src/lib/seo.ts at runtime, so
 * the static bytes a crawler reads carried none -- exactly how the missing
 * og:description and twitter:image tags survived to production. A graph that
 * does not parse, or that describes a different route, is worse than none. */
for (const loc of locs) {
  const rp = loc.slice(SITE.length) || '/';
  const dir = rp === '/' ? out : path.join(out, rp.replace(/^\/+/, ''));
  const html = readFileSync(path.join(dir, 'index.html'), 'utf8');
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) {
    fail(rp + ': no JSON-LD -- crawlers get no structured data from the static HTML');
    continue;
  }
  let parsed;
  try {
    parsed = JSON.parse(ld[1]);
  } catch (e) {
    fail(rp + ': JSON-LD is not valid JSON (' + e.message + ')');
    continue;
  }
  if (parsed['@context'] !== 'https://schema.org') {
    fail(rp + ': JSON-LD @context is ' + JSON.stringify(parsed['@context']) + ', expected schema.org');
  }
  const nodes = Array.isArray(parsed['@graph']) ? parsed['@graph'] : [];
  const types = nodes.map((n) => n['@type']);
  for (const t of ['WebSite', 'WebPage']) {
    if (!types.includes(t)) fail(rp + ': JSON-LD has no ' + t + ' node');
  }
  /* The WebPage must describe THIS route, or the graph contradicts the title. */
  const page = nodes.find((n) => n['@type'] === 'WebPage');
  if (page) {
    if (page.url !== loc) fail(rp + ': JSON-LD WebPage url (' + page.url + ') is not ' + loc);
    const ttl = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    if (ttl && page.name !== ttl) {
      fail(rp + ': JSON-LD WebPage name (' + page.name + ') disagrees with <title> (' + ttl + ')');
    }
    const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1];
    if (desc && page.description !== desc) {
      fail(rp + ': JSON-LD WebPage description disagrees with the meta description');
    }
  }
}
if (errors.length) {
  console.error(`check-build: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('check-build: ok — service worker, prerendered routes, sitemap, feed, manifest and 404 all verified.');
