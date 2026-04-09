/**
 * Kaşık — Profile & Settings Screen (Profil Tab)
 * Baby info, recipe book, allergen history, premium upgrade, settings
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { ThemeColors } from '../../constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow, Typography } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/authStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useRecipeBookStore, RecipeBookEntry } from '../../stores/recipeBookStore';
import { usePantryStore } from '../../stores/pantryStore';
import { RecipeData, RECIPES_BY_ID } from '../../constants/recipes';
import { WeeklyNutrition } from '../../components/profile/WeeklyNutrition';
import { MealStreak } from '../../components/profile/MealStreak';
import { useAllergenIntroStore } from '../../stores/allergenIntroStore';
import { getAllergenLabel, getAllergenEmoji } from '../../constants/allergens';
import { SEVERITY_LABELS, AllergenIntroProgramConfig } from '../../constants/allergenIntro';
import { AllergenProgramDetailModal } from '../../components/allergen/AllergenProgramDetailModal';
import Constants from 'expo-constants';
import { Linking } from 'react-native';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotificationStore } from '../../stores/notificationStore';
import { useBabyStore } from '../../stores/babyStore';
import { NotificationPreferences } from '../../lib/notifications';
import { analytics } from '../../lib/analytics';
import { useThemeStore, ThemeMode } from '../../stores/themeStore';
import * as ImagePicker from 'expo-image-picker';
import { uploadBabyPhoto } from '../../lib/storage';
import { GuestBlockScreen } from '../../components/ui/GuestBanner';

type BookTab = 'all' | 'favorites' | 'try_later' | 'made_it';

const THEME_OPTIONS: { key: ThemeMode; label: string; emoji: string }[] = [
  { key: 'light', label: 'Açık', emoji: '☀️' },
  { key: 'dark', label: 'Koyu', emoji: '🌙' },
  { key: 'system', label: 'Sistem', emoji: '📱' },
];

const BOOK_TABS: { key: BookTab; label: string; emoji: string }[] = [
  { key: 'all', label: 'Tümü', emoji: '📚' },
  { key: 'favorites', label: 'Favoriler', emoji: '❤️' },
  { key: 'try_later', label: 'Denenecek', emoji: '🔖' },
  { key: 'made_it', label: 'Yaptıklarım', emoji: '✅' },
];

function AllergenReport() {
  const colors = useColors();
  const programs = useAllergenIntroStore((s) => s.programs);
  const getActivePrograms = useAllergenIntroStore((s) => s.getActivePrograms);
  const getCompletedPrograms = useAllergenIntroStore((s) => s.getCompletedPrograms);
  const getProgramReport = useAllergenIntroStore((s) => s.getProgramReport);
  const activeProgs = getActivePrograms();
  const completedProgs = getCompletedPrograms();

  if (activeProgs.length === 0 && completedProgs.length === 0) return null;

  return (
    <Card padding="xl" style={{ gap: Spacing.md }}>
      <Text style={{ fontFamily: FontFamily.bold, fontSize: FontSize.base, color: colors.textDark }}>
        ⚕️ Alerjen Geçmişi
      </Text>

      {/* Aktif programlar */}
      {activeProgs.map((prog) => {
        const report = getProgramReport(prog.id);
        if (!report) return null;
        const progress = report.totalMeals > 0 ? report.completedMeals / report.totalMeals : 0;
        return (
          <View key={prog.id} style={{
            backgroundColor: colors.warningBg, borderRadius: BorderRadius.lg,
            padding: Spacing.md, gap: Spacing.sm,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Text style={{ fontSize: 22 }}>{getAllergenEmoji(prog.allergenType)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FontFamily.bold, fontSize: FontSize.sm, color: colors.warningDark }}>
                  {getAllergenLabel(prog.allergenType)} — Aktif
                </Text>
                <Text style={{ fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: colors.warning }}>
                  {report.completedMeals}/{report.totalMeals} öğün tamamlandı
                </Text>
              </View>
            </View>
            <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.peach }}>
              <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.warningDark, width: `${progress * 100}%` }} />
            </View>
          </View>
        );
      })}

      {/* Tamamlanmış programlar */}
      {completedProgs.map((prog) => {
        const report = getProgramReport(prog.id);
        if (!report) return null;
        const resultInfo = {
          safe: { emoji: '✅', label: 'Güvenli', color: colors.success },
          caution: { emoji: '⚠️', label: 'Dikkatli', color: colors.warningDark },
          allergic: { emoji: '❌', label: 'Alerjik', color: colors.dangerDark },
          in_progress: { emoji: '⏳', label: 'Devam Ediyor', color: colors.textLight },
        }[report.overallResult];

        return (
          <View key={prog.id} style={{
            flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
            backgroundColor: colors.white, borderRadius: BorderRadius.lg,
            padding: Spacing.md,
          }}>
            <Text style={{ fontSize: 22 }}>{getAllergenEmoji(prog.allergenType)}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: colors.textDark }}>
                {getAllergenLabel(prog.allergenType)}
              </Text>
              <Text style={{ fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: colors.textLight }}>
                {prog.totalDays} gün · {report.completedMeals} öğün
              </Text>
            </View>
            <Text style={{
              fontFamily: FontFamily.bold, fontSize: FontSize.xs, color: resultInfo.color,
            }}>
              {resultInfo.emoji} {resultInfo.label}
            </Text>
          </View>
        );
      })}
    </Card>
  );
}

export default function ProfileScreen() {
  const isGuest = useAuthStore((s) => s.isGuest);

  if (isGuest) {
    return (
      <GuestBlockScreen
        icon="👤"
        title="Profil"
        description="Bebek profilinizi olusturun, tarif defterinizi yonetin ve alerjen takibi yapin. Kayit olarak tum ozelliklere erisebilirsiniz."
      />
    );
  }

  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccountAction = useAuthStore((s) => s.deleteAccount);
  const subscription = useSubscriptionStore((s) => s.subscription);
  const getActiveFeatures = useSubscriptionStore((s) => s.getActiveFeatures);
  const purchase = useSubscriptionStore((s) => s.purchase);
  const subscriptionLoading = useSubscriptionStore((s) => s.isLoading);
  const entries = useRecipeBookStore((s) => s.entries);
  const loadFromStorage = useRecipeBookStore((s) => s.loadFromStorage);
  const isLoaded = useRecipeBookStore((s) => s.isLoaded);
  const removeRecipe = useRecipeBookStore((s) => s.removeRecipe);
  const updateCategory = useRecipeBookStore((s) => s.updateCategory);
  const getAllSavedRecipes = useRecipeBookStore((s) => s.getAllSavedRecipes);
  const getRecipesByCategory = useRecipeBookStore((s) => s.getRecipesByCategory);
  const getExpiringItems = usePantryStore((s) => s.getExpiringItems);
  const pantryItems = usePantryStore((s) => s.items);
  const preferences = useNotificationStore((s) => s.preferences);
  const updatePreference = useNotificationStore((s) => s.updatePreference);
  const setAllPreferences = useNotificationStore((s) => s.setAllPreferences);
  const notifLoaded = useNotificationStore((s) => s.isLoaded);
  const baby = useBabyStore((s) => s.baby);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const [bookTab, setBookTab] = useState<BookTab>('all');
  const [profileDetailProgram, setProfileDetailProgram] = useState<AllergenIntroProgramConfig | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingBabyPhoto, setUploadingBabyPhoto] = useState(false);
  const updateBaby = useBabyStore((s) => s.updateBaby);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        useBabyStore.getState().loadFromStorage(),
        useRecipeBookStore.getState().loadFromStorage(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };
  const getAllPrograms = useAllergenIntroStore((s) => s.getAllPrograms);
  const getProfileProgramReport = useAllergenIntroStore((s) => s.getProgramReport);

  const expiringItems = useMemo(() => getExpiringItems(3), [pantryItems]);

  useEffect(() => {
    if (!isLoaded) loadFromStorage();
  }, []);

  const bookRecipes = useMemo(() => {
    if (bookTab === 'all') return getAllSavedRecipes();
    return getRecipesByCategory(bookTab);
  }, [bookTab, entries]);

  const getEntryForRecipe = (recipeId: string): RecipeBookEntry | undefined => {
    return entries.find((e) => e.recipeId === recipeId);
  };

  const getCategoryLabel = (cat: RecipeBookEntry['category']) => {
    switch (cat) {
      case 'favorites': return '❤️';
      case 'try_later': return '🔖';
      case 'made_it': return '✅';
      default: return '📖';
    }
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          if (isLoggingOut) return;
          setIsLoggingOut(true);
          try {
            analytics.logout();
            await logout();
            router.replace('/(auth)/login');
          } catch (e) {
            console.error('Çıkış hatası:', e);
            Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu. Lütfen tekrar deneyin.');
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Hesabımı Sil',
          style: 'destructive',
          onPress: async () => {
            if (isDeletingAccount) return;
            setIsDeletingAccount(true);
            try {
              await deleteAccountAction();
              router.replace('/(auth)/login');
            } catch (e: any) {
              if (e.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Tekrar Giriş Gerekli',
                  'Güvenlik nedeniyle hesabınızı silmeden önce tekrar giriş yapmanız gerekiyor. Lütfen çıkış yapıp tekrar giriş yapın.',
                );
              } else {
                Alert.alert('Hata', e?.message || 'Hesap silinirken bir hata oluştu.');
              }
            } finally {
              setIsDeletingAccount(false);
            }
          },
        },
      ],
    );
  };

  const handlePickBabyPhoto = async () => {
    try {
      const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçebilmek için galeri izni vermeniz gerekiyor.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      if (!user?.uid || !baby?.id) {
        Alert.alert('Hata', 'Kullanıcı veya bebek bilgisi bulunamadı.');
        return;
      }

      setUploadingBabyPhoto(true);
      const photoURL = await uploadBabyPhoto(user.uid, baby.id, result.assets[0].uri);
      updateBaby({ photoURL });
      setUploadingBabyPhoto(false);
    } catch (e) {
      setUploadingBabyPhoto(false);
      Alert.alert('Hata', 'Fotoğraf yüklenirken bir hata oluştu.');
    }
  };

  const handleRemoveRecipe = (recipeId: string, title: string) => {
    Alert.alert('Tarifi Kaldır', `"${title}" tarif defterinden kaldırılsın mı?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Kaldır', style: 'destructive', onPress: () => removeRecipe(recipeId) },
    ]);
  };

  const handleCategoryChange = (recipeId: string) => {
    Alert.alert('Kategori Değiştir', 'Bu tarifi nereye taşımak istiyorsun?', [
      { text: '❤️ Favoriler', onPress: () => updateCategory(recipeId, 'favorites') },
      { text: '🔖 Denenecek', onPress: () => updateCategory(recipeId, 'try_later') },
      { text: '✅ Yaptıklarım', onPress: () => updateCategory(recipeId, 'made_it') },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Profil"
        variant="large"
        emoji="👤"
        rightActions={[
          { icon: 'settings-outline', onPress: () => Alert.alert('Ayarlar', 'Aşağıda ayar seçeneklerini bulabilirsiniz.') },
        ]}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.sage}
            colors={[colors.sage]}
          />
        }
      >

        {/* User Card */}
        <Card padding="xl" style={styles.userCard}>
          <View style={styles.userRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarEmoji}>👩‍👶</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName || 'Anne / Baba'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'email@ornek.com'}</Text>
              {subscription.isPremium ? (
                <Badge label="✨ Premium" variant="success" size="md" />
              ) : (
                <Badge label="Ücretsiz Plan" variant="neutral" size="md" />
              )}
            </View>
            <TouchableOpacity onPress={() => {
              Alert.prompt ? Alert.prompt('İsim Değiştir', 'Yeni isminizi yazın:', async (newName) => {
                if (newName && newName.trim()) {
                  try {
                    const { updateProfile: fbUpdateProfile } = await import('firebase/auth');
                    const { doc, updateDoc } = await import('firebase/firestore');
                    const { auth, db } = await import('../../lib/firebase');
                    if (auth.currentUser) {
                      await fbUpdateProfile(auth.currentUser, { displayName: newName.trim() });
                      await updateDoc(doc(db, 'users', auth.currentUser.uid), { displayName: newName.trim() });
                      // Update Zustand store immediately so UI re-renders
                      const currentUser = useAuthStore.getState().user;
                      if (currentUser) {
                        useAuthStore.setState({ user: { ...currentUser, displayName: newName.trim() } });
                      }
                      Alert.alert('Başarılı', 'İsminiz güncellendi.');
                    }
                  } catch (e) {
                    Alert.alert('Hata', 'İsim güncellenemedi.');
                  }
                }
              }, 'plain-text', user?.displayName || '') : Alert.alert('Profil', 'Profil düzenleme yakında eklenecek.');
            }}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Baby Card */}
        <Card padding="xl" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👶 Bebek Bilgileri</Text>
            <TouchableOpacity onPress={() => router.push('/(onboarding)/baby-info' as any)}>
              <Text style={styles.editLink}>Düzenle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.babyInfo}>
            <TouchableOpacity
              style={styles.babyAvatar}
              onPress={handlePickBabyPhoto}
              activeOpacity={0.7}
              accessibilityLabel="Bebek fotoğrafı ekle"
            >
              {uploadingBabyPhoto ? (
                <ActivityIndicator size="small" color={colors.sage} />
              ) : baby?.photoURL ? (
                <Image source={{ uri: baby.photoURL }} style={styles.babyAvatarImage} />
              ) : (
                <Text style={{ fontSize: 40 }}>{baby?.gender === 'female' ? '👧' : baby?.gender === 'male' ? '👦' : '👶'}</Text>
              )}
              <View style={styles.babyAvatarBadge}>
                <Text style={{ fontSize: 12 }}>📷</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.babyDetails}>
              <Text style={styles.babyName}>{baby?.name || 'Bebek'}</Text>
              <Text style={styles.babyAge}>
                {baby?.birthDate
                  ? `${Math.floor((Date.now() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} aylık`
                  : ''
                }
                {baby?.gender === 'female' ? ' · Kız' : baby?.gender === 'male' ? ' · Erkek' : ''}
              </Text>
              <Text style={styles.babySolids}>
                {baby?.currentStage === '6m' ? 'Püre dönemi' : baby?.currentStage === '8m' ? 'Ezme dönemi' : baby?.currentStage === '12m+' ? 'Parmak gıda dönemi' : 'Ek gıda dönemi'}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{baby?.triedFoods?.length || 0}</Text>
              <Text style={styles.statLabel}>Denenen Besin</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{getAllPrograms().length}</Text>
              <Text style={styles.statLabel}>Alerjen Takip</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{baby?.weight?.[baby.weight.length-1]?.value ? baby.weight[baby.weight.length-1].value + ' kg' : '-'}</Text>
              <Text style={styles.statLabel}>Güncel Ağırlık</Text>
            </View>
          </View>

          {/* Allergen history — bebek profili alerjenler (program ile takip edilmeyenler) */}
          <View style={styles.allergenSection}>
            <Text style={styles.subTitle}>Bilinen Alerjenler</Text>
            {(baby?.knownAllergens && baby.knownAllergens.length > 0) ? (
              <View style={styles.allergenRow}>
                {/* Bilinen alerjenler (baby profili) — program ile takip edilmeyenler */}
                {(baby?.knownAllergens || [])
                  .filter((a, index, arr) => arr.indexOf(a) === index) // deduplicate
                  .filter((a) => !getAllPrograms().some((p) => p.allergenType === a))
                  .map((allergenType) => (
                    <View key={`known-${allergenType}`} style={styles.allergenItem}>
                      <Text style={styles.allergenEmoji}>{getAllergenEmoji(allergenType)}</Text>
                      <Text style={styles.allergenName}>{getAllergenLabel(allergenType)}</Text>
                      <Badge label="Alerjik" variant="danger" />
                    </View>
                  ))}
              </View>
            ) : (
              <Text style={styles.allergenEmptyText}>Henüz alerjen bilgisi eklenmedi</Text>
            )}
          </View>
        </Card>

        {/* Expiring Pantry Alert */}
        {expiringItems.length > 0 && (
          <TouchableOpacity
            style={styles.expiringAlert}
            onPress={() => router.push('/(tabs)/pantry' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.expiringAlertIcon}>⚠️</Text>
            <View style={styles.expiringAlertInfo}>
              <Text style={styles.expiringAlertTitle}>
                {expiringItems.length} ürün bayatlayacak!
              </Text>
              <Text style={styles.expiringAlertSub}>
                {expiringItems.slice(0, 3).map((i) => `${i.emoji} ${i.name}`).join(', ')}
                {expiringItems.length > 3 ? ` +${expiringItems.length - 3}` : ''}
              </Text>
            </View>
            <Text style={styles.expiringAlertArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Weekly Nutrition */}
        <WeeklyNutrition />

        {/* Meal Streak */}
        <MealStreak />

        {/* ========= ALERJEN GEÇMİŞİ ========= */}
        <AllergenReport />

        {/* ========= RECIPE BOOK / TARİF DEFTERİ ========= */}
        <Card padding="xl" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📖 Tarif Defterim</Text>
            <Text style={styles.bookCount}>{entries.length} tarif</Text>
          </View>

          {/* Book Tabs */}
          <View style={styles.bookTabsRow}>
            {BOOK_TABS.map((tab) => {
              const count =
                tab.key === 'all'
                  ? entries.length
                  : entries.filter((e) => e.category === tab.key).length;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.bookTab,
                    bookTab === tab.key && styles.bookTabActive,
                  ]}
                  onPress={() => setBookTab(tab.key)}
                >
                  <Text style={styles.bookTabEmoji}>{tab.emoji}</Text>
                  <Text
                    style={[
                      styles.bookTabText,
                      bookTab === tab.key && styles.bookTabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  <View
                    style={[
                      styles.bookTabBadge,
                      bookTab === tab.key && styles.bookTabBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bookTabBadgeText,
                        bookTab === tab.key && styles.bookTabBadgeTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recipe List */}
          {bookRecipes.length > 0 ? (
            <View style={styles.bookList}>
              {bookRecipes.map((recipe) => {
                const entry = getEntryForRecipe(recipe.id);
                return (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.bookItem}
                    onPress={() => router.push(`/recipe/${recipe.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bookItemEmoji}>
                      <Text style={{ fontSize: 28 }}>{recipe.emoji}</Text>
                    </View>
                    <View style={styles.bookItemInfo}>
                      <Text style={styles.bookItemTitle} numberOfLines={1}>
                        {recipe.title}
                      </Text>
                      <Text style={styles.bookItemMeta}>
                        {recipe.prepTime} dk · {recipe.calories} kcal ·{' '}
                        {recipe.ageGroup === '6m'
                          ? '6+ ay'
                          : recipe.ageGroup === '8m'
                          ? '8+ ay'
                          : '12+ ay'}
                      </Text>
                      <View style={styles.bookItemTags}>
                        <Text style={styles.bookItemCategory}>
                          {getCategoryLabel(entry?.category || 'favorites')}
                        </Text>
                        <Text style={styles.bookItemRating}>
                          ★ {recipe.rating.average.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bookItemActions}>
                      <TouchableOpacity
                        onPress={() => handleCategoryChange(recipe.id)}
                        style={styles.bookItemActionBtn}
                      >
                        <Text style={{ fontSize: 16 }}>📂</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleRemoveRecipe(recipe.id, recipe.title)
                        }
                        style={styles.bookItemActionBtn}
                      >
                        <Text style={{ fontSize: 14 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.bookEmpty}>
              <Text style={styles.bookEmptyEmoji}>📚</Text>
              <Text style={styles.bookEmptyTitle}>
                {bookTab === 'all'
                  ? 'Tarif defteriniz boş'
                  : bookTab === 'favorites'
                  ? 'Henüz favori tarif yok'
                  : bookTab === 'try_later'
                  ? 'Denenecek tarif yok'
                  : 'Henüz tarif yapmadınız'}
              </Text>
              <Text style={styles.bookEmptyText}>
                Tarif detay sayfasında 📑 butonuna basarak tarifleri defterinize ekleyebilirsiniz.
              </Text>
              <TouchableOpacity
                style={styles.bookEmptyBtn}
                onPress={() => router.push('/(tabs)/recipes' as any)}
              >
                <Text style={styles.bookEmptyBtnText}>Tarifleri Keşfet →</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Premium Upgrade (show only for free users) */}
        {!subscription.isPremium && (
          <Card padding="xl" style={styles.premiumCard} onPress={async () => {
            if (subscriptionLoading) return;
            try {
              if (user?.uid) {
                await purchase(user.uid, 'monthly');
                Alert.alert('Tebrikler!', 'Premium aboneliğiniz başarıyla aktif edildi!');
              }
            } catch (e: any) {
              if (!e?.userCancelled) {
                Alert.alert(
                  'Satın Alma',
                  e?.message || 'Abonelik şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
                  [{ text: 'Tamam' }]
                );
              }
            }
          }}>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumEmoji}>✨</Text>
              <View style={styles.premiumInfo}>
                <Text style={styles.premiumTitle}>Premium'a Geç</Text>
                <Text style={styles.premiumSubtitle}>
                  Reklamsız + Sınırsız AI Tarif
                </Text>
              </View>
              {subscriptionLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.premiumArrow}>→</Text>
              )}
            </View>
            <View style={styles.premiumFeatures}>
              {getActiveFeatures().map((feature) => (
                <Text key={feature.label} style={styles.premiumFeature}>
                  {feature.icon} {feature.label}
                </Text>
              ))}
            </View>
            <View style={styles.premiumPricing}>
              <Text style={styles.premiumPrice}>₺19,99/ay</Text>
              <Text style={styles.premiumSave}>Aylık otomatik yenilenir. İstediğiniz zaman iptal edin.</Text>
            </View>
          </Card>
        )}

        {/* Notification Settings */}
        <Card padding="xl" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🔔 Bildirimler</Text>

          <View style={styles.settingsList}>
            {/* Master toggle */}
            <View style={styles.settingItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Tüm Bildirimler</Text>
                <Text style={styles.settingHint}>Tüm bildirimleri aç / kapat</Text>
              </View>
              <Switch
                value={preferences.mealReminders && preferences.allergenTracking && preferences.weeklySummary && preferences.communityUpdates && preferences.aiSuggestions}
                onValueChange={(val) => setAllPreferences(val, baby?.name)}
                trackColor={{ false: colors.creamDark, true: colors.sageLight }}
                thumbColor={colors.sage}
              />
            </View>

            {/* Category toggles */}
            {([
              { key: 'mealReminders' as keyof NotificationPreferences, emoji: '🍽', label: 'Öğün Hatırlatmaları', hint: 'Kahvaltı, öğle, akşam saatlerinde' },
              { key: 'allergenTracking' as keyof NotificationPreferences, emoji: '⚠️', label: 'Alerjen Takibi', hint: 'Yeni gıda denemesi hatırlatmaları' },
              { key: 'weeklySummary' as keyof NotificationPreferences, emoji: '📊', label: 'Haftalık Özet', hint: 'Her Pazar beslenme raporu' },
              { key: 'communityUpdates' as keyof NotificationPreferences, emoji: '👥', label: 'Topluluk Bildirimleri', hint: 'Beğeni ve yorum bildirimleri' },
              { key: 'aiSuggestions' as keyof NotificationPreferences, emoji: '🤖', label: 'AI Önerileri', hint: 'Kişiselleştirilmiş tarif önerileri' },
            ]).map((item) => (
              <View key={item.key} style={styles.settingItem}>
                <Text style={styles.notifEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingHint}>{item.hint}</Text>
                </View>
                <Switch
                  value={preferences[item.key]}
                  onValueChange={(val) => updatePreference(item.key, val, baby?.name)}
                  trackColor={{ false: colors.creamDark, true: colors.sageLight }}
                  thumbColor={preferences[item.key] ? colors.sage : colors.border}
                />
              </View>
            ))}
          </View>
        </Card>

        {/* Theme Selector */}
        <Card padding="xl" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎨 Tema</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
            {THEME_OPTIONS.map((opt) => {
              const isActive = themeMode === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setThemeMode(opt.key)}
                  style={{
                    flex: 1,
                    paddingVertical: Spacing.md,
                    borderRadius: BorderRadius.lg,
                    backgroundColor: isActive ? colors.sage : colors.creamMid,
                    alignItems: 'center',
                    gap: Spacing.xs,
                    borderWidth: isActive ? 2 : 1,
                    borderColor: isActive ? colors.sageDark : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{opt.emoji}</Text>
                  <Text style={{
                    fontFamily: isActive ? FontFamily.bold : FontFamily.medium,
                    fontSize: FontSize.sm,
                    color: isActive ? colors.textOnPrimary : colors.textMid,
                  }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Settings */}
        <Card padding="xl" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚙️ Ayarlar</Text>

          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Dil</Text>
              <Text style={styles.settingValue}>Türkçe 🇹🇷</Text>
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL('https://kverd123.github.io/kasik-app/privacy.html')}>
              <Text style={styles.settingLabel}>Gizlilik Politikası</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL('https://kverd123.github.io/kasik-app/terms.html')}>
              <Text style={styles.settingLabel}>Kullanım Koşulları</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={async () => {
              try {
                if (user?.uid) {
                  const restore = useSubscriptionStore.getState().restore;
                  await restore(user.uid);
                  const isPremium = useSubscriptionStore.getState().subscription.isPremium;
                  Alert.alert(isPremium ? 'Başarılı' : 'Bilgi', isPremium ? 'Premium aboneliğiniz geri yüklendi!' : 'Aktif abonelik bulunamadı.');
                }
              } catch (e: any) {
                Alert.alert('Hata', e?.message || 'Geri yükleme başarısız oldu.');
              }
            }}>
              <Text style={styles.settingLabel}>Satın Alımları Geri Yükle</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Uygulama Versiyonu</Text>
              <Text style={styles.settingValue}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
            </View>
          </View>
        </Card>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, isLoggingOut && { opacity: 0.5 }]}
          onPress={handleLogout}
          disabled={isLoggingOut}
          accessibilityRole="button"
          accessibilityLabel="Çıkış yap"
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={colors.textMid} />
          ) : (
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          )}
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={[styles.deleteBtn, isDeletingAccount && { opacity: 0.5 }]}
          onPress={handleDeleteAccount}
          disabled={isDeletingAccount}
          accessibilityRole="button"
          accessibilityLabel="Hesabımı sil"
        >
          {isDeletingAccount ? (
            <ActivityIndicator size="small" color={colors.heart} />
          ) : (
            <Text style={styles.deleteText}>Hesabımı Sil</Text>
          )}
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>
          Kaşık v{Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </ScrollView>

      <AllergenProgramDetailModal
        visible={!!profileDetailProgram}
        program={profileDetailProgram}
        onClose={() => setProfileDetailProgram(null)}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 100 },
  header: { marginBottom: Spacing.sm },
  headerTitle: { ...Typography.h2 },

  // User
  userCard: {},
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  userAvatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.creamMid,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarEmoji: { fontSize: 30 },
  userInfo: { flex: 1, gap: 4 },
  userName: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: colors.textDark },
  userEmail: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.textLight },
  editIcon: { fontSize: 18 },

  // Section
  sectionCard: { gap: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: colors.textDark },
  editLink: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: colors.sage },

  // Baby
  babyInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  babyAvatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.sagePale,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative' as const,
  },
  babyAvatarImage: {
    width: 72, height: 72, borderRadius: 36,
  },
  babyAvatarBadge: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1.5,
    borderColor: colors.sagePale,
  },
  babyDetails: { gap: 2 },
  babyName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: colors.textDark },
  babyAge: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.textLight },
  babySolids: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.sage },
  statsGrid: { flexDirection: 'row', gap: Spacing.md },
  statBox: {
    flex: 1, backgroundColor: colors.cream,
    borderRadius: BorderRadius.md, padding: Spacing.md,
    alignItems: 'center', gap: 4,
  },
  statValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: colors.textDark },
  statLabel: { fontFamily: FontFamily.medium, fontSize: 12, color: colors.textLight, textAlign: 'center' },
  allergenSection: { gap: Spacing.md },
  subTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: colors.textMid },
  allergenRow: { flexDirection: 'row', gap: Spacing.md },
  allergenItem: { flex: 1, alignItems: 'center', gap: 4 },
  allergenEmoji: { fontSize: 24 },
  allergenName: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: colors.textMid },
  allergenEmptyText: {
    fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.textLight,
    textAlign: 'center', paddingVertical: Spacing.md,
  },

  // Expiring Alert
  expiringAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
    ...Shadow.soft,
  },
  expiringAlertIcon: { fontSize: 24 },
  expiringAlertInfo: { flex: 1, gap: 2 },
  expiringAlertTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.warningDark,
  },
  expiringAlertSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.warningDark,
  },
  expiringAlertArrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: colors.warningDark,
  },

  // ========= RECIPE BOOK STYLES =========
  bookCount: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: colors.sage,
  },
  bookTabsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  bookTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.cream,
    gap: 3,
  },
  bookTabActive: {
    backgroundColor: colors.sagePale,
    borderWidth: 1,
    borderColor: colors.sage + '50',
  },
  bookTabEmoji: { fontSize: 16 },
  bookTabText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  bookTabTextActive: {
    fontFamily: FontFamily.bold,
    color: colors.sageDark,
  },
  bookTabBadge: {
    backgroundColor: colors.creamDark,
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  bookTabBadgeActive: {
    backgroundColor: colors.sage,
  },
  bookTabBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: colors.textLight,
  },
  bookTabBadgeTextActive: {
    color: colors.white,
  },

  // Book List
  bookList: {
    gap: Spacing.sm,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  bookItemEmoji: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.soft,
  },
  bookItemInfo: {
    flex: 1,
    gap: 3,
  },
  bookItemTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  bookItemMeta: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  bookItemTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bookItemCategory: { fontSize: 12 },
  bookItemRating: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: colors.warningDark,
  },
  bookItemActions: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  bookItemActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty Book
  bookEmpty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  bookEmptyEmoji: { fontSize: 40 },
  bookEmptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: colors.textDark,
    textAlign: 'center',
  },
  bookEmptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xl,
  },
  bookEmptyBtn: {
    backgroundColor: colors.sage,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginTop: Spacing.sm,
  },
  bookEmptyBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.white,
  },

  // Premium
  premiumCard: {
    backgroundColor: colors.sage,
    borderWidth: 0,
  },
  premiumContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  premiumEmoji: { fontSize: 32 },
  premiumInfo: { flex: 1 },
  premiumTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: colors.white },
  premiumSubtitle: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  premiumArrow: { fontFamily: FontFamily.bold, fontSize: 20, color: colors.white },
  premiumFeatures: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  premiumFeature: { fontFamily: FontFamily.medium, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  premiumPricing: { marginTop: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: Spacing.md },
  premiumPrice: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: colors.white },
  premiumSave: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Settings
  settingsList: { gap: 0 },
  settingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.creamMid,
  },
  settingLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: colors.textDark },
  settingHint: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: colors.textLight, marginTop: 1 },
  notifEmoji: { fontSize: 20, marginRight: Spacing.sm },
  settingValue: { fontFamily: FontFamily.medium, fontSize: FontSize.md, color: colors.textLight },
  settingArrow: { fontFamily: FontFamily.medium, fontSize: 16, color: colors.textLight },
  logoutBtn: {
    backgroundColor: colors.white, borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg, alignItems: 'center',
    borderWidth: 1, borderColor: colors.creamDark,
  },
  logoutText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: colors.textMid },
  deleteBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  deleteText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.heart },
  versionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
