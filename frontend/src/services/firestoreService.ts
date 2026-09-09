import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

import { getFirebaseDb } from '../config/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  preferredLanguage: string;
  createdAt: any;
  lastLogin: any;
}

export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: any;
  userId?: string;
}

export interface AIConversation {
  id?: string;
  userId: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  createdAt: any;
  updatedAt: any;
}

export const firestoreService = {
  // ───────────── Users ─────────────

  createUserProfile: async (
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> => {
    await setDoc(doc(getFirebaseDb(), 'users', uid), {
      uid,
      name: data.name || '',
      email: data.email || '',
      role: 'user',
      preferredLanguage: data.preferredLanguage || 'en',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  },

  getUserProfile: async (
    uid: string
  ): Promise<UserProfile | null> => {
    const snap = await getDoc(
      doc(getFirebaseDb(), 'users', uid)
    );

    return snap.exists()
      ? (snap.data() as UserProfile)
      : null;
  },

  updateUserProfile: async (
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> => {
    await updateDoc(
      doc(getFirebaseDb(), 'users', uid),
      {
        ...data,
        lastLogin: serverTimestamp(),
      }
    );
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    const snap = await getDocs(
      query(
        collection(getFirebaseDb(), 'users'),
        orderBy('createdAt', 'desc')
      )
    );

    return snap.docs.map((d) => ({
      ...d.data(),
      uid: d.id,
    } as UserProfile));
  },

  // ───────────── Contact Requests ─────────────

  submitContact: async (
    data: Omit<ContactRequest, 'id' | 'status' | 'createdAt'>
  ) => {
    return addDoc(
      collection(getFirebaseDb(), 'contact_requests'),
      {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
      }
    );
  },

  getContactRequests: async (): Promise<ContactRequest[]> => {
    const snap = await getDocs(
      query(
        collection(getFirebaseDb(), 'contact_requests'),
        orderBy('createdAt', 'desc')
      )
    );

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as ContactRequest));
  },

  updateContactStatus: async (
    id: string,
    status: string
  ): Promise<void> => {
    await updateDoc(
      doc(getFirebaseDb(), 'contact_requests', id),
      {
        status,
      }
    );
  },

  // ───────────── AI Conversations ─────────────

  saveAIConversation: async (
    userId: string,
    messages: any[]
  ) => {
    return addDoc(
      collection(getFirebaseDb(), 'ai_conversations'),
      {
        userId,
        messages,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
  },

  getAIConversations: async (): Promise<AIConversation[]> => {
    const snap = await getDocs(
      query(
        collection(getFirebaseDb(), 'ai_conversations'),
        orderBy('createdAt', 'desc'),
        limit(100)
      )
    );

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as AIConversation));
  },

  // ───────────── Activity Log ─────────────

  logActivity: async (
    userId: string,
    action: string,
    details: string = ''
  ): Promise<void> => {
    try {
      await addDoc(
        collection(getFirebaseDb(), 'activity_logs'),
        {
          userId,
          action,
          details,
          createdAt: serverTimestamp(),
        }
      );
    } catch (e) {
      console.warn('Activity log failed:', e);
    }
  },
};