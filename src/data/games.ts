/**
 * JustJayDev ALT — Games data.
 * Same content as the main site, restructured for the neon-cyber UI.
 */
export interface Game {
  id: string;
  name: string;
  icon: string;
  image?: string;
  nowPlaying?: boolean;
  status: string;
  badges: string[];
  details: string[];
  flex?: string;
  verified?: boolean;
  lastUpdated?: string;
  profile?: boolean;
  profileRows?: { label: string; value: string }[];
  accent: string; // neon accent for the card
}

export const mainGames: Game[] = [
  {
    id: 'free-fire-max',
    name: 'Free Fire Max',
    icon: 'Flame',
    image: '/games/freefire.svg',
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
    profile: true,
    profileRows: [
      { label: 'IGN', value: 'JustJayDev' },
      { label: 'Server', value: 'India' },
      { label: 'BR Rank', value: 'Grandmaster' },
      { label: 'CS Rank', value: 'Grandmaster' },
      { label: 'Role', value: 'Rusher' },
      { label: 'Device', value: 'realme 9 Pro 5G · 480 DPI' },
    ],
    accent: '#ff4d4d',
  },
  {
    id: 'fc-mobile',
    name: 'FC Mobile',
    icon: 'Trophy',
    image: '/games/fcmobile.svg',
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
    profile: true,
    profileRows: [
      { label: 'Manager Mode', value: '10★' },
      { label: 'H2H', value: '5★' },
      { label: 'VSA', value: '7★' },
      { label: 'Best OVR', value: '126' },
      { label: 'Fav Card', value: 'TOTS Dembélé' },
    ],
    accent: '#4de1ff',
  },
  {
    id: 'dragon-city',
    name: 'Dragon City',
    icon: 'Egg',
    image: '/games/dragoncity.svg',
    nowPlaying: true,
    status: 'Main game · Dragon collector',
    badges: ['Lv 55', '163/2217 Dragonbook', 'SHURA GOD', '161 Unique Dragons'],
    details: [
      'Level 55 — account linked, breeding and feeding daily.',
      'Dragonbook: 163 of 2217 dragons collected.',
      'Alliance: SHURA GOD — 19,217 total trophies · 2,009 master points.',
      'Top dragon: High Famine Dragon (Lv 45) — High Reborn, Terra Titan, Skullface, Pixel & High Zephyr all at Lv 40.',
      'Collection spans High-tier, Zodiac (Gemini · Virgo · Capricorn), Pure and event legendaries like Independence Day & Trick or Treat dragons.',
    ],
    flex: '161 unique dragons — including High-tier and Zodiac legendaries most players never hatch.',
    verified: true,
    lastUpdated: '2026-09-08',
    profile: true,
    accent: '#ffd24d',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    icon: 'Blocks',
    image: '/games/roblox.svg',
    status: 'Grinder',
    badges: ['30M Bounty', 'V4 Max', 'Titanic Pets'],
    details: [
      'Pet Simulator 99: owned many Titanic and Huge pets (top-tier).',
      'Blox Fruits: ALL permanent fruits except mythical, Dark Blade unlocked, race V4 max, max level.',
      '30M bounty in BOTH Marines and Pirates.',
    ],
    verified: true,
    profile: true,
    profileRows: [
      { label: 'Bounty', value: '30M (Marines + Pirates)' },
      { label: 'Race', value: 'V4 Max' },
      { label: 'Fruits', value: 'All permanent (excl. mythical)' },
      { label: 'Dark Blade', value: 'Unlocked' },
      { label: 'Pets', value: 'Titanic & Huge' },
    ],
    accent: '#9d4dff',
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    icon: 'Pickaxe',
    image: '/games/minecraft.svg',
    status: 'Since 2019',
    badges: ['Ender Dragon ×4', 'Mods & Add-ons'],
    details: [
      'Completed the game (Ender Dragon) 4 times.',
      'Playing since 2019.',
      'Loves add-ons and mods — that’s why worlds get restarted instead of always finished.',
    ],
    verified: true,
    accent: '#4dff7d',
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    icon: 'Swords',
    image: '/games/mlbb.svg',
    status: 'Casual veteran',
    badges: ['Mythic tier'],
    details: [
      'Reached above Legendary — Mythic tier.',
      'Played casually; the game got boring after a while.',
    ],
    verified: true,
    accent: '#4d7dff',
  },
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    icon: 'Crown',
    image: '/games/clashroyale.svg',
    status: 'Ladder grinder',
    badges: ['6,840 Trophies', 'Ultimate Champion', 'Fast Cycle'],
    details: [
      'Best rank: Ultimate Champion in Path of Legends.',
      'Peak trophies: 6,840 (Grand Champion arena range).',
      'Style: fast cycle decks — cheap wins, constant pressure.',
    ],
    verified: true,
    lastUpdated: '2026-09-18',
    accent: '#ff4dd2',
  },
  {
    id: 'brawl-stars',
    name: 'Brawl Stars',
    icon: 'Star',
    image: '/games/brawlstars.svg',
    status: 'Casual ranked',
    badges: ['17,250 Trophies', 'Masters I', 'Edgar · Crow · Spike'],
    details: [
      'Total trophies: 17,250 across all brawlers.',
      'Ranked: Masters I in Ranked Mode.',
      'Mains: Edgar, Crow, Spike — all at high power levels.',
    ],
    verified: true,
    lastUpdated: '2026-09-18',
    accent: '#ffd24d',
  },
  {
    id: 'among-us',
    name: 'Among Us',
    icon: 'Ghost',
    image: '/games/amongus.svg',
    status: 'For fun',
    badges: ['Certified Impostor'],
    details: ['Just for fun with friends.'],
    flex: 'Certified impostor mind-gamer.',
    verified: true,
    accent: '#4dfff0',
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
