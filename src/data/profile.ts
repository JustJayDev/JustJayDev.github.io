/**
 * JustJayDev — master profile data.
 *
 * Content model for the v6 "Observatory" front page. The depth here is
 * deliberate: the v5 page was visually thin *and* factually thin, and no
 * redesign can compensate for an empty page. Every number is real.
 */
export interface Achievement {
  id: string;
  icon: string;
  title: string;
  detail: string;
  tag: string;
}

export const profile = {
  name: 'Jay Kumar',
  handle: 'JustJayDev',
  github: 'https://github.com/JustJayDev',
  site: 'https://justjaydev.github.io/',
  tagline: 'Mobile gamer. Builder. Future trader.',
  bio: 'I build apps, websites and games with AI, I grind Free Fire Max as a rusher, and I’m learning paper trading. Pure mobile player — everything I make, I make on my phone.',
  location: 'India',
  heroImage: './jay-hero.jpg',

  /** what the hero badge cycles through */
  rotating: [
    'Mobile gamer.',
    'Builder.',
    'Future trader.',
    'AI-assisted dev.',
    'Solo Grandmaster push.',
  ],

  chips: [
    'Builder',
    'Mobile gamer',
    'Paper trading',
    'Anime & donghua',
    'Manhua & manhwa',
    'Football',
    'AI-assisted dev',
    'Shipped from a phone',
  ],

  footballers: ['Cristiano Ronaldo', 'Son Heung-min', 'Maldini', 'Cafu', 'Dybala'],
  clubs: ['Real Madrid', 'Tottenham Hotspur', 'Juventus'],

  setup: {
    phone: 'realme 9 Pro 5G',
    chipset: 'Snapdragon 695 5G · Adreno 619',
    display: '6.6" FHD+ · 120Hz · HDR10+',
    tuning: '480 DPI locked for max control',
    ram: '6 GB',
    storage: '105 GB',
    extra: 'Tuned for smooth high-FPS Free Fire Max',
  },

  /** what is happening on the console right now */
  nowGrinding: {
    game: 'Free Fire Max',
    goal: 'Solo Grandmaster push',
    mode: 'Ranked · Solo',
    note: 'Rusher entry, pushed after every scrim session.',
  },

  socials: [
    { label: 'GitHub', url: 'https://github.com/JustJayDev', live: true },
    {
      label: 'YouTube',
      url: 'https://www.youtube.com/@neonnovaxplays',
      live: true,
      handle: '@neonnovaxplays',
    },
    {
      label: 'Instagram',
      url: 'https://instagram.com/jaykumar152010',
      live: true,
      handle: '@jaykumar152010',
    },
    {
      label: 'Threads',
      url: 'https://www.threads.net/@jaykumar20100',
      live: true,
      handle: '@jaykumar20100',
    },
    {
      label: 'Discord',
      url: 'https://discord.com/users/D2j4SxW8',
      live: true,
      handle: 'D2j4SxW8',
    },
    {
      label: 'Reddit',
      url: 'https://reddit.com/user/Melodic-Control8287',
      live: true,
      handle: 'u/Melodic-Control8287',
    },
  ],

  email: 'coming soon — dedicated email on the way',
};

/** Real milestones, not filler. Shown as achievement tiles on the front page. */
export const achievements: Achievement[] = [
  {
    id: 'ffmx-gm',
    icon: '👑',
    title: 'Grandmaster — Free Fire MAX',
    detail: 'Solo Grandmaster in ranked, S49 peak season.',
    tag: 'Rank',
  },
  {
    id: 'dragons',
    icon: '🐉',
    title: '161 dragons',
    detail: 'Rare-event dragons collected across every pass.',
    tag: 'Collection',
  },
  {
    id: 'fcm-ovr',
    icon: '⚽',
    title: 'FC Mobile 116 / 117 OVR',
    detail: 'Max OVR pulls on the mobile ladder.',
    tag: 'Pull',
  },
  {
    id: 'creator',
    icon: '🎬',
    title: '100% mobile creator',
    detail: '88 videos produced entirely on a phone.',
    tag: 'Creator',
  },
  {
    id: 'cr-trophies',
    icon: '🏆',
    title: '6,840 CR trophies',
    detail: 'Clash Royale ladder — 6,840 trophies banked.',
    tag: 'Clash',
  },
  {
    id: 'bs-trophies',
    icon: '⭐',
    title: '17,250 BS trophies',
    detail: 'Brawl Stars trophy count.',
    tag: 'Brawl',
  },
  {
    id: 'neonnova',
    icon: '📺',
    title: '88 videos · 82 subs',
    detail: 'NeonNova X channel — 88 uploads to date.',
    tag: 'Channel',
  },
  {
    id: 'alliance',
    icon: '🛡️',
    title: '19,217 alliance trophies',
    detail: 'Contributed to a top-10 ranked alliance.',
    tag: 'Alliance',
  },
];

/** Headline instrument readings. Every number here is real. */
export const readouts = [
  { value: 19, suffix: '+', label: 'games played' },
  { value: 88, suffix: '', label: 'videos made' },
  { value: 8, suffix: '', label: 'milestones' },
  { value: 100, suffix: '%', label: 'built on a phone' },
];