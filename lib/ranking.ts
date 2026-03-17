/**
 * Kasik — Trending / Hot Ranking Algorithm
 *
 * Reddit/HackerNews benzeri "hot score" algoritması.
 * Eski ama populer icerikler surekli ustte kalmasin diye
 * zaman gecildikce skor duser (time decay).
 *
 * Formul:
 *   score = (likes * LIKE_WEIGHT + views * VIEW_WEIGHT + comments * COMMENT_WEIGHT)
 *           / (saatFarki + GRAVITY_OFFSET) ^ GRAVITY
 *
 * - GRAVITY ne kadar buyukse, eski icerik o kadar hizli duser
 * - GRAVITY_OFFSET ilk saatlerdeki skoru dengeler (sifira bolmeyi onler)
 * - Agirliklar: like > comment > view (kalite sinyali)
 */

// ===== YAPILANDIRMA =====

const RANKING_CONFIG = {
  // Etkilesim agirliklari
  LIKE_WEIGHT: 3,      // Begeni en guclu sinyal
  VIEW_WEIGHT: 0.5,    // Goruntuleme daha zayif
  COMMENT_WEIGHT: 2,   // Yorum begeni kadar degerli
  SAVE_WEIGHT: 4,      // Kaydetme en guclu (kullanici gercekten faydali buldu)
  RATING_WEIGHT: 5,    // Puan yuksekse bonus

  // Zaman azalma parametreleri
  GRAVITY: 1.5,         // Ne kadar hizli dusecek (1.0=yavas, 2.0=cok hizli)
  GRAVITY_OFFSET: 2,    // Ilk 2 saatte skor dengeli kalir

  // Bonus carpanlar
  VERIFIED_BONUS: 1.3,  // Dogrulanmis yazar %30 bonus
  AI_RECIPE_BONUS: 1.1, // AI tarif %10 bonus (yenilik)
  PANTRY_MATCH_BONUS: 1.5, // Dolaptaki malzemeyle eslesen tarif %50 bonus
};

// ===== ANA SIRALAMA FONKSIYONU =====

export interface RankableItem {
  likes: number;
  views?: number;
  comments?: number;
  saves?: number;
  rating?: number;         // 0-5 arasi puan
  createdAt: Date | string; // Olusturulma zamani
  isVerified?: boolean;     // Dogrulanmis yazar mi
  isAIGenerated?: boolean;  // AI tarif mi
  pantryMatch?: number;     // Dolaptaki malzeme esleme sayisi (0-N)
}

/**
 * Hot score hesapla — yuksek skor = daha ustte gosterilir
 */
export function calculateHotScore(item: RankableItem): number {
  const {
    LIKE_WEIGHT,
    VIEW_WEIGHT,
    COMMENT_WEIGHT,
    SAVE_WEIGHT,
    RATING_WEIGHT,
    GRAVITY,
    GRAVITY_OFFSET,
    VERIFIED_BONUS,
    AI_RECIPE_BONUS,
    PANTRY_MATCH_BONUS,
  } = RANKING_CONFIG;

  // 1. Ham etkilesim skoru
  const engagementScore =
    (item.likes * LIKE_WEIGHT) +
    ((item.views ?? 0) * VIEW_WEIGHT) +
    ((item.comments ?? 0) * COMMENT_WEIGHT) +
    ((item.saves ?? 0) * SAVE_WEIGHT) +
    ((item.rating ?? 0) * RATING_WEIGHT);

  // 2. Zaman farki (saat cinsinden)
  const createdDate = typeof item.createdAt === 'string'
    ? new Date(item.createdAt)
    : item.createdAt;
  const hoursDiff = Math.max(0, (Date.now() - createdDate.getTime()) / (1000 * 60 * 60));

  // 3. Zaman azalma: eski icerik = dusuk skor
  const timeDecay = Math.pow(hoursDiff + GRAVITY_OFFSET, GRAVITY);

  // 4. Temel skor
  let score = engagementScore / timeDecay;

  // 5. Bonus carpanlar
  if (item.isVerified) score *= VERIFIED_BONUS;
  if (item.isAIGenerated) score *= AI_RECIPE_BONUS;
  if (item.pantryMatch && item.pantryMatch > 0) {
    score *= (1 + (PANTRY_MATCH_BONUS - 1) * Math.min(item.pantryMatch / 3, 1));
  }

  return score;
}

/**
 * Listeyi hot score'a gore sirala (yuksekten dusuge)
 */
export function sortByHotScore<T extends RankableItem>(items: T[]): T[] {
  return [...items].sort((a, b) => calculateHotScore(b) - calculateHotScore(a));
}

// ===== TARIFLER ICIN YARDIMCI =====

export interface RecipeRankData {
  id: string;
  likes: number;
  views: number;
  rating: number;
  ratingCount: number;
  comments: number;
  saves: number;
  createdAt: Date;
  isVerified: boolean;
  isAIGenerated: boolean;
  pantryMatchCount: number;
}

/**
 * Tarif listesini trend sirasina gore sirala
 */
export function rankRecipes(recipes: RecipeRankData[]): RecipeRankData[] {
  return sortByHotScore(
    recipes.map((r) => ({
      ...r,
      views: r.views,
      comments: r.comments,
      saves: r.saves,
      rating: r.rating,
      isVerified: r.isVerified,
      isAIGenerated: r.isAIGenerated,
      pantryMatch: r.pantryMatchCount,
    }))
  );
}

// ===== TOPLULUK POSTLARI ICIN YARDIMCI =====

export interface PostRankData {
  id: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: Date;
  isVerified: boolean;
}

/**
 * Topluluk postlarini trend sirasina gore sirala
 */
export function rankPosts(posts: PostRankData[]): PostRankData[] {
  return sortByHotScore(
    posts.map((p) => ({
      ...p,
      views: p.views,
      comments: p.comments,
      isVerified: p.isVerified,
    }))
  );
}

// ===== SIRALAMA MODLARI =====

export type SortMode = 'trending' | 'newest' | 'most_liked' | 'top_rated';

/**
 * Tarif siralama — mod secenekli
 */
export function sortRecipes<T extends { likes: number; rating?: number; createdAt: Date | string } & RankableItem>(
  items: T[],
  mode: SortMode
): T[] {
  switch (mode) {
    case 'trending':
      return sortByHotScore(items);

    case 'newest':
      return [...items].sort((a, b) => {
        const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
        const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
        return dateB.getTime() - dateA.getTime();
      });

    case 'most_liked':
      return [...items].sort((a, b) => b.likes - a.likes);

    case 'top_rated':
      return [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    default:
      return sortByHotScore(items);
  }
}
