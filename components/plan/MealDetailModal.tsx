/**
 * Kaşık — Öğün Detay Modalı
 * Plan ekranında öğüne tıklayınca tarif detaylarını gösterir
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { Meal, AllergenType } from '../../types';
import { RECIPES_BY_ID, RecipeIngredient } from '../../constants/recipes';
import { getAllergenLabel, getAllergenEmoji } from '../../constants/allergens';

interface MealDetailModalProps {
  visible: boolean;
  meal: Meal | null;
  onClose: () => void;
}

export function MealDetailModal({ visible, meal, onClose }: MealDetailModalProps) {
  const colors = useColors();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleClose = () => {
    setCompletedSteps(new Set());
    onClose();
  };

  const recipeData = useMemo(() => {
    if (!meal) return null;
    const fromRecipe = meal.recipeId ? RECIPES_BY_ID[meal.recipeId] : null;
    return {
      ingredients: meal.ingredients || fromRecipe?.ingredients?.map((ing: RecipeIngredient) => ({
        name: ing.name,
        emoji: ing.emoji,
        amount: ing.amount,
        unit: ing.unit,
        isAllergen: ing.isAllergen,
      })) || null,
      steps: meal.steps || fromRecipe?.steps || null,
      prepTime: meal.prepTime || fromRecipe?.prepTime || null,
      calories: meal.calories || fromRecipe?.calories || null,
      tip: fromRecipe?.tip || null,
    };
  }, [meal]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const hasDetails = recipeData && (recipeData.ingredients || recipeData.steps);

  if (!meal) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={[styles.headerClose, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textDark }]} numberOfLines={1}>Tarif Detayı</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.heroSection}>
            <View style={[styles.heroEmoji, { backgroundColor: colors.white }]}>
              <Text style={{ fontSize: 48 }}>{meal.emoji}</Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.textDark }]}>{meal.foodName}</Text>
          </View>

          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
              <Text style={[styles.badgeText, { color: colors.textMid }]}>
                {meal.ageGroup === '6m' ? '6+ ay' : meal.ageGroup === '8m' ? '8+ ay' : '12+ ay'}
              </Text>
            </View>
            {recipeData?.prepTime && (
              <View style={[styles.badge, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
                <Text style={[styles.badgeText, { color: colors.textMid }]}>⏱ {recipeData.prepTime} dk</Text>
              </View>
            )}
            {recipeData?.calories && (
              <View style={[styles.badge, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
                <Text style={[styles.badgeText, { color: colors.textMid }]}>🔥 {recipeData.calories} kcal</Text>
              </View>
            )}
            {meal.isFirstTry && (
              <View style={[styles.badge, { backgroundColor: colors.peachLight, borderColor: colors.warning }]}>
                <Text style={[styles.badgeText, { color: colors.warningDark }]}>🌟 İlk Deneme</Text>
              </View>
            )}
          </View>

          {/* Allergen warning */}
          {meal.allergenWarning && meal.allergenWarning.length > 0 && (
            <View style={[styles.allergenBox, { backgroundColor: colors.warningBg, borderColor: colors.peach }]}>
              <Text style={[styles.allergenBoxTitle, { color: colors.warningDark }]}>⚠️ Alerjen İçeriyor</Text>
              <View style={styles.allergenChipRow}>
                {meal.allergenWarning.map((a: AllergenType) => (
                  <View key={a} style={[styles.allergenChip, { backgroundColor: colors.peach }]}>
                    <Text style={[styles.allergenChipText, { color: colors.warningDark }]}>
                      {getAllergenEmoji(a)} {getAllergenLabel(a)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Ingredients */}
          {recipeData?.ingredients && recipeData.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textDark }]}>🥕 Malzemeler</Text>
              <View style={[styles.sectionCard, { backgroundColor: colors.white }]}>
                {recipeData.ingredients.map((ing, index) => (
                  <View
                    key={index}
                    style={[
                      styles.ingredientRow,
                      { borderBottomColor: colors.creamDark + '60' },
                      index === recipeData.ingredients!.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View style={styles.ingredientLeft}>
                      <Text style={styles.ingredientEmoji}>{ing.emoji}</Text>
                      <Text style={[styles.ingredientName, { color: colors.textDark }]}>
                        {ing.name}
                        {ing.isAllergen && <Text style={{ color: colors.warningDark }}> ⚠️</Text>}
                      </Text>
                    </View>
                    <Text style={[styles.ingredientAmount, { color: colors.textLight }]}>
                      {ing.amount % 1 === 0 ? ing.amount : ing.amount.toFixed(1)} {ing.unit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Steps */}
          {recipeData?.steps && recipeData.steps.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text style={[styles.sectionTitle, { color: colors.textDark }]}>📝 Yapılışı</Text>
                {completedSteps.size > 0 && (
                  <Text style={[styles.stepProgress, { color: colors.sage }]}>
                    {completedSteps.size}/{recipeData.steps.length}
                  </Text>
                )}
              </View>
              <View style={[styles.sectionCard, { backgroundColor: colors.white }]}>
                {recipeData.steps.map((stepText, index) => {
                  const isDone = completedSteps.has(index);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.stepRow, isDone && styles.stepRowDone]}
                      onPress={() => toggleStep(index)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.stepCircle,
                        { backgroundColor: colors.creamDark },
                        isDone && { backgroundColor: colors.sage },
                      ]}>
                        <Text style={[
                          styles.stepNumber,
                          { color: colors.textMid },
                          isDone && { color: colors.white },
                        ]}>
                          {isDone ? '✓' : index + 1}
                        </Text>
                      </View>
                      <Text style={[
                        styles.stepText,
                        { color: colors.textDark },
                        isDone && { textDecorationLine: 'line-through', color: colors.textLight },
                      ]}>
                        {stepText}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Tip */}
          {recipeData?.tip && (
            <View style={[styles.tipBox, { backgroundColor: colors.successBg, borderColor: colors.sageLight }]}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={[styles.tipText, { color: colors.success }]}>{recipeData.tip}</Text>
            </View>
          )}

          {/* Note */}
          {meal.notes && (
            <View style={[styles.noteBox, { backgroundColor: colors.creamDark + '40' }]}>
              <Text style={styles.noteIcon}>📝</Text>
              <Text style={[styles.noteText, { color: colors.textMid }]}>{meal.notes}</Text>
            </View>
          )}

          {/* Empty state */}
          {!hasDetails && (
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 36 }}>📋</Text>
              <Text style={[styles.emptyTitle, { color: colors.textMid }]}>Tarif detayı yok</Text>
              <Text style={[styles.emptyDesc, { color: colors.textLight }]}>
                Bu öğün için malzeme ve adım bilgisi eklenmemiş.
                {meal.recipeId ? '' : ' Alerjen programında öğünü düzenleyerek detay ekleyebilirsiniz.'}
              </Text>
            </View>
          )}

          {/* Full recipe button */}
          {meal.recipeId && RECIPES_BY_ID[meal.recipeId] && (
            <TouchableOpacity
              style={[styles.fullRecipeBtn, { backgroundColor: colors.sage }]}
              onPress={() => {
                handleClose();
                router.push(`/recipe/${meal.recipeId}`);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.fullRecipeBtnText, { color: colors.white }]}>Tam Tarifi Gör →</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerClose: { fontSize: 20, width: 28, textAlign: 'center' },
  headerTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg,
    flex: 1, textAlign: 'center',
  },
  content: { padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 60 },

  heroSection: { alignItems: 'center', gap: Spacing.md },
  heroEmoji: {
    width: 88, height: 88, borderRadius: 44,
    justifyContent: 'center', alignItems: 'center', ...Shadow.soft,
  },
  heroTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.xxl,
    textAlign: 'center',
  },

  badgeRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.sm,
  },
  badge: {
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderWidth: 1,
  },
  badgeText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },

  allergenBox: {
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, gap: Spacing.sm,
  },
  allergenBoxTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.base,
  },
  allergenChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  allergenChip: {
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  allergenChipText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },

  section: { gap: Spacing.sm },
  sectionTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md, ...Shadow.soft,
  },

  ingredientRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.sm, borderBottomWidth: 1,
  },
  ingredientLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  ingredientEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  ingredientName: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md, flex: 1,
  },
  ingredientAmount: {
    fontFamily: FontFamily.semiBold, fontSize: FontSize.sm,
  },

  stepProgress: {
    fontFamily: FontFamily.semiBold, fontSize: FontSize.sm,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  stepRowDone: { opacity: 0.5 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginTop: 2,
  },
  stepNumber: {
    fontFamily: FontFamily.bold, fontSize: 12,
  },
  stepText: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md,
    lineHeight: 22,
  },

  tipBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1,
  },
  tipIcon: { fontSize: 20 },
  tipText: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.sm,
    lineHeight: 20,
  },

  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
  },
  noteIcon: { fontSize: 18 },
  noteText: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.sm,
    lineHeight: 20,
  },

  emptyBox: {
    alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg,
  },
  emptyDesc: {
    fontFamily: FontFamily.medium, fontSize: FontSize.sm,
    textAlign: 'center', lineHeight: 20,
  },

  fullRecipeBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  fullRecipeBtnText: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg,
  },
});
