import { firestoreService } from './firestoreService';

export const contactService = {
  submit: async (data: { name: string; email: string; phone: string; subject: string; message: string; userId?: string }) => {
    // Save to Firestore (primary)
    await firestoreService.submitContact(data);

    // Also try backend (secondary, for offline/fallback)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Backend submission is secondary; Firestore is primary
    }
  },
};
