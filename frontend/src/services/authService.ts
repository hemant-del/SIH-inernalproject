import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { getFirebaseAuth } from '../config/firebase';

export const authService = {
  register: (email: string, password: string) =>
    createUserWithEmailAndPassword(getFirebaseAuth(), email, password),

  login: (email: string, password: string) =>
    signInWithEmailAndPassword(getFirebaseAuth(), email, password),

  logout: () => signOut(getFirebaseAuth()),

  resetPassword: (email: string) =>
    sendPasswordResetEmail(getFirebaseAuth(), email),

  googleSignIn: () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(getFirebaseAuth(), provider);
  },

  onAuthChanged: (callback: (user: User | null) => void) =>
    onAuthStateChanged(getFirebaseAuth(), callback),
};