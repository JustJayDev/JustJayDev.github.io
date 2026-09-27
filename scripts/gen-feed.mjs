/**
 * Generates public/feed.xml from the central devlog registry at build time.
 *
 * Run by build: `node scripts/gen-feed.mjs` (see package.json).
 * The feed is deliberately a PUBLIC projection — toFeedItem() only ever
 * emits project name, title, summary/body, date and the public project URL.
 * No secrets, tokens, keys or private URLs reach the feed.
 *
 * The registry is TypeScript; we transpile it to ESM JS with tsc (already a
 * dev dependency) before importing, so no extra toolchain is required.
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = resolve(root, 'public', 'feed.xml');
const tmpDir = resolve(root, 'node_modules', '.feed-gen');
const tmp = resolve(tmpDir, 'devlog.mjs');
const SITE = 'https://justjaydev.github.io';

/* TS -> ESM JS using the installed typescript compiler API */
const src = readFileSync(resolve(root, 'src', 'data', 'devlog.ts'), 'utf8');
const { outputText } = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
});
mkdirSync(tmpDir, { recursive: true });
writeFileSync(tmp, outputText);
const { sortedUpdates, toFeedItem } = await import(pathToFileURL(tmp).href);

const items = sortedUpdates().map((u) => {
  const f = toFeedItem(u);
  return `    <item>
      <title>${esc(f.title)}</title>
      <link>${f.link}</link>
      <guid>${esc(f.guid)}</guid>
      <pubDate>${f.pubDate}</pubDate>
      <description>${esc(f.description)}</description>
    </item>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JustJayDev — Devlog</title>
    <link>${SITE}/devlog</link>
    <description>Central build log for every JustJayDev project: what shipped, what improved, what got fixed.</description>
    <language>en</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

writeFileSync(out, xml, 'utf8');
console.log(`[feed] wrote ${items.length} items -> public/feed.xml`);

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&#34;')
    .replace(/'/g, '&#39;');
}
