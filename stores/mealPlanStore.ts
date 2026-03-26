/**
 * Kaşık — Meal Plan Store (Zustand)
 * Çoklu haftalık yemek planını yönetir, AsyncStorage ile persist eder
 * weekKey formatı: "YYYY-WW" (ISO hafta numarası)
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debouncedSetItem } from '../lib/debouncedStorage';
import { Meal, MealSlot } from '../types';
import { usePantryStore } from './pantryStore';
import { ALL_RECIPES, RECIPES_BY_ID, RecipeData } from '../constants/recipes';
import { syncToFirestore } from '../lib/firestoreSync';
import { getAllWeekMealPlans } from '../lib/firestore';

export type DayMeals = Record<MealSlot, Meal[]>;

// ===== HAFTA HELPER FONKSİYONLARI =====

/** ISO hafta numarasını hesapla (Pazartesi başlangıçlı) */
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Tarihten weekKey oluştur: "2026-12" */
export function getWeekKey(date: Date): string {
  const week = getISOWeekNumber(date);
  const year = date.getFullYear();
  // Yılbaşı geçişinde ISO hafta yılı farklı olabilir
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const isoYear = d.getUTCFullYear();
  return `${isoYear}-${String(week).padStart(2, '0')}`;
}

/** weekKey'den o haftanın Pazartesi'sini bul */
export function getWeekMonday(weekKey: string): Date {
  const [yearStr, weekStr] = weekKey.split('-');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  // ISO 8601: haftanın 4. günü o yılda olmalı
  // 4 Ocak her zaman 1. haftadadır
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // Pazar=7
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - dayOfWeek + 1);

  const result = new Date(mondayOfWeek1);
  result.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);
  return result;
}

/** weekKey'den 7 günlük tarih dizisi (Pzt-Paz) */
export function getWeekDates(weekKey: string): Date[] {
  const monday = getWeekMonday(weekKey);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/** Offset ile weekKey hesapla (+1 sonraki, -1 önceki) */
export function getWeekKeyOffset(weekKey: string, offset: number): string {
  const monday = getWeekMonday(weekKey);
  monday.setDate(monday.getDate() + offset * 7);
  return getWeekKey(monday);
}

/** weekKey'den okunabilir hafta etiketi: "16 - 22 Mart 2026" */
export function getWeekLabel(weekKey: string): string {
  const dates = getWeekDates(weekKey);
  const monday = dates[0];
  const sunday = dates[6];

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];

  const monDay = monday.getDate();
  const sunDay = sunday.getDate();
  const monMonth = monthNames[monday.getMonth()];
  const sunMonth = monthNames[sunday.getMonth()];
  const year = sunday.getFullYear();

  if (monday.getMonth() === sunday.getMonth()) {
    return `${monDay} - ${sunDay} ${monMonth} ${year}`;
  }
  return `${monDay} ${monMonth} - ${sunDay} ${sunMonth} ${year}`;
}

/** Bugünün weekKey'i */
export function getCurrentWeekKey(): string {
  return getWeekKey(new Date());
}

/** İki tarihin aynı gün olup olmadığı */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

// ===== STORE =====

interface MealPlanState {
  // State
  allWeekMeals: Record<string, Record<number, DayMeals>>;
  currentWeekKey: string;
  isLoaded: boolean;

  // Geriye uyumlu (plan.tsx, shoppingList vs. tarafından kullanılır)
  weekMeals: Record<number, DayMeals>;

  // Actions
  loadFromStorage: () => Promise<void>;
  syncFromFirestore: (userId: string) => Promise<void>;
  setCurrentWeek: (weekKey: string) => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToCurrentWeek: () => void;
  addMealToSlot: (dayIndex: number, slot: MealSlot, meal: Meal) => void;
  removeMeal: (dayIndex: number, mealId: string) => void;
  toggleMealCompleted: (dayIndex: number, mealId: string) => void;
  getCompletedMealsThisWeek: () => number;
  getDayMeals: (dayIndex: number) => DayMeals;
  getWeekMeals: (weekKey: string) => Record<number, DayMeals>;
  generateWeeklyPlan: (mealsPerDay: number, babyMonth: number, expiringIngredients?: string[]) => void;
}

const STORAGE_KEY = '@kasik_meal_plan';

interface StorageFormat {
  version: 2;
  weeks: Record<string, Record<number, DayMeals>>;
}

const persistToStorage = (allWeekMeals: Record<string, Record<number, DayMeals>>) => {
  try {
    const data: StorageFormat = { version: 2, weeks: allWeekMeals };
    debouncedSetItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Yemek planı kaydedilemedi:', e);
  }
};

const emptyDay = (): DayMeals => ({
  breakfast: [],
  lunch: [],
  snack: [],
  dinner: [],
});

const emptyWeek = (): Record<number, DayMeals> => ({
  0: emptyDay(), 1: emptyDay(), 2: emptyDay(), 3: emptyDay(),
  4: emptyDay(), 5: emptyDay(), 6: emptyDay(),
});

// Demo verisi — haftalık plan
const DEFAULT_WEEK_MEALS: Record<number, DayMeals> = {
  0: { // Pazartesi
    breakfast: [
      { id: 'p1-1', slot: 'breakfast', foodName: 'Avokado Püresi', emoji: '🥑', ageGroup: '8m', calories: 80, completed: false, isFirstTry: true, nutrients: [{ name: 'Demir', value: 2, unit: 'mg' }] },
    ],
    lunch: [
      { id: 'p1-2', slot: 'lunch', foodName: 'Havuç-Patates Çorbası', emoji: '🥕', ageGroup: '6m', calories: 65, completed: false, isFirstTry: false, nutrients: [{ name: 'A Vitamini', value: 100, unit: 'mcg' }] },
      { id: 'p1-3', slot: 'lunch', foodName: 'Yumurta Sarısı', emoji: '🥚', ageGroup: '8m', calories: 55, completed: false, isFirstTry: true, allergenWarning: ['egg'] },
    ],
    snack: [
      { id: 'p1-4', slot: 'snack', foodName: 'Muzlu Yoğurt', emoji: '🍌', ageGroup: '6m', calories: 95, completed: false, isFirstTry: false, nutrients: [{ name: 'Kalsiyum', value: 150, unit: 'mg' }] },
    ],
    dinner: [],
  },
  1: { // Salı
    breakfast: [
      { id: 'sa-1', slot: 'breakfast', foodName: 'Elmalı Pirinç Lapası', emoji: '🍎', ageGroup: '6m', calories: 90, completed: false, isFirstTry: false, nutrients: [{ name: 'Lif', value: 2, unit: 'g' }] },
    ],
    lunch: [
      { id: 'sa-2', slot: 'lunch', foodName: 'Mercimek Çorbası', emoji: '🫘', ageGroup: '6m', calories: 85, completed: false, isFirstTry: false, nutrients: [{ name: 'Demir', value: 3, unit: 'mg' }, { name: 'Protein', value: 5, unit: 'g' }] },
    ],
    snack: [
      { id: 'sa-3', slot: 'snack', foodName: 'Armut Püresi', emoji: '🍐', ageGroup: '6m', calories: 60, completed: false, isFirstTry: true },
    ],
    dinner: [
      { id: 'sa-4', slot: 'dinner', foodName: 'Tavuk Suyu Çorba', emoji: '🍗', ageGroup: '8m', calories: 70, completed: false, isFirstTry: false, nutrients: [{ name: 'Protein', value: 8, unit: 'g' }] },
    ],
  },
  2: { // Çarşamba
    breakfast: [
      { id: 'ca-1', slot: 'breakfast', foodName: 'Muzlu Yulaf Lapası', emoji: '🥣', ageGroup: '6m', calories: 120, completed: false, isFirstTry: false, allergenWarning: ['wheat'], nutrients: [{ name: 'Lif', value: 3, unit: 'g' }] },
    ],
    lunch: [
      { id: 'ca-2', slot: 'lunch', foodName: 'Brokoli Püresi', emoji: '🥦', ageGroup: '6m', calories: 45, completed: false, isFirstTry: false, nutrients: [{ name: 'C Vitamini', value: 40, unit: 'mg' }] },
      { id: 'ca-3', slot: 'lunch', foodName: 'Balık Püresi', emoji: '🐟', ageGroup: '8m', calories: 75, completed: false, isFirstTry: true, allergenWarning: ['fish'], nutrients: [{ name: 'Omega-3', value: 200, unit: 'mg' }] },
    ],
    snack: [
      { id: 'ca-4', slot: 'snack', foodName: 'Kayısı Püresi', emoji: '🍑', ageGroup: '6m', calories: 50, completed: false, isFirstTry: false },
    ],
    dinner: [],
  },
  3: { // Perşembe
    breakfast: [
      { id: 'pe-1', slot: 'breakfast', foodName: 'Tatlı Patates Ezmesi', emoji: '🍠', ageGroup: '6m', calories: 110, completed: false, isFirstTry: false, nutrients: [{ name: 'A Vitamini', value: 250, unit: 'mcg' }] },
    ],
    lunch: [
      { id: 'pe-2', slot: 'lunch', foodName: 'Kabak Çorbası', emoji: '🎃', ageGroup: '6m', calories: 55, completed: false, isFirstTry: false, nutrients: [{ name: 'C Vitamini', value: 15, unit: 'mg' }] },
    ],
    snack: [
      { id: 'pe-3', slot: 'snack', foodName: 'Yoğurt + Muz', emoji: '🍌', ageGroup: '6m', calories: 100, completed: false, isFirstTry: false, allergenWarning: ['milk'], nutrients: [{ name: 'Kalsiyum', value: 180, unit: 'mg' }] },
    ],
    dinner: [
      { id: 'pe-4', slot: 'dinner', foodName: 'Sebzeli Bulgur', emoji: '🌾', ageGroup: '8m', calories: 95, completed: false, isFirstTry: false, allergenWarning: ['wheat'], nutrients: [{ name: 'Demir', value: 2, unit: 'mg' }] },
    ],
  },
  4: { // Cuma
    breakfast: [
      { id: 'cu-1', slot: 'breakfast', foodName: 'Erik Püresi', emoji: '🫐', ageGroup: '6m', calories: 55, completed: false, isFirstTry: false, nutrients: [{ name: 'Lif', value: 2, unit: 'g' }] },
      { id: 'cu-2', slot: 'breakfast', foodName: 'Pirinç Lapası', emoji: '🍚', ageGroup: '6m', calories: 70, completed: false, isFirstTry: false },
    ],
    lunch: [
      { id: 'cu-3', slot: 'lunch', foodName: 'Bezelye Püresi', emoji: '🟢', ageGroup: '6m', calories: 65, completed: false, isFirstTry: true, nutrients: [{ name: 'Protein', value: 4, unit: 'g' }] },
    ],
    snack: [],
    dinner: [
      { id: 'cu-4', slot: 'dinner', foodName: 'Etli Sebze Çorbası', emoji: '🥩', ageGroup: '8m', calories: 110, completed: false, isFirstTry: false, nutrients: [{ name: 'Demir', value: 4, unit: 'mg' }, { name: 'Protein', value: 10, unit: 'g' }] },
    ],
  },
  5: { // Cumartesi
    breakfast: [
      { id: 'ct-1', slot: 'breakfast', foodName: 'Peynirli Omlet', emoji: '🧀', ageGroup: '12m+', calories: 130, completed: false, isFirstTry: false, allergenWarning: ['egg', 'milk'], nutrients: [{ name: 'Protein', value: 9, unit: 'g' }] },
    ],
    lunch: [
      { id: 'ct-2', slot: 'lunch', foodName: 'Domates Çorbası', emoji: '🍅', ageGroup: '8m', calories: 60, completed: false, isFirstTry: false, nutrients: [{ name: 'C Vitamini', value: 20, unit: 'mg' }] },
    ],
    snack: [
      { id: 'ct-3', slot: 'snack', foodName: 'Karpuz Dilimleri', emoji: '🍉', ageGroup: '8m', calories: 40, completed: false, isFirstTry: false },
    ],
    dinner: [
      { id: 'ct-4', slot: 'dinner', foodName: 'Fırın Sebze', emoji: '🥕', ageGroup: '12m+', calories: 85, completed: false, isFirstTry: false, nutrients: [{ name: 'A Vitamini', value: 300, unit: 'mcg' }] },
    ],
  },
  6: { // Pazar
    breakfast: [
      { id: 'pz-1', slot: 'breakfast', foodName: 'Pankek', emoji: '🥞', ageGroup: '12m+', calories: 150, completed: false, isFirstTry: false, allergenWarning: ['wheat', 'egg', 'milk'] },
    ],
    lunch: [
      { id: 'pz-2', slot: 'lunch', foodName: 'Tavuklu Pirinç', emoji: '🍗', ageGroup: '8m', calories: 120, completed: false, isFirstTry: false, nutrients: [{ name: 'Protein', value: 12, unit: 'g' }] },
    ],
    snack: [
      { id: 'pz-3', slot: 'snack', foodName: 'Mango Püresi', emoji: '🥭', ageGroup: '6m', calories: 65, completed: false, isFirstTry: true },
    ],
    dinner: [],
  },
};

export const useMealPlanStore = create<MealPlanState>((set, get) => {
  const thisWeekKey = getCurrentWeekKey();

  return {
    allWeekMeals: {},
    currentWeekKey: thisWeekKey,
    weekMeals: {}, // Geriye uyumlu — her zaman currentWeekKey'in verisi
    isLoaded: false,

    loadFromStorage: async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);

          // v2 format kontrolü
          if (parsed.version === 2 && parsed.weeks) {
            const weeks = parsed.weeks as Record<string, Record<number, DayMeals>>;
            const currentWeek = weeks[thisWeekKey] || emptyWeek();
            set({
              allWeekMeals: weeks,
              weekMeals: currentWeek,
              currentWeekKey: thisWeekKey,
              isLoaded: true,
            });
          } else {
            // Eski format (v1) — tek haftalık Record<number, DayMeals>
            // Mevcut haftanın key'ine migrate et
            const migratedWeeks: Record<string, Record<number, DayMeals>> = {
              [thisWeekKey]: parsed,
            };
            set({
              allWeekMeals: migratedWeeks,
              weekMeals: parsed,
              currentWeekKey: thisWeekKey,
              isLoaded: true,
            });
            persistToStorage(migratedWeeks);
          }
        } else {
          // İlk açılış — demo verisi
          const initial: Record<string, Record<number, DayMeals>> = {
            [thisWeekKey]: DEFAULT_WEEK_MEALS,
          };
          set({
            allWeekMeals: initial,
            weekMeals: DEFAULT_WEEK_MEALS,
            currentWeekKey: thisWeekKey,
            isLoaded: true,
          });
          persistToStorage(initial);
        }
      } catch (e) {
        console.error('Yemek planı yüklenemedi:', e);
        const initial: Record<string, Record<number, DayMeals>> = {
          [thisWeekKey]: DEFAULT_WEEK_MEALS,
        };
        set({
          allWeekMeals: initial,
          weekMeals: DEFAULT_WEEK_MEALS,
          currentWeekKey: thisWeekKey,
          isLoaded: true,
        });
        persistToStorage(initial);
      }
    },

    syncFromFirestore: async (userId: string) => {
      try {
        const remoteWeeks = await getAllWeekMealPlans(userId);
        if (Object.keys(remoteWeeks).length > 0) {
          const { currentWeekKey } = get();
          // Remove updatedAt from week data
          const cleaned: Record<string, Record<number, DayMeals>> = {};
          for (const [key, data] of Object.entries(remoteWeeks)) {
            const { updatedAt, ...weekData } = data as any;
            cleaned[key] = weekData;
          }
          set({
            allWeekMeals: cleaned,
            weekMeals: cleaned[currentWeekKey] || emptyWeek(),
          });
          persistToStorage(cleaned);
        }
      } catch (e) {
        console.warn('[MealPlanStore] Firestore sync failed:', e);
      }
    },

    setCurrentWeek: (weekKey) => {
      const { allWeekMeals } = get();
      set({
        currentWeekKey: weekKey,
        weekMeals: allWeekMeals[weekKey] || emptyWeek(),
      });
    },

    goToNextWeek: () => {
      const { currentWeekKey, allWeekMeals } = get();
      const nextKey = getWeekKeyOffset(currentWeekKey, 1);
      set({
        currentWeekKey: nextKey,
        weekMeals: allWeekMeals[nextKey] || emptyWeek(),
      });
    },

    goToPreviousWeek: () => {
      const { currentWeekKey, allWeekMeals } = get();
      const prevKey = getWeekKeyOffset(currentWeekKey, -1);
      set({
        currentWeekKey: prevKey,
        weekMeals: allWeekMeals[prevKey] || emptyWeek(),
      });
    },

    goToCurrentWeek: () => {
      const nowKey = getCurrentWeekKey();
      const { allWeekMeals } = get();
      set({
        currentWeekKey: nowKey,
        weekMeals: allWeekMeals[nowKey] || emptyWeek(),
      });
    },

    addMealToSlot: (dayIndex, slot, meal) => {
      const state = get();
      const weekKey = state.currentWeekKey;
      const weekData = state.allWeekMeals[weekKey] || emptyWeek();
      const dayMeals = weekData[dayIndex] || emptyDay();
      const updatedDay: DayMeals = {
        ...dayMeals,
        [slot]: [...dayMeals[slot], meal],
      };
      const updatedWeek = { ...weekData, [dayIndex]: updatedDay };
      const updatedAll = { ...state.allWeekMeals, [weekKey]: updatedWeek };
      set({
        allWeekMeals: updatedAll,
        weekMeals: updatedWeek,
      });
      persistToStorage(updatedAll);
      syncToFirestore('mealPlan.saveWeek', (userId) => [userId, weekKey, updatedWeek]);
    },

    removeMeal: (dayIndex, mealId) => {
      const state = get();
      const weekKey = state.currentWeekKey;
      const weekData = state.allWeekMeals[weekKey];
      if (!weekData) return;
      const dayMeals = weekData[dayIndex];
      if (!dayMeals) return;

      const updatedDay: DayMeals = { ...dayMeals };
      for (const slot of Object.keys(updatedDay) as MealSlot[]) {
        updatedDay[slot] = updatedDay[slot].filter((m) => m.id !== mealId);
      }
      const updatedWeek = { ...weekData, [dayIndex]: updatedDay };
      const updatedAll = { ...state.allWeekMeals, [weekKey]: updatedWeek };
      set({
        allWeekMeals: updatedAll,
        weekMeals: updatedWeek,
      });
      persistToStorage(updatedAll);
      syncToFirestore('mealPlan.saveWeek', (userId) => [userId, weekKey, updatedWeek]);
    },

    toggleMealCompleted: (dayIndex, mealId) => {
      const state = get();
      const weekKey = state.currentWeekKey;
      const weekData = state.allWeekMeals[weekKey];
      if (!weekData) return;
      const dayMeals = weekData[dayIndex];
      if (!dayMeals) return;

      // Öğünü bul — completed değişmeden önce kontrol et
      let targetMeal: Meal | undefined;
      for (const slot of Object.keys(dayMeals) as MealSlot[]) {
        targetMeal = dayMeals[slot].find((m) => m.id === mealId);
        if (targetMeal) break;
      }

      const updatedDay: DayMeals = { ...dayMeals };
      for (const slot of Object.keys(updatedDay) as MealSlot[]) {
        updatedDay[slot] = updatedDay[slot].map((m) =>
          m.id === mealId ? { ...m, completed: !m.completed } : m
        );
      }
      const updatedWeek = { ...weekData, [dayIndex]: updatedDay };
      const updatedAll = { ...state.allWeekMeals, [weekKey]: updatedWeek };
      set({
        allWeekMeals: updatedAll,
        weekMeals: updatedWeek,
      });
      persistToStorage(updatedAll);
      syncToFirestore('mealPlan.saveWeek', (userId) => [userId, weekKey, updatedWeek]);

      // Öğün tamamlandıysa (false → true), dolaptaki malzeme miktarlarını azalt
      if (targetMeal && !targetMeal.completed) {
        const pantry = usePantryStore.getState();

        // recipeId varsa → tarifin tüm malzemelerini azalt
        if (targetMeal.recipeId && RECIPES_BY_ID[targetMeal.recipeId]) {
          const recipe = RECIPES_BY_ID[targetMeal.recipeId];
          for (const ingredient of recipe.ingredients) {
            const item = pantry.getItemByName(ingredient.name);
            if (item) {
              // Aynı birimse direkt azalt, farklıysa 1 birim azalt
              const reduction = item.unit === ingredient.unit ? ingredient.amount : 1;
              if (item.amount <= reduction) {
                pantry.removeItem(item.id);
              } else {
                pantry.updateAmount(item.id, item.amount - reduction);
              }
            }
          }
        } else {
          // recipeId yoksa → foodName ile eşleştir (eski davranış)
          const item = pantry.getItemByName(targetMeal.foodName);
          if (item) {
            if (item.amount <= 1) {
              pantry.removeItem(item.id);
            } else {
              pantry.updateAmount(item.id, item.amount - 1);
            }
          }
        }
      }
    },

    getCompletedMealsThisWeek: () => {
      const { weekMeals } = get();
      let count = 0;
      for (const dayMeals of Object.values(weekMeals)) {
        for (const slotMeals of Object.values(dayMeals)) {
          count += (slotMeals as Meal[]).filter((m) => m.completed).length;
        }
      }
      return count;
    },

    getDayMeals: (dayIndex) => {
      return get().weekMeals[dayIndex] || emptyDay();
    },

    getWeekMeals: (weekKey) => {
      return get().allWeekMeals[weekKey] || emptyWeek();
    },

    generateWeeklyPlan: (mealsPerDay, babyMonth, expiringIngredients = []) => {
      const state = get();
      const weekKey = state.currentWeekKey;

      // Bebek ayına uygun tarifleri al
      const ageFilter: '6m' | '8m' | '12m+' = babyMonth < 8 ? '6m' : babyMonth < 12 ? '8m' : '12m+';
      const ageOrder: Record<string, number> = { '6m': 0, '8m': 1, '12m+': 2 };
      const ageLevel = ageOrder[ageFilter];
      const availableRecipes: RecipeData[] = ALL_RECIPES.filter(
        (r: RecipeData) => r.ingredients.length > 0 && r.steps.length > 0 && ageOrder[r.ageGroup] <= ageLevel
      );

      if (availableRecipes.length === 0) return;

      // Dolaptaki ürünleri al
      const pantryItems: string[] = [];
      try {
        const pantryStore = require('./pantryStore').usePantryStore.getState();
        pantryItems.push(...(pantryStore.items || []).map((item: any) => item.name.toLowerCase()));
      } catch {}

      // Bayatlayacak malzemeleri içeren tariflere EN YÜKSEK öncelik
      const expiringLower = expiringIngredients.map((e) => e.toLowerCase());

      // Tarifleri puanla: dolap eşleşmesi + bayatlayacak malzeme
      const scoredRecipes = availableRecipes.map((r) => {
        let score = 0;
        const ingNames = r.ingredients.map((ing) => ing.name.toLowerCase());

        // Bayatlayacak malzeme eşleşmesi (+10 puan)
        const expiringMatch = expiringLower.filter((exp) =>
          ingNames.some((ing) => ing.includes(exp) || exp.includes(ing))
        ).length;
        score += expiringMatch * 10;

        // Dolap eşleşmesi (+3 puan her eşleşme)
        const pantryMatch = pantryItems.filter((p) =>
          ingNames.some((ing) => ing.includes(p) || p.includes(ing))
        ).length;
        score += pantryMatch * 3;

        // Çeşitlilik için küçük rastgele bonus
        score += Math.random() * 2;

        return { recipe: r, score };
      });

      // Puanına göre sırala (yüksekten düşüğe)
      scoredRecipes.sort((a, b) => b.score - a.score);

      const slots: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner'].slice(0, mealsPerDay) as MealSlot[];
      const newWeek: Record<number, DayMeals> = {};
      const weekUsedIds = new Set<string>(); // Hafta boyunca tekrar kontrolü

      for (let day = 0; day < 7; day++) {
        const dayMeals = emptyDay();
        const dayUsedIds = new Set<string>();

        for (const slot of slots) {
          // Önce bu gün kullanılmamış ve bu hafta az kullanılmış tarifleri tercih et
          let recipe: RecipeData | undefined;

          // 1. Bayatlayacak + dolap eşleşmeli tarifler (henüz bu gün kullanılmamış)
          for (const sr of scoredRecipes) {
            if (!dayUsedIds.has(sr.recipe.id) && !weekUsedIds.has(sr.recipe.id)) {
              recipe = sr.recipe;
              break;
            }
          }

          // 2. Bu gün kullanılmamış ama haftada kullanılmış olabilir
          if (!recipe) {
            for (const sr of scoredRecipes) {
              if (!dayUsedIds.has(sr.recipe.id)) {
                recipe = sr.recipe;
                break;
              }
            }
          }

          // 3. Fallback
          if (!recipe) {
            recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
          }

          dayUsedIds.add(recipe.id);
          weekUsedIds.add(recipe.id);

          // Eksik malzeme kontrolü
          const ingNames = recipe.ingredients.map((ing) => ing.name.toLowerCase());
          const missingIngredients = recipe.ingredients.filter(
            (ing) => !pantryItems.some((p) => p.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p))
          );

          const meal: Meal = {
            id: `gen-${day}-${slot}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            slot,
            recipeId: recipe.id,
            foodName: recipe.title,
            emoji: recipe.emoji,
            ageGroup: recipe.ageGroup,
            calories: recipe.calories,
            completed: false,
            isFirstTry: false,
            allergenWarning: recipe.allergens.length > 0 ? recipe.allergens : undefined,
            missingIngredients: missingIngredients.length > 0 ? missingIngredients.map((i) => i.name) : undefined,
            nutrients: recipe.nutrients.slice(0, 2).map((n) => ({
              name: n.name,
              value: n.value,
              unit: n.unit,
            })),
          };
          dayMeals[slot].push(meal);
        }
        newWeek[day] = dayMeals;
      }

      const updatedAll = { ...state.allWeekMeals, [weekKey]: newWeek };
      set({
        allWeekMeals: updatedAll,
        weekMeals: newWeek,
      });
      persistToStorage(updatedAll);
      syncToFirestore('mealPlan.saveWeek', (userId) => [userId, weekKey, newWeek]);
    },
  };
});
