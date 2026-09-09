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
import { auth } from '../config/firebase';

export const authService = {
  register: (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password),

  login: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password),

  logout: () => signOut(auth),

  resetPassword: (email: string) => sendPasswordResetEmail(auth, email),

  googleSignIn: () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  },

  onAuthChanged: (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback),
};
