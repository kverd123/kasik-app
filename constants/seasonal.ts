/**
 * Kaşık — Mevsimsel Ürün Takvimi (Türkiye)
 * Sebze ve meyvelerin aylık mevsimsel durumu + organik bilgisi
 */

export type SeasonalStatus = 'peak' | 'available' | 'limited' | 'unavailable';

export interface SeasonalData {
  name: string;
  emoji: string;
  category: 'sebze' | 'meyve';
  months: Record<number, SeasonalStatus>; // 1-12
  isTypicallyOrganic: boolean;
  organicTip?: string;
}

// Türkiye iklimi için mevsimsel ürün takvimi
export const SEASONAL_PRODUCE: SeasonalData[] = [
  // ===== SEBZELER =====
  {
    name: 'Havuç',
    emoji: '🥕',
    category: 'sebze',
    months: { 1: 'available', 2: 'available', 3: 'available', 4: 'available', 5: 'peak', 6: 'peak', 7: 'peak', 8: 'available', 9: 'available', 10: 'available', 11: 'available', 12: 'available' },
    isTypicallyOrganic: true,
    organicTip: 'Semt pazarlarında organik bulunabilir',
  },
  {
    name: 'Patates',
    emoji: '🥔',
    category: 'sebze',
    months: { 1: 'available', 2: 'available', 3: 'available', 4: 'available', 5: 'available', 6: 'peak', 7: 'peak', 8: 'peak', 9: 'available', 10: 'available', 11: 'available', 12: 'available' },
    isTypicallyOrganic: true,
    organicTip: 'Yıl boyu organik bulunabilir',
  },
  {
    name: 'Tatlı Patates',
    emoji: '🍠',
    category: 'sebze',
    months: { 1: 'available', 2: 'available', 3: 'limited', 4: 'unavailable', 5: 'unavailable', 6: 'unavailable', 7: 'unavailable', 8: 'unavailable', 9: 'peak', 10: 'peak', 11: 'peak', 12: 'available' },
    isTypicallyOrganic: false,
  },
  {
    name: 'Kabak',
    emoji: '🎃',
    category: 'sebze',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'unavailable', 4: 'limited', 5: 'peak', 6: 'peak', 7: 'peak', 8: 'peak', 9: 'available', 10: 'limited', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: true,
    organicTip: 'Yazın pazarlarda bol bulunur',
  },
  {
    name: 'Brokoli',
    emoji: '🥦',
    category: 'sebze',
    months: { 1: 'peak', 2: 'peak', 3: 'peak', 4: 'available', 5: 'limited', 6: 'unavailable', 7: 'unavailable', 8: 'unavailable', 9: 'limited', 10: 'peak', 11: 'peak', 12: 'peak' },
    isTypicallyOrganic: false,
    organicTip: 'Kış aylarında organik marketlerde bulunabilir',
  },
  {
    name: 'Bezelye',
    emoji: '🫛',
    category: 'sebze',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'limited', 4: 'peak', 5: 'peak', 6: 'peak', 7: 'limited', 8: 'unavailable', 9: 'unavailable', 10: 'unavailable', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: true,
    organicTip: 'Bahar aylarında taze ve organik bulunur',
  },
  {
    name: 'Ispanak',
    emoji: '🥬',
    category: 'sebze',
    months: { 1: 'peak', 2: 'peak', 3: 'peak', 4: 'available', 5: 'limited', 6: 'unavailable', 7: 'unavailable', 8: 'unavailable', 9: 'limited', 10: 'peak', 11: 'peak', 12: 'peak' },
    isTypicallyOrganic: true,
    organicTip: 'Kış mevsiminde semt pazarlarında organik bulunabilir',
  },
  {
    name: 'Domates',
    emoji: '🍅',
    category: 'sebze',
    months: { 1: 'limited', 2: 'limited', 3: 'limited', 4: 'limited', 5: 'available', 6: 'peak', 7: 'peak', 8: 'peak', 9: 'peak', 10: 'available', 11: 'limited', 12: 'limited' },
    isTypicallyOrganic: true,
    organicTip: 'Yazın pazarlarda bol ve ucuz',
  },
  {
    name: 'Patlıcan',
    emoji: '🍆',
    category: 'sebze',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'unavailable', 4: 'limited', 5: 'available', 6: 'peak', 7: 'peak', 8: 'peak', 9: 'peak', 10: 'limited', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: true,
    organicTip: 'Yaz aylarında organik pazarlarda bulunur',
  },

  // ===== MEYVELER =====
  {
    name: 'Muz',
    emoji: '🍌',
    category: 'meyve',
    months: { 1: 'available', 2: 'available', 3: 'available', 4: 'available', 5: 'available', 6: 'available', 7: 'available', 8: 'available', 9: 'available', 10: 'available', 11: 'available', 12: 'available' },
    isTypicallyOrganic: false,
    organicTip: 'Genellikle ithal, organik marketlerde aranabilir',
  },
  {
    name: 'Elma',
    emoji: '🍎',
    category: 'meyve',
    months: { 1: 'available', 2: 'available', 3: 'available', 4: 'limited', 5: 'limited', 6: 'unavailable', 7: 'unavailable', 8: 'peak', 9: 'peak', 10: 'peak', 11: 'peak', 12: 'available' },
    isTypicallyOrganic: true,
    organicTip: 'Sonbaharda organik elma çeşitleri çok bulunur',
  },
  {
    name: 'Armut',
    emoji: '🍐',
    category: 'meyve',
    months: { 1: 'available', 2: 'limited', 3: 'unavailable', 4: 'unavailable', 5: 'unavailable', 6: 'unavailable', 7: 'limited', 8: 'peak', 9: 'peak', 10: 'peak', 11: 'available', 12: 'available' },
    isTypicallyOrganic: true,
    organicTip: 'Sonbaharda taze ve organik bulunur',
  },
  {
    name: 'Avokado',
    emoji: '🥑',
    category: 'meyve',
    months: { 1: 'available', 2: 'available', 3: 'available', 4: 'available', 5: 'limited', 6: 'limited', 7: 'limited', 8: 'limited', 9: 'available', 10: 'available', 11: 'peak', 12: 'peak' },
    isTypicallyOrganic: false,
    organicTip: 'Genellikle ithal, Antalya bölgesinde yerli üretim başladı',
  },
  {
    name: 'Şeftali',
    emoji: '🍑',
    category: 'meyve',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'unavailable', 4: 'unavailable', 5: 'limited', 6: 'peak', 7: 'peak', 8: 'peak', 9: 'available', 10: 'unavailable', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: true,
    organicTip: 'Yazın pazarlarda taze ve organik bulunur',
  },
  {
    name: 'Çilek',
    emoji: '🍓',
    category: 'meyve',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'limited', 4: 'peak', 5: 'peak', 6: 'peak', 7: 'limited', 8: 'unavailable', 9: 'unavailable', 10: 'unavailable', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: false,
    organicTip: 'Bahar aylarında organik çilek aranabilir, ilaç kalıntısına dikkat',
  },
  {
    name: 'Portakal',
    emoji: '🍊',
    category: 'meyve',
    months: { 1: 'peak', 2: 'peak', 3: 'peak', 4: 'available', 5: 'limited', 6: 'unavailable', 7: 'unavailable', 8: 'unavailable', 9: 'unavailable', 10: 'limited', 11: 'peak', 12: 'peak' },
    isTypicallyOrganic: true,
    organicTip: 'Kış aylarında bol ve ucuz, Çukurova bölgesi organik üretim',
  },
  {
    name: 'Kivi',
    emoji: '🥝',
    category: 'meyve',
    months: { 1: 'peak', 2: 'peak', 3: 'available', 4: 'limited', 5: 'unavailable', 6: 'unavailable', 7: 'unavailable', 8: 'unavailable', 9: 'unavailable', 10: 'limited', 11: 'peak', 12: 'peak' },
    isTypicallyOrganic: false,
    organicTip: 'Karadeniz bölgesinde yerli üretim var',
  },
  {
    name: 'Kayısı',
    emoji: '🍑',
    category: 'meyve',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'unavailable', 4: 'unavailable', 5: 'limited', 6: 'peak', 7: 'peak', 8: 'limited', 9: 'unavailable', 10: 'unavailable', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: true,
    organicTip: 'Malatya kayısısı organik ve doğal kurutulmuş olarak bulunur',
  },
  {
    name: 'Erik',
    emoji: '🫐',
    category: 'meyve',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'unavailable', 4: 'unavailable', 5: 'limited', 6: 'peak', 7: 'peak', 8: 'peak', 9: 'limited', 10: 'unavailable', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: true,
  },
  {
    name: 'Mango',
    emoji: '🥭',
    category: 'meyve',
    months: { 1: 'limited', 2: 'limited', 3: 'available', 4: 'available', 5: 'peak', 6: 'peak', 7: 'available', 8: 'limited', 9: 'limited', 10: 'limited', 11: 'limited', 12: 'limited' },
    isTypicallyOrganic: false,
    organicTip: 'İthal ürün, organik versiyonu nadir',
  },
  {
    name: 'Karpuz',
    emoji: '🍉',
    category: 'meyve',
    months: { 1: 'unavailable', 2: 'unavailable', 3: 'unavailable', 4: 'unavailable', 5: 'limited', 6: 'peak', 7: 'peak', 8: 'peak', 9: 'limited', 10: 'unavailable', 11: 'unavailable', 12: 'unavailable' },
    isTypicallyOrganic: true,
    organicTip: 'Yazın her yerde taze ve doğal bulunur',
  },
];

// ===== HELPER FONKSİYONLAR =====

/**
 * Ürünün belirtilen aydaki mevsimsel durumunu döndürür.
 * İsim eşleştirmesi case-insensitive ve partial match destekler.
 */
export function getSeasonalStatus(name: string, month?: number): SeasonalStatus | null {
  const currentMonth = month ?? (new Date().getMonth() + 1);
  const lower = name.toLowerCase().trim();

  const match = SEASONAL_PRODUCE.find((p) => {
    const pLower = p.name.toLowerCase();
    return pLower === lower || pLower.includes(lower) || lower.includes(pLower);
  });

  if (!match) return null;
  return match.months[currentMonth] || null;
}

/**
 * O ay peak veya available olan tüm ürünleri döndürür.
 */
export function getSeasonalProduce(month?: number): SeasonalData[] {
  const currentMonth = month ?? (new Date().getMonth() + 1);
  return SEASONAL_PRODUCE.filter((p) => {
    const status = p.months[currentMonth];
    return status === 'peak' || status === 'available';
  });
}

/**
 * Ürünün mevsiminde olup olmadığını kontrol eder (peak veya available).
 */
export function isInSeason(name: string, month?: number): boolean {
  const status = getSeasonalStatus(name, month);
  return status === 'peak' || status === 'available';
}

/**
 * Mevsiminde olmayan ürüne aynı kategoriden mevsiminde olan alternatifler.
 */
export function getSeasonalAlternatives(name: string, month?: number): SeasonalData[] {
  const currentMonth = month ?? (new Date().getMonth() + 1);
  const lower = name.toLowerCase().trim();

  const match = SEASONAL_PRODUCE.find((p) => {
    const pLower = p.name.toLowerCase();
    return pLower === lower || pLower.includes(lower) || lower.includes(pLower);
  });

  if (!match) return [];

  // Aynı kategoriden, mevsiminde olan ve kendisi olmayan ürünler
  return SEASONAL_PRODUCE.filter((p) => {
    if (p.name === match.name) return false;
    if (p.category !== match.category) return false;
    const status = p.months[currentMonth];
    return status === 'peak' || status === 'available';
  });
}

/**
 * Ürünün organik bilgisini döndürür.
 */
export function getOrganicInfo(name: string): { isOrganic: boolean; tip?: string } | null {
  const lower = name.toLowerCase().trim();

  const match = SEASONAL_PRODUCE.find((p) => {
    const pLower = p.name.toLowerCase();
    return pLower === lower || pLower.includes(lower) || lower.includes(pLower);
  });

  if (!match) return null;
  return {
    isOrganic: match.isTypicallyOrganic,
    tip: match.organicTip,
  };
}

/**
 * Ay adını Türkçe olarak döndürür.
 */
export const MONTH_NAMES_TR: Record<number, string> = {
  1: 'Ocak', 2: 'Şubat', 3: 'Mart', 4: 'Nisan',
  5: 'Mayıs', 6: 'Haziran', 7: 'Temmuz', 8: 'Ağustos',
  9: 'Eylül', 10: 'Ekim', 11: 'Kasım', 12: 'Aralık',
};

/**
 * Mevsimsel durumun Türkçe etiketini ve rengini döndürür.
 */
export function getSeasonalLabel(status: SeasonalStatus): { text: string; color: string; bgColor: string } {
  switch (status) {
    case 'peak':
      return { text: 'Mevsiminde', color: '#2E7D32', bgColor: '#E8F5E9' };
    case 'available':
      return { text: 'Bulunur', color: '#558B2F', bgColor: '#F1F8E9' };
    case 'limited':
      return { text: 'Mevsim sonu', color: '#E65100', bgColor: '#FFF3E0' };
    case 'unavailable':
      return { text: 'Mevsim dışı', color: '#C62828', bgColor: '#FFEBEE' };
  }
}
