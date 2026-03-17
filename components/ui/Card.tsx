/**
 * Kaşık — Card Component
 * Rounded cards with soft shadows
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { BorderRadius, Shadow, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'warning' | 'success' | 'elevated';
  padding?: keyof typeof Spacing;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  padding = 'lg',
  style,
}) => {
  const colors = useColors();

  const variantColorStyles: Record<string, ViewStyle> = {
    warning: { borderWidth: 1.5, borderColor: colors.warning },
    success: { borderWidth: 1.5, borderColor: colors.sage },
  };

  const cardStyle = [
    styles.base,
    { padding: Spacing[padding], backgroundColor: colors.white },
    variant === 'warning' && variantColorStyles.warning,
    variant === 'success' && variantColorStyles.success,
    variant === 'elevated' && styles.elevated,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    ...Shadow.card,
  },
  elevated: {
    ...Shadow.elevated,
  },
});
