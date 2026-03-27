// mealPlanTemplates.ts
// Kaşık - Bebek Ek Gıda Uygulaması
// Aylık Beslenme Planı Şablonları (6-10. Ay)
// Dr. Erdal Pazar rehberliğinde hazırlanmıştır.

export interface MealTemplate {
  slot: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'taste';
  name: string;
  description?: string;
  ingredients: string[];
  recipeId?: string;
  emoji: string;
  imageUrl?: string;
}

// Telifsiz bebek yemek görselleri (Unsplash - ücretsiz kullanım)
export const RECIPE_IMAGES: Record<string, string> = {
  // Püreler
  'kabak': 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=200&h=200&fit=crop',
  'havuc': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop',
  'patates': 'https://images.unsplash.com/photo-1518977676601-b53f82ber67a?w=200&h=200&fit=crop',
  'brokoli': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop',
  'avokado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop',
  'elma': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop',
  'armut': 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=200&h=200&fit=crop',
  'muz': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop',
  // Kahvaltı
  'yumurta': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200&h=200&fit=crop',
  'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
  'peynir': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=200&fit=crop',
  'yulaf': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop',
  // Et & Balık
  'tavuk': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop',
  'balik': 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200&h=200&fit=crop',
  'kiyma': 'https://images.unsplash.com/photo-1602473812169-36a0e1e9021d?w=200&h=200&fit=crop',
  'kofte': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop',
  // Çorbalar
  'corba': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop',
  'mercimek': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop',
  'tarhana': 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=200&h=200&fit=crop',
  // Makarna & Pilav
  'makarna': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=200&h=200&fit=crop',
  'pilav': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=200&h=200&fit=crop',
  'bulgur': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=200&h=200&fit=crop',
  // Tatlılar & Atıştırmalık
  'pankek': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
  'muhallebi': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
  'meyve': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&h=200&fit=crop',
  // Genel
  'omlet': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop',
  'krep': 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=200&h=200&fit=crop',
  'biskuvi': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop',
  'pekmez': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
}

/**
 * Tarif adından en uygun görseli bul
 */
export function getRecipeImage(mealName: string): string | undefined {
  const nameLower = mealName.toLowerCase()
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u');

  for (const [key, url] of Object.entries(RECIPE_IMAGES)) {
    if (nameLower.includes(key)) return url;
  }
  return undefined;
}

export interface DayTemplate {
  day: number;
  meals: MealTemplate[];
}

export interface MealPlanTemplate {
  month: number;
  title: string;
  description: string;
  mealSlots: string[];
  days: DayTemplate[];
  notes: string[];
  newFoodsIntroduced: string[];
}

// ============================================================
// 6. AY — EK GIDA BAŞLANGIÇ MENÜSÜ
// ============================================================
const month6: MealPlanTemplate = {
  month: 6,
  title: '6. Ay - Ek Gıda Başlangıç Menüsü',
  description:
    'Bebeğinize ilk tamamlayıcı gıdaları tanıştırma dönemi. Günde 1 öğün, her 3 günde yeni bir besin eklenir.',
  mealSlots: ['taste'],
  notes: [
    'Her yeni besine 3 gün boyunca devam edin, alerji belirtilerini takip edin.',
    '1 çay kaşığı ile başlayıp kademeli olarak artırın.',
    'Zeytinyağı eklemeyi unutmayın.',
    'Ek gıda sonrası su vermeyi ihmal etmeyin.',
  ],
  newFoodsIntroduced: [
    'Kabak',
    'Havuç',
    'Patates',
    'Yoğurt',
    'Avokado',
    'Elma',
    'Armut',
    'Yumurta sarısı',
    'Lor peyniri',
    'Yulaf unu',
  ],
  days: [
    // Gün 1-3: Kabak tanıtımı
    { day: 1, meals: [{ slot: 'taste', name: 'Kabak püresi', description: '1 çay kaşığı kabak', ingredients: ['Kabak', 'Zeytinyağı'], emoji: '🎃' }] },
    { day: 2, meals: [{ slot: 'taste', name: 'Kabak püresi', description: '1 tatlı kaşığı kabak', ingredients: ['Kabak', 'Zeytinyağı'], emoji: '🎃' }] },
    { day: 3, meals: [{ slot: 'taste', name: 'Kabak püresi', description: '1 yemek kaşığı kabak', ingredients: ['Kabak', 'Zeytinyağı'], emoji: '🎃' }] },
    // Gün 4-6: Havuç tanıtımı
    { day: 4, meals: [{ slot: 'taste', name: 'Havuç püresi', description: '1 çay kaşığı havuç', ingredients: ['Havuç', 'Zeytinyağı'], emoji: '🥕' }] },
    { day: 5, meals: [{ slot: 'taste', name: 'Havuç + kabak püresi', description: '1 tatlı kaşığı havuç + kabak püresi', ingredients: ['Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥕' }] },
    { day: 6, meals: [{ slot: 'taste', name: 'Havuç + kabak püresi', description: '1 yemek kaşığı havuç + kabak püresi', ingredients: ['Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥕' }] },
    // Gün 7-9: Patates tanıtımı
    { day: 7, meals: [{ slot: 'taste', name: 'Patates püresi', description: '1 çay kaşığı patates', ingredients: ['Patates', 'Zeytinyağı'], emoji: '🥔' }] },
    { day: 8, meals: [{ slot: 'taste', name: 'Patates + havuç püresi', description: '1 tatlı kaşığı patates + havuç püresi', ingredients: ['Patates', 'Havuç', 'Zeytinyağı'], emoji: '🥔' }] },
    { day: 9, meals: [{ slot: 'taste', name: 'Patates + kabak + havuç püresi', description: '1 yemek kaşığı patates + kabak, havuç püresi', ingredients: ['Patates', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🥔' }] },
    // Gün 10-12: Yoğurt tanıtımı
    { day: 10, meals: [{ slot: 'taste', name: 'Yoğurt', description: '1 çay kaşığı yoğurt', ingredients: ['Yoğurt'], emoji: '🥛' }] },
    { day: 11, meals: [{ slot: 'taste', name: 'Yoğurt + patates püresi', description: '1 tatlı kaşığı yoğurt + patates püresi', ingredients: ['Yoğurt', 'Patates'], emoji: '🥛' }] },
    { day: 12, meals: [{ slot: 'taste', name: 'Yoğurt + kabak + patates püresi', description: '1 yemek kaşığı yoğurt + kabak, patates püresi', ingredients: ['Yoğurt', 'Kabak', 'Patates'], emoji: '🥛' }] },
    // Gün 13-15: Avokado tanıtımı
    { day: 13, meals: [{ slot: 'taste', name: 'Avokado püresi', description: '1 çay kaşığı avokado', ingredients: ['Avokado'], emoji: '🥑' }] },
    { day: 14, meals: [{ slot: 'taste', name: 'Avokado + patates', description: '1 tatlı kaşığı avokado + patates', ingredients: ['Avokado', 'Patates', 'Zeytinyağı'], emoji: '🥑' }] },
    { day: 15, meals: [{ slot: 'taste', name: 'Avokado + kabak/yoğurt', description: '1 yemek kaşığı avokado + kabak/yoğurt', ingredients: ['Avokado', 'Kabak', 'Yoğurt'], emoji: '🥑' }] },
    // Gün 16-18: Elma tanıtımı
    { day: 16, meals: [{ slot: 'taste', name: 'Elma püresi', description: '1 çay kaşığı elma', ingredients: ['Elma'], emoji: '🍎' }] },
    { day: 17, meals: [{ slot: 'taste', name: 'Elma + avokado', description: '1 tatlı kaşığı elma + avokado', ingredients: ['Elma', 'Avokado'], emoji: '🍎' }] },
    { day: 18, meals: [{ slot: 'taste', name: 'Elma + avokado/yoğurt', description: '1 yemek kaşığı elma + avokado/yoğurt', ingredients: ['Elma', 'Avokado', 'Yoğurt'], emoji: '🍎' }] },
    // Gün 19-21: Armut tanıtımı
    { day: 19, meals: [{ slot: 'taste', name: 'Armut püresi', description: '1 çay kaşığı armut', ingredients: ['Armut'], emoji: '🍐' }] },
    { day: 20, meals: [{ slot: 'taste', name: 'Armut + elma', description: '1 tatlı kaşığı armut + elma', ingredients: ['Armut', 'Elma'], emoji: '🍐' }] },
    { day: 21, meals: [{ slot: 'taste', name: 'Armut + avokado', description: '1 yemek kaşığı armut + avokado', ingredients: ['Armut', 'Avokado'], emoji: '🍐' }] },
    // Gün 22-24: Yumurta sarısı tanıtımı
    { day: 22, meals: [{ slot: 'taste', name: 'Yumurta sarısı', description: 'Çeyrek yumurta sarısı', ingredients: ['Yumurta sarısı'], emoji: '🥚' }] },
    { day: 23, meals: [{ slot: 'taste', name: 'Yumurta sarısı + patates püresi', description: 'Yarım yumurta sarısı + patates püresi', ingredients: ['Yumurta sarısı', 'Patates', 'Zeytinyağı'], emoji: '🥚' }] },
    { day: 24, meals: [{ slot: 'taste', name: 'Yumurta sarısı + armut püresi', description: 'Tam yumurta sarısı + armut püresi', ingredients: ['Yumurta sarısı', 'Armut'], emoji: '🥚' }] },
    // Gün 25-27: Lor peyniri tanıtımı
    { day: 25, meals: [{ slot: 'taste', name: 'Lor peyniri', description: '1 çay kaşığı lor peyniri', ingredients: ['Lor peyniri'], emoji: '🧀' }] },
    { day: 26, meals: [{ slot: 'taste', name: 'Lor peyniri + yumurta sarısı', description: '1 tatlı kaşığı lor peyniri + yumurta sarısı', ingredients: ['Lor peyniri', 'Yumurta sarısı'], emoji: '🧀' }] },
    { day: 27, meals: [{ slot: 'taste', name: 'Lor peyniri + avokado', description: '1 yemek kaşığı lor peyniri + avokado', ingredients: ['Lor peyniri', 'Avokado'], emoji: '🧀' }] },
    // Gün 28-30: Yulaf unu tanıtımı
    { day: 28, meals: [{ slot: 'taste', name: 'Yulaf lapası + yumurta sarısı + lor peyniri', description: '1 çay kaşığı yulaf unu + yumurta sarısı + lor peyniri', ingredients: ['Yulaf unu', 'Yumurta sarısı', 'Lor peyniri'], emoji: '🥣' }] },
    { day: 29, meals: [{ slot: 'taste', name: 'Yulaf lapası + yumurta sarısı + armut püresi', description: '1 tatlı kaşığı yulaf unu + yumurta sarısı + armut püresi', ingredients: ['Yulaf unu', 'Yumurta sarısı', 'Armut'], emoji: '🥣' }] },
    { day: 30, meals: [{ slot: 'taste', name: 'Yulaf unu ile yoğurt çorbası', description: '1 yemek kaşığı yulaf unu ile yoğurt çorbası', ingredients: ['Yulaf unu', 'Yoğurt', 'Su'], emoji: '🥣' }] },
  ],
};

// ============================================================
// 7. AY — 2 ÖĞÜN: Kahvaltı + İkindi
// Dr. Erdal Pazar rehberi: 6-8 ay arası günde 2 öğün
// ============================================================
const month7: MealPlanTemplate = {
  month: 7,
  title: '7. Ay - 2 Öğün Beslenme Planı',
  description:
    'Günde 2 öğün: kahvaltı ve ikindi. Pirinç, ceviz, kuzu kıyma, semizotu, bezelye, pekmez, kuru kayısı, tam buğday unu, bebek irmiği, domates (pişmiş), yeşil fasulye, labne peyniri ve salatalık tanıtılır.',
  mealSlots: ['breakfast', 'lunch'],
  notes: [
    'Tüm yemeklere zeytinyağı eklemeyi unutmayın.',
    'Ek gıda sonrası su vermeyi ihmal etmeyin.',
    'Kıyma çift çekilmiş ve kuzu olmalı 12. aya kadar.',
    'Pirinç günlük yapılmalı, saklama yapılmamalı.',
    'Pekmez ısıya maruz kalmamalı, yemeğe son anda eklenecek.',
    'İrmik su ile pişirilerek verilecek.',
    'Domates 12. aya kadar yalnızca pişmiş kullanılacak.',
    'Her yemeğin 2 pişirim / 2 gün saklama hakkı vardır (pirinç hariç).',
    'Bezelye buharda pişirilerek veya haşlanarak verilebilir.',
    'Kuru kayısı olarak gün kurusu tercih edilmeli.',
  ],
  newFoodsIntroduced: [
    'Pirinç',
    'Ceviz (toz)',
    'Kuzu kıyma (çift çekilmiş)',
    'Semizotu',
    'Bezelye',
    'Pekmez (soğuk sıkım)',
    'Kuru kayısı',
    'Tam buğday unu',
    'Bebek irmiği',
    'Domates (pişmiş)',
    'Yeşil fasulye',
    'Labne peyniri',
    'Salatalık',
  ],
  days: [
    // Gün 1-3: Pirinç tanıtımı
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Avokado + lor, yumurta sarısı, muz püresi', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Muz', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Tatlı patates püresi + pirinç tadımlık, yoğurt', description: 'Tadım: Pirinç', ingredients: ['Tatlı patates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍠' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Avokado + labne, yumurta sarısı, elma püresi', ingredients: ['Avokado', 'Labne peyniri', 'Yumurta sarısı', 'Elma', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Havuç püresi + pirinç tadımlık, yoğurt', description: 'Tadım: Pirinç', ingredients: ['Havuç', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥕' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Avokado + lor, yumurta sarısı, armut püresi', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Armut', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Kabak püresi + pirinç tadımlık, yoğurt', description: 'Tadım: Pirinç', ingredients: ['Kabak', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    // Gün 4-6: Ceviz tanıtımı
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Avokado + labneli püre, yumurta sarısı ile omlet, toz ceviz tadımı', ingredients: ['Avokado', 'Labne peyniri', 'Yumurta sarısı', 'Ceviz', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Yoğurt çorbası, tel şehriye ile', description: 'Tadım: Ceviz', ingredients: ['Yoğurt', 'Tel şehriye', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Avokado + labneli püre, yumurta sarısı ile pankek, toz ceviz tadımı', ingredients: ['Avokado', 'Labne peyniri', 'Yumurta sarısı', 'Ceviz', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Patates püresi, yoğurt', description: 'Tadım: Ceviz', ingredients: ['Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥔' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ve avokado püresi ile lor peyniri + toz ceviz, muz', ingredients: ['Yumurta sarısı', 'Avokado', 'Lor peyniri', 'Ceviz', 'Muz', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kabak püresi, yoğurt', description: 'Tadım: Ceviz', ingredients: ['Kabak', 'Yoğurt', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    // Gün 7-8: Kıyma tanıtımı
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Elmalı, yulaflı (haşlanmış), labne peynirli karışım; yanına 1 adet yumurta sarısı', ingredients: ['Elma', 'Yulaf unu', 'Labne peyniri', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🍎' },
        { slot: 'lunch', name: 'Havuçlu, patatesli, pirinçli ve kuzu kıymalı yemek + yoğurt', description: 'Tadım: Kıyma', ingredients: ['Havuç', 'Patates', 'Pirinç', 'Kuzu kıyma', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Tadımı yapılan sebzeler ile muffin (yumurta sarısı ile), avokado, labne', ingredients: ['Yumurta sarısı', 'Avokado', 'Labne peyniri', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Kabaklı ve şehriyeli kıymalı çorba + yoğurt', description: 'Tadım: Kıyma', ingredients: ['Kabak', 'Tel şehriye', 'Kuzu kıyma', 'Yoğurt', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 9-11: Semizotu tanıtımı
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Muffin, lor peyniri, biraz salatalık, armut', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Salatalık', 'Armut', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Yayla çorbası, pirinçli ve tadımlık semizotlu', description: 'Tadım: Semizotu', ingredients: ['Yoğurt', 'Pirinç', 'Semizotu', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı (çırpma), labne peyniri, salatalık, muz', ingredients: ['Yumurta sarısı', 'Labne peyniri', 'Salatalık', 'Muz', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tatlı patatesli, tadımlık semizotu ve kuzu kıymalı yemek + yoğurt', description: 'Tadım: Semizotu', ingredients: ['Tatlı patates', 'Semizotu', 'Kuzu kıyma', 'Yoğurt', 'Zeytinyağı'], emoji: '🍠' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı + labne, haşlanmış yulaf ezmesi + armut + toz ceviz', ingredients: ['Yumurta sarısı', 'Labne peyniri', 'Yulaf unu', 'Armut', 'Ceviz', 'Zeytinyağı'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kuzu kıymalı, semizotlu, kabaklı, havuçlu mücver + yoğurt', description: 'Tadım: Semizotu', ingredients: ['Kuzu kıyma', 'Semizotu', 'Kabak', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 12-14: Bezelye tanıtımı
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile omlet, lor peyniri, salatalık', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Salatalık', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Havuç, patates ve tadımlık bezelye ile yemek + yoğurt', description: 'Tadım: Bezelye', ingredients: ['Havuç', 'Patates', 'Bezelye', 'Yoğurt', 'Zeytinyağı'], emoji: '🟢' },
      ],
    },
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile pankek, üzerine pekmez ve muz; yanına labne ve avokado', ingredients: ['Yumurta sarısı', 'Pekmez', 'Muz', 'Labne peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Havuç, patates ve tadımlık bezelye ile yemek + yoğurt', description: 'Tadım: Bezelye', ingredients: ['Havuç', 'Patates', 'Bezelye', 'Yoğurt', 'Zeytinyağı'], emoji: '🟢' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile krep, lor peyniri ve avokadodan sos sürülerek', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kabaklı kuzu kıymalı ve pirinçli yemek + yoğurt', description: 'Tadım: Bezelye', ingredients: ['Kabak', 'Kuzu kıyma', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 15-17: Pekmez tanıtımı
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı, labne peyniri, salatalık, elma + toz ceviz', ingredients: ['Yumurta sarısı', 'Labne peyniri', 'Salatalık', 'Elma', 'Ceviz', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Semizotlu kuzu kıymalı pirinçli yemek + yoğurt', description: 'Tadım: Pekmez', ingredients: ['Semizotu', 'Kuzu kıyma', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🌿' },
      ],
    },
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile pankek, toz ceviz + labne + muz + pekmez', ingredients: ['Yumurta sarısı', 'Ceviz', 'Labne peyniri', 'Muz', 'Pekmez', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı, havuçlu bezelye yemeği + yoğurt', description: 'Tadım: Pekmez', ingredients: ['Kuzu kıyma', 'Havuç', 'Bezelye', 'Yoğurt', 'Zeytinyağı'], emoji: '🟢' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile pankek, toz ceviz + lor + muz + pekmez', ingredients: ['Yumurta sarısı', 'Ceviz', 'Lor peyniri', 'Muz', 'Pekmez', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı semizotu yemeği + yoğurt', description: 'Tadım: Pekmez', ingredients: ['Kuzu kıyma', 'Semizotu', 'Yoğurt', 'Zeytinyağı'], emoji: '🌿' },
      ],
    },
    // Gün 18-20: Kuru kayısı tanıtımı
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile tarhanalı omlet, kuru kayısı + toz ceviz, labne, avokado', ingredients: ['Yumurta sarısı', 'Tarhana', 'Kuru kayısı', 'Ceviz', 'Labne peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tatlı patatesli, kabaklı ve kıymalı sebze yemeği + yoğurt', description: 'Tadım: Kayısı', ingredients: ['Tatlı patates', 'Kabak', 'Kuzu kıyma', 'Yoğurt', 'Zeytinyağı'], emoji: '🍠' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı, lor peyniri, gün kurusu + toz ceviz, avokado', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Kuru kayısı', 'Ceviz', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kabaklı ve şehriyeli kıymalı çorba + yoğurt', description: 'Tadım: Kayısı', ingredients: ['Kabak', 'Tel şehriye', 'Kuzu kıyma', 'Yoğurt', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı, ev yapımı kek veya bebe bisküvisi, labne + kuru kayısı', ingredients: ['Yumurta sarısı', 'Labne peyniri', 'Kuru kayısı', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Pirinçli yayla çorbası, kıyma ile köfte', description: 'Tadım: Kayısı', ingredients: ['Pirinç', 'Yoğurt', 'Kuzu kıyma', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 21-22: Tam buğday unu tanıtımı
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile krep (tam buğday unu), avokado ve labne sürülerek + elma', ingredients: ['Yumurta sarısı', 'Tam buğday unu', 'Avokado', 'Labne peyniri', 'Elma', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tam buğday unlu sebze köfte + patates püresi + yoğurt', description: 'Tadım: Tam buğday unu', ingredients: ['Tam buğday unu', 'Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥔' },
      ],
    },
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile krep (tam buğday unu), avokado ve labne sürülerek + muz + toz ceviz', ingredients: ['Yumurta sarısı', 'Tam buğday unu', 'Avokado', 'Labne peyniri', 'Muz', 'Ceviz', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kabak ve semizotlu, kıymalı sebze yemeği + yoğurt', description: 'Tadım: Tam buğday unu', ingredients: ['Kabak', 'Semizotu', 'Kuzu kıyma', 'Yoğurt', 'Zeytinyağı'], emoji: '🌿' },
      ],
    },
    // Gün 23-24: Bebek irmiği tanıtımı
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ve lor peyniri, bebek irmiği ile meyve püresi; toz ceviz ve pekmez', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Bebek irmiği', 'Ceviz', 'Pekmez', 'Zeytinyağı'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kabaklı mücver, sebzeli kıymalı erişte, yoğurt', description: 'Tadım: Bebek irmiği', ingredients: ['Kabak', 'Kuzu kıyma', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ve labne peyniri, bebek irmiği ile meyve püresi; toz ceviz ve pekmez', ingredients: ['Yumurta sarısı', 'Labne peyniri', 'Bebek irmiği', 'Ceviz', 'Pekmez', 'Zeytinyağı'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kuzu kıyma ile sebzeli köfte, sebzeli erişte, yoğurt', description: 'Tadım: Bebek irmiği', ingredients: ['Kuzu kıyma', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 25-27: Domates (pişmiş) tanıtımı
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı ile pankek, avokado + muz + labne karışımı üzerine sürülerek', ingredients: ['Yumurta sarısı', 'Avokado', 'Muz', 'Labne peyniri', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Bezelye yemeği (havuçlu, patatesli, kıymalı), domatesli + yoğurt', description: 'Tadım: Domates', ingredients: ['Bezelye', 'Havuç', 'Patates', 'Kuzu kıyma', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🍅' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Domates ve yumurta sarısı ile menemen, labne peyniri, tam buğday ekmeği, meyve + avokado', ingredients: ['Domates', 'Yumurta sarısı', 'Labne peyniri', 'Tam buğday ekmeği', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kuzu kıyma ile sebzeli köfte, sebzeli erişte, yoğurt', description: 'Tadım: Domates', ingredients: ['Kuzu kıyma', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Domates ve yumurta sarısı ile menemen, lor peyniri, tam buğday ekmeği, meyve', ingredients: ['Domates', 'Yumurta sarısı', 'Lor peyniri', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kabaklı mücver, sebzeli kıymalı erişte, yoğurt', description: 'Tadım: Domates', ingredients: ['Kabak', 'Kuzu kıyma', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 28-30: Yeşil fasulye tanıtımı
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı + labne, haşlanmış yulaf ezmesi + armut + toz ceviz', ingredients: ['Yumurta sarısı', 'Labne peyniri', 'Yulaf unu', 'Armut', 'Ceviz', 'Zeytinyağı'], emoji: '🥣' },
        { slot: 'lunch', name: 'Yeşil fasulye yemeği (domatesli), pirinç pilavı + yoğurt', description: 'Tadım: Yeşil fasulye', ingredients: ['Yeşil fasulye', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli muffin/kek, yumurta sarısı, lor peyniri, salatalık, elma', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Salatalık', 'Elma', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Yeşil fasulye yemeği (domatesli), pirinç pilavı + yoğurt', description: 'Tadım: Yeşil fasulye', ingredients: ['Yeşil fasulye', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı, pişirilmiş yulaf içine labne ve gün kurusu ezmesi', ingredients: ['Yumurta sarısı', 'Yulaf unu', 'Labne peyniri', 'Kuru kayısı', 'Zeytinyağı'], emoji: '🥣' },
        { slot: 'lunch', name: 'Yeşil fasulye çorbası, kıymalı (domatesli) + yoğurt', description: 'Tadım: Yeşil fasulye', ingredients: ['Yeşil fasulye', 'Kuzu kıyma', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
  ],
};

// ============================================================
// 8. AY — EK GIDAYA DEVAM MENÜSÜ
// Kahvaltı + İkindi + Ara Öğün (PDF verisi)
// ============================================================
const month8: MealPlanTemplate = {
  month: 8,
  title: '8. Ay - Ek Gıdaya Devam Menüsü',
  description:
    'Günde 3 öğün: kahvaltı, ikindi ve ara öğün. Yumurta beyazı, bulgur, balık, soğan, mercimek, balkabağı ve nohut tanıtılır.',
  mealSlots: ['breakfast', 'lunch', 'snack'],
  notes: [
    'Tüm yemeklere zeytinyağı eklemeyi unutmayın.',
    'Balık haftada 2-3 kez verilebilir.',
    'Nohut 1 gece suda bekletilip zarı çıkarılacaktır.',
    'Yumurta beyazı bu ay tanıtılabilir — ilk günlerde yumurta sarısı + beyaz tadımı yapılır.',
    'Bulgur ve tam buğday unu bu ay başlar.',
    'Tahin alerjik reaksiyona dikkat ederek tanıtılmalı.',
    'Ispanak haftada en fazla 2 kez verilmelidir.',
  ],
  newFoodsIntroduced: [
    'Yumurta beyazı',
    'Bulgur',
    'Balık',
    'Soğan (pişmiş)',
    'Kırmızı mercimek',
    'Balkabağı',
    'Buğday ruşeymi',
    'Organik tavuk',
    'Nohut',
    'Ispanak',
    'Tahin',
    'Trabzon hurması',
  ],
  days: [
    // Gün 1: Yumurta beyazı tadımı başlangıcı
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Avokado + lor + yumurta + muz', description: 'Yumurta beyazı tadımı ile birlikte', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Yumurta beyazı', 'Muz'], emoji: '🥑' },
        { slot: 'lunch', name: 'Kıymalı bezelye yemeği', description: 'Havuç, patates, kıyma, bezelye ve domates ile', ingredients: ['Kuzu kıyma', 'Bezelye', 'Havuç', 'Patates', 'Domates', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + labne + elma püresi', description: 'Yumurta beyazı tadımı ile birlikte', ingredients: ['Yumurta sarısı', 'Yumurta beyazı', 'Labne peyniri', 'Elma'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı bezelye yemeği', ingredients: ['Kuzu kıyma', 'Bezelye', 'Havuç', 'Patates', 'Domates', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + lor peyniri + salatalık', description: 'Yumurta beyazı tadımı ile birlikte', ingredients: ['Yumurta sarısı', 'Yumurta beyazı', 'Lor peyniri', 'Salatalık'], emoji: '🥚' },
        { slot: 'lunch', name: 'Yayla çorbası + kuzu köfte', ingredients: ['Yoğurt', 'Pirinç', 'Kuzu kıyma', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 4: Tam yumurta + bulgur tanıtımı
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Tarhanalı omlet + salatalık + avokado', description: 'Tam yumurta ile, lor peyniri + toz ceviz', ingredients: ['Yumurta', 'Tarhana', 'Salatalık', 'Avokado', 'Lor peyniri', 'Ceviz', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Bulgurlu kabak yemeği', description: 'Kıyma, havuç, 1 tatlı kaşığı bulgur, kabak ve domates ile', ingredients: ['Kuzu kıyma', 'Havuç', 'Bulgur', 'Kabak', 'Domates', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Pankek + muzlu labneli karışım', description: 'Tam yumurta ile pankek', ingredients: ['Yumurta', 'Yulaf unu', 'Muz', 'Labne peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Bulgurlu kabak yemeği', ingredients: ['Kuzu kıyma', 'Havuç', 'Bulgur', 'Kabak', 'Domates', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 6-8: Balık tanıtımı
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli mücver + labne + ceviz', description: '1 tam yumurta ile', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Labne peyniri', 'Ceviz', 'Zeytinyağı'], emoji: '🥙' },
        { slot: 'lunch', name: 'Sebzeli bulgur pilavı + balık tadımı', description: 'Domates, bulgur, kabak ile birlikte balık tadımı', ingredients: ['Bulgur', 'Domates', 'Kabak', 'Balık', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Haşlama yumurta + yulaf lapası', description: 'Yulaf lapası meyve, pekmez ve toz ceviz ile', ingredients: ['Yumurta', 'Yulaf unu', 'Mevsim meyvesi', 'Pekmez', 'Ceviz'], emoji: '🥚' },
        { slot: 'lunch', name: 'Sebzeli bulgur pilavı + balık tadımı', ingredients: ['Bulgur', 'Domates', 'Kabak', 'Balık', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Omlet + avokado + bebek bisküvisi', description: '1 tam yumurta ile omlet, lor peyniri, ev yapımı cevizli bebek bisküvisi', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Yulaf unu', 'Ceviz', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Pilav + buharda sebzeler + balık', description: 'Balık tadımı devam', ingredients: ['Pirinç', 'Havuç', 'Brokoli', 'Kabak', 'Balık', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 9-10: Soğan tanıtımı (pişmiş)
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli muffin + labne + salatalık', description: '1 tam yumurta ile', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Labne peyniri', 'Salatalık', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Kıymalı brokoli yemeği + erişte', description: 'Soğan eklenerek pişirilir', ingredients: ['Kuzu kıyma', 'Brokoli', 'Soğan', 'Erişte', 'Zeytinyağı'], emoji: '🥦' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + labne + pekmez', description: '1 tam yumurta ile, labne + toz ceviz, pekmez ve meyve', ingredients: ['Yumurta', 'Labne peyniri', 'Ceviz', 'Pekmez', 'Mevsim meyvesi'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı brokoli yemeği + erişte', ingredients: ['Kuzu kıyma', 'Brokoli', 'Soğan', 'Erişte', 'Zeytinyağı'], emoji: '🥦' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 11-12: Kırmızı mercimek tanıtımı
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Kaşarlı omlet + yulaflı gün kurusu', description: 'Ceviz ve pekmez ile', ingredients: ['Yumurta', 'Kaşar peyniri', 'Yulaf unu', 'Ceviz', 'Pekmez', 'Kuru üzüm'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kırmızı mercimekli çorba + bulgur pilavı', description: 'Kıymalı ve sebzeli', ingredients: ['Kırmızı mercimek', 'Kuzu kıyma', 'Havuç', 'Patates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Balkabaklı pankek + labne + avokado + muz', ingredients: ['Yumurta', 'Balkabağı', 'Yulaf unu', 'Labne peyniri', 'Avokado', 'Muz'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kırmızı mercimekli çorba + bulgur pilavı', ingredients: ['Kırmızı mercimek', 'Kuzu kıyma', 'Havuç', 'Patates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 13-14: Balkabağı çorbası
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Haşlama yumurta + dil peyniri + poğaça', description: 'Salatalık, yoğurtlu tam buğdaylı poğaça', ingredients: ['Yumurta', 'Dil peyniri', 'Salatalık', 'Tam buğday unu', 'Yoğurt', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Balkabaklı çorba + sebzeli makarna', description: 'Kıymalı ve sebzeli balkabağı çorbası', ingredients: ['Balkabağı', 'Kuzu kıyma', 'Havuç', 'Patates', 'Makarna', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Patatesli peynirli omlet + avokado', description: 'Salatalık ile', ingredients: ['Yumurta', 'Patates', 'Lor peyniri', 'Avokado', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balkabaklı çorba + sebzeli makarna', ingredients: ['Balkabağı', 'Kuzu kıyma', 'Havuç', 'Patates', 'Makarna', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 15: Buğday ruşeymi tanıtımı
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Tarhanalı omlet + lor + poğaça', description: 'Salatalık, yoğurtlu tam buğdaylı poğaça ile', ingredients: ['Yumurta', 'Tarhana', 'Lor peyniri', 'Salatalık', 'Tam buğday unu', 'Yoğurt', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kuzu köfte + erişte', description: 'Buğday ruşeymi eklenerek', ingredients: ['Kuzu kıyma', 'Buğday ruşeymi', 'Erişte', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Balkabaklı krep', ingredients: ['Yumurta', 'Balkabağı', 'Yulaf unu', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kırmızı mercimekli çorba + bulgur pilavı', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 17-18: Organik tavuk tanıtımı
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + dil peyniri + bebek bisküvisi', description: 'Salatalık veya avokado ile', ingredients: ['Yumurta', 'Dil peyniri', 'Salatalık', 'Avokado', 'Yulaf unu', 'Ceviz'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuk suyuna tel şehriye çorbası + sebzeler', description: 'Haşlanmış sebzeler ile', ingredients: ['Tavuk', 'Şehriye', 'Havuç', 'Patates', 'Kabak', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + elmalı yulaf', description: 'Toz ceviz ve pekmez ile', ingredients: ['Yumurta', 'Lor peyniri', 'Elma', 'Yulaf unu', 'Ceviz', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuk suyuna tel şehriye çorbası + sebzeler', ingredients: ['Tavuk', 'Şehriye', 'Havuç', 'Patates', 'Kabak', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli muffin + dil peyniri + avokado', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Dil peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Tarhana çorbası + tavuklu erişte', description: 'Haşlanmış tavuk ile', ingredients: ['Tarhana', 'Tavuk', 'Erişte', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 20-21: Nohut tanıtımı
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Kaşarlı patatesli omlet + labne + yulaf', description: 'Armutlu yulaf, ceviz ve pekmez ile', ingredients: ['Yumurta', 'Kaşar peyniri', 'Patates', 'Labne peyniri', 'Yulaf unu', 'Armut', 'Ceviz', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kıymalı nohut yemeği + bulgur pilavı', ingredients: ['Kuzu kıyma', 'Nohut', 'Havuç', 'Domates', 'Bulgur', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Haşlama yumurta + labne + yulaflı muz', description: 'Salatalık, toz ceviz ile', ingredients: ['Yumurta', 'Labne peyniri', 'Salatalık', 'Yulaf unu', 'Muz', 'Ceviz'], emoji: '🥚' },
        { slot: 'lunch', name: 'Nohutlu buğdaylı yoğurt çorbası', ingredients: ['Nohut', 'Buğday', 'Yoğurt', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 22-24: Ispanak tanıtımı
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Tarhanalı omlet + dil peyniri + avokado + elma', ingredients: ['Yumurta', 'Tarhana', 'Dil peyniri', 'Avokado', 'Elma', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Ispanak yemeği + makarna + yoğurt', ingredients: ['Ispanak', 'Makarna', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Tatlı patatesli kaşarlı omlet + lor + salatalık', ingredients: ['Yumurta', 'Tatlı patates', 'Kaşar peyniri', 'Lor peyniri', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Ispanak yemeği + makarna + yoğurt', ingredients: ['Ispanak', 'Makarna', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Omlet + avokado + lor + bebek bisküvisi', description: '1 tam yumurta ile', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Yulaf unu', 'Ceviz', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Ispanaklı pankek veya muffin', ingredients: ['Ispanak', 'Yumurta', 'Yulaf unu', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    // Gün 25: Tahin tanıtımı
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + dil peyniri + tahin-pekmez', description: 'Toz ceviz ile', ingredients: ['Yumurta', 'Dil peyniri', 'Ceviz', 'Tahin', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Az çorba + balık + erişte', ingredients: ['Balık', 'Erişte', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli omlet + labne + bebek ekmeği', description: 'Tahin-pekmez ile', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Labne peyniri', 'Salatalık', 'Tam buğday unu', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kıymalı taze fasulye + erişte', ingredients: ['Kuzu kıyma', 'Taze fasulye', 'Domates', 'Soğan', 'Erişte', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + dil peyniri + yulaflı lapa', description: 'Muzlu labne üzerine tahin pekmez', ingredients: ['Yumurta', 'Dil peyniri', 'Yulaf unu', 'Muz', 'Labne peyniri', 'Tahin', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı taze fasulye + erişte', ingredients: ['Kuzu kıyma', 'Taze fasulye', 'Domates', 'Soğan', 'Erişte', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Yumurtalı tam buğday ekmeği + lor + salatalık', description: '1 adet pankeke tahin pekmez', ingredients: ['Yumurta', 'Tam buğday ekmeği', 'Lor peyniri', 'Salatalık', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🍞' },
        { slot: 'lunch', name: 'Sebzeli köfte + bulgur pilavı', description: 'Tavuk, balık veya kuzu kıymadan köfte', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Balkabaklı krep', ingredients: ['Yumurta', 'Balkabağı', 'Yulaf unu', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Sebzeli köfte + bulgur pilavı', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + avokado + yulaflı lapa', description: 'Gün kurusu ile cevizli lapa, biraz tahin ile', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Yulaf unu', 'Ceviz', 'Kuru üzüm', 'Tahin'], emoji: '🥚' },
        { slot: 'lunch', name: 'Bulgurlu ıspanak yemeği + yoğurt', ingredients: ['Bulgur', 'Ispanak', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
  ],
};

// ============================================================
// 9. AY+ — EK GIDAYA DEVAM MENÜSÜ
// Kahvaltı + Öğle + Akşam + Ara Öğün (PDF verisi)
// ============================================================
const month9: MealPlanTemplate = {
  month: 9,
  title: '9. Ay+ - Ek Gıdaya Devam Menüsü',
  description:
    'Günde 4 öğün: kahvaltı, öğle, akşam ve ara öğün. Kefir, fındık ezmesi, mantı, biber dolması, semizotu ve enginar tanıtılır.',
  mealSlots: ['breakfast', 'lunch', 'dinner', 'snack'],
  notes: [
    'Tüm yemeklere zeytinyağı eklemeyi unutmayın.',
    'Parmak yiyeceklere geçiş başlayabilir.',
    'Yemeklerin dokusu kademeli olarak kabalaştırılmalı.',
    'Ispanak haftada en fazla 2 kez verilmelidir.',
    'Nohut zarları çıkarılmalı.',
    'Kefir bu ay tanıtılabilir.',
    'Et kavurma iyice pişirilip ufak parçalara ayrılmalı.',
  ],
  newFoodsIntroduced: [
    'Kefir',
    'Kuru üzüm',
    'Fındık ezmesi',
    'Mantı',
    'Biber dolması',
    'Semizotu',
    'Brüksel lahanası',
    'Enginar',
  ],
  days: [
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + peynir + zeytin', description: 'Lor/labne/çeçil, tuzsuz zeytin, salatalık, tahin/pekmez, ceviz', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytin', 'Salatalık', 'Tahin', 'Pekmez', 'Ceviz'], emoji: '🥚' },
        { slot: 'lunch', name: 'Pirinçli yoğurt çorbası', ingredients: ['Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Balık + yeşil mercimekli bulgur pilavı', ingredients: ['Balık', 'Yeşil mercimek', 'Bulgur', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kefir + kuru meyveler + kuruyemiş', description: 'Kuru üzüm, kuru dut ile', ingredients: ['Kefir', 'Kuru üzüm', 'Kuru dut', 'Ceviz'], emoji: '🥛' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Pankek + muz + ceviz + avokado', description: '1 yumurta ile, peynir, karadut suyu', ingredients: ['Yumurta', 'Yulaf unu', 'Muz', 'Ceviz', 'Avokado', 'Lor peyniri', 'Karadut suyu'], emoji: '🥞' },
        { slot: 'lunch', name: 'Mücver + erişte', ingredients: ['Kabak', 'Havuç', 'Yumurta', 'Erişte', 'Zeytinyağı'], emoji: '🥙' },
        { slot: 'dinner', name: 'Kıymalı kabak yemeği + pirinç pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Omlet + salatalık + zeytin + fındık ezmesi', description: 'Peynirli veya tarhanalı, fındık ezmesi tam buğday ekmeğe', ingredients: ['Yumurta', 'Lor peyniri', 'Salatalık', 'Zeytin', 'Fındık ezmesi', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Köfte + sebzeli makarna', ingredients: ['Kuzu kıyma', 'Makarna', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Biber dolması + yoğurt', description: 'Pirinçli/kıymalı', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌶️' },
        { slot: 'snack', name: 'Yulaf + elma + ceviz + tarçın', ingredients: ['Yulaf unu', 'Elma', 'Ceviz', 'Tarçın'], emoji: '🥣' },
      ],
    },
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado-labne + zeytin + pekmez', description: '1 yumurta ile, pekmez ekmeğe', ingredients: ['Yumurta', 'Yulaf unu', 'Avokado', 'Labne peyniri', 'Zeytin', 'Pekmez', 'Tam buğday ekmeği'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tarhana çorbası + tam buğday ekmeği + yoğurt', ingredients: ['Tarhana', 'Tam buğday ekmeği', 'Yoğurt', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Etli nohut yemeği + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Nohut', 'Havuç', 'Domates', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi + kuruyemiş', ingredients: ['Kefir', 'Mevsim meyvesi', 'Ceviz'], emoji: '🥛' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + kaşar peynirli tost', description: 'Çeyrek avokado, zeytin, domates/salatalık', ingredients: ['Yumurta', 'Kaşar peyniri', 'Tam buğday ekmeği', 'Avokado', 'Zeytin', 'Domates', 'Salatalık'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tarhana çorbası + tam buğday ekmeği + yoğurt', ingredients: ['Tarhana', 'Tam buğday ekmeği', 'Yoğurt', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Tavuk köftesi + sebzeli makarna + yoğurt', ingredients: ['Tavuk', 'Makarna', 'Kabak', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Pankek + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + yulaflı lapa', description: 'Elmalı, cevizli lapa + hurma özü', ingredients: ['Yumurta', 'Lor peyniri', 'Yulaf unu', 'Elma', 'Ceviz', 'Hurma'], emoji: '🥚' },
        { slot: 'lunch', name: 'Sebzeli muffin + ayran', description: 'Pırasa, havuç ile', ingredients: ['Yumurta', 'Pırasa', 'Havuç', 'Yulaf unu', 'Ayran', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'dinner', name: 'Kıymalı semizotu yemeği + bulgur pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Semizotu', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + kefir', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Kefir'], emoji: '🍪' },
      ],
    },
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Kaşar peynirli tost + domates + salatalık', description: 'Zeytin, karadut suyu ile', ingredients: ['Kaşar peyniri', 'Tam buğday ekmeği', 'Domates', 'Salatalık', 'Zeytin', 'Karadut suyu'], emoji: '🧀' },
        { slot: 'lunch', name: 'Sulu köfte çorbası + tam buğday ekmeği', ingredients: ['Kuzu kıyma', 'Havuç', 'Patates', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Tavuklu bezelye yemeği + erişte', ingredients: ['Tavuk', 'Bezelye', 'Havuç', 'Erişte', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Armut + yoğurt', ingredients: ['Armut', 'Yoğurt'], emoji: '🍐' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Menemen veya omlet + peynir', description: 'Cherry domates/salatalık, tam buğdaya tahin/pekmez', ingredients: ['Yumurta', 'Domates', 'Biber', 'Lor peyniri', 'Salatalık', 'Tam buğday ekmeği', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Yeşil mercimek yemeği + yoğurt', ingredients: ['Yeşil mercimek', 'Havuç', 'Patates', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Kıymalı taze fasulye + pirinç pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Taze fasulye', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Labne + muz + yulaf + ceviz', ingredients: ['Labne peyniri', 'Muz', 'Yulaf unu', 'Ceviz'], emoji: '🍌' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli muffin + haşlanmış yumurta + peynir', description: 'Tuzsuz zeytin, salatalık', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Lor peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Haşlama et + sebzeler + yoğurt', ingredients: ['Kuzu eti', 'Havuç', 'Patates', 'Kabak', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Çorba + mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Mevsim meyvesi + badem', ingredients: ['Mevsim meyvesi', 'Badem'], emoji: '🍎' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Patatesli biberli omlet + peynir + zeytin', description: 'Kırmızı tatlı biber ile, fındık ezmesi tam buğday ekmeği', ingredients: ['Yumurta', 'Patates', 'Kırmızı biber', 'Lor peyniri', 'Zeytin', 'Salatalık', 'Fındık ezmesi', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Mercimek çorbası + tam buğday ekmeği + yoğurt', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Yoğurt', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Balık + tatlı patates püresi + tam buğday ekmeği', ingredients: ['Balık', 'Tatlı patates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Ev yapımı kek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Mevsim meyvesi'], emoji: '🍰' },
      ],
    },
    // Gün 11-15
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Maydanozlu omlet + labne + salatalık', ingredients: ['Yumurta', 'Maydanoz', 'Labne peyniri', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Bulgurlu kabak yemeği + yoğurt', ingredients: ['Bulgur', 'Kabak', 'Havuç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌶️' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi', ingredients: ['Kefir', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + dil peyniri + zeytin', description: 'Avokado ile', ingredients: ['Yumurta', 'Dil peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Brokoli çorbası + tam buğday ekmeği', ingredients: ['Brokoli', 'Patates', 'Havuç', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥦' },
        { slot: 'dinner', name: 'Ispanak yemeği + erişte + yoğurt', ingredients: ['Ispanak', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Ispanaklı omlet + lor peyniri + salatalık', ingredients: ['Yumurta', 'Ispanak', 'Lor peyniri', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balkabağı çorbası + sebzeli makarna', description: 'Kıymalı ve sebzeli', ingredients: ['Balkabağı', 'Kuzu kıyma', 'Havuç', 'Makarna', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'dinner', name: 'Etli nohut yemeği + bulgur pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Nohut', 'Domates', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Armut + ceviz', ingredients: ['Armut', 'Ceviz'], emoji: '🍐' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Kapya biberli omlet + labne + zeytin', ingredients: ['Yumurta', 'Kapya biber', 'Labne peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Sebzeli köfte + bulgur pilavı', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Balık + tatlı patates püresi', ingredients: ['Balık', 'Tatlı patates', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi', ingredients: ['Yoğurt', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + kaşar peyniri + avokado', description: 'Tahin-pekmez ile', ingredients: ['Yumurta', 'Kaşar peyniri', 'Avokado', 'Tahin', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Bulgurlu kabak yemeği + yoğurt', ingredients: ['Bulgur', 'Kabak', 'Havuç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Tavuk buğlama + erişte', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Kabak', 'Erişte', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Pankek + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    // Gün 16-20
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Menemen + dil peyniri + zeytin', ingredients: ['Yumurta', 'Domates', 'Biber', 'Dil peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Bulgurlu kabak yemeği + yoğurt', ingredients: ['Bulgur', 'Kabak', 'Kuzu kıyma', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Kıymalı bezelye + pirinç pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Bezelye', 'Havuç', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Kefir + kuruyemiş', ingredients: ['Kefir', 'Ceviz', 'Badem'], emoji: '🥛' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Yulaflı kaşar peynirli tost + salatalık', description: 'Zeytin ile', ingredients: ['Yulaf unu', 'Kaşar peyniri', 'Tam buğday ekmeği', 'Salatalık', 'Zeytin'], emoji: '🧀' },
        { slot: 'lunch', name: 'Etli nohut yemeği + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Nohut', 'Havuç', 'Domates', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Kurufasulye + pirinç pilavı + yoğurt', ingredients: ['Kuru fasulye', 'Domates', 'Soğan', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Pankek + labne + avokado + muz', description: '1 yumurta ile', ingredients: ['Yumurta', 'Yulaf unu', 'Labne peyniri', 'Avokado', 'Muz'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tarhana çorbası + tam buğday ekmeği', ingredients: ['Tarhana', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Balık + sebzeli makarna', ingredients: ['Balık', 'Makarna', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi + ceviz', ingredients: ['Yoğurt', 'Mevsim meyvesi', 'Ceviz'], emoji: '🥛' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Tarhanalı omlet + dil peyniri + zeytin', description: 'Salatalık ile', ingredients: ['Yumurta', 'Tarhana', 'Dil peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuk sote + bulgur pilavı + yoğurt', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Kıymalı ıspanak + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Ispanak', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi', ingredients: ['Kefir', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Menemen + lor peyniri + zeytin', description: 'Avokado ile', ingredients: ['Yumurta', 'Domates', 'Biber', 'Lor peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuk sote + sebzeli makarna', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Makarna', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Kıymalı bezelye + pirinç pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Bezelye', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Pankek + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    // Gün 21-25
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Patatesli omlet + labne + salatalık', ingredients: ['Yumurta', 'Patates', 'Labne peyniri', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Mücver + ayran', ingredients: ['Kabak', 'Havuç', 'Yumurta', 'Yulaf unu', 'Ayran', 'Zeytinyağı'], emoji: '🥙' },
        { slot: 'dinner', name: 'Tavuk sote + bulgur pilavı + yoğurt', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Ev yapımı kek + kefir', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Kefir'], emoji: '🍰' },
      ],
    },
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado + labne + zeytin', description: '1 yumurta ile', ingredients: ['Yumurta', 'Yulaf unu', 'Avokado', 'Labne peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌶️' },
        { slot: 'dinner', name: 'Kıymalı taze fasulye + pirinç pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Taze fasulye', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Mevsim meyvesi + badem', ingredients: ['Mevsim meyvesi', 'Badem'], emoji: '🍎' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Menemen + kaşar peyniri + zeytin', description: 'Salatalık ile', ingredients: ['Yumurta', 'Domates', 'Biber', 'Kaşar peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Köfte + sebzeli erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Erişte', 'Kabak', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Fırında patatesli tavuk + yoğurt', ingredients: ['Tavuk', 'Patates', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + kuruyemiş', ingredients: ['Kefir', 'Ceviz'], emoji: '🥛' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Kaşar peynirli tost + domates + salatalık', description: 'Zeytin ve avokado ile', ingredients: ['Kaşar peyniri', 'Tam buğday ekmeği', 'Domates', 'Salatalık', 'Zeytin', 'Avokado'], emoji: '🧀' },
        { slot: 'lunch', name: 'Balık + mercimekli bulgur pilavı', ingredients: ['Balık', 'Yeşil mercimek', 'Bulgur', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'dinner', name: 'Kıymalı enginar + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Enginar', 'Havuç', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Patatesli omlet + dil peyniri + zeytin', description: 'Tahin-pekmez ile', ingredients: ['Yumurta', 'Patates', 'Dil peyniri', 'Zeytin', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Mercimekli bulgur pilavı + yoğurt', ingredients: ['Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Tavuk sote + sebzeli erişte', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Erişte', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + mevsim meyvesi + ceviz', ingredients: ['Yoğurt', 'Mevsim meyvesi', 'Ceviz'], emoji: '🥛' },
      ],
    },
    // Gün 26-30
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Menemen + lor peyniri + zeytin', description: 'Avokado ile', ingredients: ['Yumurta', 'Domates', 'Biber', 'Lor peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kıymalı bamya + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Bamya', 'Domates', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Tavuklu bezelye + pirinç pilavı', ingredients: ['Tavuk', 'Bezelye', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi', ingredients: ['Kefir', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Pankek + labne + avokado + muz', ingredients: ['Yumurta', 'Yulaf unu', 'Labne peyniri', 'Avokado', 'Muz'], emoji: '🥞' },
        { slot: 'lunch', name: 'Balık + sebzeli bulgur pilavı', ingredients: ['Balık', 'Bulgur', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'dinner', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Ev yapımı kek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍰' },
      ],
    },
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli muffin + dil peyniri + zeytin', description: 'Salatalık ile', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Dil peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Et-patates haşlama + yoğurt', ingredients: ['Kuzu eti', 'Patates', 'Havuç', 'Kabak', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Kıymalı yeşil mercimek + bulgur pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Pankek + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Kapya biberli omlet + labne + zeytin', ingredients: ['Yumurta', 'Kapya biber', 'Labne peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Sulu köfte çorbası + tam buğday ekmeği', ingredients: ['Kuzu kıyma', 'Havuç', 'Patates', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Tavuk haşlama + sebzeler + yoğurt', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Kabak', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + kuruyemiş', ingredients: ['Kefir', 'Ceviz', 'Badem'], emoji: '🥛' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + avokado + zeytin', description: 'Tahin-pekmez ile', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytin', 'Tahin', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı semizotu yemeği + bulgur pilavı', ingredients: ['Kuzu kıyma', 'Semizotu', 'Bulgur', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'dinner', name: 'Tavuklu bezelye + erişte + yoğurt', ingredients: ['Tavuk', 'Bezelye', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
  ],
};

// ============================================================
// 10. AY — EK GIDAYA DEVAM MENÜSÜ
// Kahvaltı + Öğle + Akşam + Ara Öğün (PDF verisi)
// ============================================================
const month10: MealPlanTemplate = {
  month: 10,
  title: '10. Ay - Ek Gıdaya Devam Menüsü',
  description:
    'Günde 4 öğün: kahvaltı, öğle, akşam ve ara öğün. Karnabahar, cacık, şehriye, kaşar peyniri, bamya ve kavurma et tanıtılır.',
  mealSlots: ['breakfast', 'lunch', 'dinner', 'snack'],
  notes: [
    'Parmak yiyecekler artık düzenli olarak sunulmalı.',
    'Yemeklerin dokusu aile yemeklerine yaklaştırılmalı.',
    'Hâlâ tuz eklenmemeli (1 yaşına kadar).',
    'Hâlâ bal verilmemeli (1 yaşına kadar).',
    'Hâlâ inek sütü verilmemeli (1 yaşına kadar).',
    'Ispanak haftada en fazla 2 kez verilmelidir.',
    'Kavurma et iyice pişirilip ufak parçalara ayrılmalı.',
  ],
  newFoodsIntroduced: [
    'Karnabahar',
    'Cacık',
    'Şehriye',
    'Kaşar peyniri',
    'Bamya',
    'Kavurma et',
  ],
  days: [
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Omlet + kaşar + zeytin + avokado', description: 'Tahin/pekmez ile', ingredients: ['Yumurta', 'Kaşar peyniri', 'Zeytin', 'Avokado', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Mücver + yoğurt', ingredients: ['Kabak', 'Havuç', 'Yumurta', 'Yoğurt', 'Zeytinyağı'], emoji: '🥙' },
        { slot: 'dinner', name: 'Etli nohut yemeği + şehriye pilavı + cacık', ingredients: ['Kuzu kıyma', 'Nohut', 'Domates', 'Şehriye', 'Yoğurt', 'Salatalık', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Kuru meyveler + karadut suyu + kuruyemiş', ingredients: ['Kuru üzüm', 'Kuru dut', 'Karadut suyu', 'Ceviz'], emoji: '🍇' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + avokado', description: 'Domates/salatalık, pekmez/tam buğday', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Domates', 'Salatalık', 'Pekmez', 'Tam buğday ekmeği'], emoji: '🥚' },
        { slot: 'lunch', name: 'Karnabahar yemeği + yoğurt', ingredients: ['Karnabahar', 'Havuç', 'Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥦' },
        { slot: 'dinner', name: 'Mevsim balığı + mercimekli bulgur pilavı', ingredients: ['Balık', 'Yeşil mercimek', 'Bulgur', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Peynirli çırpma yumurta + dil peyniri', description: 'Avokado, zeytin, salatalık/domates', ingredients: ['Yumurta', 'Dil peyniri', 'Avokado', 'Zeytin', 'Salatalık', 'Domates', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Karnabahar yemeği + yoğurt', ingredients: ['Karnabahar', 'Havuç', 'Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥦' },
        { slot: 'dinner', name: 'Taze fasulye + pilav + cacık', ingredients: ['Taze fasulye', 'Domates', 'Pirinç', 'Yoğurt', 'Salatalık', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Taze meyve + kuruyemiş', ingredients: ['Mevsim meyvesi', 'Ceviz'], emoji: '🍎' },
      ],
    },
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + zeytin + krep', description: 'Salatalık, tahin pekmez ile krep, sevdiği meyve', ingredients: ['Yumurta', 'Zeytin', 'Salatalık', 'Yulaf unu', 'Tahin', 'Pekmez', 'Mevsim meyvesi'], emoji: '🥚' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'dinner', name: 'Fırın tavuk + sebzeli erişte', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Erişte', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi', ingredients: ['Kefir', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Yulaflı kaşar peynirli tost + salatalık', description: 'Domates, zeytin, avokado, labne', ingredients: ['Yumurta', 'Yulaf unu', 'Kaşar peyniri', 'Tam buğday ekmeği', 'Salatalık', 'Domates', 'Zeytin', 'Avokado', 'Labne peyniri'], emoji: '🧀' },
        { slot: 'lunch', name: 'Kıymalı bezelye + bulgur pilavı', ingredients: ['Kuzu kıyma', 'Bezelye', 'Havuç', 'Domates', 'Bulgur', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌶️' },
        { slot: 'snack', name: 'Pankek + tahin + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Tahin', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Yumurtalı fincan kek + kaşar + zeytin', description: 'Avokado ile', ingredients: ['Yumurta', 'Yulaf unu', 'Kaşar peyniri', 'Zeytin', 'Salatalık', 'Avokado', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Kıymalı bezelye + bulgur pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Bezelye', 'Havuç', 'Domates', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Kurufasulye + pilav + yoğurt', ingredients: ['Kuru fasulye', 'Domates', 'Soğan', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + kefir', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Kefir'], emoji: '🍪' },
      ],
    },
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Çırpma yumurta biberli + lor + domates', description: 'Salatalık, zeytin, avokado', ingredients: ['Yumurta', 'Biber', 'Lor peyniri', 'Domates', 'Salatalık', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuk köftesi + sebzeli erişte', ingredients: ['Tavuk', 'Erişte', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Etli sebzeli haşlama + bulgur pilavı + yoğurt', ingredients: ['Kuzu eti', 'Havuç', 'Patates', 'Kabak', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Meyve + kuruyemiş', ingredients: ['Mevsim meyvesi', 'Ceviz'], emoji: '🍎' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Menemen + dil peyniri + zeytin', description: 'Biber/salatalık, tahin/pekmez, tam buğday ekmeği', ingredients: ['Yumurta', 'Domates', 'Biber', 'Dil peyniri', 'Zeytin', 'Salatalık', 'Tam buğday ekmeği', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuk köftesi + sebzeli erişte', ingredients: ['Tavuk', 'Erişte', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Yeşil mercimek yemeği kıymalı + yoğurt', ingredients: ['Yeşil mercimek', 'Kuzu kıyma', 'Havuç', 'Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Kuru meyve + kefir', ingredients: ['Kuru üzüm', 'Kuru dut', 'Kefir'], emoji: '🍇' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Tarhanalı omlet + labne + zeytin + avokado', description: 'Tam buğday ekmeği, karadut suyu', ingredients: ['Yumurta', 'Tarhana', 'Labne peyniri', 'Zeytin', 'Avokado', 'Tam buğday ekmeği', 'Karadut suyu', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kabak yemeği kıymalı + yoğurt', ingredients: ['Kabak', 'Kuzu kıyma', 'Domates', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Tavuk sote + soslu makarna', ingredients: ['Tavuk', 'Makarna', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Ev yapımı sebzeli muffin + ayran + kuruyemiş', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Yulaf unu', 'Ayran', 'Ceviz', 'Zeytinyağı'], emoji: '🧁' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + zeytin + pankek', description: 'Labne + muz sürülerek + avokado', ingredients: ['Yumurta', 'Zeytin', 'Yulaf unu', 'Labne peyniri', 'Muz', 'Avokado'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kabak yemeği kıymalı + yoğurt', ingredients: ['Kabak', 'Kuzu kıyma', 'Domates', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Izgara balık + mercimekli bulgur pilavı', ingredients: ['Balık', 'Yeşil mercimek', 'Bulgur', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Ev yapımı kek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez', 'Mevsim meyvesi'], emoji: '🍰' },
      ],
    },
    // Gün 11-15
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Patatesli omlet + lor + zeytin + salatalık', ingredients: ['Yumurta', 'Patates', 'Lor peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Sulu köfte çorbası + tam buğday ekmeği', ingredients: ['Kuzu kıyma', 'Havuç', 'Patates', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'dinner', name: 'Kıymalı semizotu + bulgur pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Semizotu', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi', ingredients: ['Kefir', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + dil peyniri + avokado', description: 'Zeytin, domates ile', ingredients: ['Yumurta', 'Dil peyniri', 'Avokado', 'Zeytin', 'Domates', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Ispanak yemeği + erişte + yoğurt', ingredients: ['Ispanak', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'dinner', name: 'Fırın tavuk + sebzeler + yoğurt', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Kabak', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli omlet + labne + zeytin + salatalık', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Labne peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuklu mercimekli bulgur pilavı + yoğurt', ingredients: ['Tavuk', 'Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Bamya yemeği + pilav + yoğurt', ingredients: ['Bamya', 'Kuzu kıyma', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Pankek + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Menemen + kaşar peyniri + zeytin', description: 'Salatalık, domates ile', ingredients: ['Yumurta', 'Domates', 'Biber', 'Kaşar peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuklu mercimekli bulgur pilavı + yoğurt', ingredients: ['Tavuk', 'Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Tavuk köftesi + sebzeli makarna + yoğurt', ingredients: ['Tavuk', 'Makarna', 'Kabak', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + kuruyemiş', ingredients: ['Kefir', 'Ceviz', 'Badem'], emoji: '🥛' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + avokado + zeytin', description: 'Tahin-pekmez ile', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytin', 'Tahin', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuklu mercimekli bulgur pilavı + yoğurt', ingredients: ['Tavuk', 'Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Balık + tatlı patates püresi + tam buğday ekmeği', ingredients: ['Balık', 'Tatlı patates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Ev yapımı kek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍰' },
      ],
    },
    // Gün 16-20
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Kaşarlı sebzeli yulaf tost + salatalık', description: 'Zeytin, avokado ile', ingredients: ['Yulaf unu', 'Kaşar peyniri', 'Kabak', 'Tam buğday ekmeği', 'Salatalık', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Tavuklu mercimekli bulgur pilavı + yoğurt', ingredients: ['Tavuk', 'Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Etli nohut + şehriye pilavı + cacık', ingredients: ['Kuzu kıyma', 'Nohut', 'Domates', 'Şehriye', 'Yoğurt', 'Salatalık', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi', ingredients: ['Kefir', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Patatesli yeşillikli omlet + dil peyniri', description: 'Zeytin, salatalık ile', ingredients: ['Yumurta', 'Patates', 'Maydanoz', 'Dil peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Sebzeli pırasa yemeği + yoğurt', ingredients: ['Pırasa', 'Havuç', 'Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Taze fasulye + pilav + cacık', ingredients: ['Taze fasulye', 'Domates', 'Pirinç', 'Yoğurt', 'Salatalık', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + avokado + zeytin', description: 'Pekmez ile', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytin', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı patates oturtma + yoğurt', ingredients: ['Kuzu kıyma', 'Patates', 'Domates', 'Biber', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Tavuk but + sebzeli makarna + yoğurt', ingredients: ['Tavuk', 'Makarna', 'Kabak', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Pankek + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Menemen + dil peyniri + zeytin', description: 'Salatalık, avokado ile', ingredients: ['Yumurta', 'Domates', 'Biber', 'Dil peyniri', 'Zeytin', 'Salatalık', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kıymalı patates oturtma + yoğurt', ingredients: ['Kuzu kıyma', 'Patates', 'Domates', 'Biber', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Balık + mercimekli bulgur pilavı', ingredients: ['Balık', 'Yeşil mercimek', 'Bulgur', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kefir + kuruyemiş', ingredients: ['Kefir', 'Ceviz', 'Badem'], emoji: '🥛' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli bebek muffin + kaşar + zeytin', description: 'Avokado ile', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Yulaf unu', 'Kaşar peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Sebzeli pırasa yemeği + yoğurt', ingredients: ['Pırasa', 'Havuç', 'Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Etli brüksel lahanası + bulgur pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Brüksel lahanası', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Ev yapımı kek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍰' },
      ],
    },
    // Gün 21-25
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Biberli omlet + labne + zeytin + avokado', ingredients: ['Yumurta', 'Biber', 'Labne peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balık + sebzeli erişte', ingredients: ['Balık', 'Erişte', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'dinner', name: 'Mercimekli bulgur pilavı + yoğurt', ingredients: ['Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi + kuruyemiş', ingredients: ['Kefir', 'Mevsim meyvesi', 'Ceviz'], emoji: '🥛' },
      ],
    },
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Pankek + labne + avokado + muz', ingredients: ['Yumurta', 'Yulaf unu', 'Labne peyniri', 'Avokado', 'Muz'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kurufasulye + pilav + yoğurt', ingredients: ['Kuru fasulye', 'Domates', 'Soğan', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Kıymalı enginar + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Enginar', 'Havuç', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Kaşar peynirli tost + domates + salatalık', description: 'Zeytin, avokado ile', ingredients: ['Kaşar peyniri', 'Tam buğday ekmeği', 'Domates', 'Salatalık', 'Zeytin', 'Avokado'], emoji: '🧀' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌶️' },
        { slot: 'dinner', name: 'Taze patates püresi + tavuk köfte + yoğurt', ingredients: ['Patates', 'Tavuk', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Pankek + tahin + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Tahin', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Patatesli omlet + lor + zeytin + salatalık', ingredients: ['Yumurta', 'Patates', 'Lor peyniri', 'Zeytin', 'Salatalık', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kıymalı ıspanak + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Ispanak', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'dinner', name: 'Erişte + yoğurt', ingredients: ['Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🍝' },
        { slot: 'snack', name: 'Kefir + kuruyemiş', ingredients: ['Kefir', 'Ceviz'], emoji: '🥛' },
      ],
    },
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Tarhanalı omlet + dil peyniri + avokado', description: 'Zeytin ile', ingredients: ['Yumurta', 'Tarhana', 'Dil peyniri', 'Avokado', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuk sote + bulgur pilavı + yoğurt', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Mercimekli bulgur pilavı + yoğurt', ingredients: ['Yeşil mercimek', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Ev yapımı kek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍰' },
      ],
    },
    // Gün 26-30
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Menemen + lor + zeytin + avokado', ingredients: ['Yumurta', 'Domates', 'Biber', 'Lor peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kabak yemeği kıymalı + yoğurt', ingredients: ['Kabak', 'Kuzu kıyma', 'Domates', 'Havuç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Kıymalı semizotu + bulgur pilavı + yoğurt', ingredients: ['Kuzu kıyma', 'Semizotu', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Kefir + mevsim meyvesi', ingredients: ['Kefir', 'Mevsim meyvesi'], emoji: '🥛' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor + avokado', description: 'Zeytin, pekmez ile', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytin', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kavurma et + sebzeli erişte', ingredients: ['Kavurma et', 'Erişte', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Tarhana çorbası + mantı + yoğurt', ingredients: ['Tarhana', 'Tam buğday unu', 'Kuzu kıyma', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍪' },
      ],
    },
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Yulaflı kaşar peynirli tost + salatalık', description: 'Zeytin, avokado ile', ingredients: ['Yulaf unu', 'Kaşar peyniri', 'Tam buğday ekmeği', 'Salatalık', 'Zeytin', 'Avokado'], emoji: '🧀' },
        { slot: 'lunch', name: 'Kıymalı bamya + pilav + yoğurt', ingredients: ['Kuzu kıyma', 'Bamya', 'Domates', 'Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Etli nohut + şehriye pilavı + cacık', ingredients: ['Kuzu kıyma', 'Nohut', 'Domates', 'Şehriye', 'Yoğurt', 'Salatalık', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'snack', name: 'Pankek + tahin + mevsim meyvesi', ingredients: ['Yumurta', 'Yulaf unu', 'Tahin', 'Mevsim meyvesi'], emoji: '🥞' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli omlet + labne + zeytin', description: 'Avokado ile', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Labne peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Sebzeli bezelye yemeği + bulgur pilavı', ingredients: ['Bezelye', 'Havuç', 'Patates', 'Domates', 'Bulgur', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Fırın balık + fırın sebze + yoğurt', ingredients: ['Balık', 'Havuç', 'Kabak', 'Patates', 'Yoğurt', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kefir + kuruyemiş', ingredients: ['Kefir', 'Ceviz', 'Badem'], emoji: '🥛' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Sebzeli bebek muffin + kaşar + zeytin', description: 'Avokado ile', ingredients: ['Yumurta', 'Kabak', 'Havuç', 'Yulaf unu', 'Kaşar peyniri', 'Zeytin', 'Avokado', 'Zeytinyağı'], emoji: '🧁' },
        { slot: 'lunch', name: 'Sebzeli bezelye yemeği + bulgur pilavı + yoğurt', ingredients: ['Bezelye', 'Havuç', 'Patates', 'Domates', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥘' },
        { slot: 'dinner', name: 'Kıymalı semizotu + erişte + yoğurt', ingredients: ['Kuzu kıyma', 'Semizotu', 'Erişte', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Ev yapımı kek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Mevsim meyvesi'], emoji: '🍰' },
      ],
    },
  ],
};

// ============================================================
// GENEL NOTLAR (PDF'lerden alinan onemli bilgiler)
// ============================================================
export const MEAL_PLAN_GENERAL_NOTES: string[] = [
  'Zeytinyağı tüm yemeklere eklenmelidir.',
  'Pirinç günlük olarak taze yapılmalı, saklama yapılmamalıdır.',
  'Kıyma 12. aya kadar çift çekilmiş kuzu olmalıdır.',
  'Domates 12. aya kadar yalnızca pişmiş olarak kullanılacaktır.',
  'Pekmez ısıya maruz kalmamalı, yemeğe son anda eklenecektir.',
  'İrmik su ile pişirilerek verilecektir.',
  'Nohut 1 gece suda bekletilip zarı çıkarılacaktır.',
  'Ispanak haftada en fazla 2 kez verilmelidir.',
  'Ek gıda sonrası su verilmelidir.',
  'Her yeni besine en az 3 gün boyunca devam edilerek alerji takibi yapılmalıdır.',
  '1 yaşından önce tuz, bal ve inek sütü verilmemelidir.',
];

// ============================================================
// ANA EXPORT
// ============================================================
export const MEAL_PLAN_TEMPLATES: MealPlanTemplate[] = [
  month6,
  month7,
  month8,
  month9,
  month10,
];

export default MEAL_PLAN_TEMPLATES;

// ============================================================
// YARDIMCI FONKSİYONLAR
// ============================================================

/**
 * Belirli bir ay için beslenme planı şablonunu döndürür.
 */
export function getTemplateByMonth(month: number): MealPlanTemplate | undefined {
  return MEAL_PLAN_TEMPLATES.find((t) => t.month === month);
}

/**
 * Takvim ayına göre mevsimsel besinleri döndürür.
 * PDF'den alınan mevsimsel gıda verileri.
 */
export function getSeasonalFoods(month: number): { vegetables: string[]; fruits: string[] } {
  const seasonalMap: Record<number, { vegetables: string[]; fruits: string[] }> = {
    1: {
      vegetables: ['Lahana', 'Brokoli', 'Havuç', 'Pırasa', 'Balkabağı', 'Ispanak'],
      fruits: ['Portakal', 'Elma', 'Armut', 'Mandalina', 'Kivi'],
    },
    2: {
      vegetables: ['Lahana', 'Brokoli', 'Havuç', 'Pırasa', 'Balkabağı', 'Ispanak'],
      fruits: ['Portakal', 'Elma', 'Armut', 'Mandalina', 'Kivi'],
    },
    3: {
      vegetables: ['Lahana', 'Brokoli', 'Havuç', 'Pırasa', 'Balkabağı', 'Ispanak'],
      fruits: ['Portakal', 'Elma', 'Armut', 'Mandalina', 'Kivi'],
    },
    4: {
      vegetables: ['Semizotu', 'Enginar', 'Bezelye', 'Ispanak', 'Havuç'],
      fruits: ['Erik', 'Avokado', 'Elma'],
    },
    5: {
      vegetables: ['Salatalık', 'Domates', 'Fasulye', 'Semizotu', 'Bezelye'],
      fruits: ['Çilek', 'Dut', 'Elma', 'Erik'],
    },
    6: {
      vegetables: ['Kabak', 'Fasulye', 'Domates', 'Biber', 'Bamya'],
      fruits: ['Kavun', 'Karpuz', 'Kiraz', 'Şeftali', 'Kayısı'],
    },
    7: {
      vegetables: ['Kabak', 'Fasulye', 'Domates', 'Biber', 'Bamya'],
      fruits: ['Kavun', 'Karpuz', 'Kiraz', 'Şeftali', 'Kayısı'],
    },
    8: {
      vegetables: ['Kabak', 'Fasulye', 'Domates', 'Biber', 'Bamya'],
      fruits: ['Üzüm', 'İncir', 'Karpuz', 'Şeftali'],
    },
    9: {
      vegetables: ['Kabak', 'Fasulye', 'Domates', 'Biber', 'Bamya'],
      fruits: ['Üzüm', 'İncir', 'Karpuz', 'Şeftali'],
    },
    10: {
      vegetables: ['Pırasa', 'Mantar', 'Lahana', 'Ispanak'],
      fruits: ['Mandalina', 'Elma', 'Armut', 'Nar'],
    },
    11: {
      vegetables: ['Şalgam', 'Havuç', 'Ispanak', 'Brokoli'],
      fruits: ['Ayva', 'Nar', 'Greyfurt', 'Portakal', 'Kivi'],
    },
    12: {
      vegetables: ['Şalgam', 'Ispanak', 'Brokoli', 'Balkabağı'],
      fruits: ['Muşmula', 'Avokado', 'Portakal'],
    },
  };

  return seasonalMap[month] || { vegetables: [], fruits: [] };
}

/**
 * Bebeğin yaşına (ay olarak) göre tüm izin verilen besinleri döndürür.
 * PDF'den alınan yaşa göre besin listesi.
 */
export function getFoodsByAge(ageMonths: number): string[] {
  const foods: string[] = [];

  // 6+ ay
  if (ageMonths >= 6) {
    foods.push(
      // Sebzeler
      'Patates', 'Havuç', 'Kabak', 'Brokoli', 'Karnabahar', 'Kereviz',
      'Bamya', 'Bezelye', 'Biber', 'Pırasa', 'Semizotu', 'Yeşil Fasulye',
      // Meyveler
      'Elma', 'Armut', 'Avokado', 'Muz', 'Erik', 'Kayısı', 'Şeftali',
      'Portakal', 'Kavun', 'Karpuz',
      // Süt ürünleri
      'Yoğurt', 'Yumurta sarısı',
      // Et
      'Kırmızı et',
      // Yağlar
      'Zeytinyağı', 'Tereyağı',
      // Tahıllar
      'Pirinç', 'Buğday', 'Yulaf',
      // Kuruyemişler
      'Ceviz', 'Badem', 'Fıstık',
    );
  }

  // 7+ ay
  if (ageMonths >= 7) {
    foods.push(
      'Ispanak', 'Taze soğan', 'Domates', 'Sarımsak',
      'Tavuk', 'Hindi',
      'Çavdar', 'Pekmez', 'Sade yağ', 'Nane',
    );
  }

  // 8+ ay
  if (ageMonths >= 8) {
    foods.push(
      // Meyveler
      'İncir', 'Kiraz', 'Mango', 'Nar', 'Vişne',
      // Sebzeler
      'Soğan',
      // Baklagiller
      'Börülce', 'Nohut', 'Mercimek', 'Kuru fasulye', 'Barbunya',
      // Protein
      'Yumurta beyazı', 'Balık',
      // Tahıllar
      'Bulgur', 'Tam buğday unu',
      // Baharat ve diğer
      'Tahin', 'Karabiber', 'Kekik', 'Tarçın', 'Susam', 'Kuru üzüm',
    );
  }

  // 9+ ay
  if (ageMonths >= 9) {
    foods.push('Yaban mersini', 'Zerdeçal', 'Zencefil');
  }

  // 10+ ay
  if (ageMonths >= 10) {
    foods.push('Kivi');
  }

  // 12+ ay (1 yaş)
  if (ageMonths >= 12) {
    foods.push(
      'Böğürtlen', 'Çilek', 'Dut', 'Greyfurt',
      'Mantar', 'Tuz', 'Zeytin',
      'Kefir', 'Reçel', 'Kakao', 'İnek sütü',
    );
  }

  return foods;
}
