export interface Profile {
  id: string;
  displayName: string;
  brandName: string;
  tagline: string;
  bio: string;
  interests: string[];
  goals: string[];
  roles: string[];
  avatarUrl: string;
  digitalId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  username: string;
  uid: string;
  server: string;
  currentRank: string;
  highestRank: string;
  kd: string;
  winRate: string;
  playstyle: string;
  achievements: string[];
  team: string;
  externalUrl: string;
  visibility: 'public' | 'hidden';
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface SocialLink {
  id: string;
  platform: 'youtube' | 'discord' | 'instagram' | 'x' | 'reddit' | 'github' | 'twitter';
  username: string;
  url: string;
  visibility: 'public' | 'hidden';
  order: number;
}

export interface EsportsRecord {
  id: string;
  title: string;
  game: string;
  placement: string;
  date: string;
  prize: string;
  team: string;
  description: string;
  proofUrl: string;
}

export interface SupportRequest {
  id: string;
  amount: string;
  message: string;
  qrImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  reviewedAt?: number;
}

export interface ArchiveItem {
  id: string;
  title: string;
  content: string;
  type: 'achievement' | 'message' | 'experiment' | 'lore' | 'easter_egg';
  visibility: 'public' | 'hidden';
  order: number;
}

export interface AnalyticsData {
  totalVisitors: number;
  sectionViews: Record<string, number>;
  deviceCategories: Record<string, number>;
  referrers: Record<string, number>;
  dailyVisitors: Record<string, number>;
}

export interface SiteSettings {
  canonicalUrl: string;
  esportsPasswordHash: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
}

export interface EsportsProfile {
  isLocked: boolean;
  displayName: string;
  game: string;
  role: string;
  achievements: EsportsRecord[];
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type PageSection = 'home' | 'about' | 'gaming' | 'esports' | 'social' | 'contact' | 'support' | 'archive';