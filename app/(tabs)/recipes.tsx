/**
 * Kaşık — Recipes Screen (Tarifler Tab)
 * Recipe cards grid, search, filtering, pantry suggestions
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { ThemeColors } from '../../constants/colors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
  Typography,
} from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Badge, AllergenBadge } from '../../components/ui/Badge';
import { getAllergenLabel, getAllergenEmoji } from '../../constants/allergens';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { AIRecipeModal } from '../../components/recipe/AIRecipeModal';
import { calculateHotScore, SortMode } from '../../lib/ranking';
import { ALL_RECIPES, RecipeData } from '../../constants/recipes';
import { getLocalRecipeImage } from '../../constants/recipeImages';
import { useRecipeBookStore } from '../../stores/recipeBookStore';
import { useRecipeStore } from '../../stores/recipeStore';
import { haptics } from '../../lib/haptics';
import { useAuthStore } from '../../stores/authStore';
import { usePantryStore } from '../../stores/pantryStore';
import { useBabyStore } from '../../stores/babyStore';
import { analytics } from '../../lib/analytics';
import { RecipeGridSkeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

// Filter chips (yaş grubu + topluluk)
const FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: '6m', label: '6+ Ay' },
  { id: '8m', label: '8+ Ay' },
  { id: '12m+', label: '12+ Ay' },
  { id: 'community', label: '👥 Topluluk' },
  { id: 'favorites', label: 'Favoriler' },
];

// Sıralama modları
const SORT_OPTIONS: { id: SortMode; label: string; emoji: string }[] = [
  { id: 'trending', label: 'Trend', emoji: '🔥' },
  { id: 'newest', label: 'Yeni', emoji: '🆕' },
  { id: 'most_liked', label: 'Popüler', emoji: '❤️' },
  { id: 'top_rated', label: 'En İyi', emoji: '⭐' },
];

// RecipeData → grid veri dönüşümü
const mapRecipeToGrid = (r: RecipeData) => ({
  id: r.id,
  title: r.title,
  emoji: r.emoji,
  ageGroup: r.ageGroup,
  prepTime: r.prepTime,
  calories: r.calories,
  difficulty: r.difficulty,
  rating: r.rating?.average ?? r.rating ?? 0,
  likes: r.likes,
  views: r.views,
  comments: r.comments,
  isLiked: r.isLiked,
  tags: r.tags,
  allergens: r.allergens,
  source: r.source ?? 'official',
  authorName: r.authorName ?? 'Kaşık Ekibi',
  photoURL: r.photoURL ?? null,
  createdAt: r.createdAt,
});


export default function RecipesScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('trending');
  const [showAIModal, setShowAIModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Gerçek kullanıcı verisi (AI tarif modal için)
  const pantryItems = usePantryStore((s) => s.items);
  const baby = useBabyStore((s) => s.baby);
  const babyAllergens = useBabyStore((s) => s.baby?.knownAllergens ?? []);

  // Topluluk tarifleri store (granular selectors)
  const getAllRecipesFromStore = useRecipeStore((s) => s.getAllRecipes);
  const fetchCommunityRecipes = useRecipeStore((s) => s.fetchCommunityRecipes);
  const communityLoading = useRecipeStore((s) => s.isLoading);
  const toggleCommunityLike = useRecipeStore((s) => s.toggleLike);
  const incrementCommunityViews = useRecipeStore((s) => s.incrementViews);

  // İlk yüklenmede topluluk tariflerini çek
  useEffect(() => {
    fetchCommunityRecipes();
  }, []);

  // Lokal + Topluluk tarifleri birleştir
  const allRecipes = useMemo(() => {
    return getAllRecipesFromStore().map(mapRecipeToGrid);
  }, [getAllRecipesFromStore]);

  const [localLikeOverrides, setLocalLikeOverrides] = useState<Record<string, { isLiked: boolean; likes: number }>>({});

  // recipes = allRecipes + lokal beğeni override'ları
  const recipes = useMemo(() => {
    return allRecipes.map((r) => {
      const override = localLikeOverrides[r.id];
      if (override) return { ...r, ...override };
      return r;
    });
  }, [allRecipes, localLikeOverrides]);

  // Pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Cache'i bypass et
      useRecipeStore.setState({ lastFetched: null });
      await fetchCommunityRecipes();
    } finally {
      setRefreshing(false);
    }
  }, [fetchCommunityRecipes]);

  // 1. Filtrele (yaş grubu / favoriler)
  // 2. Arama
  // 3. Sırala (trending / newest / most_liked / top_rated)
  const sortedRecipes = useMemo(() => {
    // Filtre
    let filtered = recipes.filter((r) => {
      if (activeFilter === 'favorites') return r.isLiked;
      if (activeFilter === 'community') return r.source === 'community';
      if (activeFilter !== 'all') return r.ageGroup === activeFilter;
      return true;
    });

    // Arama
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sıralama
    switch (sortMode) {
      case 'trending':
        return [...filtered].sort((a, b) => {
          const scoreA = calculateHotScore({
            likes: a.likes,
            views: a.views,
            comments: a.comments,
            rating: a.rating,
            createdAt: a.createdAt,
          });
          const scoreB = calculateHotScore({
            likes: b.likes,
            views: b.views,
            comments: b.comments,
            rating: b.rating,
            createdAt: b.createdAt,
          });
          return scoreB - scoreA;
        });

      case 'newest':
        return [...filtered].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

      case 'most_liked':
        return [...filtered].sort((a, b) => b.likes - a.likes);

      case 'top_rated':
        return [...filtered].sort((a, b) => b.rating - a.rating);

      default:
        return filtered;
    }
  }, [recipes, activeFilter, sortMode, searchQuery]);

  const saveRecipe = useRecipeBookStore((s) => s.saveRecipe);
  const removeRecipe = useRecipeBookStore((s) => s.removeRecipe);
  const isRecipeSaved = useRecipeBookStore((s) => s.isRecipeSaved);
  // Subscribe to entries so FlatList re-renders when bookmarks change
  const _bookmarkEntries = useRecipeBookStore((s) => s.entries);

  const toggleBookmark = useCallback((id: string) => {
    haptics.light();
    if (isRecipeSaved(id)) {
      removeRecipe(id);
      analytics.recipeUnbookmark(id);
    } else {
      saveRecipe(id, 'favorites');
      analytics.recipeBookmark(id);
    }
  }, [isRecipeSaved, removeRecipe, saveRecipe]);

  const toggleLike = useCallback((id: string) => {
    haptics.light();
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return;
    if (!recipe.isLiked) analytics.recipeLike(id);
    else analytics.recipeUnlike(id);

    const newIsLiked = !recipe.isLiked;
    const newLikes = newIsLiked ? recipe.likes + 1 : recipe.likes - 1;

    setLocalLikeOverrides((prev) => ({
      ...prev,
      [id]: { isLiked: newIsLiked, likes: newLikes },
    }));

    // Community tarif → Firestore'a da yaz
    if (recipe.source === 'community') {
      toggleCommunityLike(id, user?.uid || 'anonymous');
    }
  }, [recipes, toggleCommunityLike]);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Tarifler"
        emoji="📖"
        rightActions={[
          { icon: 'settings-outline', onPress: () => router.push('/(tabs)/profile') },
        ]}
      />

      {/* Search */}
      <View style={styles.searchContainer}>
        <Card padding="sm" style={styles.searchCard}>
          <View style={styles.searchInner}>
            <Ionicons name="search" size={16} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tarif veya malzeme ara..."
              placeholderTextColor={colors.border}
              accessibilityLabel="Tarif ara"
            />
          </View>
        </Card>
      </View>

      {/* Sort Mode Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}
      >
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => setSortMode(opt.id)}
            accessibilityRole="button"
            accessibilityLabel={`${opt.label} sırala`}
            accessibilityState={{ selected: sortMode === opt.id }}
            style={[
              styles.sortChip,
              sortMode === opt.id && styles.sortChipActive,
            ]}
          >
            <Text style={styles.sortEmoji}>{opt.emoji}</Text>
            <Text
              style={[
                styles.sortText,
                sortMode === opt.id && styles.sortTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pantry Suggestion Banner — opens AI Recipe Modal */}
      <TouchableOpacity style={styles.pantryBanner} onPress={() => setShowAIModal(true)}>
        <Text style={styles.pantryMascot}>🤖</Text>
        <View style={styles.pantryText}>
          <Text style={styles.pantryTitle}>AI ile dolabınızdan tarif üretin!</Text>
          <Text style={styles.pantrySubtitle}>Havuç, patates ve elma ile yapılabilir →</Text>
        </View>
      </TouchableOpacity>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => setActiveFilter(filter.id)}
            accessibilityRole="button"
            accessibilityLabel={`${filter.label} filtresi`}
            accessibilityState={{ selected: activeFilter === filter.id }}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipe Grid */}
      <FlatList
        data={sortedRecipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={6}
        removeClippedSubviews={true}
        initialNumToRender={6}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.sage}
            colors={[colors.sage]}
          />
        }
        ListEmptyComponent={
          communityLoading ? (
            <RecipeGridSkeleton count={6} />
          ) : (
            <EmptyState
              emoji="📋"
              title="Tarif bulunamadı"
              subtitle="Bu kategoride henüz tarif yok. Farklı bir filtre deneyin."
            />
          )
        }
        renderItem={useCallback(({ item }: { item: any }) => (
          <AnimatedPressable
            style={styles.recipeCard}
            scaleValue={0.96}
            onPress={() => {
              // Görüntülenme sayısını artır (community tariflerde Firestore'a da yaz)
              if (item.source === 'community') {
                incrementCommunityViews(item.id);
              }
              setLocalLikeOverrides((prev) => ({
                ...prev,
                [item.id]: { ...(prev[item.id] || {}), isLiked: item.isLiked, likes: item.likes },
              }));
              router.push(`/recipe/${item.id}`);
            }}
          >
            {/* Image / Emoji placeholder */}
            <View style={[styles.recipeImage, { backgroundColor: colors.creamMid }]}>
              {getLocalRecipeImage(item.title) ? (
                <Image source={getLocalRecipeImage(item.title)} style={styles.recipePhoto} />
              ) : item.photoURL ? (
                <Image source={{ uri: item.photoURL }} style={styles.recipePhoto} />
              ) : (
                <Text style={styles.recipeEmoji}>{item.emoji}</Text>
              )}
              {/* Gradient overlay at bottom */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.35)']}
                style={styles.gradientOverlay}
              >
                <Text style={styles.gradientMeta}>
                  {item.ageGroup === '6m' ? '6+' : item.ageGroup === '8m' ? '8+' : '12+'} ay  {'\u00B7'}  {item.prepTime} dk  {'\u00B7'}  {item.calories} kcal
                </Text>
              </LinearGradient>
              {/* Cooking time badge */}
              <View style={styles.cookingTimeBadge}>
                <Ionicons name="time-outline" size={11} color={colors.textDark} />
                <Text style={styles.cookingTimeBadgeText}>{item.prepTime} dk</Text>
              </View>
              {/* Allergen badge */}
              {item.allergens.length > 0 && (
                <View style={styles.allergenOverlay}>
                  <AllergenBadge label={`${getAllergenEmoji(item.allergens[0])} ${getAllergenLabel(item.allergens[0])}`} size="sm" />
                </View>
              )}
              {/* Community source badge */}
              {item.source === 'community' && (
                <View style={styles.communityBadgeOverlay}>
                  <Text style={styles.communityBadgeText}>👥</Text>
                </View>
              )}
              {/* Like & Bookmark buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => toggleLike(item.id)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel={item.isLiked ? 'Beğeniyi kaldır' : 'Beğen'}
                  accessibilityState={{ selected: item.isLiked }}
                >
                  <Ionicons
                    name={item.isLiked ? 'heart' : 'heart-outline'}
                    size={18}
                    color={item.isLiked ? colors.heart : colors.textLight}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.bookmarkButton,
                    isRecipeSaved(item.id) && styles.bookmarkButtonActive,
                  ]}
                  onPress={() => toggleBookmark(item.id)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel={isRecipeSaved(item.id) ? 'Kayıttan kaldır' : 'Kaydet'}
                  accessibilityState={{ selected: isRecipeSaved(item.id) }}
                >
                  <Ionicons
                    name={isRecipeSaved(item.id) ? 'bookmark' : 'bookmark-outline'}
                    size={18}
                    color={isRecipeSaved(item.id) ? colors.sage : colors.textLight}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Info */}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {item.source === 'community' && (
                <Text style={styles.recipeAuthor}>👤 {item.authorName}</Text>
              )}
              {/* Rating & Views */}
              <View style={styles.ratingRow}>
                <Text style={styles.stars}>{renderStars(item.rating)}</Text>
                <Text style={styles.ratingNum}>{item.rating}</Text>
                <Text style={styles.viewCount}>👁 {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}</Text>
              </View>
              {/* Tags */}
              <View style={styles.tagRow}>
                {item.tags.slice(0, 2).map((tag: string) => (
                  <Badge
                    key={tag}
                    label={tag}
                    variant={
                      tag.includes('Demir') || tag.includes('Omega') || tag.includes('Protein') || tag.includes('Lif')
                        ? 'success'
                        : tag === 'Dolaptaki'
                        ? 'warning'
                        : tag === 'Zor'
                        ? 'danger'
                        : tag === 'Orta'
                        ? 'info'
                        : 'success'
                    }
                  />
                ))}
              </View>
            </View>
          </AnimatedPressable>
        ), [colors, toggleLike, toggleBookmark, isRecipeSaved, localLikeOverrides, _bookmarkEntries])}
      />

      {/* AI Recipe Modal */}
      <AIRecipeModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        pantryItems={pantryItems.length > 0 ? pantryItems : []}
        babyAgeStage={baby?.currentStage ?? '8m'}
        knownAllergens={babyAllergens}
        babyName={baby?.name ?? 'Bebeğiniz'}
        onSaveRecipe={(recipe) => {
          Alert.alert('Tarif Kaydedildi!', `"${recipe.title}" tariflerinize eklendi.`);
        }}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
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
  headerTitle: {
    ...Typography.h3,
  },
  filterIcon: {
    padding: Spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  searchCard: {
    ...Shadow.soft,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textDark,
    height: 36,
  },
  pantryBanner: {
    marginHorizontal: Spacing.xl,
    backgroundColor: colors.sagePale,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.soft,
  },
  pantryMascot: {
    fontSize: 28,
  },
  pantryText: {
    flex: 1,
  },
  pantryTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.textDark,
  },
  pantrySubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: colors.success,
    marginTop: 2,
  },
  filtersRow: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.success,
  },
  filterTextActive: {
    color: colors.white,
    fontFamily: FontFamily.semiBold,
  },
  gridContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  recipeCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    ...Shadow.card,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  gradientMeta: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#FFFFFF',
  },
  cookingTimeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  cookingTimeBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: colors.textDark,
  },
  recipePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as any,
  recipeEmoji: {
    fontSize: 42,
  },
  allergenOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  cardActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    gap: 6,
  },
  likeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButtonActive: {
    backgroundColor: colors.sagePale,
  },
  likeIcon: {
    fontSize: 14,
  },
  recipeInfo: {
    padding: Spacing.md,
    gap: 3,
  },
  recipeTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  recipeMeta: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: colors.textLight,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  stars: {
    fontSize: 12,
    color: colors.warningDark,
  },
  ratingNum: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: colors.textLight,
  },
  viewCount: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 'auto',
  },
  sortRow: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  sortChipActive: {
    backgroundColor: colors.sagePale,
    borderColor: colors.sage,
  },
  sortEmoji: {
    fontSize: 12,
  },
  sortText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  sortTextActive: {
    color: colors.sageDark,
    fontFamily: FontFamily.semiBold,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  // Community badge & loading
  communityBadgeOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityBadgeText: {
    fontSize: 12,
  },
  recipeAuthor: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: colors.sage,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  loadingText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textLight,
  },
});
