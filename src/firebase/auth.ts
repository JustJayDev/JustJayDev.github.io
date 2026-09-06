import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

export interface AdminUser {
  uid: string;
  email: string;
  createdAt: Date;
}

export const registerAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user: AdminUser = {
    uid: credential.user.uid,
    email: credential.user.email!,
    createdAt: new Date(),
  };
  await setDoc(doc(db, 'admins', user.uid), {
    ...user,
    createdAt: serverTimestamp(),
  });
  return user;
};

export const loginAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const docSnap = await getDoc(doc(db, 'admins', credential.user.uid));
  if (!docSnap.exists()) {
    throw new Error('Not authorized as admin');
  }
  return {
    uid: credential.user.uid,
    email: credential.user.email!,
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
  };
};

export const logoutAdmin = (): Promise<void> => signOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

export const changeAdminPassword = async (user: User, currentPassword: string, newPassword: string) => {
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};