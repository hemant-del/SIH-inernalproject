import { firestoreService } from './firestoreService';
import { API_BASE } from './api';

export const contactService = {
  submit: async (data: { name: string; email: string; phone: string; subject: string; message: string; userId?: string }) => {
    let firestoreSuccess = false;

    // Try Firestore if configured
    try {
      await firestoreService.submitContact(data);
      firestoreSuccess = true;
    } catch (e) {
      console.warn('Firestore submission failed or not configured, falling back to backend API:', e);
    }

    // Try backend API
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok && !firestoreSuccess) {
        throw new Error(`Backend contact submission failed: ${res.status}`);
      }
    } catch (err) {
      if (!firestoreSuccess) {
        throw err;
      }
    }
  },
};
