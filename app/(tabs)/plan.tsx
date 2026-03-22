/**
 * Kasik — Daily Meal Plan Screen (Plan Tab)
 * Day selector, meal cards with allergen warnings, progress bar
 * mealPlanStore ile persist, ExpiringBanner, gelismis ekleme modali
 * Gunluk / Haftalik goruntuleme toggle
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
  RefreshControl,
  Animated,
} from 'react-native';
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
import ScreenHeader from '../../components/ui/ScreenHeader';
import { Badge, AllergenBadge, FirstTryBadge, LikedBadge, NutrientBadge } from '../../components/ui/Badge';
import { AdBanner } from '../../components/ui/AdBanner';
import { Meal, MealSlot } from '../../types';
import { MEAL_SLOT_LABELS } from '../../constants/foods';
import { useRecipeBookStore } from '../../stores/recipeBookStore';
import { usePantryStore } from '../../stores/pantryStore';
import { useMealPlanStore, getWeekDates, getWeekLabel, getCurrentWeekKey, isSameDay } from '../../stores/mealPlanStore';
import { ALL_RECIPES, RECIPES_BY_ID, RecipeData } from '../../constants/recipes';
import { ShoppingListModal } from '../../components/plan/ShoppingListModal';
import { ExpiringBanner } from '../../components/plan/ExpiringBanner';
import { AllergenIntroModal } from '../../components/allergen/AllergenIntroModal';
import { AllergenReactionModal } from '../../components/allergen/AllergenReactionModal';
import { AllergenProgramDetailModal } from '../../components/allergen/AllergenProgramDetailModal';
import { SEVERITY_LABELS, AllergenIntroProgramConfig } from '../../constants/allergenIntro';
import { useAllergenIntroStore } from '../../stores/allergenIntroStore';
import { getAllergenLabel, getAllergenEmoji } from '../../constants/allergens';
import { MealDetailModal } from '../../components/plan/MealDetailModal';
import { router } from 'expo-router';
import { useNotificationStore } from '../../stores/notificationStore';
import { useBabyStore } from '../../stores/babyStore';
import { scheduleMealReminder, scheduleAllergenCheck } from '../../lib/notifications';
import { haptics } from '../../lib/haptics';
import { analytics } from '../../lib/analytics';
import { MealSlotSkeleton } from '../../components/ui/SkeletonLoader';

type ViewMode = 'daily' | 'weekly';

export default function PlanScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Bugunun gun indeksini bul (0=Pzt, 6=Paz)
  const todayIndex = useMemo(() => {
    const day = new Date().getDay(); // 0=Paz, 1=Pzt...
    return day === 0 ? 6 : day - 1; // Pazartesi=0 olarak ayarla
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addingSlot, setAddingSlot] = useState<MealSlot>('breakfast');
  const [shoppingModalVisible, setShoppingModalVisible] = useState(false);
  const [allergenModalVisible, setAllergenModalVisible] = useState(false);
  const [reactionModal, setReactionModal] = useState<{
    visible: boolean;
    allergenType: any;
    programId: string;
    day: number;
    mealId: string;
    mealName: string;
  }>({ visible: false, allergenType: 'egg', programId: '', day: 0, mealId: '', mealName: '' });
  const [recipeSearch, setRecipeSearch] = useState('');
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null);
  const [detailProgram, setDetailProgram] = useState<AllergenIntroProgramConfig | null>(null);
  const [showExpiringWarning, setShowExpiringWarning] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const expiringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notifPrefs = useNotificationStore((s) => s.preferences);
  const baby = useBabyStore((s) => s.baby);
  const entries = useRecipeBookStore((s) => s.entries);
  const loadRecipeBook = useRecipeBookStore((s) => s.loadFromStorage);
  const recipeBookLoaded = useRecipeBookStore((s) => s.isLoaded);
  const getAllSavedRecipes = useRecipeBookStore((s) => s.getAllSavedRecipes);
  const pantryStore = usePantryStore();
  const weekMeals = useMealPlanStore((s) => s.weekMeals);
  const planLoaded = useMealPlanStore((s) => s.isLoaded);
  const loadPlan = useMealPlanStore((s) => s.loadFromStorage);
  const addMealToSlot = useMealPlanStore((s) => s.addMealToSlot);
  const removeMeal = useMealPlanStore((s) => s.removeMeal);
  const toggleMealCompleted = useMealPlanStore((s) => s.toggleMealCompleted);
  const getDayMeals = useMealPlanStore((s) => s.getDayMeals);
  const currentWeekKey = useMealPlanStore((s) => s.currentWeekKey);
  const goToNextWeek = useMealPlanStore((s) => s.goToNextWeek);
  const goToPreviousWeek = useMealPlanStore((s) => s.goToPreviousWeek);
  const goToCurrentWeek = useMealPlanStore((s) => s.goToCurrentWeek);
  const getActivePrograms = useAllergenIntroStore((s) => s.getActivePrograms);
  const getPausedPrograms = useAllergenIntroStore((s) => s.getPausedPrograms);
  const cancelProgram = useAllergenIntroStore((s) => s.cancelProgram);
  const resumeProgram = useAllergenIntroStore((s) => s.resumeProgram);
  const completeProgram = useAllergenIntroStore((s) => s.completeProgram);
  const getProgramReport = useAllergenIntroStore((s) => s.getProgramReport);
  const getProgramDayStatus = useAllergenIntroStore((s) => s.getProgramDayStatus);
  const allergenLoaded = useAllergenIntroStore((s) => s.isLoaded);

  const thisWeekKey = useMemo(() => getCurrentWeekKey(), []);
  const isCurrentWeek = currentWeekKey === thisWeekKey;

  // Expiring items from pantry
  const expiringItems = useMemo(
    () => pantryStore.getExpiringItems(3),
    [pantryStore.items]
  );

  // Shopping item count from week meals
  const shoppingItemCount = useMemo(() => {
    let count = 0;
    for (const dayIndex of Object.keys(weekMeals)) {
      const dayMeals = weekMeals[Number(dayIndex)];
      if (dayMeals) {
        for (const slot of Object.keys(dayMeals) as MealSlot[]) {
          count += dayMeals[slot]?.length || 0;
        }
      }
    }
    return count;
  }, [weekMeals]);

  useEffect(() => {
    if (!recipeBookLoaded) loadRecipeBook();
    if (!planLoaded) loadPlan();
  }, []);

  // Auto-hide expiring warning after 10 seconds
  useEffect(() => {
    if (showExpiringWarning && expiringItems.length > 0) {
      expiringTimerRef.current = setTimeout(() => {
        setShowExpiringWarning(false);
      }, 10000);
    }
    return () => {
      if (expiringTimerRef.current) {
        clearTimeout(expiringTimerRef.current);
      }
    };
  }, [showExpiringWarning, expiringItems.length]);

  // Eksik malzeme kontrolü: tarif malzemelerini dolaptaki ürünlerle karşılaştır
  const getMissingIngredients = useCallback((meal: Meal): string[] => {
    if (!meal.recipeId) return [];
    const recipe = RECIPES_BY_ID[meal.recipeId];
    if (!recipe || !recipe.ingredients.length) return [];
    const pantryNames = pantryStore.items.map((p) => p.name.toLowerCase());
    return recipe.ingredients
      .filter((ing) => !pantryNames.some((pn) => pn.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(pn)))
      .map((ing) => ing.name);
  }, [pantryStore.items]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadPlan(), loadRecipeBook()]);
    } finally {
      setRefreshing(false);
    }
  }, [loadPlan, loadRecipeBook]);

  // Hafta degistiginde gun secimini sifirla
  useEffect(() => {
    if (isCurrentWeek) {
      setSelectedDayIndex(todayIndex);
    } else {
      setSelectedDayIndex(0);
    }
  }, [currentWeekKey]);

  const savedRecipes = useMemo(() => getAllSavedRecipes(), [entries]);

  const openAddModal = useCallback((slot: MealSlot) => {
    setAddingSlot(slot);
    setRecipeSearch('');
    setAddModalVisible(true);
  }, []);

  const addRecipeToSlot = useCallback((recipe: RecipeData) => {
    const newMeal: Meal = {
      id: `added-${Date.now()}`,
      slot: addingSlot,
      recipeId: recipe.id,
      foodName: recipe.title,
      emoji: recipe.emoji,
      ageGroup: recipe.ageGroup,
      calories: recipe.calories,
      completed: false,
      isFirstTry: false,
      allergenWarning: recipe.allergens.length > 0 ? recipe.allergens : undefined,
      nutrients: recipe.nutrients.slice(0, 2).map((n) => ({
        name: n.name,
        value: n.value,
        unit: n.unit,
      })),
    };
    addMealToSlot(selectedDayIndex, addingSlot, newMeal);
    setAddModalVisible(false);

    // Ogun hatirlatmasi zamanla
    if (notifPrefs.mealReminders && baby?.name) {
      scheduleMealReminder(addingSlot, baby.name).catch(console.error);
    }
  }, [addingSlot, selectedDayIndex, addMealToSlot, notifPrefs.mealReminders, baby?.name]);

  const handleRemoveMeal = useCallback((mealId: string, foodName?: string) => {
    haptics.warning();
    const doRemove = () => {
      removeMeal(selectedDayIndex, mealId);
      if (foodName) analytics.mealRemove(foodName);
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Bu ogunu plandan kaldirmak istiyor musunuz?')) {
        doRemove();
      }
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Ogunu Kaldir', 'Bu ogunu plandan kaldirmak istiyor musunuz?', [
        { text: 'Iptal', style: 'cancel' },
        { text: 'Kaldir', style: 'destructive', onPress: doRemove },
      ]);
    }
  }, [selectedDayIndex, removeMeal]);

  // Generate week days from currentWeekKey
  const weekDays = useMemo(() => {
    const dates = getWeekDates(currentWeekKey);
    const today = new Date();
    return ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'].map((label, i) => ({
      label,
      date: dates[i].getDate(),
      isToday: isSameDay(dates[i], today),
    }));
  }, [currentWeekKey]);

  const weekLabel = useMemo(() => getWeekLabel(currentWeekKey), [currentWeekKey]);

  // Secilen gunun yemekleri
  const meals = getDayMeals(selectedDayIndex);

  // Calculate progress
  const allMeals = Object.values(meals).flat();
  const completedCount = allMeals.filter((m) => m.completed).length;
  const totalCount = allMeals.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  // Weekly overview: meal counts per day
  const weeklyMealCounts = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
      const dayMeals = getDayMeals(dayIdx);
      return Object.values(dayMeals).flat().length;
    });
  }, [weekMeals, currentWeekKey, shuffleKey]);

  const generateWeeklyPlan = useMealPlanStore((s) => s.generateWeeklyPlan);

  // Shuffle handler — ogün sayisi sor ve plan olustur
  const handleShuffle = useCallback(() => {
    const { Alert } = require('react-native');
    const babyMonth = baby?.currentStage === '6m' ? 6 : baby?.currentStage === '8m' ? 8 : 12;
    const expiringNames = expiringItems.map((item: any) => item.name);

    Alert.alert(
      'Haftalik Plan Olustur',
      'Gunluk kac ogun olsun?',
      [
        { text: '2 Ogun', onPress: () => doGenerate(2, babyMonth, expiringNames) },
        { text: '3 Ogun', onPress: () => doGenerate(3, babyMonth, expiringNames) },
        { text: '4 Ogun', onPress: () => doGenerate(4, babyMonth, expiringNames) },
        { text: 'Iptal', style: 'cancel' },
      ]
    );
  }, [baby, expiringItems]);

  const doGenerate = useCallback((mealsPerDay: number, babyMonth: number, expiringNames: string[]) => {
    setIsShuffling(true);
    setTimeout(() => {
      generateWeeklyPlan(mealsPerDay, babyMonth, expiringNames);
      setShuffleKey((prev) => prev + 1);
      setIsShuffling(false);
    }, 800);
  }, [generateWeeklyPlan]);

  // Verisi olan tarifler (bos/verisiz tarifleri filtrele)
  const validRecipes = useMemo(() => {
    return ALL_RECIPES.filter(
      (r) => r.ingredients.length > 0 && r.steps.length > 0
    );
  }, []);

  // Arama ile filtrelenen tum tarifler
  const filteredAllRecipes = useMemo(() => {
    const q = recipeSearch.toLowerCase().trim();
    if (!q) return validRecipes;
    return validRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
    );
  }, [recipeSearch, validRecipes]);

  // Saved recipe IDs — saved olanlari "Tum Tarifler" bolumunde gostermeyecegiz (duplicate olmasin)
  const savedRecipeIds = useMemo(() => new Set(savedRecipes.map((r) => r.id)), [savedRecipes]);

  // Filtered saved recipes
  const filteredSavedRecipes = useMemo(() => {
    const q = recipeSearch.toLowerCase().trim();
    if (!q) return savedRecipes;
    return savedRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
    );
  }, [savedRecipes, recipeSearch]);

  // Filtered "other" recipes (not saved)
  const filteredOtherRecipes = useMemo(() => {
    return filteredAllRecipes.filter((r) => !savedRecipeIds.has(r.id));
  }, [filteredAllRecipes, savedRecipeIds]);

  const greetingText = new Date().getHours() < 12
    ? 'Gunaydin! \u{1F31E}'
    : new Date().getHours() < 18
    ? 'Iyi gunler! \u{2600}\u{FE0F}'
    : 'Iyi aksamlar! \u{1F319}';

  const subtitleText = !isCurrentWeek
    ? `${['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'][selectedDayIndex]} plani`
    : selectedDayIndex === todayIndex
    ? 'Bugunku beslenme planiniz hazir.'
    : `${['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'][selectedDayIndex]} plani`;

  // Handle day tap from weekly view
  const handleWeeklyDayTap = useCallback((dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setViewMode('daily');
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={greetingText}
        subtitle={subtitleText}
        emoji="\u{1F944}"
        rightActions={[
          { icon: '\u{1F6D2}', onPress: () => setShoppingModalVisible(true) },
        ]}
      />

      {/* View Mode Toggle: Gunluk / Haftalik */}
      <View style={styles.toggleContainer}>
        <View style={styles.togglePills}>
          <TouchableOpacity
            style={[
              styles.togglePill,
              viewMode === 'daily' && styles.togglePillActive,
            ]}
            onPress={() => setViewMode('daily')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.togglePillText,
                viewMode === 'daily' && styles.togglePillTextActive,
              ]}
            >
              Gunluk
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.togglePill,
              viewMode === 'weekly' && styles.togglePillActive,
            ]}
            onPress={() => setViewMode('weekly')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.togglePillText,
                viewMode === 'weekly' && styles.togglePillTextActive,
              ]}
            >
              Haftalik
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'weekly' ? (
        /* ======================== WEEKLY VIEW ======================== */
        <ScrollView
          style={styles.mealList}
          contentContainerStyle={styles.mealListContent}
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
          {/* Week Navigator */}
          <View style={styles.weekNavigator}>
            <TouchableOpacity onPress={() => { goToPreviousWeek(); analytics.weekNavigate('previous'); }} style={styles.weekNavBtn}>
              <Text style={styles.weekNavArrow}>{'\u25C0'}</Text>
            </TouchableOpacity>
            <View style={styles.weekNavCenter}>
              <Text style={styles.weekNavLabel}>{weekLabel}</Text>
              {!isCurrentWeek && (
                <TouchableOpacity onPress={() => { goToCurrentWeek(); analytics.weekNavigate('current'); }} style={styles.weekNavTodayBtn}>
                  <Text style={styles.weekNavTodayText}>Bugune Don</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => { goToNextWeek(); analytics.weekNavigate('next'); }} style={styles.weekNavBtn}>
              <Text style={styles.weekNavArrow}>{'\u25B6'}</Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Overview Card */}
          <View style={styles.weeklyCard}>
            <Text style={styles.weeklyCardTitle}>Haftalik Plan Ozeti</Text>
            <View style={styles.weeklyDaysRow}>
              {weekDays.map((day, index) => {
                const mealCount = weeklyMealCounts[index];
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.weeklyDayItem,
                      day.isToday && styles.weeklyDayItemToday,
                    ]}
                    onPress={() => handleWeeklyDayTap(index)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.weeklyDayLabel,
                        day.isToday && styles.weeklyDayLabelToday,
                      ]}
                    >
                      {day.label}
                    </Text>
                    <View
                      style={[
                        styles.weeklyDayCircle,
                        mealCount > 0 && styles.weeklyDayCircleFilled,
                        day.isToday && styles.weeklyDayCircleToday,
                      ]}
                    >
                      <Text
                        style={[
                          styles.weeklyDayCount,
                          mealCount > 0 && styles.weeklyDayCountFilled,
                          day.isToday && styles.weeklyDayCountToday,
                        ]}
                      >
                        {mealCount}
                      </Text>
                    </View>
                    <Text style={styles.weeklyDayMealLabel}>ogun</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Shuffle Button */}
          <TouchableOpacity
            style={[styles.shuffleButton, isShuffling && styles.shuffleButtonDisabled]}
            onPress={handleShuffle}
            activeOpacity={0.7}
            disabled={isShuffling}
          >
            <Text style={styles.shuffleIcon}>{'\u{1F500}'}</Text>
            <Text style={styles.shuffleText}>
              {isShuffling ? 'Karistiriliyor...' : 'Tarifleri Karistir'}
            </Text>
          </TouchableOpacity>

          {/* Ad Banner */}
          <AdBanner />
        </ScrollView>
      ) : (
        /* ======================== DAILY VIEW ======================== */
        <>
          {/* Week Navigator */}
          <View style={styles.weekNavigator}>
            <TouchableOpacity onPress={() => { goToPreviousWeek(); analytics.weekNavigate('previous'); }} style={styles.weekNavBtn}>
              <Text style={styles.weekNavArrow}>{'\u25C0'}</Text>
            </TouchableOpacity>
            <View style={styles.weekNavCenter}>
              <Text style={styles.weekNavLabel}>{weekLabel}</Text>
              {!isCurrentWeek && (
                <TouchableOpacity onPress={() => { goToCurrentWeek(); analytics.weekNavigate('current'); }} style={styles.weekNavTodayBtn}>
                  <Text style={styles.weekNavTodayText}>Bugune Don</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => { goToNextWeek(); analytics.weekNavigate('next'); }} style={styles.weekNavBtn}>
              <Text style={styles.weekNavArrow}>{'\u25B6'}</Text>
            </TouchableOpacity>
          </View>

          {/* Day Selector */}
          <View style={styles.daySelectorContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelector}>
              {weekDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDayIndex(index)}
                  style={[
                    styles.dayItem,
                    selectedDayIndex === index && styles.dayItemActive,
                    day.isToday && selectedDayIndex !== index && styles.dayItemToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      selectedDayIndex === index && styles.dayLabelActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                  <Text
                    style={[
                      styles.dayNumber,
                      selectedDayIndex === index && styles.dayNumberActive,
                    ]}
                  >
                    {day.date}
                  </Text>
                  {day.isToday && selectedDayIndex !== index && (
                    <View style={styles.todayDot} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Meal List */}
          <ScrollView
            style={styles.mealList}
            contentContainerStyle={styles.mealListContent}
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
            {/* Alerjen acma programi */}
            {[...getActivePrograms(), ...getPausedPrograms()].length > 0 ? (
              [...getActivePrograms(), ...getPausedPrograms()].map((prog) => {
                const report = getProgramReport(prog.id);
                const dayStatus = getProgramDayStatus(prog.id);
                const progress = report && report.totalMeals > 0 ? report.completedMeals / report.totalMeals : 0;
                const isPaused = prog.status === 'paused';
                const allergenName = prog.allergenType === 'other' && prog.customAllergenName
                  ? prog.customAllergenName
                  : getAllergenLabel(prog.allergenType);
                const lastSev = dayStatus?.lastReaction ? SEVERITY_LABELS[dayStatus.lastReaction.severity] : null;

                return (
                  <TouchableOpacity
                    key={prog.id}
                    style={[styles.allergenProgramBanner, isPaused && styles.allergenProgramPaused]}
                    onPress={() => setDetailProgram(prog)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 28 }}>{getAllergenEmoji(prog.allergenType)}</Text>
                    <View style={{ flex: 1, gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                        <Text style={styles.allergenProgramTitle}>
                          {allergenName} Acma
                        </Text>
                        {isPaused && (
                          <View style={styles.pausedBadge}>
                            <Text style={styles.pausedBadgeText}>{'\u23F8'} Duraklatildi</Text>
                          </View>
                        )}
                      </View>
                      {/* Ilerleme */}
                      <View style={styles.allergenProgressRow}>
                        <Text style={styles.allergenProgramSub}>
                          {dayStatus ? `Gun ${dayStatus.currentDay}/${prog.totalDays}` : `${prog.totalDays} gun`}
                          {' \u00B7 '}{report?.completedMeals || 0}/{report?.totalMeals || 0} ogun
                        </Text>
                        {lastSev && (
                          <Text style={[styles.allergenReactionBadge, { color: lastSev.color }]}>
                            {lastSev.emoji} {lastSev.label}
                          </Text>
                        )}
                      </View>
                      {/* Progress bar */}
                      <View style={styles.allergenProgressBg}>
                        <View style={[styles.allergenProgressFill, { width: `${progress * 100}%` }]} />
                      </View>
                      {/* Bugunku durum */}
                      {dayStatus && !isPaused && (
                        <Text style={styles.allergenTodayStatus}>
                          Bugun: {dayStatus.todayCompleted}/{dayStatus.todayMeals} ogun {dayStatus.todayCompleted >= dayStatus.todayMeals && dayStatus.todayMeals > 0 ? '\u2713' : ''}
                        </Text>
                      )}
                    </View>
                    {/* Aksiyon butonlari */}
                    <View style={{ gap: 6 }}>
                      {isPaused ? (
                        <TouchableOpacity
                          style={styles.allergenResumeBtn}
                          onPress={(e) => { e.stopPropagation(); resumeProgram(prog.id); }}
                        >
                          <Text style={styles.allergenResumeBtnText}>{'\u25B6'}</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.allergenDetailArrow}>{'\u25B6'}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : null}
            {getActivePrograms().length === 0 && getPausedPrograms().length === 0 && (
              <TouchableOpacity
                style={styles.allergenStartBtn}
                onPress={() => setAllergenModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 20 }}>{'\u2695\uFE0F'}</Text>
                <Text style={styles.allergenStartText}>Alerjen Acma Programi Baslat</Text>
                <Text style={styles.allergenStartArrow}>{'\u2192'}</Text>
              </TouchableOpacity>
            )}

            {!planLoaded ? (
              <MealSlotSkeleton count={3} />
            ) : null}

            {(Object.keys(MEAL_SLOT_LABELS) as MealSlot[]).map((slot) => (
              <View key={slot} style={styles.mealSection}>
                {/* Section Header */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    {MEAL_SLOT_LABELS[slot].emoji} {MEAL_SLOT_LABELS[slot].label.toUpperCase()}
                  </Text>
                  <TouchableOpacity onPress={() => openAddModal(slot)}>
                    <Text style={styles.addButton}>+ Ekle</Text>
                  </TouchableOpacity>
                </View>

                {/* Meal Cards - bos/verisiz tarifleri filtrele */}
                {meals[slot].filter((m) => {
                  if (!m.recipeId) return true; // recipeId yok ise goster (manual eklenmis)
                  const recipe = RECIPES_BY_ID[m.recipeId];
                  return !recipe || (recipe.ingredients.length > 0 && recipe.steps.length > 0);
                }).length > 0 ? (
                  meals[slot].filter((m) => {
                    if (!m.recipeId) return true;
                    const recipe = RECIPES_BY_ID[m.recipeId];
                    return !recipe || (recipe.ingredients.length > 0 && recipe.steps.length > 0);
                  }).map((meal) => (
                    <Card
                      key={meal.id}
                      variant={meal.allergenWarning?.length ? 'warning' : 'default'}
                      padding="md"
                      style={styles.mealCard}
                      onPress={() => setDetailMeal(meal)}
                    >
                      <View style={styles.mealCardContent}>
                        {/* Emoji circle */}
                        <View style={styles.emojiCircle}>
                          <Text style={styles.emoji}>{meal.emoji}</Text>
                        </View>

                        {/* Info */}
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName}>{meal.foodName}</Text>
                          <Text style={styles.mealMeta}>
                            {meal.ageGroup === '6m' ? '6+' : meal.ageGroup === '8m' ? '8+' : '12+'} ay
                            {meal.calories ? ` \u00B7 ${meal.calories} kcal` : ''}
                            {meal.prepTime ? ` \u00B7 ${meal.prepTime} dk` : ''}
                          </Text>
                          {(meal.ingredients?.length || meal.steps?.length) ? (
                            <Text style={styles.mealRecipeHint}>
                              {meal.ingredients?.length ? `\u{1F955} ${meal.ingredients.length} malzeme` : ''}
                              {meal.ingredients?.length && meal.steps?.length ? '  ' : ''}
                              {meal.steps?.length ? `\u{1F4DD} ${meal.steps.length} adim` : ''}
                            </Text>
                          ) : null}
                          {(() => {
                            const missing = getMissingIngredients(meal);
                            if (missing.length === 0) return null;
                            return (
                              <Text style={styles.missingIngredients}>
                                {'\u26A0\uFE0F'} Eksik: {missing.slice(0, 3).join(', ')}{missing.length > 3 ? ` +${missing.length - 3}` : ''}
                              </Text>
                            );
                          })()}
                          {/* Tags */}
                          <View style={styles.tagRow}>
                            {meal.nutrients?.map((n) => (
                              <NutrientBadge key={n.name} label={n.name} />
                            ))}
                            {meal.isFirstTry && <FirstTryBadge />}
                            {meal.allergenWarning?.map((a) => (
                              <AllergenBadge key={a} label="Alerjen" />
                            ))}
                          </View>
                        </View>

                        {/* Actions: checkbox + delete */}
                        <View style={styles.mealActions}>
                          <TouchableOpacity
                            onPress={() => {
                              haptics.success();
                              if (!meal.completed) analytics.mealComplete(meal.foodName);
                              toggleMealCompleted(selectedDayIndex, meal.id);

                              // Ilk deneme ogunu tamamlandiysa alerjen takip bildirimi zamanla
                              if (!meal.completed && meal.isFirstTry && notifPrefs.allergenTracking && baby?.name) {
                                scheduleAllergenCheck(meal.foodName, baby.name).catch(console.error);
                              }

                              // Alerjen iceren ogun tamamlandiysa ve aktif program varsa -> reaksiyon modal ac
                              if (!meal.completed && meal.allergenWarning?.length) {
                                const activeProgs = getActivePrograms();
                                const matchingProg = activeProgs.find((p) =>
                                  meal.allergenWarning!.includes(p.allergenType)
                                );
                                if (matchingProg) {
                                  // Hangi gun oldugunu bul
                                  const dayPlan = matchingProg.dailyPlan.find((d) =>
                                    d.meals.some((m) => m.id === meal.id)
                                  );
                                  if (dayPlan) {
                                    setReactionModal({
                                      visible: true,
                                      allergenType: matchingProg.allergenType,
                                      programId: matchingProg.id,
                                      day: dayPlan.day,
                                      mealId: meal.id,
                                      mealName: meal.foodName,
                                    });
                                  }
                                }
                              }
                            }}
                            style={[
                              styles.checkbox,
                              meal.completed && styles.checkboxDone,
                            ]}
                            accessibilityRole="checkbox"
                            accessibilityLabel={`${meal.foodName} ${meal.completed ? 'tamamlandi' : 'tamamlanmadi'}`}
                            accessibilityState={{ checked: meal.completed }}
                          >
                            {meal.completed && (
                              <Text style={styles.checkmark}>{'\u2713'}</Text>
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleRemoveMeal(meal.id, meal.foodName)}
                            accessibilityRole="button"
                            accessibilityLabel={`${meal.foodName} ogunu kaldir`}
                            style={styles.removeBtn}
                          >
                            <Text style={styles.removeIcon}>{'\u2715'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Card>
                  ))
                ) : (
                  <TouchableOpacity
                    style={styles.emptySlot}
                    onPress={() => openAddModal(slot)}
                  >
                    <Text style={styles.emptySlotText}>
                      + Ogun eklemek icin dokunun
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Progress Bar */}
            <Card padding="lg" style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Gunluk Ilerleme</Text>
                <Text style={styles.progressCount}>
                  {completedCount}/{totalCount} tamamlandi
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
                />
              </View>
            </Card>

            {/* Alisveris Modulu - Shopping Summary Card */}
            <TouchableOpacity
              style={styles.shoppingCard}
              onPress={() => setShoppingModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.shoppingCardIcon}>{'\u{1F6D2}'}</Text>
              <View style={styles.shoppingCardInfo}>
                <Text style={styles.shoppingCardTitle}>Alisveris Listesi</Text>
                <Text style={styles.shoppingCardSub}>
                  {shoppingItemCount > 0
                    ? `${shoppingItemCount} urun alisveris listesinde`
                    : 'Henuz urun eklenmedi'}
                </Text>
              </View>
              <Text style={styles.shoppingCardArrow}>{'\u2192'}</Text>
            </TouchableOpacity>

            {/* Ad Banner */}
            <AdBanner />

            {/* Bayatlayacak Urunler Uyarisi - Dismissable */}
            {showExpiringWarning && expiringItems.length > 0 && (
              <View style={styles.expiringWarningBanner}>
                <View style={styles.expiringWarningHeader}>
                  <View style={styles.expiringWarningTitleRow}>
                    <Text style={styles.expiringWarningIcon}>{'\u26A0\uFE0F'}</Text>
                    <Text style={styles.expiringWarningTitle}>Bayatlayacak Urunler</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowExpiringWarning(false);
                      if (expiringTimerRef.current) {
                        clearTimeout(expiringTimerRef.current);
                      }
                    }}
                    style={styles.expiringWarningClose}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.expiringWarningCloseText}>{'\u2715'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.expiringWarningText}>
                  {expiringItems.length} urun 3 gun icinde bayatlayacak!
                </Text>
                <View style={styles.expiringWarningItems}>
                  {expiringItems.slice(0, 5).map((item) => (
                    <View key={item.id} style={styles.expiringWarningChip}>
                      <Text style={styles.expiringWarningChipEmoji}>{item.emoji}</Text>
                      <Text style={styles.expiringWarningChipName}>{item.name}</Text>
                      <Text style={styles.expiringWarningChipDays}>
                        {item.daysLeft === 0 ? 'Bugun!' : `${item.daysLeft}g`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </>
      )}

      {/* Shopping List Modal */}
      <ShoppingListModal
        visible={shoppingModalVisible}
        onClose={() => setShoppingModalVisible(false)}
        weekMeals={weekMeals}
        pantryItems={pantryStore.items.map((item) => ({
          name: item.name,
          emoji: item.emoji,
          amount: item.amount,
          unit: item.unit,
          daysLeft: item.daysLeft,
        }))}
      />

      {/* Allergen Intro Modal */}
      <AllergenIntroModal
        visible={allergenModalVisible}
        onClose={() => setAllergenModalVisible(false)}
      />

      {/* Allergen Reaction Modal */}
      <AllergenReactionModal
        visible={reactionModal.visible}
        onClose={() => setReactionModal((prev) => ({ ...prev, visible: false }))}
        allergenType={reactionModal.allergenType}
        programId={reactionModal.programId}
        day={reactionModal.day}
        mealId={reactionModal.mealId}
        mealName={reactionModal.mealName}
      />

      <MealDetailModal
        visible={!!detailMeal}
        meal={detailMeal}
        onClose={() => setDetailMeal(null)}
      />

      <AllergenProgramDetailModal
        visible={!!detailProgram}
        program={detailProgram}
        onClose={() => setDetailProgram(null)}
      />

      {/* Add from Recipe Book Modal — Gelismis */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
              <Text style={styles.modalClose}>{'\u2715'}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {MEAL_SLOT_LABELS[addingSlot]?.emoji}{' '}
              {MEAL_SLOT_LABELS[addingSlot]?.label} Ekle
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Arama */}
          <View style={styles.modalSearchContainer}>
            <View style={styles.modalSearchWrapper}>
              <Text style={styles.modalSearchIcon}>{'\u{1F50D}'}</Text>
              <TextInput
                style={styles.modalSearchInput}
                value={recipeSearch}
                onChangeText={setRecipeSearch}
                placeholder="Tarif veya malzeme ara..."
                placeholderTextColor={colors.border}
              />
              {recipeSearch.length > 0 && (
                <TouchableOpacity onPress={() => setRecipeSearch('')}>
                  <Text style={styles.modalSearchClear}>{'\u2715'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* From Recipe Book */}
            {filteredSavedRecipes.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>{'\u{1F4D6}'} Tarif Defterimden</Text>
                {filteredSavedRecipes.map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.modalRecipeItem}
                    onPress={() => addRecipeToSlot(recipe)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.modalRecipeEmoji}>
                      <Text style={{ fontSize: 26 }}>{recipe.emoji}</Text>
                    </View>
                    <View style={styles.modalRecipeInfo}>
                      <Text style={styles.modalRecipeName}>{recipe.title}</Text>
                      <Text style={styles.modalRecipeMeta}>
                        {recipe.prepTime} dk {'\u00B7'} {recipe.calories} kcal {'\u00B7'}{' '}
                        {recipe.ageGroup === '6m' ? '6+' : recipe.ageGroup === '8m' ? '8+' : '12+'} ay
                      </Text>
                      {recipe.allergens.length > 0 && (
                        <Text style={styles.modalRecipeAllergen}>
                          {'\u26A0\uFE0F'} Alerjen: {recipe.allergens.join(', ')}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.modalRecipeAdd}>{'\uFF0B'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* All Recipes */}
            {filteredOtherRecipes.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>{'\u{1F37D}\uFE0F'} Tum Tarifler</Text>
                {filteredOtherRecipes.slice(0, 20).map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.modalRecipeItem}
                    onPress={() => addRecipeToSlot(recipe)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.modalRecipeEmoji}>
                      <Text style={{ fontSize: 26 }}>{recipe.emoji}</Text>
                    </View>
                    <View style={styles.modalRecipeInfo}>
                      <Text style={styles.modalRecipeName}>{recipe.title}</Text>
                      <Text style={styles.modalRecipeMeta}>
                        {recipe.prepTime} dk {'\u00B7'} {recipe.calories} kcal {'\u00B7'}{' '}
                        {recipe.ageGroup === '6m' ? '6+' : recipe.ageGroup === '8m' ? '8+' : '12+'} ay
                      </Text>
                      {recipe.allergens.length > 0 && (
                        <Text style={styles.modalRecipeAllergen}>
                          {'\u26A0\uFE0F'} Alerjen: {recipe.allergens.join(', ')}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.modalRecipeAdd}>{'\uFF0B'}</Text>
                  </TouchableOpacity>
                ))}
                {filteredOtherRecipes.length > 20 && (
                  <Text style={styles.modalMoreText}>
                    +{filteredOtherRecipes.length - 20} tarif daha — arama yaparak bulun
                  </Text>
                )}
              </View>
            )}

            {/* Empty state */}
            {filteredSavedRecipes.length === 0 && filteredOtherRecipes.length === 0 && (
              <View style={styles.modalEmpty}>
                <Text style={{ fontSize: 48 }}>{'\u{1F50D}'}</Text>
                <Text style={styles.modalEmptyTitle}>Sonuc bulunamadi</Text>
                <Text style={styles.modalEmptyText}>
                  Farkli bir arama terimi deneyin.
                </Text>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.sage,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: colors.white,
  },
  greetingSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.xs,
  },
  mascot: {
    fontSize: 40,
  },

  // Toggle pills
  toggleContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
    alignItems: 'center',
  },
  togglePills: {
    flexDirection: 'row',
    backgroundColor: colors.creamMid,
    borderRadius: BorderRadius.round,
    padding: 3,
  },
  togglePill: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  togglePillActive: {
    backgroundColor: colors.sage,
  },
  togglePillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: colors.textMid,
  },
  togglePillTextActive: {
    color: colors.textOnPrimary,
  },

  // Week navigator
  weekNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  weekNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.creamMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekNavArrow: {
    fontSize: 14,
    color: colors.sage,
  },
  weekNavCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  weekNavLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  weekNavTodayBtn: {
    backgroundColor: colors.sagePale,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  weekNavTodayText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: colors.sage,
  },
  daySelectorContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  daySelector: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  dayItem: {
    width: 44,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayItemActive: {
    backgroundColor: colors.sage,
  },
  dayItemToday: {
    borderWidth: 1.5,
    borderColor: colors.sage,
  },
  todayDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.sage,
  },
  dayLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  dayLabelActive: {
    color: colors.white,
    fontFamily: FontFamily.semiBold,
  },
  dayNumber: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: colors.textLight,
  },
  dayNumberActive: {
    color: colors.white,
    fontFamily: FontFamily.bold,
  },
  mealList: {
    flex: 1,
  },
  mealListContent: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  mealSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.textLight,
    letterSpacing: 1,
  },
  addButton: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: colors.sage,
  },
  mealCard: {
    marginBottom: Spacing.sm,
  },
  mealCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.creamMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  mealInfo: {
    flex: 1,
    gap: 3,
  },
  mealName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: colors.textDark,
  },
  mealMeta: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textLight,
  },
  mealRecipeHint: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.sage,
    marginTop: 2,
  },
  missingIngredients: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: '#E65100',
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  mealActions: {
    alignItems: 'center',
    gap: 6,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.sagePale,
    borderColor: colors.sage,
  },
  checkmark: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: colors.success,
  },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#D32F2F',
  },
  emptySlot: {
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptySlotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textLight,
  },
  progressCard: {
    marginTop: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: colors.textDark,
  },
  progressCount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.sage,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.creamDark,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },

  // Allergen program
  allergenProgramBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: colors.peach,
  },
  allergenProgramPaused: {
    backgroundColor: colors.peachLight,
    borderColor: colors.warning,
  },
  allergenProgramTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.warningDark,
  },
  allergenProgramSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.warning,
  },
  allergenProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  allergenReactionBadge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  allergenProgressBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.peach,
  },
  allergenProgressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.warningDark,
  },
  allergenTodayStatus: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.dangerDark,
  },
  allergenDetailArrow: {
    fontSize: 14,
    color: colors.warning,
  },
  allergenResumeBtn: {
    backgroundColor: colors.sage,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
  },
  allergenResumeBtnText: {
    fontSize: 14,
    color: colors.white,
  },
  pausedBadge: {
    backgroundColor: colors.warning,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
  },
  pausedBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: colors.warningDark,
  },
  allergenCancelBtn: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: colors.heart,
  },
  allergenCancelText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: colors.dangerDark,
  },
  allergenStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderStyle: 'dashed' as any,
  },
  allergenStartText: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: colors.textLight,
  },
  allergenStartArrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: colors.textLight,
  },

  // Shopping Summary Card
  shoppingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.md,
    ...Shadow.soft,
  },
  shoppingCardIcon: {
    fontSize: 24,
  },
  shoppingCardInfo: {
    flex: 1,
    gap: 2,
  },
  shoppingCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  shoppingCardSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  shoppingCardArrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: colors.sage,
  },

  // Weekly View
  weeklyCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg,
    ...Shadow.card,
  },
  weeklyCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: colors.textDark,
    textAlign: 'center',
  },
  weeklyDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  weeklyDayItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  weeklyDayItemToday: {
    backgroundColor: colors.sagePale,
    borderRadius: BorderRadius.md,
  },
  weeklyDayLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  weeklyDayLabelToday: {
    color: colors.sage,
    fontFamily: FontFamily.bold,
  },
  weeklyDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.creamMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyDayCircleFilled: {
    backgroundColor: colors.sageLight,
  },
  weeklyDayCircleToday: {
    backgroundColor: colors.sage,
  },
  weeklyDayCount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: colors.textLight,
  },
  weeklyDayCountFilled: {
    color: colors.sageDark,
  },
  weeklyDayCountToday: {
    color: colors.textOnPrimary,
  },
  weeklyDayMealLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    color: colors.textLight,
  },

  // Shuffle Button
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginTop: Spacing.md,
    ...Shadow.soft,
  },
  shuffleButtonDisabled: {
    opacity: 0.6,
  },
  shuffleIcon: {
    fontSize: 18,
  },
  shuffleText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: colors.textOnPrimary,
  },

  // Expiring Warning Banner
  expiringWarningBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFB74D',
    gap: Spacing.sm,
  },
  expiringWarningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiringWarningTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  expiringWarningIcon: {
    fontSize: 18,
  },
  expiringWarningTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: '#E65100',
  },
  expiringWarningClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(230, 81, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiringWarningCloseText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#E65100',
  },
  expiringWarningText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: '#BF360C',
  },
  expiringWarningItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  expiringWarningChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 183, 77, 0.2)',
    borderRadius: BorderRadius.round,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  expiringWarningChipEmoji: {
    fontSize: 14,
  },
  expiringWarningChipName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: '#BF360C',
  },
  expiringWarningChipDays: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#E65100',
  },

  // Shopping List Button (legacy, kept for compatibility)
  shoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.sage,
    ...Shadow.soft,
  },
  shoppingButtonEmoji: {
    fontSize: 28,
  },
  shoppingButtonInfo: {
    flex: 1,
    gap: 2,
  },
  shoppingButtonTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: colors.sage,
  },
  shoppingButtonSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  shoppingButtonArrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: colors.sage,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  modalClose: {
    fontSize: 20,
    color: colors.textLight,
    width: 28,
    textAlign: 'center',
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: colors.textDark,
  },
  modalSearchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  modalSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    height: 44,
    ...Shadow.soft,
  },
  modalSearchIcon: {
    fontSize: 14,
    marginRight: Spacing.md,
  },
  modalSearchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  modalSearchClear: {
    fontSize: 16,
    color: colors.textLight,
    paddingLeft: Spacing.sm,
  },
  modalContent: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: 100,
  },
  modalSection: {
    gap: Spacing.md,
  },
  modalSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: colors.textDark,
    marginBottom: Spacing.xs,
  },
  modalRecipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadow.soft,
  },
  modalRecipeEmoji: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.creamMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalRecipeInfo: {
    flex: 1,
    gap: 3,
  },
  modalRecipeName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  modalRecipeMeta: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  modalRecipeAllergen: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: colors.warning,
  },
  modalRecipeAdd: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: colors.sage,
    width: 32,
    textAlign: 'center',
  },
  modalMoreText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  modalEmpty: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
    gap: Spacing.md,
  },
  modalEmptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: colors.textDark,
  },
  modalEmptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xl,
  },
});
