/**
 * Kaşık — Varsayılan Tazelik Günleri
 * Her ürün için ortalama raf ömrü (gün)
 * -1 = kuru gıda, bayatlamaz
 */

export const FRESHNESS_DEFAULTS: Record<string, number> = {
  // Sebzeler
  havuç: 7,
  patates: 14,
  brokoli: 4,
  kabak: 5,
  bezelye: 3,
  ıspanak: 3,
  domates: 5,
  patlıcan: 5,
  'tatlı patates': 10,
  soğan: 21,
  sarımsak: 21,
  biber: 5,
  karnabahar: 5,
  lahana: 7,
  kereviz: 7,
  pırasa: 5,
  semizotu: 2,
  bamya: 3,
  fasulye: 4,
  pancar: 10,
  marul: 3,
  salatalık: 5,
  balkabağı: 7,
  enginar: 5,
  'kapya biber': 5,
  'kırmızı biber': 5,
  'taze fasulye': 4,
  'yeşil fasulye': 4,
  'brüksel lahanası': 5,
  'lahana yaprağı': 5,
  zeytin: 30,

  // Meyveler
  elma: 10,
  muz: 5,
  armut: 7,
  avokado: 3,
  şeftali: 4,
  kayısı: 4,
  erik: 5,
  çilek: 3,
  portakal: 14,
  kivi: 7,
  mango: 5,
  karpuz: 5,
  kavun: 5,
  üzüm: 5,
  hurma: 30,
  incir: 3,
  limon: 21,
  'kuru erik': -1,
  'kuru kayısı': -1,
  'kuru meyve': -1,

  // Protein
  tavuk: 2,
  'tavuk göğsü': 2,
  'tavuk budu': 2,
  et: 2,
  'dana kıyma': 2,
  kuzu: 2,
  'kuzu eti': 2,
  'kuzu kıyma': 2,
  'kuzu kuşbaşı': 2,
  hindi: 2,
  balık: 1,
  somon: 2,
  'somon fileto': 2,
  'beyaz etli balık fileto': 1,
  'mevsim balığı': 1,
  yumurta: 14,
  'yumurta sarısı': 1,
  mercimek: -1,
  'kırmızı mercimek': -1,
  'yeşil mercimek': -1,
  nohut: -1,
  'kuru fasulye': -1,
  barbunya: -1,

  // Tahıllar (kuru gıdalar)
  pirinç: -1,
  'pirinç unu': -1,
  bulgur: -1,
  'ince bulgur': -1,
  yulaf: -1,
  'yulaf ezmesi': -1,
  'yulaf unu': -1,
  makarna: -1,
  'bebek makarnası': -1,
  'fiyonk makarna': -1,
  erişte: -1,
  şehriye: -1,
  un: -1,
  'tam buğday unu': -1,
  'galeta unu': -1,
  irmik: -1,
  ekmek: 3,
  'tam buğday ekmeği': 3,
  tarhana: -1,
  yufka: 3,

  // Süt ürünleri
  yoğurt: 5,
  süt: 5,
  peynir: 7,
  'taze peynir': 5,
  'beyaz peynir': 7,
  'kaşar peyniri': 14,
  'labne peyniri': 7,
  'labne peynir': 7,
  'lor peyniri': 5,
  'dil peyniri': 7,
  'keçi peyniri': 7,
  tereyağı: 30,
  krema: 5,
  kefir: 7,
  lor: 5,
  ayran: 5,
  'anne sütü veya formül': 1,

  // Baharatlar (kuru)
  tarçın: -1,
  kimyon: -1,
  zerdeçal: -1,
  karabiber: -1,
  tuz: -1,
  kekik: -1,
  defne: -1,
  nane: 3,
  dereotu: 3,
  maydanoz: 3,
  fesleğen: 3,

  // Diğer
  zeytinyağı: -1,
  'hindistancevizi yağı': -1,
  tahin: -1,
  pekmez: -1,
  'domates sosu': 7,
  'tavuk suyu': 3,
  'limon suyu': 14,
  'portakal suyu': 5,
  badem: -1,
  ceviz: -1,
  'bebek bisküvisi': -1,
};

/**
 * Ürün adına göre varsayılan tazelik günü döndürür
 * @returns -1 kuru gıda, 0 bilinmiyor, >0 gün sayısı
 */
export function getDefaultFreshnessDays(name: string): number {
  const lower = name.toLowerCase().trim();

  // Tam eşleşme
  if (FRESHNESS_DEFAULTS[lower] !== undefined) {
    return FRESHNESS_DEFAULTS[lower];
  }

  // Kısmi eşleşme
  for (const [key, days] of Object.entries(FRESHNESS_DEFAULTS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return days;
    }
  }

  return 0; // Bilinmiyor
}

/**
 * Kuru gıda mı kontrolü
 */
export function isDryGood(name: string): boolean {
  return getDefaultFreshnessDays(name) === -1;
}
