/**
 * Kaşık — Button Component
 * Primary, secondary, outline, ghost, gradient, danger variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, BorderRadius, Spacing } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const colors = useColors();
  const isDisabled = disabled || loading;

  const sizeStyle: ViewStyle =
    size === 'sm'
      ? { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, height: 36 }
      : size === 'lg'
      ? { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl, height: 56 }
      : { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, height: 48 };

  const textSizeStyle: TextStyle =
    size === 'sm'
      ? { fontSize: FontSize.md }
      : size === 'lg'
      ? { fontSize: FontSize.lg }
      : { fontSize: FontSize.base };

  const textColor =
    variant === 'primary' || variant === 'gradient' || variant === 'danger'
      ? colors.white
      : variant === 'secondary'
      ? colors.sageDark
      : colors.sage;

  const innerContent = loading ? (
    <ActivityIndicator
      color={['primary', 'gradient', 'danger'].includes(variant) ? colors.white : colors.sage}
      size="small"
    />
  ) : (
    <>
      {icon && <>{icon}</>}
      <Text style={[styles.text, textSizeStyle, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </>
  );

  // Gradient variant
  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: isDisabled }}
        style={[
          styles.gradientWrapper,
          sizeStyle,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.sage, colors.sageDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: BorderRadius.lg }]}
        />
        <View style={styles.innerRow}>{innerContent}</View>
      </TouchableOpacity>
    );
  }

  // Danger variant
  if (variant === 'danger') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: isDisabled }}
        style={[
          styles.base,
          {
            backgroundColor: colors.danger || '#E74C3C',
            borderRadius: BorderRadius.lg,
            shadowColor: colors.danger || '#E74C3C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 5,
          },
          sizeStyle,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {innerContent}
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: colors.sage,
      borderRadius: BorderRadius.lg,
      shadowColor: colors.sageDark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    secondary: { backgroundColor: colors.sagePale, borderRadius: BorderRadius.lg },
    outline: {
      backgroundColor: 'transparent',
      borderRadius: BorderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.sage,
    },
    ghost: { backgroundColor: 'transparent', borderRadius: BorderRadius.lg },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyle,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {innerContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  gradientWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#8FAA7B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: FontFamily.bold,
  },
});
