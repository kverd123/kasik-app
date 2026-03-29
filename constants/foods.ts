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
  { id: 'balkabagi', name: 'Balkabağı', emoji: '🎃', category: 'sebze', ageGroup: '6m', calories: 26, allergens: [], nutrients: ['A Vitamini', 'Lif'] },
  { id: 'brokoli', name: 'Brokoli', emoji: '🥦', category: 'sebze', ageGroup: '6m', calories: 34, allergens: [], nutrients: ['Demir', 'C Vitamini', 'Kalsiyum'] },
  { id: 'bezelye', name: 'Bezelye', emoji: '🫛', category: 'sebze', ageGroup: '6m', calories: 81, allergens: [], nutrients: ['Protein', 'Demir', 'Lif'] },
  { id: 'ispanak', name: 'Ispanak', emoji: '🥬', category: 'sebze', ageGroup: '8m', calories: 23, allergens: [], nutrients: ['Demir', 'Kalsiyum', 'A Vitamini'] },
  { id: 'domates', name: 'Domates', emoji: '🍅', category: 'sebze', ageGroup: '8m', calories: 18, allergens: [], nutrients: ['C Vitamini', 'Likopen'] },
  { id: 'patlican', name: 'Patlıcan', emoji: '🍆', category: 'sebze', ageGroup: '8m', calories: 25, allergens: [], nutrients: ['Lif', 'Potasyum'] },
  { id: 'sogan', name: 'Soğan', emoji: '🧅', category: 'sebze', ageGroup: '8m', calories: 40, allergens: [], nutrients: ['C Vitamini', 'Lif'] },
  { id: 'pirasa', name: 'Pırasa', emoji: '🧅', category: 'sebze', ageGroup: '8m', calories: 61, allergens: [], nutrients: ['K Vitamini', 'Lif'] },
  { id: 'kereviz', name: 'Kereviz', emoji: '🥬', category: 'sebze', ageGroup: '8m', calories: 42, allergens: [], nutrients: ['K Vitamini', 'C Vitamini'] },
  { id: 'karnabahar', name: 'Karnabahar', emoji: '🥦', category: 'sebze', ageGroup: '6m', calories: 25, allergens: [], nutrients: ['C Vitamini', 'K Vitamini'] },
  { id: 'biber', name: 'Biber', emoji: '🌶️', category: 'sebze', ageGroup: '8m', calories: 20, allergens: [], nutrients: ['C Vitamini', 'A Vitamini'] },
  { id: 'kapya_biber', name: 'Kapya Biber', emoji: '🌶️', category: 'sebze', ageGroup: '8m', calories: 31, allergens: [], nutrients: ['C Vitamini', 'A Vitamini'] },
  { id: 'kirmizi_biber', name: 'Kırmızı Biber', emoji: '🌶️', category: 'sebze', ageGroup: '8m', calories: 31, allergens: [], nutrients: ['C Vitamini', 'A Vitamini'] },
  { id: 'bamya', name: 'Bamya', emoji: '🥒', category: 'sebze', ageGroup: '8m', calories: 33, allergens: [], nutrients: ['Lif', 'C Vitamini'] },
  { id: 'enginar', name: 'Enginar', emoji: '🥬', category: 'sebze', ageGroup: '8m', calories: 47, allergens: [], nutrients: ['Lif', 'K Vitamini'] },
  { id: 'semizotu', name: 'Semizotu', emoji: '🌿', category: 'sebze', ageGroup: '8m', calories: 20, allergens: [], nutrients: ['Omega-3', 'A Vitamini'] },
  { id: 'salatalik', name: 'Salatalık', emoji: '🥒', category: 'sebze', ageGroup: '8m', calories: 15, allergens: [], nutrients: ['K Vitamini', 'C Vitamini'] },
  { id: 'taze_fasulye', name: 'Taze Fasulye', emoji: '🫛', category: 'sebze', ageGroup: '8m', calories: 31, allergens: [], nutrients: ['Lif', 'C Vitamini'] },
  { id: 'yesil_fasulye', name: 'Yeşil Fasulye', emoji: '🫛', category: 'sebze', ageGroup: '8m', calories: 31, allergens: [], nutrients: ['Lif', 'C Vitamini'] },
  { id: 'bruksel_lahanasi', name: 'Brüksel Lahanası', emoji: '🥬', category: 'sebze', ageGroup: '8m', calories: 43, allergens: [], nutrients: ['C Vitamini', 'K Vitamini'] },
  { id: 'lahana', name: 'Lahana Yaprağı', emoji: '🥬', category: 'sebze', ageGroup: '8m', calories: 25, allergens: [], nutrients: ['C Vitamini', 'K Vitamini'] },
  { id: 'zeytin', name: 'Zeytin', emoji: '🫒', category: 'sebze', ageGroup: '12m+', calories: 115, allergens: [], nutrients: ['Demir', 'Sağlıklı Yağ'] },

  // ===== MEYVELER =====
  { id: 'muz', name: 'Muz', emoji: '🍌', category: 'meyve', ageGroup: '6m', calories: 89, allergens: [], nutrients: ['Potasyum', 'B6 Vitamini'] },
  { id: 'elma', name: 'Elma', emoji: '🍎', category: 'meyve', ageGroup: '6m', calories: 52, allergens: [], nutrients: ['C Vitamini', 'Lif'] },
  { id: 'armut', name: 'Armut', emoji: '🍐', category: 'meyve', ageGroup: '6m', calories: 57, allergens: [], nutrients: ['C Vitamini', 'Lif'] },
  { id: 'avokado', name: 'Avokado', emoji: '🥑', category: 'meyve', ageGroup: '6m', calories: 160, allergens: [], nutrients: ['Sağlıklı Yağ', 'Potasyum', 'Demir'] },
  { id: 'seftali', name: 'Şeftali', emoji: '🍑', category: 'meyve', ageGroup: '6m', calories: 39, allergens: [], nutrients: ['A Vitamini', 'C Vitamini'] },
  { id: 'erik', name: 'Erik', emoji: '🫐', category: 'meyve', ageGroup: '6m', calories: 46, allergens: [], nutrients: ['C Vitamini', 'Lif'] },
  { id: 'cilek', name: 'Çilek', emoji: '🍓', category: 'meyve', ageGroup: '8m', calories: 32, allergens: [], nutrients: ['C Vitamini', 'Antioksidan'] },
  { id: 'portakal', name: 'Portakal', emoji: '🍊', category: 'meyve', ageGroup: '12m+', calories: 47, allergens: [], nutrients: ['C Vitamini'] },
  { id: 'kivi', name: 'Kivi', emoji: '🥝', category: 'meyve', ageGroup: '12m+', calories: 61, allergens: [], nutrients: ['C Vitamini', 'K Vitamini'] },
  { id: 'hurma', name: 'Hurma', emoji: '🫘', category: 'meyve', ageGroup: '8m', calories: 277, allergens: [], nutrients: ['Lif', 'Potasyum'] },
  { id: 'uzum', name: 'Üzüm', emoji: '🍇', category: 'meyve', ageGroup: '8m', calories: 69, allergens: [], nutrients: ['C Vitamini', 'K Vitamini'] },
  { id: 'limon', name: 'Limon', emoji: '🍋', category: 'meyve', ageGroup: '12m+', calories: 29, allergens: [], nutrients: ['C Vitamini'] },
  { id: 'kuru_erik', name: 'Kuru Erik', emoji: '🫐', category: 'meyve', ageGroup: '8m', calories: 240, allergens: [], nutrients: ['Lif', 'Demir'] },
  { id: 'kuru_kayisi', name: 'Kuru Kayısı', emoji: '🍑', category: 'meyve', ageGroup: '8m', calories: 241, allergens: [], nutrients: ['A Vitamini', 'Demir'] },

  // ===== PROTEİN =====
  { id: 'tavuk', name: 'Tavuk', emoji: '🍗', category: 'protein', ageGroup: '6m', calories: 165, allergens: [], nutrients: ['Protein', 'B12', 'Demir'] },
  { id: 'tavuk_gogsu', name: 'Tavuk Göğsü', emoji: '🍗', category: 'protein', ageGroup: '6m', calories: 165, allergens: [], nutrients: ['Protein', 'B12'] },
  { id: 'tavuk_budu', name: 'Tavuk Budu', emoji: '🍗', category: 'protein', ageGroup: '6m', calories: 177, allergens: [], nutrients: ['Protein', 'Demir'] },
  { id: 'dana_kiyma', name: 'Dana Kıyma', emoji: '🥩', category: 'protein', ageGroup: '6m', calories: 250, allergens: [], nutrients: ['Demir', 'Protein', 'Çinko'] },
  { id: 'kuzu_eti', name: 'Kuzu Eti', emoji: '🥩', category: 'protein', ageGroup: '8m', calories: 282, allergens: [], nutrients: ['Demir', 'Protein', 'Çinko'] },
  { id: 'kuzu_kiyma', name: 'Kuzu Kıyma', emoji: '🥩', category: 'protein', ageGroup: '8m', calories: 282, allergens: [], nutrients: ['Demir', 'Protein'] },
  { id: 'kuzu_kusbasi', name: 'Kuzu Kuşbaşı', emoji: '🥩', category: 'protein', ageGroup: '8m', calories: 282, allergens: [], nutrients: ['Demir', 'Protein'] },
  { id: 'yumurta_sarisi', name: 'Yumurta Sarısı', emoji: '🥚', category: 'protein', ageGroup: '8m', calories: 322, allergens: ['egg'], nutrients: ['D Vitamini', 'B12', 'Protein'] },
  { id: 'tam_yumurta', name: 'Yumurta', emoji: '🥚', category: 'protein', ageGroup: '12m+', calories: 155, allergens: ['egg'], nutrients: ['Protein', 'D Vitamini'] },
  { id: 'somon', name: 'Somon', emoji: '🐟', category: 'protein', ageGroup: '8m', calories: 208, allergens: ['fish'], nutrients: ['Omega-3', 'D Vitamini', 'Protein'] },
  { id: 'somon_fileto', name: 'Somon Fileto', emoji: '🐟', category: 'protein', ageGroup: '8m', calories: 208, allergens: ['fish'], nutrients: ['Omega-3', 'Protein'] },
  { id: 'beyaz_balik', name: 'Beyaz Etli Balık Fileto', emoji: '🐟', category: 'protein', ageGroup: '8m', calories: 90, allergens: ['fish'], nutrients: ['Protein', 'D Vitamini'] },
  { id: 'mevsim_baligi', name: 'Mevsim Balığı', emoji: '🐟', category: 'protein', ageGroup: '8m', calories: 120, allergens: ['fish'], nutrients: ['Protein', 'Omega-3'] },
  { id: 'mercimek', name: 'Mercimek', emoji: '🫘', category: 'protein', ageGroup: '6m', calories: 116, allergens: [], nutrients: ['Demir', 'Protein', 'Lif'] },
  { id: 'kirmizi_mercimek', name: 'Kırmızı Mercimek', emoji: '🫘', category: 'protein', ageGroup: '6m', calories: 116, allergens: [], nutrients: ['Demir', 'Protein', 'Lif'] },
  { id: 'yesil_mercimek', name: 'Yeşil Mercimek', emoji: '🫘', category: 'protein', ageGroup: '8m', calories: 116, allergens: [], nutrients: ['Demir', 'Protein', 'Lif'] },
  { id: 'nohut', name: 'Nohut', emoji: '🫘', category: 'protein', ageGroup: '8m', calories: 164, allergens: [], nutrients: ['Protein', 'Lif', 'Demir'] },
  { id: 'kuru_fasulye', name: 'Kuru Fasulye', emoji: '🫘', category: 'protein', ageGroup: '8m', calories: 127, allergens: [], nutrients: ['Protein', 'Lif', 'Demir'] },
  { id: 'barbunya', name: 'Barbunya', emoji: '🫘', category: 'protein', ageGroup: '8m', calories: 127, allergens: [], nutrients: ['Protein', 'Lif'] },

  // ===== TAHILLAR =====
  { id: 'pirinc', name: 'Pirinç', emoji: '🍚', category: 'tahil', ageGroup: '6m', calories: 130, allergens: [], nutrients: ['Karbonhidrat', 'B Vitamini'] },
  { id: 'pirinc_unu', name: 'Pirinç Unu', emoji: '🍚', category: 'tahil', ageGroup: '6m', calories: 366, allergens: [], nutrients: ['Karbonhidrat'] },
  { id: 'yulaf', name: 'Yulaf', emoji: '🥣', category: 'tahil', ageGroup: '6m', calories: 389, allergens: ['wheat'], nutrients: ['Lif', 'Demir', 'Protein'] },
  { id: 'yulaf_ezmesi', name: 'Yulaf Ezmesi', emoji: '🥣', category: 'tahil', ageGroup: '6m', calories: 389, allergens: ['wheat'], nutrients: ['Lif', 'Demir'] },
  { id: 'yulaf_unu', name: 'Yulaf Unu', emoji: '🥣', category: 'tahil', ageGroup: '6m', calories: 390, allergens: ['wheat'], nutrients: ['Lif', 'Protein'] },
  { id: 'bulgur', name: 'Bulgur', emoji: '🌾', category: 'tahil', ageGroup: '8m', calories: 342, allergens: ['wheat'], nutrients: ['Lif', 'Demir'] },
  { id: 'ince_bulgur', name: 'İnce Bulgur', emoji: '🌾', category: 'tahil', ageGroup: '8m', calories: 342, allergens: ['wheat'], nutrients: ['Lif', 'Demir'] },
  { id: 'ekmek', name: 'Tam Buğday Ekmeği', emoji: '🍞', category: 'tahil', ageGroup: '8m', calories: 247, allergens: ['wheat'], nutrients: ['Lif', 'B Vitamini'] },
  { id: 'makarna', name: 'Makarna', emoji: '🍝', category: 'tahil', ageGroup: '8m', calories: 131, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },
  { id: 'bebek_makarnasi', name: 'Bebek Makarnası', emoji: '🍝', category: 'tahil', ageGroup: '8m', calories: 131, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },
  { id: 'fiyonk_makarna', name: 'Fiyonk Makarna', emoji: '🍝', category: 'tahil', ageGroup: '8m', calories: 131, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },
  { id: 'eriste', name: 'Erişte', emoji: '🍝', category: 'tahil', ageGroup: '8m', calories: 138, allergens: ['wheat', 'egg'], nutrients: ['Karbonhidrat', 'Protein'] },
  { id: 'sehriye', name: 'Şehriye', emoji: '🍝', category: 'tahil', ageGroup: '8m', calories: 138, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },
  { id: 'irmik', name: 'İrmik', emoji: '🌾', category: 'tahil', ageGroup: '6m', calories: 360, allergens: ['wheat'], nutrients: ['Karbonhidrat', 'Protein'] },
  { id: 'un', name: 'Un', emoji: '🌾', category: 'tahil', ageGroup: '8m', calories: 364, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },
  { id: 'tam_bugday_unu', name: 'Tam Buğday Unu', emoji: '🌾', category: 'tahil', ageGroup: '8m', calories: 340, allergens: ['wheat'], nutrients: ['Lif', 'Demir'] },
  { id: 'galeta_unu', name: 'Galeta Unu', emoji: '🍞', category: 'tahil', ageGroup: '8m', calories: 395, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },
  { id: 'tarhana', name: 'Tarhana', emoji: '🥣', category: 'tahil', ageGroup: '8m', calories: 325, allergens: ['wheat', 'milk'], nutrients: ['Protein', 'Lif'] },
  { id: 'yufka', name: 'Yufka', emoji: '🫓', category: 'tahil', ageGroup: '12m+', calories: 310, allergens: ['wheat'], nutrients: ['Karbonhidrat'] },

  // ===== SÜT ÜRÜNLERİ =====
  { id: 'yogurt', name: 'Yoğurt', emoji: '🥛', category: 'sut_urunleri', ageGroup: '6m', calories: 61, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein', 'Probiyotik'] },
  { id: 'peynir', name: 'Peynir', emoji: '🧀', category: 'sut_urunleri', ageGroup: '8m', calories: 98, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'beyaz_peynir', name: 'Beyaz Peynir', emoji: '🧀', category: 'sut_urunleri', ageGroup: '8m', calories: 264, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'kasar_peyniri', name: 'Kaşar Peyniri', emoji: '🧀', category: 'sut_urunleri', ageGroup: '12m+', calories: 313, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'lor_peyniri', name: 'Lor Peyniri', emoji: '🧀', category: 'sut_urunleri', ageGroup: '8m', calories: 84, allergens: ['milk'], nutrients: ['Protein', 'Kalsiyum'] },
  { id: 'labne_peyniri', name: 'Labne Peyniri', emoji: '🧀', category: 'sut_urunleri', ageGroup: '8m', calories: 160, allergens: ['milk'], nutrients: ['Protein', 'Kalsiyum'] },
  { id: 'dil_peyniri', name: 'Dil Peyniri', emoji: '🧀', category: 'sut_urunleri', ageGroup: '12m+', calories: 280, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'keci_peyniri', name: 'Keçi Peyniri', emoji: '🧀', category: 'sut_urunleri', ageGroup: '8m', calories: 264, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'tereyagi', name: 'Tereyağı', emoji: '🧈', category: 'sut_urunleri', ageGroup: '6m', calories: 717, allergens: ['milk'], nutrients: ['A Vitamini', 'Sağlıklı Yağ'] },
  { id: 'sut', name: 'Süt', emoji: '🥛', category: 'sut_urunleri', ageGroup: '12m+', calories: 42, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'kefir', name: 'Kefir', emoji: '🥛', category: 'sut_urunleri', ageGroup: '8m', calories: 41, allergens: ['milk'], nutrients: ['Probiyotik', 'Kalsiyum'] },
  { id: 'ayran', name: 'Ayran', emoji: '🥛', category: 'sut_urunleri', ageGroup: '8m', calories: 36, allergens: ['milk'], nutrients: ['Kalsiyum', 'Protein'] },
  { id: 'anne_sutu', name: 'Anne Sütü veya Formül', emoji: '🍼', category: 'sut_urunleri', ageGroup: '6m', calories: 70, allergens: [], nutrients: ['Kalsiyum', 'Protein'] },

  // ===== BAHARATLAR =====
  { id: 'tarcin', name: 'Tarçın', emoji: '🌿', category: 'baharat', ageGroup: '6m', calories: 247, allergens: [], nutrients: ['Antioksidan'] },
  { id: 'maydanoz', name: 'Maydanoz', emoji: '🌿', category: 'baharat', ageGroup: '8m', calories: 36, allergens: [], nutrients: ['C Vitamini', 'K Vitamini'] },
  { id: 'dereotu', name: 'Dereotu', emoji: '🌿', category: 'baharat', ageGroup: '8m', calories: 43, allergens: [], nutrients: ['A Vitamini', 'C Vitamini'] },

  // ===== DİĞER =====
  { id: 'zeytinyagi', name: 'Zeytinyağı', emoji: '🫒', category: 'diger', ageGroup: '6m', calories: 884, allergens: [], nutrients: ['Sağlıklı Yağ', 'E Vitamini'] },
  { id: 'hindistancevizi_yagi', name: 'Hindistancevizi Yağı', emoji: '🥥', category: 'diger', ageGroup: '6m', calories: 862, allergens: [], nutrients: ['Sağlıklı Yağ'] },
  { id: 'tahin', name: 'Tahin', emoji: '🥜', category: 'diger', ageGroup: '8m', calories: 595, allergens: ['sesame'], nutrients: ['Kalsiyum', 'Demir'] },
  { id: 'pekmez', name: 'Pekmez', emoji: '🍯', category: 'diger', ageGroup: '8m', calories: 293, allergens: [], nutrients: ['Demir', 'Kalsiyum'] },
  { id: 'domates_sosu', name: 'Domates Sosu', emoji: '🍅', category: 'diger', ageGroup: '8m', calories: 29, allergens: [], nutrients: ['C Vitamini', 'Likopen'] },
  { id: 'tavuk_suyu', name: 'Tavuk Suyu', emoji: '🍲', category: 'diger', ageGroup: '6m', calories: 15, allergens: [], nutrients: ['Protein'] },
  { id: 'limon_suyu', name: 'Limon Suyu', emoji: '🍋', category: 'diger', ageGroup: '12m+', calories: 22, allergens: [], nutrients: ['C Vitamini'] },
  { id: 'portakal_suyu', name: 'Portakal Suyu', emoji: '🍊', category: 'diger', ageGroup: '12m+', calories: 45, allergens: [], nutrients: ['C Vitamini'] },
  { id: 'badem', name: 'Badem', emoji: '🥜', category: 'diger', ageGroup: '12m+', calories: 579, allergens: ['tree_nut'], nutrients: ['E Vitamini', 'Kalsiyum'] },
  { id: 'ceviz', name: 'Ceviz', emoji: '🥜', category: 'diger', ageGroup: '12m+', calories: 654, allergens: ['tree_nut'], nutrients: ['Omega-3', 'Protein'] },
  { id: 'bebek_biskuvisi', name: 'Bebek Bisküvisi', emoji: '🍪', category: 'diger', ageGroup: '8m', calories: 430, allergens: ['wheat', 'milk'], nutrients: ['Karbonhidrat'] },
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
