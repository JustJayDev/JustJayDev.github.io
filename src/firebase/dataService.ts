import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import type {
  Profile,
  Game,
  SocialLink,
  EsportsRecord,
  SupportRequest,
  ArchiveItem,
  AnalyticsData,
  SiteSettings,
} from '@/types';

const PROFILE_DOC = 'profile';
const GAMES_COL = 'games';
const SOCIAL_COL = 'social_links';
const ESPORTS_COL = 'esports_records';
const SUPPORT_COL = 'support_requests';
const ARCHIVE_COL = 'archive_items';
const SETTINGS_DOC = 'settings';
const ANALYTICS_DOC = 'analytics';

// --- Profile ---
export const getProfile = async (): Promise<Profile | null> => {
  const snap = await getDoc(doc(db, PROFILE_DOC, 'main'));
  return snap.exists() ? (snap.data() as Profile) : null;
};

export const saveProfile = async (data: Partial<Profile>): Promise<void> => {
  await setDoc(doc(db, PROFILE_DOC, 'main'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

// --- Games ---
export const getGames = async (): Promise<Game[]> => {
  const q = query(collection(db, GAMES_COL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Game));
};

export const saveGame = async (game: Partial<Game> & { id?: string }): Promise<string> => {
  const id = game.id || crypto.randomUUID();
  await setDoc(doc(db, GAMES_COL, id), {
    ...game,
    id,
    updatedAt: serverTimestamp(),
    createdAt: game.createdAt || Date.now(),
  }, { merge: true });
  return id;
};

export const deleteGame = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, GAMES_COL, id));
};

// --- Social Links ---
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const q = query(collection(db, SOCIAL_COL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SocialLink));
};

export const saveSocialLink = async (link: Partial<SocialLink> & { id?: string }): Promise<string> => {
  const id = link.id || crypto.randomUUID();
  await setDoc(doc(db, SOCIAL_COL, id), { ...link, id }, { merge: true });
  return id;
};

export const deleteSocialLink = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, SOCIAL_COL, id));
};

// --- Esports ---
export const getEsportsRecords = async (): Promise<EsportsRecord[]> => {
  const q = query(collection(db, ESPORTS_COL), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EsportsRecord));
};

export const saveEsportsRecord = async (record: Partial<EsportsRecord> & { id?: string }): Promise<string> => {
  const id = record.id || crypto.randomUUID();
  await setDoc(doc(db, ESPORTS_COL, id), { ...record, id }, { merge: true });
  return id;
};

export const deleteEsportsRecord = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, ESPORTS_COL, id));
};

// --- Support Requests ---
export const getSupportRequests = async (): Promise<SupportRequest[]> => {
  const q = query(collection(db, SUPPORT_COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
    } as SupportRequest;
  });
};

export const submitSupportRequest = async (data: Omit<SupportRequest, 'id' | 'status' | 'createdAt'>): Promise<void> => {
  await setDoc(doc(db, SUPPORT_COL, crypto.randomUUID()), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const updateSupportRequestStatus = async (
  id: string,
  status: SupportRequest['status']
): Promise<void> => {
  await updateDoc(doc(db, SUPPORT_COL, id), {
    status,
    reviewedAt: serverTimestamp(),
  });
};

// --- Archive ---
export const getArchiveItems = async (): Promise<ArchiveItem[]> => {
  const q = query(collection(db, ARCHIVE_COL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ArchiveItem));
};

export const saveArchiveItem = async (item: Partial<ArchiveItem> & { id?: string }): Promise<string> => {
  const id = item.id || crypto.randomUUID();
  await setDoc(doc(db, ARCHIVE_COL, id), { ...item, id }, { merge: true });
  return id;
};

export const deleteArchiveItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, ARCHIVE_COL, id));
};

// --- Settings ---
export const getSettings = async (): Promise<SiteSettings | null> => {
  const snap = await getDoc(doc(db, SETTINGS_DOC, 'main'));
  return snap.exists() ? (snap.data() as SiteSettings) : null;
};

export const saveSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  await setDoc(doc(db, SETTINGS_DOC, 'main'), data, { merge: true });
};

// --- Analytics ---
export const trackVisit = async (section: string, device: string, referrer: string): Promise<void> => {
  try {
    const ref = doc(db, ANALYTICS_DOC, 'stats');
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as AnalyticsData) : getDefaultAnalytics();
    data.totalVisitors = (data.totalVisitors || 0) + 1;
    data.sectionViews = { ...data.sectionViews, [section]: (data.sectionViews[section] || 0) + 1 };
    data.deviceCategories = { ...data.deviceCategories, [device]: (data.deviceCategories[device] || 0) + 1 };
    if (referrer) {
      data.referrers = { ...data.referrers, [referrer]: (data.referrers[referrer] || 0) + 1 };
    }
    const today = new Date().toISOString().split('T')[0];
    data.dailyVisitors = { ...data.dailyVisitors, [today]: (data.dailyVisitors[today] || 0) + 1 };
    await setDoc(ref, data);
  } catch {
    // silently fail analytics
  }
};

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const snap = await getDoc(doc(db, ANALYTICS_DOC, 'stats'));
  return snap.exists() ? (snap.data() as AnalyticsData) : getDefaultAnalytics();
};

const getDefaultAnalytics = (): AnalyticsData => ({
  totalVisitors: 0,
  sectionViews: {},
  deviceCategories: {},
  referrers: {},
  dailyVisitors: {},
});

// --- File Upload ---
export const uploadFile = async (path: string, file: File): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};