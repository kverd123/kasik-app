/**
 * Kaşık — Empty State
 * Reusable boş durum bileşeni — veri olmadığında gösterilir
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '../../constants/theme';

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export function EmptyState({ emoji, title, subtitle, ctaLabel, onCtaPress }: EmptyStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.textDark }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textLight }]}>{subtitle}</Text>}
      {ctaLabel && onCtaPress && (
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: colors.sage }]}
          onPress={onCtaPress}
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
        >
          <Text style={[styles.ctaText, { color: colors.white }]}>{ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaButton: {
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  ctaText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
});
