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

  // Protein
  tavuk: 2,
  'tavuk göğsü': 2,
  et: 2,
  'dana kıyma': 2,
  kuzu: 2,
  hindi: 2,
  balık: 1,
  somon: 2,
  yumurta: 14,
  'yumurta sarısı': 1,
  mercimek: -1,
  'kırmızı mercimek': -1,
  'yeşil mercimek': -1,
  nohut: -1,

  // Tahıllar (kuru gıdalar)
  pirinç: -1,
  bulgur: -1,
  yulaf: -1,
  makarna: -1,
  un: -1,
  irmik: -1,
  ekmek: 3,
  'pirinç unu': -1,
  'tam buğday unu': -1,

  // Süt ürünleri
  yoğurt: 5,
  süt: 5,
  peynir: 7,
  'taze peynir': 5,
  'labne peynir': 7,
  tereyağı: 30,
  krema: 5,
  kefir: 7,
  lor: 5,

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
