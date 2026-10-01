#!/usr/bin/env node
/* Static accessibility checks against the PRERENDERED output.
 *
 * Run after the build:  node scripts/check-a11y.mjs
 * Reads only dist/. Exits non-zero on any violation, with a per-page message.
 *
 * Deliberately NOT part of the `build` script: the local production gate is
 * frozen, and this check is additive, like the content tests were before CI.
 *
 * SCOPE — read this before adding a rule.
 *
 * The prerenderer rewrites <head> only. Every generated page ships a body of
 *   <div id="root"></div> plus a <noscript> fallback,
 * because the real DOM is built by React at runtime. That has one hard
 * consequence for accessibility automation:
 *
 *   NO <main>, NO <h1>, NO <img>, NO <form> and NO <input> APPEAR IN dist/.
 *
 * So "exactly one <main> landmark", "images have alt text", "controls have
 * labels" and "heading order" CANNOT be checked here — not because they are
 * unimportant, but because the markup they inspect is only ever present in the
 * browser, never in the bytes on disk. A check for them would either pass
 * vacuously or fail on every page, and both outcomes are worse than an honest
 * omission: a green run that proves nothing teaches you the site is accessible.
 *
 * The <main id="main"> landmark and the skip link that targets it are verified
 * at the SOURCE level instead, below, which is where that markup actually
 * lives. Real rendering-level a11y coverage needs a browser DOM and is the
 * open item, not something this file should pretend to do.
 *
 * Everything checked here IS a genuine static-HTML defect class: the same
 * properties that break a crawler's language detection, a screen reader's
 * navigation, or a no-JS visitor's experience.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const errors = [];
const fail = (m) => errors.push(m);

if (!existsSync(out)) {
  console.error('check-a11y: dist/ does not exist — run the build first.');
  process.exit(1);
}

/* A real HTML page has a <!doctype html> or an <html element. Google's
 * site-verification file is named .html but is a bare token, so excluding by
 * document shape rather than by hardcoded filename keeps this correct if the
 * token is ever rotated. */
function isHtmlPage(text) {
  return /^\s*(<!doctype\s+html|<html[\s>])/i.test(text);
}

function walk(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full));
    else if (entry.endsWith('.html')) found.push(full);
  }
  return found;
}

const files = walk(out).sort();
if (!files.length) {
  console.error('check-a11y: no .html files under dist/');
  process.exit(1);
}

const pages = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (!isHtmlPage(text)) continue;
  pages.push({ file: path.relative(out, file), text });
}

if (!pages.length) {
  console.error('check-a11y: found .html files but none are real HTML documents');
  process.exit(1);
}

/* --- 1. document language --------------------------------------------
 * The prerenderer sets <html lang> from the shell. If it were dropped, a
 * screen reader would fall back to its own locale and mispronounce every
 * page, and the crawlers that map content to a language would lose the
 * signal. No-JS visitors still get this, because it is in the bytes. */
for (const { file, text } of pages) {
  const m = text.match(/<html\b([^>]*)>/i);
  if (!m) {
    fail(`${file}: no <html> element`);
    continue;
  }
  const lang = (m[1].match(/\blang\s*=\s*"([^"]*)"/i) || [])[1];
  if (lang === undefined) {
    fail(`${file}: <html> has no lang attribute — screen readers will guess the language`);
  } else if (!lang.trim()) {
    fail(`${file}: lang is empty`);
  } else if (!/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/.test(lang.trim())) {
    fail(`${file}: lang "${lang}" is not a well-formed BCP-47 tag`);
  }
}

/* --- 2. exactly one title, non-empty, unique across pages ------------
 * check-build compares <title> against og:title and JSON-LD, so it proves
 * CONSISTENCY. It never proves the title is present, non-empty, or distinct
 * between two routes — a duplicate title across routes is precisely the
 * defect that consistency checks cannot see. */
const titles = new Map();
for (const { file, text } of pages) {
  const all = [...text.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  if (all.length === 0) {
    fail(`${file}: no <title> — the page has no accessible name in the tab or history`);
    continue;
  }
  if (all.length > 1) {
    fail(`${file}: ${all.length} <title> elements, expected exactly 1`);
    continue;
  }
  const title = all[0][1].replace(/\s+/g, ' ').trim();
  if (!title) {
    fail(`${file}: <title> is empty`);
    continue;
  }
  if (titles.has(title)) {
    fail(`${file}: title "${title}" is identical to ${titles.get(title)} — two routes share one name`);
  } else {
    titles.set(title, file);
  }
}

/* --- 3. viewport, so zoom is not disabled ----------------------------
 * `user-scalable=no` or `maximum-scale=1` blocks pinch-zoom, which is a
 * WCAG 1.4.4 failure. The check is on the raw bytes, so it is meaningful
 * for a no-JS visitor as well. */
for (const { file, text } of pages) {
  const m = text.match(/<meta\b[^>]*name\s*=\s*"viewport"[^>]*>/i);
  if (!m) {
    fail(`${file}: no viewport meta — mobile browsers render it unzoomed`);
    continue;
  }
  const content = (m[0].match(/content\s*=\s*"([^"]*)"/i) || [])[1] || '';
  if (/user-scalable\s*=\s*no/i.test(content)) {
    fail(`${file}: viewport sets user-scalable=no, which blocks pinch-zoom`);
  }
  if (/maximum-scale\s*=\s*1(\.0+)?\s*(;|$)/i.test(content)) {
    fail(`${file}: viewport sets maximum-scale=1, which blocks pinch-zoom`);
  }
}

/* --- 4. no-JS content on an empty shell -------------------------------
 * Because the prerender ships <div id="root"></div> and nothing else, the
 * <noscript> block is the ONLY real content a visitor without JavaScript,
 * or a crawler that does not execute scripts, ever sees. If it disappears,
 * the page becomes literally blank and nothing in the pipeline complains —
 * the same silent-regression shape as the empty feed that check-build
 * already guards against. */
for (const { file, text } of pages) {
  const body = text.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (!body) {
    fail(`${file}: no <body> element`);
    continue;
  }
  const inner = body[1];
  /* Two legitimate shapes, both of which satisfy the requirement:
   *   a) the SPA shell — <div id="root"></div> plus a <noscript> message;
   *   b) a server-rendered static document such as 404.html, whose content
   *      is directly in <body> because there is no app to boot.
   * Requiring <noscript> on (b) would be a false positive: that page is
   * already fully readable with JavaScript disabled. Requiring content on
   * (a) is the actual rule — the two branches are the same requirement
   * ("a no-JS visitor must see something"), expressed per shape. */
  const hasNoscript =
    /<noscript\b[^>]*>[\s\S]*?\S[\s\S]*?<\/noscript>/i.test(inner);
  const hasDirectContent = inner
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '')
    .length > 0;
  if (!hasNoscript && !hasDirectContent) {
    fail(`${file}: body has neither <noscript> content nor server-rendered text — no-JS visitors get a blank page`);
  }
}

/* --- 5. skip link resolves, checked at the source ---------------------
 * App.tsx renders <a href="#main"> and <motion.main id="main">, so the
 * target only exists at runtime. This is the one landmark rule from the
 * brief that CAN be enforced without a DOM, and it fails loudly if one
 * side of the pair is renamed — the exact regression that would strand a
 * keyboard user at the top of a long page. */
{
  const appPath = path.join(root, 'src', 'app', 'App.tsx');
  if (!existsSync(appPath)) {
    fail('src/app/App.tsx is missing — cannot verify the skip-link target');
  } else {
    const app = readFileSync(appPath, 'utf8');
    const href = (app.match(/<a\b[^>]*href\s*=\s*"#([^"]*)"/) || [])[1];
    if (!href) {
      fail('App.tsx: no skip link (an <a href="#..."> is expected) — keyboard users cannot skip the header');
    } else if (!new RegExp(`id\\s*=\\s*"${href}"`).test(app)) {
      fail(`App.tsx: skip link points at #${href} but no element declares id="${href}"`);
    }
    /* The tag in source is `<motion.main>`, not `<main>`. Match the tag name at
     * the end of an optional dotted member path so the check does not depend
     * on whether a route is wrapped in an animation library. */
    if (!/<(?:[A-Za-z_$][\w$]*\.)*main\b/.test(app)) {
      fail('App.tsx: no <main> landmark — every route renders without a main region');
    }
  }
}

if (errors.length) {
  console.error(`check-a11y: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(
  `check-a11y: ok — ${pages.length} prerendered page(s) verified for lang, unique title, viewport zoom, and no-JS content.`,
);
console.log(
  'check-a11y: note — <main>, heading order, alt text and form labels are runtime-only for this SPA and are NOT covered here.',
);
