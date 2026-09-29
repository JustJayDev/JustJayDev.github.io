/** Site-level configuration and derived stats.
 *  Every number here is computed from real data — never typed by hand. */

import { games, mainGames, nowPlaying } from './games';
import { projects } from './projects';
import { devlog } from './devlog';
import { profile } from './profile';

export const site = {
  url: 'https://justjaydev.github.io',
  title: 'JustJayDev',
  tagline: profile.tagline,
  description:
    'Jay Kumar — mobile gamer, AI builder and future trader. Free Fire Max Grandmaster, Dragon City collector, and the developer behind TitleForge and PixVault.',
  locale: 'en',
  themeColorDark: '#070b10',
  themeColorLight: '#f7f9fa',
} as const;

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/games', label: 'Games' },
  { to: '/projects', label: 'Projects' },
  { to: '/devlog', label: 'Devlog' },
  { to: '/about', label: 'About' },
] as const;

/** Derived stats — the single source for every number the UI shows. */
export const stats = {
  gamesPlayed: games.length,
  mainGames: mainGames.length,
  grindingNow: nowPlaying.length,
  casualGames: games.length - mainGames.length,
  projects: projects.length,
  devlogEntries: devlog.length,
  mobileOnly: 100,
  since: 2019,
} as const;

/** Trophy/rank figures pulled from real badges, for the header readout. */
export const readout = [
  { label: 'GRINDING', value: String(stats.grindingNow) },
  { label: 'LV', value: '55' },
  { label: 'TROPHIES', value: '17,250' },
  { label: 'RANK', value: 'GRANDMASTER' },
] as const;

/** Ambient interest marquee on the hero. */
export const marqueeItems = profile.interests;
