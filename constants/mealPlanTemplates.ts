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
// 7. AY — 2 ÖĞÜN: Kahvaltı + Öğle/Ara Öğün
// Dr. Erdal Pazar rehberi: 6-8 ay arası günde 2 öğün
// ============================================================
const month7: MealPlanTemplate = {
  month: 7,
  title: '7. Ay - 2 Öğün Beslenme Planı',
  description:
    'Günde 2 öğün: kahvaltı ve öğle yemeği. Yeni sebzeler, tahıllar ve et tanıtılır. Ispanak, domates, tavuk bu ay başlar.',
  mealSlots: ['breakfast', 'lunch'],
  notes: [
    'Tüm yemeklere zeytinyağı eklemeyi unutmayın.',
    'Ek gıda sonrası su vermeyi ihmal etmeyin.',
    'Kıyma çift çekilmiş ve kuzu olmalı 12. aya kadar.',
    'Pirinç günlük yapılmalı, saklama yapılmamalı.',
    'Pekmez ısıya maruz kalmamalı, yemeğe son anda eklenecek.',
    'İrmik su ile pişirilerek verilecek.',
    'Ispanak haftada en fazla 2 kez verilmelidir.',
    'Domates sadece pişmiş olarak kullanılacak.',
  ],
  newFoodsIntroduced: [
    'Ispanak',
    'Taze soğan',
    'Domates (pişmiş)',
    'Sarımsak',
    'Tavuk',
    'Hindi',
    'Pirinç',
    'Kıyma (çift çekilmiş kuzu)',
    'Pekmez',
    'Nane',
  ],
  days: [
    // Gün 1-3: Ispanak tanıtımı
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + elma püresi', ingredients: ['Yoğurt', 'Elma'], emoji: '🥛' },
        { slot: 'lunch', name: 'Kabak çorbası', description: 'Yeni besin: ıspanak tadımı eklenir', ingredients: ['Kabak', 'Ispanak', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + armut', ingredients: ['Yulaf unu', 'Armut', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Ispanak-patates püresi', ingredients: ['Ispanak', 'Patates', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Avokado + lor peyniri + yumurta sarısı', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Ispanaklı sebze çorbası', ingredients: ['Ispanak', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    // Gün 4-6: Pirinç tanıtımı
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + muz', ingredients: ['Yoğurt', 'Muz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Pirinç lapası', description: 'Yeni besin: pirinç. Günlük taze yapılmalı!', ingredients: ['Pirinç', 'Su', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Elma + armut püresi', ingredients: ['Elma', 'Armut'], emoji: '🍎' },
        { slot: 'lunch', name: 'Pirinç lapası + havuç püresi', ingredients: ['Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + avokado', ingredients: ['Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Sebzeli pirinç lapası', ingredients: ['Pirinç', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    // Gün 7-9: Kıyma tanıtımı
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma', ingredients: ['Yulaf unu', 'Elma', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kıymalı sebze püresi', description: 'Yeni besin: kuzu kıyma (çift çekilmiş)', ingredients: ['Kuzu kıyma', 'Kabak', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + kayısı püresi', ingredients: ['Yoğurt', 'Kayısı'], emoji: '🥛' },
        { slot: 'lunch', name: 'Kıymalı havuç püresi', ingredients: ['Kuzu kıyma', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta sarısı', ingredients: ['Avokado', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Kıymalı kabak', ingredients: ['Kuzu kıyma', 'Kabak', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 10-12: Domates (pişmiş) tanıtımı
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + armut', ingredients: ['Lor peyniri', 'Armut'], emoji: '🧀' },
        { slot: 'lunch', name: 'Domatesli sebze çorbası', description: 'Yeni besin: domates (sadece pişmiş)', ingredients: ['Domates', 'Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍅' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + muz', ingredients: ['Yulaf unu', 'Muz', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Domatesli kıymalı sebze', ingredients: ['Domates', 'Kuzu kıyma', 'Kabak', 'Zeytinyağı'], emoji: '🍅' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + elma', ingredients: ['Yoğurt', 'Elma'], emoji: '🥛' },
        { slot: 'lunch', name: 'Tarhana çorbası', description: 'Domates içerikli geleneksel çorba', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 13-15: Tavuk tanıtımı
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Avokado + lor + yumurta sarısı', ingredients: ['Avokado', 'Lor peyniri', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Tavuk suyu çorbası', description: 'Yeni besin: tavuk', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + kayısı', ingredients: ['Yoğurt', 'Kayısı'], emoji: '🥛' },
        { slot: 'lunch', name: 'Tavuklu sebze püresi', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Elma + armut püresi', ingredients: ['Elma', 'Armut'], emoji: '🍎' },
        { slot: 'lunch', name: 'Tavuklu pirinç lapası', ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    // Gün 16-18: Pekmez ve sarımsak tanıtımı
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + pekmez', description: 'Yeni besin: pekmez (son anda ekleyin, ısıtmayın)', ingredients: ['Yoğurt', 'Pekmez'], emoji: '🥛' },
        { slot: 'lunch', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + pekmez', ingredients: ['Yulaf unu', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Sarımsaklı sebze çorbası', description: 'Yeni besin: sarımsak', ingredients: ['Kabak', 'Havuç', 'Patates', 'Sarımsak', 'Zeytinyağı'], emoji: '🧄' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + muz', ingredients: ['Lor peyniri', 'Muz'], emoji: '🧀' },
        { slot: 'lunch', name: 'Kıymalı ıspanak', ingredients: ['Kuzu kıyma', 'Ispanak', 'Pirinç', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    // Gün 19-21: Taze soğan tanıtımı
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + armut', ingredients: ['Yoğurt', 'Armut'], emoji: '🥛' },
        { slot: 'lunch', name: 'Sebze çorbası (taze soğanlı)', description: 'Yeni besin: taze soğan', ingredients: ['Kabak', 'Havuç', 'Patates', 'Taze soğan', 'Zeytinyağı'], emoji: '🧅' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta sarısı', ingredients: ['Avokado', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Tavuklu sebze çorbası', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Taze soğan', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma + pekmez', ingredients: ['Yulaf unu', 'Elma', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kıymalı patates', ingredients: ['Kuzu kıyma', 'Patates', 'Taze soğan', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 22-24: Hindi tanıtımı
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + muz + ceviz', ingredients: ['Yoğurt', 'Muz', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Hindi püresi', description: 'Yeni besin: hindi', ingredients: ['Hindi', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🦃' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + elma', ingredients: ['Lor peyniri', 'Elma'], emoji: '🧀' },
        { slot: 'lunch', name: 'Hindili sebze çorbası', ingredients: ['Hindi', 'Patates', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🦃' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı', ingredients: ['Yulaf unu', 'Kayısı', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Hindili pirinç', ingredients: ['Hindi', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🦃' },
      ],
    },
    // Gün 25-27: Nane tanıtımı + tekrar
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Avokado + lor + pekmez', ingredients: ['Avokado', 'Lor peyniri', 'Pekmez'], emoji: '🥑' },
        { slot: 'lunch', name: 'Yoğurtlu kabak çorbası', description: 'Naneli', ingredients: ['Kabak', 'Yoğurt', 'Nane', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + elma + ceviz', ingredients: ['Yoğurt', 'Elma', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Tavuklu tarhana çorbası', ingredients: ['Tarhana', 'Tavuk', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + armut + pekmez', ingredients: ['Yulaf unu', 'Armut', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kıymalı sebze', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Patates', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 28-30: Tekrar ve çeşitlendirme
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + avokado + yumurta sarısı', ingredients: ['Lor peyniri', 'Avokado', 'Yumurta sarısı', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Taze soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + kayısı + pekmez', ingredients: ['Yoğurt', 'Kayısı', 'Pekmez'], emoji: '🥛' },
        { slot: 'lunch', name: 'Ispanaklı pirinç lapası', ingredients: ['Ispanak', 'Pirinç', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Avokado + muz + yulaf', ingredients: ['Avokado', 'Muz', 'Yulaf unu'], emoji: '🥑' },
        { slot: 'lunch', name: 'Tavuk suyu çorbası + sebze', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
  ],
};

// ============================================================
// 8. AY — 3 ÖĞÜN: Kahvaltı + Öğle + Akşam
// Dr. Erdal Pazar rehberi: 8-10 ay arası günde 3 öğün
// ============================================================
const month8: MealPlanTemplate = {
  month: 8,
  title: '8. Ay - 3 Öğün Beslenme Planı',
  description:
    'Günde 3 öğün: kahvaltı, öğle ve akşam. Balık, yumurta beyazı, baklagiller, bulgur ve yeni baharatlar tanıtılır.',
  mealSlots: ['breakfast', 'lunch', 'dinner'],
  notes: [
    'Tüm yemeklere zeytinyağı eklemeyi unutmayın.',
    'Balık haftada 2-3 kez verilebilir.',
    'Nohut 1 gece suda bekletilip zarı çıkarılacaktır.',
    'Yumurta beyazı bu ay tanıtılabilir.',
    'Bulgur ve tam buğday unu bu ay başlar.',
    'Karabiber, kekik, tarçın az miktarda eklenebilir.',
    'Tahin alerjik reaksiyona dikkat ederek tanıtılmalı.',
  ],
  newFoodsIntroduced: [
    'Balık',
    'Yumurta beyazı (tam yumurta)',
    'Nohut',
    'Mercimek',
    'Kuru fasulye',
    'Barbunya',
    'Bulgur',
    'Tam buğday unu',
    'Soğan',
    'Tahin',
    'Karabiber',
    'Kekik',
    'Tarçın',
    'Susam',
    'Kuru üzüm',
    'İncir',
    'Kiraz',
    'Nar',
  ],
  days: [
    // Gün 1-3: Yumurta beyazı (tam yumurta) tanıtımı
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Haşlanmış yumurta + avokado', description: 'Yeni besin: tam yumurta (beyazı dahil)', ingredients: ['Yumurta', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuklu sebze çorbası', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'dinner', name: 'Yoğurt + elma püresi', ingredients: ['Yoğurt', 'Elma'], emoji: '🥛' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + lor peyniri + domates', ingredients: ['Yumurta', 'Lor peyniri', 'Domates', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı sebze', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Patates', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Pirinç lapası + yoğurt', ingredients: ['Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + pekmez', ingredients: ['Yumurta', 'Avokado', 'Pekmez'], emoji: '🥚' },
        { slot: 'lunch', name: 'Ispanak yemeği', ingredients: ['Ispanak', 'Pirinç', 'Taze soğan', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 4-6: Balık tanıtımı
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + muz + ceviz', ingredients: ['Yoğurt', 'Muz', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Balık çorbası', description: 'Yeni besin: balık', ingredients: ['Balık', 'Havuç', 'Patates', 'Taze soğan', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'dinner', name: 'Sebze püresi', ingredients: ['Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🥕' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma + tarçın', description: 'Yeni besin: tarçın (az miktar)', ingredients: ['Yulaf unu', 'Elma', 'Tarçın', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Balıklı sebze', ingredients: ['Balık', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'dinner', name: 'Yoğurt + armut', ingredients: ['Yoğurt', 'Armut'], emoji: '🥛' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + avokado + yumurta', ingredients: ['Lor peyniri', 'Avokado', 'Yumurta', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Balıklı patates püresi', ingredients: ['Balık', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 7-9: Bulgur tanıtımı
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + peynir tabağı', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Bulgur pilavı + yoğurt', description: 'Yeni besin: bulgur', ingredients: ['Bulgur', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'dinner', name: 'Kabak çorbası', ingredients: ['Kabak', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + kayısı + pekmez', ingredients: ['Yoğurt', 'Kayısı', 'Pekmez'], emoji: '🥛' },
        { slot: 'lunch', name: 'Kıymalı bulgur', ingredients: ['Bulgur', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'dinner', name: 'Tavuklu sebze püresi', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + lor', ingredients: ['Avokado', 'Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Sebzeli bulgur pilavı', ingredients: ['Bulgur', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'dinner', name: 'Yoğurt + elma + ceviz', ingredients: ['Yoğurt', 'Elma', 'Ceviz'], emoji: '🥛' },
      ],
    },
    // Gün 10-12: Nohut tanıtımı
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + muz + tahin', description: 'Yeni besin: tahin', ingredients: ['Yulaf unu', 'Muz', 'Tahin', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Nohut yemeği', description: 'Yeni besin: nohut (1 gece bekletip zarı çıkarın)', ingredients: ['Nohut', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Ispanak-pirinç', ingredients: ['Ispanak', 'Pirinç', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + pekmezli tahini', ingredients: ['Yumurta', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Nohutlu tavuk', ingredients: ['Nohut', 'Tavuk', 'Havuç', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Kabak', 'Havuç', 'Patates', 'Taze soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + incir', description: 'Yeni besin: incir', ingredients: ['Lor peyniri', 'İncir'], emoji: '🧀' },
        { slot: 'lunch', name: 'Nohutlu bulgur pilavı', ingredients: ['Nohut', 'Bulgur', 'Domates', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Kıymalı kabak', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
      ],
    },
    // Gün 13-15: Makarna (tam buğday) tanıtımı
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + armut + ceviz', ingredients: ['Yoğurt', 'Armut', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Sebzeli makarna', description: 'Tam buğday makarna', ingredients: ['Tam buğday makarna', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
        { slot: 'dinner', name: 'Balık çorbası', ingredients: ['Balık', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + domates', ingredients: ['Yumurta', 'Avokado', 'Domates', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı makarna', ingredients: ['Tam buğday makarna', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
        { slot: 'dinner', name: 'Yoğurt + muz + tahin', ingredients: ['Yoğurt', 'Muz', 'Tahin'], emoji: '🥛' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + incir + pekmez', ingredients: ['Yulaf unu', 'İncir', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Tavuklu makarna', ingredients: ['Tam buğday makarna', 'Tavuk', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 16-18: Kuru fasulye tanıtımı
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Peynir tabağı (lor + avokado)', ingredients: ['Lor peyniri', 'Avokado', 'Domates', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Kuru fasulye', description: 'Yeni besin: kuru fasulye', ingredients: ['Kuru fasulye', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Pirinç pilavı + yoğurt', ingredients: ['Pirinç', 'Yoğurt', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + elma + tarçın', ingredients: ['Yoğurt', 'Elma', 'Tarçın'], emoji: '🥛' },
        { slot: 'lunch', name: 'Kuru fasulyeli bulgur', ingredients: ['Kuru fasulye', 'Bulgur', 'Domates', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Tavuk suyu çorbası', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + tahinli pekmez', ingredients: ['Yumurta', 'Tahin', 'Pekmez', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı mercimek', description: 'Yeni besin: yeşil mercimek', ingredients: ['Yeşil mercimek', 'Kuzu kıyma', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'dinner', name: 'Kabak-patates püresi', ingredients: ['Kabak', 'Patates', 'Zeytinyağı'], emoji: '🎃' },
      ],
    },
    // Gün 19-21: Erişte ve kekik tanıtımı
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + lor', ingredients: ['Avokado', 'Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Erişte + yoğurt', description: 'Ev yapımı erişte', ingredients: ['Tam buğday unu', 'Yumurta', 'Yoğurt', 'Zeytinyağı'], emoji: '🍜' },
        { slot: 'dinner', name: 'Sebze çorbası (kekikli)', description: 'Yeni besin: kekik', ingredients: ['Kabak', 'Havuç', 'Patates', 'Kekik', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + kuru üzüm + ceviz', description: 'Yeni besin: kuru üzüm', ingredients: ['Yoğurt', 'Kuru üzüm', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Kıymalı erişte', ingredients: ['Tam buğday unu', 'Yumurta', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍜' },
        { slot: 'dinner', name: 'Balıklı sebze', ingredients: ['Balık', 'Havuç', 'Kabak', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + muz + tahin', ingredients: ['Yulaf unu', 'Muz', 'Tahin', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Mantı', description: 'Ev yapımı mini mantı', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'dinner', name: 'Ispanak yemeği', ingredients: ['Ispanak', 'Pirinç', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    // Gün 22-24: Susam ve karabiber tanıtımı
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + susamlı ekmek', description: 'Yeni besin: susam', ingredients: ['Yumurta', 'Tam buğday ekmeği', 'Susam', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Pirinç pilavı + kıyma', description: 'Yeni besin: karabiber (çok az)', ingredients: ['Pirinç', 'Kuzu kıyma', 'Domates', 'Karabiber', 'Zeytinyağı'], emoji: '🍚' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + incir + ceviz', ingredients: ['Lor peyniri', 'İncir', 'Ceviz'], emoji: '🧀' },
        { slot: 'lunch', name: 'Tavuklu bulgur pilavı', ingredients: ['Bulgur', 'Tavuk', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'dinner', name: 'Yoğurt + elma + tarçın', ingredients: ['Yoğurt', 'Elma', 'Tarçın'], emoji: '🥛' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + domates', ingredients: ['Avokado', 'Yumurta', 'Domates', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Nohutlu sebze', ingredients: ['Nohut', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Balık çorbası', ingredients: ['Balık', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    // Gün 25-27: Barbunya ve nar tanıtımı
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + nar', description: 'Yeni besin: nar', ingredients: ['Yoğurt', 'Nar'], emoji: '🥛' },
        { slot: 'lunch', name: 'Barbunya yemeği', description: 'Yeni besin: barbunya', ingredients: ['Barbunya', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Kıymalı makarna', ingredients: ['Tam buğday makarna', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + lor + avokado', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Sebzeli makarna + yoğurt', ingredients: ['Tam buğday makarna', 'Kabak', 'Havuç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🍝' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı + pekmez', ingredients: ['Yulaf unu', 'Kayısı', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Hindili sebze', ingredients: ['Hindi', 'Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🦃' },
        { slot: 'dinner', name: 'Bulgur pilavı + yoğurt', ingredients: ['Bulgur', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    // Gün 28-30: Tekrar ve çeşitlendirme
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Peynir tabağı + yumurta', ingredients: ['Lor peyniri', 'Avokado', 'Yumurta', 'Domates', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Kabak', 'Havuç', 'Patates', 'Soğan', 'Kekik', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + muz + tahin + pekmez', ingredients: ['Yoğurt', 'Muz', 'Tahin', 'Pekmez'], emoji: '🥛' },
        { slot: 'lunch', name: 'Balıklı pirinç pilavı', ingredients: ['Balık', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'dinner', name: 'Kıymalı ıspanak', ingredients: ['Kuzu kıyma', 'Ispanak', 'Pirinç', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + susamlı ekmek', ingredients: ['Avokado', 'Yumurta', 'Tam buğday ekmeği', 'Susam', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Kuru fasulye + bulgur pilavı', ingredients: ['Kuru fasulye', 'Bulgur', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'dinner', name: 'Tavuk suyu çorbası', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
  ],
};

// ============================================================
// 9. AY — 3 ÖĞÜN + ARA ÖĞÜN
// Dr. Erdal Pazar rehberi: 8-10 ay arası günde 3 öğün
// ============================================================
const month9: MealPlanTemplate = {
  month: 9,
  title: '9. Ay - 3 Öğün + Ara Öğün Beslenme Planı',
  description:
    'Günde 3 ana öğün + 1 ara öğün. Daha fazla doku çeşitliliği, parmak yiyecekler başlar. Zerdeçal ve zencefil tanıtılır.',
  mealSlots: ['breakfast', 'lunch', 'snack', 'dinner'],
  notes: [
    'Parmak yiyeceklere geçiş başlayabilir.',
    'Yemeklerin dokusu kademeli olarak kabalaştırılmalı.',
    'Ispanak haftada en fazla 2 kez verilmelidir.',
    'Nohut zarları çıkarılmalı.',
    'Zerdeçal ve zencefil çok az miktarda kullanılmalı.',
    'Et kavurma iyice pişirilip ufak parçalara ayrılmalı.',
  ],
  newFoodsIntroduced: [
    'Yaban mersini',
    'Zerdeçal',
    'Zencefil',
    'Enginar',
    'Kereviz',
    'Bezelye',
  ],
  days: [
    // Gün 1-3: Kereviz tanıtımı
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + lor', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kereviz yemeği', description: 'Yeni besin: kereviz', ingredients: ['Kereviz', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + muz', ingredients: ['Yoğurt', 'Muz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma + tarçın', ingredients: ['Yulaf unu', 'Elma', 'Tarçın', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kıymalı kereviz', ingredients: ['Kereviz', 'Kuzu kıyma', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Armut + ceviz', ingredients: ['Armut', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + pekmez + ceviz', ingredients: ['Lor peyniri', 'Pekmez', 'Ceviz'], emoji: '🧀' },
        { slot: 'lunch', name: 'Kerevizli tavuk', ingredients: ['Kereviz', 'Tavuk', 'Havuç', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + kayısı', ingredients: ['Yoğurt', 'Kayısı'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebzeli bulgur pilavı', ingredients: ['Bulgur', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    // Gün 4-6: Bezelye tanıtımı
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + domates + avokado', ingredients: ['Yumurta', 'Domates', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Bezelye yemeği', description: 'Yeni besin: bezelye', ingredients: ['Bezelye', 'Havuç', 'Patates', 'Domates', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Elma + lor peyniri', ingredients: ['Elma', 'Lor peyniri'], emoji: '🍎' },
        { slot: 'dinner', name: 'Tavuk suyu çorbası', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + incir + tahin', ingredients: ['Yoğurt', 'İncir', 'Tahin'], emoji: '🥛' },
        { slot: 'lunch', name: 'Kıymalı bezelye', ingredients: ['Bezelye', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Muz + ceviz', ingredients: ['Muz', 'Ceviz'], emoji: '🍌' },
        { slot: 'dinner', name: 'Balıklı sebze', ingredients: ['Balık', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + susamlı ekmek', ingredients: ['Avokado', 'Yumurta', 'Tam buğday ekmeği', 'Susam', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Bezelyeli pirinç pilavı', ingredients: ['Bezelye', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Yoğurt + armut', ingredients: ['Yoğurt', 'Armut'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı makarna', ingredients: ['Tam buğday makarna', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    // Gün 7-9: Zerdeçal tanıtımı + et kavurma
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + muz + pekmez', ingredients: ['Yulaf unu', 'Muz', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Et kavurma', description: 'Yeni besin: zerdeçal (çok az)', ingredients: ['Kuzu eti', 'Havuç', 'Patates', 'Zerdeçal', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Lor peyniri + elma', ingredients: ['Lor peyniri', 'Elma'], emoji: '🧀' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Kabak', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + lor + domates', ingredients: ['Yumurta', 'Lor peyniri', 'Domates', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı kabak', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Zerdeçal', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Yoğurt + kuru üzüm + ceviz', ingredients: ['Yoğurt', 'Kuru üzüm', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Nohut yemeği', ingredients: ['Nohut', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Peynir tabağı + avokado', ingredients: ['Lor peyniri', 'Avokado', 'Domates', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Fırın sebze', description: 'Parmak yiyecek olarak sunulabilir', ingredients: ['Kabak', 'Havuç', 'Patates', 'Zeytinyağı', 'Kekik'], emoji: '🥕' },
        { slot: 'snack', name: 'Kayısı + yoğurt', ingredients: ['Kayısı', 'Yoğurt'], emoji: '🥛' },
        { slot: 'dinner', name: 'Bulgur pilavı + yoğurt', ingredients: ['Bulgur', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    // Gün 10-12: Tavuk sote ve zencefil tanıtımı
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + elma + tarçın + ceviz', ingredients: ['Yoğurt', 'Elma', 'Tarçın', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Tavuk sote', description: 'Yeni besin: zencefil (çok az)', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Domates', 'Zencefil', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Armut + lor peyniri', ingredients: ['Armut', 'Lor peyniri'], emoji: '🍐' },
        { slot: 'dinner', name: 'Ispanak yemeği + pirinç', ingredients: ['Ispanak', 'Pirinç', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + susamlı ekmek', ingredients: ['Yumurta', 'Avokado', 'Tam buğday ekmeği', 'Susam', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuklu bulgur pilavı', ingredients: ['Tavuk', 'Bulgur', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + incir', ingredients: ['Yoğurt', 'İncir'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kuru fasulye', ingredients: ['Kuru fasulye', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + armut + pekmez', ingredients: ['Yulaf unu', 'Armut', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Tavuk sote + pirinç', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Muz + tahin', ingredients: ['Muz', 'Tahin'], emoji: '🍌' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 13-15: Enginar tanıtımı
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + pekmez + ceviz', ingredients: ['Lor peyniri', 'Pekmez', 'Ceviz'], emoji: '🧀' },
        { slot: 'lunch', name: 'Enginar yemeği', description: 'Yeni besin: enginar', ingredients: ['Enginar', 'Havuç', 'Bezelye', 'Zeytinyağı'], emoji: '🌿' },
        { slot: 'snack', name: 'Yoğurt + elma', ingredients: ['Yoğurt', 'Elma'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı makarna', ingredients: ['Tam buğday makarna', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + domates + avokado', ingredients: ['Yumurta', 'Domates', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı enginar', ingredients: ['Enginar', 'Kuzu kıyma', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🌿' },
        { slot: 'snack', name: 'Armut + ceviz', ingredients: ['Armut', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Balık çorbası', ingredients: ['Balık', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + muz + tahin', ingredients: ['Yoğurt', 'Muz', 'Tahin'], emoji: '🥛' },
        { slot: 'lunch', name: 'Enginar + bezelye', ingredients: ['Enginar', 'Bezelye', 'Havuç', 'Zeytinyağı'], emoji: '🌿' },
        { slot: 'snack', name: 'Lor peyniri + kayısı', ingredients: ['Lor peyniri', 'Kayısı'], emoji: '🧀' },
        { slot: 'dinner', name: 'Sebzeli pirinç pilavı', ingredients: ['Pirinç', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🍚' },
      ],
    },
    // Gün 16-18: Yaban mersini tanıtımı
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + yaban mersini', description: 'Yeni besin: yaban mersini', ingredients: ['Yulaf unu', 'Yaban mersini', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Et kavurma + bulgur', ingredients: ['Kuzu eti', 'Bulgur', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + yaban mersini', ingredients: ['Yoğurt', 'Yaban mersini'], emoji: '🫐' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Kabak', 'Havuç', 'Patates', 'Kereviz', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + lor + avokado', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Nohutlu tavuk', ingredients: ['Nohut', 'Tavuk', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Elma + ceviz', ingredients: ['Elma', 'Ceviz'], emoji: '🍎' },
        { slot: 'dinner', name: 'Mercimek çorbası', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Peynir tabağı + yumurta', ingredients: ['Lor peyniri', 'Avokado', 'Yumurta', 'Domates', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Kıymalı ıspanak + pirinç', ingredients: ['Kuzu kıyma', 'Ispanak', 'Pirinç', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + armut + pekmez', ingredients: ['Yoğurt', 'Armut', 'Pekmez'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kuru fasulye + bulgur', ingredients: ['Kuru fasulye', 'Bulgur', 'Domates', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    // Gün 19-21: Parmak yiyecekler
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + ekmek', description: 'Parmak yiyecek: ekmek dilimleri', ingredients: ['Avokado', 'Yumurta', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Sebzeli mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Muz (parmak yiyecek)', description: 'Dilimlenmiş muz', ingredients: ['Muz'], emoji: '🍌' },
        { slot: 'dinner', name: 'Balıklı patates', ingredients: ['Balık', 'Patates', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + incir + ceviz', ingredients: ['Yoğurt', 'İncir', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Kıymalı kabak (parçalı)', description: 'Daha iri parçalı doku', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Havuç çubukları (buğulanmış)', description: 'Parmak yiyecek', ingredients: ['Havuç'], emoji: '🥕' },
        { slot: 'dinner', name: 'Tavuklu tarhana çorbası', ingredients: ['Tarhana', 'Tavuk', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı + tahin', ingredients: ['Yulaf unu', 'Kayısı', 'Tahin', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Bulgur pilavı + nohut', ingredients: ['Bulgur', 'Nohut', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Yoğurt + nar', ingredients: ['Yoğurt', 'Nar'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kereviz yemeği', ingredients: ['Kereviz', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    // Gün 22-24: Et çeşitleri
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + peynir + domates', ingredients: ['Yumurta', 'Lor peyniri', 'Domates', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Et kavurma + sebze', ingredients: ['Kuzu eti', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Elma dilimleri + lor', description: 'Parmak yiyecek', ingredients: ['Elma', 'Lor peyniri'], emoji: '🍎' },
        { slot: 'dinner', name: 'Mercimekli bulgur pilavı', ingredients: ['Yeşil mercimek', 'Bulgur', 'Soğan', 'Domates', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + ekmek', ingredients: ['Avokado', 'Yumurta', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Hindili sebze', ingredients: ['Hindi', 'Kabak', 'Havuç', 'Bezelye', 'Zeytinyağı'], emoji: '🦃' },
        { slot: 'snack', name: 'Yoğurt + muz + pekmez', ingredients: ['Yoğurt', 'Muz', 'Pekmez'], emoji: '🥛' },
        { slot: 'dinner', name: 'Barbunya yemeği', ingredients: ['Barbunya', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + tahin + pekmez', ingredients: ['Lor peyniri', 'Tahin', 'Pekmez'], emoji: '🧀' },
        { slot: 'lunch', name: 'Balık + fırın sebze', ingredients: ['Balık', 'Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Armut + ceviz', ingredients: ['Armut', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Nohut yemeği + pirinç', ingredients: ['Nohut', 'Domates', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    // Gün 25-27: Çorba çeşitleri
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + elma + tarçın + ceviz', ingredients: ['Yoğurt', 'Elma', 'Tarçın', 'Ceviz'], emoji: '🥛' },
        { slot: 'lunch', name: 'Sebzeli çorba (kerevizli)', ingredients: ['Kereviz', 'Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
        { slot: 'snack', name: 'Muz + tahin', ingredients: ['Muz', 'Tahin'], emoji: '🍌' },
        { slot: 'dinner', name: 'Kıymalı makarna', ingredients: ['Tam buğday makarna', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + susamlı ekmek', ingredients: ['Yumurta', 'Avokado', 'Tam buğday ekmeği', 'Susam', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Tavuk sote + bulgur', ingredients: ['Tavuk', 'Bulgur', 'Kabak', 'Domates', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Yoğurt + yaban mersini', ingredients: ['Yoğurt', 'Yaban mersini'], emoji: '🫐' },
        { slot: 'dinner', name: 'Kuru fasulye + pirinç pilavı', ingredients: ['Kuru fasulye', 'Pirinç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + incir + pekmez', ingredients: ['Yulaf unu', 'İncir', 'Pekmez', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Ispanak yemeği + yumurta', ingredients: ['Ispanak', 'Pirinç', 'Yumurta', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Lor peyniri + armut', ingredients: ['Lor peyniri', 'Armut'], emoji: '🧀' },
        { slot: 'dinner', name: 'Balıklı sebze çorbası', ingredients: ['Balık', 'Havuç', 'Patates', 'Kabak', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    // Gün 28-30: Tekrar ve çeşitlendirme
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Peynir tabağı + yumurta + avokado', ingredients: ['Lor peyniri', 'Yumurta', 'Avokado', 'Domates', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Et kavurma + pirinç pilavı', ingredients: ['Kuzu eti', 'Pirinç', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + kayısı + ceviz', ingredients: ['Yoğurt', 'Kayısı', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Nohutlu sebze çorbası', ingredients: ['Nohut', 'Havuç', 'Kabak', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + muz + tahin + pekmez', ingredients: ['Yoğurt', 'Muz', 'Tahin', 'Pekmez'], emoji: '🥛' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Elma dilimleri (parmak yiyecek)', ingredients: ['Elma'], emoji: '🍎' },
        { slot: 'dinner', name: 'Bezelye yemeği + bulgur', ingredients: ['Bezelye', 'Bulgur', 'Domates', 'Zeytinyağı'], emoji: '🟢' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + lor + domates + avokado', ingredients: ['Yumurta', 'Lor peyniri', 'Domates', 'Avokado', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kıymalı sebze + bulgur pilavı', ingredients: ['Kuzu kıyma', 'Kabak', 'Havuç', 'Domates', 'Bulgur', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + nar + ceviz', ingredients: ['Yoğurt', 'Nar', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Mercimek çorbası + ekmek', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
  ],
};

// ============================================================
// 10. AY — 4 ÖĞÜN: Kahvaltı + Öğle + Ara Öğün + Akşam
// Dr. Erdal Pazar rehberi: 10-12 ay arası günde 4 öğün
// ============================================================
const month10: MealPlanTemplate = {
  month: 10,
  title: '10. Ay - 4 Öğün Beslenme Planı',
  description:
    'Günde 4 öğün: kahvaltı, öğle, ara öğün ve akşam. Daha fazla doku çeşitliliği, parmak yiyecekler ve aile sofrası geçişi. Kivi tanıtılır.',
  mealSlots: ['breakfast', 'lunch', 'snack', 'dinner'],
  notes: [
    'Parmak yiyecekler artık düzenli olarak sunulmalı.',
    'Yemeklerin dokusu aile yemeklerine yaklaştırılmalı.',
    'Hâlâ tuz eklenmemeli (1 yaşına kadar).',
    'Hâlâ bal verilmemeli (1 yaşına kadar).',
    'Hâlâ inek sütü verilmemeli (1 yaşına kadar).',
    'Kivi bu ay tanıtılabilir.',
    'Pankek, krep, tava böreği gibi yeni formlar denenebilir.',
  ],
  newFoodsIntroduced: [
    'Kivi',
    'Pankek',
    'Krep',
    'Tava böreği',
    'Biber dolması',
    'Bamya',
  ],
  days: [
    // Gün 1-3: Kivi tanıtımı
    {
      day: 1,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + lor + ekmek', ingredients: ['Yumurta', 'Avokado', 'Lor peyniri', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Ispanak yemeği + pirinç', ingredients: ['Ispanak', 'Pirinç', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
        { slot: 'snack', name: 'Yoğurt + kivi', description: 'Yeni besin: kivi', ingredients: ['Yoğurt', 'Kivi'], emoji: '🥝' },
        { slot: 'dinner', name: 'Tarhana çorbası + ekmek', ingredients: ['Tarhana', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 2,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + muz + tahin', ingredients: ['Yulaf unu', 'Muz', 'Tahin', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Balık + sebze', ingredients: ['Balık', 'Kabak', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Kivi + lor peyniri', ingredients: ['Kivi', 'Lor peyniri'], emoji: '🥝' },
        { slot: 'dinner', name: 'Kıymalı makarna', ingredients: ['Tam buğday makarna', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    {
      day: 3,
      meals: [
        { slot: 'breakfast', name: 'Peynir tabağı + yumurta + domates', ingredients: ['Lor peyniri', 'Yumurta', 'Domates', 'Avokado', 'Zeytinyağı'], emoji: '🧀' },
        { slot: 'lunch', name: 'Mercimekli bulgur pilavı', ingredients: ['Yeşil mercimek', 'Bulgur', 'Soğan', 'Domates', 'Zeytinyağı'], emoji: '🌾' },
        { slot: 'snack', name: 'Yoğurt + kivi + ceviz', ingredients: ['Yoğurt', 'Kivi', 'Ceviz'], emoji: '🥝' },
        { slot: 'dinner', name: 'Tavuk suyu çorbası', ingredients: ['Tavuk', 'Havuç', 'Patates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    // Gün 4-6: Pankek tanıtımı
    {
      day: 4,
      meals: [
        { slot: 'breakfast', name: 'Pankek + muz', description: 'Yeni form: pankek (yumurta, yulaf, muz)', ingredients: ['Yulaf unu', 'Yumurta', 'Muz', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Etli nohut', ingredients: ['Kuzu eti', 'Nohut', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Yoğurt + elma + tarçın', ingredients: ['Yoğurt', 'Elma', 'Tarçın'], emoji: '🥛' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Kabak', 'Havuç', 'Patates', 'Kereviz', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 5,
      meals: [
        { slot: 'breakfast', name: 'Pankek + yoğurt + pekmez', ingredients: ['Yulaf unu', 'Yumurta', 'Yoğurt', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kavurma et + pirinç pilavı', ingredients: ['Kuzu eti', 'Pirinç', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Armut + ceviz', ingredients: ['Armut', 'Ceviz'], emoji: '🍐' },
        { slot: 'dinner', name: 'Mercimek çorbası + ekmek', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 6,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + susamlı ekmek', ingredients: ['Yumurta', 'Avokado', 'Tam buğday ekmeği', 'Susam', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Kuru fasulye + bulgur pilavı', ingredients: ['Kuru fasulye', 'Bulgur', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Muz + tahin + pekmez', ingredients: ['Muz', 'Tahin', 'Pekmez'], emoji: '🍌' },
        { slot: 'dinner', name: 'Balık çorbası', ingredients: ['Balık', 'Havuç', 'Patates', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    // Gün 7-9: Bamya tanıtımı
    {
      day: 7,
      meals: [
        { slot: 'breakfast', name: 'Lor peyniri + pekmez + ceviz + ekmek', ingredients: ['Lor peyniri', 'Pekmez', 'Ceviz', 'Tam buğday ekmeği'], emoji: '🧀' },
        { slot: 'lunch', name: 'Bamya yemeği', description: 'Yeni besin: bamya', ingredients: ['Bamya', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🌿' },
        { slot: 'snack', name: 'Yoğurt + incir', ingredients: ['Yoğurt', 'İncir'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tavuklu bulgur pilavı', ingredients: ['Tavuk', 'Bulgur', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 8,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + elma + tarçın', ingredients: ['Yulaf unu', 'Elma', 'Tarçın', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Kıymalı bamya', ingredients: ['Bamya', 'Kuzu kıyma', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🌿' },
        { slot: 'snack', name: 'Kivi + lor peyniri', ingredients: ['Kivi', 'Lor peyniri'], emoji: '🥝' },
        { slot: 'dinner', name: 'Ispanak yemeği + yumurta', ingredients: ['Ispanak', 'Pirinç', 'Yumurta', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 9,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + domates + avokado + ekmek', ingredients: ['Yumurta', 'Domates', 'Avokado', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Bamya + tavuk', ingredients: ['Bamya', 'Tavuk', 'Domates', 'Zeytinyağı'], emoji: '🌿' },
        { slot: 'snack', name: 'Yoğurt + muz + ceviz', ingredients: ['Yoğurt', 'Muz', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Nohutlu sebze çorbası', ingredients: ['Nohut', 'Havuç', 'Kabak', 'Patates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    // Gün 10-12: Biber dolması tanıtımı
    {
      day: 10,
      meals: [
        { slot: 'breakfast', name: 'Pankek + kayısı + yoğurt', ingredients: ['Yulaf unu', 'Yumurta', 'Kayısı', 'Yoğurt'], emoji: '🥞' },
        { slot: 'lunch', name: 'Biber dolması', description: 'Yeni form: biber dolması (kıymalı pirinçli)', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Elma dilimleri + tahin', ingredients: ['Elma', 'Tahin'], emoji: '🍎' },
        { slot: 'dinner', name: 'Tarhana çorbası', ingredients: ['Tarhana', 'Domates', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 11,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + lor + ekmek', ingredients: ['Avokado', 'Yumurta', 'Lor peyniri', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Kıymalı enginar', ingredients: ['Enginar', 'Kuzu kıyma', 'Havuç', 'Bezelye', 'Domates', 'Zeytinyağı'], emoji: '🌿' },
        { slot: 'snack', name: 'Yoğurt + nar + ceviz', ingredients: ['Yoğurt', 'Nar', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Balıklı sebze', ingredients: ['Balık', 'Kabak', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    {
      day: 12,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + incir + tahin + pekmez', ingredients: ['Yoğurt', 'İncir', 'Tahin', 'Pekmez'], emoji: '🥛' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Muz + ceviz', ingredients: ['Muz', 'Ceviz'], emoji: '🍌' },
        { slot: 'dinner', name: 'Kereviz yemeği', ingredients: ['Kereviz', 'Havuç', 'Patates', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    // Gün 13-15: Krep ve tava böreği tanıtımı
    {
      day: 13,
      meals: [
        { slot: 'breakfast', name: 'Krep + lor + ıspanak', description: 'Yeni form: krep', ingredients: ['Tam buğday unu', 'Yumurta', 'Lor peyniri', 'Ispanak', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Et kavurma + bulgur pilavı', ingredients: ['Kuzu eti', 'Bulgur', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + kivi', ingredients: ['Yoğurt', 'Kivi'], emoji: '🥝' },
        { slot: 'dinner', name: 'Sebze çorbası', ingredients: ['Kabak', 'Havuç', 'Patates', 'Kereviz', 'Kekik', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 14,
      meals: [
        { slot: 'breakfast', name: 'Tava böreği', description: 'Yeni form: tava böreği (peynirli)', ingredients: ['Tam buğday unu', 'Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥧' },
        { slot: 'lunch', name: 'Tavuk sote + pirinç', ingredients: ['Tavuk', 'Kabak', 'Havuç', 'Domates', 'Pirinç', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Armut + lor peyniri', ingredients: ['Armut', 'Lor peyniri'], emoji: '🍐' },
        { slot: 'dinner', name: 'Nohut yemeği', ingredients: ['Nohut', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 15,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + domates + ekmek', ingredients: ['Yumurta', 'Avokado', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Yoğurt + elma + tarçın', ingredients: ['Yoğurt', 'Elma', 'Tarçın'], emoji: '🥛' },
        { slot: 'dinner', name: 'Balık + fırın sebze', ingredients: ['Balık', 'Kabak', 'Havuç', 'Patates', 'Kekik', 'Zeytinyağı'], emoji: '🐟' },
      ],
    },
    // Gün 16-18: Et çeşitleri
    {
      day: 16,
      meals: [
        { slot: 'breakfast', name: 'Pankek + yoğurt + pekmez', ingredients: ['Yulaf unu', 'Yumurta', 'Yoğurt', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kıymalı kabak', ingredients: ['Kuzu kıyma', 'Kabak', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🎃' },
        { slot: 'snack', name: 'Kivi + muz', ingredients: ['Kivi', 'Muz'], emoji: '🥝' },
        { slot: 'dinner', name: 'Kuru fasulye + pirinç pilavı', ingredients: ['Kuru fasulye', 'Pirinç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    {
      day: 17,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado + lor', ingredients: ['Tam buğday unu', 'Yumurta', 'Avokado', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kavurma et + sebze', ingredients: ['Kuzu eti', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + incir + ceviz', ingredients: ['Yoğurt', 'İncir', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tarhana çorbası + ekmek', ingredients: ['Tarhana', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 18,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + peynir tabağı', ingredients: ['Yumurta', 'Lor peyniri', 'Avokado', 'Domates', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Hindili sebze + bulgur', ingredients: ['Hindi', 'Kabak', 'Havuç', 'Bezelye', 'Bulgur', 'Zeytinyağı'], emoji: '🦃' },
        { slot: 'snack', name: 'Elma + tahin', ingredients: ['Elma', 'Tahin'], emoji: '🍎' },
        { slot: 'dinner', name: 'Ispanak yemeği', ingredients: ['Ispanak', 'Pirinç', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    // Gün 19-21: Baklagiller ve çorbalar
    {
      day: 19,
      meals: [
        { slot: 'breakfast', name: 'Tava böreği (ıspanaklı)', ingredients: ['Tam buğday unu', 'Yumurta', 'Ispanak', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥧' },
        { slot: 'lunch', name: 'Etli nohut + pirinç', ingredients: ['Kuzu eti', 'Nohut', 'Domates', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Yoğurt + muz + pekmez', ingredients: ['Yoğurt', 'Muz', 'Pekmez'], emoji: '🥛' },
        { slot: 'dinner', name: 'Mercimek çorbası + ekmek', ingredients: ['Kırmızı mercimek', 'Havuç', 'Patates', 'Soğan', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 20,
      meals: [
        { slot: 'breakfast', name: 'Yulaf lapası + kayısı + ceviz', ingredients: ['Yulaf unu', 'Kayısı', 'Ceviz', 'Su'], emoji: '🥣' },
        { slot: 'lunch', name: 'Barbunya yemeği + bulgur', ingredients: ['Barbunya', 'Bulgur', 'Domates', 'Havuç', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Lor peyniri + armut', ingredients: ['Lor peyniri', 'Armut'], emoji: '🧀' },
        { slot: 'dinner', name: 'Tavuklu sebze çorbası', ingredients: ['Tavuk', 'Havuç', 'Kabak', 'Patates', 'Zeytinyağı'], emoji: '🍗' },
      ],
    },
    {
      day: 21,
      meals: [
        { slot: 'breakfast', name: 'Avokado + yumurta + ekmek', ingredients: ['Avokado', 'Yumurta', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥑' },
        { slot: 'lunch', name: 'Bezelye yemeği + pirinç', ingredients: ['Bezelye', 'Havuç', 'Domates', 'Pirinç', 'Zeytinyağı'], emoji: '🟢' },
        { slot: 'snack', name: 'Yoğurt + yaban mersini', ingredients: ['Yoğurt', 'Yaban mersini'], emoji: '🫐' },
        { slot: 'dinner', name: 'Kıymalı makarna', ingredients: ['Tam buğday makarna', 'Kuzu kıyma', 'Domates', 'Zeytinyağı'], emoji: '🍝' },
      ],
    },
    // Gün 22-24: Balık ve deniz ürünleri
    {
      day: 22,
      meals: [
        { slot: 'breakfast', name: 'Pankek + elma + tarçın', ingredients: ['Yulaf unu', 'Yumurta', 'Elma', 'Tarçın'], emoji: '🥞' },
        { slot: 'lunch', name: 'Balık + pirinç pilavı', ingredients: ['Balık', 'Pirinç', 'Havuç', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Muz + tahin + pekmez', ingredients: ['Muz', 'Tahin', 'Pekmez'], emoji: '🍌' },
        { slot: 'dinner', name: 'Enginar + bezelye', ingredients: ['Enginar', 'Bezelye', 'Havuç', 'Zeytinyağı'], emoji: '🌿' },
      ],
    },
    {
      day: 23,
      meals: [
        { slot: 'breakfast', name: 'Krep + lor + pekmez', ingredients: ['Tam buğday unu', 'Yumurta', 'Lor peyniri', 'Pekmez', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Balık çorbası + ekmek', ingredients: ['Balık', 'Havuç', 'Patates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Yoğurt + kayısı + ceviz', ingredients: ['Yoğurt', 'Kayısı', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kıymalı ıspanak + bulgur', ingredients: ['Kuzu kıyma', 'Ispanak', 'Bulgur', 'Soğan', 'Zeytinyağı'], emoji: '🥬' },
      ],
    },
    {
      day: 24,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + avokado + domates + ekmek', ingredients: ['Yumurta', 'Avokado', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Balıklı sebze + fırın patates', ingredients: ['Balık', 'Kabak', 'Patates', 'Havuç', 'Kekik', 'Zeytinyağı'], emoji: '🐟' },
        { slot: 'snack', name: 'Lor peyniri + incir', ingredients: ['Lor peyniri', 'İncir'], emoji: '🧀' },
        { slot: 'dinner', name: 'Nohut yemeği + bulgur', ingredients: ['Nohut', 'Bulgur', 'Domates', 'Havuç', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    // Gün 25-27: Çeşitli ana yemekler
    {
      day: 25,
      meals: [
        { slot: 'breakfast', name: 'Tava böreği (peynirli)', ingredients: ['Tam buğday unu', 'Yumurta', 'Lor peyniri', 'Zeytinyağı'], emoji: '🥧' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Yoğurt + elma + pekmez', ingredients: ['Yoğurt', 'Elma', 'Pekmez'], emoji: '🥛' },
        { slot: 'dinner', name: 'Bamya yemeği', ingredients: ['Bamya', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🌿' },
      ],
    },
    {
      day: 26,
      meals: [
        { slot: 'breakfast', name: 'Yoğurt + muz + tahin + pekmez', ingredients: ['Yoğurt', 'Muz', 'Tahin', 'Pekmez'], emoji: '🥛' },
        { slot: 'lunch', name: 'Biber dolması + yoğurt', ingredients: ['Biber', 'Kuzu kıyma', 'Pirinç', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🫑' },
        { slot: 'snack', name: 'Kivi + ceviz', ingredients: ['Kivi', 'Ceviz'], emoji: '🥝' },
        { slot: 'dinner', name: 'Mercimekli bulgur + yoğurt', ingredients: ['Yeşil mercimek', 'Bulgur', 'Soğan', 'Domates', 'Yoğurt', 'Zeytinyağı'], emoji: '🌾' },
      ],
    },
    {
      day: 27,
      meals: [
        { slot: 'breakfast', name: 'Pankek + armut + lor', ingredients: ['Yulaf unu', 'Yumurta', 'Armut', 'Lor peyniri'], emoji: '🥞' },
        { slot: 'lunch', name: 'Kavurma et + fırın sebze', ingredients: ['Kuzu eti', 'Kabak', 'Havuç', 'Patates', 'Kekik', 'Zeytinyağı'], emoji: '🥩' },
        { slot: 'snack', name: 'Yoğurt + nar', ingredients: ['Yoğurt', 'Nar'], emoji: '🥛' },
        { slot: 'dinner', name: 'Kuru fasulye + pirinç', ingredients: ['Kuru fasulye', 'Pirinç', 'Domates', 'Soğan', 'Zeytinyağı'], emoji: '🫘' },
      ],
    },
    // Gün 28-30: Tekrar ve çeşitlendirme
    {
      day: 28,
      meals: [
        { slot: 'breakfast', name: 'Krep + avokado + yumurta', ingredients: ['Tam buğday unu', 'Yumurta', 'Avokado', 'Zeytinyağı'], emoji: '🥞' },
        { slot: 'lunch', name: 'Tavuk sote + bulgur pilavı', ingredients: ['Tavuk', 'Bulgur', 'Kabak', 'Havuç', 'Domates', 'Zeytinyağı'], emoji: '🍗' },
        { slot: 'snack', name: 'Elma + tahin + pekmez', ingredients: ['Elma', 'Tahin', 'Pekmez'], emoji: '🍎' },
        { slot: 'dinner', name: 'Sebze çorbası + ekmek', ingredients: ['Kabak', 'Havuç', 'Patates', 'Kereviz', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 29,
      meals: [
        { slot: 'breakfast', name: 'Yumurta + lor + domates + avokado + ekmek', ingredients: ['Yumurta', 'Lor peyniri', 'Domates', 'Avokado', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🥚' },
        { slot: 'lunch', name: 'Etli nohut + pirinç pilavı', ingredients: ['Kuzu eti', 'Nohut', 'Domates', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🫘' },
        { slot: 'snack', name: 'Yoğurt + kivi + ceviz', ingredients: ['Yoğurt', 'Kivi', 'Ceviz'], emoji: '🥛' },
        { slot: 'dinner', name: 'Tarhana çorbası + ekmek', ingredients: ['Tarhana', 'Domates', 'Tam buğday ekmeği', 'Zeytinyağı'], emoji: '🍲' },
      ],
    },
    {
      day: 30,
      meals: [
        { slot: 'breakfast', name: 'Pankek + yoğurt + meyve', ingredients: ['Yulaf unu', 'Yumurta', 'Yoğurt', 'Muz', 'Pekmez'], emoji: '🥞' },
        { slot: 'lunch', name: 'Mantı + yoğurt', ingredients: ['Tam buğday unu', 'Kuzu kıyma', 'Soğan', 'Yoğurt', 'Zeytinyağı'], emoji: '🥟' },
        { slot: 'snack', name: 'Lor peyniri + armut + ceviz', ingredients: ['Lor peyniri', 'Armut', 'Ceviz'], emoji: '🧀' },
        { slot: 'dinner', name: 'Balık + sebze + pirinç pilavı', ingredients: ['Balık', 'Kabak', 'Havuç', 'Pirinç', 'Zeytinyağı'], emoji: '🐟' },
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
