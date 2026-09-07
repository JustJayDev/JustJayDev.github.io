import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDEMO_CONFIGURE_YOUR_OWN",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};

// Real fix for the "site tries to talk to a fake Firebase" bug:
// if the placeholder config is still here, we skip Firebase init entirely
// and the app runs in demo mode with zero console errors.
export const isFirebaseConfigured =
  typeof firebaseConfig.projectId === 'string' &&
  firebaseConfig.projectId.length > 0 &&
  !/^(your-project|demo|todo|change_)/i.test(firebaseConfig.projectId) &&
  !/DEMO/i.test(firebaseConfig.apiKey || '');

let app: ReturnType<typeof initializeApp> | undefined;
let auth: ReturnType<typeof getAuth> | undefined;
let db: ReturnType<typeof getFirestore> | undefined;
let storage: ReturnType<typeof getStorage> | undefined;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // eslint-disable-next-line no-console
  console.info('[JustJayDev] Firebase not configured yet - running in demo mode.');
}

/** Guards: throw a friendly error instead of crashing with `undefined` in demo mode. */
export const requireAuth = (): ReturnType<typeof getAuth> => {
  if (!auth) throw new Error('Firebase is not configured yet (demo mode). Add your keys in src/firebase/config.ts.');
  return auth;
};

export const requireDb = (): ReturnType<typeof getFirestore> => {
  if (!db) throw new Error('Firebase is not configured yet (demo mode). Add your keys in src/firebase/config.ts.');
  return db;
};

export const requireStorage = (): ReturnType<typeof getStorage> => {
  if (!storage) throw new Error('Firebase is not configured yet (demo mode). Add your keys in src/firebase/config.ts.');
  return storage;
};

export { app, auth, db, storage };
export default app;
