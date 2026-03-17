/**
 * Kaşık — Dolap Store (Zustand)
 * Dolaptaki malzemeleri miktar, birim ve tazelik bilgisiyle yönetir
 * AsyncStorage ile persist eder
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debouncedSetItem } from '../lib/debouncedStorage';
import { PantryCategory } from '../types';
import { syncToFirestore } from '../lib/firestoreSync';
import { getPantryItems } from '../lib/firestore';

export interface PantryEntry {
  id: string;
  name: string;
  emoji: string;
  category: PantryCategory;
  amount: number;
  unit: string;
  daysLeft?: number; // -1 = kuru gıda, undefined = bilinmiyor
  addedDate: Date;
}

interface PantryState {
  // State
  items: PantryEntry[];
  isLoaded: boolean;

  // Actions
  loadFromStorage: () => Promise<void>;
  syncFromFirestore: (userId: string) => Promise<void>;
  addItem: (item: Omit<PantryEntry, 'id' | 'addedDate'>) => void;
  removeItem: (id: string) => void;
  updateAmount: (id: string, amount: number) => void;
  updateDaysLeft: (id: string, daysLeft: number) => void;
  updateItem: (id: string, updates: Partial<Omit<PantryEntry, 'id' | 'addedDate'>>) => void;
  getItemByName: (name: string) => PantryEntry | undefined;
  getExpiringItems: (withinDays: number) => PantryEntry[];
  getAllItems: () => PantryEntry[];
  getItemsByCategory: () => Record<string, PantryEntry[]>;
}

const STORAGE_KEY = '@kasik_pantry';

const persistToStorage = (items: PantryEntry[]) => {
  try {
    debouncedSetItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Dolap kaydedilemedi:', e);
  }
};

// Demo verileri (miktarlı)
const DEFAULT_PANTRY: PantryEntry[] = [
  // Sebzeler
  { id: 'p1', name: 'Havuç', emoji: '🥕', category: 'sebze', amount: 3, unit: 'adet', daysLeft: 5, addedDate: new Date() },
  { id: 'p2', name: 'Patates', emoji: '🥔', category: 'sebze', amount: 4, unit: 'adet', daysLeft: 10, addedDate: new Date() },
  { id: 'p3', name: 'Brokoli', emoji: '🥦', category: 'sebze', amount: 1, unit: 'adet', daysLeft: 2, addedDate: new Date() },
  { id: 'p4', name: 'Kabak', emoji: '🎃', category: 'sebze', amount: 2, unit: 'adet', daysLeft: 4, addedDate: new Date() },

  // Meyveler
  { id: 'p5', name: 'Elma', emoji: '🍎', category: 'meyve', amount: 5, unit: 'adet', daysLeft: 7, addedDate: new Date() },
  { id: 'p6', name: 'Muz', emoji: '🍌', category: 'meyve', amount: 3, unit: 'adet', daysLeft: 3, addedDate: new Date() },
  { id: 'p7', name: 'Avokado', emoji: '🥑', category: 'meyve', amount: 2, unit: 'adet', daysLeft: 2, addedDate: new Date() },

  // Protein
  { id: 'p8', name: 'Tavuk Göğsü', emoji: '🍗', category: 'protein', amount: 2, unit: 'adet', daysLeft: 1, addedDate: new Date() },
  { id: 'p9', name: 'Yumurta', emoji: '🥚', category: 'protein', amount: 6, unit: 'adet', daysLeft: 14, addedDate: new Date() },
  { id: 'p10', name: 'Mercimek', emoji: '🫘', category: 'protein', amount: 500, unit: 'gram', daysLeft: -1, addedDate: new Date() },

  // Tahıllar
  { id: 'p11', name: 'Pirinç', emoji: '🍚', category: 'tahil', amount: 1000, unit: 'gram', daysLeft: -1, addedDate: new Date() },
  { id: 'p12', name: 'Yulaf', emoji: '🥣', category: 'tahil', amount: 500, unit: 'gram', daysLeft: -1, addedDate: new Date() },

  // Süt ürünleri
  { id: 'p13', name: 'Yoğurt', emoji: '🥛', category: 'sut_urunleri', amount: 2, unit: 'bardak', daysLeft: 3, addedDate: new Date() },
  { id: 'p14', name: 'Tereyağı', emoji: '🧈', category: 'sut_urunleri', amount: 200, unit: 'gram', daysLeft: 20, addedDate: new Date() },
];

export const usePantryStore = create<PantryState>((set, get) => ({
  items: [],
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data).map((e: any) => ({
          ...e,
          addedDate: new Date(e.addedDate),
        }));
        set({ items: parsed, isLoaded: true });
      } else {
        // İlk açılış — demo verisi
        set({ items: DEFAULT_PANTRY, isLoaded: true });
        persistToStorage(DEFAULT_PANTRY);
      }
    } catch (e) {
      console.error('Dolap yüklenemedi:', e);
      set({ isLoaded: true });
    }
  },

  syncFromFirestore: async (userId: string) => {
    try {
      const remoteItems = await getPantryItems(userId);
      if (remoteItems.length > 0) {
        const parsed = remoteItems.map((item: any) => ({
          ...item,
          addedDate: item.addedDate?.toDate ? item.addedDate.toDate() : new Date(item.addedDate),
        }));
        set({ items: parsed });
        persistToStorage(parsed);
      }
    } catch (e) {
      console.warn('[PantryStore] Firestore sync failed:', e);
    }
  },

  addItem: (item) => {
    const newItem: PantryEntry = {
      ...item,
      id: `pantry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      addedDate: new Date(),
    };
    const updated = [newItem, ...get().items];
    set({ items: updated });
    persistToStorage(updated);
    syncToFirestore('pantry.add', (userId) => [userId, newItem]);
  },

  removeItem: (id) => {
    const updated = get().items.filter((i) => i.id !== id);
    set({ items: updated });
    persistToStorage(updated);
    syncToFirestore('pantry.remove', (userId) => [userId, id]);
  },

  updateAmount: (id, amount) => {
    const updated = get().items.map((i) =>
      i.id === id ? { ...i, amount } : i
    );
    set({ items: updated });
    persistToStorage(updated);
    syncToFirestore('pantry.update', (userId) => [userId, id, { amount }]);
  },

  updateDaysLeft: (id, daysLeft) => {
    const updated = get().items.map((i) =>
      i.id === id ? { ...i, daysLeft } : i
    );
    set({ items: updated });
    persistToStorage(updated);
    syncToFirestore('pantry.update', (userId) => [userId, id, { daysLeft }]);
  },

  updateItem: (id, updates) => {
    const updated = get().items.map((i) =>
      i.id === id ? { ...i, ...updates } : i
    );
    set({ items: updated });
    persistToStorage(updated);
    syncToFirestore('pantry.update', (userId) => [userId, id, updates]);
  },

  getItemByName: (name) => {
    const lower = name.toLowerCase().trim();
    return get().items.find((i) => {
      const itemLower = i.name.toLowerCase();
      return itemLower === lower || itemLower.includes(lower) || lower.includes(itemLower);
    });
  },

  getExpiringItems: (withinDays) => {
    return get().items.filter(
      (i) => i.daysLeft !== undefined && i.daysLeft !== -1 && i.daysLeft <= withinDays
    );
  },

  getAllItems: () => {
    return get().items;
  },

  getItemsByCategory: () => {
    const groups: Record<string, PantryEntry[]> = {};
    for (const item of get().items) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  },
}));
