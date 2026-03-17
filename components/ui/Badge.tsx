/**
 * Kaşık — Badge Component
 * Allergen warnings, nutrient tags, status badges
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, BorderRadius, Spacing } from '../../constants/theme';

type BadgeVariant = 'success' | 'warning' | 'info' | 'danger' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  size = 'sm',
}) => {
  const colors = useColors();

  const variantBgStyles: Record<BadgeVariant, ViewStyle> = {
    success: { backgroundColor: colors.successBg },
    warning: { backgroundColor: colors.warningBg },
    info: { backgroundColor: colors.infoBg },
    danger: { backgroundColor: colors.dangerBg },
    neutral: { backgroundColor: colors.creamMid },
  };

  const variantTextStyles: Record<BadgeVariant, TextStyle> = {
    success: { color: colors.success },
    warning: { color: colors.warningDark },
    info: { color: colors.info },
    danger: { color: colors.heartDark },
    neutral: { color: colors.textLight },
  };

  return (
    <View style={[styles.base, variantBgStyles[variant], styles[`size_${size}`]]}>
      <Text style={[styles.text, variantTextStyles[variant], styles[`textSize_${size}`]]}>
        {icon ? `${icon} ${label}` : label}
      </Text>
    </View>
  );
};

// ===== Allergen Badge =====
interface AllergenBadgeProps {
  label: string;
  size?: 'sm' | 'md';
}

export const AllergenBadge: React.FC<AllergenBadgeProps> = ({ label, size = 'sm' }) => (
  <Badge label={label} variant="warning" icon="⚠" size={size} />
);

// ===== Nutrient Badge =====
export const NutrientBadge: React.FC<{ label: string }> = ({ label }) => (
  <Badge label={label} variant="success" icon="↑" />
);

// ===== First Try Badge =====
export const FirstTryBadge: React.FC = () => (
  <Badge label="İlk Deneme" variant="warning" />
);

// ===== Liked Badge =====
export const LikedBadge: React.FC = () => (
  <Badge label="Sevdi ❤️" variant="info" />
);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  // Sizes
  size_sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  size_md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },

  // Text
  text: {
    fontFamily: FontFamily.semiBold,
  },
  textSize_sm: { fontSize: 9 },
  textSize_md: { fontSize: 11 },
});
