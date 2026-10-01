#!/usr/bin/env node
/* Size budgets against the emitted build artifacts.
 *
 * Run after the build:  npm run check:perf
 * Reads only dist/. Exits non-zero when a budget is exceeded.
 *
 * Deliberately NOT part of the `build` script: the local production gate is
 * frozen. This is additive, like the content tests and check-a11y before it.
 *
 * WHERE THE NUMBERS COME FROM
 *
 * Every budget below was derived from a single measured `npm run build` of
 * this repo (see the table in README.md). They are NOT round numbers chosen
 * to look tidy, and they are NOT aspirational targets the build currently
 * misses — each is the measured value plus headroom, so the build passes
 * today and a regression has to be large to trip it.
 *
 * Measured baseline, raw bytes:
 *     total JS        356,235   (15 files)
 *     total JS gzip   120,862
 *     largest JS      163,305   assets/react-*.js
 *     total CSS        28,032   (1 file)
 *     total HTML       37,408   (11 files)
 *
 * Headroom is deliberately uneven, because the assets are not equally
 * volatile. React and Framer Motion are vendor bundles that only move on an
 * upgrade, so the JS budgets sit ~25% above current. CSS is a single
 * hand-written file that grows slowly, so it gets more slack as a ratio.
 * HTML is prerendered from a fixed route list and grows with route count, so
 * its budget scales with the route count rather than being a flat number
 * that a legitimately added route would trip.
 *
 * WHAT THIS DOES AND DOES NOT CATCH
 *
 * It catches size regressions: an accidentally un-split vendor chunk, a
 * dependency that quietly doubles, a base64 image inlined into CSS, a route
 * added without a lazy import. Those are the failure modes that produce a
 * slow site with no error and no failing test.
 *
 * It does NOT measure load performance. There is no timing here, no network,
 * no render. A bundle can sit comfortably inside every budget and still be
 * slow. Real performance verification needs a browser and a network
 * condition, and is an open item rather than something this file pretends
 * to do. A size budget is a proxy, and it is only ever that.
 */
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');

if (!existsSync(out)) {
  console.error('check-perf: dist/ does not exist — run the build first.');
  process.exit(1);
}

function walk(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full));
    else found.push(full);
  }
  return found;
}

const files = walk(out);
if (!files.length) {
  console.error('check-perf: dist/ is empty');
  process.exit(1);
}

/* Sum raw and gzip size per extension. gzip is measured, not estimated from
 * a ratio table: the actual bytes a visitor downloads are what the budget
 * is trying to protect, and a hardcoded compression factor drifts. */
const totals = new Map();
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const buf = readFileSync(file);
  const cur = totals.get(ext) || { raw: 0, gzip: 0, files: 0, largest: 0, largestPath: '' };
  cur.raw += buf.length;
  cur.gzip += gzipSync(buf, { level: 9 }).length;
  cur.files += 1;
  if (buf.length > cur.largest) {
    cur.largest = buf.length;
    cur.largestPath = path.relative(out, file);
  }
  totals.set(ext, cur);
}

const byExt = (ext) => totals.get(ext) || { raw: 0, gzip: 0, files: 0, largest: 0, largestPath: '' };
const js = byExt('.js');
const css = byExt('.css');
const html = byExt('.html');

if (!js.files) {
  console.error('check-perf: no .js files under dist/ — the build emitted nothing to budget.');
  process.exit(1);
}

/* HTML budget scales with the number of prerendered pages, because that count
 * is expected to grow as routes are added. A flat ceiling would punish a
 * legitimate new route; this still catches a template that bloats, because a
 * doubling of per-page weight blows through the per-page allowance. */
const PER_PAGE_HTML = 4_600;
const htmlBudget = Math.max(20_000, html.files * PER_PAGE_HTML);

/* label, actual, budget, unit note */
const budgets = [
  { name: 'total JS', actual: js.raw, limit: 446_000,
    note: 'all emitted scripts combined' },
  { name: 'total JS (gzip)', actual: js.gzip, limit: 155_000,
    note: 'what a visitor actually downloads' },
  { name: 'largest JS chunk', actual: js.largest, limit: 205_000,
    note: `currently ${js.largestPath}` },
  { name: 'total CSS', actual: css.raw, limit: 40_000,
    note: 'single hand-written stylesheet' },
  { name: 'total HTML', actual: html.raw, limit: htmlBudget,
    note: `${html.files} prerendered page(s) at ${PER_PAGE_HTML.toLocaleString('en-US')} B/page` },
];

const errors = [];
for (const b of budgets) {
  if (b.actual > b.limit) {
    const over = b.actual - b.limit;
    const pct = ((b.actual / b.limit - 1) * 100).toFixed(0);
    errors.push(
      `${b.name}: ${b.actual.toLocaleString('en-US')} B exceeds budget ` +
        `${b.limit.toLocaleString('en-US')} B by ${over.toLocaleString('en-US')} B (+${pct}%) — ${b.note}`,
    );
  }
}

const kB = (n) => `${(n / 1024).toFixed(1)} kB`;

if (errors.length) {
  console.error(`check-perf: ${errors.length} budget(s) exceeded\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(
  `check-perf: ok — ${files.length} file(s) under dist/ within budget ` +
    `(total JS ${js.raw.toLocaleString('en-US')} B / ${kB(js.raw)}, gzip ${js.gzip.toLocaleString('en-US')} B; ` +
    `CSS ${css.raw.toLocaleString('en-US')} B; HTML ${html.raw.toLocaleString('en-US')} B across ${html.files} page(s)).`,
);
console.log(
  'check-perf: note — these are size budgets only. No timing, no network, no render: a site inside every budget can still be slow.',
);