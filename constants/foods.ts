/**
 * Kaşık — Food Database
 * Turkish baby food items organized by category and age stage
 */

import { AgeStage, AllergenType, PantryCategory } from '../types';

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: PantryCategory;
  ageGroup: AgeStage;
  calories: number; // per 100g
  allergens: AllergenType[];
  nutrients: string[];
}

export const FOODS: FoodItem[] = [
  // ===== SEBZELER =====
  { id: 'havuc', name: 'Havuç', emoji: '🥕', category: 'sebze', ageGroup: '6m', calories: 41, allergens: [], nutrients: ['A Vitamini', 'Beta-karoten'] },
  { id: 'patates', name: 'Patates', emoji: '🥔', category: 'sebze', ageGroup: '6m', calories: 77, allergens: [], nutrients: ['C Vitamini', 'Potasyum'] },
  { id: 'tatli_patates', name: 'Tatlı Patates', emoji: '🍠', category: 'sebze', ageGroup: '6m', calories: 86, allergens: [], nutrients: ['A Vitamini', 'Lif'] },
  { id: 'kabak', name: 'Kabak', emoji: '🎃', category: 'sebze', ageGroup: '6m', calories: 17, allergens: [], nutrients: ['C Vitamini', 'Potasyum'] },
  { id: 'brokoli', name: 'Brokoli', emoji: '🥦', category: 'sebze', ageGroup: '6m', calories: 34, allergens: [], nutrients: ['Demir', 'C Vitamini', 'Kalsiyum'] },
  { id: 'bezelye', name: 'Bezelye', emoji: '🫛', category: 'sebze', ageGroup: '6m', calories: 81, allergens: [], nutrients: ['Protein', 'Demir', 'Lif'] },
  { id: 'ispanak', name: 'Ispanak', emoji: '🥬', category: 'sebze', ageGroup: '8m', calories: 23, allergens: [], nutrients: ['Demir', 'Kalsiyum', 'A Vitamini'] },
  { id: 'domates', name: 'Domates', emoji: '🍅', category: 'sebze', ageGroup: '8m', calories: 18, allergens: [], nutrients: ['C Vitamini', 'Likopen'] },
  { id: 'patlican', name: 'Patlıcan', emoji: '🍆', category: 'sebze', ageGroup: '8m', calories: 25, allergens: [], nutrients: ['Lif', 'Potasyum'] },

  // ===== MEYVELER =====
  { id: 'muz', name: 'Muz', emoji: '🍌', category: 'meyve', ageGroup: '6m', calories: 89, allergens: [], nutrients: ['Potasyum', 'B6 Vitamini'] },
  { id: 'elma', name: 'Elma', emoji: '🍎', category: 'meyve', ageGroup: '6m', calories: 52, allergens: [], nutrients: ['C Vitamini', 'Lif'] },
  { id: 'armut', name: 'Armut', emoji: '🍐', category: 'meyve', ageGroup: '6m', calories: 57, allergens: [], nutrients: ['C Vitamini', 'Lif'] },
  { id: 'avokado', name: 'Avokado', emoji: '🥑', category: 'meyve', ageGroup: '6m', calories: 160, allergens: [], nutrients: ['Sağlıklı Yağ', 'Potasyum', 'Demir'] },
  { id: 'seftali', name: 'Şeftali', emoji: '🍑', category: 'meyve', ageGroup: '6m', calories: 39, allergens: [], nutrients: ['A Vitamini', 'C Vitamini'] },
  { id: 'cilek', name: 'Çilek', emoji: '🍓', category: 'meyve', ageGroup: '8m', calories: 32, allergens: [], nutrients: ['C Vitamini', 'Antioksidan'] },
  { id: 'portakal', name: 'Portakal', emoji: '🍊', category: 'meyve', ageGroup: '12m+', calories: 47, allergens: [], nutrients: ['C Vitamini'] },
  { id: 'kivi', name: 'Kivi', emoji: '🥝', category: 'meyve', ageGroup: '12m+', calories: 61, allergens: [], nutrients: ['C Vitamini', 'K Vitamini'] },

  // ===== PROTEİN =====
  { id: 'tavuk', name: 'Tavuk', emoji: '🍗', category: 'protein', ageGroup: '6m', calories: 165, allergens: [], nutrients: ['Protein', 'B12', 'Demir'] },
  { id: 'dana_kiyma', name: 'Dana Kıyma', emoji: '🥩', category: 'protein', ageGroup: '6m', calories: 250, allergens: [], nutrients: ['Demir', 'Protein', 'Çinko'] },
  { id: 'yumurta_sarisi', name: 'Yumurta Sarısı', emoji: '🥚', category: 'protein', ageGroup: '8m', calories: 322, allergens: ['egg'], nutrients: ['D Vitamini', 'B12', 'Protein'] },
  { id: 'tam_yumurta', name: 'Tam Yumurta', emoji: '🥚', category: 'protein', ageGroup: '12m+', calories: 155, allergens: ['egg'], nutrients: ['Protein', 'D Vitamini'] },
  { id: 'somon', name: 'Somon', emoji: '🐟', category: 'protein', ageGroup: '8m', calories: 208, allergens: ['fish'], nutrients: ['Omega-3', 'D Vitamini', 'Protein'] },
  { id: 'mercimek', name: 'Mercimek', emoji: '🫘', category: 'protein', ageGroup: '6m', calories: 116, allergens: [], nutrients: ['Demir', 'Protein', 'Lif'] },
  { id: 'nohut', name: 'Nohut', emoji: '🫘', category: 'protein', ageGroup: '8m', calories: 164, allergens: [], nutrients: ['Protein', 'Lif', 'Demir'] },

  // ===== TAHILLAR =====
  { id: 'pirinc', name: 'Pirinç', emoji: '🍚', category: 'tahil', ageGroup: '6m', calories: 130, allergens: [], nutrients: ['Karbonhidrat', 'B Vitamini'] },
  { id: 'yulaf', name: 'Yulaf', emoji: '🥣', category: 'tahil', ageGroup: '6m', calories: 389, allergens: ['wheat'], nutrients: ['Lif', 'Demir', 'Protein'] },
  { id: 'bulgur', name: 'Bulgur', emoji: '🌾', category: 'tahil', ageGroup: '8m', calories: 342, allergens: ['wheat'], nutrients: ['Lif', 'Demir'] },
  { id: 'ekmek', name: 'Tam Buğday Ekmek', emoji: '🍞', category: 'tahil', ageGroup: '8m', calories: 247, allergens: ['wheat'], nutrients: ['Lif', 'B Vitamini'] },
  { id: 'makarna', name: 'Makarna', emoji: '🍝', category: 'tahil', ageGroup: '8m', calories: 131, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },

  // ===== SÜT ÜRÜNLERİ =====
  { id: 'yogurt', name: 'Yoğurt', emoji: '🥛', category: 'sut_urunleri', ageGroup: '6m', calories: 61, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein', 'Probiyotik'] },
  { id: 'peynir', name: 'Taze Peynir', emoji: '🧀', category: 'sut_urunleri', ageGroup: '8m', calories: 98, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'tereyagi', name: 'Tereyağı', emoji: '🧈', category: 'sut_urunleri', ageGroup: '6m', calories: 717, allergens: ['milk'], nutrients: ['A Vitamini', 'Sağlıklı Yağ'] },
];

export const getFoodById = (id: string): FoodItem | undefined =>
  FOODS.find((f) => f.id === id);

export const getFoodsByCategory = (category: PantryCategory): FoodItem[] =>
  FOODS.filter((f) => f.category === category);

export const getFoodsByAge = (stage: AgeStage): FoodItem[] => {
  const ageOrder = { '6m': 0, '8m': 1, '12m+': 2 };
  const stageLevel = ageOrder[stage];
  return FOODS.filter((f) => ageOrder[f.ageGroup] <= stageLevel);
};

export const CATEGORY_LABELS: Record<PantryCategory, { label: string; emoji: string }> = {
  sebze: { label: 'Sebzeler', emoji: '🥬' },
  meyve: { label: 'Meyveler', emoji: '🍎' },
  protein: { label: 'Protein', emoji: '🥩' },
  tahil: { label: 'Tahıllar', emoji: '🌾' },
  sut_urunleri: { label: 'Süt Ürünleri', emoji: '🥛' },
  baharat: { label: 'Baharatlar', emoji: '🌿' },
  diger: { label: 'Diğer', emoji: '📦' },
};

export const MEAL_SLOT_LABELS: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: 'Sabah Kahvaltısı', emoji: '🌅' },
  lunch: { label: 'Öğle Yemeği', emoji: '☀️' },
  snack: { label: 'Ara Öğün', emoji: '🍌' },
  dinner: { label: 'Akşam Yemeği', emoji: '🌙' },
};
