/**
 * Kaşık — Community Screen (Topluluk Tab)
 * Photo posts, comments, expert content, recipe sharing
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { ThemeColors } from '../../constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow, Typography } from '../../constants/theme';
import PostCard from '../../components/community/PostCard';
import { useRecipeBookStore } from '../../stores/recipeBookStore';
import { useCommunityStore, CommunityPost } from '../../stores/communityStore';
import { useRecipeStore } from '../../stores/recipeStore';
import { CreatePostModal, CreatePostData, PostCategory } from '../../components/community/CreatePostModal';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotificationStore } from '../../stores/notificationStore';
import { notifyLike } from '../../lib/notifications';
import { useAuthStore } from '../../stores/authStore';
import { haptics } from '../../lib/haptics';
import { analytics } from '../../lib/analytics';
import { PostListSkeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { GuestBanner } from '../../components/ui/GuestBanner';

const TABS = [
  { key: 'all', label: 'Hepsi' },
  { key: 'recipe', label: 'Tarifler' },
  { key: 'question', label: 'Sorular' },
  { key: 'experience', label: 'Deneyim' },
  { key: 'tip', label: 'İpucu' },
];

const keyExtractor = (item: CommunityPost) => item.id;

export default function CommunityScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user, isGuest } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const saveRecipe = useRecipeBookStore((s) => s.saveRecipe);
  const isRecipeSaved = useRecipeBookStore((s) => s.isRecipeSaved);
  const allPosts = useCommunityStore((s) => s.posts);
  const blockedUserIds = useCommunityStore((s) => s.blockedUserIds);
  const blockUser = useCommunityStore((s) => s.blockUser);
  const togglePostLike = useCommunityStore((s) => s.togglePostLike);
  const deletePost = useCommunityStore((s) => s.deletePost);
  const addPostToStore = useCommunityStore((s) => s.addPost);
  const communityLoaded = useCommunityStore((s) => s.isLoaded);
  const loadMorePosts = useCommunityStore((s) => s.loadMorePosts);
  const isLoadingMore = useCommunityStore((s) => s.isLoadingMore);
  const hasMore = useCommunityStore((s) => s.hasMore);
  const publishRecipe = useRecipeStore((s) => s.publishRecipe);

  const notifPrefs = useNotificationStore((s) => s.preferences);
  const [refreshing, setRefreshing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const loadPostsFromFirestore = useCommunityStore((s) => s.loadPosts);

  // Topluluk kullanım şartları onayını kontrol et
  useEffect(() => {
    AsyncStorage.getItem('@kasik_community_terms').then((val) => {
      setTermsAccepted(val === 'accepted');
    });
  }, []);

  const handleAcceptTerms = useCallback(async () => {
    await AsyncStorage.setItem('@kasik_community_terms', 'accepted');
    setTermsAccepted(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPostsFromFirestore();
    } finally {
      setRefreshing(false);
    }
  }, [loadPostsFromFirestore]);

  const toggleLike = useCallback((id: string) => {
    haptics.light();
    const post = allPosts.find((p) => p.id === id);
    const wasLiked = post?.isLiked;
    if (!wasLiked) analytics.postLike(id);
    togglePostLike(id);

    // Not: Local bildirim kaldırıldı - beğeni bildirimi sadece push notification ile
    // post sahibine gönderilmeli (server-side). Local bildirim yanlış kişiye gidiyordu.
  }, [allPosts, togglePostLike, notifPrefs.communityUpdates, user]);

  const handleCreatePost = async (data: CreatePostData) => {
    let recipeId: string | undefined;

    // Tarif tipinde — recipe'yi Firestore'a kaydet
    if (data.category === 'recipe' && data.recipe) {
      setIsPublishing(true);
      try {
        const allergenIngredients = data.recipe.ingredients.filter((i) => i.isAllergen);
        recipeId = await publishRecipe(
          {
            title: data.recipe.title,
            description: data.content,
            emoji: data.recipe.ingredients[0]?.emoji || '🍽',
            ageGroup: data.recipe.ageGroup,
            prepTime: data.recipe.prepTime,
            servings: data.recipe.servings,
            difficulty: data.recipe.difficulty,
            ingredients: data.recipe.ingredients,
            steps: data.recipe.steps,
            allergens: allergenIngredients.map((i) => i.name),
            tags: [data.recipe.difficulty === 'easy' ? 'Kolay' : data.recipe.difficulty === 'medium' ? 'Orta' : 'Zor'],
            nutrients: [],
            tip: '',
          },
          user?.uid || 'anonymous',
          user?.displayName || 'Ben',
        );
      } catch (e) {
        console.error('Tarif paylaşılamadı:', e);
        // Hata olsa bile postu oluştur (recipeId olmadan)
      } finally {
        setIsPublishing(false);
      }
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: user?.uid,
      author: 'Ben',
      avatar: '👤',
      avatarBg: colors.sageLight,
      badge: null,
      category: data.category,
      time: 'Az önce',
      babyAge: '',
      content: data.content,
      photos: data.photos || [],
      likes: 0,
      views: 0,
      comments: [],
      isLiked: false,
      hasRecipe: data.category === 'recipe' && !!recipeId,
      recipeId,
      isVerified: false,
      createdAt: new Date(),
    };

    addPostToStore(newPost);
    analytics.postCreate(data.category);
  };

  // Engellenen kullanıcıları filtrele, tab'a göre filtreleme ve sıralama
  const sortedPosts = useMemo(() => {
    // Engellenen kullanıcıların gönderilerini filtrele
    let filtered = blockedUserIds.length > 0
      ? allPosts.filter((p) => !p.authorId || !blockedUserIds.includes(p.authorId))
      : [...allPosts];

    // Kategori filtresi (0 = Hepsi, diğerleri kategori)
    const tabKey = TABS[activeTab]?.key;
    if (tabKey && tabKey !== 'all') {
      filtered = filtered.filter((p) => p.category === tabKey);
    }

    // Her zaman en yeniden eskiye sırala
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return filtered;
  }, [allPosts, blockedUserIds, activeTab]);

  // Şartlar henüz yüklenmedi
  if (termsAccepted === null && !isGuest) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Topluluk" emoji="👥" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.sage} />
        </View>
      </View>
    );
  }

  // Şartlar kabul edilmedi — EULA göster
  if (!termsAccepted && !isGuest) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Topluluk" emoji="👥" />
        <ScrollView contentContainerStyle={styles.termsContainer}>
          <Text style={styles.termsEmoji}>📋</Text>
          <Text style={styles.termsTitle}>Topluluk Kullanım Şartları</Text>
          <Text style={styles.termsSubtitle}>
            Topluluğa katılmadan önce lütfen aşağıdaki kuralları okuyun ve kabul edin.
          </Text>

          <View style={styles.termsCard}>
            <Text style={styles.termsRule}>1. Saygılı olun — Diğer ebeveynlere karşı nazik ve saygılı davranın.</Text>
            <Text style={styles.termsRule}>2. Güvenli içerik — Bebek ve çocuk sağlığına zararlı olabilecek içerik paylaşmayın.</Text>
            <Text style={styles.termsRule}>3. Kişisel bilgi — Başkalarının kişisel bilgilerini paylaşmayın.</Text>
            <Text style={styles.termsRule}>4. Spam yasak — Reklam, spam veya tekrarlayan içerik paylaşmayın.</Text>
            <Text style={styles.termsRule}>5. Şikayet ve engelleme — Uygunsuz içerik gördüğünüzde şikayet edin veya kullanıcıyı engelleyin.</Text>
            <Text style={styles.termsRule}>6. Tıbbi tavsiye — Paylaşılan bilgiler tıbbi tavsiye yerine geçmez. Bebeğinizin sağlığı için doktorunuza danışın.</Text>
          </View>

          <Text style={styles.termsLegal}>
            Devam ederek{' '}
            <Text style={styles.termsLink} onPress={() => Linking.openURL('https://kverd123.github.io/kasik-app/terms.html')}>
              Kullanım Şartları
            </Text>
            {' '}ve{' '}
            <Text style={styles.termsLink} onPress={() => Linking.openURL('https://kverd123.github.io/kasik-app/privacy.html')}>
              Gizlilik Politikası
            </Text>
            'nı kabul etmiş olursunuz.
          </Text>

          <TouchableOpacity style={styles.termsAcceptBtn} onPress={handleAcceptTerms}>
            <Text style={styles.termsAcceptText}>Kabul Ediyorum</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isGuest && <GuestBanner />}
      <ScreenHeader
        title="Topluluk"
        emoji="👥"
        rightActions={isGuest ? undefined : [
          { icon: 'create-outline', onPress: () => setCreateModalVisible(true) },
        ]}
      />

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(index)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: activeTab === index }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === index && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts */}
      <FlatList
        data={sortedPosts}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <PostCard
            post={item}
            index={index}
            colors={colors}
            styles={styles}
            onToggleLike={toggleLike}
            onDeletePost={deletePost}
            onBlockUser={blockUser}
            isRecipeSaved={isRecipeSaved}
            onSaveRecipe={saveRecipe}
          />
        )}
        contentContainerStyle={styles.postsContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        initialNumToRender={4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.sage}
            colors={[colors.sage]}
          />
        }
        onEndReached={() => { if (hasMore) loadMorePosts(); }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.sage} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !communityLoaded ? (
            <PostListSkeleton count={3} />
          ) : (
            <EmptyState
              emoji="💬"
              title="Henüz gönderi yok"
              subtitle="İlk gönderiyi paylaşarak topluluğu başlat!"
              ctaLabel="Gönderi Oluştur"
              onCtaPress={() => setCreateModalVisible(true)}
            />
          )
        }
      />

      {/* FAB — hidden for guest users */}
      {!isGuest && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setCreateModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Yeni gönderi oluştur"
        >
          <Text style={styles.fabIcon}>✏️</Text>
        </TouchableOpacity>
      )}

      {/* Gönderi Oluşturma Modal */}
      {!isGuest && (
        <CreatePostModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  headerTitle: { ...Typography.h3 },
  newPostBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.sagePale,
    justifyContent: 'center', alignItems: 'center',
  },
  newPostIcon: { fontFamily: FontFamily.bold, fontSize: 18, color: colors.success },
  notifBtn: { position: 'relative', padding: 4 },
  notifBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: colors.heart, width: 16, height: 16,
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  notifCount: { fontFamily: FontFamily.bold, fontSize: 8, color: colors.white },
  tabsContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  tabsScroll: {
    paddingHorizontal: Spacing.sm,
  },
  tab: { alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  tabText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.textLight },
  tabTextActive: { fontFamily: FontFamily.semiBold, color: colors.sage },
  tabIndicator: {
    position: 'absolute', bottom: 0,
    width: 30, height: 3, borderRadius: 1.5,
    backgroundColor: colors.sage,
  },
  postsContent: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 100 },
  postCard: { gap: Spacing.md },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20 },
  authorInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  authorName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: colors.textDark },
  verifiedBadge: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.sage,
    justifyContent: 'center', alignItems: 'center',
  },
  verifiedIcon: { fontFamily: FontFamily.bold, fontSize: 8, color: colors.white },
  authorMeta: { fontFamily: FontFamily.medium, fontSize: 12, color: colors.textLight },
  moreIcon: { fontFamily: FontFamily.bold, fontSize: 16, color: colors.textLight, letterSpacing: 2 },
  postContent: { fontFamily: FontFamily.medium, fontSize: FontSize.md, color: colors.textDark, lineHeight: 22 },
  photoContainer: {
    backgroundColor: colors.creamMid, borderRadius: BorderRadius.md,
    height: 180, justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  photoScroll: { borderRadius: BorderRadius.md, overflow: 'hidden' },
  postImage: { width: 200, height: 180, marginRight: 8, borderRadius: BorderRadius.md },
  postImageSingle: { width: '100%' as any, marginRight: 0 },
  photoEmoji: { fontSize: 52 },
  photoLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.textLight, marginTop: 8 },
  recipeTagRow: {
    position: 'absolute', bottom: 12, left: 12, right: 12,
    flexDirection: 'row', gap: 8,
  },
  recipeTag: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
  },
  recipeTagSaved: {
    backgroundColor: colors.sagePale,
  },
  recipeTagText: { fontFamily: FontFamily.semiBold, fontSize: 12, color: colors.success },
  articleCard: {
    backgroundColor: colors.creamMid, borderRadius: BorderRadius.md,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  articleMascot: { fontSize: 28 },
  articleInfo: { flex: 1, gap: 4 },
  articleTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: colors.textDark },
  articleSubtitle: { fontFamily: FontFamily.medium, fontSize: 12, color: colors.textLight },
  articleTags: { flexDirection: 'row', gap: Spacing.xs, marginTop: 4 },
  engagementRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl, paddingTop: Spacing.sm },
  engageBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, minWidth: 44 },
  engageCount: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: colors.textLight },
  bookmarkBtn: { marginLeft: 'auto', minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  commentPreview: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: colors.cream, borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  commentAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.sagePale,
    justifyContent: 'center', alignItems: 'center',
  },
  commentAuthor: { fontFamily: FontFamily.semiBold, fontSize: 12, color: colors.textDark },
  commentText: { fontFamily: FontFamily.medium, fontSize: 12, color: colors.textLight },
  fab: {
    position: 'absolute', bottom: 100, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.sage,
    justifyContent: 'center', alignItems: 'center',
    ...Shadow.elevated,
  },
  fabIcon: { fontSize: 22 },
  // Terms / EULA screen
  termsContainer: {
    flexGrow: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    paddingTop: 40,
  },
  termsEmoji: { fontSize: 48, marginBottom: Spacing.md },
  termsTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  termsSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  termsCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    width: '100%' as any,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  termsRule: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textDark,
    lineHeight: 20,
  },
  termsLegal: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.sage,
    fontFamily: FontFamily.semiBold,
    textDecorationLine: 'underline',
  },
  termsAcceptBtn: {
    backgroundColor: colors.sage,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.md,
    width: '100%' as any,
    alignItems: 'center',
  },
  termsAcceptText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: colors.white,
  },
});
