/**
 * Kaşık — Push Bildirim Servisi
 * Expo Notifications + Firebase Cloud Messaging (FCM)
 *
 * Bildirim türleri:
 * 1. Öğün hatırlatmaları (kahvaltı, öğle, ara, akşam)
 * 2. Alerjen takibi (yeni besin deneme sonrası 3 gün hatırlatma)
 * 3. Haftalık ilerleme özeti
 * 4. Topluluk etkileşimleri (beğeni, yorum)
 * 5. AI tarif önerileri
 * 6. Premium promosyon
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== YAPILANDIRMA =====

// Bildirim davranışı — uygulama açıkken bile göster
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ===== BİLDİRİM TÜRLERİ =====

export type NotificationType =
  | 'meal_reminder'        // Öğün hatırlatma
  | 'allergen_check'       // Alerjen takip
  | 'weekly_summary'       // Haftalık özet
  | 'community_like'       // Beğeni bildirimi
  | 'community_comment'    // Yorum bildirimi
  | 'ai_suggestion'        // AI tarif önerisi
  | 'premium_promo'        // Premium promosyon
  | 'growth_milestone'     // Büyüme dönüm noktası
  | 'new_recipe';          // Yeni tarif eklendi

export interface NotificationPreferences {
  mealReminders: boolean;
  allergenTracking: boolean;
  weeklySummary: boolean;
  communityUpdates: boolean;
  aiSuggestions: boolean;
  promotions: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  mealReminders: true,
  allergenTracking: true,
  weeklySummary: true,
  communityUpdates: true,
  aiSuggestions: true,
  promotions: false,
};

const STORAGE_KEYS = {
  PUSH_TOKEN: 'kasik_push_token',
  PREFERENCES: 'kasik_notification_prefs',
  SCHEDULED_IDS: 'kasik_scheduled_notifications',
};

// ===== TOKEN YÖNETİMİ =====

/**
 * Push notification token al
 * Fiziksel cihaz gerektirir (simülatörde çalışmaz)
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Fiziksel cihaz kontrolü
  if (!Device.isDevice) {
    console.log('Push bildirimleri fiziksel cihaz gerektirir.');
    return null;
  }

  // Mevcut izin durumunu kontrol et
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // İzin iste
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Bildirim izni verilmedi.');
    return null;
  }

  // Android kanal ayarla
  if (Platform.OS === 'android') {
    await setupAndroidChannels();
  }

  // Token al
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });

    const token = tokenData.data;

    // Token'ı kaydet
    await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);

    // Push token log kaldirildi (guvenlik)
    return token;
  } catch (error) {
    console.error('Push token alınamadı:', error);
    return null;
  }
}

/**
 * Kayıtlı push token'ı getir
 */
export async function getStoredPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.PUSH_TOKEN);
  } catch {
    return null;
  }
}

// ===== ANDROID KANALLAR =====

async function setupAndroidChannels() {
  // Öğün hatırlatmaları
  await Notifications.setNotificationChannelAsync('meal-reminders', {
    name: 'Öğün Hatırlatmaları',
    description: 'Günlük öğün hatırlatma bildirimleri',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#A3BA91',
  });

  // Alerjen takibi
  await Notifications.setNotificationChannelAsync('allergen-tracking', {
    name: 'Alerjen Takibi',
    description: 'Yeni besin deneme sonrası takip hatırlatmaları',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });

  // Topluluk
  await Notifications.setNotificationChannelAsync('community', {
    name: 'Topluluk',
    description: 'Beğeni, yorum ve paylaşım bildirimleri',
    importance: Notifications.AndroidImportance.DEFAULT,
  });

  // Genel
  await Notifications.setNotificationChannelAsync('general', {
    name: 'Genel',
    description: 'Haftalık özet, tarif önerileri ve diğer bildirimler',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

// ===== YEREL BİLDİRİMLER =====

/**
 * Öğün hatırlatması zamanla
 */
export async function scheduleMealReminder(
  mealSlot: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  babyName: string,
): Promise<string | null> {
  const mealConfig = {
    breakfast: { hour: 8, minute: 0, title: '🌅 Kahvaltı Zamanı!', body: `${babyName} için kahvaltı hazırlamayı unutmayın.` },
    lunch: { hour: 12, minute: 0, title: '☀️ Öğle Yemeği!', body: `${babyName} için öğle yemeği vakti geldi.` },
    snack: { hour: 15, minute: 0, title: '🍎 Ara Öğün!', body: `${babyName} için sağlıklı bir atıştırmalık zamanı.` },
    dinner: { hour: 18, minute: 30, title: '🌙 Akşam Yemeği!', body: `${babyName} için akşam yemeği hazırlayalım.` },
  };

  const config = mealConfig[mealSlot];

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: config.title,
        body: config.body,
        data: { type: 'meal_reminder', slot: mealSlot },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'meal-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: config.hour,
        minute: config.minute,
      },
    });

    await saveScheduledId(mealSlot, id);
    return id;
  } catch (error) {
    console.error('Öğün hatırlatması ayarlanamadı:', error);
    return null;
  }
}

/**
 * Alerjen takip hatırlatması — yeni besin denemesinden 3 gün sonra
 */
export async function scheduleAllergenCheck(
  foodName: string,
  babyName: string,
): Promise<string | null> {
  try {
    // 3 gün sonra (72 saat)
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔍 Alerjen Takibi',
        body: `${babyName} 3 gün önce ${foodName} denedi. Herhangi bir reaksiyon gözlemlediniz mi?`,
        data: { type: 'allergen_check', food: foodName },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'allergen-tracking' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 72 * 60 * 60, // 3 gün
      },
    });

    return id;
  } catch (error) {
    console.error('Alerjen takip hatırlatması ayarlanamadı:', error);
    return null;
  }
}

/**
 * Haftalık ilerleme özeti — her Pazar 10:00
 */
export async function scheduleWeeklySummary(babyName: string): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Haftalık Özet',
        body: `${babyName}'ın bu haftaki ek gıda ilerlemesini inceleyin! Yeni besinler, öğünler ve daha fazlası.`,
        data: { type: 'weekly_summary' },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'general' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1, // Pazar
        hour: 10,
        minute: 0,
      },
    });

    await saveScheduledId('weekly_summary', id);
    return id;
  } catch (error) {
    console.error('Haftalık özet ayarlanamadı:', error);
    return null;
  }
}

/**
 * AI tarif önerisi — günlük 11:00
 */
export async function scheduleAISuggestion(): Promise<string | null> {
  try {
    const suggestions = [
      { title: '🤖 Bugünkü AI Öneri', body: 'Dolabınızdaki malzemelerle yeni bir tarif keşfedin!' },
      { title: '🥄 Kaşık Diyor Ki...', body: 'Bugün bebeğiniz için özel bir tarif hazırladım!' },
      { title: '👨‍🍳 Tarif Zamanı!', body: 'Dolabınıza göre bugünün tarif önerisi hazır.' },
    ];

    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: suggestion.title,
        body: suggestion.body,
        data: { type: 'ai_suggestion' },
        ...(Platform.OS === 'android' && { channelId: 'general' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 11,
        minute: 0,
      },
    });

    await saveScheduledId('ai_suggestion', id);
    return id;
  } catch (error) {
    console.error('AI öneri bildirimi ayarlanamadı:', error);
    return null;
  }
}

// ===== ANLIK BİLDİRİMLER =====

/**
 * Anlık yerel bildirim gönder (topluluk etkileşimi vb.)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: 'default',
      ...(Platform.OS === 'android' && { channelId: 'community' }),
    },
    trigger: null, // Hemen gönder
  });
}

/**
 * Topluluk beğeni bildirimi
 */
export async function notifyLike(authorName: string, postTitle: string): Promise<void> {
  await sendLocalNotification(
    '❤️ Yeni Beğeni!',
    `${authorName} paylaşımınızı beğendi: "${postTitle.slice(0, 40)}..."`,
    { type: 'community_like' },
  );
}

/**
 * Topluluk yorum bildirimi
 */
export async function notifyComment(authorName: string, commentPreview: string): Promise<void> {
  await sendLocalNotification(
    '💬 Yeni Yorum!',
    `${authorName}: "${commentPreview.slice(0, 60)}..."`,
    { type: 'community_comment' },
  );
}

/**
 * Yeni tarif eklendi bildirimi
 */
export async function notifyNewRecipe(recipeTitle: string): Promise<void> {
  await sendLocalNotification(
    '🍽 Yeni Tarif!',
    `"${recipeTitle}" tarifi eklendi. Hemen göz atın!`,
    { type: 'new_recipe' },
  );
}

/**
 * Büyüme dönüm noktası bildirimi
 */
export async function notifyGrowthMilestone(babyName: string, milestone: string): Promise<void> {
  await sendLocalNotification(
    '🎉 Dönüm Noktası!',
    `${babyName} ${milestone}! Tebrikler!`,
    { type: 'growth_milestone' },
  );
}

// ===== TERCİHLER =====

/**
 * Bildirim tercihlerini kaydet
 */
export async function saveNotificationPreferences(prefs: NotificationPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (error) {
    console.error('Bildirim tercihleri kaydedilemedi:', error);
  }
}

/**
 * Bildirim tercihlerini getir
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_PREFERENCES;
}

// ===== TÜM ZAMANLANMIŞ BİLDİRİMLERİ YÖNET =====

/**
 * Tüm öğün hatırlatmalarını ayarla
 */
export async function setupAllMealReminders(babyName: string): Promise<void> {
  // Önce mevcutları temizle
  await cancelMealReminders();

  // Yeni hatırlatmaları ayarla
  await scheduleMealReminder('breakfast', babyName);
  await scheduleMealReminder('lunch', babyName);
  await scheduleMealReminder('snack', babyName);
  await scheduleMealReminder('dinner', babyName);

  console.log('Tüm öğün hatırlatmaları ayarlandı.');
}

/**
 * Öğün hatırlatmalarını iptal et
 */
export async function cancelMealReminders(): Promise<void> {
  const ids = await getScheduledIds();
  const mealIds = ['breakfast', 'lunch', 'snack', 'dinner'];

  for (const slot of mealIds) {
    const id = ids[slot];
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
      delete ids[slot];
    }
  }

  await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULED_IDS, JSON.stringify(ids));
}

/**
 * Tüm zamanlanmış bildirimleri iptal et
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem(STORAGE_KEYS.SCHEDULED_IDS);
  console.log('Tüm zamanlanmış bildirimler iptal edildi.');
}

/**
 * Zamanlanmış bildirim sayısını getir
 */
export async function getScheduledCount(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}

// ===== TERCİHLERE GÖRE BİLDİRİMLERİ AYARLA =====

/**
 * Tercihlere göre tüm bildirimleri yeniden ayarla
 */
export async function applyNotificationPreferences(
  prefs: NotificationPreferences,
  babyName: string,
): Promise<void> {
  // Önce hepsini temizle
  await cancelAllNotifications();

  // Tercihlere göre ayarla
  if (prefs.mealReminders) {
    await setupAllMealReminders(babyName);
  }

  if (prefs.weeklySummary) {
    await scheduleWeeklySummary(babyName);
  }

  if (prefs.aiSuggestions) {
    await scheduleAISuggestion();
  }

  // Tercihleri kaydet
  await saveNotificationPreferences(prefs);

  console.log('Bildirim tercihleri uygulandı:', prefs);
}

// ===== BADGE YÖNETİMİ =====

/**
 * Uygulama badge sayısını ayarla
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Badge'i temizle
 */
export async function clearBadge(): Promise<void> {
  await Notifications.setBadgeCountAsync(0);
}

// ===== LISTENER'LAR =====

/**
 * Bildirime tıklanınca çalışacak listener ekle
 * Route yönlendirmesi için kullanılır
 */
export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void,
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

/**
 * Bildirim geldiğinde çalışacak listener ekle
 * (uygulama açıkken)
 */
export function addNotificationReceivedListener(
  handler: (notification: Notifications.Notification) => void,
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(handler);
}

// ===== YARDIMCI =====

async function saveScheduledId(key: string, id: string): Promise<void> {
  const ids = await getScheduledIds();
  ids[key] = id;
  await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULED_IDS, JSON.stringify(ids));
}

async function getScheduledIds(): Promise<Record<string, string>> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULED_IDS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// ===== BİLDİRİM ROUTE HANDLER =====

/**
 * Bildirime tıklanınca hangi sayfaya gidileceğini belirle
 */
export function getNotificationRoute(
  data: Record<string, any>,
): { path: string; params?: Record<string, string> } | null {
  switch (data.type) {
    case 'meal_reminder':
      return { path: '/(tabs)/plan' };

    case 'allergen_check':
      return { path: '/(tabs)/profile' }; // Alerjen geçmişi profilde

    case 'weekly_summary':
      return { path: '/(tabs)/plan' };

    case 'community_like':
    case 'community_comment':
      return data.postId
        ? { path: `/post/${data.postId}` }
        : { path: '/(tabs)/community' };

    case 'ai_suggestion':
      return { path: '/(tabs)/recipes' };

    case 'new_recipe':
      return data.recipeId
        ? { path: `/recipe/${data.recipeId}` }
        : { path: '/(tabs)/recipes' };

    case 'growth_milestone':
      return { path: '/(tabs)/profile' };

    default:
      return null;
  }
}
