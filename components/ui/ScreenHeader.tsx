/**
 * Kasik — ScreenHeader
 * Reusable header component for all tab screens
 * Variants: default (compact) and large (profile-style)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, Shadow } from '../../constants/theme';

interface HeaderAction {
  icon: string;
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
  variant?: 'default' | 'large';
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
          <View style={styles.actionsRow}>
            {rightActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                onPress={action.onPress}
                style={[styles.actionBtn, { backgroundColor: colors.cream }]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={action.accessibilityLabel || action.icon}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                {action.badge !== undefined && action.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.heart, borderColor: colors.white }]}>
                    <Text style={[styles.badgeText, { color: colors.white }]}>{action.badge > 99 ? '99+' : action.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  // Default variant
  return (
    <View style={[styles.container, { paddingTop: insets.top + 4, backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
      <View style={styles.defaultRow}>
        {/* Left section */}
        <View style={styles.leftSection}>
          {leftIcon}
          {emoji && <Text style={styles.defaultEmoji}>{emoji}</Text>}
          <Text style={[styles.defaultTitle, { color: colors.textDark }]} accessibilityRole="header">{title}</Text>
        </View>

        {/* Right actions */}
        {rightActions && rightActions.length > 0 && (
          <View style={styles.actionsRow}>
            {rightActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                onPress={action.onPress}
                style={[styles.actionBtn, { backgroundColor: colors.cream }]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={action.accessibilityLabel || action.icon}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                {action.badge !== undefined && action.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.heart, borderColor: colors.white }]}>
                    <Text style={[styles.badgeText, { color: colors.white }]}>
                      {action.badge > 99 ? '99+' : action.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
    ...Shadow.soft,
  },

  // -- Default variant --
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
  defaultEmoji: {
    fontSize: 24,
  },
  defaultTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
  },
  defaultSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    marginTop: 2,
  },

  // -- Large variant --
  largeContainer: {
    paddingBottom: Spacing.lg,
  },
  largeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  largeEmoji: {
    fontSize: 36,
  },
  largeTitleBlock: {
    flex: 1,
  },
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

  // -- Actions --
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
  actionIcon: {
    fontSize: 18,
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
