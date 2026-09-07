// ============================================================
//  YOUR DETAILS FILE — edit this to add/change anything!
//  Just type between the quotes. Save, and the site updates.
//  No other file needs touching. Empty string "" = hide it.
// ============================================================

export interface DetailItem {
  label: string;
  value: string;
}
export interface DetailSection {
  id: string;
  title: string;
  icon: string; // lucide icon name from ICONS below
  items: DetailItem[];
}
export interface TimelineEntry {
  date: string;
  title: string;
  text: string;
}
export interface FaqEntry {
  q: string;
  a: string;
}

export const DETAILS_INTRO = {
  heading: 'Everything About Me',
  subheading:
    'One page, all the details — who I am, what I do, what I use, and what I am building. Updated by me, whenever.',
};

export const ABOUT_TEXT = `Hi, I am Jay Kumar — aka JustJayDev. I am 16, from India, and I spend my time building things: Android apps, websites, and game projects. I got into tech by customizing everything I own until it works exactly how I want, and now I build tools for other people too. When I am not coding, I am gaming (Free Fire Max and FC Mobile), studying, or planning the next project.`;

export const DETAIL_SECTIONS: DetailSection[] = [
  {
    id: 'basics',
    title: 'The Basics',
    icon: 'User',
    items: [
      { label: 'Name', value: 'Jay Kumar' },
      { label: 'Alias', value: 'JustJayDev' },
      { label: 'Age', value: '16' },
      { label: 'Country', value: 'India' },
      { label: 'Status', value: 'Student + Builder' },
    ],
  },
  {
    id: 'skills',
    title: 'Skills & What I Do',
    icon: 'Code',
    items: [
      { label: 'Android apps', value: 'Building & selling tools' },
      { label: 'Web dev', value: 'React, TypeScript, this site' },
      { label: 'Game projects', value: 'HTML5 Canvas games' },
      { label: 'Device tuning', value: 'Performance optimization' },
    ],
  },
  {
    id: 'setup',
    title: 'My Setup',
    icon: 'Smartphone',
    items: [
      { label: 'Phone', value: 'realme' },
      { label: 'Tuned for', value: 'Free Fire Max, 120 FPS' },
      { label: 'Reader', value: 'Manga daily' },
      { label: 'Editor', value: 'Operit AI on-device' },
    ],
  },
  {
    id: 'gaming',
    title: 'Gaming',
    icon: 'Gamepad2',
    items: [
      { label: 'Main game', value: 'Free Fire Max' },
      { label: 'Also playing', value: 'FC Mobile' },
      { label: 'Sensitivity', value: 'Custom-tuned, 480 DPI' },
      { label: 'Style', value: 'Aggressive rusher' },
    ],
  },
  {
    id: 'projects',
    title: 'Projects & Builds',
    icon: 'Rocket',
    items: [
      { label: 'This website', value: 'React + TypeScript, hand-tuned' },
      { label: 'Asteroids game', value: 'HTML5 Canvas, in progress' },
      { label: 'FF Sensi Analyzer', value: 'Android app concept' },
      { label: 'Operit plugins', value: 'Fitness coach plugin' },
    ],
  },
  {
    id: 'links',
    title: 'Find Me Online',
    icon: 'Link',
    items: [
      { label: 'GitHub', value: 'github.com/JustJayDev' },
      { label: 'Site', value: 'justjaydev.github.io' },
    ],
  },
];

export const TIMELINE: TimelineEntry[] = [
  {
    date: 'The Start',
    title: 'First phone, first tweaks',
    text: 'Got curious about how Android really works. Started customizing everything — launchers, settings, performance flags.',
  },
  {
    date: 'Level Up',
    title: 'Learned to build, not just tweak',
    text: 'Moved from changing things to making things. First Android tools, then websites, then games.',
  },
  {
    date: 'Now',
    title: 'Building in public',
    text: 'This site is my home base. Everything I make lands here first.',
  },
];

export const FAQ: FaqEntry[] = [
  {
    q: 'How old are you?',
    a: '16. Age is just a number when it comes to shipping things.',
  },
  {
    q: 'What do you actually do?',
    a: 'I build Android apps and websites, tune devices for performance, and play way too much Free Fire Max.',
  },
  {
    q: 'Can we collaborate?',
    a: 'Sure — hit the Contact page or find me on GitHub.',
  },
  {
    q: 'How is this site made?',
    a: 'React + TypeScript + Tailwind, built with Vite, hosted free on GitHub Pages. No templates — every part is custom.',
  },
];