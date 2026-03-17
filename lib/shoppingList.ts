/**
 * Kaşık — Haftalık Alışveriş Listesi Oluşturucu
 * Haftalık yemek planındaki tariflerin malzemelerini toplar,
 * birleştirir, kategoriye göre gruplar.
 * Akıllı miktar hesabı: dolapta yeterli mi? Bayatlayacak mı?
 */

import { Meal, MealSlot, PantryCategory } from '../types';
import { RECIPES_BY_ID, RecipeIngredient, ALL_RECIPES, RecipeData } from '../constants/recipes';
import { getSeasonalStatus, getSeasonalAlternatives, getOrganicInfo, SeasonalStatus } from '../constants/seasonal';

// ===== TİP TANIMLARI =====

export interface ShoppingItem {
  id: string;
  name: string;
  emoji: string;
  amount: number;         // Toplam gereken miktar
  unit: string;
  category: PantryCategory;
  inPantry: boolean;      // Dolapta var mı?
  pantryAmount: number;   // Dolapta ne kadar var
  toBuyAmount: number;    // Alınması gereken miktar
  pantryExpiring: boolean; // Dolapta var ama bayatlayacak
  pantryDaysLeft?: number; // Dolapta kaç gün kaldı
  checked: boolean;
  fromRecipes: string[];
  seasonalStatus?: SeasonalStatus | null; // Mevsimsel durum
  isOrganic?: boolean;                    // Organik bulunabilir mi
  organicTip?: string;                    // Organik ipucu
  seasonalAlternative?: string;           // Mevsim dışıysa alternatif öneri
}

export interface ShoppingCategory {
  category: PantryCategory;
  emoji: string;
  label: string;
  items: ShoppingItem[];
}

// ===== Dolap verisi tipi =====

export interface PantryItemForShopping {
  name: string;
  emoji?: string;
  amount: number;
  unit: string;
  daysLeft?: number; // -1 = kuru gıda
}

// ===== KATEGORİ TAHMİN SİSTEMİ =====

const INGREDIENT_CATEGORY_MAP: Record<string, PantryCategory> = {
  // Sebzeler
  havuç: 'sebze', patates: 'sebze', brokoli: 'sebze', kabak: 'sebze',
  bezelye: 'sebze', ıspanak: 'sebze', domates: 'sebze', soğan: 'sebze',
  sarımsak: 'sebze', pırasa: 'sebze', kereviz: 'sebze', biber: 'sebze',
  turp: 'sebze', pancar: 'sebze', enginar: 'sebze', bamya: 'sebze',
  fasulye: 'sebze', karnabahar: 'sebze', lahana: 'sebze', marul: 'sebze',
  salatalık: 'sebze', patlıcan: 'sebze', semizotu: 'sebze',
  'tatlı patates': 'sebze', 'kırmızı biber': 'sebze',

  // Meyveler
  elma: 'meyve', muz: 'meyve', armut: 'meyve', portakal: 'meyve',
  avokado: 'meyve', mango: 'meyve', kayısı: 'meyve', erik: 'meyve',
  şeftali: 'meyve', çilek: 'meyve', karpuz: 'meyve', kavun: 'meyve',
  üzüm: 'meyve', hurma: 'meyve', incir: 'meyve', limon: 'meyve',
  'hurma ezmesi': 'meyve',

  // Protein
  tavuk: 'protein', et: 'protein', balık: 'protein', yumurta: 'protein',
  mercimek: 'protein', nohut: 'protein', kıyma: 'protein',
  'tavuk göğsü': 'protein', 'yumurta sarısı': 'protein',
  'kırmızı mercimek': 'protein', 'yeşil mercimek': 'protein',
  hindi: 'protein', somon: 'protein', ton: 'protein', dana: 'protein',
  kuzu: 'protein',

  // Tahıllar
  pirinç: 'tahil', bulgur: 'tahil', yulaf: 'tahil', makarna: 'tahil',
  ekmek: 'tahil', un: 'tahil', irmik: 'tahil', arpa: 'tahil',
  'pirinç unu': 'tahil', 'tam buğday unu': 'tahil',

  // Süt ürünleri
  yoğurt: 'sut_urunleri', süt: 'sut_urunleri', peynir: 'sut_urunleri',
  tereyağı: 'sut_urunleri', krema: 'sut_urunleri', kefir: 'sut_urunleri',
  'anne sütü': 'sut_urunleri', 'formül süt': 'sut_urunleri',
  'labne peynir': 'sut_urunleri', lor: 'sut_urunleri',

  // Baharatlar
  tarçın: 'baharat', kimyon: 'baharat', zerdeçal: 'baharat',
  karabiber: 'baharat', tuz: 'baharat', nane: 'baharat',
  dereotu: 'baharat', maydanoz: 'baharat', fesleğen: 'baharat',
  kekik: 'baharat', defne: 'baharat',
};

const CATEGORY_DISPLAY: Record<PantryCategory, { label: string; emoji: string }> = {
  sebze: { label: 'Sebzeler', emoji: '🥬' },
  meyve: { label: 'Meyveler', emoji: '🍎' },
  protein: { label: 'Protein', emoji: '🥩' },
  tahil: { label: 'Tahıllar', emoji: '🌾' },
  sut_urunleri: { label: 'Süt Ürünleri', emoji: '🥛' },
  baharat: { label: 'Baharatlar', emoji: '🌿' },
  diger: { label: 'Diğer', emoji: '📦' },
};

function guessCategory(ingredientName: string): PantryCategory {
  const lower = ingredientName.toLowerCase().trim();
  if (INGREDIENT_CATEGORY_MAP[lower]) return INGREDIENT_CATEGORY_MAP[lower];
  for (const [key, cat] of Object.entries(INGREDIENT_CATEGORY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return cat;
  }
  return 'diger';
}

function normalizeIngredientName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

// ===== BİRİM GRUPLAMA =====
// Farklı yazılsa da aynı anlama gelen birimleri grupla
const UNIT_GROUPS: Record<string, string> = {
  'adet': 'adet',
  'küçük': 'adet',
  'orta': 'adet',
  'büyük': 'adet',
  'tane': 'adet',
  'diş': 'adet',     // sarımsak diş
  'dal': 'adet',      // maydanoz dalı
  'yaprak': 'adet',
  'dilim': 'adet',
  'demet': 'adet',
  'kaşık': 'kaşık',
  'yemek kaşığı': 'kaşık',
  'tatlı kaşığı': 'kaşık',
  'çay kaşığı': 'kaşık',
  'bardak': 'bardak',
  'su bardağı': 'bardak',
  'çay bardağı': 'bardak',
  'gram': 'gram',
  'gr': 'gram',
  'g': 'gram',
  'ml': 'ml',
  'litre': 'ml',
  'porsiyon': 'porsiyon',
};

function normalizeUnit(unit: string): string {
  const lower = unit.toLowerCase().trim();
  return UNIT_GROUPS[lower] || lower;
}

/** İki birim karşılaştırılabilir mi? */
function areUnitsComparable(unitA: string, unitB: string): boolean {
  return normalizeUnit(unitA) === normalizeUnit(unitB);
}

/** foodName ile tarif veritabanında eşleşme ara */
function findRecipeByFoodName(foodName: string): RecipeData | null {
  const lower = foodName.toLowerCase().trim();

  const exact = ALL_RECIPES.find((r) => r.title.toLowerCase() === lower);
  if (exact) return exact;

  const partial = ALL_RECIPES.find(
    (r) => r.title.toLowerCase().includes(lower) || lower.includes(r.title.toLowerCase())
  );
  if (partial) return partial;

  const foodWords = lower.split(/[\s\-]+/).filter((w) => w.length > 2);
  if (foodWords.length > 0) {
    let bestMatch: RecipeData | null = null;
    let bestScore = 0;
    for (const recipe of ALL_RECIPES) {
      const titleLower = recipe.title.toLowerCase();
      const matchCount = foodWords.filter((w) => titleLower.includes(w)).length;
      const score = matchCount / foodWords.length;
      if (score > bestScore && score >= 0.5) {
        bestScore = score;
        bestMatch = recipe;
      }
    }
    if (bestMatch) return bestMatch;
  }

  return null;
}

// ===== ANA FONKSİYON =====

// Geçici iç tip — miktar toplama için
interface NeededItem {
  name: string;
  emoji: string;
  amount: number;
  unit: string;
  category: PantryCategory;
  fromRecipes: string[];
}

/**
 * Haftalık yemek planından akıllı alışveriş listesi oluşturur.
 * Dolaptaki miktarları çıkarır, bayatlayacak ürünleri hesaba katar.
 */
export function generateShoppingList(
  weekMeals: Record<number, Record<MealSlot, Meal[]>>,
  pantryItems: PantryItemForShopping[] = []
): ShoppingCategory[] {
  // 1. Tüm günlerdeki öğünleri topla
  const allMeals: Meal[] = [];
  for (let day = 0; day < 7; day++) {
    const dayMeals = weekMeals[day];
    if (!dayMeals) continue;
    for (const slot of Object.keys(dayMeals) as MealSlot[]) {
      allMeals.push(...dayMeals[slot]);
    }
  }

  // 2. Gereken malzemeleri birleştir
  const neededMap = new Map<string, NeededItem>();

  const addIngredient = (ing: RecipeIngredient, sourceName: string) => {
    const key = normalizeIngredientName(ing.name);
    const existing = neededMap.get(key);
    if (existing) {
      if (existing.unit === ing.unit) {
        existing.amount += ing.amount;
      }
      if (!existing.fromRecipes.includes(sourceName)) {
        existing.fromRecipes.push(sourceName);
      }
    } else {
      neededMap.set(key, {
        name: ing.name,
        emoji: ing.emoji,
        amount: ing.amount,
        unit: ing.unit,
        category: guessCategory(ing.name),
        fromRecipes: [sourceName],
      });
    }
  };

  for (const meal of allMeals) {
    if (meal.recipeId) {
      const recipe = RECIPES_BY_ID[meal.recipeId];
      if (recipe) {
        for (const ing of recipe.ingredients) addIngredient(ing, recipe.title);
        continue;
      }
    }

    const matchedRecipe = findRecipeByFoodName(meal.foodName);
    if (matchedRecipe) {
      for (const ing of matchedRecipe.ingredients) addIngredient(ing, meal.foodName);
      continue;
    }

    // Eşleşmeyen öğün → basit malzeme
    const key = normalizeIngredientName(meal.foodName);
    if (!neededMap.has(key)) {
      neededMap.set(key, {
        name: meal.foodName,
        emoji: meal.emoji,
        amount: 1,
        unit: 'porsiyon',
        category: guessCategory(meal.foodName),
        fromRecipes: [meal.foodName],
      });
    } else {
      neededMap.get(key)!.amount += 1;
    }
  }

  // 3. Dolaptaki malzemelerle karşılaştır — akıllı miktar hesabı
  const itemMap = new Map<string, ShoppingItem>();

  for (const [key, needed] of neededMap) {
    // Dolapta bu malzeme var mı?
    const pantryMatch = pantryItems.find((p) => {
      const pKey = normalizeIngredientName(p.name);
      return pKey === key || pKey.includes(key) || key.includes(pKey);
    });

    let inPantry = false;
    let pantryAmount = 0;
    let toBuyAmount = needed.amount;
    let pantryExpiring = false;
    let pantryDaysLeft: number | undefined;

    if (pantryMatch) {
      inPantry = true;
      pantryDaysLeft = pantryMatch.daysLeft;

      // Tazelik kontrolü: ≤2 gün → bayatlayacak, kullanılamaz
      const isUnusable = pantryMatch.daysLeft !== undefined
        && pantryMatch.daysLeft !== -1
        && pantryMatch.daysLeft <= 2;

      if (isUnusable) {
        // Bayatlayacak → dolapta var ama kullanılamaz → yine alınacak
        pantryExpiring = true;
        toBuyAmount = needed.amount;
        pantryAmount = 0;
      } else if (areUnitsComparable(pantryMatch.unit, needed.unit)) {
        // Birimler karşılaştırılabilir → miktar farkı hesapla
        pantryAmount = pantryMatch.amount;
        toBuyAmount = Math.max(0, needed.amount - pantryMatch.amount);
      } else {
        // Birimler farklı ama dolapta var → kullanıcı zaten elinde
        // Alışveriş yükünü azalt: dolapta var kabul et
        pantryAmount = pantryMatch.amount;
        toBuyAmount = 0;
      }

      // Tazelik uyarısı: 3-5 gün arası — sadece bilgi amaçlı uyarı
      // Ama yine de kullanılabilir, alınmayacak!
      if (
        !isUnusable &&
        pantryMatch.daysLeft !== undefined &&
        pantryMatch.daysLeft !== -1 &&
        pantryMatch.daysLeft <= 5
      ) {
        pantryExpiring = true; // Uyarı göster ama alışveriş listesine ekleme
      }
    }

    // Dolapta yeterli → alınmayacak
    // pantryExpiring sadece uyarı, toBuyAmount 0 ise yine dolapta var sayılır
    const fullyInPantry = inPantry && toBuyAmount === 0;

    // Mevsimsel ve organik bilgi
    const seasonal = getSeasonalStatus(needed.name);
    const organic = getOrganicInfo(needed.name);
    let seasonalAlt: string | undefined;
    if (seasonal === 'unavailable' || seasonal === 'limited') {
      const alts = getSeasonalAlternatives(needed.name);
      if (alts.length > 0) {
        seasonalAlt = alts.slice(0, 2).map((a) => `${a.emoji} ${a.name}`).join(', ');
      }
    }

    itemMap.set(key, {
      id: `shop-${key}`,
      name: needed.name,
      emoji: needed.emoji,
      amount: needed.amount,
      unit: needed.unit,
      category: needed.category,
      inPantry: fullyInPantry,
      pantryAmount,
      toBuyAmount,
      pantryExpiring,
      pantryDaysLeft,
      checked: false,
      fromRecipes: needed.fromRecipes,
      seasonalStatus: seasonal,
      isOrganic: organic?.isOrganic,
      organicTip: organic?.tip,
      seasonalAlternative: seasonalAlt,
    });
  }

  // 4. Kategoriye göre grupla
  const categoryMap = new Map<PantryCategory, ShoppingItem[]>();
  for (const item of itemMap.values()) {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, []);
    }
    categoryMap.get(item.category)!.push(item);
  }

  // 5. Sırala ve döndür
  const categoryOrder: PantryCategory[] = [
    'sebze', 'meyve', 'protein', 'tahil', 'sut_urunleri', 'baharat', 'diger',
  ];

  const result: ShoppingCategory[] = [];
  for (const cat of categoryOrder) {
    const items = categoryMap.get(cat);
    if (items && items.length > 0) {
      items.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      const display = CATEGORY_DISPLAY[cat];
      result.push({
        category: cat,
        emoji: display.emoji,
        label: display.label,
        items,
      });
    }
  }

  return result;
}

/**
 * Alışveriş listesini paylaşılabilir text'e dönüştürür.
 */
export function shoppingListToText(categories: ShoppingCategory[]): string {
  let text = '🛒 Kaşık — Haftalık Alışveriş Listesi\n';
  text += '━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

  // Alınacaklar
  const toBuyCategories = categories
    .map((cat) => ({ ...cat, items: cat.items.filter((i) => !i.inPantry && i.toBuyAmount > 0) }))
    .filter((cat) => cat.items.length > 0);

  const inPantryCategories = categories
    .map((cat) => ({ ...cat, items: cat.items.filter((i) => i.inPantry) }))
    .filter((cat) => cat.items.length > 0);

  if (toBuyCategories.length > 0) {
    text += '🛒 ALINACAKLAR\n';
    text += '─────────────────\n';
    for (const cat of toBuyCategories) {
      text += `\n${cat.emoji} ${cat.label}\n`;
      for (const item of cat.items) {
        const check = item.checked ? '✅' : '⬜';
        const buyAmt = item.toBuyAmount > 0 ? item.toBuyAmount : item.amount;
        const amountStr = `${buyAmt} ${item.unit}`;
        const extra = item.pantryAmount > 0
          ? ` (dolapta ${item.pantryAmount} var)`
          : item.pantryExpiring
          ? ` (⚠️ dolapta var ama ${item.pantryDaysLeft} gün kaldı)`
          : '';
        text += `  ${check} ${item.emoji} ${item.name} — ${amountStr}${extra}\n`;
      }
    }
    text += '\n';
  }

  if (inPantryCategories.length > 0) {
    text += '🏠 DOLAPTA VAR (yeterli)\n';
    text += '─────────────────\n';
    for (const cat of inPantryCategories) {
      text += `\n${cat.emoji} ${cat.label}\n`;
      for (const item of cat.items) {
        text += `  ✅ ${item.emoji} ${item.name} — ${item.pantryAmount} ${item.unit} (${item.amount} gerekli)\n`;
      }
    }
    text += '\n';
  }

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const inPantry = inPantryCategories.reduce((sum, c) => sum + c.items.length, 0);
  const toBuy = toBuyCategories.reduce((sum, c) => sum + c.items.length, 0);
  text += `📊 Toplam: ${totalItems} | 🛒 Alınacak: ${toBuy} | 🏠 Dolapta: ${inPantry}\n`;

  return text;
}
