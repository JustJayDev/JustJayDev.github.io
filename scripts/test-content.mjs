#!/usr/bin/env node
/* Content-derivation tests. Zero new dependencies: node:test plus the esbuild
 * already present in devDependencies (the same loader validate-content.mjs uses).
 *
 * Run: npm test
 *
 * SCOPE — deliberately narrow. scripts/validate-content.mjs already gates on
 * field presence, unique ids, image paths, https:// URLs and devlog date order,
 * and it runs in the production build. Re-testing any of that here would add
 * runtime without adding signal. This suite covers only the derived views in
 * site.ts/games.ts/devlog.ts — the numbers and partitions that would silently
 * drift from the source arrays and that no build step currently cross-checks.
 *
 * Not covered, by design: React component rendering and a11y. Those need
 * Vitest + Testing Library, deferred until a machine can install packages.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Compile the real TypeScript content modules and import the result, so these
   tests assert against the same exports the app and the build gate use. */
async function loadContent() {
  const tmp = path.join(root, 'node_modules', '.cache', 'content-test.mjs');
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
const { games, mainGames, casualGames, nowPlaying, gameById, stats, devlog, projectLabels } = c;

/* --- stats are derived, never typed: they must match the arrays --- */

test('stats.gamesPlayed matches games.length', () => {
  assert.equal(stats.gamesPlayed, games.length);
});

test('stats.mainGames matches mainGames.length', () => {
  assert.equal(stats.mainGames, mainGames.length);
});

test('stats.casualGames matches casualGames.length', () => {
  assert.equal(stats.casualGames, casualGames.length);
});

test('stats.grindingNow matches nowPlaying.length', () => {
  assert.equal(stats.grindingNow, nowPlaying.length);
});

test('stats.projects and stats.devlogEntries match their arrays', () => {
  assert.equal(stats.projects, c.projects.length);
  assert.equal(stats.devlogEntries, devlog.length);
});

test('mainGames + casualGames accounts for every game exactly once', () => {
  assert.equal(mainGames.length + casualGames.length, games.length,
    'a game is neither main nor casual, or is counted twice');
});

test('mainGames and casualGames are disjoint and correctly filtered', () => {
  const mainIds = new Set(mainGames.map((g) => g.id));
  const casualIds = new Set(casualGames.map((g) => g.id));
  for (const g of mainGames) assert.equal(g.category, 'main', `${g.id} is in mainGames but not category main`);
  for (const g of casualGames) assert.equal(g.category, 'casual', `${g.id} is in casualGames but not category casual`);
  for (const id of mainIds) assert.ok(!casualIds.has(id), `${id} appears in both partitions`);
});

test('every category in games is main or casual', () => {
  for (const g of games) {
    assert.ok(g.category === 'main' || g.category === 'casual',
      `${g.id} has category "${g.category}"`);
  }
});

/* --- nowPlaying is a true subset, and only main games grind --- */

test('nowPlaying is a subset of games with the nowPlaying flag', () => {
  for (const g of nowPlaying) {
    assert.ok(g.nowPlaying === true, `${g.id} is in nowPlaying without the flag`);
    assert.ok(games.includes(g), `${g.id} is in nowPlaying but not in games`);
  }
});

test('nowPlaying only contains main games', () => {
  for (const g of nowPlaying) {
    assert.equal(g.category, 'main', `${g.id} is casual but marked nowPlaying`);
  }
});

/* --- gameById: the lookup every route and the sitemap depends on --- */

test('gameById returns the same object for every id in games', () => {
  for (const g of games) {
    assert.equal(gameById(g.id), g, `gameById("${g.id}") did not return the game itself`);
  }
});

test('gameById returns undefined for an id that does not exist', () => {
  assert.equal(gameById('no-such-game'), undefined);
  assert.equal(gameById(''), undefined);
});

test('gameById does not match on a partial id', () => {
  const first = games[0];
  if (first && first.id.length > 3) {
    assert.equal(gameById(first.id.slice(0, 3)), undefined,
      'gameById matched a prefix, which would serve the wrong game');
  }
});

/* --- projectLabels must cover every project value used in the devlog --- */

test('projectLabels covers every project value used in the devlog', () => {
  for (const e of devlog) {
    assert.ok(Object.hasOwn(projectLabels, e.project),
      `projectLabels has no entry for "${e.project}" (devlog/${e.slug})`);
  }
});

test('every projectLabel is a non-empty string', () => {
  for (const [key, label] of Object.entries(projectLabels)) {
    assert.equal(typeof label, 'string', `projectLabels.${key} is not a string`);
    assert.ok(label.trim().length > 0, `projectLabels.${key} is empty`);
  }
});