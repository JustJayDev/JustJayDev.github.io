#!/usr/bin/env node
/* Validates the content layer. This is the contract that src/content/types.ts
 * claims exists: every dataset is checked for the invariants the UI relies on
 * before anything is bundled or published.
 *
 * Run: node scripts/validate-content.mjs
 * Exits non-zero and prints every problem it found, so a broken dataset can
 * never reach production the way the old site's four type errors did.
 */
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (msg) => errors.push(msg);

async function loadContent() {
  const tmp = path.join(root, 'node_modules', '.cache', 'content-validate.mjs');
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

const c = await loadContent();

/* --- non-empty string --- */
const str = (v) => typeof v === 'string' && v.trim().length > 0;
const req = (obj, field, where) => {
  if (!str(obj?.[field])) fail(`${where}: missing or empty "${field}"`);
};

/* --- uniqueness across a dataset --- */
function unique(items, key, where) {
  const seen = new Set();
  for (const it of items) {
    const v = it[key];
    if (!str(v)) {
      fail(`${where}: an entry has an empty "${key}"`);
      continue;
    }
    if (seen.has(v)) fail(`${where}: duplicate ${key} "${v}"`);
    seen.add(v);
  }
  return seen;
}

/* --- games --- */
unique(c.games, 'id', 'games');
for (const g of c.games) {
  const where = `games/${g.id || '?'}`;
  req(g, 'name', where);
  req(g, 'category', where);
  req(g, 'status', where);
  if (g.category === 'casual' && g.hasProfile) {
    fail(`${where}: casual games cannot have hasProfile (they have no profile page)`);
  }
  if (g.image && !existsSync(path.join(root, 'public', g.image.replace(/^\.?\//, '')))) {
    fail(`${where}: image "${g.image}" does not exist in public/`);
  }
  if (g.hasProfile) {
    for (const [i, d] of (g.details || []).entries()) {
      if (!str(d)) fail(`${where}: details[${i}] is empty`);
    }
    if (!Array.isArray(g.badges) || g.badges.length === 0) {
      fail(`${where}: hasProfile is set but badges is empty`);
    }
  }
}

/* --- devlog: unique slugs, valid + descending dates --- */
unique(c.devlog, 'slug', 'devlog');
let prev = null;
for (const e of c.devlog) {
  const where = `devlog/${e.slug || '?'}`;
  req(e, 'title', where);
  req(e, 'date', where);
  req(e, 'excerpt', where);
  req(e, 'project', where);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date || '')) {
    fail(`${where}: date "${e.date}" is not YYYY-MM-DD`);
  } else {
    const d = new Date(e.date + 'T00:00:00Z');
    if (Number.isNaN(d.getTime())) fail(`${where}: date "${e.date}" is not a real date`);
    if (prev && d > prev) {
      fail(`${where}: entries must be newest-first (${e.date} follows ${prev.toISOString().slice(0, 10)})`);
    }
    prev = d;
  }
  if (!Array.isArray(e.body) || e.body.length === 0) {
    fail(`${where}: body is empty`);
  }
}

/* --- achievements: keyed by icon+title, since there is no id field --- */
for (const a of c.achievements) {
  const where = `achievements/${a.title || a.icon || '?'}`;
  req(a, 'title', where);
  req(a, 'detail', where);
  req(a, 'icon', where);
  req(a, 'tag', where);
}
const achKeys = new Set();
for (const a of c.achievements) {
  const k = `${a.icon}|${a.title}`;
  if (achKeys.has(k)) fail(`achievements: duplicate entry "${a.title}"`);
  achKeys.add(k);
}

/* --- projects --- */
unique(c.projects, 'id', 'projects');
for (const p of c.projects) {
  const where = `projects/${p.id || '?'}`;
  req(p, 'name', where);
  req(p, 'tagline', where);
  req(p, 'detail', where);
  for (const k of ['url', 'repo']) {
    const v = p[k];
    if (v && !/^https:\/\//.test(v)) fail(`${where}: ${k} "${v}" must be https://`);
  }
}

/* --- socials --- */
for (const s of c.socials || []) {
  const where = `socials/${s.label || '?'}`;
  req(s, 'label', where);
  req(s, 'handle', where);
  if (!/^https:\/\//.test(s.url || '')) fail(`${where}: url must be https://`);
}

/* --- site --- */
req(c.site, 'title', 'site');
req(c.site, 'description', 'site');
if (c.site && c.site.url && !/^https:\/\//.test(c.site.url)) {
  fail('site: url must be https://');
}

if (errors.length) {
  console.error(`validate-content: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(
  `validate-content: ok — ${c.games.length} games, ${c.devlog.length} devlog entries, ` +
    `${c.projects.length} projects, ${(c.achievements || []).length} achievements, ` +
    `${(c.socials || []).length} socials`,
);
