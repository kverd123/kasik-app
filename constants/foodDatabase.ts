/**
 * Kaşık — Bebek Gıda Veritabanı
 * Her gıdanın verilebileceği minimum ay bilgisi
 * Kaynak: Dr. Erdal Pazar Ek Gıda Rehberi + PDF beslenme verileri
 */

export interface FoodItem {
  name: string;
  category: FoodCategory;
  minMonth: number; // Minimum başlangıç ayı
  emoji: string;
  isAllergen?: boolean; // * ile işaretli olanlar
}

export type FoodCategory =
  | 'fruit'
  | 'vegetable'
  | 'nut'
  | 'legume'
  | 'spice'
  | 'grain'
  | 'oil'
  | 'meat'
  | 'dairy'
  | 'other';

export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  fruit: 'Meyveler',
  vegetable: 'Sebzeler',
  nut: 'Kuruyemişler',
  legume: 'Kurubaklagiller',
  spice: 'Baharatlar',
  grain: 'Tahıllar',
  oil: 'Yağlar',
  meat: 'Et & Balık',
  dairy: 'Süt Ürünleri',
  other: 'Diğer',
};

// ============================================================
// MEYVELER
// ============================================================
const FRUITS: FoodItem[] = [
  { name: 'Ananas', category: 'fruit', minMonth: 6, emoji: '🍍' },
  { name: 'Armut', category: 'fruit', minMonth: 6, emoji: '🍐' },
  { name: 'Avokado', category: 'fruit', minMonth: 6, emoji: '🥑' },
  { name: 'Ayva', category: 'fruit', minMonth: 6, emoji: '🍏' },
  { name: 'Böğürtlen', category: 'fruit', minMonth: 12, emoji: '🫐' },
  { name: 'Çilek', category: 'fruit', minMonth: 12, emoji: '🍓', isAllergen: true },
  { name: 'Dut', category: 'fruit', minMonth: 12, emoji: '🫐' },
  { name: 'Elma', category: 'fruit', minMonth: 6, emoji: '🍎' },
  { name: 'Erik', category: 'fruit', minMonth: 6, emoji: '🫐' },
  { name: 'Greyfurt', category: 'fruit', minMonth: 12, emoji: '🍊' },
  { name: 'İncir', category: 'fruit', minMonth: 8, emoji: '🫒' },
  { name: 'Kavun', category: 'fruit', minMonth: 6, emoji: '🍈' },
  { name: 'Karpuz', category: 'fruit', minMonth: 6, emoji: '🍉' },
  { name: 'Kayısı', category: 'fruit', minMonth: 6, emoji: '🍑' },
  { name: 'Kivi', category: 'fruit', minMonth: 10, emoji: '🥝', isAllergen: true },
  { name: 'Kiraz', category: 'fruit', minMonth: 8, emoji: '🍒' },
  { name: 'Mango', category: 'fruit', minMonth: 8, emoji: '🥭' },
  { name: 'Muz', category: 'fruit', minMonth: 6, emoji: '🍌' },
  { name: 'Nar', category: 'fruit', minMonth: 8, emoji: '🍎' },
  { name: 'Portakal', category: 'fruit', minMonth: 6, emoji: '🍊' },
  { name: 'Şeftali', category: 'fruit', minMonth: 6, emoji: '🍑' },
  { name: 'Mandalina', category: 'fruit', minMonth: 6, emoji: '🍊' },
  { name: 'Üzüm', category: 'fruit', minMonth: 6, emoji: '🍇' },
  { name: 'Vişne', category: 'fruit', minMonth: 8, emoji: '🍒' },
  { name: 'Yaban mersini', category: 'fruit', minMonth: 9, emoji: '🫐' },
  { name: 'Trabzon hurması', category: 'fruit', minMonth: 8, emoji: '🍊' },
];

// ============================================================
// SEBZELER
// ============================================================
const VEGETABLES: FoodItem[] = [
  { name: 'Bakla', category: 'vegetable', minMonth: 24, emoji: '🫛', isAllergen: true },
  { name: 'Balkabağı', category: 'vegetable', minMonth: 6, emoji: '🎃' },
  { name: 'Bamya', category: 'vegetable', minMonth: 6, emoji: '🥒' },
  { name: 'Bezelye', category: 'vegetable', minMonth: 6, emoji: '🫛' },
  { name: 'Biber', category: 'vegetable', minMonth: 6, emoji: '🫑' },
  { name: 'Brokoli', category: 'vegetable', minMonth: 6, emoji: '🥦' },
  { name: 'Enginar', category: 'vegetable', minMonth: 6, emoji: '🥬' },
  { name: 'Havuç', category: 'vegetable', minMonth: 6, emoji: '🥕' },
  { name: 'Ispanak', category: 'vegetable', minMonth: 7, emoji: '🥬' },
  { name: 'Kabak', category: 'vegetable', minMonth: 6, emoji: '🎃' },
  { name: 'Karalahana', category: 'vegetable', minMonth: 12, emoji: '🥬' },
  { name: 'Karnabahar', category: 'vegetable', minMonth: 8, emoji: '🥦' },
  { name: 'Kereviz', category: 'vegetable', minMonth: 6, emoji: '🥬' },
  { name: 'Lahana', category: 'vegetable', minMonth: 6, emoji: '🥬' },
  { name: 'Mantar', category: 'vegetable', minMonth: 12, emoji: '🍄' },
  { name: 'Patates', category: 'vegetable', minMonth: 6, emoji: '🥔' },
  { name: 'Tatlı patates', category: 'vegetable', minMonth: 6, emoji: '🍠' },
  { name: 'Taze soğan', category: 'vegetable', minMonth: 7, emoji: '🧅' },
  { name: 'Patlıcan', category: 'vegetable', minMonth: 12, emoji: '🍆', isAllergen: true },
  { name: 'Pırasa', category: 'vegetable', minMonth: 6, emoji: '🧅' },
  { name: 'Semizotu', category: 'vegetable', minMonth: 6, emoji: '🥬' },
  { name: 'Soğan', category: 'vegetable', minMonth: 8, emoji: '🧅' },
  { name: 'Yer Elması', category: 'vegetable', minMonth: 6, emoji: '🥔' },
  { name: 'Yeşil Fasulye', category: 'vegetable', minMonth: 6, emoji: '🫛' },
  { name: 'Pazı', category: 'vegetable', minMonth: 6, emoji: '🥬' },
  { name: 'Soya', category: 'vegetable', minMonth: 7, emoji: '🫘', isAllergen: true },
  { name: 'Sarımsak', category: 'vegetable', minMonth: 7, emoji: '🧄' },
  { name: 'Börülce', category: 'vegetable', minMonth: 8, emoji: '🫘' },
  { name: 'Maydanoz', category: 'vegetable', minMonth: 6, emoji: '🌿' },
  { name: 'Dereotu', category: 'vegetable', minMonth: 6, emoji: '🌿' },
  { name: 'Pancar', category: 'vegetable', minMonth: 8, emoji: '🥬' },
  { name: 'Domates', category: 'vegetable', minMonth: 7, emoji: '🍅' },
];

// ============================================================
// KURUYEMİŞLER
// ============================================================
const NUTS: FoodItem[] = [
  { name: 'Ceviz', category: 'nut', minMonth: 6, emoji: '🥜' },
  { name: 'Badem', category: 'nut', minMonth: 6, emoji: '🥜' },
  { name: 'Fındık', category: 'nut', minMonth: 6, emoji: '🌰' },
  { name: 'Fıstık', category: 'nut', minMonth: 6, emoji: '🥜' },
  { name: 'Kaju', category: 'nut', minMonth: 6, emoji: '🥜' },
  { name: 'Antep fıstığı', category: 'nut', minMonth: 6, emoji: '🥜' },
  { name: 'Leblebi', category: 'nut', minMonth: 12, emoji: '🫘' },
  { name: 'Kabak çekirdeği', category: 'nut', minMonth: 12, emoji: '🎃' },
  { name: 'Ay çekirdeği', category: 'nut', minMonth: 12, emoji: '🌻' },
  { name: 'Kuru üzüm', category: 'nut', minMonth: 8, emoji: '🍇' },
];

// ============================================================
// KURUBAKLAGİLLER
// ============================================================
const LEGUMES: FoodItem[] = [
  { name: 'Nohut', category: 'legume', minMonth: 8, emoji: '🫘' },
  { name: 'Kırmızı mercimek', category: 'legume', minMonth: 8, emoji: '🫘' },
  { name: 'Yeşil mercimek', category: 'legume', minMonth: 8, emoji: '🫘' },
  { name: 'Mercimek', category: 'legume', minMonth: 8, emoji: '🫘' },
  { name: 'Kuru fasulye', category: 'legume', minMonth: 8, emoji: '🫘' },
  { name: 'Barbunya', category: 'legume', minMonth: 8, emoji: '🫘' },
];

// ============================================================
// BAHARATLAR
// ============================================================
const SPICES: FoodItem[] = [
  { name: 'Tuz', category: 'spice', minMonth: 12, emoji: '🧂' },
  { name: 'Karabiber', category: 'spice', minMonth: 8, emoji: '🌶️' },
  { name: 'Kekik', category: 'spice', minMonth: 8, emoji: '🌿' },
  { name: 'Nane', category: 'spice', minMonth: 7, emoji: '🌿' },
  { name: 'Zerdeçal', category: 'spice', minMonth: 9, emoji: '🟡' },
  { name: 'Zencefil', category: 'spice', minMonth: 9, emoji: '🫚' },
  { name: 'Tarçın', category: 'spice', minMonth: 8, emoji: '🟤' },
  { name: 'Susam', category: 'spice', minMonth: 8, emoji: '🫓' },
];

// ============================================================
// TAHILLAR
// ============================================================
const GRAINS: FoodItem[] = [
  { name: 'Buğday', category: 'grain', minMonth: 6, emoji: '🌾' },
  { name: 'Bulgur', category: 'grain', minMonth: 8, emoji: '🌾' },
  { name: 'Yulaf', category: 'grain', minMonth: 6, emoji: '🥣' },
  { name: 'Mısır', category: 'grain', minMonth: 6, emoji: '🌽' },
  { name: 'Çavdar', category: 'grain', minMonth: 7, emoji: '🌾' },
  { name: 'Pirinç unu', category: 'grain', minMonth: 6, emoji: '🍚' },
  { name: 'Buğday ruşeymi', category: 'grain', minMonth: 8, emoji: '🌾' },
  { name: 'Bebek irmiği', category: 'grain', minMonth: 6, emoji: '🥣' },
  { name: 'Keçiboynuzu unu', category: 'grain', minMonth: 7, emoji: '🟤' },
  { name: 'Siyez unu', category: 'grain', minMonth: 7, emoji: '🌾' },
  { name: 'Pirinç', category: 'grain', minMonth: 6, emoji: '🍚' },
  { name: 'Arpa', category: 'grain', minMonth: 6, emoji: '🌾' },
  { name: 'Tam buğday unu', category: 'grain', minMonth: 8, emoji: '🌾' },
];

// ============================================================
// YAĞLAR
// ============================================================
const OILS: FoodItem[] = [
  { name: 'Zeytin', category: 'oil', minMonth: 12, emoji: '🫒' },
  { name: 'Zeytinyağı', category: 'oil', minMonth: 6, emoji: '🫒' },
  { name: 'Tereyağı', category: 'oil', minMonth: 6, emoji: '🧈' },
  { name: 'Sade yağ', category: 'oil', minMonth: 7, emoji: '🧈' },
];

// ============================================================
// ET & BALIK
// ============================================================
const MEATS: FoodItem[] = [
  { name: 'Balık', category: 'meat', minMonth: 8, emoji: '🐟', isAllergen: true },
  { name: 'Tavuk', category: 'meat', minMonth: 7, emoji: '🍗' },
  { name: 'Hindi', category: 'meat', minMonth: 7, emoji: '🦃' },
  { name: 'Kırmızı et', category: 'meat', minMonth: 6, emoji: '🥩' },
  { name: 'Dana eti', category: 'meat', minMonth: 6, emoji: '🥩' },
  { name: 'Kuzu eti', category: 'meat', minMonth: 6, emoji: '🥩' },
  { name: 'Kuzu kıyma', category: 'meat', minMonth: 6, emoji: '🥩' },
  { name: 'Dana kıyma', category: 'meat', minMonth: 6, emoji: '🥩' },
];

// ============================================================
// SÜT ÜRÜNLERİ & DİĞER
// ============================================================
const DAIRY: FoodItem[] = [
  { name: 'Yumurta sarısı', category: 'dairy', minMonth: 6, emoji: '🥚' },
  { name: 'Yumurta beyazı', category: 'dairy', minMonth: 8, emoji: '🥚' },
  { name: 'Yumurta', category: 'dairy', minMonth: 8, emoji: '🥚' },
  { name: 'Yoğurt', category: 'dairy', minMonth: 6, emoji: '🥛' },
  { name: 'Lor peyniri', category: 'dairy', minMonth: 6, emoji: '🧀' },
  { name: 'Peynir', category: 'dairy', minMonth: 8, emoji: '🧀' },
  { name: 'İnek sütü', category: 'dairy', minMonth: 12, emoji: '🥛' },
  { name: 'Kefir', category: 'dairy', minMonth: 12, emoji: '🥛' },
];

const OTHER: FoodItem[] = [
  { name: 'Pekmez', category: 'other', minMonth: 7, emoji: '🍯' },
  { name: 'Tahin', category: 'other', minMonth: 8, emoji: '🫓' },
  { name: 'Ihlamur', category: 'other', minMonth: 6, emoji: '🍵' },
  { name: 'Ada çayı', category: 'other', minMonth: 24, emoji: '🍵' },
  { name: 'Reçel', category: 'other', minMonth: 12, emoji: '🍯' },
  { name: 'Kakao', category: 'other', minMonth: 12, emoji: '🍫' },
  { name: 'Su', category: 'other', minMonth: 6, emoji: '💧' },
  { name: 'Anne sütü', category: 'other', minMonth: 0, emoji: '🤱' },
  { name: 'Formül', category: 'other', minMonth: 0, emoji: '🍼' },
  { name: 'Anne sütü veya formül', category: 'other', minMonth: 0, emoji: '🍼' },
];

// ============================================================
// TÜM GIDALAR
// ============================================================
export const ALL_FOODS: FoodItem[] = [
  ...FRUITS,
  ...VEGETABLES,
  ...NUTS,
  ...LEGUMES,
  ...SPICES,
  ...GRAINS,
  ...OILS,
  ...MEATS,
  ...DAIRY,
  ...OTHER,
];

/**
 * Belirli bir ay için verilebilecek tüm gıdaları döndürür
 */
export function getAllowedFoods(month: number): FoodItem[] {
  return ALL_FOODS.filter((f) => f.minMonth <= month);
}

/**
 * Belirli bir ay için verilebilecek gıda isimlerini döndürür (lowercase)
 */
export function getAllowedFoodNames(month: number): string[] {
  return getAllowedFoods(month).map((f) => f.name.toLowerCase());
}

/**
 * Bir gıdanın belirli ayda verilebilir olup olmadığını kontrol eder
 */
export function isFoodAllowed(foodName: string, month: number): boolean {
  const lower = foodName.toLowerCase();
  const food = ALL_FOODS.find((f) => f.name.toLowerCase() === lower || lower.includes(f.name.toLowerCase()));
  if (!food) return true; // Bilinmeyen gıda → izin ver (güvenli taraf)
  return food.minMonth <= month;
}

/**
 * Bir tarifin tüm malzemelerinin belirli ayda verilebilir olup olmadığını kontrol eder
 * Verilemeyen malzemeleri döndürür
 */
export function getNotAllowedIngredients(ingredientNames: string[], month: number): string[] {
  return ingredientNames.filter((name) => !isFoodAllowed(name, month));
}

/**
 * Ek gıda başlangıç sırası (önerilen)
 * 1. Sebze püresi → 2. Yoğurt/kefir → 3. Meyve püresi
 * 4. Tahıllar → 5. Kahvaltı (yumurta, peynir) → 6. Et/protein
 */
export const FOOD_INTRO_ORDER: FoodCategory[] = [
  'vegetable', 'dairy', 'fruit', 'grain', 'other', 'meat', 'nut', 'legume', 'spice', 'oil',
];

/**
 * Mevsimsel gıda takvimi
 * Her ay için o mevsimde taze bulunan sebze ve meyveler
 */
export const SEASONAL_FOODS: Record<number, { vegetables: string[]; fruits: string[] }> = {
  1: { // Ocak
    vegetables: ['Lahana', 'Brokoli', 'Havuç', 'Pırasa', 'Balkabağı', 'Ispanak', 'Karnabahar', 'Maydanoz', 'Kereviz', 'Taze soğan', 'Pancar'],
    fruits: ['Portakal', 'Nar', 'Greyfurt', 'Elma', 'Armut', 'Mandalina', 'Ayva', 'Kivi', 'Muz', 'Avokado'],
  },
  2: { // Şubat
    vegetables: ['Lahana', 'Brokoli', 'Havuç', 'Pırasa', 'Balkabağı', 'Ispanak', 'Karnabahar', 'Maydanoz', 'Kereviz', 'Taze soğan', 'Pancar'],
    fruits: ['Portakal', 'Nar', 'Greyfurt', 'Elma', 'Armut', 'Mandalina', 'Ayva', 'Kivi', 'Muz', 'Avokado'],
  },
  3: { // Mart
    vegetables: ['Lahana', 'Brokoli', 'Havuç', 'Pırasa', 'Balkabağı', 'Ispanak', 'Karnabahar', 'Maydanoz', 'Kereviz', 'Taze soğan', 'Pancar'],
    fruits: ['Portakal', 'Nar', 'Greyfurt', 'Elma', 'Armut', 'Mandalina', 'Ayva', 'Kivi', 'Muz', 'Avokado'],
  },
  4: { // Nisan
    vegetables: ['Semizotu', 'Sarımsak', 'Taze soğan', 'Enginar', 'Bezelye', 'Havuç', 'Lahana', 'Karnabahar', 'Brokoli', 'Maydanoz'],
    fruits: ['Erik', 'Avokado', 'Portakal', 'Muz'],
  },
  5: { // Mayıs
    vegetables: ['Domates', 'Yeşil Fasulye', 'Enginar', 'Bezelye', 'Pazı', 'Pırasa', 'Semizotu', 'Maydanoz'],
    fruits: ['Çilek', 'Dut', 'Erik', 'Muz', 'Elma', 'Böğürtlen'],
  },
  6: { // Haziran
    vegetables: ['Kabak', 'Yeşil Fasulye', 'Domates', 'Biber', 'Semizotu', 'Bamya', 'Dereotu'],
    fruits: ['Kavun', 'Karpuz', 'Kiraz', 'Şeftali', 'Kayısı', 'Erik', 'Muz', 'Çilek', 'Yaban mersini'],
  },
  7: { // Temmuz
    vegetables: ['Kabak', 'Yeşil Fasulye', 'Domates', 'Biber', 'Semizotu', 'Bamya', 'Dereotu'],
    fruits: ['Kavun', 'Karpuz', 'Kiraz', 'Şeftali', 'Kayısı', 'Muz', 'Yaban mersini', 'Armut'],
  },
  8: { // Ağustos
    vegetables: ['Kabak', 'Yeşil Fasulye', 'Domates', 'Biber', 'Bamya'],
    fruits: ['Üzüm', 'İncir', 'Karpuz', 'Şeftali', 'Kayısı', 'Böğürtlen', 'Yaban mersini', 'Vişne'],
  },
  9: { // Eylül
    vegetables: ['Kabak', 'Yeşil Fasulye', 'Domates', 'Biber', 'Bamya'],
    fruits: ['Üzüm', 'İncir', 'Karpuz', 'Şeftali', 'Kayısı', 'Böğürtlen', 'Yaban mersini', 'Vişne'],
  },
  10: { // Ekim
    vegetables: ['Pırasa', 'Mantar', 'Lahana', 'Ispanak', 'Havuç', 'Yer Elması', 'Kereviz', 'Karnabahar'],
    fruits: ['Mandalina', 'Elma', 'Armut', 'İncir', 'Nar', 'Muz', 'Üzüm'],
  },
  11: { // Kasım
    vegetables: ['Havuç', 'Yer Elması', 'Pırasa', 'Ispanak', 'Karnabahar', 'Pazı', 'Brokoli', 'Balkabağı', 'Kereviz'],
    fruits: ['Ayva', 'Nar', 'Trabzon hurması', 'Greyfurt', 'Elma', 'Kivi', 'Portakal', 'Mandalina', 'Armut', 'Muz'],
  },
  12: { // Aralık
    vegetables: ['Yer Elması', 'Pırasa', 'Ispanak', 'Karnabahar', 'Brokoli', 'Balkabağı', 'Kereviz'],
    fruits: ['Avokado', 'Ayva', 'Nar', 'Trabzon hurması', 'Greyfurt', 'Elma', 'Kivi', 'Portakal', 'Mandalina', 'Armut', 'Muz'],
  },
};

/**
 * Şu anki mevsimde taze olan ve bebek ayına uygun gıdaları döndürür
 */
export function getSeasonalAllowedFoods(babyMonth: number): string[] {
  const calendarMonth = new Date().getMonth() + 1; // 1-12
  const seasonal = SEASONAL_FOODS[calendarMonth];
  if (!seasonal) return [];
  const allSeasonal = [...seasonal.vegetables, ...seasonal.fruits];
  return allSeasonal.filter((name) => isFoodAllowed(name, babyMonth));
}

/**
 * Bebeğin ayına göre önerilen günlük öğün sayısı
 * 6. ay ilk 1 ay: 1 öğün (tattırma dönemi)
 * 6-8 ay: 2 öğün
 * 8-10 ay: 3 öğün
 * 10-12 ay: 4 öğün
 */
export function getRecommendedMealsPerDay(month: number): number {
  if (month <= 6) return 1;
  if (month <= 8) return 2;
  if (month <= 10) return 3;
  return 4;
}

/**
 * 3 Gün Kuralı: Yeni besinler tek tek tanıtılır
 * İlk gün 1-2 tatlı kaşığı, sonraki günler 2 katı
 * İlk 1 ay tattırma dönemi — amaç karnını doyurmak değil
 * 1 öğün = 1 çay bardağı = 150 ml
 */
/**
 * 1 YAŞINA KADAR VERİLMEMESİ GEREKEN GIDALAR
 */
export const BANNED_FOODS_UNDER_1: { name: string; reason: string }[] = [
  { name: 'Tuz', reason: 'Böbrekler için yük oluşturur, bağımlılık yapar.' },
  { name: 'Şeker', reason: 'Böbrekler için yük oluşturur, bağımlılık yapar.' },
  { name: 'İnek sütü', reason: 'Kansızlık ve kabızlık yapar, böbreklere yük oluşturur. 2 yaşa kadar direkt içilmesi önerilmez.' },
  { name: 'Keçi sütü', reason: 'Kansızlık ve kabızlık yapar, böbreklere yük oluşturur.' },
  { name: 'Bal', reason: 'Bebeklerde mide asidi zayıf olduğu için Botulizm (zehirlenme) riski vardır.' },
  { name: 'Bakla', reason: 'Favizm (kan yıkımı ile giden hastalık) riski nedeniyle 2 yaşa kadar önerilmez.' },
  { name: 'Patlıcan', reason: 'Besleyici değeri zayıf, nikotin içeriği fazladır. 2 yaşa kadar önerilmez.' },
];

export const FOOD_SAFETY_RULES = [
  'Her zaman mevsiminde olan taze meyve-sebze kullanın.',
  'Uygun biçimde yıkayıp temizleyerek pişirin, taze sunun.',
  'Isıtılmış veya dünden kalmış besinler verilmez.',
  'Buhar, tencere, ızgara, fırın veya tavada pişirme idealdir.',
  'Kızartma hiçbir zaman önerilmez.',
  'Donmuş, konserve ve kavanoz gıdalar besin değerini kaybeder.',
];

export const FEEDING_RULES = {
  THREE_DAY_RULE: 'Her yeni besine 3 gün boyunca devam edin, alerji belirtilerini takip edin.',
  FIRST_MONTH: 'İlk 1 ay tattırma dönemidir. Amaç karnını doyurmak değil, çiğneme ve yutma becerilerini izlemektir.',
  STARTING_AMOUNT: 'İlk gün 1-2 tatlı kaşığı ile başlayın, sonraki günler 2 katına çıkabilirsiniz.',
  MEAL_SIZE: '1 öğün = 1 çay bardağı = yaklaşık 150 ml',
  TIMING: 'Sabah kahvaltı saatinde, uyanıp emdikten 1-2 saat sonra teklif edin.',
  ALLERGY_WATCH: 'Alerjik reaksiyonları ve bağırsak hareketlerini izleyin.',
  VEGGIE_PRIORITY: 'Sebze her dönem çocuk beslenmesinde önceliklidir. Her gün mutlaka bir öğün sebze/meyve içermelidir.',
  FRUIT_LIMIT: 'Meyveler şekerli olduğu için sınırlı tüketim gerekir.',
  SEASONAL: 'Sebze ve meyveler mevsiminde, taze olanları tercih edin.',
  MEAT_INTRO: '6-7 ay: çift çekilmiş kuzu kıyma çorbalara katılır. 8 ay+: köfte şeklinde verilebilir.',
  LIVER: 'Ciğer demir açısından zengindir, 9 aydan sonra püre halinde çorba/yemeklere katılabilir.',
  FISH: 'Hamsi, palamut, sardalya, somon gibi deniz balıkları tercih edilmeli. Haftada 1-2 kez, kızartma olmadan.',
  OIL: 'Sızma zeytinyağı püre ve çorbalara eklenmelidir. Kızartma hiçbir zaman önerilmez.',
  NO_PEKMEZ: 'Pekmez yerine günde 1 tatlı kaşığı soğuk sıkım meyve özleri (keçiboynuzu, karadut) tercih edin.',
};

/**
 * Aya göre detaylı beslenme rehberi
 * Dr. Erdal Pazar rehberliğinde
 */
export interface MonthlyGuide {
  month: string;
  mealCount: number;
  mealSize: string;
  weeklyPlan: string[];
  tips: string[];
  newFoods: string[];
}

export const MONTHLY_GUIDES: MonthlyGuide[] = [
  {
    month: '5-6. Ay',
    mealCount: 1,
    mealSize: 'Günlük toplam 1 çay bardağını geçmesin',
    weeklyPlan: [
      '1. Hafta: Sebze püresi (patates-kabak-brokoli-havuç-kereviz-karnabahar) buharda haşlanmış, süzgeçten geçirilmiş, 1 tatlı kaşığı sızma zeytinyağı ile. İlk gün 2 kaşık, 2. gün 4, 3. gün 8 kaşık.',
      '2. Hafta: Yoğurt (cam kavanozda evde mayalanmış, 1 gün dinlendirilmiş). 2-4-8 kaşık artırarak.',
      '3. Hafta: Meyve püresi (elma, armut, avokado, muz). Cam rende ile püre. Daha önce denediğiniz besinlerle karıştırabilirsiniz (elmalı yoğurt gibi). Pirinç unlu muhallebi (irmik, yulaf, arpa, rüşeym, mısır unu da olur).',
      '4. Hafta: Kahvaltılıklar. Yumurta sarısı (haşlanmış, kayısı kıvamında, ilk 3 gün çeyrek, sonra yarım). Az tuzlu peynir (lor, krem, labne). Ceviz (suda bekletilmiş, toz halinde). Zeytin ezmesi.',
    ],
    tips: [
      'Günde 1 defa sabah saatlerinde bebek keyifli ve istekliyken deneyin.',
      'Önce ek gıdayı yediği kadar, sonra anne sütü/mama ile doyurun.',
      'Sebzeleri 2-3lü karışım olarak deneyebilirsiniz.',
      'Yumurta beyazını 7-8 aylık olunca verin.',
      '8 aya kadar günlük yarım veya 2 günde 1 tam yumurta sarısı.',
    ],
    newFoods: ['Kabak', 'Havuç', 'Patates', 'Brokoli', 'Kereviz', 'Karnabahar', 'Yoğurt', 'Elma', 'Armut', 'Avokado', 'Muz', 'Pirinç unu', 'Yumurta sarısı', 'Lor peyniri', 'Ceviz', 'Zeytinyağı'],
  },
  {
    month: '6-8. Ay',
    mealCount: 2,
    mealSize: 'Her öğünde yarım porsiyon, ay sonunda her öğünde 1 çay bardağı hedef',
    weeklyPlan: [
      'Kahvaltı saatinde yarım porsiyon + ikindi vakti yarım porsiyon.',
      'Çorba: Sebze, tarhana, yayla, ezogelin çeşitleri. Kuzu kıyma çorbalara katılır.',
      'Mercimek çorbası 7. ayda başlanabilir. Tavuk suyu, balık çorbası verilebilir.',
      'Asitli meyveler (narenciye, limon, nar) bu ayda başlanabilir.',
      'Alerjik besinleri erken tanıtın: çilek, domates, kivi, yumurta, susam, kuruyemiş (mevsime uygun olanları).',
    ],
    tips: [
      'Günlük 1 çay bardağı kadar yemeye başladıysa bunu 2 öğüne bölün.',
      'Çok yemiyorsa endişe etmeyin, çeşitleri artırmaya devam edin.',
      'Farklı tatları denemesi için en uygun zamandayız.',
      'Pırasa, ıspanak, kereviz, karnabahar, havuç, yer elması, roka, maydanoz gibi sebzeleri çeşitlendirin.',
      'Çorbalara evde hazırlanmış et-kemik suyu katabilirsiniz.',
    ],
    newFoods: ['Kuzu kıyma', 'Mercimek', 'Tavuk', 'Tarhana', 'Portakal', 'Nar', 'Domates', 'Ispanak', 'Taze soğan', 'Sarımsak', 'Balık'],
  },
  {
    month: '8-10. Ay',
    mealCount: 3,
    mealSize: 'Her öğünde 1 çay bardağı',
    weeklyPlan: [
      'Kendi kendine beslenme dönemi: buharda yumuşatılmış küp veya parmak şeklinde sebze-meyve.',
      'Et: Kuzu kıyma devam, dana kıyma, sulu köfte, yağsız et, tavuk butu, balık eti.',
      'Taneli gıdalar: Pirinç pilavı, dolma içi, bulgur pilavı, ev yapımı erişte.',
      'Bakliyat: Mercimek, nohut, barbunya, kuru fasulye (geceden suda bekletip kabuk soyun).',
      'Keten tohumu, çiya: 1 çay kaşığı 30 dk ılık suda bekletip çorba/yoğurta katın.',
    ],
    tips: [
      'Çorbalardaki pirinç ve kıymayı blenderdan geçirmeyin, lapa olarak tüketebilir.',
      'Boğulma tehlikesi için kontrollü gidin, bebeği gözlemleyin.',
      'Mevsim değişiyor, yeni sebze-meyveleri denemeye devam edin.',
      'Kinoa ve kara buğday tahıl olarak kullanılabilir.',
      'Bakliyat hazımsızlık yapmaması için geceden suda bekletin, kabukları soyun.',
    ],
    newFoods: ['Dana kıyma', 'Nohut', 'Kuru fasulye', 'Barbunya', 'Bulgur', 'Keten tohumu', 'Çiya', 'Kinoa'],
  },
  {
    month: '10-12. Ay',
    mealCount: 4,
    mealSize: 'Aile sofrasından porsiyon',
    weeklyPlan: [
      'Aile sofrasında aynı yemeklerden yemeye başlayabilir.',
      'Az tuzlu ve acısız baharatlardan tadabilir.',
      'Bal, inek sütü, bakla, patlıcan hariç her besinden tüketebilir.',
      'Kestane, fındık, ciğer, susam-tahin, böğürtlen, muşmula deneyin.',
    ],
    tips: [
      '1 yaşa kadar yasak: bal, inek sütü, bakla, patlıcan.',
      'Yemeklere az tuz ekleyebilirsiniz ama ayrıca tuz eklemeyin.',
      'Kızartma hala önerilmez.',
      'Süt ürünlerini yemeklerin içine katarak kullanabilirsiniz (sütlaç, çorba).',
    ],
    newFoods: ['Kestane', 'Fındık', 'Ciğer', 'Susam', 'Tahin', 'Böğürtlen', 'Muşmula'],
  },
];

/**
 * Kategoriye göre gıdaları grupla
 */
export function getFoodsByCategory(month: number): Record<FoodCategory, FoodItem[]> {
  const allowed = getAllowedFoods(month);
  const grouped: Record<FoodCategory, FoodItem[]> = {
    fruit: [], vegetable: [], nut: [], legume: [], spice: [],
    grain: [], oil: [], meat: [], dairy: [], other: [],
  };
  for (const food of allowed) {
    grouped[food.category].push(food);
  }
  return grouped;
}
