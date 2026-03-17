/**
 * Kaşık — Tarif Defteri Store (Zustand)
 * Manages saved/bookmarked recipes (recipe book)
 * Persists to AsyncStorage for offline access
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecipeData, RECIPES_BY_ID, ALL_RECIPES } from '../constants/recipes';
import { syncToFirestore } from '../lib/firestoreSync';
import { getRecipeBookEntries } from '../lib/firestore';

export interface RecipeBookEntry {
  recipeId: string;
  savedAt: Date;
  category: 'favorites' | 'try_later' | 'made_it';
  notes?: string;
  rating?: number; // User's personal rating
}

interface RecipeBookState {
  // State
  entries: RecipeBookEntry[];
  isLoaded: boolean;

  // Actions
  loadFromStorage: () => Promise<void>;
  syncFromFirestore: (userId: string) => Promise<void>;
  saveRecipe: (recipeId: string, category?: RecipeBookEntry['category']) => void;
  removeRecipe: (recipeId: string) => void;
  updateCategory: (recipeId: string, category: RecipeBookEntry['category']) => void;
  addNote: (recipeId: string, notes: string) => void;
  rateRecipe: (recipeId: string, rating: number) => void;
  isRecipeSaved: (recipeId: string) => boolean;
  getRecipesByCategory: (category: RecipeBookEntry['category']) => RecipeData[];
  getAllSavedRecipes: () => RecipeData[];
  getSavedCount: () => number;
}

const STORAGE_KEY = '@kasik_recipe_book';

const persistToStorage = async (entries: RecipeBookEntry[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Tarif defteri kaydedilemedi:', e);
  }
};

export const useRecipeBookStore = create<RecipeBookState>((set, get) => ({
  entries: [],
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data).map((e: any) => ({
          ...e,
          savedAt: new Date(e.savedAt),
        }));
        set({ entries: parsed, isLoaded: true });
      } else {
        // Başlangıç verileri — birkaç demo tarifi kayıtlı olarak başlat
        const defaultEntries: RecipeBookEntry[] = [
          { recipeId: '1', savedAt: new Date(Date.now() - 86400000 * 5), category: 'favorites' },
          { recipeId: '3', savedAt: new Date(Date.now() - 86400000 * 3), category: 'made_it' },
          { recipeId: '7', savedAt: new Date(Date.now() - 86400000 * 2), category: 'favorites' },
          { recipeId: '10', savedAt: new Date(Date.now() - 86400000 * 1), category: 'try_later' },
          { recipeId: '15', savedAt: new Date(Date.now() - 86400000 * 4), category: 'favorites' },
          { recipeId: '20', savedAt: new Date(), category: 'try_later' },
        ];
        set({ entries: defaultEntries, isLoaded: true });
        persistToStorage(defaultEntries);
      }
    } catch (e) {
      console.error('Tarif defteri yüklenemedi:', e);
      set({ isLoaded: true });
    }
  },

  syncFromFirestore: async (userId: string) => {
    try {
      const remoteEntries = await getRecipeBookEntries(userId);
      if (remoteEntries.length > 0) {
        const parsed = remoteEntries.map((e: any) => ({
          recipeId: e.recipeId || e.id,
          savedAt: e.savedAt?.toDate ? e.savedAt.toDate() : new Date(e.savedAt),
          category: e.category || 'favorites',
          notes: e.notes,
          rating: e.rating,
        }));
        set({ entries: parsed });
        persistToStorage(parsed);
      }
    } catch (e) {
      console.warn('[RecipeBookStore] Firestore sync failed:', e);
    }
  },

  saveRecipe: (recipeId, category = 'favorites') => {
    const { entries } = get();
    if (entries.some((e) => e.recipeId === recipeId)) return; // Zaten kayıtlı

    const newEntry: RecipeBookEntry = {
      recipeId,
      savedAt: new Date(),
      category,
    };
    const updated = [newEntry, ...entries];
    set({ entries: updated });
    persistToStorage(updated);
    syncToFirestore('recipeBook.save', (userId) => [userId, newEntry]);
  },

  removeRecipe: (recipeId) => {
    const updated = get().entries.filter((e) => e.recipeId !== recipeId);
    set({ entries: updated });
    persistToStorage(updated);
    syncToFirestore('recipeBook.remove', (userId) => [userId, recipeId]);
  },

  updateCategory: (recipeId, category) => {
    const updated = get().entries.map((e) =>
      e.recipeId === recipeId ? { ...e, category } : e
    );
    set({ entries: updated });
    persistToStorage(updated);
    syncToFirestore('recipeBook.update', (userId) => [userId, recipeId, { category }]);
  },

  addNote: (recipeId, notes) => {
    const updated = get().entries.map((e) =>
      e.recipeId === recipeId ? { ...e, notes } : e
    );
    set({ entries: updated });
    persistToStorage(updated);
    syncToFirestore('recipeBook.update', (userId) => [userId, recipeId, { notes }]);
  },

  rateRecipe: (recipeId, rating) => {
    const updated = get().entries.map((e) =>
      e.recipeId === recipeId ? { ...e, rating } : e
    );
    set({ entries: updated });
    persistToStorage(updated);
    syncToFirestore('recipeBook.update', (userId) => [userId, recipeId, { rating }]);
  },

  isRecipeSaved: (recipeId) => {
    return get().entries.some((e) => e.recipeId === recipeId);
  },

  getRecipesByCategory: (category) => {
    return get()
      .entries.filter((e) => e.category === category)
      .map((e) => RECIPES_BY_ID[e.recipeId])
      .filter(Boolean);
  },

  getAllSavedRecipes: () => {
    return get()
      .entries.map((e) => RECIPES_BY_ID[e.recipeId])
      .filter(Boolean);
  },

  getSavedCount: () => {
    return get().entries.length;
  },
}));
