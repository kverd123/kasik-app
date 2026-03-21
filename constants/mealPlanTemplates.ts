// mealPlanTemplates.ts
// Kaşık - Bebek Ek Gıda Uygulaması
// Aylık Beslenme Planı Şablonları (6-10. Ay)

export interface MealTemplate {
  slot: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'taste';
  name: string;
  description?: string;
  ingredients: string[];
  recipeId?: string;
  emoji: string;
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
    // Gün 1-3: Kabak
    { day: 1, meals: [{ slot: 'taste', name: 'Kabak püresi', description: '1 çay kaşığı ile başlayın', ingredients: ['Kabak', 'Zeytinyağı'], emoji: '🎃' }] },
    { day: 2, meals: [{ slot: 'taste', name: 'Kabak püresi', description: '2 çay kaşığı', ingredients: ['Kabak', 'Zeytinyağı'], emoji: '🎃' }] },
    { day: 3, meals: [{ slot: 'taste', name: 'Kabak püresi', description: '1 yemek kaşığına kadar artırın', ingredients: ['Kabak', 'Zeytinyağı'], emoji: '🎃' }] },
    // Gün 4-6: Havuç + Kabak
    { day: 4, meals: [{ slot: 'taste', name: 'Havuç püresi', description: 'Yeni besin: havuç tadımı', ingredients: ['Havuç', 'Zeytinyağı'], emoji: '🥕' }] },
    { day: 5, meals: [{ slot: 'taste', name: 'Havuç-kabak püresi', ingredients: ['Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥕' }] },
    { day: 6, meals: [{ slot: 'taste', name: 'Havuç-kabak püresi', ingredients: ['Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥕' }] },
    // Gün 7-9: Patates
    { day: 7, meals: [{ slot: 'taste', name: 'Patates püresi', description: 'Yeni besin: patates tadımı', ingredients: ['Patates', 'Zeytinyağı'], emoji: '🥔' }] },
    { day: 8, meals: [{ slot: 'taste', name: 'Patates-havuç püresi', ingredients: ['Patates', 'Havuç', 'Zeytinyağı'], emoji: '🥔' }] },
    { day: 9, meals: [{ slot: 'taste', name: 'Patates-kabak-havuç püresi', ingredients: ['Patates', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🥔' }] },
    // Gün 10-12: Yoğurt
    { day: 10, meals: [{ slot: 'taste', name: 'Yoğurt', description: 'Yeni besin: yoğurt tadımı', ingredients: ['Yoğurt'], emoji: '🥛' }] },
    { day: 11, meals: [{ slot: 'taste', name: 'Yoğurt + kabak püresi', ingredients: ['Yoğurt', 'Kabak'], emoji: '🥛' }] },
    { day: 12, meals: [{ slot: 'taste', name: 'Yoğurt + havuç püresi', ingredients: ['Yoğurt', 'Havuç'], emoji: '🥛' }] },
    // Gün 13-15: Avokado
    { day: 13, meals: [{ slot: 'taste', name: 'Avokado püresi', description: 'Yeni besin: avokado tadımı', ingredients: ['Avokado'], emoji: '🥑' }] },
    { day: 14, meals: [{ slot: 'taste', name: 'Avokado + yoğurt', ingredients: ['Avokado', 'Yoğurt'], emoji: '🥑' }] },
    { day: 15, meals: [{ slot: 'taste', name: 'Avokado-patates püresi', ingredients: ['Avokado', 'Patates', 'Zeytinyağı'], emoji: '🥑' }] },
    // Gün 16-18: Elma
    { day: 16, meals: [{ slot: 'taste', name: 'Elma püresi', description: 'Yeni besin: elma tadımı (pişmiş)', ingredients: ['Elma'], emoji: '🍎' }] },
    { day: 17, meals: [{ slot: 'taste', name: 'Elma + yoğurt', ingredients: ['Elma', 'Yoğurt'], emoji: '🍎' }] },
    { day: 18, meals: [{ slot: 'taste', name: 'Elma-havuç püresi', ingredients: ['Elma', 'Havuç', 'Zeytinyağı'], emoji: '🍎' }] },
    // Gün 19-21: Armut
    { day: 19, meals: [{ slot: 'taste', name: 'Armut püresi', description: 'Yeni besin: armut tadımı', ingredients: ['Armut'], emoji: '🍐' }] },
    { day: 20, meals: [{ slot: 'taste', name: 'Armut + yoğurt', ingredients: ['Armut', 'Yoğurt'], emoji: '🍐' }] },
    { day: 21, meals: [{ slot: 'taste', name: 'Armut-elma püresi', ingredients: ['Armut', 'Elma'], emoji: '🍐' }] },
    // Gün 22-24: Yumurta sarısı
    { day: 22, meals: [{ slot: 'taste', name: 'Yumurta sarısı', description: 'Yeni besin: yumurta sarısı tadımı', ingredients: ['Yumurta sarısı'], emoji: '🥚' }] },
    { day: 23, meals: [{ slot: 'taste', name: 'Yumurta sarısı + patates püresi', ingredients: ['Yumurta sarısı', 'Patates', 'Zeytinyağı'], emoji: '🥚' }] },
    { day: 24, meals: [{ slot: 'taste', name: 'Yumurta sarısı + avokado', ingredients: ['Yumurta sarısı', 'Avokado'], emoji: '🥚' }] },
    // Gün 25-27: Lor peyniri
    { day: 25, meals: [{ slot: 'taste', name: 'Lor peyniri', description: 'Yeni besin: lor peyniri tadımı', ingredients: ['Lor peyniri'], emoji: '🧀' }] },
    { day: 26, meals: [{ slot: 'taste', name: 'Lor peyniri + armut', ingredients: ['Lor peyniri', 'Armut'], emoji: '🧀' }] },
    { day: 27, meals: [{ slot: 'taste', name: 'Lor peyniri + avokado + yumurta sarısı', ingredients: ['Lor peyniri', 'Avokado', 'Yumurta sarısı'], emoji: '🧀' }] },
    // Gün 28-30: Yulaf unu
    { day: 28, meals: [{ slot: 'taste', name: 'Yulaf lapası', description: 'Yeni besin: yulaf unu tadımı', ingredients: ['Yulaf unu', 'Su'], emoji: '🥣' }] },
    { day: 29, meals: [{ slot: 'taste', name: 'Yulaf lapası + elma', ingredients: ['Yulaf unu', 'Elma', 'Su'], emoji: '🥣' }] },
    { day: 30, meals: [{ slot: 'taste', name: 'Yulaf lapası + armut + yoğurt', ingredients: ['Yulaf unu', 'Armut', 'Yoğurt'], emoji: '🥣' }] },
  ],
};

// ============================================================
// 7. AY — 3 ÖĞÜN: Kahvaltı, Tadım, İkindi
// ============================================================
const month7: MealPlanTemplate = {
  month: 7,
  title: '7. Ay - 3 Öğün Beslenme Planı',
  description:
    'Günde 3 öğün: kahvaltı, tadım (yeni besin tanıtımı) ve ikindi. Daha fazla çeşitlilik ve yeni gıdalar tanıtılır.',
  mealSlots: ['breakfast', 'taste', 'snack'],
  notes: [
    'Tüm yemeklere zeytinyağı eklemeyi unutmayalım.',
    'Ek gıda sonrası suyu ihmal etmeyelim.',
    'Kıyma çift çekilmiş ve kuzu olmalı 12. aya kadar.',
    'Pirinç günlük yapılmalı, saklama yapılmamalı.',
    'Pekmez ısıya maruz kalmamalı, yemeğe son anda eklenecek.',
    'İrmik su ile pişirilerek verilecek.',
  ],
  newFoodsIntroduced: [
    'Ceviz',
    'Pirinç',
    'Kıyma (çift çekilmiş kuzu)',
    'Semizotu',
    'Bezelye',
    'Pekmez',
    'Kayısı',
    'Tam buğday unu',
    'İrmik',
    'Domates (pişmiş)',
    'Yeşil fasulye',
  ],
  days: [
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Avokado-lor-yumurta sarısı', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'taste', name: 'Ceviz tadımı', description: 'Yeni besin: ceviz (ince çekilmiş)', ingredients: ['Ceviz', 'Yoğurt'], emoji: '🌰' },
        { slot: 'snack', name: 'Sebze çorbası', ingredients: ['Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + armut', ingredients: ['Yulaf unu', 'Armut', 'Su'], emoji: '🥣' },
        { slot: 'taste', name: 'Cevizli yoğurt', description: 'Ceviz devam', ingredients: ['Ceviz', 'Yoğurt', 'Elma'], emoji: '🌰' },
        { slot: 'snack', name: 'Kabak-patates püresi', ingredients: ['Kabak', 'Patates', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı + lor peyniri', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'taste', name: 'Ceviz-avokado', description: 'Ceviz devam', ingredients: ['Ceviz', 'Avokado'], emoji: '🌰' },
        { slot: 'snack', name: 'Havuçlu patates püresi', ingredients: ['Havuç', 'Patates', 'Zeytinyağı'], emoji: '🥕' },
      ],
    },
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Elmalı yulaf lapası', ingredients: ['Yulaf unu', 'Elma', 'Su'], emoji: '🍎' },
        { slot: 'taste', name: 'Pirinç lapası', description: 'Yeni besin: pirinç (günlük taze yapılmalı)', ingredients: ['Pirinç', 'Su', 'Zeytinyağı'], emoji: '🍚' },
        { slot: 'snack', name: 'Yoğurt + elma püresi', ingredients: ['Yoğurt', 'Elma'], emoji: '🥛' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Avokado-yoğurt', ingredients: ['Avokado', 'Yoğurt'], emoji: '🥑' },
        { slot: 'taste', name: 'Pirinçli sebze', description: 'Pirinç devam', ingredients: ['Pirinç', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
        { slot: 'snack', name: 'Armut püresi + lor', ingredients: ['Armut', 'Lor peyniri'], emoji: '🍐' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Lor + armut + ceviz', ingredients: ['Lor peyniri', 'Armut', 'Ceviz'], emoji: '🧀' },
        { slot: 'taste', name: 'Pirinçli havuç', description: 'Pirinç devam', ingredients: ['Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
        { slot: 'snack', name: 'Patates-kabak püresi', ingredients: ['Patates', 'Kabak', 'Zeytinyağı'], emoji: '🥔' },
      ],
    },
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı + avokado', ingredients: ['Yumurta sarısı', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'taste', name: 'Kıyma tadımı', description: 'Yeni besin: kuzu kıyma (çift çekilmiş)', ingredients: ['Kuzu kıyma', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt çorbası', ingredients: ['Yoğurt', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı', ingredients: ['Yulaf unu', 'Armut', 'Su'], emoji: '🥣' },
        { slot: 'taste', name: 'Kıymalı patates', description: 'Kıyma devam', ingredients: ['Kuzu kıyma', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Elma-armut püresi', ingredients: ['Elma', 'Armut'], emoji: '🍎' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Lor + ceviz + elma', ingredients: ['Lor peyniri', 'Ceviz', 'Elma'], emoji: '🧀' },
        { slot: 'taste', name: 'Kıymalı kabak', description: 'Kıyma devam', ingredients: ['Kuzu kıyma', 'Kabak', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Havuç-patates çorbası', ingredients: ['Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Avokado-lor-yumurta sarısı', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'taste', name: 'Semizotu tadımı', description: 'Yeni besin: semizotu', ingredients: ['Semizotu', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Kıymalı pirinç', ingredients: ['Kuzu kıyma', 'Pirinç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma', ingredients: ['Yulaf unu', 'Elma', 'Su'], emoji: '🥣' },
        { slot: 'taste', name: 'Semizotlu yoğurt', description: 'Semizotu devam', ingredients: ['Semizotu', 'Yoğurt', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Sebzeli kıyma yemeği', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı + lor', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'taste', name: 'Semizotlu patates', description: 'Semizotu devam', ingredients: ['Semizotu', 'Patates', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + armut', ingredients: ['Yoğurt', 'Armut'], emoji: '🥛' },
      ],
    },
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Pankek', description: 'Yulaf unu + yumurta sarısı + elma rendesi', ingredients: ['Yulaf unu', 'Yumurta sarısı', 'Elma'], emoji: '🥞' },
        { slot: 'taste', name: 'Bezelye tadımı', description: 'Yeni besin: bezelye', ingredients: ['Bezelye', 'Patates', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Kıymalı sebze çorbası', ingredients: ['Kuzu kıyma', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Avokado + ceviz + yoğurt', ingredients: ['Avokado', 'Ceviz', 'Yoğurt'], emoji: '🥑' },
        { slot: 'taste', name: 'Bezelye püresi', description: 'Bezelye devam', ingredients: ['Bezelye', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Pirinçli sebze yemeği', ingredients: ['Pirinç', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Lor + armut + ceviz', ingredients: ['Lor peyniri', 'Armut', 'Ceviz'], emoji: '🧀' },
        { slot: 'taste', name: 'Bezelyeli patates', description: 'Bezelye devam', ingredients: ['Bezelye', 'Patates', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Kıymalı havuç yemeği', ingredients: ['Kuzu kıyma', 'Havuç', 'Zeytinyağı'], emoji: '🥕' },
      ],
    },
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + armut', ingredients: ['Yulaf unu', 'Armut', 'Su'], emoji: '🥣' },
        { slot: 'taste', name: 'Pekmez tadımı', description: 'Yeni besin: pekmez (ısıya maruz kalmamalı)', ingredients: ['Pekmez', 'Yoğurt'], emoji: '🍯' },
        { slot: 'snack', name: 'Bezelyeli kıyma', ingredients: ['Bezelye', 'Kuzu kıyma', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı + avokado', ingredients: ['Yumurta sarısı', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'taste', name: 'Pekmezli yoğurt', description: 'Pekmez devam', ingredients: ['Pekmez', 'Yoğurt'], emoji: '🍯' },
        { slot: 'snack', name: 'Sebze çorbası + pirinç', ingredients: ['Havuç', 'Kabak', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Omlet (yumurta sarısı)', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'taste', name: 'Pekmez + lor', description: 'Pekmez devam', ingredients: ['Pekmez', 'Lor peyniri'], emoji: '🍯' },
        { slot: 'snack', name: 'Kıymalı kabak yemeği', ingredients: ['Kuzu kıyma', 'Kabak', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Krep (yulaf unu)', ingredients: ['Yulaf unu', 'Yumurta sarısı', 'Su', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'taste', name: 'Kayısı tadımı', description: 'Yeni besin: kayısı', ingredients: ['Kayısı'], emoji: '🍑' },
        { slot: 'snack', name: 'Patatesli kıyma', ingredients: ['Kuzu kıyma', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Avokado-lor-ceviz', ingredients: ['Avokado', 'Lor peyniri', 'Ceviz'], emoji: '🥑' },
        { slot: 'taste', name: 'Kayısılı yoğurt', description: 'Kayısı devam', ingredients: ['Kayısı', 'Yoğurt'], emoji: '🍑' },
        { slot: 'snack', name: 'Semizotlu pirinç', ingredients: ['Semizotu', 'Pirinç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı', ingredients: ['Yulaf unu', 'Kayısı', 'Su'], emoji: '🥣' },
        { slot: 'taste', name: 'Kayısı-elma püresi', description: 'Kayısı devam', ingredients: ['Kayısı', 'Elma'], emoji: '🍑' },
        { slot: 'snack', name: 'Kıymalı bezelye yemeği', ingredients: ['Kuzu kıyma', 'Bezelye', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Pankek + pekmez', ingredients: ['Yulaf unu', 'Yumurta sarısı', 'Pekmez'], emoji: '🥞' },
        { slot: 'taste', name: 'Tam buğday unu tadımı', description: 'Yeni besin: tam buğday unu', ingredients: ['Tam buğday unu', 'Su'], emoji: '🌾' },
        { slot: 'snack', name: 'Yoğurt çorbası', ingredients: ['Yoğurt', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Yumurta sarısı + lor + avokado', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'taste', name: 'Buğday unlu krep', description: 'Tam buğday unu devam', ingredients: ['Tam buğday unu', 'Yumurta sarısı', 'Su'], emoji: '🌾' },
        { slot: 'snack', name: 'Sebzeli kıyma', ingredients: ['Kuzu kıyma', 'Kabak', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Lor + elma + ceviz', ingredients: ['Lor peyniri', 'Elma', 'Ceviz'], emoji: '🧀' },
        { slot: 'taste', name: 'Buğday unlu pankek', description: 'Tam buğday unu devam', ingredients: ['Tam buğday unu', 'Yumurta sarısı', 'Elma'], emoji: '🌾' },
        { slot: 'snack', name: 'Pirinçli havuç yemeği', ingredients: ['Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yoğurt + pekmez', ingredients: ['Avokado', 'Yoğurt', 'Pekmez'], emoji: '🥑' },
        { slot: 'taste', name: 'İrmik lapası', description: 'Yeni besin: irmik (su ile pişirilecek)', ingredients: ['İrmik', 'Su'], emoji: '🥣' },
        { slot: 'snack', name: 'Kıymalı patates-bezelye', ingredients: ['Kuzu kıyma', 'Patates', 'Bezelye', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Omlet (yumurta sarısı) + lor', ingredients: ['Yumurta sarısı', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'taste', name: 'İrmik + elma', description: 'İrmik devam', ingredients: ['İrmik', 'Elma', 'Su'], emoji: '🥣' },
        { slot: 'snack', name: 'Sebze çorbası', ingredients: ['Kabak', 'Havuç', 'Patates', 'Semizotu', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı', ingredients: ['Yulaf unu', 'Kayısı', 'Su'], emoji: '🥣' },
        { slot: 'taste', name: 'Domates tadımı', description: 'Yeni besin: domates (sadece pişmiş, 12. aya kadar)', ingredients: ['Domates', 'Zeytinyağı'], emoji: '🍅' },
        { slot: 'snack', name: 'Kıymalı sebze yemeği', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado + lor', ingredients: ['Tam buğday unu', 'Yumurta sarısı', 'Avokado', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'taste', name: 'Domatesli kabak', description: 'Domates devam', ingredients: ['Domates', 'Kabak', 'Zeytinyağı'], emoji: '🍅' },
        { slot: 'snack', name: 'Yoğurt + armut + ceviz', ingredients: ['Yoğurt', 'Armut', 'Ceviz'], emoji: '🥛' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Pankek + pekmez', ingredients: ['Yulaf unu', 'Yumurta sarısı', 'Pekmez'], emoji: '🥞' },
        { slot: 'taste', name: 'Yeşil fasulye tadımı', description: 'Yeni besin: yeşil fasulye', ingredients: ['Yeşil fasulye', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Kıymalı pirinç + havuç', ingredients: ['Kuzu kıyma', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Avokado-lor-yumurta sarısı', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'taste', name: 'Yeşil fasulyeli patates', description: 'Yeşil fasulye devam', ingredients: ['Yeşil fasulye', 'Patates', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Domatesli kıymalı sebze', ingredients: ['Kuzu kıyma', 'Domates', 'Kabak', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
  ],
};

// ============================================================
// 8. AY — 3 ÖĞÜN + ARA ÖĞÜN
// ============================================================
const month8: MealPlanTemplate = {
  month: 8,
  title: '8. Ay - 3 Öğün + Ara Öğün',
  description:
    'Tam yumurta artık serbest! Kahvaltı, öğle, ara öğün ve akşam yemeği ile daha zengin ve çeşitli beslenme.',
  mealSlots: ['breakfast', 'lunch', 'snack', 'dinner'],
  notes: [
    'Artık tam yumurta (beyazı dahil) verilebilir.',
    'Balık ilk kez tanıtılıyor — beyaz etli balıklarla başlayın.',
    'Nohut 1 gece suda bekletilip zarı çıkarılacak.',
    'Domates hâlâ sadece pişmiş olarak verilecek.',
    'Kıyma 12. aya kadar çift çekilmiş kuzu olmalı.',
    'Zeytinyağı eklemeyi unutmayalım.',
    'Ispanak haftada en fazla 2 kez verilmeli.',
  ],
  newFoodsIntroduced: [
    'Yumurta beyazı (tam yumurta)',
    'Bulgur',
    'Balık (beyaz etli)',
    'Pişmiş soğan',
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
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado', description: 'İlk tam yumurta deneyimi', ingredients: ['Yumurta', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı kabak yemeği', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + elma', ingredients: ['Yoğurt', 'Elma'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Havuç', 'Patates', 'Kabak', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Omlet + lor peyniri', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Bezelyeli patates', ingredients: ['Bezelye', 'Patates', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Armut + ceviz', ingredients: ['Armut', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Kıymalı pirinç', ingredients: ['Kuzu kıyma', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Pankek + pekmez', ingredients: ['Yulaf unu', 'Yumurta', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Bulgur tadımı', description: 'Yeni besin: bulgur', ingredients: ['Bulgur', 'Kabak', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Yoğurt + kayısı', ingredients: ['Yoğurt', 'Kayısı'], emoji: '🥛' },
        { slot: 'dinner', name: 'Havuçlu patates püresi + kıyma', ingredients: ['Havuç', 'Patates', 'Kuzu kıyma', 'Zeytinyağı'], emoji: '🥕' },
      ],
    },
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma + ceviz', ingredients: ['Yulaf unu', 'Elma', 'Ceviz', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Bulgurlu kabak', description: 'Bulgur devam', ingredients: ['Bulgur', 'Kabak', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Avokado + lor', ingredients: ['Avokado', 'Lor peyniri'], emoji: '🥑' },
        { slot: 'dinner', name: 'Kıymalı bezelye', ingredients: ['Kuzu kıyma', 'Bezelye', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + peynir', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Bulgurlu havuç', description: 'Bulgur devam', ingredients: ['Bulgur', 'Havuç', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Elma + armut püresi', ingredients: ['Elma', 'Armut'], emoji: '🍎' },
        { slot: 'dinner', name: 'Sebze yemeği + pirinç', ingredients: ['Kabak', 'Havuç', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado', ingredients: ['Tam buğday unu', 'Yumurta', 'Avokado', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Balık tadımı', description: 'Yeni besin: beyaz etli balık', ingredients: ['Balık', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + armut + ceviz', ingredients: ['Yoğurt', 'Armut', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı patates', ingredients: ['Kuzu kıyma', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Mücver', description: 'Kabak mücveri', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥒' },
        { slot: 'lunch', name: 'Balıklı patates', description: 'Balık devam', ingredients: ['Balık', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kayısı + lor', ingredients: ['Kayısı', 'Lor peyniri'], emoji: '🍑' },
        { slot: 'dinner', name: 'Bulgurlu sebze', ingredients: ['Bulgur', 'Kabak', 'Havuç', 'Bezelye', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Omlet + peynir', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balıklı sebze', description: 'Balık devam', ingredients: ['Balık', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + elma + ceviz', ingredients: ['Yoğurt', 'Elma', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı semizotu', ingredients: ['Kuzu kıyma', 'Semizotu', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + armut', ingredients: ['Yulaf unu', 'Armut', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Pişmiş soğan tadımı', description: 'Yeni besin: pişmiş soğan (yemeklere eklenerek)', ingredients: ['Kuzu kıyma', 'Kabak', 'Soğan', 'Zeytinyağı'], emoji: '🧅' },
        { slot: 'snack', name: 'Avokado + ceviz', ingredients: ['Avokado', 'Ceviz'], emoji: '🥑' },
        { slot: 'dinner', name: 'Pirinçli tavuk çorbası', ingredients: ['Pirinç', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado', ingredients: ['Yumurta', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kırmızı mercimek tadımı', description: 'Yeni besin: kırmızı mercimek', ingredients: ['Kırmızı mercimek', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Yoğurt + kayısı', ingredients: ['Yoğurt', 'Kayısı'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı yeşil fasulye', ingredients: ['Kuzu kıyma', 'Yeşil fasulye', 'Domates', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Pankek + lor + pekmez', ingredients: ['Yulaf unu', 'Yumurta', 'Lor peyniri', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Mercimek çorbası', description: 'Mercimek devam', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Elma + ceviz', ingredients: ['Elma', 'Ceviz'], emoji: '🍎' },
        { slot: 'dinner', name: 'Bulgurlu kıyma yemeği', ingredients: ['Bulgur', 'Kuzu kıyma', 'Kabak', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Mücver + yoğurt', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Zeytinyağı', 'Yoğurt'], emoji: '🥒' },
        { slot: 'lunch', name: 'Balkabağı tadımı', description: 'Yeni besin: balkabağı', ingredients: ['Balkabağı', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Armut + lor', ingredients: ['Armut', 'Lor peyniri'], emoji: '🍐' },
        { slot: 'dinner', name: 'Kıymalı patates-bezelye', ingredients: ['Kuzu kıyma', 'Patates', 'Bezelye', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Omlet + avokado', ingredients: ['Yumurta', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balkabağı çorbası', description: 'Balkabağı devam', ingredients: ['Balkabağı', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Yoğurt + elma + pekmez', ingredients: ['Yoğurt', 'Elma', 'Pekmez'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebzeli bulgur pilavı', ingredients: ['Bulgur', 'Havuç', 'Bezelye', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı', ingredients: ['Yulaf unu', 'Kayısı', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Balkabağı + kıyma', description: 'Balkabağı devam', ingredients: ['Balkabağı', 'Kuzu kıyma', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Avokado + ceviz + lor', ingredients: ['Avokado', 'Ceviz', 'Lor peyniri'], emoji: '🥑' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Krep + pekmez + lor', ingredients: ['Tam buğday unu', 'Yumurta', 'Pekmez', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Buğday ruşeymi tadımı', description: 'Yeni besin: buğday ruşeymi', ingredients: ['Buğday ruşeymi', 'Yoğurt', 'Elma'], emoji: '🌾' },
        { slot: 'snack', name: 'Kayısı + armut', ingredients: ['Kayısı', 'Armut'], emoji: '🍑' },
        { slot: 'dinner', name: 'Kıymalı havuç yemeği', ingredients: ['Kuzu kıyma', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🥕' },
      ],
    },
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + lor', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Organik tavuk tadımı', description: 'Yeni besin: organik tavuk', ingredients: ['Tavuk', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + armut + buğday ruşeymi', ingredients: ['Yoğurt', 'Armut', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Domatesli kabak yemeği', ingredients: ['Kabak', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Omlet + peynir + avokado', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuklu sebze', description: 'Tavuk devam', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Elma + ceviz + lor', ingredients: ['Elma', 'Ceviz', 'Lor peyniri'], emoji: '🍎' },
        { slot: 'dinner', name: 'Bulgurlu mercimek', ingredients: ['Bulgur', 'Kırmızı mercimek', 'Soğan', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Pankek + elma', ingredients: ['Yulaf unu', 'Yumurta', 'Elma'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tavuk çorbası', description: 'Tavuk devam', ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + kayısı + ceviz', ingredients: ['Yoğurt', 'Kayısı', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı kabak', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma + ceviz', ingredients: ['Yulaf unu', 'Elma', 'Ceviz', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Nohut tadımı', description: 'Yeni besin: nohut (1 gece bekletilip zarı çıkarılacak)', ingredients: ['Nohut', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Avokado + pekmez', ingredients: ['Avokado', 'Pekmez'], emoji: '🥑' },
        { slot: 'dinner', name: 'Balıklı patates', ingredients: ['Balık', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + lor', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Nohutlu sebze', description: 'Nohut devam', ingredients: ['Nohut', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Armut + ceviz + yoğurt', ingredients: ['Armut', 'Ceviz', 'Yoğurt'], emoji: '🍐' },
        { slot: 'dinner', name: 'Tavuklu bulgur', ingredients: ['Tavuk', 'Bulgur', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Mücver + yoğurt', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Zeytinyağı', 'Yoğurt'], emoji: '🥒' },
        { slot: 'lunch', name: 'Nohutlu tavuk', description: 'Nohut devam', ingredients: ['Nohut', 'Tavuk', 'Havuç', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Kayısı + lor + pekmez', ingredients: ['Kayısı', 'Lor peyniri', 'Pekmez'], emoji: '🍑' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Havuç', 'Patates', 'Kabak', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Omlet + lor + pekmez', ingredients: ['Yumurta', 'Lor peyniri', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Ispanak tadımı', description: 'Yeni besin: ıspanak (haftada max 2 kez)', ingredients: ['Ispanak', 'Yumurta', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + elma + buğday ruşeymi', ingredients: ['Yoğurt', 'Elma', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı bezelye + pirinç', ingredients: ['Kuzu kıyma', 'Bezelye', 'Pirinç', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado + lor', ingredients: ['Tam buğday unu', 'Yumurta', 'Avokado', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Ispanaklı yumurta', description: 'Ispanak devam', ingredients: ['Ispanak', 'Yumurta', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Armut + ceviz', ingredients: ['Armut', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Tavuk sote', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + armut + pekmez', ingredients: ['Yulaf unu', 'Armut', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Tahin tadımı', description: 'Yeni besin: tahin', ingredients: ['Tahin', 'Yoğurt', 'Pekmez'], emoji: '🥜' },
        { slot: 'snack', name: 'Ev yapımı bisküvi', ingredients: ['Yulaf unu', 'Yumurta', 'Elma'], emoji: '🍪' },
        { slot: 'dinner', name: 'Mercimek çorbası + bulgur', ingredients: ['Kırmızı mercimek', 'Havuç', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + tahin-pekmez', ingredients: ['Yumurta', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı bulgurlu sebze', ingredients: ['Kuzu kıyma', 'Bulgur', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Yoğurt + kayısı + ceviz', ingredients: ['Yoğurt', 'Kayısı', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Balıklı sebze yemeği', ingredients: ['Balık', 'Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Pankek + avokado', ingredients: ['Yulaf unu', 'Yumurta', 'Avokado'], emoji: '🥞' },
        { slot: 'lunch', name: 'Trabzon hurması tadımı', description: 'Yeni besin: Trabzon hurması', ingredients: ['Trabzon hurması', 'Yoğurt'], emoji: '🍊' },
        { slot: 'snack', name: 'Lor + armut + ceviz', ingredients: ['Lor peyniri', 'Armut', 'Ceviz'], emoji: '🧀' },
        { slot: 'dinner', name: 'Tavuklu sebze yemeği', ingredients: ['Tavuk', 'Patates', 'Havuç', 'Bezelye', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Omlet + peynir + domates', ingredients: ['Yumurta', 'Lor peyniri', 'Domates', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Köfte + patates', description: 'İlk köfte deneyimi', ingredients: ['Kuzu kıyma', 'Yulaf unu', 'Soğan', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Trabzon hurması + yoğurt', ingredients: ['Trabzon hurması', 'Yoğurt'], emoji: '🍊' },
        { slot: 'dinner', name: 'Ispanaklı bulgur', ingredients: ['Ispanak', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Mücver + tahin-pekmez', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥒' },
        { slot: 'lunch', name: 'Nohutlu sebze yemeği', ingredients: ['Nohut', 'Kabak', 'Havuç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + yoğurt', ingredients: ['Yulaf unu', 'Yumurta', 'Elma', 'Yoğurt'], emoji: '🍪' },
        { slot: 'dinner', name: 'Sebzeli erişte', description: 'Tam buğday erişte', ingredients: ['Erişte', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + Trabzon hurması', ingredients: ['Yulaf unu', 'Trabzon hurması', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kıymalı balkabağı', ingredients: ['Kuzu kıyma', 'Balkabağı', 'Soğan', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Avokado + lor + ceviz', ingredients: ['Avokado', 'Lor peyniri', 'Ceviz'], emoji: '🥑' },
        { slot: 'dinner', name: 'Tavuk çorbası + pirinç', ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + peynir', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Köfte + bulgur', ingredients: ['Kuzu kıyma', 'Yulaf unu', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + elma + tahin', ingredients: ['Yoğurt', 'Elma', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
  ],
};

// ============================================================
// 9. AY — KAHVALTI, ÖĞLE, ARA ÖĞÜN, AKŞAM
// ============================================================
const month9: MealPlanTemplate = {
  month: 9,
  title: '9. Ay - 4 Öğün Tam Beslenme',
  description:
    'Kahvaltı, öğle, ara öğün ve akşam yemeği ile tam beslenme programı. Daha karmaşık tarifler ve çeşitli yemekler.',
  mealSlots: ['breakfast', 'lunch', 'snack', 'dinner'],
  notes: [
    'Kıyma 12. aya kadar çift çekilmiş kuzu olmalı.',
    'Domates 12. aya kadar yalnızca pişmiş kullanılacak.',
    'Zeytinyağı eklemeyi unutmayalım.',
    'Ispanak haftada en fazla 2 kez.',
    'Nohut zarı çıkarılarak verilecek.',
    'Pirinç günlük taze yapılmalı.',
  ],
  newFoodsIntroduced: [],
  days: [
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + peynir + zeytin', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı bezelye + pirinç', ingredients: ['Kuzu kıyma', 'Bezelye', 'Pirinç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + yoğurt', ingredients: ['Yulaf unu', 'Yumurta', 'Elma', 'Yoğurt'], emoji: '🍪' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Omlet + avokado + lor', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balıklı patates-havuç', ingredients: ['Balık', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Mevsim meyvesi + ceviz', ingredients: ['Elma', 'Ceviz'], emoji: '🍎' },
        { slot: 'dinner', name: 'Mercimek yemeği + bulgur', ingredients: ['Kırmızı mercimek', 'Bulgur', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Pankek + tahin-pekmez', ingredients: ['Yulaf unu', 'Yumurta', 'Tahin', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tavuk sote + bulgur', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + armut + buğday ruşeymi', ingredients: ['Yoğurt', 'Armut', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Havuç', 'Kabak', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Menemen', ingredients: ['Yumurta', 'Domates', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Köfte + patates püresi', ingredients: ['Kuzu kıyma', 'Soğan', 'Yulaf unu', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Kefir + kayısı', ingredients: ['Kefir', 'Kayısı'], emoji: '🥛' },
        { slot: 'dinner', name: 'Nohutlu tavuk', ingredients: ['Nohut', 'Tavuk', 'Havuç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + tahin-pekmez', ingredients: ['Yumurta', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı kabak yemeği + pirinç', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Yulaf lapası + elma + ceviz', ingredients: ['Yulaf unu', 'Elma', 'Ceviz', 'Su'], emoji: '🥣' },
        { slot: 'dinner', name: 'Balkabağı çorbası', ingredients: ['Balkabağı', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Krep + lor + avokado', ingredients: ['Tam buğday unu', 'Yumurta', 'Lor peyniri', 'Avokado'], emoji: '🥞' },
        { slot: 'lunch', name: 'Biber dolması', description: 'Kıymalı pirinçli biber dolması', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Yoğurt + Trabzon hurması', ingredients: ['Yoğurt', 'Trabzon hurması'], emoji: '🥛' },
        { slot: 'dinner', name: 'Ispanaklı yumurta + bulgur', ingredients: ['Ispanak', 'Yumurta', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Mücver + yoğurt', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Lor peyniri', 'Zeytinyağı', 'Yoğurt'], emoji: '🥒' },
        { slot: 'lunch', name: 'Mantı', description: 'Ev yapımı mini mantı, yoğurtla', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + armut', ingredients: ['Yulaf unu', 'Yumurta', 'Armut'], emoji: '🍪' },
        { slot: 'dinner', name: 'Tavuk çorbası', ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Tost (tam buğday)', ingredients: ['Tam buğday ekmeği', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🍞' },
        { slot: 'lunch', name: 'Kıymalı yeşil fasulye + bulgur', ingredients: ['Kuzu kıyma', 'Yeşil fasulye', 'Domates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Kefir + elma + ceviz', ingredients: ['Kefir', 'Elma', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Omlet + peynir + zeytin', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balıklı sebze yemeği + pirinç', ingredients: ['Balık', 'Kabak', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + kayısı + tahin', ingredients: ['Yoğurt', 'Kayısı', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Haşlama et + patates', description: 'Yumuşak haşlama kuzu eti', ingredients: ['Kuzu eti', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Pankek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Elma'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı patates yemeği + bulgur', ingredients: ['Kuzu kıyma', 'Patates', 'Domates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🥔' },
        { slot: 'snack', name: 'Avokado + lor + ceviz', ingredients: ['Avokado', 'Lor peyniri', 'Ceviz'], emoji: '🥑' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + peynir', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuklu sebze yemeği + pirinç', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Bezelye', 'Pirinç', 'Soğan', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yulaf lapası + armut + pekmez', ingredients: ['Yulaf unu', 'Armut', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'dinner', name: 'Köfte + sebze', ingredients: ['Kuzu kıyma', 'Soğan', 'Yulaf unu', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Menemen + peynir', ingredients: ['Yumurta', 'Domates', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Nohutlu sebze yemeği + bulgur', ingredients: ['Nohut', 'Kabak', 'Havuç', 'Domates', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Kefir + Trabzon hurması', ingredients: ['Kefir', 'Trabzon hurması'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Havuç', 'Kabak', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Krep + tahin-pekmez', ingredients: ['Tam buğday unu', 'Yumurta', 'Tahin', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı ispanak + pirinç', ingredients: ['Kuzu kıyma', 'Ispanak', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + elma', ingredients: ['Yulaf unu', 'Yumurta', 'Elma'], emoji: '🍪' },
        { slot: 'dinner', name: 'Balıklı patates', ingredients: ['Balık', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Tost + avokado', ingredients: ['Tam buğday ekmeği', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍞' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Yoğurt + armut + ceviz', ingredients: ['Yoğurt', 'Armut', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Tavuk çorbası + bulgur', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Mücver + tahin-pekmez', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥒' },
        { slot: 'lunch', name: 'Kıymalı mercimek yemeği + pirinç', ingredients: ['Kuzu kıyma', 'Kırmızı mercimek', 'Havuç', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Kayısı + lor + ceviz', ingredients: ['Kayısı', 'Lor peyniri', 'Ceviz'], emoji: '🍑' },
        { slot: 'dinner', name: 'Sebzeli erişte', ingredients: ['Erişte', 'Kabak', 'Havuç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + zeytin + peynir', ingredients: ['Yumurta', 'Zeytin', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Yulaf lapası + Trabzon hurması', ingredients: ['Yulaf unu', 'Trabzon hurması', 'Su'], emoji: '🥣' },
        { slot: 'dinner', name: 'Balkabağı çorbası + ekmek', ingredients: ['Balkabağı', 'Havuç', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Omlet + avokado + peynir', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuk sote + bulgur', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Bezelye', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + elma + tahin', ingredients: ['Kefir', 'Elma', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı yeşil fasulye', ingredients: ['Kuzu kıyma', 'Yeşil fasulye', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Pankek + lor + pekmez', ingredients: ['Yulaf unu', 'Yumurta', 'Lor peyniri', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Köfte + bulgur + yoğurt', ingredients: ['Kuzu kıyma', 'Soğan', 'Yulaf unu', 'Bulgur', 'Yoğurt', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Armut + ceviz + yoğurt', ingredients: ['Armut', 'Ceviz', 'Yoğurt'], emoji: '🍐' },
        { slot: 'dinner', name: 'Mercimek çorbası + ekmek', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Menemen + peynir', ingredients: ['Yumurta', 'Domates', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balıklı bulgur pilavı', ingredients: ['Balık', 'Bulgur', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + kefir', ingredients: ['Yulaf unu', 'Yumurta', 'Kefir'], emoji: '🍪' },
        { slot: 'dinner', name: 'Kıymalı kabak yemeği', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + tahin-pekmez', ingredients: ['Yumurta', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Nohutlu tavuk yemeği + pirinç', ingredients: ['Nohut', 'Tavuk', 'Havuç', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + kayısı + buğday ruşeymi', ingredients: ['Yoğurt', 'Kayısı', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tarhana çorbası + ekmek', ingredients: ['Tarhana', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado + lor', ingredients: ['Tam buğday unu', 'Yumurta', 'Avokado', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı bezelye + bulgur', ingredients: ['Kuzu kıyma', 'Bezelye', 'Domates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Elma + ceviz + lor', ingredients: ['Elma', 'Ceviz', 'Lor peyniri'], emoji: '🍎' },
        { slot: 'dinner', name: 'Tavuk çorbası', ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Mücver + yoğurt', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Lor peyniri', 'Zeytinyağı', 'Yoğurt'], emoji: '🥒' },
        { slot: 'lunch', name: 'Sebzeli bulgur pilavı + köfte', ingredients: ['Bulgur', 'Kabak', 'Havuç', 'Bezelye', 'Kuzu kıyma', 'Soğan', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Kefir + armut + tahin', ingredients: ['Kefir', 'Armut', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Ispanaklı yumurta + ekmek', ingredients: ['Ispanak', 'Yumurta', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Tost + peynir + zeytin', ingredients: ['Tam buğday ekmeği', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍞' },
        { slot: 'lunch', name: 'Balıklı sebze yemeği + pirinç', ingredients: ['Balık', 'Kabak', 'Havuç', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + elma + ceviz', ingredients: ['Yoğurt', 'Elma', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı patates yemeği', ingredients: ['Kuzu kıyma', 'Patates', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🥔' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Omlet + peynir + avokado', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + armut', ingredients: ['Yulaf unu', 'Yumurta', 'Armut'], emoji: '🍪' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Havuç', 'Kabak', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Pankek + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Armut'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tavuklu nohut + bulgur', ingredients: ['Tavuk', 'Nohut', 'Havuç', 'Domates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + Trabzon hurması + ceviz', ingredients: ['Yoğurt', 'Trabzon hurması', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Haşlama et + sebze', ingredients: ['Kuzu eti', 'Patates', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + zeytin', ingredients: ['Yumurta', 'Avokado', 'Zeytin', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı havuç yemeği + pirinç', ingredients: ['Kuzu kıyma', 'Havuç', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🥕' },
        { slot: 'snack', name: 'Kefir + kayısı + tahin', ingredients: ['Kefir', 'Kayısı', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Bulgurlu mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Bulgur', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Menemen + lor', ingredients: ['Yumurta', 'Domates', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Elma + lor + ceviz', ingredients: ['Elma', 'Lor peyniri', 'Ceviz'], emoji: '🍎' },
        { slot: 'dinner', name: 'Tavuk sote + pirinç', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Krep + tahin-pekmez + lor', ingredients: ['Tam buğday unu', 'Yumurta', 'Tahin', 'Pekmez', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Köfte + sebze + bulgur', ingredients: ['Kuzu kıyma', 'Soğan', 'Yulaf unu', 'Kabak', 'Havuç', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + armut + buğday ruşeymi', ingredients: ['Yoğurt', 'Armut', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Balıklı patates + havuç', ingredients: ['Balık', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Mücver + peynir + zeytin', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🥒' },
        { slot: 'lunch', name: 'Kıymalı bezelye + pirinç', ingredients: ['Kuzu kıyma', 'Bezelye', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Kefir + Trabzon hurması + ceviz', ingredients: ['Kefir', 'Trabzon hurması', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + peynir', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuklu sebze yemeği + bulgur', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Bezelye', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + yoğurt + kayısı', ingredients: ['Yulaf unu', 'Yumurta', 'Yoğurt', 'Kayısı'], emoji: '🍪' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Havuç', 'Kabak', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
  ],
};

// ============================================================
// 10. AY — KAHVALTI, ÖĞLE, ARA ÖĞÜN, AKŞAM (Daha çeşitli)
// ============================================================
const month10: MealPlanTemplate = {
  month: 10,
  title: '10. Ay - Gelişmiş 4 Öğün Beslenme',
  description:
    'Daha katı gıdalar ve karmaşık kombinasyonlar. 4 öğün tam beslenme programı ile bebeğin damak tadı genişler.',
  mealSlots: ['breakfast', 'lunch', 'snack', 'dinner'],
  notes: [
    'Kıyma 12. aya kadar çift çekilmiş kuzu olmalı.',
    'Domates 12. aya kadar yalnızca pişmiş kullanılacak.',
    'Zeytinyağı eklemeyi unutmayalım.',
    'Yemeklerde daha fazla parmak besin (finger food) deneyin.',
    'Ispanak haftada en fazla 2 kez.',
    'Nohut zarı çıkarılarak verilecek.',
  ],
  newFoodsIntroduced: [],
  days: [
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + peynir + zeytin', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı bezelye + pirinç', ingredients: ['Kuzu kıyma', 'Bezelye', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + elma + ceviz', ingredients: ['Yoğurt', 'Elma', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tarhana çorbası + ekmek', ingredients: ['Tarhana', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Menemen + lor', ingredients: ['Yumurta', 'Domates', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Fırın tavuk + patates', description: 'Fırında yumuşak pişmiş tavuk', ingredients: ['Tavuk', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + kefir', ingredients: ['Yulaf unu', 'Yumurta', 'Kefir'], emoji: '🍪' },
        { slot: 'dinner', name: 'Mercimek çorbası + bulgur', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Pankek + tahin-pekmez', ingredients: ['Yulaf unu', 'Yumurta', 'Tahin', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Avokado + lor + ceviz', ingredients: ['Avokado', 'Lor peyniri', 'Ceviz'], emoji: '🥑' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Havuç', 'Kabak', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Omlet + avokado + peynir', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Kayısı + armut + yoğurt', ingredients: ['Kayısı', 'Armut', 'Yoğurt'], emoji: '🍑' },
        { slot: 'dinner', name: 'Tavuk çorbası + pirinç', ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Mücver + yoğurt + zeytin', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Zeytinyağı', 'Yoğurt', 'Zeytin'], emoji: '🥒' },
        { slot: 'lunch', name: 'Balıklı sebze yemeği + bulgur', ingredients: ['Balık', 'Kabak', 'Havuç', 'Bulgur', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kefir + Trabzon hurması + ceviz', ingredients: ['Kefir', 'Trabzon hurması', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı patates yemeği', ingredients: ['Kuzu kıyma', 'Patates', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🥔' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Tost + peynir + avokado', ingredients: ['Tam buğday ekmeği', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🍞' },
        { slot: 'lunch', name: 'Köfte + sebzeli bulgur pilavı', ingredients: ['Kuzu kıyma', 'Soğan', 'Yulaf unu', 'Bulgur', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + armut + buğday ruşeymi', ingredients: ['Yoğurt', 'Armut', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Ispanaklı mercimek çorbası', ingredients: ['Ispanak', 'Kırmızı mercimek', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Krep + lor + pekmez', ingredients: ['Tam buğday unu', 'Yumurta', 'Lor peyniri', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tavuklu nohut yemeği + pirinç', ingredients: ['Tavuk', 'Nohut', 'Havuç', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Elma + ceviz + lor', ingredients: ['Elma', 'Ceviz', 'Lor peyniri'], emoji: '🍎' },
        { slot: 'dinner', name: 'Balkabağı çorbası + ekmek', ingredients: ['Balkabağı', 'Havuç', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + tahin-pekmez', ingredients: ['Yumurta', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Sebzeli erişte + kıyma', ingredients: ['Erişte', 'Kuzu kıyma', 'Kabak', 'Havuç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🍝' },
        { slot: 'snack', name: 'Yoğurt + kayısı + tahin', ingredients: ['Yoğurt', 'Kayısı', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Nohutlu sebze çorbası', ingredients: ['Nohut', 'Havuç', 'Kabak', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Omlet + peynir + zeytin', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Kıymalı kabak yemeği + bulgur', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + armut', ingredients: ['Yulaf unu', 'Yumurta', 'Armut'], emoji: '🍪' },
        { slot: 'dinner', name: 'Tavuk sote + pirinç', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Bezelye', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Pankek + avokado + lor', ingredients: ['Yulaf unu', 'Yumurta', 'Avokado', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Balıklı patates-havuç + pirinç', ingredients: ['Balık', 'Patates', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kefir + elma + ceviz', ingredients: ['Kefir', 'Elma', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı yeşil fasulye + ekmek', ingredients: ['Kuzu kıyma', 'Yeşil fasulye', 'Domates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Menemen + peynir + zeytin', ingredients: ['Yumurta', 'Domates', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Yoğurt + Trabzon hurması + buğday ruşeymi', ingredients: ['Yoğurt', 'Trabzon hurması', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Mercimek yemeği + bulgur', ingredients: ['Kırmızı mercimek', 'Havuç', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Mücver + tahin-pekmez', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥒' },
        { slot: 'lunch', name: 'Fırın tavuk + sebze + bulgur', ingredients: ['Tavuk', 'Patates', 'Havuç', 'Kabak', 'Bulgur', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Armut + ceviz + lor', ingredients: ['Armut', 'Ceviz', 'Lor peyniri'], emoji: '🍐' },
        { slot: 'dinner', name: 'Tarhana çorbası + ekmek', ingredients: ['Tarhana', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + peynir', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + kefir', ingredients: ['Yulaf unu', 'Yumurta', 'Kefir'], emoji: '🍪' },
        { slot: 'dinner', name: 'Ispanaklı yumurta + ekmek', ingredients: ['Ispanak', 'Yumurta', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado + lor', ingredients: ['Tam buğday unu', 'Yumurta', 'Avokado', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Köfte + patates püresi + sebze', ingredients: ['Kuzu kıyma', 'Soğan', 'Yulaf unu', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + kayısı + ceviz', ingredients: ['Yoğurt', 'Kayısı', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tavuk çorbası + ekmek', ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Tost + peynir + zeytin + domates', ingredients: ['Tam buğday ekmeği', 'Lor peyniri', 'Zeytin', 'Domates', 'Zeytinyağı'], emoji: '🍞' },
        { slot: 'lunch', name: 'Kıymalı nohut yemeği + pirinç', ingredients: ['Kuzu kıyma', 'Nohut', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Yulaf lapası + elma + ceviz', ingredients: ['Yulaf unu', 'Elma', 'Ceviz', 'Su'], emoji: '🥣' },
        { slot: 'dinner', name: 'Balıklı sebze yemeği', ingredients: ['Balık', 'Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Omlet + lor + pekmez', ingredients: ['Yumurta', 'Lor peyniri', 'Pekmez', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuklu sebze yemeği + bulgur', ingredients: ['Tavuk', 'Kabak', 'Bezelye', 'Havuç', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + armut + tahin', ingredients: ['Kefir', 'Armut', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebzeli erişte + yoğurt', ingredients: ['Erişte', 'Kabak', 'Havuç', 'Domates', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Pankek + lor + mevsim meyvesi', ingredients: ['Yulaf unu', 'Yumurta', 'Lor peyniri', 'Armut'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı havuç yemeği + pirinç', ingredients: ['Kuzu kıyma', 'Havuç', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🥕' },
        { slot: 'snack', name: 'Avokado + ceviz + yoğurt', ingredients: ['Avokado', 'Ceviz', 'Yoğurt'], emoji: '🥑' },
        { slot: 'dinner', name: 'Bulgurlu mercimek çorbası + ekmek', ingredients: ['Kırmızı mercimek', 'Bulgur', 'Havuç', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + zeytin', ingredients: ['Yumurta', 'Avokado', 'Zeytin', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Sebzeli bulgur pilavı + köfte', ingredients: ['Bulgur', 'Kabak', 'Havuç', 'Bezelye', 'Kuzu kıyma', 'Soğan', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Yoğurt + elma + buğday ruşeymi', ingredients: ['Yoğurt', 'Elma', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Haşlama et + patates + sebze', ingredients: ['Kuzu eti', 'Patates', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Mücver + peynir + zeytin', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🥒' },
        { slot: 'lunch', name: 'Balıklı patates + bulgur', ingredients: ['Balık', 'Patates', 'Havuç', 'Bulgur', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + yoğurt + kayısı', ingredients: ['Yulaf unu', 'Yumurta', 'Yoğurt', 'Kayısı'], emoji: '🍪' },
        { slot: 'dinner', name: 'Kıymalı bezelye + ekmek', ingredients: ['Kuzu kıyma', 'Bezelye', 'Domates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Menemen + lor + zeytin', ingredients: ['Yumurta', 'Domates', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Nohutlu tavuk + pirinç', ingredients: ['Nohut', 'Tavuk', 'Havuç', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Kefir + Trabzon hurması + ceviz', ingredients: ['Kefir', 'Trabzon hurması', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Havuç', 'Kabak', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Krep + tahin-pekmez', ingredients: ['Tam buğday unu', 'Yumurta', 'Tahin', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı ispanak + pirinç', ingredients: ['Kuzu kıyma', 'Ispanak', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Armut + lor + ceviz', ingredients: ['Armut', 'Lor peyniri', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Tavuk çorbası + bulgur', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Omlet + avokado + peynir + zeytin', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Yoğurt + kayısı + buğday ruşeymi', ingredients: ['Yoğurt', 'Kayısı', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı balkabağı yemeği', ingredients: ['Kuzu kıyma', 'Balkabağı', 'Soğan', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Pankek + avokado + lor', ingredients: ['Yulaf unu', 'Yumurta', 'Avokado', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Fırın tavuk + sebze + pirinç', ingredients: ['Tavuk', 'Patates', 'Havuç', 'Kabak', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Elma + ceviz + tahin', ingredients: ['Elma', 'Ceviz', 'Tahin'], emoji: '🍎' },
        { slot: 'dinner', name: 'Mercimek çorbası + ekmek', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + peynir + zeytin', ingredients: ['Yumurta', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Sebzeli erişte + kıyma', ingredients: ['Erişte', 'Kuzu kıyma', 'Kabak', 'Havuç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🍝' },
        { slot: 'snack', name: 'Kefir + armut + buğday ruşeymi', ingredients: ['Kefir', 'Armut', 'Buğday ruşeymi'], emoji: '🥛' },
        { slot: 'dinner', name: 'Balkabağı çorbası + ekmek', ingredients: ['Balkabağı', 'Havuç', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Mücver + yoğurt + zeytin', ingredients: ['Kabak', 'Yumurta', 'Yulaf unu', 'Zeytinyağı', 'Yoğurt', 'Zeytin'], emoji: '🥒' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Yoğurt + Trabzon hurması + ceviz', ingredients: ['Yoğurt', 'Trabzon hurması', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı yeşil fasulye + bulgur', ingredients: ['Kuzu kıyma', 'Yeşil fasulye', 'Domates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Tost + avokado + peynir + zeytin', ingredients: ['Tam buğday ekmeği', 'Avokado', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍞' },
        { slot: 'lunch', name: 'Köfte + sebzeli bulgur pilavı', ingredients: ['Kuzu kıyma', 'Soğan', 'Yulaf unu', 'Bulgur', 'Kabak', 'Havuç', 'Bezelye', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + yoğurt + elma', ingredients: ['Yulaf unu', 'Yumurta', 'Yoğurt', 'Elma'], emoji: '🍪' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Omlet + lor + avokado', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Balıklı bulgur pilavı + sebze', ingredients: ['Balık', 'Bulgur', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kayısı + lor + ceviz', ingredients: ['Kayısı', 'Lor peyniri', 'Ceviz'], emoji: '🍑' },
        { slot: 'dinner', name: 'Tavuk sote + pirinç', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Bezelye', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Pankek + tahin-pekmez + lor', ingredients: ['Yulaf unu', 'Yumurta', 'Tahin', 'Pekmez', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı kabak yemeği + pirinç', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Soğan', 'Pirinç', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Kefir + elma + tahin', ingredients: ['Kefir', 'Elma', 'Tahin'], emoji: '🥛' },
        { slot: 'dinner', name: 'Nohutlu sebze çorbası + ekmek', ingredients: ['Nohut', 'Havuç', 'Kabak', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Menemen + peynir + zeytin', ingredients: ['Yumurta', 'Domates', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🍳' },
        { slot: 'lunch', name: 'Tavuklu nohut + bulgur', ingredients: ['Tavuk', 'Nohut', 'Havuç', 'Domates', 'Soğan', 'Bulgur', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + armut + ceviz + pekmez', ingredients: ['Yoğurt', 'Armut', 'Ceviz', 'Pekmez'], emoji: '🥛' },
        { slot: 'dinner', name: 'Haşlama et + sebze + bulgur', ingredients: ['Kuzu eti', 'Patates', 'Havuç', 'Kabak', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado + peynir + zeytin', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytin', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Ev yapımı bisküvi + kefir + Trabzon hurması', ingredients: ['Yulaf unu', 'Yumurta', 'Kefir', 'Trabzon hurması'], emoji: '🍪' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Havuç', 'Kabak', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
  ],
};

// ============================================================
// GENEL NOTLAR (PDF'lerden alınan önemli bilgiler)
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
