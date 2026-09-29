/** Content types. Every field is validated at build time by scripts/validate-content.mjs */

export interface Game {
  id: string;
  name: string;
  /** Artwork. Only the nine main games have real captures; casual classics
   *  are deliberately artless, and the UI renders a typographic card instead. */
  image?: string;
  nowPlaying?: boolean;
  status: string;
  badges: string[];
  details: string[];
  flex?: string;
  verified?: boolean;
  lastUpdated?: string;
  hasProfile?: boolean;
  profileRows?: { label: string; value: string }[];
  accent: string;
  category: 'main' | 'casual';
}

export interface Social {
  label: string;
  handle: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  detail: string;
  url: string;
  repo: string;
  status: 'live' | 'experimental' | 'wip';
  stack: string[];
  highlights: string[];
}

export interface Achievement {
  icon: string;
  title: string;
  detail: string;
  tag: 'rank' | 'collection' | 'creator' | 'build';
}

export interface DevlogEntry {
  slug: string;
  date: string;
  project: 'site' | 'titleforge' | 'pixvault' | 'vault';
  version: string;
  title: string;
  excerpt: string;
  body: string[];
}
