import { useState, useEffect, useCallback } from 'react';
import * as dataService from '@/firebase/dataService';
import { isFirebaseConfigured } from '@/firebase/config';
import type { Profile, Game, SocialLink, EsportsRecord, ArchiveItem, AnalyticsData, SiteSettings } from '@/types';

// Demo data for when Firebase is not configured yet
const DEMO_PROFILE: Profile = {
  id: 'demo',
  displayName: 'Jay Kumar',
  brandName: 'JustJayDev',
  tagline: 'Gamer • Creator • Builder',
  bio: 'Passionate gamer, app developer, and digital creator. Building things that matter.',
  interests: ['Gaming', 'Coding', 'App Development', 'Esports'],
  goals: ['Ship great apps', 'Grow in esports', 'Keep creating'],
  roles: ['Gamer', 'Creator', 'Builder'],
  avatarUrl: '',
  digitalId: 'JJDEV-001',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const DEMO_GAMES: Game[] = [
  {
    id: '1',
    name: 'Free Fire MAX',
    icon: '🎮',
    username: 'NeonNova X',
    uid: 'GODEX',
    server: 'India',
    currentRank: '[Edit in admin]',
    highestRank: '[Edit in admin]',
    kd: '[Edit in admin]',
    winRate: '[Edit in admin]',
    playstyle: '[Edit in admin]',
    achievements: [],
    team: 'None',
    externalUrl: '',
    visibility: 'public',
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: 'BGMI',
    icon: '🎯',
    username: '',
    uid: '',
    server: 'Asia',
    currentRank: '',
    highestRank: '',
    kd: '',
    winRate: '',
    playstyle: '',
    achievements: [],
    team: '',
    externalUrl: '',
    // hidden from the public site until real stats are filled in via Admin
    visibility: 'hidden',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    name: 'FC Mobile',
    icon: '⚽',
    username: '',
    uid: '',
    server: 'Global',
    currentRank: '',
    highestRank: '',
    kd: '',
    winRate: '',
    playstyle: '',
    achievements: [],
    team: '',
    externalUrl: '',
    // hidden from the public site until real stats are filled in via Admin
    visibility: 'hidden',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const DEMO_SOCIAL: SocialLink[] = [
  { id: '1', platform: 'github', username: 'JustJayDev', url: 'https://github.com/JustJayDev', visibility: 'public', order: 0 },
];

const DEMO_ARCHIVE: ArchiveItem[] = [
  { id: '1', title: 'Welcome', content: 'This is the archive. Something cool is hidden here...', type: 'lore', visibility: 'hidden', order: 0 },
];

const DEMO_SETTINGS: SiteSettings = {
  canonicalUrl: 'https://JustJayDev.github.io/',
  esportsPasswordHash: '',
  maintenanceMode: false,
  analyticsEnabled: true,
};

const useDemoMode = () => {
  // Demo mode = Firebase keys not configured (or demo flag forced via window.__JJDEV_DEMO__).
  // Initialize synchronously so pages render demo data instantly with zero thrown errors.
  const [isDemo, setIsDemo] = useState(() => {
    const forced = (window as any).__JJDEV_DEMO__;
    return forced === true || forced === 'true' || !isFirebaseConfigured;
  });
  useEffect(() => {
    const forced = (window as any).__JJDEV_DEMO__;
    setIsDemo(forced === true || forced === 'true' || !isFirebaseConfigured);
  }, []);
  return isDemo;
};

export const useProfile = () => {
  const isDemo = useDemoMode();
  const [profile, setProfile] = useState<Profile | null>(isDemo ? DEMO_PROFILE : null);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isDemo) { setProfile(DEMO_PROFILE); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getProfile();
      setProfile(data || DEMO_PROFILE);
    } catch (e: any) {
      setError(e.message);
      setProfile(DEMO_PROFILE);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return { profile, loading, error, refresh, saveProfile: dataService.saveProfile };
};

export const useGames = () => {
  const isDemo = useDemoMode();
  const [games, setGames] = useState<Game[]>(isDemo ? DEMO_GAMES : []);
  const [loading, setLoading] = useState(!isDemo);

  const refresh = useCallback(async () => {
    if (isDemo) { setGames(DEMO_GAMES); return; }
    setLoading(true);
    try {
      const data = await dataService.getGames();
      setGames(data.length > 0 ? data : DEMO_GAMES);
    } catch {
      setGames(DEMO_GAMES);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return { games, loading, refresh, saveGame: dataService.saveGame, deleteGame: dataService.deleteGame };
};

export const useSocialLinks = () => {
  const isDemo = useDemoMode();
  const [links, setLinks] = useState<SocialLink[]>(isDemo ? DEMO_SOCIAL : []);
  const [loading, setLoading] = useState(!isDemo);

  const refresh = useCallback(async () => {
    if (isDemo) { setLinks(DEMO_SOCIAL); return; }
    setLoading(true);
    try {
      const data = await dataService.getSocialLinks();
      setLinks(data.length > 0 ? data : DEMO_SOCIAL);
    } catch {
      setLinks(DEMO_SOCIAL);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return { links, loading, refresh, saveLink: dataService.saveSocialLink, deleteLink: dataService.deleteSocialLink };
};

export const useEsportsRecords = () => {
  const isDemo = useDemoMode();
  const [records, setRecords] = useState<EsportsRecord[]>([]);
  const [loading, setLoading] = useState(!isDemo);

  const refresh = useCallback(async () => {
    if (isDemo) { setRecords([]); return; }
    setLoading(true);
    try {
      const data = await dataService.getEsportsRecords();
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return { records, loading, refresh, saveRecord: dataService.saveEsportsRecord, deleteRecord: dataService.deleteEsportsRecord };
};

export const useArchive = () => {
  const isDemo = useDemoMode();
  const [items, setItems] = useState<ArchiveItem[]>(isDemo ? DEMO_ARCHIVE : []);
  const [loading, setLoading] = useState(!isDemo);

  const refresh = useCallback(async () => {
    if (isDemo) { setItems(DEMO_ARCHIVE); return; }
    setLoading(true);
    try {
      const data = await dataService.getArchiveItems();
      setItems(data.length > 0 ? data : DEMO_ARCHIVE);
    } catch {
      setItems(DEMO_ARCHIVE);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return { items, loading, refresh, saveItem: dataService.saveArchiveItem, deleteItem: dataService.deleteArchiveItem };
};

export const useSettings = () => {
  const isDemo = useDemoMode();
  const [settings, setSettings] = useState<SiteSettings | null>(isDemo ? DEMO_SETTINGS : null);
  const [loading, setLoading] = useState(!isDemo);

  const refresh = useCallback(async () => {
    if (isDemo) { setSettings(DEMO_SETTINGS); return; }
    setLoading(true);
    try {
      const data = await dataService.getSettings();
      setSettings(data || DEMO_SETTINGS);
    } catch {
      setSettings(DEMO_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return { settings, loading, refresh, saveSettings: dataService.saveSettings };
};

export const useAnalytics = () => {
  const isDemo = useDemoMode();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(!isDemo);

  const refresh = useCallback(async () => {
    if (isDemo) { setAnalytics(null); return; }
    setLoading(true);
    try {
      const data = await dataService.getAnalytics();
      setAnalytics(data);
    } catch {
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return { analytics, loading, refresh };
};

export const useSupportRequests = () => {
  const isDemo = useDemoMode();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isDemo);

  const refresh = useCallback(async () => {
    if (isDemo) { setRequests([]); return; }
    setLoading(true);
    try {
      const data = await dataService.getSupportRequests();
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    requests,
    loading,
    refresh,
    submitRequest: dataService.submitSupportRequest,
    updateStatus: dataService.updateSupportRequestStatus,
  };
};