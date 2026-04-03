/**
 * Kaşık — Subscription Store (Zustand)
 * Manages premium subscription state via RevenueCat
 *
 * Premium = Reklamsız + Sınırsız AI Tarif
 * Plan: 19.99 TL/ay otomatik yenilenen abonelik
 */

import { create } from 'zustand';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { SubscriptionInfo, SubscriptionPlan } from '../types';
import { updateUserPremium } from '../lib/firestore';

const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || '';
const ENTITLEMENT_ID = 'premium';
// App Store Connect ürün ID'si — RevenueCat'te bu ID ile eşleşmeli
const PRODUCT_ID = 'kasik_premium_monthly_v2';

/**
 * Premium Feature Registry
 */
export type PremiumFeature =
  | 'ad_free'
  | 'unlimited_ai_recipes'
  | 'advanced_growth_chart'
  | 'weekly_monthly_plans'
  | 'featured_posts'
  | 'export_pdf'
  | 'multi_baby'
  | 'priority_support';

interface FeatureConfig {
  active: boolean;
  label: string;
  description: string;
  icon: string;
}

const PREMIUM_FEATURES: Record<PremiumFeature, FeatureConfig> = {
  ad_free: {
    active: true,
    label: 'Reklamsız Deneyim',
    description: 'Tüm reklamları kaldırarak kesintisiz kullanım',
    icon: '🚫',
  },
  unlimited_ai_recipes: {
    active: true,
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

interface PlanOption {
  id: SubscriptionPlan;
  label: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
  rcPackage?: PurchasesPackage;
}

interface SubscriptionState {
  subscription: SubscriptionInfo;
  isLoading: boolean;
  isInitialized: boolean;
  availablePlans: PlanOption[];

  // Actions
  initRevenueCat: (userId: string) => Promise<void>;
  checkSubscription: (userId: string) => Promise<void>;
  purchase: (userId: string, plan: SubscriptionPlan) => Promise<void>;
  restore: (userId: string) => Promise<void>;
  loadOfferings: () => Promise<void>;

  // Feature gating
  canAccess: (feature: PremiumFeature) => boolean;
  getActiveFeatures: () => FeatureConfig[];
  getAllFeatures: () => Record<PremiumFeature, FeatureConfig>;
  isFeatureGated: (feature: PremiumFeature) => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: {
    isPremium: false,
  },
  isLoading: false,
  isInitialized: false,
  availablePlans: [
    {
      id: 'monthly',
      label: 'Aylık Premium',
      price: '₺19,99',
      period: '/ay',
      popular: true,
    },
  ],

  /**
   * Initialize RevenueCat SDK
   */
  initRevenueCat: async (userId: string) => {
    if (get().isInitialized) return;
    try {
      if (!REVENUECAT_API_KEY) {
        console.warn('[RevenueCat] API key eksik — abonelik sistemi devre dışı');
        set({ isInitialized: true });
        return;
      }

      Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserID: userId,
      });

      // Listen for customer info changes
      Purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
        const isPremium = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
        set({ subscription: { isPremium, plan: isPremium ? 'monthly' : undefined } });
        // Firestore'u güncelle
        if (isPremium) {
          updateUserPremium(userId, true).catch(console.error);
        }
      });

      set({ isInitialized: true });

      // Check current status
      await get().checkSubscription(userId);
      await get().loadOfferings();
    } catch (error) {
      console.warn('[RevenueCat] init error:', error);
      set({ isInitialized: true });
    }
  },

  /**
   * Check current subscription status
   */
  checkSubscription: async (userId: string) => {
    try {
      set({ isLoading: true });
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (isPremium) {
        await updateUserPremium(userId, true);
      }

      set({
        subscription: { isPremium, plan: isPremium ? 'monthly' : undefined },
        isLoading: false,
      });
    } catch (error) {
      console.log('Check subscription error:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Load available packages from RevenueCat
   */
  loadOfferings: async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current?.availablePackages) {
        const plans: PlanOption[] = offerings.current.availablePackages
          .filter((pkg) => pkg.product.identifier === PRODUCT_ID || offerings.current!.availablePackages.length === 1)
          .map((pkg) => ({
            id: 'monthly' as SubscriptionPlan,
            label: 'Aylık Premium',
            price: pkg.product.priceString,
            period: '/ay',
            popular: true,
            rcPackage: pkg,
          }));
        if (plans.length > 0) {
          set({ availablePlans: plans });
        } else {
          console.warn(`[RevenueCat] Ürün ${PRODUCT_ID} offering'lerde bulunamadı`);
        }
      }
    } catch (error) {
      console.warn('[RevenueCat] Load offerings error:', error);
    }
  },

  /**
   * Purchase premium subscription
   */
  purchase: async (userId: string, plan: SubscriptionPlan) => {
    try {
      set({ isLoading: true });

      const { availablePlans } = get();
      const selectedPlan = availablePlans.find((p) => p.id === plan);

      let pkg = selectedPlan?.rcPackage;

      // Fallback: paket yoksa offering'lerden bul
      if (!pkg) {
        const offerings = await Purchases.getOfferings();
        // Önce PRODUCT_ID ile eşleşen paketi bul
        pkg = offerings.current?.availablePackages.find(
          (p) => p.product.identifier === PRODUCT_ID
        ) || offerings.current?.availablePackages[0];
      }

      if (!pkg) {
        set({ isLoading: false });
        throw new Error('Abonelik paketi bulunamadı. Lütfen daha sonra tekrar deneyin.');
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (isPremium) {
        await updateUserPremium(userId, true);
        set({
          subscription: { isPremium: true, plan },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
        throw new Error('Satın alma tamamlandı ancak abonelik etkinleştirilemedi. Lütfen "Satın Alımları Geri Yükle" seçeneğini deneyin.');
      }
    } catch (error: any) {
      set({ isLoading: false });
      if (error.userCancelled) {
        // Kullanıcı iptal etti — hata fırlatma
        return;
      }
      // Kullanıcı dostu Türkçe hata mesajları
      if (error.code === 'STORE_PROBLEM' || error.code === '2') {
        throw new Error('App Store ile bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.');
      }
      if (error.code === 'PURCHASE_NOT_ALLOWED' || error.code === '1') {
        throw new Error('Bu cihazda satın alma işlemi yapılamıyor. Lütfen cihaz ayarlarınızı kontrol edin.');
      }
      if (error.code === 'PRODUCT_NOT_AVAILABLE' || error.code === '7') {
        throw new Error('Abonelik şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
      }
      if (error.message && !error.message.includes('Error')) {
        throw error;
      }
      throw new Error('Satın alma sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  },

  /**
   * Restore previous purchases
   */
  restore: async (userId: string) => {
    try {
      set({ isLoading: true });
      const customerInfo = await Purchases.restorePurchases();
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (isPremium) {
        await updateUserPremium(userId, true);
      }

      set({
        subscription: { isPremium, plan: isPremium ? 'monthly' : undefined },
        isLoading: false,
      });

      return;
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error('Satın alımlar geri yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
    }
  },

  canAccess: (feature: PremiumFeature): boolean => {
    const config = PREMIUM_FEATURES[feature];
    if (!config.active) return true;
    return get().subscription.isPremium;
  },

  isFeatureGated: (feature: PremiumFeature): boolean => {
    return PREMIUM_FEATURES[feature].active;
  },

  getActiveFeatures: (): FeatureConfig[] => {
    return Object.values(PREMIUM_FEATURES).filter((f) => f.active);
  },

  getAllFeatures: (): Record<PremiumFeature, FeatureConfig> => {
    return PREMIUM_FEATURES;
  },
}));
