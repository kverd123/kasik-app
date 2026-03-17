/**
 * Kaşık — Baby Store (Zustand)
 * Bebek profili ve alerjen bilgileri — AsyncStorage ile persist
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Baby, AllergenType, TriedFood } from '../types';
import { syncToFirestore } from '../lib/firestoreSync';
import { getBabyProfiles } from '../lib/firestore';

interface BabyState {
  baby: Baby | null;
  customAllergens: string[];
  isLoaded: boolean;

  loadFromStorage: () => Promise<void>;
  syncFromFirestore: (userId: string) => Promise<void>;
  setBaby: (baby: Baby) => void;
  updateBaby: (updates: Partial<Baby>) => void;
  addKnownAllergen: (allergen: AllergenType) => void;
  removeKnownAllergen: (allergen: AllergenType) => void;
  addCustomAllergen: (name: string) => void;
  removeCustomAllergen: (name: string) => void;
  addTriedFood: (food: TriedFood) => void;
  updateTriedFood: (foodId: string, updates: Partial<TriedFood>) => void;
}

const STORAGE_KEY = '@kasik_baby';

const persistToStorage = async (baby: Baby | null, customAllergens: string[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ baby, customAllergens }));
  } catch (e) {
    console.error('Bebek bilgisi kaydedilemedi:', e);
  }
};

const DEFAULT_BABY: Baby = {
  id: 'baby-1',
  name: 'Bebeğim',
  birthDate: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000), // ~8 ay önce
  gender: 'other',
  currentStage: '8m',
  weight: [],
  height: [],
  knownAllergens: [],
  triedFoods: [],
};

export const useBabyStore = create<BabyState>((set, get) => ({
  baby: null,
  customAllergens: [],
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const baby = parsed.baby
          ? {
              ...parsed.baby,
              birthDate: new Date(parsed.baby.birthDate),
              triedFoods: (parsed.baby.triedFoods || []).map((f: any) => ({
                ...f,
                date: new Date(f.date),
              })),
            }
          : null;
        set({
          baby,
          customAllergens: parsed.customAllergens || [],
          isLoaded: true,
        });
      } else {
        set({ baby: DEFAULT_BABY, customAllergens: [], isLoaded: true });
        persistToStorage(DEFAULT_BABY, []);
      }
    } catch (e) {
      console.error('Bebek bilgisi yüklenemedi:', e);
      set({ baby: DEFAULT_BABY, customAllergens: [], isLoaded: true });
    }
  },

  syncFromFirestore: async (userId: string) => {
    try {
      const babies = await getBabyProfiles(userId);
      if (babies.length > 0) {
        const remoteBaby = {
          ...babies[0],
          birthDate: babies[0].birthDate instanceof Date
            ? babies[0].birthDate
            : new Date(babies[0].birthDate as any),
          triedFoods: (babies[0].triedFoods || []).map((f: any) => ({
            ...f,
            date: f.date instanceof Date ? f.date : new Date(f.date),
          })),
        };
        set({ baby: remoteBaby });
        persistToStorage(remoteBaby, get().customAllergens);
      }
    } catch (e) {
      console.warn('[BabyStore] Firestore sync failed:', e);
    }
  },

  setBaby: (baby) => {
    const { customAllergens } = get();
    set({ baby });
    persistToStorage(baby, customAllergens);
    syncToFirestore('baby.save', (userId) => [userId, baby]);
  },

  updateBaby: (updates) => {
    const { baby, customAllergens } = get();
    if (!baby) return;
    const updated = { ...baby, ...updates };
    set({ baby: updated });
    persistToStorage(updated, customAllergens);
    syncToFirestore('baby.update', (userId) => [userId, baby.id, updates]);
  },

  addKnownAllergen: (allergen) => {
    const { baby, customAllergens } = get();
    if (!baby || baby.knownAllergens.includes(allergen)) return;
    const updated = { ...baby, knownAllergens: [...baby.knownAllergens, allergen] };
    set({ baby: updated });
    persistToStorage(updated, customAllergens);
    syncToFirestore('baby.update', (userId) => [userId, baby.id, { knownAllergens: updated.knownAllergens }]);
  },

  removeKnownAllergen: (allergen) => {
    const { baby, customAllergens } = get();
    if (!baby) return;
    const updated = { ...baby, knownAllergens: baby.knownAllergens.filter((a) => a !== allergen) };
    set({ baby: updated });
    persistToStorage(updated, customAllergens);
    syncToFirestore('baby.update', (userId) => [userId, baby.id, { knownAllergens: updated.knownAllergens }]);
  },

  addCustomAllergen: (name) => {
    const { baby, customAllergens } = get();
    if (customAllergens.includes(name)) return;
    const updated = [...customAllergens, name];
    set({ customAllergens: updated });
    persistToStorage(baby, updated);
    // customAllergens baby doc'a yazılabilir
    if (baby) {
      syncToFirestore('baby.update', (userId) => [userId, baby.id, { customAllergens: updated }]);
    }
  },

  removeCustomAllergen: (name) => {
    const { baby, customAllergens } = get();
    const updated = customAllergens.filter((a) => a !== name);
    set({ customAllergens: updated });
    persistToStorage(baby, updated);
    if (baby) {
      syncToFirestore('baby.update', (userId) => [userId, baby.id, { customAllergens: updated }]);
    }
  },

  addTriedFood: (food) => {
    const { baby, customAllergens } = get();
    if (!baby) return;
    const updated = { ...baby, triedFoods: [...baby.triedFoods, food] };
    set({ baby: updated });
    persistToStorage(updated, customAllergens);
    syncToFirestore('baby.update', (userId) => [userId, baby.id, { triedFoods: updated.triedFoods }]);
  },

  updateTriedFood: (foodId, updates) => {
    const { baby, customAllergens } = get();
    if (!baby) return;
    const updated = {
      ...baby,
      triedFoods: baby.triedFoods.map((f) => (f.foodId === foodId ? { ...f, ...updates } : f)),
    };
    set({ baby: updated });
    persistToStorage(updated, customAllergens);
    syncToFirestore('baby.update', (userId) => [userId, baby.id, { triedFoods: updated.triedFoods }]);
  },
}));
