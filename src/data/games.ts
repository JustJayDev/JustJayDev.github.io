/**
 * JustJayDev — Games data (v3).
 * 18 games: 8 main with achievements + 10 casual classics.
 *
 * Field notes:
 *  - verified: false  → card shows an "unverified — update when confirmed" note.
 *                       Flip to true once real stats are confirmed.
 *  - proofUrl         → optional link next to the `flex` claim ("proof ↗").
 *  - lastUpdated      → shown as "Updated <date>" on Now Playing cards.
 */
export interface Game {
  id: string;
  name: string;
  emoji: string;
  nowPlaying?: boolean;
  status: string;
  badges: string[];
  details: string[];
  flex?: string;
  proofUrl?: string;
  verified?: boolean;
  lastUpdated?: string;
}

export const mainGames: Game[] = [
  {
    id: 'free-fire-max',
    name: 'Free Fire Max',
    emoji: '🔥',
    nowPlaying: true,
    status: 'Main game · Rusher',
    badges: ['Grandmaster BR', 'Grandmaster CS', 'Rusher'],
    details: [
      'Highest rank: Grandmaster in both BR Ranked and CS Ranked.',
      'Role: Rusher — aggressive entry fragger, first one in.',
      'Season-by-season ranks coming soon.',
    ],
    flex: 'Defeated many YouTubers in ranked matches.',
    verified: true,
    lastUpdated: '2026-09-07',
  },
  {
    id: 'fc-mobile',
    name: 'FC Mobile',
    emoji: '⚽',
    nowPlaying: true,
    status: 'Main game · Football',
    badges: ['10★ Manager Mode', '5★ H2H', '7★ VSA', '126 OVR'],
    details: [
      'Division Rivals peaks: 10 Star Manager Mode · 5 Star H2H · 7 Star VSA.',
      'Best squad OVR: 126.',
      'Favourite card: TOTS Dembélé (Trickster) — best one.',
    ],
    verified: true,
    lastUpdated: '2026-09-07',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    emoji: '🧱',
    status: 'Grinder',
    badges: ['30M Bounty', 'V4 Max', 'Titanic Pets'],
    details: [
      'Pet Simulator 99: owned many Titanic and Huge pets (top-tier).',
      'Blox Fruits: ALL permanent fruits except mythical, Dark Blade unlocked, race V4 max, max level.',
      '30M bounty in BOTH Marines and Pirates.',
    ],
    verified: true,
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    emoji: '⛏️',
    status: 'Since 2019',
    badges: ['Ender Dragon ×4', 'Mods & Add-ons'],
    details: [
      'Completed the game (Ender Dragon) 4 times.',
      'Playing since 2019.',
      'Loves add-ons and mods — that’s why worlds get restarted instead of always finished.',
    ],
    verified: true,
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    emoji: '🛡️',
    status: 'Casual veteran',
    badges: ['Mythic tier'],
    details: [
      'Reached above Legendary — Mythic tier.',
      'Played casually; the game got boring after a while.',
    ],
    verified: true,
  },
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    emoji: '👑',
    status: 'Stats placeholder',
    badges: ['~4500+ Trophies', 'Legendary Arena', 'Fast Cycle'],
    details: [
      'Best-guess stats — editable placeholder, real numbers coming.',
      'Style: fast cycle decks.',
    ],
    verified: false,
  },
  {
    id: 'brawl-stars',
    name: 'Brawl Stars',
    emoji: '⭐',
    status: 'Stats placeholder',
    badges: ['~15000+ Trophies', 'Edgar · Crow · Spike'],
    details: [
      'Best-guess stats — editable placeholder, real numbers coming.',
      'Mains: Edgar, Crow, Spike.',
    ],
    verified: false,
  },
  {
    id: 'among-us',
    name: 'Among Us',
    emoji: '🔪',
    status: 'For fun',
    badges: ['Certified Impostor'],
    details: ['Just for fun with friends.'],
    flex: 'Certified impostor mind-gamer.',
    verified: true,
  },
];

export const casualGames: string[] = [
  'Subway Surfers',
  'Temple Run',
  'Hill Climb Racing',
  'Candy Crush',
  '8 Ball Pool',
  'Ludo King',
  'Chess',
  'Fruit Ninja',
  'Angry Birds',
  'Jetpack Joyride',
];