import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { firestoreService, UserProfile } from '../services/firestoreService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  isAdmin: boolean;
  firebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const firebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = authService.onAuthChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await firestoreService.getUserProfile(user.uid);
          setUserProfile(profile);
          await firestoreService.updateUserProfile(user.uid, {});
        } catch (e) {
          console.warn('Profile fetch failed:', e);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [firebaseConfigured]);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
  };

  const signup = async (name: string, email: string, password: string) => {
    const cred = await authService.register(email, password);
    await firestoreService.createUserProfile(cred.user.uid, { name, email });
  };

  const logout = async () => {
    await authService.logout();
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const googleSignIn = async () => {
    const cred = await authService.googleSignIn();
    const existing = await firestoreService.getUserProfile(cred.user.uid);
    if (!existing) {
      await firestoreService.createUserProfile(cred.user.uid, {
        name: cred.user.displayName || '',
        email: cred.user.email || '',
      });
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, login, signup, logout, resetPassword, googleSignIn, isAdmin, firebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
