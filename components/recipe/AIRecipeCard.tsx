/**
 * Kaşık — AI Recipe Card Component
 * Displays AI-generated recipe with special styling
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { Badge, AllergenBadge } from '../ui/Badge';
import { AIRecipeResult } from '../../lib/ai-recipes';

interface AIRecipeCardProps {
  recipe: AIRecipeResult;
  onPress: () => void;
  onSave?: () => void;
}

export const AIRecipeCard: React.FC<AIRecipeCardProps> = ({ recipe, onPress, onSave }) => {
  const colors = useColors();
  const difficultyLabel = recipe.difficulty === 'easy' ? 'Kolay'
    : recipe.difficulty === 'medium' ? 'Orta' : 'Zor';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.card, { backgroundColor: colors.white, borderColor: colors.sageLight }]}>
      {/* AI badge */}
      <View style={[styles.aiBadge, { backgroundColor: colors.sagePale }]}>
        <Text style={[styles.aiBadgeText, { color: colors.sageDark }]}>🤖 AI Tarif</Text>
      </View>

      <View style={styles.content}>
        {/* Emoji */}
        <View style={[styles.emojiCircle, { backgroundColor: colors.sagePale }]}>
          <Text style={styles.emoji}>{recipe.emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.textDark }]} numberOfLines={2}>{recipe.title}</Text>
          <Text style={[styles.description, { color: colors.textLight }]} numberOfLines={1}>{recipe.description}</Text>
          <Text style={[styles.meta, { color: colors.textLight }]}>
            {recipe.ageGroup === '6m' ? '6+' : recipe.ageGroup === '8m' ? '8+' : '12+'} ay · {recipe.prepTime} dk · {recipe.calories} kcal
          </Text>

          {/* Tags */}
          <View style={styles.tagRow}>
            <Badge label={difficultyLabel} variant={
              recipe.difficulty === 'easy' ? 'success' : recipe.difficulty === 'medium' ? 'info' : 'danger'
            } />
            {recipe.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} label={tag} variant="success" />
            ))}
            {recipe.allergens.length > 0 && (
              <AllergenBadge label="Alerjen" />
            )}
          </View>
        </View>

        {/* Save button */}
        {onSave && (
          <TouchableOpacity onPress={onSave} style={[styles.saveBtn, { backgroundColor: colors.sagePale }]}>
            <Text style={styles.saveIcon}>💾</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tip */}
      {recipe.tip && (
        <View style={[styles.tipContainer, { backgroundColor: colors.cream }]}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={[styles.tipText, { color: colors.textMid }]} numberOfLines={2}>{recipe.tip}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
    ...Shadow.card,
  },
  aiBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  aiBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: 'center',
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 28 },
  info: { flex: 1, gap: 3 },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },
  meta: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  saveBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: { fontSize: 18 },
  tipContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  tipIcon: { fontSize: 14 },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 11,
    lineHeight: 16,
  },
});
