import { firestoreService } from './firestoreService';
import { collection, getCountFromServer } from 'firebase/firestore';
import { getFirebaseDb } from '../config/firebase';

export const adminService = {
  getOverview: async () => {
    try {
      const db = getFirebaseDb();

      const [users, contacts, conversations] = await Promise.all([
        getCountFromServer(collection(db, 'users')),
        getCountFromServer(collection(db, 'contact_requests')),
        getCountFromServer(collection(db, 'ai_conversations')),
      ]);

      return {
        totalUsers: users.data().count,
        totalContacts: contacts.data().count,
        totalAIConversations: conversations.data().count,
      };
    } catch (e) {
      console.warn('Admin overview fetch failed:', e);

      return {
        totalUsers: 0,
        totalContacts: 0,
        totalAIConversations: 0,
      };
    }
  },

  getUsers: () => firestoreService.getAllUsers(),

  getContactRequests: () =>
    firestoreService.getContactRequests(),

  getAIConversations: () =>
    firestoreService.getAIConversations(),

  updateContactStatus: (
    id: string,
    status: string
  ) => firestoreService.updateContactStatus(id, status),

  updateUserRole: async (
    uid: string,
    role: 'user' | 'admin'
  ) => {
    await firestoreService.updateUserProfile(uid, { role } as any);
  },
};