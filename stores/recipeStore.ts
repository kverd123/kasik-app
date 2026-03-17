/**
 * Kaşık — Topluluk Tarif Store (Zustand)
 * Firestore'dan topluluk tariflerini çeker, lokal tariflerle birleştirir
 * Beğeni, görüntüleme, paylaşım senkronizasyonu
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';
import { RecipeData, ALL_RECIPES, RECIPES_BY_ID } from '../constants/recipes';
import {
  createRecipe,
  getCommunityRecipes,
  getPopularRecipes,
  toggleRecipeLike,
  incrementRecipeViews,
} from '../lib/firestore';

// ===== RecipeData ↔ Firestore Recipe Mapping =====

/**
 * Firestore Recipe → Lokal RecipeData dönüşümü
 */
const firestoreToRecipeData = (recipe: Recipe, currentUserId?: string): RecipeData => ({
  id: recipe.id,
  title: recipe.title,
  description: recipe.description,
  emoji: recipe.emoji,
  ageGroup: recipe.ageGroup as '6m' | '8m' | '12m+',
  prepTime: recipe.prepTime,
  calories: recipe.calories,
  servings: recipe.servings,
  difficulty: recipe.difficulty,
  rating: recipe.rating,
  likes: recipe.likes,
  views: recipe.views ?? 0,
  comments: recipe.commentCount ?? 0,
  isLiked: currentUserId ? recipe.likedBy?.includes(currentUserId) ?? false : false,
  isAIGenerated: recipe.isAIGenerated,
  source: recipe.source,
  authorName: recipe.authorName,
  authorVerified: recipe.authorVerified,
  allergens: recipe.allergens,
  tags: recipe.tags,
  ingredients: recipe.ingredients.map((ing) => ({
    name: ing.name,
    amount: ing.amount,
    unit: ing.unit,
    emoji: ing.emoji,
    isAllergen: ing.isAllergen,
  })),
  steps: recipe.steps,
  nutrients: recipe.nutrients.map((n) => ({
    name: n.name,
    value: n.value,
    unit: n.unit,
  })),
  tip: recipe.tip ?? '',
  createdAt: recipe.createdAt instanceof Date ? recipe.createdAt : new Date(),
  photoURL: recipe.photoURL ?? null,
});

/**
 * CreatePostData.recipe + meta → Firestore Recipe
 */
interface PublishRecipeInput {
  title: string;
  description?: string;
  emoji?: string;
  servings: number;
  ageGroup: '6m' | '8m' | '12m+';
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    emoji: string;
    isAllergen?: boolean;
  }>;
  steps: string[];
  allergens?: string[];
  tags?: string[];
  nutrients?: Array<{ name: string; value: number; unit: string }>;
  tip?: string;
}

const buildFirestoreRecipe = (
  input: PublishRecipeInput,
  authorId: string,
  authorName: string,
): Omit<Recipe, 'id'> => ({
  title: input.title,
  description: input.description ?? `${authorName} tarafından paylaşılan tarif.`,
  emoji: input.emoji ?? '🍽',
  photoURL: undefined,
  photoGallery: [],
  authorId,
  authorName,
  authorVerified: false,
  ageGroup: input.ageGroup,
  prepTime: input.prepTime,
  calories: 0,
  servings: input.servings,
  ingredients: input.ingredients,
  steps: input.steps,
  allergens: (input.allergens ?? []) as any[],
  nutrients: input.nutrients ?? [],
  difficulty: input.difficulty,
  tags: input.tags ?? [],
  likes: 0,
  likedBy: [],
  rating: { average: 0, count: 0 },
  isAIGenerated: false,
  source: 'community',
  tip: input.tip,
  views: 0,
  commentCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// ===== Store =====

interface RecipeStoreState {
  communityRecipes: RecipeData[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
  isLoaded: boolean;

  // Actions
  loadFromStorage: () => Promise<void>;
  fetchCommunityRecipes: (filters?: { ageGroup?: string; sortBy?: 'newest' | 'popular' }) => Promise<void>;
  publishRecipe: (input: PublishRecipeInput, authorId: string, authorName: string) => Promise<string>;
  toggleLike: (recipeId: string, userId: string) => Promise<void>;
  incrementViews: (recipeId: string) => Promise<void>;

  // Getters
  getAllRecipes: () => RecipeData[];
  getCommunityRecipeById: (id: string) => RecipeData | undefined;
  getCommunityRecipes: () => RecipeData[];
}

const STORAGE_KEY = '@kasik_community_recipes';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 dakika

const persistToStorage = async (recipes: RecipeData[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (e) {
    console.error('Topluluk tarifleri kaydedilemedi:', e);
  }
};

export const useRecipeStore = create<RecipeStoreState>((set, get) => ({
  communityRecipes: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data).map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        }));
        set({ communityRecipes: parsed, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.error('Topluluk tarifleri yüklenemedi:', e);
      set({ isLoaded: true });
    }
  },

  fetchCommunityRecipes: async (filters) => {
    const { lastFetched, isLoading } = get();

    // Cache kontrolü — 5 dakika içinde tekrar çekme
    if (isLoading) return;
    if (lastFetched && Date.now() - lastFetched.getTime() < CACHE_TTL_MS) return;

    set({ isLoading: true, error: null });

    try {
      const { recipes } = await getCommunityRecipes({
        ageGroup: filters?.ageGroup,
        sortBy: filters?.sortBy ?? 'newest',
        maxResults: 50,
      });

      const recipeDataList = recipes.map((r) => firestoreToRecipeData(r));

      set({
        communityRecipes: recipeDataList,
        isLoading: false,
        lastFetched: new Date(),
        isLoaded: true,
      });

      persistToStorage(recipeDataList);
    } catch (e: any) {
      console.error('Topluluk tarifleri çekilemedi:', e);
      set({
        isLoading: false,
        error: e?.message ?? 'Tarifler yüklenirken bir hata oluştu.',
        isLoaded: true,
      });
    }
  },

  publishRecipe: async (input, authorId, authorName) => {
    set({ isLoading: true, error: null });

    try {
      const firestoreRecipe = buildFirestoreRecipe(input, authorId, authorName);
      const recipeId = await createRecipe(firestoreRecipe);

      // Lokal listeye de ekle (optimistic)
      const newRecipeData: RecipeData = {
        ...firestoreToRecipeData({ ...firestoreRecipe, id: recipeId } as Recipe),
        createdAt: new Date(),
      };

      const updated = [newRecipeData, ...get().communityRecipes];
      set({ communityRecipes: updated, isLoading: false });
      persistToStorage(updated);

      // RECIPES_BY_ID'ye de ekle (global lookup için)
      RECIPES_BY_ID[recipeId] = newRecipeData;

      return recipeId;
    } catch (e: any) {
      console.error('Tarif paylaşılamadı:', e);
      set({
        isLoading: false,
        error: e?.message ?? 'Tarif paylaşılırken bir hata oluştu.',
      });
      throw e;
    }
  },

  toggleLike: async (recipeId, userId) => {
    // Optimistic update
    const updated = get().communityRecipes.map((r) => {
      if (r.id !== recipeId) return r;
      const wasLiked = r.isLiked;
      return {
        ...r,
        isLiked: !wasLiked,
        likes: wasLiked ? r.likes - 1 : r.likes + 1,
      };
    });
    set({ communityRecipes: updated });
    persistToStorage(updated);

    try {
      const recipe = get().communityRecipes.find((r) => r.id === recipeId);
      const wasLiked = recipe ? !recipe.isLiked : false; // Tersini gönder (optimistic zaten değişti)
      await toggleRecipeLike(recipeId, userId, wasLiked);
    } catch (e) {
      // Revert on error
      console.error('Beğeni güncellenemedi:', e);
      const reverted = get().communityRecipes.map((r) => {
        if (r.id !== recipeId) return r;
        const wasLiked = r.isLiked;
        return {
          ...r,
          isLiked: !wasLiked,
          likes: wasLiked ? r.likes - 1 : r.likes + 1,
        };
      });
      set({ communityRecipes: reverted });
      persistToStorage(reverted);
    }
  },

  incrementViews: async (recipeId) => {
    // Lokal güncelle
    const updated = get().communityRecipes.map((r) =>
      r.id === recipeId ? { ...r, views: r.views + 1 } : r
    );
    set({ communityRecipes: updated });

    try {
      await incrementRecipeViews(recipeId);
    } catch (e) {
      // Görüntüleme hatası sessizce geç
      console.warn('Görüntüleme sayacı güncellenemedi:', e);
    }
  },

  getAllRecipes: () => {
    const { communityRecipes } = get();
    // Lokal tariflerin ID'leri ile çakışmayı önle
    const localIds = new Set(ALL_RECIPES.map((r) => r.id));
    const uniqueCommunity = communityRecipes.filter((r) => !localIds.has(r.id));
    return [...ALL_RECIPES, ...uniqueCommunity];
  },

  getCommunityRecipeById: (id) => {
    return get().communityRecipes.find((r) => r.id === id);
  },

  getCommunityRecipes: () => {
    return get().communityRecipes;
  },
}));
