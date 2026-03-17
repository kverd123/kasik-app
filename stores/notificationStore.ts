/**
 * Kasik — Notification Preferences Store (Zustand)
 * Manages notification preferences and scheduled notification sync
 */

import { create } from 'zustand';
import {
  NotificationPreferences,
  getNotificationPreferences,
  saveNotificationPreferences,
  applyNotificationPreferences,
  scheduleMealReminder,
  scheduleAllergenCheck,
} from '../lib/notifications';

interface NotificationStoreState {
  preferences: NotificationPreferences;
  isLoaded: boolean;
  isInitialized: boolean;

  // Actions
  loadFromStorage: () => Promise<void>;
  updatePreference: (key: keyof NotificationPreferences, value: boolean, babyName?: string) => Promise<void>;
  setAllPreferences: (enabled: boolean, babyName?: string) => Promise<void>;
  initializeNotifications: (babyName: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  preferences: {
    mealReminders: true,
    allergenTracking: true,
    weeklySummary: true,
    communityUpdates: true,
    aiSuggestions: true,
    promotions: false,
  },
  isLoaded: false,
  isInitialized: false,

  loadFromStorage: async () => {
    try {
      const prefs = await getNotificationPreferences();
      set({ preferences: prefs, isLoaded: true });
    } catch (e) {
      console.error('Bildirim tercihleri yuklenemedi:', e);
      set({ isLoaded: true });
    }
  },

  updatePreference: async (key, value, babyName) => {
    const { preferences } = get();
    const updated = { ...preferences, [key]: value };
    set({ preferences: updated });

    try {
      await saveNotificationPreferences(updated);
      // Zamanlanmis bildirimleri yeniden ayarla
      if (babyName) {
        await applyNotificationPreferences(updated, babyName);
      }
    } catch (e) {
      console.error('Bildirim tercihi guncellenemedi:', e);
      // Revert on error
      set({ preferences });
    }
  },

  setAllPreferences: async (enabled, babyName) => {
    const updated: NotificationPreferences = {
      mealReminders: enabled,
      allergenTracking: enabled,
      weeklySummary: enabled,
      communityUpdates: enabled,
      aiSuggestions: enabled,
      promotions: false, // Promosyon her zaman kapali kalsin
    };
    set({ preferences: updated });

    try {
      await saveNotificationPreferences(updated);
      if (babyName) {
        await applyNotificationPreferences(updated, babyName);
      }
    } catch (e) {
      console.error('Bildirim tercihleri guncellenemedi:', e);
    }
  },

  initializeNotifications: async (babyName) => {
    const { preferences, isInitialized } = get();
    if (isInitialized) return;

    try {
      await applyNotificationPreferences(preferences, babyName);
      set({ isInitialized: true });
    } catch (e) {
      console.error('Bildirimler baslatilamadi:', e);
    }
  },
}));
