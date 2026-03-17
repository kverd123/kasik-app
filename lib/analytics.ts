/**
 * Kaşık — Analytics Service
 * Kullanıcı davranış takibi — Firestore'a event loglama
 *
 * Firebase Analytics React Native'de çalışmadığı için kendi
 * analytics servisimizi yazıyoruz. Event'ler buffer'da birikir
 * ve batch olarak Firestore'a yazılır.
 *
 * FAZ 20'de (App Store) native Firebase Analytics'e geçiş için
 * hazır arayüz: sadece flush mekanizması değiştirilir.
 */

import { Platform, AppState, AppStateStatus } from 'react-native';
import { logAnalyticsBatch } from './firestore';
import { getAuthUserId } from './firestoreSync';

// ===== TYPES =====

export interface AnalyticsEvent {
  name: string;
  params: Record<string, string | number | boolean>;
  userId: string | null;
  timestamp: number; // Date.now()
  platform: string;
  sessionId: string;
}

// ===== CONFIG =====

const BUFFER_SIZE = 10;      // Her 10 event'te bir flush
const FLUSH_INTERVAL = 30000; // 30 saniyede bir flush (ms)

// ===== STATE =====

let sessionId = '';
let currentUserId: string | null = null;
let eventBuffer: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let isInitialized = false;

// ===== CORE FUNCTIONS =====

/** Benzersiz session ID oluştur */
function generateSessionId(): string {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${now}-${rand}`;
}

/** Buffer'daki event'leri Firestore'a yaz */
export async function flushEvents(): Promise<void> {
  if (eventBuffer.length === 0) return;

  const eventsToFlush = [...eventBuffer];
  eventBuffer = [];

  const userId = currentUserId || getAuthUserId();
  if (!userId) {
    // Auth yoksa event'leri sessizce drop et
    // Anonim kullanıcı takibi istemiyoruz
    return;
  }

  try {
    await logAnalyticsBatch(userId, eventsToFlush);
  } catch (error) {
    // Başarısız olursa event'leri geri buffer'a ekle (bir sonraki flush'ta denenecek)
    // Ancak buffer'ın çok büyümesini engelle
    if (eventBuffer.length < BUFFER_SIZE * 3) {
      eventBuffer.unshift(...eventsToFlush);
    }
    console.warn('[Analytics] Flush failed:', (error as Error)?.message);
  }
}

/** Analytics sistemini başlat */
export function initAnalytics(userId?: string): void {
  if (isInitialized) return;

  sessionId = generateSessionId();
  currentUserId = userId || null;
  isInitialized = true;

  // Periyodik flush timer
  flushTimer = setInterval(flushEvents, FLUSH_INTERVAL);

  // App background'a geçince flush
  const handleAppState = (state: AppStateStatus) => {
    if (state === 'background' || state === 'inactive') {
      flushEvents();
    }
  };
  const subscription = AppState.addEventListener('change', handleAppState);

  // Session başlangıcını logla
  logEvent('session_start', {});
}

/** Kullanıcı ID'sini güncelle (login sonrası) */
export function setAnalyticsUser(userId: string): void {
  currentUserId = userId;
}

/** Kullanıcı çıkışında temizle */
export function clearAnalyticsUser(): void {
  flushEvents();
  currentUserId = null;
}

/** Genel event loglama */
export function logEvent(name: string, params: Record<string, string | number | boolean>): void {
  if (!isInitialized) return;

  const event: AnalyticsEvent = {
    name,
    params,
    userId: currentUserId || getAuthUserId(),
    timestamp: Date.now(),
    platform: Platform.OS,
    sessionId,
  };

  eventBuffer.push(event);

  // Buffer dolunca flush
  if (eventBuffer.length >= BUFFER_SIZE) {
    flushEvents();
  }
}

/** Ekran görüntüleme event'i */
export function logScreenView(screenName: string): void {
  logEvent('screen_view', { screen_name: screenName });
}

// ===== SEMANTIC ANALYTICS HELPERS =====

export const analytics = {
  // --- Screen Views ---
  screenView: (screen: string) => logScreenView(screen),

  // --- Recipe Events ---
  recipeView: (recipeId: string, title: string) =>
    logEvent('recipe_view', { recipe_id: recipeId, title }),

  recipeLike: (recipeId: string) =>
    logEvent('recipe_like', { recipe_id: recipeId }),

  recipeUnlike: (recipeId: string) =>
    logEvent('recipe_unlike', { recipe_id: recipeId }),

  recipeBookmark: (recipeId: string) =>
    logEvent('recipe_bookmark', { recipe_id: recipeId }),

  recipeUnbookmark: (recipeId: string) =>
    logEvent('recipe_unbookmark', { recipe_id: recipeId }),

  recipeShare: (recipeId: string) =>
    logEvent('recipe_share', { recipe_id: recipeId }),

  recipeSearch: (query: string, resultCount: number) =>
    logEvent('recipe_search', { query, result_count: resultCount }),

  // --- Meal Plan Events ---
  mealAdd: (slot: string, foodName: string) =>
    logEvent('meal_add', { slot, food_name: foodName }),

  mealComplete: (foodName: string) =>
    logEvent('meal_complete', { food_name: foodName }),

  mealRemove: (foodName: string) =>
    logEvent('meal_remove', { food_name: foodName }),

  weekNavigate: (direction: 'next' | 'previous' | 'current') =>
    logEvent('week_navigate', { direction }),

  // --- Pantry Events ---
  pantryItemAdd: (itemName: string, category: string) =>
    logEvent('pantry_item_add', { item_name: itemName, category }),

  pantryItemRemove: (itemName: string) =>
    logEvent('pantry_item_remove', { item_name: itemName }),

  // --- Community Events ---
  postCreate: (category: string) =>
    logEvent('post_create', { category }),

  postLike: (postId: string) =>
    logEvent('post_like', { post_id: postId }),

  postComment: (postId: string) =>
    logEvent('post_comment', { post_id: postId }),

  postShare: (postId: string) =>
    logEvent('post_share', { post_id: postId }),

  // --- AI Recipe Events ---
  aiRecipeGenerate: (provider: string, count: number) =>
    logEvent('ai_recipe_generate', { provider, count }),

  aiRecipeSave: (title: string) =>
    logEvent('ai_recipe_save', { title }),

  // --- Shopping List Events ---
  shoppingListGenerate: (itemCount: number) =>
    logEvent('shopping_list_generate', { item_count: itemCount }),

  shoppingListShare: () =>
    logEvent('shopping_list_share', {}),

  // --- Auth Events ---
  login: (method: string) =>
    logEvent('login', { method }),

  register: (method: string) =>
    logEvent('register', { method }),

  logout: () =>
    logEvent('logout', {}),

  // --- Onboarding Events ---
  onboardingStep: (step: string) =>
    logEvent('onboarding_step', { step }),

  onboardingComplete: () =>
    logEvent('onboarding_complete', {}),
};
