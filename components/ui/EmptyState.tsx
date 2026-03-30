/**
 * Kaşık — Empty State
 * Reusable boş durum bileşeni — veri olmadığında gösterilir
 * Emoji artık sage tonlu dairesel arka plan içinde gösterilir
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  emoji?: string;
  icon?: IoniconsName;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export function EmptyState({ emoji, icon, title, subtitle, ctaLabel, onCtaPress }: EmptyStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container} accessibilityRole="text">
      <View style={[styles.iconCircle, { backgroundColor: colors.sagePale }]}>
        {icon ? (
          <Ionicons name={icon} size={40} color={colors.sage} />
        ) : (
          <Text style={styles.emoji}>{emoji}</Text>
        )}
      </View>
      <Text style={[styles.title, { color: colors.textDark }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textLight }]}>{subtitle}</Text>}
      {ctaLabel && onCtaPress && (
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: colors.sage }]}
          onPress={onCtaPress}
          activeOpacity={0.8}
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
    paddingVertical: Spacing.xxxl * 1.5,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  ctaButton: {
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: Spacing.md,
    shadowColor: '#8FAA7B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
  },
});
