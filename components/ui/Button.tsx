/**
 * Kaşık — Button Component
 * Primary, secondary, outline, ghost variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, BorderRadius, Spacing } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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

  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: colors.sage, borderRadius: BorderRadius.lg },
    secondary: { backgroundColor: colors.sagePale, borderRadius: BorderRadius.lg },
    outline: {
      backgroundColor: 'transparent',
      borderRadius: BorderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.sage,
    },
    ghost: { backgroundColor: 'transparent', borderRadius: BorderRadius.lg },
  };

  const textColorStyles: Record<string, TextStyle> = {
    primary: { color: colors.white },
    secondary: { color: colors.sageDark },
    outline: { color: colors.sage },
    ghost: { color: colors.sage },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.base,
        variantStyles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.sage}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              textColorStyles[variant],
              styles[`textSize_${size}`],
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
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
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Sizes
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    height: 36,
  },
  size_md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    height: 48,
  },
  size_lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    height: 56,
  },

  // Text
  text: {
    fontFamily: FontFamily.bold,
  },

  // Text sizes
  textSize_sm: {
    fontSize: FontSize.md,
  },
  textSize_md: {
    fontSize: FontSize.base,
  },
  textSize_lg: {
    fontSize: FontSize.lg,
  },
});
