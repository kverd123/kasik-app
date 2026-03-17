/**
 * Kaşık — ExpiringBanner
 * Dolaptaki bayatlayacak ürünleri gösterir ve bu ürünleri kullanan tarifler önerir
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { usePantryStore, PantryEntry } from '../../stores/pantryStore';
import { ALL_RECIPES, RecipeData } from '../../constants/recipes';

interface ExpiringBannerProps {
  withinDays?: number;
  onRecipePress?: (recipe: RecipeData) => void;
  onAddToPlan?: (recipe: RecipeData) => void;
}

export function ExpiringBanner({ withinDays = 3, onRecipePress, onAddToPlan }: ExpiringBannerProps) {
  const colors = useColors();
  const { getExpiringItems, items } = usePantryStore();

  const expiringItems = useMemo(() => getExpiringItems(withinDays), [items, withinDays]);

  // Bu ürünleri kullanan tarifler bul
  const suggestedRecipes = useMemo(() => {
    if (expiringItems.length === 0) return [];

    const expiringNames = expiringItems.map((i) => i.name.toLowerCase());

    // Tarif ingredients'ında expiring item ismi geçen tarifleri bul
    const matches = ALL_RECIPES.filter((recipe) => {
      const ingredientText = recipe.ingredients
        .map((ing) => ing.name.toLowerCase())
        .join(' ');
      return expiringNames.some((name) => ingredientText.includes(name));
    });

    // En çok eşleşen 3 tarif
    return matches.slice(0, 3);
  }, [expiringItems]);

  if (expiringItems.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.warningBg, borderColor: colors.warning }]}>
      {/* Uyarı başlığı */}
      <View style={styles.header}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: colors.warningDark }]}>Bayatlayacak Ürünler</Text>
          <Text style={[styles.subtitle, { color: colors.warningDark }]}>
            {expiringItems.length} ürün {withinDays} gün içinde bayatlayacak
          </Text>
        </View>
      </View>

      {/* Ürün listesi */}
      <View style={styles.itemsRow}>
        {expiringItems.map((item) => (
          <View key={item.id} style={[styles.itemChip, { backgroundColor: colors.white }]}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={[styles.itemName, { color: colors.textDark }]}>{item.name}</Text>
            <Text style={[styles.itemDays, { color: colors.heart }]}>
              {item.daysLeft === 0 ? 'Bugün!' : item.daysLeft === 1 ? '1 gün' : `${item.daysLeft} gün`}
            </Text>
          </View>
        ))}
      </View>

      {/* Önerilen tarifler */}
      {suggestedRecipes.length > 0 && (
        <View style={styles.recipesSection}>
          <Text style={[styles.recipesTitle, { color: colors.warningDark }]}>💡 Bu ürünlerle yapabileceğiniz:</Text>
          {suggestedRecipes.map((recipe) => (
            <View key={recipe.id} style={[styles.recipeItem, { backgroundColor: colors.white }]}>
              <TouchableOpacity
                style={styles.recipeMain}
                onPress={() => onRecipePress?.(recipe)}
                activeOpacity={0.7}
              >
                <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
                <View style={styles.recipeInfo}>
                  <Text style={[styles.recipeName, { color: colors.textDark }]}>{recipe.title}</Text>
                  <Text style={[styles.recipeMeta, { color: colors.textLight }]}>
                    {recipe.prepTime} dk · {recipe.calories} kcal
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addToPlanBtn, { backgroundColor: colors.sagePale }]}
                onPress={() => onAddToPlan?.(recipe)}
                activeOpacity={0.7}
              >
                <Text style={[styles.addToPlanIcon, { color: colors.sage }]}>＋</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    ...Shadow.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  warningIcon: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.round,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  itemEmoji: {
    fontSize: 14,
  },
  itemName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  itemDays: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
  },
  recipesSection: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  recipesTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  recipeMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  recipeEmoji: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  recipeInfo: {
    flex: 1,
    gap: 1,
  },
  recipeName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  recipeMeta: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
  },
  addToPlanBtn: {
    width: 40,
    height: '100%' as any,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToPlanIcon: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
  },
});
