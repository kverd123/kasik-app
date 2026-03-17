/**
 * Kaşık — Subscription Store (Zustand)
 * Manages premium subscription state
 *
 * Phase 1: Premium = reklam kaldırma (sadece)
 * Phase 2: Premium = reklam kaldırma + kilitli premium bölümler
 *
 * Uses RevenueCat for IAP management
 * Setup: https://docs.revenuecat.com/docs/getting-started
 */

import { create } from 'zustand';
import { SubscriptionInfo, SubscriptionPlan } from '../types';
import { updateUserPremium } from '../lib/firestore';

/**
 * Premium Feature Registry
 * ========================
 * Feature flags for gated content.
 * Phase 1: Only 'ad_free' is active.
 * Phase 2+: Enable additional features by setting them to true.
 *
 * To gate a new feature:
 * 1. Add the feature key here
 * 2. Use `canAccess('feature_key')` in the component
 * 3. Wrap with <PremiumGate feature="feature_key"> if needed
 */
export type PremiumFeature =
  | 'ad_free'                // Phase 1 ✅ — Tüm reklamları kaldır
  | 'unlimited_ai_recipes'   // Phase 2 — Sınırsız AI tarif (ücretsiz: günde 3)
  | 'advanced_growth_chart'  // Phase 2 — Gelişmiş büyüme grafiği ve raporlama
  | 'weekly_monthly_plans'   // Phase 2 — Haftalık/aylık plan şablonları
  | 'featured_posts'         // Phase 2 — Toplulukta öne çıkan paylaşım
  | 'export_pdf'             // Phase 2 — PDF olarak plan/rapor dışa aktarma
  | 'multi_baby'             // Phase 2 — Birden fazla bebek profili
  | 'priority_support';      // Phase 2 — Öncelikli destek

/**
 * Feature configuration
 * active: true = this feature is gated behind premium
 * active: false = this feature is free for everyone (not yet gated)
 */
interface FeatureConfig {
  active: boolean;       // Is this feature currently gated?
  label: string;         // Turkish display name
  description: string;   // Turkish description for premium page
  icon: string;          // Emoji icon
}

const PREMIUM_FEATURES: Record<PremiumFeature, FeatureConfig> = {
  ad_free: {
    active: true,  // ← Phase 1: ACTIVE
    label: 'Reklamsız Deneyim',
    description: 'Tüm reklamları kaldırarak kesintisiz kullanım',
    icon: '🚫',
  },
  unlimited_ai_recipes: {
    active: false, // ← Phase 2: NOT YET ACTIVE
    label: 'Sınırsız AI Tarif',
    description: 'Yapay zeka ile sınırsız tarif önerisi alın',
    icon: '🤖',
  },
  advanced_growth_chart: {
    active: false,
    label: 'Gelişmiş Büyüme Grafiği',
    description: 'Detaylı boy/kilo takibi ve WHO karşılaştırması',
    icon: '📊',
  },
  weekly_monthly_plans: {
    active: false,
    label: 'Plan Şablonları',
    description: 'Hazır haftalık ve aylık beslenme planları',
    icon: '📋',
  },
  featured_posts: {
    active: false,
    label: 'Öne Çıkan Paylaşım',
    description: 'Toplulukta paylaşımlarınız öne çıksın',
    icon: '⭐',
  },
  export_pdf: {
    active: false,
    label: 'PDF Dışa Aktarma',
    description: 'Beslenme planlarını ve raporları PDF olarak indirin',
    icon: '📄',
  },
  multi_baby: {
    active: false,
    label: 'Çoklu Bebek Profili',
    description: 'İkiz veya kardeşler için ayrı profiller oluşturun',
    icon: '👶👶',
  },
  priority_support: {
    active: false,
    label: 'Öncelikli Destek',
    description: 'Sorularınız öncelikli olarak yanıtlansın',
    icon: '💬',
  },
};

interface SubscriptionState {
  // State
  subscription: SubscriptionInfo;
  isLoading: boolean;
  availablePlans: PlanOption[];

  // Actions
  checkSubscription: (userId: string) => Promise<void>;
  purchase: (userId: string, plan: SubscriptionPlan) => Promise<void>;
  restore: (userId: string) => Promise<void>;

  // Feature gating
  canAccess: (feature: PremiumFeature) => boolean;
  getActiveFeatures: () => FeatureConfig[];
  getAllFeatures: () => Record<PremiumFeature, FeatureConfig>;
  isFeatureGated: (feature: PremiumFeature) => boolean;
}

interface PlanOption {
  id: SubscriptionPlan;
  label: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: {
    isPremium: false,
  },
  isLoading: false,
  availablePlans: [
    {
      id: 'monthly',
      label: 'Aylık',
      price: '₺79.99',
      period: '/ay',
    },
    {
      id: 'yearly',
      label: 'Yıllık',
      price: '₺549.99',
      period: '/yıl',
      savings: '%43 tasarruf',
      popular: true,
    },
    {
      id: 'lifetime',
      label: 'Ömür Boyu',
      price: '₺999.99',
      period: 'tek seferlik',
      savings: 'En avantajlı',
    },
  ],

  /**
   * Check if user can access a premium feature.
   *
   * Returns true if:
   * - The feature is NOT currently gated (active: false) → free for everyone
   * - OR the user has a premium subscription
   */
  canAccess: (feature: PremiumFeature): boolean => {
    const config = PREMIUM_FEATURES[feature];
    // If feature is not gated yet, everyone can access it
    if (!config.active) return true;
    // If feature is gated, only premium users can access
    return get().subscription.isPremium;
  },

  /**
   * Check if a feature is currently behind the premium wall
   */
  isFeatureGated: (feature: PremiumFeature): boolean => {
    return PREMIUM_FEATURES[feature].active;
  },

  /**
   * Get list of features that are currently gated (active premium features)
   * Used for the premium upgrade page to show what users get
   */
  getActiveFeatures: (): FeatureConfig[] => {
    return Object.values(PREMIUM_FEATURES).filter((f) => f.active);
  },

  /**
   * Get all features (for admin/settings display)
   */
  getAllFeatures: (): Record<PremiumFeature, FeatureConfig> => {
    return PREMIUM_FEATURES;
  },

  checkSubscription: async (userId: string) => {
    try {
      set({ isLoading: true });
      // TODO: RevenueCat integration
      // const customerInfo = await Purchases.getCustomerInfo();
      // const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
      // set({ subscription: { isPremium }, isLoading: false });

      // For now, check Firestore
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  purchase: async (userId: string, plan: SubscriptionPlan) => {
    try {
      set({ isLoading: true });
      // TODO: RevenueCat purchase flow
      // const { customerInfo } = await Purchases.purchasePackage(package);
      // if (customerInfo.entitlements.active['premium']) {
      //   await updateUserPremium(userId, true, Platform.OS);
      //   set({ subscription: { isPremium: true, plan }, isLoading: false });
      // }

      // Placeholder: direct Firestore update
      await updateUserPremium(userId, true);
      set({
        subscription: { isPremium: true, plan },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  restore: async (userId: string) => {
    try {
      set({ isLoading: true });
      // TODO: RevenueCat restore
      // const customerInfo = await Purchases.restorePurchases();
      // const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
      // if (isPremium) await updateUserPremium(userId, true);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
