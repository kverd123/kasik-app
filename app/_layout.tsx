/**
 * Kaşık — Root Layout
 * Navigation structure, push notifications
 */

import React, { useEffect, useRef } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, useColorScheme } from 'react-native';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useColors } from '../hooks/useColors';
import {
  registerForPushNotifications,
  addNotificationResponseListener,
  addNotificationReceivedListener,
  getNotificationRoute,
  clearBadge,
} from '../lib/notifications';
import { initAnalytics, setAnalyticsUser, clearAnalyticsUser } from '../lib/analytics';
import { initInterstitialAds } from '../lib/ads';
import { initializeSync } from '../lib/firestoreSync';
import { flushQueue, onQueueChange } from '../lib/syncQueue';
import { onNetworkChange } from '../lib/networkMonitor';
import { useSyncStore } from '../stores/syncStore';
import { savePushToken } from '../lib/firestore';
import { useRecipeBookStore } from '../stores/recipeBookStore';
import { usePantryStore } from '../stores/pantryStore';
import { useMealPlanStore } from '../stores/mealPlanStore';
import { useCommunityStore } from '../stores/communityStore';
import { useBabyStore } from '../stores/babyStore';
import { useAllergenIntroStore } from '../stores/allergenIntroStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export default function RootLayout() {
  const { initialize, user } = useAuthStore();
  const { loadFromStorage: loadTheme, _updateIsDark, isDark } = useThemeStore();
  const colors = useColors();
  const systemColorScheme = useColorScheme();
  const { loadFromStorage: loadRecipeBook } = useRecipeBookStore();
  const { loadFromStorage: loadPantry } = usePantryStore();
  const { loadFromStorage: loadMealPlan } = useMealPlanStore();
  const { loadFromStorage: loadCommunity } = useCommunityStore();
  const { loadFromStorage: loadBaby, baby } = useBabyStore();
  const { loadFromStorage: loadAllergenIntro } = useAllergenIntroStore();
  const { loadFromStorage: loadNotificationPrefs, initializeNotifications } = useNotificationStore();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const notificationsInitialized = useRef(false);

  useEffect(() => {
    const unsubscribe = initialize();
    initAnalytics(); // Analytics sistemini başlat
    initializeSync(); // Offline sync sistemini başlat

    // Reklam sistemini başlat (ATT kullanılmıyor — daima kişiselleştirilmemiş reklam)
    initInterstitialAds();

    // Sync status UI güncellemeleri
    const unsubQueue = onQueueChange((count) => {
      const { setStatus, setPendingCount } = useSyncStore.getState();
      setPendingCount(count);
      setStatus(count > 0 ? 'pending' : 'synced');
    });
    const unsubNetwork = onNetworkChange((online) => {
      const { setStatus, pendingCount } = useSyncStore.getState();
      if (!online) {
        setStatus('offline');
      } else {
        setStatus(pendingCount > 0 ? 'pending' : 'synced');
      }
    });
    loadRecipeBook(); // Tarif defterini yükle
    loadPantry(); // Dolap verilerini yükle
    loadMealPlan(); // Yemek planını yükle
    loadCommunity(); // Topluluk verilerini yükle
    loadBaby(); // Bebek profilini yükle
    loadAllergenIntro(); // Alerjen programlarını yükle
    loadNotificationPrefs(); // Bildirim tercihlerini yükle
    loadTheme(); // Tema tercihini yükle
    return () => {
      unsubscribe();
      unsubQueue();
      unsubNetwork();
    };
  }, []);

  // Sistem tema değişikliğini izle
  useEffect(() => {
    _updateIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Analytics user tracking + RevenueCat
  useEffect(() => {
    if (user?.uid) {
      setAnalyticsUser(user.uid);
      useSubscriptionStore.getState().initRevenueCat(user.uid);
    } else {
      clearAnalyticsUser();
    }
  }, [user?.uid]);

  // Auth-gated Firestore sync — login sonrası tüm store'ları sync et
  // Sıralama önemli: auth -> baby -> allergen programs -> meal plans
  useEffect(() => {
    if (!user?.uid) return;
    const uid = user.uid;

    (async () => {
      try {
        // 1. Baby profili ve bağımsız store'lar paralel yüklensin
        await Promise.allSettled([
          useBabyStore.getState().syncFromFirestore(uid),
          usePantryStore.getState().syncFromFirestore(uid),
          useRecipeBookStore.getState().syncFromFirestore(uid),
          useCommunityStore.getState().loadPosts(),
        ]);

        // 2. Alerjen programları — baby profiline bağlı
        await useAllergenIntroStore.getState().syncFromFirestore(uid);

        // 3. Yemek planı — alerjen programlarına bağlı
        await useMealPlanStore.getState().syncFromFirestore(uid);

        // 4. Sync sonrası kuyrukdaki bekleyen yazımları gönder
        await flushQueue();
      } catch (e) {
        console.error('Firestore sync hatası:', e);
      }
    })();
  }, [user?.uid]);

  // Bebek profili yüklendikten sonra zamanlanmış bildirimleri başlat
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!baby?.name || notificationsInitialized.current) return;

    notificationsInitialized.current = true;
    initializeNotifications(baby.name);
  }, [baby?.name]);

  // Push bildirim kurulumu (sadece native'de)
  useEffect(() => {
    if (Platform.OS === 'web') return; // Web'de push yok

    registerForPushNotifications().then((token) => {
      if (token && user?.uid) {
        const platform = Platform.OS === 'ios' ? 'ios' : 'android';
        savePushToken(user.uid, token, platform).catch(console.error);
      }
    });

    notificationListener.current = addNotificationReceivedListener((notification) => {
      console.log('Bildirim geldi:', notification.request.content.title);
    });

    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      const route = getNotificationRoute(data as Record<string, any>);
      if (route) {
        router.push(route.path as any);
      }
    });

    clearBadge();

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, [user]);

  return (
    <ErrorBoundary>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="recipe/[id]"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{ presentation: 'card' }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
