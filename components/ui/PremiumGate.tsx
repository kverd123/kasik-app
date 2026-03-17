/**
 * Kaşık — PremiumGate Component
 * Wraps content that may be gated behind premium subscription.
 *
 * USAGE:
 * ------
 * Phase 1 (now): Only 'ad_free' is gated. Other features are free.
 * Phase 2 (later): Set feature.active = true in subscriptionStore to gate it.
 *
 * Example - Gate a feature:
 * ```tsx
 * <PremiumGate feature="unlimited_ai_recipes">
 *   <AIRecipeGenerator />
 * </PremiumGate>
 * ```
 *
 * Example - Check in code:
 * ```tsx
 * const { canAccess } = useSubscriptionStore();
 * if (canAccess('export_pdf')) { ... }
 * ```
 *
 * TO ACTIVATE A NEW PREMIUM FEATURE:
 * 1. Go to stores/subscriptionStore.ts
 * 2. Find PREMIUM_FEATURES
 * 3. Change the feature's `active: false` → `active: true`
 * 4. That's it! All PremiumGate wrappers and canAccess checks auto-update.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import {
  useSubscriptionStore,
  PremiumFeature,
} from '../../stores/subscriptionStore';

interface PremiumGateProps {
  /** Which premium feature this gate protects */
  feature: PremiumFeature;
  /** Content to show when user has access */
  children: React.ReactNode;
  /** Optional: Custom locked state UI. If not provided, default lock screen is shown */
  lockedComponent?: React.ReactNode;
  /** Optional: Callback when "Upgrade" is pressed */
  onUpgradePress?: () => void;
  /** Optional: Show a subtle lock icon instead of full lock screen */
  mode?: 'block' | 'badge' | 'inline';
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  feature,
  children,
  lockedComponent,
  onUpgradePress,
  mode = 'block',
}) => {
  const colors = useColors();
  const { canAccess, getAllFeatures } = useSubscriptionStore();

  // If user can access (premium OR feature not yet gated), show children
  if (canAccess(feature)) {
    return <>{children}</>;
  }

  // Feature is gated and user is not premium → show lock
  const featureConfig = getAllFeatures()[feature];

  // Custom locked component
  if (lockedComponent) {
    return <>{lockedComponent}</>;
  }

  // Badge mode: show content with a small premium badge overlay
  if (mode === 'badge') {
    return (
      <TouchableOpacity
        onPress={onUpgradePress}
        activeOpacity={0.8}
        style={styles.badgeContainer}
      >
        {children}
        <View style={styles.badgeOverlay}>
          <View style={[styles.badge, { backgroundColor: colors.sage }]}>
            <Text style={[styles.badgeText, { color: colors.white }]}>✨ Premium</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Inline mode: compact lock message
  if (mode === 'inline') {
    return (
      <TouchableOpacity
        onPress={onUpgradePress}
        style={[styles.inlineContainer, { backgroundColor: colors.creamMid }]}
        activeOpacity={0.7}
      >
        <Text style={styles.inlineLock}>🔒</Text>
        <View style={styles.inlineContent}>
          <Text style={[styles.inlineTitle, { color: colors.textDark }]}>{featureConfig.label}</Text>
          <Text style={[styles.inlineDesc, { color: colors.textLight }]}>Premium ile açılır</Text>
        </View>
        <Text style={[styles.inlineArrow, { color: colors.sage }]}>→</Text>
      </TouchableOpacity>
    );
  }

  // Block mode (default): full lock screen
  return (
    <View style={[styles.lockContainer, { backgroundColor: colors.cream, borderColor: colors.creamDark }]}>
      <View style={styles.lockContent}>
        <Text style={styles.lockEmoji}>{featureConfig.icon}</Text>
        <Text style={[styles.lockTitle, { color: colors.textDark }]}>{featureConfig.label}</Text>
        <Text style={[styles.lockDescription, { color: colors.textLight }]}>{featureConfig.description}</Text>

        <TouchableOpacity
          style={[styles.upgradeButton, { backgroundColor: colors.sage }]}
          onPress={onUpgradePress}
          activeOpacity={0.7}
        >
          <Text style={[styles.upgradeButtonText, { color: colors.white }]}>
            ✨ Premium'a Geç
          </Text>
        </TouchableOpacity>

        <Text style={[styles.lockSubtext, { color: colors.textLight }]}>
          Aylık ₺79.99'dan başlayan fiyatlarla
        </Text>
      </View>
    </View>
  );
};

/**
 * Hook for checking premium access in code (not JSX)
 *
 * Usage:
 * const isPremiumFeature = usePremiumCheck('export_pdf');
 * if (!isPremiumFeature) showUpgradePrompt();
 */
export const usePremiumCheck = (feature: PremiumFeature): boolean => {
  const { canAccess } = useSubscriptionStore();
  return canAccess(feature);
};

const styles = StyleSheet.create({
  // Block mode
  lockContainer: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    margin: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  lockContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  lockEmoji: {
    fontSize: 48,
  },
  lockTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    textAlign: 'center',
  },
  lockDescription: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  upgradeButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  upgradeButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  lockSubtext: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },

  // Badge mode
  badgeContainer: {
    position: 'relative',
  },
  badgeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    ...Shadow.soft,
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },

  // Inline mode
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  inlineLock: {
    fontSize: 20,
  },
  inlineContent: {
    flex: 1,
  },
  inlineTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  inlineDesc: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  inlineArrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
});
