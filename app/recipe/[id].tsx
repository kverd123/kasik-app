/**
 * Kaşık — Recipe Detail Screen
 * Premium recipe view with photo hero, cooking mode, timer,
 * nutrition info, similar recipes, and floating action bar
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Share,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../constants/colors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AdBanner } from '../../components/ui/AdBanner';
import { getAllergenLabel, getAllergenEmoji } from '../../constants/allergens';
import { AllergenType } from '../../types';
import { RECIPES_BY_ID, ALL_RECIPES, RecipeData } from '../../constants/recipes';
import { useRecipeBookStore } from '../../stores/recipeBookStore';
import { useRecipeStore } from '../../stores/recipeStore';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 260;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = id || '1';

  // Önce lokal, yoksa community store'dan bak
  const { getCommunityRecipeById, toggleLike: toggleCommunityLike, incrementViews: incrementCommunityViews } = useRecipeStore();
  const recipe = RECIPES_BY_ID[recipeId] ?? getCommunityRecipeById(recipeId) ?? null;
  const isCommunityRecipe = recipe?.source === 'community';

  const { isRecipeSaved, saveRecipe, removeRecipe } = useRecipeBookStore();

  // Community tarif açıldığında görüntüleme sayacını artır
  useEffect(() => {
    if (isCommunityRecipe && recipeId) {
      incrementCommunityViews(recipeId);
    }
  }, [recipeId, isCommunityRecipe]);
  const [isLiked, setIsLiked] = useState(recipe?.isLiked ?? false);
  const isSavedInBook = isRecipeSaved(recipeId);
  const [likeCount, setLikeCount] = useState(recipe?.likes ?? 0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'nutrition'>('ingredients');
  const [cookingMode, setCookingMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState(0);

  const heartScale = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerSeconds]);

  // Similar recipes
  const similarRecipes = recipe
    ? ALL_RECIPES.filter(
        (r) =>
          r.id !== recipe.id &&
          (r.ageGroup === recipe.ageGroup ||
            r.tags.some((t) => recipe.tags.includes(t)))
      ).slice(0, 6)
    : [];

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 56 }}>🥄</Text>
          <Text style={styles.emptyTitle}>Tarif bulunamadı</Text>
          <Text style={styles.emptySubtitle}>
            Bu tarif henüz eklenmemiş olabilir.
          </Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>← Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.4,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    // Community tarif → Firestore'a sync
    if (isCommunityRecipe) {
      toggleCommunityLike(recipeId, 'user-anonymous'); // TODO: gerçek userId
    }
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🥄 Kaşık'tan bir tarif: ${recipe.title}\n\n${recipe.description}\n\nMalzemeler:\n${recipe.ingredients
          .map((i) => `• ${i.emoji} ${i.amount} ${i.unit} ${i.name}`)
          .join('\n')}\n\nKaşık - Ek Gıda Rehberi uygulamasından paylaşıldı.`,
      });
    } catch (e) { console.error('Tarif paylaşma hatası:', e); }
  };

  const getDifficultyInfo = (diff: string) => {
    switch (diff) {
      case 'easy':
        return { label: 'Kolay', color: Colors.success, emoji: '🟢', bg: Colors.successBg };
      case 'medium':
        return { label: 'Orta', color: Colors.warning, emoji: '🟡', bg: Colors.warningBg };
      case 'hard':
        return { label: 'Zor', color: Colors.heart, emoji: '🔴', bg: '#FFF0F0' };
      default:
        return { label: 'Kolay', color: Colors.success, emoji: '🟢', bg: Colors.successBg };
    }
  };

  const getAgeLabel = (age: string) => {
    switch (age) {
      case '6m': return '6+ ay';
      case '8m': return '8+ ay';
      case '12m+': return '12+ ay';
      default: return age;
    }
  };

  const getAgeColor = (age: string) => {
    switch (age) {
      case '6m': return { bg: '#E8F5E0', text: '#5A7A42' };
      case '8m': return { bg: '#FFF3E0', text: '#E65100' };
      case '12m+': return { bg: '#E3F2FD', text: '#1565C0' };
      default: return { bg: Colors.creamMid, text: Colors.textMid };
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push('★');
      else if (i - 0.5 <= rating) stars.push('★');
      else stars.push('☆');
    }
    return stars.join('');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const difficulty = getDifficultyInfo(recipe.difficulty);
  const ageColor = getAgeColor(recipe.ageGroup);
  const progress =
    recipe.steps.length > 0
      ? Math.round((completedSteps.size / recipe.steps.length) * 100)
      : 0;

  const TIMER_PRESETS = [1, 3, 5, 10, 15, 20, 25, 30];

  return (
    <View style={styles.container}>
      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.floatingBtn}
        >
          <Text style={styles.floatingBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.floatingRight}>
          <TouchableOpacity onPress={handleShare} style={styles.floatingBtn}>
            <Text style={styles.floatingBtnText}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isSavedInBook) {
                removeRecipe(recipeId);
              } else {
                saveRecipe(recipeId, 'favorites');
              }
            }}
            style={[styles.floatingBtn, isSavedInBook && styles.floatingBtnSaved]}
          >
            <Text style={styles.floatingBtnText}>
              {isSavedInBook ? '🔖' : '📑'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroGradient}>
            <Text style={styles.heroEmoji}>{recipe.emoji}</Text>
          </View>
          {/* Badges overlay */}
          <View style={styles.heroBadges}>
            {recipe.isAIGenerated && (
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>🤖 AI Tarif</Text>
              </View>
            )}
            <View style={[styles.ageBadgeHero, { backgroundColor: ageColor.bg }]}>
              <Text style={[styles.ageBadgeHeroText, { color: ageColor.text }]}>
                👶 {getAgeLabel(recipe.ageGroup)}
              </Text>
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.description}>{recipe.description}</Text>

          {/* Author */}
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>
                {recipe.authorName.charAt(0)}
              </Text>
            </View>
            <View style={styles.authorInfo}>
              <View style={styles.authorNameRow}>
                <Text style={styles.authorName}>{recipe.authorName}</Text>
                {recipe.authorVerified && (
                  <Text style={styles.verifiedBadge}>✅</Text>
                )}
              </View>
              <Text style={styles.sourceText}>
                {recipe.source === 'official'
                  ? 'Resmi Tarif'
                  : recipe.source === 'ai'
                  ? 'AI Önerisi'
                  : 'Topluluk Tarifi'}
              </Text>
            </View>
          </View>

          {/* Rating & Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statStars}>
                {renderStars(recipe.rating.average)}
              </Text>
              <Text style={styles.statValue}>
                {recipe.rating.average.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>
                ({recipe.rating.count})
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statValue}>{likeCount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👁</Text>
              <Text style={styles.statValue}>{recipe.views}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💬</Text>
              <Text style={styles.statValue}>{recipe.comments}</Text>
            </View>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>⏱️</Text>
            <Text style={styles.infoValue}>{recipe.prepTime}</Text>
            <Text style={styles.infoLabel}>dakika</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>🔥</Text>
            <Text style={styles.infoValue}>{recipe.calories}</Text>
            <Text style={styles.infoLabel}>kcal</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: difficulty.bg }]}>
            <Text style={styles.infoEmoji}>{difficulty.emoji}</Text>
            <Text style={[styles.infoValue, { color: difficulty.color }]}>
              {difficulty.label}
            </Text>
            <Text style={styles.infoLabel}>zorluk</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>🍽️</Text>
            <Text style={styles.infoValue}>{recipe.servings}</Text>
            <Text style={styles.infoLabel}>porsiyon</Text>
          </View>
        </View>

        {/* Allergen Warning */}
        {recipe.allergens.length > 0 && (
          <View style={styles.allergenCard}>
            <View style={styles.allergenHeader}>
              <Text style={styles.allergenIcon}>⚠️</Text>
              <Text style={styles.allergenTitle}>Alerjen Uyarısı</Text>
            </View>
            <View style={styles.allergenList}>
              {recipe.allergens.map((allergen: AllergenType) => (
                <View key={allergen} style={styles.allergenChip}>
                  <Text style={styles.allergenChipEmoji}>
                    {getAllergenEmoji(allergen)}
                  </Text>
                  <Text style={styles.allergenChipLabel}>
                    {getAllergenLabel(allergen)}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.allergenNote}>
              İlk defa deniyorsanız az miktarla başlayın ve 3 gün bekleyerek reaksiyon takibi yapın.
            </Text>
          </View>
        )}

        {/* Tags */}
        <View style={styles.tagRow}>
          {recipe.tags.map((tag: string) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Content Tabs */}
        <View style={styles.tabBar}>
          {[
            { key: 'ingredients', label: '🧾 Malzemeler', icon: '🧾' },
            { key: 'steps', label: '👩‍🍳 Yapılışı', icon: '👩‍🍳' },
            { key: 'nutrition', label: '📊 Besin', icon: '📊' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                activeTab === tab.key && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'ingredients' && (
          <View style={styles.sectionCard}>
            {/* Serving adjuster */}
            <View style={styles.servingRow}>
              <Text style={styles.servingLabel}>Porsiyon</Text>
              <View style={styles.servingAdjuster}>
                <TouchableOpacity
                  style={[
                    styles.servingBtn,
                    servingMultiplier <= 0.5 && styles.servingBtnDisabled,
                  ]}
                  onPress={() =>
                    setServingMultiplier((prev) => Math.max(0.5, prev - 0.5))
                  }
                >
                  <Text style={styles.servingBtnText}>−</Text>
                </TouchableOpacity>
                <View style={styles.servingValueBox}>
                  <Text style={styles.servingValue}>
                    {recipe.servings * servingMultiplier}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.servingBtn,
                    servingMultiplier >= 4 && styles.servingBtnDisabled,
                  ]}
                  onPress={() =>
                    setServingMultiplier((prev) => Math.min(4, prev + 0.5))
                  }
                >
                  <Text style={styles.servingBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ingredient list */}
            {recipe.ingredients.map((ing, index) => (
              <View
                key={index}
                style={[
                  styles.ingredientRow,
                  index === recipe.ingredients.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.ingredientLeft}>
                  <Text style={styles.ingredientEmoji}>{ing.emoji}</Text>
                  <Text style={styles.ingredientName}>
                    {ing.name}
                    {ing.isAllergen && (
                      <Text style={styles.ingredientAllergen}> ⚠️</Text>
                    )}
                  </Text>
                </View>
                <Text style={styles.ingredientAmount}>
                  {(ing.amount * servingMultiplier) % 1 === 0
                    ? ing.amount * servingMultiplier
                    : (ing.amount * servingMultiplier).toFixed(1)}{' '}
                  {ing.unit}
                </Text>
              </View>
            ))}

            {/* Alerjen sorumluluk bildirimi */}
            <View style={styles.allergenDisclaimer}>
              <Text style={styles.allergenDisclaimerIcon}>⚠️</Text>
              <Text style={styles.allergenDisclaimerText}>
                Bu tarifte belirtilen alerjen bilgileri yalnızca rehber niteliğindedir. Bebeğinize yeni bir gıda vermeden önce mutlaka doktorunuza danışınız.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'steps' && (
          <View style={styles.sectionCard}>
            {/* Cooking Timer */}
            <View style={styles.timerSection}>
              <View style={styles.timerHeader}>
                <Text style={styles.timerTitle}>⏲️ Zamanlayıcı</Text>
                {timerRunning && (
                  <TouchableOpacity
                    onPress={() => {
                      setTimerRunning(false);
                      setTimerSeconds(0);
                    }}
                  >
                    <Text style={styles.timerReset}>Sıfırla</Text>
                  </TouchableOpacity>
                )}
              </View>

              {timerSeconds > 0 || timerRunning ? (
                <View style={styles.timerDisplay}>
                  <Text style={styles.timerTime}>
                    {formatTimer(timerSeconds)}
                  </Text>
                  <View style={styles.timerControls}>
                    <TouchableOpacity
                      style={[
                        styles.timerControlBtn,
                        timerRunning
                          ? { backgroundColor: Colors.warning }
                          : { backgroundColor: Colors.sage },
                      ]}
                      onPress={() => setTimerRunning(!timerRunning)}
                    >
                      <Text style={styles.timerControlText}>
                        {timerRunning ? '⏸ Duraklat' : '▶️ Devam'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Timer progress */}
                  {timerPreset > 0 && (
                    <View style={styles.timerProgressBg}>
                      <View
                        style={[
                          styles.timerProgressFill,
                          {
                            width: `${((timerPreset * 60 - timerSeconds) / (timerPreset * 60)) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.timerPresets}
                >
                  {TIMER_PRESETS.map((min) => (
                    <TouchableOpacity
                      key={min}
                      style={styles.timerPresetBtn}
                      onPress={() => {
                        setTimerPreset(min);
                        setTimerSeconds(min * 60);
                        setTimerRunning(true);
                      }}
                    >
                      <Text style={styles.timerPresetText}>{min} dk</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Steps progress */}
            {completedSteps.size > 0 && (
              <View style={styles.stepsProgress}>
                <View style={styles.stepsProgressHeader}>
                  <Text style={styles.stepsProgressLabel}>İlerleme</Text>
                  <Text style={styles.stepsProgressValue}>{progress}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progress}%` },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Steps list */}
            {recipe.steps.map((step, index) => {
              const isDone = completedSteps.has(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.stepRow, isDone && styles.stepRowDone]}
                  onPress={() => toggleStep(index)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isDone && styles.stepCircleDone,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumber,
                        isDone && styles.stepNumberDone,
                      ]}
                    >
                      {isDone ? '✓' : index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[styles.stepText, isDone && styles.stepTextDone]}
                  >
                    {step}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Completion celebration */}
            {progress === 100 && (
              <View style={styles.completeBanner}>
                <Text style={styles.completeEmoji}>🎉</Text>
                <Text style={styles.completeTitle}>Tebrikler!</Text>
                <Text style={styles.completeText}>
                  Tarif hazır, afiyet olsun!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'nutrition' && (
          <View style={styles.sectionCard}>
            <Text style={styles.nutritionSubtitle}>
              {recipe.servings * servingMultiplier} porsiyon için tahmini değerler
            </Text>

            {/* Nutrition grid */}
            <View style={styles.nutritionGrid}>
              {recipe.nutrients.map((nutrient, index) => (
                <View key={index} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {Math.round(nutrient.value * servingMultiplier)}
                  </Text>
                  <Text style={styles.nutritionUnit}>{nutrient.unit}</Text>
                  <Text style={styles.nutritionName}>{nutrient.name}</Text>
                </View>
              ))}
            </View>

            {/* Total calorie bar */}
            <View style={styles.calorieBar}>
              <View style={styles.calorieBarLeft}>
                <Text style={styles.calorieBarEmoji}>🔥</Text>
                <Text style={styles.calorieBarLabel}>Toplam Kalori</Text>
              </View>
              <Text style={styles.calorieBarValue}>
                {Math.round(recipe.calories * servingMultiplier)} kcal
              </Text>
            </View>

            {/* Baby daily intake info */}
            <View style={styles.dailyIntakeCard}>
              <Text style={styles.dailyIntakeTitle}>💡 Günlük İhtiyaç</Text>
              <Text style={styles.dailyIntakeText}>
                {recipe.ageGroup === '6m'
                  ? '6 aylık bir bebek günde yaklaşık 600-700 kcal ihtiyaç duyar. Bu tarif günlük ihtiyacın yaklaşık %' +
                    Math.round(((recipe.calories * servingMultiplier) / 650) * 100) +
                    "'ini karşılar."
                  : recipe.ageGroup === '8m'
                  ? '8-12 aylık bir bebek günde yaklaşık 700-900 kcal ihtiyaç duyar. Bu tarif günlük ihtiyacın yaklaşık %' +
                    Math.round(((recipe.calories * servingMultiplier) / 800) * 100) +
                    "'ini karşılar."
                  : '12+ aylık bir çocuk günde yaklaşık 900-1200 kcal ihtiyaç duyar. Bu tarif günlük ihtiyacın yaklaşık %' +
                    Math.round(((recipe.calories * servingMultiplier) / 1050) * 100) +
                    "'ini karşılar."}
              </Text>
            </View>
          </View>
        )}

        {/* Parent Tip */}
        {recipe.tip && (
          <View style={styles.tipCard}>
            <View style={styles.tipRow}>
              <Text style={styles.tipEmoji}>💡</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Ebeveyn İpucu</Text>
                <Text style={styles.tipText}>{recipe.tip}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Similar Recipes */}
        {similarRecipes.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>🍽️ Benzer Tarifler</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarScroll}
            >
              {similarRecipes.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.similarCard}
                  onPress={() =>
                    router.push(`/recipe/${r.id}` as any)
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.similarEmojiBox}>
                    <Text style={styles.similarEmoji}>{r.emoji}</Text>
                  </View>
                  <Text style={styles.similarName} numberOfLines={2}>
                    {r.title}
                  </Text>
                  <View style={styles.similarMeta}>
                    <Text style={styles.similarMetaText}>
                      {r.prepTime} dk
                    </Text>
                    <Text style={styles.similarMetaDot}>·</Text>
                    <Text style={styles.similarMetaText}>
                      {r.calories} kcal
                    </Text>
                  </View>
                  <View style={styles.similarRating}>
                    <Text style={styles.similarStars}>★</Text>
                    <Text style={styles.similarRatingText}>
                      {r.rating.average.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Ad Banner */}
        <AdBanner />

        {/* Bottom spacing for floating bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.fab}>
        <TouchableOpacity
          style={styles.fabAction}
          onPress={toggleLike}
        >
          <Animated.Text
            style={[
              styles.fabActionEmoji,
              { transform: [{ scale: heartScale }] },
            ]}
          >
            {isLiked ? '❤️' : '🤍'}
          </Animated.Text>
          <Text style={styles.fabActionLabel}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fabMainBtn}
          onPress={() => {
            // TODO: Plana ekle
          }}
        >
          <Text style={styles.fabMainText}>📋 Plana Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fabAction}
          onPress={() => setCookingMode(!cookingMode)}
        >
          <Text style={styles.fabActionEmoji}>
            {cookingMode ? '📖' : '👩‍🍳'}
          </Text>
          <Text style={styles.fabActionLabel}>
            {cookingMode ? 'Oku' : 'Pişir'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },

  // Floating Header
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    zIndex: 100,
  },
  floatingBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.card,
  },
  floatingBtnSaved: {
    backgroundColor: Colors.sagePale,
    borderWidth: 1,
    borderColor: Colors.sage,
  },
  floatingBtnText: { fontSize: 20 },
  floatingRight: { flexDirection: 'row', gap: Spacing.sm },

  // Scroll
  scrollContent: { paddingBottom: 0 },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textDark,
  },
  emptySubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textLight,
  },
  backBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.sage,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },

  // Hero
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroGradient: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.sageLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: { fontSize: 88, marginTop: 20 },
  heroBadges: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  aiBadge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  aiBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.white,
  },
  ageBadgeHero: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  ageBadgeHeroText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
  },

  // Title Section
  titleSection: {
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    gap: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: Colors.textDark,
    lineHeight: 34,
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textLight,
    lineHeight: 22,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.sagePale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatarText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.sageDark,
  },
  authorInfo: { flex: 1, gap: 2 },
  authorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  authorName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  verifiedBadge: { fontSize: 12 },
  sourceText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
  },
  statStars: { fontSize: 12, color: '#FFB800' },
  statIcon: { fontSize: 14 },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.creamDark,
  },

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 3,
    ...Shadow.soft,
  },
  infoEmoji: { fontSize: 22 },
  infoValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  infoLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Allergen
  allergenCard: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.warningBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  allergenIcon: { fontSize: 20 },
  allergenTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.warningDark,
  },
  allergenList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.warning + '50',
  },
  allergenChipEmoji: { fontSize: 18 },
  allergenChipLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.warningDark,
  },
  allergenNote: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // Tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.sagePale,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.round,
  },
  tagText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.sageDark,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.creamMid,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: Colors.white,
    ...Shadow.soft,
  },
  tabText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  tabTextActive: {
    color: Colors.sageDark,
    fontFamily: FontFamily.bold,
  },

  // Section Card
  sectionCard: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
    ...Shadow.soft,
  },

  // Serving
  servingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.creamMid,
  },
  servingLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  servingAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  servingBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.sage,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingBtnDisabled: {
    backgroundColor: Colors.creamDark,
  },
  servingBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.white,
  },
  servingValueBox: {
    minWidth: 40,
    alignItems: 'center',
  },
  servingValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textDark,
  },

  // Ingredients
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.creamMid,
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  ingredientEmoji: { fontSize: 22, width: 32 },
  ingredientName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textDark,
    flex: 1,
  },
  ingredientAllergen: { color: Colors.warning },
  allergenDisclaimer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E7',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#F0DCA0',
  },
  allergenDisclaimerIcon: { fontSize: 16, marginTop: 2 },
  allergenDisclaimerText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: '#8B6914',
    lineHeight: 18,
  },
  ingredientAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.sage,
    backgroundColor: Colors.sagePale,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },

  // Timer
  timerSection: {
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  timerReset: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.heart,
  },
  timerDisplay: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  timerTime: {
    fontFamily: FontFamily.bold,
    fontSize: 48,
    color: Colors.sageDark,
    letterSpacing: 2,
  },
  timerControls: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timerControlBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  timerControlText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
  timerProgressBg: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.creamDark,
    borderRadius: 2,
  },
  timerProgressFill: {
    height: 4,
    backgroundColor: Colors.sage,
    borderRadius: 2,
  },
  timerPresets: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  timerPresetBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.sage,
  },
  timerPresetText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.sage,
  },

  // Steps Progress
  stepsProgress: {
    gap: Spacing.sm,
  },
  stepsProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsProgressLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  stepsProgressValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.sage,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.creamMid,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.sage,
    borderRadius: 3,
  },

  // Steps
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  stepRowDone: {
    backgroundColor: Colors.sagePale + '60',
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.creamMid,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepCircleDone: {
    backgroundColor: Colors.sage,
  },
  stepNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textMid,
  },
  stepNumberDone: {
    color: Colors.white,
  },
  stepText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textDark,
    lineHeight: 24,
    paddingTop: 5,
  },
  stepTextDone: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },

  // Completion
  completeBanner: {
    backgroundColor: Colors.sagePale,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  completeEmoji: { fontSize: 42 },
  completeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.sageDark,
  },
  completeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textMid,
  },

  // Nutrition
  nutritionSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  nutritionItem: {
    width: '47%',
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  nutritionValue: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.textDark,
  },
  nutritionUnit: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  nutritionName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textMid,
    textAlign: 'center',
  },
  calorieBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.sagePale,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  calorieBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  calorieBarEmoji: { fontSize: 20 },
  calorieBarLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  calorieBarValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.sageDark,
  },
  dailyIntakeCard: {
    backgroundColor: Colors.infoBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  dailyIntakeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  dailyIntakeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMid,
    lineHeight: 20,
  },

  // Tip
  tipCard: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    backgroundColor: Colors.infoBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 0,
  },
  tipRow: { flexDirection: 'row', gap: Spacing.md },
  tipEmoji: { fontSize: 24, marginTop: 2 },
  tipContent: { flex: 1, gap: 4 },
  tipTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  tipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMid,
    lineHeight: 20,
  },

  // Similar Recipes
  similarSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  similarTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textDark,
    paddingHorizontal: Spacing.xl,
  },
  similarScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  similarCard: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.soft,
  },
  similarEmojiBox: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.creamMid,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  similarEmoji: { fontSize: 36 },
  similarName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textDark,
    lineHeight: 18,
  },
  similarMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  similarMetaText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.textLight,
  },
  similarMetaDot: {
    fontSize: 10,
    color: Colors.textLight,
  },
  similarRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  similarStars: {
    fontSize: 11,
    color: '#FFB800',
  },
  similarRatingText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.textMid,
  },

  // Floating Action Bar
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 16,
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    ...Shadow.elevated,
    borderWidth: 1,
    borderColor: Colors.creamDark,
  },
  fabAction: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: 50,
  },
  fabActionEmoji: { fontSize: 22 },
  fabActionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.textLight,
  },
  fabMainBtn: {
    backgroundColor: Colors.sage,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
    ...Shadow.soft,
  },
  fabMainText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
});
