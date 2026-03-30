/**
 * Kasik — ScreenHeader
 * Reusable header component for all tab screens
 * Variants: default (compact), large (profile-style), gradient (hero)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, Shadow } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface HeaderAction {
  icon: IoniconsName;
  onPress: () => void;
  badge?: number;
  accessibilityLabel?: string;
}

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  leftIcon?: React.ReactNode;
  rightActions?: HeaderAction[];
  variant?: 'default' | 'large' | 'gradient';
}

export default function ScreenHeader({
  title,
  subtitle,
  emoji,
  leftIcon,
  rightActions,
  variant = 'default',
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const renderActions = (onGradient = false) =>
    rightActions?.map((action, i) => (
      <TouchableOpacity
        key={i}
        onPress={action.onPress}
        style={[
          styles.actionBtn,
          onGradient
            ? styles.actionBtnOnGradient
            : { backgroundColor: colors.cream },
        ]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={action.accessibilityLabel ?? action.icon}
      >
        <Ionicons
          name={action.icon}
          size={20}
          color={onGradient ? colors.white : colors.textMid}
        />
        {action.badge !== undefined && action.badge > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.heart, borderColor: onGradient ? 'transparent' : colors.white }]}>
            <Text style={[styles.badgeText, { color: colors.white }]}>
              {action.badge > 99 ? '99+' : action.badge}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    ));

  // Gradient variant
  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[colors.sage, colors.sageDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientContainer, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.defaultRow}>
          <View style={styles.leftSection}>
            {leftIcon}
            {emoji && <Text style={styles.defaultEmoji}>{emoji}</Text>}
            <Text style={[styles.defaultTitle, { color: colors.white }]} accessibilityRole="header">
              {title}
            </Text>
          </View>
          {rightActions && rightActions.length > 0 && (
            <View style={styles.actionsRow}>{renderActions(true)}</View>
          )}
        </View>
        {subtitle && (
          <Text style={[styles.defaultSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            {subtitle}
          </Text>
        )}
      </LinearGradient>
    );
  }

  // Large variant
  if (variant === 'large') {
    return (
      <View style={[styles.container, styles.largeContainer, { paddingTop: insets.top + 8, backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
        <View style={styles.largeContent}>
          {emoji && <Text style={styles.largeEmoji}>{emoji}</Text>}
          <View style={styles.largeTitleBlock}>
            <Text style={[styles.largeTitle, { color: colors.textDark }]} accessibilityRole="header">{title}</Text>
            {subtitle && <Text style={[styles.largeSubtitle, { color: colors.textMid }]}>{subtitle}</Text>}
          </View>
        </View>
        {rightActions && rightActions.length > 0 && (
          <View style={styles.actionsRow}>{renderActions()}</View>
        )}
      </View>
    );
  }

  // Default variant
  return (
    <View style={[styles.container, { paddingTop: insets.top + 4, backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
      <View style={styles.defaultRow}>
        <View style={styles.leftSection}>
          {leftIcon}
          {emoji && <Text style={styles.defaultEmoji}>{emoji}</Text>}
          <Text style={[styles.defaultTitle, { color: colors.textDark }]} accessibilityRole="header">{title}</Text>
        </View>
        {rightActions && rightActions.length > 0 && (
          <View style={styles.actionsRow}>{renderActions()}</View>
        )}
      </View>
      {subtitle && <Text style={[styles.defaultSubtitle, { color: colors.textMid }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  gradientContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    shadowColor: '#8FAA7B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  defaultEmoji: { fontSize: 24 },
  defaultTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
  },
  defaultSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    marginTop: 2,
  },

  largeContainer: { paddingBottom: Spacing.lg },
  largeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  largeEmoji: { fontSize: 36 },
  largeTitleBlock: { flex: 1 },
  largeTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xxxl,
    lineHeight: 36,
  },
  largeSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    marginTop: 2,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOnGradient: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    lineHeight: 12,
  },
});
