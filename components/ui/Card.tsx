/**
 * Kaşık — Card Component
 * Rounded cards with spring press animation and variant shadows
 */

import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { BorderRadius, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'warning' | 'success' | 'elevated' | 'flat';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.975,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const variantStyle: ViewStyle = (() => {
    switch (variant) {
      case 'warning':
        return {
          borderWidth: 1.5,
          borderColor: colors.warning,
          shadowColor: colors.warning,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.18,
          shadowRadius: 10,
          elevation: 4,
        };
      case 'success':
        return {
          borderWidth: 1.5,
          borderColor: colors.sage,
          shadowColor: colors.sage,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.18,
          shadowRadius: 10,
          elevation: 4,
        };
      case 'elevated':
        return {
          shadowColor: colors.sageDark,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 18,
          elevation: 8,
        };
      case 'flat':
        return {
          borderWidth: 1,
          borderColor: colors.creamDark,
          shadowOpacity: 0,
          elevation: 0,
        };
      default:
        return {
          shadowColor: colors.sage,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 3,
        };
    }
  })();

  const cardStyle: ViewStyle = {
    borderRadius: BorderRadius.xl,
    padding: Spacing[padding],
    backgroundColor: colors.white,
    ...variantStyle,
  };

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          accessibilityRole="button"
          style={[cardStyle, style]}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
